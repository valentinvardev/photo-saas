"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ── Cover photo ── */
function CoverUpload() {
  return (
    <div className="relative group h-36 sm:h-44 overflow-hidden bg-[var(--bg-subtle)] rounded-xl border border-[var(--border)] cursor-pointer">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://picsum.photos/seed/sofiacover/1400/400?grayscale"
        alt=""
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
        <span className="flex items-center gap-2 font-sans text-xs font-semibold text-white bg-black/50 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
          Change cover
        </span>
      </div>

      {/* Avatar — overlapping bottom */}
      <div className="absolute bottom-0 left-6 translate-y-1/2">
        <div className="relative group/avatar w-16 h-16 rounded-full bg-yellow ring-4 ring-[var(--bg-card)] flex items-center justify-center shadow-lg cursor-pointer">
          <span className="font-sans font-black text-[#111] text-2xl">S</span>
          <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>
        </div>
      </div>
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
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-sans text-xs font-semibold text-[var(--fg-muted)] mb-1.5">{label}</label>
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

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans font-black text-[var(--fg)] text-xl">Profile</h1>
          <p className="font-mono text-xs text-[var(--fg-muted)] mt-0.5">Your public identity on Portapic</p>
        </div>
        <Link
          href="/p/sofia-chen"
          target="_blank"
          className="flex items-center gap-1.5 font-sans text-xs font-medium text-[var(--fg-muted)] border border-[var(--border)] px-3 py-2 rounded-lg hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          View public profile
        </Link>
      </div>

      {/* ── Cover + avatar ── */}
      <div>
        <CoverUpload />
        {/* Spacer for avatar overlap */}
        <div className="h-10" />
      </div>

      {/* ── Identity ── */}
      <Section title="Public profile">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name">
            <input className={inputCls} defaultValue="Sofia" />
          </Field>
          <Field label="Last name">
            <input className={inputCls} defaultValue="Chen" />
          </Field>
        </div>

        <Field label="Display name" hint="This is what clients see on your public profile.">
          <input className={inputCls} defaultValue="Sofia Chen" />
        </Field>

        <Field label="Username" hint="portapic.app/p/sofia-chen">
          <div className="flex items-center">
            <span className="font-mono text-sm text-[var(--fg-muted)] bg-[var(--bg-subtle)] border border-[var(--border)] border-r-0 px-3 py-2 rounded-l-lg select-none">
              portapic.app/p/
            </span>
            <input
              className="flex-1 font-mono text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-r-lg px-3 py-2 outline-none focus:border-yellow/60 focus:ring-1 focus:ring-yellow/20 transition"
              defaultValue="sofia-chen"
            />
          </div>
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
            { label: "Storage used",    value: "2.4 TB",  sub: "of 5 TB" },
            { label: "Portfolio views", value: "1,284",   sub: "this month" },
            { label: "Balance",         value: "$124.50", sub: "available" },
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
        <AnimatePresence mode="wait">
          <motion.button
            key={saved ? "saved" : "idle"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={handleSave}
            className={`font-sans text-sm font-semibold px-5 py-2 rounded-lg transition-colors ${
              saved ? "bg-green-500 text-white" : "bg-yellow text-[#111] hover:bg-yellow/90"
            }`}
          >
            {saved ? "Saved" : "Save changes"}
          </motion.button>
        </AnimatePresence>
      </div>
    </div>
  );
}
