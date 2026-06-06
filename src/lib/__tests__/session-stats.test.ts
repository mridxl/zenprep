import { describe, expect, it } from "vitest";

import {
  computeTodaySummary,
  filterTodaySessions,
  formatDurationMins,
  formatSessionLabel,
} from "@/lib/session-stats";

describe("session stats", () => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const sessions = [
    { createdAt: today, durationMins: 25, moodScore: 4 },
    { createdAt: today, durationMins: 0, moodScore: 3 },
    { createdAt: yesterday, durationMins: 45, moodScore: 5 },
  ];

  it("filters sessions to today only", () => {
    expect(filterTodaySessions(sessions)).toHaveLength(2);
  });

  it("computes today summary stats", () => {
    expect(computeTodaySummary(sessions)).toEqual({
      sessionCount: 2,
      todayMins: 25,
      avgMood: "3.5",
      minsDisplay: 25,
    });
  });

  it("returns null when there are no sessions today", () => {
    expect(computeTodaySummary([sessions[2]!])).toBeNull();
  });

  it("shows <1 when only sub-minute sessions were logged", () => {
    expect(
      computeTodaySummary([{ createdAt: today, durationMins: 0, moodScore: 2 }]),
    ).toEqual({
      sessionCount: 1,
      todayMins: 0,
      avgMood: "2.0",
      minsDisplay: "<1",
    });
  });

  it("formats duration labels", () => {
    expect(formatDurationMins(25)).toBe("25m");
    expect(formatDurationMins(0)).toBe("10s");
    expect(formatSessionLabel(25)).toBe("25-minute session");
    expect(formatSessionLabel(0)).toBe("10-second session");
  });
});
