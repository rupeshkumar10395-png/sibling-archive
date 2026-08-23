import { Router } from "express";

export const inviteRouter = Router();

inviteRouter.post("/", (_req, res) => {
  // TODO: create one-time invite token and send email/link.
  res.status(501).json({ message: "Create invite not implemented yet." });
});

inviteRouter.post("/:token/accept", (_req, res) => {
  // TODO: redeem token, attach receiver to archive, issue session.
  res.status(501).json({ message: "Accept invite not implemented yet." });
});
