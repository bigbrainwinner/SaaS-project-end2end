'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f9fafb] text-neutral-800">
      {/* Sidebar - fixed left */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area - pushed right by the sidebar on large screens */}
      <div className="flex flex-col min-h-screen lg:pl-64">
        {/* TopBar */}
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Dynamic page contents */}
        <main className="flex-1 p-6 lg:p-10 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
