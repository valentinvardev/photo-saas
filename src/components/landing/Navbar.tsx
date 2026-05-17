"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useTheme } from "~/components/providers/ThemeProvider";
import { Logo } from "~/components/ui/Logo";

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.85]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0 backdrop-blur-md"
        style={{
          backgroundColor: theme === "dark"
            ? `rgba(17,17,17,${bgOpacity.get()})`
            : `rgba(255,255,255,${bgOpacity.get()})`,
          borderBottom: `1px solid rgba(128,128,128,${borderOpacity.get() * 0.15})`,
        }}
      />

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center group" aria-label="Portapic home">
          <Logo height={28} priority />
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-sans text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-all duration-200"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <Link
            href="#pricing"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm font-sans font-medium text-[var(--fg)] hover:border-[var(--fg-muted)] transition-all duration-200"
          >
            Log in
          </Link>

          <Link
            href="#pricing"
            className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-sans font-semibold animate-pulse-yellow"
          >
            Start free
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
