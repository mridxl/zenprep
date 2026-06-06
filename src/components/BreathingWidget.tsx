"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { BREATHING_CYCLE_COUNT } from "@/lib/session-constants";
import { cn } from "@/lib/utils";

type Phase = "inhale" | "hold1" | "exhale" | "hold2";

const PHASES: Record<Phase, { label: string; duration: number; next: Phase }> = {
  inhale: { label: "Breathe in", duration: 4000, next: "hold1" },
  hold1: { label: "Hold", duration: 7000, next: "exhale" },
  exhale: { label: "Breathe out", duration: 8000, next: "hold2" },
  hold2: { label: "Hold", duration: 4000, next: "inhale" },
};

const SCALE: Record<Phase, number> = {
  inhale: 1,
  hold1: 1,
  exhale: 0.55,
  hold2: 0.55,
};

interface BreathingWidgetProps {
  onComplete: () => void;
}

export function BreathingWidget({ onComplete }: BreathingWidgetProps) {
  const [phase, setPhase] = useState<Phase>("inhale");
  const [cycles, setCycles] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setHasStarted(true), 60);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isComplete) return;

    const timeout = setTimeout(() => {
      const nextPhase = PHASES[phase].next;

      if (phase === "hold2") {
        const nextCycles = cycles + 1;
        if (nextCycles >= BREATHING_CYCLE_COUNT) {
          setIsComplete(true);
          return;
        }
        setCycles(nextCycles);
      }

      setPhase(nextPhase);
    }, PHASES[phase].duration);

    return () => clearTimeout(timeout);
  }, [phase, cycles, isComplete]);

  if (isComplete) {
    return (
      <div className="space-y-4 text-center">
        <p className="font-heading text-xl">Break complete. Ready to study again?</p>
        <Button onClick={onComplete} size="lg" className="w-full">
          Back to timer
        </Button>
      </div>
    );
  }

  const isHolding = phase === "hold1" || phase === "hold2";
  const transitionDuration = PHASES[phase].duration;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex items-center gap-2">
        {Array.from({ length: BREATHING_CYCLE_COUNT }, (_, i) => i).map((i) => (
          <div
            key={i}
            className={cn(
              "size-2.5 rounded-full border-2 border-border transition-colors",
              i < cycles
                ? "bg-main"
                : i === cycles
                  ? "bg-main/50"
                  : "bg-background",
            )}
          />
        ))}
        <span className="ml-1 text-xs text-foreground/50">
          Cycle {cycles + 1} of {BREATHING_CYCLE_COUNT}
        </span>
      </div>

      <div className="relative flex h-56 w-56 items-center justify-center">
        <div
          className="absolute animate-breathe-ring rounded-full border-2 border-main/40 bg-main/10"
          style={{ width: 224, height: 224, animationDuration: "2.4s" }}
        />
        <div
          className="absolute animate-breathe-ring-delayed rounded-full border-2 border-main/25 bg-main/5"
          style={{ width: 224, height: 224, animationDuration: "2.4s" }}
        />

        <div
          className={cn(
            "relative rounded-full border-2 border-border bg-main/40 shadow-shadow",
            isHolding && "animate-breathe-glow",
          )}
          style={{
            width: 160,
            height: 160,
            transform: `scale(${hasStarted ? SCALE[phase] : SCALE.exhale})`,
            transition: hasStarted
              ? `transform ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
              : "none",
            animationDuration: isHolding ? "1.8s" : undefined,
          }}
        />
      </div>

      <p className="font-heading text-2xl">{PHASES[phase].label}</p>
      <p className="text-xs text-foreground/50">
        {phase === "inhale" && "4 seconds"}
        {phase === "hold1" && "7 seconds"}
        {phase === "exhale" && "8 seconds"}
        {phase === "hold2" && "4 seconds"}
      </p>
    </div>
  );
}
