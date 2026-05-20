"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DevicePreviewModal, LivePreviewThumbnail } from "~/components/dashboard/DevicePreviewModal";
import { ContentTree } from "~/components/portfolio/ContentTree";
import { getPortfolioById, TEMPLATE_URL, TEMPLATES, type Portfolio } from "~/lib/portfolio/mock";

type Tab = "content" | "template" | "domain" | "seo" | "analytics" | "settings";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "content",   label: "Content",   icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg> },
  { id: "template",  label: "Template",  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg> },
  { id: "domain",    label: "Domain",    icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
  { id: "seo",       label: "SEO",       icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
  { id: "analytics", label: "Analytics", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { id: "settings",  label: "Settings",  icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg> },
];

export default function PortfolioManagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const portfolio = getPortfolioById(id);

  const [tab, setTab]                 = useState<Tab>("content");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [published, setPublished]     = useState(portfolio?.status === "published");

  if (!portfolio) {
    return (
      <div className="p-12 text-center">
        <p className="font-sans text-sm text-[var(--fg-muted)]">Portfolio not found.</p>
        <Link href="/dashboard/portfolio" className="font-mono text-[10px] text-yellow uppercase tracking-widest mt-4 inline-block hover:underline">
          ← Back to all portfolios
        </Link>
      </div>
    );
  }

  const url        = portfolio.customDomain ?? `${portfolio.slug}.frame.co`;
  const previewUrl = TEMPLATE_URL[portfolio.template];

  return (
    <div className="min-h-full">

      {/* ── Top bar with breadcrumb + actions ── */}
      <header className="bg-[var(--bg)] border-b border-[var(--border)]">
        <div className="px-5 py-3 flex items-center gap-3 flex-wrap">
          <Link
            href="/dashboard/portfolio"
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            All portfolios
          </Link>

          <span className="text-[var(--border)]">/</span>

          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-widest ${
            published ? "bg-green-500/10 text-green-400" : "bg-[var(--bg-subtle)] text-[var(--fg-muted)]"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${published ? "bg-green-400" : "bg-[var(--fg-muted)]"}`} />
            {published ? "Published" : "Draft"}
          </span>

          <div className="flex-1" />

          {/* Actions */}
          <button
            onClick={() => setPreviewOpen(true)}
            disabled={!previewUrl}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] disabled:opacity-40 transition-colors font-sans text-xs font-medium"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview
          </button>
          <Link
            href={`/editor/minimal-bw`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors font-sans text-xs font-medium"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit website
          </Link>
          <button
            onClick={() => setPublished((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-sans text-xs font-bold transition-colors ${
              published
                ? "border border-red-500/30 text-red-400 hover:bg-red-500/10"
                : "bg-yellow text-[#111] hover:bg-yellow/90"
            }`}
          >
            {published ? "Unpublish" : "Publish"}
          </button>
        </div>

        {/* Title row */}
        <div className="px-5 pb-4 flex items-end justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h1 className="font-sans font-black text-[var(--fg)] text-xl truncate">{portfolio.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-[11px] text-[var(--fg-muted)]">{url}</span>
              <span className="px-1.5 py-0.5 rounded-full bg-[var(--bg-subtle)] font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-widest">
                {portfolio.template}
              </span>
            </div>
          </div>

          {/* Hero strip — live preview thumbnail */}
          {previewUrl && (
            <button
              onClick={() => setPreviewOpen(true)}
              className="relative w-44 h-28 overflow-hidden rounded-lg border border-[var(--border)] hover:border-[var(--fg-muted)] transition-colors group shrink-0"
            >
              <LivePreviewThumbnail url={previewUrl} baseWidth={1280} className="w-full h-full" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-[#111] font-sans text-[11px] font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Open preview
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Tabs */}
        <nav className="flex gap-0 px-5 -mb-px border-b border-[var(--border)] overflow-x-auto">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 font-sans text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  active
                    ? "border-yellow text-[var(--fg)]"
                    : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)]"
                }`}
              >
                <span className={active ? "text-yellow" : "text-[var(--fg-muted)]"}>{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* ── Tab content ── */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          {tab === "content" && (
            <motion.div key="content" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <ContentTree portfolioId={portfolio.id} />
            </motion.div>
          )}

          {tab === "template" && (
            <motion.div key="template" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <TemplateTab portfolio={portfolio} />
            </motion.div>
          )}

          {tab === "domain" && (
            <motion.div key="domain" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <DomainTab portfolio={portfolio} />
            </motion.div>
          )}

          {tab === "seo" && (
            <motion.div key="seo" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <SeoTab portfolio={portfolio} />
            </motion.div>
          )}

          {tab === "analytics" && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <AnalyticsTab portfolio={portfolio} />
            </motion.div>
          )}

          {tab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <SettingsTab portfolio={portfolio} onDelete={() => router.push("/dashboard/portfolio")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Device preview modal */}
      <AnimatePresence>
        {previewOpen && previewUrl && (
          <DevicePreviewModal
            url={previewUrl}
            title={portfolio.name}
            subtitle={url}
            onClose={() => setPreviewOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Tabs ─────────────────────────────────────────────────── */

function TemplateTab({ portfolio }: { portfolio: Portfolio }) {
  const [selected, setSelected] = useState(portfolio.template);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="font-sans font-bold text-[var(--fg)] text-base">Template</h2>
        <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5 uppercase tracking-widest">
          Pick the visual style of your portfolio. You can switch any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {TEMPLATES.map((t) => {
          const url    = TEMPLATE_URL[t];
          const active = selected === t;
          return (
            <button
              key={t}
              onClick={() => setSelected(t)}
              className={`text-left rounded-xl overflow-hidden border transition-all ${
                active ? "border-yellow ring-2 ring-yellow/30" : "border-[var(--border)] hover:border-[var(--fg-muted)]"
              }`}
            >
              <div className="aspect-[16/10] bg-[var(--bg-subtle)] overflow-hidden">
                {url && <LivePreviewThumbnail url={url} baseWidth={1280} className="w-full h-full" />}
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="font-sans font-bold text-[var(--fg)] text-sm">{t}</span>
                {active && (
                  <span className="font-mono text-[9px] text-yellow bg-yellow/10 border border-yellow/30 px-1.5 py-0.5 rounded">
                    In use
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={selected === portfolio.template}
          className="px-4 py-2 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold hover:bg-yellow/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Apply template
        </button>
        <Link
          href="/dashboard/templates"
          className="px-4 py-2 rounded-lg border border-[var(--border)] font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
        >
          Browse all templates →
        </Link>
      </div>
    </div>
  );
}

function DomainTab({ portfolio }: { portfolio: Portfolio }) {
  const url    = portfolio.customDomain ?? `${portfolio.slug}.frame.co`;
  const isFree = !portfolio.customDomain;

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="font-sans font-bold text-[var(--fg)] text-base">Domain</h2>
        <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5 uppercase tracking-widest">
          The address visitors use to reach this portfolio.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)] shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
          </div>
          <div className="min-w-0">
            <div className="font-mono text-sm text-[var(--fg)] truncate">{url}</div>
            <div className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest mt-0.5">
              {isFree ? "Free subdomain" : "Custom domain · Connected"}
            </div>
          </div>
        </div>
        <Link
          href="/dashboard/domain"
          className="px-3 py-2 rounded-lg border border-[var(--border)] font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors whitespace-nowrap"
        >
          Manage domain →
        </Link>
      </div>

      {isFree && (
        <div className="rounded-xl border border-yellow/30 bg-yellow/5 p-4 flex items-start gap-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#facc15" stroke="none" className="shrink-0 mt-0.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <div className="flex-1 min-w-0">
            <p className="font-sans text-sm font-semibold text-[var(--fg)]">Connect a custom domain</p>
            <p className="font-sans text-xs text-[var(--fg-muted)] mt-1">Clients trust a branded address. Buy or connect <code className="font-mono text-[11px] bg-[var(--bg-subtle)] px-1 rounded">{portfolio.slug}.com</code> to upgrade your portfolio.</p>
            <Link href="/dashboard/domain" className="inline-block mt-3 px-3 py-1.5 rounded-lg bg-[#111] text-yellow font-sans text-xs font-bold hover:opacity-90 transition-opacity">
              Connect domain
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function SeoTab({ portfolio }: { portfolio: Portfolio }) {
  const url = portfolio.customDomain ?? `${portfolio.slug}.frame.co`;
  const [title, setTitle]   = useState(portfolio.seo.title);
  const [desc,  setDesc]    = useState(portfolio.seo.description);

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="font-sans font-bold text-[var(--fg)] text-base">SEO</h2>
        <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5 uppercase tracking-widest">
          How your portfolio shows up in search results and social shares.
        </p>
      </div>

      <div>
        <label className="block font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest mb-1.5">Meta title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg px-4 py-3 font-sans text-sm text-[var(--fg)] bg-[var(--bg-card)] border border-[var(--border)] focus:outline-none focus:border-yellow transition-colors"
        />
        <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-1">{title.length}/60 characters</p>
      </div>

      <div>
        <label className="block font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest mb-1.5">Meta description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
          className="w-full rounded-lg px-4 py-3 font-sans text-sm text-[var(--fg)] bg-[var(--bg-card)] border border-[var(--border)] focus:outline-none focus:border-yellow transition-colors resize-none"
        />
        <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-1">{desc.length}/160 characters</p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
        <p className="font-mono text-[10px] text-[var(--fg-muted)] mb-3 uppercase tracking-widest">Search preview</p>
        <div className="font-sans text-base text-blue-400 hover:underline cursor-default truncate">{title || portfolio.name}</div>
        <div className="font-mono text-[11px] text-green-600 truncate">https://{url}</div>
        <div className="font-sans text-xs text-[var(--fg-muted)] mt-1 line-clamp-2">{desc || "No description set."}</div>
      </div>

      <div>
        <label className="block font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest mb-1.5">OG Image</label>
        <div className="rounded-lg border-2 border-dashed border-[var(--border)] h-32 flex flex-col items-center justify-center gap-2 text-[var(--fg-muted)] hover:border-yellow hover:text-yellow transition-colors cursor-pointer">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span className="font-mono text-xs">Upload OG image (1200×630)</span>
        </div>
      </div>

      <button className="px-4 py-2 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold hover:bg-yellow/90 transition-colors">
        Save SEO settings
      </button>
    </div>
  );
}

function AnalyticsTab({ portfolio }: { portfolio: Portfolio }) {
  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h2 className="font-sans font-bold text-[var(--fg)] text-base">Analytics</h2>
        <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5 uppercase tracking-widest">
          Visits, sources, and what's resonating.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total visits",     value: portfolio.visits.toLocaleString() },
          { label: "Unique visitors",  value: portfolio.uniqueVisitors.toLocaleString() },
          { label: "Pages",            value: String(portfolio.pages) },
          { label: "Last 7d",          value: portfolio.weeklyViews.reduce((a, b) => a + b, 0).toString() },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-4">
            <div className="font-mono text-[10px] text-[var(--fg-muted)] mb-2 uppercase tracking-widest">{stat.label}</div>
            <div className="font-sans font-black text-2xl text-[var(--fg)]">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-sans font-semibold text-sm text-[var(--fg)]">Page views</span>
          <span className="font-mono text-xs text-[var(--fg-muted)]">Last 7 days</span>
        </div>
        {(() => {
          const data = portfolio.weeklyViews;
          const max  = Math.max(...data, 1);
          const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          const w = 600; const h = 120;
          const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(" ");
          const fillPts = `0,${h} ${pts} ${w},${h}`;
          return (
            <div>
              <svg width="100%" viewBox={`0 0 ${w} ${h + 4}`} className="overflow-visible">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fad502" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#fad502" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon points={fillPts} fill="url(#chartGrad)" />
                <polyline points={pts} fill="none" stroke="#fad502" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {data.map((v, i) => (
                  <circle key={i} cx={(i / (data.length - 1)) * w} cy={h - (v / max) * h} r="3" fill="#fad502" />
                ))}
              </svg>
              <div className="flex justify-between mt-1">
                {days.map((d) => <span key={d} className="font-mono text-[9px] text-[var(--fg-muted)]">{d}</span>)}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Top pages + referrers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
            <span className="font-sans font-semibold text-sm text-[var(--fg)]">Top pages</span>
          </div>
          {[
            { page: "Home",      pct: 0.45 },
            { page: "Portfolio", pct: 0.28 },
            { page: "About",     pct: 0.14 },
            { page: "Contact",   pct: 0.08 },
            { page: "Shop",      pct: 0.05 },
          ].map((row) => {
            const views = Math.round(portfolio.visits * row.pct);
            return (
              <div key={row.page} className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0">
                <span className="font-sans text-sm text-[var(--fg)] flex-1">/{row.page.toLowerCase()}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                    <div className="h-full rounded-full bg-yellow" style={{ width: `${row.pct * 100}%` }} />
                  </div>
                  <span className="font-mono text-xs text-[var(--fg-muted)] w-12 text-right">{views}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
            <span className="font-sans font-semibold text-sm text-[var(--fg)]">Top referrers</span>
          </div>
          {[
            { source: "Direct",      pct: 42 },
            { source: "Instagram",   pct: 31 },
            { source: "Google",      pct: 18 },
            { source: "Twitter / X", pct: 9  },
          ].map((row) => (
            <div key={row.source} className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0">
              <span className="font-sans text-sm text-[var(--fg)] flex-1">{row.source}</span>
              <span className="font-mono text-xs text-[var(--fg-muted)]">{row.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ portfolio, onDelete }: { portfolio: Portfolio; onDelete: () => void }) {
  const [pwOn, setPwOn] = useState(portfolio.passwordProtected);

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="font-sans font-bold text-[var(--fg)] text-base">Settings</h2>
        <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5 uppercase tracking-widest">
          Privacy and danger zone.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 flex items-center justify-between gap-3">
        <div>
          <div className="font-sans text-sm font-semibold text-[var(--fg)]">Password protection</div>
          <div className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">Visitors need a password to view this portfolio.</div>
        </div>
        <button
          onClick={() => setPwOn((v) => !v)}
          role="switch" aria-checked={pwOn}
          className={`relative inline-flex flex-shrink-0 w-9 h-5 rounded-full transition-colors ${pwOn ? "bg-yellow" : "bg-[var(--bg-subtle)] border border-[var(--fg-muted)]"}`}
        >
          <span className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
            style={{ left: pwOn ? 18 : 2, background: pwOn ? "#111" : "var(--fg)" }}
          />
        </button>
      </div>

      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
        <div className="font-sans text-sm font-semibold text-red-400 mb-1">Danger zone</div>
        <p className="font-sans text-xs text-[var(--fg-muted)] mb-3">
          Deleting "{portfolio.name}" can't be undone. All categories, folders, and photos under this portfolio will be permanently removed.
        </p>
        <button
          onClick={() => { if (confirm(`Delete "${portfolio.name}"? This cannot be undone.`)) onDelete(); }}
          className="px-3 py-2 rounded-lg border border-red-500/40 text-red-400 font-sans text-xs font-bold hover:bg-red-500/10 transition-colors"
        >
          Delete portfolio
        </button>
      </div>
    </div>
  );
}
