"""
app/services/fashn_provider.py

Integration for fashn-ai/fashn-vton-1.5 via HuggingFace Spaces.
"""

import logging
import random
import tempfile
import time
import uuid
from pathlib import Path

from gradio_client import Client, handle_file
from app.config import settings

logger = logging.getLogger(__name__)

FASHN_SPACE = "fashn-ai/fashn-vton-1.5"

def _map_category(category: str) -> str:
    """Map our generic categories to Fashn's Literal['tops', 'bottoms', 'one-pieces']."""
    cat = category.lower()
    if cat in ["saree", "lehenga", "anarkali", "dress"]:
        return "one-pieces"
    if cat in ["jeans", "trousers", "pants"]:
        return "bottoms"
    return "tops"

async def generate_tryon_fashn(
    person_bytes: bytes,
    garment_bytes: bytes,
    category: str,
) -> bytes:
    """
    Generate a virtual try-on image using fashn-vton.
    """
    start = time.monotonic()
    
    fashn_cat = _map_category(category)
    logger.info(
        "FASHN-VTON request | original_cat=%s mapped_cat=%s person_size=%dB garment_size=%dB",
        category, fashn_cat, len(person_bytes), len(garment_bytes),
    )

    tmp_dir = Path(tempfile.gettempdir())
    
    person_tmp = tmp_dir / f"person_{uuid.uuid4().hex}.png"
    garment_tmp = tmp_dir / f"garment_{uuid.uuid4().hex}.png"

    try:
        person_tmp.write_bytes(person_bytes)
        garment_tmp.write_bytes(garment_bytes)

        try:
            # If the user sets HF_TOKEN in .env, we can pass it to avoid ZeroGPU limits
            client = Client(FASHN_SPACE, token=settings.HF_TOKEN)
            
            logger.info("FASHN-VTON: connected to Space, submitting job...")

            seed_val = random.randint(0, 999999)
            
            result = client.predict(
                person_image=handle_file(str(person_tmp)),
                garment_image=handle_file(str(garment_tmp)),
                category=fashn_cat,
                garment_photo_type="flat-lay", # Gradio choice must be 'model' or 'flat-lay'
                num_timesteps=50,
                guidance_scale=2.5, # Strictly follow garment shape
                seed=seed_val,      # Randomized so 'Try Again' gives new results
                segmentation_free=True,
                api_name="/try_on"
            )

        except Exception as exc:
            elapsed = time.monotonic() - start
            logger.error("FASHN-VTON Space call failed after %.1fs: %s", elapsed, exc)
            _handle_exception(exc, elapsed)
            raise

        elapsed = time.monotonic() - start
        logger.info("FASHN-VTON: job completed in %.1fs", elapsed)

        if not result:
            raise RuntimeError("FASHN-VTON returned no output image.")
            
        output_path = Path(result) if isinstance(result, str) else Path(result["path"]) if isinstance(result, dict) else None
        
        if not output_path or not output_path.exists():
            raise RuntimeError(f"FASHN-VTON output file not found: {result}")

        output_bytes = output_path.read_bytes()
        logger.info(
            "FASHN-VTON SUCCESS | time=%.1fs output_size=%dB path=%s",
            elapsed, len(output_bytes), output_path.name,
        )
        return output_bytes

    finally:
        for tmp in (person_tmp, garment_tmp):
            try:
                if tmp.exists():
                    tmp.unlink()
            except OSError:
                pass

def _handle_exception(exc: Exception, elapsed: float) -> None:
    msg = str(exc).lower()
    if "zerogpu quota" in msg:
        raise PermissionError(
            "Fashn ZeroGPU quota exceeded. Add HF_TOKEN to .env to fix this."
        ) from exc
    if "timeout" in msg or "deadline" in msg:
        raise TimeoutError(
            f"Fashn Space timed out after {elapsed:.0f}s. Try again later."
        ) from exc
    if "queue" in msg or "too many" in msg:
        raise PermissionError(
            "Fashn Space queue is full. Please try again in a few minutes."
        ) from exc
    raise RuntimeError(
        "Fashn image generation failed. Please try again."
    ) from exc
