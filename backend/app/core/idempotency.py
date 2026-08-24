"""
Idempotency middleware.

The frontend's offline outbox (frontend/lib/offline/outbox.ts) queues
mutating requests (POST/PUT/PATCH/DELETE) made while offline and replays
them once connectivity returns. Each queued request carries a client-
generated `Idempotency-Key` header. If a retry (or a duplicate replay after
a flaky reconnect) sends the same key twice, this middleware short-circuits
the second request and returns the first response verbatim instead of
re-running the handler — so the same "contribute $50" or "apply to
internship" action can never be double-applied against the database.

Only requests that actually carry the header are affected; normal online
traffic is untouched.
"""
import json

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from app.core.database import SessionLocal
from app.models.billing import IdempotencyRecord

MUTATING_METHODS = {"POST", "PUT", "PATCH", "DELETE"}


class IdempotencyMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        key = request.headers.get("idempotency-key")
        if not key or request.method not in MUTATING_METHODS:
            return await call_next(request)

        db = SessionLocal()
        try:
            existing = db.query(IdempotencyRecord).filter(IdempotencyRecord.key == key).first()
            if existing:
                return Response(
                    content=json.dumps(existing.response_body),
                    status_code=existing.status_code,
                    media_type="application/json",
                    headers={"X-Idempotent-Replay": "true"},
                )

            response = await call_next(request)

            body_chunks = [chunk async for chunk in response.body_iterator]
            body = b"".join(body_chunks)

            if response.status_code < 500:
                try:
                    parsed = json.loads(body) if body else None
                except json.JSONDecodeError:
                    parsed = None
                if parsed is not None:
                    db.add(
                        IdempotencyRecord(
                            key=key,
                            endpoint=str(request.url.path),
                            status_code=response.status_code,
                            response_body=parsed,
                        )
                    )
                    db.commit()

            return Response(
                content=body,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.media_type,
            )
        finally:
            db.close()
