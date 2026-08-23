import { z } from "zod";

export const createArchiveSchema = z.object({
  siblingName: z.string().min(1).max(80),
  archiveTitle: z.string().min(1).max(120),
  creatorEmail: z.string().email()
});
