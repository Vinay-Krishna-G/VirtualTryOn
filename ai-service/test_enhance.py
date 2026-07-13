
import sys
import os
sys.path.append(os.getcwd())
from app.services.pipeline.enhancer import ImageEnhancer
from app.config import settings

with open(r"C:\Users\konje\.gemini\antigravity-ide\brain\608e7ef4-bb10-45b0-b0c1-82f84775250a\original_mummy_2.jpg", "rb") as f:
    img_bytes = f.read()

settings.ENABLE_ENHANCEMENT = True
settings.ENABLE_CLAHE = True
settings.ENABLE_DENOISE = True
settings.ENABLE_SHARPEN = True

enhanced_bytes = ImageEnhancer.process_bytes(img_bytes, settings)

with open(r"C:\Users\konje\.gemini\antigravity-ide\brain\608e7ef4-bb10-45b0-b0c1-82f84775250a\enhanced_mummy_2.jpg", "wb") as f:
    f.write(enhanced_bytes)

print("Enhancement complete!")

