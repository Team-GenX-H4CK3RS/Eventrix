import { z } from "zod";
import { env } from "~/env";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const eventRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        location: z.string(),
        enrollEndsOn: z.string().datetime(),
        beginsOn: z.string().datetime(),
        endsOn: z.string().datetime(),
        orgId: z.number(),
        tags: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log();

      const org = await ctx.db.event.create({
        data: {
          title: input.title,
          description: input.description,
          location: input.location,
          enrollEndsOn: new Date(input.enrollEndsOn).toISOString(),
          beginsOn: new Date(input.beginsOn).toISOString(),
          endsOn: new Date(input.endsOn).toISOString(),
          org: { connect: { id: input.orgId } },
        },
      });
      return org;
    }),

  getAllByOrg: protectedProcedure
    .input(
      z.object({
        orgId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.event.findMany({
        where: { orgId: { equals: input.orgId } },
      });
    }),

  hasAny: protectedProcedure
    .input(
      z.object({
        orgId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return (
        (await ctx.db.event.count({
          where: { orgId: { equals: input.orgId } },
        })) === 0
      );
    }),
});
