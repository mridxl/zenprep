import { GoogleGenerativeAI } from "@google/generative-ai";

import { env } from "@/env";
import type { ExamType } from "@/lib/exam-types";
import { buildWellnessPrompt } from "@/lib/gemini-prompt";

let client: GoogleGenerativeAI | undefined;

function getModel() {
  client ??= new GoogleGenerativeAI(env.GEMINI_API_KEY);
  return client.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
}

export async function getWellnessAdvice({
  examType,
  moodScore,
  journalText,
  durationMins,
}: {
  examType: ExamType;
  moodScore: number;
  journalText: string;
  durationMins: number;
}): Promise<string> {
  const prompt = buildWellnessPrompt({
    examType,
    moodScore,
    journalText,
    durationMins,
  });

  const result = await getModel().generateContent(prompt);
  const text = result.response.text().trim();

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return text;
}
