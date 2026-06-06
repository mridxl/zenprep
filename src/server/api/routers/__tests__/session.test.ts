import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getWellnessAdvice } from "@/lib/gemini";
import { AI_FALLBACK_RESPONSE, HISTORY_LIMIT } from "@/lib/session-constants";
import { createCaller } from "@/server/api/root";

vi.mock("@/lib/gemini", () => ({
  getWellnessAdvice: vi.fn().mockResolvedValue("Coach says breathe."),
}));

const { mockCreate, mockFindMany } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockFindMany: vi.fn(),
}));

vi.mock("@/server/db", () => ({
  db: {
    studySession: {
      create: mockCreate,
      findMany: mockFindMany,
    },
  },
}));

function createTestCaller(userId: string | null) {
  return createCaller({
    db: {
      studySession: {
        create: mockCreate,
        findMany: mockFindMany,
      },
    } as never,
    userId,
    headers: new Headers(),
  });
}

describe("session router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getWellnessAdvice).mockResolvedValue("Coach says breathe.");
    mockCreate.mockResolvedValue({
      id: "session-1",
      userId: "user-1",
      durationMins: 25,
      moodScore: 4,
      examType: "NEET",
      journalText: null,
      aiResponse: "Coach says breathe.",
      createdAt: new Date(),
    });
    mockFindMany.mockResolvedValue([]);
  });

  it("rejects unauthenticated save requests", async () => {
    const caller = createTestCaller(null);

    await expect(
      caller.session.save({
        durationMins: 25,
        moodScore: 4,
        examType: "NEET",
      }),
    ).rejects.toBeInstanceOf(TRPCError);
  });

  it("persists a session with AI response for authed users", async () => {
    const caller = createTestCaller("user-1");

    const result = await caller.session.save({
      durationMins: 25,
      moodScore: 4,
      examType: "NEET",
      journalText: "Tired but focused.",
    });

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        durationMins: 25,
        moodScore: 4,
        examType: "NEET",
        journalText: "Tired but focused.",
        aiResponse: "Coach says breathe.",
      },
    });
    expect(result.aiResponse).toBe("Coach says breathe.");
    expect(result.coachUnavailable).toBe(false);
  });

  it("persists session with fallback when coach is unavailable", async () => {
    vi.mocked(getWellnessAdvice).mockRejectedValueOnce(
      new Error("rate limited"),
    );
    mockCreate.mockResolvedValueOnce({
      id: "session-2",
      userId: "user-1",
      durationMins: 25,
      moodScore: 3,
      examType: "NEET",
      journalText: null,
      aiResponse: AI_FALLBACK_RESPONSE,
      createdAt: new Date(),
    });

    const caller = createTestCaller("user-1");
    const result = await caller.session.save({
      durationMins: 25,
      moodScore: 3,
      examType: "NEET",
    });

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        durationMins: 25,
        moodScore: 3,
        examType: "NEET",
        journalText: undefined,
        aiResponse: AI_FALLBACK_RESPONSE,
      },
    });
    expect(result.aiResponse).toBe(AI_FALLBACK_RESPONSE);
    expect(result.coachUnavailable).toBe(true);
  });

  it("rejects invalid exam types", async () => {
    const caller = createTestCaller("user-1");

    await expect(
      caller.session.save({
        durationMins: 25,
        moodScore: 4,
        examType: "SAT" as "NEET",
      }),
    ).rejects.toThrow();
  });

  it("returns recent history for the signed-in user", async () => {
    const history = [{ id: "session-1" }];
    mockFindMany.mockResolvedValue(history);

    const caller = createTestCaller("user-1");
    const result = await caller.session.getHistory();

    expect(mockFindMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      orderBy: { createdAt: "desc" },
      take: HISTORY_LIMIT,
    });
    expect(result).toEqual(history);
  });
});
