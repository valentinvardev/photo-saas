import { randomUUID } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  photoKey,
  photoPreviewKey,
  getPresignedUploadUrl,
  resolveMediaUrl,
  deleteS3Objects,
} from "~/server/s3";

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png":  "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export const photoRouter = createTRPCRouter({
  /** List the user's photos. Pass folderId to view a folder; omit for the whole library. */
  list: protectedProcedure
    .input(z.object({
      limit:    z.number().min(1).max(200).default(100),
      cursor:   z.string().optional(),
      folderId: z.string().nullable().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db.photo.findMany({
        where:   { userId: ctx.userId, ...(input.folderId !== undefined ? { folderId: input.folderId } : {}) },
        orderBy: { createdAt: "desc" },
        take:    input.limit + 1,
        cursor:  input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: string | undefined;
      if (rows.length > input.limit) nextCursor = rows.pop()!.id;

      // Resolve a fresh display URL per row (CloudFront is sync; presign fallback is async).
      const items = await Promise.all(
        rows.map(async (p) => ({ ...p, url: await resolveMediaUrl(p.storagePath) })),
      );

      return { items, nextCursor };
    }),

  /** Folders in the user's library, with photo counts. */
  listFolders: protectedProcedure.query(async ({ ctx }) => {
    const folders = await ctx.db.photoFolder.findMany({
      where:   { userId: ctx.userId },
      orderBy: { createdAt: "asc" },
      include: { _count: { select: { photos: true } } },
    });
    return folders.map((f) => ({ id: f.id, name: f.name, count: f._count.photos }));
  }),

  createFolder: protectedProcedure
    .input(z.object({ name: z.string().trim().min(1).max(80) }))
    .mutation(({ ctx, input }) =>
      ctx.db.photoFolder.create({ data: { userId: ctx.userId, name: input.name } }),
    ),

  renameFolder: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().trim().min(1).max(80) }))
    .mutation(async ({ ctx, input }) => {
      const { count } = await ctx.db.photoFolder.updateMany({
        where: { id: input.id, userId: ctx.userId },
        data:  { name: input.name },
      });
      if (count === 0) throw new TRPCError({ code: "NOT_FOUND" });
      return { ok: true };
    }),

  /** Delete a folder — its photos are un-filed (folderId → null), not deleted. */
  deleteFolder: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { count } = await ctx.db.photoFolder.deleteMany({
        where: { id: input.id, userId: ctx.userId },
      });
      if (count === 0) throw new TRPCError({ code: "NOT_FOUND" });
      return { ok: true };
    }),

  /** Move photos into a folder (folderId=null un-files them). */
  moveToFolder: protectedProcedure
    .input(z.object({ photoIds: z.array(z.string()).min(1), folderId: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {
      if (input.folderId) {
        const folder = await ctx.db.photoFolder.findFirst({
          where: { id: input.folderId, userId: ctx.userId }, select: { id: true },
        });
        if (!folder) throw new TRPCError({ code: "NOT_FOUND", message: "Folder not found" });
      }
      await ctx.db.photo.updateMany({
        where: { id: { in: input.photoIds }, userId: ctx.userId },
        data:  { folderId: input.folderId },
      });
      return { ok: true };
    }),

  /**
   * Step 1 of upload: presign a direct-to-S3 PUT.
   * The client PUTs the file body to `uploadUrl` with the matching Content-Type,
   * then calls confirm() with the returned key + photoId.
   */
  createUpload: protectedProcedure
    .input(z.object({
      filename: z.string(),
      mimeType: z.string(),
      size:     z.number().int().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      const ext = EXT_BY_MIME[input.mimeType] ?? (input.filename.split(".").pop() ?? "jpg");
      const photoId = randomUUID();
      const key = photoKey(ctx.userId, photoId, ext);

      const { url } = await getPresignedUploadUrl({
        key,
        contentType:   input.mimeType,
        contentLength: input.size,
      });

      return { uploadUrl: url, key, photoId };
    }),

  /** Step 2 of upload: create the Photo row once the S3 PUT succeeded. */
  confirm: protectedProcedure
    .input(z.object({
      photoId:  z.string(),
      key:      z.string(),
      filename: z.string(),
      mimeType: z.string(),
      size:     z.number().int().positive(),
      width:    z.number().optional(),
      height:   z.number().optional(),
      folderId: z.string().nullable().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Guard: the key must live in this user's namespace.
      if (!input.key.includes(`/users/${ctx.userId}/`)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Key outside your namespace" });
      }

      const row = await ctx.db.photo.create({
        data: {
          id:          input.photoId,
          userId:      ctx.userId,
          url:         "", // canonical location is storagePath; url is resolved on read
          storagePath: input.key,
          filename:    input.filename,
          mimeType:    input.mimeType,
          size:        input.size,
          width:       input.width,
          height:      input.height,
          folderId:    input.folderId ?? null,
        },
      });

      return { ...row, url: await resolveMediaUrl(input.key) };
    }),

  /** Delete a photo — removes the S3 objects (original + any preview) and the row. */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const photo = await ctx.db.photo.findFirst({
        where:  { id: input.id, userId: ctx.userId },
        select: { id: true, storagePath: true },
      });
      if (!photo) throw new TRPCError({ code: "NOT_FOUND" });

      await deleteS3Objects([photo.storagePath, photoPreviewKey(ctx.userId, photo.id)]);
      await ctx.db.photo.delete({ where: { id: input.id } });
      return { ok: true };
    }),
});
