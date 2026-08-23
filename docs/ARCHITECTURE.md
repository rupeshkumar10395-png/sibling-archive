# Architecture

```text
                    ┌───────────────────────┐
                    │       Homepage        │
                    │   Next.js / React     │
                    └───────────┬───────────┘
                                │
                       create / join / view
                                │
                    ┌───────────▼───────────┐
                    │     Node API          │
                    │      Express          │
                    └──────┬──────┬─────────┘
                           │      │
                ┌──────────▼─┐  ┌▼─────────────┐
                │ PostgreSQL │  │ Object Store │
                │  + Prisma  │  │ private S3   │
                └────────────┘  └──────┬───────┘
                                        │
                                  media ready event
                                        │
                                ┌───────▼───────┐
                                │ Redis / BullMQ │
                                └───────┬───────┘
                                        │
                                ┌───────▼───────┐
                                │ Node Worker    │
                                │ Sharp / FFmpeg │
                                └───────────────┘
```

The browser never receives storage credentials. It receives short-lived signed upload/read URLs.
