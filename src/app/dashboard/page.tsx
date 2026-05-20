"use client";

import Link from "next/link";
import { useState } from "react";

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
  /* Mock state — wire to real data later. */
  const [hasDomain] = useState(false);
  const fullName = "Sofia Chen";
  const domainPreview = fullName.toLowerCase().replace(/\s+/g, "") + ".com";

  const pendingDeliveries = 2;
  const portfolioProjects = 5;
  const linksPageLive     = false;
  const photosPending     = 47;

  const next = {
    title: `${photosPending} photos waiting to be delivered`,
    sub: "Margot & Auden — wedding gallery, draft from Tuesday",
    href: "/dashboard/delivery",
    cta: "Open delivery",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

      {/* ── Greeting ──────────────────────────────────────────────────── */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-yellow">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow" />Pro plan
          </span>
        </div>
        <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[var(--fg)] tracking-tight">
          Welcome back, <span className="text-[var(--fg)]">Sofia</span>.
        </h1>
      </section>

      {/* ── Web presence ──────────────────────────────────────────────── */}
      <section>
        <SectionLabel
          title="Your web presence"
          hint="Everything clients see — keep it current."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionCard
            href="/dashboard/portfolio"
            icon={I.portfolio}
            eyebrow="Portfolio"
            title="Organize your portfolio"
            body={`${portfolioProjects} projects · arrange covers, edit copy, swap photos.`}
            cta="Manage portfolio"
            status={{ dot: "green", label: "Live" }}
          />
          <ActionCard
            href="/dashboard/links"
            icon={I.links}
            eyebrow="Links page"
            title={linksPageLive ? "Update your links page" : "Create a links page"}
            body="One short URL with everything — Instagram, bookings, latest gallery."
            cta={linksPageLive ? "Open editor" : "Create page"}
            status={linksPageLive ? { dot: "green", label: "Live" } : { dot: "muted", label: "Not set up" }}
          />
          <ActionCard
            href="/dashboard/delivery"
            icon={I.delivery}
            eyebrow="Delivery"
            title="Deliver photos to clients"
            body={`${pendingDeliveries} galleries pending · branded, password-protected.`}
            cta="Open delivery"
            status={{ dot: "yellow", label: `${pendingDeliveries} pending` }}
          />
        </div>
      </section>

      {/* ── Domain ────────────────────────────────────────────────────── */}
      <section>
        <SectionLabel
          title="Your domain"
          hint={hasDomain ? "Manage DNS, redirects, and certificates." : "Claim a custom address — looks more professional."}
        />
        <Link
          href="/dashboard/domain"
          className="group block p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:border-[var(--fg-muted)] transition-all"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--fg-muted)] mb-1.5">
                {hasDomain ? "Connected" : "Suggested address"}
              </div>
              <div className="font-mono text-2xl text-[var(--fg)] tracking-tight">
                {domainPreview}
              </div>
              <div className="font-sans text-xs text-[var(--fg-muted)] mt-2 max-w-md">
                {hasDomain
                  ? "Domain is connected. SSL auto-renews. Manage records, redirects and email forwarding."
                  : "Available · $12/year · auto-SSL, custom email forwarding, full DNS control."}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--fg)] text-[var(--bg)] rounded-lg font-sans text-sm font-semibold group-hover:opacity-90 transition-opacity">
                {hasDomain ? "Manage domain" : "Get this domain"}
                <span>{I.arrow}</span>
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* ── Gallery quick actions ─────────────────────────────────────── */}
      <section>
        <SectionLabel
          title="Gallery"
          hint="Upload, organize, and search your photos."
          action={
            <Link href="/dashboard/gallery" className="font-sans text-xs font-semibold text-[var(--fg-muted)] hover:text-[var(--fg)] inline-flex items-center gap-1.5 transition-colors">
              Open gallery <span>{I.arrow}</span>
            </Link>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MiniAction href="/dashboard/gallery?upload=1" icon={I.upload} label="Upload photos" sub="Drag & drop or pick files" />
          <MiniAction href="/dashboard/gallery?new=folder" icon={I.folder} label="Create folder" sub="Group a session or shoot" />
          <MiniAction href="/dashboard/gallery" icon={I.search} label="Browse all photos" sub="1,284 photos · 23 folders" />
        </div>
      </section>

      {/* ── Visual identity ───────────────────────────────────────────── */}
      <section>
        <SectionLabel
          title="Define your visual identity"
          hint="Templates wire your photos into a website in minutes."
          action={
            <Link href="/dashboard/templates" className="font-sans text-xs font-semibold text-[var(--fg-muted)] hover:text-[var(--fg)] inline-flex items-center gap-1.5 transition-colors">
              All templates <span>{I.arrow}</span>
            </Link>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ActionCard
            href="/dashboard/templates"
            icon={I.templates}
            eyebrow="Templates"
            title="Browse templates"
            body="Editorial, minimal, bold. Filter by mood, swap with one click."
            cta="Open library"
          />
          <ActionCard
            href="/dashboard/templates?quickstart=1"
            icon={I.sparkle}
            eyebrow="Quick start"
            title="Find my style in 2 minutes"
            body="Answer a few questions and we'll suggest three templates that fit."
            cta="Start quiz"
          />
        </div>
      </section>

      {/* ── Recent activity / quick chips ─────────────────────────────── */}
      <section>
        <SectionLabel
          title="Recent activity"
          hint="What's happened across your account."
        />
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl divide-y divide-[var(--border-subtle)]">
          {[
            { icon: I.delivery,  title: "Margot & Auden — gallery viewed",  time: "12m ago",   tone: "muted" as const },
            { icon: I.upload,    title: "47 photos uploaded to 'Coastal'",  time: "2h ago",    tone: "muted" as const },
            { icon: I.bell,      title: "New sale — Portrait license $120", time: "Yesterday", tone: "yellow" as const },
            { icon: I.portfolio, title: "Portfolio viewed from Berlin",     time: "Yesterday", tone: "muted" as const },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${row.tone === "yellow" ? "bg-yellow/10 text-yellow" : "bg-[var(--bg-subtle)] text-[var(--fg-muted)]"}`}>
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
