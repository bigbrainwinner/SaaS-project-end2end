'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, FileText, Settings, LogOut } from 'lucide-react';
import { useApp } from '@/lib/store/AppContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useApp();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/orders', label: 'Orders', icon: FileText },
  ];

  // Helper to determine active state
  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href === '/orders' && pathname.startsWith('/orders')) return true;
    return false;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-20 flex-col items-center justify-between border-r border-neutral-900 bg-black py-6 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Logo */}
        <div className="flex flex-col items-center">
          <Link href="/dashboard" className="group flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900 transition-colors hover:bg-neutral-800">
            {/* Custom SVG Red/White Monogram Logo from Screenshot */}
            <svg
              className="h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" className="text-red-500 fill-red-500" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
          </Link>
        </div>

        {/* Middle: Navigation Items */}
        <nav className="flex flex-col items-center gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                onClick={() => setIsOpen(false)}
                className={`relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 ${
                  active
                    ? 'bg-neutral-800 text-white shadow-md'
                    : 'text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300'
                }`}
              >
                {/* Active marker pill (coral red) */}
                {active && (
                  <span className="absolute left-0 top-1/4 h-1/2 w-1 rounded-r-full bg-[#ff4520]" />
                )}
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Settings, Profile and Logout */}
        <div className="flex flex-col items-center gap-5">
          {/* Settings */}
          <Link
            href="/settings"
            title="Settings"
            onClick={() => setIsOpen(false)}
            className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200 ${
              pathname.startsWith('/settings')
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300'
            }`}
          >
            <Settings className="h-5 w-5" />
          </Link>

          {/* User Profile Avatar */}
          <div className="relative group cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-9 w-9 rounded-full object-cover border border-neutral-800 transition-transform group-hover:scale-105"
            />
            {/* Simple tooltip / popup for details */}
            <div className="absolute bottom-0 left-12 hidden group-hover:block z-50 bg-neutral-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap shadow-xl">
              <p className="font-semibold">{user.name}</p>
              <p className="text-[10px] text-neutral-400">{user.company}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
