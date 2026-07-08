"""
app/config.py

Centralised settings for the VirtualFit AI Service.

All values can be overridden through environment variables or a .env file.
Uses Pydantic BaseSettings so every field is type-validated at startup.

Usage:
    from app.config import settings
    print(settings.GEMINI_API_KEY)
"""

from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


class Settings(BaseSettings):
    """Application-wide settings loaded from environment / .env file."""

    # ── Gemini ─────────────────────────────────────────────────────────────────
    GEMINI_API_KEY: str = ""

    # ── File storage ───────────────────────────────────────────────────────────
    # Paths are relative to the ai-service root directory
    UPLOAD_FOLDER: str = "temp/uploads"
    OUTPUT_FOLDER: str = "temp/generated"

    # How long (seconds) temporary images are kept before cleanup
    TEMP_IMAGE_EXPIRY: int = 3600  # 1 hour

    # Maximum accepted upload size in bytes (10 MB)
    MAX_FILE_SIZE: int = 10 * 1024 * 1024

    # ── Server ─────────────────────────────────────────────────────────────────
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # ── Gemini model ───────────────────────────────────────────────────────────
    # gemini-2.5-flash-image supports image output (response_modalities=["IMAGE"])
    # Other options: gemini-3.1-flash-image (latest), gemini-3-pro-image (highest quality)
    GEMINI_MODEL: str = "gemini-2.5-flash-image"

    # Timeout (seconds) for a single Gemini API call
    GEMINI_TIMEOUT: int = 120

    # ── Mock mode ──────────────────────────────────────────────────────────────
    # Set MOCK_AI=true in .env to skip Gemini entirely and return a test image.
    # Use this to test the full pipeline (React → Node → FastAPI → display)
    # without spending any API credits.
    MOCK_AI: bool = False

    # ── AI Provider ────────────────────────────────────────────────────────────
    # Which AI backend to use for image generation.
    # Options:
    #   "gemini"  — Google Gemini image generation (requires paid plan)
    #   "idmvton" — IDM-VTON on HuggingFace Spaces (free, no API key needed)
    #   "fashn"   — fashn-vton-1.5 on HuggingFace Spaces
    AI_PROVIDER: str = "fashn"

    # Optional token for HuggingFace (used by fashn/idmvton to bypass ZeroGPU limits)
    HF_TOKEN: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    def get_upload_path(self) -> Path:
        """Return upload folder as an absolute Path, creating it if needed."""
        p = Path(self.UPLOAD_FOLDER)
        p.mkdir(parents=True, exist_ok=True)
        return p

    def get_output_path(self) -> Path:
        """Return output folder as an absolute Path, creating it if needed."""
        p = Path(self.OUTPUT_FOLDER)
        p.mkdir(parents=True, exist_ok=True)
        return p


# Singleton — import this everywhere
settings = Settings()
