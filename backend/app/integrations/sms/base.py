from abc import ABC, abstractmethod


class SMSProvider(ABC):
    @abstractmethod
    def send(self, *, to: str, message: str) -> bool: ...
