from datetime import date, datetime
from typing import Optional

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import (
    ApplicationStatus,
    InterviewStatus,
    OpportunityStatus,
    WorkMode,
)


class Opportunity(Base):
    """An internship / job posting created by a Company account."""

    __tablename__ = "opportunities"

    id: Mapped[int] = mapped_column(primary_key=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    work_mode: Mapped[WorkMode] = mapped_column(Enum(WorkMode), default=WorkMode.REMOTE)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Step 2 — Role Details
    duration: Mapped[Optional[str]] = mapped_column(
        String(50), nullable=True
    )  # e.g. "6 Months"
    stipend_provided: Mapped[bool] = mapped_column(Boolean, default=False)
    stipend_amount: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    stipend_currency: Mapped[str] = mapped_column(String(10), default="USD")

    description: Mapped[Optional[str]] = mapped_column(String(8000), nullable=True)
    responsibilities: Mapped[Optional[str]] = mapped_column(String(8000), nullable=True)

    # Step 3 — Final Requirements & Review
    required_skills: Mapped[list] = mapped_column(JSON, default=list)
    application_deadline: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    status: Mapped[OpportunityStatus] = mapped_column(
        Enum(OpportunityStatus), default=OpportunityStatus.DRAFT
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    applications: Mapped[list["Application"]] = relationship(
        back_populates="opportunity", cascade="all, delete-orphan"
    )


class Application(Base):
    """A learner's application to an Opportunity."""

    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(primary_key=True)
    opportunity_id: Mapped[int] = mapped_column(ForeignKey("opportunities.id"))
    applicant_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus), default=ApplicationStatus.APPLIED
    )
    match_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    cover_note: Mapped[Optional[str]] = mapped_column(String(4000), nullable=True)

    # Full "Apply for Internship" wizard fields (Professional Details / Experience & Portfolio)
    qualification: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    years_experience: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    why_interested: Mapped[Optional[str]] = mapped_column(String(4000), nullable=True)
    portfolio_link: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    resume_filename: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    additional_info: Mapped[Optional[str]] = mapped_column(String(4000), nullable=True)

    applied_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    opportunity: Mapped["Opportunity"] = relationship(back_populates="applications")
    interview: Mapped[Optional["Interview"]] = relationship(
        back_populates="application", uselist=False, cascade="all, delete-orphan"
    )


class Interview(Base):
    """A scheduled interview tied to a single application.

    Supports two flows:
    - Quick-schedule: company sets `scheduled_at` directly (status jumps to SCHEDULED).
    - Propose-and-select: company proposes several `proposed_times`; the candidate
      picks one via `select-time`, which sets `selected_time`/`scheduled_at` and
      flips status from AWAITING_CANDIDATE to SCHEDULED.
    """

    __tablename__ = "interviews"

    id: Mapped[int] = mapped_column(primary_key=True)
    application_id: Mapped[int] = mapped_column(
        ForeignKey("applications.id"), unique=True
    )

    scheduled_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    proposed_times: Mapped[list] = mapped_column(
        JSON, default=list
    )  # list of ISO datetime strings
    selected_time: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    duration_minutes: Mapped[int] = mapped_column(Integer, default=60)
    interview_type: Mapped[Optional[str]] = mapped_column(
        String(120), nullable=True
    )  # e.g. "Technical Screen"
    meeting_service: Mapped[Optional[str]] = mapped_column(
        String(50), nullable=True
    )  # e.g. "Google Meet", "Zoom"
    meeting_link: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    message_to_candidate: Mapped[Optional[str]] = mapped_column(
        String(2000), nullable=True
    )
    status: Mapped[InterviewStatus] = mapped_column(
        Enum(InterviewStatus), default=InterviewStatus.SCHEDULED
    )

    application: Mapped["Application"] = relationship(back_populates="interview")
