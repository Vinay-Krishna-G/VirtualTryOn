"""
app/services/engines/openai_engine.py

OpenAI implementation of the TryOnEngine.
Handles the exact generation logic for DALL-E (or custom image editing proxy).
"""
import base64
import time
import logging
from typing import Dict, Any, Optional
from fastapi import HTTPException

from app.services.engines.tryon_engine import TryOnEngine

logger = logging.getLogger(__name__)

class OpenAITryOnEngine(TryOnEngine):
    def __init__(self, client):
        """
        Expects an instantiated AsyncOpenAI client.
        """
        self.client = client

    async def generate(
        self,
        person_bytes: bytes,
        garment_bytes: bytes,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bytes:
        
        logger.info("OpenAITryOnEngine: Formatting dual images for API submission...")
        
        # Format for OpenAI Images API `FileTypes` sequence
        # Passing multiple images via sequence allows the editing model to use both references natively.
        images_sequence = [
            ("person.png", person_bytes),
            ("garment.png", garment_bytes)
        ]
        
        # Hardcoded constraints strictly for the image editor
        static_editing_prompt = (
            "This is an image editing task. Edit only the first image. "
            "The first image is the immutable source. "
            "Replace only the clothing using the garment shown in the second image. "
            "Preserve the person's identity, face, hairstyle, skin tone, body proportions, pose, lighting, camera angle and background exactly. "
            "Ignore the model, pose and background from the garment image. "
            "Copy only the garment. "
            "The output should appear to be the original photograph after changing clothes."
        )
        
        start_time = time.monotonic()
        logger.info("OpenAITryOnEngine: Calling OpenAI image editing API...")
        
        try:
            image_response = await self.client.images.edit(
                model="gpt-image-2",
                image=images_sequence,
                prompt=static_editing_prompt,
                size="1024x1024",
                n=1,
            )
            
            b64_data = image_response.data[0].b64_json
            if not b64_data:
                raise ValueError("No b64_json returned by OpenAI API")
                
            logger.info("OpenAI image editing API generated successfully.")
            
            result_bytes = base64.b64decode(b64_data)
                
            elapsed = time.monotonic() - start_time
            logger.info("OpenAITryOnEngine generation completed in %.2fs", elapsed)
            
            return result_bytes
            
        except Exception as exc:
            logger.error("Failed to edit image via OpenAI API: %s", exc)
            raise HTTPException(status_code=500, detail="Failed to generate image with OpenAI.")
