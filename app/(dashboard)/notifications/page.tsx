'use client';

import React from 'react';
import { Bell, Check, Trash2, Clock, CheckCircle, Info, Calendar } from 'lucide-react';
import { useApp } from '@/lib/store/AppContext';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'deadline';
  time: string;
  read: boolean;
}

export default function NotificationsPage() {
  const { notifications, setNotifications } = useApp();

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'deadline':
        return <Calendar className="h-4 w-4 text-amber-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header card with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-neutral-400 mt-1">
            Stay updated on the status of your copywriting briefs, invoices, and profile updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800 transition-colors shrink-0"
          >
            <Check className="h-4 w-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Main card list */}
      <div className="rounded-xl border border-neutral-100 bg-white shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50 text-neutral-400 mb-4">
              <Bell className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-neutral-800">All caught up!</h3>
            <p className="text-xs text-neutral-400 mt-1">You have no notifications in your workspace.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`flex gap-4 p-5 transition-colors group relative ${
                  item.read ? 'bg-white' : 'bg-neutral-50/45'
                }`}
              >
                {/* Visual Unread dot */}
                {!item.read && (
                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-violet-600" />
                )}

                {/* Icon box */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-100 bg-neutral-50">
                  {getIcon(item.type)}
                </div>

                {/* Message detail */}
                <div className="flex-1 space-y-1 pr-12">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-xs ${item.read ? 'font-semibold text-neutral-700' : 'font-bold text-neutral-900'}`}>
                      {item.title}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 leading-normal">{item.description}</p>
                </div>

                {/* Quick actions panel */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleToggleRead(item.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-100 bg-white text-neutral-400 hover:border-neutral-200 hover:text-neutral-700 transition-colors"
                    title={item.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    <Check className={`h-3.5 w-3.5 ${!item.read ? 'text-violet-600' : ''}`} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-100 bg-white text-neutral-400 hover:border-neutral-200 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
