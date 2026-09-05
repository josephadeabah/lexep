from sqlalchemy.orm import Session

from app.models.enums import NotificationType
from app.models.notification import Notification


def notify(
    db: Session,
    *,
    user_id: int,
    type: NotificationType,
    title: str,
    body: str | None = None,
    action_label: str | None = None,
    action_url: str | None = None,
) -> Notification:
    """Creates an in-app notification. Call this from any router at the
    moment something notification-worthy happens (interview scheduled,
    mentorship accepted, assessment graded, ...). Does not commit — callers
    already have a db.commit() nearby for the primary change; this just adds
    the row to the same transaction."""
    notification = Notification(
        user_id=user_id, type=type, title=title, body=body, action_label=action_label, action_url=action_url
    )
    db.add(notification)
    return notification
