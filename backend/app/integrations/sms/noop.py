import logging

from app.integrations.sms.base import SMSProvider

logger = logging.getLogger("lexep.sms")


class NoopSMSProvider(SMSProvider):
    """Used whenever SMS_ENABLED is false (the default). Logs instead of
    sending. Flip SMS_ENABLED=true and set ARKESEL_API_KEY to go live."""

    def send(self, *, to: str, message: str) -> bool:
        logger.info("[sms disabled] would send %r to %s", message, to)
        return True
