# Lexep

A platform connecting African youth with mentors, internships, and community-funded grants.

This repo contains two independent, deployable apps:

- **`frontend/`** — Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **`backend/`** — FastAPI + SQLAlchemy 2.0 + PostgreSQL, JWT auth

Both are wired together and were built directly against the `DESIGN.md` design system and the UI screens supplied (sign-in/up, onboarding, dashboards, opportunities, mentorship, grants, settings).

---

## Quick start (Docker — recommended)

This brings up Postgres, the API, and the web app together, fully seeded with demo data.

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API docs (Swagger): http://localhost:8000/docs

The backend container creates all tables automatically on first boot. To load demo data (a company with an open internship + 4 applicants, an approved mentor, and a funded grant group):

```bash
docker compose exec backend python -m app.seed
```

Demo login (after seeding): `hiring@technova.example` / `password123` (company), `sarah.omondi@example.com` / `password123` (approved mentor), `elias.thorne@example.com` / `password123` (mentor with a pending application, for the admin queue), `admin@lexep.org` / `password123` (admin), or sign up fresh as a learner.

---

## Quick start (manual / local dev)

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# For local dev without Postgres, you can instead set:
#   DATABASE_URL=sqlite:///./lexep.db
# in .env, then skip the docker db entirely.

python -m app.init_db     # creates tables
python -m app.seed        # optional demo data
uvicorn app.main:app --reload
```

API runs at http://localhost:8000, interactive docs at `/docs`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

App runs at http://localhost:3000.

---

## Project structure

```
lexep/
├── docker-compose.yml
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app + router registration
│   │   ├── core/               # config, db session, security (JWT/bcrypt)
│   │   ├── models/             # SQLAlchemy models (one file per domain)
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── routers/            # auth, users, opportunities, interviews, mentors, grants, admin, assessments
│   │   ├── api_deps.py         # get_current_user / require_role dependencies
│   │   ├── init_db.py          # quick-start table creation
│   │   └── seed.py             # demo data matching the design mockups (incl. an admin account,
│   │                           #   a pending mentor application, mentor packages, and a seeded quiz)
│   ├── alembic/                # migration scaffolding (see below)
│   └── requirements.txt
└── frontend/
    ├── app/
    │   ├── page.tsx                     # public landing page
    │   ├── (auth)/sign-in, sign-up
    │   ├── onboarding/choose-role, learner, mentor, company
    │   └── (dashboard)/                 # authenticated app shell
    │       ├── dashboard                # role-aware: learner / mentor / company
    │       ├── opportunities            # browse+apply (learner) / manage (company)
    │       ├── opportunities/new        # 3-step "Post an Internship" wizard (company)
    │       ├── opportunities/[id]       # detail (learner) / applicant review (company)
    │       ├── opportunities/[id]/apply # 3-step "Apply for Internship" wizard (learner)
    │       ├── interviews               # company: Interview Schedule hub (calendar + pending + upcoming)
    │       ├── interviews/propose/[applicationId]        # company: propose multiple interview times
    │       ├── interviews/[interviewId]/select-time      # learner: pick a proposed time
    │       ├── interviews/[interviewId]/confirmed        # confirmation screen
    │       ├── mentorship               # find a mentor / mentor profile + packages
    │       ├── mentorship/[mentorId]/request  # learner: propose session times
    │       ├── mentorship/request-sent  # confirmation screen
    │       ├── mentorship/apply         # 3-step mentor application wizard
    │       ├── mentorship/requests      # mentor: accept/decline pending requests
    │       ├── mentorship/packages      # mentor: manage bookable packages
    │       ├── mentorship/students      # mentor: active mentee tracking
    │       ├── assessments              # Skill Assessment Hub
    │       ├── assessments/[id]/take    # quiz-taking UI with question map
    │       ├── assessments/attempts/[attemptId]/results  # score + topic breakdown
    │       ├── grants                   # Impact Dashboard
    │       ├── grants/new               # create a funding group
    │       ├── grants/apply             # 3-step individual grant application
    │       ├── grants/[groupId]         # group detail + contribute
    │       ├── settings                 # account / notifications / privacy
    │       └── courses                  # learning paths (static catalog — see note below)
    │   admin/                           # separate 'Lexep Admin' shell (role=admin only)
    │       ├── applications             # Mentor Application Queue (stats + filterable table)
    │       └── applications/[userId]    # review detail: credential checklist, notes, approve/decline
    ├── components/
    │   ├── ui/                 # Button, Card, Input, Select, Checkbox, Radio, Badge,
    │   │                       # Avatar, ProgressBar, Stepper, DonutProgress
    │   └── layout/              # Sidebar, DashboardShell (auth guard + role-aware nav)
    ├── lib/
    │   ├── api.ts               # typed fetch client for every backend endpoint
    │   ├── auth-store.ts        # Zustand store (token in localStorage)
    │   ├── types.ts             # TS types mirroring the backend Pydantic schemas
    │   └── nav-config.ts        # sidebar nav items per role
    └── tailwind.config.ts       # every token from DESIGN.md mapped 1:1
```

## Design system

`tailwind.config.ts` transcribes `DESIGN.md` directly — every color (`primary-container`, `on-surface-variant`, `surface-container-low`, …), the full type scale (`text-display-lg`, `text-headline-md`, `text-body-md`, `text-label-sm`, …), radii, spacing, and shadows are available as Tailwind classes with the **exact same names** used in the spec. When you add a new screen, reach for the token named in the design doc — there's no translation layer.

Fonts: Hanken Grotesk (headings) and Inter (body) are loaded via `next/font/google` in `app/layout.tsx`, so they self-host at build time — no separate font files to manage, and no runtime request to Google Fonts.

## Auth

JWT bearer tokens issued on register/login, stored in `localStorage`, attached automatically by `lib/api.ts`. `DashboardShell` guards every route under `(dashboard)`: unauthenticated → `/sign-in`; authenticated but no role chosen → `/onboarding/choose-role`; role chosen but onboarding incomplete → the matching onboarding flow. Google/LinkedIn buttons are wired to a `POST /api/auth/oauth/{provider}` stub that returns `501` until you add real client credentials to `backend/.env` and fill in the provider exchange in `app/routers/auth.py`.

## What's real vs. mocked

Everything the screens showed is backed by real endpoints and a real Postgres schema **except**:

- **Courses / Learning Paths** (`/courses`) — the screens shown so far were browse-only, so this ships as a static catalog in the frontend. The shape is intentionally close to what a `GET /api/courses` response would look like, so swapping in a real `Course` model + router later is a small, contained change (see `app/(dashboard)/courses/page.tsx`).
- **Match scores** on applicant review are stored as a plain float column (`applications.match_score`), seeded with example values — plug in your actual matching/embedding logic to populate it.
- **Mentor accept → confirmed time** is simplified: when a mentor accepts a mentorship request, the backend picks the *first* of the learner's proposed times rather than letting the mentor choose among them (`routers/mentors.py > accept_request`). Extending this to a real picker is a small, contained change.
- **File uploads** (resume in the internship application, credential documents in the admin review) go through a real storage abstraction (local disk by default, Supabase Storage when enabled) — see "Feature flags & third-party integrations" below.
- **Meeting links** generated on interview confirmation are placeholder URLs (`https://meet.lexep.org/i/{id}`) rather than real Google Meet/Zoom API integrations.

## Feature flags & third-party integrations

Every paid feature and third-party integration in this app is off by default and controlled entirely through environment variables — flip a flag, add credentials, and the feature turns on with no code changes. See `backend/.env.example` for the full list. Summary:

| Feature | Flag | Provider | Behavior when off |
|---|---|---|---|
| Premium paywall | `PREMIUM_FEATURES_ENABLED` | — | Platform is entirely free; `/checkout/subscription` returns 403; pricing/upgrade pages still render so you can review the flow |
| Payments | `PAYMENTS_ENABLED` | Paystack (`PAYMENTS_PROVIDER=paystack`) | A mock provider completes every transaction instantly with no external calls — grant contributions and subscription checkout both work end-to-end for demos |
| Email | `EMAIL_ENABLED` | Brevo (`EMAIL_PROVIDER=brevo`) | Emails are logged instead of sent |
| SMS | `SMS_ENABLED` | Arkesel (`SMS_PROVIDER=arkesel`) | SMS are logged instead of sent |
| File storage | `SUPABASE_ENABLED` | Supabase Storage | Uploads (resumes, credential docs) are written to local disk (`backend/app/uploads/`) instead |

All four are implemented behind a small provider interface (`backend/app/integrations/{payments,email,sms,storage}/base.py`) with one real implementation and one no-op/mock implementation, selected by a factory function that reads the relevant flag. Adding a second provider for any of these (Stripe, SendGrid, Twilio, S3, ...) means writing one new class and adding a branch to that factory — nothing else in the app needs to know.

**On auth and Supabase specifically:** authentication stays on Lexep's own JWT system (`backend/app/core/security.py`) regardless of the `SUPABASE_ENABLED` flag — it's intentionally platform-agnostic and not tied to any vendor. Supabase is wired in purely as a **storage** backend for user-uploaded content (resumes, credential documents), toggled independently.

## Offline support

The frontend queues mutating requests (applying to an internship, contributing to a grant, accepting a mentorship request, etc.) made while offline instead of failing them:

- `frontend/lib/offline/db.ts` — a small IndexedDB wrapper (no external dependency) with two stores: an `outbox` of queued mutations and a best-effort `cache` of recent GET responses.
- `frontend/lib/offline/sync.ts` — replays the outbox in order as soon as the browser's `online` event fires, stopping (and retrying later) at the first failure so ordering is never violated.
- Every queued mutation carries a client-generated `Idempotency-Key` header. The backend's `IdempotencyMiddleware` (`backend/app/core/idempotency.py`) records the response for that key the first time it's seen and replays it verbatim on any retry — so a sync that gets interrupted and retried can never create duplicate rows (double-applying to a job, double-charging a grant contribution, etc.).
- `components/layout/OfflineBanner.tsx` shows a banner across the app when offline or while a queued batch is syncing.
- `public/sw.js` is a minimal service worker (cache-first for static assets, network-first-with-fallback for pages) so pages the user has already visited keep rendering while offline, rather than showing the browser's default offline error.

This is a real, working implementation, not a stub — but it's intentionally scoped to the actions most worth protecting (applications, contributions, mentorship requests) rather than every possible mutation in the app. Extending coverage to a new action is just passing an `offlineDescription` through the existing `api.ts` methods; the queuing/replay/idempotency plumbing is already there.

## Branding

HD logo marks live in `frontend/public/brand/`: `lexep-mark-gold.png` (for light backgrounds) and `lexep-mark-white.png` (for dark backgrounds, e.g. the sidebar). `components/ui/Logo.tsx` picks the right one via a `variant="light" | "dark"` prop — use that component anywhere the wordmark appears rather than hardcoding an image path.

## Migrations
The backend ships with Alembic wired up (`alembic/env.py` reads `DATABASE_URL` from the same settings as the app and imports all models automatically). `python -m app.init_db` is a fast path for local development; once the schema stabilizes, switch to real migrations:

```bash
cd backend
alembic revision --autogenerate -m "message"
alembic upgrade head
```

## Continuing this project

- More screens are coming — the existing patterns (design tokens, `DashboardShell` + `nav-config.ts` for new routes, `lib/api.ts` + Pydantic schemas for new endpoints, `useAsync` for data fetching) are meant to be extended, not re-invented, so new screens should drop in quickly.
- Swap `SECRET_KEY` and Postgres credentials before deploying anywhere public.
- CORS origins are read from `CORS_ORIGINS` in `backend/.env` — update it to your deployed frontend URL(s).
