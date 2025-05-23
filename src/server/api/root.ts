import { eventRouter } from "~/server/api/routers/event";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { organisationRouter } from "~/server/api/routers/organisation";
import { chatbotRouter } from "./routers/chatbot";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  event: eventRouter,
  org: organisationRouter,
  chatbot: chatbotRouter,
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
