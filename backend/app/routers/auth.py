from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api_deps import get_current_user
from app.core.database import get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.user import Token, UserCreate, UserLogin, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=400, detail="An account with this email already exists."
        )

    user = User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=str(user.id))
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if (
        not user
        or not user.hashed_password
        or not verify_password(payload.password, user.hashed_password)
    ):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")

    token = create_access_token(subject=str(user.id))
    return Token(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/oauth/{provider}", response_model=Token)
def oauth_login(provider: str, code: str, db: Session = Depends(get_db)):
    """
    Placeholder OAuth exchange endpoint for 'Continue with Google/LinkedIn'.

    In production this exchanges `code` for a provider access token, fetches
    the user's profile, and creates/looks up the local User record. Wire up
    the real provider SDK calls here once GOOGLE_CLIENT_ID / LINKEDIN_CLIENT_ID
    are configured in .env.
    """
    if provider not in ("google", "linkedin"):
        raise HTTPException(status_code=400, detail="Unsupported provider.")
    raise HTTPException(
        status_code=501,
        detail=f"{provider.title()} OAuth is not configured yet. Add credentials in .env to enable it.",
    )
