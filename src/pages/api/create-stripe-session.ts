import { type NextApiRequest, type NextApiResponse } from "next";
import { env } from "../../env.mjs";
const stripeKey = env.STRIPE_SECRET_KEY;
import Stripe from "stripe";
const stripe = new Stripe(stripeKey, {
  apiVersion: "2022-08-01",
});

interface Item {
  id: string;
  quantity: number;
  name: string;
  price: number;
  imageURL: string;
  description1: string;
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    items: Item[];
  };
}

async function CreateStripeSession(
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) {
  const { items } = req.body;

  const redirectURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/"
      : "https://typescript-ecommerce-anshul889.vercel.app/";

  const transformedItems = [];

  for (let i = 0; i < items.length; i++) {
    transformedItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          images: [items[i]?.imageURL] as string[],
          name: items[i]?.name as string,
        },
        unit_amount: (items[i]?.price as number) * 100,
      },
      description: items[i]?.description1 as string,
      quantity: items[i]?.quantity as number,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: transformedItems,
    mode: "payment",
    success_url: redirectURL + "/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: redirectURL + "/failed",
    metadata: {
      images: items[0]?.imageURL as string,
    },
  });

  res.json({ id: session.id });
}

export default CreateStripeSession;
