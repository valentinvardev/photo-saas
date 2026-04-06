"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/* ─────────────────────────────────────────────
   Minimal BW — A portfolio template for FRAME
   Fonts: Cormorant Garamond · DM Sans · Space Mono
───────────────────────────────────────────── */

const WORKS = [
  { id: 1,  seed: 20,  title: "Wanderers",        year: "2024", cat: "Documentary", w: 5472, h: 3648 },
  { id: 2,  seed: 37,  title: "The Quiet City",    year: "2023", cat: "Urban",       w: 4000, h: 5000 },
  { id: 3,  seed: 48,  title: "Peripheral",        year: "2023", cat: "Street",      w: 6000, h: 4000 },
  { id: 4,  seed: 63,  title: "Aftermath",         year: "2022", cat: "Documentary", w: 5472, h: 3648 },
  { id: 5,  seed: 71,  title: "Still Life No. 4",  year: "2022", cat: "Studio",      w: 4000, h: 4000 },
  { id: 6,  seed: 82,  title: "Northern Light",    year: "2024", cat: "Landscape",   w: 7000, h: 4667 },
  { id: 7,  seed: 95,  title: "Between Sessions",  year: "2021", cat: "Portrait",    w: 3840, h: 5760 },
  { id: 8,  seed: 108, title: "Threshold",         year: "2021", cat: "Documentary", w: 5472, h: 3648 },
  { id: 9,  seed: 133, title: "Margins",           year: "2020", cat: "Urban",       w: 4500, h: 3000 },
  { id: 10, seed: 145, title: "Salt Flat Study",   year: "2023", cat: "Landscape",   w: 6000, h: 4000 },
  { id: 11, seed: 156, title: "Interior IV",       year: "2022", cat: "Studio",      w: 3500, h: 4375 },
  { id: 12, seed: 167, title: "Anonymous",         year: "2024", cat: "Portrait",    w: 4000, h: 5000 },
];

const STATS = [
  { value: "14",   unit: "Years",    label: "of practice" },
  { value: "280+", unit: "Projects", label: "completed"   },
  { value: "9",    unit: "Cities",   label: "worked in"   },
];

const PRESS = [
  { name: "The New Yorker", year: "2023" },
  { name: "Aperture",       year: "2022" },
  { name: "Foam Magazine",  year: "2022" },
  { name: "Zeit Magazin",   year: "2021" },
  { name: "LensCulture",    year: "2020" },
];

type Work = typeof WORKS[0];

/* ═══════════════════════════════════════════
   NAV
═══════════════════════════════════════════ */
function Nav({ onOpenGallery }: { onOpenGallery: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const S = {
    nav: {
      position: "fixed" as const, top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 3rem",
      height: scrolled ? "52px" : "72px",
      borderBottom: scrolled ? "1px solid #e8e8e8" : "1px solid transparent",
      background: scrolled ? "rgba(250,250,250,0.94)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      transition: "height 0.3s ease, background 0.3s ease, border-color 0.3s ease",
    },
    logo: { fontFamily: "var(--tpl-mono,monospace)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.18em", color: "#0a0a0a", textTransform: "uppercase" as const },
    link: { fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "12px", fontWeight: 400, letterSpacing: "0.06em", color: "#0a0a0a", textDecoration: "none", opacity: 0.5, transition: "opacity 0.2s" },
    cta: { fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", color: "#fafafa", background: "#0a0a0a", padding: "7px 18px", border: "1px solid #0a0a0a", cursor: "pointer", transition: "background 0.2s, color 0.2s" },
  };

  return (
    <nav style={S.nav}>
      <span style={S.logo}>J·H</span>
      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
        {[["Work", () => onOpenGallery()], ["About", null], ["Press", null], ["Contact", null]].map(([label]) => (
          <a key={label as string} href={label === "Work" ? "#work" : `#${(label as string).toLowerCase()}`}
            style={S.link}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; }}
          >{label as string}</a>
        ))}
        <button style={S.cta}
          onMouseEnter={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0a0a0a"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#0a0a0a"; e.currentTarget.style.color = "#fafafa"; }}>
          Hire me
        </button>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   SECTION LABEL
═══════════════════════════════════════════ */
function Label({ index, text }: { index: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
      <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", fontWeight: 700, color: "#bbb", letterSpacing: "0.2em", textTransform: "uppercase" as const }}>{index}</span>
      <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
      <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", color: "#bbb", letterSpacing: "0.15em", textTransform: "uppercase" as const }}>{text}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PHOTO CELL  — position:absolute image always fills
═══════════════════════════════════════════ */
function Cell({ w, onClick }: { w: Work; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ position: "relative", overflow: "hidden", cursor: "pointer", width: "100%", height: "100%", background: "#111" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://picsum.photos/seed/${w.seed}/800/1000?grayscale`} alt={w.title}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block",
          filter: hov ? "brightness(0.5)" : "brightness(0.88)",
          transform: hov ? "scale(1.05)" : "scale(1)",
          transition: "filter 0.5s ease, transform 0.65s ease" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "1.25rem", opacity: hov ? 1 : 0, transition: "opacity 0.3s ease", pointerEvents: "none" }}>
        <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: "0.3rem" }}>
          {w.cat} · {w.year}
        </span>
        <span style={{ fontFamily: "var(--tpl-serif,serif)", fontStyle: "italic", fontSize: "20px", color: "#fafafa", lineHeight: 1.2 }}>
          {w.title}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LIGHTBOX  (zoom + drag, same as dashboard)
═══════════════════════════════════════════ */
function Lightbox({ works, startIndex, onClose }: { works: Work[]; startIndex: number; onClose: () => void }) {
  const [index, setIndex]     = useState(startIndex);
  const [zoom, setZoom]       = useState(1);
  const [offset, setOffset]   = useState({ x: 0, y: 0 });
  const [dragging, setDrag]   = useState(false);
  const dragRef               = useRef({ sx: 0, sy: 0, ox: 0, oy: 0 });
  const containerRef          = useRef<HTMLDivElement>(null);
  const w                     = works[index]!;

  const resetView = useCallback(() => { setZoom(1); setOffset({ x: 0, y: 0 }); }, []);

  // Keyboard nav
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape")      onClose();
      if (e.key === "ArrowRight")  { setIndex((i) => Math.min(i + 1, works.length - 1)); resetView(); }
      if (e.key === "ArrowLeft")   { setIndex((i) => Math.max(i - 1, 0)); resetView(); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, works.length, resetView]);

  // Wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const fn = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((prev) => {
        const next = Math.min(Math.max(prev * (e.deltaY < 0 ? 1.12 : 0.9), 1), 8);
        if (next === 1) setOffset({ x: 0, y: 0 });
        return next;
      });
    };
    el.addEventListener("wheel", fn, { passive: false });
    return () => el.removeEventListener("wheel", fn);
  }, []);

  const prev = () => { setIndex((i) => Math.max(i - 1, 0)); resetView(); };
  const next = () => { setIndex((i) => Math.min(i + 1, works.length - 1)); resetView(); };
  const onMD = (e: React.MouseEvent) => { if (zoom <= 1) return; e.preventDefault(); setDrag(true); dragRef.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y }; };
  const onMM = (e: React.MouseEvent) => { if (!dragging) return; setOffset({ x: dragRef.current.ox + e.clientX - dragRef.current.sx, y: dragRef.current.oy + e.clientY - dragRef.current.sy }); };
  const onMU = () => setDrag(false);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, background: "#000", display: "flex", flexDirection: "column", userSelect: "none" }}>
      {/* Top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)", pointerEvents: "none" }}>
        <button style={{ pointerEvents: "auto", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", padding: "4px 8px", fontFamily: "var(--tpl-mono,monospace)", fontSize: "11px", display: "flex", alignItems: "center", gap: "6px" }}
          onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
          {w.title} &nbsp;·&nbsp; {index + 1} / {works.length}
        </span>
        <div style={{ display: "flex", gap: "4px", pointerEvents: "auto" }}>
          {zoom > 1 && (
            <button onClick={resetView} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "4px 10px", fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", borderRadius: "4px" }}>
              {Math.round(zoom * 100)}% · Reset
            </button>
          )}
        </div>
      </div>

      {/* Image */}
      <div ref={containerRef} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "64px",
        cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default", overflow: "hidden" }}
        onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://picsum.photos/seed/${w.seed}/1400/900?grayscale`} alt={w.title} draggable={false}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", pointerEvents: "none", display: "block",
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, transformOrigin: "center",
            transition: dragging ? "none" : "transform 0.15s ease" }} />
      </div>

      {/* Prev / Next arrows */}
      {index > 0 && (
        <button onClick={prev} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", cursor: "pointer", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", transition: "background 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
      )}
      {index < works.length - 1 && (
        <button onClick={next} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", cursor: "pointer", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", transition: "background 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      )}

      {/* Bottom info */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 20px", background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", pointerEvents: "none" }}>
        <div>
          <div style={{ fontFamily: "var(--tpl-serif,serif)", fontStyle: "italic", fontSize: "18px", color: "#fff", marginBottom: "2px" }}>{w.title}</div>
          <div style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{w.cat} · {w.year}</div>
        </div>
        <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>{w.w} × {w.h}px</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   GALLERY MODAL  (full-screen, scrollable grid)
═══════════════════════════════════════════ */
function GalleryModal({ onClose }: { onClose: () => void }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState("All");

  const cats = ["All", ...Array.from(new Set(WORKS.map((w) => w.cat)))];
  const visible = filter === "All" ? WORKS : WORKS.filter((w) => w.cat === filter);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Escape to close
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape" && lightboxIndex === null) onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, lightboxIndex]);

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "#0a0a0a", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2.5rem", height: "60px", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--tpl-mono,monospace)", fontSize: "11px", padding: 0, transition: "color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <span style={{ fontFamily: "var(--tpl-serif,serif)", fontStyle: "italic", fontSize: "18px", color: "#fff" }}>All Work</span>
            <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>{visible.length} projects</span>
          </div>

          {/* Category filter pills */}
          <div style={{ display: "flex", gap: "6px" }}>
            {cats.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)}
                style={{ background: filter === cat ? "#fff" : "rgba(255,255,255,0.06)", border: "1px solid", borderColor: filter === cat ? "#fff" : "rgba(255,255,255,0.1)", color: filter === cat ? "#0a0a0a" : "rgba(255,255,255,0.5)", fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 12px", cursor: "pointer", transition: "all 0.15s" }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable grid */}
        <div style={{ flex: 1, overflowY: "auto", padding: "2rem 2.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "3px" }}>
            {visible.map((w, i) => (
              <div key={w.id} style={{ aspectRatio: "4/5", cursor: "pointer" }} onClick={() => setLightboxIndex(i)}>
                <Cell w={w} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox on top of gallery */}
      {lightboxIndex !== null && (
        <Lightbox
          works={visible}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function MinimalBWTemplate() {
  const [galleryOpen, setGalleryOpen] = useState(false);

  // Featured works shown in the homepage grid (first 8)
  const featured = WORKS.slice(0, 8);

  return (
    <div style={{ background: "#fafafa", color: "#0a0a0a", minHeight: "100vh", fontFamily: "var(--tpl-sans,sans-serif)" }}>
      <Nav onOpenGallery={() => setGalleryOpen(true)} />

      {/* ════ HERO ════ */}
      <section style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", paddingTop: "72px" }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "5rem 5rem 5rem 7vw" }}>
          <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", letterSpacing: "0.25em", color: "#999", textTransform: "uppercase", marginBottom: "2.5rem" }}>
            Documentary & Portrait · New York
          </span>
          <h1 style={{ fontFamily: "var(--tpl-serif,serif)", fontWeight: 300, fontSize: "clamp(72px, 8vw, 128px)", lineHeight: 0.92, letterSpacing: "-0.02em", color: "#0a0a0a", margin: 0 }}>
            James<br /><span style={{ fontStyle: "italic" }}>Hollis</span>
          </h1>
          <div style={{ width: "48px", height: "1px", background: "#0a0a0a", margin: "2.5rem 0" }} />
          <p style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontWeight: 300, fontSize: "15px", lineHeight: 1.7, color: "#555", maxWidth: "360px" }}>
            Documenting the quiet tension between presence and absence. Work exhibited across North America and Europe.
          </p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "3rem" }}>
            <button onClick={() => setGalleryOpen(true)}
              style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fafafa", background: "#0a0a0a", padding: "13px 28px", border: "1px solid #0a0a0a", cursor: "pointer", transition: "background 0.2s, color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0a0a0a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#0a0a0a"; e.currentTarget.style.color = "#fafafa"; }}>
              View work
            </button>
            <a href="#about"
              style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", color: "#0a0a0a", background: "transparent", padding: "13px 28px", border: "1px solid #ccc", textDecoration: "none", transition: "border-color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0a0a0a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ccc"; }}>
              About
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "auto", paddingTop: "4rem" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.6)" }} />
            <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", color: "#888", letterSpacing: "0.12em" }}>
              Available for commissions — Q4 2025
            </span>
          </div>
        </div>

        {/* Right — two stacked photos */}
        <div style={{ display: "grid", gridTemplateRows: "60% 40%", gap: "3px" }}>
          <div style={{ position: "relative", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://picsum.photos/seed/201/900/1100?grayscale" alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.88)" }} />
          </div>
          <div style={{ position: "relative", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://picsum.photos/seed/202/900/700?grayscale" alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.82)" }} />
          </div>
        </div>
      </section>

      {/* ════ WORK ════ */}
      <section id="work" style={{ padding: "7rem 7vw" }}>
        <Label index="01" text="Selected Work" />

        {/*
          Flat grid — explicit pixel rows, position:absolute images.
          cols: [2fr 1fr 1fr]   rows: [280px 280px 360px 320px]
        */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "280px 280px 360px 320px", gap: "3px" }}>
          <div style={{ gridRow: "1/3", gridColumn: "1" }}>      <Cell w={featured[0]!} onClick={() => setGalleryOpen(true)} /></div>
          <div style={{ gridRow: "1",   gridColumn: "2" }}>      <Cell w={featured[1]!} onClick={() => setGalleryOpen(true)} /></div>
          <div style={{ gridRow: "1",   gridColumn: "3" }}>      <Cell w={featured[2]!} onClick={() => setGalleryOpen(true)} /></div>
          <div style={{ gridRow: "2",   gridColumn: "2" }}>      <Cell w={featured[3]!} onClick={() => setGalleryOpen(true)} /></div>
          <div style={{ gridRow: "2",   gridColumn: "3" }}>      <Cell w={featured[4]!} onClick={() => setGalleryOpen(true)} /></div>
          <div style={{ gridRow: "3",   gridColumn: "1/3" }}>    <Cell w={featured[5]!} onClick={() => setGalleryOpen(true)} /></div>
          <div style={{ gridRow: "3",   gridColumn: "3" }}>      <Cell w={featured[6]!} onClick={() => setGalleryOpen(true)} /></div>
          <div style={{ gridRow: "4",   gridColumn: "1" }}>      <Cell w={featured[7]!} onClick={() => setGalleryOpen(true)} /></div>
          <div style={{ gridRow: "4",   gridColumn: "2/4" }}>    <Cell w={featured[0]!} onClick={() => setGalleryOpen(true)} /></div>
        </div>

        {/* All projects button */}
        <div style={{ marginTop: "3rem", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => setGalleryOpen(true)}
            style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#0a0a0a", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid #0a0a0a", paddingBottom: "2px", transition: "opacity 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.45"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
            All projects ({WORKS.length})
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>

      {/* ════ PULL QUOTE ════ */}
      <section style={{ padding: "6rem 7vw", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
        <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>On practice</span>
        <blockquote style={{ fontFamily: "var(--tpl-serif,serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.3, color: "#f0f0f0", maxWidth: "900px", textAlign: "center", margin: 0, letterSpacing: "-0.01em" }}>
          &ldquo;The camera is an instrument that teaches people how to see without a camera.&rdquo;
        </blockquote>
        <cite style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", fontStyle: "normal" }}>
          — Dorothea Lange
        </cite>
      </section>

      {/* ════ ABOUT ════ */}
      <section id="about" style={{ padding: "7rem 7vw", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
        <div>
          <Label index="02" text="About" />
          <h2 style={{ fontFamily: "var(--tpl-serif,serif)", fontWeight: 400, fontSize: "clamp(36px, 4vw, 56px)", lineHeight: 1.1, color: "#0a0a0a", margin: "0 0 2rem", letterSpacing: "-0.02em" }}>
            A career built on<br /><span style={{ fontStyle: "italic" }}>patience</span>
          </h2>
          <p style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontWeight: 300, fontSize: "15px", lineHeight: 1.8, color: "#4a4a4a", marginBottom: "1.5rem" }}>
            James Hollis is a New York-based documentary and portrait photographer with over a decade of work spanning editorial commissions, personal projects, and exhibition photography.
          </p>
          <p style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontWeight: 300, fontSize: "15px", lineHeight: 1.8, color: "#4a4a4a", marginBottom: "2.5rem" }}>
            His long-form projects explore the intersection of memory, geography, and identity — often through extended collaborations with communities in transition.
          </p>
          <div style={{ display: "flex", gap: "3rem", paddingTop: "2rem", borderTop: "1px solid #e0e0e0" }}>
            {STATS.map((s) => (
              <div key={s.value}>
                <div style={{ fontFamily: "var(--tpl-serif,serif)", fontSize: "36px", fontWeight: 300, color: "#0a0a0a", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "12px", color: "#888", marginTop: "4px" }}>{s.unit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Portrait photo — square crop, human seed */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Frame offset effect */}
          <div style={{ position: "absolute", top: "16px", left: "16px", right: "-16px", bottom: "-16px", border: "1px solid #d8d8d8", zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 1, width: "100%", aspectRatio: "4/5", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://picsum.photos/seed/1084/600/750?grayscale" alt="James Hollis"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "brightness(0.9)" }} />
          </div>
          {/* Caption tag */}
          <div style={{ position: "absolute", bottom: "-20px", right: "0px", zIndex: 2, background: "#fafafa", padding: "8px 14px", border: "1px solid #e8e8e8" }}>
            <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "#aaa", letterSpacing: "0.18em", textTransform: "uppercase" }}>Brooklyn, NY · 2024</span>
          </div>
        </div>
      </section>

      {/* ════ PRESS ════ */}
      <section id="press" style={{ padding: "5rem 7vw", background: "#f2f2f0", borderTop: "1px solid #e0e0e0" }}>
        <Label index="03" text="Press & Features" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1px", background: "#d8d8d8" }}>
          {PRESS.map((p) => (
            <div key={p.name} style={{ background: "#f2f2f0", padding: "2rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{ fontFamily: "var(--tpl-serif,serif)", fontSize: "18px", fontWeight: 400, color: "#0a0a0a", lineHeight: 1.2 }}>{p.name}</span>
              <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", color: "#aaa", letterSpacing: "0.15em" }}>{p.year}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ════ CONTACT ════ */}
      <section id="contact" style={{ padding: "8rem 7vw", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }}>
        <div>
          <Label index="04" text="Contact" />
          <h2 style={{ fontFamily: "var(--tpl-serif,serif)", fontWeight: 300, fontSize: "clamp(40px, 5vw, 72px)", lineHeight: 1.05, color: "#0a0a0a", margin: "0 0 2rem", letterSpacing: "-0.02em" }}>
            Let&apos;s create<br /><span style={{ fontStyle: "italic" }}>something.</span>
          </h2>
          <p style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontWeight: 300, fontSize: "14px", lineHeight: 1.7, color: "#666", marginBottom: "2.5rem" }}>
            For editorial commissions, exhibition inquiries, and long-form project proposals.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { label: "General",  value: "hello@jameshollis.com" },
              { label: "Bookings", value: "bookings@jameshollis.com" },
              { label: "Agent",    value: "+1 (212) 555 0184" },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", gap: "1.5rem", alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "#aaa", letterSpacing: "0.2em", textTransform: "uppercase", minWidth: "56px" }}>{row.label}</span>
                <span style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "13px", color: "#333" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {["First name", "Last name"].map((ph) => (
              <input key={ph} placeholder={ph}
                style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "13px", fontWeight: 300, padding: "12px 14px", border: "1px solid #d8d8d8", background: "transparent", color: "#0a0a0a", outline: "none", transition: "border-color 0.2s" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#0a0a0a"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#d8d8d8"; }} />
            ))}
          </div>
          <input type="email" placeholder="Email address"
            style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "13px", fontWeight: 300, padding: "12px 14px", border: "1px solid #d8d8d8", background: "transparent", color: "#0a0a0a", outline: "none", transition: "border-color 0.2s" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#0a0a0a"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "#d8d8d8"; }} />
          <textarea placeholder="Tell me about your project..." rows={5}
            style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "13px", fontWeight: 300, padding: "12px 14px", border: "1px solid #d8d8d8", background: "transparent", color: "#0a0a0a", outline: "none", resize: "vertical", transition: "border-color 0.2s" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#0a0a0a"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "#d8d8d8"; }} />
          <button type="submit"
            style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fafafa", background: "#0a0a0a", border: "1px solid #0a0a0a", padding: "14px", cursor: "pointer", transition: "background 0.2s, color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#0a0a0a"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#0a0a0a"; e.currentTarget.style.color = "#fafafa"; }}>
            Send message
          </button>
        </form>
      </section>

      {/* ════ FOOTER ════ */}
      <footer style={{ padding: "2.5rem 7vw", borderTop: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem" }}>
        <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "#0a0a0a" }}>J·H</span>
        <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "#bbb", letterSpacing: "0.12em" }}>© 2025 James Hollis Photography</span>
        <div style={{ display: "flex", gap: "2rem" }}>
          {["Instagram", "Behance", "Vimeo"].map((s) => (
            <a key={s} href="#"
              style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "11px", color: "#888", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#0a0a0a"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#888"; }}>
              {s}
            </a>
          ))}
        </div>
      </footer>

      {/* ════ GALLERY MODAL ════ */}
      {galleryOpen && <GalleryModal onClose={() => setGalleryOpen(false)} />}
    </div>
  );
}
