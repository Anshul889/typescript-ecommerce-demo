import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import {env} from "../env.mjs"
const publishableKey = env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(publishableKey);

type CartItem = {
  id: string;
  quantity: number;
  name: string;
  price: number;
  imageURL: string;
  description1: string;
}

interface Checkout {
  id: string;
}

const createCheckOutSession = async (items: CartItem[]) => {
  const stripe = await stripePromise;
  const checkoutSession = await axios.post<Checkout>("/api/create-stripe-session", {
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
