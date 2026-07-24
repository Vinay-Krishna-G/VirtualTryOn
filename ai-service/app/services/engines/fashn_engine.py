"""
app/services/engines/fashn_engine.py
"""
import asyncio
import base64
import io
import time
import httpx
import logging
from PIL import Image
from fastapi import HTTPException

from app.core.config import settings, secrets
from app.services.engines.tryon_engine import TryOnEngine

logger = logging.getLogger(__name__)

class FashnTryOnEngine(TryOnEngine):
    """
    FASHN Try-On Engine integration using the official API endpoint.
    Singleton-friendly, uses a persistent HTTP client.
    """
    
    BASE_URL = "https://api.fashn.ai/v1"
    
    def __init__(self):
        self.api_key = secrets.get("FASHN_API_KEY")
        if not self.api_key:
            raise ValueError("FASHN_API_KEY is not set in configuration.")
        # Persistent HTTP client to reuse connections
        self.client = httpx.AsyncClient(timeout=settings.FASHN_TIMEOUT)
            
    def _process_image(self, img_bytes: bytes) -> str:
        """
        Process the image before sending to FASHN:
        - Detect MIME type
        - Resize if longest side > 1024
        - Compress JPEG (~90% quality), preserve PNG transparency
        - Return Base64 Data URI
        """
        try:
            with Image.open(io.BytesIO(img_bytes)) as img:
                # Validate image is not corrupted by fully loading it
                img.verify()
        except Exception as exc:
            logger.error(f"Image corruption detected: {exc}")
            raise HTTPException(status_code=422, detail="Invalid or corrupt image file.")

        try:
            with Image.open(io.BytesIO(img_bytes)) as img:
                format_orig = img.format or "JPEG"
                mode = img.mode
                
                # Minimum size check
                if min(img.size) < 256:
                    raise HTTPException(status_code=422, detail="Image must be at least 256x256 pixels.")
                
                # Resize if needed
                max_size = 1024
                if max(img.size) > max_size:
                    img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                
                output = io.BytesIO()
                mime_type = "image/jpeg"
                
                if format_orig == "PNG" and (mode in ("RGBA", "LA") or "transparency" in img.info):
                    # Preserve PNG with transparency
                    img.save(output, format="PNG", optimize=True)
                    mime_type = "image/png"
                elif format_orig == "WEBP":
                    img.save(output, format="WEBP", quality=90)
                    mime_type = "image/webp"
                else:
                    if mode != "RGB":
                        img = img.convert("RGB")
                    img.save(output, format="JPEG", quality=90)
                    
                b64 = base64.b64encode(output.getvalue()).decode("utf-8")
                return f"data:{mime_type};base64,{b64}"
        except HTTPException:
            raise
        except Exception as exc:
            logger.error(f"Image processing error: {exc}")
            raise HTTPException(status_code=500, detail="Failed to process image before upload.")
            
    async def generate(self, person_bytes: bytes, garment_bytes: bytes, metadata: dict) -> dict:
        """
        Generate a virtual try-on image via FASHN API.
        """
        t0 = time.monotonic()
        
        # Image Processing
        model_image_b64 = self._process_image(person_bytes)
        product_image_b64 = self._process_image(garment_bytes)
        t_resize = time.monotonic() - t0
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        prompt = metadata.get("prompt", "")
        logger.info(f"FASHN API Payload - Prompt: {prompt}")
        
        payload = {
            "model_name": settings.FASHN_MODEL,
            "inputs": {
                "model_image": model_image_b64,
                "product_image": product_image_b64,
                "resolution": settings.FASHN_RESOLUTION,
                "generation_mode": settings.FASHN_GENERATION_MODE,
                "prompt": prompt
            }
        }
        if settings.MOCK_AI:
            logger.info("MOCK_AI is enabled. Skipping FASHN API generation.")
            return {"id": "mock-fashn-id"}
            
        t_submit_start = time.monotonic()
        
        try:
            run_resp = await self.client.post(f"{self.BASE_URL}/run", headers=headers, json=payload)
        except httpx.RequestError as exc:
            logger.error(f"FASHN API Request Error: {exc}")
            raise HTTPException(status_code=504, detail="Network error communicating with FASHN API.")
            
        if run_resp.status_code in (401, 403):
            raise HTTPException(status_code=401, detail="Authentication failed with FASHN API.")
        if run_resp.status_code == 404:
            raise HTTPException(status_code=404, detail="FASHN API endpoint not found.")
        if run_resp.status_code == 422:
            raise HTTPException(status_code=422, detail="Invalid payload sent to FASHN API.")
        if run_resp.status_code == 429:
            raise HTTPException(status_code=429, detail="FASHN API rate limit exceeded.")
        if run_resp.status_code >= 400:
            logger.error(f"FASHN API Run Error: {run_resp.text}")
            raise HTTPException(status_code=500, detail="Failed to start FASHN Try-On prediction.")
            
        run_data = run_resp.json()
        prediction_id = run_data.get("id")
        if not prediction_id:
            raise HTTPException(status_code=500, detail="FASHN API did not return a prediction ID.")

        t_submit = time.monotonic() - t_submit_start
        
        return {"id": prediction_id}

    async def check_status(self, prediction_id: str) -> dict:
        """
        Check the status of a FASHN prediction.
        Returns:
            {"status": "processing"|"completed"|"failed", "image_url": "..."}
        """
        if settings.MOCK_AI and prediction_id == "mock-fashn-id":
            return {
                "status": "completed", 
                "image_url": "https://via.placeholder.com/512x768.png?text=Mock+FASHN+Result"
            }
            
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            status_resp = await self.client.get(f"{self.BASE_URL}/status/{prediction_id}", headers=headers)
            if status_resp.status_code >= 400:
                logger.error(f"FASHN API Status Error: {status_resp.text}")
                return {"status": "failed", "error": "API Error"}
                
            status_data = status_resp.json()
            status = status_data.get("status")
            
            if status == "completed":
                image_urls = status_data.get("output", [])
                final_image_url = image_urls[0] if image_urls else status_data.get("image_url")
                
                if final_image_url:
                    return {"status": "completed", "image_url": final_image_url}
                
                return {"status": "failed", "error": "No image URL in response"}
                
            elif status in ("failed", "cancelled"):
                return {"status": "failed", "error": str(status_data)}
                
            return {"status": "processing"}
            
        except httpx.RequestError as exc:
            logger.error(f"FASHN API Request Error: {exc}")
            return {"status": "processing"}
        
# Singleton Instance
fashn_engine = FashnTryOnEngine()
