"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ══════════════════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════════════════ */

type ProductType = "portfolio" | "links" | "delivery";
type PortfolioCategory = "All" | "Minimal" | "Editorial" | "Magazine" | "Story" | "Grid";

/* ══════════════════════════════════════════════════════════════════════════
   PORTFOLIO TEMPLATES
══════════════════════════════════════════════════════════════════════════ */

type PortfolioTemplate = {
  id: string;
  name: string;
  description: string;
  category: PortfolioCategory;
  tags: string[];
  href: string | null;
  editorHref?: string;
  seed: number;
  new?: boolean;
  featured?: boolean;
  fonts: { serif: string; sans: string; mono: string };
};

const PORTFOLIO_TEMPLATES: PortfolioTemplate[] = [
  {
    id: "minimal-bw",
    name: "Minimal BW",
    description: "A refined, black-and-white portfolio focused on editorial photography. Clean typography and generous whitespace.",
    category: "Minimal",
    tags: ["Black & White", "Portrait", "Documentary"],
    href: "/templates/minimal-bw",
    editorHref: "/editor/minimal-bw",
    seed: 201,
    new: true,
    featured: true,
    fonts: { serif: "Cormorant Garamond", sans: "DM Sans", mono: "Space Mono" },
  },
  {
    id: "editorial-dark",
    name: "Editorial Dark",
    description: "High-contrast dark theme with bold serif headings. Ideal for fashion and commercial photographers.",
    category: "Editorial",
    tags: ["Dark", "Fashion", "Commercial"],
    href: null,
    seed: 37,
    fonts: { serif: "Freight Display", sans: "Neue Haas Grotesk", mono: "Input Mono" },
  },
  {
    id: "magazine",
    name: "Magazine",
    description: "A multi-column, editorial magazine layout. Dense and expressive, perfect for storytellers.",
    category: "Magazine",
    tags: ["Editorial", "Multi-column", "Story"],
    href: null,
    seed: 63,
    fonts: { serif: "Canela", sans: "Söhne", mono: "Pitch" },
  },
  {
    id: "grid-pure",
    name: "Grid Pure",
    description: "A full-bleed masonry grid with a single fixed navigation. Lets the work speak for itself.",
    category: "Grid",
    tags: ["Minimal", "Grid", "Full-bleed"],
    href: null,
    seed: 88,
    fonts: { serif: "Domaine", sans: "Inter", mono: "Berkeley Mono" },
  },
  {
    id: "story",
    name: "Story",
    description: "Vertical scroll narrative with immersive full-screen images and a flowing text column.",
    category: "Story",
    tags: ["Narrative", "Documentary", "Long-form"],
    href: null,
    seed: 110,
    fonts: { serif: "Tiempos", sans: "Aktiv Grotesk", mono: "Fira Code" },
  },
  {
    id: "editorial-sand",
    name: "Editorial Sand",
    description: "Warm neutral tones with a classic editorial grid. Great for fine-art and portrait work.",
    category: "Editorial",
    tags: ["Warm tones", "Fine Art", "Portrait"],
    href: null,
    seed: 154,
    fonts: { serif: "EB Garamond", sans: "GT Walsheim", mono: "Inconsolata" },
  },
];

const PORTFOLIO_CATEGORIES: PortfolioCategory[] = ["All", "Minimal", "Editorial", "Magazine", "Story", "Grid"];

/* ══════════════════════════════════════════════════════════════════════════
   LINKS TEMPLATES
══════════════════════════════════════════════════════════════════════════ */

type LinksTemplate = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  available: boolean;
  new?: boolean;
  bg: string;
  fg: string;
  sub: string;
  btnStyle: "pill" | "rounded" | "square" | "outline";
  btnBg: string;
  btnFg: string;
  font: string;
};

const LINKS_TEMPLATES: LinksTemplate[] = [
  {
    id: "links-clean",
    name: "Clean",
    description: "Minimal centered layout, white background, subtle pill buttons. Professional and versatile.",
    tags: ["Minimal", "Professional", "Light"],
    available: true, new: true,
    bg: "#ffffff", fg: "#111111", sub: "#888888",
    btnStyle: "pill", btnBg: "#111111", btnFg: "#ffffff", font: "DM Sans",
  },
  {
    id: "links-dark",
    name: "Noir",
    description: "All-black layout with sharp square buttons. Bold, editorial, high-contrast.",
    tags: ["Dark", "Editorial", "Bold"],
    available: true,
    bg: "#111111", fg: "#f5f5f5", sub: "#666666",
    btnStyle: "square", btnBg: "#f5f5f5", btnFg: "#111111", font: "Space Grotesk",
  },
  {
    id: "links-sand",
    name: "Sand",
    description: "Warm off-white palette with rounded buttons. Approachable and elegant for lifestyle photographers.",
    tags: ["Warm", "Lifestyle", "Soft"],
    available: false,
    bg: "#f5f0e8", fg: "#2d2420", sub: "#9e8e7e",
    btnStyle: "rounded", btnBg: "#2d2420", btnFg: "#f5f0e8", font: "Cormorant Garamond",
  },
  {
    id: "links-gradient",
    name: "Gradient",
    description: "Dark gradient background with glowing pill buttons. Modern, social-native look.",
    tags: ["Modern", "Social", "Glow"],
    available: false,
    bg: "#0d0d1a", fg: "#f0f0ff", sub: "#6060a0",
    btnStyle: "pill", btnBg: "#fad502", btnFg: "#0d0d1a", font: "Inter",
  },
  {
    id: "links-photo",
    name: "Immersive",
    description: "Full-bleed background photo with frosted-glass buttons overlaid. Striking and unique.",
    tags: ["Photo", "Full-bleed", "Glass"],
    available: false,
    bg: "#1a1a1a", fg: "#ffffff", sub: "#aaaaaa",
    btnStyle: "outline", btnBg: "rgba(255,255,255,0.12)", btnFg: "#ffffff", font: "Helvetica Neue",
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   DELIVERY TEMPLATES
══════════════════════════════════════════════════════════════════════════ */

type DeliveryTemplate = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  available: boolean;
  new?: boolean;
  accent: string;
  fg: string;
  sub: string;
};

const DELIVERY_TEMPLATES: DeliveryTemplate[] = [
  {
    id: "delivery-minimal",
    name: "Minimal",
    description: "Clean white space, serif headings, and a strict grid. Lets your photography take center stage.",
    tags: ["Minimal", "Portrait", "Fine Art"],
    available: true, new: true,
    accent: "#f5f5f5", fg: "#111111", sub: "#888888",
  },
  {
    id: "delivery-vogue",
    name: "Vogue",
    description: "High-contrast black with bold editorial typography. Perfect for fashion and commercial work.",
    tags: ["Dark", "Fashion", "Editorial"],
    available: true,
    accent: "#111111", fg: "#ffffff", sub: "#666666",
  },
  {
    id: "delivery-cinematic",
    name: "Cinematic",
    description: "Dark dramatic tones with warm film undertones. Ideal for wedding and lifestyle galleries.",
    tags: ["Dark", "Wedding", "Cinematic"],
    available: false,
    accent: "#1a1209", fg: "#e8dcc8", sub: "#7a6a50",
  },
  {
    id: "delivery-editorial",
    name: "Editorial",
    description: "Magazine-style layout with oversized type and neutral linen palette. Elevated and timeless.",
    tags: ["Magazine", "Fine Art", "Neutral"],
    available: false,
    accent: "#f0ede8", fg: "#1a1a1a", sub: "#7a7065",
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   SHARED ICONS
══════════════════════════════════════════════════════════════════════════ */

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PORTFOLIO CARDS
══════════════════════════════════════════════════════════════════════════ */

function PortfolioCard({ t, index, featured }: { t: PortfolioTemplate; index: number; featured?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`group overflow-hidden flex flex-col bg-[var(--bg-card)] transition-all ${
        featured ? "border-2 border-yellow" : "border border-[var(--border)] hover:border-[var(--fg-muted)]"
      }`}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://picsum.photos/seed/${t.seed}/800/500?grayscale`} alt={t.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ filter: "brightness(0.88)" }} />
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-250 bg-black/40">
          {t.href ? (
            <Link href={t.href} target="_blank"
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#111] font-sans text-[11px] font-semibold hover:bg-yellow transition-colors">
              <ArrowIcon /> Preview
            </Link>
          ) : (
            <span className="flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-mono text-[10px]">
              <LockIcon /> Soon
            </span>
          )}
        </div>
        <div className="absolute top-0 left-0 right-0 h-5 bg-black/40 backdrop-blur-sm flex items-center px-2 gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" /><div className="w-1.5 h-1.5 rounded-full bg-white/20" /><div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>
        {t.new && <div className="absolute top-5 left-2 bg-yellow text-[#111] font-mono text-[8px] font-bold px-1.5 py-0.5 tracking-widest uppercase">New</div>}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-sans font-bold text-[var(--fg)] text-sm">{t.name}</h3>
            <span className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-wider">{t.category}</span>
          </div>
          {featured
            ? <span className="font-mono text-[9px] text-yellow bg-yellow/10 border border-yellow/30 px-1.5 py-0.5 shrink-0">In use</span>
            : !t.href && <span className="flex items-center gap-1 font-mono text-[9px] text-[var(--fg-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.5 shrink-0"><LockIcon /> Soon</span>
          }
        </div>
        <p className="font-sans text-[11px] font-light text-[var(--fg-muted)] leading-relaxed flex-1">{t.description}</p>
        <div className="flex flex-wrap gap-1 pt-1">
          {t.tags.map((tag) => <span key={tag} className="font-mono text-[8px] text-[var(--fg-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.5">{tag}</span>)}
        </div>
        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
          <div className="flex gap-2">
            <span className="font-sans text-[10px] text-[var(--fg-muted)]">{t.fonts.serif}</span>
            <span className="text-[var(--border)]">·</span>
            <span className="font-sans text-[10px] text-[var(--fg-muted)]">{t.fonts.sans}</span>
          </div>
          {t.href && <button className="font-mono text-[9px] text-yellow hover:text-[var(--fg)] transition-colors uppercase tracking-wider">Use →</button>}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LINKS CARD — phone mockup preview
══════════════════════════════════════════════════════════════════════════ */

function btnRadius(style: LinksTemplate["btnStyle"]) {
  if (style === "pill") return 9999;
  if (style === "rounded") return 10;
  if (style === "square") return 0;
  return 8; // outline
}

function LinksCard({ t, index }: { t: LinksTemplate; index: number }) {
  const r = btnRadius(t.btnStyle);
  const isOutline = t.btnStyle === "outline";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden flex flex-col"
    >
      {/* Phone preview */}
      <div className="relative flex items-center justify-center py-8 overflow-hidden" style={{ background: t.bg, minHeight: 240 }}>
        {/* Faint grain overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
        {/* Profile + links */}
        <div className="relative flex flex-col items-center w-44 gap-3">
          {/* Avatar */}
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: t.fg, opacity: 0.15 }} />
          <div style={{ fontFamily: t.font, fontSize: 13, fontWeight: 700, color: t.fg, letterSpacing: "-0.01em" }}>Sofia Chen</div>
          <div style={{ fontFamily: "monospace", fontSize: 9, color: t.sub, marginTop: -8, marginBottom: 4 }}>Photographer · NYC</div>
          {/* Link buttons */}
          {["Portfolio", "Book a session", "Instagram"].map((label) => (
            <div key={label} style={{
              width: "100%", padding: "9px 14px", borderRadius: r,
              background: isOutline ? t.btnBg : t.btnBg,
              border: isOutline ? `1px solid ${t.fg}40` : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: t.font, fontSize: 10, fontWeight: 600, color: t.btnFg }}>{label}</span>
            </div>
          ))}
        </div>
        {/* "New" badge */}
        {t.new && <div className="absolute top-3 left-3 bg-yellow text-[#111] font-mono text-[8px] font-bold px-1.5 py-0.5 tracking-widest uppercase">New</div>}
        {!t.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/80 bg-black/50 px-3 py-1.5 rounded-full">
              <LockIcon /> Coming soon
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-sans font-bold text-[var(--fg)] text-sm">{t.name}</h3>
          {!t.available && <span className="flex items-center gap-1 font-mono text-[9px] text-[var(--fg-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.5 shrink-0"><LockIcon /> Soon</span>}
        </div>
        <p className="font-sans text-[11px] font-light text-[var(--fg-muted)] leading-relaxed flex-1">{t.description}</p>
        <div className="flex flex-wrap gap-1 pt-1">
          {t.tags.map((tag) => <span key={tag} className="font-mono text-[8px] text-[var(--fg-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.5">{tag}</span>)}
        </div>
        <div className="pt-2 border-t border-[var(--border)]">
          {t.available ? (
            <Link href="/dashboard/links"
              className="flex items-center justify-center gap-1.5 w-full py-2 font-mono text-[9px] text-yellow hover:text-[var(--fg)] transition-colors uppercase tracking-wider">
              <CheckIcon /> Use in Links builder →
            </Link>
          ) : (
            <span className="flex items-center justify-center gap-1 w-full py-2 font-mono text-[9px] text-[var(--fg-muted)] opacity-50 cursor-not-allowed">
              <LockIcon /> Coming soon
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   DELIVERY CARD — gallery preview
══════════════════════════════════════════════════════════════════════════ */

function DeliveryTemplateCard({ t, index }: { t: DeliveryTemplate; index: number }) {
  const previewSeeds = [401, 402, 403, 404, 405, 406];
  const imgRadius = (t.id === "delivery-minimal" || t.id === "delivery-editorial") ? 3 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden flex flex-col"
    >
      {/* Gallery preview */}
      <div className="relative overflow-hidden" style={{ background: t.accent, minHeight: 200 }}>
        {/* Top nav */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${t.fg}15` }}>
          <span style={{ fontFamily: "serif", fontSize: 11, fontWeight: 900, color: t.fg, letterSpacing: "0.1em", textTransform: "uppercase" }}>FRAME</span>
          <div style={{ fontFamily: "monospace", fontSize: 8, color: t.sub, letterSpacing: "0.12em", textTransform: "uppercase" }}>Gallery · 84 photos</div>
        </div>
        {/* Photo grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3, padding: "10px 10px 12px" }}>
          {previewSeeds.map((seed) => (
            <div key={seed} style={{ aspectRatio: "1", overflow: "hidden", borderRadius: imgRadius }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://picsum.photos/seed/${seed}/160/160?grayscale`} alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
          ))}
        </div>
        {t.new && <div className="absolute top-3 left-3 bg-yellow text-[#111] font-mono text-[8px] font-bold px-1.5 py-0.5 tracking-widest uppercase">New</div>}
        {!t.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
            <span className="flex items-center gap-1.5 font-mono text-[10px] text-white/80 bg-black/50 px-3 py-1.5 rounded-full">
              <LockIcon /> Coming soon
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-sans font-bold text-[var(--fg)] text-sm">{t.name}</h3>
            <div className="flex gap-1.5 mt-0.5">
              <div className="w-3 h-3 rounded-sm border border-[var(--border)]" style={{ background: t.accent }} />
              <div className="w-3 h-3 rounded-sm border border-[var(--border)]" style={{ background: t.fg }} />
            </div>
          </div>
          {!t.available && <span className="flex items-center gap-1 font-mono text-[9px] text-[var(--fg-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.5 shrink-0"><LockIcon /> Soon</span>}
        </div>
        <p className="font-sans text-[11px] font-light text-[var(--fg-muted)] leading-relaxed flex-1">{t.description}</p>
        <div className="flex flex-wrap gap-1 pt-1">
          {t.tags.map((tag) => <span key={tag} className="font-mono text-[8px] text-[var(--fg-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.5">{tag}</span>)}
        </div>
        <div className="pt-2 border-t border-[var(--border)]">
          {t.available ? (
            <Link href="/dashboard/delivery"
              className="flex items-center justify-center gap-1.5 w-full py-2 font-mono text-[9px] text-yellow hover:text-[var(--fg)] transition-colors uppercase tracking-wider">
              <CheckIcon /> Use in Delivery builder →
            </Link>
          ) : (
            <span className="flex items-center justify-center gap-1 w-full py-2 font-mono text-[9px] text-[var(--fg-muted)] opacity-50 cursor-not-allowed">
              <LockIcon /> Coming soon
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════ */

const PRODUCT_TABS: { id: ProductType; label: string; count: number; icon: React.ReactNode }[] = [
  {
    id: "portfolio",
    label: "Portfolio",
    count: PORTFOLIO_TEMPLATES.length,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  },
  {
    id: "links",
    label: "Links",
    count: LINKS_TEMPLATES.length,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="4" rx="2"/><rect x="3" y="10" width="18" height="4" rx="2"/><rect x="3" y="16" width="18" height="4" rx="2"/></svg>,
  },
  {
    id: "delivery",
    label: "Delivery",
    count: DELIVERY_TEMPLATES.length,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>,
  },
];

export default function TemplatesPage() {
  const [productType,     setProductType]     = useState<ProductType>("portfolio");
  const [portfolioFilter, setPortfolioFilter] = useState<PortfolioCategory>("All");

  const filteredPortfolio = portfolioFilter === "All"
    ? PORTFOLIO_TEMPLATES
    : PORTFOLIO_TEMPLATES.filter((t) => t.category === portfolioFilter);

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg)] border-b border-[var(--border)] px-5 pt-4 pb-0">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
          <div>
            <h1 className="font-sans font-black text-[var(--fg)] text-lg leading-none">Templates</h1>
            <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">
              {PORTFOLIO_TEMPLATES.length + LINKS_TEMPLATES.length + DELIVERY_TEMPLATES.length} total · Choose a starting point
            </p>
          </div>
        </div>

        {/* Product type tabs */}
        <div className="flex gap-0 border-b border-[var(--border)] -mb-px">
          {PRODUCT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setProductType(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-sans text-sm font-medium border-b-2 transition-colors ${
                productType === tab.id
                  ? "border-yellow text-[var(--fg)]"
                  : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              <span className={productType === tab.id ? "text-yellow" : "text-[var(--fg-muted)]"}>{tab.icon}</span>
              {tab.label}
              <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${productType === tab.id ? "bg-yellow/15 text-yellow" : "bg-[var(--bg-subtle)] text-[var(--fg-muted)]"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Portfolio category filter — only shown in portfolio tab */}
        <AnimatePresence>
          {productType === "portfolio" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="flex gap-1 flex-wrap py-3">
                {PORTFOLIO_CATEGORIES.map((cat) => {
                  const count = cat === "All" ? PORTFOLIO_TEMPLATES.length : PORTFOLIO_TEMPLATES.filter((t) => t.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setPortfolioFilter(cat)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium transition-colors rounded-lg ${
                        portfolioFilter === cat ? "bg-[var(--fg)] text-[var(--bg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]"
                      }`}
                    >
                      {cat}
                      <span className={`font-mono text-[9px] ${portfolioFilter === cat ? "opacity-60" : "opacity-40"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-5 space-y-6">
        <AnimatePresence mode="wait">

          {/* ── Portfolio ── */}
          {productType === "portfolio" && (
            <motion.div key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {filteredPortfolio.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredPortfolio.map((t, i) => (
                    <PortfolioCard key={t.id} t={t} index={i} featured={!!t.featured} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                  <span className="font-sans text-sm text-[var(--fg-muted)]">No templates in this category yet.</span>
                  <button onClick={() => setPortfolioFilter("All")} className="font-mono text-[10px] text-yellow hover:text-[var(--fg)] transition-colors uppercase tracking-wider">See all →</button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Links ── */}
          {productType === "links" && (
            <motion.div key="links" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="font-sans text-xs text-[var(--fg-muted)]">Styles for your link page — choose one as a starting point in the Links builder.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {LINKS_TEMPLATES.map((t, i) => <LinksCard key={t.id} t={t} index={i} />)}
              </div>
            </motion.div>
          )}

          {/* ── Delivery ── */}
          {productType === "delivery" && (
            <motion.div key="delivery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="font-sans text-xs text-[var(--fg-muted)]">Visual styles for your client delivery galleries — apply them inside the Delivery builder.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {DELIVERY_TEMPLATES.map((t, i) => <DeliveryTemplateCard key={t.id} t={t} index={i} />)}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
