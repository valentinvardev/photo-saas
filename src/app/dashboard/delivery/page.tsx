"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ══════════════════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════════════════ */

type DeliveryMode    = "gift" | "direct" | "selection";
type LayoutStyle     = "grid" | "masonry";
type TemplateName    = "minimal" | "vogue" | "cinematic" | "editorial";
type DeliveryStatus  = "draft" | "active" | "expired";
type LogoMode        = "none" | "text" | "image" | "image+text";

interface DeliveryPage {
  id:               string;
  title:            string;
  client:           string;
  status:           DeliveryStatus;
  photoCount:       number;
  photoSeeds:       number[];   // photos added to this delivery
  coverSeed:        number;
  coverUrl:         string;     // optional override for cover image
  views:            number;
  lastViewed:       string | null;
  createdAt:        string;
  expiresAt:        string | null;
  // Security
  passwordEnabled:  boolean;
  password:         string;
  whitelistEnabled: boolean;
  whitelist:        string[];
  // Monetization
  mode:             DeliveryMode;
  selectionLimit:   number;
  pricePerPhoto:    number;
  priceFullGallery: number;
  watermark:        boolean;
  downloadRes:      "full" | "web" | "choice";
  proofingEnabled:  boolean;
  // Aesthetic
  template:         TemplateName;
  layout:           LayoutStyle;
  welcomeMessage:   string;
  showUpsellBanner: boolean;
  // Branding
  logoMode:         LogoMode;
  logoText:         string;
  logoUrl:          string;
  // Custom style override (off → use template defaults)
  customColors:     boolean;
  colorBg:          string;
  colorFg:          string;
  colorAccent:      string;
  colorBtnBg:       string;
  colorBtnFg:       string;
  fontFamily:       string;
}

/* ══════════════════════════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════════════════════════ */

// All photos in the photographer's general gallery (mock)
const ALL_GALLERY_SEEDS = Array.from({ length: 48 }, (_, i) => i + 10);

const DEFAULT_BRANDING = {
  logoMode: "text" as LogoMode,
  logoText: "STUDIO",
  logoUrl: "",
  customColors: false,
  colorBg: "#ffffff", colorFg: "#111111",
  colorAccent: "#f5f5f5",
  colorBtnBg: "#111111", colorBtnFg: "#ffffff",
  fontFamily: "Inter, sans-serif",
};

const INITIAL_PAGES: DeliveryPage[] = [
  {
    id: "dp1", title: "Wedding Gallery", client: "Sarah & James",
    status: "active", photoCount: 247, photoSeeds: [10,11,12,13,14,15,16,17,18,19,20,21], coverSeed: 401, coverUrl: "",
    views: 12, lastViewed: "2 hours ago", createdAt: "Apr 2, 2026", expiresAt: "May 2, 2026",
    passwordEnabled: true,  password: "sarah2026", whitelistEnabled: false, whitelist: [],
    mode: "selection", selectionLimit: 30, pricePerPhoto: 0, priceFullGallery: 0,
    watermark: true, downloadRes: "choice", proofingEnabled: false,
    template: "minimal", layout: "masonry", welcomeMessage: "Sarah & James — thank you for a beautiful day. Browse and select your 30 favorites.", showUpsellBanner: false,
    ...DEFAULT_BRANDING, logoText: "S&J",
  },
  {
    id: "dp2", title: "Commercial Shoot", client: "Nike Brand",
    status: "draft", photoCount: 84, photoSeeds: [22,23,24,25,26,27,28,29], coverSeed: 402, coverUrl: "",
    views: 0, lastViewed: null, createdAt: "Apr 8, 2026", expiresAt: null,
    passwordEnabled: false, password: "", whitelistEnabled: true, whitelist: ["brand@nike.com", "creative@nike.com"],
    mode: "gift", selectionLimit: 0, pricePerPhoto: 0, priceFullGallery: 0,
    watermark: false, downloadRes: "full", proofingEnabled: true,
    template: "cinematic", layout: "grid", welcomeMessage: "Here are the final assets from the Spring '26 campaign.", showUpsellBanner: false,
    ...DEFAULT_BRANDING, logoText: "STUDIO",
  },
  {
    id: "dp3", title: "Portrait Session", client: "Emma K.",
    status: "expired", photoCount: 48, photoSeeds: [30,31,32,33,34,35], coverSeed: 403, coverUrl: "",
    views: 34, lastViewed: "3 days ago", createdAt: "Mar 1, 2026", expiresAt: "Apr 1, 2026",
    passwordEnabled: false, password: "", whitelistEnabled: false, whitelist: [],
    mode: "direct", selectionLimit: 0, pricePerPhoto: 12, priceFullGallery: 399,
    watermark: true, downloadRes: "full", proofingEnabled: false,
    template: "editorial", layout: "grid", welcomeMessage: "Hi Emma! Your portraits are ready. Purchase individual photos or grab the full set.", showUpsellBanner: true,
    ...DEFAULT_BRANDING, logoText: "EMMA K.",
  },
];

const DEFAULT_PAGE: Omit<DeliveryPage, "id" | "title" | "client" | "createdAt"> = {
  status: "draft", photoCount: 0, photoSeeds: [], coverSeed: 404, coverUrl: "",
  views: 0, lastViewed: null, expiresAt: null,
  passwordEnabled: false, password: "", whitelistEnabled: false, whitelist: [],
  mode: "gift", selectionLimit: 20, pricePerPhoto: 15, priceFullGallery: 299,
  watermark: true, downloadRes: "full", proofingEnabled: false,
  template: "minimal", layout: "grid", welcomeMessage: "", showUpsellBanner: true,
  ...DEFAULT_BRANDING,
};

const DELIVERY_FONTS: { label: string; value: string }[] = [
  { label: "Inter",        value: "Inter, sans-serif" },
  { label: "DM Sans",      value: "'DM Sans', sans-serif" },
  { label: "Playfair",     value: "'Playfair Display', serif" },
  { label: "Cormorant",    value: "'Cormorant Garamond', serif" },
  { label: "Space Grotesk",value: "'Space Grotesk', sans-serif" },
  { label: "Manrope",      value: "Manrope, sans-serif" },
  { label: "DM Serif",     value: "'DM Serif Display', serif" },
  { label: "Archivo",      value: "Archivo, sans-serif" },
];

const TEMPLATES: { id: TemplateName; label: string; desc: string; accent: string; fg: string; sub: string }[] = [
  { id: "minimal",   label: "Minimal",   desc: "Clean white space, serif typography, subtle grid",   accent: "#f5f5f5", fg: "#111111", sub: "#888888" },
  { id: "vogue",     label: "Vogue",     desc: "High-contrast black, bold editorial headlines",       accent: "#111111", fg: "#ffffff", sub: "#666666" },
  { id: "cinematic", label: "Cinematic", desc: "Dark dramatic tones, full-bleed film aesthetic",      accent: "#1a1209", fg: "#e8dcc8", sub: "#7a6a50" },
  { id: "editorial", label: "Editorial", desc: "Magazine layout, oversized type, neutral palette",    accent: "#f0ede8", fg: "#1a1a1a", sub: "#7a7065" },
];

const STATUS_META: Record<DeliveryStatus, { dot: string; text: string; label: string }> = {
  active:  { dot: "bg-green-400",  text: "text-green-400",  label: "Active"  },
  draft:   { dot: "bg-[var(--fg-muted)]", text: "text-[var(--fg-muted)]", label: "Draft" },
  expired: { dot: "bg-red-400",    text: "text-red-400",    label: "Expired" },
};

/* ══════════════════════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════════════════════ */

const ic = (d: string, s = "1.75") => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={s} strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

function ChevronRight({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform 150ms" }}>
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SMALL HELPERS
══════════════════════════════════════════════════════════════════════════ */

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked} onClick={onChange}
      style={{
        position: "relative", display: "inline-flex", flexShrink: 0,
        width: 36, height: 20, borderRadius: 9999, border: checked ? "none" : "1px solid var(--border)",
        padding: 0, cursor: "pointer", backgroundColor: checked ? "#fad502" : "var(--bg-subtle)",
        transition: "background-color 150ms",
      }}
    >
      <span style={{
        position: "absolute", top: 2, left: checked ? 18 : 2, width: 16, height: 16,
        borderRadius: "50%", backgroundColor: checked ? "#111" : "var(--fg-muted)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.25)", transition: "left 150ms, background-color 150ms",
        pointerEvents: "none",
      }}/>
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-muted)] mb-2">{children}</p>;
}

function Accordion({ title, icon, children, defaultOpen = false }: { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl overflow-hidden bg-[var(--bg-card)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-[var(--bg-subtle)] transition-colors text-left"
      >
        <span className="text-[var(--fg-muted)]">{icon}</span>
        <span className="font-sans font-semibold text-sm text-[var(--fg)] flex-1">{title}</span>
        <span className="text-[var(--fg-muted)]"><ChevronRight open={open} /></span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.18 }} className="overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BUILDER LEFT PANEL
══════════════════════════════════════════════════════════════════════════ */

function AccessSection({ page, set }: { page: DeliveryPage; set: <K extends keyof DeliveryPage>(k: K, v: DeliveryPage[K]) => void }) {
  const genPassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    set("password", Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join(""));
  };

  return (
    <Accordion title="Access & Security" defaultOpen icon={
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    }>
      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="font-sans text-sm font-medium text-[var(--fg)]">Password protection</span>
            <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">Require a password to view this gallery</p>
          </div>
          <Toggle checked={page.passwordEnabled} onChange={() => set("passwordEnabled", !page.passwordEnabled)} />
        </div>
        <AnimatePresence>
          {page.passwordEnabled && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex gap-2 mt-2">
                <input
                  value={page.password}
                  onChange={(e) => set("password", e.target.value)}
                  className="flex-1 font-mono text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors"
                  placeholder="Enter password"
                />
                <button onClick={genPassword} className="shrink-0 px-3 py-2 rounded-lg border border-[var(--border)] font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
                  Generate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expiry */}
      <div>
        <SectionLabel>Expiration date</SectionLabel>
        <input
          type="date"
          value={page.expiresAt ?? ""}
          onChange={(e) => set("expiresAt", e.target.value || null)}
          className="w-full font-mono text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors"
        />
        <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-1">Gallery becomes inaccessible after this date — creates urgency</p>
      </div>

      {/* Whitelist */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="font-sans text-sm font-medium text-[var(--fg)]">Client whitelist</span>
            <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">Restrict access to specific email addresses</p>
          </div>
          <Toggle checked={page.whitelistEnabled} onChange={() => set("whitelistEnabled", !page.whitelistEnabled)} />
        </div>
        <AnimatePresence>
          {page.whitelistEnabled && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-2 space-y-1.5">
                {page.whitelist.map((email, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="flex-1 font-mono text-xs text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 truncate">{email}</span>
                    <button onClick={() => set("whitelist", page.whitelist.filter((_, j) => j !== i))} className="p-1.5 text-[var(--fg-muted)] hover:text-red-400 transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                ))}
                <EmailAddRow onAdd={(e) => set("whitelist", [...page.whitelist, e])} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Accordion>
  );
}

function EmailAddRow({ onAdd }: { onAdd: (e: string) => void }) {
  const [val, setVal] = useState("");
  const submit = () => { if (val.includes("@")) { onAdd(val.trim()); setVal(""); } };
  return (
    <div className="flex gap-2">
      <input
        value={val} onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        className="flex-1 font-mono text-xs text-[var(--fg)] bg-[var(--bg)] border border-dashed border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors"
        placeholder="client@email.com"
      />
      <button onClick={submit} className="shrink-0 px-3 py-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
        Add
      </button>
    </div>
  );
}

function MonetizationSection({ page, set }: { page: DeliveryPage; set: <K extends keyof DeliveryPage>(k: K, v: DeliveryPage[K]) => void }) {
  const suggestedGalleryPrice = page.pricePerPhoto > 0 ? Math.round(page.pricePerPhoto * page.photoCount * 0.6) : 0;
  const savings = page.pricePerPhoto > 0 ? Math.round((1 - page.priceFullGallery / (page.pricePerPhoto * page.photoCount)) * 100) : 0;

  return (
    <Accordion title="Monetization & Downloads" icon={
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    }>
      {/* Mode */}
      <div>
        <SectionLabel>Delivery mode</SectionLabel>
        <div className="flex flex-col gap-2">
          {([
            { id: "gift",      label: "Gift / Free",       desc: "Client downloads at no cost" },
            { id: "direct",    label: "Direct Sale",        desc: "Clients purchase photos individually or as a bundle" },
            { id: "selection", label: "Selection Mode",     desc: "Client picks favorites from a paid contract" },
          ] as { id: DeliveryMode; label: string; desc: string }[]).map((opt) => (
            <button
              key={opt.id}
              onClick={() => set("mode", opt.id)}
              className={`flex items-start gap-3 px-3 py-3 rounded-xl border text-left transition-all ${
                page.mode === opt.id
                  ? "border-yellow bg-yellow/5"
                  : "border-[var(--border)] hover:border-[var(--fg-muted)]"
              }`}
            >
              <span className={`mt-0.5 w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${page.mode === opt.id ? "border-yellow" : "border-[var(--fg-muted)]"}`}>
                {page.mode === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-yellow block" />}
              </span>
              <div>
                <div className="font-sans text-sm font-medium text-[var(--fg)]">{opt.label}</div>
                <div className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pricing — only for direct sale */}
      <AnimatePresence>
        {page.mode === "direct" && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3">
            <div>
              <SectionLabel>Price per photo</SectionLabel>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[var(--fg-muted)]">$</span>
                <input
                  type="number" min={0} value={page.pricePerPhoto}
                  onChange={(e) => set("pricePerPhoto", Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2.5 font-mono text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg outline-none focus:border-yellow transition-colors"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <SectionLabel>Full gallery price</SectionLabel>
                {page.photoCount > 0 && page.pricePerPhoto > 0 && (
                  <button onClick={() => set("priceFullGallery", suggestedGalleryPrice)} className="font-mono text-[10px] text-yellow hover:underline">
                    Suggest ${suggestedGalleryPrice} (40% off)
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[var(--fg-muted)]">$</span>
                <input
                  type="number" min={0} value={page.priceFullGallery}
                  onChange={(e) => set("priceFullGallery", Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2.5 font-mono text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg outline-none focus:border-yellow transition-colors"
                />
              </div>
              {savings > 0 && (
                <p className="font-sans text-[11px] text-green-400 mt-1">Clients save {savings}% vs buying individually</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-sans text-sm font-medium text-[var(--fg)]">Show upsell banner</span>
                <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">Highlight the bundle deal at the top of the gallery</p>
              </div>
              <Toggle checked={page.showUpsellBanner} onChange={() => set("showUpsellBanner", !page.showUpsellBanner)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection limit */}
      <AnimatePresence>
        {page.mode === "selection" && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <SectionLabel>Selection limit</SectionLabel>
            <div className="flex items-center gap-3">
              <input
                type="range" min={1} max={200} value={page.selectionLimit}
                onChange={(e) => set("selectionLimit", Number(e.target.value))}
                className="flex-1 accent-yellow"
              />
              <span className="font-mono text-sm font-bold text-[var(--fg)] w-12 text-right">{page.selectionLimit} photos</span>
            </div>
            <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-1">Client can heart up to {page.selectionLimit} photos from the gallery</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Downloads */}
      <div>
        <SectionLabel>Download resolution</SectionLabel>
        <div className="flex gap-2">
          {([
            { id: "full",   label: "Full res" },
            { id: "web",    label: "Web only" },
            { id: "choice", label: "Client's choice" },
          ] as { id: "full" | "web" | "choice"; label: string }[]).map((opt) => (
            <button
              key={opt.id}
              onClick={() => set("downloadRes", opt.id)}
              className={`flex-1 py-2 rounded-xl border font-sans text-xs font-medium transition-all ${
                page.downloadRes === opt.id
                  ? "border-yellow bg-yellow/10 text-[var(--fg)]"
                  : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Watermark */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-sans text-sm font-medium text-[var(--fg)]">Watermark previews</span>
          <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">Add watermark to low-res preview images</p>
        </div>
        <Toggle checked={page.watermark} onChange={() => set("watermark", !page.watermark)} />
      </div>

      {/* Proofing */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-sans text-sm font-medium text-[var(--fg)]">Proofing mode</span>
          <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">Clients can leave comments on individual photos</p>
        </div>
        <Toggle checked={page.proofingEnabled} onChange={() => set("proofingEnabled", !page.proofingEnabled)} />
      </div>
    </Accordion>
  );
}

function TemplateModal({ current, onSelect, onClose }: { current: TemplateName; onSelect: (t: TemplateName) => void; onClose: () => void }) {
  const [preview, setPreview] = useState<TemplateName>(current);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const chosen = TEMPLATES.find((t) => t.id === preview)!;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-3xl flex flex-col rounded-2xl bg-[var(--bg)] border border-[var(--border)] shadow-2xl overflow-hidden"
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
          <div>
            <h3 className="font-sans font-black text-[var(--fg)] text-sm">Choose template</h3>
            <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">Select a visual style for your delivery page</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left — template list */}
          <div className="w-56 shrink-0 border-r border-[var(--border)] overflow-y-auto p-3 space-y-1">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setPreview(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  preview === t.id ? "bg-yellow/10 text-[var(--fg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]"
                }`}
              >
                <div className="w-8 h-8 rounded-lg shrink-0 border border-[var(--border)]" style={{ background: t.accent }} />
                <div className="min-w-0">
                  <div className={`font-sans text-xs font-semibold truncate ${preview === t.id ? "text-[var(--fg)]" : ""}`}>{t.label}</div>
                  {preview === t.id && <div className="font-mono text-[9px] text-yellow mt-0.5">Selected</div>}
                </div>
              </button>
            ))}
          </div>

          {/* Right — large preview */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Mock delivery page preview */}
            <div className="flex-1 overflow-hidden" style={{ background: chosen.accent }}>
              {/* Nav bar */}
              <div className="flex items-center justify-between px-8 py-4" style={{ borderBottom: `1px solid ${chosen.fg}18` }}>
                <span style={{ fontFamily: "serif", fontSize: 14, fontWeight: 900, color: chosen.fg, letterSpacing: "0.12em", textTransform: "uppercase" }}>FRAME</span>
                <div className="flex items-center gap-4">
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: chosen.sub }}>Gallery</span>
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: chosen.sub }}>Info</span>
                  <div style={{ width: 70, height: 26, borderRadius: 4, border: `1px solid ${chosen.fg}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "sans-serif", fontSize: 9, fontWeight: 700, color: chosen.fg }}>Download</span>
                  </div>
                </div>
              </div>
              {/* Hero */}
              <div className="px-8 py-6">
                <div style={{ fontFamily: "serif", fontSize: 28, fontWeight: 900, color: chosen.fg, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 8 }}>
                  Sarah &amp; James
                </div>
                <div style={{ fontFamily: "monospace", fontSize: 10, color: chosen.sub, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 24 }}>
                  Wedding · April 2026 · 247 photos
                </div>
                {/* Photo grid preview */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                  {[401,402,403,404,405,406,407,408].map((seed) => (
                    <div key={seed} style={{ aspectRatio: "1", overflow: "hidden", borderRadius: chosen.id === "minimal" || chosen.id === "editorial" ? 4 : 0 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://picsum.photos/seed/${seed}/200/200?grayscale`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between shrink-0">
              <div>
                <div className="font-sans font-bold text-[var(--fg)] text-sm">{chosen.label}</div>
                <div className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">{chosen.desc}</div>
              </div>
              <button
                onClick={() => { onSelect(preview); onClose(); }}
                className="px-5 py-2 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Use this template
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Color row with native picker ── */
function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-center gap-2">
      <span className="font-sans text-xs text-[var(--fg-muted)] flex-1 truncate">{label}</span>
      <div className="flex items-center gap-1.5 border border-[var(--border)] rounded-lg px-2 py-1 hover:border-[var(--fg-muted)] transition-colors cursor-pointer" onClick={() => inputRef.current?.click()}>
        <div className="relative w-4 h-4 shrink-0">
          <div className="w-4 h-4 rounded border border-black/10" style={{ background: value }} />
          <input
            ref={inputRef}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ position: "absolute", top: 0, left: 0, width: 1, height: 1, opacity: 0, border: "none", padding: 0, cursor: "pointer" }}
          />
        </div>
        <span className="font-mono text-[11px] text-[var(--fg)] w-14 select-none">{value}</span>
      </div>
    </div>
  );
}

/* ── Single photo picker (for cover, logo) ── */
function SinglePhotoPicker({
  value,
  onSelect,
  onClose,
}: {
  value: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(value);
  const [tab, setTab] = useState<"gallery" | "url">("gallery");
  const [urlDraft, setUrlDraft] = useState(value);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploaded((prev) => [url, ...prev]);
    setSelected(url);
    e.target.value = "";
  }

  const allPhotos = [
    ...uploaded,
    ...ALL_GALLERY_SEEDS.map((s) => `https://picsum.photos/seed/${s}/800/800`),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-[700px] h-[480px] bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] shrink-0">
          <span className="font-mono text-xs text-[var(--fg-muted)] uppercase tracking-widest">Select image</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-[360px] border-r border-[var(--border)] flex flex-col">
            <div className="flex border-b border-[var(--border)] shrink-0">
              {(["gallery", "url"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 font-sans text-xs py-2.5 capitalize transition-colors border-b-2 -mb-px ${tab === t ? "border-yellow text-[var(--fg)]" : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)]"}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {tab === "gallery" ? (
                <>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full mb-3 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:border-yellow hover:text-yellow transition-colors font-sans text-xs"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                    Upload photo
                  </button>
                  <div className="grid grid-cols-4 gap-2">
                    {allPhotos.map((url, i) => {
                      const isActive = selected === url;
                      return (
                        <div
                          key={i}
                          onClick={() => setSelected(url)}
                          className={`aspect-square overflow-hidden rounded-lg cursor-pointer relative border-2 transition-all ${isActive ? "border-yellow" : "border-transparent hover:border-[var(--fg-muted)]"}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <input
                    value={urlDraft}
                    onChange={(e) => setUrlDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && urlDraft.trim()) setSelected(urlDraft.trim()); }}
                    placeholder="https://..."
                    className="w-full font-mono text-xs text-[var(--fg)] bg-[var(--bg-subtle)] rounded-lg px-3 py-2 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
                  />
                  <button
                    onClick={() => { if (urlDraft.trim()) setSelected(urlDraft.trim()); }}
                    className="w-full rounded-lg border border-[var(--border)] py-2 font-sans text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
                  >
                    Use URL
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col p-4 gap-3">
            <div className="flex-1 bg-[var(--bg-subtle)] rounded-xl flex items-center justify-center overflow-hidden">
              {selected ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected} alt="" className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="font-mono text-xs text-[var(--fg-muted)]">No image selected</span>
              )}
            </div>
            <button
              onClick={() => { if (selected) { onSelect(selected); onClose(); } }}
              disabled={!selected}
              className="w-full py-2 rounded-xl bg-yellow text-[#111] font-sans font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              Use this image
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Image button: opens single picker, shows preview ── */
function ImageButton({
  value,
  onChange,
  placeholder = "Select from gallery",
}: {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex items-center gap-2">
        {value && (
          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-[var(--border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <button
          onClick={() => setOpen(true)}
          className="flex-1 min-w-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:border-yellow hover:text-yellow transition-colors font-sans text-xs"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          <span className="truncate">{value ? "Change image" : placeholder}</span>
        </button>
        {value && (
          <button onClick={() => onChange("")} className="font-mono text-[10px] text-[var(--fg-muted)] hover:text-red-400 transition-colors shrink-0">
            Clear
          </button>
        )}
      </div>
      <AnimatePresence>
        {open && <SinglePhotoPicker value={value} onSelect={onChange} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

function AestheticSection({ page, set }: { page: DeliveryPage; set: <K extends keyof DeliveryPage>(k: K, v: DeliveryPage[K]) => void }) {
  const [showTemplates, setShowTemplates] = useState(false);
  const current = TEMPLATES.find((t) => t.id === page.template)!;

  // When user enables custom colors for the first time, seed from template
  function toggleCustomColors() {
    if (!page.customColors) {
      const ts = TEMPLATE_STYLES[page.template];
      set("colorBg", ts.bg);
      set("colorFg", ts.fg);
      set("colorAccent", ts.accent);
      set("colorBtnBg", ts.btnBg);
      set("colorBtnFg", ts.btnFg);
    }
    set("customColors", !page.customColors);
  }

  return (
    <Accordion title="Look & Feel" icon={
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" strokeOpacity="0"/><path d="M3 12h2M19 12h2M12 3v2M12 19v2"/>
      </svg>
    }>
      {/* Template */}
      <div>
        <SectionLabel>Template</SectionLabel>
        <button
          onClick={() => setShowTemplates(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--fg-muted)] transition-colors rounded-lg"
        >
          <div className="w-8 h-8 rounded-lg shrink-0 border border-[var(--border)]" style={{ background: current.accent }} />
          <div className="flex-1 text-left min-w-0">
            <div className="font-sans text-sm font-semibold text-[var(--fg)]">{current.label}</div>
            <div className="font-sans text-[11px] text-[var(--fg-muted)] truncate">{current.desc}</div>
          </div>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--fg-muted)] shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
        <AnimatePresence>
          {showTemplates && (
            <TemplateModal
              current={page.template}
              onSelect={(t) => set("template", t)}
              onClose={() => setShowTemplates(false)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Cover image */}
      <div>
        <SectionLabel>Cover image</SectionLabel>
        <ImageButton value={page.coverUrl} onChange={(u) => set("coverUrl", u)} placeholder="Use template default" />
      </div>

      {/* Logo */}
      <div>
        <SectionLabel>Logo</SectionLabel>
        <div className="flex gap-1 mb-2">
          {([
            { id: "none", label: "None" },
            { id: "text", label: "Text" },
            { id: "image", label: "Image" },
            { id: "image+text", label: "Both" },
          ] as { id: LogoMode; label: string }[]).map((opt) => (
            <button
              key={opt.id}
              onClick={() => set("logoMode", opt.id)}
              className={`flex-1 py-1.5 rounded-lg font-sans text-[11px] transition-colors border ${
                page.logoMode === opt.id
                  ? "border-yellow bg-yellow/10 text-[var(--fg)]"
                  : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {(page.logoMode === "text" || page.logoMode === "image+text") && (
            <input
              value={page.logoText}
              onChange={(e) => set("logoText", e.target.value)}
              placeholder="STUDIO"
              className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors"
            />
          )}
          {(page.logoMode === "image" || page.logoMode === "image+text") && (
            <ImageButton value={page.logoUrl} onChange={(u) => set("logoUrl", u)} placeholder="Upload logo" />
          )}
        </div>
      </div>

      {/* Custom colors */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <SectionLabel>Custom colors</SectionLabel>
          <Toggle checked={page.customColors} onChange={toggleCustomColors} />
        </div>
        {page.customColors && (
          <div className="flex flex-col gap-2 p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
            <ColorRow label="Background"  value={page.colorBg}     onChange={(v) => set("colorBg", v)} />
            <ColorRow label="Text"        value={page.colorFg}     onChange={(v) => set("colorFg", v)} />
            <ColorRow label="Accent"      value={page.colorAccent} onChange={(v) => set("colorAccent", v)} />
            <ColorRow label="Button bg"   value={page.colorBtnBg}  onChange={(v) => set("colorBtnBg", v)} />
            <ColorRow label="Button text" value={page.colorBtnFg}  onChange={(v) => set("colorBtnFg", v)} />
          </div>
        )}
      </div>

      {/* Font */}
      <div>
        <SectionLabel>Font family</SectionLabel>
        <select
          value={page.fontFamily}
          onChange={(e) => set("fontFamily", e.target.value)}
          className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors"
          style={{ fontFamily: page.fontFamily }}
        >
          {DELIVERY_FONTS.map((f) => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Layout */}
      <div>
        <SectionLabel>Photo layout</SectionLabel>
        <div className="flex gap-2">
          {([
            { id: "grid",    label: "Grid",    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg> },
            { id: "masonry", label: "Masonry", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="8" height="11" rx="1"/><rect x="13" y="3" width="8" height="7" rx="1"/><rect x="3" y="17" width="8" height="4" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg> },
          ] as { id: LayoutStyle; label: string; icon: React.ReactNode }[]).map((opt) => (
            <button
              key={opt.id}
              onClick={() => set("layout", opt.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border font-sans text-xs font-medium transition-all ${
                page.layout === opt.id
                  ? "border-yellow bg-yellow/10 text-[var(--fg)]"
                  : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Welcome message */}
      <div>
        <SectionLabel>Welcome message</SectionLabel>
        <textarea
          value={page.welcomeMessage}
          onChange={(e) => set("welcomeMessage", e.target.value)}
          rows={3}
          className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2.5 outline-none focus:border-yellow transition-colors resize-none"
          placeholder="Write a personal message to your client…"
        />
        <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-1">Shown as an overlay on the cover photo</p>
      </div>
    </Accordion>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LIVE PREVIEW
══════════════════════════════════════════════════════════════════════════ */

const TEMPLATE_STYLES: Record<TemplateName, { bg: string; fg: string; muted: string; accent: string; btnBg: string; btnFg: string }> = {
  minimal:   { bg: "#ffffff", fg: "#111111", muted: "#888888", accent: "#f5f5f5", btnBg: "#111111", btnFg: "#ffffff" },
  vogue:     { bg: "#0a0a0a", fg: "#ffffff", muted: "#888888", accent: "#1a1a1a", btnBg: "#ffffff", btnFg: "#000000" },
  cinematic: { bg: "#1a1209", fg: "#f0e6d0", muted: "#8a7860", accent: "#241a0e", btnBg: "#c8a96e", btnFg: "#1a1209" },
  editorial: { bg: "#f0ede8", fg: "#1a1a1a", muted: "#6e6e6e", accent: "#e4e0da", btnBg: "#1a1a1a", btnFg: "#f0ede8" },
};

function GalleryPreview({ page, viewport }: { page: DeliveryPage; viewport: "mobile" | "desktop" }) {
  const tplStyle = TEMPLATE_STYLES[page.template];
  // Resolve effective styles: custom overrides → template → default
  const ts = page.customColors
    ? { bg: page.colorBg, fg: page.colorFg, muted: tplStyle.muted, accent: page.colorAccent, btnBg: page.colorBtnBg, btnFg: page.colorBtnFg }
    : tplStyle;
  const allSeeds = page.photoSeeds.length > 0 ? page.photoSeeds : ALL_GALLERY_SEEDS.slice(0, 12);
  const photos = allSeeds.slice(0, 12);
  const isMobile = viewport === "mobile";
  const coverSrc = page.coverUrl || `https://picsum.photos/seed/${page.coverSeed}/800/400?grayscale`;

  const heights = [110, 80, 140, 100, 120, 90, 130, 85, 115, 95, 125, 100];

  return (
    <div
      className="w-full h-full overflow-y-auto flex flex-col"
      style={{ background: ts.bg, fontFamily: page.fontFamily || "Inter, sans-serif", fontSize: isMobile ? 12 : 13 }}
    >
      {/* Upsell banner */}
      {page.mode === "direct" && page.showUpsellBanner && page.priceFullGallery > 0 && (
        <div style={{ background: ts.btnBg, color: ts.btnFg, padding: isMobile ? "8px 12px" : "10px 20px", textAlign: "center", fontSize: isMobile ? 10 : 11, fontWeight: 600 }}>
          Get all {page.photoCount || 12} photos for ${page.priceFullGallery} — save {Math.max(0, Math.round((1 - page.priceFullGallery / ((page.pricePerPhoto || 15) * (page.photoCount || 12))) * 100))}%
          <button style={{ marginLeft: 12, background: ts.bg, color: ts.bg === "#ffffff" ? "#111" : ts.fg, border: "none", borderRadius: 4, padding: "2px 10px", fontWeight: 700, fontSize: 10, cursor: "pointer" }}>Buy now</button>
        </div>
      )}

      {/* Cover */}
      <div className="relative shrink-0 overflow-hidden" style={{ height: isMobile ? 120 : 180 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverSrc} alt="" className="w-full h-full object-cover" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.55))" }}/>
        {/* Logo */}
        {page.logoMode !== "none" && (
          <div style={{ position: "absolute", top: isMobile ? 10 : 14, left: isMobile ? 12 : 18, display: "flex", alignItems: "center", gap: 6 }}>
            {(page.logoMode === "image" || page.logoMode === "image+text") && page.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={page.logoUrl} alt="" style={{ height: isMobile ? 20 : 24, width: "auto", objectFit: "contain", borderRadius: 4 }} />
            )}
            {(page.logoMode === "text" || page.logoMode === "image+text") && page.logoText && (
              <span style={{ color: "#fff", fontWeight: 900, fontSize: isMobile ? 10 : 12, letterSpacing: "0.05em", fontFamily: page.fontFamily }}>{page.logoText}</span>
            )}
          </div>
        )}
        {/* Welcome */}
        {page.welcomeMessage && (
          <div style={{ position: "absolute", bottom: isMobile ? 10 : 14, left: isMobile ? 12 : 18, right: isMobile ? 12 : 18 }}>
            <p style={{ color: "#ffffff", fontSize: isMobile ? 9 : 11, lineHeight: 1.5, textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
              {page.welcomeMessage.slice(0, 100)}{page.welcomeMessage.length > 100 ? "…" : ""}
            </p>
          </div>
        )}
        {/* Password lock */}
        {page.passwordEnabled && (
          <div style={{ position: "absolute", top: isMobile ? 8 : 12, right: isMobile ? 8 : 12, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", borderRadius: 6, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <span style={{ color: "#fff", fontSize: 9, fontWeight: 600 }}>Protected</span>
          </div>
        )}
      </div>

      {/* Selection progress (selection mode) */}
      {page.mode === "selection" && (
        <div style={{ background: ts.accent, padding: isMobile ? "8px 12px" : "10px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: ts.muted, fontSize: 9, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
              Your selection — 3 of {page.selectionLimit} photos chosen
            </div>
            <div style={{ height: 3, background: ts.bg, borderRadius: 9999 }}>
              <div style={{ height: "100%", width: `${(3 / page.selectionLimit) * 100}%`, background: "#fad502", borderRadius: 9999 }} />
            </div>
          </div>
          <button style={{ background: ts.btnBg, color: ts.btnFg, border: "none", borderRadius: 6, padding: isMobile ? "4px 10px" : "5px 14px", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>
            Submit
          </button>
        </div>
      )}

      {/* Photo grid */}
      <div style={{ padding: isMobile ? "8px 8px" : "12px 12px", flex: 1 }}>
        {page.layout === "masonry" ? (
          <div style={{ columns: isMobile ? 2 : 3, gap: 6 }}>
            {photos.map((seed: number, i: number) => (
              <div key={seed} style={{ breakInside: "avoid", marginBottom: 6, position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://picsum.photos/seed/${seed}/300/${heights[i] ?? 100}?grayscale`}
                  alt=""
                  style={{ width: "100%", display: "block", borderRadius: 4 }}
                />
                {page.watermark && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", transform: "rotate(-20deg)", textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}>FRAME</span>
                  </div>
                )}
                {page.mode === "selection" && (
                  <button style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                  </button>
                )}
                {page.mode === "direct" && page.pricePerPhoto > 0 && (
                  <div style={{ position: "absolute", bottom: 4, left: 4, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", borderRadius: 4, padding: "2px 6px", color: "#fff", fontSize: 8, fontWeight: 700 }}>
                    ${page.pricePerPhoto}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 3}, 1fr)`, gap: 6 }}>
            {photos.map((seed: number, i: number) => (
              <div key={seed} style={{ position: "relative", aspectRatio: "1", overflow: "hidden", borderRadius: 4 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://picsum.photos/seed/${seed}/300/300?grayscale`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                {page.watermark && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 8, fontWeight: 900, letterSpacing: "0.2em", transform: "rotate(-20deg)" }}>FRAME</span>
                  </div>
                )}
                {page.mode === "selection" && (
                  <button style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, background: "rgba(0,0,0,0.35)", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                  </button>
                )}
                {page.mode === "direct" && page.pricePerPhoto > 0 && (
                  <div style={{ position: "absolute", bottom: 4, left: 4, background: "rgba(0,0,0,0.5)", borderRadius: 4, padding: "2px 6px", color: "#fff", fontSize: 8, fontWeight: 700 }}>
                    ${page.pricePerPhoto}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Proofing hint */}
      {page.proofingEnabled && (
        <div style={{ padding: isMobile ? "8px 12px" : "10px 18px", background: ts.accent, borderTop: `1px solid ${ts.muted}20`, display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={ts.muted} strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          <span style={{ color: ts.muted, fontSize: 10 }}>Click any photo to leave a comment for your photographer</span>
        </div>
      )}
    </div>
  );
}

function PreviewFrame({ page }: { page: DeliveryPage }) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="flex flex-col h-full">
      {/* Viewport toggle */}
      <div className="flex items-center justify-center gap-1 py-3 border-b border-[var(--border)] shrink-0">
        {(["desktop", "mobile"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setViewport(v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-medium transition-colors ${
              viewport === v ? "bg-[var(--bg-card)] text-[var(--fg)] border border-[var(--border)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
            }`}
          >
            {v === "desktop" ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            ) : (
              <svg width="11" height="13" viewBox="0 0 18 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="1" width="16" height="22" rx="3"/><line x1="7" y1="20" x2="11" y2="20"/></svg>
            )}
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Preview area */}
      <div className="flex-1 flex items-center justify-center overflow-auto bg-[var(--bg)] relative p-6">
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{ backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="relative z-10">
          {viewport === "desktop" ? (
            /* Desktop browser mockup */
            <div className="rounded-xl overflow-hidden border border-[var(--border)] shadow-2xl bg-[var(--bg-card)]" style={{ width: 520 }}>
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow/70" />
                  <div className="w-3 h-3 rounded-full bg-green-400/70" />
                </div>
                <div className="flex-1 mx-3 bg-[var(--bg)] border border-[var(--border)] rounded-md px-3 py-1 flex items-center gap-2">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span className="font-mono text-[10px] text-[var(--fg-muted)] truncate">frame.so/delivery/{page.id}</span>
                </div>
              </div>
              <div style={{ height: 480 }}>
                <GalleryPreview page={page} viewport="desktop" />
              </div>
            </div>
          ) : (
            /* Mobile phone mockup */
            <div className="relative" style={{ width: 240, height: 500 }}>
              <div className="absolute inset-0 rounded-[36px] shadow-2xl" style={{ background: "linear-gradient(145deg,#2a2a2a,#1a1a1a)" }} />
              <div className="absolute inset-[5px] rounded-[32px] overflow-hidden bg-black">
                <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-2.5 pb-1 pointer-events-none">
                  <span style={{ fontFamily: "monospace", fontSize: 8, fontWeight: "bold", color: "rgba(255,255,255,0.8)" }}>9:41</span>
                  <div style={{ width: 60, height: 16, background: "#000", borderRadius: 9999 }} />
                  <div className="flex items-center gap-0.5">
                    <svg width="9" height="7" viewBox="0 0 24 18" fill="none"><path d="M1 1c6.1-1.3 15.9-1.3 22 0M5 7c3.9-.9 10.1-.9 14 0M9 13c2-.5 6-.5 8 0" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity={0.8}/></svg>
                    <svg width="14" height="7" viewBox="0 0 26 12" fill="none"><rect x="1" y="1" width="20" height="10" rx="2.5" stroke="white" strokeWidth="1.5" opacity={0.8}/><rect x="3" y="3" width="13" height="6" rx="1.5" fill="white" opacity={0.8}/><path d="M23 4v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity={0.8}/></svg>
                  </div>
                </div>
                <div className="absolute inset-0 pt-8">
                  <GalleryPreview page={page} viewport="mobile" />
                </div>
              </div>
              <div className="absolute rounded-l-sm" style={{ left: -3, top: 90, width: 3, height: 28, background: "#333" }} />
              <div className="absolute rounded-l-sm" style={{ left: -3, top: 128, width: 3, height: 36, background: "#333" }} />
              <div className="absolute rounded-r-sm" style={{ right: -3, top: 130, width: 3, height: 50, background: "#333" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BUILDER
══════════════════════════════════════════════════════════════════════════ */

function Builder({ page: initial, onBack, onSave }: { page: DeliveryPage; onBack: () => void; onSave: (p: DeliveryPage) => void }) {
  const [page, setPage] = useState<DeliveryPage>(initial);
  const [showGallery, setShowGallery] = useState(false);

  const set = useCallback(<K extends keyof DeliveryPage>(key: K, value: DeliveryPage[K]) =>
    setPage((prev) => ({ ...prev, [key]: value })), []);

  return (
    <div className="flex flex-col h-full">
      {/* Builder header */}
      <div className="flex items-center gap-3 px-6 py-3.5 border-b border-[var(--border)] shrink-0">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors font-sans text-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Delivery Pages
        </button>
        <span className="text-[var(--border)]">/</span>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <input
            value={page.title}
            onChange={(e) => set("title", e.target.value)}
            className="font-sans font-bold text-sm text-[var(--fg)] bg-transparent outline-none border-b border-transparent focus:border-[var(--fg-muted)] transition-colors"
          />
          <span className="font-mono text-[11px] text-[var(--fg-muted)]">· {page.client}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1 font-mono text-[10px] ${STATUS_META[page.status].text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_META[page.status].dot}`} />
            {STATUS_META[page.status].label}
          </span>
          <button
            onClick={() => set("status", page.status === "active" ? "draft" : "active")}
            className={`px-3 py-1.5 rounded-lg border font-sans text-xs font-medium transition-colors ${
              page.status === "active"
                ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                : "border-green-500/30 text-green-400 hover:bg-green-500/10"
            }`}
          >
            {page.status === "active" ? "Unpublish" : "Publish"}
          </button>
          <button onClick={() => onSave(page)} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-yellow text-[#111] text-xs font-sans font-bold hover:opacity-90 transition-opacity">
            Save
          </button>
        </div>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Controls */}
        <div className="w-[420px] shrink-0 flex flex-col border-r border-[var(--border)] bg-[var(--bg-card)] overflow-y-auto">
          <div className="p-4 space-y-3">
            {/* Page info */}
            <div className="space-y-2">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] block mb-1">Client name</label>
                <input
                  value={page.client}
                  onChange={(e) => set("client", e.target.value)}
                  className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] block mb-1">Deliverable Gallery</label>
                <button
                  onClick={() => setShowGallery(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--fg-muted)] transition-colors rounded-lg group"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--fg-muted)] shrink-0">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span className="font-sans text-sm text-[var(--fg)] flex-1 text-left">
                    {page.photoSeeds.length > 0 ? `${page.photoSeeds.length} photos selected` : "Select photos"}
                  </span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--fg-muted)] shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>

            <AccessSection      page={page} set={set} />
            <MonetizationSection page={page} set={set} />
            <AestheticSection   page={page} set={set} />
          </div>
        </div>

        {/* Right: Preview */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <PreviewFrame page={page} />
        </div>
      </div>

      <AnimatePresence>
        {showGallery && (
          <GalleryModal
            page={page}
            onSave={(seeds) => {
              set("photoSeeds", seeds);
              set("photoCount", seeds.length);
            }}
            onClose={() => setShowGallery(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   DELIVERY PAGE CARD (list view)
══════════════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════════════
   GALLERY MODAL
══════════════════════════════════════════════════════════════════════════ */

function GalleryModal({
  page,
  onSave,
  onClose,
}: {
  page: DeliveryPage;
  onSave: (seeds: number[]) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set(page.photoSeeds));

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const toggle = (seed: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(seed)) next.delete(seed); else next.add(seed);
      return next;
    });
  };

  const remove = (seed: number) => {
    setSelected((prev) => { const next = new Set(prev); next.delete(seed); return next; });
  };

  const handleSave = () => {
    onSave(Array.from(selected));
    onClose();
  };

  const clientPhotos = ALL_GALLERY_SEEDS.filter((s) => selected.has(s));

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl h-[80vh] flex flex-col rounded-2xl bg-[var(--bg)] border border-[var(--border)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] shrink-0">
          <div>
            <h3 className="font-sans font-black text-[var(--fg)] text-sm">Gallery</h3>
            <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">{page.client} · {page.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[var(--fg-muted)]">{selected.size} selected</span>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-yellow text-[#111] font-sans font-bold text-xs hover:opacity-90 transition-opacity"
            >
              Save
            </button>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Body — two panels */}
        <div className="flex flex-1 min-h-0">

          {/* LEFT — general gallery */}
          <div className="flex-1 flex flex-col border-r border-[var(--border)] min-w-0">
            <div className="px-4 py-2.5 border-b border-[var(--border)] shrink-0">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-muted)]">
                Your Gallery · {ALL_GALLERY_SEEDS.length} photos
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-5 gap-1.5">
                {ALL_GALLERY_SEEDS.map((seed) => {
                  const inDelivery = selected.has(seed);
                  return (
                    <button
                      key={seed}
                      onClick={() => toggle(seed)}
                      className="relative aspect-square overflow-hidden bg-[var(--bg-subtle)] group/photo focus:outline-none"
                      style={{ outline: inDelivery ? "2px solid #fad502" : "none", outlineOffset: -2 }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://picsum.photos/seed/${seed}/160/160?grayscale`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      {inDelivery && (
                        <div className="absolute inset-0 bg-yellow/20 flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full bg-yellow flex items-center justify-center">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                        </div>
                      )}
                      {!inDelivery && (
                        <div className="absolute inset-0 bg-black/0 group-hover/photo:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover/photo:opacity-100">
                          <div className="w-5 h-5 rounded-full bg-white/20 border border-white/50 flex items-center justify-center">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT — client delivery gallery */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-4 py-2.5 border-b border-[var(--border)] shrink-0">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-muted)]">
                Client Gallery · {selected.size} photos
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {clientPhotos.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-[var(--fg-muted)]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p className="font-sans text-xs">Click photos on the left to add them</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-1.5">
                  {clientPhotos.map((seed) => (
                    <button
                      key={seed}
                      onClick={() => remove(seed)}
                      className="relative aspect-square overflow-hidden bg-[var(--bg-subtle)] group/photo focus:outline-none"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://picsum.photos/seed/${seed}/160/160?grayscale`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover/photo:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover/photo:opacity-100">
                        <div className="w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   DELIVERY CARD
══════════════════════════════════════════════════════════════════════════ */

function DeliveryCard({ page, onEdit }: { page: DeliveryPage; onEdit: () => void }) {
  const sm = STATUS_META[page.status];
  const photoCount = page.photoSeeds.length || page.photoCount;
  const discount = page.pricePerPhoto > 0 && page.priceFullGallery > 0
    ? Math.round((1 - page.priceFullGallery / (page.pricePerPhoto * photoCount)) * 100)
    : 0;

  return (
    <div
      className="group border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden hover:border-[var(--fg-muted)] transition-all duration-200 cursor-pointer"
      onClick={onEdit}
    >
      {/* Cover — fixed height, no border-radius (inherits from parent) */}
      <div className="relative h-36 overflow-hidden bg-[var(--bg-subtle)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://picsum.photos/seed/${page.coverSeed}/600/300?grayscale`} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Status */}
        <div className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono bg-black/40 backdrop-blur-sm ${sm.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />
          {sm.label}
        </div>

        {/* Mode */}
        <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm text-[10px] font-mono text-white/70 capitalize">
          {page.mode === "selection" ? `Pick ${page.selectionLimit}` : page.mode}
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        {/* Client + title */}
        <div className="mb-2">
          <div className="font-sans font-bold text-[var(--fg)] text-xs truncate">{page.client}</div>
          <div className="font-mono text-[10px] text-[var(--fg-muted)] truncate mt-0.5">{page.title}</div>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[9px] text-[var(--fg-muted)]">{photoCount} photos</span>
            <span className="font-mono text-[9px] text-[var(--fg-muted)]">{page.views} views</span>
            {discount > 0 && <span className="font-mono text-[9px] text-green-400">−{discount}%</span>}
          </div>
          <div className="flex items-center gap-1.5 text-[var(--fg-muted)]">
            {page.passwordEnabled && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            )}
            {page.watermark && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            )}
            {page.proofingEnabled && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   NEW PAGE MODAL
══════════════════════════════════════════════════════════════════════════ */

function NewPageModal({ onCreate, onClose }: { onCreate: (title: string, client: string) => void; onClose: () => void }) {
  const [title,  setTitle]  = useState("");
  const [client, setClient] = useState("");

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-sm rounded-2xl bg-[var(--bg)] border border-[var(--border)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-sans font-black text-[var(--fg)] text-base">New delivery page</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] block mb-1.5">Gallery title</label>
            <input
              autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Wedding Gallery"
              className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:border-yellow transition-colors"
            />
          </div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] block mb-1.5">Client name</label>
            <input
              value={client} onChange={(e) => setClient(e.target.value)}
              placeholder="Sarah & James"
              className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:border-yellow transition-colors"
            />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[var(--border)] flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-[var(--border)] font-sans text-sm font-medium text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">Cancel</button>
          <button
            disabled={!title.trim() || !client.trim()}
            onClick={() => onCreate(title.trim(), client.trim())}
            className="btn-primary px-5 py-2 rounded-xl font-sans font-bold text-sm disabled:opacity-40"
          >
            Create & configure
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════ */

export default function DeliveryPagesPage() {
  const [pages,       setPages]       = useState<DeliveryPage[]>(INITIAL_PAGES);
  const [editingPage, setEditingPage] = useState<DeliveryPage | null>(null);
  const [showNew,     setShowNew]     = useState(false);

  const createPage = (title: string, client: string) => {
    const p: DeliveryPage = {
      ...DEFAULT_PAGE,
      id: `dp-${Date.now()}`,
      title, client,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      coverSeed: 400 + Math.floor(Math.random() * 100),
    };
    setPages((prev) => [p, ...prev]);
    setEditingPage(p);
    setShowNew(false);
  };

  const savePage = (updated: DeliveryPage) => {
    setPages((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingPage(null);
  };

  /* ── Builder view ── */
  if (editingPage) {
    return (
      <div className="h-full flex flex-col">
        <Builder page={editingPage} onBack={() => setEditingPage(null)} onSave={savePage} />
      </div>
    );
  }

  /* ── List view ── */
  const active  = pages.filter((p) => p.status === "active").length;
  const drafts  = pages.filter((p) => p.status === "draft").length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-sans font-black text-[var(--fg)] text-xl">Delivery Pages</h1>
          <p className="font-mono text-xs text-[var(--fg-muted)] mt-0.5">
            <span className="text-green-400">{active} active</span>
            {drafts > 0 && <> · <span>{drafts} draft{drafts > 1 ? "s" : ""}</span></>}
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="btn-primary flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-sans font-bold text-sm"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New delivery page
        </button>
      </div>

      {/* Grid */}
      {pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center mb-4 text-[var(--fg-muted)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
          </div>
          <p className="font-sans font-semibold text-[var(--fg)] mb-1">No delivery pages yet</p>
          <p className="font-serif text-sm text-[var(--fg-muted)] mb-5">Create a gallery page to deliver photos to your clients</p>
          <button onClick={() => setShowNew(true)} className="btn-primary px-5 py-2.5 rounded-xl font-sans font-bold text-sm">
            Create delivery page
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {pages.map((p) => (
            <DeliveryCard key={p.id} page={p} onEdit={() => setEditingPage(p)} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showNew && <NewPageModal onCreate={createPage} onClose={() => setShowNew(false)} />}
      </AnimatePresence>
    </div>
  );
}

