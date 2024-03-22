import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
import NextImage from "next/image";
import { Button } from "~/components/ui/Button";
import createCheckoutSession from "~/utils/checkout-session";
import { type NextPage } from "next";
import Link from "next/link";

const Cart: NextPage = () => {
  type CartItem = {
    name: string;
    price: number;
    imageURL: string;
    id: string;
    description1: string;
    quantity: number;
  };
  const { data: session } = useSession();

  const { data, isLoading, isSuccess } = api.cart.getUserCart.useQuery(
    {
      userId: session?.user?.id as string,
    },
    {
      enabled: !!session,
    }
  );
  const utils = api.useContext();
  let subtotal;
  if (data) {
    subtotal = data.reduce((acc, curr) => {
      return acc + curr.quantity * curr.product.price;
    }, 0);
  }

  const { mutate: removeFromCart } = api.cart.removeFromCart.useMutation({
    onMutate: async ({ userId, productId }) => {
      await utils.cart.getUserCart.cancel();
      utils.cart.getUserCart.setData({ userId }, (prevEntries) => {
        if (prevEntries) {
          return [
            ...prevEntries.filter((product) => product.productId !== productId),
          ];
        } else {
          return prevEntries;
        }
      });
    },
    onSettled: async () => {
      await utils.cart.getUserCart.invalidate();
    },
  });

  const { mutate: incrementQuantity } = api.cart.increaseQuantity.useMutation({
    onMutate: async ({ userId, productId, quantity }) => {
      await utils.cart.getUserCart.cancel();
      const response = utils.cart.getUserCart.getData({ userId });
      if (typeof response === "undefined") {
        return;
      } else {
        const itemIdx = response.findIndex(
          (item) => item.productId === productId
        );
        const item = response[itemIdx];
        if (item) {
          const product = {
            name: item.product.name,
            price: item.product.price,
            imageURL: item.product.imageURL,
            id: item.productId,
            description1: item.product.description1,
          };
          response[itemIdx] = {
            product,

            quantity: quantity + 1,
            userId: userId,
            productId: productId,
          };
          utils.cart.getUserCart.setData({ userId }, (prevEntries) => {
            if (prevEntries) {
              return [...response];
            } else {
              return prevEntries;
            }
          });
        }
      }
    },
    onSettled: async () => {
      await utils.cart.getUserCart.invalidate();
    },
  });

  const { mutate: decrementQuantity } = api.cart.decreaseQuantity.useMutation({
    onMutate: async ({ userId, productId, quantity }) => {
      await utils.cart.getUserCart.cancel();
      const response = utils.cart.getUserCart.getData({ userId });
      if (!response) {
        return;
      } else {
        const itemIdx = response.findIndex(
          (item) => item.productId === productId
        );
        const item = response[itemIdx];
        if (item) {
          const product = {
            name: item.product.name,
            price: item.product.price,
            imageURL: item.product.imageURL,
            id: item.productId,
            description1: item.product.description1,
          };
          response[itemIdx] = {
            product,
            quantity: quantity - 1,
            userId: userId,
            productId: productId,
          };
          utils.cart.getUserCart.setData({ userId }, (prevEntries) => {
            if (prevEntries) {
              return [...response];
            } else {
              return prevEntries;
            }
          });
        }
      }
    },
    onSettled: async () => {
      await utils.cart.getUserCart.invalidate();
    },
  });

  const handleRemoveFromCart = (id: string) => {
    removeFromCart({ userId: session?.user?.id as string, productId: id });
  };

  const handleIncrement = (id: string, quantity: number) => {
    if (session) {
      incrementQuantity({
        userId: session.user.id,
        productId: id,
        quantity,
      });
    }
  };

  const handleDecrement = (id: string, quantity: number) => {
    if (session) {
      decrementQuantity({
        userId: session.user.id,
        productId: id,
        quantity,
      });
    }
  };

  const cartItems: CartItem[] = [];
  if (data) {
    //create loop over data and create cart items
    for (let i = 0; i < data.length; i++) {
      cartItems.push({
        name: data[i]?.product.name as string,
        price: data[i]?.product.price as number,
        imageURL: data[i]?.product.imageURL as string,
        id: data[i]?.productId as string,
        description1: data[i]?.product.description1 as string,
        quantity: data[i]?.quantity as number,
      });
    }
  }

  if (isLoading && session) {
    return (
      <div className="grid h-[90vh] grid-cols-1">
        <h1 className="place-self-center">Loading...</h1>
      </div>
    );
  } else if (!session) {
    return (
      <div className="mx-auto grid h-[90vh] w-[90%] grid-cols-1">
        <h1 className="place-self-center">Please login to view your cart</h1>
      </div>
    );
  } else {
    return (
      <div className="md: max-w-6xl md:mx-auto">
        <h1 className="mx-auto my-6 w-[90%]">Your Cart</h1>
        <div className="mx-auto grid w-[90%] grid-cols-2 border-b-[0.1px] border-neutral-500 border-opacity-50 pb-4 md:grid-cols-3">
          <div className="font-archivo text-[10px] font-light uppercase tracking-[0.13rem]">
            Product
          </div>
          <div className="hidden font-archivo text-[10px] font-light uppercase tracking-[0.13rem] md:block  md:text-right">
            Quantity
          </div>
          <div className="text-right font-archivo text-[10px] font-light uppercase tracking-[0.13rem]">
            Total
          </div>
        </div>
        <div className="mx-auto w-[90%] border-b-[0.1px] border-neutral-500 border-opacity-50">
          {data?.map((product, index) => {
            return (
              <div
                key={index}
                className="md:grid-row-[] my-6 grid grid-cols-[1fr_1.5fr_max-content] gap-x-4 md:grid-cols-[0.3fr_0.9fr_0.3fr_0.3fr_0.3fr]"
              >
                <Link
                  href={`/meal-starters/${product.productId}`}
                  className="relative row-span-2 aspect-square"
                >
                  <NextImage src={product.product.imageURL} fill alt="" />
                </Link>
                <Link href={`/meal-starters/${product.productId}`}>
                  {product.product.name}
                </Link>
                <div className="text-right md:col-start-5">
                  ${product.quantity * product.product.price}.00
                </div>
                <div className="text-xl md:col-start-3 md:row-start-1 md:text-center md:text-2xl">
                  {product.quantity > 1 && (
                    <button
                      className="mx-2 md:mx-3"
                      onClick={() =>
                        handleDecrement(product.productId, product.quantity)
                      }
                    >
                      -
                    </button>
                  )}
                  <span className="mx-2 md:mx-3">{product.quantity}</span>
                  <button
                    className="mx-2 md:mx-3"
                    onClick={() =>
                      handleIncrement(product.productId, product.quantity)
                    }
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(product.productId)}
                  className="point cursor-pointer text-right text-red-500 underline md:col-start-4 md:row-start-1"
                >
                  remove
                </button>
              </div>
            );
          })}
          {data?.length == 0 && (
            <div className="my-6 text-center text-xl font-bold">
              Your cart is empty
            </div>
          )}
        </div>
        {data?.length !== 0 && (
          <div className="mx-auto my-6 w-[90%]">
            <div className="">Order Special Instructions</div>
            <textarea className="my-6 h-32 w-full rounded-[12px_12px_0_12px] border-[3px] border-black p-4" />
          </div>
        )}
        {data?.length !== 0 && (
          <div className="text-center text-xl font-bold">
            Subtotal ${subtotal}.00
          </div>
        )}
        {data?.length !== 0 && (
          <div className="my-4 text-center text-sm text-[#3d081bbf]">
            Use Test Card 4242 4242 4242 4242 for succesful payment
          </div>
        )}
        {data?.length !== 0 && data !== undefined && (
          <div className="mx-auto my-6 w-[90%] md:w-44">
            <Button fullWidth onClick={() => createCheckoutSession(cartItems)}>
              Checkout
            </Button>
          </div>
        )}
      </div>
    );
  }
};

export default Cart;
