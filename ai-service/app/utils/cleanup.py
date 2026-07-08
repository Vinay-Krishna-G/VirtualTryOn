"""
app/utils/cleanup.py

Temporary file cleanup utility.

Responsibility:
    Delete files in temp folders that are older than the configured
    TEMP_IMAGE_EXPIRY duration. Called once at startup and can be
    triggered again at any time.

Usage:
    from app.utils.cleanup import cleanup_old_files
    cleanup_old_files(settings.get_upload_path(), settings.TEMP_IMAGE_EXPIRY)
"""

import logging
import time
from pathlib import Path

logger = logging.getLogger(__name__)


def cleanup_old_files(folder: Path, max_age_seconds: int) -> int:
    """
    Delete files in `folder` that are older than `max_age_seconds`.

    Args:
        folder:           Directory to scan.
        max_age_seconds:  Files older than this (in seconds) are deleted.

    Returns:
        Number of files deleted.
    """
    if not folder.exists():
        return 0

    now = time.time()
    deleted = 0

    for file_path in folder.iterdir():
        if not file_path.is_file():
            continue
        try:
            age = now - file_path.stat().st_mtime
            if age > max_age_seconds:
                file_path.unlink()
                deleted += 1
                logger.debug("Deleted expired temp file: %s (age=%.0fs)", file_path.name, age)
        except OSError as exc:
            logger.warning("Could not delete %s: %s", file_path, exc)

    if deleted:
        logger.info("Cleanup: removed %d expired file(s) from %s", deleted, folder)

    return deleted


def cleanup_all_temp(upload_folder: Path, output_folder: Path, max_age_seconds: int) -> None:
    """Convenience wrapper that cleans both temp folders."""
    u = cleanup_old_files(upload_folder, max_age_seconds)
    o = cleanup_old_files(output_folder, max_age_seconds)
    logger.info("Cleanup complete: %d uploads + %d outputs removed", u, o)
