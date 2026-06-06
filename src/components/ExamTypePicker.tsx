"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const EXAM_TYPES = [
  "JEE",
  "NEET",
  "CUET",
  "CAT",
  "GATE",
  "UPSC",
  "Boards",
] as const;
const STORAGE_KEY = "zenprep:examType";

export type ExamType = (typeof EXAM_TYPES)[number];

interface ExamTypePickerProps {
  value: ExamType;
  onChange: (value: ExamType) => void;
  disabled?: boolean;
}

export function ExamTypePicker({
  value,
  onChange,
  disabled = false,
}: ExamTypePickerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && EXAM_TYPES.includes(stored as ExamType)) {
      onChange(stored as ExamType);
    }
    setMounted(true);
  }, [onChange]);

  const handleSelect = (examType: ExamType) => {
    onChange(examType);
    localStorage.setItem(STORAGE_KEY, examType);
  };

  if (!mounted) {
    return <div className="h-16 animate-pulse rounded-base bg-foreground/10" />;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-heading text-foreground/50">Preparing for</p>
      <div className="flex flex-wrap gap-2">
        {EXAM_TYPES.map((examType) => {
          const isSelected = value === examType;
          return (
            <button
              key={examType}
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(examType)}
              className={cn(
                "rounded-base border-2 border-border px-3 py-1.5 text-sm font-heading shadow-shadow transition-all",
                "hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none",
                "active:translate-x-0 active:translate-y-0 active:scale-[0.98] active:shadow-none",
                "disabled:pointer-events-none disabled:opacity-50",
                isSelected
                  ? "bg-main text-main-foreground"
                  : "bg-secondary-background text-foreground",
              )}
            >
              {examType}
            </button>
          );
        })}
      </div>
    </div>
  );
}
