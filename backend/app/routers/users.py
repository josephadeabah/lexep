from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api_deps import get_current_user
from app.core.database import get_db
from app.models.enums import UserRole
from app.models.user import CompanyProfile, LearnerProfile, MentorProfile, User
from app.schemas.user import (
    AccountUpdate,
    CompanyOnboarding,
    LearnerOnboarding,
    MentorOnboarding,
    NotificationPreferences,
    PrivacySettings,
    RoleSelect,
    UserOut,
)

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("/me/role", response_model=UserOut)
def choose_role(payload: RoleSelect, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """'Choose your journey' screen — sets Learner / Mentor / Company. Admin
    accounts are provisioned directly (e.g. via the seed script), not through
    self-service role selection."""
    if payload.role == UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin accounts cannot be self-assigned.")
    user.role = payload.role
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.put("/me/onboarding/learner", response_model=UserOut)
def onboard_learner(payload: LearnerOnboarding, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == user.id).first()
    if not profile:
        profile = LearnerProfile(user_id=user.id)
    for field, value in payload.model_dump().items():
        setattr(profile, field, value)
    user.onboarding_completed = True
    db.add_all([profile, user])
    db.commit()
    db.refresh(user)
    return user


@router.put("/me/onboarding/mentor", response_model=UserOut)
def onboard_mentor(payload: MentorOnboarding, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    profile = db.query(MentorProfile).filter(MentorProfile.user_id == user.id).first()
    if not profile:
        profile = MentorProfile(user_id=user.id)
    for field, value in payload.model_dump().items():
        setattr(profile, field, value)
    user.onboarding_completed = True
    db.add_all([profile, user])
    db.commit()
    db.refresh(user)
    return user


@router.put("/me/onboarding/company", response_model=UserOut)
def onboard_company(payload: CompanyOnboarding, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    profile = db.query(CompanyProfile).filter(CompanyProfile.user_id == user.id).first()
    if not profile:
        profile = CompanyProfile(user_id=user.id)
    for field, value in payload.model_dump().items():
        setattr(profile, field, value)
    user.onboarding_completed = True
    db.add_all([profile, user])
    db.commit()
    db.refresh(user)
    return user


@router.put("/me/account", response_model=UserOut)
def update_account(payload: AccountUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.put("/me/notifications", response_model=UserOut)
def update_notifications(
    payload: NotificationPreferences, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    user.notification_preferences = payload.preferences
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.put("/me/privacy", response_model=UserOut)
def update_privacy(payload: PrivacySettings, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    user.privacy_settings = payload.settings
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
