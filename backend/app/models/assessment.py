from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Enum, Float, ForeignKey, Integer, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import AssessmentAttemptStatus


class Assessment(Base):
    """A skill assessment / quiz, e.g. 'Structural Analysis I'.

    `owner_id` + `is_internal` distinguish general Lexep skill assessments
    (owner_id is null, visible to every learner in the Skill Assessment Hub)
    from a company's own internship-screening assessment (owner_id set,
    is_internal=True — only that company can see results on their
    Internship Assessment Leaderboard, per the 'leaderboard is
    company-only' requirement)."""

    __tablename__ = "assessments"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    is_internal: Mapped[bool] = mapped_column(default=False)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    level: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # Beginner/Intermediate/Advanced
    description: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=45)
    featured: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    questions: Mapped[list["AssessmentQuestion"]] = relationship(
        back_populates="assessment", cascade="all, delete-orphan", order_by="AssessmentQuestion.order"
    )


class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"

    id: Mapped[int] = mapped_column(primary_key=True)
    assessment_id: Mapped[int] = mapped_column(ForeignKey("assessments.id"))

    order: Mapped[int] = mapped_column(Integer, default=0)
    topic: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)  # for topic-breakdown scoring
    title: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)  # short sidebar label
    prompt: Mapped[str] = mapped_column(String(2000), nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    options: Mapped[list] = mapped_column(JSON, default=list)  # [{id, text}]
    correct_option_id: Mapped[str] = mapped_column(String(10), nullable=False)
    explanation: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)

    assessment: Mapped["Assessment"] = relationship(back_populates="questions")


class AssessmentAttempt(Base):
    __tablename__ = "assessment_attempts"

    id: Mapped[int] = mapped_column(primary_key=True)
    assessment_id: Mapped[int] = mapped_column(ForeignKey("assessments.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    status: Mapped[AssessmentAttemptStatus] = mapped_column(
        Enum(AssessmentAttemptStatus), default=AssessmentAttemptStatus.IN_PROGRESS
    )
    current_index: Mapped[int] = mapped_column(Integer, default=0)
    answers: Mapped[dict] = mapped_column(JSON, default=dict)  # {question_id: option_id}
    score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    topic_breakdown: Mapped[dict] = mapped_column(JSON, default=dict)  # {topic: percent}

    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
