from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api_deps import get_current_user, get_current_user_optional, require_role
from app.core.database import get_db
from app.models.course import Course, CourseModule, Enrollment
from app.models.enums import CourseStatus, UserRole
from app.models.user import User
from app.schemas.course import (
    CourseBasicsCreate,
    CourseModuleCreate,
    CourseModuleOut,
    CourseOut,
    CourseSettingsUpdate,
    CourseStatsOut,
    EnrollmentOut,
)
from app.schemas.pagination import Page, paginate

router = APIRouter(prefix="/api/courses", tags=["courses"])


def _to_out(course: Course, db: Session) -> CourseOut:
    creator = db.get(User, course.creator_id)
    enrolled = db.query(Enrollment).filter(Enrollment.course_id == course.id).all()
    completion_rate = (
        round(sum(1 for e in enrolled if e.completed_at) / len(enrolled) * 100, 1) if enrolled else 0
    )
    data = CourseOut.model_validate(course)
    data.creator_name = creator.full_name if creator else None
    data.enrolled_count = len(enrolled)
    data.completion_rate = completion_rate
    return data


@router.get("", response_model=Page[CourseOut])
def list_courses(
    mine_only: bool = False,
    published_only: bool = False,
    q: Optional[str] = None,
    category: Optional[str] = None,
    page: int = 1,
    page_size: int = 12,
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional),
):
    """Powers both 'Explore Learning Paths' (published_only=true, any role —
    no auth required to browse) and 'Curriculum Management'
    (mine_only=true, admin/company, requires auth)."""
    query = db.query(Course)
    if mine_only:
        if not user:
            raise HTTPException(status_code=401, detail="Sign in to view your courses.")
        query = query.filter(Course.creator_id == user.id)
    if published_only:
        query = query.filter(Course.status == CourseStatus.PUBLISHED, Course.is_public.is_(True))
    if q:
        query = query.filter(Course.title.ilike(f"%{q}%"))
    if category:
        query = query.filter(Course.category == category)
    query = query.order_by(Course.created_at.desc())

    items, total, total_pages = paginate(query, page, page_size)
    return Page(items=[_to_out(c, db) for c in items], total=total, page=page, page_size=page_size, total_pages=total_pages)


@router.get("/stats", response_model=CourseStatsOut)
def course_stats(db: Session = Depends(get_db), user: User = Depends(require_role(UserRole.ADMIN, UserRole.COMPANY))):
    """Powers the Curriculum Management stat cards."""
    courses = db.query(Course).filter(Course.creator_id == user.id).all()
    active = [c for c in courses if c.status == CourseStatus.PUBLISHED]
    all_enrollments = (
        db.query(Enrollment).filter(Enrollment.course_id.in_([c.id for c in courses])).all() if courses else []
    )
    completion_rate = (
        round(sum(1 for e in all_enrollments if e.completed_at) / len(all_enrollments) * 100, 1)
        if all_enrollments
        else 0
    )
    return CourseStatsOut(active_courses=len(active), total_enrolled=len(all_enrollments), avg_completion_rate=completion_rate)


@router.get("/{course_id}", response_model=CourseOut)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")
    return _to_out(course, db)


@router.post("", response_model=CourseOut, status_code=201)
def create_course_basics(
    payload: CourseBasicsCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.ADMIN, UserRole.COMPANY)),
):
    """Content Creator — Step 1: Basics. Only Admin and Company accounts can
    create courses; the resulting course starts as a draft."""
    course = Course(creator_id=user.id, **payload.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return _to_out(course, db)


@router.post("/{course_id}/modules", response_model=CourseModuleOut, status_code=201)
def add_module(
    course_id: int,
    payload: CourseModuleCreate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.ADMIN, UserRole.COMPANY)),
):
    """Content Creator — Step 2: Media & Content."""
    course = db.get(Course, course_id)
    if not course or course.creator_id != user.id:
        raise HTTPException(status_code=404, detail="Course not found.")
    order = len(course.modules)
    module = CourseModule(course_id=course_id, order=order, **payload.model_dump())
    db.add(module)
    db.commit()
    db.refresh(module)
    return module


@router.put("/{course_id}/settings", response_model=CourseOut)
def update_settings(
    course_id: int,
    payload: CourseSettingsUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(require_role(UserRole.ADMIN, UserRole.COMPANY)),
):
    """Content Creator — Step 3: Final Settings."""
    course = db.get(Course, course_id)
    if not course or course.creator_id != user.id:
        raise HTTPException(status_code=404, detail="Course not found.")
    for field, value in payload.model_dump().items():
        setattr(course, field, value)
    db.add(course)
    db.commit()
    db.refresh(course)
    return _to_out(course, db)


@router.post("/{course_id}/publish", response_model=CourseOut)
def publish_course(
    course_id: int, db: Session = Depends(get_db), user: User = Depends(require_role(UserRole.ADMIN, UserRole.COMPANY))
):
    """Powers 'Publish Content' at the end of the Content Creator wizard."""
    course = db.get(Course, course_id)
    if not course or course.creator_id != user.id:
        raise HTTPException(status_code=404, detail="Course not found.")
    course.status = CourseStatus.PUBLISHED
    db.add(course)
    db.commit()
    db.refresh(course)
    return _to_out(course, db)


@router.post("/{course_id}/enroll", response_model=EnrollmentOut, status_code=201)
def enroll(course_id: int, db: Session = Depends(get_db), learner: User = Depends(require_role(UserRole.LEARNER))):
    course = db.get(Course, course_id)
    if not course or course.status != CourseStatus.PUBLISHED:
        raise HTTPException(status_code=404, detail="Course not found.")
    existing = db.query(Enrollment).filter(Enrollment.course_id == course_id, Enrollment.learner_id == learner.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled.")
    if course.enrollment_limit:
        current = db.query(Enrollment).filter(Enrollment.course_id == course_id).count()
        if current >= course.enrollment_limit:
            raise HTTPException(status_code=400, detail="This course is full.")

    enrollment = Enrollment(course_id=course_id, learner_id=learner.id)
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    out = EnrollmentOut.model_validate(enrollment)
    out.course_title = course.title
    return out


@router.get("/me/enrollments", response_model=list[EnrollmentOut])
def my_enrollments(db: Session = Depends(get_db), learner: User = Depends(require_role(UserRole.LEARNER))):
    enrollments = db.query(Enrollment).filter(Enrollment.learner_id == learner.id).all()
    out = []
    for e in enrollments:
        course = db.get(Course, e.course_id)
        data = EnrollmentOut.model_validate(e)
        data.course_title = course.title if course else None
        out.append(data)
    return out
