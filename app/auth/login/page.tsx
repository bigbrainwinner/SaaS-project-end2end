'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { loginAction, signupAction } from '@/lib/actions/auth';

export default function LoginPage() {
  const router = useRouter();
  
  // Auth Modes: 'login' | 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Form fields
  const [email, setEmail] = useState('shahid@wavespace.agency');
  const [password, setPassword] = useState('password123');

  // Loaders & feedback
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  // Validate inputs client-side
  const validate = () => {
    setError('');
    setInfo('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all credentials fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please supply a valid email address');
      return false;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters');
      return false;
    }

    return true;
  };

  // Submit trigger
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = { email, password };
      
      if (mode === 'login') {
        const result = await loginAction(payload);
        if (result?.error) {
          setError(result.error);
          setLoading(false);
        } else {
          // Success: Force router refresh to update middleware status and redirect
          router.push('/dashboard');
          router.refresh();
        }
      } else {
        const result = await signupAction(payload);
        if (result?.error) {
          setError(result.error);
          setLoading(false);
        } else {
          setInfo(result.message || 'Account created successfully!');
          setLoading(false);
          // Auto switch to login
          setTimeout(() => {
            setMode('login');
            setInfo('');
          }, 3000);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check network.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Decorative brand bg elements */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="w-full max-w-md space-y-6">
        
        {/* Top: Logo & Slogan */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black shadow-md">
            {/* SVG Logo matching Sidebar */}
            <svg
              className="h-7 w-7 text-white"
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
          </div>
          <h1 className="mt-4 text-2xl font-black tracking-tight text-neutral-900">
            Kiro Content Suite
          </h1>
          <p className="mt-1 text-xs text-neutral-400 font-medium">
            Deploy beautiful briefs. Standardize your copywriting pipeline.
          </p>
        </div>

        {/* Main Card Container */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-xl">
          
          <h2 className="text-base font-bold text-neutral-900 mb-6">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Feedback boxes */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700 animate-shake">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            {info && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-700">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{info}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-neutral-700 outline-none transition-all focus:border-neutral-300 focus:bg-white focus:ring-2 focus:ring-neutral-100"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-neutral-700 outline-none transition-all focus:border-neutral-300 focus:bg-white focus:ring-2 focus:ring-neutral-100"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff4520] py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#e03d1a] disabled:opacity-50 active:scale-[0.98] mt-6"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Create Free Account'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle option */}
          <div className="mt-6 border-t border-neutral-50 pt-5 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-neutral-400">
                New to Kiro?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                    setInfo('');
                  }}
                  className="font-semibold text-neutral-800 hover:underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p className="text-xs text-neutral-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setInfo('');
                  }}
                  className="font-semibold text-neutral-800 hover:underline"
                >
                  Log in instead
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
