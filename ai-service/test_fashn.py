import asyncio
from app.services.engines.fashn_engine import fashn_engine
from app.config import settings

async def test():
    settings.FASHN_API_KEY = "test"
    res = await fashn_engine.generate(b"person", b"garment", {})
    print(res)

asyncio.run(test())
