import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { generateArchiveSlug, slugify } from "../src/lib/slug.js";
import { generateSecureToken, hashToken, verifyTokenHash } from "../src/lib/token.js";
import { validateCreateArchiveInput } from "../src/validators/archive.schema.js";
import { ArchiveService } from "../src/services/archive.service.js";

describe("Slug Utilities", () => {
  it("slugifies simple and special character strings", () => {
    assert.equal(slugify("The Chaos Years"), "the-chaos-years");
    assert.equal(slugify("Rupesh & Kashish: 2026!"), "rupesh-kashish-2026");
    assert.equal(slugify("   multiple   spaces  "), "multiple-spaces");
    assert.equal(slugify(""), "archive");
  });

  it("generates unique URL-safe slugs with random hex suffixes", () => {
    const slug1 = generateArchiveSlug("Our Childhood");
    const slug2 = generateArchiveSlug("Our Childhood");

    assert.match(slug1, /^our-childhood-[a-f0-9]{8}$/);
    assert.match(slug2, /^our-childhood-[a-f0-9]{8}$/);
    assert.notEqual(slug1, slug2, "Slugs generated for identical titles must have unique random suffixes");
  });
});

describe("Token Security Utilities", () => {
  it("generates secure random tokens of requested length", () => {
    const token1 = generateSecureToken(32);
    const token2 = generateSecureToken(32);

    assert.equal(token1.length, 64, "32-byte hex token must be 64 characters");
    assert.equal(token2.length, 64);
    assert.notEqual(token1, token2, "Consecutive tokens must be distinct");
  });

  it("hashes tokens with SHA-256 and never matches raw token", () => {
    const rawToken = generateSecureToken(32);
    const hash = hashToken(rawToken);

    assert.equal(hash.length, 64, "SHA-256 hash must be 64 hex characters");
    assert.notEqual(rawToken, hash, "Hash must never equal the raw token");
    assert.equal(hashToken(rawToken), hash, "Hashing the same token must produce the same digest");
  });

  it("verifies token hashes using timing-safe comparison", () => {
    const rawToken = generateSecureToken(32);
    const hash = hashToken(rawToken);

    assert.equal(verifyTokenHash(rawToken, hash), true);
    assert.equal(verifyTokenHash("wrong-token", hash), false);
  });
});

describe("Create Archive Validation", () => {
  it("accepts valid non-empty titles", () => {
    const result = validateCreateArchiveInput({ title: "Summer Memories" });
    assert.deepEqual(result, { title: "Summer Memories" });
  });

  it("trims whitespace from titles", () => {
    const result = validateCreateArchiveInput({ title: "  The Secret Folder  " });
    assert.deepEqual(result, { title: "The Secret Folder" });
  });

  it("rejects empty or whitespace-only titles", () => {
    assert.throws(() => validateCreateArchiveInput({ title: "" }), /Title cannot be empty/);
    assert.throws(() => validateCreateArchiveInput({ title: "   " }), /Title cannot be empty/);
  });

  it("rejects non-string titles or missing fields", () => {
    assert.throws(() => validateCreateArchiveInput({}), /Title is required/);
    assert.throws(() => validateCreateArchiveInput({ title: 123 }), /Title is required/);
    assert.throws(() => validateCreateArchiveInput(null), /Invalid request body/);
  });

  it("rejects excessively long titles", () => {
    const longTitle = "a".repeat(201);
    assert.throws(() => validateCreateArchiveInput({ title: longTitle }), /Title cannot exceed 200/);
  });
});

describe("ArchiveService - Archive Creation Flow", () => {
  it("creates Archive and ArchiveAccess together atomically with hashed token", async () => {
    let capturedCreateData: any = null;

    const mockDb: any = {
      archive: {
        create: async ({ data, select }: any) => {
          capturedCreateData = data;
          return {
            id: "archive_cuid_123",
            title: data.title,
            slug: data.slug,
            createdAt: new Date("2026-08-24T12:00:00.000Z"),
            updatedAt: new Date("2026-08-24T12:00:00.000Z"),
          };
        },
      },
    };

    const service = new ArchiveService(mockDb);
    const result = await service.createArchive({ title: "Kashish & Rupesh Archive" });

    // 1. Check response contains archive metadata
    assert.equal(result.archive.id, "archive_cuid_123");
    assert.equal(result.archive.title, "Kashish & Rupesh Archive");
    assert.match(result.archive.slug, /^kashish-rupesh-archive-[a-f0-9]{8}$/);
    assert.equal(result.archive.createdAt, "2026-08-24T12:00:00.000Z");

    // 2. Check raw token is returned in response and formatted as editUrl
    assert.ok(result.editToken, "Raw editToken must be returned in response");
    assert.equal(result.editUrl, `/edit/${result.editToken}`);

    // 3. Verify what was persisted to DB
    assert.ok(capturedCreateData, "DB create must have been called");
    assert.equal(capturedCreateData.title, "Kashish & Rupesh Archive");
    assert.ok(capturedCreateData.accesses.create.tokenHash, "ArchiveAccess must be created with tokenHash");

    // 4. Verify raw token is NOT persisted; only SHA-256 hash is persisted
    assert.notEqual(capturedCreateData.accesses.create.tokenHash, result.editToken);
    assert.equal(
      capturedCreateData.accesses.create.tokenHash,
      hashToken(result.editToken),
      "Persisted hash must match SHA-256 of the returned raw edit token"
    );
  });

  it("handles slug collisions by retrying with a new slug", async () => {
    let attempts = 0;

    const mockDb: any = {
      archive: {
        create: async ({ data }: any) => {
          attempts++;
          if (attempts === 1) {
            const err: any = new Error("Unique constraint failed on the fields: (`slug`)");
            err.code = "P2002";
            throw err;
          }
          return {
            id: "archive_cuid_retry",
            title: data.title,
            slug: data.slug,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        },
      },
    };

    const service = new ArchiveService(mockDb);
    const result = await service.createArchive({ title: "Sibling Box" });

    assert.equal(attempts, 2, "Service should have retried upon collision");
    assert.equal(result.archive.id, "archive_cuid_retry");
  });

  it("fails atomically without creating orphan archive if database operation fails", async () => {
    const mockDb: any = {
      archive: {
        create: async () => {
          throw new Error("Database connection error");
        },
      },
    };

    const service = new ArchiveService(mockDb);
    await assert.rejects(
      async () => {
        await service.createArchive({ title: "Failed Archive" });
      },
      /Database connection error/
    );
  });
});
