import type { RequestHandler } from "express";

export const requireAuth: RequestHandler = (_req, res, next) => {
  // TODO: verify session/JWT and attach user + archive membership to request.
  res.locals.user = null;
  next();
};
