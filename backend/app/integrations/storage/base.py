from abc import ABC, abstractmethod


class StorageProvider(ABC):
    @abstractmethod
    def upload(self, *, path: str, content: bytes, content_type: str) -> str:
        """Uploads a file and returns a publicly-accessible URL."""
        ...
