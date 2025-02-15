import { Dialog, Switch, Transition } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import type { Habit } from "@prisma/client";
import { useSession } from "next-auth/react";
import type { FormEvent } from "react";
import { Fragment, useState } from "react";
import { toast } from "react-hot-toast";
import { trpc } from "../../utils/trpc";

const frequencyOptions = [
  { value: "Mon", label: "Monday" },
  { value: "Tue", label: "Tuesday" },
  { value: "Wed", label: "Wednesday" },
  { value: "Thu", label: "Thursday" },
  { value: "Fri", label: "Friday" },
  { value: "Sat", label: "Saturday" },
  { value: "Sun", label: "Sunday" },
];

export const AddNewHabit: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [habit, setHabit] = useState({
    title: "",
    frequency: [] as string[],
  });
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "";

  const handleCloseForm = () => {
    setIsOpen(false);
    setHabit({ title: "", frequency: [] });
  };

  const trpcUtils = trpc.useContext();
  const { mutate } = trpc.habit.create.useMutation({
    onSuccess: (habitCreated) => {
      trpcUtils.habit.getAll.setData({ userId }, (data) => [
        ...(data || []),
        habitCreated,
      ]);
      handleCloseForm();
      toast.success("Habit created successfully!");
    },
    onError: (err) => {
      toast.error("Habit creation failed!");
      console.log("An error happened: ", err);
    },
  });

  const onChange =
    (name: keyof Habit) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setHabit({ ...habit, [name]: e.target.value });
    };

  const onFrequencyChange = (option: string) => {
    setHabit((h) => ({
      ...h,
      frequency: h.frequency.includes(option)
        ? h.frequency.filter((f) => f !== option)
        : [...h.frequency, option],
    }));
  };

  const handleCreateHabit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const habitToCreate = {
      title: habit.title,
      frequency: habit.frequency.join(","),
      userId,
    };

    mutate(habitToCreate);
  };

  return (
    <>
      <button
        className="w-fit justify-center rounded-md border-2 border-blue-900 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2"
        onClick={() => setIsOpen(true)}
      >
        + Add new habit
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={handleCloseForm}>
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

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-800 p-6 text-left align-middle shadow-xl transition-all">
                  <header className="flex items-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-bold text-white"
                    >
                      Create habit
                    </Dialog.Title>
                    <button onClick={() => handleCloseForm()}>
                      <XMarkIcon className="h-8 w-8 text-neutral-400" />
                    </button>
                  </header>

                  <form onSubmit={handleCreateHabit}>
                    <div className="mt-6 flex flex-col gap-6">
                      <div>
                        <label
                          className="mb-2 block w-fit pr-4 font-semibold text-neutral-100"
                          htmlFor="title"
                        >
                          Title
                        </label>
                        <input
                          className="w-full appearance-none rounded border-2 border-transparent bg-neutral-600 py-2 px-4 leading-tight text-neutral-100 placeholder:text-neutral-300 focus:border-neutral-800 focus:outline-none"
                          id="title"
                          type="text"
                          placeholder="My habit"
                          onChange={onChange("title")}
                          value={habit.title}
                        />
                      </div>
                      <div>
                        <label className="mb-2 block pr-4 font-semibold text-neutral-100">
                          Frequency
                        </label>
                        <div className="flex flex-col gap-2">
                          {frequencyOptions.map((option) => {
                            const checked = habit.frequency.includes(
                              option.value
                            );
                            return (
                              <div
                                key={option.value}
                                className="flex items-center gap-2"
                              >
                                <Switch
                                  checked={checked}
                                  onChange={() =>
                                    onFrequencyChange(option.value)
                                  }
                                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 transition-colors focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75 ${
                                    checked
                                      ? "border-green-500 bg-green-500"
                                      : "border-neutral-600 bg-transparent"
                                  }`}
                                >
                                  <CheckIcon
                                    className={`h-5 w-5 text-white transition-all ${
                                      !checked && "opacity-0"
                                    }`}
                                  />
                                </Switch>
                                <span className="text-neutral-100">
                                  {option.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="mt-6 w-full rounded-md border border-transparent bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500  focus-visible:ring-offset-2"
                    >
                      Create
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
