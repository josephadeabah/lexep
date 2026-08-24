import httpx

from app.core.config import settings
from app.integrations.storage.base import StorageProvider


class SupabaseStorageProvider(StorageProvider):
    """Real Supabase Storage integration. Requires SUPABASE_URL + SUPABASE_SERVICE_KEY.

    Note: only *storage* goes through Supabase here — Lexep's auth stays on
    its own platform-agnostic JWT system (see core/security.py) regardless
    of this provider. This keeps the door open to swap in any other object
    store (S3, GCS, ...) later without touching auth at all.
    """

    def upload(self, *, path: str, content: bytes, content_type: str) -> str:
        url = f"{settings.SUPABASE_URL}/storage/v1/object/{settings.SUPABASE_BUCKET}/{path}"
        headers = {
            "Authorization": f"Bearer {settings.SUPABASE_SERVICE_KEY}",
            "Content-Type": content_type,
            "x-upsert": "true",
        }
        with httpx.Client(timeout=30) as client:
            res = client.post(url, content=content, headers=headers)
            res.raise_for_status()
        return f"{settings.SUPABASE_URL}/storage/v1/object/public/{settings.SUPABASE_BUCKET}/{path}"
