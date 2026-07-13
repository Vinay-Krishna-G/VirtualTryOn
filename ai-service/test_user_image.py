import asyncio
import sys
import json
import os
import shutil
from app.services.pipeline.orchestrator import PreprocessingOrchestrator

def main():
    img_path = r"C:\Users\konje\OneDrive\Desktop\Mummy 2.jpeg"
    if not os.path.exists(img_path):
        print(json.dumps({"error": f"Image not found at {img_path}"}))
        return
        
    with open(img_path, "rb") as f:
        img_bytes = f.read()
        
    ctx = PreprocessingOrchestrator.run(img_bytes)
    
    # Save the enhanced image to the artifacts directory
    artifact_dir = r"C:\Users\konje\.gemini\antigravity-ide\brain\608e7ef4-bb10-45b0-b0c1-82f84775250a"
    out_path = os.path.join(artifact_dir, "mummy2_enhanced.jpg")
    
    with open(out_path, "wb") as f:
        f.write(ctx.enhanced_bytes)
        
    result = {
        "score": ctx.validation.quality.score,
        "is_valid": ctx.validation.is_valid,
        "reasons": ctx.validation.quality.reasons,
        "recommendations": ctx.validation.quality.recommendations,
        "is_saree_likely": ctx.validation.is_saree_likely,
        "metrics": ctx.metrics,
        "enhanced_image": out_path
    }
    
    print(json.dumps(result))

if __name__ == "__main__":
    main()

