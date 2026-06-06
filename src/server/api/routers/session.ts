import { z } from "zod";

import { EXAM_TYPE_SCHEMA_VALUE } from "@/lib/exam-types";
import { getWellnessAdvice } from "@/lib/gemini";
import {
  AI_FALLBACK_RESPONSE,
  HISTORY_LIMIT,
  MAX_JOURNAL_LENGTH,
  MAX_SESSION_DURATION_MINS,
} from "@/lib/session-constants";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const sessionRouter = createTRPCRouter({
  save: protectedProcedure
    .input(
      z.object({
        durationMins: z
          .number()
          .int()
          .min(0)
          .max(MAX_SESSION_DURATION_MINS),
        moodScore: z.number().int().min(1).max(5),
        examType: z.enum(EXAM_TYPE_SCHEMA_VALUE),
        journalText: z.string().max(MAX_JOURNAL_LENGTH).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let aiResponse = AI_FALLBACK_RESPONSE;
      let coachUnavailable = true;

      try {
        aiResponse = await getWellnessAdvice({
          examType: input.examType,
          moodScore: input.moodScore,
          journalText: input.journalText ?? "",
          durationMins: input.durationMins,
        });
        coachUnavailable = false;
      } catch {
        // Session is still saved; user gets a static fallback coach message.
      }

      const session = await ctx.db.studySession.create({
        data: {
          userId: ctx.userId,
          durationMins: input.durationMins,
          moodScore: input.moodScore,
          examType: input.examType,
          journalText: input.journalText,
          aiResponse,
        },
      });

      return { session, aiResponse, coachUnavailable };
    }),

  getHistory: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.studySession.findMany({
      where: { userId: ctx.userId },
      orderBy: { createdAt: "desc" },
      take: HISTORY_LIMIT,
    });
  }),
});
