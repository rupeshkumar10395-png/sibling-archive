# Data model

Core relationships:

```text
User
 ├── ArchiveMember ── Archive
 └── Memory

Archive
 ├── ArchiveMember
 ├── Invite
 └── Memory
```

The starter Prisma schema is in `packages/db/prisma/schema.prisma`.

Important design rule: creator and receiver are members of the same archive but their contributions remain attributable to the author. This is what allows the final archive to preserve two versions of the same memory.
