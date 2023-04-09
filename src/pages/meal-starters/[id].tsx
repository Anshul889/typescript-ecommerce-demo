import React, { useState } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import { api } from "~/utils/api";
import NextImage from "next/image";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { Button } from "~/components/ui/Button";
import Modal from "~/components/ui/Modal";
import Listboxselect from "~/components/ui/Listboxselect";
import ReviewForm from "~/components/ReviewForm/ReviewForm";
import moment from "moment";

const itemQuantity = [1, 2, 3, 4, 5];

const Product: NextPage = () => {
  const [reviewform, toggle] = useState(true);
  const [loadingReview, setLoading] = useState(false);
  const [userLike, setUserLike] = useState(false);
  const [isCart, setCart] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(1);

  const { query } = useRouter();
  const { data: session } = useSession();
  const { data, isLoading, refetch } = api.products.getOne.useQuery(
    { id: query?.id as string },
    {
      enabled: !!query?.id,
    }
  );
  const utils = api.useContext();

  //Like functions
  const { mutate: addLike } = api.likes.addLike.useMutation({});
  const { data: checkUserLike } = api.likes.getProductLike.useQuery(
    {
      userId: session?.user?.id as string,
      productId: query?.id as string,
    },
    {
      enabled: !!session,
      onSettled: (checkUserLike) => {
        if (checkUserLike?.result === "epic") {
          setUserLike(true);
        }
        console.log("userlike", checkUserLike);
      },
    }
  );
  const { mutate: removeLike } = api.likes.removeLike.useMutation({});

  const handleAddLike = () => {
    setUserLike(true);
    addLike({
      userId: session?.user?.id as string,
      productId: query?.id as string,
    });
  };
  const handleRemoveLike = () => {
    setUserLike(false);
    if (typeof query.id === "string") {
      removeLike({ userId: session?.user?.id as string, productId: query?.id });
    }
  };

  // Review functions

  const { data: isAuthor, refetch: refetchAuthor } =
    api.reviews.getReview.useQuery(
      {
        userId: session?.user?.id as string,
        productId: query?.id as string,
      },
      {
        enabled: !!session?.user?.id,
        onSuccess: (isAuthor) => {
          console.log("author:", isAuthor.result);
        },
      }
    );
  const { mutate: deleteReview } = api.reviews.deleteReview.useMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async () => {
      toggle(true);
      await refetch();
      await refetchAuthor();
      setLoading(false);
    },
  });
  const { mutate: addReview } = api.reviews.addReview.useMutation({
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async () => {
      await refetch();
      await refetchAuthor();
      toggle(false);
      setLoading(false);
    },
  });

  //Cart Functions with optimistic updates
  const { mutate: addToCart } = api.cart.addToCart.useMutation({
    onMutate: async ({ userId, productId, quantity }) => {
      await utils.cart.getUserCart.cancel();

      utils.cart.getUserCart.setData({ userId }, (prevEntries) => {
        const product = {
          name: data?.name as string,
          imageURL: data?.imageURL as string,
          price: data?.price as number,
          id: productId,
        };
        if (prevEntries) {
          return [...prevEntries, { userId, productId, quantity, product }];
        } else {
          return prevEntries;
        }
      });
    },
    onSettled: async () => {
      await utils.cart.getUserCart.invalidate();
    },
  });

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

  const { data: isProductCart } = api.cart.getProductCart.useQuery(
    {
      userId: session?.user?.id as string,
      productId: query?.id as string,
    },
    {
      enabled: !!session,
      onSuccess: (isProductCart) => {
        if (isProductCart.result == "epic") {
          setCart(true);
        } else {
          setCart(false);
        }
      },
    }
  );

  const handleAddToCart = () => {
    setCart(true);
    addToCart({
      userId: session?.user?.id as string,
      productId: query?.id as string,
      quantity: selectedNumber,
    });
  };

  const handleRemoveFromCart = () => {
    setCart(false);
    removeFromCart({
      userId: session?.user?.id as string,
      productId: query?.id as string,
    });
  };

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
              <div className="my-4 grid grid-cols-[0.3fr_1fr] gap-6">
                <Listboxselect
                  items={itemQuantity}
                  selectedItem={selectedNumber}
                  setSelectedItem={setSelectedNumber}
                />
                <div className="my-4 font-archivo ">${data?.price}.00</div>
              </div>
              <div>
                {session && userLike && (
                  <Button fullWidth onClick={handleRemoveLike}>
                    Remove From Wishlist
                  </Button>
                )}
                {session && !userLike && (
                  <Button fullWidth onClick={handleAddLike}>
                    Add to Wishlist
                  </Button>
                )}
                {!session && (
                  <Modal
                    buttonText="Add To Wishlist"
                    title="Login To continue"
                    buttonAction="Login"
                    buttonLink="/auth/signin"
                  />
                )}
              </div>
              <div className="my-6">
                {session && isCart && (
                  <Button fullWidth onClick={handleRemoveFromCart}>
                    Remove From Cart
                  </Button>
                )}
                {session && !isCart && (
                  <Button fullWidth onClick={handleAddToCart}>
                    Add to Cart
                  </Button>
                )}
                {!session && (
                  <Modal
                    buttonText="Add To Cart"
                    title="Login To continue"
                    buttonAction="Login"
                    buttonLink="/auth/signin"
                  />
                )}
              </div>
              <div className="my-4 font-archivo ">{data?.description1}</div>
              <div className="my-4 font-archivo ">{data?.description2}</div>
            </div>
            <div className="my-6">
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="my-2 grid w-full grid-cols-[6fr_20px] border-t-[0.1px] border-solid border-neutral-500 border-opacity-50 py-2">
                      <div className="align-self-start text-start font-archivo text-xl font-bold">
                        Ingredients
                      </div>
                      <ChevronUpIcon
                        className={`${
                          open ? "rotate-180 transform" : ""
                        } mt-1 h-5 w-5 `}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="mb-4 font-archivo">
                      {data?.ingredients}
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="my-2 grid w-full grid-cols-[6fr_20px] border-t-[0.1px] border-solid border-neutral-500 border-opacity-50 py-2">
                      <div className="align-self-start text-start font-archivo text-xl font-bold">
                        Nutrition Info
                      </div>
                      <ChevronUpIcon
                        className={`${
                          open ? "rotate-180 transform" : ""
                        } mt-1 h-5 w-5 `}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="mb-4 font-archivo">
                      <div className="font-archivo">
                        Servings: {data?.servings}
                      </div>
                      <div className="font-archivo">
                        ServingSize: {data?.servingsSize}
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            </div>
          </div>
          <h2 className="mx-auto w-[90%] text-2xl font-bold">Reviews</h2>
          <div>
            {typeof data?.reviews.length === "number" &&
            data?.reviews.length > 0 ? (
              data.reviews.map((review, index) => (
                <div
                  key={index}
                  className="mx-auto my-6 grid w-[90%] grid-cols-[32px_1fr_30px] gap-4"
                >
                  <div className="overflow-hidden rounded-full h-8">
                    <NextImage
                      src={review.image}
                      alt=""
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                  <div className="opacity-75">{review.name}, {moment(review.createdAt).fromNow()}</div>
                  <div>{review.rating} stars</div>
                  <div>{review.review}</div>
                  </div>
                  {isAuthor?.result === 'epic' &&
                  (<div
                    className="text-secondary cursor-pointer underline"
                    onClick={() =>
                      deleteReview({
                        userId: session?.user.id as string,
                        productId: query.id as string,
                      })
                    }
                  >
                    delete
                  </div>)}
                </div>
              ))
            ) : (
              <div className="mx-auto w-[90%] opacity-75">No reviews yet</div>
            )}
          </div>
          <div className="my-6">
            <h2 className="mx-auto w-[90%] text-2xl font-bold">
              Submit a Review
            </h2>
            <div className="mx-auto w-[90%]">
              {session ? (
                <ReviewForm
                  userId={session.user.id}
                  productId={query.id as string}
                  addReview={addReview}
                  name={session.user.name as string}
                  image={session.user.image as string}
                />
              ) : (
                <div
                  className="cursor-pointer text-secondary underline"
                  onClick={() => void signIn()}
                >
                  Sign in to continue
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Product;
