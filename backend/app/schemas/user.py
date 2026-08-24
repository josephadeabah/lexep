from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict

from app.models.enums import UserRole


class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: Optional[UserRole] = None
    avatar_url: Optional[str] = None
    onboarding_completed: bool
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class RoleSelect(BaseModel):
    role: UserRole


class LearnerOnboarding(BaseModel):
    education_level: Optional[str] = None
    field_of_study: Optional[str] = None
    institution: Optional[str] = None
    career_interests: list[str] = []
    goals: list[str] = []
    weekly_time_commitment: Optional[str] = None


class MentorOnboarding(BaseModel):
    mentoring_style: Optional[str] = None
    preferred_mentee_levels: list[str] = []
    communication_tools: list[str] = []


class MentorApplicationStep1(BaseModel):
    """'Personal & Professional Info' — Mentor Application, step 1 of 3."""

    title: Optional[str] = None  # Current Role
    company: Optional[str] = None
    years_experience: Optional[str] = None
    linkedin_url: Optional[str] = None


class MentorApplicationStep2(BaseModel):
    primary_industry: Optional[str] = None
    skills: list[str] = []
    hours_per_week: Optional[str] = None
    preferred_timeframes: list[str] = []


class MentorApplicationStep3(BaseModel):
    motivation: Optional[str] = None
    agreed_to_terms: bool


class CompanyOnboarding(BaseModel):
    industry: Optional[str] = None
    company_size: Optional[str] = None
    website_url: Optional[str] = None
    hiring_goals: list[str] = []
    receive_email_digests: bool = True
    allow_direct_inquiries: bool = False


class AccountUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None


class NotificationPreferences(BaseModel):
    preferences: dict


class PrivacySettings(BaseModel):
    settings: dict


class MentorProfileOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: Optional[str] = None
    company: Optional[str] = None
    bio: Optional[str] = None
    years_experience: Optional[str] = None
    linkedin_url: Optional[str] = None
    location: Optional[str] = None
    focus_area: Optional[str] = None
    education: list[dict] = []
    credentials: list[dict] = []
    credential_checklist: dict = {}
    admin_notes: Optional[str] = None
    application_status: str
    application_submitted_at: Optional[datetime] = None
    skills: list[str] = []
    languages: list[str] = []
    rating: float = 0.0
    accepting_mentees: bool = True
    hours_per_week: Optional[str] = None
    user: UserOut


class MentorPackageCreate(BaseModel):
    title: str
    description: Optional[str] = None
    price: float = 0
    currency: str = "USD"
    duration_minutes: int = 60
    session_count: int = 1
    tags: list[str] = []
    is_active: bool = True
    is_popular: bool = False


class MentorPackageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    mentor_id: int
    title: str
    description: Optional[str] = None
    price: float
    currency: str
    duration_minutes: int
    session_count: int
    tags: list[str] = []
    is_active: bool
    is_popular: bool


class AdminChecklistUpdate(BaseModel):
    identity_verified: Optional[bool] = None
    academic_verified: Optional[bool] = None
    professional_verified: Optional[bool] = None


class AdminNoteUpdate(BaseModel):
    admin_notes: str


class MentorApplicationDecision(BaseModel):
    reason: Optional[str] = None
