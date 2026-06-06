import { describe, expect, it } from "vitest";

import {
  DEFAULT_PRESET,
  DEV_DURATION_SEC,
  isSamePreset,
  presetToDurationMins,
  presetToSeconds,
} from "@/lib/timer";

describe("timer presets", () => {
  it("converts minute presets to seconds", () => {
    expect(presetToSeconds({ kind: "minutes", mins: 25 })).toBe(1500);
    expect(presetToSeconds({ kind: "minutes", mins: 45 })).toBe(2700);
  });

  it("converts second presets to seconds", () => {
    expect(presetToSeconds({ kind: "seconds", secs: DEV_DURATION_SEC })).toBe(10);
  });

  it("maps dev second preset to zero duration minutes", () => {
    expect(presetToDurationMins({ kind: "seconds", secs: DEV_DURATION_SEC })).toBe(
      0,
    );
    expect(presetToDurationMins({ kind: "minutes", mins: 25 })).toBe(25);
  });

  it("compares presets by kind and value", () => {
    expect(isSamePreset(DEFAULT_PRESET, DEFAULT_PRESET)).toBe(true);
    expect(
      isSamePreset(
        { kind: "minutes", mins: 25 },
        { kind: "minutes", mins: 45 },
      ),
    ).toBe(false);
    expect(
      isSamePreset(
        { kind: "seconds", secs: 10 },
        { kind: "minutes", mins: 10 },
      ),
    ).toBe(false);
  });
});
