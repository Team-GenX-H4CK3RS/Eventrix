import { z } from "zod";
import { env } from "~/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { stdiso } from "~/server/util";

const zdt = z.string().datetime();

export const chatbotRouter = createTRPCRouter({
  send: protectedProcedure
    .input(
      z.object({
        q: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = await fetch("http://10.123.177.127/chatbot/ask", {
        method: "POST",
        body: JSON.stringify({ userId: ctx.session.user.id, q: input.q }),
      });
      const json = (await res.json()) as { response: string } | undefined;
      if (!json) return;
      const response = JSON.parse(json.response) as Record<string, string>;
      return response;
    }),
});
