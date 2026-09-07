from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api_deps import get_current_user_optional, require_role
from app.core.config import settings
from app.core.database import get_db
from app.models.enums import ApplicationStatus, InterviewStatus, NotificationType, UserRole
from app.models.opportunity import Application, Interview, Opportunity
from app.models.user import User
from app.schemas.opportunity import InterviewCreate, InterviewOut, InterviewPropose, InterviewSelectTime
from app.services.notifications import notify

router = APIRouter(prefix="/api/interviews", tags=["interviews"])


def _to_out(interview: Interview, db: Session) -> InterviewOut:
    application = db.get(Application, interview.application_id)
    candidate = db.get(User, application.applicant_id) if application else None
    opportunity = db.get(Opportunity, application.opportunity_id) if application else None
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
    """Primary interview-scheduling path: the company picks a single direct
    time and the candidate is notified immediately with a confirmed date —
    no separate "select a time" step. Powers the 'Schedule' quick-action on
    the Applicant Review board.

    If no meeting_link is supplied, one is generated automatically from
    MEETING_BASE_URL once the interview has an id (requires a flush first
    so interview.id is populated before the URL is built)."""
    application = db.get(Application, payload.application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found.")

    data = payload.model_dump()
    meeting_link = data.pop("meeting_link", None)
    interview = Interview(status=InterviewStatus.SCHEDULED, **data)
    application.status = ApplicationStatus.INTERVIEW_SCHEDULED
    db.add_all([interview, application])
    db.flush()  # assigns interview.id, needed below

    if not meeting_link:
        meeting_link = f"{settings.MEETING_BASE_URL}/{interview.id}"
    interview.meeting_link = meeting_link
    db.add(interview)

    opportunity = db.get(Opportunity, application.opportunity_id)
    notify(
        db,
        user_id=application.applicant_id,
        type=NotificationType.INTERVIEW_CONFIRMED,
        title="Interview Confirmed",
        body=(
            f"Your interview for {opportunity.title if opportunity else 'a role'} is confirmed for "
            f"{interview.scheduled_at.strftime('%b %d, %Y at %I:%M %p') if interview.scheduled_at else 'the scheduled time'}."
        ),
        action_label="View Details",
        action_url=f"/interviews/{interview.id}/confirmed",
    )

    db.commit()
    db.refresh(interview)
    return _to_out(interview, db)


@router.post("/propose", response_model=InterviewOut, status_code=201)
def propose_interview(
    payload: InterviewPropose,
    db: Session = Depends(get_db),
    company: User = Depends(require_role(UserRole.COMPANY)),
):
    """DEPRECATED — kept only for backward compatibility with any existing
    links/integrations. New scheduling should use POST /api/interviews
    (schedule_interview above), which sets a single confirmed time directly
    instead of asking the candidate to choose among several proposed slots."""
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
    db.flush()

    opportunity = db.get(Opportunity, application.opportunity_id)
    notify(
        db,
        user_id=application.applicant_id,
        type=NotificationType.INTERVIEW_SCHEDULED,
        title="Interview Scheduled",
        body=f"You've been invited to interview for {opportunity.title if opportunity else 'a role'}. Choose a time that works for you.",
        action_label="Select a Time",
        action_url=f"/interviews/{interview.id}/select-time",
    )
    db.commit()
    db.refresh(interview)
    return _to_out(interview, db)


@router.get("/{interview_id}", response_model=InterviewOut)
def get_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_current_user_optional),
):
    """Public-ish: powers the candidate 'Select Interview Time' (deprecated
    flow) and 'Interview Confirmed' pages, reached via a direct link."""
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
    """DEPRECATED — candidate confirms one of the proposed slots. Only
    reachable for interviews created via the deprecated /propose endpoint;
    the primary flow (schedule_interview) never leaves an interview in
    AWAITING_CANDIDATE status."""
    interview = db.get(Interview, interview_id)
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found.")

    proposed = [datetime.fromisoformat(t) for t in interview.proposed_times]
    if proposed and payload.selected_time not in proposed:
        raise HTTPException(status_code=400, detail="Selected time is not one of the proposed slots.")

    interview.selected_time = payload.selected_time
    interview.scheduled_at = payload.selected_time
    interview.status = InterviewStatus.SCHEDULED
    if not interview.meeting_link:
        interview.meeting_link = f"{settings.MEETING_BASE_URL}/{interview.id}"
    db.add(interview)
    db.flush()

    application = db.get(Application, interview.application_id)
    opportunity = db.get(Opportunity, application.opportunity_id) if application else None
    if opportunity:
        notify(
            db,
            user_id=opportunity.company_id,
            type=NotificationType.INTERVIEW_CONFIRMED,
            title="Interview Confirmed",
            body=f"{learner.full_name} confirmed a time for the {opportunity.title} interview.",
            action_url="/interviews",
        )
    db.commit()
    db.refresh(interview)
    return _to_out(interview, db)


@router.get("/upcoming", response_model=list[InterviewOut])
def upcoming_interviews(
    db: Session = Depends(get_db),
    company: User = Depends(require_role(UserRole.COMPANY)),
):
    """Powers the 'Upcoming Interviews' / 'Interview Schedule' hub."""
    opportunity_ids = [o.id for o in db.query(Opportunity).filter(Opportunity.company_id == company.id).all()]
    application_ids = [
        a.id for a in db.query(Application).filter(Application.opportunity_id.in_(opportunity_ids)).all()
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
    """Interviews awaiting the candidate's time selection — 'Pending
    Requests'. Only ever populated by the deprecated /propose flow, since
    the primary schedule_interview path never creates AWAITING_CANDIDATE
    interviews."""
    opportunity_ids = [o.id for o in db.query(Opportunity).filter(Opportunity.company_id == company.id).all()]
    application_ids = [
        a.id for a in db.query(Application).filter(Application.opportunity_id.in_(opportunity_ids)).all()
    ]
    interviews = (
        db.query(Interview)
        .filter(Interview.application_id.in_(application_ids))
        .filter(Interview.status == InterviewStatus.AWAITING_CANDIDATE)
        .all()
    )
    return [_to_out(i, db) for i in interviews]
