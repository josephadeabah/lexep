import re
import secrets

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api_deps import get_current_user
from app.core.database import get_db
from app.models.grant import Contribution, Grant, GrantGroup
from app.models.user import User
from app.schemas.grant import (
    ContributionCreate,
    ContributionOut,
    GrantCreate,
    GrantGroupCreate,
    GrantGroupOut,
    GrantOut,
)

router = APIRouter(prefix="/api/grants", tags=["grants"])


def _slugify(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or "group"


def _group_to_out(group: GrantGroup) -> GrantGroupOut:
    percent = round((group.raised_amount / group.goal_amount) * 100, 1) if group.goal_amount else 0.0
    data = GrantGroupOut.model_validate(group)
    data.percent_funded = percent
    return data


@router.post("", response_model=GrantOut, status_code=201)
def apply_for_grant(payload: GrantCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """3-step 'Grant Application' wizard — final submit."""
    grant = Grant(applicant_id=user.id, **payload.model_dump())
    db.add(grant)
    db.commit()
    db.refresh(grant)
    return grant


@router.get("/mine", response_model=list[GrantOut])
def my_grants(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Grant).filter(Grant.applicant_id == user.id).all()


@router.post("/groups", response_model=GrantGroupOut, status_code=201)
def create_group(payload: GrantGroupCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Powers the 'Create Group' (Lexep Impact) flow."""
    group = GrantGroup(organizer_id=user.id, **payload.model_dump())
    group.invite_link = f"lexep.org/join/{_slugify(payload.name)}-{secrets.token_hex(2)}"
    db.add(group)
    db.commit()
    db.refresh(group)
    return _group_to_out(group)


@router.get("/impact/summary")
def impact_summary(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Powers the 'Impact Dashboard' stat cards for a grant-group organizer."""
    groups = db.query(GrantGroup).filter(GrantGroup.organizer_id == user.id).all()
    return {
        "total_youth_sponsored": sum(g.youth_sponsored for g in groups),
        "total_raised": sum(g.raised_amount for g in groups),
        "active_groups": len(groups),
    }


@router.get("/groups", response_model=list[GrantGroupOut])
def list_groups(db: Session = Depends(get_db)):
    groups = db.query(GrantGroup).all()
    return [_group_to_out(g) for g in groups]


@router.get("/groups/{group_id}", response_model=GrantGroupOut)
def get_group(group_id: int, db: Session = Depends(get_db)):
    group = db.get(GrantGroup, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found.")
    return _group_to_out(group)


@router.get("/groups/{group_id}/contributors", response_model=list[ContributionOut])
def top_contributors(group_id: int, db: Session = Depends(get_db)):
    return (
        db.query(Contribution)
        .filter(Contribution.group_id == group_id)
        .order_by(Contribution.amount.desc())
        .limit(10)
        .all()
    )


@router.post("/groups/{group_id}/contribute", response_model=ContributionOut, status_code=201)
def contribute(
    group_id: int,
    payload: ContributionCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Powers the 'Contribute Now' button on the group detail page."""
    group = db.get(GrantGroup, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found.")

    contribution = Contribution(
        group_id=group_id,
        contributor_id=user.id,
        contributor_name=payload.contributor_name or user.full_name,
        amount=payload.amount,
    )
    group.raised_amount += payload.amount
    db.add_all([contribution, group])
    db.commit()
    db.refresh(contribution)
    return contribution
