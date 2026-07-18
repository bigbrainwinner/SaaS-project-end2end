'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, FileText, Globe, Volume2, Key, Link as LinkIcon, Paperclip, Edit3, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '@/lib/store/AppContext';
import { OrderStatus } from '@/types';
import { getStatusStyles } from '../../dashboard/page';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { orders } = useApp();

  // Find order
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-xl font-bold text-neutral-800">Order Not Found</h2>
        <p className="text-xs text-neutral-500 mt-2">The order brief you are looking for does not exist or has been removed.</p>
        <Link
          href="/orders"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
      </div>
    );
  }

  // Stepper steps definition
  const steps: OrderStatus[] = ['Draft', 'In Progress', 'In Review', 'Completed'];
  const currentStepIndex = steps.indexOf(order.status);

  // Helper to format bytes to human readable sizes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to list
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getStatusStyles(order.status)}`}>
                {order.status}
              </span>
              <span className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">{order.contentType}</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 md:text-2xl">{order.title}</h2>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-medium text-neutral-600 bg-neutral-50 border border-neutral-100 rounded-lg px-3.5 py-2 w-fit">
            <Calendar className="h-4 w-4 text-neutral-400" />
            <span>
              Deadline:{' '}
              <strong className="text-neutral-800">
                {new Date(order.deadline).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </strong>
            </span>
          </div>
        </div>

        {/* Horizontal Progress Stepper */}
        <div className="border-t border-neutral-50 pt-8">
          <div className="relative flex items-center justify-between w-full">
            {/* Background connection line */}
            <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-neutral-100 -z-10" />
            {/* Active progress line width builder */}
            <div
              className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-[#ff4520] -z-10 transition-all duration-500 ease-out"
              style={{
                width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
              }}
            />

            {/* Steps loop */}
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;
              const isUpcoming = index > currentStepIndex;

              return (
                <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
                  {/* Step bubble icon */}
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      isCompleted
                        ? 'border-[#ff4520] bg-[#ff4520] text-white'
                        : isActive
                        ? 'border-[#ff4520] bg-white text-[#ff4520] ring-4 ring-[#ff4520]/10'
                        : 'border-neutral-200 bg-white text-neutral-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4.5 w-4.5 stroke-[3]" />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  {/* Step title */}
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isActive
                        ? 'text-[#ff4520]'
                        : isCompleted
                        ? 'text-neutral-800 font-semibold'
                        : 'text-neutral-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid for parameters and items */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left 2 Columns: Order Details Brief parameters */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-50 pb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-neutral-400" />
              Content Strategy Details
            </h3>

            {/* Word count and metrics list */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-neutral-50">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Word Count Goal</span>
                <p className="text-sm font-bold text-neutral-800">{order.wordCount.toLocaleString()} Words</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Estimated Reading Time</span>
                <p className="text-sm font-bold text-neutral-800">{Math.round(order.wordCount / 225)} minutes</p>
              </div>
            </div>

            {/* Strategy rows */}
            <div className="space-y-4.5">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-50">
                  <Globe className="h-4 w-4 text-neutral-500" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Target Audience</h4>
                  <p className="text-xs font-semibold text-neutral-700 leading-relaxed">{order.targetAudience}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-50">
                  <Volume2 className="h-4 w-4 text-neutral-500" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Tone & Voice Guidance</h4>
                  <p className="text-xs font-semibold text-neutral-700 leading-relaxed">{order.toneVoice}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-50">
                  <Key className="h-4 w-4 text-neutral-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Target Keywords</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {order.keywords.length === 0 ? (
                      <span className="text-xs text-neutral-400 italic">None specified</span>
                    ) : (
                      order.keywords.map(kw => (
                        <span key={kw} className="rounded-md bg-neutral-50 border border-neutral-200/50 px-2 py-0.5 text-[10px] font-bold text-neutral-600">
                          {kw}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revision instructions and notes */}
          <div className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-50 pb-3 flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-neutral-400" />
              Additional Brief Instructions
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-wrap">
              {order.additionalNotes || 'No additional instructions provided for this brief.'}
            </p>
          </div>
        </div>

        {/* Right Column: References & Attachments */}
        <div className="space-y-6">
          {/* Reference links */}
          <div className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-50 pb-3 flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-neutral-400" />
              Reference Links
            </h3>
            {order.referenceLinks.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No reference links provided.</p>
            ) : (
              <ul className="space-y-2">
                {order.referenceLinks.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={link.startsWith('http') ? link : `https://${link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#ff4520] hover:underline break-all inline-flex items-center gap-1 font-semibold"
                    >
                      <LinkIcon className="h-3 w-3 shrink-0" />
                      <span>{link.replace(/(^\w+:|^)\/\//, '')}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* File Attachments */}
          <div className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-50 pb-3 flex items-center gap-2">
              <Paperclip className="h-4 w-4 text-neutral-400" />
              File Attachments
            </h3>
            {order.attachments.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No files attached.</p>
            ) : (
              <ul className="space-y-2">
                {order.attachments.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-neutral-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-700 truncate">{file.fileName}</p>
                        <p className="text-[9px] text-neutral-400">{formatBytes(file.fileSize)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading ${file.fileName} (mock)`)}
                      className="text-[10px] font-bold text-[#ff4520] hover:underline"
                    >
                      Get
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
