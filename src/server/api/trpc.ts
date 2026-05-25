import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "~/server/db";
import { createClient as createSupabaseClient } from "~/lib/supabase/server";

/**
 * tRPC context — provides db, supabase client, and the authenticated userId.
 * Auth is resolved via Supabase SSR (cookie-based JWT) instead of NextAuth.
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  return {
    db,
    supabase,
    userId: user?.id ?? null,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter    = t.router;

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();
  if (t._config.isDev) {
    await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 400) + 100));
  }
  const result = await next();
  console.log(`[TRPC] ${path} took ${Date.now() - start}ms`);
  return result;
});

/** Public — anyone can call, userId may be null. */
export const publicProcedure = t.procedure.use(timingMiddleware);

/** Protected — throws UNAUTHORIZED if user is not signed in. */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: { ...ctx, userId: ctx.userId },
    });
  });
