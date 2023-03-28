import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
import NextImage from "next/image";

const Cart = () => {
  const { data: session } = useSession();


  const { data } = api.cart.getUserCart.useQuery(
    {
      userId: session?.user?.id as string,
    },
    {
      enabled: !!session,
    }
  );

  const utils = api.useContext();

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
  }
  return (
    <div>
      {data?.map((product, index) => {
        return (
          <div key={index} className="grid grid-cols-5 mx-auto w-[90%]">
            <div className="relative h-[25vw]">
            <NextImage src={product.product.imageURL} fill alt="" />
            </div>
            <div>{product.product.name}</div>
            <div>Quantity{product.quantity}</div>
            <div>Total{product.quantity * product.product.price}</div>
            <div onClick={() => handleRemoveFromCart(product.productId)} className="text-red-500 cursor-pointer underline">remove</div>
          </div>
        );
      })}
    </div>
  );
};

export default Cart;
