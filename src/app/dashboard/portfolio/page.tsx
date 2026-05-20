"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LivePreviewThumbnail } from "~/components/dashboard/DevicePreviewModal";
import { MOCK_PORTFOLIOS, TEMPLATE_URL, TEMPLATES, type Portfolio } from "~/lib/portfolio/mock";

/* ── Mini sparkline ── */
function Sparkline({ data, color = "#fad502" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  const w = 80; const h = 28;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── New-portfolio tile — sits in the grid as the last "card" ── */
function NewPortfolioTile({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col border border-dashed border-[var(--border)] bg-[var(--bg-card)] overflow-hidden hover:border-yellow hover:bg-yellow/5 transition-all duration-200 rounded-xl text-left"
    >
      {/* Cover area — animated icon */}
      <div className="relative h-32 flex items-center justify-center bg-[var(--bg-subtle)] group-hover:bg-yellow/5 transition-colors">
        <motion.div
          /* gentle idle breathing */
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          /* pop more on hover */
          whileHover={{ scale: 1.18 }}
          className="relative text-[var(--fg-muted)] group-hover:text-yellow transition-colors"
        >
          {/* Stacked-frames glyph: three rectangles offset like a deck of cards */}
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
            <rect x="6"  y="14" width="22" height="26" rx="2" stroke="currentColor" strokeWidth="2" opacity="0.35" />
            <rect x="11" y="11" width="22" height="26" rx="2" stroke="currentColor" strokeWidth="2" opacity="0.6"  />
            <rect x="16" y="8"  width="22" height="26" rx="2" stroke="currentColor" strokeWidth="2" fill="var(--bg-card)" />
            {/* tiny photo "horizon line" inside the front frame */}
            <line x1="20" y1="22" x2="34" y2="22" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
            <circle cx="22.5" cy="14.5" r="1.2" fill="currentColor" opacity="0.6" />
          </svg>
          {/* + badge top-right */}
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-yellow text-[#111] flex items-center justify-center shadow-sm">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </span>
        </motion.div>

      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-1 flex-1 justify-center">
        <h3 className="font-sans font-bold text-[var(--fg)] text-xs">New portfolio</h3>
        <span className="font-mono text-[10px] text-[var(--fg-muted)] block">Start a fresh site from scratch</span>
      </div>
    </button>
  );
}

/* ── Portfolio card — clicking it navigates to the manage page ── */
function PortfolioCard({ p }: { p: Portfolio }) {
  const previewUrl = TEMPLATE_URL[p.template];

  return (
    <Link
      href={`/dashboard/portfolio/${p.id}`}
      className="group block border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden hover:border-[var(--fg-muted)] transition-all duration-200 rounded-xl"
    >
      {/* Cover — live render of the template */}
      <div className="relative h-32 overflow-hidden bg-[var(--bg-subtle)]">
        {previewUrl ? (
          <LivePreviewThumbnail
            url={previewUrl}
            baseWidth={1280}
            className="w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={`https://picsum.photos/seed/${p.seed}/600/338?grayscale`} alt={p.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Status badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono backdrop-blur-sm ${
          p.status === "published" ? "bg-black/40 text-green-400" : "bg-black/40 text-white/60"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${p.status === "published" ? "bg-green-400" : "bg-white/40"} animate-pulse`} />
          {p.status === "published" ? "Published" : "Draft"}
        </div>

        {/* Template badge */}
        <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm text-[10px] font-mono text-white/70">
          {p.template}
        </div>
      </div>

      {/* Card body */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-sans font-bold text-[var(--fg)] text-xs truncate">{p.name}</h3>
            <span className="font-mono text-[10px] text-[var(--fg-muted)] truncate block">
              {p.customDomain ?? `${p.slug}.frame.co`}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] text-[var(--fg-muted)]">{p.visits.toLocaleString()} visits</span>
            <span className="font-mono text-[9px] text-[var(--fg-muted)]">{p.pages}p</span>
          </div>
          <div className="font-mono text-[9px] text-[var(--fg-muted)]">{p.updatedAt}</div>
        </div>
      </div>
    </Link>
  );
}

/* ── New portfolio modal ── */
/* ── Portfolio onboarding wizard (4 steps) ──────────────────────────── */
const PORTFOLIO_STEPS = ["Name", "Template", "Domain", "Done"] as const;

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === current ? "w-5 bg-yellow" : i < current ? "w-2 bg-yellow/50" : "w-2 bg-[var(--border)]"}`} />
      ))}
    </div>
  );
}

function NewPortfolioModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [step, setStep]         = useState(0);
  const [name, setName]         = useState("");
  const [template, setTemplate] = useState(TEMPLATES[0]!);
  const [domain, setDomain]     = useState<"free" | "custom">("free");
  const [customDomain, setCustomDomain] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  function finish() {
    onClose();
    router.push("/dashboard/portfolio/1");
  }

  const canNext = step === 0 ? !!name.trim() : true;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-md rounded-2xl bg-[var(--bg)] border border-[var(--border)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest">{PORTFOLIO_STEPS[step]}</span>
            <StepDots current={step} total={PORTFOLIO_STEPS.length} />
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
            className="px-6 py-6 min-h-[240px]"
          >
            {step === 0 && (
              <div className="space-y-3">
                <h2 className="font-sans font-black text-[var(--fg)] text-xl">Name your portfolio</h2>
                <p className="font-sans text-sm text-[var(--fg-muted)]">This is how it'll appear in your dashboard and in the browser tab.</p>
                <input
                  autoFocus value={name} onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) setStep(1); }}
                  placeholder="Sofia Chen Photography"
                  className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:border-yellow transition-colors mt-2"
                />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <h2 className="font-sans font-black text-[var(--fg)] text-xl">Pick a template</h2>
                <p className="font-sans text-sm text-[var(--fg-muted)]">You can change this later. Choose what feels closest to your style.</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {TEMPLATES.map((t) => (
                    <button key={t} onClick={() => setTemplate(t)}
                      className={`p-2 rounded-xl border text-left transition-all ${template === t ? "border-yellow ring-2 ring-yellow/20 bg-yellow/5" : "border-[var(--border)] hover:border-[var(--fg-muted)]"}`}
                    >
                      <div className="aspect-video rounded-lg overflow-hidden bg-[var(--bg-subtle)] mb-2">
                        {TEMPLATE_URL[t] && <LivePreviewThumbnail url={TEMPLATE_URL[t]!} baseWidth={1280} className="w-full h-full" />}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-xs font-semibold text-[var(--fg)]">{t}</span>
                        {template === t && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fad502" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <h2 className="font-sans font-black text-[var(--fg)] text-xl">Choose your domain</h2>
                <p className="font-sans text-sm text-[var(--fg-muted)]">Start free, upgrade to a custom domain any time.</p>
                <div className="flex flex-col gap-2 mt-2">
                  <button onClick={() => setDomain("free")}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${domain === "free" ? "border-yellow bg-yellow/5" : "border-[var(--border)] hover:border-[var(--fg-muted)]"}`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${domain === "free" ? "border-yellow" : "border-[var(--fg-muted)]"}`}>
                      {domain === "free" && <div className="w-2 h-2 rounded-full bg-yellow" />}
                    </div>
                    <div>
                      <div className="font-sans text-sm font-semibold text-[var(--fg)]">Free subdomain</div>
                      <div className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">sofia.portapic.app</div>
                    </div>
                  </button>
                  <button onClick={() => setDomain("custom")}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${domain === "custom" ? "border-yellow bg-yellow/5" : "border-[var(--border)] hover:border-[var(--fg-muted)]"}`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${domain === "custom" ? "border-yellow" : "border-[var(--fg-muted)]"}`}>
                      {domain === "custom" && <div className="w-2 h-2 rounded-full bg-yellow" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-sm font-semibold text-[var(--fg)]">Custom domain</span>
                        <span className="font-mono text-[9px] bg-yellow/10 text-yellow border border-yellow/20 px-1.5 py-0.5 rounded uppercase tracking-wider">Gold</span>
                      </div>
                      <div className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">yourdomain.com</div>
                      {domain === "custom" && (
                        <input value={customDomain} onChange={(e) => setCustomDomain(e.target.value)}
                          placeholder="yourdomain.com"
                          className="mt-2 w-full font-mono text-xs text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors"
                        />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center text-center py-4 gap-4">
                <div className="w-14 h-14 rounded-full bg-yellow/10 border border-yellow/30 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fad502" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div>
                  <h2 className="font-sans font-black text-[var(--fg)] text-xl mb-1">Ready to go!</h2>
                  <p className="font-sans text-sm text-[var(--fg-muted)]">
                    <span className="text-[var(--fg)] font-medium">{name}</span> is set up with the {template} template.
                    Open the editor to add photos and go live.
                  </p>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => navigator.share?.({ url: window.location.href }).catch(() => {})} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border)] font-sans text-sm font-medium text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                    Share
                  </button>
                  <button onClick={finish} className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 transition-colors">
                    Open editor →
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer nav */}
        {step < 3 && (
          <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between">
            <button
              onClick={() => step > 0 ? setStep(step - 1) : onClose()}
              className="px-4 py-2 rounded-xl border border-[var(--border)] font-sans text-sm font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
            >
              {step === 0 ? "Cancel" : "← Back"}
            </button>
            <button
              disabled={!canNext}
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 disabled:opacity-40 transition-colors"
            >
              {step === 2 ? "Create portfolio" : "Continue →"}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── Main page ─────────────────────────────────────────────── */

export default function PortfolioPage() {
  const [showNewModal, setShowNewModal] = useState(false);

  const published = MOCK_PORTFOLIOS.filter((p) => p.status === "published").length;
  const drafts    = MOCK_PORTFOLIOS.filter((p) => p.status === "draft").length;

  return (
    <div className="p-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-sans font-black text-[var(--fg)] text-xl">Portfolio</h1>
          <p className="font-mono text-xs text-[var(--fg-muted)] mt-0.5">
            <span className="text-green-400">{published} published</span>
            {drafts > 0 && <> · <span>{drafts} draft{drafts > 1 ? "s" : ""}</span></>}
            <> · <span>{MOCK_PORTFOLIOS.length} total</span></>
          </p>
        </div>
      </div>

      {/* ── Grid ── */}
      {MOCK_PORTFOLIOS.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center mb-4 text-[var(--fg-muted)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
          </div>
          <p className="font-sans font-semibold text-[var(--fg)] mb-1">No portfolios yet</p>
          <p className="font-serif text-sm text-[var(--fg-muted)] mb-5">Create your first portfolio website</p>
          <button onClick={() => setShowNewModal(true)} className="btn-primary px-5 py-2.5 rounded-xl font-sans font-bold text-sm">
            Create portfolio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {MOCK_PORTFOLIOS.map((p) => <PortfolioCard key={p.id} p={p} />)}
          <NewPortfolioTile onClick={() => setShowNewModal(true)} />
        </div>
      )}

      <AnimatePresence>
        {showNewModal && <NewPortfolioModal onClose={() => setShowNewModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
