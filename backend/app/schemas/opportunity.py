from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import ApplicationStatus, InterviewStatus, OpportunityStatus, WorkMode


class OpportunityCreate(BaseModel):
    title: str
    category: Optional[str] = None
    work_mode: WorkMode = WorkMode.REMOTE
    location: Optional[str] = None
    duration: Optional[str] = None
    stipend_provided: bool = False
    stipend_amount: Optional[float] = None
    stipend_currency: str = "USD"
    description: Optional[str] = None
    responsibilities: Optional[str] = None
    required_skills: list[str] = []
    application_deadline: Optional[date] = None
    status: OpportunityStatus = OpportunityStatus.DRAFT


class OpportunityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: int
    title: str
    category: Optional[str] = None
    work_mode: WorkMode
    location: Optional[str] = None
    duration: Optional[str] = None
    stipend_provided: bool = False
    stipend_amount: Optional[float] = None
    stipend_currency: str = "USD"
    description: Optional[str] = None
    responsibilities: Optional[str] = None
    required_skills: list[str] = []
    application_deadline: Optional[date] = None
    status: OpportunityStatus
    created_at: datetime
    company_name: Optional[str] = None


class ApplicationCreate(BaseModel):
    opportunity_id: int
    cover_note: Optional[str] = None
    qualification: Optional[str] = None
    years_experience: Optional[str] = None
    why_interested: Optional[str] = None
    portfolio_link: Optional[str] = None
    resume_filename: Optional[str] = None
    additional_info: Optional[str] = None


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicantOut(BaseModel):
    """Shape used by the Applicant Review board."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    applicant_name: str
    applicant_avatar: Optional[str] = None
    institution: Optional[str] = None
    education: Optional[str] = None
    skills: list[str] = []
    match_score: Optional[float] = None
    status: ApplicationStatus


class MyApplicationOut(BaseModel):
    """Shape used by 'My Applications'."""
    id: int
    opportunity_title: str
    company_name: str
    location: Optional[str] = None
    status: ApplicationStatus
    applied_at: datetime


class InterviewCreate(BaseModel):
    application_id: int
    scheduled_at: datetime
    duration_minutes: int = 60
    interview_type: Optional[str] = None
    meeting_link: Optional[str] = None


class InterviewPropose(BaseModel):
    """Company proposes several candidate time slots (Schedule Interview modal)."""
    application_id: int
    interview_type: Optional[str] = None
    meeting_service: Optional[str] = "Google Meet"
    duration_minutes: int = 45
    proposed_times: list[datetime]
    message_to_candidate: Optional[str] = None


class InterviewSelectTime(BaseModel):
    """Candidate confirms one of the proposed time slots."""
    selected_time: datetime


class InterviewOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    application_id: int
    scheduled_at: Optional[datetime] = None
    proposed_times: list[datetime] = []
    selected_time: Optional[datetime] = None
    duration_minutes: int
    interview_type: Optional[str] = None
    meeting_service: Optional[str] = None
    meeting_link: Optional[str] = None
    message_to_candidate: Optional[str] = None
    status: InterviewStatus
    candidate_name: Optional[str] = None
    opportunity_title: Optional[str] = None
