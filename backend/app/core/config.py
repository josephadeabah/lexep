"""
Application configuration.

All values can be overridden via environment variables or a `.env` file
(see `.env.example`). Keeping configuration centralized here makes it easy
to add new settings as the platform grows without hunting through the codebase.

Every third-party integration in this app (payments, email, SMS, file storage)
is wired behind a small provider interface (see `app/integrations/`) and
gated by an `*_ENABLED` flag here. Flip the flag + fill in credentials to turn
a feature on — no code changes required. When a flag is `false`, the app uses
a no-op/mock implementation so every flow still works end-to-end for demos
and local development without any real accounts.
"""
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # General
    PROJECT_NAME: str = "Lexep API"
    API_V1_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"
    APP_BASE_URL: str = "http://localhost:3000"

    # Security
    SECRET_KEY: str = "change-me-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database
    DATABASE_URL: str = "postgresql+psycopg2://lexep:lexep@localhost:5432/lexep"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # OAuth (placeholders — wire up real client IDs/secrets when ready)
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    LINKEDIN_CLIENT_ID: str = ""
    LINKEDIN_CLIENT_SECRET: str = ""

    # --- Premium / monetization -----------------------------------------
    # Master switch for the whole paywall. While false, the platform is
    # entirely free: pricing/checkout pages still render (so the flow can be
    # reviewed), but nothing is gated and "Upgrade" CTAs are hidden from the
    # main app chrome. Flip to true when you're ready to start charging.
    PREMIUM_FEATURES_ENABLED: bool = False

    # --- Payments (Paystack today; provider is swappable) -----------------
    PAYMENTS_ENABLED: bool = False
    PAYMENTS_PROVIDER: str = "paystack"  # only "paystack" is implemented today
    PAYSTACK_SECRET_KEY: str = ""
    PAYSTACK_PUBLIC_KEY: str = ""
    PAYSTACK_WEBHOOK_SECRET: str = ""

    # --- Email (Brevo today; provider is swappable) -----------------------
    EMAIL_ENABLED: bool = False
    EMAIL_PROVIDER: str = "brevo"  # only "brevo" is implemented today
    BREVO_API_KEY: str = ""
    EMAIL_FROM_ADDRESS: str = "no-reply@lexep.org"
    EMAIL_FROM_NAME: str = "Lexep"

    # --- SMS (Arkesel today; provider is swappable) ------------------------
    SMS_ENABLED: bool = False
    SMS_PROVIDER: str = "arkesel"  # only "arkesel" is implemented today
    ARKESEL_API_KEY: str = ""
    ARKESEL_SENDER_ID: str = "Lexep"

    # --- File storage (Supabase Storage today; provider is swappable) -----
    # Note: this toggles *storage only*. Authentication stays on Lexep's own
    # platform-agnostic JWT system (see core/security.py) regardless of this
    # flag — Supabase is used here purely as an object store for user
    # uploads (resumes, credential documents, avatars).
    SUPABASE_ENABLED: bool = False
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_KEY: str = ""
    SUPABASE_BUCKET: str = "lexep-uploads"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
