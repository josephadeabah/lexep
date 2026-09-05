"""
Shared pytest fixtures. Every test gets a fresh, isolated in-memory SQLite
database — no shared state between tests, no real Postgres required to run
the suite. Uses StaticPool so the single in-memory connection survives
across the session (SQLite in-memory DBs are otherwise per-connection).
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import app


@pytest.fixture()
def client():
    engine = create_engine(
        "sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


def register(client, email="user@example.com", full_name="Test User", password="pass1234"):
    res = client.post("/api/auth/register", json={"email": email, "full_name": full_name, "password": password})
    assert res.status_code == 201, res.text
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}, res.json()["user"]


def set_role(client, headers, role):
    res = client.post("/api/users/me/role", json={"role": role}, headers=headers)
    assert res.status_code == 200, res.text
    return res.json()


def make_admin(client, email="admin@example.com", full_name="Admin User", password="pass1234"):
    """Promotes a freshly-registered user straight to admin via the same
    DB session the test's TestClient is using (there's no self-service
    admin signup by design — see routers/users.py::choose_role)."""
    from app.core.database import get_db
    from app.main import app
    from app.models.user import User

    headers, user = register(client, email, full_name, password)
    db = next(app.dependency_overrides[get_db]())
    db_user = db.query(User).filter(User.email == email).first()
    db_user.role = "admin"
    db_user.onboarding_completed = True
    db.add(db_user)
    db.commit()
    db.close()
    return headers, user
