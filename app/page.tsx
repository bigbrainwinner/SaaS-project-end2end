'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutGrid, FileText, CheckCircle, ArrowRight, ShieldCheck, Zap, Sparkles, MessageSquare } from 'lucide-react';

export default function MarketingPage() {
  const features = [
    {
      title: 'Unified Task Dashboard',
      description: 'Monitor word goals, active stages, and team milestones in one real-time visual interface.',
      icon: LayoutGrid,
    },
    {
      title: 'Standardized Brief Formats',
      description: 'Define target audiences, SEO keywords, tone of voice guidelines, and file attachments dynamically.',
      icon: FileText,
    },
    {
      title: 'Secure Client Compartments',
      description: 'Equipped with Row-Level Security (RLS) ensuring each customer can only access their own project assets.',
      icon: ShieldCheck,
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Draft the Project Brief',
      description: 'Fill out details, deadlines, target keywords, and drag-and-drop structural resources.',
    },
    {
      num: '02',
      title: 'Track Pipeline Progress',
      description: 'Follow step-by-step progress tracking from Draft to In Progress, In Review, and Completed.',
    },
    {
      num: '03',
      title: 'Retrieve Completed Asset',
      description: 'Receive real-time notifications and download final files immediately upon delivery.',
    },
  ];

  const testimonials = [
    {
      quote: 'Taskbito has standardized our entire client reporting flow. We save upwards of 15 hours a week in client email overhead.',
      author: 'Sarah Jenkins',
      role: 'Head of Content, Wavespace Agency',
    },
    {
      quote: 'Our clients love the simplicity. Being able to check order status without asking has reduced client churn by 18%.',
      author: 'Marcus Vance',
      role: 'Founder, Vance Creative Co.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans flex flex-col justify-between">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[600px] w-full bg-white bg-[radial-gradient(100%_50%_at_50%_0%,#7c3aed/5%,transparent_100%)]" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 py-4 lg:px-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Squircle Checkmark Logo matching Sidebar */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 shadow-md shadow-violet-600/30">
            <svg
              className="h-4.5 w-4.5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="font-extrabold text-sm tracking-tight text-neutral-900 font-sans">Taskbito</span>
        </div>

        {/* Desktop Menu links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-neutral-500">
          <a href="#features" className="hover:text-neutral-900 transition-colors">Features</a>
          <a href="#workflow" className="hover:text-neutral-900 transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-neutral-900 transition-colors">Pricing</a>
        </nav>

        {/* Auth CTA */}
        <div>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-neutral-800"
          >
            Access Dashboard
          </Link>
        </div>
      </header>

      {/* Main Body content */}
      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="relative px-6 py-20 lg:px-16 text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3.5 py-1 text-[10px] font-bold text-neutral-600 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            Introducing Taskbito v3.0
          </div>

          <h1 className="text-4xl font-black tracking-tight text-neutral-900 sm:text-6xl leading-[1.08]">
            Standardize your content pipeline. <br />
            <span className="text-violet-600">Delight your clients.</span>
          </h1>

          <p className="text-sm text-neutral-500 font-medium max-w-xl mx-auto leading-relaxed">
            Stop losing briefs in emails and chat logs. Taskbito provides a clean, client-facing portal to define, upload, track, and complete copywriting deliverables.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/15 transition-all hover:bg-violet-700 active:scale-[0.98] w-full sm:w-auto"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#workflow"
              className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-600 transition-colors hover:bg-neutral-50 w-full sm:w-auto"
            >
              See workflow
            </a>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section id="features" className="px-6 py-16 lg:px-16 bg-neutral-50/50 border-y border-neutral-100">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-neutral-900">Engineered for Modern Agencies</h2>
              <p className="text-xs text-neutral-400 font-medium">Standardizing output begins with standardizing inputs.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/5 text-violet-600 mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-bold text-neutral-900">{feat.title}</h3>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed">{feat.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* WORKFLOW ROADMAP */}
        <section id="workflow" className="px-6 py-20 lg:px-16">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-neutral-900">How Taskbito Streamlines Collaboration</h2>
              <p className="text-xs text-neutral-400 font-medium">A frictionless lifecycle built to save client coordination cycles.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 relative">
              {steps.map((step) => (
                <div key={step.num} className="space-y-4">
                  <div className="text-4xl font-black text-violet-600/15">{step.num}</div>
                  <h3 className="text-sm font-bold text-neutral-900">{step.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF TESTIMONIALS */}
        <section className="px-6 py-16 lg:px-16 bg-neutral-50/50 border-t border-neutral-100">
          <div className="max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-neutral-900">Trusted by Design Leaders</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {testimonials.map((t, idx) => (
                <div key={idx} className="rounded-xl bg-white border border-neutral-100 p-6 shadow-sm flex flex-col justify-between">
                  <p className="text-xs font-medium text-neutral-600 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                  <div className="mt-4 pt-4 border-t border-neutral-50">
                    <h4 className="text-xs font-bold text-neutral-800">{t.author}</h4>
                    <p className="text-[10px] text-neutral-400 font-semibold">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="px-6 py-20 lg:px-16 text-center max-w-md mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-neutral-900">Simple Flat-Rate Pricing</h2>
            <p className="text-xs text-neutral-400 font-medium">All features included, cancel any time.</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 rounded-bl-lg bg-violet-600 px-3 py-1 text-[9px] font-bold text-white uppercase tracking-wider">
              Popular
            </div>
            
            <h3 className="text-sm font-bold text-neutral-800">Agency Plan</h3>
            <div className="my-6">
              <span className="text-4xl font-black text-neutral-950">$149</span>
              <span className="text-neutral-400 text-xs font-medium"> / month</span>
            </div>

            <ul className="space-y-3.5 text-xs text-neutral-500 font-medium text-left border-y border-neutral-100 py-6 my-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-violet-600" />
                <span>Unlimited client active briefs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-violet-600" />
                <span>Brand voice presets & customization</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-violet-600" />
                <span>Row-Level SQL security models</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-violet-600" />
                <span>10 GB attachments storage bucket</span>
              </li>
            </ul>

            <Link
              href="/auth/login"
              className="flex w-full items-center justify-center rounded-lg bg-black py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-neutral-800 transition-colors"
            >
              Get Started Now
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-100 py-10 px-6 lg:px-16 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-400 font-semibold">
        <div className="flex items-center gap-2">
          {/* Foot checkmark icon */}
          <div className="flex h-5 w-5 items-center justify-center rounded bg-violet-600 text-white">
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span>© 2026 Taskbito Inc. All rights reserved.</span>
        </div>

        <div className="flex gap-6">
          <a href="#" className="hover:text-neutral-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-neutral-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-neutral-600 transition-colors">Support Contact</a>
        </div>
      </footer>
    </div>
  );
}
