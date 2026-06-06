"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DURATIONS = [25, 45, 60] as const;
const DEV_DURATION_SEC = 10;

type DurationPreset =
  | { kind: "minutes"; mins: number }
  | { kind: "seconds"; secs: number };

const DEFAULT_PRESET: DurationPreset = { kind: "minutes", mins: 25 };

function presetToSeconds(preset: DurationPreset): number {
  return preset.kind === "minutes" ? preset.mins * 60 : preset.secs;
}

function presetToDurationMins(preset: DurationPreset): number {
  return preset.kind === "minutes" ? preset.mins : 0;
}

function isSamePreset(a: DurationPreset, b: DurationPreset): boolean {
  return (
    a.kind === b.kind &&
    (a.kind === "minutes"
      ? a.mins === (b as typeof a).mins
      : a.secs === (b as typeof a).secs)
  );
}

interface TimerProps {
  onSessionComplete: (durationMins: number) => void;
  disabled?: boolean;
  resetSignal?: number;
}

export function Timer({
  onSessionComplete,
  disabled = false,
  resetSignal = 0,
}: TimerProps) {
  const [selectedPreset, setSelectedPreset] =
    useState<DurationPreset>(DEFAULT_PRESET);
  const [totalSeconds, setTotalSeconds] = useState(
    presetToSeconds(DEFAULT_PRESET),
  );
  const [initialSeconds, setInitialSeconds] = useState(
    presetToSeconds(DEFAULT_PRESET),
  );
  const [isRunning, setIsRunning] = useState(false);
  const hasCompletedRef = useRef(false);

  const resetTimer = useCallback(
    (preset = selectedPreset) => {
      hasCompletedRef.current = false;
      const secs = presetToSeconds(preset);
      setTotalSeconds(secs);
      setInitialSeconds(secs);
      setIsRunning(false);
    },
    [selectedPreset],
  );

  useEffect(() => {
    resetTimer(selectedPreset);
  }, [resetSignal, resetTimer, selectedPreset]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTotalSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || totalSeconds > 0 || hasCompletedRef.current) return;

    hasCompletedRef.current = true;
    setIsRunning(false);
    onSessionComplete(presetToDurationMins(selectedPreset));
  }, [isRunning, totalSeconds, onSessionComplete, selectedPreset]);

  const handleDurationChange = (preset: DurationPreset) => {
    hasCompletedRef.current = false;
    const secs = presetToSeconds(preset);
    setSelectedPreset(preset);
    setTotalSeconds(secs);
    setInitialSeconds(secs);
    setIsRunning(false);
  };

  const handleSkip = () => {
    hasCompletedRef.current = false;
    setTotalSeconds(1);
    setIsRunning(true);
  };

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const displayMinutes = String(minutes).padStart(2, "0");
  const displaySeconds = String(seconds).padStart(2, "0");
  const progress =
    initialSeconds > 0 ? (initialSeconds - totalSeconds) / initialSeconds : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-heading text-foreground/50">
          Duration
        </span>
        {DURATIONS.map((duration) => {
          const preset: DurationPreset = { kind: "minutes", mins: duration };
          const isSelected = isSamePreset(selectedPreset, preset);
          return (
            <Button
              key={duration}
              type="button"
              size="sm"
              variant={isSelected ? "default" : "neutral"}
              disabled={disabled || isRunning}
              className={cn(
                isSelected &&
                  "ring-2 ring-ring ring-offset-2 ring-offset-background",
              )}
              onClick={() => handleDurationChange(preset)}
            >
              {duration} min
            </Button>
          );
        })}
        <Button
          type="button"
          size="sm"
          variant={
            isSamePreset(selectedPreset, {
              kind: "seconds",
              secs: DEV_DURATION_SEC,
            })
              ? "default"
              : "ghost"
          }
          disabled={disabled || isRunning}
          className={cn(
            "text-xs opacity-70",
            isSamePreset(selectedPreset, {
              kind: "seconds",
              secs: DEV_DURATION_SEC,
            }) &&
              "opacity-100 ring-2 ring-ring ring-offset-2 ring-offset-background",
          )}
          onClick={() =>
            handleDurationChange({ kind: "seconds", secs: DEV_DURATION_SEC })
          }
        >
          <Zap className="size-3" />
          {DEV_DURATION_SEC}s test
        </Button>
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-base border-2 border-border bg-secondary-background shadow-shadow transition-colors",
          isRunning && "border-main bg-main/5",
        )}
      >
        <div className="px-6 py-10 text-center md:px-10 md:py-14">
          <p className="font-heading text-6xl tracking-tight tabular-nums md:text-7xl">
            {displayMinutes}
            <span className="text-foreground/30">:</span>
            {displaySeconds}
          </p>
          <p className="mt-3 text-sm text-foreground/60">
            {isRunning ? "Focus mode on" : "Ready when you are"}
          </p>
        </div>

        <div className="h-2 border-t-2 border-border bg-background">
          <div
            className="h-full origin-left bg-main transition-transform duration-1000 ease-linear"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="lg"
          disabled={disabled}
          onClick={() => setIsRunning((prev) => !prev)}
        >
          {isRunning ? (
            <>
              <Pause className="size-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="size-4" />
              Start
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="neutral"
          size="lg"
          disabled={disabled}
          onClick={() => resetTimer()}
        >
          <RotateCcw className="size-4" />
          Reset
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="ml-auto text-xs opacity-60"
          onClick={handleSkip}
        >
          <Zap className="size-3" />
          Skip to end
        </Button>
      </div>
    </div>
  );
}
