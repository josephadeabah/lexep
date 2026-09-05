import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.idempotency import IdempotencyMiddleware
from app.routers import admin, assessments, auth, courses, grants, interviews, mentors, notifications, opportunities, payments, uploads, users

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API powering the Lexep platform — learner/mentor/company portals, "
    "opportunities, mentorship, community grants, and premium subscriptions.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lets queued offline mutations replay safely without creating duplicate
# rows — see core/idempotency.py.
app.add_middleware(IdempotencyMiddleware)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(opportunities.router)
app.include_router(interviews.router)
app.include_router(mentors.router)
app.include_router(grants.router)
app.include_router(admin.router)
app.include_router(assessments.router)
app.include_router(payments.router)
app.include_router(uploads.router)
app.include_router(courses.router)
app.include_router(notifications.router)

# Local-storage fallback for file uploads when SUPABASE_ENABLED=false —
# see integrations/storage/local_storage.py.
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}
