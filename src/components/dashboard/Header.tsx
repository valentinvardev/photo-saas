"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "~/lib/supabase/client";
import { api } from "~/trpc/react";
import { useTheme } from "~/components/providers/ThemeProvider";
import { useT } from "~/components/providers/LangProvider";
import { LOCALES, type Locale } from "~/lib/i18n";
import { useCart } from "~/lib/cart";
import { CartPanel } from "~/components/dashboard/CartPanel";
import { DevicePreviewModal } from "~/components/dashboard/DevicePreviewModal";
import { OnboardingFlow } from "~/components/onboarding/OnboardingFlow";

/* ── Language tester ────────────────────────────────────── */
function LangTester() {
  const { locale, setLocale, t } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const PREVIEW_KEYS = [
    { key: "nav.gallery",   section: "Nav" },
    { key: "nav.portfolio", section: "Nav" },
    { key: "nav.delivery",  section: "Nav" },
    { key: "common.save",   section: "Common" },
    { key: "common.cancel", section: "Common" },
    { key: "gallery.title", section: "Gallery" },
  ];

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        title="Language"
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors font-mono text-[10px] font-bold uppercase tracking-widest ${open ? "bg-yellow/10 text-yellow" : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]"}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
        </svg>
        {locale.toUpperCase()}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden z-50"
          >
            {/* Locale switcher */}
            <div className="px-3 py-2.5 border-b border-[var(--border)]">
              <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] mb-2">Language</p>
              <div className="flex gap-1.5">
                {LOCALES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => { setLocale(l.id as Locale); }}
                    className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-lg border transition-all ${
                      locale === l.id
                        ? "border-yellow bg-yellow/10 text-yellow"
                        : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)]"
                    }`}
                  >
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest">{l.id}</span>
                    <span className="font-sans text-[9px] leading-none">{l.native}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live string preview */}
            <div className="px-3 py-2.5">
              <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] mb-2">Preview</p>
              <div className="space-y-1.5">
                {PREVIEW_KEYS.map(({ key, section }) => (
                  <div key={key} className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[9px] text-[var(--fg-muted)] shrink-0">{section}.{key.split(".")[1]}</span>
                    <span className="font-sans text-xs text-[var(--fg)] font-medium truncate text-right">{t(key)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Theme tester ───────────────────────────────────────── */
const CSS_VARS = [
  { key: "--color-yellow", label: "Accent"      },
  { key: "--bg",           label: "Background"  },
  { key: "--bg-card",      label: "Card"        },
  { key: "--bg-subtle",    label: "Subtle bg"   },
  { key: "--fg",           label: "Text"        },
  { key: "--fg-muted",     label: "Muted text"  },
  { key: "--border",       label: "Border"      },
] as const;

type VarKey = typeof CSS_VARS[number]["key"];

function readVars(): Record<VarKey, string> {
  const style = getComputedStyle(document.documentElement);
  const result = {} as Record<VarKey, string>;
  for (const { key } of CSS_VARS) {
    result[key] = style.getPropertyValue(key).trim() || "#000000";
  }
  return result;
}

function ThemeTester() {
  const { theme } = useTheme();
  const [open, setOpen]     = useState(false);
  const [colors, setColors] = useState<Record<VarKey, string>>({} as Record<VarKey, string>);
  const ref = useRef<HTMLDivElement>(null);

  /* Read current values when panel opens */
  useEffect(() => {
    if (open) setColors(readVars());
  }, [open]);

  /* Close on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleChange(key: VarKey, value: string) {
    document.documentElement.style.setProperty(key, value);
    setColors((prev) => ({ ...prev, [key]: value }));
  }

  function reset() {
    CSS_VARS.forEach(({ key }) => document.documentElement.style.removeProperty(key));
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    setColors(readVars());
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        title="Theme variables"
        className={`p-2 rounded-lg transition-colors ${open ? "bg-yellow/10 text-yellow" : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]"}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/>
          <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/>
          <circle cx="8.5"  cy="7.5"  r="0.5" fill="currentColor"/>
          <circle cx="6.5"  cy="12.5" r="0.5" fill="currentColor"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 6, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-full bottom-0 mr-2 w-72 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-lg overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
              <p className="font-sans text-xs font-semibold text-[var(--fg)]">CSS variables</p>
              <button
                onClick={reset}
                className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="px-4 py-3 flex flex-col gap-3">
              {CSS_VARS.map(({ key, label }) => {
                const val = colors[key] ?? "#000000";
                /* Ensure it's a valid 6-digit hex for input[type=color] */
                const hex = /^#[0-9a-fA-F]{6}$/.test(val) ? val : "#000000";
                return (
                  <div key={key} className="flex items-center gap-3">
                    {/* Swatch — clicking opens native color picker */}
                    <label className="relative w-7 h-7 rounded-md border border-[var(--border)] cursor-pointer shrink-0 overflow-hidden" style={{ background: val }}>
                      <input
                        type="color"
                        value={hex}
                        onChange={(e) => handleChange(key, e.target.value)}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                    </label>

                    {/* Label + var name */}
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-xs font-medium text-[var(--fg)] leading-none">{label}</p>
                      <p className="font-mono text-[9px] text-[var(--fg-muted)] mt-0.5">{key}</p>
                    </div>

                    {/* Hex input */}
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => {
                        const v = e.target.value;
                        setColors((prev) => ({ ...prev, [key]: v }));
                        if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                          document.documentElement.style.setProperty(key, v);
                        }
                      }}
                      maxLength={7}
                      className="font-mono text-[11px] text-[var(--fg)] bg-[var(--bg-subtle)] border border-[var(--border)] rounded-md px-2 py-1 w-20 outline-none focus:border-yellow/60 transition-colors"
                    />
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Icons ─────────────────────────────────────────────── */
function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function ChevronDown() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

/* ── Search data ─────────────────────────────────────────── */

type Tpl = { id: string; name: string; type: "Portfolio" | "Links" | "Delivery"; subtitle: string; tags: string[]; href: string; accent: string; bg: string; fg: string; mono: string; display: string; displayItalic?: boolean; displayWeight?: number };

// MVP scope: only portfolio templates surface in the command palette. The
// links & delivery template demos still exist under /template/* but are hidden.
const TEMPLATES_INDEX: Tpl[] = [
  { id: "halcyon-portfolio",  name: "Halcyon",  type: "Portfolio", subtitle: "Editorial warm dark",     tags: ["editorial","warm","italic"],   href: "/template/halcyon",          accent: "#C2410C", bg: "#0E0D0B", fg: "#EFEAE0", mono: "'Geist Mono'",      display: "'Instrument Serif'",    displayItalic: true,  displayWeight: 400 },
  { id: "brooklyn-portfolio", name: "Brooklyn", type: "Portfolio", subtitle: "Urban dark + red",        tags: ["dark","urban","bold"],         href: "/template/brooklyn",         accent: "#E8382C", bg: "#0D0D0D", fg: "#F0EFE9", mono: "'Space Mono'",      display: "'DM Serif Display'",    displayItalic: true,  displayWeight: 400 },
  { id: "monolith-portfolio", name: "Monolith", type: "Portfolio", subtitle: "Sans-first brutal modern", tags: ["grid","bold","sans"],         href: "/template/monolith",         accent: "#FF4015", bg: "#F5F4F1", fg: "#0A0A0A", mono: "'Geist Mono'",      display: "'Bricolage Grotesque'", displayWeight: 800 },
  { id: "atlas-portfolio",    name: "Atlas",    type: "Portfolio", subtitle: "Cobalt cream cursor index", tags: ["editorial","cobalt"],        href: "/template/atlas",            accent: "#2235FF", bg: "#EFEAE0", fg: "#0E0E0E", mono: "'Geist Mono'",      display: "'Bricolage Grotesque'", displayItalic: true,  displayWeight: 500 },
  { id: "vault-portfolio",    name: "Vault",    type: "Portfolio", subtitle: "Paper archive book",      tags: ["magazine","archive","paper"],  href: "/template/vault",            accent: "#A8462E", bg: "#F4F0E6", fg: "#1A1714", mono: "'JetBrains Mono'",  display: "'Anton'",               displayWeight: 400 },
];

type Person = { id: string; name: string; role: string; location: string; mutual?: number; href: string; tone: string };
const PEOPLE_INDEX: Person[] = [
  { id: "lior",     name: "Lior Avni",      role: "Photographer · Halcyon",      location: "Lisbon",          mutual: 12, href: "#", tone: "#C2410C" },
  { id: "yara",     name: "Yara Sokol",     role: "Director · Studio Monolith",  location: "Berlin",          mutual: 8,  href: "#", tone: "#FF4015" },
  { id: "felix",    name: "Felix Marchand", role: "Founder · Atlas Studio",      location: "Paris / Lisbon",  mutual: 3,  href: "#", tone: "#2235FF" },
  { id: "ines",     name: "Ines Aurelio",   role: "Photographer · Vault",        location: "Lisbon / Paris",  mutual: 5,  href: "#", tone: "#A8462E" },
  { id: "kira",     name: "Kira Ostrowski", role: "Brooklyn Red collective",     location: "New York",        mutual: 18, href: "#", tone: "#E8382C" },
  { id: "margot",   name: "Margot & Auden", role: "Wedding clients",             location: "Alenquer, PT",    mutual: 0,  href: "#", tone: "#7A7A7A" },
  { id: "emma",     name: "Emma K.",        role: "Portrait commission",         location: "Lisbon",          mutual: 0,  href: "#", tone: "#7A7A7A" },
  { id: "morrison", name: "Morrison Photo", role: "Album cover client",          location: "London",          mutual: 0,  href: "#", tone: "#E8382C" },
];

/* Per-action icon — drives the navigate panel so each row reads at a glance. */
const NAV_ICONS: Record<string, React.ReactNode> = {
  "qa-home":      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10"/></svg>,
  "qa-gallery":   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  "qa-portfolio": <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  "qa-templates": <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="11" width="7" height="9" rx="1"/><rect x="3" y="13" width="7" height="8" rx="1"/></svg>,
  "qa-delivery":  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>,
  "qa-links":     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="4" rx="2"/><rect x="3" y="10" width="18" height="4" rx="2"/><rect x="3" y="16" width="18" height="4" rx="2"/></svg>,
  "qa-domain":    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  "qa-settings":  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  "qa-profile":   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  "qa-new-del":   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16h6m-3-3v6"/><path d="M21 12V8.4a2 2 0 00-2-2h-4l-2-2H6a2 2 0 00-2 2v10.6a2 2 0 002 2h6"/></svg>,
  "qa-upload":    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  "qa-new-port":  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16h6m-3-3v6"/><circle cx="11" cy="11" r="8"/><line x1="3" y1="11" x2="19" y2="11"/></svg>,
};

type QuickAction = { id: string; label: string; sub: string; href: string; kbd?: string; group: "Workspace" | "Create" };
// MVP scope: portfolio + gallery only. Templates/Delivery/Links/Domain actions
// are hidden (their routes redirect — see next.config.js).
const QUICK_ACTIONS: QuickAction[] = [
  { id: "qa-home",       label: "Home",          sub: "Dashboard overview",      href: "/dashboard",           kbd: "G H", group: "Workspace" },
  { id: "qa-gallery",    label: "Gallery",       sub: "All photos & folders",    href: "/dashboard/gallery",   kbd: "G G", group: "Workspace" },
  { id: "qa-portfolio",  label: "Portfolio",     sub: "Manage your sites",       href: "/dashboard/portfolio", kbd: "G P", group: "Workspace" },
  { id: "qa-settings",   label: "Settings",      sub: "Account & preferences",   href: "/dashboard/settings",          group: "Workspace" },
  { id: "qa-profile",    label: "Profile",       sub: "Your public profile",     href: "/dashboard/profile",           group: "Workspace" },
  { id: "qa-upload",     label: "Upload photos", sub: "Add to your gallery",     href: "/dashboard/gallery",   kbd: "U",   group: "Create"    },
  { id: "qa-new-port",   label: "New portfolio", sub: "Start a fresh site",      href: "/dashboard/portfolio", kbd: "N P", group: "Create"    },
];

const TEMPLATE_TYPES = ["All", "Portfolio"] as const;
type TplFilter = (typeof TEMPLATE_TYPES)[number];
type SearchTab = "templates" | "social" | "navigate";

const SEARCH_TABS: { id: SearchTab; label: string; sub: string; icon: React.ReactNode }[] = [
  { id: "templates", label: "Templates", sub: "Portfolios, links, delivery",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="11" width="7" height="9" rx="1"/><rect x="3" y="13" width="7" height="8" rx="1"/></svg> },
  { id: "social",    label: "Social",    sub: "People & studios",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { id: "navigate",  label: "Navigate",  sub: "Pages & quick actions",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><polyline points="3 12 9 12 11 9 13 15 15 12 21 12"/></svg> },
];

/* ── Page title map ─────────────────────────────────────── */
const PAGE_TITLES: Record<string, string> = {
  "/dashboard":           "Home",
  "/dashboard/gallery":   "Gallery",
  "/dashboard/portfolio": "Portfolio",
  "/dashboard/delivery":  "Client delivery",
  "/dashboard/links":     "Link builder",
  "/dashboard/templates": "Templates",
  "/dashboard/sales":     "Sales",
  "/dashboard/clients":   "Clients",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings":  "Settings",
  "/dashboard/profile":   "Profile",
};

/* ── Current signed-in user ───────────────────────────────
   Reads the DB profile (api.user.me) so the header reflects edits made on
   the /profile page (name + avatar), not the stale Supabase auth metadata. */
function useCurrentUser() {
  const { data } = api.user.me.useQuery(undefined, { staleTime: 60_000 });
  if (!data) return null;
  const name = data.name?.trim() || data.email.split("@")[0] || "Account";
  return {
    name,
    email:     data.email,
    initial:   (name.trim()[0] ?? "?").toUpperCase(),
    avatarUrl: data.avatarUrl ?? null,
  };
}

/* ── Profile dropdown ───────────────────────────────────── */
function ProfileDropdown({ onClose }: { onClose: () => void }) {
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const user = useCurrentUser();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    onClose();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="absolute top-full right-0 mt-2 w-56 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-lg)] z-50">
      {/* User info */}
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <div className="font-sans text-sm font-semibold text-[var(--fg)] truncate">{user?.name ?? "—"}</div>
        <div className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5 truncate">{user?.email ?? ""}</div>
      </div>

      {/* Links */}
      <div className="py-1">
        <Link
          href="/dashboard/profile"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
        >
          <UserIcon />
          <span className="font-sans">View profile</span>
        </Link>
        <Link
          href="/dashboard/settings"
          onClick={onClose}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
        >
          <SettingsIcon />
          <span className="font-sans">Settings</span>
        </Link>
        <button
          onClick={toggle}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          <span className="font-sans">{theme === "dark" ? "Light mode" : "Dark mode"}</span>
        </button>
        {/* Color palette (moved from the top bar) */}
        <div className="flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--fg-muted)]">
          <ThemeTester />
          <span className="font-sans">Theme colors</span>
        </div>
      </div>

      <div className="border-t border-[var(--border)] py-1">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/5 transition-colors"
        >
          <LogoutIcon />
          <span className="font-sans">Sign out</span>
        </button>
      </div>
    </div>
  );
}

/* ── Chat icon ──────────────────────────────────────────── */
function ChatIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

/* ── Main header ────────────────────────────────────────── */
export function DashboardHeader({ onMenuClick, onChatClick, chatOpen }: { onMenuClick?: () => void; onChatClick?: () => void; chatOpen?: boolean }) {
  const pathname = usePathname();
  const { theme } = useTheme();

  const { items: cartItems, open: cartOpen, setOpen: setCartOpen } = useCart();

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [onbOpen,       setOnbOpen]       = useState(false);

  const searchRef  = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [searchTab, setSearchTab] = useState<SearchTab>("templates");
  const [tplFilter, setTplFilter] = useState<TplFilter>("All");
  const [tplDetail, setTplDetail] = useState<Tpl | null>(null);
  const [tplPreview, setTplPreview] = useState<Tpl | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const closeAll = () => { setSearchOpen(false); setSearchQuery(""); setTplDetail(null); };

  function openSearch() {
    if (inputRef.current) {
      const r = inputRef.current.getBoundingClientRect();
      setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height });
    }
    setSearchOpen(true);
  }
  const tabIndex = searchTab === "templates" ? 0 : searchTab === "social" ? 1 : 2;

  /* Filter each interface by the shared query — case-insensitive. */
  const q = searchQuery.trim().toLowerCase();
  const tplMatches = TEMPLATES_INDEX.filter(
    (t) =>
      (tplFilter === "All" || t.type === tplFilter) &&
      (!q || t.name.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q) || t.tags.some((x) => x.includes(q))),
  );
  const peopleMatches = PEOPLE_INDEX.filter(
    (p) => !q || p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q) || p.location.toLowerCase().includes(q),
  );
  const actionMatches = QUICK_ACTIONS.filter(
    (a) => !q || a.label.toLowerCase().includes(q) || a.sub.toLowerCase().includes(q),
  );
  const tabCounts = { templates: tplMatches.length, social: peopleMatches.length, navigate: actionMatches.length };

  const title   = PAGE_TITLES[pathname] ?? "Dashboard";
  const user    = useCurrentUser();

  /* close the profile dropdown on outside click. The search modal is
     fixed-positioned and handles its own backdrop click — we'd close it
     on every click inside the modal if we used a ref test here. */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Esc closes the search panel */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  return (
    <header className="h-14 shrink-0 flex items-center gap-1 sm:gap-3 px-2 sm:px-4 border-b border-[var(--border)] bg-[var(--bg-card)]">

      {/* Mobile hamburger */}
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 -ml-1 rounded-md text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors shrink-0"
          aria-label="Open menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      )}

      {/* Page title — desktop */}
      <h1 className="hidden lg:block font-sans font-semibold text-[var(--fg)] text-sm shrink-0">{title}</h1>

      {/* Universal search */}
      <div ref={searchRef} className={`relative flex-1 min-w-0 max-w-none sm:max-w-xs transition-all duration-200 ${searchFocused ? "sm:max-w-sm" : ""}`}>
        <span className="absolute left-2 sm:left-2.5 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] pointer-events-none">
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          placeholder="Search anything"
          onFocus={() => { setSearchFocused(true); openSearch(); }}
          onBlur={() => setSearchFocused(false)}
          onChange={(e) => { setSearchQuery(e.target.value); if (!searchOpen) openSearch(); }}
          className="w-full pl-7 sm:pl-8 pr-2 sm:pr-3 py-1.5 text-xs font-sans bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg text-[var(--fg)] placeholder:text-[var(--fg-muted)] outline-none focus:border-yellow/60 focus:ring-1 focus:ring-yellow/20 transition-all"
        />
        <kbd className="hidden sm:block absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[9px] text-[var(--fg-muted)] bg-[var(--bg-card)] border border-[var(--border)] px-1 py-0.5 rounded pointer-events-none">
          ⌘K
        </kbd>

      </div>

      {/* Universal search overlay — full-page backdrop blur, three interfaces */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            key="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center pt-16 sm:pt-24 px-4"
            style={{
              background: "color-mix(in srgb, var(--bg) 55%, transparent)",
              backdropFilter: "blur(20px) saturate(140%)",
              WebkitBackdropFilter: "blur(20px) saturate(140%)",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) closeAll(); }}
          >
            {/* Modal card — animation springs from the search bar's screen coordinates */}
            <motion.div
              initial={origin
                ? { opacity: 0, x: origin.x - (typeof window !== "undefined" ? window.innerWidth / 2 : 0), y: origin.y - (typeof window !== "undefined" ? Math.min(window.innerHeight * 0.78, 720) / 2 : 0) - (typeof window !== "undefined" && window.innerWidth >= 640 ? 96 : 64), scale: origin.h / 360, transformOrigin: "top center" }
                : { opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={origin
                ? { opacity: 0, x: origin.x - (typeof window !== "undefined" ? window.innerWidth / 2 : 0), y: origin.y - (typeof window !== "undefined" ? Math.min(window.innerHeight * 0.78, 720) / 2 : 0) - (typeof window !== "undefined" && window.innerWidth >= 640 ? 96 : 64), scale: origin.h / 360, transformOrigin: "top center" }
                : { opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-3xl rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col"
              style={{
                background: "color-mix(in srgb, var(--bg-card) 92%, transparent)",
                maxHeight: "min(78vh, 720px)",
              }}
            >
            {/* Search input — autofocused inside the modal */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--fg-muted)]"><SearchIcon /></span>
              <input
                autoFocus
                type="text"
                value={searchQuery}
                placeholder="Search anything"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm font-sans text-[var(--fg)] placeholder:text-[var(--fg-muted)] outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">Clear</button>
              )}
              <kbd className="font-mono text-[9px] text-[var(--fg-muted)] bg-[var(--bg-subtle)] border border-[var(--border)] px-1.5 py-0.5 rounded">esc</kbd>
              <button
                onClick={closeAll}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
                aria-label="Close"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Tab strip */}
            <div className="flex items-stretch border-b border-[var(--border-subtle)]">
              {SEARCH_TABS.map((tab) => {
                const active = searchTab === tab.id;
                const count = tabCounts[tab.id];
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSearchTab(tab.id)}
                    className={`flex-1 flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${active ? "border-yellow text-[var(--fg)]" : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]"}`}
                  >
                    <span className={active ? "text-yellow" : "text-[var(--fg-muted)]"}>{tab.icon}</span>
                    <span className="font-sans text-xs font-semibold">{tab.label}</span>
                    <span className={`shrink-0 font-mono text-[9px] px-1.5 py-0.5 rounded ${active ? "bg-yellow/15 text-yellow" : "bg-[var(--bg-subtle)] text-[var(--fg-muted)]"}`}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            {/* Three sliding panels — one per interface, joined as a single track */}
            <div className="flex-1 overflow-hidden">
              <motion.div
                className="flex h-full"
                style={{ width: "300%" }}
                animate={{ x: `${-tabIndex * (100 / 3)}%` }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* ── Templates panel ───────────────────────────── */}
                <div className="w-1/3 h-full overflow-y-auto">
                  {tplDetail ? (
                    /* Detail view — shown when a template card is selected */
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-subtle)]">
                        <button
                          onClick={() => setTplDetail(null)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-subtle)] hover:border-[var(--fg-muted)] hover:bg-[var(--bg-card)] transition-colors font-mono text-[10px] uppercase tracking-widest text-[var(--fg)]"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                          Back to templates
                        </button>
                      </div>
                      {/* Big brand specimen */}
                      <div
                        className="relative flex flex-col items-center justify-center px-6 py-10 border-b border-[var(--border-subtle)]"
                        style={{ background: tplDetail.bg, color: tplDetail.fg }}
                      >
                        <span
                          className="absolute top-3 left-3 px-1.5 py-0.5 rounded font-mono text-[9px] uppercase tracking-widest"
                          style={{ background: tplDetail.accent, color: "#fff" }}
                        >
                          {tplDetail.type}
                        </span>
                        <span
                          style={{
                            fontFamily: tplDetail.display,
                            fontStyle: tplDetail.displayItalic ? "italic" : "normal",
                            fontWeight: tplDetail.displayWeight ?? 500,
                            fontSize: 64,
                            letterSpacing: (tplDetail.displayWeight ?? 500) >= 700 ? "-0.04em" : "-0.02em",
                            lineHeight: 1,
                            textTransform: tplDetail.display.includes("Anton") ? "uppercase" : "none",
                          }}
                        >
                          {tplDetail.name}<span style={{ color: tplDetail.accent }}>.</span>
                        </span>
                        <span
                          className="mt-3 font-mono text-[10px] uppercase tracking-widest"
                          style={{ color: tplDetail.fg, opacity: 0.6 }}
                        >
                          {tplDetail.subtitle}
                        </span>
                      </div>
                      {/* Meta + actions */}
                      <div className="px-4 py-4 space-y-4">
                        <div>
                          <div className="font-sans text-base font-bold text-[var(--fg)]">{tplDetail.name} {tplDetail.type}</div>
                          <p className="font-sans text-xs text-[var(--fg-muted)] leading-relaxed mt-1">
                            {tplDetail.subtitle}. A coherent {tplDetail.type.toLowerCase()} interface drawn from the {tplDetail.name} collection — share a single visual identity across your portfolio, links page and delivery galleries.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {tplDetail.tags.map((tag) => (
                            <span key={tag} className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-[var(--bg-subtle)] text-[var(--fg-muted)]">{tag}</span>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-0 border border-[var(--border)] rounded-md overflow-hidden">
                          <div className="px-3 py-2 border-r border-[var(--border)]">
                            <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)]">Display</div>
                            <div className="font-sans text-xs text-[var(--fg)] truncate" style={{ fontFamily: tplDetail.display }}>{tplDetail.display.replace(/['"]/g, "").split(",")[0]}</div>
                          </div>
                          <div className="px-3 py-2 border-r border-[var(--border)]">
                            <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)]">Mono</div>
                            <div className="font-sans text-xs text-[var(--fg)] truncate" style={{ fontFamily: tplDetail.mono }}>{tplDetail.mono.replace(/['"]/g, "").split(",")[0]}</div>
                          </div>
                          <div className="px-3 py-2 flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-sm" style={{ background: tplDetail.accent }} />
                            <span className="font-mono text-[10px] text-[var(--fg-muted)]">{tplDetail.accent}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setTplPreview(tplDetail)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--fg-muted)] font-sans text-xs font-medium text-[var(--fg)] transition-colors"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            Preview
                          </button>
                          <Link
                            href={tplDetail.href}
                            onClick={closeAll}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-sans text-xs font-bold bg-yellow text-[#111] hover:bg-yellow/90 transition-colors"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Use template
                          </Link>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Grid view */
                    <div className="p-4">
                      <div className="flex flex-wrap items-center gap-1 mb-3">
                        {TEMPLATE_TYPES.map((f) => (
                          <button
                            key={f}
                            onClick={() => setTplFilter(f)}
                            className={`font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md transition-colors ${tplFilter === f ? "bg-[var(--fg)] text-[var(--bg)]" : "bg-[var(--bg-subtle)] text-[var(--fg-muted)] hover:text-[var(--fg)]"}`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                      {tplMatches.length === 0 ? (
                        <div className="px-2 py-12 text-center font-sans text-xs text-[var(--fg-muted)]">No templates match &ldquo;{searchQuery}&rdquo;</div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {tplMatches.map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setTplDetail(t)}
                              className="group block rounded-lg overflow-hidden border border-[var(--border)] hover:border-[var(--fg-muted)] transition-all text-left"
                            >
                              <div
                                className="relative h-32 flex items-center justify-center px-3"
                                style={{ background: t.bg, color: t.fg }}
                              >
                                <span
                                  style={{
                                    fontFamily: t.display,
                                    fontStyle: t.displayItalic ? "italic" : "normal",
                                    fontWeight: t.displayWeight ?? 500,
                                    fontSize: 36,
                                    letterSpacing: (t.displayWeight ?? 500) >= 700 ? "-0.04em" : "-0.02em",
                                    lineHeight: 1,
                                    textTransform: t.display.includes("Anton") ? "uppercase" : "none",
                                  }}
                                >
                                  {t.name}<span style={{ color: t.accent }}>.</span>
                                </span>
                                <span
                                  className="absolute top-2 left-2 px-1.5 py-0.5 rounded font-mono text-[9px] uppercase tracking-widest"
                                  style={{ background: t.accent, color: "#fff" }}
                                >
                                  {t.type}
                                </span>
                              </div>
                              <div className="px-3 py-2.5 bg-[var(--bg-card)]">
                                <div className="font-sans text-xs font-semibold text-[var(--fg)] truncate">{t.name} {t.type}</div>
                                <div className="font-mono text-[10px] text-[var(--fg-muted)] truncate mt-0.5">{t.subtitle}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ── Social panel ─────────────────────────────── */}
                <div className="w-1/3 h-full overflow-y-auto p-4">
                  {peopleMatches.length === 0 ? (
                    <div className="px-2 py-12 text-center font-sans text-xs text-[var(--fg-muted)]">No people match &ldquo;{searchQuery}&rdquo;</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {peopleMatches.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={closeAll}
                          className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] hover:border-[var(--fg-muted)] transition-colors text-left"
                        >
                          <span
                            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-sans text-xs font-bold"
                            style={{ background: p.tone + "22", color: p.tone, border: `1px solid ${p.tone}40` }}
                          >
                            {p.name.split(" ").map((s) => s.charAt(0)).slice(0, 2).join("")}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-sans text-xs font-semibold text-[var(--fg)] truncate">{p.name}</div>
                            <div className="font-mono text-[10px] text-[var(--fg-muted)] truncate">{p.role}</div>
                            <div className="flex items-center gap-2 mt-1 font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)]">
                              <span>{p.location}</span>
                              {p.mutual && p.mutual > 0 ? <><span>·</span><span>{p.mutual} mutual</span></> : null}
                            </div>
                          </div>
                          <span className="flex flex-col gap-1.5 shrink-0">
                            <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md bg-yellow text-[#111]">
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <line x1="19" y1="8" x2="19" y2="14"/>
                                <line x1="22" y1="11" x2="16" y2="11"/>
                              </svg>
                              Connect
                            </span>
                            <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-md border border-[var(--border)] text-[var(--fg-muted)]">
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                              Message
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Navigate panel ───────────────────────────── */}
                <div className="w-1/3 h-full overflow-y-auto p-2">
                  {actionMatches.length === 0 ? (
                    <div className="px-2 py-12 text-center font-sans text-xs text-[var(--fg-muted)]">No pages match &ldquo;{searchQuery}&rdquo;</div>
                  ) : (
                    (["Workspace", "Create"] as const).map((g) => {
                      const items = actionMatches.filter((a) => a.group === g);
                      if (items.length === 0) return null;
                      return (
                        <div key={g} className="py-1.5">
                          <div className="px-3 pt-2 pb-1 font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)]">{g}</div>
                          {items.map((a) => (
                            <Link
                              key={a.id}
                              href={a.href}
                              onClick={closeAll}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[var(--bg-subtle)] transition-colors"
                            >
                              <span className="shrink-0 w-8 h-8 rounded-md bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--fg-muted)] flex items-center justify-center">
                                {NAV_ICONS[a.id] ?? (
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><polyline points="3 12 9 12 11 9 13 15 15 12 21 12"/></svg>
                                )}
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className="block font-sans text-xs font-semibold text-[var(--fg)] truncate">{a.label}</span>
                                <span className="block font-mono text-[10px] text-[var(--fg-muted)] truncate">{a.sub}</span>
                              </span>
                              {a.kbd && (
                                <span className="shrink-0 flex gap-1">
                                  {a.kbd.split(" ").map((k, i) => (
                                    <kbd key={i} className="font-mono text-[9px] text-[var(--fg-muted)] bg-[var(--bg-subtle)] border border-[var(--border)] px-1.5 py-0.5 rounded">{k}</kbd>
                                  ))}
                                </span>
                              )}
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 text-[var(--fg-muted)]"><path d="M9 18l6-6-6-6"/></svg>
                            </Link>
                          ))}
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>

            {/* Foot strip */}
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-[var(--border-subtle)] font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)]">
              <span className="flex items-center gap-2">
                <kbd className="bg-[var(--bg-subtle)] border border-[var(--border)] px-1 py-0.5 rounded">↵</kbd> open
                <span className="opacity-50">·</span>
                <kbd className="bg-[var(--bg-subtle)] border border-[var(--border)] px-1 py-0.5 rounded">esc</kbd> close
              </span>
              <span>Universal search</span>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Device-framed preview lightbox — opens from the template detail view */}
      <AnimatePresence>
        {tplPreview && (
          <DevicePreviewModal
            url={tplPreview.href}
            title={`${tplPreview.name} ${tplPreview.type}`}
            subtitle={tplPreview.subtitle}
            accentChip={
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-sm" style={{ background: tplPreview.accent }} />
                {tplPreview.name}
              </span>
            }
            onClose={() => setTplPreview(null)}
          />
        )}
      </AnimatePresence>

      {/* Onboarding flow (launched from the Setup test button) */}
      <OnboardingFlow open={onbOpen} onClose={() => setOnbOpen(false)} />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Onboarding — test button */}
      <button
        onClick={() => setOnbOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors shrink-0"
        aria-label="Onboarding"
        title="Onboarding"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z"/></svg>
        <span className="hidden sm:block font-sans text-xs font-medium">Setup</span>
      </button>

      {/* Language */}
      <LangTester />

      {/* Cart — only visible when there's something in it */}
      {cartItems.length > 0 && (
        <button
          onClick={() => setCartOpen(!cartOpen)}
          className={`relative p-2 rounded-lg transition-colors ${cartOpen ? "bg-yellow/10 text-yellow" : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]"}`}
          aria-label="Cart"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.99-1.78L23 6H6"/>
          </svg>
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-yellow rounded-full flex items-center justify-center ring-2 ring-[var(--bg-card)]">
            <span className="font-mono text-[8px] font-bold text-[#111] leading-none">{cartItems.length}</span>
          </span>
        </button>
      )}

      {/* Community chat */}
      <button
        onClick={onChatClick}
        className={`relative flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors shrink-0 ${chatOpen ? "bg-yellow/10 text-yellow" : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]"}`}
        aria-label="Community chat"
      >
        <span className="relative">
          <ChatIcon />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full ring-2 ring-[var(--bg-card)]" />
        </span>
        <span className="hidden sm:block font-sans text-xs font-medium">Chat</span>
      </button>

      {/* Profile avatar */}
      <div ref={profileRef} className="relative shrink-0">
        <button
          onClick={() => setProfileOpen((p) => !p)}
          className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors"
          aria-label="Profile menu"
        >
          <div className="w-7 h-7 rounded-full bg-yellow flex items-center justify-center shrink-0 overflow-hidden">
            {user?.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="font-sans font-black text-[#111] text-[10px]">{user?.initial ?? "?"}</span>
            )}
          </div>
          <span className="hidden md:block font-sans text-xs font-semibold text-[var(--fg)]">{user?.name?.split(" ")[0] ?? ""}</span>
          <span className="hidden md:block text-[var(--fg-muted)]"><ChevronDown /></span>
        </button>
        {profileOpen && <ProfileDropdown onClose={() => setProfileOpen(false)} />}
      </div>

    </header>
  );
}

