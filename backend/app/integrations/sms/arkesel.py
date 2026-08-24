import httpx

from app.core.config import settings
from app.integrations.sms.base import SMSProvider

ARKESEL_BASE_URL = "https://sms.arkesel.com/api/v2/sms/send"


class ArkeselSMSProvider(SMSProvider):
    """Real Arkesel integration. Requires ARKESEL_API_KEY."""

    def send(self, *, to: str, message: str) -> bool:
        payload = {
            "sender": settings.ARKESEL_SENDER_ID,
            "message": message,
            "recipients": [to],
        }
        headers = {
            "api-key": settings.ARKESEL_API_KEY,
            "Content-Type": "application/json",
        }
        with httpx.Client(timeout=15) as client:
            res = client.post(ARKESEL_BASE_URL, json=payload, headers=headers)
            res.raise_for_status()
        return True
