from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import MentorshipRequestStatus


class MentorshipRequestCreate(BaseModel):
    mentor_id: int
    package_id: Optional[int] = None
    session_type: Optional[str] = None
    message: Optional[str] = None
    proposed_times: list[datetime] = []


class MentorshipRequestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    mentor_id: int
    learner_id: int
    package_id: Optional[int] = None
    session_type: Optional[str] = None
    message: Optional[str] = None
    proposed_times: list[datetime] = []
    confirmed_time: Optional[datetime] = None
    status: MentorshipRequestStatus
    created_at: datetime
    learner_name: Optional[str] = None
    mentor_name: Optional[str] = None
