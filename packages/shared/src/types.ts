export type ArchiveStatus = "draft" | "waiting_for_sibling" | "ready" | "published" | "sealed";

export type MemoryKind = "photo" | "video" | "audio" | "note" | "question" | "chat" | "court";

export type MemberRole = "creator" | "receiver";

export type Memory = {
  id: string;
  archiveId: string;
  createdBy: string;
  kind: MemoryKind;
  title?: string;
  body?: string;
  mediaObjectKey?: string;
  createdAt: string;
};
