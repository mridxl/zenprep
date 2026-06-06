"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DEFAULT_PRESET,
  DEV_DURATION_SEC,
  DURATIONS,
  isSamePreset,
  presetToDurationMins,
  presetToSeconds,
  type DurationPreset,
} from "@/lib/timer";
import { cn } from "@/lib/utils";

const showDevPreset = process.env.NODE_ENV === "development";

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

  const isDevPreset = isSamePreset(selectedPreset, {
    kind: "seconds",
    secs: DEV_DURATION_SEC,
  });

  return (
    <div
      className={cn(
        "overflow-hidden rounded-base border-2 border-border bg-secondary-background shadow-shadow transition-colors",
        isRunning && "border-main",
      )}
    >
      <div className="space-y-2 border-b-2 border-border p-3 md:px-4">
        <p className="text-xs font-heading text-foreground/55">Session length</p>
        <div
          className={cn(
            "grid gap-2",
            showDevPreset ? "grid-cols-4" : "grid-cols-3",
          )}
        >
          {DURATIONS.map((duration) => {
            const preset: DurationPreset = { kind: "minutes", mins: duration };
            const isSelected = isSamePreset(selectedPreset, preset);
            return (
              <Button
                key={duration}
                type="button"
                size="sm"
                className="w-full"
                variant={isSelected ? "default" : "neutral"}
                disabled={disabled || isRunning}
                onClick={() => handleDurationChange(preset)}
              >
                {duration}m
              </Button>
            );
          })}
          {showDevPreset ? (
            <Button
              type="button"
              size="sm"
              className="w-full text-xs"
              variant={isDevPreset ? "default" : "ghost"}
              disabled={disabled || isRunning}
              onClick={() =>
                handleDurationChange({ kind: "seconds", secs: DEV_DURATION_SEC })
              }
            >
              <Zap className="size-3" />
              {DEV_DURATION_SEC}s
            </Button>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 px-6 py-10 text-center md:py-12">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border-2 border-border px-3 py-1 text-xs font-heading transition-colors",
            isRunning
              ? "bg-main text-main-foreground"
              : "bg-background text-foreground/70",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full bg-current",
              isRunning && "animate-pulse",
            )}
          />
          {isRunning ? "Focus mode on" : "Ready when you are"}
        </span>
        <p className="font-heading text-6xl leading-none tracking-tight tabular-nums sm:text-7xl">
          {displayMinutes}
          <span className="text-foreground/25">:</span>
          {displaySeconds}
        </p>
      </div>

      <div className="h-2.5 border-y-2 border-border bg-background">
        <div
          className="h-full origin-left bg-main transition-transform duration-1000 ease-linear"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <div className="grid grid-cols-[1fr_auto_auto] gap-2 border-t-2 border-border p-4">
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
          className="text-xs opacity-55"
          onClick={handleSkip}
        >
          <Zap className="size-3" />
          Skip
        </Button>
      </div>
    </div>
  );
}
