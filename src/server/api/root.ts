import {postRouter} from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { profileRouter } from "~/server/api/routers/profile";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
