from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import CourseContentType, CourseStatus


class CourseModuleCreate(BaseModel):
    title: str
    video_url: Optional[str] = None
    external_link: Optional[str] = None
    duration_minutes: Optional[int] = None


class CourseModuleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order: int
    title: str
    video_url: Optional[str] = None
    external_link: Optional[str] = None
    duration_minutes: Optional[int] = None


class CourseBasicsCreate(BaseModel):
    """Step 1 of the Content Creator wizard."""
    content_type: CourseContentType = CourseContentType.COURSE_MODULE
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    level: Optional[str] = None


class CourseSettingsUpdate(BaseModel):
    """Step 3 of the Content Creator wizard."""
    is_public: bool = True
    enrollment_limit: Optional[int] = None
    is_paid: bool = False
    price: float = 0
    issue_certificate: bool = False


class CourseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    creator_id: int
    creator_name: Optional[str] = None
    content_type: CourseContentType
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    level: Optional[str] = None
    image_url: Optional[str] = None
    duration_weeks: Optional[int] = None
    is_public: bool
    enrollment_limit: Optional[int] = None
    is_paid: bool
    price: float
    issue_certificate: bool
    status: CourseStatus
    enrolled_count: int = 0
    completion_rate: float = 0
    created_at: datetime
    modules: list[CourseModuleOut] = []


class EnrollmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    course_id: int
    course_title: Optional[str] = None
    progress_percent: int
    enrolled_at: datetime
    completed_at: Optional[datetime] = None


class CourseStatsOut(BaseModel):
    active_courses: int
    total_enrolled: int
    avg_completion_rate: float
