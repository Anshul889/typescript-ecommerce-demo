import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
import NextImage from "next/image";
import { Button } from "~/components/ui/Button";
import { type NextPage } from "next";

const Cart: NextPage = () => {
  const { data: session } = useSession();

  const { data, isLoading } = api.cart.getUserCart.useQuery(
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
      if (!response) {
        return;
      } else {
        const itemIdx = response.findIndex(
          (item) => item.productId === productId
        );
        const item = response[itemIdx];
        const product = {
          name: item?.product.name as string,
          price: item?.product.price as number,
          imageURL: item?.product.imageURL as string,
          id: item?.productId as string,
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
        const product = {
          name: item?.product.name as string,
          price: item?.product.price as number,
          imageURL: item?.product.imageURL as string,
          id: item?.productId as string,
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
    },
    onSettled: async () => {
      await utils.cart.getUserCart.invalidate();
    },
  });

  const handleRemoveFromCart = (id: string) => {
    removeFromCart({ userId: session?.user?.id as string, productId: id });
  };

  const handleIncrement = (id: string, quantity: number) => {
    incrementQuantity({
      userId: session?.user?.id as string,
      productId: id,
      quantity,
    });
  };

  const handleDecrement = (id: string, quantity: number) => {
    decrementQuantity({
      userId: session?.user?.id as string,
      productId: id,
      quantity,
    });
  };

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
                <div className="relative row-span-2 aspect-square">
                  <NextImage src={product.product.imageURL} fill alt="" />
                </div>
                <div>{product.product.name}</div>
                <div className="text-right md:col-start-5">
                  ${product.quantity * product.product.price}.00
                </div>
                <div className="text-xl md:col-start-3 md:row-start-1 md:text-center md:text-2xl">
                  {product.quantity > 1 && (
                    <span
                      className="mx-2 md:mx-3"
                      onClick={() =>
                        handleDecrement(product.productId, product.quantity)
                      }
                    >
                      -
                    </span>
                  )}
                  <span className="mx-2 md:mx-3">{product.quantity}</span>
                  <span
                    className="mx-2 md:mx-3"
                    onClick={() =>
                      handleIncrement(product.productId, product.quantity)
                    }
                  >
                    +
                  </span>
                </div>
                <div
                  onClick={() => handleRemoveFromCart(product.productId)}
                  className="point cursor-pointer text-right text-red-500 underline md:col-start-4 md:row-start-1"
                >
                  remove
                </div>
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
        {data?.length !== 0 && (
          <div className="mx-auto my-6 w-[90%] md:w-44">
            <Button fullWidth>Checkout</Button>
          </div>
        )}
      </div>
    );
  }
};

export default Cart;
