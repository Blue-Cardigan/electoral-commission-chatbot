import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { Disclaimers } from './ui/Disclaimers';
import { Information } from './ui/Information';
import Image from 'next/image';

const DISCLAIMERS_ACKNOWLEDGED_FLAG = 'disclaimers-acknowledged';

export default function LoadingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [disclaimersRead, setDisclaimersRead] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const disclaimersAlreadySeen = localStorage.getItem(
        DISCLAIMERS_ACKNOWLEDGED_FLAG,
      );
      setIsOpen(disclaimersAlreadySeen !== 'true');
    }
  }, []);

  const handleDisclaimerAcknowledge = () => {
    setIsOpen(false);
    localStorage.setItem(DISCLAIMERS_ACKNOWLEDGED_FLAG, 'true');
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-200 p-0 text-ec-blue-900 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg text-center font-medium leading-6 px-6 pt-6 pb-3"
                >
                  Find information faster on the Electoral Commission website:
                </Dialog.Title>
                <div className="mt-2">
                  <div className="px-6 pb-3 w-56 mx-auto">
                    <img
                      src="do-job-better.png"
                      max-width="200px"
                      width="100%"
                      height="100%"
                    />
                  </div>
                  <h2 className="px-6 pb-3">
                    Use our chatbot to do the searching for you
                  </h2>
                  <div className="bg-white p-6 pb-3">
                    <h3 className=" text-gray-500">Information</h3>
                    <Information />
                    <h3 className=" text-gray-500">Disclaimer</h3>
                    <Disclaimers />
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          id="candidates"
                          name="candidates"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          onClick={() => setDisclaimersRead(!disclaimersRead)}
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label
                          htmlFor="candidates"
                          className="font-medium text-gray-900"
                        >
                          I have read and acknowledge the disclaimers
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center bg-white p-6 pt-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-200 disabled:text-gray-500"
                    onClick={handleDisclaimerAcknowledge}
                    disabled={!disclaimersRead}
                  >
                    Get started!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
