"use client";

import { formatDistanceToNow } from "date-fns";

import { getMoodMeta } from "@/lib/mood";
import { formatDurationMins } from "@/lib/session-stats";
import type { RouterOutputs } from "@/trpc/react";

type Session = RouterOutputs["session"]["getHistory"][number];

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

  return (
    <div>
      <ul className="max-h-56 divide-y-2 divide-border overflow-y-auto pr-1">
        {sessions.map((session) => {
          const mood = getMoodMeta(session.moodScore);

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
                  , {session.examType} {formatDurationMins(session.durationMins)}
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
