"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { AIResponse } from "@/components/AIResponse";
import { BreathingWidget } from "@/components/BreathingWidget";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

const MOODS = [
  { score: 1, emoji: "😤", label: "Awful" },
  { score: 2, emoji: "😔", label: "Low" },
  { score: 3, emoji: "😐", label: "Okay" },
  { score: 4, emoji: "🙂", label: "Good" },
  { score: 5, emoji: "🤩", label: "Great" },
] as const;

const STEPS = [
  { id: "form", label: "Check-in" },
  { id: "ai", label: "Coach" },
  { id: "breathing", label: "Breathe" },
] as const;

type ModalStep = (typeof STEPS)[number]["id"];

interface SessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  durationMins: number;
  examType: string;
  onFlowComplete: () => void;
}

function StepIndicator({ step }: { step: ModalStep }) {
  const currentIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="mb-5 flex items-center gap-2">
      {STEPS.map((s, index) => {
        const isActive = index === currentIndex;
        const isDone = index < currentIndex;
        return (
          <div key={s.id} className="flex flex-1 items-center gap-2">
            <div className="flex min-w-0 flex-1 flex-col items-center gap-1">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-base border-2 border-border text-xs font-heading transition-colors",
                  isActive && "bg-main text-main-foreground",
                  isDone && "bg-main/30",
                  !isActive && !isDone && "bg-background text-foreground/40",
                )}
              >
                {index + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] font-heading",
                  isActive ? "text-foreground" : "text-foreground/40",
                )}
              >
                {s.label}
              </span>
            </div>
            {index < STEPS.length - 1 ? (
              <div
                className={cn(
                  "mb-4 h-0.5 flex-1 rounded-full bg-border",
                  isDone && "bg-main",
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function SessionModal({
  open,
  onOpenChange,
  durationMins,
  examType,
  onFlowComplete,
}: SessionModalProps) {
  const [step, setStep] = useState<ModalStep>("form");
  const [moodScore, setMoodScore] = useState<number | null>(null);
  const [journalText, setJournalText] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const utils = api.useUtils();

  const saveMutation = api.session.save.useMutation({
    onSuccess: (data) => {
      setAiResponse(data.aiResponse);
      setStep("ai");
      void utils.session.getHistory.invalidate();
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setStep("form");
      setMoodScore(null);
      setJournalText("");
      setAiResponse("");
      saveMutation.reset();
    }
    onOpenChange(nextOpen);
  };

  const handleSubmit = () => {
    if (!moodScore) return;

    saveMutation.mutate({
      durationMins,
      moodScore,
      examType,
      journalText: journalText.trim() || undefined,
    });
  };

  const handleBreathingComplete = () => {
    handleOpenChange(false);
    onFlowComplete();
  };

  const sessionLabel =
    durationMins === 0 ? "10-second session" : `${durationMins}-minute session`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <StepIndicator step={step} />

        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle>How are you feeling?</DialogTitle>
              <DialogDescription>
                You just finished a {sessionLabel} for {examType}. Log your mood
                before the next block.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="grid grid-cols-5 gap-2">
                {MOODS.map((mood) => (
                  <button
                    key={mood.score}
                    type="button"
                    onClick={() => setMoodScore(mood.score)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-base border-2 border-border bg-background p-2.5 transition-all",
                      "hover:bg-main/10 active:scale-[0.98]",
                      moodScore === mood.score &&
                        "border-main bg-main/25 shadow-shadow",
                    )}
                  >
                    <span className="text-xl">{mood.emoji}</span>
                    <span className="text-[10px] font-heading leading-none">
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="journal"
                  className="text-xs font-heading text-foreground/60"
                >
                  Optional journal
                </label>
                <Textarea
                  id="journal"
                  placeholder="What's on your mind? Vent freely. This stays private."
                  value={journalText}
                  onChange={(event) => setJournalText(event.target.value)}
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                disabled={!moodScore || saveMutation.isPending}
                onClick={handleSubmit}
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Getting coach reply...
                  </>
                ) : (
                  "Submit check-in"
                )}
              </Button>
            </div>
          </>
        )}

        {step === "ai" && (
          <>
            <DialogHeader>
              <DialogTitle>Your wellness coach</DialogTitle>
              <DialogDescription>
                A short reply based on your mood and session.
              </DialogDescription>
            </DialogHeader>
            <AIResponse
              aiResponse={aiResponse}
              onStartBreathing={() => setStep("breathing")}
            />
          </>
        )}

        {step === "breathing" && (
          <>
            <DialogHeader>
              <DialogTitle>4-7-8 breathing</DialogTitle>
              <DialogDescription>
                Inhale 4s, hold 7s, exhale 8s. Three cycles.
              </DialogDescription>
            </DialogHeader>
            <BreathingWidget onComplete={handleBreathingComplete} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
