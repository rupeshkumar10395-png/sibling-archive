import type { RequestHandler } from "express";
import { hashToken } from "../lib/token.js";
import { prisma } from "../lib/prisma.js";

/**
 * Middleware to authorize requests based on a secure edit token.
 *
 * Expects: Authorization: Bearer <editToken>
 */
export const requireEditAccess: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Missing or invalid authorization header.",
      });
    }

    const rawToken = authHeader.substring(7);
    const tokenHash = hashToken(rawToken);

    const access = await prisma.archiveAccess.findUnique({
      where: { tokenHash },
      include: { archive: true },
    });

    if (!access) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Invalid edit token.",
      });
    }

    if (access.expiresAt && new Date() > new Date(access.expiresAt)) {
      return res.status(401).json({
        error: "UNAUTHORIZED",
        message: "The edit token has expired.",
      });
    }

    // Inject the authenticated archive and access record into res.locals.
    // Downstream handlers will use these to verify the resource being modified.
    res.locals.archive = access.archive;
    res.locals.access = access;

    next();
  } catch (err) {
    console.error("Edit access middleware error:", err);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "An unexpected error occurred during authorization.",
    });
  }
};
