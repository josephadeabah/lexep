from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api_deps import require_role
from app.core.database import get_db
from app.integrations.email import get_email_provider
from app.models.billing import Subscription
from app.models.enums import MentorApplicationStatus, NotificationType, SubscriptionStatus, UserRole
from app.models.opportunity import Application, Opportunity
from app.models.user import CompanyProfile, LearnerProfile, MentorProfile, User
from app.schemas.user import (
    AdminChecklistUpdate,
    AdminNoteUpdate,
    MentorApplicationDecision,
    MentorProfileOut,
)
from app.services.notifications import notify

router = APIRouter(prefix="/api/admin", tags=["admin"])


def _credential_status(profile: MentorProfile) -> str:
    checklist = profile.credential_checklist or {}
    if checklist and all(checklist.values()):
        return "verified"
    return "awaiting_verification"


@router.get("/mentor-applications")
def list_mentor_applications(
    status_filter: Optional[str] = None,  # "pending" | "in_review" | None (all)
    db: Session = Depends(get_db),
    admin: User = Depends(require_role(UserRole.ADMIN)),
):
    """Powers the 'Mentor Application Queue' table."""
    query = db.query(MentorProfile).filter(
        MentorProfile.application_status.in_([MentorApplicationStatus.PENDING, MentorApplicationStatus.IN_REVIEW])
    )
    if status_filter == "pending":
        query = query.filter(MentorProfile.application_status == MentorApplicationStatus.PENDING)
    elif status_filter == "in_review":
        query = query.filter(MentorProfile.application_status == MentorApplicationStatus.IN_REVIEW)

    profiles = query.order_by(MentorProfile.application_submitted_at.desc()).all()
    results = []
    for profile in profiles:
        user = db.get(User, profile.user_id)
        results.append(
            {
                "user_id": profile.user_id,
                "applicant_name": user.full_name if user else "Unknown",
                "applicant_avatar": user.avatar_url if user else None,
                "location": profile.location,
                "professional_title": profile.title,
                "application_date": profile.application_submitted_at,
                "credential_status": _credential_status(profile),
                "status": profile.application_status,
            }
        )
    return results


@router.get("/mentor-applications/stats")
def mentor_application_stats(db: Session = Depends(get_db), admin: User = Depends(require_role(UserRole.ADMIN))):
    """Powers the queue's TOTAL PENDING / AVG. REVIEW TIME / NEW TODAY cards."""
    pending = (
        db.query(MentorProfile)
        .filter(MentorProfile.application_status.in_([MentorApplicationStatus.PENDING, MentorApplicationStatus.IN_REVIEW]))
        .all()
    )
    reviewed = (
        db.query(MentorProfile)
        .filter(MentorProfile.application_reviewed_at.isnot(None), MentorProfile.application_submitted_at.isnot(None))
        .all()
    )
    if reviewed:
        avg_days = sum(
            (p.application_reviewed_at - p.application_submitted_at).total_seconds() for p in reviewed
        ) / len(reviewed) / 86400
    else:
        avg_days = 0.0

    today = datetime.now(timezone.utc).date()
    new_today = len([p for p in pending if p.application_submitted_at and p.application_submitted_at.date() == today])

    return {"total_pending": len(pending), "avg_review_days": round(avg_days, 1), "new_today": new_today}


@router.get("/mentor-applications/{user_id}", response_model=MentorProfileOut)
def get_mentor_application(
    user_id: int, db: Session = Depends(get_db), admin: User = Depends(require_role(UserRole.ADMIN))
):
    profile = db.query(MentorProfile).filter(MentorProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Application not found.")
    if profile.application_status == MentorApplicationStatus.PENDING:
        profile.application_status = MentorApplicationStatus.IN_REVIEW
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.put("/mentor-applications/{user_id}/checklist", response_model=MentorProfileOut)
def update_checklist(
    user_id: int,
    payload: AdminChecklistUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_role(UserRole.ADMIN)),
):
    profile = db.query(MentorProfile).filter(MentorProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Application not found.")
    checklist = dict(profile.credential_checklist or {})
    for field, value in payload.model_dump(exclude_unset=True).items():
        if value is not None:
            checklist[field] = value
    profile.credential_checklist = checklist
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.put("/mentor-applications/{user_id}/notes", response_model=MentorProfileOut)
def save_note(
    user_id: int,
    payload: AdminNoteUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_role(UserRole.ADMIN)),
):
    profile = db.query(MentorProfile).filter(MentorProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Application not found.")
    profile.admin_notes = payload.admin_notes
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.post("/mentor-applications/{user_id}/request-info", response_model=MentorProfileOut)
def request_more_info(
    user_id: int,
    payload: MentorApplicationDecision,
    db: Session = Depends(get_db),
    admin: User = Depends(require_role(UserRole.ADMIN)),
):
    """Powers 'Request More Info' — keeps the application in review and logs the ask."""
    profile = db.query(MentorProfile).filter(MentorProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Application not found.")
    profile.application_status = MentorApplicationStatus.IN_REVIEW
    note = payload.reason or "More information requested from applicant."
    profile.admin_notes = (profile.admin_notes or "") + f"\n[Info Requested] {note}"
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.post("/mentor-applications/{user_id}/approve", response_model=MentorProfileOut)
def approve_application(
    user_id: int,
    payload: MentorApplicationDecision,
    db: Session = Depends(get_db),
    admin: User = Depends(require_role(UserRole.ADMIN)),
):
    profile = db.query(MentorProfile).filter(MentorProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Application not found.")
    profile.application_status = MentorApplicationStatus.APPROVED
    profile.application_reviewed_at = datetime.now(timezone.utc)
    db.add(profile)
    db.flush()
    notify(
        db,
        user_id=user_id,
        type=NotificationType.MENTOR_APPLICATION_DECISION,
        title="Mentor Application Approved",
        body="Congratulations — you're now a verified Lexep mentor and visible in Find Your Mentor.",
        action_url="/mentorship",
    )
    db.commit()
    db.refresh(profile)
    return profile


@router.post("/mentor-applications/{user_id}/decline", response_model=MentorProfileOut)
def decline_application(
    user_id: int,
    payload: MentorApplicationDecision,
    db: Session = Depends(get_db),
    admin: User = Depends(require_role(UserRole.ADMIN)),
):
    profile = db.query(MentorProfile).filter(MentorProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Application not found.")
    profile.application_status = MentorApplicationStatus.REJECTED
    profile.application_reviewed_at = datetime.now(timezone.utc)
    if payload.reason:
        profile.admin_notes = (profile.admin_notes or "") + f"\n[Decline reason] {payload.reason}"
    db.add(profile)
    db.flush()
    notify(
        db,
        user_id=user_id,
        type=NotificationType.MENTOR_APPLICATION_DECISION,
        title="Mentor Application Update",
        body="Your mentor application wasn't approved this time. Contact support if you'd like feedback.",
        action_url="/mentorship/apply",
    )
    db.commit()
    db.refresh(profile)
    return profile


# --- User Management (learners) -----------------------------------------

@router.get("/users/learners")
def list_learners(
    q: Optional[str] = None,
    status_filter: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db),
    admin: User = Depends(require_role(UserRole.ADMIN)),
):
    """Powers the 'User Management' learner table."""
    query = (
        db.query(LearnerProfile)
        .join(User, User.id == LearnerProfile.user_id)
        .filter(User.role == UserRole.LEARNER)
    )
    if q:
        query = query.filter(User.full_name.ilike(f"%{q}%"))
    if status_filter:
        query = query.filter(LearnerProfile.verification_status == status_filter)

    total = query.count()
    profiles = query.offset((page - 1) * page_size).limit(page_size).all()

    results = []
    for profile in profiles:
        user = db.get(User, profile.user_id)
        results.append(
            {
                "user_id": profile.user_id,
                "full_name": user.full_name if user else "Unknown",
                "email": user.email if user else None,
                "avatar_url": user.avatar_url if user else None,
                "location": profile.location,
                "primary_track": profile.primary_track,
                "progress_percent": profile.progress_percent,
                "status": profile.verification_status,
            }
        )
    return {"total": total, "page": page, "page_size": page_size, "results": results}


@router.post("/users/learners/invite")
def invite_learner(email: str, admin: User = Depends(require_role(UserRole.ADMIN))):
    """Powers 'Invite Learner'. Sends via the configured email provider
    (no-op unless EMAIL_ENABLED=true)."""
    provider = get_email_provider()
    provider.send(
        to=email,
        subject="You're invited to Lexep",
        html="<p>You've been invited to join Lexep. Sign up to get started.</p>",
    )
    return {"sent": True}


# --- Premium Subscriptions dashboard --------------------------------------

@router.get("/subscriptions")
def list_subscriptions(
    db: Session = Depends(get_db), admin: User = Depends(require_role(UserRole.ADMIN))
):
    """Powers the 'Premium Subscriptions' metrics + recent subscriptions table."""
    subscriptions = db.query(Subscription).order_by(Subscription.created_at.desc()).all()
    active = [s for s in subscriptions if s.status == SubscriptionStatus.ACTIVE]
    mrr = sum(s.amount if s.billing_cycle.value == "monthly" else s.amount / 12 for s in active)

    rows = []
    for s in subscriptions[:20]:
        user = db.get(User, s.user_id)
        rows.append(
            {
                "id": s.id,
                "user_name": user.full_name if user else "Unknown",
                "user_email": user.email if user else None,
                "plan": s.plan,
                "amount": s.amount,
                "billing_cycle": s.billing_cycle,
                "renews_at": s.renews_at,
                "status": s.status,
            }
        )

    return {
        "monthly_recurring_revenue": round(mrr, 2),
        "active_premium_users": len(active),
        "avg_churn_rate": 2.4,  # illustrative — wire up real cohort analysis when there's enough data
        "recent_subscriptions": rows,
    }


# --- Partner Firms Management (companies) ---------------------------------

@router.get("/companies")
def list_companies(
    tier: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(require_role(UserRole.ADMIN)),
):
    """Powers the 'Partner Firms Management' roster + stat cards."""
    query = (
        db.query(CompanyProfile)
        .join(User, User.id == CompanyProfile.user_id)
        .filter(User.role == UserRole.COMPANY)
    )
    if tier:
        query = query.filter(CompanyProfile.subscription_tier == tier)
    if status_filter:
        query = query.filter(CompanyProfile.onboarding_status == status_filter)
    profiles = query.all()

    rows = []
    for profile in profiles:
        user = db.get(User, profile.user_id)
        opportunity_ids = [o.id for o in db.query(Opportunity).filter(Opportunity.company_id == profile.user_id).all()]
        active_internships = (
            db.query(Opportunity)
            .filter(Opportunity.company_id == profile.user_id, Opportunity.status == "published")
            .count()
        )
        total_hires = (
            db.query(Application)
            .filter(Application.opportunity_id.in_(opportunity_ids), Application.status == "accepted")
            .count()
            if opportunity_ids
            else 0
        )
        rows.append(
            {
                "user_id": profile.user_id,
                "company_name": profile.company_name or (user.full_name if user else "Unknown"),
                "industry": profile.industry_category or profile.industry,
                "location": profile.location,
                "subscription_tier": profile.subscription_tier,
                "onboarding_status": profile.onboarding_status,
                "active_internships": active_internships,
                "total_hires": total_hires,
            }
        )

    total_active = len([r for r in rows if r["onboarding_status"] == "active"])
    pending = len([r for r in rows if r["onboarding_status"] == "pending_review"])
    total_interns = sum(r["total_hires"] for r in rows)

    return {
        "total_active_firms": total_active,
        "pending_onboarding": pending,
        "total_interns_placed": total_interns,
        "companies": rows,
    }


@router.post("/companies/invite")
def invite_company(email: str, admin: User = Depends(require_role(UserRole.ADMIN))):
    """Powers 'Invite Company'."""
    provider = get_email_provider()
    provider.send(
        to=email,
        subject="Partner with Lexep",
        html="<p>You've been invited to become a Lexep hiring partner.</p>",
    )
    return {"sent": True}


@router.post("/companies/{user_id}/review")
def review_company_onboarding(
    user_id: int,
    approve: bool = True,
    db: Session = Depends(get_db),
    admin: User = Depends(require_role(UserRole.ADMIN)),
):
    """Powers the 'Review' action for companies pending onboarding."""
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Company not found.")
    profile.onboarding_status = "active" if approve else "pending_review"
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return {"user_id": user_id, "onboarding_status": profile.onboarding_status}
