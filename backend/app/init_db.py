"""
Quick-start table creation.

For local development this is enough to get a working schema without
running Alembic. For production, prefer proper migrations:

    alembic revision --autogenerate -m "message"
    alembic upgrade head

Run this module directly to create tables:

    python -m app.init_db
"""

from app.core.database import Base, engine
from app import models  # noqa: F401 — registers models on Base.metadata


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")


if __name__ == "__main__":
    init_db()
