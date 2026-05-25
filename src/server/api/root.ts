import { postRouter }      from "~/server/api/routers/post";
import { linksRouter }     from "~/server/api/routers/links";
import { deliveryRouter }  from "~/server/api/routers/delivery";
import { portfolioRouter } from "~/server/api/routers/portfolio";
import { photoRouter }     from "~/server/api/routers/photo";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  post:      postRouter,
  links:     linksRouter,
  delivery:  deliveryRouter,
  portfolio: portfolioRouter,
  photo:     photoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
