import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "../trpc";

export const likerouter = createTRPCRouter({
  addLike: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        productId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (typeof input.userId === "string") {
        return await ctx.prisma.likedProduct.create({
          data: {
            userId: input.userId,
            productId: input.productId,
          },
        });
      }
    }),
  removeLike: protectedProcedure
    .input(z.object({ userId: z.string(), productId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.likedProduct.deleteMany({
        where: {
          userId: input.userId,
          productId: input.productId,
        },
      });
    }),
  getProductLike: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        productId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const response = await ctx.prisma.likedProduct.findMany({
        where: {
          userId: input.userId,
          productId: input.productId,
        },
      });
      if (typeof response[0] === "object") {
        return { result: "epic" };
      } else {
        return { result: "fail" };
      }
    }),

  getUserLikes: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.likedProduct.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          product: {
            select: {
              name: true,
              imageURL: true,
              price: true,
              id: true,
            },
          },
        },
      });
    }),
});
