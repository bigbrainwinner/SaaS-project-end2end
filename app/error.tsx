'use client';

import React, { useEffect } from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error details
    console.error('Kiro global runtime error boundary caught:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 text-center">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="max-w-md space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 border border-red-100 mx-auto">
          <AlertOctagon className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-neutral-900">An Error Occurred</h1>
          <p className="text-xs text-neutral-500 font-medium leading-relaxed max-w-xs mx-auto">
            Something went wrong while rendering this section. Our server logs have recorded this issue.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-neutral-800 active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </button>
          <a
            href="/dashboard"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-50"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}
