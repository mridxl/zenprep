"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AIResponseProps {
  aiResponse: string;
  onStartBreathing: () => void;
}

export function AIResponse({ aiResponse, onStartBreathing }: AIResponseProps) {
  return (
    <div className="space-y-4">
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
