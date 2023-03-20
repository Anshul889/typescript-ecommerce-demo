import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc'

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        imageURL: true,
      },
    })
  }),
  getOne: publicProcedure.input(z.object({ id: z.any() })).query(async ({ input, ctx }) => {
    if (typeof input.id === 'string') {
      return await ctx.prisma.product.findUnique({
        where: {
          id: input.id,
        },
        include: {
          reviews: true,
        },
      })
    }
  }),
  deleteItem: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.product.delete({
        where: {
          id: input.id,
        },
      })
    }),
  updateItem: publicProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
        },
      })
    }),
})
