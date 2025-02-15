import { XMarkIcon } from "@heroicons/react/20/solid";
import { signOut } from "next-auth/react";
import { Title } from "../Title";

type Props = {
  userName: string;
  isOpen: boolean;
  switchIsOpen: () => void;
};

export const Sidebar: React.FC<Props> = ({
  userName,
  isOpen,
  switchIsOpen,
}) => {
  return (
    <>
      <div
        className={`${
          isOpen ? "translate-x-0" : "translate-x-[-100vw]"
        } absolute z-10 flex h-screen w-screen flex-col justify-between bg-gradient-to-b from-blue-900 to-gray-900 p-8 transition-all lg:static lg:w-[300px] lg:translate-x-0`}
      >
        <header className="flex items-center justify-between lg:justify-center">
          <button onClick={() => switchIsOpen()} className="lg:hidden">
            <XMarkIcon className="flex h-8 w-8" />
          </button>
          <Title className="text-center" />
        </header>

        <div className="flex flex-col border-t-4 border-blue-800 p-2 pt-4">
          <span>
            Hi, <strong>{userName}</strong>!
          </span>

          <button
            onClick={() => signOut()}
            className="mt-4 flex items-center justify-center rounded-lg bg-red-400 p-2 py-3 text-sm font-semibold"
          >
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};
