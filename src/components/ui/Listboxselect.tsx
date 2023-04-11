import React, { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

type Props = {
  selectedItem: number;
  setSelectedItem: React.Dispatch<React.SetStateAction<number>>;
  items: number[];
};

const Listboxselect = ({ selectedItem, setSelectedItem, items }: Props) => {
  return (
    <Listbox value={selectedItem} onChange={setSelectedItem} >
      <Listbox.Button className="relative h-10 w-14 cursor-default rounded-lg bg-white py-1 mt-2  pr-6 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
        <span className="block truncate bg-white text-center">{selectedItem}</span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </Listbox.Button>
      <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-14 max-h-60 overflow-auto rounded-md bg-primary py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {items.map((item, itemIdx) => (
                <Listbox.Option
                  key={itemIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-8 pr-4 ${
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {item}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
    </Listbox>
  );
};

export default Listboxselect;
