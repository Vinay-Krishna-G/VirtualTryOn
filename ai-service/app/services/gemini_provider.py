"""
app/services/gemini_provider.py

Google Gemini Image Generation integration.

Responsibility:
    - Initialise the Gemini client once (module-level singleton).
    - Accept person image bytes + garment image bytes + category string.
    - Build the multipart content (text prompt + two inline images).
    - Call the Gemini API and extract the generated PNG.
    - Return raw PNG bytes to the caller (route handler).

All Gemini logic lives HERE. Routes stay clean.

API used:
    google-genai SDK (google.genai)
    Model: gemini-2.0-flash-preview-image-generation
          ↑ This is the model that supports image output (response_modalities=["IMAGE"])

How Gemini image generation works:
    We send a multi-part request containing:
      Part 1 — text: the detailed try-on prompt
      Part 2 — inline image: the person's photo
      Part 3 — inline image: the reference garment photo

    Gemini returns a response with parts. We look for the part whose
    mime_type starts with "image/" and extract its inline_data.data.

Error handling:
    All Gemini-specific exceptions are caught here and re-raised as
    Python built-in exceptions so the route can map them to HTTP codes
    without importing any Gemini types.
"""

import io
import logging
import time
from typing import Optional

from google import genai
from google.genai import types as genai_types
from PIL import Image, ImageDraw

from app.config import settings
from app.services.prompt_builder import build_prompt, detect_category_from_product_id

logger = logging.getLogger(__name__)

# ── Gemini client singleton ───────────────────────────────────────────────────
# Initialised once when this module is first imported.
# The client holds the API key and manages HTTP sessions.
_client: Optional[genai.Client] = None


def _get_client() -> genai.Client:
    """Return the shared Gemini client, creating it on first call."""
    global _client
    if _client is None:
        if not settings.GEMINI_API_KEY:
            raise RuntimeError(
                "GEMINI_API_KEY is not set. "
                "Add it to your .env file and restart the service."
            )
        _client = genai.Client(api_key=settings.GEMINI_API_KEY)
        logger.info("Gemini client initialised (model=%s)", settings.GEMINI_MODEL)
    return _client


# ── Public API ────────────────────────────────────────────────────────────────

async def generate_tryon(
    person_bytes: bytes,
    garment_bytes: bytes,
    category: str,
    product_id: str = "",
) -> bytes:
    """
    Generate a virtual try-on image using the Gemini API.

    Args:
        person_bytes:  Raw bytes of the person's photo (JPEG or PNG).
        garment_bytes: Raw bytes of the reference garment image (JPEG or PNG).
        category:      Garment category string (e.g. "saree", "shirt").
                       Used to select the correct prompt template.
        product_id:    Optional productId string (e.g. "red-silk-saree").
                       Used to infer category if `category` is empty.

    Returns:
        Raw PNG bytes of the generated try-on image.

    Raises:
        ValueError:       If the API key is missing or the inputs are invalid.
        TimeoutError:     If Gemini takes longer than GEMINI_TIMEOUT seconds.
        PermissionError:  If the API key is invalid or quota is exceeded.
        RuntimeError:     For any other Gemini or generation failure.
    """
    start_time = time.monotonic()

    # ── Resolve category ──────────────────────────────────────────────────────
    effective_category = category.strip() if category.strip() else (
        detect_category_from_product_id(product_id) if product_id else "saree"
    )

    # ── Mock mode ─────────────────────────────────────────────────────────────
    # If MOCK_AI=true, return a synthetic test image instantly.
    # No Gemini call is made. Zero credits used.
    if settings.MOCK_AI:
        logger.info(
            "[MOCK] MOCK_AI=true — skipping Gemini, returning test image | category=%s",
            effective_category,
        )
        mock_bytes = _generate_mock_image(person_bytes, garment_bytes, effective_category)
        logger.info("[MOCK] Mock image generated (%dB) in %.3fs", len(mock_bytes), time.monotonic() - start_time)
        return mock_bytes

    # ── Build prompt ──────────────────────────────────────────────────────────
    prompt_text = build_prompt(effective_category)

    logger.info(
        "Gemini request | model=%s category=%s person_size=%dB garment_size=%dB",
        settings.GEMINI_MODEL,
        effective_category,
        len(person_bytes),
        len(garment_bytes),
    )

    # ── Detect MIME types ─────────────────────────────────────────────────────
    person_mime = _detect_mime(person_bytes)
    garment_mime = _detect_mime(garment_bytes)

    # ── Build Gemini content parts ────────────────────────────────────────────
    # We send three parts in a single user turn:
    #   1. The instruction prompt (text)
    #   2. The person photo (inline image)
    #   3. The reference garment photo (inline image)
    contents = [
        genai_types.Content(
            role="user",
            parts=[
                genai_types.Part(text=prompt_text),
                genai_types.Part(
                    inline_data=genai_types.Blob(
                        mime_type=person_mime,
                        data=person_bytes,
                    )
                ),
                genai_types.Part(
                    inline_data=genai_types.Blob(
                        mime_type=garment_mime,
                        data=garment_bytes,
                    )
                ),
            ],
        )
    ]

    # ── Call Gemini ───────────────────────────────────────────────────────────
    try:
        client = _get_client()

        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=contents,
            config=genai_types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"],
                # Safety settings — keep defaults; we're sending clothing images
            ),
        )

    except Exception as exc:
        elapsed = time.monotonic() - start_time
        _handle_gemini_exception(exc, elapsed)
        raise  # unreachable but satisfies type checker

    elapsed = time.monotonic() - start_time
    logger.info("Gemini response received in %.2fs", elapsed)

    # ── Extract generated image ───────────────────────────────────────────────
    png_bytes = _extract_image_from_response(response)

    total_elapsed = time.monotonic() - start_time
    logger.info(
        "Gemini generation complete | category=%s time=%.2fs output_size=%dB",
        effective_category,
        total_elapsed,
        len(png_bytes),
    )

    return png_bytes


# ── Private helpers ───────────────────────────────────────────────────────────

def _detect_mime(image_bytes: bytes) -> str:
    """
    Detect the MIME type of an image from its magic bytes.

    Supports JPEG, PNG, WEBP, GIF. Defaults to image/jpeg.
    """
    if image_bytes[:4] == b"\x89PNG":
        return "image/png"
    if image_bytes[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if image_bytes[:4] in (b"RIFF",) and image_bytes[8:12] == b"WEBP":
        return "image/webp"
    if image_bytes[:6] in (b"GIF87a", b"GIF89a"):
        return "image/gif"
    # Fallback — Gemini accepts JPEG
    return "image/jpeg"


def _extract_image_from_response(response) -> bytes:
    """
    Walk response.candidates[0].content.parts and return the image bytes.

    Raises:
        RuntimeError: If no image part is found in the response.
    """
    try:
        candidates = response.candidates
        if not candidates:
            raise RuntimeError("Gemini returned no candidates in the response.")

        for part in candidates[0].content.parts:
            # Image parts have inline_data with a mime_type starting "image/"
            if (
                hasattr(part, "inline_data")
                and part.inline_data is not None
                and part.inline_data.mime_type.startswith("image/")
            ):
                raw = part.inline_data.data
                # The SDK may return bytes or a base64 string
                if isinstance(raw, (bytes, bytearray)):
                    return bytes(raw)
                # Decode base64 if needed
                import base64
                return base64.b64decode(raw)

        # Log the text parts to help with debugging
        text_parts = [
            p.text for p in candidates[0].content.parts
            if hasattr(p, "text") and p.text
        ]
        logger.error(
            "Gemini returned no image part. Text parts: %s",
            text_parts[:3],  # limit log size
        )
        raise RuntimeError(
            "Gemini did not return an image. "
            "This can happen if the prompt was flagged by safety filters "
            "or if the model output only text. "
            f"Model text response: {' '.join(text_parts)[:300]}"
        )

    except RuntimeError:
        raise
    except Exception as exc:
        raise RuntimeError(f"Failed to parse Gemini response: {exc}") from exc


def _handle_gemini_exception(exc: Exception, elapsed: float) -> None:
    """
    Map Gemini SDK exceptions to clean Python built-ins.

    The route layer catches these and converts them to HTTP status codes.
    We never expose raw Gemini error messages to the frontend.
    """
    exc_str = str(exc).lower()
    exc_type = type(exc).__name__

    logger.error(
        "Gemini API error after %.2fs | type=%s msg=%s",
        elapsed,
        exc_type,
        str(exc)[:300],
    )

    # Quota / rate limit
    if "quota" in exc_str or "resource_exhausted" in exc_str or "429" in exc_str:
        raise PermissionError(
            "Gemini API quota exceeded. Please wait a moment and try again."
        ) from exc

    # Invalid / missing API key
    if (
        "api_key" in exc_str
        or "invalid_argument" in exc_str
        or "unauthenticated" in exc_str
        or "401" in exc_str
        or "403" in exc_str
    ):
        raise ValueError(
            "Invalid or missing Gemini API key. Check your .env file."
        ) from exc

    # Timeout
    if "timeout" in exc_str or "deadline" in exc_str:
        raise TimeoutError(
            f"Gemini API timed out after {elapsed:.1f}s. "
            "Try again or reduce image size."
        ) from exc

    # Generic fallback
    raise RuntimeError(
        "Gemini image generation failed. Please try again."
    ) from exc


def _generate_mock_image(person_bytes: bytes, garment_bytes: bytes, category: str) -> bytes:
    """
    Generate a fake try-on result for pipeline testing.

    Builds a side-by-side composite of the two uploaded images with a
    clear "MOCK MODE" banner so it's obvious no real AI was used.
    Zero Gemini API calls. Zero credits consumed.
    """
    # Load both images
    person_img = Image.open(io.BytesIO(person_bytes)).convert("RGB")
    garment_img = Image.open(io.BytesIO(garment_bytes)).convert("RGB")

    # Resize to same height
    target_h, target_w = 480, 360
    person_img = person_img.resize((target_w, target_h), Image.LANCZOS)
    garment_img = garment_img.resize((target_w, target_h), Image.LANCZOS)

    # Create canvas: two images side by side with header
    header_h = 60
    gap = 20
    canvas_w = target_w * 2 + gap * 3
    canvas_h = target_h + header_h + gap
    canvas = Image.new("RGB", (canvas_w, canvas_h), (15, 15, 26))

    # Paste images
    canvas.paste(person_img, (gap, header_h))
    canvas.paste(garment_img, (target_w + gap * 2, header_h))

    # Draw text overlay
    draw = ImageDraw.Draw(canvas)

    # Header banner
    draw.rectangle([(0, 0), (canvas_w, header_h - 4)], fill=(30, 20, 60))
    draw.text(
        (canvas_w // 2, header_h // 2),
        f"MOCK MODE — Pipeline Test — Category: {category.upper()}",
        fill=(167, 139, 250),
        anchor="mm",
    )

    # Labels below images
    label_y = header_h + target_h + 6
    draw.text((gap + target_w // 2, label_y), "Your Photo", fill=(160, 160, 180), anchor="mt")
    draw.text((target_w + gap * 2 + target_w // 2, label_y), "Garment Ref", fill=(160, 160, 180), anchor="mt")

    # "No Credits Used" badge
    draw.text(
        (canvas_w // 2, header_h + target_h // 2),
        "✔ No API Credits Used",
        fill=(74, 222, 128),  # green
        anchor="mm",
    )

    buf = io.BytesIO()
    canvas.save(buf, format="PNG", optimize=True)
    return buf.getvalue()
