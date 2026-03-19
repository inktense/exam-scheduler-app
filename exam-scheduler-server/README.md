# exam-scheduler-server

NestJS REST API for the exam scheduling app.

## Requirements

- Node.js 18+
- PostgreSQL (or use the Docker Compose at the repo root)

## Setup

```bash
npm install
cp .env.example .env
```

| Variable      | Default          |
|---------------|------------------|
| `DB_HOST`     | `localhost`      |
| `DB_PORT`     | `5432`           |
| `DB_USER`     | `postgres`       |
| `DB_PASSWORD` | `postgres`       |
| `DB_NAME`     | `exam_scheduler` |

## Run

Start Postgres first (from repo root):

```bash
docker-compose up -d
```

Then start the server:

```bash
npm run start:dev
```

API is available at `http://localhost:3000/api`.

On first boot the database is seeded with two test users and five predefined exams:

| Username | Password      |
|----------|---------------|
| `alice`  | `password123` |
| `bob`    | `password123` |

| Exam | Duration | Questions |
|------|----------|-----------|
| AWS Certified Cloud Practitioner | 90 min | 65 |
| AWS Certified Solutions Architect – Associate | 130 min | 65 |
| AWS Certified Developer – Associate | 130 min | 65 |
| AWS Certified SysOps Administrator – Associate | 130 min | 65 |
| AWS Certified Solutions Architect – Professional | 180 min | 75 |

## Architecture & Key Decisions

**Layered architecture** — controllers handle HTTP only, services contain all business logic, repositories abstract all database access. No TypeORM calls outside of repository classes.

**HTTP Basic Auth** — chosen for simplicity. Every request decodes the `Authorization: Basic <base64>` header, looks up the user, and verifies the password with bcrypt. Stateless by design — no sessions or tokens.

**Physical delete** — `DELETE /api/sessions/:id` removes the row from the database. Soft delete (setting `status = CANCELED`) would be preferable in production for audit trails but adds filtering complexity not warranted here.

**`synchronize: true`** — TypeORM auto-syncs the schema on boot. Acceptable for a take-home; in production this would be replaced with explicit migrations.

**Predefined exams model** — exams are defined server-side (name, duration, number of questions) and seeded on first boot. Session creation takes an `examId`; `durationMinutes` is derived from the exam and cannot be overridden by the client. This keeps exam data authoritative and consistent.

**Seeded users and exams** — alice, bob, and all five AWS exams are created on first boot so the app can be demoed immediately.

## Tests

```bash
npm test
```
