import React from 'react';
import LoadingModal from '@/components/Popover';
import { Sidebar } from '@/components/Sidebar';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex bg-slate-200 w-full">
      <Sidebar />
      <div className="flex-grow lg:ml-64">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <div className="mx-auto py-8">
            {children}
          </div>
        </main>
      </div>
      <LoadingModal />
    </div>
  );
}
