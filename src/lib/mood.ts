export const MOOD_META = {
  1: { emoji: "😤", label: "Awful" },
  2: { emoji: "😔", label: "Low" },
  3: { emoji: "😐", label: "Okay" },
  4: { emoji: "🙂", label: "Good" },
  5: { emoji: "🤩", label: "Great" },
} as const;

export type MoodScore = keyof typeof MOOD_META;

export function getMoodMeta(score: number) {
  return MOOD_META[score as MoodScore] ?? MOOD_META[3];
}
