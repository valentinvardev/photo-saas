"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { createClient } from "~/lib/supabase/client";
import { useT } from "~/components/providers/LangProvider";

/* ── Plan tier badge ── */
const TIER_CONFIG = {
  bronze: { label: "Bronze", color: "#cd7f32", glow: "#cd7f3240",
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
  silver: { label: "Silver", color: "#a8a8b3", glow: "#a8a8b340",
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
  gold:   { label: "Gold",   color: "#fad502", glow: "#fad50240",
    icon: <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> },
} as const;

type PlanTier = keyof typeof TIER_CONFIG;

function PlanBadge({ tier }: { tier: PlanTier }) {
  const t = TIER_CONFIG[tier];
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border"
      style={{ color: t.color, borderColor: `${t.color}40`, background: t.glow }}
    >
      {t.icon}
      {t.label}
    </span>
  );
}

/* ── Icons ── */
function Ico({ d, sw = 1.6 }: { d: React.ReactNode; sw?: number }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
  );
}
const I = {
  upload:    <Ico d={<><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>} />,
  folder:    <Ico d={<path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>} />,
  portfolio: <Ico d={<><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a14 14 0 014 9 14 14 0 01-4 9 14 14 0 01-4-9 14 14 0 014-9z"/></>} />,
  links:     <Ico d={<><rect x="3" y="4" width="18" height="4" rx="2"/><rect x="3" y="10" width="18" height="4" rx="2"/><rect x="3" y="16" width="18" height="4" rx="2"/></>} />,
  delivery:  <Ico d={<><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></>} />,
  domain:    <Ico d={<><circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3a14 14 0 014 9 14 14 0 01-4 9 14 14 0 01-4-9 14 14 0 014-9z"/></>} />,
  templates: <Ico d={<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="11" width="7" height="9" rx="1"/><rect x="3" y="13" width="7" height="8" rx="1"/></>} />,
  arrow:     <Ico d={<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 5 20 12 13 19"/></>} />,
  plus:      <Ico d={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} sw={2} />,
  sparkle:   <Ico d={<><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z"/></>} />,
  bolt:      <Ico d={<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>} />,
  check:     <Ico d={<polyline points="20 6 9 17 4 12"/>} sw={2.2} />,
  search:    <Ico d={<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>} />,
  bell:      <Ico d={<><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>} />,
  chat:      <Ico d={<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>} />,
};

/* ── Reusable bits ── */
function SectionLabel({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="font-sans text-base font-semibold text-[var(--fg)]">{title}</h2>
        {hint && <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

function ActionCard({
  href, icon, eyebrow, title, body, cta, status,
}: {
  href: string; icon: React.ReactNode; eyebrow?: string; title: string; body: string; cta: string;
  status?: { dot: "green" | "yellow" | "muted"; label: string };
}) {
  const dotClass = status?.dot === "green" ? "bg-emerald-500" : status?.dot === "yellow" ? "bg-yellow" : "bg-[var(--fg-muted)]";
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:border-[var(--fg-muted)] transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--fg)]">
          {icon}
        </div>
        {status && (
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--fg-muted)]">
            <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
            {status.label}
          </span>
        )}
      </div>
      <div>
        {eyebrow && (
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--fg-muted)] mb-1.5">{eyebrow}</div>
        )}
        <div className="font-sans text-base font-semibold text-[var(--fg)]">{title}</div>
        <p className="font-sans text-xs text-[var(--fg-muted)] mt-1 leading-relaxed">{body}</p>
      </div>
      <div className="mt-auto inline-flex items-center gap-2 font-sans text-xs font-semibold text-[var(--fg)] group-hover:gap-3 transition-all">
        {cta}
        <span className="text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors">{I.arrow}</span>
      </div>
    </Link>
  );
}

function MiniAction({ href, icon, label, sub }: { href: string; icon: React.ReactNode; label: string; sub?: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg hover:border-[var(--fg-muted)] hover:bg-[var(--bg-subtle)] transition-all"
    >
      <span className="w-8 h-8 rounded-md bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--fg)] shrink-0">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-sans text-sm font-medium text-[var(--fg)] truncate">{label}</div>
        {sub && <div className="font-sans text-[11px] text-[var(--fg-muted)] truncate">{sub}</div>}
      </div>
      <span className="text-[var(--fg-muted)]">{I.arrow}</span>
    </Link>
  );
}

export default function DashboardHomePage() {
  const { t } = useT();
  const [firstName, setFirstName] = useState<string>("");
  const { data: portfolios } = api.portfolio.list.useQuery();
  const portfolioProjects = portfolios?.length ?? 0;

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      const meta = (data.user?.user_metadata ?? {}) as { full_name?: string; name?: string };
      const name = meta.full_name ?? meta.name ?? data.user?.email?.split("@")[0] ?? "";
      setFirstName(name.split(" ")[0] ?? "");
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

      {/* ── Greeting ──────────────────────────────────────────────────── */}
      <section>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[var(--fg)] tracking-tight">
          {t("home.welcome")}{firstName ? <>, <span className="text-[var(--fg)]">{firstName}</span></> : ""}.
        </h1>
      </section>

      {/* ── Web presence ──────────────────────────────────────────────── */}
      <section>
        <SectionLabel
          title={t("home.webPresence")}
          hint={t("home.webPresenceHint")}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActionCard
            href="/dashboard/portfolio"
            icon={I.portfolio}
            eyebrow={t("home.portfolioEyebrow")}
            title={t("home.organizeTitle")}
            body={t("home.organizeBody", { n: portfolioProjects })}
            cta={t("home.managePortfolio")}
            status={{ dot: "green", label: t("home.live") }}
          />
        </div>
      </section>

      {/* ── Gallery quick actions ─────────────────────────────────────── */}
      <section>
        <SectionLabel
          title={t("home.gallery")}
          hint={t("home.galleryHint")}
          action={
            <Link href="/dashboard/gallery" className="font-sans text-xs font-semibold text-[var(--fg-muted)] hover:text-[var(--fg)] inline-flex items-center gap-1.5 transition-colors">
              {t("home.openGallery")} <span>{I.arrow}</span>
            </Link>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MiniAction href="/dashboard/gallery?upload=1" icon={I.upload} label={t("home.uploadPhotos")} sub={t("home.uploadPhotosSub")} />
          <MiniAction href="/dashboard/gallery?new=folder" icon={I.folder} label={t("home.createFolder")} sub={t("home.createFolderSub")} />
          <MiniAction href="/dashboard/gallery" icon={I.search} label={t("home.browseAll")} sub={t("home.browseAllSub")} />
        </div>
      </section>

      {/* ── Recent activity / quick chips ─────────────────────────────── */}
      <section>
        <SectionLabel
          title={t("home.recentActivity")}
          hint={t("home.recentActivityHint")}
        />
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl divide-y divide-[var(--border-subtle)]">
          {[
            { icon: I.upload,    title: t("home.act1"), time: t("home.act1Time") },
            { icon: I.portfolio, title: t("home.act2"), time: t("home.act2Time") },
            { icon: I.portfolio, title: t("home.act3"), time: t("home.act3Time") },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[var(--bg-subtle)] text-[var(--fg-muted)]">
                {row.icon}
              </span>
              <div className="flex-1 min-w-0 font-sans text-sm text-[var(--fg)] truncate">{row.title}</div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-muted)] shrink-0">{row.time}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
