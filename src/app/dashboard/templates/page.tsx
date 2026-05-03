"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "~/lib/cart";

/* ══════════════════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════════════════ */

type ProductType = "collections" | "portfolio" | "links" | "delivery";
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
  style: { bg: string; fg: string; accent: string; muted?: string };
  collection?: string;
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
    style: { bg: "#fafafa", fg: "#0a0a0a", accent: "#facc15", muted: "#a8a8a8" },
    collection: "minimal",
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
    style: { bg: "#0e0e0e", fg: "#f5f5f5", accent: "#dddddd", muted: "#666666" },
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
    style: { bg: "#f5f0e8", fg: "#1a1a1a", accent: "#dc2626", muted: "#8a8a8a" },
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
    style: { bg: "#ffffff", fg: "#0a0a0a", accent: "#000000", muted: "#cccccc" },
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
    style: { bg: "#1a1a1a", fg: "#ffffff", accent: "#aaaaaa", muted: "#555555" },
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
    style: { bg: "#fafaf8", fg: "#0a0a0a", accent: "#c9a89a", muted: "#a09890" },
    collection: "atelier",
  },
  {
    id: "brooklyn",
    name: "Brooklyn",
    description: "Urban, high-contrast portfolio with full-screen vertical navigation, auto-glide slider, and bold NYC editorial aesthetic.",
    category: "Editorial",
    tags: ["Urban", "Dark", "NYC", "Bold"],
    href: "/template/brooklyn",
    seed: 10,
    new: true,
    fonts: { serif: "DM Serif Display", sans: "Space Grotesk", mono: "Space Mono" },
    style: { bg: "#0D0D0D", fg: "#F0EFE9", accent: "#E8382C", muted: "#7A7A7A" },
    collection: "brooklyn",
  },
  {
    id: "petal",
    name: "Petal",
    description: "Playful pastel portfolio with bento works grid, VSCO masonry gallery, and warm sand background.",
    category: "Minimal",
    tags: ["Pastel", "Playful", "Modern"],
    href: "/templates/lumiere",
    seed: 452,
    new: true,
    fonts: { serif: "—", sans: "DM Sans", mono: "Space Mono" },
    style: { bg: "#f0ebe3", fg: "#18181b", accent: "#d9544a", muted: "#9a9088" },
    collection: "petal",
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
  href?: string;
  collection?: string;
};

const LINKS_TEMPLATES: LinksTemplate[] = [
  {
    id: "links-brooklyn",
    name: "Brooklyn",
    description: "Urban dark layout with red accents, squared buttons, and a bold marquee. Matches the Brooklyn portfolio.",
    tags: ["Dark", "Urban", "Bold"],
    available: true, new: true,
    bg: "#0D0D0D", fg: "#F0EFE9", sub: "#7A7A7A",
    btnStyle: "square", btnBg: "#E8382C", btnFg: "#0D0D0D", font: "Space Grotesk",
    href: "/template/brooklyn/links",
    collection: "Brooklyn",
  },
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
  href?: string;
  collection?: string;
};

const DELIVERY_TEMPLATES: DeliveryTemplate[] = [
  {
    id: "delivery-brooklyn",
    name: "Brooklyn",
    description: "Dark client gallery with red download CTAs, checkbox selection, and password gate. Matches the Brooklyn portfolio.",
    tags: ["Dark", "Urban", "Bold"],
    available: true, new: true,
    accent: "#161616", fg: "#F0EFE9", sub: "#7A7A7A",
    href: "/template/brooklyn/delivery",
    collection: "Brooklyn",
  },
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
   COLLECTIONS
══════════════════════════════════════════════════════════════════════════ */

type TemplateCollection = {
  id:          string;
  name:        string;
  description: string;
  accentColor: string;
  accentText:  string;
  pages: Array<{
    type: "portfolio" | "links" | "delivery";
    href: string | null;
    seed: number;
  }>;
};

const COLLECTIONS: TemplateCollection[] = [
  {
    id: "brooklyn",
    name: "Brooklyn",
    description: "Urban NYC aesthetic across your entire web presence. High-contrast, bold, and editorial — portfolio, links, and client gallery all in one coherent style.",
    accentColor: "#E8382C",
    accentText:  "#0D0D0D",
    pages: [
      { type: "portfolio", href: "/template/brooklyn",          seed: 10  },
      { type: "links",     href: "/template/brooklyn/links",    seed: 82  },
      { type: "delivery",  href: "/template/brooklyn/delivery", seed: 93  },
    ],
  },
  {
    id: "petal",
    name: "Petal",
    description: "Warm pastel palette with playful, modern layouts. Bento grid, masonry gallery, rounded cards — a cohesive identity that feels fresh and distinct.",
    accentColor: "#d9544a",
    accentText:  "#faf8f5",
    pages: [
      { type: "portfolio", href: "/templates/lumiere", seed: 452 },
      { type: "links",     href: null,                  seed: 63  },
      { type: "delivery",  href: null,                  seed: 71  },
    ],
  },
  {
    id: "atelier",
    name: "Atelier",
    description: "Editorial warmth with Cormorant Garamond headings and a restrained warm-cream palette. For photographers who want timeless over trendy.",
    accentColor: "#c9a89a",
    accentText:  "#2a2520",
    pages: [
      { type: "portfolio", href: "/templates/lumiere", seed: 338 },
      { type: "links",     href: null,                  seed: 145 },
      { type: "delivery",  href: "/template/atelier",  seed: 200 },
    ],
  },
];

/* ── Mobile detection ───────────────────────────────────────── */
function useIsMobile() {
  const [is, setIs] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    setIs(mq.matches);
    const h = (e: MediaQueryListEvent) => setIs(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return is;
}

/* ── Use-stage button ───────────────────────────────────────── */
type UseStage = "idle" | "checking" | "active";

function UseStageButton({ stage, onUse }: {
  stage: UseStage; onUse: () => void;
}) {
  return (
    <div style={{ position: "relative", height: 34, width: 160 }}>
      <AnimatePresence mode="wait">
        {stage === "idle" && (
          <motion.button key="use"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            onClick={onUse}
            className="absolute inset-0 flex items-center justify-center gap-2 font-sans text-xs font-bold rounded-lg bg-yellow text-[#111] hover:bg-yellow/90 transition-colors"
          >
            Use collection
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </motion.button>
        )}
        {stage === "checking" && (
          <motion.div key="check"
            initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }}
            className="absolute inset-0 flex items-center justify-center rounded-lg"
            style={{ background: "#16a34a" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <motion.path d="M20 6L9 17l-5-5"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
        )}
        {stage === "active" && (
          <motion.button key="edit"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center gap-2 font-sans text-xs font-bold rounded-lg bg-white text-[#111] hover:bg-white/90 border border-[var(--border)] transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Start building
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Collection preview modal (device + page selector) ─────── */

type Device = "mobile" | "tablet" | "desktop";
type PageType = "portfolio" | "links" | "delivery";

const DEVICE_DIMS: Record<Device, { w: number; h: number; label: string }> = {
  mobile:  { w: 390,  h: 780,  label: "375px"  },
  tablet:  { w: 820,  h: 1100, label: "768px"  },
  desktop: { w: 1280, h: 800,  label: "1280px" },
};

function DeviceIcon({ d }: { d: Device }) {
  if (d === "mobile") return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
  if (d === "tablet") return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>;
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>;
}

function CollectionPreviewModal({ c, initialPage = "portfolio", onClose }: {
  c: TemplateCollection; initialPage?: PageType; onClose: () => void;
}) {
  const [device, setDevice] = useState<Device>("desktop");
  const [page, setPage]     = useState<PageType>(initialPage);
  const [loading, setLoading] = useState(true);

  const currentPage = c.pages.find((p) => p.type === page);
  const url         = currentPage?.href ?? null;

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  useEffect(() => { setLoading(true); }, [url, device]);

  const dims = DEVICE_DIMS[device];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0a]/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Toolbar */}
      <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10 flex-wrap">
        {/* Left: collection name + close */}
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c.accentColor }} />
            <span className="font-sans font-black text-white text-sm">{c.name}</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">Preview</span>
          </div>
        </div>

        {/* Center: page selector */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
          {(["portfolio", "links", "delivery"] as const).map((p) => {
            const pageData = c.pages.find((x) => x.type === p);
            const available = !!pageData?.href;
            const active = page === p;
            return (
              <button
                key={p}
                onClick={() => available && setPage(p)}
                disabled={!available}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-sans text-xs font-medium transition-colors ${
                  active ? "bg-white text-[#111]" : available ? "text-white/60 hover:text-white" : "text-white/20 cursor-not-allowed"
                }`}
              >
                {!available && <LockIcon />}
                {p === "portfolio" ? "Portfolio" : p === "links" ? "Links" : "Delivery"}
              </button>
            );
          })}
        </div>

        {/* Right: device selector */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
          {(["mobile", "tablet", "desktop"] as Device[]).map((d) => {
            const active = device === d;
            return (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-sans text-xs font-medium transition-colors ${
                  active ? "bg-white text-[#111]" : "text-white/60 hover:text-white"
                }`}
                title={DEVICE_DIMS[d].label}
              >
                <DeviceIcon d={d} />
                <span className="hidden sm:inline capitalize">{d}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview viewport */}
      <div onClick={(e) => e.stopPropagation()} className="flex-1 min-h-0 flex items-center justify-center p-6 overflow-auto">
        {url ? (
          <motion.div
            key={`${device}-${page}`}
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="relative bg-white shadow-2xl"
            style={{
              width: dims.w, height: dims.h,
              borderRadius: device === "mobile" ? 28 : device === "tablet" ? 16 : 8,
              overflow: "hidden",
              maxWidth: "100%", maxHeight: "100%",
              transform: `scale(min(1, calc((100vw - 80px) / ${dims.w}), calc((100vh - 160px) / ${dims.h})))`,
              transformOrigin: "center center",
            }}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-subtle)] z-10">
                <div className="w-6 h-6 rounded-full border-2 border-[var(--border)] border-t-yellow animate-spin" />
              </div>
            )}
            <iframe
              src={url}
              className="w-full h-full border-0"
              onLoad={() => setLoading(false)}
              title={`${c.name} ${page} preview`}
            />
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-white/40">
            <LockIcon />
            <p className="font-sans text-sm">This page isn't available yet for this collection.</p>
          </div>
        )}
      </div>

      {/* Footer status */}
      <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center justify-between px-4 py-2 border-t border-white/10">
        <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider">{dims.label} · {device}</span>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="font-mono text-[10px] text-white/40 hover:text-white transition-colors uppercase tracking-wider flex items-center gap-1.5">
            Open in new tab <ArrowIcon />
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ── Collection mobile modal ────────────────────────────────── */
function CollectionModal({ c, onClose, onPreview }: { c: TemplateCollection; onClose: () => void; onPreview: (p: PageType) => void }) {
  const PAGE_LABELS: Record<string, string> = { portfolio: "Portfolio", links: "Links", delivery: "Delivery" };
  const [stage, setStage] = useState<UseStage>("idle");

  function handleUse() {
    if (stage !== "idle") return;
    setStage("checking");
    setTimeout(() => setStage("active"), 1300);
  }

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-h-[85dvh] overflow-y-auto rounded-t-2xl bg-[var(--bg-card)] border-t border-[var(--border)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 shrink-0">
          <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
        </div>

        {/* Preview images */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto">
          {c.pages.map((page) => (
            <div key={page.type} className="relative flex-none rounded-xl overflow-hidden" style={{ width: 120, height: 160 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://picsum.photos/seed/${page.seed}/240/320`} alt="" className="w-full h-full object-cover" style={{ filter: page.href ? "none" : "grayscale(1) opacity(0.4)" }} />
              <div className="absolute inset-x-0 bottom-0 px-2 py-1.5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                <span className="font-mono text-[8px] uppercase tracking-widest text-white/80">{page.type}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="px-5 pb-8 flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c.accentColor }} />
              <h3 className="font-sans font-black text-[var(--fg)] text-lg">{c.name}</h3>
              <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: c.accentColor + "22", color: c.accentColor }}>Collection</span>
            </div>
            <p className="font-sans text-sm text-[var(--fg-muted)] leading-relaxed">{c.description}</p>
          </div>

          {/* Pages */}
          <div className="flex flex-col gap-2">
            {c.pages.map((page) => (
              <div key={page.type} className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]">
                <div className="flex items-center gap-2">
                  {page.href
                    ? <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: c.accentColor + "20" }}><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={c.accentColor} strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg></div>
                    : <div className="w-5 h-5 rounded-md flex items-center justify-center bg-[var(--bg-card)]"><LockIcon /></div>
                  }
                  <span className="font-sans text-sm font-medium text-[var(--fg)]">{PAGE_LABELS[page.type]}</span>
                </div>
                {page.href
                  ? <button onClick={() => onPreview(page.type as PageType)} className="flex items-center gap-1 font-mono text-[9px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors uppercase tracking-wide">Preview <ArrowIcon /></button>
                  : <span className="font-mono text-[9px] text-[var(--fg-muted)] opacity-40">Soon</span>
                }
              </div>
            ))}
          </div>

          {/* CTA */}
          <UseStageButton stage={stage} onUse={handleUse} />
        </div>
      </motion.div>
    </div>
  );
}

/* ── Collection card ─────────────────────────────────────────── */

function CollectionCard({ c, index }: { c: TemplateCollection; index: number }) {
  const PAGE_LABELS: Record<string, string> = { portfolio: "Portfolio", links: "Links", delivery: "Delivery" };
  const [hovered, setHovered] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState<PageType | null>(null);
  const isMobile = useIsMobile();
  const [stage, setStage] = useState<UseStage>("idle");

  function handleUse() {
    if (stage !== "idle") return;
    setStage("checking");
    setTimeout(() => setStage("active"), 1300);
  }

  /* On mobile — simplified tap card that opens a modal */
  if (isMobile) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.08 }}
          onClick={() => setModalOpen(true)}
          className="relative overflow-hidden border border-[var(--border)] bg-[var(--bg-card)] flex items-center gap-3 p-4 active:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: c.accentColor }} />
          <div className="pl-2 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-bold leading-none select-none" style={{ color: c.accentColor + "40" }}>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-sans font-black text-[var(--fg)] text-base leading-none">{c.name}</h3>
                <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: c.accentColor }}>Collection</span>
              </div>
            </div>
          </div>
          {/* Mini previews */}
          <div className="flex gap-1 shrink-0">
            {c.pages.map((page) => (
              <div key={page.type} className="relative overflow-hidden rounded-md" style={{ width: 40, height: 54 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://picsum.photos/seed/${page.seed}/80/108`} alt="" className="w-full h-full object-cover" style={{ filter: page.href ? "brightness(0.85)" : "grayscale(1) opacity(0.3)" }} />
              </div>
            ))}
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-[var(--fg-muted)]"><path d="M9 18l6-6-6-6"/></svg>
        </motion.div>

        <AnimatePresence>
          {modalOpen && <CollectionModal c={c} onClose={() => setModalOpen(false)} onPreview={(p) => { setModalOpen(false); setPreviewOpen(p); }} />}
          {previewOpen && <CollectionPreviewModal c={c} initialPage={previewOpen} onClose={() => setPreviewOpen(null)} />}
        </AnimatePresence>
      </>
    );
  }

  /* Desktop — full horizontal card */
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative overflow-hidden border border-[var(--border)] bg-[var(--bg-card)]"
        style={{
          transition: "box-shadow 0.25s",
          boxShadow: hovered ? "0 8px 32px rgba(0,0,0,0.1)" : "none",
        }}
      >
        {/* Accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: c.accentColor }} />

        <div className="flex pl-4">
          {/* ── Left: info ── */}
          <div className="flex-1 min-w-0 py-6 pr-8 flex flex-col gap-4 justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-5xl font-bold leading-none select-none" style={{ color: c.accentColor + "28" }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-sans font-black text-[var(--fg)] text-2xl leading-none tracking-tight">{c.name}</h3>
                <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: c.accentColor }}>Collection</span>
              </div>
            </div>

            <p className="font-sans text-xs text-[var(--fg-muted)] leading-relaxed max-w-sm">{c.description}</p>

            {/* Page buttons */}
            <div className="flex gap-2 flex-wrap">
              {c.pages.map((page) => (
                page.href ? (
                  <button key={page.type} onClick={() => setPreviewOpen(page.type as PageType)}
                    className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wide px-3 py-1.5 rounded-lg border transition-colors hover:brightness-105"
                    style={{ background: c.accentColor + "18", borderColor: c.accentColor + "40", color: c.accentColor }}
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                    {PAGE_LABELS[page.type]}
                  </button>
                ) : (
                  <span key={page.type}
                    className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wide px-3 py-1.5 rounded-lg border"
                    style={{ borderColor: "var(--border)", color: "var(--fg-muted)", opacity: 0.45 }}
                  >
                    <LockIcon /> {PAGE_LABELS[page.type]}
                  </span>
                )
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <UseStageButton stage={stage} onUse={handleUse} />
              {c.pages[0]?.href && (
                <button
                  onClick={() => setPreviewOpen("portfolio")}
                  className="flex items-center gap-1.5 px-4 h-[34px] font-sans text-xs font-medium rounded-lg border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Preview
                </button>
              )}
            </div>
          </div>

          {/* ── Right: theme hero image (50%) ── */}
          <div className="relative w-1/2 shrink-0 overflow-hidden hidden md:block" style={{ minHeight: 280 }}>
            {/* Accent strip on the left edge of the image */}
            <div className="absolute top-0 bottom-0 left-0 w-1 z-10" style={{ background: c.accentColor }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://picsum.photos/seed/${c.pages[0]?.seed ?? 10}/1200/900`}
              alt={`${c.name} theme preview`}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
              style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
            />
            {/* Subtle vignette on the left edge so the photo blends with the card */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(to right, var(--bg-card) 0%, transparent 12%)" }} />
            {/* Theme tag overlay */}
            <div className="absolute bottom-3 right-3 z-10">
              <span className="font-mono text-[8px] uppercase tracking-widest px-2 py-1 rounded backdrop-blur-md"
                style={{ background: "rgba(0,0,0,0.55)", color: "#fff" }}>
                Live preview
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {modalOpen && <CollectionModal c={c} onClose={() => setModalOpen(false)} onPreview={(p) => { setModalOpen(false); setPreviewOpen(p); }} />}
        {previewOpen && <CollectionPreviewModal c={c} initialPage={previewOpen} onClose={() => setPreviewOpen(null)} />}
      </AnimatePresence>
    </>
  );
}

/* ── Page-type mockup cards ──────────────────────────────────
   Coded wireframes that visually represent each page type.
   Used inside the "One style, three pages" banner. */

const MOCK_BG    = "#f5f1ea";
const MOCK_INK   = "#1a1a1a";
const MOCK_DIM   = "#bbb3a8";
const MOCK_LINE  = "#e0d8c9";

function MockShell({ rotate, ty, zIndex, children }: {
  rotate: string; ty: string; zIndex: number; children: React.ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-xl shadow-2xl"
      style={{
        width: 110, height: 156, background: MOCK_BG, color: MOCK_INK,
        transform: `rotate(${rotate}) translateY(${ty})`,
        zIndex,
      }}
    >
      {children}
    </div>
  );
}

function PortfolioMock(props: { rotate: string; ty: string; zIndex: number }) {
  return (
    <MockShell {...props}>
      {/* Nav strip */}
      <div className="flex items-center justify-between px-2.5 py-2 border-b" style={{ borderColor: MOCK_LINE }}>
        <div className="w-2 h-2 rounded-sm" style={{ background: MOCK_INK }} />
        <div className="flex gap-1.5">
          <div className="h-1 w-3 rounded-full" style={{ background: MOCK_DIM }} />
          <div className="h-1 w-3 rounded-full" style={{ background: MOCK_DIM }} />
          <div className="h-1 w-3 rounded-full" style={{ background: MOCK_DIM }} />
        </div>
      </div>
      {/* Hero text */}
      <div className="px-2.5 pt-3 pb-2">
        <div className="h-2 w-16 mb-1" style={{ background: MOCK_INK }} />
        <div className="h-2 w-12 mb-2" style={{ background: MOCK_INK }} />
        <div className="h-0.5 w-8" style={{ background: MOCK_DIM }} />
      </div>
      {/* Photo grid */}
      <div className="grid grid-cols-3 gap-0.5 px-1.5">
        {[0,1,2,3,4,5].map((i) => (
          <div key={i} className="aspect-square" style={{ background: i % 2 === 0 ? "#cfc6b6" : "#9d927e" }} />
        ))}
      </div>
      {/* Type tag */}
      <div className="absolute bottom-1.5 left-2.5 font-mono text-[7px] uppercase tracking-widest opacity-60">Portfolio</div>
    </MockShell>
  );
}

function LinksMock(props: { rotate: string; ty: string; zIndex: number }) {
  return (
    <MockShell {...props}>
      {/* Centered profile */}
      <div className="flex flex-col items-center pt-5 px-3 gap-1.5">
        <div className="w-7 h-7 rounded-full" style={{ background: "#9d927e" }} />
        <div className="h-1.5 w-12" style={{ background: MOCK_INK }} />
        <div className="h-1 w-8" style={{ background: MOCK_DIM }} />
      </div>
      {/* Link buttons */}
      <div className="flex flex-col gap-1.5 px-3 mt-3">
        <div className="h-3 rounded-full" style={{ background: MOCK_INK }} />
        <div className="h-3 rounded-full border" style={{ borderColor: MOCK_LINE, background: "transparent" }} />
        <div className="h-3 rounded-full border" style={{ borderColor: MOCK_LINE, background: "transparent" }} />
        <div className="h-3 rounded-full border" style={{ borderColor: MOCK_LINE, background: "transparent" }} />
      </div>
      {/* Type tag */}
      <div className="absolute bottom-1.5 left-2.5 font-mono text-[7px] uppercase tracking-widest opacity-60">Links</div>
    </MockShell>
  );
}

function DeliveryMock(props: { rotate: string; ty: string; zIndex: number }) {
  return (
    <MockShell {...props}>
      {/* Nav strip with title + count */}
      <div className="flex items-center justify-between px-2.5 py-2 border-b" style={{ borderColor: MOCK_LINE }}>
        <div className="h-1.5 w-10" style={{ background: MOCK_INK }} />
        <div className="h-1 w-5" style={{ background: MOCK_DIM }} />
      </div>
      {/* Tightly packed gallery */}
      <div className="grid grid-cols-3 gap-0.5 p-1.5">
        {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => (
          <div key={i} className="aspect-square relative" style={{ background: i === 3 ? "#9d927e" : "#cfc6b6" }}>
            {i === 1 && (
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full" style={{ background: MOCK_INK }} />
            )}
          </div>
        ))}
      </div>
      {/* Type tag */}
      <div className="absolute bottom-1.5 left-2.5 font-mono text-[7px] uppercase tracking-widest opacity-60">Delivery</div>
    </MockShell>
  );
}

/* ── Template Banner ─────────────────────────────────────────── */

function TemplateBanner({ onDismiss, onBrowse }: { onDismiss: () => void; onBrowse: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-xl mx-5 mt-5"
      style={{ background: "#111118" }}
    >
      {/* Dot grid decoration */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }} />
      {/* Yellow glow blob */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(250,205,21,0.18) 0%, transparent 70%)" }} />

      <div className="relative flex items-center gap-6 p-5">
        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest bg-yellow text-[#111] px-2 py-0.5 rounded-sm">New</span>
            <span className="font-mono text-[9px] text-white/30 uppercase tracking-wider">Collections</span>
          </div>
          <h2 className="font-sans font-black text-white text-base leading-tight mb-1">
            One style, three pages.
          </h2>
          <p className="font-sans text-xs text-white/45 leading-relaxed max-w-sm">
            Pick a collection and get a portfolio, link page, and delivery gallery that all look like they belong together.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={onBrowse}
              className="flex items-center gap-2 bg-yellow text-[#111] font-sans text-xs font-bold px-4 py-2 rounded-lg hover:bg-yellow/90 transition-colors"
            >
              Browse collections
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button onClick={onDismiss} className="font-sans text-xs text-white/30 hover:text-white/60 transition-colors">
              Dismiss
            </button>
          </div>
        </div>

        {/* Coded mockups — minimized representations of each page type */}
        <div className="hidden md:flex gap-3 items-end shrink-0 pr-2">
          <PortfolioMock rotate="-6deg" ty="10px" zIndex={2} />
          <LinksMock     rotate="0deg"  ty="0px"  zIndex={3} />
          <DeliveryMock  rotate="6deg"  ty="10px" zIndex={1} />
        </div>

        {/* Close */}
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </motion.div>
  );
}


/* ── "Create your own style" banner ─────────────────────────── */

function StyleBanner({ onDismiss, onOpen }: { onDismiss: () => void; onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-xl mx-5 mt-3"
      style={{
        background: "linear-gradient(135deg, #fad502 0%, #f4c40c 100%)",
      }}
    >
      {/* Diagonal stripes pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{
        backgroundImage: "repeating-linear-gradient(45deg, #111 0 1px, transparent 1px 14px)",
      }} />

      <div className="relative flex items-center gap-6 p-5">
        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest bg-[#111] text-yellow px-2 py-0.5 rounded-sm">Wizard</span>
            <span className="font-mono text-[9px] text-[#111]/55 uppercase tracking-wider">Custom brand</span>
          </div>
          <h2 className="font-sans font-black text-[#111] text-base leading-tight mb-1">
            Create your own style.
          </h2>
          <p className="font-sans text-xs text-[#111]/60 leading-relaxed max-w-sm">
            Pick fonts, colors, and a logo before you open the editor — save time and lock in your visual identity.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={onOpen}
              className="flex items-center gap-2 bg-[#111] text-yellow font-sans text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#111]/90 transition-colors"
            >
              Open style wizard
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button onClick={onDismiss} className="font-sans text-xs text-[#111]/50 hover:text-[#111]/80 transition-colors">
              Dismiss
            </button>
          </div>
        </div>

        {/* Decorative — typography Aa stack + color swatch row */}
        <div className="hidden md:flex items-end gap-3 shrink-0 pr-2">
          <div className="flex flex-col items-end gap-1.5">
            <span style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: 36, fontWeight: 700, lineHeight: 1, color: "#111" }}>Aa</span>
            <span style={{ fontFamily: "var(--font-sans, system-ui)", fontSize: 22, fontWeight: 500, lineHeight: 1, color: "#111", opacity: 0.65 }}>Aa</span>
            <span style={{ fontFamily: "monospace", fontSize: 14, lineHeight: 1, color: "#111", opacity: 0.4 }}>Aa</span>
          </div>
          <div className="flex flex-col gap-1">
            {["#0d0d0d", "#e8382c", "#fad502", "#f0efe9"].map((c) => (
              <div key={c} className="w-6 h-6 rounded-full border-2 border-[#111]/15" style={{ background: c }} />
            ))}
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-[#111]/40 hover:text-[#111] hover:bg-[#111]/10 transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </motion.div>
  );
}

/* ── Style wizard modal ─────────────────────────────────────── */

const WIZARD_FONTS = [
  { id: "cormorant",  label: "Cormorant Garamond", stack: "'Cormorant Garamond', Georgia, serif",       cat: "serif" },
  { id: "dm-serif",   label: "DM Serif Display",   stack: "'DM Serif Display', Georgia, serif",         cat: "serif" },
  { id: "playfair",   label: "Playfair Display",   stack: "'Playfair Display', Georgia, serif",         cat: "serif" },
  { id: "dm-sans",    label: "DM Sans",            stack: "'DM Sans', system-ui, sans-serif",           cat: "sans"  },
  { id: "space-grot", label: "Space Grotesk",      stack: "'Space Grotesk', system-ui, sans-serif",     cat: "sans"  },
  { id: "inter",      label: "Inter",              stack: "'Inter', system-ui, sans-serif",             cat: "sans"  },
  { id: "space-mono", label: "Space Mono",         stack: "'Space Mono', ui-monospace, monospace",      cat: "mono"  },
  { id: "jetbrains",  label: "JetBrains Mono",     stack: "'JetBrains Mono', ui-monospace, monospace",  cat: "mono"  },
];

const WIZARD_PALETTES = [
  { id: "bw",       label: "Black & White",  bg: "#fafafa", fg: "#0a0a0a", accent: "#facc15", muted: "#888888" },
  { id: "noir",     label: "Noir",            bg: "#0a0a0a", fg: "#f5f5f5", accent: "#e8382c", muted: "#666666" },
  { id: "warm",     label: "Warm Cream",      bg: "#faf8f5", fg: "#2a2520", accent: "#c9a89a", muted: "#9a9088" },
  { id: "petal",    label: "Petal Pastel",    bg: "#f0ebe3", fg: "#18181b", accent: "#d9544a", muted: "#71717a" },
  { id: "brooklyn", label: "Brooklyn Red",    bg: "#0d0d0d", fg: "#f0efe9", accent: "#e8382c", muted: "#7a7a7a" },
  { id: "slate",    label: "Cool Slate",      bg: "#f0f4f8", fg: "#1e293b", accent: "#334155", muted: "#64748b" },
];

type WizardState = {
  brandName:  string;
  logoMode:   "text" | "image" | "both";
  primary:    typeof WIZARD_FONTS[number];
  secondary:  typeof WIZARD_FONTS[number];
  mono:       typeof WIZARD_FONTS[number];
  palette:    typeof WIZARD_PALETTES[number];
};

function StyleWizardModal({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<WizardState>({
    brandName: "Sofia Chen",
    logoMode:  "text",
    primary:   WIZARD_FONTS[0]!,
    secondary: WIZARD_FONTS[3]!,
    mono:      WIZARD_FONTS[6]!,
    palette:   WIZARD_PALETTES[0]!,
  });

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  function patch<K extends keyof WizardState>(key: K, value: WizardState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 20 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-xl w-full max-w-5xl max-h-[88dvh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
          <div>
            <h2 className="font-sans font-black text-[var(--fg)] text-base leading-none">Style wizard</h2>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] mt-1">Pick brand, fonts, colors</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Body — split */}
        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 overflow-hidden">

          {/* Left — form */}
          <div className="overflow-y-auto p-6 flex flex-col gap-6 border-b md:border-b-0 md:border-r border-[var(--border)]">
            {/* Brand name */}
            <Field label="Brand name">
              <input
                value={state.brandName}
                onChange={(e) => patch("brandName", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--fg)] text-sm font-sans focus:border-yellow focus:outline-none transition-colors"
                placeholder="Your name or studio"
              />
            </Field>

            {/* Logo mode */}
            <Field label="Logo">
              <div className="grid grid-cols-3 gap-1 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg p-1">
                {(["text", "image", "both"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => patch("logoMode", m)}
                    className={`py-2 rounded-md font-sans text-xs font-medium transition-colors capitalize ${
                      state.logoMode === m ? "bg-[var(--bg-card)] text-[var(--fg)] shadow-sm" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                    }`}
                  >
                    {m === "both" ? "Image + text" : m}
                  </button>
                ))}
              </div>
            </Field>

            {/* Primary font (headings) */}
            <FontSelect
              label="Primary font · Headings"
              value={state.primary}
              onChange={(f) => patch("primary", f)}
            />

            {/* Secondary (body) */}
            <FontSelect
              label="Secondary font · Body"
              value={state.secondary}
              onChange={(f) => patch("secondary", f)}
            />

            {/* Mono (labels) */}
            <FontSelect
              label="Tertiary font · Labels"
              value={state.mono}
              onChange={(f) => patch("mono", f)}
              filterCat="mono"
            />

            {/* Palette */}
            <Field label="Color palette">
              <div className="grid grid-cols-2 gap-2">
                {WIZARD_PALETTES.map((p) => {
                  const active = state.palette.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => patch("palette", p)}
                      className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                        active ? "border-yellow ring-2 ring-yellow/30" : "border-[var(--border)] hover:border-[var(--fg-muted)]"
                      }`}
                    >
                      <div className="flex gap-0.5 rounded overflow-hidden">
                        {[p.bg, p.fg, p.accent, p.muted].map((c) => (
                          <div key={c} className="w-3 h-6" style={{ background: c }} />
                        ))}
                      </div>
                      <span className="font-sans text-[11px] font-medium text-[var(--fg)] truncate flex-1 text-left">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          {/* Right — wireframe preview */}
          <div className="overflow-y-auto p-6 bg-[var(--bg-subtle)] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">Live wireframe</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] opacity-60">Preview</span>
            </div>

            <WireframePreview state={state} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[var(--border)] shrink-0">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] hidden sm:block">Settings will pre-fill the editor</p>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => { /* TODO: persist wizard state */ alert("Style saved — open the editor to apply."); onClose(); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold hover:bg-yellow/90 transition-colors"
            >
              Apply to editor
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Wizard helper components ───────────────────────────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">{label}</label>
      {children}
    </div>
  );
}

function FontSelect({ label, value, onChange, filterCat }: {
  label: string;
  value: typeof WIZARD_FONTS[number];
  onChange: (f: typeof WIZARD_FONTS[number]) => void;
  filterCat?: "serif" | "sans" | "mono";
}) {
  const opts = filterCat ? WIZARD_FONTS.filter((f) => f.cat === filterCat) : WIZARD_FONTS;
  return (
    <Field label={label}>
      {/* Preview */}
      <div className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)]" style={{ fontFamily: value.stack }}>
        <span className="text-2xl text-[var(--fg)] font-medium">Aa Bb 123</span>
      </div>
      {/* Options grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {opts.map((f) => {
          const active = f.id === value.id;
          return (
            <button
              key={f.id}
              onClick={() => onChange(f)}
              className={`px-3 py-2 rounded-lg border text-left transition-all ${
                active ? "border-yellow ring-2 ring-yellow/30 bg-[var(--bg)]" : "border-[var(--border)] hover:border-[var(--fg-muted)]"
              }`}
            >
              <div style={{ fontFamily: f.stack, fontSize: 14, color: "var(--fg)", lineHeight: 1 }}>Ag</div>
              <div className="font-mono text-[8px] uppercase tracking-wider text-[var(--fg-muted)] mt-1 truncate">{f.label}</div>
            </button>
          );
        })}
      </div>
    </Field>
  );
}

function WireframePreview({ state }: { state: WizardState }) {
  const { brandName, logoMode, primary, secondary, mono, palette } = state;

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-[var(--border)] aspect-[3/4] flex flex-col"
      style={{ background: palette.bg, color: palette.fg, fontFamily: secondary.stack }}
    >
      {/* Nav */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: palette.fg + "15" }}>
        <div className="flex items-center gap-2">
          {(logoMode === "image" || logoMode === "both") && (
            <div className="w-4 h-4 rounded" style={{ background: palette.accent }} />
          )}
          {(logoMode === "text" || logoMode === "both") && (
            <span style={{ fontFamily: primary.stack, fontWeight: 700, fontSize: 13, letterSpacing: "-0.02em" }}>
              {brandName || "Brand"}
            </span>
          )}
        </div>
        <div className="flex gap-3">
          {["work", "about", "contact"].map((l) => (
            <span key={l} style={{ fontFamily: mono.stack, fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.55 }}>
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="px-4 pt-6 pb-4 flex-1 flex flex-col gap-3">
        <span style={{ fontFamily: mono.stack, fontSize: 8, letterSpacing: "0.24em", textTransform: "uppercase", color: palette.accent }}>
          Photographer · Visual artist
        </span>
        <h1 style={{ fontFamily: primary.stack, fontSize: 28, fontWeight: 400, lineHeight: 1, letterSpacing: "-0.02em", margin: 0 }}>
          Light, framed.
        </h1>
        <p style={{ fontFamily: secondary.stack, fontSize: 11, fontWeight: 300, lineHeight: 1.55, opacity: 0.7, margin: 0 }}>
          Documentary, editorial, and portrait photography across cities, climates, and quiet evenings.
        </p>

        {/* CTA */}
        <div className="flex gap-2 mt-1">
          <span style={{
            fontFamily: mono.stack, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
            background: palette.accent, color: palette.bg, padding: "5px 12px",
          }}>View work</span>
          <span style={{
            fontFamily: mono.stack, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
            border: `1px solid ${palette.fg}50`, color: palette.fg, padding: "5px 12px", opacity: 0.85,
          }}>About</span>
        </div>

        {/* Photo grid placeholder */}
        <div className="grid grid-cols-3 gap-1 mt-2">
          {[0,1,2,3,4,5].map((i) => (
            <div key={i} className="aspect-[3/4] rounded-sm" style={{ background: palette.muted, opacity: 0.65 }} />
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <div className="px-4 py-3 flex items-center justify-between border-t" style={{ borderColor: palette.fg + "12" }}>
        <span style={{ fontFamily: primary.stack, fontStyle: "italic", fontWeight: 400, fontSize: 11, opacity: 0.7 }}>
          {brandName || "Brand"}
        </span>
        <span style={{ fontFamily: mono.stack, fontSize: 7, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.4 }}>
          © 2025
        </span>
      </div>
    </div>
  );
}

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

/* ── Generated template preview ─────────────────────────────
   Wireframe-style render of what each template type looks like,
   colored from the template's own palette. */

type PreviewKind = "portfolio" | "links" | "delivery";
type PreviewStyle = { bg: string; fg: string; accent: string; muted?: string };

function TemplatePreview({ kind, style, dense }: {
  kind: PreviewKind;
  style: PreviewStyle;
  dense?: boolean; // smaller variant for delivery cards
}) {
  const { bg, fg, accent } = style;
  const muted = style.muted ?? `${fg}40`;
  const placeholder = `${fg}22`;
  const placeholderAlt = `${fg}38`;
  const borderColor = `${fg}18`;

  if (kind === "portfolio") {
    return (
      <div className="relative w-full h-full overflow-hidden" style={{ background: bg, color: fg }}>
        {/* Nav */}
        <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor }}>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: accent }} />
            <div className="h-1.5 w-9 rounded-sm" style={{ background: fg, opacity: 0.85 }} />
          </div>
          <div className="flex gap-2">
            {[0,1,2].map((i) => <div key={i} className="h-1 w-3.5 rounded-full" style={{ background: muted }} />)}
          </div>
        </div>
        {/* Hero */}
        <div className="px-3 pt-3 pb-2">
          <div className="h-1 w-12 rounded-full mb-2" style={{ background: accent, opacity: 0.7 }} />
          <div className="h-3 w-32 rounded-sm mb-1" style={{ background: fg }} />
          <div className="h-3 w-24 rounded-sm mb-2" style={{ background: fg, opacity: 0.85 }} />
          <div className="h-1 w-20 rounded-full" style={{ background: muted }} />
        </div>
        {/* Photo grid */}
        <div className="grid grid-cols-3 gap-1 px-2 pb-2 mt-1">
          {[0,1,2,3,4,5].map((i) => (
            <div key={i} className="aspect-[4/5] rounded-sm" style={{ background: i % 2 === 0 ? placeholder : placeholderAlt }} />
          ))}
        </div>
        {/* Mini CTA */}
        <div className="absolute bottom-2 right-2 px-2 py-1 text-[8px] rounded font-mono uppercase tracking-widest"
          style={{ background: accent, color: bg, fontWeight: 700 }}>
          View →
        </div>
      </div>
    );
  }

  if (kind === "links") {
    return (
      <div className="relative w-full h-full flex flex-col items-center pt-5 px-4 overflow-hidden" style={{ background: bg, color: fg }}>
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full mb-2" style={{ background: placeholderAlt }} />
        {/* Name */}
        <div className="h-2 w-16 rounded-sm mb-1" style={{ background: fg }} />
        {/* Bio */}
        <div className="h-1 w-12 rounded-full mb-4" style={{ background: muted }} />
        {/* Buttons */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="h-4 rounded-md" style={{ background: accent }} />
          <div className="h-4 rounded-md border" style={{ borderColor: `${fg}40`, background: "transparent" }} />
          <div className="h-4 rounded-md border" style={{ borderColor: `${fg}40`, background: "transparent" }} />
          <div className="h-4 rounded-md border" style={{ borderColor: `${fg}40`, background: "transparent" }} />
        </div>
      </div>
    );
  }

  // delivery
  const cols = dense ? 4 : 4;
  const rows = dense ? 3 : 4;
  const total = cols * rows;
  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: bg, color: fg }}>
      {/* Nav with title + count */}
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor }}>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
          <div className="h-1.5 w-12 rounded-sm" style={{ background: fg, opacity: 0.85 }} />
        </div>
        <div className="h-1 w-7 rounded-full" style={{ background: muted }} />
      </div>
      {/* Action row */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor }}>
        <div className="flex gap-1">
          <div className="h-1 w-5 rounded-full" style={{ background: muted }} />
          <div className="h-1 w-5 rounded-full" style={{ background: muted }} />
        </div>
        <div className="h-2 w-9 rounded-sm" style={{ background: accent }} />
      </div>
      {/* Photo grid */}
      <div className="grid p-1 gap-0.5" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="aspect-square relative" style={{ background: i % 3 === 1 ? placeholderAlt : placeholder }}>
            {i === 2 && (
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-sm" style={{ background: accent }} />
            )}
            {i === 5 && (
              <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-sm" style={{ background: accent }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Tiny "Part of [collection]" tag ────────────────────────── */
function CollectionTag({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1 font-mono text-[8px] uppercase tracking-widest text-[var(--fg-muted)] bg-[var(--bg-subtle)] border border-[var(--border)] px-1.5 py-0.5 rounded">
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
      Part of {name}
    </span>
  );
}

function PortfolioCard({ t, index, featured }: { t: PortfolioTemplate; index: number; featured?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`group overflow-hidden flex flex-col bg-[var(--bg-card)] transition-all ${
        featured ? "border-2 border-yellow" : "border border-[var(--border)] hover:border-[var(--fg-muted)]"
      }`}
    >
      {/* Generated preview */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <TemplatePreview kind="portfolio" style={t.style} />
        </div>
        {/* Hover CTAs */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-250 bg-black/40">
          {t.href ? (
            <>
              <Link href={t.href} target="_blank"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#111] font-sans text-[11px] font-semibold rounded-md hover:bg-yellow transition-colors">
                <ArrowIcon /> Preview
              </Link>
              {t.editorHref && (
                <Link href={t.editorHref}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-yellow text-[#111] font-sans text-[11px] font-bold rounded-md hover:bg-yellow/90 transition-colors">
                  Use →
                </Link>
              )}
            </>
          ) : (
            <span className="flex items-center gap-1.5 px-3.5 py-2 bg-white/20 backdrop-blur-sm text-white font-mono text-[10px] rounded-md">
              <LockIcon /> Soon
            </span>
          )}
        </div>
        {/* Browser chrome */}
        <div className="absolute top-0 left-0 right-0 h-5 bg-black/40 backdrop-blur-sm flex items-center px-2 gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" /><div className="w-1.5 h-1.5 rounded-full bg-white/30" /><div className="w-1.5 h-1.5 rounded-full bg-white/30" />
        </div>
        {t.new && <div className="absolute top-5 left-2 bg-yellow text-[#111] font-mono text-[8px] font-bold px-1.5 py-0.5 tracking-widest uppercase rounded-sm">New</div>}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-sans font-bold text-[var(--fg)] text-sm">{t.name}</h3>
            <span className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-wider">{t.category}</span>
          </div>
          {featured
            ? <span className="font-mono text-[9px] text-yellow bg-yellow/10 border border-yellow/30 px-1.5 py-0.5 shrink-0 rounded">In use</span>
            : !t.href && <span className="flex items-center gap-1 font-mono text-[9px] text-[var(--fg-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.5 shrink-0 rounded"><LockIcon /> Soon</span>
          }
        </div>
        <p className="font-sans text-[11px] font-light text-[var(--fg-muted)] leading-relaxed flex-1">{t.description}</p>

        {/* Tags + collection */}
        <div className="flex flex-wrap gap-1 pt-1 items-center">
          {t.tags.map((tag) => <span key={tag} className="font-mono text-[8px] text-[var(--fg-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded">{tag}</span>)}
          {t.collection && <CollectionTag name={t.collection.charAt(0).toUpperCase() + t.collection.slice(1)} />}
        </div>

        {/* CTA row */}
        <div className="pt-2 border-t border-[var(--border)] flex items-center gap-2">
          {t.href ? (
            <>
              <Link href={t.href} target="_blank"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md font-sans text-[10px] font-medium border border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Preview
              </Link>
              <Link href={t.editorHref ?? "#"}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md font-sans text-[10px] font-bold bg-yellow text-[#111] hover:bg-yellow/90 transition-colors"
              >
                Use template →
              </Link>
            </>
          ) : (
            <span className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md font-mono text-[9px] text-[var(--fg-muted)] opacity-50 cursor-not-allowed border border-dashed border-[var(--border)]">
              <LockIcon /> Coming soon
            </span>
          )}
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
        <div className="flex flex-wrap gap-1 pt-1 items-center">
          {t.tags.map((tag) => <span key={tag} className="font-mono text-[8px] text-[var(--fg-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded">{tag}</span>)}
          {t.collection && <CollectionTag name={t.collection} />}
        </div>
        <div className="pt-2 border-t border-[var(--border)] flex items-center gap-2">
          {t.available ? (
            <>
              {t.href ? (
                <Link href={t.href} target="_blank"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md font-sans text-[10px] font-medium border border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Preview
                </Link>
              ) : (
                <span className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md font-sans text-[10px] font-medium border border-dashed border-[var(--border)] text-[var(--fg-muted)] opacity-50 cursor-not-allowed">
                  No preview
                </span>
              )}
              <Link href="/dashboard/links"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md font-sans text-[10px] font-bold bg-yellow text-[#111] hover:bg-yellow/90 transition-colors"
              >
                Use template →
              </Link>
            </>
          ) : (
            <span className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md font-mono text-[9px] text-[var(--fg-muted)] opacity-50 cursor-not-allowed border border-dashed border-[var(--border)]">
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
  /* Build a generated preview style from the template's existing color tokens.
     accent = page background, fg = text, fg accents are derived as muted tint. */
  const previewStyle: PreviewStyle = { bg: t.accent, fg: t.fg, accent: t.fg, muted: t.sub };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden flex flex-col"
    >
      {/* Generated delivery preview */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/10", minHeight: 180 }}>
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <TemplatePreview kind="delivery" style={previewStyle} dense />
        </div>

        {/* Hover CTAs */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-250 bg-black/40">
          {t.available ? (
            <>
              {t.href && (
                <Link href={t.href} target="_blank"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#111] font-sans text-[11px] font-semibold rounded-md hover:bg-yellow transition-colors">
                  <ArrowIcon /> Preview
                </Link>
              )}
              <Link href="/dashboard/delivery"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-yellow text-[#111] font-sans text-[11px] font-bold rounded-md hover:bg-yellow/90 transition-colors">
                Use →
              </Link>
            </>
          ) : (
            <span className="flex items-center gap-1.5 px-3.5 py-2 bg-white/20 backdrop-blur-sm text-white font-mono text-[10px] rounded-md">
              <LockIcon /> Coming soon
            </span>
          )}
        </div>

        {t.new && <div className="absolute top-3 left-3 bg-yellow text-[#111] font-mono text-[8px] font-bold px-1.5 py-0.5 tracking-widest uppercase rounded-sm">New</div>}
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
          {!t.available && <span className="flex items-center gap-1 font-mono text-[9px] text-[var(--fg-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.5 shrink-0 rounded"><LockIcon /> Soon</span>}
        </div>
        <p className="font-sans text-[11px] font-light text-[var(--fg-muted)] leading-relaxed flex-1">{t.description}</p>

        {/* Tags + collection */}
        <div className="flex flex-wrap gap-1 pt-1 items-center">
          {t.tags.map((tag) => <span key={tag} className="font-mono text-[8px] text-[var(--fg-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.5 rounded">{tag}</span>)}
          {t.collection && <CollectionTag name={t.collection} />}
        </div>

        {/* CTA row — Preview + Use side-by-side */}
        <div className="pt-2 border-t border-[var(--border)] flex items-center gap-2">
          {t.available ? (
            <>
              {t.href ? (
                <Link href={t.href} target="_blank"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md font-sans text-[10px] font-medium border border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Preview
                </Link>
              ) : (
                <span className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md font-sans text-[10px] font-medium border border-dashed border-[var(--border)] text-[var(--fg-muted)] opacity-50 cursor-not-allowed">
                  No preview
                </span>
              )}
              <Link href="/dashboard/delivery"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md font-sans text-[10px] font-bold bg-yellow text-[#111] hover:bg-yellow/90 transition-colors"
              >
                Use template →
              </Link>
            </>
          ) : (
            <span className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md font-mono text-[9px] text-[var(--fg-muted)] opacity-50 cursor-not-allowed border border-dashed border-[var(--border)]">
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
    id: "collections",
    label: "Collections",
    count: COLLECTIONS.length,
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  },
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
  const [bannerVisible,    setBannerVisible]    = useState(true);
  const [styleBannerVisible, setStyleBannerVisible] = useState(true);
  const [wizardOpen,       setWizardOpen]       = useState(false);

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

      {/* Banners */}
      <AnimatePresence>
        {bannerVisible && (
          <TemplateBanner
            key="banner-collections"
            onDismiss={() => setBannerVisible(false)}
            onBrowse={() => { setBannerVisible(false); setProductType("collections"); }}
          />
        )}
        {styleBannerVisible && (
          <StyleBanner
            key="banner-style"
            onDismiss={() => setStyleBannerVisible(false)}
            onOpen={() => setWizardOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Style wizard modal */}
      <AnimatePresence>
        {wizardOpen && <StyleWizardModal onClose={() => setWizardOpen(false)} />}
      </AnimatePresence>

      {/* Content */}
      <div className="p-5 space-y-6">
        <AnimatePresence mode="wait">

          {/* ── Collections ── */}
          {productType === "collections" && (
            <motion.div key="collections" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="space-y-3">
              <p className="font-sans text-xs text-[var(--fg-muted)]">
                Each collection includes a portfolio, link page, and delivery gallery — all in one coherent visual style.
              </p>
              <div className="flex flex-col gap-3">
                {COLLECTIONS.map((c, i) => <CollectionCard key={c.id} c={c} index={i} />)}
              </div>
            </motion.div>
          )}

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
