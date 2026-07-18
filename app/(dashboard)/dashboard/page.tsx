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
      return 'bg-neutral-100 text-neutral-600 border-neutral-200';
    case 'In Progress':
      return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'In Review':
      return 'bg-amber-50 text-amber-600 border-amber-100';
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

  // Render SVG segments
  // Circumference of radius 15.915 is exactly 100
  // stroke-dasharray="[percentage] [100 - percentage]"
  let accumulatedPercent = 0;
  const createCircleSegment = (percent: number, strokeColor: string) => {
    if (percent === 0) return null;
    const offset = 100 - accumulatedPercent + 25; // +25 to start at top (12 o'clock)
    accumulatedPercent += percent;
    return (
      <circle
        key={strokeColor}
        cx="21"
        cy="21"
        r="15.915"
        fill="transparent"
        stroke={strokeColor}
        strokeWidth="4"
        strokeDasharray={`${percent} ${100 - percent}`}
        strokeDashoffset={offset}
        className="transition-all duration-500 ease-out"
      />
    );
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
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ff4520] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#e03d1a] focus:outline-none focus:ring-2 focus:ring-[#ff4520]/20 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          New Order
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
                  className="mt-3 text-xs font-semibold text-[#ff4520] hover:underline"
                >
                  Create your first order
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
                        className="text-xs font-bold text-neutral-800 hover:text-[#ff4520] transition-colors"
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
                        {order.status}
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
                className="text-xs font-bold text-[#ff4520] hover:text-[#e03d1a] transition-colors flex items-center gap-1"
              >
                Configure new order →
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Status Donut Chart */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-neutral-900">Pipeline Breakdown</h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">Visualization of your workflow phases.</p>
          </div>

          <div className="my-8 flex justify-center">
            {hasOrders ? (
              <div className="relative h-40 w-40">
                <svg viewBox="0 0 42 42" className="h-full w-full">
                  {/* Background gray ring */}
                  <circle
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke="#f3f4f6"
                    strokeWidth="4"
                  />

                  {/* Dynamic segments */}
                  {createCircleSegment(pctCompleted, '#10b981')} {/* Green */}
                  {createCircleSegment(pctInReview, '#f59e0b')}   {/* Amber */}
                  {createCircleSegment(pctInProgress, '#3b82f6')} {/* Blue */}
                  {createCircleSegment(pctDraft, '#6b7280')}      {/* Gray */}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-neutral-800">{total}</span>
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Total</span>
                </div>
              </div>
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-neutral-100">
                <span className="text-xs font-bold text-neutral-400">No data</span>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="space-y-2 border-t border-neutral-100 pt-5">
            <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>Completed</span>
              </div>
              <span className="font-bold text-neutral-700">{completed} ({Math.round(pctCompleted)}%)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span>In Review</span>
              </div>
              <span className="font-bold text-neutral-700">{inReview} ({Math.round(pctInReview)}%)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                <span>In Progress</span>
              </div>
              <span className="font-bold text-neutral-700">{inProgress} ({Math.round(pctInProgress)}%)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-neutral-500">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-500" />
                <span>Draft</span>
              </div>
              <span className="font-bold text-neutral-700">{draft} ({Math.round(pctDraft)}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
