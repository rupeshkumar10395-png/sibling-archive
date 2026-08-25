import type { PrismaClient } from "@sibling-archive/db";
import type { CreateArchiveRequest, CreateArchiveResponse } from "@sibling-archive/shared";
import { generateArchiveSlug } from "../lib/slug.js";
import { generateSecureToken, hashToken } from "../lib/token.js";
import { prisma as defaultPrisma } from "../lib/prisma.js";

export class ArchiveService {
  constructor(private readonly db: PrismaClient = defaultPrisma) {}

  async getArchiveById(id: string) {
    const archive = await this.db.archive.findUnique({
      where: { id },
    });
    if (!archive) return null;
    return {
      id: archive.id,
      title: archive.title,
      slug: archive.slug,
      createdAt: archive.createdAt.toISOString(),
      updatedAt: archive.updatedAt.toISOString(),
    };
  }

  async getArchiveBySlug(slug: string) {
    const archive = await this.db.archive.findUnique({
      where: { slug },
    });
    if (!archive) return null;
    return {
      id: archive.id,
      title: archive.title,
      slug: archive.slug,
      createdAt: archive.createdAt.toISOString(),
      updatedAt: archive.updatedAt.toISOString(),
    };
  }

  /**
   * Creates a new Archive and its initial ArchiveAccess record atomically.

   * Only the token hash is stored in the database.
   */
  async createArchive(input: CreateArchiveRequest): Promise<CreateArchiveResponse> {
    const rawTitle = input.title?.trim();
    if (!rawTitle) {
      throw new Error("Title is required and cannot be empty.");
    }

    const editToken = generateSecureToken(32);
    const tokenHash = hashToken(editToken);

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      const slug = generateArchiveSlug(rawTitle);

      try {
        // Atomic creation of Archive and ArchiveAccess in a single database operation
        const archive = await this.db.archive.create({
          data: {
            title: rawTitle,
            slug,
            accesses: {
              create: {
                tokenHash,
              },
            },
          },
          select: {
            id: true,
            title: true,
            slug: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return {
          archive: {
            id: archive.id,
            title: archive.title,
            slug: archive.slug,
            createdAt: archive.createdAt.toISOString(),
            updatedAt: archive.updatedAt.toISOString(),
          },
          editToken,
          editUrl: `/edit/${editToken}`,
        };
      } catch (err: any) {
        // Retry on unique slug collision (Prisma code P2002 on slug)
        if (err?.code === "P2002" && attempts < maxAttempts) {
          continue;
        }
        throw err;
      }
    }

    throw new Error("Failed to generate a unique archive slug. Please try again.");
  }
}

export const archiveService = new ArchiveService();
