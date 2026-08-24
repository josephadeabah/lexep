"""
No-op payment provider — used whenever PAYMENTS_ENABLED is false (the
default). Transactions "succeed" instantly with no external calls, so the
full checkout UX (grant contributions, premium subscriptions) can be
demoed and tested without any real payment credentials. Flip
PAYMENTS_ENABLED=true and fill in PAYSTACK_SECRET_KEY to go live.
"""

from app.integrations.payments.base import (
    InitializedTransaction,
    PaymentProvider,
    VerifiedTransaction,
)


class MockPaymentProvider(PaymentProvider):
    def initialize_transaction(
        self,
        *,
        amount: float,
        currency: str,
        email: str,
        reference: str,
        metadata: dict
    ) -> InitializedTransaction:
        return InitializedTransaction(
            reference=reference, authorization_url=None, provider="mock"
        )

    def verify_transaction(self, reference: str) -> VerifiedTransaction:
        return VerifiedTransaction(
            reference=reference,
            status="success",
            amount=0,
            currency="USD",
            provider="mock",
            metadata={},
        )
