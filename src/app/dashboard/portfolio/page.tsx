"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LivePreviewThumbnail } from "~/components/dashboard/DevicePreviewModal";
import { MOCK_PORTFOLIOS, TEMPLATE_URL, type Portfolio } from "~/lib/portfolio/mock";

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

/* ─── Main page ─────────────────────────────────────────────── */

export default function PortfolioPage() {
  const router = useRouter();

  const published = MOCK_PORTFOLIOS.filter((p) => p.status === "published").length;
  const drafts    = MOCK_PORTFOLIOS.filter((p) => p.status === "draft").length;

  function goNew() { router.push("/dashboard/portfolio/new"); }

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
          <button onClick={goNew} className="btn-primary px-5 py-2.5 rounded-xl font-sans font-bold text-sm">
            Create portfolio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {MOCK_PORTFOLIOS.map((p) => <PortfolioCard key={p.id} p={p} />)}
          <NewPortfolioTile onClick={goNew} />
        </div>
      )}
    </div>
  );
}
