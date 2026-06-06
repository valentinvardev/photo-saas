import { postRouter }      from "~/server/api/routers/post";
import { portfolioRouter } from "~/server/api/routers/portfolio";
import { photoRouter }     from "~/server/api/routers/photo";
import { chatRouter }      from "~/server/api/routers/chat";
import { userRouter }      from "~/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

// MVP scope: portfolio + gallery (photo) + community chat. The links & delivery
// routers are built and kept in src/server/api/routers/ but unregistered here.
// To re-enable, re-import and add them back to the router map below.
export const appRouter = createTRPCRouter({
  post:      postRouter,
  portfolio: portfolioRouter,
  photo:     photoRouter,
  chat:      chatRouter,
  user:      userRouter,
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
