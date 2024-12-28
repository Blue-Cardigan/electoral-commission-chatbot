'use client'

import React, { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid/index.js';
import { Title, SidebarContent } from './SidebarContent';

export const Sidebar: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState) {
      setShowSidebar(JSON.parse(savedState));
    }
  }, []);

  const handleSidebarToggle = () => {
    const newState = !showSidebar;
    setShowSidebar(newState);
    localStorage.setItem('sidebarState', JSON.stringify(newState));
  };

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b px-4 py-2 flex justify-between items-center">
        <Title />
        <button
          onClick={handleSidebarToggle}
          className="text-gray-500 hover:text-gray-600"
          aria-label="Toggle navigation"
          aria-expanded={showSidebar}
        >
          {showSidebar ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-ec-blue-900 text-white overflow-y-auto transition-transform duration-300 ease-in-out transform ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 z-30 lg:z-10`}
      >
        <div className="px-6 py-8 h-full">
          <SidebarContent />
        </div>
      </div>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={handleSidebarToggle}
        ></div>
      )}
    </>
  );
};
