"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

/* ─────────────────────────────────────────────
   MOCKUP 1 — Portfolio Builder
───────────────────────────────────────────── */
const portfolioPhotos = [
  { col: "col-span-2", row: "row-span-1", delay: 0 },
  { col: "col-span-1", row: "row-span-2", delay: 0.12 },
  { col: "col-span-1", row: "row-span-1", delay: 0.22 },
  { col: "col-span-1", row: "row-span-1", delay: 0.32 },
  { col: "col-span-1", row: "row-span-1", delay: 0.42 },
];

function PortfolioMockup({ inView }: { inView: boolean }) {
  const [layout, setLayout] = useState<"grid" | "masonry">("grid");

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => {
      setLayout((l) => (l === "grid" ? "masonry" : "grid"));
    }, 3500);
    return () => clearInterval(t);
  }, [inView]);

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-xl"
      style={{
        background: "var(--mockup-bg)",
        border: "1px solid var(--mockup-border)",
      }}
    >
      {/* Chrome */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{
          background: "var(--mockup-chrome)",
          borderBottom: "1px solid var(--mockup-divider)",
        }}
      >
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div
          className="flex-1 mx-2 rounded-full px-2 py-0.5 text-[10px] font-mono text-center"
          style={{
            background: "var(--mockup-surface)",
            color: "var(--mockup-text-muted)",
          }}
        >
          sofia-chen.frame.co
        </div>
        {/* Layout switcher */}
        <div className="flex gap-1">
          <button
            onClick={() => setLayout("grid")}
            className={`p-1 rounded transition-colors ${layout === "grid" ? "text-yellow" : "opacity-30"}`}
            style={{ color: layout === "grid" ? "#fad502" : "var(--mockup-text)" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="0" y="0" width="5" height="5" rx="1" />
              <rect x="7" y="0" width="5" height="5" rx="1" />
              <rect x="0" y="7" width="5" height="5" rx="1" />
              <rect x="7" y="7" width="5" height="5" rx="1" />
            </svg>
          </button>
          <button
            onClick={() => setLayout("masonry")}
            className="p-1 rounded transition-colors"
            style={{ color: layout === "masonry" ? "#fad502" : "var(--mockup-text-muted)" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="0" y="0" width="5" height="8" rx="1" />
              <rect x="7" y="0" width="5" height="5" rx="1" />
              <rect x="7" y="7" width="5" height="5" rx="1" />
              <rect x="0" y="10" width="5" height="2" rx="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-3 flex items-baseline justify-between">
          <span
            className="font-sans font-black text-base tracking-wide uppercase"
            style={{ color: "var(--mockup-text)" }}
          >
            SOFIA CHEN
          </span>
          <span className="font-mono text-[10px] text-yellow tracking-widest">// Portfolio</span>
        </div>

        <motion.div
          className="grid gap-2"
          style={{
            gridTemplateColumns: layout === "grid" ? "repeat(3, 1fr)" : "repeat(2, 1fr)",
          }}
          animate={{ gridTemplateColumns: layout === "grid" ? "repeat(3, 1fr)" : "repeat(2, 1fr)" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {portfolioPhotos.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: p.delay + 0.3, duration: 0.4 }}
              className={`${layout === "masonry" && i === 0 ? "row-span-2" : ""} rounded-lg overflow-hidden relative`}
              style={{
                height: layout === "grid" ? (i === 0 ? 70 : 48) : i === 0 ? 100 : 48,
                background: i % 2 === 0 ? "var(--mockup-photo-a)" : "var(--mockup-photo-b)",
                transition: "height 0.4s ease",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://picsum.photos/seed/${(i + 1) * 7}/400/300?grayscale`}
                className="absolute inset-0 w-full h-full object-cover"
                alt=""
                loading="lazy"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MOCKUP 2 — Sell Your Work
───────────────────────────────────────────── */
function SalesMockup({ inView }: { inView: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const sequence = async () => {
      await delay(800);
      setStep(1);
      await delay(600);
      setStep(2);
      await delay(1200);
      setStep(3);
      await delay(2000);
      setStep(0);
    };
    const t = setInterval(() => void sequence(), 5000);
    void sequence();
    return () => clearInterval(t);
  }, [inView]);

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-xl"
      style={{
        background: "var(--mockup-bg)",
        border: "1px solid var(--mockup-border)",
      }}
    >
      {/* Product image */}
      <div
        className="h-40 relative overflow-hidden"
        style={{ background: "var(--mockup-photo-a)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/42/600/320?grayscale"
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-3/4 h-3/4 rounded-lg opacity-40"
            style={{
              background:
                "radial-gradient(ellipse at 40% 35%, rgba(255,255,255,0.3) 0%, transparent 60%)",
            }}
          />
        </div>
        {/* Price badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
          className="absolute top-3 right-3 bg-yellow rounded-lg px-2.5 py-1.5"
        >
          <span className="font-mono font-black text-[#111] text-sm">$299</span>
        </motion.div>
        {/* Format badge */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="absolute bottom-3 left-3 backdrop-blur-sm rounded-md px-2 py-1"
          style={{ background: "rgba(0,0,0,0.45)" }}
        >
          <span className="font-mono text-[10px] text-white/70">RAW + JPEG · Full Res</span>
        </motion.div>
      </div>

      {/* Card content */}
      <div className="p-4">
        <div
          className="mb-1 font-sans font-bold text-sm"
          style={{ color: "var(--mockup-text)" }}
        >
          Golden Hour, Patagonia
        </div>
        <div
          className="mb-4 font-mono text-[10px]"
          style={{ color: "var(--mockup-text-muted)" }}
        >
          Commercial License · Unlimited use
        </div>

        {/* Buy button */}
        <motion.button
          animate={{
            backgroundColor:
              step === 0 ? "#fad502"
              : step === 1 ? "#e0bd00"
              : step === 2 ? "#2a2a2a"
              : "#16a34a",
          }}
          transition={{ duration: 0.3 }}
          className="w-full rounded-xl py-2.5 font-sans font-bold text-sm overflow-hidden"
          style={{ color: step <= 1 ? "#111" : "#fff", cursor: "default" }}
        >
          <motion.span
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-center gap-2"
          >
            {step === 0 && "Purchase License"}
            {step === 1 && "Purchase License →"}
            {step === 2 && (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin-slow" />
                Processing…
              </>
            )}
            {step === 3 && (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                License Delivered
              </>
            )}
          </motion.span>
        </motion.button>

        {/* Revenue ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-3 flex items-center justify-between"
        >
          <span
            className="font-mono text-[10px]"
            style={{ color: "var(--mockup-text-muted)" }}
          >
            This month
          </span>
          <span className="font-mono text-[11px] font-bold text-yellow">$4,820</span>
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MOCKUP 3 — Cloud Storage
───────────────────────────────────────────── */
const files = [
  { name: "DSC_0847.RAW", size: "24.3 MB", type: "raw", delay: 0.1 },
  { name: "Portrait_01.TIFF", size: "18.1 MB", type: "tiff", delay: 0.2 },
  { name: "Landscape.JPEG", size: "8.4 MB", type: "jpeg", delay: 0.3 },
  { name: "Wedding_final.RAW", size: "31.2 MB", type: "raw", delay: 0.4 },
];

function StorageMockup({ inView }: { inView: boolean }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const cycle = async () => {
      await delay(1200);
      setUploading(true);
      const start = Date.now();
      const duration = 3000;
      const tick = setInterval(() => {
        const elapsed = Date.now() - start;
        const p = Math.min(100, (elapsed / duration) * 100);
        setProgress(Math.round(p));
        if (p >= 100) {
          clearInterval(tick);
          setTimeout(() => {
            setUploading(false);
            setProgress(0);
          }, 800);
        }
      }, 50);
    };
    const t = setInterval(() => void cycle(), 5500);
    void cycle();
    return () => clearInterval(t);
  }, [inView]);

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-xl"
      style={{
        background: "var(--mockup-bg)",
        border: "1px solid var(--mockup-border)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: "var(--mockup-chrome)",
          borderBottom: "1px solid var(--mockup-divider)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 text-yellow">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span
            className="font-sans font-semibold text-xs"
            style={{ color: "var(--mockup-text)" }}
          >
            Cloud Storage
          </span>
        </div>
        <div className="flex gap-1">
          {["RAW", "TIFF", "JPEG"].map((f) => (
            <span
              key={f}
              className="font-mono text-[9px] px-1.5 py-0.5 rounded"
              style={{
                border: "1px solid var(--mockup-border)",
                color: "var(--mockup-text-muted)",
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Storage gauge */}
      <div
        className="px-4 py-3"
        style={{ borderBottom: "1px solid var(--mockup-divider)" }}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="font-mono text-[10px]"
            style={{ color: "var(--mockup-text-muted)" }}
          >
            Used storage
          </span>
          <span
            className="font-mono text-[10px] font-bold"
            style={{ color: "var(--mockup-text)" }}
          >
            2.4 TB / 5 TB
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--mockup-surface)" }}
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={inView ? { width: "48%" } : {}}
            transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #fad502, #c9ab00)" }}
          />
        </div>
      </div>

      {/* File list */}
      <div className="p-4 space-y-2">
        {files.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: f.delay + 0.4, duration: 0.35 }}
            className="flex items-center justify-between py-1.5 last:border-0"
            style={{ borderBottom: "1px solid var(--mockup-divider)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-[8px] font-mono font-black"
                style={{
                  background:
                    f.type === "raw"
                      ? "rgba(250,213,2,0.15)"
                      : "var(--mockup-surface)",
                  color: f.type === "raw" ? "#fad502" : "var(--mockup-text-muted)",
                }}
              >
                {f.type.toUpperCase()}
              </div>
              <span
                className="font-mono text-[10px]"
                style={{ color: "var(--mockup-text-muted)" }}
              >
                {f.name}
              </span>
            </div>
            <span
              className="font-mono text-[10px]"
              style={{ color: "var(--mockup-text-muted)", opacity: 0.6 }}
            >
              {f.size}
            </span>
          </motion.div>
        ))}

        {/* Upload progress */}
        {uploading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-2"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                className="font-mono text-[10px]"
                style={{ color: "var(--mockup-text-muted)" }}
              >
                Uploading DSC_1204.RAW…
              </span>
              <span className="font-mono text-[10px] text-yellow">{progress}%</span>
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: "var(--mockup-surface)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #fad502, #c9ab00)",
                }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MOCKUP 4 — Client Delivery
───────────────────────────────────────────── */
const galleryPhotos = [0, 1, 2, 3, 4, 5];

function DeliveryMockup({ inView }: { inView: boolean }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const run = async () => {
      await delay(500);
      for (let i = 0; i < 4; i++) {
        await delay(400);
        setSelected((s) => new Set([...s, i]));
      }
      await delay(800);
      setSent(true);
      await delay(2500);
      setSelected(new Set());
      setSent(false);
    };
    const t = setInterval(() => void run(), 7000);
    void run();
    return () => clearInterval(t);
  }, [inView]);

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-xl"
      style={{
        background: "var(--mockup-bg)",
        border: "1px solid var(--mockup-border)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3"
        style={{
          background: "var(--mockup-chrome)",
          borderBottom: "1px solid var(--mockup-divider)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div
              className="font-sans font-bold text-xs"
              style={{ color: "var(--mockup-text)" }}
            >
              Chen & Park Wedding
            </div>
            <div
              className="font-mono text-[10px] mt-0.5"
              style={{ color: "var(--mockup-text-muted)" }}
            >
              847 photos · Client gallery
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 font-mono text-[10px]"
            style={{ color: "var(--mockup-text-muted)" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-yellow animate-pulse" />
            Active
          </div>
        </div>
      </div>

      {/* Photo grid */}
      <div className="p-4 grid grid-cols-3 gap-2">
        {galleryPhotos.map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: i * 0.08 + 0.3, duration: 0.35 }}
            className="relative rounded-lg overflow-hidden cursor-pointer"
            style={{
              aspectRatio: "4/3",
              background: i % 2 === 0 ? "var(--mockup-photo-a)" : "var(--mockup-photo-b)",
              border: selected.has(i) ? "2px solid #fad502" : "2px solid transparent",
              boxShadow: selected.has(i) ? "0 0 0 1px rgba(250,213,2,0.2)" : "none",
              transition: "border-color 0.25s ease, box-shadow 0.25s ease",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://picsum.photos/seed/${(i + 1) * 13}/300/225?grayscale`}
              className="absolute inset-0 w-full h-full object-cover"
              alt=""
              loading="lazy"
            />
            {selected.has(i) && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="absolute top-1.5 right-1.5 w-4 h-4 bg-yellow rounded-full flex items-center justify-center"
              >
                <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#111" strokeWidth="2.5">
                  <path d="M2 6l3 3 5-5" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span
            className="font-mono text-[10px]"
            style={{ color: "var(--mockup-text-muted)" }}
          >
            {selected.size} selected · {847 - selected.size} remaining
          </span>
          <span className="font-mono text-[10px] text-yellow">
            {selected.size > 0 ? `${selected.size} ✓` : "Select to approve"}
          </span>
        </div>

        <motion.button
          animate={{
            backgroundColor: sent ? "#16a34a" : "#fad502",
            scale: sent ? [1, 1.04, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
          className="w-full rounded-xl py-2.5 font-sans font-bold text-xs"
          style={{ color: sent ? "#fff" : "#111", cursor: "default" }}
        >
          {sent ? (
            <span className="flex items-center justify-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Gallery Sent to Client
            </span>
          ) : (
            "Send Gallery →"
          )}
        </motion.button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Feature rows config
───────────────────────────────────────────── */
const features = [
  {
    tag: "01 · Portfolio",
    title: "Craft your\nvisual identity.",
    body: "Build stunning portfolio websites with zero code. Choose from layouts designed specifically for photographers — galleries, masonry, editorial, and more.",
    bullets: ["Custom domains", "SEO optimized", "Mobile perfect", "Dark & light themes"],
  },
  {
    tag: "02 · E-Commerce",
    title: "Turn every\nshot into income.",
    body: "Sell prints, digital files, and commercial licenses directly from your portfolio. Zero commission. Set your prices, keep everything.",
    bullets: ["Print fulfillment", "Digital delivery", "License templates", "Stripe integration"],
  },
  {
    tag: "03 · Storage",
    title: "Your archive,\nalways protected.",
    body: "Store your entire library in the cloud — RAW, TIFF, JPEG, DNG. Organize with smart folders, tags, and metadata. Access anywhere.",
    bullets: ["RAW + TIFF support", "Smart organization", "Version history", "Unlimited upload"],
  },
  {
    tag: "04 · Delivery",
    title: "Client galleries\nthey'll love.",
    body: "Send interactive galleries with selection tools, download links, and approval workflows. Make the delivery experience as premium as your work.",
    bullets: ["Password protection", "Selection workflow", "Download control", "Watermark on proof"],
  },
];

const Mockups = [PortfolioMockup, SalesMockup, StorageMockup, DeliveryMockup];

/* ─────────────────────────────────────────────
   Section
───────────────────────────────────────────── */
export function Features() {
  return (
    <section id="features" className="py-32 bg-[var(--bg)]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-yellow" />
            <span className="font-mono text-xs text-[var(--fg-muted)] tracking-[0.2em] uppercase">
              Everything you need
            </span>
            <div className="h-px w-8 bg-yellow" />
          </div>
          <h2
            className="font-sans font-black text-[var(--fg)] leading-tight"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            One platform.
            <br />
            <span className="title-yellow font-serif">Every tool.</span>
          </h2>
        </motion.div>

        {/* Feature rows */}
        <div className="space-y-32">
          {features.map((feat, i) => {
            const isEven = i % 2 === 0;
            const MockupComponent = Mockups[i]!;
            return (
              <FeatureRow
                key={i}
                feat={feat}
                isEven={isEven}
                MockupComponent={MockupComponent}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeatureRow({
  feat,
  isEven,
  MockupComponent,
}: {
  feat: (typeof features)[0];
  isEven: boolean;
  MockupComponent: (p: { inView: boolean }) => React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <div
      ref={ref}
      className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${
        isEven ? "" : "lg:flex-row-reverse"
      }`}
    >
      {/* Text side */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -30 : 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 max-w-lg"
      >
        <div className="font-mono text-xs tracking-[0.2em] uppercase mb-4">
          <span className="yellow-label">{feat.tag}</span>
        </div>
        <h3
          className="font-sans font-black text-[var(--fg)] leading-tight mb-6 whitespace-pre-line"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
        >
          {feat.title}
        </h3>
        <p className="font-serif text-[var(--fg-secondary)] text-lg leading-relaxed mb-8">
          {feat.body}
        </p>
        <ul className="space-y-2">
          {feat.bullets.map((b) => (
            <li key={b} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border border-yellow/40 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow" />
              </div>
              <span className="font-sans text-sm text-[var(--fg-secondary)]">{b}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Mockup side */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 30 : -30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 w-full max-w-md"
      >
        <div className="relative">
          <div className="absolute -inset-6 bg-yellow/5 rounded-3xl blur-2xl" />
          <div className="relative">
            <MockupComponent inView={inView} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* helper */
function delay(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
