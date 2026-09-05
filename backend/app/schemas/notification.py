from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.enums import NotificationType


class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    type: NotificationType
    title: str
    body: Optional[str] = None
    action_label: Optional[str] = None
    action_url: Optional[str] = None
    is_read: bool
    created_at: datetime
