'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, CheckSquare, Bell, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useApp } from '@/lib/store/AppContext';
import { logoutAction } from '@/lib/actions/auth';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
    router.push('/auth/login');
    router.refresh();
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/orders', label: 'My tasks', icon: CheckSquare },
    { href: '/notifications', label: 'Notifications', icon: Bell },
  ];

  // Helper to determine active state
  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href === '/orders' && pathname.startsWith('/orders')) return true;
    if (href === '/notifications' && pathname.startsWith('/notifications')) return true;
    return false;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between border-r border-neutral-900 bg-[#13121a] py-6 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section: Logo & Branding */}
        <div className="w-full px-4 mb-6">
          <Link href="/dashboard" className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-[#1c1b22] transition-colors group">
            <div className="flex items-center gap-3">
              {/* Custom Purple Checkmark Squircle Logo */}
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shadow-md shadow-violet-600/30">
                <svg
                  className="h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-base font-extrabold tracking-tight text-white font-sans">
                Taskbito
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-neutral-400 group-hover:text-white transition-colors shrink-0" />
          </Link>
        </div>

        {/* Middle Section: Navigation Items */}
        <nav className="flex-1 w-full space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-xs ${
                  active
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
                    : 'text-neutral-400 hover:bg-[#1c1b22] hover:text-white'
                }`}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                <span className="font-semibold tracking-wide font-sans">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section: Profile Account and Popover */}
        <div className="border-t border-neutral-900/60 p-4 w-full">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex w-full items-center gap-3 rounded-xl p-2 hover:bg-[#1c1b22] transition-all text-left focus:outline-none"
              title="User Account"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover shrink-0 border border-neutral-800"
              />
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-neutral-400 truncate">{user.company}</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-neutral-500 shrink-0" />
            </button>

            {/* Profile Dropdown Popup */}
            {showProfileMenu && (
              <>
                {/* Click overlay to close menu */}
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setShowProfileMenu(false)}
                />
                
                <div className="absolute bottom-14 left-0 z-50 w-full rounded-xl border border-neutral-800 bg-[#13121a] p-3 text-xs shadow-2xl text-white space-y-2.5 animate-fade-in">
                  <div className="space-y-0.5 border-b border-neutral-900 pb-2">
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-[10px] text-neutral-400 font-semibold">{user.company}</p>
                    <p className="text-[9px] text-neutral-500 font-medium truncate">{user.email}</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    {/* Settings Item */}
                    <Link
                      href="/settings"
                      onClick={() => {
                        setShowProfileMenu(false);
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-neutral-400 hover:bg-[#1c1b22] hover:text-white transition-colors"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      <span>Settings</span>
                    </Link>

                    {/* Sign Out Item */}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-neutral-400 hover:bg-[#1c1b22] hover:text-red-400 transition-colors text-left font-semibold"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
