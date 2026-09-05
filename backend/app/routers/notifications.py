from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api_deps import get_current_user
from app.core.database import get_db
from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import NotificationOut
from app.schemas.pagination import Page, paginate

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("", response_model=Page[NotificationOut])
def list_notifications(
    filter: Optional[str] = None,  # "unread" | "mentorship" | None (all)
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Powers the Notification Center's All / Unread / Mentorship tabs."""
    query = db.query(Notification).filter(Notification.user_id == user.id)
    if filter == "unread":
        query = query.filter(Notification.is_read.is_(False))
    elif filter == "mentorship":
        query = query.filter(
            Notification.type.in_(["mentorship_accepted", "mentorship_declined", "mentor_application_decision"])
        )
    query = query.order_by(Notification.created_at.desc())

    items, total, total_pages = paginate(query, page, page_size)
    return Page(items=items, total=total, page=page, page_size=page_size, total_pages=total_pages)


@router.get("/unread-count")
def unread_count(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Powers the unread-count badge shown on the sidebar's Notifications item."""
    count = db.query(Notification).filter(Notification.user_id == user.id, Notification.is_read.is_(False)).count()
    return {"count": count}


@router.post("/{notification_id}/read", response_model=NotificationOut)
def mark_read(notification_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    notification = db.get(Notification, notification_id)
    if not notification or notification.user_id != user.id:
        return None
    notification.is_read = True
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


@router.post("/read-all")
def mark_all_read(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    db.query(Notification).filter(Notification.user_id == user.id, Notification.is_read.is_(False)).update(
        {"is_read": True}
    )
    db.commit()
    return {"ok": True}
