import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { memoryService } from "../src/services/memory.service.js";
import { requireEditAccess } from "../src/middleware/edit-access.js";
import { validateCreateMemoryInput, validateUpdateMemoryInput } from "../src/validators/memory.schema.js";
import { DEFAULT_QUESTIONS } from "../src/content/default-questions.js";
import { hashToken } from "../src/lib/token.js";

describe("Memory Validation", () => {
  it("accepts valid create memory input", () => {
    const input = {
      type: "QUESTION",
      content: { question: "Who is the favorite?", answer: "Me" },
      position: 5,
    };
    const result = validateCreateMemoryInput(input);
    assert.deepEqual(result, input);
  });

  it("rejects invalid memory type", () => {
    assert.throws(() => validateCreateMemoryInput({ type: "INVALID", content: {} }), /Invalid enum value/);
  });

  it("accepts valid update memory input with optional fields", () => {
    const input = { position: 10 };
    const result = validateUpdateMemoryInput(input);
    assert.deepEqual(result, input);
  });

  it("rejects negative position", () => {
    assert.throws(() => validateCreateMemoryInput({ type: "PHOTO", content: {}, position: -1 }), /number must be non-negative/);
  });
});

describe("Memory Service", () => {
  const mockDb: any = {
    memory: {
      create: async ({ data }: any) => ({
        id: "mem_123",
        archiveId: data.archiveId,
        type: data.type,
        content: data.content,
        position: data.position,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      findMany: async ({ where, orderBy }: any) => [
        {
          id: "mem_1",
          archiveId: where.archiveId,
          type: "QUESTION",
          content: { question: "Q1", answer: "A1" },
          position: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          media: [],
        },
        {
          id: "mem_2",
          archiveId: where.archiveId,
          type: "PHOTO",
          content: { caption: "C1" },
          position: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          media: [],
        },
      ],
      findFirst: async ({ where }: any) => {
        if (where.id === "mem_1" && where.archiveId === "arch_123") {
          return {
            id: "mem_1",
            archiveId: "arch_123",
            type: "QUESTION",
            content: { question: "Q1", answer: "A1" },
            position: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            media: [],
          };
        }
        return null;
      },
      update: async ({ where, data }: any) => ({
        id: where.id,
        archiveId: where.archiveId,
        type: data.type ?? "QUESTION",
        content: data.content ?? {},
        position: data.position ?? 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      delete: async ({ where }: any) => {
        if (where.id === "mem_wrong" || where.archiveId === "arch_wrong") {
          const err: any = new Error();
          err.code = "P2025";
          throw err;
        }
        return {};
      },
    },
  };

  const service = new MemoryService(mockDb);

  it("creates a memory with pre-filled default question content", async () => {
    const defaultQ = DEFAULT_QUESTIONS[0];
    const result = await service.createMemory("arch_123", {
      type: "QUESTION",
      content: {},
      defaultQuestionId: defaultQ.id,
    });

    assert.equal(result.content.question, defaultQ.question);
    assert.equal(result.content.answer, defaultQ.defaultAnswer);
  });

  it("creates a memory with user-provided answer overriding default", async () => {
    const defaultQ = DEFAULT_QUESTIONS[0];
    const result = await service.createMemory("arch_123", {
      type: "QUESTION",
      content: { answer: "Custom Answer" },
      defaultQuestionId: defaultQ.id,
    });

    assert.equal(result.content.question, defaultQ.question);
    assert.equal(result.content.answer, "Custom Answer");
  });

  it("fetches archive memories ordered by position", async () => {
    const memories = await service.getArchiveMemories("arch_123");
    assert.equal(memories.length, 2);
    assert.equal(memories[0].id, "mem_1");
    assert.equal(memories[1].id, "mem_2");
  });

  it("returns null for memory not belonging to archive", async () => {
    const result = await service.getMemory("mem_1", "arch_wrong");
    assert.equal(result, null);
  });

  it("deletes a memory belonging to the archive", async () => {
    await service.deleteMemory("mem_1", "arch_123");
    assert.ok(true);
  });

  it("throws P2025 when deleting memory from wrong archive", async () => {
    await assert.rejects(
      async () => {
        await service.deleteMemory("mem_1", "arch_wrong");
      },
      /P2025/
    );
  });
});

describe("Default Questions Catalogue", () => {
  it("contains funny questions with default answers", () => {
    assert.ok(DEFAULT_QUESTIONS.length > 0);
    DEFAULT_QUESTIONS.forEach(q => {
      assert.ok(q.id);
      assert.ok(q.question);
      assert.ok(q.defaultAnswer);
    });
  });
});
