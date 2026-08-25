import { Router } from "express";
import type { Request, Response } from "express";
import type { ApiErrorResponse, CreateArchiveResponse } from "@sibling-archive/shared";
import { archiveService } from "../services/archive.service.js";
import { validateCreateArchiveInput } from "../validators/archive.schema.js";

export const archiveRouter = Router();

// POST /archives or POST /v1/archives
archiveRouter.post("/", async (req: Request, res: Response<CreateArchiveResponse | ApiErrorResponse>) => {
  console.log("POST /archives called with body:", req.body);
  try {
    const validated = validateCreateArchiveInput(req.body);
    const result = await archiveService.createArchive(validated);
    return res.status(201).json(result);
  } catch (err: any) {
    const message = err?.message || "Internal server error";

    if (
      message.includes("Title is required") ||
      message.includes("Title cannot be empty") ||
      message.includes("Invalid request body") ||
      message.includes("Title cannot exceed")
    ) {
      return res.status(400).json({ error: "BAD_REQUEST", message });
    }

    // Log internally but do not expose raw database errors to clients
    console.error("Archive creation error:", err);
    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "An unexpected error occurred while creating the archive.",
    });
  }
});

archiveRouter.get("/:archiveId", (_req, res) => {
  res.status(501).json({ message: "Get archive not implemented yet." });
});

archiveRouter.post("/:archiveId/publish", (_req, res) => {
  res.status(501).json({ message: "Publish archive not implemented yet." });
});
