"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDeliveryStore } from "~/lib/delivery/store";
import { STATUS_META, TEMPLATES, type DeliveryPage } from "~/lib/delivery/data";
import { DevicePreviewModal } from "~/components/dashboard/DevicePreviewModal";

/* ══════════════════════════════════════════════════════════════════════════
   DELIVERY CARD
══════════════════════════════════════════════════════════════════════════ */

function DeliveryCard({ page }: { page: DeliveryPage }) {
  const sm = STATUS_META[page.status];
  const photoCount = page.photoSeeds.length || page.photoCount;
  const discount = page.pricePerPhoto > 0 && page.priceFullGallery > 0
    ? Math.round((1 - page.priceFullGallery / (page.pricePerPhoto * photoCount)) * 100)
    : 0;
  const cover = page.coverUrl || `https://picsum.photos/seed/${page.coverSeed}/600/300?grayscale`;
  const tpl = TEMPLATES.find((t) => t.id === page.template);
  /* Preview URL points at the actual template route so users see the
     real template they picked, not a generic placeholder. Falls back
     to /d/<id> for templates without a dedicated showcase route. */
  const TEMPLATE_PREVIEW_URLS: Record<string, string> = {
    halcyon:  "/template/halcyon/delivery",
    brooklyn: "/template/brooklyn/delivery",
    minimal:  "/template/minimal/delivery",
  };
  const previewUrl = TEMPLATE_PREVIEW_URLS[page.template] ?? `/d/${page.id}`;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (copied) return;
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/d/${page.id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore — still flash success so the user gets feedback */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="group border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden hover:border-[var(--fg-muted)] transition-all duration-200 flex flex-col">
      {/* Cover — clicking it opens the device-framed preview modal */}
      <button
        onClick={() => setPreviewOpen(true)}
        className="relative h-36 overflow-hidden bg-[var(--bg-subtle)] block w-full text-left"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cover} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Status */}
        <div className={`absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono bg-black/40 backdrop-blur-sm ${sm.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />
          {sm.label}
        </div>

        {/* Mode */}
        <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm text-[10px] font-mono text-white/70 capitalize">
          {page.mode}
        </div>

        {/* Hover hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#111] font-sans text-[11px] font-semibold rounded-md">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Open preview
          </span>
        </div>
      </button>

      {/* Body */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        {/* Title */}
        <div>
          <div className="font-sans font-bold text-[var(--fg)] text-xs truncate">{page.client}</div>
          <div className="font-mono text-[10px] text-[var(--fg-muted)] truncate mt-0.5">{page.title}</div>
        </div>

        {/* Tags row — collection / template + meta icons */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--border)]">
          <div className="flex items-center gap-1.5 min-w-0">
            {tpl && (
              <span
                className="inline-flex items-center gap-1 font-mono text-[8px] uppercase tracking-widest text-[var(--fg-muted)] bg-[var(--bg-subtle)] border border-[var(--border)] px-1.5 py-0.5 rounded shrink-0"
                title={`Theme: ${tpl.label}`}
              >
                <span className="w-1.5 h-1.5 rounded-sm shrink-0" style={{ background: tpl.accent, border: `1px solid ${tpl.fg}30` }} />
                {tpl.label}
              </span>
            )}
            <span className="font-mono text-[9px] text-[var(--fg-muted)] truncate">
              {photoCount} · {page.views} views
              {discount > 0 && <span className="text-green-400 ml-1">−{discount}%</span>}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--fg-muted)] shrink-0">
            {page.passwordEnabled && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-label="Password"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            )}
            {page.mode === "direct" && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-label="Watermark"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            )}
          </div>
        </div>

        {/* CTA row — Copy link (with templates-style success state) + Edit */}
        <div className="flex items-center gap-1.5 mt-auto">
          <button
            onClick={handleCopyLink}
            aria-live="polite"
            className="flex-1 relative h-7 rounded-md overflow-hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex items-center justify-center gap-1.5 rounded-md text-white font-sans text-[10px] font-bold"
                  style={{ background: "#16a34a" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <motion.path d="M20 6L9 17l-5-5"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.42, ease: "easeOut" }}
                    />
                  </svg>
                  Copied
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="absolute inset-0 flex items-center justify-center gap-1.5 rounded-md font-sans text-[10px] font-medium border border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  Copy link
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <Link
            href={`/delivery/edit/${page.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md font-sans text-[10px] font-bold bg-yellow text-[#111] hover:bg-yellow/90 transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {previewOpen && (
          <DevicePreviewModal
            url={previewUrl}
            title={page.client}
            subtitle={page.title}
            accentChip={tpl && (
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-sm" style={{ background: tpl.accent, border: `1px solid ${tpl.fg}30` }} />
                {tpl.label}
              </span>
            )}
            onClose={() => setPreviewOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   NEW DELIVERY TILE — first cell in the grid, mirrors NewPortfolioTile
══════════════════════════════════════════════════════════════════════════ */

function NewDeliveryTile({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col border border-dashed border-[var(--border)] bg-[var(--bg-card)] overflow-hidden hover:border-yellow hover:bg-yellow/5 transition-all duration-200 text-left"
    >
      {/* Cover area — paper plane gliding across a dashed flight path */}
      <div className="relative h-36 flex items-center justify-center bg-[var(--bg-subtle)] group-hover:bg-yellow/5 transition-colors overflow-hidden">
        {/* Dashed flight arc behind the plane */}
        <svg
          className="absolute inset-0 w-full h-full text-[var(--fg-muted)] group-hover:text-yellow transition-colors"
          viewBox="0 0 200 144" preserveAspectRatio="none" fill="none"
          aria-hidden
        >
          <path
            d="M14 110 Q 70 30, 186 32"
            stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"
            strokeDasharray="3 5" opacity="0.45"
          />
        </svg>

        <motion.div
          /* gentle glide forward then nudge back */
          animate={{ x: [-4, 6, -4], y: [2, -2, 2], rotate: [-2, 2, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.18 }}
          className="relative text-[var(--fg)] group-hover:text-yellow transition-colors"
        >
          {/* Paper plane — clean line + a folded crease for depth */}
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
            <path
              d="M44 6 L4 22 L20 27 L26 42 L44 6 Z"
              stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
              fill="var(--bg-card)"
            />
            <path
              d="M44 6 L20 27 L26 42"
              stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
              opacity="0.55"
            />
          </svg>
          {/* + badge top-right */}
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-yellow text-[#111] flex items-center justify-center shadow-sm">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </span>
        </motion.div>
      </div>

      {/* Body — match the height of a real delivery card so the row stays even */}
      <div className="p-3 flex flex-col flex-1 gap-2 justify-center">
        <div className="font-sans font-bold text-[var(--fg)] text-xs">New delivery</div>
        <div className="font-mono text-[10px] text-[var(--fg-muted)]">Send a fresh client gallery</div>
      </div>
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   NEW PAGE MODAL
══════════════════════════════════════════════════════════════════════════ */

/* ── Delivery onboarding wizard (3 steps) ────────────────────────────── */
const DELIVERY_STEPS = ["Client", "Access", "Done"] as const;

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === current ? "w-5 bg-yellow" : i < current ? "w-2 bg-yellow/50" : "w-2 bg-[var(--border)]"}`} />
      ))}
    </div>
  );
}

function NewPageModal({ onCreate, onClose }: { onCreate: (title: string, client: string) => void; onClose: () => void }) {
  const [step, setStep]     = useState(0);
  const [title, setTitle]   = useState("");
  const [client, setClient] = useState("");
  const [mode, setMode]     = useState<"gift" | "direct">("gift");
  const [access, setAccess] = useState<"public" | "password">("public");

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const canNext = step === 0 ? !!(title.trim() && client.trim()) : true;

  function finish() { onCreate(title.trim(), client.trim()); }

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
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest">{DELIVERY_STEPS[step]}</span>
            <StepDots current={step} total={DELIVERY_STEPS.length} />
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
            className="px-5 py-5 min-h-[220px]"
          >
            {step === 0 && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-sans font-black text-[var(--fg)] text-lg mb-0.5">New delivery</h2>
                  <p className="font-sans text-xs text-[var(--fg-muted)]">Who are you delivering to?</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] block mb-1">Gallery title</label>
                    <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
                      placeholder="Wedding Gallery"
                      className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-2.5 outline-none focus:border-yellow transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] block mb-1">Client name</label>
                    <input value={client} onChange={(e) => setClient(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && canNext) setStep(1); }}
                      placeholder="Sarah & James"
                      className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-2.5 outline-none focus:border-yellow transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-sans font-black text-[var(--fg)] text-lg mb-0.5">Access & pricing</h2>
                  <p className="font-sans text-xs text-[var(--fg-muted)]">How should your client receive the photos?</p>
                </div>
                <div className="space-y-2">
                  {([
                    { id: "gift", label: "Gift / Free", desc: "Client downloads at no cost", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5" rx="1"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg> },
                    { id: "direct", label: "Direct Sale", desc: "Buy individually or as a bundle", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
                  ] as { id: "gift" | "direct"; label: string; desc: string; icon: React.ReactNode }[]).map((opt) => (
                    <button key={opt.id} onClick={() => setMode(opt.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${mode === opt.id ? "border-yellow bg-yellow/5" : "border-[var(--border)] hover:border-[var(--fg-muted)]"}`}
                    >
                      <span className={mode === opt.id ? "text-yellow mt-0.5" : "text-[var(--fg-muted)] mt-0.5"}>{opt.icon}</span>
                      <div>
                        <div className="font-sans text-sm font-semibold text-[var(--fg)]">{opt.label}</div>
                        <div className="font-sans text-[11px] text-[var(--fg-muted)]">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pt-1">
                  {([
                    { id: "public", label: "Public" },
                    { id: "password", label: "Password protected" },
                  ] as { id: "public" | "password"; label: string }[]).map((opt) => (
                    <button key={opt.id} onClick={() => setAccess(opt.id)}
                      className={`flex-1 py-2 rounded-xl border font-sans text-xs font-medium transition-all ${access === opt.id ? "border-yellow text-[var(--fg)] bg-yellow/5" : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)]"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col items-center text-center py-2 gap-4">
                <div className="w-14 h-14 rounded-full bg-yellow/10 border border-yellow/30 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fad502" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div>
                  <h2 className="font-sans font-black text-[var(--fg)] text-lg mb-1">Delivery ready!</h2>
                  <p className="font-sans text-sm text-[var(--fg-muted)]">
                    <span className="text-[var(--fg)] font-medium">{title}</span> for{" "}
                    <span className="text-[var(--fg)] font-medium">{client}</span> is set up.<br/>
                    Add your photos and send the link.
                  </p>
                </div>
                <button onClick={finish} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 transition-colors">
                  Add photos & configure →
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer nav */}
        {step < 2 && (
          <div className="px-5 py-4 border-t border-[var(--border)] flex items-center justify-between">
            <button onClick={() => step > 0 ? setStep(step - 1) : onClose()}
              className="px-4 py-2 rounded-xl border border-[var(--border)] font-sans text-sm font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
              {step === 0 ? "Cancel" : "← Back"}
            </button>
            <button disabled={!canNext} onClick={() => setStep(step + 1)}
              className="px-5 py-2 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 disabled:opacity-40 transition-colors">
              {step === 1 ? "Create delivery" : "Continue →"}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════ */

export default function DeliveryPagesPage() {
  const router = useRouter();
  const pages = useDeliveryStore((s) => s.pages);
  const add = useDeliveryStore((s) => s.add);
  const hydrated = useDeliveryStore((s) => s.hydrated);
  const [showNew, setShowNew] = useState(false);

  const handleCreate = (title: string, client: string) => {
    const newPage = add(title, client);
    setShowNew(false);
    router.push(`/delivery/edit/${newPage.id}`);
  };

  const counts = {
    active:  pages.filter((p) => p.status === "active").length,
    draft:   pages.filter((p) => p.status === "draft").length,
    expired: pages.filter((p) => p.status === "expired").length,
  };

  return (
    <div className="p-6">
      {/* Header — title + counts only; new-delivery action lives in the grid */}
      <div className="mb-6">
        <h1 className="font-sans font-black text-[var(--fg)] text-xl">Delivery</h1>
        <p className="font-mono text-xs text-[var(--fg-muted)] mt-0.5">
          <span className="text-green-400">{counts.active} active</span>
          {counts.draft > 0 && <> · <span>{counts.draft} draft{counts.draft > 1 ? "s" : ""}</span></>}
          {counts.expired > 0 && <> · <span className="text-red-400">{counts.expired} expired</span></>}
        </p>
      </div>

      {/* Grid */}
      {!hydrated ? (
        <div className="flex items-center justify-center py-32">
          <span className="font-mono text-xs text-[var(--fg-muted)]">Loading…</span>
        </div>
      ) : pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center mb-4 text-[var(--fg-muted)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>
          </div>
          <p className="font-sans font-semibold text-[var(--fg)] mb-1">No delivery pages yet</p>
          <p className="font-serif text-sm text-[var(--fg-muted)] mb-5">Create your first client gallery</p>
          <button onClick={() => setShowNew(true)} className="btn-primary px-5 py-2.5 rounded-xl font-sans font-bold text-sm">
            Create delivery
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <NewDeliveryTile onClick={() => setShowNew(true)} />
          {pages.map((p) => (
            <DeliveryCard key={p.id} page={p} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showNew && <NewPageModal onCreate={handleCreate} onClose={() => setShowNew(false)} />}
      </AnimatePresence>
    </div>
  );
}
