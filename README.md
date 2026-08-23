# Sibling Archive — production starter architecture

This is the **post-design engineering skeleton** for Sibling Archive.

The supplied `homepage.html` is the finalized visual reference. It is intentionally preserved byte-for-byte under `reference/homepage-final.html`, while the `apps/web` folder shows how the same design should be split into reusable application pieces.

The goal is to build the product without turning the homepage into one giant file again.

---

## 1. What we are building

Sibling Archive is a private, two-person memory archive.

The important product rule is:

> The archive is not created by one person and then merely shared. Both siblings contribute before the final archive is opened.

The product therefore has two states:

1. **Private building state** — each sibling can add their own memories without exposing the other person's answers too early.
2. **Shared archive state** — after both sides are ready, the archive becomes one sequential story containing both versions.

A public social feed is explicitly **not** the product.

---

# 2. Recommended stack

### Web
- **Next.js App Router + React + TypeScript**
- The landing page becomes `/`.
- Creation flow lives under `/create`.
- Receiver invitation flow lives under `/join/[token]`.
- Final archive lives under `/archive/[slug]`.

Next.js's App Router is a good fit because route segments and layouts map naturally to these product areas, and the official structure separates the application routes, UI, and public assets. See the Next.js App Router documentation.

### API
- **Node.js + Express + TypeScript**
- Keep business logic out of route handlers.
- Routes validate input, call services, and return responses.
- The API owns archive permissions, invite redemption, memory creation, signed upload URLs, and publishing.

### Database
- **PostgreSQL + Prisma**

This data is relational:

`User → ArchiveMember → Archive → Memory`

and

`Archive → Invite`

PostgreSQL is a better long-term fit than MongoDB for these membership, invite, ordering, publishing, and transaction-heavy relationships.

### Media storage
- **Private S3-compatible object storage**.
- AWS S3 is the reference implementation.
- Cloudflare R2 or Supabase Storage can be substituted behind the storage service.

Do **not** send large photos/videos through the Express API. The API should create a short-lived signed upload URL and the browser should upload directly to object storage. AWS documents presigned URLs specifically for this pattern.

### Background processing
- **Redis + BullMQ + a separate Node worker**.

Photos/videos/audio can require thumbnails, metadata extraction, poster frames, waveform generation, and optimization. These should not block an HTTP request.

BullMQ provides queues, workers, retries, concurrency, and failed-job handling. The worker in this starter is intentionally separate from the API so it can scale independently.

### Email
- **Resend** or another transactional email provider.
- Only used for private invite links and important archive notifications.

---

# 3. Folder structure

```text
sibling-archive/
│
├── apps/
│   ├── web/                         # Next.js product UI
│   │   ├── public/
│   │   │   └── archive-demo/
│   │   │       └── index.html       # current interactive archive demo
│   │   │
│   │   └── src/
│   │       ├── app/
│   │       │   ├── layout.tsx
│   │       │   ├── page.tsx          # landing page
│   │       │   ├── create/           # creator flow
│   │       │   ├── join/[token]/     # receiver flow
│   │       │   └── archive/[slug]/   # finished archive
│   │       │
│   │       ├── components/
│   │       │   ├── marketing/        # homepage sections
│   │       │   ├── archive/          # archive presentation
│   │       │   ├── creation/         # creation UI
│   │       │   ├── memories/         # photo/video/note/etc.
│   │       │   └── shared/           # buttons, dialogs, loaders
│   │       │
│   │       └── styles/
│   │           └── marketing.css
│   │
│   ├── api/                         # Node/Express backend
│   │   └── src/
│   │       ├── routes/
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── validators/
│   │       ├── middleware/
│   │       ├── config/
│   │       └── lib/
│   │
│   └── worker/                      # asynchronous media jobs
│       └── src/
│           ├── jobs/
│           ├── processors/
│           └── lib/
│
├── packages/
│   ├── db/                          # Prisma schema + DB client
│   ├── shared/                      # shared TS types / validation
│   └── ui/                          # truly reusable visual primitives
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── FLOW.md
│   ├── DATA-MODEL.md
│   └── API.md
│
├── reference/
│   ├── homepage-final.html          # exact supplied homepage
│   └── archive-demo-v6.html         # current standalone demo reference
│
├── .env.example
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

# 4. Homepage architecture

The current homepage has been split conceptually into:

```text
Header
Hero
Marquee
Statement
Ritual
SiblingMagic
ArchiveDemoSection
Seal
FinalCTA
Footer
```

The current `apps/web/src/components/marketing/*.tsx` files preserve the finalized HTML visually while giving us clear boundaries for later refinement.

The important change is that the **archive demo is no longer conceptually part of the homepage source**.

It is now:

```text
apps/web/public/archive-demo/index.html
```

and the homepage renders it through:

```text
components/archive/ArchiveDemo.tsx
```

This means the demo can eventually be replaced by the real archive renderer without rebuilding the marketing page.

---

# 5. Complete product flow

## STEP 0 — Visitor lands on homepage

```text
GET /
   ↓
Landing page
   ↓
"Make our archive"
   ↓
/create
```

The homepage should never know about a specific archive in production.

The Rupesh × Kashish archive is only the **demo**.

---

# 6. Creation page

Route:

```text
/create
```

The creator enters:

- their name
- sibling's name
- email
- archive title
- optional cover/title text

Then clicks something like:

> "okay, let's make the mess"

Frontend sends:

```http
POST /v1/archives
```

API transaction:

```text
validate request
   ↓
create/find creator user
   ↓
create Archive(status = DRAFT)
   ↓
create ArchiveMember(role = CREATOR)
   ↓
create initial creator session
   ↓
return archiveId
```

Then redirect:

```text
/create/[archiveId]
```

---

# 7. Creator workspace

The creator sees the archive-building interface.

This is **not** the final archive UI.

It is an editing workspace.

Example sections:

```text
Your archive

[ Add photo ]
[ Add video ]
[ Add voice note ]
[ Add story ]
[ Add question ]
[ Add chat screenshot ]
[ Add rare footage ]
[ Add court case ]

----------------------

Preview

----------------------

Invite sibling →
```

The creator can save drafts at any point.

---

# 8. Upload flow — important

Never do this:

```text
Browser → Express → upload 300MB video → Express → storage
```

Instead:

```text
Browser
   │
   │ POST /v1/memories/:archiveId/upload-url
   ↓
API
   │
   │ authorize archive membership
   │ validate mime + size
   │ generate object key
   │ generate signed PUT URL
   ↓
Browser
   │
   │ PUT file directly
   ↓
Private object storage
```

Then browser tells API:

```http
POST /v1/memories/:archiveId
```

with metadata such as:

```json
{
  "kind": "photo",
  "objectKey": "archives/abc/media/uuid/original.jpg",
  "title": "summer 2012",
  "body": "the day we got lost"
}
```

The API creates a `Memory` row.

For private media, only archive members should receive signed read URLs.

---

# 9. Media processing flow

After a media record is created:

```text
Memory created
   ↓
queue media-processing job
   ↓
Redis / BullMQ
   ↓
Worker picks job
   ↓
image/video/audio processor
   ↓
create optimized derivatives
   ↓
write metadata to PostgreSQL
   ↓
Memory.processingState = READY
```

Examples:

### Photo

```text
original.jpg
thumbnail.webp
medium.webp
width
height
mimeType
```

### Video

```text
original.mp4
poster.webp
duration
width
height
```

### Audio

```text
original.m4a
waveform JSON
waveform image/preview
 duration
```

The final archive should use optimized derivatives rather than blindly loading original files.

---

# 10. Invite sibling

Creator clicks:

> "Send this to my sibling"

API:

```http
POST /v1/invites
```

Body:

```json
{
  "archiveId": "abc",
  "email": "sibling@example.com"
}
```

Backend:

```text
generate cryptographically random token
        ↓
store HASH(token)
        ↓
set expiry
        ↓
email raw token link
```

Important:

**Never store the raw invitation token in the database.**

The email contains something like:

```text
/join/<raw-token>
```

The DB only stores its hash.

---

# 11. Receiver flow

Route:

```text
/join/[token]
```

Receiver opens the link.

API verifies:

```text
token exists?
expired?
already used?
archive still accepting contributions?
```

If valid:

```text
create/find receiver user
       ↓
create ArchiveMember(role = RECEIVER)
       ↓
mark Invite.acceptedAt
       ↓
create receiver session
       ↓
redirect to /join/[token]/contribute
```

---

# 12. The receiver must have their own side

This is a core product rule.

The receiver should see:

```text
"You have been accused of remembering things differently."

Add your photos
Add your answers
Add your notes
Add your version of memories
Add your own evidence
```

They should NOT simply edit the creator's memories.

Instead:

```text
Creator memory
       ↕
Receiver memory
```

Both become contributions to the final archive.

This preserves the product's central idea:

> Same childhood. Two completely different witnesses.

---

# 13. Questions / answers

Questions should be stored as data, not hard-coded into the final archive.

Example:

```text
Question
  id
  archiveId
  text
  order

Answer
  id
  questionId
  authorId
  text
```

This allows us to:

- add new funny questions later
- reorder questions
- show creator/receiver answers separately
- reveal them together in the final archive

The current Rupesh × Kashish questions are demo content only.

---

# 14. Memory types

The archive renderer should be data-driven.

Recommended memory kinds:

```text
photo
video
audio
note
question
chat
court
before-after
rare-footage
forbidden-gallery
```

Each memory has a renderer:

```text
MemoryRenderer
 ├── PhotoMemory
 ├── VideoMemory
 ├── AudioMemory
 ├── NoteMemory
 ├── QuestionMemory
 ├── ChatMemory
 ├── CourtMemory
 └── BeforeAfterMemory
```

That is how we avoid building another giant 17-slide hard-coded HTML file.

---

# 15. Completion rules

Do not publish immediately after the creator finishes.

Recommended state machine:

```text
DRAFT
  ↓
WAITING_FOR_SIBLING
  ↓
READY
  ↓
PUBLISHED
  ↓
SEALED
```

Meaning:

### DRAFT
Creator is still building.

### WAITING_FOR_SIBLING
Creator has invited the receiver.

### READY
Both members have contributed enough to open the archive.

### PUBLISHED
Final archive link exists.

### SEALED
Optional future state when the siblings intentionally stop editing the chapter.

---

# 16. Publishing

Creator/receiver reaches:

> "Open the archive"

API checks:

```text
creator exists
receiver exists
invite accepted
required contributions complete
all media processing complete
no pending upload failures
```

Then in one DB transaction:

```text
Archive.status = PUBLISHED
Archive.slug = uniqueSlug()
Archive.publishedAt = now()
```

Return:

```json
{
  "slug": "rupesh-kashish-chaos-years"
}
```

Frontend redirects to:

```text
/archive/rupesh-kashish-chaos-years
```

That is the final archive link.

---

# 17. Final archive URL architecture

Use a public-looking slug but keep the archive content private by default.

Example:

```text
https://yourdomain.com/archive/rupesh-kashish-chaos-years
```

Do not put raw database IDs in the URL.

The slug is for the experience; the database ID remains internal.

If you want truly unguessable private links later, add a separate share token layer.

---

# 18. Final archive rendering

The final page should fetch an archive projection:

```http
GET /v1/archives/:slug/view
```

The API returns something like:

```json
{
  "archive": {
    "title": "The Chaos Years",
    "members": [
      { "name": "Rupesh", "role": "creator" },
      { "name": "Kashish", "role": "receiver" }
    ]
  },
  "memories": [
    {
      "kind": "photo",
      "title": "summer 2012"
    },
    {
      "kind": "question",
      "question": "Who would win in a fight?",
      "answers": []
    }
  ]
}
```

The frontend renderer decides how each memory looks.

---

# 19. What the final frontend should NOT do

Avoid:

```text
archive.html
  17 hard-coded slides
  9000 lines CSS
  3000 lines JS
  every memory manually written
```

Instead:

```text
archive page
   ↓
archive data
   ↓
memory list
   ↓
memory renderer
   ↓
individual reusable memory components
```

The demo is allowed to be hard-coded because it is marketing content.

The real archive must be data-driven.

---

# 20. Suggested API surface

```text
POST   /v1/archives
GET    /v1/archives/:id
PATCH  /v1/archives/:id
POST   /v1/archives/:id/publish

POST   /v1/invites
POST   /v1/invites/:token/accept

POST   /v1/memories/:archiveId/upload-url
POST   /v1/memories/:archiveId
GET    /v1/memories/:archiveId/feed
PATCH  /v1/memories/:memoryId
DELETE /v1/memories/:memoryId

GET    /v1/archives/:slug/view
POST   /v1/archives/:id/seal
```

Keep controllers thin.

```text
route
 ↓
controller
 ↓
validator
 ↓
service
 ↓
database/storage/queue
```

Do not put database queries directly inside routes.

---

# 21. Security rules from day one

1. Every archive request checks membership.
2. Creator and receiver are separate roles.
3. Invite tokens are random, hashed, single-use and expiring.
4. Media bucket is private.
5. Browser receives short-lived signed upload/download URLs.
6. Never expose storage credentials to the browser.
7. Validate MIME type and file size server-side.
8. Never trust the filename or extension for media type.
9. Rate-limit invite creation and auth endpoints.
10. Sanitize/escape user text before rendering.
11. Do not allow arbitrary HTML inside memories.
12. Use transactions for archive publishing.
13. Log security-sensitive events without logging private media URLs or raw invite tokens.

---

# 22. Why the media is separated from PostgreSQL

PostgreSQL stores **metadata**:

```text
who uploaded it
what it is
where it belongs
when it was created
processing status
object key
```

Object storage stores:

```text
actual jpg
actual mp4
actual m4a
actual screenshots
```

This keeps the database small and makes media delivery scalable.

---

# 23. Why the worker is separate

A user uploading a 200 MB video should not make the API wait for:

```text
upload
ffmpeg
poster frame
metadata
compression
waveform
```

The API should answer quickly and queue the work.

The worker can then be scaled independently.

---

# 24. Build order I recommend

Do not build everything at once.

### Phase 1 — UI foundation

```text
homepage
creation page
receiver page
archive renderer
```

Use fake JSON first.

### Phase 2 — Database

Implement:

```text
User
Archive
ArchiveMember
Invite
Memory
```

### Phase 3 — Authentication

Implement creator login/session and receiver invite redemption.

### Phase 4 — Real media upload

Implement signed upload URLs and private storage.

### Phase 5 — Receiver contribution flow

Implement photos, notes, answers and memories from the second sibling.

### Phase 6 — Worker

Add thumbnails, video posters, audio metadata and processing states.

### Phase 7 — Publishing

Implement the archive state machine and final slug.

### Phase 8 — Production hardening

Add rate limits, validation, observability, backups, deletion flows, privacy controls and tests.

---

# 25. The most important architectural decision

The **homepage and the real archive must become two separate products in code**.

```text
MARKETING
/
 └── homepage
      └── static demo

PRODUCT
/
 ├── create
 ├── join
 ├── contribute
 └── archive/[slug]
```

The homepage demo can remain beautiful, funny and hand-crafted.

The real archive should be dynamic, secure and generated from database records.

That separation lets you keep changing the marketing experience without risking the actual archive system.

---

# 26. Current starter status

This ZIP is intentionally a **structure + architecture starter**, not a fake claim that the backend is already implemented.

Included:

- finalized homepage reference
- extracted archive demo
- component boundaries for the homepage
- Next.js web skeleton
- Express API skeleton
- worker skeleton
- Prisma data model
- shared types
- environment template
- complete creation → invite → contribution → publish → archive flow

The next implementation step should be the **creation flow + database**, not more homepage work.
