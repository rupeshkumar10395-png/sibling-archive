import type { PrismaClient, Prisma } from "@sibling-archive/db";
import type { CreateMemoryRequest, UpdateMemoryRequest, MemoryResponse, MemoryContent } from "@sibling-archive/shared";
import { prisma as defaultPrisma } from "../lib/prisma.js";
import { DEFAULT_QUESTIONS } from "../content/default-questions.js";

export class MemoryService {
  constructor(private readonly db: PrismaClient = defaultPrisma) {}

  /**
   * Creates a new memory in an archive.
   * If a defaultQuestionId is provided, the content is pre-filled with the template.
   */
  async createMemory(archiveId: string, data: CreateMemoryRequest & { defaultQuestionId?: string }): Promise<MemoryResponse> {
    let content = data.content;

    if (data.defaultQuestionId) {
      const template = DEFAULT_QUESTIONS.find((q) => q.id === data.defaultQuestionId);
      if (template) {
        content = {
          question: template.question,
          answer: (data.content as any)?.answer ?? template.defaultAnswer,
        };
      }
    }

    const memory = await this.db.memory.create({
      data: {
        archiveId,
        type: data.type,
        content: content as any,
        position: data.position ?? 0,
      },
      select: {
        id: true,
        archiveId: true,
        type: true,
        content: true,
        position: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return this.mapToResponse(memory as any);
  }

  /**
   * Fetches all memories for an archive, ordered by position.
   */
  async getArchiveMemories(archiveId: string): Promise<MemoryResponse[]> {
    const memories = await this.db.memory.findMany({
      where: { archiveId },
      orderBy: { position: "asc" },
      include: { media: true },
    });

    return memories.map((m: Prisma.MemoryGetPayload<{ include: { media: true } }>) => this.mapToResponse(m));
  }

  /**
   * Fetches a single memory, verifying it belongs to the archive.
   */
  async getMemory(memoryId: string, archiveId: string): Promise<MemoryResponse | null> {
    const memory = await this.db.memory.findFirst({
      where: {
        id: memoryId,
        archiveId: archiveId,
      },
      include: { media: true },
    });

    return memory ? this.mapToResponse(memory) : null;
  }

  /**
   * Updates a memory, verifying it belongs to the archive.
   */
  async updateMemory(memoryId: string, archiveId: string, data: UpdateMemoryRequest): Promise<MemoryResponse> {
    const memory = await this.db.memory.update({
      where: {
        id: memoryId,
        archiveId: archiveId,
      },
      data: {
        type: data.type,
        content: data.content as any,
        position: data.position,
      },
      select: {
        id: true,
        archiveId: true,
        type: true,
        content: true,
        position: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return this.mapToResponse(memory as any);
  }

  /**
   * Deletes a memory, verifying it belongs to the archive.
   */
  async deleteMemory(memoryId: string, archiveId: string): Promise<void> {
    await this.db.memory.delete({
      where: {
        id: memoryId,
        archiveId: archiveId,
      },
    });
  }

  private mapToResponse(memory: any): MemoryResponse {
    return {
      id: memory.id,
      archiveId: memory.archiveId,
      type: memory.type,
      content: memory.content as MemoryContent,
      position: memory.position,
      createdAt: memory.createdAt.toISOString(),
      updatedAt: memory.updatedAt.toISOString(),
      media: memory.media?.map((m: any) => ({
        id: m.id,
        memoryId: m.memoryId,
        storageKey: m.storageKey,
        fileName: m.fileName,
        mimeType: m.mimeType,
        fileSize: m.fileSize,
        width: m.width,
        height: m.height,
        position: m.position,
        createdAt: m.createdAt.toISOString(),
      })),
    };
  }
}

export const memoryService = new MemoryService();
