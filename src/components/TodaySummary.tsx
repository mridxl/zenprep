"use client";

import { isToday } from "date-fns";

import type { RouterOutputs } from "@/trpc/react";

type Session = RouterOutputs["session"]["getHistory"][number];

interface TodaySummaryProps {
  sessions: Session[];
}

export function TodaySummary({ sessions }: TodaySummaryProps) {
  const todaySessions = sessions.filter((s) => isToday(new Date(s.createdAt)));

  if (todaySessions.length === 0) return null;

  const todayMins = todaySessions.reduce((sum, s) => sum + s.durationMins, 0);
  const avgMood = (
    todaySessions.reduce((sum, s) => sum + s.moodScore, 0) /
    todaySessions.length
  ).toFixed(1);

  const stats = [
    { value: todaySessions.length, label: "sessions today" },
    { value: todayMins === 0 ? "<1" : todayMins, label: "mins studied" },
    { value: avgMood, label: "avg mood" },
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
