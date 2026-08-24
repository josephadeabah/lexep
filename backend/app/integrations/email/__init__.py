from functools import lru_cache

from app.core.config import settings
from app.integrations.email.base import EmailProvider
from app.integrations.email.brevo import BrevoEmailProvider
from app.integrations.email.noop import NoopEmailProvider


@lru_cache
def get_email_provider() -> EmailProvider:
    if settings.EMAIL_ENABLED and settings.EMAIL_PROVIDER == "brevo":
        return BrevoEmailProvider()
    return NoopEmailProvider()
