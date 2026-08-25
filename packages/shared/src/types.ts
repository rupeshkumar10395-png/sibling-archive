// ==========================================
// Base Domain Entities & Content Types (Phase 1)
// ==========================================

export type MemoryType = "QUESTION" | "PHOTO" | "SCREENSHOT" | "BEFORE_AFTER";

export type QuestionContent = {
  question: string;
  answer?: string;
};

export type PhotoContent = {
  caption?: string;
};

export type ScreenshotContent = {
  caption?: string;
};

export type BeforeAfterContent = {
  caption?: string;
};

export type MemoryContent =
  | QuestionContent
  | PhotoContent
  | ScreenshotContent
  | BeforeAfterContent
  | Record<string, unknown>;

export type Archive = {
  id: string;
  title: string;
  slug: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type ArchiveAccess = {
  id: string;
  archiveId: string;
  tokenHash: string;
  createdAt: Date | string;
  expiresAt?: Date | string | null;
};

export type Memory = {
  id: string;
  archiveId: string;
  type: MemoryType;
  content: MemoryContent;
  position: number;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type Media = {
  id: string;
  memoryId: string;
  storageKey: string;
  fileName: string;
  mimeType: string;
  fileSize?: number | null;
  width?: number | null;
  height?: number | null;
  position: number;
  createdAt: Date | string;
};

// ==========================================
// API Request & Response Contracts (Phase 2)
// ==========================================

export type CreateArchiveRequest = {
  title: string;
};

export type ArchiveResponse = {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  memories?: MemoryResponse[];
};

export type CreateArchiveResponse = {
  archive: ArchiveResponse;
  editToken: string;
  editUrl?: string;
};

export type CreateMemoryRequest = {
  type: MemoryType;
  content: MemoryContent;
  position?: number;
};

export type UpdateMemoryRequest = {
  type?: MemoryType;
  content?: MemoryContent;
  position?: number;
};

export type MediaResponse = {
  id: string;
  memoryId: string;
  storageKey: string;
  fileName: string;
  mimeType: string;
  fileSize?: number | null;
  width?: number | null;
  height?: number | null;
  position: number;
  createdAt: string;
  url?: string;
};

export type MemoryResponse = {
  id: string;
  archiveId: string;
  type: MemoryType;
  content: MemoryContent;
  position: number;
  createdAt: string;
  updatedAt: string;
  media?: MediaResponse[];
};

export type ApiErrorResponse = {
  error: string;
  message?: string;
};

export type DefaultQuestion = {
  id: string;
  question: string;
  defaultAnswer: string;
};

export type DefaultQuestionResponse = DefaultQuestion;

