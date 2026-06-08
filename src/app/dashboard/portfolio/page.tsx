"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LivePreviewThumbnail } from "~/components/dashboard/DevicePreviewModal";
import { TEMPLATE_URL, type Portfolio } from "~/lib/portfolio/mock";
import { dbToView } from "~/lib/portfolio/adapt";
import { portfolioPublicLabel } from "~/lib/portfolio/url";
import { api } from "~/trpc/react";
import { useT } from "~/components/providers/LangProvider";

/* ── New-portfolio tile — sits in the grid as the last "card" ── */
function NewPortfolioTile({ onClick }: { onClick: () => void }) {
  const { t } = useT();
  return (
    <button
      onClick={onClick}
      className="group flex flex-col border border-dashed border-[var(--border)] bg-[var(--bg-card)] overflow-hidden hover:border-yellow hover:bg-yellow/5 transition-all duration-200 rounded-2xl text-left"
    >
      {/* Cover area — animated icon */}
      <div className="relative aspect-square flex items-center justify-center bg-[var(--bg-subtle)] group-hover:bg-yellow/5 transition-colors">
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
      <div className="p-4 flex flex-col gap-1 flex-1 justify-center">
        <h3 className="font-sans font-bold text-[var(--fg)] text-sm">{t("portfolioPage.newTitle")}</h3>
        <span className="font-mono text-[10px] text-[var(--fg-muted)] block">{t("portfolioPage.newSub")}</span>
      </div>
    </button>
  );
}

/* ── Loading placeholder — mirrors the PortfolioCard layout ── */
function PortfolioCardSkeleton() {
  return (
    <div className="bg-[var(--bg-card)] overflow-hidden rounded-2xl">
      <div className="aspect-square bg-[var(--bg-subtle)] animate-pulse" />
      <div className="p-4">
        <div className="space-y-2 mb-3">
          <div className="h-3 w-2/3 rounded bg-[var(--bg-subtle)] animate-pulse" />
          <div className="h-2.5 w-1/2 rounded bg-[var(--bg-subtle)] animate-pulse" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="h-2.5 w-20 rounded bg-[var(--bg-subtle)] animate-pulse" />
          <div className="h-2.5 w-10 rounded bg-[var(--bg-subtle)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/* ── Compute week trend from weeklyViews ── */
function weekTrend(views: number[]): "up" | "down" | "flat" | "none" {
  const total = views.reduce((a, b) => a + b, 0);
  if (total === 0) return "none";
  const first = views.slice(0, 3).reduce((a, b) => a + b, 0);
  const last  = views.slice(4).reduce((a, b) => a + b, 0);
  if (last > first * 1.1) return "up";
  if (last < first * 0.9) return "down";
  return "flat";
}

/* ── Portfolio card — clicking it navigates to the manage page ── */
function PortfolioCard({ p }: { p: Portfolio }) {
  const { t } = useT();
  const previewUrl = TEMPLATE_URL[p.template];

  return (
    <Link
      href={`/dashboard/portfolio/${p.id}`}
      className="group block bg-[var(--bg-card)] overflow-hidden rounded-2xl transition-shadow duration-200 hover:shadow-[var(--shadow-lg)]"
    >
      {/* Cover — live render of the template */}
      <div className="relative aspect-square overflow-hidden bg-[var(--bg-subtle)]">
        {previewUrl ? (
          <LivePreviewThumbnail
            url={previewUrl}
            baseWidth={1280}
            className="w-full h-full"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={`https://picsum.photos/seed/${p.seed}/600/600?grayscale`} alt={p.name}
            className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Status badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono backdrop-blur-sm ${
          p.status === "published" ? "bg-black/40 text-green-400" : "bg-black/40 text-white/60"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${p.status === "published" ? "bg-green-400" : "bg-white/40"} animate-pulse`} />
          {p.status === "published" ? t("portfolioPage.statusPublished") : t("portfolioPage.statusDraft")}
        </div>

        {/* Template badge */}
        <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm text-[10px] font-mono text-white/70">
          {p.template}
        </div>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-sans font-bold text-[var(--fg)] text-sm truncate">{p.name}</h3>
            <span className="font-mono text-[10px] text-[var(--fg-muted)] truncate block mt-0.5">
              {p.customDomain ?? portfolioPublicLabel(p.slug)}
            </span>
          </div>
        </div>

        {/* Metrics row */}
        {(() => {
          const weekTotal = p.weeklyViews.reduce((a, b) => a + b, 0);
          const trend = weekTrend(p.weeklyViews);
          return (
            <div className="flex items-center justify-between pt-2">
              {p.status === "published" ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 font-mono text-[9px] text-[var(--fg-muted)]">
                    {trend === "up"   && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>}
                    {trend === "down" && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>}
                    {trend === "flat" && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14"/></svg>}
                    {weekTotal > 0 ? t("portfolioPage.thisWk", { n: weekTotal }) : t("portfolioPage.views", { n: p.visits.toLocaleString() })}
                  </span>
                  {p.uniqueVisitors > 0 && (
                    <span className="font-mono text-[9px] text-[var(--fg-muted)]">{t("portfolioPage.unique", { n: p.uniqueVisitors })}</span>
                  )}
                </div>
              ) : (
                <span className="font-mono text-[9px] text-yellow/70">{t("portfolioPage.unpublished")}</span>
              )}
              <span className="font-mono text-[9px] text-[var(--fg-muted)]">{p.updatedAt}</span>
            </div>
          );
        })()}
      </div>
    </Link>
  );
}

/* ─── Main page ─────────────────────────────────────────────── */

export default function PortfolioPage() {
  const router = useRouter();
  const { t } = useT();
  const { data, isLoading } = api.portfolio.list.useQuery();

  const portfolios = (data ?? []).map(dbToView);
  const published = portfolios.filter((p) => p.status === "published").length;
  const drafts    = portfolios.filter((p) => p.status === "draft").length;

  function goNew() { router.push("/dashboard/portfolio/new"); }

  return (
    <div className="p-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-sans font-black text-[var(--fg)] text-xl">{t("portfolioPage.title")}</h1>
          <p className="font-mono text-xs text-[var(--fg-muted)] mt-0.5">
            {isLoading ? (
              <span>{t("portfolioPage.loading")}</span>
            ) : (
              <>
                <span className="text-green-400">{t("portfolioPage.published", { n: published })}</span>
                {drafts > 0 && <> · <span>{drafts === 1 ? t("portfolioPage.draftOne") : t("portfolioPage.draftsMany", { n: drafts })}</span></>}
                <> · <span>{t("portfolioPage.total", { n: portfolios.length })}</span></>
              </>
            )}
          </p>
        </div>
      </div>

      {/* ── Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <PortfolioCardSkeleton key={i} />
          ))}
        </div>
      ) : portfolios.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center mb-4 text-[var(--fg-muted)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
          </div>
          <p className="font-sans font-semibold text-[var(--fg)] mb-1">{t("portfolioPage.emptyTitle")}</p>
          <p className="font-serif text-sm text-[var(--fg-muted)] mb-5">{t("portfolioPage.emptyBody")}</p>
          <button onClick={goNew} className="btn-primary px-5 py-2.5 rounded-xl font-sans font-bold text-sm">
            {t("portfolioPage.create")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NewPortfolioTile onClick={goNew} />
          {portfolios.map((p) => <PortfolioCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
