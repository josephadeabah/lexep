import httpx

from app.core.config import settings
from app.integrations.email.base import EmailProvider

BREVO_BASE_URL = "https://api.brevo.com/v3"


class BrevoEmailProvider(EmailProvider):
    """Real Brevo (formerly Sendinblue) integration. Requires BREVO_API_KEY."""

    def send(self, *, to: str, subject: str, html: str) -> bool:
        payload = {
            "sender": {"email": settings.EMAIL_FROM_ADDRESS, "name": settings.EMAIL_FROM_NAME},
            "to": [{"email": to}],
            "subject": subject,
            "htmlContent": html,
        }
        headers = {"api-key": settings.BREVO_API_KEY, "Content-Type": "application/json"}
        with httpx.Client(timeout=15) as client:
            res = client.post(f"{BREVO_BASE_URL}/smtp/email", json=payload, headers=headers)
            res.raise_for_status()
        return True
