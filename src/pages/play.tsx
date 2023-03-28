import React, { useState, Fragment } from "react";
import { Dialog, Transition, Combobox } from "@headlessui/react";
import { Button } from "~/components/ui/Button";
import { useSession } from "next-auth/react";
import Modal from "~/components/ui/Modal";
import Listboxselect from "~/components/ui/Listboxselect";

const itemQuantity = [1, 2, 3, 4, 5];

const Play = () => {
  const [counter, setCounter] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState(1);
  const {data} = useSession()

  return (
    <>
      <div className="m-4 grid grid-cols-4 gap-4 p-4">
        <div className="h-10 border border-black text-center">bench</div>
        <div className=" border border-black bg-blue-500"></div>
        <div className="border border-black"></div>
        <Button onClick={() => setCounter(counter + 1)}>Click me</Button>

        <div className="border border-black">{data?.user.name}</div>
      </div>
      <Modal title="Login to continue" buttonText="Add To Wishlist" buttonAction="Login" buttonLink="/auth/signin"/>
      <Listboxselect items={itemQuantity} selectedItem={selectedNumber} setSelectedItem={setSelectedNumber}/>
    </>
  );
};

export default Play;
