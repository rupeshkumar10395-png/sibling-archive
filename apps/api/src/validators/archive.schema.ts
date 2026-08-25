import type { CreateArchiveRequest } from "@sibling-archive/shared";

export function validateCreateArchiveInput(body: unknown): CreateArchiveRequest {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request body. Expected a JSON object.");
  }

  const { title } = body as Record<string, unknown>;

  if (typeof title !== "string") {
    throw new Error("Title is required and must be a string.");
  }

  const trimmed = title.trim();
  if (trimmed.length === 0) {
    throw new Error("Title cannot be empty or whitespace only.");
  }

  if (trimmed.length > 200) {
    throw new Error("Title cannot exceed 200 characters.");
  }

  return { title: trimmed };
}
