import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const organisationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.db.organisation.create({
        data: {
          name: input.name,
          roles: {
            create: { name: "Owner", hasCreated: true, hasAdmin: true },
          },
        },
      });
      const role = await ctx.db.organisationRole.create({
        data: {
          org: { connect: { id: org.id } },
          name: "Owner",
          hasCreated: true,
          hasAdmin: false,
        },
      });
      const user = await ctx.db.organisationUser.create({
        data: {
          user: { connect: { id: ctx.session.user.id } },
          org: { connect: { id: org.id } },
          role: { connect: { id: role.id } },
        },
      });
      return org;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.organisation.findMany({
      where: { members: { some: { userId: { equals: ctx.session.user.id } } } },
    });
  }),

  getById: protectedProcedure
    .input(
      z.object({
        orgId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.organisation.findFirst({
        where: {
          id: { equals: input.orgId },
        },
      });
    }),

  hasAny: protectedProcedure.query(async ({ ctx }) => {
    return (
      (await ctx.db.organisation.count({
        where: {
          members: { some: { userId: { equals: ctx.session.user.id } } },
        },
      })) !== 0
    );
  }),
});
