import logging

from app.integrations.email.base import EmailProvider

logger = logging.getLogger("lexep.email")


class NoopEmailProvider(EmailProvider):
    """Used whenever EMAIL_ENABLED is false (the default). Logs instead of
    sending, so every code path that sends email keeps working without a
    Brevo account. Flip EMAIL_ENABLED=true and set BREVO_API_KEY to go live."""

    def send(self, *, to: str, subject: str, html: str) -> bool:
        logger.info("[email disabled] would send %r to %s", subject, to)
        return True
