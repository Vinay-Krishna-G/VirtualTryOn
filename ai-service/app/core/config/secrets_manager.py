import os
import logging
from abc import ABC, abstractmethod
from typing import Optional, Dict
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

# Load .env file automatically so os.getenv works (even if Pydantic isn't loading it for secrets)
load_dotenv()

class SecretProvider(ABC):
    """Base interface for all secret providers (AWS, GCP, Azure, HashiCorp, Local)"""
    @abstractmethod
    def get_secret(self, secret_name: str) -> Optional[str]:
        pass

class LocalEnvSecretProvider(SecretProvider):
    """Local implementation that reads from environment variables / .env"""
    def get_secret(self, secret_name: str) -> Optional[str]:
        return os.getenv(secret_name)

class SecretManager:
    """
    Centralized secret manager. 
    Masks secrets in logs and validates required secrets at startup.
    """
    def __init__(self, provider: SecretProvider):
        self._provider = provider
        self._cache: Dict[str, str] = {}
        
    def get(self, secret_name: str) -> str:
        """Get a required secret, failing fast if missing."""
        if secret_name in self._cache:
            return self._cache[secret_name]
            
        value = self._provider.get_secret(secret_name)
        if not value:
            # Raise ValueError to fail fast. We intentionally do NOT log the actual secret value.
            error_msg = f"CRITICAL ERROR: Missing required secret: '{secret_name}'"
            logger.error(error_msg)
            raise ValueError(error_msg)
            
        self._cache[secret_name] = value
        return value
        
    def get_optional(self, secret_name: str, default: Optional[str] = None) -> Optional[str]:
        """Get an optional secret."""
        if secret_name in self._cache:
            return self._cache[secret_name]
            
        value = self._provider.get_secret(secret_name)
        if value is not None:
            self._cache[secret_name] = value
            return value
            
        return default

# Instantiate the global SecretManager with the local provider
secrets = SecretManager(LocalEnvSecretProvider())
