# CLAUDE.md — Exam Scheduling Tool

This file contains the full implementation specification for Claude Code (or any AI coding assistant) to implement the exam scheduling take-home assignment.

---

## Project Overview

A small full-stack exam scheduling app. Users authenticate with Basic Auth and can list, create, and cancel their own exam sessions. The domain model is inspired by AWS certification scheduling.

---

## Repository Structure

```
exam-scheduler-app/
├── exam-scheduler-server/         # NestJS app (already scaffolded)
├── exam-scheduler-frontend/        # React + Vite app (already scaffolded)
└── CLAUDE.md
```

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | NestJS + TypeScript                 |
| Database  | PostgreSQL + TypeORM                |
| Frontend  | React + Vite + TypeScript           |
| Auth      | HTTP Basic Auth (base64 encoded)    |
| Testing   | Jest (NestJS built-in)              |

---

## Backend

### Architecture

Use a clean layered architecture with the **repository pattern**:

```
src/
├── app.module.ts
├── main.ts
├── database/
│   └── database.module.ts
├── auth/
│   ├── auth.module.ts
│   ├── basic-auth.guard.ts        # Decodes Authorization: Basic header
│   └── current-user.decorator.ts # @CurrentUser() param decorator
├── users/
│   ├── users.module.ts
│   ├── user.entity.ts
│   ├── users.repository.ts        # TypeORM-backed data access
│   ├── users.service.ts           # Business logic
│   ├── users.controller.ts        # POST /api/users/register (public)
│   └── dto/
│       ├── register-user.dto.ts
│       └── user-response.dto.ts
├── sessions/
│   ├── sessions.module.ts
│   ├── session.entity.ts
│   ├── sessions.repository.ts     # TypeORM-backed data access
│   ├── sessions.service.ts        # Business logic
│   ├── sessions.controller.ts     # HTTP handlers
│   └── dto/
│       ├── create-session.dto.ts
│       └── session-response.dto.ts
└── seed/
    └── seed.ts                    # Seeds test users on startup
```

**Key design principle:** Controllers handle HTTP concerns only. Services contain all business logic. Repositories abstract all database access. No TypeORM calls outside of repository classes.

---

### Database Entities

#### `users` table

```typescript
// user.entity.ts
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
}

export enum UserRole {
  USER = 'USER',
}
```

#### `sessions` table

```typescript
// session.entity.ts
@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  examName: string;

  @Column({ type: 'timestamptz' })
  scheduledAt: Date;

  @Column({ type: 'int' })
  durationMinutes: number;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.SCHEDULED })
  status: SessionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  CANCELED = 'CANCELED',
}
```

---

### Authentication

Use **HTTP Basic Auth** only. No JWT, no sessions, no OAuth.

- Every protected request must include: `Authorization: Basic <base64(username:password)>`
- Implement a NestJS `Guard` (`BasicAuthGuard`) that:
  1. Reads the `Authorization` header
  2. Decodes the base64 credentials
  3. Looks up the user by username
  4. Compares password against the stored hash using `bcrypt`
  5. Attaches the user to the request object
  6. Throws `UnauthorizedException` if anything fails
- Implement a `@CurrentUser()` decorator that extracts `req.user`
- Apply the guard globally or on the sessions controller (either is fine, document the choice)
- Passwords must be hashed using `bcrypt` (rounds: 10). **Never store plain text passwords.**

```typescript
// basic-auth.guard.ts outline
// 1. Extract header: req.headers.authorization
// 2. Check it starts with 'Basic '
// 3. Buffer.from(base64Part, 'base64').toString('utf-8') => 'username:password'
// 4. Split on first ':' only (passwords may contain colons)
// 5. usersService.findByUsername(username)
// 6. bcrypt.compare(password, user.passwordHash)
// 7. req.user = user
```

---

### API Endpoints

Base path: `/api`

All session endpoints require `Authorization: Basic <base64>` header. The registration endpoint is public.

#### `POST /api/users/register` (public — no auth required)

- Creates a new user with role `USER`
- Body (JSON):
  ```json
  { "username": "alice", "password": "password123" }
  ```
- Validation rules:
  - `username`: required, non-empty string
  - `password`: required, minimum 6 characters
- Hashes the password with bcrypt before storing
- Returns `201 Created` with `{ id, username, role, createdAt }` — **never return `passwordHash`**
- Returns `409 Conflict` if the username is already taken

Add a `UsersController` with this single endpoint. The `BasicAuthGuard` must **not** be applied to this route — it must remain publicly accessible.

#### `GET /api/sessions`

- Returns all sessions belonging to the authenticated user
- **Do not** return sessions of other users
- Response: array of session objects (see response DTO below)
- Order by `scheduledAt` ascending

#### `POST /api/sessions`

- Creates a new session for the authenticated user
- Body (JSON):
  ```json
  {
    "examName": "AWS Solutions Architect Associate",
    "scheduledAt": "2025-09-01T10:00:00.000Z",
    "durationMinutes": 130
  }
  ```
- Validation rules (use `class-validator`):
  - `examName`: required, non-empty string
  - `scheduledAt`: required, valid ISO date string, must be in the future
  - `durationMinutes`: required, positive integer (min: 1)
- Returns the created session object with `201 Created`

#### `DELETE /api/sessions/:id`

- Deletes the session **physically** from the database
- Must verify the session belongs to the authenticated user before deleting
- Returns `204 No Content` on success
- Returns `404 Not Found` if session does not exist
- Returns `403 Forbidden` if session belongs to another user

> **Trade-off note (include in README):** Physical delete is used to match the assignment wording ("cancel") and keep scope small. Soft delete (setting `status = CANCELED`) would be preferable in production for audit trails and analytics, but adds complexity (filtering out canceled records on list endpoints) that isn't warranted here.

---

### DTOs

```typescript
// create-session.dto.ts
export class CreateSessionDto {
  @IsString()
  @IsNotEmpty()
  examName: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledAt: string; // validated as future date in service layer

  @IsInt()
  @Min(1)
  durationMinutes: number;
}

// session-response.dto.ts
export class SessionResponseDto {
  id: string;
  examName: string;
  scheduledAt: Date;
  durationMinutes: number;
  status: SessionStatus;
  createdAt: Date;
}
```


```typescript
// register-user.dto.ts
export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}

// user-response.dto.ts — returned from register; never expose passwordHash
export class UserResponseDto {
  id: string;
  username: string;
  role: UserRole;
  createdAt: Date;
}
```
---

### Database Configuration

Use TypeORM with the following config in `database.module.ts`:

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'exam_scheduler',
  entities: [User, Session],
  synchronize: true, // OK for dev/take-home; disable in production
})
```

Environment variables to document in `.env.example`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=exam_scheduler
```

---

### Seeding

On application bootstrap, seed the database with at least two test users if they don't already exist:

```typescript
// seed.ts — called from AppModule.onModuleInit() or a dedicated bootstrap hook
const testUsers = [
  { username: 'alice', password: 'password123' },
  { username: 'bob', password: 'password123' },
];
// Hash passwords with bcrypt before inserting
// Use findOneBy({ username }) to skip if already exists
```

This allows immediate demo without any registration flow.

---

### Error Handling

Use NestJS built-in HTTP exceptions:
- `UnauthorizedException` — missing or invalid credentials
- `NotFoundException` — session not found
- `ForbiddenException` — session belongs to another user
- `BadRequestException` — invalid input (handled automatically by ValidationPipe)

Enable global `ValidationPipe` in `main.ts`:
```typescript
app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
app.setGlobalPrefix('api');
```

---

### Tests

Write tests for at least one backend endpoint using NestJS testing utilities (Jest).

**Minimum required:** test the `SessionsController` or `SessionsService`.

Suggested test file: `sessions.service.spec.ts`

Test cases to cover:
1. `findAllByUser` — returns only sessions belonging to the given user
2. `create` — creates and returns a new session with correct userId
3. `remove` — throws `NotFoundException` when session doesn't exist
4. `remove` — throws `ForbiddenException` when session belongs to another user
5. `remove` — deletes successfully when session belongs to the user

Use `jest.fn()` mocks for the repository layer so tests don't require a database connection.

---

## Frontend

### Structure

```
src/
├── App.tsx
├── main.tsx
├── api/
│   ├── sessions.ts       # Session CRUD calls, attaches Basic Auth header
│   └── users.ts          # Registration call (POST /api/users/register)
├── components/
│   ├── AuthPage.tsx       # Contains Login and Register tabs/toggle
│   ├── LoginForm.tsx      # Username + password inputs
│   ├── RegisterForm.tsx   # Username + password inputs for new account
│   ├── SessionList.tsx    # Displays sessions, handles delete
│   └── CreateSessionForm.tsx  # Form to create a session
└── types/
    └── session.ts         # TypeScript types matching backend response
```

### Auth approach

- No token storage. Store `username` and `password` in React state (or `useState` at App level).
- Every API call constructs the `Authorization: Basic <base64>` header:
  ```typescript
  const encoded = btoa(`${username}:${password}`);
  headers: { 'Authorization': `Basic ${encoded}` }
  ```
- On `401` response from any API call, clear credentials and return the user to the auth page.

### UI Behaviour

**Unauthenticated state (Auth page):**
- Show a single page with two modes: **Login** and **Register**, switchable via a tab or toggle
- **Login tab:**
  - Username and password fields
  - On submit, attempt to fetch sessions — if successful, transition to the main view; if `401`, show an inline error
- **Register tab:**
  - Username and password fields
  - On submit, call `POST /api/users/register` with `{ username, password }`
  - On success (`201`), automatically switch to the Login tab and show a success message ("Account created — please log in")
  - On error (e.g. `409 Conflict` for duplicate username), show the error inline

**Authenticated state (one main page):**
- Display the current user's sessions in a table or list
  - Columns: Exam Name, Scheduled At, Duration, Status, Actions
  - Each row has a Delete button
- A "Schedule New Exam" form below (or a collapsible section) with:
  - Exam Name (text input)
  - Scheduled At (datetime-local input)
  - Duration in Minutes (number input)
  - Submit button
- Loading states: show a spinner or "Loading..." text while fetching
- Error states: show error messages from the API inline (don't just silently fail)
- After creating or deleting a session, refresh the session list

### API module

```typescript
// api/users.ts
const BASE_URL = 'http://localhost:3000/api';

export async function registerUser(username: string, password: string): Promise<void> { ... }
// POST /api/users/register — no auth header needed, public endpoint
// Returns 201 on success, 409 if username already taken

// api/sessions.ts
function authHeader(username: string, password: string) {
  return { Authorization: `Basic ${btoa(`${username}:${password}`)}` };
}

export async function getSessions(username: string, password: string) { ... }
export async function createSession(username: string, password: string, data: CreateSessionPayload) { ... }
export async function deleteSession(username: string, password: string, id: string) { ... }
```

### TypeScript types

```typescript
// types/session.ts
export interface Session {
  id: string;
  examName: string;
  scheduledAt: string;
  durationMinutes: number;
  status: 'SCHEDULED' | 'CANCELED';
  createdAt: string;
}

export interface CreateSessionPayload {
  examName: string;
  scheduledAt: string;
  durationMinutes: number;
}
```

---

## README Content (generate this file too)

The README should include:

1. **Architecture overview** — describe the layered backend (controller → service → repository) and simple frontend
2. **How to run locally** — Docker Compose for Postgres, `npm run start:dev` for backend, `npm run dev` for frontend
3. **Test users** — list seeded credentials (alice / password123, bob / password123)
4. **Key design decisions:**
   - Basic Auth chosen for simplicity; suitable for take-home, not production
   - Repository pattern keeps business logic decoupled from data access
   - `synchronize: true` used in TypeORM for ease of setup; would use migrations in production
5. **Trade-offs:**
   - Physical delete vs. soft delete (explain both)
   - Registration is a thin public endpoint — no email verification, no password strength enforcement beyond minimum length. Seeded users remain available for quick demo without going through the UI.
   - No session expiry or token invalidation (Basic Auth is stateless)
6. **AI tool usage** — mention Claude Code was used; list prompts (see section below)

---

## Docker Compose

Include a `docker-compose.yml` at the repo root for local Postgres:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: exam_scheduler
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

---

## AI Prompts to Document

The assignment requires listing all prompts used with the AI tool. Use the following prompts with Claude Code and include them verbatim in the README under an "AI Assistant Usage" section. Add `// AI-GENERATED` comments to any file or block produced by the AI.

### Suggested prompts to use and document:

1. **Architecture scaffold:**
   > "Using this CLAUDE.md as the spec, scaffold the NestJS backend with the folder structure described. Create empty files with correct module imports but no implementation yet. Use TypeORM and PostgreSQL."

2. **Entity generation:**
   > "Implement the User and Session TypeORM entities as specified in CLAUDE.md. Include the enum types and relations."

3. **Auth guard:**
   > "Implement the BasicAuthGuard and CurrentUser decorator as described in CLAUDE.md. Use bcrypt for password comparison."

4. **Sessions CRUD:**
   > "Implement the SessionsRepository, SessionsService, and SessionsController following the repository pattern. Use the DTOs and validation rules in CLAUDE.md."

5. **Seeding:**
   > "Implement the database seed that creates alice and bob on first startup using bcrypt to hash passwords. Skip if they already exist."

6. **Tests:**
   > "Write Jest unit tests for SessionsService as specified in CLAUDE.md. Mock the repository layer."

7. **Registration endpoint:**
   > "Implement POST /api/users/register in UsersController as described in CLAUDE.md. It should be public (no BasicAuthGuard), hash the password with bcrypt, return 409 on duplicate username, and never return the passwordHash field."

8. **Frontend:**
   > "Implement the React frontend as described in CLAUDE.md: an auth page with Login and Register tabs, a session list with delete, and a create session form. Use Basic Auth headers on every session request. On register success, switch to the login tab with a confirmation message."

---

## Implementation Notes for Claude Code

- Use `@nestjs/common`, `@nestjs/typeorm`, `typeorm`, `bcrypt`, `class-validator`, `class-transformer` — install if not present
- Frontend: use `fetch` directly (no axios needed), keep components small and focused
- Do not add unnecessary abstractions: no CQRS, no event sourcing, no additional patterns beyond what's specified
- Keep the solution at an appropriate scope for a take-home assignment
- Add `// AI-GENERATED` comment at the top of any file substantially produced by the AI tool
- CORS: enable CORS in `main.ts` for `http://localhost:5173` (Vite default port)