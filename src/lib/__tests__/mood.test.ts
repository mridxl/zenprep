import { describe, expect, it } from "vitest";

import { getMoodMeta } from "@/lib/mood";

describe("getMoodMeta", () => {
  it("returns known mood metadata", () => {
    expect(getMoodMeta(5)).toEqual({ emoji: "🤩", label: "Great" });
  });

  it("falls back to okay for unknown scores", () => {
    expect(getMoodMeta(99)).toEqual({ emoji: "😐", label: "Okay" });
  });
});
