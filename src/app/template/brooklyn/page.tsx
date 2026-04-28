"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, animate, AnimatePresence, useAnimationFrame, type Variants } from "framer-motion";

/* ─── tokens ─────────────────────────────────────────────────────────── */
const RED   = "#E8382C";
const BLACK = "#0D0D0D";
const DARK  = "#161616";
const STONE = "#F0EFE9";
const GRAY  = "#7A7A7A";
const DIM   = "#2A2A2A";

/* ─── easing ─────────────────────────────────────────────────────────── */
const SLIDE = [0.76, 0, 0.24, 1] as const;
const ENTER = [0.22, 1, 0.36, 1] as const;

/* ─── data ───────────────────────────────────────────────────────────── */
const SECTIONS = [
  { id: "cover",   label: "HOME",    num: "01" },
  { id: "work",    label: "WORK",    num: "02" },
  { id: "about",   label: "ABOUT",   num: "03" },
  { id: "contact", label: "CONTACT", num: "04" },
] as const;

const PROJECTS = [
  { seed: 10, title: "Sarah & James",       sub: "Wedding · Hudson Valley",    year: "2025", desc: "A golden hour celebration in the rolling hills of upstate New York. Documentary and fine art frames." },
  { seed: 71, title: "Vogue Italia",         sub: "Editorial · Manhattan",       year: "2024", desc: "High-contrast fashion editorial shot across five Manhattan rooftops at dusk." },
  { seed: 82, title: "The Brooklyn Series", sub: "Documentary · Williamsburg",  year: "2024", desc: "A long-form documentary on the changing face of Williamsburg, two years in the making." },
  { seed: 93, title: "Chen Family",         sub: "Portrait · DUMBO",            year: "2025", desc: "Intimate family portraits against the iconic DUMBO waterfront at golden hour." },
];

type Project = typeof PROJECTS[number];


/* ─── variants ───────────────────────────────────────────────────────── */
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};
const staggerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};
const slideUp: Variants = {
  hidden: { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.82, ease: ENTER } },
};
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};
const slideLeft: Variants = {
  hidden: { opacity: 0, x: -52 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.85, ease: ENTER } },
};
const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.95, ease: ENTER } },
};
const growX: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.7, ease: ENTER } },
};
const growY: Variants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 0.7, ease: ENTER } },
};

/* ─── hook ───────────────────────────────────────────────────────────── */
function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768
  );
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

/* ══════════════════════════════════════════════════════════════════════
   HAMBURGER
══════════════════════════════════════════════════════════════════════ */
function HamburgerBtn({ open, onClick, light }: { open: boolean; onClick: () => void; light?: boolean }) {
  const c = light ? "#1A1A1A" : "#FFF";
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}
    >
      <motion.span
        animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0, width: open ? 22 : 22 }}
        transition={{ duration: 0.28, ease: ENTER }}
        style={{ display: "block", width: 22, height: 1.5, background: c, borderRadius: 1, transformOrigin: "center" }}
      />
      <motion.span
        animate={{ opacity: open ? 0 : 1, width: open ? 0 : 14 }}
        transition={{ duration: 0.2 }}
        style={{ display: "block", width: 14, height: 1.5, background: c, borderRadius: 1 }}
      />
      <motion.span
        animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }}
        transition={{ duration: 0.28, ease: ENTER }}
        style={{ display: "block", width: 22, height: 1.5, background: c, borderRadius: 1, transformOrigin: "center" }}
      />
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════════════════════ */
function Sidebar({ open, onClose, current, goTo }: {
  open: boolean; onClose: () => void; current: number; goTo: (i: number) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="sb-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 150, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}
          />
          <motion.div
            key="sb-panel"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.48, ease: ENTER }}
            style={{
              position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 160,
              width: "min(100vw, 440px)", background: RED,
              display: "flex", flexDirection: "column", padding: "32px 44px", overflowY: "auto",
            }}
          >
            {/* close */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 40 }}>
              <button
                onClick={onClose}
                style={{ background: "rgba(0,0,0,0.18)", border: "none", cursor: "pointer", width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {/* logo */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ fontFamily: "var(--bk-serif)", fontStyle: "italic", fontSize: 40, color: "#fff", lineHeight: 1 }}>Morrison</div>
              <div style={{ fontFamily: "var(--bk-mono)", fontSize: 9, color: "rgba(255,255,255,0.65)", letterSpacing: "0.2em", marginTop: 8 }}>PHOTOGRAPHY · BROOKLYN</div>
            </div>

            <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,0.22)", marginBottom: 40 }} />

            {/* nav */}
            <nav style={{ flex: 1 }}>
              {SECTIONS.map((s, i) => (
                <motion.button
                  key={s.id}
                  onClick={() => { goTo(i); onClose(); }}
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.07, duration: 0.45, ease: ENTER }}
                  whileHover={{ x: 10 }}
                  style={{
                    display: "block", width: "100%", background: "none", border: "none",
                    cursor: "pointer", padding: "14px 0", textAlign: "left",
                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <div style={{ fontFamily: "var(--bk-mono)", fontSize: 9, color: "rgba(255,255,255,0.55)", letterSpacing: "0.2em", marginBottom: 4 }}>{s.num}</div>
                  <div style={{
                    fontFamily: "var(--bk-sans)", fontWeight: 700, letterSpacing: "-0.01em",
                    fontSize: "clamp(26px, 5vw, 40px)",
                    color: current === i ? "#fff" : "rgba(255,255,255,0.6)",
                    transition: "color 0.2s",
                  }}>
                    {s.label}
                  </div>
                </motion.button>
              ))}
            </nav>

            {/* socials */}
            <div style={{ marginTop: 40, display: "flex", gap: 18, alignItems: "center" }}>
              <a href="#" aria-label="Instagram" style={{ color: "rgba(255,255,255,0.7)", display: "flex" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>
              </a>
              <a href="#" aria-label="X" style={{ color: "rgba(255,255,255,0.7)", display: "flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <span style={{ fontFamily: "var(--bk-mono)", fontSize: 8, color: "rgba(255,255,255,0.38)", letterSpacing: "0.12em", marginLeft: "auto" }}>NEW YORK · 2026</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   WHATSAPP MODAL
══════════════════════════════════════════════════════════════════════ */
function WhatsAppModal({ onClose }: { onClose: () => void }) {
  const DEFAULT = "Hi Alex! I came across your photography work and I'd love to discuss a potential project. Could we schedule a call?";
  const [msg, setMsg] = useState(DEFAULT);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.38, ease: ENTER }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 460, background: DARK, border: `1px solid ${DIM}`, padding: "32px 36px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "var(--bk-mono)", fontSize: 9, color: "#25D366", letterSpacing: "0.18em", marginBottom: 6 }}>WHATSAPP</div>
            <div style={{ fontFamily: "var(--bk-serif)", fontStyle: "italic", fontSize: 24, color: "#fff" }}>Send a message</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: GRAY }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div style={{ fontFamily: "var(--bk-mono)", fontSize: 9, color: GRAY, letterSpacing: "0.14em", marginBottom: 6 }}>TO</div>
        <div style={{ fontFamily: "var(--bk-mono)", fontSize: 12, color: "#fff", borderBottom: `1px solid ${DIM}`, paddingBottom: 10, marginBottom: 20 }}>
          Alex Morrison · Photography
        </div>

        <div style={{ fontFamily: "var(--bk-mono)", fontSize: 9, color: GRAY, letterSpacing: "0.14em", marginBottom: 8 }}>MESSAGE</div>
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={5}
          style={{
            width: "100%", background: "#1C1C1C", border: `1px solid ${DIM}`, color: "#fff",
            fontFamily: "var(--bk-sans)", fontSize: 14, fontWeight: 300, lineHeight: 1.7,
            padding: "12px 14px", resize: "vertical", outline: "none", boxSizing: "border-box", marginBottom: 20,
          }}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", background: "none", border: `1px solid ${DIM}`, color: GRAY, fontFamily: "var(--bk-mono)", fontSize: 9, letterSpacing: "0.12em", cursor: "pointer" }}>
            CANCEL
          </button>
          <button
            onClick={() => window.open(`https://wa.me/15550000000?text=${encodeURIComponent(msg)}`, "_blank")}
            style={{ flex: 2, padding: "12px", background: "#25D366", border: "none", color: "#fff", fontFamily: "var(--bk-mono)", fontSize: 9, letterSpacing: "0.12em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            OPEN WHATSAPP
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════════════════════════════ */
function Lightbox({ photos, start, onClose }: { photos: string[]; start: number; onClose: () => void }) {
  const [idx, setIdx] = useState(start);
  const total = photos.length;
  const touchStartX = useRef(0);
  const prev = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);
  const next = useCallback(() => setIdx((i) => Math.min(i + 1, total - 1)), [total]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, next, prev]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const t = e.changedTouches[0];
    if (!t) return;
    const dx = touchStartX.current - t.clientX;
    if (Math.abs(dx) > 40) dx > 0 ? next() : prev();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ position: "fixed", inset: 0, zIndex: 500, background: "rgba(0,0,0,0.97)", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      {/* top bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1, borderBottom: `1px solid ${DIM}` }}
      >
        <span style={{ fontFamily: "var(--bk-mono)", fontSize: 8, color: GRAY, letterSpacing: "0.16em" }}>
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: GRAY, display: "flex" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>

      {/* photo */}
      <AnimatePresence mode="wait" custom={0}>
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.22, ease: ENTER }}
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: "88vw", maxHeight: "80dvh", display: "flex" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[idx]} alt="" style={{ maxWidth: "100%", maxHeight: "80dvh", objectFit: "contain", display: "block" }} />
        </motion.div>
      </AnimatePresence>

      {/* prev arrow */}
      {idx > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "background 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
      )}
      {/* next arrow */}
      {idx < total - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.06)", border: "none", cursor: "pointer", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", transition: "background 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.14)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      )}

      {/* progress bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, height: 2, background: RED, width: `${((idx + 1) / total) * 100}%`, transition: "width 0.3s ease" }} />
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   PROJECT DETAIL OVERLAY
══════════════════════════════════════════════════════════════════════ */
function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  const isMobile = useIsMobile();
  const [lbIdx, setLbIdx] = useState<number | null>(null);

  const extraSeeds = [project.seed + 111, project.seed + 222, project.seed + 333];
  const allPhotos = [
    `https://picsum.photos/seed/${project.seed}/1200/1600`,
    ...extraSeeds.map((s) => `https://picsum.photos/seed/${s}/900/1100`),
  ];

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && lbIdx === null) onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, lbIdx]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: "fixed", inset: 0, zIndex: 200, background: BLACK, display: "flex", flexDirection: "column" }}
      >
        {/* topbar */}
        <div style={{ padding: "18px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${DIM}`, flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 9, fontFamily: "var(--bk-mono)", fontSize: 9, color: GRAY, letterSpacing: "0.12em" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            BACK
          </button>
          <div style={{ fontFamily: "var(--bk-mono)", fontSize: 9, color: RED, letterSpacing: "0.16em" }}>
            {project.title.toUpperCase()}
          </div>
        </div>

        {/* content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.6, ease: ENTER }}
          style={{ flex: 1, display: "flex", flexDirection: isMobile ? "column" : "row", overflow: "hidden" }}
        >
          {/* main photo */}
          <div
            onClick={() => setLbIdx(0)}
            style={{ flex: isMobile ? "0 0 260px" : "0 0 56%", overflow: "hidden", position: "relative", cursor: "zoom-in" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={allPhotos[0]} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: RED }} />
            <div style={{ position: "absolute", bottom: 14, right: 14, fontFamily: "var(--bk-mono)", fontSize: 7, color: "rgba(255,255,255,0.5)", letterSpacing: "0.12em", display: "flex", alignItems: "center", gap: 5 }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4-4" /></svg>
              CLICK TO EXPAND
            </div>
          </div>

          {/* info */}
          <div style={{ flex: 1, padding: isMobile ? "24px" : "36px 32px", overflowY: "auto" }}>
            <div style={{ fontFamily: "var(--bk-mono)", fontSize: 9, color: RED, letterSpacing: "0.2em", marginBottom: 12 }}>
              {project.sub} · {project.year}
            </div>
            <h2 style={{ fontFamily: "var(--bk-serif)", fontStyle: "italic", fontSize: "clamp(22px, 3vw, 42px)", color: "#fff", lineHeight: 1.1, marginBottom: 14 }}>
              {project.title}
            </h2>
            <div style={{ width: 32, height: 2, background: RED, marginBottom: 18 }} />
            <p style={{ fontFamily: "var(--bk-sans)", fontSize: 14, fontWeight: 300, color: "#888", lineHeight: 1.8, marginBottom: 28 }}>
              {project.desc}
            </p>

            <div style={{ fontFamily: "var(--bk-mono)", fontSize: 8, color: GRAY, letterSpacing: "0.15em", marginBottom: 10 }}>GALLERY</div>
            {isMobile ? (
              /* mobile: horizontal scrollable row */
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
                {extraSeeds.map((s, i) => (
                  <div key={s} onClick={() => setLbIdx(i + 1)} style={{ flex: "0 0 120px", height: 120, overflow: "hidden", cursor: "zoom-in" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://picsum.photos/seed/${s}/300/300`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            ) : (
              /* desktop: 2-col grid */
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                {extraSeeds.map((s, i) => (
                  <div key={s} onClick={() => setLbIdx(i + 1)} style={{ aspectRatio: "1", overflow: "hidden", cursor: "zoom-in" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`https://picsum.photos/seed/${s}/400/400`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* lightbox — above the detail overlay */}
      <AnimatePresence>
        {lbIdx !== null && (
          <Lightbox key="lb" photos={allPhotos} start={lbIdx} onClose={() => setLbIdx(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   COVER SECTION
══════════════════════════════════════════════════════════════════════ */
function CoverSection({ isActive, onNext }: { isActive: boolean; onNext: () => void }) {
  const isMobile = useIsMobile();
  return (
    <section style={{ height: "100dvh", background: BLACK, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      {/* watermark */}
      <div style={{ position: "absolute", right: -20, bottom: -70, fontFamily: "var(--bk-serif)", fontSize: "clamp(180px, 32vw, 500px)", color: "rgba(255,255,255,0.025)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>BK</div>

      {/* spacer for fixed topbar */}
      <div style={{ height: 64, flexShrink: 0 }} />

      {/* main row */}
      <div style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden", position: "relative", zIndex: 1 }}>

        {/* left — hero content */}
        <motion.div
          variants={stagger} initial="hidden" animate={isActive ? "visible" : "hidden"}
          style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(28px, 5vw, 64px)", minWidth: 0 }}
        >
          <motion.div variants={fadeIn} style={{ fontFamily: "var(--bk-mono)", fontSize: 9, color: RED, letterSpacing: "0.22em", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ display: "inline-block", width: 20, height: 1.5, background: RED }} />
            PHOTOGRAPHY
          </motion.div>

          <motion.div variants={slideUp} style={{ lineHeight: 1, marginBottom: 30 }}>
            <div style={{ fontFamily: "var(--bk-serif)", fontStyle: "italic", fontSize: "clamp(38px, 8vw, 130px)", color: "rgba(255,255,255,0.42)", lineHeight: 1.08 }}>Alex</div>
            <div style={{ fontFamily: "var(--bk-serif)", fontSize: "clamp(44px, 10vw, 158px)", color: "#fff", lineHeight: 0.88 }}>Morrison</div>
          </motion.div>

          <motion.div variants={growX} style={{ width: 80, height: 3.5, background: RED, marginBottom: 24, transformOrigin: "left center" }} />

          <motion.div variants={slideUp} style={{ display: "flex", gap: 20, fontFamily: "var(--bk-mono)", fontSize: 9, color: GRAY, letterSpacing: "0.16em", flexWrap: "wrap" }}>
            <span>DOCUMENTARY</span>
            <span style={{ color: RED }}>·</span>
            <span>PORTRAIT</span>
            <span style={{ color: RED }}>·</span>
            <span>FINE ART</span>
          </motion.div>

          <motion.div variants={fadeIn} style={{ marginTop: 44, display: "flex", alignItems: "center", gap: 8 }}>
            {/* VIEW WORK */}
            <motion.button
              onClick={onNext}
              whileHover={{ borderColor: RED, background: "rgba(232,56,44,0.08)" }}
              whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "var(--bk-sans)", fontSize: 11, fontWeight: 600, color: "#fff", background: "transparent", border: `1px solid ${DIM}`, padding: "13px 24px", cursor: "pointer", letterSpacing: "0.1em", transition: "border-color 0.25s, background 0.25s" }}
            >
              VIEW WORK
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </motion.button>

            {/* WhatsApp */}
            <a href="https://wa.me/15550000000" target="_blank" rel="noreferrer" aria-label="WhatsApp"
              style={{ width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${DIM}`, color: "#25D366", flexShrink: 0, transition: "border-color 0.25s, background 0.25s", cursor: "pointer", textDecoration: "none" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#25D366"; (e.currentTarget as HTMLElement).style.background = "rgba(37,211,102,0.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = DIM; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>

            {/* Instagram */}
            <a href="#" aria-label="Instagram"
              style={{ width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${DIM}`, color: GRAY, flexShrink: 0, transition: "border-color 0.25s, background 0.25s, color 0.25s", cursor: "pointer", textDecoration: "none" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#E1306C"; (e.currentTarget as HTMLElement).style.background = "rgba(225,48,108,0.08)"; (e.currentTarget as HTMLElement).style.color = "#E1306C"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = DIM; (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = GRAY; }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" /></svg>
            </a>
          </motion.div>

          {/* scroll hint — design 1: ghost mono + bouncing chevron */}
          <motion.div variants={fadeIn} style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 10 }}>
            <motion.svg
              animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.9, ease: "easeInOut" }}
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2" strokeLinecap="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </motion.svg>
            <span style={{ fontFamily: "var(--bk-mono)", fontSize: 8, color: GRAY, letterSpacing: "0.22em" }}>
              SCROLL DOWN TO VIEW WORK
            </span>
          </motion.div>
        </motion.div>

        {/* right — hero image (desktop only) */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 1.1, ease: ENTER, delay: 0.3 }}
            style={{ width: "42%", flexShrink: 0, position: "relative", overflow: "hidden" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/bk-hero/800/1200"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "grayscale(18%)" }}
              draggable={false}
            />
            {/* left fade into black */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #0D0D0D 0%, transparent 28%)" }} />
            {/* bottom fade */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #0D0D0D 0%, transparent 30%)" }} />
            {/* floating label */}
            <div style={{ position: "absolute", bottom: 28, left: 32, fontFamily: "var(--bk-mono)", fontSize: 8, color: "rgba(255,255,255,0.4)", letterSpacing: "0.18em" }}>
              NEW YORK · 2026
            </div>
          </motion.div>
        )}
      </div>

      {/* bottom */}
      <div style={{ padding: "20px clamp(28px, 5vw, 48px)", display: "flex", justifyContent: "flex-end", alignItems: "center", borderTop: `1px solid ${DIM}`, flexShrink: 0 }}>
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--bk-mono)", fontSize: 8, color: GRAY, letterSpacing: "0.12em" }}>
          SCROLL
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={GRAY} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" /></svg>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   WORK SECTION
══════════════════════════════════════════════════════════════════════ */
const BASE_SPEED = 0.048;
const EDGE_ZONE  = 0.16; // fraction of width

/* ── Gallery overlay helpers ─────────────────────────────────────── */
const EXTRA_SEEDS = [200, 201, 155, 170, 211, 188, 144, 233, 177, 165, 220, 195];

function FolderCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", aspectRatio: "1", overflow: "hidden", cursor: "pointer", background: "#111" }}
    >
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(https://picsum.photos/seed/${project.seed + 50}/400/400)`,
        backgroundSize: "cover", backgroundPosition: "center",
        transform: hovered ? "scale(1) rotate(0deg)" : "scale(0.96) rotate(-2.5deg)",
        transition: "transform 0.45s ease", opacity: 0.55,
      }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://picsum.photos/seed/${project.seed}/600/600`} alt={project.title} draggable={false}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hovered ? "scale(1.04)" : "scale(1)", filter: hovered ? "brightness(0.6)" : "brightness(0.78)", transition: "transform 0.45s, filter 0.3s" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 55%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 12px 12px" }}>
        <div style={{ fontFamily: "var(--bk-mono)", fontSize: 7, color: RED, letterSpacing: "0.18em", marginBottom: 5 }}>4 PHOTOS</div>
        <div style={{ fontFamily: "var(--bk-serif)", fontStyle: "italic", fontSize: "clamp(13px, 1.5vw, 17px)", color: "#fff", lineHeight: 1.2 }}>{project.title}</div>
        <div style={{ fontFamily: "var(--bk-mono)", fontSize: 7, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginTop: 4 }}>{project.sub}</div>
      </div>
      <div style={{ position: "absolute", top: 10, right: 10, width: 26, height: 26, borderRadius: "50%", background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", opacity: hovered ? 1 : 0, transition: "opacity 0.2s" }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
      </div>
    </div>
  );
}

function FolderDetail({ project, onLightbox, cols }: { project: Project; onLightbox: (i: number) => void; cols: number }) {
  const extra = [project.seed + 111, project.seed + 222, project.seed + 333];
  return (
    <div>
      <div onClick={() => onLightbox(0)} style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", cursor: "zoom-in", marginBottom: 2, background: "#111" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://picsum.photos/seed/${project.seed}/1200/800`} alt="" draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.45s" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 2, marginBottom: 28 }}>
        {extra.map((s, i) => (
          <div key={s} onClick={() => onLightbox(i + 1)} style={{ aspectRatio: "1", overflow: "hidden", cursor: "zoom-in", background: "#111" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://picsum.photos/seed/${s}/600/600`} alt="" draggable={false}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.45s" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "var(--bk-mono)", fontSize: 8, color: RED, letterSpacing: "0.2em", marginBottom: 10 }}>{project.year} · {project.sub}</div>
      <div style={{ fontFamily: "var(--bk-sans)", fontSize: 14, fontWeight: 300, color: GRAY, lineHeight: 1.82, maxWidth: 520 }}>{project.desc}</div>
    </div>
  );
}

function GalleryOverlay({ onClose }: { onClose: () => void }) {
  const isMobile = useIsMobile();
  const [view, setView] = useState<"grid" | "folder">("grid");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [lbIdx, setLbIdx] = useState<number | null>(null);
  const cols = isMobile ? 2 : 3;

  const folderPhotos = activeProject ? [
    `https://picsum.photos/seed/${activeProject.seed}/1200/800`,
    `https://picsum.photos/seed/${activeProject.seed + 111}/600/600`,
    `https://picsum.photos/seed/${activeProject.seed + 222}/600/600`,
    `https://picsum.photos/seed/${activeProject.seed + 333}/600/600`,
  ] : [];
  const singlePhotos = EXTRA_SEEDS.map((s) => `https://picsum.photos/seed/${s}/900/900`);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && lbIdx === null) onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, lbIdx]);

  const goBack = () => { setView("grid"); setActiveProject(null); setLbIdx(null); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.38, ease: ENTER }}
      id="bk-gallery"
      style={{ position: "fixed", inset: 0, zIndex: 400, background: BLACK, display: "flex", flexDirection: "column", overflow: "hidden" }}
    >
      {/* top bar */}
      <div style={{ height: 60, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(20px, 4vw, 44px)", borderBottom: `1px solid ${DIM}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {view === "folder" && (
            <button onClick={goBack} style={{ background: "none", border: "none", cursor: "pointer", color: GRAY, display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--bk-mono)", fontSize: 8, letterSpacing: "0.14em" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
              ALL WORK
            </button>
          )}
          <div style={{ fontFamily: "var(--bk-serif)", fontStyle: "italic", fontSize: 20, color: "#fff" }}>
            {view === "folder" && activeProject ? activeProject.title : "All Work"}
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: GRAY, display: "flex", padding: 4 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>

      {/* scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "clamp(16px, 3vw, 32px)" }}>
        {view === "grid" ? (
          <>
            <div style={{ fontFamily: "var(--bk-mono)", fontSize: 8, color: RED, letterSpacing: "0.22em", marginBottom: 14 }}>PROJECTS</div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 3, marginBottom: 3 }}>
              {PROJECTS.map((p) => (
                <FolderCard key={p.seed} project={p} onClick={() => { setActiveProject(p); setView("folder"); }} />
              ))}
            </div>
            <div style={{ fontFamily: "var(--bk-mono)", fontSize: 8, color: GRAY, letterSpacing: "0.22em", margin: "32px 0 14px" }}>SELECTED FRAMES</div>
            {/* CSS columns = true masonry, no empty cells regardless of aspect ratio */}
            <div style={{ columnCount: cols, columnGap: 3 }}>
              {EXTRA_SEEDS.map((seed, i) => (
                <div key={seed} onClick={() => setLbIdx(i)}
                  style={{ breakInside: "avoid", marginBottom: 3, overflow: "hidden", cursor: "pointer", background: "#111", display: "block" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://picsum.photos/seed/${seed}/600/${i % 5 === 0 ? 900 : 600}`} alt="" draggable={false}
                    style={{ width: "100%", height: "auto", objectFit: "cover", display: "block", transition: "transform 0.45s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          activeProject && <FolderDetail project={activeProject} onLightbox={setLbIdx} cols={cols} />
        )}
      </div>

      <AnimatePresence>
        {lbIdx !== null && (
          <Lightbox photos={view === "folder" ? folderPhotos : singlePhotos} start={lbIdx} onClose={() => setLbIdx(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Work section ────────────────────────────────────────────────── */
function WorkSection({ isActive, onSelect, current, onNav, onGalleryOpen }: { isActive: boolean; onSelect: (p: Project) => void; current: number; onNav: (i: number) => void; onGalleryOpen: () => void }) {
  const x = useMotionValue(0);
  const speedRef  = useRef(BASE_SPEED);
  const targetRef = useRef(BASE_SPEED);
  const trackRef  = useRef<HTMLDivElement>(null);
  const halfW     = useRef(0);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) halfW.current = trackRef.current.scrollWidth / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, []);

  useAnimationFrame((_, delta) => {
    if (halfW.current === 0) return;
    speedRef.current += (targetRef.current - speedRef.current) * 0.07;
    // Cap delta so a backgrounded tab never causes a massive position jump
    const dt = Math.min(delta, 80);
    let next = x.get() - dt * speedRef.current;
    // Modulo wrap — handles any jump size, both directions
    next = next % halfW.current;
    if (next > 0) next -= halfW.current;
    x.set(next);
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rel  = (e.clientX - rect.left) / rect.width;
    if (rel < EDGE_ZONE) {
      targetRef.current = -BASE_SPEED * 2.8 * (1 - rel / EDGE_ZONE);
    } else if (rel > 1 - EDGE_ZONE) {
      targetRef.current = BASE_SPEED * (1 + 2.8 * ((rel - (1 - EDGE_ZONE)) / EDGE_ZONE));
    } else {
      targetRef.current = BASE_SPEED;
    }
  };

  const handleMouseLeave = () => { targetRef.current = BASE_SPEED; };

  return (
    <section style={{ height: "100dvh", background: DARK, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ height: 64, flexShrink: 0 }} />

      {/* header */}
      <motion.div
        variants={stagger} initial="hidden" animate={isActive ? "visible" : "hidden"}
        style={{ padding: "18px clamp(24px, 4vw, 48px) 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `1px solid ${DIM}`, flexShrink: 0 }}
      >
        <div>
          <motion.div variants={fadeIn} style={{ fontFamily: "var(--bk-mono)", fontSize: 8, color: RED, letterSpacing: "0.22em", marginBottom: 6 }}>02 · SELECTED WORK</motion.div>
          <motion.h2 variants={slideUp} style={{ fontFamily: "var(--bk-serif)", fontSize: "clamp(20px, 2.8vw, 38px)", color: "#fff", lineHeight: 1 }}>Portfolio</motion.h2>
        </div>
        <motion.div variants={fadeIn} style={{ fontFamily: "var(--bk-mono)", fontSize: 8, color: GRAY, letterSpacing: "0.1em", textAlign: "right", lineHeight: 1.8 }}>
          <div>BROOKLYN · NYC</div>
          <div>2019 — 2026</div>
        </motion.div>
      </motion.div>

      {/* rolling marquee strip */}
      <style>{`@keyframes bk-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      <motion.div
        variants={fadeIn} initial="hidden" animate={isActive ? "visible" : "hidden"}
        style={{ background: RED, overflow: "hidden", height: 34, display: "flex", alignItems: "center", flexShrink: 0, userSelect: "none" }}
      >
        <div style={{ display: "inline-flex", animation: "bk-marquee 22s linear infinite", whiteSpace: "nowrap" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} style={{ fontFamily: "var(--bk-mono)", fontSize: 8, color: "rgba(255,255,255,0.88)", letterSpacing: "0.26em", padding: "0 28px" }}>
              OPEN A PROJECT · EXPLORE THE WORK · HOVER TO NAVIGATE ·
            </span>
          ))}
        </div>
      </motion.div>

      {/* auto-glide strip — fixed height so red CTA below gets the leftover space */}
      <motion.div
        variants={fadeIn} initial="hidden" animate={isActive ? "visible" : "hidden"}
        style={{ flexShrink: 0, overflow: "hidden", padding: "12px 0 12px", position: "relative", height: "clamp(240px, 40dvh, 380px)" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={() => { targetRef.current = 0; }}
        onTouchEnd={() => { targetRef.current = BASE_SPEED; }}
      >
        <motion.div
          ref={trackRef}
          style={{ x, display: "flex", gap: 10, height: "100%", width: "max-content", paddingLeft: 10, alignItems: "stretch" }}
        >
          {[...PROJECTS, ...PROJECTS].map((p, i) => (
            <GlideCard key={`${p.seed}-${i}`} project={p} onSelect={onSelect} />
          ))}
        </motion.div>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 48, background: `linear-gradient(to right, ${DARK}, transparent)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 160, background: `linear-gradient(to left, ${DARK}, transparent)`, pointerEvents: "none" }} />
      </motion.div>

      {/* bottom zone — 2 columns */}
      <motion.div
        variants={fadeIn} initial="hidden" animate={isActive ? "visible" : "hidden"}
        style={{ flex: 1, display: "flex", overflow: "hidden" }}
      >
        {/* left — red CTA */}
        <div
          onClick={() => onGalleryOpen()}
          style={{ flex: 1, background: RED, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(20px, 4vw, 48px)", cursor: "pointer", position: "relative", overflow: "hidden", userSelect: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
        >
          <div style={{ position: "absolute", right: -8, bottom: -12, fontFamily: "var(--bk-serif)", fontSize: "clamp(50px, 9vw, 120px)", color: "rgba(0,0,0,0.12)", lineHeight: 1, pointerEvents: "none" }}>ALL</div>
          <div style={{ fontFamily: "var(--bk-mono)", fontSize: 8, color: "rgba(255,255,255,0.6)", letterSpacing: "0.22em", marginBottom: 10 }}>
            FULL ARCHIVE · {PROJECTS.length * 4 + EXTRA_SEEDS.length} PHOTOS
          </div>
          <div style={{ fontFamily: "var(--bk-sans)", fontWeight: 800, fontSize: "clamp(22px, 3.2vw, 52px)", lineHeight: 1.05, marginBottom: 18 }}>
            <span style={{ color: "#fff" }}>VIEW ALL</span><br />
            <span style={{ color: "rgba(0,0,0,0.35)" }}>MY WORK</span>
          </div>
          {/* circle arrow button */}
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>

        {/* right — black, section nav steps */}
        <div style={{ width: "clamp(140px, 30%, 220px)", flexShrink: 0, background: BLACK, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", gap: 14, padding: "0 clamp(20px, 3vw, 36px)" }}>
          {SECTIONS.map((s, i) => (
            <button key={s.id} onClick={() => onNav(i)}
              style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: "2px 0" }}
            >
              <span style={{ display: "block", width: current === i ? 26 : 5, height: 5, borderRadius: 3, background: current === i ? RED : "rgba(255,255,255,0.18)", transition: "width 0.32s ease, background 0.3s ease", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--bk-mono)", fontSize: 9, color: current === i ? "#fff" : "rgba(255,255,255,0.3)", letterSpacing: "0.12em", transition: "color 0.3s", whiteSpace: "nowrap" }}>
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>

    </section>
  );
}

function GlideCard({ project, onSelect }: { project: Project; onSelect: (p: Project) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onSelect(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ width: "clamp(200px, 24vw, 310px)", height: "100%", position: "relative", overflow: "hidden", cursor: "zoom-in", flexShrink: 0, background: "#111" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${project.seed}/600/900`}
        alt={project.title}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transform: hovered ? "scale(1.05)" : "scale(1)", filter: hovered ? "brightness(0.65)" : "brightness(0.82)", transition: "transform 0.55s ease, filter 0.35s ease" }}
        draggable={false}
      />
      {/* always-visible title */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 55%, transparent 100%)", padding: "44px 14px 14px" }}>
        <div style={{ fontFamily: "var(--bk-mono)", fontSize: 7, color: RED, letterSpacing: "0.18em", marginBottom: 5 }}>
          {project.year} · {project.sub.split("·")[0]?.trim()}
        </div>
        <div style={{ fontFamily: "var(--bk-serif)", fontStyle: "italic", fontSize: "clamp(14px, 1.6vw, 19px)", color: "#fff", lineHeight: 1.2 }}>
          {project.title}
        </div>
      </div>
      {/* hover arrow */}
      <div style={{ position: "absolute", top: 12, right: 12, opacity: hovered ? 1 : 0, transition: "opacity 0.25s" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4-4" /></svg>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   ABOUT SECTION
══════════════════════════════════════════════════════════════════════ */
function AboutSection({ isActive }: { isActive: boolean }) {
  const isMobile = useIsMobile();
  return (
    <section style={{ height: "100dvh", background: STONE, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      {/* watermark */}
      <div style={{ position: "absolute", right: -20, bottom: -60, fontFamily: "var(--bk-serif)", fontSize: "clamp(160px, 26vw, 420px)", color: "rgba(0,0,0,0.04)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>03</div>

      <div style={{ height: 64, flexShrink: 0 }} />

      {/* main row */}
      <div style={{ flex: 1, display: "flex", flexDirection: "row", overflow: "hidden", position: "relative", zIndex: 1 }}>

        {/* left — content */}
        <motion.div
          variants={stagger} initial="hidden" animate={isActive ? "visible" : "hidden"}
          style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(32px, 5vw, 60px) clamp(28px, 7vw, 72px)", minWidth: 0 }}
        >
          {/* avatar */}
          <motion.div variants={scaleIn} style={{ marginBottom: 28 }}>
            <div style={{ width: 100, height: 100, borderRadius: 0, overflow: "hidden", outline: `3px solid ${RED}`, outlineOffset: 4 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://picsum.photos/seed/portrait88/300/300" alt="Photographer" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "grayscale(10%)" }} />
            </div>
          </motion.div>

          <motion.div variants={fadeIn} style={{ fontFamily: "var(--bk-mono)", fontSize: 8, color: RED, letterSpacing: "0.22em", marginBottom: 20 }}>03 · ABOUT</motion.div>

          <motion.h2 variants={slideUp} style={{ fontFamily: "var(--bk-serif)", fontStyle: "italic", fontSize: "clamp(28px, 4vw, 58px)", color: BLACK, lineHeight: 1.1, marginBottom: 18 }}>
            Telling stories<br />through light.
          </motion.h2>

          <motion.div variants={growX} style={{ width: 44, height: 3, background: RED, marginBottom: 20, transformOrigin: "left center" }} />

          <motion.p variants={slideUp} style={{ fontFamily: "var(--bk-sans)", fontSize: 14, fontWeight: 300, color: "#4A4747", lineHeight: 1.82, maxWidth: 500, marginBottom: 36 }}>
            Based in Brooklyn, I document the raw beauty of human connection — from intimate weddings in upstate New York to editorial shoots across Manhattan.
            Every frame is a conversation between light, shadow, and story.
          </motion.p>

          <motion.div variants={stagger} style={{ display: "flex", gap: 40 }}>
            {[{ v: "8+", l: "YEARS" }, { v: "340", l: "PROJECTS" }, { v: "12", l: "CITIES" }].map((s) => (
              <motion.div key={s.l} variants={slideUp}>
                <div style={{ fontFamily: "var(--bk-serif)", fontSize: "clamp(26px, 3.5vw, 48px)", color: BLACK, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontFamily: "var(--bk-mono)", fontSize: 7, color: GRAY, letterSpacing: "0.2em", marginTop: 5 }}>{s.l}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* scroll hint — design 3: mobile only, filled red pill */}
          {isMobile && (
            <motion.div variants={fadeIn} style={{ marginTop: 32 }}>
              <motion.div
                animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: RED, padding: "10px 18px" }}
              >
                <span style={{ fontFamily: "var(--bk-mono)", fontSize: 8, color: "#fff", letterSpacing: "0.2em" }}>
                  NEXT · GET IN TOUCH
                </span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* right — photo (desktop only) */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 1.1, ease: ENTER, delay: 0.25 }}
            style={{ width: "40%", flexShrink: 0, position: "relative", overflow: "hidden" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/bk-about/800/1200"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "grayscale(12%)" }}
              draggable={false}
            />
            {/* left fade into stone */}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, ${STONE} 0%, transparent 26%)` }} />
            {/* bottom fade */}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${STONE} 0%, transparent 28%)` }} />
            {/* red accent line */}
            <div style={{ position: "absolute", top: 40, left: 0, width: 3, height: 80, background: RED }} />
          </motion.div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   CONTACT SECTION
══════════════════════════════════════════════════════════════════════ */
function ContactSection({ isActive, onWhatsApp }: { isActive: boolean; onWhatsApp: () => void }) {
  return (
    <section style={{ height: "100dvh", background: BLACK, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(28px, 7vw, 96px)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: -16, bottom: -60, fontFamily: "var(--bk-serif)", fontSize: "clamp(180px, 30vw, 460px)", color: "rgba(255,255,255,0.024)", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>04</div>

      <motion.div variants={stagger} initial="hidden" animate={isActive ? "visible" : "hidden"} style={{ position: "relative", zIndex: 1 }}>
        <motion.div variants={fadeIn} style={{ fontFamily: "var(--bk-mono)", fontSize: 8, color: RED, letterSpacing: "0.22em", marginBottom: 36, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "inline-block", width: 18, height: 1.5, background: RED }} />
          04 · CONTACT
        </motion.div>

        <motion.div variants={slideUp} style={{ lineHeight: 0.88, marginBottom: 44 }}>
          <div style={{ fontFamily: "var(--bk-serif)", fontStyle: "italic", fontSize: "clamp(32px, 5vw, 78px)", color: "rgba(255,255,255,0.36)" }}>Let's make</div>
          <div style={{ fontFamily: "var(--bk-sans)", fontWeight: 700, fontSize: "clamp(44px, 8.5vw, 128px)", color: "#fff", letterSpacing: "-0.025em" }}>SOMETHING</div>
          <div style={{ fontFamily: "var(--bk-sans)", fontWeight: 700, fontSize: "clamp(44px, 8.5vw, 128px)", color: RED, letterSpacing: "-0.025em" }}>GREAT.</div>
        </motion.div>

        <motion.div variants={stagger} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <motion.div variants={slideLeft}>
            <a href="mailto:alex@morrisonphoto.com"
              style={{ fontFamily: "var(--bk-mono)", fontSize: "clamp(11px, 1.2vw, 16px)", color: "#fff", textDecoration: "none", borderBottom: `1px solid ${RED}`, paddingBottom: 2, letterSpacing: "0.05em", display: "inline-block", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = RED)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#fff")}
            >
              alex@morrisonphoto.com
            </a>
          </motion.div>
          <motion.div variants={fadeIn} style={{ display: "flex", gap: 28, fontFamily: "var(--bk-mono)", fontSize: 9, color: GRAY, letterSpacing: "0.1em", flexWrap: "wrap" }}>
            <span>@alexmorrison_nyc</span>
            <span style={{ color: DIM }}>·</span>
            <span>Brooklyn, New York</span>
          </motion.div>
          {/* social row */}
          <motion.div variants={fadeIn} style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            {/* WhatsApp */}
            <button
              onClick={onWhatsApp}
              style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--bk-mono)", fontSize: 9, color: "#25D366", background: "none", border: `1px solid rgba(37,211,102,0.3)`, padding: "10px 16px", cursor: "pointer", letterSpacing: "0.1em", transition: "border-color 0.2s, background 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(37,211,102,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "#25D366"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,211,102,0.3)"; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              WHATSAPP
            </button>
            {/* thin divider */}
            <span style={{ width: 1, height: 24, background: DIM }} />
            {/* Instagram */}
            <a href="#" aria-label="Instagram"
              style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--bk-mono)", fontSize: 9, color: GRAY, textDecoration: "none", letterSpacing: "0.1em", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#E1306C")}
              onMouseLeave={(e) => (e.currentTarget.style.color = GRAY)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>
              INSTAGRAM
            </a>
            {/* X */}
            <a href="#" aria-label="X"
              style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--bk-mono)", fontSize: 9, color: GRAY, textDecoration: "none", letterSpacing: "0.1em", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = GRAY)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              X / TWITTER
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      <div style={{ position: "absolute", bottom: 24, left: "clamp(28px, 7vw, 96px)", fontFamily: "var(--bk-mono)", fontSize: 8, color: DIM, letterSpacing: "0.14em" }}>
        FRAME STUDIO · NEW YORK
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════ */
export default function BrooklynPage() {
  const [current, setCurrent]           = useState(0);
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [waOpen, setWaOpen]             = useState(false);
  const [selected, setSelected]         = useState<Project | null>(null);
  const [galleryOpen, setGalleryOpen]   = useState(false);
  const containerY = useMotionValue(0);
  const currentRef = useRef(0);
  const isAnimating = useRef(false);
  const lastNav = useRef(0);
  const touchStart = useRef(0);
  const isMobile = useIsMobile();
  const sliderRef = useRef<HTMLDivElement>(null);

  // Measure the actual rendered section height so JS offsets match CSS 100dvh exactly.
  const getSectionH = useCallback(() => {
    const first = sliderRef.current?.firstElementChild as HTMLElement | null;
    return first?.offsetHeight ?? window.innerHeight;
  }, []);

  const goTo = useCallback((idx: number) => {
    const c = Math.max(0, Math.min(SECTIONS.length - 1, idx));
    if (c === currentRef.current || isAnimating.current) return;
    isAnimating.current = true;
    currentRef.current = c;
    setCurrent(c);
    animate(containerY, -c * getSectionH(), {
      duration: 0.95, ease: SLIDE,
      onComplete: () => { isAnimating.current = false; },
    });
  }, [containerY, getSectionH]);

  /* keyboard */
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); goTo(currentRef.current + 1); }
      if (e.key === "ArrowUp") { e.preventDefault(); goTo(currentRef.current - 1); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [goTo]);

  const galleryOpenRef = useRef(false);
  useEffect(() => { galleryOpenRef.current = galleryOpen; }, [galleryOpen]);

  const isInsideGallery = (target: EventTarget | null) =>
    galleryOpenRef.current || !!document.getElementById("bk-gallery")?.contains(target as Node);

  /* wheel */
  useEffect(() => {
    const h = (e: WheelEvent) => {
      if (isInsideGallery(e.target)) return;
      e.preventDefault();
      const now = Date.now();
      if (now - lastNav.current < 960) return;
      lastNav.current = now;
      if (e.deltaY > 20) goTo(currentRef.current + 1);
      else if (e.deltaY < -20) goTo(currentRef.current - 1);
    };
    window.addEventListener("wheel", h, { passive: false });
    return () => window.removeEventListener("wheel", h);
  }, [goTo]); // eslint-disable-line react-hooks/exhaustive-deps

  /* touch */
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      if (isInsideGallery(e.target)) return;
      if (e.touches[0]) touchStart.current = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      if (isInsideGallery(e.target)) return;
      const t = e.changedTouches[0];
      const dy = t ? touchStart.current - t.clientY : 0;
      const now = Date.now();
      if (Math.abs(dy) < 50 || now - lastNav.current < 900) return;
      lastNav.current = now;
      if (dy > 0) goTo(currentRef.current + 1);
      else goTo(currentRef.current - 1);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => { window.removeEventListener("touchstart", onStart); window.removeEventListener("touchend", onEnd); };
  }, [goTo]); // eslint-disable-line react-hooks/exhaustive-deps

  const isLight = current === 2; // ABOUT section (stone bg)
  const showGlass = current === 1 || current === 2; // WORK or ABOUT

  /* nav pill inactive color */
  const navInactive = isLight ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.22)";
  const navLabel    = isLight ? "rgba(0,0,0,0.5)"  : GRAY;
  const counter     = isLight ? "rgba(0,0,0,0.32)" : GRAY;

  return (
    <>
      <div style={{ position: "relative", height: "100dvh", overflow: "hidden" }}>

        {/* sliding container */}
        <motion.div ref={sliderRef} style={{ y: containerY, position: "absolute", top: 0, left: 0, width: "100%" }}>
          <CoverSection   isActive={current === 0} onNext={() => goTo(1)} />
          <WorkSection    isActive={current === 1} onSelect={setSelected} current={current} onNav={goTo} onGalleryOpen={() => setGalleryOpen(true)} />
          <AboutSection   isActive={current === 2} />
          <ContactSection isActive={current === 3} onWhatsApp={() => setWaOpen(true)} />
        </motion.div>

        {/* fixed topbar */}
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 90,
          padding: "0 clamp(24px, 4vw, 44px)",
          height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : DIM}`,
          background: isLight ? "rgba(240,239,233,0.88)" : "rgba(13,13,13,0.88)",
          backdropFilter: "blur(14px)",
          transition: "background 0.5s, border-color 0.5s",
        }}>
          <div style={{ fontFamily: "var(--bk-serif)", fontStyle: "italic", fontSize: 22, color: isLight ? BLACK : "#fff", letterSpacing: "0.01em", transition: "color 0.5s" }}>
            Morrison
          </div>
          <HamburgerBtn open={sidebarOpen} onClick={() => setSidebarOpen((o) => !o)} light={isLight} />
        </div>

        {/* right nav pills — hidden on mobile when Work section (nav is embedded there) */}
        <motion.div
          animate={{ y: isMobile && (current === 1 || current === 2) ? "0.5rem" : "0rem", opacity: current === 1 ? 0 : 1, pointerEvents: current === 1 ? "none" : "auto" }}
          transition={{ duration: 0.5, ease: ENTER }}
          style={{
            position: "fixed", right: 20, top: isMobile ? "75%" : "50%", transform: "translateY(-50%)",
            zIndex: 90, display: "flex", flexDirection: "column", gap: 9, alignItems: "flex-end",
            padding: showGlass ? (isMobile ? "12px 8px" : "16px 12px") : "0",
            background: showGlass ? (isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.1)") : "transparent",
            backdropFilter: showGlass ? "blur(10px)" : "none",
            borderRadius: 20,
            transition: "background 0.5s, backdrop-filter 0.5s, padding 0.4s",
          }}>
          {SECTIONS.map((s, i) => (
            <button
              key={s.id} onClick={() => goTo(i)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: isMobile ? "3px 0" : "5px 0", display: "flex", alignItems: "center", gap: isMobile ? 8 : 12 }}
            >
              <span style={{
                fontFamily: "var(--bk-mono)",
                fontSize: isMobile ? 7 : 10,
                color: current === i ? RED : navLabel,
                letterSpacing: "0.12em",
                opacity: current === i ? 1 : 0,
                transform: `translateX(${current === i ? 0 : 6}px)`,
                transition: "opacity 0.3s, transform 0.3s, color 0.4s",
                whiteSpace: "nowrap",
              }}>
                {s.label}
              </span>
              <span style={{
                display: "block",
                width: current === i ? (isMobile ? 22 : 32) : (isMobile ? 5 : 8),
                height: isMobile ? 5 : 7,
                borderRadius: 4,
                background: current === i ? RED : navInactive,
                transition: "width 0.32s ease, background 0.4s ease",
              }} />
            </button>
          ))}
        </motion.div>

        {/* section counter */}
        <div style={{ position: "fixed", bottom: 24, left: "clamp(24px, 4vw, 48px)", zIndex: 90, fontFamily: "var(--bk-mono)", fontSize: 8, color: counter, letterSpacing: "0.14em", transition: "color 0.5s" }}>
          {SECTIONS[current]?.num ?? "01"} / 0{SECTIONS.length}
        </div>

      </div>

      {/* overlays */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} current={current} goTo={goTo} />

      <AnimatePresence>
        {waOpen && <WhatsAppModal key="wa" onClose={() => setWaOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {selected && <ProjectDetail key="detail" project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {galleryOpen && <GalleryOverlay key="gallery" onClose={() => setGalleryOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
