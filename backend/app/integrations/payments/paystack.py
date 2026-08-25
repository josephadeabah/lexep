import httpx
import logging

from app.core.config import settings
from app.integrations.payments.base import (
    InitializedTransaction,
    PaymentProvider,
    VerifiedTransaction,
)

logger = logging.getLogger(__name__)

PAYSTACK_BASE_URL = "https://api.paystack.co"

# Paystack supported currencies
SUPPORTED_CURRENCIES = ["NGN", "GHS", "ZAR", "KES"]


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
        # Validate currency
        if currency.upper() not in SUPPORTED_CURRENCIES:
            raise ValueError(
                f"Currency {currency} is not supported by Paystack. "
                f"Supported currencies: {', '.join(SUPPORTED_CURRENCIES)}"
            )

        # Normalize currency to uppercase
        currency = currency.upper()

        # Paystack expects amounts in the smallest currency unit (e.g. pesewas/cents)
        amount_in_smallest_unit = int(round(amount * 100))

        # Validate amount
        if amount_in_smallest_unit < 100:  # Minimum 1 unit of currency
            raise ValueError(f"Amount must be at least 1 {currency}")

        payload = {
            "email": email,
            "amount": amount_in_smallest_unit,
            "currency": currency,
            "reference": reference,
            "metadata": metadata,
            "callback_url": f"{settings.APP_BASE_URL}/checkout",
        }

        logger.info(f"Initializing Paystack transaction: {payload}")

        try:
            with httpx.Client(timeout=15) as client:
                res = client.post(
                    f"{PAYSTACK_BASE_URL}/transaction/initialize",
                    json=payload,
                    headers=self._headers(),
                )

                # Log response for debugging
                logger.info(f"Paystack response status: {res.status_code}")
                logger.info(f"Paystack response body: {res.text}")

                if res.status_code != 200:
                    error_data = (
                        res.json()
                        if res.headers.get("content-type") == "application/json"
                        else {}
                    )
                    error_message = error_data.get("message", f"HTTP {res.status_code}")

                    if res.status_code == 401:
                        raise Exception(
                            "Invalid Paystack secret key. Check your PAYSTACK_SECRET_KEY"
                        )
                    elif res.status_code == 403:
                        raise Exception(
                            f"Paystack 403 Forbidden. This could be due to:\n"
                            f"1. Unsupported currency: {currency}\n"
                            f"2. Account restrictions\n"
                            f"3. Business not fully set up\n"
                            f"Error: {error_message}"
                        )
                    elif res.status_code == 404:
                        raise Exception(f"Paystack endpoint not found: {error_message}")
                    else:
                        raise Exception(f"Paystack API error: {error_message}")

                res.raise_for_status()
                data = res.json()["data"]

        except httpx.HTTPStatusError as e:
            if e.response.status_code == 403:
                raise Exception(
                    "Paystack returned 403 Forbidden during transaction initialization. "
                    "Please check that your Paystack account is fully set up and "
                    "that you're using a supported currency."
                )
            raise Exception(f"Paystack HTTP error: {e.response.status_code}")
        except Exception as e:
            logger.error(f"Paystack initialize transaction error: {str(e)}")
            raise

        return InitializedTransaction(
            reference=data["reference"],
            authorization_url=data["authorization_url"],
            provider="paystack",
        )

    def verify_transaction(self, reference: str) -> VerifiedTransaction:
        try:
            with httpx.Client(timeout=15) as client:
                res = client.get(
                    f"{PAYSTACK_BASE_URL}/transaction/verify/{reference}",
                    headers=self._headers(),
                )

                if res.status_code != 200:
                    error_data = (
                        res.json()
                        if res.headers.get("content-type") == "application/json"
                        else {}
                    )
                    error_message = error_data.get("message", f"HTTP {res.status_code}")
                    raise Exception(f"Paystack verify error: {error_message}")

                res.raise_for_status()
                data = res.json()["data"]

        except Exception as e:
            logger.error(f"Paystack verify transaction error: {str(e)}")
            raise

        return VerifiedTransaction(
            reference=reference,
            status="success" if data.get("status") == "success" else "failed",
            amount=(data.get("amount") or 0) / 100,
            currency=data.get("currency", "GHS"),
            provider="paystack",
            metadata=data.get("metadata") or {},
        )