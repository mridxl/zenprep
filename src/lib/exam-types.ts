export const EXAM_TYPES = [
  "JEE",
  "NEET",
  "CUET",
  "CAT",
  "GATE",
  "UPSC",
  "Boards",
] as const;

export type ExamType = (typeof EXAM_TYPES)[number];

export const EXAM_TYPE_SCHEMA_VALUE = EXAM_TYPES as unknown as [
  ExamType,
  ...ExamType[],
];

export const EXAM_TYPE_STORAGE_KEY = "zenprep:examType";

export function readStoredExamType(): ExamType | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(EXAM_TYPE_STORAGE_KEY);
  if (stored && EXAM_TYPES.includes(stored as ExamType)) {
    return stored as ExamType;
  }

  return null;
}

export function writeStoredExamType(examType: ExamType): void {
  localStorage.setItem(EXAM_TYPE_STORAGE_KEY, examType);
}
