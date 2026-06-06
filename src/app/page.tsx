"use client";

import { useCallback, useState } from "react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { BookOpen, HeartPulse, Timer as TimerIcon } from "lucide-react";

import {
  ExamTypePicker,
  type ExamType,
} from "@/components/ExamTypePicker";
import { MoodChart } from "@/components/MoodChart";
import { SessionHistory } from "@/components/SessionHistory";
import { TodaySummary } from "@/components/TodaySummary";
import { SessionModal } from "@/components/SessionModal";
import { Timer } from "@/components/Timer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/trpc/react";

function LoadingShell() {
  return (
    <main className="pattern-dots flex min-h-[100dvh] flex-col bg-background">
      <header className="border-b-2 border-border bg-secondary-background px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="h-10 w-32 animate-pulse rounded-base bg-foreground/10" />
          <div className="size-9 animate-pulse rounded-full bg-foreground/10" />
        </div>
      </header>
      <div className="mx-auto w-full max-w-5xl space-y-8 p-4 md:p-8">
        <div className="mx-auto h-80 max-w-lg animate-pulse rounded-base bg-foreground/10" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="h-16 animate-pulse rounded-base bg-foreground/10" />
          <div className="h-16 animate-pulse rounded-base bg-foreground/10" />
          <div className="h-16 animate-pulse rounded-base bg-foreground/10" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-52 animate-pulse rounded-base bg-foreground/10" />
          <div className="h-52 animate-pulse rounded-base bg-foreground/10" />
        </div>
      </div>
    </main>
  );
}

const FEATURES = [
  {
    icon: TimerIcon,
    title: "Focused Pomodoros",
    body: "Pick a block length and stay in flow without gamified pressure.",
  },
  {
    icon: HeartPulse,
    title: "Mood check-ins",
    body: "Log how you feel after each session. Private, no leaderboards.",
  },
  {
    icon: BookOpen,
    title: "Coach + breathing",
    body: "Get a short wellness reply, then a guided 4-7-8 reset.",
  },
] as const;

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();
  const [examType, setExamType] = useState<ExamType>("NEET");
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [completedDuration, setCompletedDuration] = useState(25);
  const [timerResetSignal, setTimerResetSignal] = useState(0);

  const { data: sessions = [] } = api.session.getHistory.useQuery(undefined, {
    enabled: isLoaded && !!isSignedIn,
  });

  const handleSessionComplete = useCallback((durationMins: number) => {
    setCompletedDuration(durationMins);
    setSessionModalOpen(true);
  }, []);

  const handleFlowComplete = useCallback(() => {
    setTimerResetSignal((prev) => prev + 1);
  }, []);

  if (!isLoaded) {
    return <LoadingShell />;
  }

  return (
    <main className="pattern-dots flex min-h-[100dvh] flex-col bg-background">
      <header className="border-b-2 border-border bg-secondary-background px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-base border-2 border-border bg-main shadow-shadow">
              <span className="font-heading text-sm">ZP</span>
            </div>
            <div>
              <h1 className="font-heading text-xl leading-none md:text-2xl">
                ZenPrep
              </h1>
              <p className="mt-1 text-xs text-foreground/60 md:text-sm">
                Study timer with burnout guardrails
              </p>
            </div>
          </div>
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <ExamTypePicker
                value={examType}
                onChange={setExamType}
                disabled={sessionModalOpen}
              />
              <UserButton />
            </div>
          ) : null}
        </div>
      </header>

      {!isSignedIn ? (
        <div className="mx-auto grid w-full max-w-6xl flex-1 place-content-center gap-10 px-4 py-12 md:grid-cols-2 md:items-center md:px-8 md:py-16">
          <div className="space-y-6">
            <h2 className="max-w-md font-heading text-4xl tracking-tight md:text-5xl">
              Study hard.
              <br />
              Recover smarter.
            </h2>
            <p className="max-w-sm text-base leading-relaxed text-foreground/70">
              A private logbook for Indian exam prep. Track mood, get a coach
              nudge, breathe, repeat.
            </p>
            <SignInButton mode="modal">
              <Button size="lg">Sign in to start</Button>
            </SignInButton>
          </div>

          <div className="rounded-base border-2 border-border bg-secondary-background p-6 shadow-shadow">
            <ul className="space-y-5">
              {FEATURES.map((feature) => (
                <li key={feature.title} className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-base border-2 border-border bg-main/30">
                    <feature.icon className="size-4" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-heading text-sm">{feature.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/65">
                      {feature.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 md:px-8 md:py-10">
          <section className="mx-auto max-w-lg">
            <Timer
              onSessionComplete={handleSessionComplete}
              disabled={sessionModalOpen}
              resetSignal={timerResetSignal}
            />
          </section>

          <section className="mt-8 space-y-6">
            <TodaySummary sessions={sessions} />

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Mood trend</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <MoodChart sessions={sessions} />
                </CardContent>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Recent sessions</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <SessionHistory sessions={sessions} />
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      )}

      {isSignedIn ? (
        <SessionModal
          open={sessionModalOpen}
          onOpenChange={setSessionModalOpen}
          durationMins={completedDuration}
          examType={examType}
          onFlowComplete={handleFlowComplete}
        />
      ) : null}
    </main>
  );
}
