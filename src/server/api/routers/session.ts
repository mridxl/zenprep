import { z } from "zod";

import { EXAM_TYPE_SCHEMA_VALUE } from "@/lib/exam-types";
import { getWellnessAdvice } from "@/lib/gemini";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const sessionRouter = createTRPCRouter({
  save: protectedProcedure
    .input(
      z.object({
        durationMins: z.number().int().min(0).max(180),
        moodScore: z.number().int().min(1).max(5),
        examType: z.enum(EXAM_TYPE_SCHEMA_VALUE),
        journalText: z.string().max(2000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const aiResponse = await getWellnessAdvice({
        examType: input.examType,
        moodScore: input.moodScore,
        journalText: input.journalText ?? "",
        durationMins: input.durationMins,
      });

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

      return { session, aiResponse };
    }),

  getHistory: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.studySession.findMany({
      where: { userId: ctx.userId },
      orderBy: { createdAt: "desc" },
      take: 7,
    });
  }),
});
