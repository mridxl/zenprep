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
