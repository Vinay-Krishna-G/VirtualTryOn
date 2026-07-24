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

from app.core.config import settings
import asyncio
from app.services.image_storage import get_image_url, save_temp_image
from app.services.engines.fashn_engine import fashn_engine
from app.services.pipeline.orchestrator import PreprocessingOrchestrator
from app.services.category_detector import CategoryDetector

logger = logging.getLogger(__name__)

router = APIRouter()


# ── POST /api/try-on/enhance ──────────────────────────────────────────────────
@router.post("/api/try-on/enhance")
async def enhance_endpoint(
    person_image: UploadFile = File(..., description="Full-body photo of the person to enhance")
):
    """
    POST /api/try-on/enhance
    Enhances an image (CLAHE, Denoise, Sharpen) and returns the raw JPEG bytes.
    """
    request_id = uuid.uuid4().hex[:8]
    start = time.monotonic()
    
    try:
        person_bytes = await person_image.read()
    except Exception as exc:
        logger.error("[%s] Failed to read upload stream: %s", request_id, exc)
        raise HTTPException(status_code=400, detail="Failed to read uploaded file.")
        
    if not person_bytes:
        raise HTTPException(status_code=400, detail="Person image is empty or missing.")
        
    # Run Orchestrator Pipeline
    ctx = PreprocessingOrchestrator.run(person_bytes)
    
    if not ctx.validation.is_valid:
        error_msg = f"{' '.join(ctx.validation.quality.reasons)} {' '.join(ctx.validation.quality.recommendations)}"
        logger.warning("[%s] Pipeline rejected image during enhancement: %s", request_id, error_msg)
        return JSONResponse(
            status_code=400,
            content={"success": False, "message": error_msg}
        )
        
    elapsed = time.monotonic() - start
    logger.info("[%s] /api/try-on/enhance SUCCESS | time=%.2fs", request_id, elapsed)
    
    return Response(content=ctx.enhanced_bytes, media_type="image/jpeg")


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

    # Legacy endpoint doesn't send prompt metadata, so we generate a smart prompt here.
    category = CategoryDetector.detect_category(product_id or "")
    
    base_prompt = "The garment must conform to the person's existing body. Never alter the person's body measurements or silhouette to fit the garment; instead, fit the garment to the person's original body."
    if category == "saree":
        smart_prompt = f"traditional indian saree drape, {base_prompt}"
    elif category == "suit":
        smart_prompt = f"perfectly fitted formal suit, {base_prompt}"
    else:
        smart_prompt = f"perfectly fitted {category}, {base_prompt}"
        
    metadata = {"prompt": smart_prompt}
    logger.info(
        "[%s] /generate | category=%s product=%s person=%s garment=%s",
        request_id, category, product_id,
        person_image.filename, garment_image.filename,
    )

    # ── Read uploaded files ────────────────────────────────────────────────────
    person_bytes, garment_bytes = await _read_uploads(
        request_id, person_image, garment_image
    )

    # ── Pipeline Preprocessing ────────────────────────────────────────────────
    ctx = PreprocessingOrchestrator.run(person_bytes)
    if not ctx.validation.is_valid:
        error_msg = f"Image rejected. {' '.join(ctx.validation.quality.reasons)} {' '.join(ctx.validation.quality.recommendations)}"
        logger.warning("[%s] Pipeline rejected image: %s", request_id, error_msg)
        return Response(content=f"Error: {error_msg}".encode("utf-8"), status_code=400)
    person_bytes = ctx.enhanced_bytes

    # ── Call AI Provider ────────────────────────────────────────────────────────
    result = await _run_ai(
        request_id, person_bytes, garment_bytes, category, product_id or "", metadata=metadata
    )

    elapsed = time.monotonic() - start

    logger.info(
        "[%s] /generate SUCCESS | time=%.2fs | pipeline_metrics=%s", 
        request_id, elapsed, ctx.metrics
    )

    return JSONResponse(status_code=200, content=result)


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

    # Try-On Max does not require a category or product ID
    # Any specific user prompts can be passed via form data in the future
    category = product_category.strip() if product_category else "saree"
    
    inferred_cat = CategoryDetector.detect_category(product_id or category)
        
    base_prompt = "preserve original body shape, match exact skin tone, natural pose, realistic proportions. The garment must conform to the person's existing body. Never alter the person's body measurements or silhouette to fit the garment; instead, fit the garment to the person's original body."
    if inferred_cat == "saree":
        smart_prompt = f"traditional indian saree drape, {base_prompt}"
    elif inferred_cat == "suit":
        smart_prompt = f"perfectly fitted formal suit, {base_prompt}"
    else:
        smart_prompt = f"perfectly fitted {inferred_cat}, {base_prompt}"
        
    metadata = {"prompt": smart_prompt}

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

    # ── Pipeline Preprocessing ────────────────────────────────────────────────
    ctx = PreprocessingOrchestrator.run(person_bytes)
    if not ctx.validation.is_valid:
        error_msg = f"Image rejected. {' '.join(ctx.validation.quality.reasons)} {' '.join(ctx.validation.quality.recommendations)}"
        logger.warning("[%s] Pipeline rejected image: %s", request_id, error_msg)
        elapsed = time.monotonic() - start
        return JSONResponse(
            status_code=400,
            content={"success": False, "message": error_msg},
        )
    person_bytes = ctx.enhanced_bytes

    # ── Call AI Provider ────────────────────────────────────────────────────────
    try:
        result = await _run_ai(
            request_id, person_bytes, garment_bytes, category, product_id or "", metadata=metadata
        )

    except HTTPException as exc:
        elapsed = time.monotonic() - start
        logger.error("[%s] /api/try-on FAILED at generation | reason=%s time=%.2fs", request_id, exc.detail, elapsed)
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "message": "Unable to generate image."},
        )

    elapsed = time.monotonic() - start
    logger.info("[%s] /api/try-on SUCCESS | time=%.2fs", request_id, elapsed)

    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "prediction_id": result.get("id"),
            "generationTime": round(elapsed, 2),
        },
    )

@router.get("/api/try-on/status/{prediction_id}")
async def get_tryon_status(prediction_id: str):
    """
    Check the status of a try-on generation.
    """
    status = await fashn_engine.check_status(prediction_id)
    return JSONResponse(content=status)




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
        person_bytes, garment_bytes = await asyncio.gather(
            person_image.read(),
            garment_image.read()
        )
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
) -> dict:
    """
    Dispatch to the configured AI provider.
    AI_PROVIDER=idmvton  → IDM-VTON HuggingFace Space (free)
    AI_PROVIDER=gemini   → Google Gemini (requires paid plan)
    """
    provider = settings.AI_PROVIDER.lower().strip()
    logger.info("[%s] Using AI provider: %s", request_id, provider)

    try:
        if provider == "fashn_api":
            meta = metadata or {}
            meta["category"] = category
            return await fashn_engine.generate(
                person_bytes=person_bytes,
                garment_bytes=garment_bytes,
                metadata=meta
            )
        else:
            logger.error("[%s] Unknown AI_PROVIDER: %s", request_id, provider)
            raise HTTPException(
                status_code=500,
                detail=f"Unknown AI_PROVIDER '{provider}'. Use 'fashn_api'.",
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

