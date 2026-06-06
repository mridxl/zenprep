"use client";

import { formatDistanceToNow, isToday } from "date-fns";

import type { RouterOutputs } from "@/trpc/react";

type Session = RouterOutputs["session"]["getHistory"][number];

const MOOD_META: Record<number, { emoji: string; label: string }> = {
  1: { emoji: "😤", label: "Awful" },
  2: { emoji: "😔", label: "Low" },
  3: { emoji: "😐", label: "Okay" },
  4: { emoji: "🙂", label: "Good" },
  5: { emoji: "🤩", label: "Great" },
};

function formatDuration(mins: number) {
  return mins === 0 ? "10s" : `${mins}m`;
}

interface SessionHistoryProps {
  sessions: Session[];
}

export function SessionHistory({ sessions }: SessionHistoryProps) {
  if (sessions.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-foreground/60">
        No sessions yet. Start your first Pomodoro.
      </p>
    );
  }

  const todaySessions = sessions.filter((s) => isToday(new Date(s.createdAt)));
  const todayMins = todaySessions.reduce((sum, s) => sum + s.durationMins, 0);
  const avgMood =
    todaySessions.length > 0
      ? (
          todaySessions.reduce((sum, s) => sum + s.moodScore, 0) /
          todaySessions.length
        ).toFixed(1)
      : null;

  return (
    <div className="space-y-4">
      {todaySessions.length > 0 && (
        <div className="grid grid-cols-3 divide-x-2 divide-border overflow-hidden rounded-base border-2 border-border bg-main/10">
          <div className="px-2 py-3 text-center">
            <p className="font-heading text-xl tabular-nums">
              {todaySessions.length}
            </p>
            <p className="text-[11px] text-foreground/50">sessions</p>
          </div>
          <div className="px-2 py-3 text-center">
            <p className="font-heading text-xl tabular-nums">
              {todayMins === 0 ? "<1" : todayMins}
            </p>
            <p className="text-[11px] text-foreground/50">mins today</p>
          </div>
          <div className="px-2 py-3 text-center">
            <p className="font-heading text-xl tabular-nums">{avgMood}</p>
            <p className="text-[11px] text-foreground/50">avg mood</p>
          </div>
        </div>
      )}

      <ul className="divide-y-2 divide-border">
        {sessions.map((session) => {
          const mood =
            MOOD_META[session.moodScore] ?? { emoji: "😐", label: "Okay" };

          return (
            <li key={session.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-base border-2 border-border bg-background text-base"
                aria-hidden
              >
                {mood.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-heading text-sm">{mood.label}</p>
                  <span className="shrink-0 text-xs tabular-nums text-foreground/50">
                    {session.moodScore}/5
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-foreground/50">
                  {formatDistanceToNow(new Date(session.createdAt), {
                    addSuffix: true,
                  })}
                  , {session.examType} {formatDuration(session.durationMins)}
                </p>

                {session.journalText ? (
                  <p className="mt-1.5 line-clamp-2 text-xs italic text-foreground/60">
                    &ldquo;{session.journalText}&rdquo;
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
