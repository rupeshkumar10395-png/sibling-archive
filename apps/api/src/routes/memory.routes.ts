import { Router } from "express";

export const memoryRouter = Router();

memoryRouter.post("/:archiveId/upload-url", (_req, res) => {
  // TODO: authorize member and return a short-lived storage upload URL.
  res.status(501).json({ message: "Upload URL not implemented yet." });
});

memoryRouter.post("/:archiveId", (_req, res) => {
  // TODO: create a memory record after upload/metadata validation.
  res.status(501).json({ message: "Create memory not implemented yet." });
});

memoryRouter.get("/:archiveId/feed", (_req, res) => {
  // TODO: return ordered memories visible to the current member.
  res.status(501).json({ message: "Feed not implemented yet." });
});
