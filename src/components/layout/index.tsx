import React from 'react';
import LoadingModal from '@/components/Overlay';
import { Sidebar } from '../Sidebar';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-200">
      <Sidebar />
      <div className="flex-grow lg:ml-64">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
      <LoadingModal />
    </div>
  );
}
