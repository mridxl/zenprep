import { GoogleGenerativeAI } from "@google/generative-ai";

import { env } from "@/env";
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
  examType: string;
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
  return result.response.text();
}
