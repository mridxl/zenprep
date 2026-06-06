import { describe, expect, it } from "vitest";

import { buildWellnessPrompt } from "@/lib/gemini-prompt";

describe("buildWellnessPrompt", () => {
  it("includes exam type, mood, and journal details", () => {
    const prompt = buildWellnessPrompt({
      examType: "NEET",
      moodScore: 2,
      journalText: "Feeling stuck on physics.",
      durationMins: 25,
    });

    expect(prompt).toContain("NEET");
    expect(prompt).toContain("25-minute");
    expect(prompt).toContain("Mood score: 2/5");
    expect(prompt).toContain("Feeling stuck on physics.");
    expect(prompt).toContain("4-7-8 breathing");
  });

  it("uses a fallback when journal text is empty", () => {
    const prompt = buildWellnessPrompt({
      examType: "JEE",
      moodScore: 5,
      journalText: "",
      durationMins: 0,
    });

    expect(prompt).toContain("10-second");
    expect(prompt).toContain("Nothing — they skipped the journal.");
  });
});
