import { z } from "zod";
import { protectedProcedure, publicProcedure, createTRPCRouter } from "../trpc";

export const reviewrouter = createTRPCRouter({
  addReview: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        productId: z.string(),
        rating: z.number(),
        review: z.string(),
        name: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.reviews.create({
        data: {
          userId: input.userId,
          productId: input.productId,
          rating: input.rating,
          review: input.review,
          name: input.name,
          image: input.image,
        },
      });
    }),
  getReview: publicProcedure
    .input(
      z.object({
        userId: z.any().optional(),
        productId: z.any(),
      })
    )
    .query(async ({ input, ctx }) => {
      const response = await ctx.prisma.reviews.findMany({
        where: {
          userId: input.userId,
          productId: input.productId,
        },
      });
      if (response.length === 0) {
        return { result: "fail" };
      } else {
        return { result: "epic" };
      }
    }),
  deleteReview: protectedProcedure
    .input(
      z.object({
        userId: z.any(),
        productId: z.any(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.reviews.deleteMany({
        where: {
          userId: input.userId,
          productId: input.productId,
        },
      });
    }),
});
