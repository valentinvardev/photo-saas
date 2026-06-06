import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const chatRouter = createTRPCRouter({
  /** Recent messages in the global community room, oldest → newest. */
  list: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(50) }).optional())
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db.message.findMany({
        orderBy: { createdAt: "desc" },
        take: input?.limit ?? 50,
      });
      return rows.reverse();
    }),

  /** Post a message to the community room. */
  send: protectedProcedure
    .input(z.object({ body: z.string().trim().min(1).max(2000) }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.userId },
        select: { name: true, email: true },
      });
      const authorName = user?.name ?? user?.email?.split("@")[0] ?? "User";

      return ctx.db.message.create({
        data: { userId: ctx.userId, authorName, body: input.body },
      });
    }),
});
