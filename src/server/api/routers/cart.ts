import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "../trpc";

export const cartrouter = createTRPCRouter({
  addToCart: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        productId: z.string(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.cart.create({
        data: {
          userId: input.userId,
          productId: input.productId,
          quantity: input.quantity,
        },
      });
    }),
  getProductCart: protectedProcedure
    .input(z.object({ userId: z.string(), productId: z.string() }))
    .query(async ({ input, ctx }) => {
      const response = await ctx.prisma.cart.findMany({
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
  removeFromCart: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        productId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (typeof input.userId === "string") {
        return await ctx.prisma.cart.deleteMany({
          where: {
            userId: input.userId,
            productId: input.productId,
          },
        });
      }
    }),
  increaseQuantity: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        productId: z.string(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.cart.updateMany({
        where: {
          userId: input.userId,
          productId: input.productId,
        },
        data: {
          quantity: {
            increment: 1,
          },
        },
      });
    }),
  decreaseQuantity: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        productId: z.string(),
        quantity: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.cart.updateMany({
        where: {
          userId: input.userId,
          productId: input.productId,
        },
        data: {
          quantity: {
            decrement: 1,
          },
        },
      });
    }),
  getUserCart: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const response = await ctx.prisma.cart.findMany({
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
              description1: true,
            },
          },
        },
      });
      console.log(response);
      return response;
    }),
});
