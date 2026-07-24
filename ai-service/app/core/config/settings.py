"""
app/core/config/settings.py

Centralised runtime settings for the VirtualFit AI Service.
NOTE: Secrets (API keys) are NOT stored here. They are managed by secrets_manager.py.

All values can be overridden through environment variables or a .env file.
Uses Pydantic BaseSettings so every field is type-validated at startup.
"""

from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

class Settings(BaseSettings):
    """Application-wide settings loaded from environment / .env file."""

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
    GEMINI_MODEL: str = "gemini-2.5-flash-image"
    GEMINI_TIMEOUT: int = 120

    # ── Mock mode ──────────────────────────────────────────────────────────────
    MOCK_AI: bool = True

    # ── AI Provider ────────────────────────────────────────────────────────────
    # Options: "fashn_api", "gemini", "idmvton"
    AI_PROVIDER: str = "fashn_api"

    # ── CV Pipeline Configuration ──────────────────────────────────────────────
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
