"""
app/routes/tryon.py

Virtual Try-On route handlers.

Endpoints:
    POST /generate
        — Backward-compatible endpoint that Node.js calls.
        — Accepts: person_image (file) + garment_image (file) + optional product_id (form)
        — Returns: raw image/png bytes (binary stream).

    POST /api/try-on
        — New JSON endpoint per the API specification.
        — Accepts: person_image (file) + garment_image (file) + optional product_category (form)
        — Returns: { success, imageUrl, generationTime }

Logging:
    Every request is assigned a request_id and we log:
        request_id, generation_time, category, success/failure reason

Error philosophy:
    We NEVER expose raw Gemini error messages to the frontend.
    All errors return a friendly message plus an HTTP status that
    gives the caller enough information to act.
"""

import logging
import time
import uuid
import httpx
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse, Response

from app.config import settings
from app.services.gemini_provider import generate_tryon as gemini_generate
from app.services.idmvton_provider import generate_tryon_idmvton
from app.services.fashn_provider import generate_tryon_fashn
from app.services.openai_provider import generate_tryon_openai
from app.services.image_storage import get_image_url, save_temp_image
from app.services.prompt_builder import detect_category_from_product_id

logger = logging.getLogger(__name__)

router = APIRouter()


# ── POST /generate ─────────────────────────────────────────────────────────────
# This is the EXISTING contract that Node.js uses.
# Node calls this endpoint and expects raw PNG bytes back.
# The endpoint signature is preserved exactly — only the implementation changes.
@router.post("/generate")
async def generate_endpoint(
    request: Request,
    person_image: UploadFile = File(..., description="Full-body photo of the person"),
    garment_image: UploadFile = File(..., description="Photo of the garment to try on"),
    product_id: Optional[str] = Form(None, description="Product ID (used to infer category)"),
):
    """
    POST /generate

    Backward-compatible endpoint.  Node.js calls this.

    Input (multipart/form-data):
        person_image   — the person's uploaded photo
        garment_image  — the selected garment photo
        product_id     — (optional) e.g. "red-silk-saree" — used to infer category

    Output:
        image/png binary stream — the generated try-on image

    Error responses:
        400 — invalid or missing files
        422 — unsupported image format
        429 — Gemini quota exceeded
        500 — generation failed
        504 — Gemini timeout
    """
    request_id = uuid.uuid4().hex[:8]
    start = time.monotonic()

    # Infer product_id from garment filename if missing
    if not product_id and garment_image and garment_image.filename:
        product_id = garment_image.filename.rsplit(".", 1)[0]

    # Infer category from productId if provided
    category = detect_category_from_product_id(product_id) if product_id else "saree"
    
    # Fetch metadata from Node.js catalog
    metadata = await _fetch_product_metadata(product_id)

    logger.info(
        "[%s] /generate | category=%s product=%s person=%s garment=%s",
        request_id, category, product_id,
        person_image.filename, garment_image.filename,
    )

    # ── Read uploaded files ────────────────────────────────────────────────────
    person_bytes, garment_bytes = await _read_uploads(
        request_id, person_image, garment_image
    )

    # ── Call AI Provider ────────────────────────────────────────────────────────
    result_bytes = await _run_ai(
        request_id, person_bytes, garment_bytes, category, product_id or "", metadata=metadata
    )

    elapsed = time.monotonic() - start
    logger.info("[%s] /generate SUCCESS | time=%.2fs size=%dB", request_id, elapsed, len(result_bytes))

    # Return raw PNG — Node.js reads this as arraybuffer and forwards to React
    return Response(content=result_bytes, media_type="image/png")


# ── POST /api/try-on ───────────────────────────────────────────────────────────
# New JSON endpoint per the API specification.
@router.post("/api/try-on")
async def tryon_json_endpoint(
    request: Request,
    person_image: UploadFile = File(..., description="Full-body photo of the person"),
    garment_image: UploadFile = File(..., description="Photo of the garment to try on"),
    product_category: Optional[str] = Form(None, description="Garment category (saree, shirt, etc.)"),
    product_id: Optional[str] = Form(None, description="Product ID (used to infer category if product_category is empty)"),
):
    """
    POST /api/try-on

    New JSON API per spec.

    Input (multipart/form-data):
        person_image      — the person's uploaded photo
        garment_image     — the selected garment photo
        product_category  — (optional) garment category string
        product_id        — (optional) product ID (fallback for category detection)

    Output (JSON):
        { "success": true, "imageUrl": "...", "generationTime": 6.8 }

    Error output (JSON):
        { "success": false, "message": "Unable to generate image." }
    """
    request_id = uuid.uuid4().hex[:8]
    start = time.monotonic()

    if not product_id and garment_image and garment_image.filename:
        product_id = garment_image.filename.rsplit(".", 1)[0]

    category = (
        product_category.strip()
        if product_category and product_category.strip()
        else (detect_category_from_product_id(product_id) if product_id else "saree")
    )
    
    metadata = await _fetch_product_metadata(product_id)

    logger.info(
        "[%s] /api/try-on | category=%s product=%s person=%s garment=%s",
        request_id, category, product_id,
        person_image.filename, garment_image.filename,
    )

    # ── Read uploaded files ────────────────────────────────────────────────────
    try:
        person_bytes, garment_bytes = await _read_uploads(
            request_id, person_image, garment_image
        )
    except HTTPException as exc:
        elapsed = time.monotonic() - start
        logger.warning("[%s] /api/try-on FAILED at read | reason=%s time=%.2fs", request_id, exc.detail, elapsed)
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "message": "Unable to process uploaded images."},
        )

    # ── Call AI Provider ────────────────────────────────────────────────────────
    try:
        result_bytes = await _run_ai(
            request_id, person_bytes, garment_bytes, category, product_id or "", metadata=metadata
        )
    except HTTPException as exc:
        elapsed = time.monotonic() - start
        logger.error("[%s] /api/try-on FAILED at generation | reason=%s time=%.2fs", request_id, exc.detail, elapsed)
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "message": "Unable to generate image."},
        )

    base_url = str(request.base_url).rstrip("/")
    output_path = save_temp_image(result_bytes, folder=settings.OUTPUT_FOLDER, extension="png")
    image_url = get_image_url(output_path, base_url)

    elapsed = time.monotonic() - start
    logger.info(
        "[%s] /api/try-on SUCCESS | time=%.2fs size=%dB url=%s",
        request_id, elapsed, len(result_bytes), image_url,
    )

    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "imageUrl": image_url,
            "generationTime": round(elapsed, 2),
        },
    )


# ── Shared helpers ─────────────────────────────────────────────────────────────

async def _fetch_product_metadata(product_id: Optional[str]) -> dict:
    """Fetch product metadata from the Node.js API to use as Ground Truth for Prompt Builder."""
    if not product_id:
        return {}
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get("http://127.0.0.1:3001/api/products")
            if resp.status_code == 200:
                data = resp.json()
                for p in data.get("products", []):
                    if p.get("id") == product_id:
                        return p
    except Exception as exc:
        logger.warning("Failed to fetch product metadata for %s: %s", product_id, exc)
    return {}

async def _read_uploads(
    request_id: str,
    person_image: UploadFile,
    garment_image: UploadFile,
) -> tuple[bytes, bytes]:
    """
    Read both uploaded files into memory.

    Validates:
        - Both files are present and non-empty.
        - MIME types are image/*.
        - File sizes are within MAX_FILE_SIZE.

    Returns:
        (person_bytes, garment_bytes)

    Raises:
        HTTPException 400: Missing or invalid files.
        HTTPException 413: File too large.
        HTTPException 422: Unsupported file format.
    """
    try:
        person_bytes = await person_image.read()
        garment_bytes = await garment_image.read()
    except Exception as exc:
        logger.error("[%s] Failed to read upload streams: %s", request_id, exc)
        raise HTTPException(status_code=400, detail="Failed to read uploaded files.")

    # Validate presence
    if not person_bytes:
        raise HTTPException(status_code=400, detail="Person image is empty or missing.")
    if not garment_bytes:
        raise HTTPException(status_code=400, detail="Garment image is empty or missing.")

    # Validate size
    max_size = settings.MAX_FILE_SIZE
    if len(person_bytes) > max_size:
        raise HTTPException(
            status_code=413,
            detail=f"Person image exceeds maximum size of {max_size // (1024*1024)}MB.",
        )
    if len(garment_bytes) > max_size:
        raise HTTPException(
            status_code=413,
            detail=f"Garment image exceeds maximum size of {max_size // (1024*1024)}MB.",
        )

    # Validate MIME type
    if person_image.content_type and not person_image.content_type.startswith("image/"):
        raise HTTPException(status_code=422, detail="Person file is not a valid image.")
    if garment_image.content_type and not garment_image.content_type.startswith("image/"):
        raise HTTPException(status_code=422, detail="Garment file is not a valid image.")

    return person_bytes, garment_bytes


async def _run_ai(
    request_id: str,
    person_bytes: bytes,
    garment_bytes: bytes,
    category: str,
    product_id: str,
    metadata: dict = None,
) -> bytes:
    """
    Dispatch to the configured AI provider.
    AI_PROVIDER=idmvton  → IDM-VTON HuggingFace Space (free)
    AI_PROVIDER=gemini   → Google Gemini (requires paid plan)
    """
    provider = settings.AI_PROVIDER.lower().strip()
    logger.info("[%s] Using AI provider: %s", request_id, provider)

    try:
        if provider == "idmvton":
            return await generate_tryon_idmvton(
                person_bytes=person_bytes,
                garment_bytes=garment_bytes,
                category=category,
            )
        elif provider == "fashn":
            return await generate_tryon_fashn(
                person_bytes=person_bytes,
                garment_bytes=garment_bytes,
                category=category,
            )
        elif provider == "gemini":
            return await gemini_generate(
                person_bytes=person_bytes,
                garment_bytes=garment_bytes,
                category=category,
                product_id=product_id,
            )
        elif provider == "openai":
            return await generate_tryon_openai(
                person_bytes=person_bytes,
                garment_bytes=garment_bytes,
                category=category,
                metadata=metadata,
            )
        else:
            logger.error("[%s] Unknown AI_PROVIDER: %s", request_id, provider)
            raise HTTPException(
                status_code=500,
                detail=f"Unknown AI_PROVIDER '{provider}'. Use 'idmvton' or 'gemini'.",
            )

    except HTTPException:
        raise
    except ValueError as exc:
        logger.error("[%s] Config error: %s", request_id, exc)
        raise HTTPException(status_code=500, detail="AI service configuration error.")
    except PermissionError as exc:
        logger.warning("[%s] Quota/rate limit: %s", request_id, exc)
        raise HTTPException(status_code=429, detail="AI service is busy. Please try again.")
    except TimeoutError as exc:
        logger.warning("[%s] Timeout: %s", request_id, exc)
        raise HTTPException(status_code=504, detail="AI generation timed out. Please try again.")
    except RuntimeError as exc:
        logger.error("[%s] Runtime error: %s", request_id, exc)
        raise HTTPException(status_code=500, detail="Image generation failed. Please try again.")
    except Exception as exc:
        logger.exception("[%s] Unexpected error: %s", request_id, exc)
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")


async def _run_gemini(
    request_id: str,
    person_bytes: bytes,
    garment_bytes: bytes,
    category: str,
    product_id: str,
) -> bytes:
    """
    Call gemini_provider.generate_tryon and map exceptions to HTTPExceptions.

    The Gemini provider raises clean Python built-ins.
    We map them to appropriate HTTP status codes here.

    Raises:
        HTTPException with appropriate status code.
    """
    try:
        result_bytes = await gemini_generate(
            person_bytes=person_bytes,
            garment_bytes=garment_bytes,
            category=category,
            product_id=product_id,
        )
        return result_bytes

    except ValueError as exc:
        # Invalid API key or missing config
        logger.error("[%s] Gemini config error: %s", request_id, exc)
        raise HTTPException(status_code=500, detail="AI service configuration error.")

    except PermissionError as exc:
        # Quota exceeded
        logger.warning("[%s] Gemini quota exceeded: %s", request_id, exc)
        raise HTTPException(
            status_code=429,
            detail="AI service is temporarily unavailable. Please try again later.",
        )

    except TimeoutError as exc:
        # Timeout
        logger.warning("[%s] Gemini timeout: %s", request_id, exc)
        raise HTTPException(
            status_code=504,
            detail="AI generation timed out. Please try again.",
        )

    except RuntimeError as exc:
        # All other Gemini failures
        logger.error("[%s] Gemini runtime error: %s", request_id, exc)
        raise HTTPException(
            status_code=500,
            detail="Image generation failed. Please try again.",
        )

    except Exception as exc:
        # Unexpected
        logger.exception("[%s] Unexpected error during generation: %s", request_id, exc)
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again.",
        )
