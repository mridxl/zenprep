"use client";

import {
  Area,
  AreaChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getMoodMeta } from "@/lib/mood";
import type { RouterOutputs } from "@/trpc/react";

type Session = RouterOutputs["session"]["getHistory"][number];

interface MoodChartProps {
  sessions: Session[];
}

export function MoodChart({ sessions }: MoodChartProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
        <div className="size-12 rounded-base border-2 border-dashed border-border bg-main/10" />
        <p className="text-sm text-foreground/60">
          Complete a session to see your mood trend.
        </p>
      </div>
    );
  }

  const chartData = sessions
    .map((session, index) => ({
      session: `#${sessions.length - index}`,
      mood: session.moodScore,
    }))
    .reverse();

  const latestMood = sessions[0]?.moodScore;
  const latestLabel = latestMood ? getMoodMeta(latestMood).label : null;

  return (
    <div className="space-y-3">
      {latestLabel ? (
        <p className="text-sm text-foreground/60">
          Latest:{" "}
          <span className="font-heading text-foreground">
            {latestLabel} ({latestMood}/5)
          </span>
        </p>
      ) : null}

      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="session"
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
            axisLine={false}
            tickLine={false}
            width={24}
          />
          <Tooltip
            formatter={(value) => [
              typeof value === "number" ? `${value}/5` : String(value),
              "Mood",
            ]}
            contentStyle={{
              borderRadius: "12px",
              border: "2px solid var(--border)",
              backgroundColor: "var(--secondary-background)",
              color: "var(--foreground)",
              boxShadow: "var(--shadow)",
            }}
            labelStyle={{ color: "var(--foreground)" }}
            itemStyle={{ color: "var(--foreground)" }}
          />
          <Area
            type="monotone"
            dataKey="mood"
            stroke="none"
            fill="url(#moodFill)"
          />
          <Line
            type="monotone"
            dataKey="mood"
            stroke="var(--chart-1)"
            strokeWidth={2.5}
            dot={{ fill: "var(--chart-active-dot)", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
