import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { productRouter } from "./routers/products";
import { likerouter } from "./routers/likes";
import { reviewrouter } from "./routers/reviews";
import { cartrouter } from "./routers/cart";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter, 
  products: productRouter,
  likes: likerouter,
  reviews: reviewrouter,
  cart: cartrouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
