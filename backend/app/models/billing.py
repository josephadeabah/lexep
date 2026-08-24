from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Enum, Float, ForeignKey, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import BillingCycle, SubscriptionPlan, SubscriptionStatus, TransactionStatus, TransactionType


class Subscription(Base):
    """A premium subscription (Learner Plus / Mentor Pro / Enterprise)."""

    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    plan: Mapped[SubscriptionPlan] = mapped_column(Enum(SubscriptionPlan))
    billing_cycle: Mapped[BillingCycle] = mapped_column(Enum(BillingCycle), default=BillingCycle.MONTHLY)
    status: Mapped[SubscriptionStatus] = mapped_column(Enum(SubscriptionStatus), default=SubscriptionStatus.PENDING)

    amount: Mapped[float] = mapped_column(Float, default=0)
    currency: Mapped[str] = mapped_column(String(10), default="USD")

    provider: Mapped[str] = mapped_column(String(30), default="mock")
    provider_reference: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    renews_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Transaction(Base):
    """A single payment attempt — for a premium subscription or a grant
    contribution. Kept generic (`purpose` + `reference_id`) so new payable
    things don't need a new table."""

    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)

    purpose: Mapped[TransactionType] = mapped_column(Enum(TransactionType))
    reference_id: Mapped[Optional[int]] = mapped_column(nullable=True)  # e.g. subscription_id or grant_group_id

    amount: Mapped[float] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    provider: Mapped[str] = mapped_column(String(30), default="mock")
    provider_reference: Mapped[str] = mapped_column(String(255), unique=True)
    status: Mapped[TransactionStatus] = mapped_column(Enum(TransactionStatus), default=TransactionStatus.PENDING)
    meta: Mapped[dict] = mapped_column(JSON, default=dict)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class IdempotencyRecord(Base):
    """Supports safe replay of queued offline mutations: the frontend's
    offline outbox (see frontend/lib/offline) attaches a client-generated
    Idempotency-Key header to every queued write. If the same key is seen
    twice (e.g. a sync retry after a flaky connection), we return the
    original response instead of creating a duplicate row."""

    __tablename__ = "idempotency_records"

    id: Mapped[int] = mapped_column(primary_key=True)
    key: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    endpoint: Mapped[str] = mapped_column(String(255))
    status_code: Mapped[int] = mapped_column()
    response_body: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
