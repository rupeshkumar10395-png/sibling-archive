# Sibling Archive — V1 Product & Engineering Guide

> This README is the current source of truth for V1 implementation.
>
> It is based on the finalized V1 homepage/demo, the current starter architecture, and the two handwritten workflow pages provided by the product owner.

---

## 1. What We Are Building

**Sibling Archive** is a private, funny, nostalgic digital archive created by siblings together.

The important product idea is:

> One sibling starts the archive, another sibling joins through a link, and both contribute memories that eventually become one shared archive.

The archive is not supposed to feel like a SaaS dashboard.

It should feel like:

- a private family time capsule
- a chaotic collection of sibling memories
- something personal and funny
- something worth opening again years later

The finalized homepage and demo archive are the visual reference for this feeling.

---

# 2. Current Product Status

## Already completed

- [x] V1 homepage finalized for testing
- [x] Demo archive finalized
- [x] V1 architecture/starter prepared
- [x] Starter pushed to GitHub
- [x] Project opened in VS Code
- [x] Project opened through Antigravity

## Current V1 work

- [ ] User profile section
- [ ] Complete V1 architecture implementation
- [ ] Creator archive flow
- [ ] Archive persistence
- [ ] Share/invite flow
- [ ] Sibling/participant flow
- [ ] Participant contributions
- [ ] Combined archive
- [ ] Archive sealing/opening state
- [ ] Mobile saving/install experience
- [ ] Multi-sibling support

---

# 3. Critical Product Rule

The handwritten workflow describes **two different people interacting with the product**.

Do not design the application as if only the archive creator exists.

There are at least two roles:

```text
ARCHIVE CREATOR
    ↓
starts the archive
    ↓
creates/configures it
    ↓
shares invite/link
    ↓
can contribute memories
```

and:

```text
INVITED SIBLING / PARTICIPANT
    ↓
opens the shared link
    ↓
sees the archive experience
    ↓
can contribute to permitted sections
    ↓
adds their own photos/text/cards/memories
```

These contributions eventually become part of:

```text
ONE SHARED ARCHIVE
```

---

# 4. Product Workflow — High Level

```text
                 SIBLING ARCHIVE
                       │
                       ▼
                  Homepage
                       │
                       ▼
                Create Own Archive
                       │
                       ▼
              Create / Configure Archive
                       │
                       ▼
                 Demo / Preview
                       │
                       ▼
                Create User Profile
                       │
                       ▼
                 Generate Link
                       │
                       ▼
             Send Link to Sibling
                       │
                       ▼
             ┌───────────────────┐
             │                   │
             ▼                   ▼
       Creator continues     Sibling opens link
                                   │
                                   ▼
                           Join / Profile
                                   │
                                   ▼
                         View allowed archive
                                   │
                                   ▼
                    Add own memories/content
                                   │
                                   ▼
             ┌───────────────────┴───────────────────┐
             │                                       │
             ▼                                       ▼
      Creator contributions                  Sibling contributions
             │                                       │
             └───────────────────┬───────────────────┘
                                 ▼
                         FINAL SHARED ARCHIVE
                                 │
                                 ▼
                            Seal Archive
                                 │
                                 ▼
                      Opening / future date
                                 │
                                 ▼
                         Saved on their mobile
```

---

# 5. Creator Flow

The archive creator is the sibling who starts the archive.

## Step 1 — Homepage

The user visits the Sibling Archive homepage.

They can:

- understand what Sibling Archive is
- see the finalized demo archive
- decide to create their own archive

The homepage is already finalized.

### Important

Do not redesign the homepage during backend/product implementation unless explicitly requested.

---

## Step 2 — Create Own Archive

The user selects:

```text
Create your own archive
```

This begins the real product flow.

The creator should not immediately be thrown into a complicated dashboard.

The experience should remain:

- sequential
- simple
- personal
- visual
- playful

---

## Step 3 — Create Archive

The creator begins creating their archive.

The exact final fields/UI are still an implementation decision and must be documented before being assumed.

The system must create a persistent archive record.

Conceptually:

```text
User
  │
  ▼
Archive
  │
  ├── creator
  ├── title/name
  ├── status
  ├── participants
  ├── memories
  └── lifecycle dates
```

---

## Step 4 — Archive Preview

The handwritten workflow explicitly describes the creator seeing a demo/preview of the archive.

The preview should demonstrate what their archive can become.

It should use the same visual language as the finalized demo.

The preview is not the database itself.

The real archive must eventually render from persisted data.

---

## Step 5 — User Profile

The V1 plan explicitly includes a user profile section.

The creator should create/sign into their profile before the archive is permanently associated with them and/or before the sharing stage, according to the final auth decision.

The profile exists so the system can:

- identify the creator
- associate archives with them
- allow them to return later
- manage their archives
- participate in shared archives

---

## Step 6 — Generate Link

Once the creator is ready to involve the sibling:

```text
Archive
    ↓
Generate invitation/link
```

The link should identify the invitation, not expose private database identifiers unnecessarily.

Conceptually:

```text
Creator
   ↓
Invite
   ↓
Secure token/link
   ↓
Sibling
```

---

## Step 7 — Send Link

The creator sends the generated link to the sibling.

The product should make this action extremely obvious.

Possible future channels:

- copy link
- WhatsApp
- messages
- share sheet

The exact sharing implementation is not specified by the handwritten notes and should not be invented as a hard requirement.

---

# 6. Invited Sibling / Participant Flow

The second person receives the link.

## Step 1 — Open Link

```text
Invite Link
    ↓
Archive / Join experience
```

The participant should immediately understand:

> "You have been invited to help create this archive."

---

## Step 2 — Profile / Identity

The participant may need to create or use a profile.

The exact authentication UX is still a product decision.

Do not silently choose:

- Google login
- email/password
- magic link
- phone authentication

without recording the decision first.

---

## Step 3 — See Archive

The handwritten workflow states that the invited sibling can see the archive/current archive experience.

The participant should not necessarily see unrestricted creator/admin controls.

Use explicit permissions.

Conceptually:

```text
Archive
├── visible content
├── participant-editable sections
└── creator-only controls
```

---

## Step 4 — Add Memories

The participant should be able to contribute to the relevant archive sections.

The notes explicitly mention that they can:

- upload photos
- add their own content
- add cards in the respective sections

The product should therefore support a reusable contribution model.

Example:

```text
Participant
    │
    ├── Add photo
    ├── Add text
    ├── Add answer
    ├── Add memory/card
    └── Future memory types
```

---

# 7. Shared Archive Model

The final archive is not:

```text
Creator Archive + separate Sibling Archive
```

It is:

```text
                 SHARED ARCHIVE
                       │
             ┌─────────┴─────────┐
             │                   │
        Creator memories    Sibling memories
             │                   │
             └─────────┬─────────┘
                       ▼
                ONE ARCHIVE
```

Every contribution should retain authorship metadata internally.

Example:

```text
Memory
├── archiveId
├── authorId
├── type
├── content
├── media
└── createdAt
```

This allows the UI to say things such as:

> Added by Kashish

without maintaining separate archives.

---

# 8. Archive Memory Types

The current demo establishes the visual language for multiple memory types.

The real application should NOT hardcode one giant archive HTML file.

Instead:

```text
Archive
   ↓
Memory[]
   ↓
Memory Renderer
```

Possible memory types include:

```text
Question / Answer
Photo
Chat Screenshot
Before / After
Forbidden Gallery
Rare Footage
Sibling Court
Text Memory
Audio
Video
```

New memory types should be addable without rewriting the whole archive.

---

# 9. Important Archive Interaction

The archive should remain **sequential**.

The finalized demo established the idea of:

```text
Previous Memory
        │
        ▼
   Current Memory
        │
        ▼
Next Memory
```

Do not put every photo/video/memory on one enormous page.

Different memories should appear one by one / as separate archive moments.

This is an important product characteristic.

---

# 10. Multiple Siblings

The handwritten notes explicitly mention an additional idea:

> An archive can be for more than one sibling.

Therefore the data model must NOT assume:

```text
Archive = exactly 2 users
```

Instead:

```text
Archive
   │
   ├── Creator
   ├── Participant
   ├── Participant
   ├── Participant
   └── ...
```

The exact maximum number of participants is not defined yet.

Do not invent a limit unless required by infrastructure.

A future flow can be:

```text
Sibling A creates archive
        ↓
A sends invite
        ↓
Sibling B joins
        ↓
Sibling B can invite another sibling
        ↓
Sibling C joins
        ↓
All contribute
        ↓
ONE shared archive
```

Whether participants can invite additional people directly is still a product decision.

Document the decision before implementation.

---

# 11. Final Archive

Once the archive is complete, both/all participating siblings should be able to access the shared archive according to their permissions.

The handwritten workflow also describes:

```text
Sealed 2026
↓
Next opening date
```

This suggests a time-capsule lifecycle.

Conceptually:

```text
DRAFT
  ↓
COLLECTING
  ↓
READY
  ↓
SEALED
  ↓
OPENABLE_AT
  ↓
OPEN
```

The exact rules for who can seal it, whether sealing is reversible, and how the opening date works are not fully defined in the notes.

Do NOT invent those rules silently.

Create a product decision before implementation.

---

# 12. Saving on Mobile

The notes mention the archive being saved on the users' mobile.

This could mean several technical implementations:

- PWA installation
- Add to Home Screen
- downloadable archive
- saved shortcut/link
- native app later

The notes do not specify which one.

Therefore:

**Do not implement a specific mobile-saving mechanism until the product decision is made.**

For V1, the implementation should preserve the possibility of a mobile-first saved archive experience.

---

# 13. Security Model

The archive contains private personal media.

Therefore:

```text
PUBLIC HOMEPAGE
    ≠
PUBLIC ARCHIVE
```

The homepage/demo can be public.

Real user archives must be private.

At minimum:

```text
User
 ↓
Authentication
 ↓
Authorization
 ↓
Archive membership
 ↓
Memory access
```

A user must only retrieve an archive if they have permission.

Private media should not be exposed through permanently public URLs.

---

# 14. Recommended Architecture

The starter should maintain clear separation:

```text
sibling-archive/
│
├── apps/
│   ├── web/
│   │   └── Next.js frontend
│   │
│   ├── api/
│   │   └── backend/API
│   │
│   └── worker/
│       └── background media processing
│
├── packages/
│   ├── shared/
│   ├── validation/
│   └── ...
│
├── prisma/
│   └── database schema/migrations
│
├── docs/
│
├── package.json
└── README.md
```

Do not introduce another framework unless there is a real architectural reason.

---

# 15. Antigravity Setup — Current Workflow

The product repository and Antigravity configuration are intentionally separate.

You currently have:

```text
Sibling Archive repository
        │
        └── opened in VS Code
        └── pushed to GitHub

Antigravity configuration/project
        │
        └── separate directory
```

The Antigravity directory is the AI/product context.

The Sibling Archive directory is the actual application.

### Rule

**Antigravity may modify the Sibling Archive repository.**

**Antigravity configuration/documentation is context, not application code.**

---

# 16. How Antigravity Should Analyse the Separate Directory

Do NOT immediately ask Antigravity to implement features.

Start with an analysis pass.

## Step 1 — Open both directories in the same Antigravity Project

The agent needs visibility into:

```text
Sibling Archive application
+
Antigravity configuration/product documentation
```

Do not copy the configuration files into the application repository.

---

## Step 2 — Start with read-only analysis

Give Antigravity this instruction:

```text
You are entering an existing Sibling Archive repository.

Before modifying anything:

1. Read the complete Sibling Archive product documentation available in the separate Antigravity configuration directory.
2. Read the repository README and inspect the complete application repository.
3. Inspect package.json files, workspace configuration, source directories, database configuration, environment examples, and existing routes/components.
4. Map the current architecture.
5. Map the current implementation against the documented creator and participant workflows.
6. Identify what already exists.
7. Identify what is incomplete.
8. Identify architecture risks.
9. Identify contradictions between the current starter and the product workflow.
10. Identify decisions that are still unspecified.

Do NOT modify files.

Produce:
- Repository map
- Current architecture
- Implemented features
- Missing features
- Workflow gaps
- Architecture risks
- Recommended V1 implementation order
- Questions that require product decisions

STOP after the analysis.
```

### Important

Do not let it "fix things" during this first pass.

You want to see whether it **understood the product correctly** before it touches the code.

---

# 17. Review Antigravity's Analysis

Check these five things:

### A. Did it understand the creator?

It should understand:

```text
Homepage
→ Create archive
→ Profile
→ Archive
→ Preview
→ Invite
```

### B. Did it understand the participant?

It should understand:

```text
Invite
→ Join/profile
→ See archive
→ Add memories
→ Shared archive
```

### C. Did it understand multiple siblings?

It must NOT build:

```text
creatorId
siblingId
```

as the only possible relationship.

It should understand:

```text
Archive
  ↕
ArchiveMembers[]
```

### D. Did it understand the archive as dynamic?

It should NOT plan to hardcode:

```text
Rupesh
Kashish
17 memories
```

into production.

### E. Did it recognize undefined decisions?

If it confidently invents the authentication/sealing/mobile-saving behavior without flagging the ambiguity, stop it and correct the context.

---

# 18. Second Antigravity Prompt — Architecture Plan

After you approve its analysis, give it:

```text
Using the product workflow and repository analysis you just produced:

Create a V1 implementation plan.

The plan must follow the actual product workflow:

Homepage
→ Create Archive
→ Creator Profile
→ Archive Creation
→ Archive Preview
→ Invite Link
→ Participant Join
→ Participant Profile
→ Participant Contributions
→ Shared Archive
→ Seal / Opening lifecycle

Prioritize vertical slices.

Each milestone must produce a testable user-facing result.

Do not build infrastructure that is not required for the current milestone.

For each milestone specify:
- files/modules affected
- database changes
- API changes
- frontend changes
- security considerations
- browser test scenario
- acceptance criteria

Do not implement anything yet.
```

---

# 19. Then Implement ONE Vertical Slice

Do not say:

> Build the backend.

Instead:

```text
Implement Milestone 1 only.

Make the homepage's "Create Archive" action lead to the real Create Archive experience.

Use the existing architecture.

Do not redesign the finalized homepage.

Implement the smallest complete vertical slice.

Run the application.

Test the flow in the browser.

Fix errors.

Do not begin Milestone 2.

Report:
- files changed
- why they changed
- tests performed
- remaining issues
```

Then review it.

---

# 20. The Correct Development Loop

Every feature should follow:

```text
PLAN
  ↓
IMPLEMENT
  ↓
RUN
  ↓
BROWSER TEST
  ↓
FIX
  ↓
REVIEW
  ↓
COMMIT
  ↓
NEXT FEATURE
```

Not:

```text
PROMPT
  ↓
500 FILES
  ↓
"Done!"
```

---

# 21. Git Discipline

Because the project is already pushed to GitHub, use small commits.

Example:

```text
feat: add creator profile
feat: create archive flow
feat: persist archives
feat: add archive invitations
feat: add participant joining
feat: add participant memories
feat: render dynamic memories
feat: add archive sealing
```

Before every significant agent task:

```bash
git status
git add .
git commit -m "chore: checkpoint before archive flow"
```

If Antigravity makes a bad change:

```bash
git diff
```

Review before accepting.

Never blindly accept a giant diff.

---

# 22. Environment / Secrets

Keep:

```text
.env
```

out of Git.

Use:

```text
.env.example
```

for required variable names.

Never allow Antigravity to commit:

- API keys
- database passwords
- storage secrets
- JWT secrets
- OAuth credentials

---

# 23. Database Rule

Do not let Antigravity create a database schema based only on UI screens.

The data model should represent the product.

The central relationship is:

```text
User
  │
  ├── ArchiveMembership ── Archive
  │                           │
  │                           ├── Memory
  │                           ├── Invite
  │                           └── lifecycle
  │
  └── authored memories
```

The exact schema should be proposed and reviewed before migrations are finalized.

---

# 24. Media Rule

Do not send large photos/videos through unnecessary application-server memory buffers.

Prefer:

```text
Browser
   ↓
authorized upload
   ↓
private object storage
   ↓
metadata in database
```

Then:

```text
Archive
   ↓
Memory
   ↓
Media reference
   ↓
authorized/signed access
```

---

# 25. UI Rule

The homepage is finalized.

The archive demo is the visual reference.

The actual application should preserve the product personality:

### Good

- funny
- personal
- imperfect
- playful
- nostalgic
- surprising
- visual
- sequential

### Bad

- generic dashboard
- SaaS cards everywhere
- corporate sidebar
- analytics-looking interface
- "Manage your memories"
- "Memory Management"
- unnecessary tables
- overly serious copy
- too many settings

The product should feel like:

> "We found our old sibling memories and put them somewhere together."

Not:

> "Welcome to your centralized digital memory management platform."

---

# 26. Do Not Overbuild V1

Before implementing a feature ask:

```text
Does this directly support the archive workflow?
```

If not, defer it.

For example, avoid initially building:

- analytics
- admin dashboards
- recommendation engines
- complex notification systems
- elaborate search
- social feeds
- unnecessary settings
- AI-generated memories

The core loop matters more:

```text
CREATE
→ INVITE
→ CONTRIBUTE
→ COMBINE
→ SEAL
→ OPEN
```

---

# 27. Product Decisions Still Requiring Confirmation

The handwritten workflow does not fully specify these.

Do not let the agent silently decide them.

## Authentication

Possible choices:

- email/password
- magic link
- social login
- another method

## Archive visibility

Who can see an archive before it is sealed?

## Contribution permissions

Can participants edit existing memories or only add new ones?

## Invitations

Can only the creator invite?

Can participants invite more siblings?

## Multiple siblings

What is the maximum or expected number?

## Sealing

Who can seal?

Can it be reopened?

Can new memories be added after sealing?

## Opening date

Can the date be changed?

What happens when the date arrives?

## Mobile saving

What exactly does "saved in mobile" mean technically?

These should become entries in `DECISIONS.md` once decided.

---

# 28. First Real V1 Milestones

Recommended order:

### Milestone 0 — Repository analysis

No code changes.

### Milestone 1 — User profile

Creator can establish their profile.

### Milestone 2 — Create archive

Creator can create and persist an archive.

### Milestone 3 — Archive preview

Creator sees their archive experience.

### Milestone 4 — Invite

Creator generates a participant invitation.

### Milestone 5 — Join

Sibling opens the link and joins.

### Milestone 6 — Contribute

Sibling can add memories.

### Milestone 7 — Shared archive

Creator + participants see the combined archive.

### Milestone 8 — Media

Private photo/video/audio handling.

### Milestone 9 — Seal

Archive lifecycle.

### Milestone 10 — Mobile

Saved/mobile archive experience.

---

# 29. Acceptance Test — The Most Important Test

At the end of V1, a completely fresh test should be possible:

```text
1. Open homepage
2. Click Create Archive
3. Create profile
4. Create archive
5. Preview archive
6. Generate invite
7. Copy/send invite
8. Open invite in another browser/session
9. Create/join participant profile
10. Participant sees the archive
11. Participant adds a photo
12. Participant adds text/memory
13. Creator sees the contribution
14. Archive contains both people's memories
15. Archive can be sealed
16. Archive has an opening date/state
17. Authorized participants can access it
18. Unauthorized user cannot access it
```

If this works, the **core Sibling Archive product loop works**.

---

# 30. Final Rule for Antigravity

Antigravity is the implementation agent.

It is not the product owner.

When the product documentation is ambiguous:

```text
STOP
↓
ASK / DOCUMENT DECISION
↓
THEN IMPLEMENT
```

Do not let it turn an assumption into architecture.

When a feature is complete:

```text
RUN IT
↓
TEST IT
↓
SHOW EVIDENCE
↓
COMMIT IT
```

The goal is not to produce the most code.

The goal is to produce a working Sibling Archive with the smallest amount of unnecessary complexity.
