'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Building, AlertCircle, CheckCircle, ArrowRight, Eye, EyeOff, Sparkles, Check } from 'lucide-react';
import { signupAction } from '@/lib/actions/auth';
import Logo from '@/components/Logo';
import Button from '@/components/Button';

function SignupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loaders & feedback
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  // Effect to read email from query param if available
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      const timer = setTimeout(() => {
        setEmail(emailParam);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Validate inputs client-side
  const validate = () => {
    setError('');
    setInfo('');

    if (!name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!company.trim()) {
      setError('Please enter your company name');
      return false;
    }
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all credential fields');
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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
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
      const result = await signupAction({ email, password, name, company });
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        setInfo(result.message || 'Account created successfully!');
        setLoading(false);
        // Reset form fields
        setName('');
        setCompany('');
        setConfirmPassword('');
        setEmail('');
        setPassword('');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check network.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Mobile Top Header */}
      <div className="flex flex-col items-center text-center lg:hidden">
        <Logo size="lg" vertical={true} />
        <p className="mt-2 text-xs text-neutral-400 font-medium">
          Create a free account to standardize your content briefs.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-xl lg:shadow-none lg:border-none lg:p-0">
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-neutral-900">
            Create Your Account
          </h2>
          <p className="text-xs text-neutral-400 mt-1 font-medium">
            Get started in under two minutes. No credit card required.
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

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Jenkins"
                required
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-neutral-700 outline-none transition-all focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>

          {/* Company Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Company Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
                <Building className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Wavespace Agency"
                required
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-neutral-700 outline-none transition-all focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>

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
                placeholder="sarah@wavespace.co"
                required
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-neutral-700 outline-none transition-all focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100"
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

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-neutral-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50/50 py-2.5 pl-10 pr-10 text-xs font-medium text-neutral-700 outline-none transition-all focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600 focus:outline-none"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
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
              <span>Creating account...</span>
            ) : (
              <>
                <span>Create Free Account</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {/* Toggle option */}
        <div className="mt-6 border-t border-neutral-50 pt-5 text-center">
          <p className="text-xs text-neutral-400">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-semibold text-neutral-800 hover:underline"
            >
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
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
              Empowering Creative Production
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
              Standardize briefs. Track milestones. Deliver pristine copy.
            </h2>
            <p className="text-sm text-neutral-400 leading-relaxed font-medium">
              Join thousands of editorial managers and marketing teams who use hi client to cut email overhead and keep their client sign-offs in one place.
            </p>
          </div>

          {/* Interactive mockup preview */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-md shadow-2xl relative">
            <div className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg animate-pulse">
              <Check className="h-3.5 w-3.5 text-white stroke-[3.5]" />
            </div>

            <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-[10px] font-semibold text-neutral-500 ml-2">BRIEF #2086 — WAVESPA CO</span>
              </div>
              <span className="rounded bg-violet-500/15 border border-violet-500/20 px-2 py-0.5 text-[9px] font-bold text-violet-400 uppercase tracking-wider">
                In Review
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-white">How To Scale An E-Commerce Brand In 2026</h4>
                <p className="text-[10px] text-neutral-400 mt-1">SEO Article • Target Word Count: 2,500 words</p>
              </div>

              {/* Progress bars */}
              <div className="space-y-2">
                <div className="flex justify-between text-[9px] font-bold">
                  <span className="text-neutral-400 uppercase tracking-wider">Brief Completion</span>
                  <span className="text-violet-400">85% Completed</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div className="h-full rounded-full bg-violet-500 w-[85%] transition-all duration-1000" />
                </div>
              </div>

              {/* Visual activity logs */}
              <div className="flex items-center gap-3 bg-neutral-950/40 border border-neutral-800/80 rounded-lg p-2.5">
                <div className="h-7 w-7 rounded-full bg-violet-600/10 border border-violet-500/30 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-extrabold text-violet-400">SJ</span>
                </div>
                <div className="flex-1">
                  <p className="text-[9px] font-semibold text-neutral-300">Draft submitted by Sarah Jenkins</p>
                  <p className="text-[8px] text-neutral-500 mt-0.5">3 mins ago • Pending final approval</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Form (40% width on lg) */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <Suspense fallback={<div className="text-neutral-400 text-xs font-semibold">Loading signup form...</div>}>
          <SignupFormContent />
        </Suspense>
      </div>
    </div>
  );
}
