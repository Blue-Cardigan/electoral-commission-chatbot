import React, { useState } from 'react';
import {
  Bars3Icon,
} from '@heroicons/react/24/solid';

export const Sidebar: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSidebarToggle = () => {
    setShowSidebar(!showSidebar);
  };
  return (
    <>
      <div className="lg:ps-64 bg-white border-y px-4 sm:px-6 md:px-8 flex">
        <SidebarToggle onToggle={handleSidebarToggle} />
        <div className='flex flex-col pl-3'>
            <div className="pt-3">The EC Doc (Unofficial) Chatbot Search</div>
            <div className="text-xs pb-2">
            A <a href="https://www.campaignlab.uk">Campaign Lab</a> project
            </div>
        </div>
      </div>
      <div
        id="application-sidebar"
        className={`fixed ${
          showSidebar ? '' : 'hidden lg:block'
        } top-0 start-0 bottom-0 lg:z-0 z-[60] w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto end-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 lg:block`}
      >
        <button
          onClick={handleSidebarToggle}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 lg:hidden"
        >
          ✕
        </button>
        <div className="px-6 h-full">{children}</div>
      </div>
    </>
  );
};

const SidebarToggle: React.FC<{ onToggle: () => void }> = ({ onToggle }) => (
  <div className="flex items-center py-4">
    <button
      type="button"
      className="text-gray-500 hover:text-gray-600 lg:hidden"
      data-hs-overlay="#application-sidebar"
      aria-controls="application-sidebar"
      aria-label="Toggle navigation"
      onClick={onToggle}
    >
      <span className="sr-only">Toggle Navigation</span>
      <Bars3Icon className="flex-shrink-0 w-6 h-6" />
    </button>
  </div>
);