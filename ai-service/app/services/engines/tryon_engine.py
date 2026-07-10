"""
app/services/engines/tryon_engine.py

Abstract interface defining the contract for all virtual try-on engines.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class TryOnEngine(ABC):
    
    @abstractmethod
    async def generate(
        self,
        person_bytes: bytes,
        garment_bytes: bytes,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bytes:
        """
        Executes a virtual try-on generation.
        Returns the generated image as bytes.
        """
        pass
