from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api_deps import get_current_user, require_role
from app.core.database import get_db
from app.models.enums import MentorApplicationStatus, MentorshipRequestStatus, UserRole
from app.models.mentorship import MentorshipRequest
from app.models.user import MentorPackage, MentorProfile, User
from app.schemas.mentorship import MentorshipRequestCreate, MentorshipRequestOut
from app.schemas.user import (
    MentorApplicationStep1,
    MentorApplicationStep2,
    MentorApplicationStep3,
    MentorPackageCreate,
    MentorPackageOut,
    MentorProfileOut,
)

router = APIRouter(prefix="/api/mentors", tags=["mentors"])


def _request_out(request: MentorshipRequest, db: Session) -> MentorshipRequestOut:
    learner = db.get(User, request.learner_id)
    mentor = db.get(User, request.mentor_id)
    out = MentorshipRequestOut.model_validate(request)
    out.learner_name = learner.full_name if learner else None
    out.mentor_name = mentor.full_name if mentor else None
    return out


@router.get("", response_model=list[MentorProfileOut])
def find_mentors(
    q: Optional[str] = None,
    skill: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Powers 'Find Your Mentor'. Only approved, mentee-accepting mentors are listed."""
    query = (
        db.query(MentorProfile)
        .join(User, User.id == MentorProfile.user_id)
        .filter(MentorProfile.application_status == MentorApplicationStatus.APPROVED)
        .filter(MentorProfile.accepting_mentees.is_(True))
    )
    if q:
        query = query.filter(User.full_name.ilike(f"%{q}%"))
    mentors = query.all()

    if skill:
        mentors = [m for m in mentors if skill.lower() in [s.lower() for s in m.skills]]
    return mentors


# --- Mentor's own packages (management) --------------------------------

@router.get("/me/packages", response_model=list[MentorPackageOut])
def my_packages(db: Session = Depends(get_db), mentor: User = Depends(require_role(UserRole.MENTOR))):
    return db.query(MentorPackage).filter(MentorPackage.mentor_id == mentor.id).all()


@router.post("/me/packages", response_model=MentorPackageOut, status_code=201)
def create_package(
    payload: MentorPackageCreate,
    db: Session = Depends(get_db),
    mentor: User = Depends(require_role(UserRole.MENTOR)),
):
    """Powers 'Create New Package' on the Mentorship Packages management screen."""
    package = MentorPackage(mentor_id=mentor.id, **payload.model_dump())
    db.add(package)
    db.commit()
    db.refresh(package)
    return package


@router.patch("/me/packages/{package_id}", response_model=MentorPackageOut)
def update_package(
    package_id: int,
    payload: MentorPackageCreate,
    db: Session = Depends(get_db),
    mentor: User = Depends(require_role(UserRole.MENTOR)),
):
    package = db.get(MentorPackage, package_id)
    if not package or package.mentor_id != mentor.id:
        raise HTTPException(status_code=404, detail="Package not found.")
    for field, value in payload.model_dump().items():
        setattr(package, field, value)
    db.add(package)
    db.commit()
    db.refresh(package)
    return package


@router.patch("/me/packages/{package_id}/toggle", response_model=MentorPackageOut)
def toggle_package(
    package_id: int,
    db: Session = Depends(get_db),
    mentor: User = Depends(require_role(UserRole.MENTOR)),
):
    """Powers the on/off switch on each package card."""
    package = db.get(MentorPackage, package_id)
    if not package or package.mentor_id != mentor.id:
        raise HTTPException(status_code=404, detail="Package not found.")
    package.is_active = not package.is_active
    db.add(package)
    db.commit()
    db.refresh(package)
    return package


@router.get("/{mentor_user_id}", response_model=MentorProfileOut)
def get_mentor_profile(mentor_user_id: int, db: Session = Depends(get_db)):
    profile = db.query(MentorProfile).filter(MentorProfile.user_id == mentor_user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Mentor not found.")
    return profile


@router.get("/{mentor_user_id}/packages", response_model=list[MentorPackageOut])
def list_mentor_packages(mentor_user_id: int, db: Session = Depends(get_db)):
    """Public: powers the 'Mentorship Packages' section on a mentor's profile."""
    return (
        db.query(MentorPackage)
        .filter(MentorPackage.mentor_id == mentor_user_id, MentorPackage.is_active.is_(True))
        .all()
    )


# --- Mentorship requests (Request Session flow) --------------------------

@router.post("/requests", response_model=MentorshipRequestOut, status_code=201)
def request_mentorship(
    payload: MentorshipRequestCreate,
    db: Session = Depends(get_db),
    learner: User = Depends(require_role(UserRole.LEARNER)),
):
    """Powers 'Send Request' on the Request Session page."""
    request = MentorshipRequest(
        mentor_id=payload.mentor_id,
        learner_id=learner.id,
        package_id=payload.package_id,
        session_type=payload.session_type,
        message=payload.message,
        proposed_times=[t.isoformat() for t in payload.proposed_times],
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    return _request_out(request, db)


@router.get("/me/requests", response_model=list[MentorshipRequestOut])
def my_pending_requests(db: Session = Depends(get_db), mentor: User = Depends(require_role(UserRole.MENTOR))):
    """Powers 'Pending Requests' on the mentor dashboard and Requests page."""
    requests = (
        db.query(MentorshipRequest)
        .filter(MentorshipRequest.mentor_id == mentor.id, MentorshipRequest.status == MentorshipRequestStatus.PENDING)
        .order_by(MentorshipRequest.created_at.desc())
        .all()
    )
    return [_request_out(r, db) for r in requests]


@router.post("/me/requests/{request_id}/accept", response_model=MentorshipRequestOut)
def accept_request(
    request_id: int, db: Session = Depends(get_db), mentor: User = Depends(require_role(UserRole.MENTOR))
):
    """Accepting confirms the first proposed time slot (simplification — a full
    implementation would let the mentor pick among the learner's proposed times)."""
    request = db.get(MentorshipRequest, request_id)
    if not request or request.mentor_id != mentor.id:
        raise HTTPException(status_code=404, detail="Request not found.")
    request.status = MentorshipRequestStatus.ACCEPTED
    if request.proposed_times:
        request.confirmed_time = datetime.fromisoformat(request.proposed_times[0])
    else:
        request.confirmed_time = datetime.now(timezone.utc) + timedelta(days=1)
    db.add(request)
    db.commit()
    db.refresh(request)
    return _request_out(request, db)


@router.post("/me/requests/{request_id}/decline", response_model=MentorshipRequestOut)
def decline_request(
    request_id: int, db: Session = Depends(get_db), mentor: User = Depends(require_role(UserRole.MENTOR))
):
    request = db.get(MentorshipRequest, request_id)
    if not request or request.mentor_id != mentor.id:
        raise HTTPException(status_code=404, detail="Request not found.")
    request.status = MentorshipRequestStatus.DECLINED
    db.add(request)
    db.commit()
    db.refresh(request)
    return _request_out(request, db)


@router.get("/me/students", response_model=list[MentorshipRequestOut])
def my_students(db: Session = Depends(get_db), mentor: User = Depends(require_role(UserRole.MENTOR))):
    """Powers 'My Students' / 'Active Mentees' — accepted requests, most recent first."""
    requests = (
        db.query(MentorshipRequest)
        .filter(MentorshipRequest.mentor_id == mentor.id, MentorshipRequest.status == MentorshipRequestStatus.ACCEPTED)
        .order_by(MentorshipRequest.confirmed_time.asc())
        .all()
    )
    return [_request_out(r, db) for r in requests]


@router.get("/me/dashboard")
def mentor_dashboard_stats(db: Session = Depends(get_db), mentor: User = Depends(require_role(UserRole.MENTOR))):
    """Powers the mentor dashboard's stat cards + Today's Schedule."""
    accepted = (
        db.query(MentorshipRequest)
        .filter(MentorshipRequest.mentor_id == mentor.id, MentorshipRequest.status == MentorshipRequestStatus.ACCEPTED)
        .all()
    )
    packages_by_id = {p.id: p for p in db.query(MentorPackage).filter(MentorPackage.mentor_id == mentor.id).all()}
    total_earnings = sum((packages_by_id.get(r.package_id).price if r.package_id and r.package_id in packages_by_id else 0) for r in accepted)

    profile = db.query(MentorProfile).filter(MentorProfile.user_id == mentor.id).first()

    today = datetime.now(timezone.utc).date()
    todays_sessions = [r for r in accepted if r.confirmed_time and r.confirmed_time.date() == today]

    schedule = []
    for r in sorted(todays_sessions, key=lambda r: r.confirmed_time):
        learner = db.get(User, r.learner_id)
        schedule.append(
            {
                "id": r.id,
                "time": r.confirmed_time.isoformat(),
                "title": r.session_type or "Mentorship Session",
                "with_name": learner.full_name if learner else "Learner",
            }
        )

    return {
        "total_earnings": total_earnings,
        "students_mentored": len(accepted),
        "average_rating": profile.rating if profile else 0.0,
        "todays_schedule": schedule,
    }


@router.put("/application/step1", response_model=MentorProfileOut)
def mentor_application_step1(
    payload: MentorApplicationStep1,
    db: Session = Depends(get_db),
    mentor: User = Depends(require_role(UserRole.MENTOR)),
):
    """Mentor Application — Step 1 of 3: Personal & Professional Info."""
    profile = db.query(MentorProfile).filter(MentorProfile.user_id == mentor.id).first()
    if not profile:
        profile = MentorProfile(user_id=mentor.id)
    for field, value in payload.model_dump().items():
        setattr(profile, field, value)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.put("/application/step2", response_model=MentorProfileOut)
def mentor_application_step2(
    payload: MentorApplicationStep2,
    db: Session = Depends(get_db),
    mentor: User = Depends(require_role(UserRole.MENTOR)),
):
    """Mentor Application — Step 2 of 3: Expertise & Availability."""
    profile = db.query(MentorProfile).filter(MentorProfile.user_id == mentor.id).first()
    if not profile:
        profile = MentorProfile(user_id=mentor.id)
    for field, value in payload.model_dump().items():
        setattr(profile, field, value)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.put("/application/step3", response_model=MentorProfileOut)
def mentor_application_step3(
    payload: MentorApplicationStep3,
    db: Session = Depends(get_db),
    mentor: User = Depends(require_role(UserRole.MENTOR)),
):
    """Mentor Application — Step 3 of 3: Motivation & Submission."""
    if not payload.agreed_to_terms:
        raise HTTPException(status_code=400, detail="You must agree to the Terms & Mentor Code of Conduct.")

    profile = db.query(MentorProfile).filter(MentorProfile.user_id == mentor.id).first()
    if not profile:
        profile = MentorProfile(user_id=mentor.id)
    profile.motivation = payload.motivation
    profile.application_status = MentorApplicationStatus.PENDING
    profile.application_submitted_at = datetime.now(timezone.utc)
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile
