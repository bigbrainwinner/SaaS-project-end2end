'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bell, Search, Menu, ChevronRight } from 'lucide-react';
import { useApp } from '@/lib/store/AppContext';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const { orders } = useApp();

  // Helper to generate dynamic breadcrumbs & title
  const getBreadcrumbsAndTitle = () => {
    const parts = pathname.split('/').filter(Boolean);
    const crumbs: { label: string; href: string }[] = [];
    let title = 'Dashboard';

    if (parts.length === 0) {
      return { crumbs: [{ label: 'Home', href: '/' }], title: 'Marketing' };
    }

    if (parts[0] === 'dashboard') {
      title = 'Dashboard';
      crumbs.push({ label: 'Dashboard', href: '/dashboard' });
    } else if (parts[0] === 'orders') {
      title = 'Orders';
      crumbs.push({ label: 'Orders', href: '/orders' });

      if (parts[1] === 'new') {
        title = 'New Order';
        crumbs.push({ label: 'New Order', href: '/orders/new' });
      } else if (parts[1]) {
        // Dynamic order ID
        const orderId = parts[1];
        const order = orders.find((o) => o.id === orderId);
        const orderTitle = order ? order.title : 'Order Details';
        title = orderTitle;
        crumbs.push({ label: orderTitle, href: `/orders/${orderId}` });
      }
    } else if (parts[0] === 'settings') {
      title = 'Settings';
      crumbs.push({ label: 'Settings', href: '/settings' });
    } else if (parts[0] === 'notifications') {
      title = 'Notifications';
      crumbs.push({ label: 'Notifications', href: '/notifications' });
    }

    return { crumbs, title };
  };

  const { crumbs, title } = getBreadcrumbsAndTitle();

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-neutral-100 bg-white px-6 lg:px-10">
      {/* Left: Mobile Menu Toggle & Title / Breadcrumbs */}
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 lg:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Dynamic Title and Breadcrumbs */}
        <div className="flex flex-col">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1 text-[11px] font-medium text-neutral-400">
            <Link href="/dashboard" className="hover:text-neutral-600 transition-colors">
              Home
            </Link>
            {crumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                <ChevronRight className="h-3 w-3 text-neutral-300" />
                <Link
                  href={crumb.href}
                  className={`hover:text-neutral-600 transition-colors ${
                    index === crumbs.length - 1 ? 'text-neutral-500 font-semibold' : ''
                  }`}
                >
                  {crumb.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          {/* Page Title */}
          <h1 className="mt-0.5 text-xl font-bold tracking-tight text-neutral-900 lg:text-2xl">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Search bar & Notifications */}
      <div className="flex items-center gap-4">
        {/* Search Input Bar (Desktop) */}
        <div className="relative hidden w-64 md:block">
          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Quick search..."
            className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-4 text-xs font-medium text-neutral-700 outline-none transition-all placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white focus:ring-2 focus:ring-neutral-100"
          />
        </div>

        {/* Notification Bell */}
        <Link
          href="/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-100 bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800 transition-colors"
        >
          <div className="relative">
            <Bell className="h-4.5 w-4.5" />
            {/* Unread indicator dot (positioned on top-right of bell) */}
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[#ff4520] border border-white" />
          </div>
        </Link>
      </div>
    </header>
  );
}
