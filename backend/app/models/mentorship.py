from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Enum, Float, ForeignKey, Integer, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import MentorshipRequestStatus


class MentorshipRequest(Base):
    """A learner requesting a mentorship session from a mentor.

    Covers the full 'Request Session' flow: session type, an optional package,
    a message, and up to 3 proposed time slots. When the mentor accepts, the
    first proposed time is used as the confirmed session time (see
    routers/mentors.py respond_to_request) — a simplification documented there.
    """

    __tablename__ = "mentorship_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    mentor_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    learner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    package_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("mentor_packages.id"), nullable=True
    )

    session_type: Mapped[Optional[str]] = mapped_column(
        String(120), nullable=True
    )  # e.g. "30-min Intro"
    message: Mapped[Optional[str]] = mapped_column(String(2000), nullable=True)
    proposed_times: Mapped[list] = mapped_column(
        JSON, default=list
    )  # list of ISO datetime strings
    confirmed_time: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    status: Mapped[MentorshipRequestStatus] = mapped_column(
        Enum(MentorshipRequestStatus), default=MentorshipRequestStatus.PENDING
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
