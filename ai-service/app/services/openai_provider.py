"""
app/services/openai_provider.py

OpenAI Image Generation integration using a two-step pipeline:
1. GPT-4o analyzes the uploaded person and garment images to generate a detailed DALL-E 3 prompt.
2. DALL-E 3 generates the final image based on the prompt.

This avoids the need for a true image-to-image model while still adhering to the user's uploaded images.
"""

import logging
from fastapi import HTTPException
from openai import AsyncOpenAI

from app.config import settings
from app.services.engines.openai_engine import OpenAITryOnEngine

logger = logging.getLogger(__name__)

async def generate_tryon_openai(
    person_bytes: bytes,
    garment_bytes: bytes,
    category: str,
    metadata: dict = None
) -> bytes:
    """
    Dependency injection wrapper for the OpenAI TryOnEngine.
    """
    if not settings.OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY is not set in environment or .env file.")

    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    # Inject client into engine
    engine = OpenAITryOnEngine(client=client)
    
    if metadata is None:
        metadata = {}
        
    metadata["Category"] = category
    
    logger.info("OpenAI Provider: Delegating to OpenAITryOnEngine...")
    
    try:
        result_bytes = await engine.generate(
            person_bytes=person_bytes,
            garment_bytes=garment_bytes,
            metadata=metadata
        )
        return result_bytes
    except Exception as exc:
        logger.error("TryOnEngine failed: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to complete virtual try-on via Engine.")
