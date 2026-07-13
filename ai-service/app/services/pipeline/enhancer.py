import cv2
import numpy as np
from io import BytesIO
from PIL import Image
import logging

logger = logging.getLogger(__name__)

class ImageEnhancer:
    """Lightweight OpenCV-based image enhancement pipeline."""
    
    @staticmethod
    def process_bytes(img_bytes: bytes, settings) -> bytes:
        if not settings.ENABLE_ENHANCEMENT:
            return img_bytes
            
        try:
            # Decode using OpenCV
            nparr = np.frombuffer(img_bytes, np.uint8)
            # Read unchanged to preserve alpha channel if PNG
            img = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)
            if img is None:
                return img_bytes
                
            has_alpha = img.shape[-1] == 4 if len(img.shape) == 3 else False
            
            # Convert to BGR if it has alpha for processing
            if has_alpha:
                bgr = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
                alpha = img[:, :, 3]
            else:
                bgr = img
                alpha = None

            # 1. Denoise
            if settings.ENABLE_DENOISE:
                bgr = cv2.bilateralFilter(bgr, 9, 75, 75)
                
            # 2. CLAHE (Contrast Limited Adaptive Histogram Equalization)
            if settings.ENABLE_CLAHE:
                lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
                l_channel, a, b = cv2.split(lab)
                clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
                cl = clahe.apply(l_channel)
                limg = cv2.merge((cl, a, b))
                bgr = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
                
            # 3. Sharpen
            if settings.ENABLE_SHARPEN:
                kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
                bgr = cv2.filter2D(bgr, -1, kernel)
                
            # Combine back alpha if needed
            if has_alpha:
                result = cv2.merge((bgr[:,:,0], bgr[:,:,1], bgr[:,:,2], alpha))
            else:
                result = bgr
                
            # PIL for smart resizing and compression (preserves quality while saving bytes)
            # OpenCV encode is less predictable with quality parameters cross-format
            rgb_result = cv2.cvtColor(result, cv2.COLOR_BGR2RGBA) if has_alpha else cv2.cvtColor(result, cv2.COLOR_BGR2RGB)
            pil_img = Image.fromarray(rgb_result)
            
            # Resize
            max_size = 1024
            if max(pil_img.size) > max_size:
                pil_img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                
            out_bytes = BytesIO()
            if has_alpha:
                pil_img.save(out_bytes, format="PNG", optimize=True)
            else:
                pil_img.save(out_bytes, format="JPEG", quality=90, optimize=True)
                
            return out_bytes.getvalue()
            
        except Exception as e:
            logger.error(f"Image enhancement failed: {e}")
            return img_bytes

