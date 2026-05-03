"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

/* ─── Brooklyn Delivery ──────────────────────────────────────────
   Password-protected client gallery. Same Brooklyn design language.
   RED accents, dark surfaces, Space Grotesk / Space Mono.
─────────────────────────────────────────────────────────────── */

const RED   = "#E8382C";
const BLACK = "#0D0D0D";
const DARK  = "#161616";
const STONE = "#F0EFE9";
const GRAY  = "#7A7A7A";
const DIM   = "#2A2A2A";

const SANS = "var(--bk-sans), 'Space Grotesk', system-ui, sans-serif";
const MONO = "var(--bk-mono), 'Space Mono', monospace";
const SERIF = "var(--bk-serif), 'DM Serif Display', Georgia, serif";

const CLIENT_PASSWORD = "sarah2025";
const CLIENT_NAME     = "Sarah & James";
const EVENT_DATE      = "October 18, 2025";
const PHOTO_COUNT     = 347;

const PHOTOS = [
  10, 71, 82, 93, 100, 111, 122, 133, 144, 155,
  166, 177, 188, 199, 210, 221, 232, 243, 254, 265,
  276, 287, 298, 309,
];

/* Curtain ease — same vibe as Brooklyn portfolio's slide easing */
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;
const CURTAIN_DURATION = 1.1; // seconds

export default function BrooklynDeliveryPage() {
  const [unlocked, setUnlocked]         = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  /* When the user enters the correct code:
     1. Trigger curtain (red panel wipes left → right across viewport)
     2. At ~midpoint of curtain animation, swap from gate to gallery
     3. Curtain finishes leaving — gallery photos stagger-in underneath */
  function handleUnlock() {
    setTransitioning(true);
    const half = (CURTAIN_DURATION * 1000) / 2;
    setTimeout(() => setUnlocked(true), half);
    setTimeout(() => setTransitioning(false), CURTAIN_DURATION * 1000 + 50);
  }

  return (
    <>
      {!unlocked ? <PasswordGate onUnlock={handleUnlock} /> : <Gallery />}

      <AnimatePresence>
        {transitioning && (
          <motion.div
            key="bk-curtain"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: CURTAIN_DURATION, ease: CURTAIN_EASE }}
            style={{
              position: "fixed", inset: 0, background: RED,
              zIndex: 2000, pointerEvents: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{
              fontFamily: MONO, fontSize: 12, letterSpacing: "0.32em",
              textTransform: "uppercase", color: BLACK, fontWeight: 700,
            }}>
              Welcome, {CLIENT_NAME.split(" & ")[0]}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* Stagger variants — photos cascade in as the curtain leaves */
const gridVariants: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } },
};
const photoVariants: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Password gate ─────────────────────────────────────────────── */

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function attempt() {
    if (value.toLowerCase() === CLIENT_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2000);
    }
  }

  return (
    <main style={{ fontFamily: SANS, background: BLACK, color: STONE, minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 3, background: RED }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", gap: 0 }}>

        {/* Logo */}
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: RED, marginBottom: 40 }}>
          Morrison Photo · Client Gallery
        </div>

        {/* Event info */}
        <h1 style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: "clamp(28px, 6vw, 52px)", fontWeight: 400, color: STONE, letterSpacing: "-0.02em", lineHeight: 1, textAlign: "center", margin: "0 0 8px" }}>
          {CLIENT_NAME}
        </h1>
        <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: GRAY, margin: "0 0 48px" }}>
          {EVENT_DATE} · {PHOTO_COUNT} photos
        </p>

        {/* Password form */}
        <div
          style={{
            width: "100%", maxWidth: 340,
            animation: shake ? "bk-shake 0.4s ease" : "none",
          }}
        >
          <style>{`
            @keyframes bk-shake {
              0%,100% { transform: translateX(0); }
              20%,60%  { transform: translateX(-8px); }
              40%,80%  { transform: translateX(8px); }
            }
          `}</style>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: GRAY }}>
              Access code
            </label>
            <input
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && attempt()}
              placeholder="Enter your code"
              style={{
                width: "100%", padding: "14px 16px",
                background: DARK, border: `1px solid ${error ? RED : DIM}`,
                color: STONE, fontFamily: MONO, fontSize: 13,
                outline: "none", letterSpacing: "0.08em",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
            />
            {error && (
              <p style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", color: RED, margin: 0 }}>
                Incorrect code. Try again.
              </p>
            )}
            <button
              onClick={attempt}
              style={{
                width: "100%", padding: "13px",
                background: RED, border: "none",
                color: BLACK, fontFamily: MONO, fontSize: 11,
                fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase", cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#c0291f"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = RED; }}
            >
              Access gallery →
            </button>
          </div>
        </div>

        <p style={{ fontFamily: MONO, fontSize: 9, color: DIM, letterSpacing: "0.12em", marginTop: 32, textAlign: "center" }}>
          Gallery expires in 90 days · Contact Morrison Photo for download issues
        </p>
      </div>
    </main>
  );
}

/* ── Gallery ───────────────────────────────────────────────────── */

function Gallery() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [selected,    setSelected]    = useState<Set<number>>(new Set());
  const [downloading, setDownloading] = useState(false);

  function toggleSelect(idx: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(PHOTOS.map((_, i) => i)));
  }

  function simulateDownload() {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2200);
  }

  return (
    <main style={{ fontFamily: SANS, background: BLACK, color: STONE, minHeight: "100dvh" }}>
      {/* Red top bar */}
      <div style={{ height: 3, background: RED }} />

      {/* Top nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px clamp(16px, 4vw, 48px)",
        borderBottom: `1px solid ${DIM}`,
        position: "sticky", top: 0, background: BLACK, zIndex: 50,
        gap: 16,
      }}>
        <div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 22, fontWeight: 400, color: STONE, letterSpacing: "-0.01em", lineHeight: 1 }}>
            {CLIENT_NAME}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: GRAY, marginTop: 3 }}>
            {EVENT_DATE} · {PHOTO_COUNT} photos · Morrison Photo
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {selected.size > 0 && (
            <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.14em", color: RED }}>
              {selected.size} selected
            </span>
          )}
          <button
            onClick={selectAll}
            style={{
              background: "none", border: `1px solid ${DIM}`, color: GRAY,
              fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase",
              padding: "7px 12px", cursor: "pointer", transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = GRAY; e.currentTarget.style.color = STONE; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = DIM; e.currentTarget.style.color = GRAY; }}
          >
            Select all
          </button>
          <button
            onClick={simulateDownload}
            disabled={downloading}
            style={{
              background: downloading ? DIM : RED, border: "none",
              color: downloading ? GRAY : BLACK,
              fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
              fontWeight: 700, padding: "8px 18px", cursor: downloading ? "default" : "pointer",
              display: "flex", alignItems: "center", gap: 7,
              transition: "background 0.2s",
            }}
          >
            {downloading ? (
              <>
                <span style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${GRAY}`, borderTopColor: "transparent", display: "inline-block", animation: "bk-spin 0.7s linear infinite" }} />
                Preparing...
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                {selected.size > 0 ? `Download ${selected.size}` : "Download all"}
              </>
            )}
          </button>
        </div>
      </nav>

      <style>{`
        @keyframes bk-spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Photo grid — stagger reveal */}
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        style={{
          padding: "clamp(16px, 3vw, 32px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 4,
        }}
      >
        {PHOTOS.map((seed, i) => (
          <GalleryThumb
            key={seed}
            seed={seed}
            index={i}
            selected={selected.has(i)}
            onSelect={() => toggleSelect(i)}
            onOpen={() => setLightboxIdx(i)}
          />
        ))}
      </motion.div>

      {/* Footer */}
      <footer style={{
        borderTop: `1px solid ${DIM}`, padding: "24px clamp(16px, 4vw, 48px)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase",
      }}>
        <span style={{ color: DIM }}>© Morrison Photo 2025</span>
        <div style={{ display: "flex", gap: 24 }}>
          {["Print shop", "Contact", "Instagram"].map((item) => (
            <a key={item} href="#" style={{ color: GRAY, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = STONE; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = GRAY; }}
            >{item}</a>
          ))}
        </div>
      </footer>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <BrooklynLightbox
          photos={PHOTOS}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </main>
  );
}

function GalleryThumb({ seed, index, selected, onSelect, onOpen }: {
  seed: number; index: number; selected: boolean;
  onSelect: () => void; onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={photoVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", aspectRatio: "1", overflow: "hidden", background: DIM, cursor: "pointer" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${seed}/480/480`}
        alt=""
        onClick={onOpen}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: hovered ? "scale(1.04)" : "scale(1)",
          transition: "transform 500ms cubic-bezier(0.2,0.8,0.2,1)",
        }}
      />

      {/* Hover overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.35)",
        opacity: hovered || selected ? 1 : 0,
        transition: "opacity 0.2s",
        pointerEvents: "none",
      }} />

      {/* Select checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        style={{
          position: "absolute", top: 10, left: 10,
          width: 20, height: 20,
          background: selected ? RED : "rgba(0,0,0,0.5)",
          border: `1.5px solid ${selected ? RED : "rgba(255,255,255,0.5)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", padding: 0,
          opacity: hovered || selected ? 1 : 0,
          transition: "opacity 0.2s, background 0.2s",
        }}
      >
        {selected && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={BLACK} strokeWidth="3" strokeLinecap="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        )}
      </button>

      {/* Index */}
      <span style={{
        position: "absolute", bottom: 8, right: 10,
        fontFamily: MONO, fontSize: 8, letterSpacing: "0.2em",
        color: "rgba(255,255,255,0.4)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.2s",
        pointerEvents: "none",
      }}>
        {String(index + 1).padStart(3, "0")}
      </span>
    </motion.div>
  );
}

/* ── Lightbox ──────────────────────────────────────────────────── */

function BrooklynLightbox({ photos, startIndex, onClose }: { photos: number[]; startIndex: number; onClose: () => void }) {
  const [index, setIndex]   = useState(startIndex);
  const [zoom, setZoom]     = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDrag] = useState(false);
  const dragRef             = useRef({ sx: 0, sy: 0, ox: 0, oy: 0 });
  const containerRef        = useRef<HTMLDivElement>(null);
  const seed                = photos[index]!;

  const resetView = useCallback(() => { setZoom(1); setOffset({ x: 0, y: 0 }); }, []);
  const prev = useCallback(() => { setIndex((i) => Math.max(i - 1, 0)); resetView(); }, [resetView]);
  const next = useCallback(() => { setIndex((i) => Math.min(i + 1, photos.length - 1)); resetView(); }, [photos.length, resetView]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, next, prev]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const fn = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((p) => {
        const n = Math.min(Math.max(p * (e.deltaY < 0 ? 1.12 : 0.9), 1), 8);
        if (n === 1) setOffset({ x: 0, y: 0 });
        return n;
      });
    };
    el.addEventListener("wheel", fn, { passive: false });
    return () => el.removeEventListener("wheel", fn);
  }, []);

  const onMD = (e: React.MouseEvent) => { if (zoom <= 1) return; e.preventDefault(); setDrag(true); dragRef.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y }; };
  const onMM = (e: React.MouseEvent) => { if (!dragging) return; setOffset({ x: dragRef.current.ox + e.clientX - dragRef.current.sx, y: dragRef.current.oy + e.clientY - dragRef.current.sy }); };
  const onMU = () => setDrag(false);

  return (
    <div onClick={(e) => e.stopPropagation()} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(8,8,8,0.97)", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: `1px solid ${DIM}`, flexShrink: 0 }}>
        <button onClick={onClose} style={{ background: "none", border: `1px solid ${DIM}`, cursor: "pointer", color: GRAY, fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", padding: "7px 14px", display: "flex", alignItems: "center", gap: 6, transition: "border-color 0.2s, color 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = GRAY; e.currentTarget.style.color = STONE; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = DIM; e.currentTarget.style.color = GRAY; }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: DIM }}>
          {String(index + 1).padStart(3, "0")} / {String(photos.length).padStart(3, "0")}
        </span>
        <button style={{ background: RED, border: "none", cursor: "pointer", color: BLACK, fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700, padding: "7px 16px", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Download
        </button>
      </div>

      {/* Image */}
      <div ref={containerRef} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 72px", overflow: "hidden", cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default" }}
        onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://picsum.photos/seed/${seed}/1600/1200`} alt="" draggable={false}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", pointerEvents: "none", display: "block", transform: `translate(${offset.x}px,${offset.y}px) scale(${zoom})`, transition: dragging ? "none" : "transform 0.18s ease" }} />
      </div>

      {/* Arrows */}
      {index > 0 && (
        <button onClick={prev} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: DIM, border: `1px solid ${DIM}`, color: STONE, cursor: "pointer", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = RED; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = DIM; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
      )}
      {index < photos.length - 1 && (
        <button onClick={next} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: DIM, border: `1px solid ${DIM}`, color: STONE, cursor: "pointer", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = RED; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = DIM; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      )}
    </div>
  );
}
