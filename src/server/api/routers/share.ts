import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { photoPreviewKey, resolveMediaUrl } from "~/server/s3";

export const shareRouter = createTRPCRouter({
  /** Create a public share link to photos, a folder snapshot, or a portfolio. */
  create: protectedProcedure
    .input(z.object({
      kind:     z.enum(["photos", "folder", "portfolio"]),
      photoIds: z.array(z.string()).optional(),
      folderId: z.string().optional(),
      title:    z.string().max(200).optional(),
      slug:     z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      let photoIds = input.photoIds ?? [];
      let title = input.title ?? "";

      if (input.kind === "folder") {
        if (!input.folderId) throw new TRPCError({ code: "BAD_REQUEST" });
        const folder = await ctx.db.photoFolder.findFirst({
          where: { id: input.folderId, userId: ctx.userId },
          select: { name: true, photos: { select: { id: true }, orderBy: { createdAt: "desc" } } },
        });
        if (!folder) throw new TRPCError({ code: "NOT_FOUND" });
        photoIds = folder.photos.map((p) => p.id);
        if (!title) title = folder.name;
      }

      if (photoIds.length > 0) {
        const owned = await ctx.db.photo.count({ where: { id: { in: photoIds }, userId: ctx.userId } });
        if (owned !== photoIds.length) throw new TRPCError({ code: "FORBIDDEN" });
      }

      const share = await ctx.db.share.create({
        data: { userId: ctx.userId, kind: input.kind, title, photoIds, slug: input.slug ?? "" },
      });
      return { id: share.id };
    }),

  /** Public — resolve a share for the /s/{id} viewer and chat cards. */
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const share = await ctx.db.share.findUnique({
        where: { id: input.id },
        select: { kind: true, title: true, photoIds: true, slug: true, userId: true, createdAt: true },
      });
      if (!share) throw new TRPCError({ code: "NOT_FOUND" });

      if (share.kind === "portfolio") {
        const p = await ctx.db.portfolio.findFirst({ where: { slug: share.slug, status: "published" }, select: { title: true } });
        return { kind: "portfolio" as const, title: share.title || p?.title || "Portfolio", slug: share.slug, photos: [] as ShareViewPhoto[] };
      }

      const rows = await ctx.db.photo.findMany({
        where: { id: { in: share.photoIds }, userId: share.userId },
        select: { id: true, storagePath: true, hasPreview: true, width: true, height: true, filename: true },
      });
      const byId = new Map(rows.map((r) => [r.id, r]));
      const photos: ShareViewPhoto[] = [];
      for (const pid of share.photoIds) {
        const r = byId.get(pid);
        if (!r) continue;
        photos.push({
          id:    r.id,
          src:   await resolveMediaUrl(r.hasPreview ? photoPreviewKey(share.userId, r.id) : r.storagePath),
          full:  await resolveMediaUrl(r.storagePath),
          width: r.width, height: r.height, filename: r.filename,
        });
      }
      return { kind: share.kind as "photos" | "folder", title: share.title, slug: "", photos };
    }),
});

type ShareViewPhoto = { id: string; src: string; full: string; width: number | null; height: number | null; filename: string };
