from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, JSON, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import CourseContentType, CourseStatus


class Course(Base):
    """A learning-path course. Only Admin and Company accounts can create
    courses (see require_role guard in routers/courses.py) — learners can
    browse published ones and enroll."""

    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True)
    creator_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    content_type: Mapped[CourseContentType] = mapped_column(Enum(CourseContentType), default=CourseContentType.COURSE_MODULE)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(4000), nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    level: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    duration_weeks: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # Step 3 — Final Settings
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
    enrollment_limit: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    is_paid: Mapped[bool] = mapped_column(Boolean, default=False)
    price: Mapped[float] = mapped_column(Float, default=0)
    issue_certificate: Mapped[bool] = mapped_column(Boolean, default=False)

    status: Mapped[CourseStatus] = mapped_column(Enum(CourseStatus), default=CourseStatus.DRAFT)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    modules: Mapped[list["CourseModule"]] = relationship(back_populates="course", cascade="all, delete-orphan", order_by="CourseModule.order")
    enrollments: Mapped[list["Enrollment"]] = relationship(back_populates="course", cascade="all, delete-orphan")


class CourseModule(Base):
    __tablename__ = "course_modules"

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"))

    order: Mapped[int] = mapped_column(Integer, default=0)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    video_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    external_link: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    duration_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    course: Mapped["Course"] = relationship(back_populates="modules")


class Enrollment(Base):
    __tablename__ = "enrollments"

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"))
    learner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    progress_percent: Mapped[int] = mapped_column(Integer, default=0)
    enrolled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    course: Mapped["Course"] = relationship(back_populates="enrollments")
