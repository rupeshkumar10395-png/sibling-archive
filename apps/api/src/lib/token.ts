import crypto from "node:crypto";

/**
 * Generates a cryptographically secure random token using Node.js crypto.
 * Default is 32 bytes formatted as a 64-character hex string.
 */
export function generateSecureToken(byteLength = 32): string {
  return crypto.randomBytes(byteLength).toString("hex");
}

/**
 * Hashes a raw token using SHA-256 for secure database storage.
 */
export function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

/**
 * Constant-time comparison for token hashes to prevent timing attacks.
 */
export function verifyTokenHash(rawToken: string, storedHash: string): boolean {
  const computedHash = hashToken(rawToken);
  if (computedHash.length !== storedHash.length) return false;
  return crypto.timingSafeEqual(
    Buffer.from(computedHash, "hex"),
    Buffer.from(storedHash, "hex")
  );
}
