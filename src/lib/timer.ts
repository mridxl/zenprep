export const DURATIONS = [25, 45, 60] as const;
export const DEV_DURATION_SEC = 10;

export type DurationPreset =
  | { kind: "minutes"; mins: number }
  | { kind: "seconds"; secs: number };

export const DEFAULT_PRESET: DurationPreset = { kind: "minutes", mins: 25 };

export function presetToSeconds(preset: DurationPreset): number {
  return preset.kind === "minutes" ? preset.mins * 60 : preset.secs;
}

export function presetToDurationMins(preset: DurationPreset): number {
  return preset.kind === "minutes" ? preset.mins : 0;
}

export function isSamePreset(a: DurationPreset, b: DurationPreset): boolean {
  return (
    a.kind === b.kind &&
    (a.kind === "minutes"
      ? a.mins === (b as typeof a).mins
      : a.secs === (b as typeof a).secs)
  );
}
