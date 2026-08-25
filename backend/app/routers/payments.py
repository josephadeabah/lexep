import secrets
import hmac
import hashlib
import json
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session

from app.api_deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.integrations.payments import get_payment_provider
from app.models.billing import Subscription, Transaction
from app.models.enums import (
    BillingCycle,
    SubscriptionPlan,
    SubscriptionStatus,
    TransactionStatus,
    TransactionType,
)
from app.models.grant import Contribution, GrantGroup
from app.models.user import User
from app.schemas.billing import (
    CheckoutContributionRequest,
    CheckoutResponse,
    CheckoutSubscriptionRequest,
    PricingPlanOut,
    PublicConfigOut,
    SubscriptionOut,
    VerifyPaymentResponse,
)

router = APIRouter(prefix="/api", tags=["payments"])

# Use GHS as default currency
DEFAULT_CURRENCY = "GHS"

PLAN_PRICING: dict[SubscriptionPlan, dict] = {
    SubscriptionPlan.LEARNER_PLUS: dict(
        name="Learner Plus",
        audience="Accelerate your learning and secure internships.",
        monthly_price=150,  # GHS 150
        annual_price=1440,  # GHS 1,440
        features=[
            "Access to all advanced learning paths",
            "Priority internship placement",
            "1-on-1 monthly mentorship session",
            "Portfolio reviews",
        ],
    ),
    SubscriptionPlan.MENTOR_PRO: dict(
        name="Mentor Pro",
        audience="Expand your influence and track student progress.",
        monthly_price=490,  # GHS 490
        annual_price=4700,  # GHS 4,700
        is_popular=True,
        features=[
            "Enhanced visibility in mentor directory",
            "Advanced student progress analytics",
            "Unlimited direct messaging",
            "Create custom masterclasses",
        ],
    ),
    SubscriptionPlan.ENTERPRISE: dict(
        name="Enterprise",
        audience="Sponsor students and source top architectural talent.",
        is_custom=True,
        features=[
            "Bulk student sponsorship packages",
            "Exclusive talent sourcing CRM",
            "Dedicated account manager",
            "Custom branding on learning paths",
        ],
    ),
}


@router.get("/config", response_model=PublicConfigOut)
def public_config():
    """Feature flags the frontend reads before login to decide whether to
    show premium/paywall UI at all."""
    return PublicConfigOut(
        premium_features_enabled=settings.PREMIUM_FEATURES_ENABLED,
        payments_enabled=settings.PAYMENTS_ENABLED,
        paystack_public_key=settings.PAYSTACK_PUBLIC_KEY,
    )


@router.get("/plans", response_model=list[PricingPlanOut])
def list_plans():
    """Powers the public Pricing page."""
    return [
        PricingPlanOut(id=plan_id, **data) for plan_id, data in PLAN_PRICING.items()
    ]


def _price_for(plan: SubscriptionPlan, cycle: BillingCycle) -> float:
    data = PLAN_PRICING.get(plan)
    if not data or data.get("is_custom"):
        raise HTTPException(
            status_code=400, detail="This plan requires contacting sales."
        )
    return (
        data["annual_price"] if cycle == BillingCycle.ANNUAL else data["monthly_price"]
    )


@router.post("/checkout/subscription", response_model=CheckoutResponse)
def checkout_subscription(
    payload: CheckoutSubscriptionRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Powers the 'Select Your Plan' -> Checkout flow."""
    if not settings.PREMIUM_FEATURES_ENABLED:
        raise HTTPException(
            status_code=403,
            detail="Premium features are not enabled on this platform yet.",
        )

    amount = _price_for(payload.plan, payload.billing_cycle)
    reference = f"sub_{secrets.token_hex(8)}"

    subscription = Subscription(
        user_id=user.id,
        plan=payload.plan,
        billing_cycle=payload.billing_cycle,
        status=SubscriptionStatus.PENDING,
        amount=amount,
        currency=DEFAULT_CURRENCY,
        provider=settings.PAYMENTS_PROVIDER if settings.PAYMENTS_ENABLED else "mock",
        provider_reference=reference,
    )
    db.add(subscription)
    db.flush()

    transaction = Transaction(
        user_id=user.id,
        purpose=TransactionType.SUBSCRIPTION,
        reference_id=subscription.id,
        amount=amount,
        currency=DEFAULT_CURRENCY,
        provider=subscription.provider,
        provider_reference=reference,
        status=TransactionStatus.PENDING,
    )
    db.add(transaction)
    db.commit()

    provider = get_payment_provider()
    initialized = provider.initialize_transaction(
        amount=amount,
        currency=DEFAULT_CURRENCY,
        email=user.email,
        reference=reference,
        metadata={"purpose": "subscription", "subscription_id": subscription.id},
    )
    return CheckoutResponse(
        reference=initialized.reference,
        authorization_url=initialized.authorization_url,
        provider=initialized.provider,
        amount=amount,
        currency=DEFAULT_CURRENCY,
    )


@router.post("/checkout/contribution", response_model=CheckoutResponse)
def checkout_contribution(
    payload: CheckoutContributionRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Powers the 'Contribute Now' payment flow on a grant group page."""
    group = db.get(GrantGroup, payload.group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found.")

    reference = f"gc_{secrets.token_hex(8)}"
    transaction = Transaction(
        user_id=user.id,
        purpose=TransactionType.GRANT_CONTRIBUTION,
        reference_id=group.id,
        amount=payload.amount,
        currency=DEFAULT_CURRENCY,
        provider=settings.PAYMENTS_PROVIDER if settings.PAYMENTS_ENABLED else "mock",
        provider_reference=reference,
        status=TransactionStatus.PENDING,
        meta={"contributor_name": payload.contributor_name or user.full_name},
    )
    db.add(transaction)
    db.commit()

    provider = get_payment_provider()
    initialized = provider.initialize_transaction(
        amount=payload.amount,
        currency=DEFAULT_CURRENCY,
        email=user.email,
        reference=reference,
        metadata={"purpose": "grant_contribution", "group_id": group.id},
    )
    return CheckoutResponse(
        reference=initialized.reference,
        authorization_url=initialized.authorization_url,
        provider=initialized.provider,
        amount=payload.amount,
        currency=DEFAULT_CURRENCY,
    )


@router.post("/checkout/verify/{reference}", response_model=VerifyPaymentResponse)
def verify_payment(
    reference: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Powers the checkout callback / 'Upgrade Successful' page — call this
    after redirect back from the payment provider (or immediately, when
    running with the mock provider) to finalize the transaction."""
    transaction = (
        db.query(Transaction)
        .filter(Transaction.provider_reference == reference)
        .first()
    )
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found.")

    if transaction.status == TransactionStatus.SUCCESS:
        return VerifyPaymentResponse(
            reference=reference,
            status=transaction.status,
            purpose=transaction.purpose,
            amount=transaction.amount,
        )

    provider = get_payment_provider()
    verified = provider.verify_transaction(reference)

    transaction.status = (
        TransactionStatus.SUCCESS
        if verified.status == "success"
        else TransactionStatus.FAILED
    )
    db.add(transaction)

    if transaction.status == TransactionStatus.SUCCESS:
        if transaction.purpose == TransactionType.SUBSCRIPTION:
            subscription = db.get(Subscription, transaction.reference_id)
            if subscription:
                subscription.status = SubscriptionStatus.ACTIVE
                db.add(subscription)
        elif transaction.purpose == TransactionType.GRANT_CONTRIBUTION:
            group = db.get(GrantGroup, transaction.reference_id)
            if group:
                group.raised_amount += transaction.amount
                db.add(
                    Contribution(
                        group_id=group.id,
                        contributor_id=user.id,
                        contributor_name=transaction.meta.get("contributor_name")
                        or user.full_name,
                        amount=transaction.amount,
                    )
                )
                db.add(group)

    db.commit()
    return VerifyPaymentResponse(
        reference=reference,
        status=transaction.status,
        purpose=transaction.purpose,
        amount=transaction.amount,
    )


@router.get("/subscriptions/me", response_model=Optional[SubscriptionOut])
def my_subscription(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    sub = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == user.id,
            Subscription.status == SubscriptionStatus.ACTIVE,
        )
        .order_by(Subscription.created_at.desc())
        .first()
    )
    return sub


@router.post("/webhooks/paystack")
async def paystack_webhook(
    request: Request,
    db: Session = Depends(get_db),
    x_paystack_signature: str = Header(None),
):
    """
    Handle Paystack webhook notifications.
    This endpoint receives payment events from Paystack.
    """
    # Get raw request body for signature verification
    payload = await request.body()

    # Verify the webhook signature
    if not verify_paystack_signature(payload, x_paystack_signature):
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Parse the webhook data
    try:
        data = json.loads(payload)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    # Handle the event
    event_type = data.get("event")
    event_data = data.get("data", {})

    if event_type == "charge.success":
        reference = event_data.get("reference")

        # Find the transaction
        transaction = (
            db.query(Transaction)
            .filter(Transaction.provider_reference == reference)
            .first()
        )

        if transaction:
            # Verify with Paystack API
            provider = get_payment_provider()
            verified = provider.verify_transaction(reference)

            if verified.status == "success":
                # Update transaction status
                transaction.status = TransactionStatus.SUCCESS
                db.add(transaction)

                # Update related records
                if transaction.purpose == TransactionType.SUBSCRIPTION:
                    subscription = db.get(Subscription, transaction.reference_id)
                    if subscription:
                        subscription.status = SubscriptionStatus.ACTIVE
                        db.add(subscription)

                elif transaction.purpose == TransactionType.GRANT_CONTRIBUTION:
                    group = db.get(GrantGroup, transaction.reference_id)
                    if group:
                        group.raised_amount += transaction.amount
                        db.add(
                            Contribution(
                                group_id=group.id,
                                contributor_id=transaction.user_id,
                                contributor_name=transaction.meta.get(
                                    "contributor_name"
                                )
                                or "Anonymous",
                                amount=transaction.amount,
                            )
                        )
                        db.add(group)

                db.commit()
                print(f"Payment successful for reference: {reference}")

    elif event_type == "charge.failed":
        reference = event_data.get("reference")
        transaction = (
            db.query(Transaction)
            .filter(Transaction.provider_reference == reference)
            .first()
        )
        if transaction:
            transaction.status = TransactionStatus.FAILED
            db.add(transaction)
            db.commit()
            print(f"Payment failed for reference: {reference}")

    # Always return 200 to acknowledge receipt
    return {"status": "success"}


def verify_paystack_signature(payload: bytes, signature: str) -> bool:
    """Verify that the webhook request is genuinely from Paystack."""
    if not signature or not settings.PAYSTACK_SECRET_KEY:
        return False

    # Paystack signs the payload using HMAC-SHA512 with the secret key
    computed_signature = hmac.new(
        settings.PAYSTACK_SECRET_KEY.encode("utf-8"), payload, hashlib.sha512
    ).hexdigest()

    return hmac.compare_digest(computed_signature, signature)