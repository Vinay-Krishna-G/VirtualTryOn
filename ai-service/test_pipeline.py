import asyncio
import time
from app.services.pipeline.orchestrator import PreprocessingOrchestrator
from PIL import Image
from io import BytesIO

async def main():
    print("Creating test image...")
    img = Image.new("RGBA", (800, 600), (255, 0, 0, 128))
    b = BytesIO()
    img.save(b, format="PNG")
    test_bytes = b.getvalue()
    
    print("Testing pipeline first run (cold start)...")
    t0 = time.monotonic()
    ctx1 = PreprocessingOrchestrator.run(test_bytes)
    t1 = time.monotonic()
    print(f"Cold start took {int((t1-t0)*1000)}ms. Metrics: {ctx1.metrics}")
    
    print("Testing pipeline second run (warm start)...")
    t2 = time.monotonic()
    ctx2 = PreprocessingOrchestrator.run(test_bytes)
    t3 = time.monotonic()
    print(f"Warm start took {int((t3-t2)*1000)}ms. Metrics: {ctx2.metrics}")
    
    if (t3-t2)*1000 < 300:
        print("PERFORMANCE REQUIREMENT MET")
    else:
        print("PERFORMANCE REQUIREMENT FAILED")

if __name__ == "__main__":
    asyncio.run(main())

