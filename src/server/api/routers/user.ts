import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const nullableStr = z.string().trim().max(200).nullable().optional();

export const userRouter = createTRPCRouter({
  /**
   * Current signed-in user's profile. If the signup trigger hasn't created the
   * row yet (or for older accounts), it's created on first read so the profile
   * page always has data to show.
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    const existing = await ctx.db.user.findUnique({ where: { id: ctx.userId } });
    if (existing) return existing;

    const { data: { user } } = await ctx.supabase.auth.getUser();
    const meta = (user?.user_metadata ?? {}) as { full_name?: string; name?: string };
    return ctx.db.user.create({
      data: {
        id:    ctx.userId,
        email: user?.email ?? "",
        name:  meta.full_name ?? meta.name ?? null,
      },
    });
  }),

  /** Update the editable profile fields. Email is managed by auth, not here. */
  updateProfile: protectedProcedure
    .input(z.object({
      name:      z.string().trim().max(120).nullable().optional(),
      bio:       z.string().trim().max(300).nullable().optional(),
      location:  z.string().trim().max(120).nullable().optional(),
      specialty: z.string().trim().max(120).nullable().optional(),
      avatarUrl: nullableStr,
      coverUrl:  nullableStr,
      instagram: nullableStr,
      twitter:   nullableStr,
      website:   nullableStr,
      behance:   nullableStr,
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({ where: { id: ctx.userId }, data: input });
    }),
});
