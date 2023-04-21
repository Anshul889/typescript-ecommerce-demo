/* eslint-disable */

import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(publishableKey as string);

type CartItem = {
  id: string;
  quantity: number;
  name: string;
  price: number;
  imageURL: string;
  description1: string;
}

const createCheckOutSession = async (items: CartItem[]) => {
  const stripe = await stripePromise;
  const checkoutSession = await axios.post("/api/create-stripe-session", {
    items,
  });
  if (stripe) {
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession.data.id
    });
    if (result.error) {
      alert(result.error.message);
    }
  }
};

export default createCheckOutSession;
