"""
app/services/engines/tryon_engine.py
"""
from abc import ABC, abstractmethod

class TryOnEngine(ABC):
    """
    Abstract base class for all Virtual Try-On engines.
    """
    @abstractmethod
    async def generate(self, person_bytes: bytes, garment_bytes: bytes, metadata: dict) -> bytes:
        """
        Generate a virtual try-on image.
        
        Args:
            person_bytes: The bytes of the person image.
            garment_bytes: The bytes of the garment image.
            metadata: Any additional product or generation metadata.
            
        Returns:
            The generated image as bytes.
        """
        pass
