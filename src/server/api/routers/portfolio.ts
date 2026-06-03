import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const portfolioRouter = createTRPCRouter({
  /** Public — fetch a published portfolio by slug for the /p/[slug] site. */
  getPublicBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const portfolio = await ctx.db.portfolio.findFirst({
        where: { slug: input.slug, status: "published" },
        select: {
          id: true,
          title: true,
          slug: true,
          template: true,
          content: true,
          updatedAt: true,
          user: { select: { name: true, avatarUrl: true } },
        },
      });
      if (!portfolio) throw new TRPCError({ code: "NOT_FOUND" });
      return portfolio;
    }),

  /** List all portfolios for the current user. */
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.portfolio.findMany({
      where: { userId: ctx.userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        template: true,
        customDomain: true,
        views: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }),

  /** Get one portfolio with its full content tree. */
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const portfolio = await ctx.db.portfolio.findFirst({
        where: { id: input.id, userId: ctx.userId },
      });
      if (!portfolio) throw new TRPCError({ code: "NOT_FOUND" });
      return portfolio;
    }),

  /** Create a new portfolio. */
  create: protectedProcedure
    .input(z.object({
      title:    z.string().min(1),
      slug:     z.string().min(1),
      template: z.string().optional(),
      content:  z.unknown().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Verify slug uniqueness
      const taken = await ctx.db.portfolio.findUnique({ where: { slug: input.slug } });
      if (taken) throw new TRPCError({ code: "CONFLICT", message: "Slug already taken" });

      return ctx.db.portfolio.create({
        data: {
          userId:   ctx.userId,
          title:    input.title,
          slug:     input.slug,
          template: input.template ?? "minimal",
          content:  (input.content ?? {}) as object,
        },
      });
    }),

  /**
   * Update an existing portfolio.
   * Passing `content` replaces the entire content tree (categories/folders/photos).
   */
  update: protectedProcedure
    .input(z.object({
      id:           z.string(),
      title:        z.string().optional(),
      slug:         z.string().optional(),
      status:       z.string().optional(),
      template:     z.string().optional(),
      customDomain: z.string().nullable().optional(),
      content:      z.unknown().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, content, ...rest } = input;

      const existing = await ctx.db.portfolio.findFirst({
        where: { id, userId: ctx.userId },
        select: { id: true },
      });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });

      if (rest.slug) {
        const taken = await ctx.db.portfolio.findFirst({
          where: { slug: rest.slug, id: { not: id } },
        });
        if (taken) throw new TRPCError({ code: "CONFLICT", message: "Slug already taken" });
      }

      return ctx.db.portfolio.update({
        where: { id },
        data: {
          ...rest,
          content: content !== undefined ? (content as object) : undefined,
        },
      });
    }),

  /** Delete a portfolio. */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.portfolio.findFirst({
        where: { id: input.id, userId: ctx.userId },
        select: { id: true },
      });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
      await ctx.db.portfolio.delete({ where: { id: input.id } });
      return { ok: true };
    }),
});
