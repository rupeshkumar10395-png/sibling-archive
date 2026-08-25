import crypto from "node:crypto";

/**
 * Converts a title into a clean, URL-safe base slug string.
 */
export function slugify(text: string): string {
  const base = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars except hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+/, "") // Trim hyphens from start
    .replace(/-+$/, ""); // Trim hyphens from end

  return base || "archive";
}

/**
 * Generates a unique, URL-safe slug for an archive by appending a short random hex suffix.
 */
export function generateArchiveSlug(title: string): string {
  const base = slugify(title).slice(0, 50);
  const randomSuffix = crypto.randomBytes(4).toString("hex"); // 8 random hex characters
  return `${base}-${randomSuffix}`;
}
