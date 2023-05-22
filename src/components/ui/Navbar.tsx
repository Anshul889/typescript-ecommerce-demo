import { Fragment } from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import NextImage from "next/image";
import usericon from "../../../public/user.svg";
import logo from "../../../public/Crave.webp";
import carticon from "../../../public/cart-shopping-light.svg";

function Navbar() {
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Wislist", href: "/wishlist" },
    { name: "Shop", href: "/meal-starters" },
  ];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const router = useRouter();
  const { data: session } = useSession();
  const { data: cart } = api.cart.getUserCart.useQuery(
    { userId: session?.user?.id as string },
    {
      enabled: !!session?.user?.id,
    }
  );
  return (
    <nav className="mx-auto grid max-w-7xl grid-cols-3 bg-primary p-2 sm:grid-cols-2 sm:px-6 lg:px-8 lg:py-4">
      <div className="sm:hidden">
        <Popover>
          {({ open }) => (
            <>
              <Popover.Button className="grid grid-cols-1 rounded-md p-2 text-gray-400 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-secondary">
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Popover.Button>
              <Popover.Overlay className="fixed inset-0 z-10 bg-slate-300/50 opacity-100 " />
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Popover.Panel className="absolute z-20 my-2 w-[95%] overflow-hidden rounded-xl shadow-xl ring-1 ring-secondary sm:hidden">
                  <div className="space-y-1 px-2 pb-3 pt-2 ">
                    {navigation.map((item) => (
                      <Popover.Button
                        key={item.name}
                        as={Link}
                        href={item.href}
                        className={classNames(
                          item.href === router.pathname
                            ? "bg-secondary text-white"
                            : "text-gray-800 hover:bg-lightred hover:text-white",
                          "block rounded-md px-3 py-2 text-base font-medium"
                        )}
                        aria-current={
                          item.href === router.pathname ? "page" : undefined
                        }
                      >
                        {item.name}
                      </Popover.Button>
                    ))}
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
      <div className="grid grid-cols-[max-content_1fr] place-content-center gap-x-6">
        <div className="relative  h-8 w-16 ">
          <NextImage src={logo} fill alt="" />
        </div>
        <div className="grid grid-cols-[repeat(3,80px)]">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={classNames(
                item.href === router.pathname
                  ? "font-extrabold, underline"
                  : "",
                "rounded-md px-3 py-2 font-medium hover:font-bold"
              )}
              aria-current={item.href === router.pathname ? "page" : undefined}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-[40px_40px] justify-self-end sm:gap-x-4 ">
        <Link href="/cart" className="grid self-center justify-self-end">
          <div className="relative col-span-1 col-start-1  row-span-1 row-start-1 h-7 w-7 sm:h-8 sm:w-8">
            <NextImage src={carticon as string} fill alt="" />
          </div>
          {session && (cart?.length as number) > 0 && (
            <div className="z-10  col-span-1 col-start-1 row-span-1 row-start-1 bg-transparent text-right text-xs text-secondary">
              <div className="relative left-4 bottom-1 w-4 rounded-full bg-secondary text-center text-white sm:left-5">
                {cart?.length}
              </div>
            </div>
          )}
        </Link>
        <Menu as="div" className="relative ml-3 self-center justify-self-end">
          <div>
            <Menu.Button className="flex rounded-full bg-primary text-sm focus:outline-none focus:ring-2  focus:ring-secondary">
              <span className="sr-only">Open user menu</span>
              {session ? (
                <div className="relative h-7 w-7 overflow-hidden rounded-full  sm:h-8 sm:w-8">
                  <NextImage src={session.user.image as string} fill alt="" />
                </div>
              ) : (
                <div className="relative h-7 w-7  sm:h-8 sm:w-8">
                  <NextImage src={usericon as string} fill alt="" />
                </div>
              )}
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-primary py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    Your Profile
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    Settings
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <div
                    onClick={
                      session ? () => void signOut() : () => void signIn()
                    }
                    className={classNames(
                      active ? "bg-gray-100" : "",
                      "block cursor-pointer px-4 py-2 text-sm text-gray-700"
                    )}
                  >
                    {session ? "Sign out" : "Sign in"}
                  </div>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </nav>
  );
}

export default Navbar;
