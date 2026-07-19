'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, ChevronRight, FileText, Clock, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useApp } from '@/lib/store/AppContext';
import { OrderStatus } from '@/types';

// Helper for status badge styling
export function getStatusStyles(status: OrderStatus) {
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

export default function DashboardPage() {
  const { orders } = useApp();

  // Compute stats
  const total = orders.length;
  const inProgress = orders.filter(o => o.status === 'In Progress').length;
  const inReview = orders.filter(o => o.status === 'In Review').length;
  const completed = orders.filter(o => o.status === 'Completed').length;
  const draft = orders.filter(o => o.status === 'Draft').length;

  const stats = [
    { label: 'Total Orders', value: total, icon: FileText, color: 'text-neutral-500', bg: 'bg-neutral-50' },
    { label: 'In Progress', value: inProgress, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50/50' },
    { label: 'In Review', value: inReview, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50/50' },
    { label: 'Completed', value: completed, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50/50' },
  ];

  // Calculate percentages for SVG donut chart
  const hasOrders = total > 0;
  const pctInProgress = hasOrders ? (inProgress / total) * 100 : 0;
  const pctInReview = hasOrders ? (inReview / total) * 100 : 0;
  const pctCompleted = hasOrders ? (completed / total) * 100 : 0;
  const pctDraft = hasOrders ? (draft / total) * 100 : 0;

  const activeSegments = [
    { key: 'inProgress', value: inProgress, percent: pctInProgress, color: '#8b5cf6', label: 'In Progress' }, // Purple (vibrant)
    { key: 'inReview', value: inReview, percent: pctInReview, color: '#f59e0b', label: 'In Review' }, // Amber (high contrast)
    { key: 'completed', value: completed, percent: pctCompleted, color: '#10b981', label: 'Completed' }, // Emerald
    { key: 'draft', value: draft, percent: pctDraft, color: '#94a3b8', label: 'Draft' }, // Slate Gray
  ].filter(s => s.percent > 0);

  const activeCount = activeSegments.length;
  const minPercent = activeCount > 0 ? Math.min(...activeSegments.map(s => s.percent)) : 0;

  // Render SVG segments with precise gap offsets & rounded stroke caps
  let accumulatedPercent = 0;
  const renderSegments = () => {
    if (activeCount === 0) return null;
    if (activeCount === 1) {
      const segment = activeSegments[0];
      return (
        <circle
          cx="21"
          cy="21"
          r="15.915"
          fill="transparent"
          stroke={segment.color}
          strokeWidth="5.5"
          className="transition-all duration-300 ease-out hover:stroke-[6.5] cursor-pointer origin-center"
        />
      );
    }

    const gapOffset = Math.min(8, minPercent * 0.7);

    return activeSegments.map((segment) => {
      const p = segment.percent;
      const dashLength = p - gapOffset;
      const strokeDasharray = `${dashLength} ${100 - dashLength}`;
      const offset = 100 - accumulatedPercent + 25; 
      accumulatedPercent += p;

      return (
        <circle
          key={segment.key}
          cx="21"
          cy="21"
          r="15.915"
          fill="transparent"
          stroke={segment.color}
          strokeWidth="5.5"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out hover:stroke-[6.5] cursor-pointer origin-center"
        />
      );
    });
  };

  // Get 3 most recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Top Banner section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Welcome Back</h2>
          <p className="text-xs text-neutral-500 mt-1">Here is a quick overview of your brand content pipeline.</p>
        </div>
        <Link
          href="/orders/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          New task
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-xl border border-neutral-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${stat.bg}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-neutral-900 mt-0.5">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Recent Orders */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-neutral-900">Recent Activity</h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">Your recently created and updated orders.</p>
              </div>
              <Link
                href="/orders"
                className="group inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                View all
                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* List */}
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 border border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
                <FileText className="h-8 w-8 text-neutral-300" />
                <p className="text-xs font-medium text-neutral-400 mt-2">No orders created yet.</p>
                <Link
                  href="/orders/new"
                  className="mt-3 text-xs font-semibold text-violet-600 hover:underline"
                >
                  Create your first task
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between py-4 transition-all duration-150 hover:bg-neutral-50/50 -mx-4 px-4 rounded-lg"
                  >
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/orders/${order.id}`}
                        className="text-xs font-bold text-neutral-800 hover:text-violet-600 transition-colors"
                      >
                        {order.title}
                      </Link>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                        <span>{order.contentType}</span>
                        <span>•</span>
                        <span>{order.wordCount} words</span>
                        <span>•</span>
                        <span>Due {new Date(order.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 mt-3 sm:mt-0">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase ${getStatusStyles(order.status)}`}>
                        {order.status === 'In Review' ? 'PENDING REVIEW' : order.status.toUpperCase()}
                      </span>
                      <Link
                        href={`/orders/${order.id}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-700 bg-white transition-colors"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action footer inside Recent Orders Card */}
          {recentOrders.length > 0 && (
            <div className="border-t border-neutral-100 pt-5 mt-5 flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">
                Need content built? Submit a new project block.
              </span>
              <Link
                href="/orders/new"
                className="text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors flex items-center gap-1"
              >
                Configure new task →
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Status Donut Chart */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full min-h-[300px]">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-6 pb-4 border-b border-neutral-50">
            <div>
              <h3 className="font-bold text-neutral-900 tracking-tight text-sm xl:text-base">Pipeline Breakdown</h3>
              <p className="text-[10px] xl:text-[11px] text-neutral-400 mt-0.5">Distribution of active tasks</p>
            </div>
            <Link
              href="/orders"
              className="group inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors shrink-0 pt-0.5"
            >
              View all
              <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Chart & Legend Row */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-6 xl:gap-8 my-auto py-2">
            {/* Chart */}
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 lg:w-36 lg:h-36 xl:w-40 xl:h-40 shrink-0">
              {hasOrders ? (
                <>
                  <svg viewBox="0 0 42 42" className="h-full w-full">
                    {/* Background track for structure */}
                    <circle
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth="5.5"
                    />
                    {renderSegments()}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl font-extrabold text-neutral-900 tracking-tight leading-none">{total}</span>
                    <span className="text-[8px] sm:text-[9px] lg:text-[8px] xl:text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-1 sm:mt-1.5 lg:mt-1 xl:mt-1.5">Total Tasks</span>
                  </div>
                </>
              ) : (
                <div className="flex w-36 h-36 sm:w-40 sm:h-40 lg:w-36 lg:h-36 xl:w-40 xl:h-40 items-center justify-center rounded-full border border-dashed border-neutral-200 bg-neutral-50/30">
                  <span className="text-[11px] font-semibold text-neutral-400">No tasks</span>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-3 min-w-[120px]">
              {[
                { label: 'In Progress', count: inProgress, color: '#8b5cf6' },
                { label: 'In Review', count: inReview, color: '#f59e0b' },
                { label: 'Completed', count: completed, color: '#10b981' },
                { label: 'Draft', count: draft, color: '#94a3b8' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 group/legend">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0 transition-transform duration-200 group-hover/legend:scale-110"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <p className="text-xs font-bold text-neutral-700 leading-none transition-colors duration-200 group-hover/legend:text-neutral-900">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-neutral-400 font-medium mt-1">
                      {item.count} {item.count === 1 ? 'task' : 'tasks'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
