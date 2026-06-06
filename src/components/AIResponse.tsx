"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AIResponseProps {
  aiResponse: string;
  coachUnavailable?: boolean;
  onStartBreathing: () => void;
}

export function AIResponse({
  aiResponse,
  coachUnavailable = false,
  onStartBreathing,
}: AIResponseProps) {
  return (
    <div className="space-y-4">
      {coachUnavailable ? (
        <p className="text-xs text-foreground/55">
          Coach is temporarily unavailable — your check-in was still saved.
        </p>
      ) : null}
      <div className="rounded-base border-2 border-border bg-main/15 p-4 shadow-shadow">
        <p className="mb-2 text-xs font-heading text-foreground/50">
          From your wellness coach
        </p>
        <p className="text-sm leading-relaxed text-foreground">{aiResponse}</p>
      </div>

      <Button onClick={onStartBreathing} className="w-full" size="lg">
        Start breathing
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
