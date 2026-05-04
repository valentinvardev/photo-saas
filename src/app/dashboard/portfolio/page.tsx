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
          <Sparkline data={p.weeklyViews} />
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
function NewPortfolioModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [name, setName]         = useState("");
  const [template, setTemplate] = useState(TEMPLATES[0]!);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  function create() {
    /* For the mock dashboard we just route to portfolio "1" — wire to a real
       store later. */
    onClose();
    router.push("/dashboard/portfolio/1");
  }

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
        <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-sans font-black text-[var(--fg)] text-lg">New portfolio</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest mb-1.5">Name</label>
            <input
              autoFocus value={name} onChange={(e) => setName(e.target.value)}
              placeholder="My new portfolio"
              className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-3 outline-none focus:border-yellow transition-colors"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest mb-1.5">Starting template</label>
            <div className="grid grid-cols-3 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`p-2 rounded-lg border text-left transition-all ${template === t ? "border-yellow ring-2 ring-yellow/30" : "border-[var(--border)] hover:border-[var(--fg-muted)]"}`}
                >
                  <div className="aspect-[16/10] rounded-md overflow-hidden bg-[var(--bg-subtle)] mb-2">
                    {TEMPLATE_URL[t] && <LivePreviewThumbnail url={TEMPLATE_URL[t]!} baseWidth={1280} className="w-full h-full" />}
                  </div>
                  <span className="font-sans text-[11px] font-semibold text-[var(--fg)]">{t}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[var(--border)] flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-[var(--border)] font-sans text-sm font-medium text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
            Cancel
          </button>
          <button
            disabled={!name.trim()}
            onClick={create}
            className="px-5 py-2 rounded-lg bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 disabled:opacity-40 transition-colors"
          >
            Create &amp; configure
          </button>
        </div>
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
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="btn-primary flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-sans font-bold text-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New portfolio
        </button>
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
        </div>
      )}

      <AnimatePresence>
        {showNewModal && <NewPortfolioModal onClose={() => setShowNewModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
