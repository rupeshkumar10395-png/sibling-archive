import { Router } from "express";

export const archiveRouter = Router();

archiveRouter.post("/", (_req, res) => {
  // TODO: validate creator, create archive + creator membership, return archive id.
  res.status(501).json({ message: "Create archive not implemented yet." });
});

archiveRouter.get("/:archiveId", (_req, res) => {
  // TODO: return private archive metadata for an authenticated member.
  res.status(501).json({ message: "Get archive not implemented yet." });
});

archiveRouter.post("/:archiveId/publish", (_req, res) => {
  // TODO: finalize both sides and create the immutable/public-facing slug.
  res.status(501).json({ message: "Publish archive not implemented yet." });
});
