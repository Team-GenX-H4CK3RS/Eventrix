import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const organisationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const org = await ctx.db.organisation.create({
        data: {
          name: input.name,
        },
      });
      const user = await ctx.db.organisationUser.create({
        data: {
          userEmail: ctx.session.user.email ?? "",
          org: { connect: { id: org.id } },
          role: {
            create: {
              org: { connect: { id: org.id } },
              name: "Owner",
              hasCreated: true,
              hasAdmin: true,
            },
          },
        },
      });
      return org;
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.organisation.findMany({
      include: { events: true, members: true },
      where: {
        members: {
          some: { userEmail: { equals: ctx.session.user.email ?? "" } },
        },
      },
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
          members: {
            some: { userEmail: { equals: ctx.session.user.email ?? "" } },
          },
        },
      })) !== 0
    );
  }),

  getAllMembersByOrg: protectedProcedure
    .input(
      z.object({
        orgId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.organisationUser.findMany({
        where: { orgId: { equals: input.orgId } },
        include: { role: true },
      });
    }),

  hasAnyMembersById: protectedProcedure
    .input(
      z.object({
        orgId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return (
        (await ctx.db.organisationUser.count({
          where: { orgId: { equals: input.orgId } },
        })) !== 0
      );
    }),

  createMember: protectedProcedure
    .input(
      z.object({
        orgId: z.number(),
        roleId: z.number(),
        userEmail: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { orgId, roleId, ...oInput } = input;
      return await ctx.db.organisationUser.create({
        data: {
          org: { connect: { id: orgId } },
          role: { connect: { id: roleId } },
          ...oInput,
        },
      });
    }),

  getRolesById: protectedProcedure
    .input(
      z.object({
        orgId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.organisationRole.findMany({
        where: { orgId: { equals: input.orgId } },
      });
    }),

  createRole: protectedProcedure
    .input(
      z.object({
        orgId: z.number(),
        name: z.string(),
        hasAdmin: z.boolean(),
        hasJoined: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { orgId, ...oInput } = input;
      return await ctx.db.organisationRole.create({
        data: {
          org: { connect: { id: orgId } },
          ...oInput,
          hasCreated: false,
        },
      });
    }),
});
