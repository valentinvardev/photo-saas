"use client";

import { useState } from "react";

/* ── Avatar upload placeholder ── */
function AvatarUpload() {
  return (
    <div className="relative group w-24 h-24 shrink-0">
      <div className="w-24 h-24 rounded-full bg-yellow flex items-center justify-center ring-4 ring-[var(--border)]">
        <span className="font-sans font-black text-[#111] text-3xl">S</span>
      </div>
      <button className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
      </button>
    </div>
  );
}

/* ── Section wrapper ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--border)]">
        <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">{title}</h2>
      </div>
      <div className="px-6 py-5 flex flex-col gap-5">{children}</div>
    </div>
  );
}

/* ── Field ── */
function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-sans text-xs font-semibold text-[var(--fg-secondary)] mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1.5 font-sans text-[11px] text-[var(--fg-muted)]">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow/60 focus:ring-1 focus:ring-yellow/20 transition placeholder:text-[var(--fg-muted)]";

const SOCIALS = [
  { key: "instagram", label: "Instagram", placeholder: "@username" },
  { key: "twitter",   label: "X / Twitter", placeholder: "@username" },
  { key: "website",   label: "Website", placeholder: "https://yoursite.com" },
  { key: "behance",   label: "Behance", placeholder: "behance.net/username" },
];

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

      {/* ── Identity ── */}
      <Section title="Public profile">
        {/* Avatar row */}
        <div className="flex items-center gap-5">
          <AvatarUpload />
          <div>
            <p className="font-sans text-sm font-medium text-[var(--fg)]">Profile photo</p>
            <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">JPG, PNG or WebP · max 4 MB</p>
            <div className="flex gap-2 mt-3">
              <button className="font-sans text-xs font-semibold bg-yellow text-[#111] px-3 py-1.5 rounded-lg hover:bg-yellow-dark transition-colors">
                Upload photo
              </button>
              <button className="font-sans text-xs font-semibold text-[var(--fg-muted)] border border-[var(--border)] px-3 py-1.5 rounded-lg hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Name row */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name">
            <input className={inputCls} defaultValue="Sofia" />
          </Field>
          <Field label="Last name">
            <input className={inputCls} defaultValue="Chen" />
          </Field>
        </div>

        <Field label="Display name" hint="This is what clients see on your public portfolio.">
          <input className={inputCls} defaultValue="Sofia Chen" />
        </Field>

        <Field label="Bio" hint="Max 200 characters.">
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            defaultValue="Documentary and portrait photographer based in New York. Available for editorial and commercial work."
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Location">
            <input className={inputCls} defaultValue="New York, NY" placeholder="City, Country" />
          </Field>
          <Field label="Specialty">
            <input className={inputCls} defaultValue="Portrait · Documentary" placeholder="e.g. Wedding, Portrait…" />
          </Field>
        </div>
      </Section>

      {/* ── Social links ── */}
      <Section title="Social links">
        {SOCIALS.map((s) => (
          <Field key={s.key} label={s.label}>
            <input className={inputCls} placeholder={s.placeholder} />
          </Field>
        ))}
      </Section>

      {/* ── Plan & stats ── */}
      <Section title="Plan & usage">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sans text-sm font-semibold text-[var(--fg)]">Pro plan</span>
              <span className="inline-flex items-center gap-1 bg-yellow/10 border border-yellow/30 rounded-full px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow" />
                <span className="font-mono text-[9px] text-yellow font-bold uppercase tracking-wider">Active</span>
              </span>
            </div>
            <p className="font-sans text-xs text-[var(--fg-muted)] mt-1">Renews on June 1, 2026 · $12 / month</p>
          </div>
          <button className="font-sans text-xs font-semibold text-[var(--fg-muted)] border border-[var(--border)] px-3 py-1.5 rounded-lg hover:text-[var(--fg)] transition-colors">
            Manage plan
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Storage used", value: "2.4 TB", sub: "of 5 TB" },
            { label: "Portfolio views", value: "1,284", sub: "this month" },
            { label: "Balance",  value: "$124.50", sub: "available" },
          ].map((s) => (
            <div key={s.label} className="bg-[var(--bg-subtle)] rounded-lg px-4 py-3">
              <div className="font-mono text-lg font-semibold text-[var(--fg)]">{s.value}</div>
              <div className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">{s.label}</div>
              <div className="font-mono text-[10px] text-[var(--fg-muted)]">{s.sub}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Save ── */}
      <div className="flex justify-end gap-3">
        <button className="font-sans text-sm text-[var(--fg-muted)] border border-[var(--border)] px-4 py-2 rounded-lg hover:text-[var(--fg)] transition-colors">
          Discard
        </button>
        <button
          onClick={handleSave}
          className={`font-sans text-sm font-semibold px-5 py-2 rounded-lg transition-all ${
            saved
              ? "bg-green-500 text-white"
              : "bg-yellow text-[#111] hover:bg-yellow-dark"
          }`}
        >
          {saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>

    </div>
  );
}
