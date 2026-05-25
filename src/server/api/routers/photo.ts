import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const BUCKET = "photos";

export const photoRouter = createTRPCRouter({
  /** List all photos in the user's library. */
  list: protectedProcedure
    .input(z.object({
      limit:  z.number().min(1).max(200).default(100),
      cursor: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.photo.findMany({
        where:   { userId: ctx.userId },
        orderBy: { createdAt: "desc" },
        take:    input.limit + 1,
        cursor:  input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: string | undefined;
      if (items.length > input.limit) {
        nextCursor = items.pop()!.id;
      }

      return { items, nextCursor };
    }),

  /**
   * Request a presigned upload URL from Supabase Storage.
   * Flow:
   *   1. Client calls this → gets { signedUrl, path, token }
   *   2. Client PUTs the file to signedUrl
   *   3. Client calls confirm() with the path + metadata
   */
  createUpload: protectedProcedure
    .input(z.object({
      filename: z.string(),
      mimeType: z.string(),
      size:     z.number().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
      const ext  = input.filename.split(".").pop() ?? "jpg";
      const path = `${ctx.userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { data, error } = await ctx.supabase.storage
        .from(BUCKET)
        .createSignedUploadUrl(path);

      if (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Storage error: ${error.message}`,
        });
      }

      return {
        signedUrl: data.signedUrl,
        token:     data.token,
        path,
      };
    }),

  /**
   * Confirm a completed upload — creates the Photo record in the DB.
   * The client must call this after the PUT to Supabase Storage succeeds.
   */
  confirm: protectedProcedure
    .input(z.object({
      path:     z.string(),
      filename: z.string(),
      mimeType: z.string(),
      size:     z.number().positive(),
      width:    z.number().optional(),
      height:   z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data: { publicUrl } } = ctx.supabase.storage
        .from(BUCKET)
        .getPublicUrl(input.path);

      return ctx.db.photo.create({
        data: {
          userId:      ctx.userId,
          url:         publicUrl,
          storagePath: input.path,
          filename:    input.filename,
          mimeType:    input.mimeType,
          size:        input.size,
          width:       input.width,
          height:      input.height,
        },
      });
    }),

  /**
   * Delete a photo — removes the DB record and the Storage object.
   * Also removes any DeliveryPhoto join rows (cascaded by DB).
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const photo = await ctx.db.photo.findFirst({
        where: { id: input.id, userId: ctx.userId },
        select: { id: true, storagePath: true },
      });
      if (!photo) throw new TRPCError({ code: "NOT_FOUND" });

      // Remove from Storage (ignore errors — record is still deleted)
      await ctx.supabase.storage.from(BUCKET).remove([photo.storagePath]);

      await ctx.db.photo.delete({ where: { id: input.id } });
      return { ok: true };
    }),
});
