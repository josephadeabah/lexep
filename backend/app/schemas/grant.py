from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import GrantStatus


class GrantCreate(BaseModel):
    amount_requested: float
    purpose: Optional[str] = None
    details: Optional[str] = None
    documents: list[str] = []
    status: GrantStatus = GrantStatus.DRAFT


class GrantOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    amount_requested: float
    purpose: Optional[str] = None
    status: GrantStatus
    created_at: datetime


class GrantGroupCreate(BaseModel):
    name: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    goal_amount: float
    visibility: str = "public"


class GrantGroupOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    tagline: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    visibility: str = "public"
    invite_link: Optional[str] = None
    image_url: Optional[str] = None
    goal_amount: float
    raised_amount: float
    youth_sponsored: int
    organizer_id: int
    percent_funded: float = 0.0


class ContributionCreate(BaseModel):
    amount: float
    contributor_name: Optional[str] = "Anonymous Donor"


class ContributionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    contributor_name: str
    amount: float
    created_at: datetime
