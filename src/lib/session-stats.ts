import { isToday } from "date-fns";

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
    minsDisplay: todayMins === 0 ? "<1" : todayMins,
  };
}

export function formatDurationMins(mins: number): string {
  return mins === 0 ? "10s" : `${mins}m`;
}

export function formatSessionLabel(durationMins: number): string {
  return durationMins === 0
    ? "10-second session"
    : `${durationMins}-minute session`;
}
