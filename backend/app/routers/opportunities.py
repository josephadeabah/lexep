from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api_deps import get_current_user_optional, require_role
from app.core.database import get_db
from app.models.enums import UserRole
from app.models.opportunity import Application, Opportunity
from app.models.user import LearnerProfile, User
from app.schemas.opportunity import (
    ApplicantOut,
    ApplicationCreate,
    ApplicationStatusUpdate,
    MyApplicationOut,
    OpportunityCreate,
    OpportunityOut,
)

router = APIRouter(prefix="/api/opportunities", tags=["opportunities"])


@router.post("", response_model=OpportunityOut, status_code=201)
def create_opportunity(
    payload: OpportunityCreate,
    db: Session = Depends(get_db),
    company: User = Depends(require_role(UserRole.COMPANY)),
):
    """'Post an Internship' wizard — final submit."""
    opportunity = Opportunity(company_id=company.id, **payload.model_dump())
    db.add(opportunity)
    db.commit()
    db.refresh(opportunity)
    return opportunity


def _with_company_name(opportunity: Opportunity, db: Session) -> OpportunityOut:
    company = db.get(User, opportunity.company_id)
    out = OpportunityOut.model_validate(opportunity)
    out.company_name = company.full_name if company else None
    return out


@router.get("", response_model=list[OpportunityOut])
def list_opportunities(
    company_only_mine: bool = False,
    published_only: bool = False,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """Powers both the company's 'Active Listings' table and the learner-facing
    'Internship Board' browse view (pass published_only=true for the latter, no auth required).
    """
    query = db.query(Opportunity)
    if company_only_mine:
        if not user:
            raise HTTPException(
                status_code=401, detail="Sign in to view your listings."
            )
        query = query.filter(Opportunity.company_id == user.id)
    if published_only:
        query = query.filter(Opportunity.status == "published")
    opportunities = query.order_by(Opportunity.created_at.desc()).all()
    return [_with_company_name(o, db) for o in opportunities]


@router.get("/{opportunity_id}", response_model=OpportunityOut)
def get_opportunity(opportunity_id: int, db: Session = Depends(get_db)):
    opportunity = db.get(Opportunity, opportunity_id)
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found.")
    return _with_company_name(opportunity, db)


@router.get("/{opportunity_id}/applicants", response_model=list[ApplicantOut])
def list_applicants(
    opportunity_id: int,
    sort_by: str = "match_score",
    db: Session = Depends(get_db),
    company: User = Depends(require_role(UserRole.COMPANY)),
):
    """Populates the 'Applicant Review' board, sorted by match score by default."""
    applications = (
        db.query(Application).filter(Application.opportunity_id == opportunity_id).all()
    )

    results: list[ApplicantOut] = []
    for app in applications:
        applicant = db.get(User, app.applicant_id)
        learner_profile = (
            db.query(LearnerProfile)
            .filter(LearnerProfile.user_id == applicant.id)
            .first()
        )
        results.append(
            ApplicantOut(
                id=app.id,
                applicant_name=applicant.full_name,
                applicant_avatar=applicant.avatar_url,
                institution=learner_profile.institution if learner_profile else None,
                education=learner_profile.field_of_study if learner_profile else None,
                skills=learner_profile.career_interests if learner_profile else [],
                match_score=app.match_score,
                status=app.status,
            )
        )

    reverse = sort_by == "match_score"
    results.sort(key=lambda r: (r.match_score or 0), reverse=reverse)
    return results


@router.post("/apply", response_model=MyApplicationOut, status_code=201)
def apply_to_opportunity(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    learner: User = Depends(require_role(UserRole.LEARNER)),
):
    opportunity = db.get(Opportunity, payload.opportunity_id)
    if not opportunity:
        raise HTTPException(status_code=404, detail="Opportunity not found.")

    existing = (
        db.query(Application)
        .filter(
            Application.opportunity_id == opportunity.id,
            Application.applicant_id == learner.id,
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=400, detail="You already applied to this opportunity."
        )

    application = Application(
        opportunity_id=opportunity.id,
        applicant_id=learner.id,
        cover_note=payload.cover_note,
        qualification=payload.qualification,
        years_experience=payload.years_experience,
        why_interested=payload.why_interested,
        portfolio_link=payload.portfolio_link,
        resume_filename=payload.resume_filename,
        additional_info=payload.additional_info,
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    company = db.get(User, opportunity.company_id)
    return MyApplicationOut(
        id=application.id,
        opportunity_title=opportunity.title,
        company_name=company.full_name if company else "Unknown",
        location=opportunity.location,
        status=application.status,
        applied_at=application.applied_at,
    )


@router.get("/applications/mine", response_model=list[MyApplicationOut])
def my_applications(
    db: Session = Depends(get_db),
    learner: User = Depends(require_role(UserRole.LEARNER)),
):
    """Powers the 'My Applications' screen."""
    applications = (
        db.query(Application).filter(Application.applicant_id == learner.id).all()
    )

    out: list[MyApplicationOut] = []
    for app in applications:
        opportunity = db.get(Opportunity, app.opportunity_id)
        company = db.get(User, opportunity.company_id) if opportunity else None
        out.append(
            MyApplicationOut(
                id=app.id,
                opportunity_title=opportunity.title if opportunity else "Unknown role",
                company_name=company.full_name if company else "Unknown company",
                location=opportunity.location if opportunity else None,
                status=app.status,
                applied_at=app.applied_at,
            )
        )
    return out


@router.patch("/applications/{application_id}/status", response_model=ApplicantOut)
def update_application_status(
    application_id: int,
    payload: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    company: User = Depends(require_role(UserRole.COMPANY)),
):
    application = db.get(Application, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")

    application.status = payload.status
    db.add(application)
    db.commit()
    db.refresh(application)

    applicant = db.get(User, application.applicant_id)
    learner_profile = (
        db.query(LearnerProfile).filter(LearnerProfile.user_id == applicant.id).first()
    )
    return ApplicantOut(
        id=application.id,
        applicant_name=applicant.full_name,
        applicant_avatar=applicant.avatar_url,
        institution=learner_profile.institution if learner_profile else None,
        education=learner_profile.field_of_study if learner_profile else None,
        skills=learner_profile.career_interests if learner_profile else [],
        match_score=application.match_score,
        status=application.status,
    )
