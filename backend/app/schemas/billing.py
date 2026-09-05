from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import BillingCycle, SubscriptionPlan, SubscriptionStatus, TransactionStatus, TransactionType


class PlanFeature(BaseModel):
    label: str


class PricingPlanOut(BaseModel):
    id: SubscriptionPlan
    name: str
    audience: str
    monthly_price: Optional[float] = None
    annual_price: Optional[float] = None
    is_custom: bool = False
    is_popular: bool = False
    features: list[str]


class CheckoutSubscriptionRequest(BaseModel):
    plan: SubscriptionPlan
    billing_cycle: BillingCycle = BillingCycle.MONTHLY


class CheckoutContributionRequest(BaseModel):
    group_id: int
    amount: float
    contributor_name: Optional[str] = None


class CheckoutResponse(BaseModel):
    reference: str
    authorization_url: Optional[str] = None
    provider: str
    amount: float
    currency: str


class VerifyPaymentResponse(BaseModel):
    reference: str
    status: TransactionStatus
    purpose: TransactionType
    amount: float


class SubscriptionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    plan: SubscriptionPlan
    billing_cycle: BillingCycle
    status: SubscriptionStatus
    amount: float
    currency: str
    renews_at: Optional[datetime] = None
    created_at: datetime


class PublicConfigOut(BaseModel):
    """Feature flags the frontend needs before login (e.g. to hide premium
    CTAs entirely while the paywall is off)."""

    premium_features_enabled: bool
    payments_enabled: bool
    paystack_public_key: str
