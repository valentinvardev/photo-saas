"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "~/components/providers/ThemeProvider";

/* ── Browser mockup — animated portfolio preview ── */
const photoSlots = [
  { w: "col-span-2", h: "h-28", delay: 0.7 },
  { w: "col-span-1", h: "h-28", delay: 0.85 },
  { w: "col-span-1", h: "h-20", delay: 1.0 },
  { w: "col-span-1", h: "h-20", delay: 1.1 },
  { w: "col-span-1", h: "h-20", delay: 1.2 },
];

function BrowserMockup() {
  const { theme } = useTheme();
  const d = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-xl animate-float-slow"
      style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
    >
      {/* Glow behind browser */}
      <div className="absolute -inset-8 bg-yellow/8 rounded-3xl blur-3xl" />
      <div className="absolute -inset-16 bg-yellow/4 rounded-3xl blur-[60px]" />

      <div
        className="relative rounded-2xl shadow-2xl overflow-hidden"
        style={{
          background: "var(--mockup-bg)",
          border: `1px solid var(--mockup-border)`,
          boxShadow: d
            ? "0 32px 80px rgba(0,0,0,0.6)"
            : "0 32px 80px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {/* Chrome bar */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{
            background: "var(--mockup-chrome)",
            borderBottom: `1px solid var(--mockup-divider)`,
          }}
        >
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1">
            <div
              className="mx-auto max-w-[200px] rounded-full px-3 py-1 text-[11px] font-mono text-center tracking-wide"
              style={{
                background: "var(--mockup-surface)",
                color: "var(--mockup-text-muted)",
              }}
            >
              alexmorgan.frame.co
            </div>
          </div>
          <div className="w-16" />
        </div>

        {/* Portfolio header */}
        <div className="px-5 pt-5 pb-3 flex items-start justify-between">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="font-sans font-black text-xl tracking-wider uppercase"
              style={{ color: "var(--mockup-text)" }}
            >
              ALEX MORGAN
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05, duration: 0.4 }}
              className="font-mono text-[11px] text-yellow tracking-[0.15em] uppercase mt-0.5"
            >
              // Commercial Photography
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.4 }}
            className="flex gap-4 text-[11px] font-sans"
            style={{ color: "var(--mockup-text-muted)" }}
          >
            <span>Work</span>
            <span>About</span>
            <span className="text-yellow">Shop</span>
          </motion.div>
        </div>

        {/* Photo grid */}
        <div className="px-5 pb-5 grid grid-cols-3 gap-2">
          {photoSlots.map((slot, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: slot.delay,
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`${slot.w} ${slot.h} rounded-lg overflow-hidden relative`}
              style={{
                background:
                  i % 2 === 0
                    ? "var(--mockup-photo-a)"
                    : "var(--mockup-photo-b)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://picsum.photos/seed/${(i + 1) * 11}/400/300?grayscale`}
                className="absolute inset-0 w-full h-full object-cover"
                alt=""
                loading="lazy"
              />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    i === 0
                      ? "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.15) 100%)"
                      : i === 2
                        ? "linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.1) 100%)"
                        : "none",
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.4 }}
          className="px-5 py-3 flex items-center justify-between"
          style={{ borderTop: `1px solid var(--mockup-divider)` }}
        >
          <div className="flex gap-4">
            <div
              className="text-[11px] font-mono"
              style={{ color: "var(--mockup-text-muted)" }}
            >
              <span style={{ color: d ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}>
                847
              </span>{" "}
              photos
            </div>
            <div
              className="text-[11px] font-mono"
              style={{ color: "var(--mockup-text-muted)" }}
            >
              <span className="text-yellow">$2,450</span> earned
            </div>
          </div>
          <div
            className="text-[11px] font-mono"
            style={{ color: "var(--mockup-text-muted)" }}
          >
            <span className="w-2 h-2 bg-green-400 rounded-full inline-block mr-1.5" />
            Live
          </div>
        </motion.div>
      </div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: 30 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -right-4 top-12 bg-yellow rounded-xl px-3 py-2 shadow-lg"
      >
        <div className="text-[10px] font-mono text-[#111] font-bold tracking-wider">
          +$349 today
        </div>
      </motion.div>

      {/* Floating delivery notification */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -30 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -left-4 bottom-16 rounded-xl px-3 py-2"
        style={{
          background: "var(--mockup-bg)",
          border: `1px solid var(--mockup-border)`,
          boxShadow: d ? "0 8px 24px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
            style={{ background: "var(--mockup-surface)" }}>
            📦
          </div>
          <div>
            <div
              className="text-[10px] font-sans font-medium"
              style={{ color: "var(--mockup-text)" }}
            >
              Gallery delivered
            </div>
            <div
              className="text-[10px] font-mono"
              style={{ color: "var(--mockup-text-muted)" }}
            >
              Chen & Park Wedding
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Section ── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center grain overflow-hidden bg-[var(--bg-section)]">
      {/* Radial glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-yellow/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-yellow/3 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl w-full px-6 py-32 flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
        {/* Left — copy */}
        <div className="flex-1 max-w-2xl">
          {/* Tag */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-yellow animate-pulse" />
            <span className="font-mono text-[11px] text-[var(--fg-muted)] tracking-wider uppercase">
              // For photographers
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="relative font-sans font-black leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
          >
            {/* "Build." — z-index 2, renders in front of yellow bar */}
            <span
              className="block"
              style={{ position: "relative", zIndex: 2, color: "var(--fg)" }}
            >
              Build.
            </span>

            {/* "Sell." — z-index 1, hosts the yellow highlight background */}
            <span
              className="block"
              style={{ position: "relative", zIndex: 1 }}
            >
              {/*
                inline-block wrapper — constrains the absolute bar
                to exactly the text width, not the full container
              */}
              <span style={{ position: "relative", display: "inline-block" }}>
                {/* Yellow highlight bar — draws left-to-right, no corners */}
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    delay: 1.05,
                    duration: 0.42,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    position: "absolute",
                    top: "-6px",
                    bottom: "-6px",
                    left: "-10px",
                    right: "-10px",
                    background: "#FAD502",
                    borderRadius: 0,
                    zIndex: 0,
                    transformOrigin: "left center",
                  }}
                />
                {/* "Sell." text — above its own highlight */}
                <span className="font-serif" style={{ position: "relative", zIndex: 1, color: "#111111" }}>
                  Sell.
                </span>
              </span>
            </span>

            {/* "Deliver." — z-index 2, renders in front of yellow bar */}
            <span
              className="block"
              style={{ position: "relative", zIndex: 2, color: "var(--fg)" }}
            >
              Deliver.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-8 font-serif text-lg text-[var(--fg-secondary)] leading-relaxed max-w-lg"
          >
            The all-in-one platform built for serious photographers.
            Portfolio, e-commerce, cloud storage, and client galleries —
            all in one place.
          </motion.p>

          {/* Stats row */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-10 flex gap-8"
          >
            {[
              { value: "12k+", label: "photographers" },
              { value: "$2.4M", label: "earned on platform" },
              { value: "99.9%", label: "uptime" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-sans font-black text-[var(--fg)] text-2xl">
                  {s.value}
                </div>
                <div className="font-mono text-[11px] text-[var(--fg-muted)] tracking-wide mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              href="#pricing"
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-sans font-bold text-sm"
            >
              Start for free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-6 py-3.5 font-sans font-medium text-[var(--fg)] text-sm hover:border-[var(--fg-muted)] transition-colors duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
              </svg>
              See how it works
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.p
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-6 font-mono text-xs text-[var(--fg-muted)] tracking-wide"
          >
            No credit card required · Cancel anytime · 14-day free trial
          </motion.p>
        </div>

        {/* Right — browser mockup */}
        <div className="flex-1 flex justify-center w-full max-w-xl">
          <BrowserMockup />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg)] to-transparent" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] text-[var(--fg-muted)] tracking-[0.2em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-6 bg-gradient-to-b from-[var(--fg-muted)] to-transparent"
        />
      </motion.div>
    </section>
  );
}
