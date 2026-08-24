from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api_deps import get_current_user_optional, require_role
from app.core.database import get_db
from app.models.enums import ApplicationStatus, InterviewStatus, UserRole
from app.models.opportunity import Application, Interview, Opportunity
from app.models.user import User
from app.schemas.opportunity import (
    InterviewCreate,
    InterviewOut,
    InterviewPropose,
    InterviewSelectTime,
)

router = APIRouter(prefix="/api/interviews", tags=["interviews"])


def _to_out(interview: Interview, db: Session) -> InterviewOut:
    application = db.get(Application, interview.application_id)
    candidate = db.get(User, application.applicant_id) if application else None
    opportunity = (
        db.get(Opportunity, application.opportunity_id) if application else None
    )
    out = InterviewOut.model_validate(interview)
    out.candidate_name = candidate.full_name if candidate else None
    out.opportunity_title = opportunity.title if opportunity else None
    return out


@router.post("", response_model=InterviewOut, status_code=201)
def schedule_interview(
    payload: InterviewCreate,
    db: Session = Depends(get_db),
    company: User = Depends(require_role(UserRole.COMPANY)),
):
    """Quick-schedule: sets a single confirmed time directly. Used by the
    'Schedule' quick-action on the Applicant Review board."""
    application = db.get(Application, payload.application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")

    interview = Interview(status=InterviewStatus.SCHEDULED, **payload.model_dump())
    application.status = ApplicationStatus.INTERVIEW_SCHEDULED
    db.add_all([interview, application])
    db.commit()
    db.refresh(interview)
    return _to_out(interview, db)


@router.post("/propose", response_model=InterviewOut, status_code=201)
def propose_interview(
    payload: InterviewPropose,
    db: Session = Depends(get_db),
    company: User = Depends(require_role(UserRole.COMPANY)),
):
    """Powers the 'Schedule Interview' modal — offers multiple time slots for
    the candidate to choose from (Interview Management Hub)."""
    application = db.get(Application, payload.application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")

    interview = Interview(
        application_id=payload.application_id,
        interview_type=payload.interview_type,
        meeting_service=payload.meeting_service,
        duration_minutes=payload.duration_minutes,
        proposed_times=[t.isoformat() for t in payload.proposed_times],
        message_to_candidate=payload.message_to_candidate,
        status=InterviewStatus.AWAITING_CANDIDATE,
    )
    application.status = ApplicationStatus.INTERVIEW_SCHEDULED
    db.add_all([interview, application])
    db.commit()
    db.refresh(interview)
    return _to_out(interview, db)


@router.get("/{interview_id}", response_model=InterviewOut)
def get_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """Public-ish: powers the candidate 'Select Interview Time' and 'Interview
    Confirmed' pages, reached via a direct link."""
    interview = db.get(Interview, interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found.")
    return _to_out(interview, db)


@router.post("/{interview_id}/select-time", response_model=InterviewOut)
def select_interview_time(
    interview_id: int,
    payload: InterviewSelectTime,
    db: Session = Depends(get_db),
    learner: User = Depends(require_role(UserRole.LEARNER)),
):
    """Candidate confirms one of the proposed slots — powers 'Confirm Selection'."""
    interview = db.get(Interview, interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found.")

    proposed = [datetime.fromisoformat(t) for t in interview.proposed_times]
    if proposed and payload.selected_time not in proposed:
        raise HTTPException(
            status_code=400, detail="Selected time is not one of the proposed slots."
        )

    interview.selected_time = payload.selected_time
    interview.scheduled_at = payload.selected_time
    interview.status = InterviewStatus.SCHEDULED
    if not interview.meeting_link:
        interview.meeting_link = f"https://meet.lexep.org/i/{interview.id}"
    db.add(interview)
    db.commit()
    db.refresh(interview)
    return _to_out(interview, db)


@router.get("/upcoming", response_model=list[InterviewOut])
def upcoming_interviews(
    db: Session = Depends(get_db),
    company: User = Depends(require_role(UserRole.COMPANY)),
):
    """Powers the 'Upcoming Interviews' / 'Interview Schedule' hub."""
    opportunity_ids = [
        o.id
        for o in db.query(Opportunity)
        .filter(Opportunity.company_id == company.id)
        .all()
    ]
    application_ids = [
        a.id
        for a in db.query(Application)
        .filter(Application.opportunity_id.in_(opportunity_ids))
        .all()
    ]
    interviews = (
        db.query(Interview)
        .filter(Interview.application_id.in_(application_ids))
        .filter(Interview.status != InterviewStatus.CANCELLED)
        .order_by(Interview.scheduled_at.asc())
        .all()
    )
    return [_to_out(i, db) for i in interviews]


@router.get("/pending/mine", response_model=list[InterviewOut])
def pending_interviews_for_company(
    db: Session = Depends(get_db),
    company: User = Depends(require_role(UserRole.COMPANY)),
):
    """Interviews awaiting the candidate's time selection — 'Pending Requests'."""
    opportunity_ids = [
        o.id
        for o in db.query(Opportunity)
        .filter(Opportunity.company_id == company.id)
        .all()
    ]
    application_ids = [
        a.id
        for a in db.query(Application)
        .filter(Application.opportunity_id.in_(opportunity_ids))
        .all()
    ]
    interviews = (
        db.query(Interview)
        .filter(Interview.application_id.in_(application_ids))
        .filter(Interview.status == InterviewStatus.AWAITING_CANDIDATE)
        .all()
    )
    return [_to_out(i, db) for i in interviews]
