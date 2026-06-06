"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Feature = { title: string; desc: string };

/**
 * Generic "coming soon" screen for dashboard features that are scoped but not
 * yet built (Link builder, Client delivery). Explains what the feature will do
 * so the sidebar entry leads somewhere meaningful instead of a dead link.
 */
export function ComingSoon({
  icon,
  title,
  tagline,
  features,
}: {
  icon: React.ReactNode;
  title: string;
  tagline: string;
  features: Feature[];
}) {
  return (
    <div className="px-5 sm:px-8 py-8 sm:py-12 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-yellow/10 border border-yellow/30 flex items-center justify-center text-yellow mb-5">
            {icon}
          </div>

          <span className="inline-flex items-center gap-1.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-full px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--fg-muted)]">Coming soon</span>
          </span>

          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[var(--fg)] tracking-tight">{title}</h1>
          <p className="font-sans text-sm sm:text-base text-[var(--fg-muted)] mt-3 max-w-xl leading-relaxed">{tagline}</p>
        </div>

        {/* Planned capabilities */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4"
            >
              <span className="mt-0.5 text-yellow shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <div className="min-w-0">
                <div className="font-sans text-sm font-semibold text-[var(--fg)]">{f.title}</div>
                <div className="font-sans text-xs text-[var(--fg-muted)] mt-1 leading-relaxed">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <p className="font-sans text-xs text-[var(--fg-muted)]">
            We&apos;re building this next. Keep using your portfolio and gallery in the meantime.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-[#111] bg-yellow hover:bg-yellow-dark transition-colors rounded-lg px-4 py-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
