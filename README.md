# Exam Scheduler

A full-stack exam scheduling app inspired by the Amazon certification exam booking flow. Users can register, log in, and manage their own exam sessions — schedule new ones or cancel existing ones.

---

## Tech Stack

| Layer    | Technology | Why |
|----------|------------|-----|
| Backend  | NestJS + TypeScript | Structured, opinionated framework that naturally enforces layered architecture |
| Database | PostgreSQL + TypeORM | Relational model fits the user→sessions relationship well; TypeORM keeps entity definitions close to the code |
| Frontend | React + Vite + TypeScript | Lightweight, fast dev experience; no framework overhead needed for an app this size |
| Auth     | HTTP Basic Auth | Simple and stateless, acceptable for non production take-home assignment |
| Testing  | Jest (NestJS built-in) | Zero-config unit testing for the service layer |

---

## Running the Project

**1. Start the database**

```bash
docker-compose up -d
```

**2. Start the backend**

```bash
cd exam-scheduler-server
npm install
npm run start:dev
```

API available at `http://localhost:3000/api`. On first boot, two test users are seeded automatically:

| Username | Password      |
|----------|---------------|
| `alice`  | `password123` |
| `bob`    | `password123` |

**3. Start the frontend**

```bash
cd exam-scheduler-frontend
npm install
npm run dev
```

App available at `http://localhost:5173`.

---

## Authentication

The app uses **HTTP Basic Auth**. Every request includes an `Authorization: Basic <base64(username:password)>` header. Passwords are hashed with bcrypt (10 rounds) and never stored or returned in plain text.

This was chosen deliberately over JWT or sessions — it keeps the implementation simple and stateless, which is appropriate for a take-home. In a production system you'd want short-lived tokens, refresh logic, and proper session management.

---

## Architecture

### Backend

The backend follows a strict three-layer design:

```
Controller  →  receives HTTP request, delegates to service
Service     →  contains all business logic, calls repository
Repository  →  only layer that touches the database (TypeORM)
```

No TypeORM queries live outside repository classes. This makes the code easy to test (mock the repository, unit test the service) and easy to extend (swap the database layer without touching business logic).

### Frontend

State is kept flat — credentials and session data live in `App.tsx` and flow down as props. No global state library was introduced; the app is small enough that it would add overhead without benefit. All API calls construct the Basic Auth header inline and redirect to the login page on any `401`.

---

## Tooling

A **PostToolUse hook** runs automatically after every file edit. It executes a TypeScript type-check across the project and surfaces type errors immediately, without needing to run a build or switch to the terminal.

This keeps the feedback loop tight during AI-assisted development — catching issues like missing properties, wrong types, or renamed methods as soon as a file is written.

The hook could be extended to also run ESLint, execute the test suite on affected files, or post a summary diff to a PR comment on every save.

---

## AI Usage

This project was built with **Claude Code** (Anthropic's CLI coding assistant).

> **The technology stack, database design, backend architecture, and all key technical decisions were made independently before any AI tooling was involved.** Claude Code was used strictly for implementation — translating a pre-written spec into working code.

The `CLAUDE.md` file at the repo root served as the full implementation spec. It was authored using a personal reusable template and adapted for this project — covering entity design, API contracts, auth strategy, folder structure, and test requirements. Claude Code used it as the source of truth throughout implementation.

All prompts used during development were tracked in `PROMPTS.md`. Some of the prompts were adapted from personal templates used in previous personal projects.

---

## Trade-offs & Future Improvements

**Kept simple intentionally:**
- Basic Auth instead of OAuth / JWT
- `synchronize: true` in TypeORM (auto-migrates schema on boot — fine for dev, not for production)
- Physical delete instead of soft delete (no audit trail, but less complexity)
- No email verification, password reset, or rate limiting

**Easy next steps if this were a real product:**
- Replace Basic Auth with JWT + refresh tokens
- Add scheduling conflict detection (prevent double-booking a time slot)
- Soft delete sessions (keep history, support cancellation emails)
- Role-based access (admin view of all sessions, not just own)
- TypeORM migrations instead of `synchronize`
- CI pipeline running tests and type-checks on every PR
