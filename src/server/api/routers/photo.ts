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
  /** List the user's photo library, newest first. URLs resolved via CDN/presign. */
  list: protectedProcedure
    .input(z.object({
      limit:  z.number().min(1).max(200).default(100),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db.photo.findMany({
        where:   { userId: ctx.userId },
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
