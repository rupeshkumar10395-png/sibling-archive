# Sibling Archive — Current State

## Baseline
The project is synchronized with the Antigravity baseline commit `4e3c295`.

### Completed
- Phase 0 — repository/package health
- Phase 1 — PostgreSQL + Prisma V1 schema (Link-based access)
- Phase 2 — shared TypeScript contracts
- Phase 3 — archive creation backend
- Phase 4 — Edit Access + Memory CRUD + Default Q&A

## Phase 4 Implementation Details
Phase 4 implemented the full memory lifecycle and the link-based authorization system.

### Edit-Token Authorization
Authorization is handled via the `requireEditAccess` middleware.
- **Flow**: Request $\rightarrow$ Extract Token $\rightarrow$ SHA-256 Hash $\rightarrow$ Lookup `ArchiveAccess` $\rightarrow$ Verify Expiration $\rightarrow$ Inject `res.locals.archive`.
- **Isolation**: All Memory mutations verify that the authenticated archive ID matches the requested `archiveId`.

### Memory CRUD
Implemented endpoints under `/archives/:archiveId/memories`:
- `POST`: Create a memory. Supports pre-filling from default questions.
- `GET`: Retrieve memories ordered by position.
- `PATCH`: Update memory content/position.
- `DELETE`: Remove a memory.

### Default Questions
A predefined catalogue of funny sibling questions lives in `apps/api/src/content/default-questions.ts`.
- **API**: `GET /memories/default-questions` exposes this catalogue.
- **Logic**: Default answers are copied into the `Memory.content` JSON field upon creation, ensuring the archive remains immutable even if default templates change.

## Phase 4 Test Frontend
A temporary developer test UI has been implemented to verify the backend against a real PostgreSQL database.

### How to start
1. **Start the API**: `pnpm --filter @sibling-archive/api dev` (listens on :4000).
2. **Start the Web App**: `pnpm --filter @sibling-archive/web dev` (listens on :3000).

### How to use for testing
1. **Create Archive**: Navigate to `/create`. Enter a title and click "Create Archive". Copy the generated `editToken`.
2. **Test Memory CRUD**: Navigate to `/test-edit?archiveId={id}&token={token}`.
   - Load memories to verify `GET`.
   - Use "Starter Prompts" to pre-fill the la memory form.
   - Save, edit, and delete memories to verify `POST`, `PATCH`, and `DELETE`.
3. **Test Security**:
   - In the "Security Control Panel" on the `/test-edit` page, manually change the `Archive ID` or `Bearer Token`.
   - Click "Refresh Memories".
   - Verify that invalid tokens return `401 Unauthorized` and tokens for the wrong archive return `403 Forbidden`.

## Current Database Baseline
Current Prisma models:
- `Archive`
- `ArchiveAccess`
- `Memory`
- `Media`

MemoryType Enum: `QUESTION`, `PHOTO`, `SCREENSHOT`, `BEFORE_AFTER`.

## What remains
- Media upload implementation (signed URLs, S3 integration).
- Frontend integration for Memory CRUD in the actual product UI.
- Archive publishing/sealing logic.
