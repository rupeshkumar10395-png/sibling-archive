import { Router } from "express";
import type { Request, Response } from "express";
import type { ApiErrorResponse, MemoryResponse } from "@sibling-archive/shared";
import { memoryService } from "../services/memory.service.js";
import { requireEditAccess } from "../middleware/edit-access.js";
import { validateCreateMemoryInput, validateUpdateMemoryInput } from "../validators/memory.schema.js";
import { DEFAULT_QUESTIONS } from "../content/default-questions.js";

export const memoryRouter = Router();

/**
 * GET /memories/default-questions
 * Public endpoint to get the starter question catalogue.
 */
memoryRouter.get("/memories/default-questions", (_req, res) => {
  return res.status(200).json(DEFAULT_QUESTIONS);
});

/**
 * GET /archives/:archiveId/memories
 * Protected: Requires valid edit token for the archive.
 */
memoryRouter.get("/archives/:archiveId/memories", requireEditAccess, async (req, res) => {
  try {
    const archiveId = req.params.archiveId as string;

    // Authorization: Ensure the token belongs to the archive being accessed.
    if (res.locals.archive.id !== archiveId) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: "This token does not grant access to the specified archive.",
      });
    }

    const memories = await memoryService.getArchiveMemories(archiveId);
    return res.status(200).json(memories);
  } catch (err: any) {
    console.error("Get memories error:", err);
    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "An unexpected error occurred while fetching memories.",
    });
  }
});

/**
 * POST /archives/:archiveId/memories
 * Protected: Requires valid edit token for the archive.
 */
memoryRouter.post("/archives/:archiveId/memories", requireEditAccess, async (req, res) => {
  try {
    const archiveId = req.params.archiveId as string;

    if (res.locals.archive.id !== archiveId) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: "This token does not grant access to the specified archive.",
      });
    }

    const validated = validateCreateMemoryInput(req.body);

    // Support pre-filling from default questions if a defaultQuestionId is passed.
    const defaultQuestionId = req.body.defaultQuestionId;

    const memory = await memoryService.createMemory(archiveId, {
      ...validated,
      defaultQuestionId
    });

    return res.status(201).json(memory);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: "BAD_REQUEST", message: err.message });
    }
    console.error("Create memory error:", err);
    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "An unexpected error occurred while creating the memory.",
    });
  }
});

/**
 * PATCH /archives/:archiveId/memories/:memoryId
 * Protected: Requires valid edit token for the archive.
 */
memoryRouter.patch("/archives/:archiveId/memories/:memoryId", requireEditAccess, async (req, res) => {
  try {
    const archiveId = req.params.archiveId as string;
    const memoryId = req.params.memoryId as string;

    if (res.locals.archive.id !== archiveId) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: "This token does not grant access to the specified archive.",
      });
    }

    const validated = validateUpdateMemoryInput(req.body);
    const memory = await memoryService.updateMemory(memoryId, archiveId, validated);
    return res.status(200).json(memory);
  } catch (err: any) {
    if (err.name === "ZodError") {
      return res.status(400).json({ error: "BAD_REQUEST", message: err.message });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ error: "NOT_FOUND", message: "Memory not found or does not belong to this archive." });
    }
    console.error("Update memory error:", err);
    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "An unexpected error occurred while updating the memory.",
    });
  }
});

/**
 * DELETE /archives/:archiveId/memories/:memoryId
 * Protected: Requires valid edit token for the archive.
 */
memoryRouter.delete("/archives/:archiveId/memories/:memoryId", requireEditAccess, async (req, res) => {
  try {
    const archiveId = req.params.archiveId as string;
    const memoryId = req.params.memoryId as string;

    if (res.locals.archive.id !== archiveId) {
      return res.status(403).json({
        error: "FORBIDDEN",
        message: "This token does not grant access to the specified archive.",
      });
    }

    await memoryService.deleteMemory(memoryId, archiveId);
    return res.status(204).send();
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "NOT_FOUND", message: "Memory not found or does not belong to this archive." });
    }
    console.error("Delete memory error:", err);
    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "An unexpected error occurred while deleting the memory.",
    });
  }
});
