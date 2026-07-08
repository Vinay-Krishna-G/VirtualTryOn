"""
app/services/image_storage.py

Temporary image persistence helper.

Responsibilities:
    - Save raw image bytes to a temp folder with a UUID filename.
    - Derive a publicly accessible URL for a saved image.
    - Provide a helper to read a file back as bytes.

Why this exists:
    The /api/try-on endpoint returns a JSON body with an `imageUrl`
    field so the caller can fetch the image separately.  This module
    handles writing the image to disk and building that URL.

    The /generate endpoint returns raw PNG bytes directly, so it does
    NOT need this module — it just passes bytes straight through.
"""

import logging
import uuid
from pathlib import Path

logger = logging.getLogger(__name__)


def save_temp_image(image_bytes: bytes, folder: Path, extension: str = "png") -> Path:
    """
    Save raw image bytes to *folder* with a UUID-based filename.

    Args:
        image_bytes:  Raw bytes of the image.
        folder:       Target directory (created automatically if missing).
        extension:    File extension without the leading dot (default: "png").

    Returns:
        Path object pointing to the saved file.

    Raises:
        OSError: If the file cannot be written.
    """
    folder.mkdir(parents=True, exist_ok=True)

    filename = f"{uuid.uuid4().hex}.{extension}"
    file_path = folder / filename

    file_path.write_bytes(image_bytes)
    logger.debug("Saved temp image: %s (%d bytes)", file_path, len(image_bytes))

    return file_path


def get_image_url(file_path: Path, base_url: str) -> str:
    """
    Build a URL that the frontend can use to fetch the generated image.

    Args:
        file_path:  Path to the saved image file.
        base_url:   Root URL of this FastAPI service (e.g. "http://localhost:8000").

    Returns:
        Full URL string, e.g. "http://localhost:8000/output/abc123.png".
    """
    return f"{base_url.rstrip('/')}/output/{file_path.name}"


def read_image_bytes(file_path: Path) -> bytes:
    """Read an image file from disk and return its bytes."""
    return file_path.read_bytes()
