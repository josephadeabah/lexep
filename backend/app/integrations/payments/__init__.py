from functools import lru_cache

from app.core.config import settings
from app.integrations.payments.base import PaymentProvider
from app.integrations.payments.mock import MockPaymentProvider
from app.integrations.payments.paystack import PaystackProvider


@lru_cache
def get_payment_provider() -> PaymentProvider:
    if settings.PAYMENTS_ENABLED and settings.PAYMENTS_PROVIDER == "paystack":
        return PaystackProvider()
    return MockPaymentProvider()
