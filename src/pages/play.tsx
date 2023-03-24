import React, { useState, Fragment } from "react";
import { Dialog, Transition, Combobox } from "@headlessui/react";

const Play = () => {
  const [selectedPeople, setSelectedPeople] = useState([]);
  return (
    <>
      <div className="grid grid-cols-4 gap-4 p-4 m-4">
        <div className="border border-black text-center h-10">bench</div>
        <div className=" border border-black bg-blue-500"></div>
        <div className="border border-black"></div>
        <div className="border border-black"></div>
        <div className=""></div>
      </div>
    </>
  );
};

export default Play;
