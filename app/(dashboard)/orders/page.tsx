'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Calendar, ChevronRight, XCircle, Plus, SlidersHorizontal } from 'lucide-react';
import { useApp } from '@/lib/store/AppContext';
import { OrderStatus } from '@/types';

type SortOption = 'deadline-soon' | 'deadline-late' | 'created-new' | 'created-old' | 'words-high' | 'words-low';

export function getCustomStatusStyles(status: OrderStatus) {
  switch (status) {
    case 'Draft':
      return 'bg-neutral-100 text-neutral-500 border-neutral-200';
    case 'In Progress':
      return 'bg-violet-50 text-violet-600 border-violet-100';
    case 'In Review':
      return 'bg-orange-50 text-orange-600 border-orange-100';
    case 'Completed':
      return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    default:
      return 'bg-neutral-100 text-neutral-600 border-neutral-200';
  }
}

export function getStatusLabel(status: OrderStatus) {
  if (status === 'In Review') return 'PENDING REVIEW';
  return status.toUpperCase();
}

export default function OrdersPage() {
  const { orders } = useApp();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<SortOption>('created-new');

  const filterChips: (OrderStatus | 'All')[] = ['All', 'Draft', 'In Progress', 'In Review', 'Completed'];

  // Filter and sort computation
  const processedOrders = useMemo(() => {
    let result = orders.filter((order) => {
      const matchesSearch = order.title.toLowerCase().includes(search.toLowerCase()) || 
                            order.contentType.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'deadline-soon':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'deadline-late':
          return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
        case 'created-new':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'created-old':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'words-high':
          return b.wordCount - a.wordCount;
        case 'words-low':
          return a.wordCount - b.wordCount;
        default:
          return 0;
      }
    });

    return result;
  }, [orders, search, statusFilter, sortBy]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-neutral-500 mt-1 font-sans">Manage and track your ongoing projects</p>
        </div>
        <Link
          href="/orders/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 active:scale-[0.98] font-sans"
        >
          <Plus className="h-4 w-4" />
          New task
        </Link>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="rounded-xl border border-neutral-100 bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          
          {/* Search input field */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 py-2 pl-9 pr-4 text-xs font-medium text-neutral-700 outline-none transition-all placeholder:text-neutral-400 focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100 font-sans"
            />
          </div>

          {/* Sorting and Filter Dropdowns */}
          <div className="flex items-center gap-3">
            {/* Status Select dropdown to match screenshot */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'All')}
              className="rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 py-1.5 text-xs font-semibold text-neutral-700 outline-none transition-all hover:border-neutral-300 focus:border-violet-400 focus:bg-white font-sans"
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="In Progress">In Progress</option>
              <option value="In Review">In Review</option>
              <option value="Completed">Completed</option>
            </select>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-400" />
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider font-sans">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 py-1.5 text-xs font-semibold text-neutral-700 outline-none transition-all hover:border-neutral-300 focus:border-violet-400 focus:bg-white font-sans"
              >
                <option value="created-new">Created: Newest</option>
                <option value="created-old">Created: Oldest</option>
                <option value="deadline-soon">Deadline: Soonest</option>
                <option value="deadline-late">Deadline: Latest</option>
                <option value="words-high">Word Count: High-Low</option>
                <option value="words-low">Word Count: Low-High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="border-t border-neutral-50 pt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mr-2 font-sans">Filter Status:</span>
          {filterChips.map((chip) => {
            const active = statusFilter === chip;
            return (
              <button
                key={chip}
                onClick={() => setStatusFilter(chip)}
                className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all font-sans ${
                  active
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-neutral-50 border border-neutral-200/60 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="rounded-xl border border-neutral-100 bg-white shadow-sm overflow-hidden">
        {processedOrders.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50 text-neutral-400 mb-4">
              <XCircle className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-neutral-800 font-sans">No tasks found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mt-1 font-sans">
              {search || statusFilter !== 'All'
                ? "We couldn't find any tasks matching your search or filters. Try adjusting your settings."
                : "Get started by creating your very first task brief."}
            </p>
            {(search || statusFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('All');
                }}
                className="mt-4 text-xs font-bold text-violet-600 hover:underline font-sans"
              >
                Clear filters
              </button>
            )}
            {!search && statusFilter === 'All' && (
              <Link
                href="/orders/new"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-violet-700 font-sans"
              >
                Create First Brief
              </Link>
            )}
          </div>
        ) : (
          /* Table Layout */
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs font-sans">
              <thead className="border-b border-neutral-100 bg-neutral-50/75 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">TASK NAME</th>
                  <th className="px-6 py-4">STATUS</th>
                  <th className="px-6 py-4">ASSIGNED TO</th>
                  <th className="px-6 py-4">DEADLINE</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {processedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="group hover:bg-neutral-50/50 transition-colors"
                  >
                    {/* Task Name */}
                    <td className="px-6 py-4.5 font-bold text-neutral-800">
                      <Link href={`/orders/${order.id}`} className="hover:text-violet-600 transition-colors block font-sans">
                        <span className="text-[10px] font-mono text-neutral-400 mr-2 block sm:inline">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        {order.title}
                      </Link>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-bold tracking-wider ${getCustomStatusStyles(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>

                    {/* Assigned To (Overlapping Avatars) */}
                    <td className="px-6 py-4.5">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        <img
                          className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face"
                          alt="Team member 1"
                        />
                        <img
                          className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
                          alt="Team member 2"
                        />
                        <img
                          className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face"
                          alt="Team member 3"
                        />
                      </div>
                    </td>

                    {/* Deadline */}
                    <td className="px-6 py-4.5 text-neutral-600 font-medium">
                      {new Date(order.deadline).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Row Detail View trigger button */}
                    <td className="px-6 py-4.5 text-right">
                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-neutral-400 group-hover:border-neutral-200 group-hover:text-neutral-700 bg-transparent group-hover:bg-white transition-all duration-200"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
