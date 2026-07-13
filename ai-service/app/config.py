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

    FASHN_API_KEY: str = ""
    FASHN_MODEL: str = "tryon-max"
    FASHN_RESOLUTION: str = "1k"
    FASHN_GENERATION_MODE: str = "fast"
    FASHN_TIMEOUT: float = 200.0
    FASHN_MAX_POLL_ATTEMPTS: int = 30
    FASHN_INITIAL_POLL_INTERVAL: float = 1.0
    FASHN_MAX_POLL_INTERVAL: float = 5.0
    FASHN_OUTPUT_FORMAT: str = "png"
    FASHN_RETURN_BASE64: bool = False

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
    MOCK_AI: bool = True

    # ── AI Provider ────────────────────────────────────────────────────────────
    # Which AI backend to use for image generation.
    # Options:
    #   "fashn_api" — Official FASHN Try-On API (requires FASHN_API_KEY)
    #   "gemini"    — Google Gemini image generation (requires paid plan)
    #   "idmvton"   — IDM-VTON on HuggingFace Spaces (free, no API key needed)
    AI_PROVIDER: str = "fashn_api"

    # Optional token for HuggingFace (used by idmvton to bypass ZeroGPU limits)
    HF_TOKEN: Optional[str] = None

    # "?"? CV Pipeline Configuration "?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?"?
    QUALITY_THRESHOLD: float = 75.0
    ENABLE_ENHANCEMENT: bool = True
    ENABLE_CLAHE: bool = True
    ENABLE_DENOISE: bool = True
    ENABLE_SHARPEN: bool = True
    ENABLE_POSE_CHECK: bool = True
    ENABLE_FAILURE_DETECTION: bool = True
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024
    MIN_IMAGE_SIZE: int = 256

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
