import { z } from "zod";
import { env } from "~/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { stdiso } from "~/server/util";

const zdt = z.string().datetime();

export const eventRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        location: z.string(),
        enrollEndsOn: z.string(),
        beginsOn: z.string(),
        endsOn: z.string(),
        orgId: z.number(),
        tags: z.string(),
        imageUrl: z.string().url(),
        visibility: z.string(),
        enrollFee: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log();

      const org = await ctx.db.event.create({
        data: {
          title: input.title,
          description: input.description,
          location: input.location,
          enrollEndsOn: stdiso(input.enrollEndsOn),
          beginsOn: stdiso(input.beginsOn),
          endsOn: stdiso(input.endsOn),
          imageUrl: input.imageUrl,
          org: { connect: { id: input.orgId } },
          visibility: input.visibility,
          tags: input.tags,
          enrollFee: input.enrollFee,
        },
      });
      return org;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.event.findMany({
      where: { visibility: { equals: "public" } },
    });
  }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.event.findFirst({
        where: { id: { equals: input.id } },
      });
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

  hasAnyByOrg: protectedProcedure
    .input(
      z.object({
        orgId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return (
        (await ctx.db.event.count({
          where: { orgId: { equals: input.orgId } },
        })) !== 0
      );
    }),
});
