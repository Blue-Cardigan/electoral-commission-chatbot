'use client'

import React, { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid/index.js';
import { Title, SidebarContent } from './SidebarContent';

export const Sidebar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b px-4 py-3 flex justify-between items-center shadow-sm">
        <Title />
        <button
          onClick={handleSidebarToggle}
          className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-ec-blue-900/20 rounded p-1"
          aria-label="Toggle navigation"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen w-64 bg-ec-blue-900 text-white 
        transition-all duration-300 ease-in-out shadow-xl
        lg:translate-x-0 lg:static lg:h-full lg:min-h-screen
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        z-30 lg:z-10
      `}>
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="px-6 py-8">
            <SidebarContent />
          </div>
        </div>
      </aside>

      {/* Mobile overlay with fade effect */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-20 lg:hidden"
          onClick={handleSidebarToggle}
          aria-hidden="true"
        />
      )}
    </>
  );
};
