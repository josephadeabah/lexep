import httpx

from app.core.config import settings
from app.integrations.payments.base import (
    InitializedTransaction,
    PaymentProvider,
    VerifiedTransaction,
)

PAYSTACK_BASE_URL = "https://api.paystack.co"


class PaystackProvider(PaymentProvider):
    """Real Paystack integration. Requires PAYSTACK_SECRET_KEY to be set."""

    def _headers(self) -> dict:
        return {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json",
        }

    def initialize_transaction(
        self,
        *,
        amount: float,
        currency: str,
        email: str,
        reference: str,
        metadata: dict,
    ) -> InitializedTransaction:
        # Paystack expects amounts in the smallest currency unit (e.g. kobo/cents).
        payload = {
            "email": email,
            "amount": int(round(amount * 100)),
            "currency": currency,
            "reference": reference,
            "metadata": metadata,
            "callback_url": f"{settings.APP_BASE_URL}/checkout/callback",
        }
        with httpx.Client(timeout=15) as client:
            res = client.post(
                f"{PAYSTACK_BASE_URL}/transaction/initialize",
                json=payload,
                headers=self._headers(),
            )
            res.raise_for_status()
            data = res.json()["data"]
        return InitializedTransaction(
            reference=data["reference"],
            authorization_url=data["authorization_url"],
            provider="paystack",
        )

    def verify_transaction(self, reference: str) -> VerifiedTransaction:
        with httpx.Client(timeout=15) as client:
            res = client.get(
                f"{PAYSTACK_BASE_URL}/transaction/verify/{reference}",
                headers=self._headers(),
            )
            res.raise_for_status()
            data = res.json()["data"]
        return VerifiedTransaction(
            reference=reference,
            status="success" if data.get("status") == "success" else "failed",
            amount=(data.get("amount") or 0) / 100,
            currency=data.get("currency", "NGN"),
            provider="paystack",
            metadata=data.get("metadata") or {},
        )
