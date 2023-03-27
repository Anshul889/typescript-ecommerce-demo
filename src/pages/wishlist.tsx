import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
import NextImage from "next/image";

const Wishlist = () => {
  const utils = api.useContext();
  const { data: session } = useSession();

  const { data, isLoading } = api.likes.getUserLikes.useQuery(
    {
      userId: session?.user?.id as string,
    },
    {
      enabled: !!session,
    }
  );

  const { mutate: removeLike } = api.likes.removeLike.useMutation({
    onMutate: async ({ userId, productId }) => {
      await utils.likes.getUserLikes.cancel();
      utils.likes.getUserLikes.setData({ userId }, (prevEntries) => {
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

  const handleRemoveLike = (id: string) => {
    removeLike({ userId: session?.user?.id as string, productId: id });
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      {data?.map((product, index) => {
        return (
          <div key={index} className="grid grid-cols-[1fr_1fr_0.3fr] gap-4 w-[90%] mx-auto my-6">
            <div className="relative h-36">
              <NextImage src={product.product.imageURL} fill alt="" />
            </div>
            <div>{product.product.name}</div>
            <div
              className="text-red-500 underline cursor-pointer"
              onClick={() => handleRemoveLike(product.product.id)}
            >
              remove
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Wishlist;
