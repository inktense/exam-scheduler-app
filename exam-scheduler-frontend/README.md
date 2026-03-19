# exam-scheduler-frontend

React + Vite frontend for the exam scheduling app.

## Requirements

- Node.js 18+
- The backend server running at `http://localhost:3000`

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

App is available at `http://localhost:5173`.

## Auth

The app uses HTTP Basic Auth. Credentials are held in React state for the session and never persisted to localStorage or cookies. Every API request attaches an `Authorization: Basic <base64>` header.

Use the seeded accounts to log in without registering:

| Username | Password      |
|----------|---------------|
| `alice`  | `password123` |
| `bob`    | `password123` |

## Architecture & Key Decisions

**No token storage** — credentials (username + password) are held in React state at the `App` level only. They are never written to localStorage, sessionStorage, or cookies. Clearing state (logout or page refresh) immediately revokes access.

**Credential propagation** — `App.tsx` owns the credentials and passes them down to API call sites. Every `fetch` constructs the `Authorization: Basic <base64>` header inline. On any `401` response, credentials are cleared and the user is returned to the auth page.

**No external HTTP library** — all API calls use the native `fetch` API. The app is small enough that axios or react-query would add overhead without meaningful benefit.

**Flat component structure** — no global state library. Session data lives in `App.tsx` and is passed as props. This keeps data flow explicit and easy to trace.

**Exam selection flow** — on the scheduling form, available exams are fetched from `GET /api/exams` on mount. Selecting an exam auto-fills the duration field (read-only). The form submits only `examId` and `scheduledAt` — duration is derived server-side from the exam, not sent by the client.

## Build

```bash
npm run build
```
