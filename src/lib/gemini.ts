import { GoogleGenerativeAI } from "@google/generative-ai";

import { env } from "@/env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

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
  const sessionLength =
    durationMins === 0 ? "10-second" : `${durationMins}-minute`;

  const prompt = `
You are a warm, no-nonsense mental wellness coach for Indian students preparing for ${examType}.
The student just finished a ${sessionLength} study session.
Mood score: ${moodScore}/5 (1 = awful, 5 = great).
They wrote: "${journalText || "Nothing — they skipped the journal."}"

Reply in EXACTLY 3 sentences. No lists, no headers.
Sentence 1 — Empathy: Acknowledge their specific mood without being preachy.
Sentence 2 — Reframe: If they're struggling, gently challenge the spiral. If doing well, reinforce it.
Sentence 3 — Action: MUST recommend exactly this break: "Do 3 cycles of 4-7-8 breathing — inhale 4s, hold 7s, exhale 8s." Do not suggest any other activity (no jumping jacks, walks, generic deep breaths, etc.).

Sound like a caring senior who cleared the exam, not a therapist chatbot.
  `.trim();

  const result = await model.generateContent(prompt);
  return result.response.text();
}
