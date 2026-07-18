'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Calendar, FileText, ArrowUpDown, Plus, SlidersHorizontal, ChevronRight, XCircle } from 'lucide-react';
import { useApp } from '@/lib/store/AppContext';
import { OrderStatus } from '@/types';
import { getStatusStyles } from '../dashboard/page';

type SortOption = 'deadline-soon' | 'deadline-late' | 'created-new' | 'created-old' | 'words-high' | 'words-low';

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
          <p className="text-xs text-neutral-500 mt-1">Manage and track your ongoing content drafts, briefs, and deliverables.</p>
        </div>
        <Link
          href="/orders/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ff4520] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#e03d1a] focus:outline-none focus:ring-2 focus:ring-[#ff4520]/20 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Create Order
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
              placeholder="Search orders by title or content type..."
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 py-2 pl-9 pr-4 text-xs font-medium text-neutral-700 outline-none transition-all placeholder:text-neutral-400 focus:border-neutral-300 focus:bg-white focus:ring-2 focus:ring-neutral-100"
            />
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-400" />
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 py-1.5 text-xs font-semibold text-neutral-700 outline-none transition-all hover:border-neutral-300 focus:border-neutral-400 focus:bg-white"
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

        {/* Status Filter Chips */}
        <div className="border-t border-neutral-50 pt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mr-2">Filter Status:</span>
          {filterChips.map((chip) => {
            const active = statusFilter === chip;
            return (
              <button
                key={chip}
                onClick={() => setStatusFilter(chip)}
                className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                  active
                    ? 'bg-black text-white'
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
            <h3 className="text-sm font-bold text-neutral-800">No orders found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mt-1">
              {search || statusFilter !== 'All'
                ? "We couldn't find any orders matching your search or filters. Try adjusting your settings."
                : "Get started by creating your very first order brief."}
            </p>
            {(search || statusFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter('All');
                }}
                className="mt-4 text-xs font-bold text-[#ff4520] hover:underline"
              >
                Clear filters
              </button>
            )}
            {!search && statusFilter === 'All' && (
              <Link
                href="/orders/new"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#ff4520] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#e03d1a]"
              >
                Create First Brief
              </Link>
            )}
          </div>
        ) : (
          /* Table Layout */
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="border-b border-neutral-100 bg-neutral-50/75 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Type</th>
                  <th className="px-6 py-4 hidden md:table-cell">Word Count</th>
                  <th className="px-6 py-4 hidden lg:table-cell font-medium">Created</th>
                  <th className="px-6 py-4">Deadline</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {processedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="group hover:bg-neutral-50/50 transition-colors"
                  >
                    {/* Title */}
                    <td className="px-6 py-4.5 font-bold text-neutral-800">
                      <Link href={`/orders/${order.id}`} className="hover:text-[#ff4520] transition-colors block">
                        {order.title}
                      </Link>
                    </td>

                    {/* Content Type */}
                    <td className="px-6 py-4.5 text-neutral-500 hidden sm:table-cell">
                      {order.contentType}
                    </td>

                    {/* Word Count */}
                    <td className="px-6 py-4.5 text-neutral-500 hidden md:table-cell">
                      {order.wordCount.toLocaleString()} words
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4.5 text-neutral-400 hidden lg:table-cell">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Deadline */}
                    <td className="px-6 py-4.5 text-neutral-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                        <span>
                          {new Date(order.deadline).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusStyles(order.status)}`}>
                        {order.status}
                      </span>
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
