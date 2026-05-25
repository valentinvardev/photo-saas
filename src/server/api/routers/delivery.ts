import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

const deliveryInput = z.object({
  title:           z.string().optional(),
  client:          z.string().optional(),
  status:          z.string().optional(),
  template:        z.string().optional(),
  layout:          z.string().optional(),
  coverUrl:        z.string().optional(),
  coverFit:        z.string().optional(),
  coverPositionX:  z.number().optional(),
  coverPositionY:  z.number().optional(),
  welcomeMessage:  z.string().optional(),
  showUpsellBanner: z.boolean().optional(),
  passwordEnabled:  z.boolean().optional(),
  password:         z.string().optional(),
  whitelistEnabled: z.boolean().optional(),
  whitelist:        z.array(z.string()).optional(),
  passwordTitle:        z.string().optional(),
  passwordSubtitle:     z.string().optional(),
  passwordHint:         z.string().optional(),
  passwordButtonLabel:  z.string().optional(),
  mode:             z.string().optional(),
  pricePerPhoto:    z.number().optional(),
  priceFullGallery: z.number().optional(),
  downloadRes:      z.string().optional(),
  logoMode:         z.string().optional(),
  logoText:         z.string().optional(),
  logoUrl:          z.string().optional(),
  logoWidth:        z.number().optional(),
  customColors:     z.boolean().optional(),
  colorBg:          z.string().optional(),
  colorFg:          z.string().optional(),
  colorAccent:      z.string().optional(),
  colorBtnBg:       z.string().optional(),
  colorBtnFg:       z.string().optional(),
  fontFamily:       z.string().optional(),
  fontFamily1:      z.string().optional(),
  fontFamily2:      z.string().optional(),
  fontFamily3:      z.string().optional(),
  labels:           z.record(z.string()).optional(),
  slug:             z.string().optional(),
  expiresAt:        z.string().datetime().optional(),
});

export const deliveryRouter = createTRPCRouter({
  /** List all deliveries for the current user (lightweight, no photos). */
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.delivery.findMany({
      where: { userId: ctx.userId },
      orderBy: { updatedAt: "desc" },
      include: { _count: { select: { photos: true } } },
    });
  }),

  /** Get one delivery with its photos (ordered). */
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const delivery = await ctx.db.delivery.findFirst({
        where: { id: input.id, userId: ctx.userId },
        include: {
          photos: {
            orderBy: { order: "asc" },
            include: { photo: true },
          },
        },
      });
      if (!delivery) throw new TRPCError({ code: "NOT_FOUND" });
      return delivery;
    }),

  /** Create a new delivery. */
  create: protectedProcedure
    .input(deliveryInput)
    .mutation(async ({ ctx, input }) => {
      const { labels, expiresAt, ...rest } = input;
      return ctx.db.delivery.create({
        data: {
          userId: ctx.userId,
          ...rest,
          labels:    (labels ?? {}) as object,
          expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        },
      });
    }),

  /** Update an existing delivery. */
  update: protectedProcedure
    .input(z.object({ id: z.string() }).merge(deliveryInput))
    .mutation(async ({ ctx, input }) => {
      const { id, labels, expiresAt, ...rest } = input;

      const existing = await ctx.db.delivery.findFirst({
        where: { id, userId: ctx.userId },
        select: { id: true },
      });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });

      return ctx.db.delivery.update({
        where: { id },
        data: {
          ...rest,
          labels:    labels !== undefined ? (labels as object) : undefined,
          expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        },
      });
    }),

  /** Delete a delivery (cascades to DeliveryPhoto rows). */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.delivery.findFirst({
        where: { id: input.id, userId: ctx.userId },
        select: { id: true },
      });
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
      await ctx.db.delivery.delete({ where: { id: input.id } });
      return { ok: true };
    }),

  /** Add photos to a delivery (idempotent — skips duplicates). */
  addPhotos: protectedProcedure
    .input(z.object({
      deliveryId: z.string(),
      photoIds:   z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      const delivery = await ctx.db.delivery.findFirst({
        where: { id: input.deliveryId, userId: ctx.userId },
        include: { _count: { select: { photos: true } } },
      });
      if (!delivery) throw new TRPCError({ code: "NOT_FOUND" });

      const startOrder = delivery._count.photos;
      await ctx.db.deliveryPhoto.createMany({
        data: input.photoIds.map((photoId, i) => ({
          deliveryId: input.deliveryId,
          photoId,
          order: startOrder + i,
        })),
        skipDuplicates: true,
      });
      return { ok: true };
    }),

  /** Remove a single photo from a delivery. */
  removePhoto: protectedProcedure
    .input(z.object({ deliveryId: z.string(), photoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const delivery = await ctx.db.delivery.findFirst({
        where: { id: input.deliveryId, userId: ctx.userId },
        select: { id: true },
      });
      if (!delivery) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.deliveryPhoto.deleteMany({
        where: { deliveryId: input.deliveryId, photoId: input.photoId },
      });
      return { ok: true };
    }),

  /** Reorder photos within a delivery. */
  reorderPhotos: protectedProcedure
    .input(z.object({
      deliveryId: z.string(),
      photoIds:   z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      const delivery = await ctx.db.delivery.findFirst({
        where: { id: input.deliveryId, userId: ctx.userId },
        select: { id: true },
      });
      if (!delivery) throw new TRPCError({ code: "NOT_FOUND" });

      await ctx.db.$transaction(
        input.photoIds.map((photoId, order) =>
          ctx.db.deliveryPhoto.update({
            where: { deliveryId_photoId: { deliveryId: input.deliveryId, photoId } },
            data: { order },
          }),
        ),
      );
      return { ok: true };
    }),

  /**
   * Public — fetch an active delivery by slug for the /d/[slug] route.
   * Does not return the password hash, only whether password protection is enabled.
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const delivery = await ctx.db.delivery.findFirst({
        where: { slug: input.slug, status: "active" },
        include: {
          photos: {
            orderBy: { order: "asc" },
            include: { photo: { select: { id: true, url: true, width: true, height: true } } },
          },
        },
      });
      if (!delivery) throw new TRPCError({ code: "NOT_FOUND" });

      // Strip the password hash before sending to the client
      const { password: _, ...safe } = delivery;
      return safe;
    }),

  /**
   * Public — verify a delivery password (called when the gate form is submitted).
   * Returns a signed token on success that the client can cache in sessionStorage.
   */
  verifyPassword: publicProcedure
    .input(z.object({ slug: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const delivery = await ctx.db.delivery.findFirst({
        where: { slug: input.slug, status: "active" },
        select: { id: true, passwordEnabled: true, password: true },
      });
      if (!delivery) throw new TRPCError({ code: "NOT_FOUND" });
      if (!delivery.passwordEnabled) return { ok: true };
      if (delivery.password !== input.password) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Wrong password" });
      }
      return { ok: true };
    }),
});
