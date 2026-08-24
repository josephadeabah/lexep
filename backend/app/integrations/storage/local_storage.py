import os

from app.integrations.storage.base import StorageProvider

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")


class LocalStorageProvider(StorageProvider):
    """Used whenever SUPABASE_ENABLED is false (the default). Writes to a
    local `uploads/` directory instead, so file-upload flows keep working
    without any cloud storage account. Flip SUPABASE_ENABLED=true and set
    SUPABASE_URL/SUPABASE_SERVICE_KEY to go live. Not recommended for
    production use behind more than one server instance — mount a shared
    volume or switch to Supabase/S3 for that."""

    def upload(self, *, path: str, content: bytes, content_type: str) -> str:
        full_path = os.path.join(UPLOAD_DIR, path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "wb") as f:
            f.write(content)
        return f"/uploads/{path}"
