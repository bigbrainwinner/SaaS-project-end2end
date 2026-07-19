'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { useApp } from '@/lib/store/AppContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoading } = useApp();

  return (
    <div className="min-h-screen bg-[#f9fafb] text-neutral-800 relative">
      <div 
        className={`transition-opacity duration-700 ease-in-out ${
          isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Sidebar - fixed left */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main Content Area - pushed right by the sidebar on large screens */}
        <div className="flex flex-col min-h-screen lg:pl-64">
          {/* TopBar */}
          <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

          {/* Dynamic page contents */}
          <main className="flex-1 p-6 lg:p-10">
            {children}
          </main>
        </div>
      </div>


    </div>
  );
}
