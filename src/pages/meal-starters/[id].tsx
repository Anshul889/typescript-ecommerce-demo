import React, { useState } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import NextImage from "next/image";
import Image from "next/image";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";

const Product: NextPage = () => {
  const [reviewform, toggle] = useState(true);
  const [loadingReview, setLoading] = useState(false);
  const [userLike, setUserLike] = useState(false);
  const [isCart, setCart] = useState(false);

  const { query } = useRouter();
  const { data: session } = useSession();
  const { data, isLoading, refetch } = api.products.getOne.useQuery(
    { id: query?.id },
    {
      enabled: !!query?.id,
    }
  );
  const utils = api.useContext();

  //Like functions
  // const { mutate: addLike } = api.likes.addLike.useMutation({});
  //   const { data: checkUserLike } = api.likes.getProductLike.useQuery(
  //     {
  //       userId: session?.user?.id,
  //       productId: query?.id,
  //     },
  //     {
  //       enabled: !!session,
  //       onSettled: (checkUserLike) => {
  //         if (checkUserLike?.result === "epic") {
  //           setUserLike(true);
  //         }
  //         console.log("userlike", checkUserLike);
  //       },
  //     }
  //   );
  // const { mutate: removeLike } = api.likes.removeLike.useMutation({});

  // const handleAddLike = () => {
  //   setUserLike(true);
  //   if (typeof query.id === "string") {
  //     addLike({ userId: session?.user?.id, productId: query?.id });
  //   }
  // };
  // const handleRemoveLike = () => {
  //   setUserLike(false);
  //   if (typeof query.id === "string") {
  //     removeLike({ userId: session?.user?.id, productId: query?.id });
  //   }
  // };

  //Review functions
  // if (typeof query.id === "string" && typeof session?.user.id === "string") {
  //   const { data: isAuthor, refetch: refetchAuthor } =
  //     api.reviews.getReview.useQuery(
  //       {
  //         userId: session?.user?.id,
  //         productId: query?.id,
  //       },
  //       {
  //         enabled: !!session,
  //         onSuccess: (isAuthor) => {
  //           console.log("author:", isAuthor.result);
  //         },
  //       }
  //     );
  // }
  // const { mutate: deleteReview } = api.reviews.deleteReview.useMutation({
  //   onMutate: () => {
  //     setLoading(true);
  //   },
  //   onSuccess: async () => {
  //     toggle(true);
  //     await refetch();
  //     await refetch;
  //     setLoading(false);
  //   },
  // });
  // const { mutate: addReview } = api.reviews.addReview.useMutation({
  //   onMutate: () => {
  //     setLoading(true);
  //   },
  //   onSuccess: async () => {
  //     await refetch();
  //     await refetchAuthor();
  //     toggle(false);
  //     setLoading(false);
  //   },
  // });

  //Cart Functions with optimistic updates

  // const { mutate: addToCart } = api.cart.addToCart.useMutation({
  //   onMutate: async ({ userId, productId }) => {
  //     await utils.cart.getUserCart.cancel();
  //     utils.cart.getUserCart.setData({ userId }, (prevEntries: any) => {
  //       const item = {
  //         name: data?.name || "",
  //         imageURL: data?.imageURL || "",
  //         price: data?.price || 0,
  //         id: (productId as string) || "",
  //       };
  //       if (prevEntries) {
  //         return [...prevEntries, { userId, productId, item, quantity: 1 }];
  //       } else {
  //         return prevEntries;
  //       }
  //     });
  //   },
  //   onSettled: async () => {
  //     await utils.cart.getUserCart.invalidate();
  //   },
  // });

  // const { mutate: removeFromCart } = api.cart.removeFromCart.useMutation({
  //   onMutate: async ({ userId, productId }) => {
  //     await utils.cart.getUserCart.cancel();
  //     utils.cart.getUserCart.setData({ userId }, (prevEntries) => {
  //       if (prevEntries) {
  //         return [
  //           ...prevEntries.filter((product) => product.productId !== productId),
  //         ];
  //       } else {
  //         return prevEntries;
  //       }
  //     });
  //   },
  //   onSettled: async () => {
  //     await utils.cart.getUserCart.invalidate();
  //   },
  // });

  // if (typeof query.id === "string" && typeof session?.user.id === "string") {
  //   const { data: isProductCart } = api.cart.getProductCart.useQuery(
  //     {
  //       userId: session?.user?.id,
  //       productId: query?.id,
  //     },
  //     {
  //       enabled: !!session,
  //       onSuccess: (isProductCart) => {
  //         if (isProductCart.result == "epic") {
  //           setCart(true);
  //         } else {
  //           setCart(false);
  //         }
  //       },
  //     }
  //   );
  // }

  // const handleAddToCart = () => {
  //   setCart(true);
  //   addToCart({ userId: session?.user?.id, productId: query?.id, quantity: 1 });
  // };

  // const handleRemoveFromCart = () => {
  //   setCart(false);
  //   if (typeof query.id === "string") {
  //     removeFromCart({ userId: session?.user?.id, productId: query?.id });
  //   }
  // };
  if (isLoading) {
    return (
      <div className="grid h-[90vh] grid-cols-1 place-content-center">
        <h1 className="mx-auto">Loading...</h1>
      </div>
    );
  } else {
    return (
      <div className="mt-6">
        <div>
          <div className="scrollbar-hide grid grid-cols-[2px_repeat(4,80%)_2px] gap-6 overflow-scroll">
            <div></div>
            <div className="relative h-[80vw] w-full">
              <NextImage src={data?.imageURL || ""} alt="" fill />
            </div>
            <div className="relative h-[80vw] w-full">
              <NextImage src={data?.imageURL2 || ""} alt="" fill />
            </div>
            <div className="relative h-[80vw] w-full">
              <NextImage src={data?.imageURL3 || ""} alt="" fill />
            </div>
            <div className="relative h-[80vw] w-full">
              <NextImage src={data?.imageURL4 || ""} alt="" fill />
            </div>
            <div></div>
          </div>
          <div className="mx-auto my-6 w-[90%]">
            <div>
              <h1>{data?.name}</h1>
              <div className="my-2 font-archivo ">${data?.price}.00</div>
              <div className="my-2 font-archivo ">{data?.description1}</div>
              <div className="my-2 font-archivo ">{data?.description2}</div>
            </div>
            <div className="my-6">
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="my-2 grid w-full grid-cols-[6fr_20px] border-opacity-50 border-t-[0.1px] border-solid border-neutral-500 py-2">
                      <div className="align-self-start text-start font-archivo text-xl font-bold">
                        Ingredients
                      </div>
                      <ChevronUpIcon
                        className={`${
                          open ? "rotate-180 transform" : ""
                        } mt-1 h-5 w-5 `}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="font-archivo mb-4">
                      {data?.ingredients}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="my-2 grid-cols-[6fr_20px] grid w-full border-t-[0.1px] border-solid border-neutral-500 border-opacity-50 py-2">
                      <div className="align-self-start text-start font-archivo text-xl font-bold">
                        Nutrition Info
                      </div>
                      <ChevronUpIcon
                        className={`${
                          open ? "rotate-180 transform" : ""
                        } mt-1 h-5 w-5 `}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="font-archivo mb-4">
                      <div className="font-archivo">Servings: {data?.servings}</div>
                      <div className="font-archivo">ServingSize: {data?.servingsSize}</div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Product;
