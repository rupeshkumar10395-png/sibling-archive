import { z } from "zod";
import type { CreateMemoryRequest, UpdateMemoryRequest } from "@sibling-archive/shared";

const MemoryTypeEnum = z.enum(["QUESTION", "PHOTO", "SCREENSHOT", "BEFORE_AFTER"]);

export const CreateMemorySchema = z.object({
  type: MemoryTypeEnum,
  content: z.record(z.string(), z.any()),
  position: z.number().int().nonnegative().optional(),
});

export const UpdateMemorySchema = z.object({
  type: MemoryTypeEnum.optional(),
  content: z.record(z.string(), z.any()).optional(),
  position: z.number().int().nonnegative().optional(),
});

export function validateCreateMemoryInput(data: unknown): CreateMemoryRequest {
  return CreateMemorySchema.parse(data);
}

export function validateUpdateMemoryInput(data: unknown): UpdateMemoryRequest {
  return UpdateMemorySchema.parse(data);
}
