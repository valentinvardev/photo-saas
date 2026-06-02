"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DevicePreviewModal, LivePreviewThumbnail } from "~/components/dashboard/DevicePreviewModal";
import { ContentTree } from "~/components/portfolio/ContentTree";
import { TEMPLATE_URL, TEMPLATES, type Portfolio } from "~/lib/portfolio/mock";
import { dbToView } from "~/lib/portfolio/adapt";
import { usePortfolioContentSync } from "~/lib/portfolio/useContentSync";
import { api } from "~/trpc/react";

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

  const { data: dbP, isLoading } = api.portfolio.get.useQuery({ id });
  const portfolio = dbP ? dbToView(dbP) : undefined;

  const [tab, setTab]                 = useState<Tab>("content");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [published, setPublished]     = useState(false);

  const utils      = api.useUtils();
  const publishMut = api.portfolio.update.useMutation({
    onSuccess: () => { void utils.portfolio.get.invalidate({ id }); void utils.portfolio.list.invalidate(); },
  });
  const deleteMut  = api.portfolio.delete.useMutation();

  const { saving } = usePortfolioContentSync(id);

  useEffect(() => { if (dbP) setPublished(dbP.status === "published"); }, [dbP]);

  if (isLoading) {
    return (
      <div className="p-12 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-[var(--border)] border-t-yellow animate-spin" />
      </div>
    );
  }

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

          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)]">
            {saving ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-yellow animate-pulse" />
                Saving…
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                Saved
              </>
            )}
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
            onClick={() => {
              const nextStatus = published ? "draft" : "published";
              setPublished(!published);
              publishMut.mutate({ id, status: nextStatus });
            }}
            disabled={publishMut.isPending}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-sans text-xs font-bold transition-colors disabled:opacity-50 ${
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
              <SettingsTab portfolio={portfolio} onDelete={async () => {
                await deleteMut.mutateAsync({ id });
                void utils.portfolio.list.invalidate();
                router.push("/dashboard/portfolio");
              }} />
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

        {/* Browse all */}
        <Link
          href="/dashboard/templates"
          target="_blank"
          className="group text-left rounded-xl overflow-hidden border border-dashed border-[var(--border)] hover:border-yellow transition-all flex flex-col"
        >
          <div className="aspect-[16/10] bg-[var(--bg-subtle)] group-hover:bg-yellow/5 transition-colors flex items-center justify-center text-[var(--fg-muted)] group-hover:text-yellow">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <div className="p-3 flex items-center justify-between">
            <span className="font-sans font-bold text-[var(--fg-muted)] group-hover:text-[var(--fg)] text-sm transition-colors">Browse all templates</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--fg-muted)] group-hover:text-yellow transition-colors">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </div>
        </Link>
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
  const week7 = portfolio.weeklyViews.reduce((a, b) => a + b, 0);

  const STATS = [
    { label: "Total views",      value: portfolio.visits.toLocaleString(), delta: "+12%", up: true  },
    { label: "Unique visitors",  value: portfolio.uniqueVisitors.toLocaleString(), delta: "+8%", up: true },
    { label: "Avg session",      value: "2:14",  delta: "+0:22", up: true  },
    { label: "Inquiries",        value: "7",     delta: "+3",    up: true  },
  ];

  const INSIGHTS = [
    {
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5"/>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      ),
      color: "#e1306c",
      title: "Instagram is your top referrer",
      body:  "31% of traffic comes from Instagram. Pin your portfolio link in your bio.",
    },
    {
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      color: "#fad502",
      title: "Weddings page gets 4× more time",
      body:  "Visitors spend 4:32 average on /weddings — your strongest content.",
    },
    {
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          <polyline points="17 6 23 6 23 12"/>
        </svg>
      ),
      color: "#34d399",
      title: "Tuesday is your peak day",
      body:  `${week7} views last 7 days. Tuesday drives 34% more traffic than average.`,
    },
  ];

  const TOP_CONTENT = [
    { slug: "weddings",  label: "Weddings 2024",  views: Math.round(portfolio.visits * 0.46), seed: "wed2024" },
    { slug: "portraits", label: "Portraits",       views: Math.round(portfolio.visits * 0.29), seed: "port1"   },
    { slug: "about",     label: "About",           views: Math.round(portfolio.visits * 0.14), seed: "about1"  },
    { slug: "contact",   label: "Contact",         views: Math.round(portfolio.visits * 0.07), seed: "cont1"   },
    { slug: "shop",      label: "Shop",            views: Math.round(portfolio.visits * 0.04), seed: "shop1"   },
  ];
  const topMax = TOP_CONTENT[0]!.views;

  const SOURCES = [
    { label: "Direct",      pct: 42, color: "var(--fg-muted)" },
    { label: "Instagram",   pct: 31, color: "#e1306c"         },
    { label: "Google",      pct: 18, color: "#4285f4"         },
    { label: "Twitter / X", pct:  9, color: "var(--fg-muted)" },
  ];

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h2 className="font-sans font-bold text-[var(--fg)] text-base">Analytics</h2>
        <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5 uppercase tracking-widest">
          What's resonating and where visitors come from.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-4">
            <div className="font-mono text-[9px] text-[var(--fg-muted)] mb-2 uppercase tracking-widest">{s.label}</div>
            <div className="font-sans font-black text-2xl text-[var(--fg)] mb-1">{s.value}</div>
            <span className={`inline-flex items-center gap-0.5 font-mono text-[9px] ${s.up ? "text-green-400" : "text-red-400"}`}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                {s.up ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
              </svg>
              {s.delta} vs last week
            </span>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {INSIGHTS.map((ins) => (
          <div key={ins.title} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 flex flex-col gap-2">
            <span style={{ color: ins.color }}>{ins.icon}</span>
            <p className="font-sans text-sm font-semibold text-[var(--fg)] leading-tight">{ins.title}</p>
            <p className="font-sans text-xs text-[var(--fg-muted)] leading-relaxed">{ins.body}</p>
          </div>
        ))}
      </div>

      {/* Top content + Traffic sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        {/* Top content with thumbnails */}
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
            <span className="font-sans font-semibold text-sm text-[var(--fg)]">Top content</span>
          </div>
          {TOP_CONTENT.map((row) => (
            <div key={row.slug} className="flex items-center gap-3 px-4 py-2.5 border-b border-[var(--border)] last:border-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://picsum.photos/seed/${row.seed}/60/60?grayscale`}
                alt=""
                className="w-8 h-8 rounded-md object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-sans text-xs font-medium text-[var(--fg)] truncate">{row.label}</div>
                <div className="mt-1 h-1 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-yellow"
                    style={{ width: `${(row.views / topMax) * 100}%` }}
                  />
                </div>
              </div>
              <span className="font-mono text-[10px] text-[var(--fg-muted)] shrink-0 tabular-nums">
                {row.views.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Traffic sources */}
        <div className="rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
            <span className="font-sans font-semibold text-sm text-[var(--fg)]">Traffic sources</span>
          </div>
          <div className="px-4 py-3 space-y-3">
            {SOURCES.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-sans text-xs text-[var(--fg)]">{s.label}</span>
                  <span className="font-mono text-[10px] text-[var(--fg-muted)]">{s.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${s.pct}%`, background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
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
