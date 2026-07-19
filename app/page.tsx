'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import { 
  LayoutGrid, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Menu, 
  X, 
  ChevronDown,
  User,
  Users,
  MessageSquare,
  Download,
  AlertCircle
} from 'lucide-react';

export default function MarketingPage() {
  const router = useRouter();
  
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for interactive "Seamless Execution" step workflow
  const [activeStep, setActiveStep] = useState(0);

  // State for sequential blinking of "Designed for Elite Creators" steps
  const [activeCreatorStep, setActiveCreatorStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCreatorStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // State for FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const stepsData = [
    {
      title: "1. Brief Creation",
      shortDesc: "Draft full requirements",
      detailTitle: "Standardized Brief Editor",
      detailDesc: "Input targeted keywords, target audience definitions, word count goals, tone parameters, and drag-and-drop reference files. Normalizes task names to sentence-case dynamically on save.",
      previewType: "brief",
      mockupData: {
        title: "How to scale SaaS platforms in 2026",
        audience: "Growth Marketers",
        tone: "Professional, Authoritative",
        keywords: "SaaS growth, marketing automation, cloud scaling",
        wordCount: "2,500 words"
      }
    },
    {
      title: "2. Team Allocation",
      shortDesc: "Assign tasks to writers",
      detailTitle: "Real-time Pipeline Allocator",
      detailDesc: "Distribute drafts to copywriters or editors. Your status breakdown donut chart automatically updates and starts an elegant circular-drawing animation to display workload distributions.",
      previewType: "allocation",
      mockupData: {
        writer: "Alex Rivera",
        role: "Senior Copywriter",
        avatarInitial: "AR",
        status: "In Progress",
        pipelineStats: {
          draft: 2,
          inProgress: 4,
          inReview: 1,
          completed: 5
        }
      }
    },
    {
      title: "3. Review & Verification",
      shortDesc: "Comment & edit drafts",
      detailTitle: "Interactive Sign-off Portal",
      detailDesc: "Collaborate directly on active drafts. Clients and editors leave reviews, request structural updates, or transition tasks directly through Draft, In Progress, In Review, and Completed stages.",
      previewType: "review",
      mockupData: {
        approver: "Sarah Jenkins",
        role: "Creative Director",
        feedback: "Let's change the introductory hook to focus slightly more on conversion metrics. The rest of the content briefs looks extremely polished!",
        revisionCount: "Revision #1"
      }
    },
    {
      title: "4. Asset Delivery",
      shortDesc: "Download completed assets",
      detailTitle: "Secure File Locker & Archive",
      detailDesc: "Retrieve finalized deliverables immediately with automatic email notifications. Secure client compartments ensure Row-Level Security (RLS) protects data from unauthorized cross-client access.",
      previewType: "delivery",
      mockupData: {
        file: "saas_scaling_guide_final.docx",
        size: "4.2 MB",
        status: "Approved",
        deliveredAt: "Today, 10:45 AM"
      }
    }
  ];

  const faqs = [
    {
      question: "How does hi client guarantee that client projects are kept separate?",
      answer: "We use Supabase Row-Level Security (RLS) policies. Every time a query is executed, the database checks the user's active session, ensuring that clients can only access briefs, attachments, and activity logs associated with their own profile card."
    },
    {
      question: "Can I run this application without setting up Supabase variables?",
      answer: "Yes! hi client is engineered with a local mock fallback. If Supabase configuration environment variables are not detected, the app automatically transitions to client-side persistence (using localStorage) to let you test features seamlessly."
    },
    {
      question: "Are briefing fields fully customizable for different content formats?",
      answer: "Absolutely. Standard briefs support word counts, deadlines, target audience, tone of voice presets, custom keywords, reference URLs, and drag-and-drop structural media files."
    },
    {
      question: "What is the flat-rate Agency pricing plan policy?",
      answer: "Our Agency plan is priced at $149/month. This covers unlimited brief orders, unlimited client workspaces, and up to 10 GB of storage for files, references, and final deliverables. There are no per-seat fees."
    }
  ];



  return (
    <div className="min-h-screen bg-[#fafbfe] text-neutral-900 font-sans flex flex-col justify-between">
      {/* Decorative Aura Pattern */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[680px] w-full bg-white bg-[radial-gradient(100%_60%_at_50%_0%,#008fd8/6%,transparent_100%)]" />

      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-neutral-200/50 px-6 py-4 lg:px-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo matching sidebar */}
          <Logo size="sm" />
        </div>

        {/* Desktop Menu links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-neutral-500 uppercase tracking-wider">
          <a href="#product" className="hover:text-neutral-900 transition-colors">Product</a>
          <a href="#workflow" className="hover:text-neutral-900 transition-colors">Workflow</a>
          <a href="#creators" className="hover:text-neutral-900 transition-colors">Creators</a>
          <a href="#pricing" className="hover:text-neutral-900 transition-colors">Pricing</a>
        </nav>

        {/* CTA buttons */}
        <div className="flex items-center gap-4">
          <Link
            href="/auth/login"
            className="text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors hidden sm:block"
          >
            Sign In
          </Link>
          <Button href="/auth/signup" variant="primary" className="hidden sm:inline-block" innerClassName="py-2 px-4.5">
            Get Started
          </Button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-neutral-600 hover:text-neutral-900"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-100 px-6 py-4 flex flex-col gap-4 text-xs font-bold text-neutral-500 uppercase tracking-wider animate-fadeIn">
          <a href="#product" onClick={() => setMobileMenuOpen(false)} className="hover:text-neutral-900 py-1">Product</a>
          <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="hover:text-neutral-900 py-1">Workflow</a>
          <a href="#creators" onClick={() => setMobileMenuOpen(false)} className="hover:text-neutral-900 py-1">Creators</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-neutral-900 py-1">Pricing</a>
          <div className="pt-2 border-t border-neutral-100 flex flex-col gap-3">
            <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="text-neutral-600 py-1 text-center">Sign In</Link>
            <Button href="/auth/signup" variant="primary" onClick={() => setMobileMenuOpen(false)}>
              Get Started
            </Button>
          </div>
        </div>
      )}

      {/* 2. Main Content Body */}
      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section id="product" className="px-6 pt-16 pb-20 lg:px-16 max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Pane: Video (HTML video loaded from public folder) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-2xl border border-white/25 bg-slate-950 shadow-2xl overflow-hidden group w-full">
              
              {/* HTML5 video element loaded without aspect crop classes to ensure the orb is not cut off */}
              <video 
                src="/video_hero_final.webm" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-auto block object-contain"
              />

              {/* Glassmorphism Card 1: Top-Left */}
              <div className="absolute top-4 left-4 bg-slate-950/75 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-3 text-white flex items-center gap-2.5 max-w-[190px] transition-transform duration-200 hover:scale-[1.02] select-none">
                <div className="h-7 w-7 rounded-lg bg-violet-600 shadow-sm flex items-center justify-center shrink-0">
                  <Sparkles className="h-4 w-4 text-white animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white uppercase tracking-wider leading-none">Brief #2086</p>
                  <p className="text-[8px] text-slate-300 font-semibold mt-1">SEO Brief Approved</p>
                </div>
              </div>

              {/* Glassmorphism Card 2: Bottom-Right - Organic Traffic Graph */}
              <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-3.5 text-white w-[190px] transition-transform duration-200 hover:scale-[1.02] select-none">
                <div className="flex justify-between items-center mb-1 gap-2">
                  <span className="text-[8px] font-bold text-neutral-300 uppercase tracking-widest leading-none">Organic Traffic</span>
                  <span className="rounded bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 text-[7px] font-bold text-emerald-300 uppercase leading-none">+24.8%</span>
                </div>
                <p className="text-sm font-extrabold text-white leading-none">14,280 <span className="text-[8px] text-neutral-400 font-medium">/ mo</span></p>
                <div className="mt-2.5">
                  <svg className="w-full h-9" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#008fd8" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#008fd8" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Area under the curve */}
                    <path d="M0 25 Q15 15, 30 18 T60 8 T90 5 L100 5 L100 30 L0 30 Z" fill="url(#trafficGradient)" />
                    {/* Line curve */}
                    <path d="M0 25 Q15 15, 30 18 T60 8 T90 5 L100 5" stroke="#008fd8" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Indicator dot */}
                    <circle cx="100" cy="5" r="2" fill="#008fd8" />
                    <circle cx="100" cy="5" r="4" stroke="#008fd8" strokeWidth="1" strokeOpacity="0.4" className="animate-ping" style={{ transformOrigin: '100px 5px' }} />
                  </svg>
                </div>
              </div>

            </div>
          </div>

          {/* Right Hero Pane: Headlines & CTA */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
            {/* Top Avatars badge */}
            <div className="inline-flex items-center gap-3 bg-white border border-neutral-200/60 rounded-full px-3 py-1 text-[10px] font-bold text-neutral-600 shadow-sm">
              <div className="flex -space-x-1.5 overflow-hidden">
                <img className="inline-block h-4.5 w-4.5 rounded-full ring-2 ring-white object-cover" src="/avatar_sj.png" alt="SJ" />
                <img className="inline-block h-4.5 w-4.5 rounded-full ring-2 ring-white object-cover" src="/avatar_ar.png" alt="AR" />
                <img className="inline-block h-4.5 w-4.5 rounded-full ring-2 ring-white object-cover" src="/avatar_mv.png" alt="MV" />
              </div>
              <span>Join 10,000+ teams scaling content with hi client</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-955 sm:text-6xl leading-[1.08] font-sans">
              Build High Performing <br />
              <span className="text-violet-600">Content Pipelines</span> Effortlessly.
            </h1>

            <p className="text-sm text-neutral-500 font-medium leading-relaxed max-w-xl">
              Stop losing briefs in emails and spreadsheets. hi client provides a premium, client-facing portal to draft instructions, assign content creators, monitor milestones, and retrieve finished copy safely.
            </p>

            {/* Get Started CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-4 max-w-lg pt-1">
              <Button href="/auth/signup" variant="primary" className="w-full sm:w-auto" innerClassName="py-3.5 px-8 flex items-center justify-center gap-2">
                Get Started
                <ArrowRight className="h-4.5 w-4.5" />
              </Button>
              <Button href="/auth/signup" variant="secondary" className="w-full sm:w-auto" innerClassName="py-3.5 px-8 flex items-center justify-center gap-2">
                Book a Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-violet-600" />
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-violet-600" />
                <span>Local Mock Mode Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* HYPOTHETICAL LOGOS SECTION */}
        <section className="border-y border-neutral-200/50 bg-white py-10 px-6 lg:px-16 text-center">
          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-6">
            Supporting content creators at global agencies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 max-w-4xl mx-auto">
            {["Google", "Higgsfield", "Protein House", "Facebook", "Meta", "OpenAI"].map((brand) => (
              <span 
                key={brand}
                className="text-xs font-extrabold tracking-tight text-neutral-300 hover:text-neutral-500 transition-colors select-none font-sans uppercase"
              >
                {brand}
              </span>
            ))}
          </div>
        </section>

        {/* "ELEVATING CREATIVE COLLABORATION" SECTION */}
        <section className="px-6 py-20 lg:px-16 max-w-6xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-violet-600 uppercase tracking-wider block">Features & Ecosystem</span>
              <h2 className="text-3xl font-extrabold tracking-tight text-neutral-950 font-sans">
                Elevating Creative Collaboration.
              </h2>
            </div>
            <p className="text-xs text-neutral-400 font-bold max-w-xs md:text-right uppercase tracking-wider leading-relaxed">
              Unified components built specifically to accelerate brief approval cycles.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Active Task Rooms",
                description: "Clean client workspaces allowing editors and customers to review briefs and download drafts safely.",
                icon: LayoutGrid
              },
              {
                title: "Standardized Briefings",
                description: "Capture exact instructions, words, reference links, and tone definitions to start writing without friction.",
                icon: FileText
              },
              {
                title: "Secure RLS Compartments",
                description: "Leverage Row-Level Security parameters in Postgres SQL database to isolate and protect client information.",
                icon: ShieldCheck
              }
            ].map((feat) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={feat.title}
                  className="rounded-2xl border border-neutral-200/60 bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/5 text-violet-600 mb-6">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-extrabold text-neutral-900">{feat.title}</h3>
                  <p className="text-xs text-neutral-500 mt-3 leading-relaxed font-medium">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* "SEAMLESS EXECUTION, START TO FINISH" INTERACTIVE COMPONENT */}
        <section id="workflow" className="px-6 py-20 lg:px-16 bg-[#f4f6fb] border-y border-neutral-200/40">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-violet-600 uppercase tracking-wider block">Interactive Walkthrough</span>
                <h2 className="text-3xl font-extrabold tracking-tight text-neutral-950 font-sans">
                  Seamless Execution, Start To Finish.
                </h2>
              </div>
              <p className="text-xs text-neutral-400 font-bold max-w-sm md:text-right uppercase tracking-wider leading-relaxed">
                Click steps on the left to see how hi client updates project statuses.
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-12 items-center">
              {/* Left Column: Interactive vertical list */}
              <div className="lg:col-span-5 space-y-3">
                {stepsData.map((step, idx) => {
                  const isActive = activeStep === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveStep(idx)}
                      className={`w-full text-left p-5 rounded-2xl border transition-all flex items-start justify-between cursor-pointer ${
                        isActive 
                          ? "bg-white border-violet-200 shadow-md shadow-violet-600/5 translate-x-1" 
                          : "bg-transparent border-transparent hover:bg-white/40"
                      }`}
                    >
                      <div>
                        <h4 className={`text-xs font-bold ${isActive ? "text-violet-600" : "text-neutral-800"}`}>
                          {step.title}
                        </h4>
                        <p className="text-[10px] text-neutral-400 font-medium mt-1 uppercase tracking-wider">
                          {step.shortDesc}
                        </p>
                      </div>
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        isActive ? "bg-violet-600 text-white" : "bg-neutral-200 text-neutral-500"
                      }`}>
                        {idx + 1}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Visual Mockup Showcase representing the active step */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 p-6 shadow-xl relative min-h-[290px] flex flex-col justify-between">
                
                {/* Simulated browser header */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
                    <div className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
                    <div className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest ml-3">
                      {stepsData[activeStep].detailTitle}
                    </span>
                  </div>
                  <span className="rounded-full bg-violet-600/5 px-2.5 py-0.5 text-[9px] font-bold text-violet-600 uppercase tracking-wider">
                    Step {activeStep + 1} of 4
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-center space-y-4">
                  {/* Dynamic interactive render based on step */}
                  {stepsData[activeStep].previewType === "brief" && (
                    <div className="space-y-3 bg-slate-50 border border-neutral-100 rounded-xl p-4 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-extrabold text-neutral-400 uppercase tracking-wider">Title (Sentence-Cased)</span>
                        <span className="rounded bg-slate-200 text-slate-600 px-1.5 py-0.2 text-[8px] font-bold">Auto</span>
                      </div>
                      <p className="text-xs font-bold text-neutral-800">
                        {stepsData[activeStep].mockupData.title}
                      </p>
                      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-200/50 text-[10px]">
                        <div>
                          <span className="text-neutral-400 font-medium">Audience:</span>
                          <p className="font-bold text-neutral-700">{stepsData[activeStep].mockupData.audience}</p>
                        </div>
                        <div>
                          <span className="text-neutral-400 font-medium">Tone:</span>
                          <p className="font-bold text-neutral-700">{stepsData[activeStep].mockupData.tone}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {stepsData[activeStep].previewType === "allocation" && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex items-center gap-3 bg-violet-600/5 border border-violet-100 rounded-xl p-3.5">
                        <div className="h-8 w-8 rounded-full bg-violet-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                          {stepsData[activeStep].mockupData.avatarInitial}
                        </div>
                        <div>
                          <h5 className="text-xs font-extrabold text-neutral-900">{stepsData[activeStep].mockupData.writer}</h5>
                          <p className="text-[9px] text-neutral-400 font-medium">{stepsData[activeStep].mockupData.role}</p>
                        </div>
                        <span className="ml-auto rounded-full bg-violet-500/10 px-2 py-0.5 text-[8px] font-bold text-violet-600 uppercase tracking-wider">
                          {stepsData[activeStep].mockupData.status}
                        </span>
                      </div>

                      {/* Donut summary indicators */}
                      <div className="flex items-center gap-4 text-[9px] font-bold text-neutral-500 justify-center">
                        <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-amber-400" /><span>Draft: 2</span></div>
                        <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-indigo-500" /><span>In Progress: 4</span></div>
                        <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-emerald-500" /><span>Completed: 5</span></div>
                      </div>
                    </div>
                  )}

                  {stepsData[activeStep].previewType === "review" && (
                    <div className="space-y-3 bg-amber-500/5 border border-amber-100 rounded-xl p-4 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-extrabold text-amber-800">FEEDBACK FROM CLIENT</span>
                        </div>
                        <span className="text-[9px] font-extrabold text-amber-700 bg-amber-100 rounded px-1.5 py-0.2">
                          {stepsData[activeStep].mockupData.revisionCount}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-700 italic leading-relaxed">
                        "{stepsData[activeStep].mockupData.feedback}"
                      </p>
                      <p className="text-[9px] text-neutral-400 font-bold text-right uppercase">
                        — {stepsData[activeStep].mockupData.approver} ({stepsData[activeStep].mockupData.role})
                      </p>
                    </div>
                  )}

                  {stepsData[activeStep].previewType === "delivery" && (
                    <div className="space-y-3 bg-emerald-500/5 border border-emerald-100 rounded-xl p-4 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                            <Download className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-neutral-900">{stepsData[activeStep].mockupData.file}</p>
                            <p className="text-[9px] text-neutral-400 font-medium">{stepsData[activeStep].mockupData.size}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[8px] font-bold text-emerald-700 uppercase tracking-wider">
                          {stepsData[activeStep].mockupData.status}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-emerald-100/50 flex justify-between text-[9px] font-bold text-neutral-400 uppercase">
                        <span>Database Sync: Verified</span>
                        <span>{stepsData[activeStep].mockupData.deliveredAt}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-100 text-[10px] text-neutral-400 leading-relaxed">
                  {stepsData[activeStep].detailDesc}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* "DESIGNED FOR ELITE CREATORS" SECTION */}
        <section id="creators" className="px-6 py-20 lg:px-16 max-w-6xl mx-auto space-y-16 text-center">
          <div className="space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] font-extrabold text-violet-600 uppercase tracking-wider block">Production Workforces</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-950 font-sans">
              Designed For Elite Creators.
            </h2>
            <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
              Connected brief pipelines linking clients directly with copywriting specialists.
            </p>
          </div>

          {/* SVG Dotted Line Pipeline Visual */}
          <div className="relative border border-neutral-200/60 bg-white rounded-2xl p-8 lg:p-12 shadow-sm overflow-hidden">
            {/* Background grid line pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-40 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-around gap-8 md:gap-4">
              
              {/* Creator Card 1 */}
              <div className={`flex flex-col items-center text-center space-y-3 bg-[#fafbfe] border rounded-xl p-4 w-40 shadow-sm transition-all duration-300 ${
                activeCreatorStep === 0 
                  ? "animate-pulse border-violet-500/50 ring-1 ring-violet-500/30 shadow-md scale-105" 
                  : "border-neutral-100"
              }`}>
                <div className="h-10 w-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-extrabold text-xs">
                  C
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-800">Brief Creator</h4>
                  <p className="text-[8px] text-neutral-400 uppercase font-bold tracking-wider mt-0.5">Manager / Client</p>
                </div>
              </div>

              {/* Connected Arrow */}
              <div className="hidden md:block text-neutral-300">
                <span className="text-xl">➔</span>
              </div>

              {/* Creator Card 2 */}
              <div className={`flex flex-col items-center text-center space-y-3 bg-[#fafbfe] border rounded-xl p-4 w-40 shadow-sm transition-all duration-300 ${
                activeCreatorStep === 1 
                  ? "animate-pulse border-indigo-500/50 ring-1 ring-indigo-500/30 shadow-md scale-105" 
                  : "border-neutral-100"
              }`}>
                <div className="h-10 w-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-extrabold text-xs">
                  W
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-800">Copywriter</h4>
                  <p className="text-[8px] text-neutral-400 uppercase font-bold tracking-wider mt-0.5">Drafting Asset</p>
                </div>
              </div>

              {/* Connected Arrow */}
              <div className="hidden md:block text-neutral-300">
                <span className="text-xl">➔</span>
              </div>

              {/* Creator Card 3 */}
              <div className={`flex flex-col items-center text-center space-y-3 bg-[#fafbfe] border rounded-xl p-4 w-40 shadow-sm transition-all duration-300 ${
                activeCreatorStep === 2 
                  ? "animate-pulse border-amber-500/50 ring-1 ring-amber-500/30 shadow-md scale-105" 
                  : "border-neutral-100"
              }`}>
                <div className="h-10 w-10 rounded-full bg-amber-400 text-neutral-800 flex items-center justify-center font-extrabold text-xs">
                  E
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-800">Editorial Reviewer</h4>
                  <p className="text-[8px] text-neutral-400 uppercase font-bold tracking-wider mt-0.5">Verifying SEO</p>
                </div>
              </div>

              {/* Connected Arrow */}
              <div className="hidden md:block text-neutral-300">
                <span className="text-xl">➔</span>
              </div>

              {/* Creator Card 4 */}
              <div className={`flex flex-col items-center text-center space-y-3 bg-[#fafbfe] border rounded-xl p-4 w-40 shadow-sm transition-all duration-300 ${
                activeCreatorStep === 3 
                  ? "animate-pulse border-emerald-500/50 ring-1 ring-emerald-500/30 shadow-md scale-105" 
                  : "border-neutral-100"
              }`}>
                <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-extrabold text-xs">
                  ✓
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-800">Client Approver</h4>
                  <p className="text-[8px] text-neutral-400 uppercase font-bold tracking-wider mt-0.5">Asset Delivered</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* HYPOTHETICAL PRICING SECTION */}
        <section id="pricing" className="px-6 py-20 lg:px-16 bg-[#fafbfe] border-t border-neutral-200/50 max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-[10px] font-extrabold text-violet-600 uppercase tracking-wider block">Pricing Plans</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-950 font-sans">
              Flexible Plans Built For Creators & Teams
            </h2>
            <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
              Choose the perfect tier to manage and scale your content pipelines.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Plan 1: Starter */}
            <div className="bg-white rounded-2xl border border-neutral-200/60 p-8 shadow-sm flex flex-col justify-between relative transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-neutral-900">Starter</h3>
                  <p className="text-[10px] text-neutral-400 font-semibold mt-1">Perfect for solo creators starting out</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-neutral-955">$49</span>
                  <span className="text-xs text-neutral-400 font-bold">/ month</span>
                </div>
                <ul className="space-y-3.5 pt-2">
                  <li className="flex items-start gap-2.5 text-xs text-neutral-600 font-medium">
                     <CheckCircle className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                    <span>5 Active Content Pipelines</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-neutral-600 font-medium">
                     <CheckCircle className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                    <span>Up to 15 briefs / month</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-neutral-600 font-medium">
                     <CheckCircle className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                    <span>Row-Level Security (RLS) folders</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-neutral-600 font-medium">
                     <CheckCircle className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                    <span>Local SQLite Sandbox fallback</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Button
                  href="/auth/signup"
                  variant="secondary"
                  fullWidth={true}
                  innerClassName="py-3 px-4"
                >
                  Get Started
                </Button>
              </div>
            </div>

            {/* Plan 2: Pro (Popular) */}
            <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 p-8 shadow-md flex flex-col justify-between relative transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-4 py-1 text-[9px] font-extrabold uppercase tracking-widest text-white shadow-md">
                Most Popular
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-white">Pro</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">For growing teams & scaling publishers</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">$99</span>
                  <span className="text-xs text-slate-400 font-bold">/ month</span>
                </div>
                <ul className="space-y-3.5 pt-2">
                  <li className="flex items-start gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>Unlimited Content Pipelines</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>50 Automated briefs / month</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>Priority writer assignments</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>Advanced analytics & donut charts</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                    <span>24/7 Priority support</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Button
                  href="/auth/signup"
                  variant="primary"
                  fullWidth={true}
                  innerClassName="py-3 px-4"
                >
                  Start Pro Trial
                </Button>
              </div>
            </div>

            {/* Plan 3: Enterprise */}
            <div className="bg-white rounded-2xl border border-neutral-200/60 p-8 shadow-sm flex flex-col justify-between relative transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold text-neutral-900">Enterprise</h3>
                  <p className="text-[10px] text-neutral-400 font-semibold mt-1">Bespoke workflows for scaling companies</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-neutral-955">Custom</span>
                </div>
                <ul className="space-y-3.5 pt-2">
                  <li className="flex items-start gap-2.5 text-xs text-neutral-600 font-medium">
                     <CheckCircle className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                    <span>Everything in Pro plan</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-neutral-600 font-medium">
                     <CheckCircle className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                    <span>Bespoke Supabase DB integrations</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-neutral-600 font-medium">
                     <CheckCircle className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                    <span>Dedicated client compartments</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-neutral-600 font-medium">
                     <CheckCircle className="h-4 w-4 text-violet-600 shrink-0 mt-0.5" />
                    <span>Custom SLAs & Dedicated TAM</span>
                  </li>
                </ul>
              </div>
              <div className="pt-8">
                <Button
                  href="/auth/signup"
                  variant="secondary"
                  fullWidth={true}
                  innerClassName="py-3 px-4"
                >
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* "SECURE YOUR UNIQUE IDENTITY BEFORE ANYONE ELSE DOES" - FAQ Accordions */}
        <section className="px-6 py-20 lg:px-16 bg-white border-t border-neutral-200/50 max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-extrabold text-violet-600 uppercase tracking-wider block">Frequently Answered</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-neutral-950 font-sans">
              Secure Your Unique Identity Before Anyone Else Does.
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl border border-neutral-200/60 overflow-hidden bg-white shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-6 flex justify-between items-center font-bold text-neutral-800 text-xs sm:text-sm cursor-pointer select-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`h-4.5 w-4.5 text-neutral-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-6 text-xs text-neutral-500 font-medium leading-relaxed border-t border-neutral-100 pt-4 animate-slideDown">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM CTA GRADIENT SECTION */}
        <section className="px-6 py-20 lg:px-16 max-w-6xl mx-auto">
          <div className="relative rounded-3xl bg-slate-950 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
            {/* Floating glowing backgrounds */}
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-violet-600/10 blur-[80px]" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-600/15 blur-[80px]" />

            <div className="relative z-10 text-center space-y-8 max-w-2xl mx-auto">
              <span className="text-[10px] font-extrabold text-violet-400 uppercase tracking-wider block">Join The Elite</span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Join An Elite Network Shaping The Future Of Production.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed max-w-lg mx-auto">
                Ready to cut briefing overhead, structure client folders, and organize feedback in real time? Create your account today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/auth/signup"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-xs font-bold text-white transition-all hover:bg-violet-700 active:scale-[0.98]"
                >
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/auth/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/60 px-6 py-3 text-xs font-bold text-neutral-400 hover:text-white transition-all"
                >
                  Log In Instead
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 3. Footer */}
      <footer className="border-t border-neutral-200/60 bg-white py-12 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-xs font-medium text-neutral-400">
          
          {/* Column 1: Brand details */}
          <div className="space-y-4">
            <Logo size="xs" />
            <p className="text-[10px] text-neutral-400 leading-relaxed">
              Standardize your briefings, assign creative tasks, and sign off deliverables in a unified workspace.
            </p>
            <p className="text-[9px] font-semibold">
              © 2026 hi client Inc. All rights reserved.
            </p>
          </div>

          {/* Column 2: Product features */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold text-neutral-900 uppercase tracking-widest">Product</h4>
            <ul className="space-y-2 text-[10px]">
              <li><a href="#product" className="hover:text-neutral-600 transition-colors">Features Grid</a></li>
              <li><a href="#workflow" className="hover:text-neutral-600 transition-colors">Interactive Pipeline</a></li>
              <li><a href="#creators" className="hover:text-neutral-600 transition-colors">Creator Networks</a></li>
              <li><a href="/dashboard" className="hover:text-neutral-600 transition-colors">User Dashboard</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold text-neutral-900 uppercase tracking-widest">Resources</h4>
            <ul className="space-y-2 text-[10px]">
              <li><a href="#" className="hover:text-neutral-600 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-neutral-600 transition-colors">Supabase Schema SQL</a></li>
              <li><a href="#" className="hover:text-neutral-600 transition-colors">Client API Fallbacks</a></li>
              <li><a href="#" className="hover:text-neutral-600 transition-colors">Privacy & Terms</a></li>
            </ul>
          </div>

          {/* Column 4: Contact/Support */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-extrabold text-neutral-900 uppercase tracking-widest">Support</h4>
            <ul className="space-y-2 text-[10px]">
              <li><a href="#" className="hover:text-neutral-600 transition-colors">Help Desk Portal</a></li>
              <li><a href="#" className="hover:text-neutral-600 transition-colors">Technical Live Status</a></li>
              <li><a href="#" className="hover:text-neutral-600 transition-colors">Contact Developers</a></li>
              <li><a href="#" className="hover:text-neutral-600 transition-colors">Local Sandbox Mode</a></li>
            </ul>
          </div>

        </div>
      </footer>
    </div>
  );
}
