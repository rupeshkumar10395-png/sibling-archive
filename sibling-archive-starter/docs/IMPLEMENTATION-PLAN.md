# Sibling Archive — Implementation Plan

## Phase 0-3: Baseline (Completed)
- Repository and package health established.
- V1 Database schema (Link-based access) implemented.
- Shared TypeScript contracts implemented.
- Archive creation backend implemented (`POST /archives`).

## Phase 4: Edit Access & Memory CRUD (Completed)
**Goal**: Implement the core contribution layer for siblings.

### Implemented Features:
- **Edit Access Middleware**: SHA-256 token-based authorization for archives.
- **Memory CRUD**: Full implementation of Create, Read, Update, and Delete for memories.
- **Default Questions**: Implementation of a starter catalogue of funny prompts and the logic to pre-fill memories from them.
- **API Endpoints**:
  - `GET /memories/default-questions`
  - `GET /archives/:archiveId/memories`
  - `POST /archives/:archiveId/memories`
  - `PATCH /archives/:archiveId/memories/:memoryId`
  - `DELETE /archives/:archiveId/memories/:memoryId`

### Verification:
- Verified via unit tests for `MemoryService`, `MemoryValidation`, and `DefaultQuestions`.
- Verified `pnpm typecheck` and `pnpm build`.

## Phase 5: Media Uploads (Planned)
**Goal**: Implement the binary media pipeline.
- Signed upload URLs for private object storage.
- Integration with `apps/worker` for processing.
- Linking `Media` records to `Memory` entities.
