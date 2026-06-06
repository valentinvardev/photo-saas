"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { DevicePreviewModal, LivePreviewThumbnail } from "~/components/dashboard/DevicePreviewModal";
import { ContentTree } from "~/components/portfolio/ContentTree";
import { PhotoPickerModal } from "~/components/portfolio/PhotoPickerModal";
import { TEMPLATE_URL, TEMPLATES, type Portfolio } from "~/lib/portfolio/mock";
import { dbToView } from "~/lib/portfolio/adapt";
import { usePortfolioContentSync } from "~/lib/portfolio/useContentSync";
import { api, type RouterOutputs } from "~/trpc/react";

type DbPortfolio = NonNullable<RouterOutputs["portfolio"]["get"]>;
type SaveFn = (patch: Partial<{
  customDomain: string | null; seoTitle: string | null; seoDescription: string | null;
  ogImageUrl: string | null; passwordEnabled: boolean; password: string;
}>) => void;

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
  const save: SaveFn = (patch) => publishMut.mutate({ id, ...patch });

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
          {published && (
            <a
              href={`/p/${portfolio.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors font-sans text-xs font-medium"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              View live
            </a>
          )}
          <button
            onClick={() => setPreviewOpen(true)}
            disabled={!previewUrl}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] disabled:opacity-40 transition-colors font-sans text-xs font-medium"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview
          </button>
          <Link
            href={`/editor/${id}`}
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

          {tab === "domain" && dbP && (
            <motion.div key="domain" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <DomainTab dbP={dbP} save={save} />
            </motion.div>
          )}

          {tab === "seo" && dbP && (
            <motion.div key="seo" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <SeoTab dbP={dbP} save={save} />
            </motion.div>
          )}

          {tab === "analytics" && dbP && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <AnalyticsTab dbP={dbP} />
            </motion.div>
          )}

          {tab === "settings" && dbP && (
            <motion.div key="settings" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <SettingsTab dbP={dbP} save={save} onDelete={async () => {
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

function DomainTab({ dbP, save }: { dbP: DbPortfolio; save: SaveFn }) {
  const liveUrl = (typeof window !== "undefined" ? window.location.origin : "https://portapic.com") + `/p/${dbP.slug}`;
  const [domain, setDomain]   = useState(dbP.customDomain ?? "");
  const [copied, setCopied]   = useState(false);
  const clean = domain.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  const dirty = (clean || null) !== (dbP.customDomain ?? null);

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="font-sans font-bold text-[var(--fg)] text-base">Domain</h2>
        <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5 uppercase tracking-widest">
          The address visitors use to reach this portfolio.
        </p>
      </div>

      {/* Live address */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
        <div className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-widest mb-2">Live address</div>
        <div className="flex items-center gap-2 flex-wrap">
          <code className="font-mono text-sm text-[var(--fg)] bg-[var(--bg-subtle)] px-2 py-1 rounded truncate flex-1 min-w-0">{liveUrl}</code>
          <button
            onClick={() => { navigator.clipboard.writeText(liveUrl).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="px-3 py-1.5 rounded-lg border border-[var(--border)] font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors whitespace-nowrap"
          >{copied ? "Copied" : "Copy"}</button>
          <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold hover:bg-yellow/90 transition-colors">Open</a>
        </div>
      </div>

      {/* Custom domain */}
      <div>
        <label className="block font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest mb-1.5">Custom domain (optional)</label>
        <div className="flex gap-2">
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="yourname.com"
            className="flex-1 rounded-lg px-4 py-3 font-sans text-sm text-[var(--fg)] bg-[var(--bg-card)] border border-[var(--border)] focus:outline-none focus:border-yellow transition-colors"
          />
          <button
            disabled={!dirty}
            onClick={() => save({ customDomain: clean || null })}
            className="px-4 py-2 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold hover:bg-yellow/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >Save domain</button>
        </div>
        <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-1.5">Leave empty to use the free address above.</p>
      </div>

      {/* DNS instructions when a custom domain is set */}
      {dbP.customDomain && (
        <div className="rounded-xl border border-yellow/30 bg-yellow/5 p-4 space-y-2">
          <p className="font-sans text-sm font-semibold text-[var(--fg)]">Point your DNS</p>
          <p className="font-sans text-xs text-[var(--fg-muted)]">At your domain registrar, add a CNAME record:</p>
          <code className="block font-mono text-[11px] bg-[var(--bg-subtle)] px-3 py-2 rounded text-[var(--fg)]">CNAME&nbsp;&nbsp;@&nbsp;→&nbsp;cname.vercel-dns.com</code>
          <p className="font-mono text-[10px] text-yellow/80">Saved. Domain routing activates once verified — coming soon. For now the portfolio is live at the address above.</p>
        </div>
      )}
    </div>
  );
}

function SeoTab({ dbP, save }: { dbP: DbPortfolio; save: SaveFn }) {
  const liveUrl = (typeof window !== "undefined" ? window.location.origin : "https://portapic.com") + `/p/${dbP.slug}`;
  const [title, setTitle] = useState(dbP.seoTitle ?? "");
  const [desc,  setDesc]  = useState(dbP.seoDescription ?? "");
  const [og,    setOg]    = useState(dbP.ogImageUrl ?? "");
  const [picker, setPicker] = useState(false);

  const dirty =
    (title.trim() || null) !== (dbP.seoTitle ?? null) ||
    (desc.trim()  || null) !== (dbP.seoDescription ?? null) ||
    (og.trim()    || null) !== (dbP.ogImageUrl ?? null);

  function handleSave() {
    save({ seoTitle: title.trim() || null, seoDescription: desc.trim() || null, ogImageUrl: og.trim() || null });
  }

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
          placeholder={dbP.title}
          className="w-full rounded-lg px-4 py-3 font-sans text-sm text-[var(--fg)] bg-[var(--bg-card)] border border-[var(--border)] focus:outline-none focus:border-yellow transition-colors"
        />
        <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-1">{title.length}/60 · blank uses the portfolio title</p>
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
        <div className="font-sans text-base text-blue-400 hover:underline cursor-default truncate">{title || dbP.title}</div>
        <div className="font-mono text-[11px] text-green-600 truncate">{liveUrl}</div>
        <div className="font-sans text-xs text-[var(--fg-muted)] mt-1 line-clamp-2">{desc || "No description set."}</div>
      </div>

      <div>
        <label className="block font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest mb-1.5">Social / OG image</label>
        {og ? (
          <div className="rounded-lg border border-[var(--border)] overflow-hidden relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={og} alt="" className="w-full aspect-[1200/630] object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button onClick={() => setPicker(true)} className="px-3 py-1.5 rounded-lg bg-white text-[#111] font-sans text-xs font-bold">Change</button>
              <button onClick={() => setOg("")} className="px-3 py-1.5 rounded-lg bg-white/90 text-red-500 font-sans text-xs font-bold">Remove</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setPicker(true)} className="w-full rounded-lg border-2 border-dashed border-[var(--border)] h-32 flex flex-col items-center justify-center gap-2 text-[var(--fg-muted)] hover:border-yellow hover:text-yellow transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span className="font-mono text-xs">Choose from your library (1200×630 ideal)</span>
          </button>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={!dirty}
        className="px-4 py-2 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold hover:bg-yellow/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Save SEO settings
      </button>

      {picker && (
        <PhotoPickerModal multi={false} onPick={(urls) => { if (urls[0]) setOg(urls[0]); }} onClose={() => setPicker(false)} />
      )}
    </div>
  );
}

function AnalyticsTab({ dbP }: { dbP: DbPortfolio }) {
  const published = dbP.status === "published";
  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h2 className="font-sans font-bold text-[var(--fg)] text-base">Analytics</h2>
        <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5 uppercase tracking-widest">
          How your published portfolio is performing.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-4">
          <div className="font-mono text-[9px] text-[var(--fg-muted)] mb-2 uppercase tracking-widest">Total views</div>
          <div className="font-sans font-black text-2xl text-[var(--fg)]">{dbP.views.toLocaleString()}</div>
        </div>
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-4">
          <div className="font-mono text-[9px] text-[var(--fg-muted)] mb-2 uppercase tracking-widest">Status</div>
          <div className={`font-sans font-black text-2xl ${published ? "text-green-400" : "text-[var(--fg-muted)]"}`}>{published ? "Live" : "Draft"}</div>
        </div>
        <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-4">
          <div className="font-mono text-[9px] text-[var(--fg-muted)] mb-2 uppercase tracking-widest">Last updated</div>
          <div className="font-sans font-bold text-base text-[var(--fg)]">{new Date(dbP.updatedAt).toLocaleDateString()}</div>
        </div>
      </div>

      {!published && (
        <div className="rounded-xl border border-yellow/30 bg-yellow/5 p-4">
          <p className="font-sans text-sm font-semibold text-[var(--fg)]">Not published yet</p>
          <p className="font-sans text-xs text-[var(--fg-muted)] mt-1">Publish this portfolio to start counting views.</p>
        </div>
      )}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 flex items-start gap-3">
        <span className="text-[var(--fg-muted)] mt-0.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
        </span>
        <div>
          <p className="font-sans text-sm font-semibold text-[var(--fg)]">More analytics coming soon</p>
          <p className="font-sans text-xs text-[var(--fg-muted)] mt-1 leading-relaxed">Total views are tracked in real time. Traffic sources, top content, sessions and per-day trends will land here once event tracking is in place — shown only when there's real data, never placeholders.</p>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ dbP, save, onDelete }: { dbP: DbPortfolio; save: SaveFn; onDelete: () => void }) {
  const [pwOn, setPwOn] = useState(dbP.passwordEnabled);
  const [pw, setPw]     = useState(dbP.password ?? "");

  function toggle() {
    const next = !pwOn;
    setPwOn(next);
    if (!next) save({ passwordEnabled: false });   // turning off is immediate
  }
  const pwDirty = pwOn && (pw.trim().length > 0) && (!dbP.passwordEnabled || pw !== dbP.password);

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="font-sans font-bold text-[var(--fg)] text-base">Settings</h2>
        <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5 uppercase tracking-widest">
          Privacy and danger zone.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-sans text-sm font-semibold text-[var(--fg)]">Password protection</div>
            <div className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">Visitors need a password to view this portfolio.</div>
          </div>
          <button
            onClick={toggle}
            role="switch" aria-checked={pwOn}
            className={`relative inline-flex flex-shrink-0 w-9 h-5 rounded-full transition-colors ${pwOn ? "bg-yellow" : "bg-[var(--bg-subtle)] border border-[var(--fg-muted)]"}`}
          >
            <span className="absolute top-0.5 w-4 h-4 rounded-full transition-all" style={{ left: pwOn ? 18 : 2, background: pwOn ? "#111" : "var(--fg)" }} />
          </button>
        </div>

        {pwOn && (
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Set a password"
              className="flex-1 rounded-lg px-3 py-2 font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] focus:outline-none focus:border-yellow transition-colors"
            />
            <button
              onClick={() => save({ passwordEnabled: true, password: pw.trim() })}
              disabled={!pwDirty}
              className="px-4 py-2 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold hover:bg-yellow/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >Save</button>
          </div>
        )}
        {pwOn && dbP.passwordEnabled && dbP.password && pw === dbP.password && (
          <p className="font-mono text-[10px] text-green-400">Password active — visitors must enter it.</p>
        )}
      </div>

      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
        <div className="font-sans text-sm font-semibold text-red-400 mb-1">Danger zone</div>
        <p className="font-sans text-xs text-[var(--fg-muted)] mb-3">
          Deleting "{dbP.title}" can't be undone. All categories, folders, and photos under this portfolio will be permanently removed.
        </p>
        <button
          onClick={() => { if (confirm(`Delete "${dbP.title}"? This cannot be undone.`)) onDelete(); }}
          className="px-3 py-2 rounded-lg border border-red-500/40 text-red-400 font-sans text-xs font-bold hover:bg-red-500/10 transition-colors"
        >
          Delete portfolio
        </button>
      </div>
    </div>
  );
}
