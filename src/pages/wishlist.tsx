import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";
import NextImage from "next/image";
import Link from "next/link";

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

  if (isLoading) return <div className="py-10 w-[80%] mx-auto">Loading...</div>;
  return (
    <div>
      {data?.map((product, index) => {
        return (
          <div
            key={index}
            className="mx-auto my-6 grid w-[90%] grid-cols-[1fr_1fr_0.3fr] lg:grid-cols-[0.3fr_1fr_0.3fr] lg:w-[80%] gap-4"
          >
            <Link href={`meal-starters/${product.productId}`}>
              <div className="relative h-36 lg:h-[210px]">
                <NextImage src={product.product.imageURL} fill alt="" />
              </div>
            </Link>
            <Link className='h-[20px]'href={`meal-starters/${product.productId}`}>
              <div className="self-start ">{product.product.name}</div>
            </Link>
            <button
              className="cursor-pointer self-start text-red-500 underline"
              onClick={() => handleRemoveLike(product.product.id)}
            >
              remove
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Wishlist;
