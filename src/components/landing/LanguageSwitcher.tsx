"use client";

import { useState, useRef, useEffect } from "react";
import { useT } from "~/components/providers/LangProvider";
import { LOCALES } from "~/lib/i18n";

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18" />
    </svg>
  );
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Language"
        className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-all duration-200"
      >
        <GlobeIcon />
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wide">{locale}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 min-w-[150px] rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-lg)] overflow-hidden z-50 py-1">
          {LOCALES.map((l) => {
            const active = l.id === locale;
            return (
              <button
                key={l.id}
                onClick={() => { setLocale(l.id); setOpen(false); }}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-left text-sm font-sans transition-colors ${active ? "text-[var(--fg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]"}`}
              >
                <span>{l.native}</span>
                {active && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FAD502" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
