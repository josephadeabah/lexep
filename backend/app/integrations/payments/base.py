"""
Payment provider abstraction.

Every payment-touching endpoint in this app talks to `get_payment_provider()`,
never to a specific vendor SDK directly. Today only Paystack is implemented,
but adding a second provider (Stripe, Flutterwave, ...) means writing one new
class here and adding a branch in the factory — nothing else in the app
needs to change.
"""
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional


@dataclass
class InitializedTransaction:
    reference: str
    authorization_url: Optional[str]  # None for providers that don't redirect (e.g. a mock)
    provider: str


@dataclass
class VerifiedTransaction:
    reference: str
    status: str  # "success" | "failed" | "pending"
    amount: float
    currency: str
    provider: str
    metadata: dict


class PaymentProvider(ABC):
    @abstractmethod
    def initialize_transaction(
        self, *, amount: float, currency: str, email: str, reference: str, metadata: dict
    ) -> InitializedTransaction: ...

    @abstractmethod
    def verify_transaction(self, reference: str) -> VerifiedTransaction: ...
