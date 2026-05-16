"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "~/lib/cart";
import {
  DevicePreviewModal,
  DevicePicker,
  LivePreviewThumbnail,
  DEVICE_DIMS,
  useIsSmallScreen,
  type Device,
} from "~/components/dashboard/DevicePreviewModal";

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
  {
    id: "halcyon",
    name: "Halcyon",
    description: "Editorial warm-dark portfolio with burnt-sienna accent, Instrument Serif italics, and a typographic project index that reveals a hover thumbnail.",
    category: "Editorial",
    tags: ["Editorial", "Warm", "Italic"],
    href: "/template/halcyon",
    seed: 600,
    new: true,
    fonts: { serif: "Instrument Serif", sans: "Geist", mono: "Geist Mono" },
    style: { bg: "#0E0D0B", fg: "#EFEAE0", accent: "#C2410C", muted: "#8A8378" },
    collection: "halcyon",
  },
];


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
    id: "links-halcyon",
    name: "Halcyon",
    description: "Warm-dark single-screen hub with marquee strip, framed avatar, italic name, and accent-led link stack. Matches the Halcyon portfolio.",
    tags: ["Editorial", "Warm", "Italic"],
    available: true, new: true,
    bg: "#0E0D0B", fg: "#EFEAE0", sub: "#8A8378",
    btnStyle: "square", btnBg: "#C2410C", btnFg: "#EFEAE0", font: "Geist",
    href: "/template/halcyon/links",
    collection: "Halcyon",
  },
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
    id: "delivery-halcyon",
    name: "Halcyon",
    description: "Magazine-paced client gallery with curtain-reveal password gate, sectioned chapters, italic chapter heads, and burnt-sienna favorites.",
    tags: ["Editorial", "Warm", "Italic"],
    available: true, new: true,
    accent: "#1A1815", fg: "#EFEAE0", sub: "#8A8378",
    href: "/template/halcyon/delivery",
    collection: "Halcyon",
  },
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
    href: "/template/minimal/delivery",
    collection: "Minimal",
  },
  {
    id: "delivery-vogue",
    name: "Vogue",
    description: "High-contrast black with bold editorial typography. Perfect for fashion and commercial work.",
    tags: ["Dark", "Fashion", "Editorial"],
    available: true,
    accent: "#111111", fg: "#ffffff", sub: "#666666",
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
    id: "halcyon",
    name: "Halcyon",
    description: "Editorial warm-dark with burnt-sienna accents and Instrument Serif italics. A typographic project index, a curtain-reveal delivery gate, and a marquee-led links page — three pages cut from the same cloth.",
    accentColor: "#C2410C",
    accentText:  "#EFEAE0",
    pages: [
      { type: "portfolio", href: "/template/halcyon",          seed: 600 },
      { type: "links",     href: "/template/halcyon/links",    seed: 601 },
      { type: "delivery",  href: "/template/halcyon/delivery", seed: 602 },
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

type PageType = "portfolio" | "links" | "delivery";

function CollectionPreviewModal({ c, initialPage = "portfolio", onClose }: {
  c: TemplateCollection; initialPage?: PageType; onClose: () => void;
}) {
  const isSmall = useIsSmallScreen();
  const [device, setDevice] = useState<Device>(isSmall ? "mobile" : "desktop");
  const [page, setPage]     = useState<PageType>(initialPage);
  const [loading, setLoading] = useState(true);

  const currentPage = c.pages.find((p) => p.type === page);
  const url         = currentPage?.href ?? null;

  /* If the screen shrinks below the threshold, force mobile. */
  useEffect(() => {
    if (isSmall && device !== "mobile") setDevice("mobile");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSmall]);

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
        <DevicePicker device={device} onChange={setDevice} isSmall={isSmall} />
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

        {/* Identity representation — full template look at a glance,
            replacing the generic picsum thumbnails. Photographers see
            the actual typography, palette and voice before opening
            individual page previews further down the sheet. */}
        <div className="px-4 pt-2 pb-3">
          <div className="overflow-hidden rounded-xl border border-[var(--border)]" style={{ height: 240 }}>
            <BrandIdentity id={c.id} name={c.name} />
          </div>
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

/* ── Brand identity data — palette + typography per collection ── */

type Identity = {
  bg: string; raised: string; fg: string; muted: string; line: string; accent: string;
  display: string;            // header/display family
  displayWeight: number;
  displayItalic?: boolean;
  sans: string;               // body family
  mono: string;               // meta family
  tagline: string;            // a short italic-display sample line
};

const IDENTITIES: Record<string, Identity> = {
  brooklyn: { bg: "#0D0D0D", raised: "#161616", fg: "#F0EFE9", muted: "#7A7A7A", line: "#1F1F1F", accent: "#E8382C",
    display: "'DM Serif Display', Georgia, serif", displayWeight: 400, displayItalic: true,
    sans: "'Space Grotesk', system-ui, sans-serif", mono: "'Space Mono', ui-monospace, monospace",
    tagline: "Urban, all hours" },
  halcyon:  { bg: "#0E0D0B", raised: "#1A1815", fg: "#EFEAE0", muted: "#8A8378", line: "#2C2925", accent: "#C2410C",
    display: "'Instrument Serif', Georgia, serif", displayWeight: 400, displayItalic: true,
    sans: "'Geist', system-ui, sans-serif", mono: "'Geist Mono', ui-monospace, monospace",
    tagline: "The light keeps arriving" },
  petal:    { bg: "#f0ebe3", raised: "#faf6ee", fg: "#18181b", muted: "#71717a", line: "#e4dfd5", accent: "#d9544a",
    display: "'Cormorant Garamond', Georgia, serif", displayWeight: 500, displayItalic: true,
    sans: "'DM Sans', system-ui, sans-serif", mono: "ui-monospace, monospace",
    tagline: "Soft mornings, slow light" },
  atelier:  { bg: "#f3eee2", raised: "#faf6ec", fg: "#2a2520", muted: "#9c8e7a", line: "#dfd5c1", accent: "#c9a89a",
    display: "'Cormorant Garamond', Georgia, serif", displayWeight: 500, displayItalic: true,
    sans: "'DM Sans', system-ui, sans-serif", mono: "ui-monospace, monospace",
    tagline: "Timeless, never trendy" },
};

/* Compact brand mark — used on mobile collection cards where the full
   BrandIdentity is too small to read. Shows just the four essentials:
   background, accent dot, a display letter, and a palette stripe. */
function MiniBrandMark({ id, name }: { id: string; name: string }) {
  const i = IDENTITIES[id];
  if (!i) return null;
  const initial = name.trim().charAt(0).toUpperCase() || "A";
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ background: i.bg }}>
      <span
        style={{
          fontFamily: i.display,
          fontWeight: i.displayWeight,
          fontStyle: i.displayItalic ? "italic" : "normal",
          fontSize: 30, lineHeight: 1,
          letterSpacing: "-0.02em",
          color: i.fg,
        }}
      >
        {initial}<span style={{ color: i.accent }}>.</span>
      </span>
      {/* Bottom palette stripe — 3 dominant colors */}
      <div className="absolute left-0 right-0 bottom-0 flex h-1.5">
        <div className="flex-1" style={{ background: i.accent }} />
        <div className="flex-1" style={{ background: i.fg }} />
        <div className="flex-1" style={{ background: i.muted }} />
      </div>
    </div>
  );
}

/* Brand identity cover — shown on each collection card.
   Palette swatches + a typographic specimen, rendered in the collection's
   actual fonts and colors. Web fonts are loaded once via a single <link>. */
function BrandIdentity({ id, name }: { id: string; name: string }) {
  const i = IDENTITIES[id];
  if (!i) return null;

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ background: i.bg, color: i.fg }}
    >
      {/* webfonts — single link, browser de-dupes between cards */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;700&family=Space+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,800&family=Anton&family=Manrope:wght@400;500;700&family=Cormorant+Garamond:ital,wght@0,500;1,400&family=JetBrains+Mono&display=swap" />

      {/* edition / studio strip */}
      <div className="flex items-center justify-between px-5 pt-4" style={{ color: i.muted }}>
        <span style={{ fontFamily: i.mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          {name} · Identity
        </span>
        <span style={{ fontFamily: i.mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          06 / Vol. 1
        </span>
      </div>

      {/* Display name — the headline grade, styled in the collection's voice */}
      <div className="flex-1 flex items-center justify-center px-5 py-4">
        <div
          style={{
            fontFamily: i.display,
            fontWeight: i.displayWeight,
            fontStyle: i.displayItalic ? "italic" : "normal",
            fontSize: "clamp(46px, 8vw, 96px)",
            lineHeight: 0.9,
            letterSpacing: i.displayWeight >= 700 ? "-0.04em" : "-0.02em",
            color: i.fg,
            textTransform: "none",
            textAlign: "center",
          }}
        >
          {name}<span style={{ color: i.accent }}>.</span>
        </div>
      </div>

      {/* Tagline — a short specimen line in italic display */}
      <div className="px-5">
        <div
          style={{
            fontFamily: i.display,
            fontStyle: i.displayItalic ? "italic" : "normal",
            fontWeight: i.displayWeight >= 700 ? 500 : i.displayWeight,
            fontSize: 18,
            lineHeight: 1.2,
            color: i.muted,
            textAlign: "center",
          }}
        >
          {i.tagline}
        </div>
      </div>

      {/* Type stack row */}
      <div className="grid grid-cols-3 gap-0 mx-5 mt-4 border-t border-b" style={{ borderColor: i.line }}>
        {[
          { tag: "Display", sample: "Aa", font: i.display, weight: i.displayWeight, italic: i.displayItalic },
          { tag: "Sans",    sample: "Aa", font: i.sans,    weight: 500 },
          { tag: "Mono",    sample: "Aa", font: i.mono,    weight: 400 },
        ].map((t, k) => (
          <div key={t.tag} className="flex flex-col items-center justify-center gap-1 py-3"
            style={{ borderRight: k < 2 ? `1px solid ${i.line}` : "none" }}>
            <span style={{ fontFamily: t.font, fontWeight: t.weight, fontStyle: t.italic ? "italic" : "normal", fontSize: 28, lineHeight: 1, color: i.fg }}>
              {t.sample}
            </span>
            <span style={{ fontFamily: i.mono, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: i.muted }}>
              {t.tag}
            </span>
          </div>
        ))}
      </div>

      {/* Palette swatches */}
      <div className="flex h-9 mx-5 mt-4 mb-5">
        {[
          { c: i.accent, label: "AC" },
          { c: i.fg,     label: "FG" },
          { c: i.muted,  label: "MT" },
          { c: i.raised, label: "RS" },
          { c: i.bg,     label: "BG" },
        ].map((s, k) => (
          <div key={k} className="flex-1 relative" style={{ background: s.c, border: k === 4 ? `1px solid ${i.line}` : "none" }}>
            <span
              className="absolute left-1.5 bottom-1"
              style={{ fontFamily: i.mono, fontSize: 8, letterSpacing: "0.14em", color: s.c === i.bg || s.c === i.raised ? i.muted : "rgba(255,255,255,0.85)" }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
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
          <div className="flex-1 min-w-0">
            <h3 className="font-sans font-black text-[var(--fg)] text-base leading-none">{c.name}</h3>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--fg-muted)] mt-1 inline-block">Collection</span>
          </div>
          {/* Identity preview — compact, readable at this size */}
          <div className="shrink-0 overflow-hidden border border-[var(--border)]" style={{ width: 80, height: 64 }}>
            <MiniBrandMark id={c.id} name={c.name} />
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

  /* Desktop — horizontal card with brand identity cover on the right */
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
        <div className="flex">
          {/* ── Left: info ── */}
          <div className="flex-1 min-w-0 py-6 px-6 flex flex-col gap-4 justify-between">
            <div>
              <h3 className="font-sans font-black text-[var(--fg)] text-2xl leading-none tracking-tight">{c.name}</h3>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] mt-2 inline-block">Collection</span>
            </div>

            <p className="font-sans text-xs text-[var(--fg-muted)] leading-relaxed max-w-sm">{c.description}</p>

            {/* Page buttons — unified neutral chip styling, not template-tinted */}
            <div className="flex gap-2 flex-wrap">
              {c.pages.map((page) => (
                page.href ? (
                  <button key={page.type} onClick={() => setPreviewOpen(page.type as PageType)}
                    className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wide px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-emerald-500"><path d="M20 6L9 17l-5-5"/></svg>
                    {PAGE_LABELS[page.type]}
                  </button>
                ) : (
                  <span key={page.type}
                    className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wide px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--fg-muted)] opacity-45"
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

          {/* ── Right: brand identity cover (50%) ── */}
          <div className="relative w-1/2 shrink-0 overflow-hidden hidden md:block" style={{ minHeight: 320 }}>
            <BrandIdentity id={c.id} name={c.name} />
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

/* Wide font library — searchable by name, filterable by category. Stacks
   resolve from Google Fonts (loaded inline by the wizard preview) or fall
   back to system defaults. Adding a font here makes it available in the
   FontPickerModal automatically. */
const WIZARD_FONTS = [
  // Serif (display / editorial)
  { id: "cormorant",     label: "Cormorant Garamond", stack: "'Cormorant Garamond', Georgia, serif",  cat: "serif" },
  { id: "dm-serif",      label: "DM Serif Display",   stack: "'DM Serif Display', Georgia, serif",    cat: "serif" },
  { id: "playfair",      label: "Playfair Display",   stack: "'Playfair Display', Georgia, serif",    cat: "serif" },
  { id: "instrument",    label: "Instrument Serif",   stack: "'Instrument Serif', Georgia, serif",    cat: "serif" },
  { id: "fraunces",      label: "Fraunces",           stack: "'Fraunces', Georgia, serif",            cat: "serif" },
  { id: "libre-cal",     label: "Libre Caslon",       stack: "'Libre Caslon Text', Georgia, serif",   cat: "serif" },
  { id: "lora",          label: "Lora",               stack: "'Lora', Georgia, serif",                cat: "serif" },
  { id: "merriweather",  label: "Merriweather",       stack: "'Merriweather', Georgia, serif",        cat: "serif" },
  { id: "eb-garamond",   label: "EB Garamond",        stack: "'EB Garamond', Georgia, serif",         cat: "serif" },
  { id: "crimson",       label: "Crimson Pro",        stack: "'Crimson Pro', Georgia, serif",         cat: "serif" },
  { id: "spectral",      label: "Spectral",           stack: "'Spectral', Georgia, serif",            cat: "serif" },
  { id: "anton",         label: "Anton",              stack: "'Anton', Impact, sans-serif",           cat: "serif" },
  // Sans
  { id: "dm-sans",       label: "DM Sans",            stack: "'DM Sans', system-ui, sans-serif",      cat: "sans"  },
  { id: "space-grot",    label: "Space Grotesk",      stack: "'Space Grotesk', system-ui, sans-serif", cat: "sans"  },
  { id: "inter",         label: "Inter",              stack: "'Inter', system-ui, sans-serif",        cat: "sans"  },
  { id: "geist",         label: "Geist",              stack: "'Geist', system-ui, sans-serif",        cat: "sans"  },
  { id: "manrope",       label: "Manrope",            stack: "'Manrope', system-ui, sans-serif",      cat: "sans"  },
  { id: "archivo",       label: "Archivo",            stack: "'Archivo', system-ui, sans-serif",      cat: "sans"  },
  { id: "bricolage",     label: "Bricolage Grotesque", stack: "'Bricolage Grotesque', system-ui, sans-serif", cat: "sans" },
  { id: "host-grotesk",  label: "Host Grotesk",       stack: "'Host Grotesk', system-ui, sans-serif", cat: "sans"  },
  { id: "ibm-plex-sans", label: "IBM Plex Sans",      stack: "'IBM Plex Sans', system-ui, sans-serif", cat: "sans" },
  { id: "work-sans",     label: "Work Sans",          stack: "'Work Sans', system-ui, sans-serif",    cat: "sans"  },
  { id: "rubik",         label: "Rubik",              stack: "'Rubik', system-ui, sans-serif",        cat: "sans"  },
  { id: "outfit",        label: "Outfit",             stack: "'Outfit', system-ui, sans-serif",       cat: "sans"  },
  { id: "figtree",       label: "Figtree",            stack: "'Figtree', system-ui, sans-serif",      cat: "sans"  },
  { id: "syne",          label: "Syne",               stack: "'Syne', system-ui, sans-serif",         cat: "sans"  },
  { id: "satoshi",       label: "Satoshi",            stack: "'Satoshi', system-ui, sans-serif",      cat: "sans"  },
  // Mono
  { id: "space-mono",    label: "Space Mono",         stack: "'Space Mono', ui-monospace, monospace",     cat: "mono"  },
  { id: "jetbrains",     label: "JetBrains Mono",     stack: "'JetBrains Mono', ui-monospace, monospace", cat: "mono"  },
  { id: "geist-mono",    label: "Geist Mono",         stack: "'Geist Mono', ui-monospace, monospace",     cat: "mono"  },
  { id: "ibm-plex-mono", label: "IBM Plex Mono",      stack: "'IBM Plex Mono', ui-monospace, monospace",  cat: "mono"  },
  { id: "dm-mono",       label: "DM Mono",            stack: "'DM Mono', ui-monospace, monospace",        cat: "mono"  },
  { id: "fira-mono",     label: "Fira Mono",          stack: "'Fira Mono', ui-monospace, monospace",      cat: "mono"  },
] as const;

type FontCat = "serif" | "sans" | "mono";

/* Single Google Fonts stylesheet that imports every font in WIZARD_FONTS so
   previews render with the right typography in the wizard. */
const WIZARD_FONTS_HREF =
  "https://fonts.googleapis.com/css2?" +
  [
    "Cormorant+Garamond:wght@400;500;600",
    "DM+Serif+Display",
    "Playfair+Display:wght@400;500;700",
    "Instrument+Serif:ital@0;1",
    "Fraunces:wght@400;500;700",
    "Libre+Caslon+Text",
    "Lora:wght@400;600",
    "Merriweather:wght@400;700",
    "EB+Garamond:wght@400;500;700",
    "Crimson+Pro:wght@400;600",
    "Spectral:wght@400;600",
    "Anton",
    "DM+Sans:wght@400;500;700",
    "Space+Grotesk:wght@400;500;700",
    "Inter:wght@400;500;700",
    "Manrope:wght@400;600;700",
    "Archivo:wght@400;600",
    "Bricolage+Grotesque:wght@400;600;800",
    "Host+Grotesk:wght@400;600",
    "IBM+Plex+Sans:wght@400;600",
    "Work+Sans:wght@400;600",
    "Rubik:wght@400;600",
    "Outfit:wght@400;600",
    "Figtree:wght@400;600",
    "Syne:wght@400;700",
    "Space+Mono:wght@400;700",
    "JetBrains+Mono:wght@400;600",
    "IBM+Plex+Mono:wght@400;600",
    "DM+Mono",
    "Fira+Mono:wght@400;700",
  ].map((f) => `family=${f}`).join("&") +
  "&display=swap";

/* Standard palette presets. The Custom palette below extends this with
   the same slot structure (bg / fg / accent / muted / btnBg / btnFg) used by
   the delivery templates, so saved custom palettes map cleanly to template
   variables. */
const WIZARD_PALETTES = [
  { id: "bw",       label: "Black & White",  bg: "#fafafa", fg: "#0a0a0a", accent: "#facc15", muted: "#888888", btnBg: "#0a0a0a", btnFg: "#fafafa" },
  { id: "noir",     label: "Noir",           bg: "#0a0a0a", fg: "#f5f5f5", accent: "#e8382c", muted: "#666666", btnBg: "#e8382c", btnFg: "#0a0a0a" },
  { id: "warm",     label: "Warm Cream",     bg: "#faf8f5", fg: "#2a2520", accent: "#c9a89a", muted: "#9a9088", btnBg: "#2a2520", btnFg: "#faf8f5" },
  { id: "petal",    label: "Petal Pastel",   bg: "#f0ebe3", fg: "#18181b", accent: "#d9544a", muted: "#71717a", btnBg: "#d9544a", btnFg: "#ffffff" },
  { id: "brooklyn", label: "Brooklyn Red",   bg: "#0d0d0d", fg: "#f0efe9", accent: "#e8382c", muted: "#7a7a7a", btnBg: "#e8382c", btnFg: "#0d0d0d" },
  { id: "slate",    label: "Cool Slate",     bg: "#f0f4f8", fg: "#1e293b", accent: "#334155", muted: "#64748b", btnBg: "#1e293b", btnFg: "#f0f4f8" },
];

type Palette = { id: string; label: string; bg: string; fg: string; accent: string; muted: string; btnBg: string; btnFg: string };

const CUSTOM_PALETTES_KEY = "portapic.wizard.customPalettes";
const DEFAULT_CUSTOM_PALETTE: Palette = { id: "custom-draft", label: "Custom", bg: "#ffffff", fg: "#111111", accent: "#e8382c", muted: "#888888", btnBg: "#111111", btnFg: "#ffffff" };

type WizardState = {
  brandName:  string;
  logoMode:   "text" | "image" | "both";
  primary:    typeof WIZARD_FONTS[number];
  secondary:  typeof WIZARD_FONTS[number];
  mono:       typeof WIZARD_FONTS[number];
  palette:    Palette;
};

function StyleWizardModal({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<WizardState>({
    brandName: "Sofia Chen",
    logoMode:  "text",
    primary:   WIZARD_FONTS[0]!,
    secondary: WIZARD_FONTS.find((f) => f.id === "dm-sans")!,
    mono:      WIZARD_FONTS.find((f) => f.id === "space-mono")!,
    palette:   WIZARD_PALETTES[0]!,
  });
  const [customPalettes, setCustomPalettes] = useState<Palette[]>([]);
  const [fontPicker, setFontPicker] = useState<null | { slot: "primary" | "secondary" | "mono"; defaultFilter?: FontCat }>(null);
  const [paletteBuilder, setPaletteBuilder] = useState(false);

  /* Load saved custom palettes from localStorage on mount. */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_PALETTES_KEY);
      if (raw) setCustomPalettes(JSON.parse(raw) as Palette[]);
    } catch { /* ignore corrupted storage */ }
  }, []);

  const saveCustomPalettes = (next: Palette[]) => {
    setCustomPalettes(next);
    try { localStorage.setItem(CUSTOM_PALETTES_KEY, JSON.stringify(next)); } catch { /* quota or private mode */ }
  };

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape" && !fontPicker && !paletteBuilder) onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose, fontPicker, paletteBuilder]);

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
        {/* Load the full wizard font library once for the previews */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={WIZARD_FONTS_HREF} />

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

            {/* Font slots — each opens the searchable picker modal */}
            <FontSlotButton label="Primary font · Headings"  value={state.primary}   onClick={() => setFontPicker({ slot: "primary" })} />
            <FontSlotButton label="Secondary font · Body"    value={state.secondary} onClick={() => setFontPicker({ slot: "secondary" })} />
            <FontSlotButton label="Tertiary font · Labels"   value={state.mono}      onClick={() => setFontPicker({ slot: "mono", defaultFilter: "mono" })} />

            {/* Palette */}
            <Field label="Color palette">
              <div className="grid grid-cols-2 gap-2">
                {WIZARD_PALETTES.map((p) => (
                  <PaletteSwatch key={p.id} p={p} active={state.palette.id === p.id} onClick={() => patch("palette", p)} />
                ))}
                {customPalettes.map((p) => (
                  <PaletteSwatch key={p.id} p={p} active={state.palette.id === p.id} onClick={() => patch("palette", p)} custom
                    onDelete={() => {
                      const next = customPalettes.filter((x) => x.id !== p.id);
                      saveCustomPalettes(next);
                      if (state.palette.id === p.id) patch("palette", WIZARD_PALETTES[0]!);
                    }}
                  />
                ))}
                <button
                  onClick={() => setPaletteBuilder(true)}
                  className="flex items-center justify-center gap-2 p-2 rounded-lg border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:border-yellow hover:text-yellow transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <span className="font-sans text-[11px] font-medium">Custom palette</span>
                </button>
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

        {/* Font picker modal */}
        <AnimatePresence>
          {fontPicker && (
            <FontPickerModal
              defaultFilter={fontPicker.defaultFilter}
              current={state[fontPicker.slot].id}
              onSelect={(f) => { patch(fontPicker.slot, f); setFontPicker(null); }}
              onClose={() => setFontPicker(null)}
            />
          )}
        </AnimatePresence>

        {/* Palette builder modal */}
        <AnimatePresence>
          {paletteBuilder && (
            <PaletteBuilderModal
              onClose={() => setPaletteBuilder(false)}
              onSave={(p) => {
                const next = [...customPalettes, p];
                saveCustomPalettes(next);
                patch("palette", p);
                setPaletteBuilder(false);
              }}
            />
          )}
        </AnimatePresence>

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

/* Button that displays the current font with a large preview and opens
   the searchable picker on click. */
function FontSlotButton({ label, value, onClick }: {
  label: string;
  value: typeof WIZARD_FONTS[number];
  onClick: () => void;
}) {
  return (
    <Field label={label}>
      <button
        onClick={onClick}
        className="flex items-center justify-between gap-3 px-3 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--fg-muted)] transition-colors w-full"
      >
        <div className="text-left min-w-0 flex-1">
          <div style={{ fontFamily: value.stack }} className="text-2xl text-[var(--fg)] font-medium truncate leading-none">
            {value.label}
          </div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] mt-1.5">
            {value.cat} · click to change
          </div>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--fg-muted)] shrink-0">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </Field>
  );
}

/* Searchable font picker — large modal showing every font in WIZARD_FONTS
   with category filter pills and live previews. */
function FontPickerModal({
  current, defaultFilter, onSelect, onClose,
}: {
  current: string;
  defaultFilter?: FontCat;
  onSelect: (f: typeof WIZARD_FONTS[number]) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<FontCat | "all">(defaultFilter ?? "all");

  const filtered = WIZARD_FONTS.filter((f) => {
    if (cat !== "all" && f.cat !== cat) return false;
    if (query.trim() && !f.label.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl max-h-[80dvh] flex flex-col bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — search + filter pills */}
        <div className="flex flex-col gap-3 px-5 py-4 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-[var(--fg)] text-sm leading-none">Choose a font</h3>
            <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)]" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name…"
              className="w-full pl-8 pr-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--fg)] text-sm font-sans focus:border-yellow focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "serif", "sans", "mono"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  cat === c ? "bg-[var(--fg)] text-[var(--bg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]"
                }`}
              >
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>
        </div>

        {/* Font list */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3">
          {filtered.length === 0 ? (
            <div className="py-16 text-center font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest">No fonts match</div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {filtered.map((f) => {
                const active = f.id === current;
                return (
                  <button
                    key={f.id}
                    onClick={() => onSelect(f)}
                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                      active ? "border-yellow bg-yellow/5" : "border-transparent hover:bg-[var(--bg-subtle)]"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div style={{ fontFamily: f.stack }} className="text-2xl text-[var(--fg)] leading-none truncate">{f.label}</div>
                      <div style={{ fontFamily: f.stack }} className="text-sm text-[var(--fg-muted)] mt-1.5 truncate">The quick brown fox jumps over the lazy dog</div>
                    </div>
                    <span className={`shrink-0 font-mono text-[9px] uppercase tracking-widest ${active ? "text-yellow" : "text-[var(--fg-muted)]"}`}>{f.cat}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* Reusable palette swatch — used for both built-in and custom palettes. */
function PaletteSwatch({ p, active, onClick, custom, onDelete }: {
  p: Palette; active: boolean; onClick: () => void;
  custom?: boolean; onDelete?: () => void;
}) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-2 p-2 rounded-lg border transition-all ${
          active ? "border-yellow ring-2 ring-yellow/30" : "border-[var(--border)] hover:border-[var(--fg-muted)]"
        }`}
      >
        <div className="flex gap-0.5 rounded overflow-hidden shrink-0">
          {[p.bg, p.fg, p.accent, p.muted, p.btnBg].map((c, i) => (
            <div key={i} className="w-2.5 h-6" style={{ background: c }} />
          ))}
        </div>
        <span className="font-sans text-[11px] font-medium text-[var(--fg)] truncate flex-1 text-left">{p.label}</span>
      </button>
      {custom && onDelete && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-[var(--fg-muted)] hover:text-red-500 hover:border-red-500 transition-colors opacity-0 group-hover:opacity-100 flex items-center justify-center"
          aria-label="Delete palette"
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      )}
    </div>
  );
}

/* Build a custom palette using the same six slots templates expose
   (bg / fg / accent / muted / btnBg / btnFg). Saves to localStorage. */
function PaletteBuilderModal({ onClose, onSave }: { onClose: () => void; onSave: (p: Palette) => void }) {
  const [draft, setDraft] = useState<Palette>({ ...DEFAULT_CUSTOM_PALETTE });
  const [name, setName] = useState("");

  const update = (key: keyof Palette, value: string) => setDraft((d) => ({ ...d, [key]: value }));
  const canSave = name.trim().length > 0;

  const commit = () => {
    if (!canSave) return;
    onSave({
      ...draft,
      id: `custom-${Date.now()}`,
      label: name.trim(),
    });
  };

  const swatchRow = (key: keyof Palette, labelText: string, hint: string) => (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="font-sans text-xs font-semibold text-[var(--fg)]">{labelText}</div>
        <div className="font-sans text-[11px] text-[var(--fg-muted)]">{hint}</div>
      </div>
      <label className="relative flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg border border-[var(--border)] hover:border-[var(--fg-muted)] transition-colors">
        <span className="w-5 h-5 rounded border border-black/10" style={{ background: draft[key] as string }} />
        <input type="color" value={draft[key] as string} onChange={(e) => update(key, e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer" />
        <span className="font-mono text-[10px] text-[var(--fg)] uppercase w-16">{draft[key] as string}</span>
      </label>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col max-h-[85dvh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] shrink-0">
          <h3 className="font-sans font-bold text-[var(--fg)] text-sm leading-none">New custom palette</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="overflow-y-auto p-5 flex flex-col gap-4">
          <Field label="Palette name">
            <input
              autoFocus value={name} onChange={(e) => setName(e.target.value)}
              placeholder="My brand"
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--fg)] text-sm font-sans focus:border-yellow focus:outline-none transition-colors"
            />
          </Field>

          {/* Live preview strip */}
          <div className="rounded-lg overflow-hidden border border-[var(--border)]" style={{ background: draft.bg }}>
            <div className="px-4 py-5" style={{ color: draft.fg }}>
              <div className="font-mono text-[9px] uppercase tracking-widest" style={{ color: draft.muted }}>Preview</div>
              <div className="font-sans font-bold text-lg mt-1">Your brand name</div>
              <div className="font-sans text-xs mt-1" style={{ color: draft.muted }}>Soft mornings, slow light.</div>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded font-mono text-[10px] uppercase tracking-widest" style={{ background: draft.btnBg, color: draft.btnFg }}>
                Download all
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {swatchRow("bg",     "Background",  "Page surface behind everything")}
            {swatchRow("fg",     "Text",        "Headings + body copy")}
            {swatchRow("muted",  "Muted",       "Captions, labels, metadata")}
            {swatchRow("accent", "Accent",      "Highlights, key marks")}
            {swatchRow("btnBg",  "Button bg",   "Primary CTA fill")}
            {swatchRow("btnFg",  "Button text", "Primary CTA label")}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[var(--border)] shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">Cancel</button>
          <button
            onClick={commit} disabled={!canSave}
            className="px-4 py-2 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Save palette
          </button>
        </div>
      </motion.div>
    </motion.div>
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
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`group overflow-hidden flex flex-col bg-[var(--bg-card)] transition-all ${
        featured ? "border-2 border-yellow" : "border border-[var(--border)] hover:border-[var(--fg-muted)]"
      }`}
    >
      {/* Live preview — iframe of the actual page when available, else wireframe */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          {t.href ? (
            <LivePreviewThumbnail url={t.href} baseWidth={1280} className="w-full h-full" />
          ) : (
            <TemplatePreview kind="portfolio" style={t.style} />
          )}
        </div>
        {/* Hover CTAs */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-250 bg-black/40">
          {t.href ? (
            <>
              <button onClick={() => setPreviewOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#111] font-sans text-[11px] font-semibold rounded-md hover:bg-yellow transition-colors">
                <ArrowIcon /> Preview
              </button>
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
              <button onClick={() => setPreviewOpen(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md font-sans text-[10px] font-medium border border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                Preview
              </button>
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

      <AnimatePresence>
        {previewOpen && t.href && (
          <DevicePreviewModal
            url={t.href}
            title={t.name}
            subtitle={`Portfolio · ${t.category}`}
            accentChip={
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-sm" style={{ background: t.style.accent, border: `1px solid ${t.style.fg}30` }} />
                Theme
              </span>
            }
            onClose={() => setPreviewOpen(false)}
          />
        )}
      </AnimatePresence>
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
  const [previewOpen, setPreviewOpen] = useState(false);

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
                <button onClick={() => setPreviewOpen(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md font-sans text-[10px] font-medium border border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Preview
                </button>
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

      <AnimatePresence>
        {previewOpen && t.href && (
          <DevicePreviewModal
            url={t.href}
            title={t.name}
            subtitle="Links page"
            accentChip={
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-sm" style={{ background: t.btnBg, border: `1px solid ${t.fg}30` }} />
                Theme
              </span>
            }
            onClose={() => setPreviewOpen(false)}
          />
        )}
      </AnimatePresence>
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
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden flex flex-col"
    >
      {/* Live preview — iframe when available, else wireframe */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/10", minHeight: 180 }}>
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          {t.href ? (
            <LivePreviewThumbnail url={t.href} baseWidth={1280} className="w-full h-full" />
          ) : (
            <TemplatePreview kind="delivery" style={previewStyle} dense />
          )}
        </div>

        {/* Hover CTAs */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-250 bg-black/40">
          {t.available ? (
            <>
              {t.href && (
                <button onClick={() => setPreviewOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-[#111] font-sans text-[11px] font-semibold rounded-md hover:bg-yellow transition-colors">
                  <ArrowIcon /> Preview
                </button>
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
                <button onClick={() => setPreviewOpen(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md font-sans text-[10px] font-medium border border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Preview
                </button>
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

      <AnimatePresence>
        {previewOpen && t.href && (
          <DevicePreviewModal
            url={t.href}
            title={t.name}
            subtitle="Delivery gallery"
            accentChip={
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-sm" style={{ background: t.accent, border: `1px solid ${t.fg}30` }} />
                Theme
              </span>
            }
            onClose={() => setPreviewOpen(false)}
          />
        )}
      </AnimatePresence>
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
  const [bannerVisible,    setBannerVisible]    = useState(true);
  const [styleBannerVisible, setStyleBannerVisible] = useState(true);
  const [wizardOpen,       setWizardOpen]       = useState(false);

  const filteredPortfolio = PORTFOLIO_TEMPLATES;

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

        {/* Product type tabs — horizontal-scrollable on narrow viewports so all
            four destinations stay reachable on phone without wrapping or
            overflow. Hide the scrollbar visually but keep momentum scrolling. */}
        <div className="flex gap-0 border-b border-[var(--border)] -mb-px overflow-x-auto -mx-5 px-5 scrollbar-none" style={{ WebkitOverflowScrolling: "touch" }}>
          {PRODUCT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setProductType(tab.id)}
              className={`shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 font-sans text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
      </div>

      {/* Banners — collections banner hides itself on the Collections tab */}
      <AnimatePresence>
        {bannerVisible && productType !== "collections" && (
          <TemplateBanner
            key="banner-collections"
            onDismiss={() => setBannerVisible(false)}
            onBrowse={() => { setProductType("collections"); }}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredPortfolio.map((t, i) => (
                  <PortfolioCard key={t.id} t={t} index={i} featured={!!t.featured} />
                ))}
              </div>
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
