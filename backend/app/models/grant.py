from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Enum, Float, ForeignKey, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import GrantStatus


class Grant(Base):
    """An individual funding request submitted via the Grant Application wizard."""

    __tablename__ = "grants"

    id: Mapped[int] = mapped_column(primary_key=True)
    applicant_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    amount_requested: Mapped[float] = mapped_column(Float, nullable=False)
    purpose: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    details: Mapped[Optional[str]] = mapped_column(String(8000), nullable=True)
    documents: Mapped[list] = mapped_column(
        JSON, default=list
    )  # uploaded supporting-doc URLs/filenames

    status: Mapped[GrantStatus] = mapped_column(
        Enum(GrantStatus), default=GrantStatus.DRAFT
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class GrantGroup(Base):
    """A community funding group, e.g. 'Tech Leaders for Africa' (Lexep Grant Hub)."""

    __tablename__ = "grant_groups"

    id: Mapped[int] = mapped_column(primary_key=True)
    organizer_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    tagline: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(String(4000), nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    visibility: Mapped[str] = mapped_column(
        String(20), default="public"
    )  # "public" | "private"
    invite_link: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    goal_amount: Mapped[float] = mapped_column(Float, default=0)
    raised_amount: Mapped[float] = mapped_column(Float, default=0)
    youth_sponsored: Mapped[int] = mapped_column(default=0)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    contributions: Mapped[list["Contribution"]] = relationship(
        back_populates="group", cascade="all, delete-orphan"
    )


class Contribution(Base):
    __tablename__ = "contributions"

    id: Mapped[int] = mapped_column(primary_key=True)
    group_id: Mapped[int] = mapped_column(ForeignKey("grant_groups.id"))
    contributor_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id"), nullable=True
    )
    contributor_name: Mapped[str] = mapped_column(
        String(255), default="Anonymous Donor"
    )

    amount: Mapped[float] = mapped_column(Float, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    group: Mapped["GrantGroup"] = relationship(back_populates="contributions")
