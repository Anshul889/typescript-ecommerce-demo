import { useSession } from "next-auth/react";
import React from "react";
import { api } from "~/utils/api";

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
  return (
    <div>
      <div className="grid grid-cols-3">
        {data?.map((product, index) => {
          return <div key={index}>{product.product.name}</div>;
        })}
      </div>
    </div>
  );
};

export default Cart;
