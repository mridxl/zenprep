"use client";

import { computeTodaySummary } from "@/lib/session-stats";
import type { RouterOutputs } from "@/trpc/react";

type Session = RouterOutputs["session"]["getHistory"][number];

interface TodaySummaryProps {
  sessions: Session[];
}

export function TodaySummary({ sessions }: TodaySummaryProps) {
  const summary = computeTodaySummary(sessions);

  if (!summary) return null;

  const stats = [
    { value: summary.sessionCount, label: "sessions today" },
    { value: summary.minsDisplay, label: "mins studied" },
    { value: summary.avgMood, label: "avg mood" },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-base border-2 border-border bg-secondary-background px-3 py-3 text-center shadow-shadow"
        >
          <p className="font-heading text-2xl tabular-nums leading-none">
            {stat.value}
          </p>
          <p className="mt-1 text-[11px] text-foreground/55">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
