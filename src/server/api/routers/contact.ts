import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const contactRouter = createTRPCRouter({
  /** Public — a visitor submits a published portfolio's contact form (inbox mode). */
  submit: publicProcedure
    .input(z.object({
      slug:    z.string(),
      name:    z.string().trim().min(1).max(120),
      email:   z.string().trim().email().max(200),
      message: z.string().trim().min(1).max(4000),
    }))
    .mutation(async ({ ctx, input }) => {
      const portfolio = await ctx.db.portfolio.findFirst({
        where: { slug: input.slug, status: "published" },
        select: { id: true, userId: true },
      });
      if (!portfolio) throw new TRPCError({ code: "NOT_FOUND" });
      await ctx.db.contactMessage.create({
        data: {
          portfolioId: portfolio.id,
          userId:      portfolio.userId,
          name:        input.name,
          email:       input.email,
          message:     input.message,
        },
      });
      return { ok: true };
    }),

  /** Protected — the owner's inbox across all their portfolios. */
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.contactMessage.findMany({
      where:   { userId: ctx.userId },
      orderBy: { createdAt: "desc" },
      take:    200,
      select: {
        id: true, name: true, email: true, message: true, read: true, createdAt: true,
        portfolio: { select: { title: true, slug: true } },
      },
    });
  }),

  /** Protected — unread count for the Inbox badge. */
  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.contactMessage.count({ where: { userId: ctx.userId, read: false } });
  }),

  markRead: protectedProcedure
    .input(z.object({ id: z.string(), read: z.boolean().default(true) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.contactMessage.updateMany({ where: { id: input.id, userId: ctx.userId }, data: { read: input.read } });
      return { ok: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.contactMessage.deleteMany({ where: { id: input.id, userId: ctx.userId } });
      return { ok: true };
    }),
});
