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
  if(data) { 
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

  const handleRemoveFromCart = (id: string) => {
    removeFromCart({ userId: session?.user?.id as string, productId: id });
  };
  if (isLoading) {
    return (
      <div className="grid">
        <div className="">Loading...</div>
      </div>
    );
  } else {
    return (
      <div>
        <h1 className="mx-auto my-6 w-[90%]">Your Cart</h1>
        <div className="mx-auto grid w-[90%] grid-cols-2 border-b-[0.1px] border-neutral-500 border-opacity-50 pb-4">
          <div className="font-archivo text-[10px] font-light uppercase tracking-[0.13rem]">
            Product
          </div>
          <div className="text-right font-archivo text-[10px] font-light uppercase tracking-[0.13rem]">
            Total
          </div>
        </div>
        <div className="mx-auto w-[90%] border-b-[0.1px] border-neutral-500 border-opacity-50">
          {data?.map((product, index) => {
            return (
              <div key={index} className="my-6 grid grid-cols-3 gap-x-6">
                <div className="relative row-span-2 h-[26vw]">
                  <NextImage src={product.product.imageURL} fill alt="" />
                </div>
                <div>{product.product.name}</div>
                <div className="text-right">
                  ${product.quantity * product.product.price}.00
                </div>
                <div>{product.quantity}</div>
                <div
                  onClick={() => handleRemoveFromCart(product.productId)}
                  className="point text-right text-red-500 underline"
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
            Subtotal $
            {subtotal}.00
          </div>
        )}
        {data?.length !== 0 && (
          <div className="my-4 text-center text-sm text-[#3d081bbf]">
            Use Test Card 4242 4242 4242 4242 for succesful payment
          </div>
        )}
        {data?.length !== 0 && (
          <div className="mx-auto w-[90%]">
            <Button fullWidth>Checkout</Button>
          </div>
        )}
      </div>
    );
  }
};

export default Cart;