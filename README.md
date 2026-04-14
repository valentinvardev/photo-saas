# FRAME — Photographer SaaS Platform

A full-stack SaaS platform built for professional photographers. FRAME lets photographers build portfolio websites, manage client deliveries, create link pages, and sell their work — all from a single dashboard.

---

## Overview

FRAME is structured around four core products:

| Product | Route | Description |
|---|---|---|
| **Gallery** | `/dashboard/gallery` | Master photo library — upload, organize, and manage all photos |
| **Portfolio** | `/dashboard/portfolio` | Build and publish portfolio websites with custom domains |
| **Links** | `/dashboard/links` | Custom link page builder (linktree-style) |
| **Delivery** | `/dashboard/delivery` | Client gallery delivery with access control and monetization |
| **Templates** | `/dashboard/templates` | Template picker for Portfolio, Links, and Delivery formats |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 + CSS custom properties (`var(--bg)`, `var(--fg)`, etc.) |
| Animations | [Framer Motion](https://www.framer-motion.com) |
| Auth | [NextAuth.js v5](https://next-auth.js.org) (beta) |
| ORM | [Prisma](https://prisma.io) + PostgreSQL (Supabase) |
| API | [tRPC v11](https://trpc.io) + [TanStack Query v5](https://tanstack.com/query) |
| State | [Zustand](https://zustand-demo.pmnd.rs) + [Zundo](https://github.com/charkour/zundo) (undo/redo) |
| Editor | [Tiptap](https://tiptap.dev) (rich text) |
| Validation | [Zod](https://zod.dev) |
| Fonts | `@fontsource/*` (self-hosted) + Google Fonts (runtime injection) |

Bootstrapped with [create-t3-app](https://create.t3.gg/).

---

## Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── gallery/        # Photo library
│   │   ├── portfolio/      # Portfolio builder + Domains tab
│   │   ├── links/          # Link page builder
│   │   ├── delivery/       # Client delivery gallery builder
│   │   ├── templates/      # Template gallery (Portfolio / Links / Delivery)
│   │   ├── settings/       # Account & integrations (MercadoPago, etc.)
│   │   └── profile/        # User profile
│   ├── editor/             # Full-screen portfolio page editor
│   ├── templates/          # Public template preview pages
│   ├── login/              # Auth pages
│   └── register/
├── components/
│   ├── dashboard/
│   │   ├── Sidebar.tsx     # Nav sidebar (Gallery, Portfolio, Links, Delivery, Templates...)
│   │   └── Header.tsx      # Top bar with balance chip and notifications
│   ├── editor/             # Portfolio page editor components
│   ├── landing/            # Marketing landing page components
│   └── providers/
│       └── ThemeProvider.tsx  # Dark/light theme toggle (persisted to localStorage)
├── server/                 # tRPC routers and server-side logic
└── trpc/                   # tRPC client setup
prisma/
└── schema.prisma           # PostgreSQL schema (User, Account, Session, Post)
```

---

## Dashboard Features

### Gallery
- Upload and manage the master photo library
- Photos are sourced across all other products (delivery, portfolio covers, etc.)

### Portfolio
- Create multiple portfolio sites, each with its own slug and optional custom domain
- **Portfolios tab** — card grid with status (Published / Draft), visit stats, sparkline, and a three-dot menu
- **Domains tab** — search and purchase domains (`.com`, `.photo`, `.studio`, etc.), assign them to a portfolio or link page

### Links
- Custom link page builder with live phone preview
- **Links tab** — add, reorder (drag & drop), toggle visibility per link
- **Appearance tab** — background (solid / gradient / image), button style (pill / rounded / square / outline), font family + weight, text and button colors
- 16+ Google Fonts loaded dynamically at runtime
- Templates available in the Templates page

### Delivery
- Per-client gallery delivery builder with split-panel layout (controls left, live preview right)
- **Deliverable Gallery** — photo picker modal: general gallery on the left, client selection on the right
- **Access** — password protection, expiry date, client email whitelist
- **Monetization** — three modes: Gift (free download), Direct sale (per-photo + full-gallery pricing), Selection (client picks N favorites). Watermark, download resolution, proofing mode
- **Look & Feel** — template picker modal (Minimal / Vogue / Cinematic / Editorial) with live preview, grid vs masonry layout, welcome message
- Desktop browser mockup + mobile phone mockup preview toggle
- List view cards: cover image, status badge, mode badge, photo count, security icons

### Templates
Three-tab template gallery:
- **Portfolio** — editorial-style template cards with category filter (Minimal / Editorial / Magazine / Story / Grid). Featured template shown with yellow outline + "In use" badge
- **Links** — phone mockup previews with real button styling rendered inline
- **Delivery** — mini gallery grid previews with each template's actual color scheme

### Settings
- Account details
- Payment integration (MercadoPago — official brand logo)

---

## Theme System

Two themes: `dark` (default) and `light`. Toggled via the sidebar button and persisted to `localStorage`.

CSS custom properties used throughout:

| Variable | Purpose |
|---|---|
| `--bg` | Page background |
| `--bg-card` | Card / panel background |
| `--bg-subtle` | Hover backgrounds, inputs |
| `--fg` | Primary text |
| `--fg-muted` | Secondary text, icons |
| `--border` | Borders and dividers |
| `yellow` (Tailwind) | Brand accent (`#fad502`) |

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (Supabase recommended)

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database and auth credentials
# DATABASE_URL=postgresql://...
# DIRECT_URL=postgresql://...
# AUTH_SECRET=...

# Push schema to database
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run typecheck` | Run TypeScript type-check |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:generate` | Run Prisma migrations (dev) |
| `npm run db:migrate` | Deploy Prisma migrations (prod) |
| `npm run db:studio` | Open Prisma Studio |

---

## Environment Variables

```env
# Database (Supabase / PostgreSQL)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:6543/DATABASE?pgbouncer=true
DIRECT_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE

# NextAuth
AUTH_SECRET=your-secret-here
```

---

## Deployment

Designed to deploy on [Vercel](https://vercel.com). Set the environment variables in your Vercel project settings and connect the GitHub repository.
