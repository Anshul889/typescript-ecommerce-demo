import React from "react";
import { api } from "~/utils/api";
import NextImage from "next/image";
import Link from "next/link";

const Index = () => {
  const { data, isSuccess, isLoading } = api.products.getAll.useQuery();
  if (isLoading) return <div>Loading...</div>;

  if (isSuccess) {
    return (
      <>
        <div className="mx-auto w-[90%]">
          <h1 className="my-6">Meal Starters</h1>
          <p>
            A meal starter is a pantry shortcut, with all the sauces, aromatics,
            and seasonings you need. Just bring your own protein + veg to the
            party!
          </p>
          <div className="my-6 grid grid-cols-1 md:grid-cols-3 md:gap-10">
            {data.map((product, index) => {
              return (
                <Link
                  href={`/meal-starters/${product.id}`}
                  className="my-4"
                  key={index}
                >
                  <div className="relative grid h-[90vw] grid-cols-1 md:h-[27vw]">
                    <NextImage
                      src={product.imageURL}
                      className="rounded-2xl"
                      fill
                      alt=""
                    />
                  </div>
                  <div className="grid grid-cols-[6fr_1fr]">
                    <div className="mt-4">{product.name}</div>
                    <div className="place-self-end">${product.price}</div>
                    <div className="place-self-end"></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </>
    );
  }
};

export default Index;
