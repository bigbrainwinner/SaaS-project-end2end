'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, CheckCircle, ArrowRight, Eye, EyeOff, Sparkles, Check } from 'lucide-react';
import { loginAction } from '@/lib/actions/auth';
import Logo from '@/components/Logo';
import Button from '@/components/Button';

export default function LoginPage() {
  const router = useRouter();
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

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
      const result = await loginAction({ email, password });
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        // Success: Redirect using window.location.href to force a clean, fresh mount of AppProvider
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check network.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 lg:bg-white">
      {/* Left panel - Decorative Dashboard preview (60% width on lg) */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-slate-950 items-center justify-center p-12">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e1b4b_1px,transparent_1px),linear-gradient(to_bottom,#1e1b4b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
        
        {/* Glowing aura lights */}
        <div className="absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[120px]" />

        <div className="relative z-10 w-full max-w-xl flex flex-col space-y-12">
          {/* Top Branding Section */}
          <Logo size="lg" lightText={true} />

          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/25 px-3 py-1 text-[10px] font-bold text-violet-300 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              Standardizing content output
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              A frictionless lifecycle built to save coordination cycles.
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed font-medium">
              Log in to view active copywriting tasks, download final briefs, upload resources, and retrieve your delivered content assets.
            </p>
          </div>

          {/* Interactive mockup preview */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md shadow-2xl relative animate-fadeIn">
            <div className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-violet-500 flex items-center justify-center shadow-lg">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>

            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-[10px] font-semibold text-neutral-500 ml-2">MY PIPELINE SUMMARY</span>
              </div>
              <span className="rounded bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                Sync Completed
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Total Tasks</p>
                <p className="text-xl font-extrabold text-white">12 Active</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">In Review</p>
                <p className="text-xl font-extrabold text-violet-400">3 Pending</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-800/60 flex items-center justify-between text-[10px] text-neutral-400">
              <span>&quot;hi client saved our agency 15 hours a week.&quot;</span>
              <span className="font-bold text-neutral-300">— Wavespace Agency</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Form (40% width on lg) */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Top Header */}
          <div className="flex flex-col items-center text-center lg:hidden">
            <Logo size="lg" vertical={true} />
            <p className="mt-2 text-xs text-neutral-400 font-medium">
              Deploy beautiful briefs. Standardize your copywriting pipeline.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-xl lg:shadow-none lg:border-none lg:p-0">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-neutral-900">
                Welcome Back
              </h2>
              <p className="text-xs text-neutral-400 mt-1 font-medium">
                Log in to access your customized workspaces and tasks.
              </p>
            </div>

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
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-neutral-700 outline-none transition-all focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Password</label>
                  <a href="#" className="text-[10px] font-bold text-violet-600 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 py-2.5 pl-10 pr-10 text-xs font-medium text-neutral-700 outline-none transition-all focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me toggle */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-neutral-300 text-violet-600 focus:ring-violet-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  Remember this device
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                variant="primary"
                fullWidth={true}
                innerClassName="py-2.5 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Verifying credentials...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Toggle option */}
            <div className="mt-6 border-t border-neutral-50 pt-5 text-center">
              <p className="text-xs text-neutral-400">
                New to hi client?{' '}
                <Link
                  href="/auth/signup"
                  className="font-semibold text-neutral-800 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
