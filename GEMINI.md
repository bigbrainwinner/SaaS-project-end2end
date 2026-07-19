# GEMINI.md

Welcome to the Content Order & Task Management SaaS Dashboard! This document serves as a knowledge handoff and context file for subsequent AI models or developers working on this codebase.

---

## 🚀 App Overview

This is a modern **Next.js 16 (App Router)** and **React 19** application designed for managing and tracking content production tasks.

### Core Stack
- **Framework**: Next.js 16.2.10 (Turbopack) & React 19.2.4
- **Styling**: Tailwind CSS v4 & PostCSS (fully responsive, premium modern dark/light aesthetics)
- **Icons**: Lucide React
- **Database/Auth**: Integration with Supabase (includes schema files for auth, profiles, and order tables; supports local mock fallback if Supabase is unconfigured)
- **State Management**: React Context (`AppContext`) with automatic `localStorage` synchronization for client-side persistence

---

## 🛠 Features Done So Far

### 1. Dashboard Layout & Navigation
- **Responsive Navigation**: Includes a left navigation sidebar and a top breadcrumb bar.
- **Visual Cleanup**: Removed unnecessary chevron arrows from profile and workspace dropdown buttons to achieve a cleaner, premium design.
- **Notifications**: Implemented a "Notifications" tab in the sidebar navigation and a dedicated notifications panel.

### 2. Pipeline Breakdown & Donut Chart
- **Status Breakdown**: A responsive SVG Donut Chart showing the task status breakdown (Draft, In Progress, In Review, Completed) with custom tailwind-colored segments.
- **Smooth Draw Animation**: Implemented a page-load/refresh animation using React `useEffect` and CSS transition properties where segments draw themselves circular-motion style starting from zero.
- **Responsive Cutout Text**: Centered cutout text that dynamically states `{total} Total` (e.g. `5 Total`), adapting properly across standard desktop, tablet, and mobile layouts.

### 3. Task / Order Creation & Management
- **Task Creation Form**: Full multi-step form to define task titles, content type, word count, deadlines, target audience, tone, keywords, references, and upload attachments.
- **Task Details View**: Shows comprehensive details of any task with step tracking, attachments viewer, and update/delete actions.
- **Case Normalization**: Implemented a `toSentenceCase` utility in `lib/utils.ts` to automatically format user-typed task titles on save.
  - Ensures first-letter capitalization.
  - Smart handling: normalizes all-caps entries, but preserves mixed-case names (e.g., `SaaS`, `AWS`, `API`).
  - Integrated into state creations, edit updates, and database server actions.

---

## 📝 Guidelines for Future Models

When continuing development on this codebase, adhere to the following conventions:

### 💡 Store & State Updates
- Always use the App State Context `useApp()` from `@/lib/store/AppContext.tsx` for updating mock/client states.
- If editing task details or saving a task, make sure to keep task titles sentence-cased using `toSentenceCase` from `@/lib/utils.ts`.

### 🛡 Supabase Config & Server Actions
- Server actions reside in `lib/actions/` (e.g., `orders.ts` and `auth.ts`).
- Server actions use `isSupabaseConfigured()` to check if connection environment variables exist. If not configured, it fails gracefully and leaves the state to be handled locally in `AppContext` (localStorage). Maintain this duality!

### 🎨 Visual & Responsive Integrity
- The app uses custom CSS parameters and Tailwind CSS v4 features. Ensure component layouts remain responsive (`sm:`, `md:`, `lg:`, `xl:` variants).
- Use curated colors (`#8b5cf6`, `#f59e0b`, `#10b981`, `#94a3b8`) for dashboard and charts rather than standard default colors.
