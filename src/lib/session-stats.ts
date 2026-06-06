import { isToday } from "date-fns";

import { SUB_MINUTE_SESSION_MINS } from "@/lib/session-constants";

export interface SessionLike {
  createdAt: Date | string;
  durationMins: number;
  moodScore: number;
}

export function filterTodaySessions<T extends SessionLike>(sessions: T[]): T[] {
  return sessions.filter((session) => isToday(new Date(session.createdAt)));
}

export function computeTodaySummary(sessions: SessionLike[]) {
  const todaySessions = filterTodaySessions(sessions);

  if (todaySessions.length === 0) {
    return null;
  }

  const todayMins = todaySessions.reduce(
    (sum, session) => sum + session.durationMins,
    0,
  );
  const avgMood =
    todaySessions.reduce((sum, session) => sum + session.moodScore, 0) /
    todaySessions.length;

  return {
    sessionCount: todaySessions.length,
    todayMins,
    avgMood: avgMood.toFixed(1),
    minsDisplay: todayMins === SUB_MINUTE_SESSION_MINS ? "<1" : todayMins,
  };
}

export function formatDurationMins(mins: number): string {
  return mins === SUB_MINUTE_SESSION_MINS ? "10s" : `${mins}m`;
}

export function formatSessionLabel(durationMins: number): string {
  return durationMins === SUB_MINUTE_SESSION_MINS
    ? "10-second session"
    : `${durationMins}-minute session`;
}
