from functools import lru_cache

from app.core.config import settings
from app.integrations.storage.base import StorageProvider
from app.integrations.storage.local_storage import LocalStorageProvider
from app.integrations.storage.supabase_storage import SupabaseStorageProvider


@lru_cache
def get_storage_provider() -> StorageProvider:
    if settings.SUPABASE_ENABLED:
        return SupabaseStorageProvider()
    return LocalStorageProvider()
