"""
app/services/idmvton_provider.py

IDM-VTON (Improving Diffusion Models for Authentic Virtual Try-on) integration.

Uses the free HuggingFace Space hosted at:
    https://huggingface.co/spaces/yisol/IDM-VTON

Accessed via the gradio_client Python library — no API key required.

How it works:
    1. Save person + garment bytes to temp files
    2. Call the /tryon endpoint on the IDM-VTON Space
    3. Read the returned output image file
    4. Clean up temp files
    5. Return PNG bytes

Inputs to IDM-VTON:
    - dict:         {"background": person_image_path, "layers": [], "composite": None}
    - garm_img:     garment_image_path
    - garment_des:  text description of garment (built from category)
    - is_checked:   True  (auto-generate mask — no manual masking needed)
    - is_checked_crop: False
    - denoise_steps: 30
    - seed:         42

Output:
    result[0] — path to the generated try-on image
    result[1] — path to the auto-generated mask (we discard this)

Queue:
    The free Space has a queue. The gradio_client blocks until the job is done.
    Typical wait: 30 seconds to 5 minutes depending on Space load.
"""

import logging
import tempfile
import time
import uuid
from pathlib import Path

from gradio_client import Client, handle_file

from app.config import settings

logger = logging.getLogger(__name__)

# The HuggingFace Space identifier
IDMVTON_SPACE = "yisol/IDM-VTON"

# Garment category → short description for IDM-VTON's garment_des field
_CATEGORY_DESCRIPTIONS: dict[str, str] = {
    "saree":    "Traditional Indian saree with border and pallu",
    "lehenga":  "Indian bridal lehenga skirt with embroidery",
    "kurti":    "Indian kurti top with printed design",
    "anarkali": "Floor-length Anarkali suit with embroidery",
    "shirt":    "Formal button-down Oxford shirt",
    "tshirt":   "Casual round neck t-shirt",
    "blazer":   "Slim fit formal blazer jacket",
    "jeans":    "Slim fit denim jeans",
    "dress":    "Elegant dress with floral pattern",
}


def _garment_description(category: str) -> str:
    """Return a short garment description for the given category."""
    return _CATEGORY_DESCRIPTIONS.get(category.lower(), f"{category} garment")


async def generate_tryon_idmvton(
    person_bytes: bytes,
    garment_bytes: bytes,
    category: str,
) -> bytes:
    """
    Generate a virtual try-on image using IDM-VTON on HuggingFace Spaces.

    Args:
        person_bytes:  Raw bytes of the person's photo.
        garment_bytes: Raw bytes of the garment reference image.
        category:      Garment category string (e.g. "saree", "shirt").

    Returns:
        Raw PNG bytes of the generated try-on image.

    Raises:
        RuntimeError: If the Space call fails or returns no image.
        TimeoutError: If the Space queue takes too long.
    """
    start = time.monotonic()

    garment_des = _garment_description(category)
    logger.info(
        "IDM-VTON request | category=%s garment_des='%s' person_size=%dB garment_size=%dB",
        category, garment_des, len(person_bytes), len(garment_bytes),
    )

    # ── Write images to temp files (gradio_client needs file paths) ────────────
    tmp_dir = Path(tempfile.gettempdir())
    person_ext = _detect_ext(person_bytes)
    garment_ext = _detect_ext(garment_bytes)

    person_tmp = tmp_dir / f"person_{uuid.uuid4().hex}.{person_ext}"
    garment_tmp = tmp_dir / f"garment_{uuid.uuid4().hex}.{garment_ext}"

    try:
        person_tmp.write_bytes(person_bytes)
        garment_tmp.write_bytes(garment_bytes)

        # ── Call IDM-VTON Space ────────────────────────────────────────────────
        try:
            client = Client(IDMVTON_SPACE)

            logger.info("IDM-VTON: connected to Space, submitting job (queue may take 1–5 min)...")

            result = client.predict(
                dict={
                    "background": handle_file(str(person_tmp)),
                    "layers": [],
                    "composite": None,
                },
                garm_img=handle_file(str(garment_tmp)),
                garment_des=garment_des,
                is_checked=True,        # auto-generate mask
                is_checked_crop=False,  # do not auto-crop
                denoise_steps=30,       # quality vs speed balance
                seed=42,
                api_name="/tryon",
            )

        except Exception as exc:
            elapsed = time.monotonic() - start
            logger.error("IDM-VTON Space call failed after %.1fs: %s", elapsed, exc)
            _handle_exception(exc, elapsed)
            raise  # unreachable

        elapsed = time.monotonic() - start
        logger.info("IDM-VTON: job completed in %.1fs", elapsed)

        # ── Read the result image ──────────────────────────────────────────────
        # result is a tuple: (output_image_path, mask_image_path)
        if not result or not result[0]:
            raise RuntimeError("IDM-VTON returned no output image.")

        output_path = Path(result[0])
        if not output_path.exists():
            raise RuntimeError(f"IDM-VTON output file not found: {output_path}")

        output_bytes = output_path.read_bytes()
        logger.info(
            "IDM-VTON SUCCESS | time=%.1fs output_size=%dB path=%s",
            elapsed, len(output_bytes), output_path.name,
        )
        return output_bytes

    finally:
        # Clean up temp input files
        for tmp in (person_tmp, garment_tmp):
            try:
                if tmp.exists():
                    tmp.unlink()
            except OSError:
                pass


def _detect_ext(image_bytes: bytes) -> str:
    """Detect file extension from magic bytes."""
    if image_bytes[:4] == b"\x89PNG":
        return "png"
    if image_bytes[:3] == b"\xff\xd8\xff":
        return "jpg"
    return "jpg"


def _handle_exception(exc: Exception, elapsed: float) -> None:
    """Map gradio_client / network exceptions to clean Python built-ins."""
    msg = str(exc).lower()
    if "timeout" in msg or "deadline" in msg:
        raise TimeoutError(
            f"IDM-VTON Space timed out after {elapsed:.0f}s. "
            "The free Space may be overloaded. Try again later."
        ) from exc
    if "queue" in msg or "too many" in msg:
        raise PermissionError(
            "IDM-VTON Space queue is full. Please try again in a few minutes."
        ) from exc
    raise RuntimeError(
        "IDM-VTON image generation failed. Please try again."
    ) from exc
