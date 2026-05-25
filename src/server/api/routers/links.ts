import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

const linkItemInput = z.object({
  id:           z.string().optional(),
  type:         z.string().default("link"),
  title:        z.string().default(""),
  url:          z.string().default(""),
  enabled:      z.boolean().default(true),
  order:        z.number().default(0),
  icon:         z.string().default(""),
  waCountry:    z.string().optional(),
  waPhone:      z.string().optional(),
  waMessage:    z.string().optional(),
  igUsername:   z.string().optional(),
  emailAddress: z.string().optional(),
  emailSubject: z.string().optional(),
});

const pageInput = z.object({
  template:        z.string().optional(),
  displayName:     z.string().optional(),
  bio:             z.string().optional(),
  avatarUrl:       z.string().optional(),
  avatarBg:        z.string().optional(),
  avatarInitial:   z.string().optional(),
  bgType:          z.string().optional(),
  bgColor:         z.string().optional(),
  bgGradFrom:      z.string().optional(),
  bgGradTo:        z.string().optional(),
  bgGradAngle:     z.number().optional(),
  bgImageUrl:      z.string().optional(),
  bgOverlayColor:  z.string().optional(),
  bgOverlayOpacity: z.number().optional(),
  btnShape:        z.string().optional(),
  btnVariant:      z.string().optional(),
  btnBg:           z.string().optional(),
  btnText:         z.string().optional(),
  btnBorder:       z.string().optional(),
  fontFamily:      z.string().optional(),
  fontWeight:      z.string().optional(),
  textColor:       z.string().optional(),
  subColor:        z.string().optional(),
  labels:          z.record(z.string()).optional(),
  slug:            z.string().optional(),
  published:       z.boolean().optional(),
  links:           z.array(linkItemInput).optional(),
});

export const linksRouter = createTRPCRouter({
  /** Get the current user's links page (with links ordered). */
  getMine: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.linksPage.findFirst({
      where: { userId: ctx.userId },
      include: { links: { orderBy: { order: "asc" } } },
    });
  }),

  /**
   * Upsert the links page.
   * When `links` is provided, the entire link list is replaced atomically.
   */
  upsert: protectedProcedure
    .input(pageInput)
    .mutation(async ({ ctx, input }) => {
      const { links, ...pageData } = input;

      const existing = await ctx.db.linksPage.findFirst({
        where: { userId: ctx.userId },
        select: { id: true },
      });

      if (existing) {
        const page = await ctx.db.linksPage.update({
          where: { id: existing.id },
          data: {
            ...pageData,
            labels: pageData.labels as object | undefined,
          },
        });

        if (links !== undefined) {
          await ctx.db.linkItem.deleteMany({ where: { linksPageId: page.id } });
          if (links.length > 0) {
            await ctx.db.linkItem.createMany({
              data: links.map((l, i) => ({
                linksPageId: page.id,
                ...l,
                order: l.order ?? i,
                id:    undefined, // let DB generate a new id
              })),
            });
          }
        }

        return ctx.db.linksPage.findUniqueOrThrow({
          where: { id: page.id },
          include: { links: { orderBy: { order: "asc" } } },
        });
      }

      return ctx.db.linksPage.create({
        data: {
          userId:      ctx.userId,
          displayName: pageData.displayName ?? "",
          ...pageData,
          labels: (pageData.labels ?? {}) as object,
          links: links
            ? { create: links.map((l, i) => ({ ...l, order: l.order ?? i, id: undefined })) }
            : undefined,
        },
        include: { links: { orderBy: { order: "asc" } } },
      });
    }),

  /** Public — fetch a published page by slug (for /l/[slug] route). */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const page = await ctx.db.linksPage.findFirst({
        where: { slug: input.slug, published: true },
        include: { links: { where: { enabled: true }, orderBy: { order: "asc" } } },
      });
      if (!page) throw new TRPCError({ code: "NOT_FOUND" });
      return page;
    }),
});
