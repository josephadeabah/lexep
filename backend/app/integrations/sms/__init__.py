from functools import lru_cache

from app.core.config import settings
from app.integrations.sms.base import SMSProvider
from app.integrations.sms.arkesel import ArkeselSMSProvider
from app.integrations.sms.noop import NoopSMSProvider


@lru_cache
def get_sms_provider() -> SMSProvider:
    if settings.SMS_ENABLED and settings.SMS_PROVIDER == "arkesel":
        return ArkeselSMSProvider()
    return NoopSMSProvider()
