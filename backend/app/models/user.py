from datetime import datetime
from typing import Optional

from sqlalchemy import (
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    JSON,
    String,
    Boolean,
    Float,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import MentorApplicationStatus, UserRole


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    hashed_password: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    role: Mapped[Optional[UserRole]] = mapped_column(Enum(UserRole), nullable=True)
    onboarding_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    oauth_provider: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    # Notification / privacy settings (kept simple as JSON so new toggles
    # don't require a migration every time — see Settings & Profile screen).
    notification_preferences: Mapped[dict] = mapped_column(JSON, default=dict)
    privacy_settings: Mapped[dict] = mapped_column(JSON, default=dict)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    learner_profile: Mapped[Optional["LearnerProfile"]] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    mentor_profile: Mapped[Optional["MentorProfile"]] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    company_profile: Mapped[Optional["CompanyProfile"]] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )


class LearnerProfile(Base):
    """Extra data captured during the Learner onboarding flow."""

    __tablename__ = "learner_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)

    education_level: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    field_of_study: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    institution: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    career_interests: Mapped[list] = mapped_column(JSON, default=list)

    goals: Mapped[list] = mapped_column(
        JSON, default=list
    )  # e.g. ["Finding a Mentor", ...]
    weekly_time_commitment: Mapped[Optional[str]] = mapped_column(
        String(50), nullable=True
    )

    # Admin 'User Management' screen
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    primary_track: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    progress_percent: Mapped[int] = mapped_column(default=0)
    verification_status: Mapped[str] = mapped_column(
        String(30), default="in_progress"
    )  # in_progress | needs_review | competency_verified

    user: Mapped["User"] = relationship(back_populates="learner_profile")


class MentorProfile(Base):
    """Extra data captured during Mentor onboarding + the Mentor Application wizard."""

    __tablename__ = "mentor_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)

    title: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True
    )  # "Current Role"
    company: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(String(4000), nullable=True)

    # Mentor Application — Step 1: Personal & Professional Info
    years_experience: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    linkedin_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    primary_industry: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    skills: Mapped[list] = mapped_column(JSON, default=list)

    hours_per_week: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    preferred_timeframes: Mapped[list] = mapped_column(JSON, default=list)

    mentoring_style: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    preferred_mentee_levels: Mapped[list] = mapped_column(JSON, default=list)
    communication_tools: Mapped[list] = mapped_column(JSON, default=list)

    motivation: Mapped[Optional[str]] = mapped_column(String(4000), nullable=True)
    application_status: Mapped[MentorApplicationStatus] = mapped_column(
        Enum(MentorApplicationStatus), default=MentorApplicationStatus.PENDING
    )

    # Admin review (Lexep Admin > Mentor Application Queue)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    focus_area: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    education: Mapped[list] = mapped_column(
        JSON, default=list
    )  # [{degree, institution, year}]
    credentials: Mapped[list] = mapped_column(
        JSON, default=list
    )  # [{label, document_url}]
    credential_checklist: Mapped[dict] = mapped_column(
        JSON, default=dict
    )  # {identity: bool, academic: bool, professional: bool}
    admin_notes: Mapped[Optional[str]] = mapped_column(String(4000), nullable=True)
    application_submitted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    application_reviewed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    languages: Mapped[list] = mapped_column(JSON, default=list)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    accepting_mentees: Mapped[bool] = mapped_column(Boolean, default=True)

    user: Mapped["User"] = relationship(back_populates="mentor_profile")


class MentorPackage(Base):
    """A bookable mentorship offering (price + duration), managed from 'My Packages'.

    Note: `mentor_id` references `users.id` directly (not `mentor_profiles.id`)
    so a package can be created before the profile row exists. No ORM
    relationship is declared here to keep the two tables independently
    queryable — see routers/mentors.py for how packages are fetched.
    """

    __tablename__ = "mentor_packages"

    id: Mapped[int] = mapped_column(primary_key=True)
    mentor_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)
    price: Mapped[float] = mapped_column(Float, default=0)
    currency: Mapped[str] = mapped_column(String(10), default="USD")
    duration_minutes: Mapped[int] = mapped_column(Integer, default=60)
    session_count: Mapped[int] = mapped_column(Integer, default=1)
    tags: Mapped[list] = mapped_column(JSON, default=list)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_popular: Mapped[bool] = mapped_column(Boolean, default=False)


class CompanyProfile(Base):
    """Extra data captured during Company onboarding."""

    __tablename__ = "company_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)

    company_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    industry: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    company_size: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    website_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    hiring_goals: Mapped[list] = mapped_column(JSON, default=list)
    receive_email_digests: Mapped[bool] = mapped_column(Boolean, default=True)
    allow_direct_inquiries: Mapped[bool] = mapped_column(Boolean, default=False)

    # Admin 'Partner Firms Management' screen
    industry_category: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    subscription_tier: Mapped[str] = mapped_column(
        String(30), default="basic"
    )  # basic | pro | enterprise
    onboarding_status: Mapped[str] = mapped_column(
        String(30), default="active"
    )  # active | pending_review

    user: Mapped["User"] = relationship(back_populates="company_profile")
