import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Button } from "./Button";
import { signIn, signOut } from "next-auth/react";

type ModalProps = {
  buttonText: string;
  title: string;
  description?: string;
  buttonAction: string;
  buttonLink?: string;
};

const Modal = ({
  buttonText,
  title,
  description,
  buttonAction,
  buttonLink,
}: ModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="">
        <Button fullWidth onClick={openModal}>{buttonText}</Button>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto bg-black/80">
            <div className="flex min-h-full items-center justify-center p-4 bg-opacity-25 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-primary p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  {description && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{description}</p>
                    </div>
                  )}

                  <div className="mt-4">
                    {buttonLink ? (
                      <Button  onClick={() => void signIn()}>{buttonAction}</Button>
                    ) : (
                      <Button onClick={() => void signOut()}>Logout</Button>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
