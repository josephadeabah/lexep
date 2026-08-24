import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.api_deps import get_current_user
from app.integrations.storage import get_storage_provider
from app.models.user import User

router = APIRouter(prefix="/api/uploads", tags=["uploads"])

MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10MB, matches the "up to 10MB" copy on the apply wizard
ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
}


@router.post("")
async def upload_file(file: UploadFile = File(...), user: User = Depends(get_current_user)):
    """Generic authenticated file upload — used for resumes, credential
    documents, and avatars. Goes through the storage provider abstraction
    (Supabase Storage when SUPABASE_ENABLED=true, else local disk) so the
    backend behind this endpoint never has to change."""
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type.")

    content = await file.read()
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="File is larger than 10MB.")

    extension = (file.filename or "").rsplit(".", 1)[-1] if "." in (file.filename or "") else "bin"
    path = f"user-{user.id}/{uuid.uuid4().hex}.{extension}"

    provider = get_storage_provider()
    url = provider.upload(path=path, content=content, content_type=file.content_type)

    return {"filename": file.filename, "url": url}
