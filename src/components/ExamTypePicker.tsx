"use client";

import { DropdownMenu } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";

import {
  EXAM_TYPES,
  writeStoredExamType,
  type ExamType,
} from "@/lib/exam-types";
import { cn } from "@/lib/utils";

export type { ExamType };

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
  const handleSelect = (examType: ExamType) => {
    onChange(examType);
    writeStoredExamType(examType);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-base border-2 border-border bg-secondary-background pl-3 pr-2.5 shadow-shadow transition-all",
            "hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          <span className="hidden text-xs text-foreground/50 sm:inline">
            Prepping for
          </span>
          <span className="font-heading text-sm leading-none">{value}</span>
          <ChevronDown className="size-4 text-foreground/50" strokeWidth={2.5} />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className={cn(
            "z-50 w-60 rounded-base border-2 border-border bg-secondary-background p-2 shadow-shadow",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          )}
        >
          <p className="px-2 pb-2 pt-1 text-xs leading-relaxed text-foreground/55">
            Your coach tailors its advice to the exam you pick.
          </p>
          <div className="space-y-0.5">
            {EXAM_TYPES.map((examType) => {
              const isSelected = value === examType;
              return (
                <DropdownMenu.Item
                  key={examType}
                  onSelect={() => handleSelect(examType)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-base px-2 py-1.5 text-sm font-heading outline-none transition-colors",
                    "data-highlighted:bg-main/25",
                    isSelected && "bg-main/15",
                  )}
                >
                  {examType}
                  {isSelected ? (
                    <Check className="size-4" strokeWidth={2.5} />
                  ) : null}
                </DropdownMenu.Item>
              );
            })}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
