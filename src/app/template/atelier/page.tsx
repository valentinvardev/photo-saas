"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SERIF = "var(--atelier-serif), 'Cormorant Garamond', 'Playfair Display', Georgia, serif";
const SANS  = "var(--atelier-sans), Inter, -apple-system, sans-serif";
const MONO  = "var(--atelier-mono), 'Space Mono', ui-monospace, monospace";

const HERO_SEED = 1015;
const ATELIER_PASSWORD = "sarah2026";

/* Editorial layout — each photo gets a deliberate column/row span to create rhythm */
const PHOTOS: { seed: number; col: number; row: number }[] = [
  { seed: 201,  col: 8, row: 5 },  // big feature
  { seed: 1024, col: 4, row: 5 },  // tall
  { seed: 1015, col: 4, row: 3 },
  { seed: 433,  col: 4, row: 3 },
  { seed: 64,   col: 4, row: 3 },
  { seed: 100,  col: 6, row: 4 },  // mid
  { seed: 357,  col: 6, row: 4 },
  { seed: 200,  col: 4, row: 3 },
  { seed: 250,  col: 8, row: 4 },  // wide
  { seed: 300,  col: 4, row: 4 },
  { seed: 1042, col: 6, row: 3 },
  { seed: 1080, col: 6, row: 3 },
  { seed: 411,  col: 4, row: 4 },
  { seed: 522,  col: 8, row: 4 },  // wide
];

export default function AtelierPage() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  return <AtelierGallery />;
}

function AtelierGallery() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <main style={{ background: "#fafaf8", color: "#0a0a0a", fontFamily: SANS, minHeight: "100vh" }}>

      {/* ── Top nav ─────────────────────────────────────────── */}
      <Topbar />

      {/* ── Hero ────────────────────────────────────────────── */}
      <header style={{ padding: "140px 48px 80px", textAlign: "center", maxWidth: 980, margin: "0 auto" }}>
        <p style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#7a766f", marginBottom: 36 }}>
          A celebration in motion · 247 photographs
        </p>
        <h1 style={{
          fontFamily: SERIF, fontSize: "clamp(72px, 12vw, 152px)",
          fontWeight: 300, lineHeight: 0.92, letterSpacing: "-0.035em",
          margin: 0, marginBottom: 20, color: "#0a0a0a",
        }}>
          Sarah <span style={{ fontStyle: "italic", fontWeight: 400, color: "#3a3a3a" }}>&amp;</span> James
        </h1>
        <p style={{
          fontFamily: SERIF, fontSize: "clamp(20px, 2.4vw, 28px)",
          fontStyle: "italic", color: "#4a4742", lineHeight: 1.4,
          fontWeight: 300, maxWidth: 640, margin: "0 auto",
        }}>
          A weekend in the gardens of Buenos Aires, captured at the slowest pace.
        </p>
        <div style={{ width: 1, height: 48, background: "#0a0a0a", margin: "72px auto 0" }} />
      </header>

      {/* ── Hero photo ──────────────────────────────────────── */}
      <section style={{ padding: "0 48px 96px", maxWidth: 1480, margin: "0 auto" }}>
        <div style={{ aspectRatio: "16/9", overflow: "hidden", background: "#000", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.25)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://picsum.photos/seed/${HERO_SEED}/2400/1350`}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#7a766f" }}>
            Plate 01 · The cover
          </p>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 16, color: "#4a4742" }}>
            April 14, 2026
          </p>
        </div>
      </section>

      {/* ── Section divider ─────────────────────────────────── */}
      <section style={{
        padding: "80px 48px 56px",
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        borderTop: "1px solid #d8d4cc",
        maxWidth: 1480, margin: "0 auto",
        flexWrap: "wrap", gap: 24,
      }}>
        <div>
          <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#7a766f", marginBottom: 12 }}>
            II
          </p>
          <h2 style={{
            fontFamily: SERIF, fontSize: "clamp(44px, 6vw, 72px)",
            fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.015em",
            margin: 0, lineHeight: 1, color: "#0a0a0a",
          }}>
            The collection
          </h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#7a766f" }}>
            247 photographs · curated by hand
          </p>
        </div>
      </section>

      {/* ── Editorial grid ──────────────────────────────────── */}
      <section style={{ padding: "0 48px 96px", maxWidth: 1480, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, 1fr)",
          gap: 16,
          gridAutoRows: "84px",
        }}>
          {PHOTOS.map((p, i) => (
            <Plate
              key={p.seed}
              seed={p.seed}
              idx={i}
              total={PHOTOS.length}
              col={p.col}
              row={p.row}
              onOpen={() => setLightboxIdx(i)}
            />
          ))}
        </div>
      </section>

      {/* ── Pull quote ──────────────────────────────────────── */}
      <section style={{
        padding: "120px 48px",
        maxWidth: 880, margin: "0 auto",
        textAlign: "center",
        borderTop: "1px solid #d8d4cc",
        borderBottom: "1px solid #d8d4cc",
      }}>
        <p style={{
          fontFamily: SERIF, fontSize: "clamp(28px, 3.8vw, 44px)",
          fontWeight: 300, fontStyle: "italic", lineHeight: 1.35,
          letterSpacing: "-0.005em", margin: 0, color: "#1a1a1a",
        }}>
          &ldquo;The slowest, most beautiful afternoon. Every moment looked like
          it was already a memory.&rdquo;
        </p>
        <p style={{ marginTop: 32, fontFamily: MONO, fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: "#7a766f" }}>
          Felipe Aravena · Photographer
        </p>
      </section>

      {/* ── Closing block ───────────────────────────────────── */}
      <section style={{ padding: "96px 48px 80px", maxWidth: 1480, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div style={{ aspectRatio: "4/5", overflow: "hidden", background: "#000" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://picsum.photos/seed/606/1000/1250`}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <p style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#7a766f", marginBottom: 24 }}>
              III · A note
            </p>
            <h3 style={{
              fontFamily: SERIF, fontSize: "clamp(36px, 4.5vw, 56px)",
              fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.015em",
              lineHeight: 1.05, margin: 0, marginBottom: 28, color: "#0a0a0a",
            }}>
              Thank you for letting us be there.
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#3a3a3a", maxWidth: 460, marginBottom: 28 }}>
              Your gallery is yours forever. Download the full collection in
              high resolution, share single images with anyone you&rsquo;d like, or
              print directly through the studio.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#download" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 26px", background: "#0a0a0a", color: "#fafaf8",
                fontFamily: MONO, fontSize: 11, letterSpacing: "0.18em",
                textTransform: "uppercase", textDecoration: "none",
              }}>
                Download all
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              </a>
              <a href="#print" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 26px", background: "transparent", color: "#0a0a0a",
                border: "1px solid #0a0a0a",
                fontFamily: MONO, fontSize: 11, letterSpacing: "0.18em",
                textTransform: "uppercase", textDecoration: "none",
              }}>
                Order prints
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{
        padding: "48px 48px 64px",
        borderTop: "1px solid #d8d4cc",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        flexWrap: "wrap", gap: 32,
      }}>
        <div>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 28, color: "#0a0a0a", margin: 0, marginBottom: 8, fontWeight: 300, letterSpacing: "-0.01em" }}>
            Atelier
          </p>
          <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7a766f" }}>
            © 2026 · Buenos Aires
          </p>
        </div>
        <nav style={{ display: "flex", gap: 28, fontFamily: MONO, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          <a href="#contact" style={{ color: "#3a3a3a", textDecoration: "none", borderBottom: "1px solid transparent", paddingBottom: 2 }}>Contact</a>
          <a href="#instagram" style={{ color: "#3a3a3a", textDecoration: "none", borderBottom: "1px solid transparent", paddingBottom: 2 }}>Instagram</a>
          <a href="#print" style={{ color: "#3a3a3a", textDecoration: "none", borderBottom: "1px solid transparent", paddingBottom: 2 }}>Print shop</a>
        </nav>
      </footer>

      {/* ── Lightbox ────────────────────────────────────────── */}
      {lightboxIdx !== null && (
        <Lightbox photos={PHOTOS} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
    </main>
  );
}

/* ── Top nav with scroll-aware backdrop ───────────────────── */
function Topbar() {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      display: "grid", gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center",
      padding: "22px 48px",
      borderBottom: "1px solid rgba(216,212,204,0.6)",
      background: "rgba(250,250,248,0.85)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      fontFamily: MONO, fontSize: 11, letterSpacing: "0.22em",
      textTransform: "uppercase", color: "#0a0a0a",
    }}>
      <span>Atelier</span>
      <span style={{ color: "#7a766f", textAlign: "center" }}>Sarah &amp; James · Apr 2026</span>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 24 }}>
        <a href="#collection" style={{ color: "#0a0a0a", textDecoration: "none" }}>The collection</a>
        <a href="#download" style={{
          color: "#0a0a0a", textDecoration: "none",
          borderBottom: "1px solid #0a0a0a", paddingBottom: 1,
        }}>Download ↓</a>
      </div>
    </nav>
  );
}

/* ── Single photo plate with hover state ──────────────────── */
function Plate({ seed, idx, total, col, row, onOpen }: { seed: number; idx: number; total: number; col: number; row: number; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <figure
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onOpen}
      style={{
        gridColumn: `span ${col}`, gridRow: `span ${row}`,
        margin: 0, position: "relative", overflow: "hidden",
        background: "#0a0a0a", cursor: "zoom-in",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${seed}/${col * 200}/${row * 220}`}
        alt=""
        style={{
          width: "100%", height: "100%", objectFit: "cover", display: "block",
          transition: "transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1), filter 500ms ease",
          transform: hover ? "scale(1.04)" : "scale(1)",
          filter: hover ? "saturate(1.05)" : "saturate(0.96)",
        }}
      />
      {/* Hover veil */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 50%)",
        opacity: hover ? 1 : 0.6,
        transition: "opacity 300ms ease",
        pointerEvents: "none",
      }} />
      {/* Caption */}
      <figcaption style={{
        position: "absolute", bottom: 14, left: 16, right: 16,
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        color: "#fafaf8",
        transition: "transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        transform: hover ? "translateY(0)" : "translateY(2px)",
      }}>
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", opacity: 0.85 }}>
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <span style={{
          fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
          opacity: hover ? 1 : 0,
          transition: "opacity 300ms ease",
        }}>
          ↗ Open
        </span>
      </figcaption>
    </figure>
  );
}

/* ── Password gate ────────────────────────────────────────── */
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.trim().toLowerCase() === ATELIER_PASSWORD) onUnlock();
    else setError(true);
  };

  return (
    <div style={{
      minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
      background: `linear-gradient(135deg, rgba(10,10,10,0.85), rgba(10,10,10,0.65)), url(https://picsum.photos/seed/${HERO_SEED}/2400/1350) center/cover`,
      color: "#fafaf8",
    }}>
      <form onSubmit={submit} style={{
        width: 440, maxWidth: "100%",
        background: "rgba(10,10,10,0.55)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.08)",
        padding: "56px 48px",
        textAlign: "center",
      }}>
        {/* Tiny mark */}
        <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 28 }}>
          Atelier · Private
        </p>

        {/* Title */}
        <h1 style={{
          fontFamily: SERIF, fontSize: 56, fontWeight: 300,
          letterSpacing: "-0.02em", lineHeight: 1, margin: 0, marginBottom: 12,
          color: "#fafaf8",
        }}>
          Sarah <span style={{ fontStyle: "italic", fontWeight: 400 }}>&amp;</span> James
        </h1>
        <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 16, color: "rgba(250,250,248,0.7)", marginBottom: 40, fontWeight: 300 }}>
          A private gallery awaits.
        </p>

        {/* Divider */}
        <div style={{ width: 32, height: 1, background: "rgba(255,255,255,0.3)", margin: "0 auto 36px" }} />

        {/* Input */}
        <label style={{ display: "block", fontFamily: MONO, fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 12, textAlign: "left" }}>
          Access key
        </label>
        <input
          autoFocus type="password" value={pwd}
          onChange={(e) => { setPwd(e.target.value); setError(false); }}
          placeholder="Enter the password from your photographer"
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "14px 0",
            background: "transparent",
            border: "none",
            borderBottom: error ? "1px solid #f59e9e" : "1px solid rgba(255,255,255,0.25)",
            color: "#fafaf8",
            fontFamily: SERIF, fontSize: 18, fontStyle: "italic",
            outline: "none",
            textAlign: "left",
          }}
        />
        {error && (
          <p style={{ marginTop: 12, fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#f59e9e", textAlign: "left" }}>
            Incorrect — try again
          </p>
        )}

        {/* CTA */}
        <button type="submit" style={{
          marginTop: 36, width: "100%",
          padding: "16px 24px",
          background: "#fafaf8", color: "#0a0a0a",
          border: "none", cursor: "pointer",
          fontFamily: MONO, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700,
        }}>
          Enter the gallery
        </button>

        <p style={{ marginTop: 32, fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
          Hint: sarah2026
        </p>
      </form>
    </div>
  );
}

/* ── Lightbox ─────────────────────────────────────────────── */
function Lightbox({ photos, startIndex, onClose }: { photos: typeof PHOTOS; startIndex: number; onClose: () => void }) {
  const [index, setIndex]   = useState(startIndex);
  const [zoom, setZoom]     = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDrag] = useState(false);
  const dragRef             = useRef({ sx: 0, sy: 0, ox: 0, oy: 0 });
  const containerRef        = useRef<HTMLDivElement>(null);
  const photo               = photos[index]!;

  const resetView = useCallback(() => { setZoom(1); setOffset({ x: 0, y: 0 }); }, []);
  const prev = useCallback(() => { setIndex((i) => Math.max(i - 1, 0)); resetView(); }, [resetView]);
  const next = useCallback(() => { setIndex((i) => Math.min(i + 1, photos.length - 1)); resetView(); }, [photos.length, resetView]);

  // Keyboard
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
    };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose, next, prev]);

  // Wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const fn = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((prev) => {
        const nextZoom = Math.min(Math.max(prev * (e.deltaY < 0 ? 1.12 : 0.9), 1), 8);
        if (nextZoom === 1) setOffset({ x: 0, y: 0 });
        return nextZoom;
      });
    };
    el.addEventListener("wheel", fn, { passive: false });
    return () => el.removeEventListener("wheel", fn);
  }, []);

  const onMD = (e: React.MouseEvent) => { if (zoom <= 1) return; e.preventDefault(); setDrag(true); dragRef.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y }; };
  const onMM = (e: React.MouseEvent) => { if (!dragging) return; setOffset({ x: dragRef.current.ox + e.clientX - dragRef.current.sx, y: dragRef.current.oy + e.clientY - dragRef.current.sy }); };
  const onMU = () => setDrag(false);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, background: "#0a0a0a", display: "flex", flexDirection: "column", userSelect: "none" }}>
      {/* Top bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)", pointerEvents: "none" }}>
        <button onClick={onClose} style={{ pointerEvents: "auto", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", padding: "6px 10px", fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
        <div style={{ pointerEvents: "auto", display: "flex", gap: 8 }}>
          {zoom > 1 && (
            <button onClick={resetView} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)", cursor: "pointer", padding: "5px 10px", fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              {Math.round(zoom * 100)}% · Reset
            </button>
          )}
          <button style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)", cursor: "pointer", padding: "5px 12px", fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase" }}>
            ↓ Download
          </button>
        </div>
      </div>

      {/* Image */}
      <div
        ref={containerRef}
        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "72px 64px", cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default", overflow: "hidden" }}
        onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/${photo.seed}/1800/1200`}
          alt=""
          draggable={false}
          style={{
            maxWidth: "100%", maxHeight: "100%", objectFit: "contain",
            pointerEvents: "none", display: "block",
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: "center",
            transition: dragging ? "none" : "transform 0.18s ease",
          }}
        />
      </div>

      {/* Nav arrows */}
      {index > 0 && (
        <button onClick={prev} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", cursor: "pointer", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
      )}
      {index < photos.length - 1 && (
        <button onClick={next} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", cursor: "pointer", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      )}

      {/* Bottom info */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 24px", background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", pointerEvents: "none" }}>
        <div>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 22, color: "#fafaf8", margin: 0, marginBottom: 4, fontWeight: 300, letterSpacing: "-0.005em" }}>
            Plate {String(index + 1).padStart(2, "0")}
          </p>
          <p style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", margin: 0 }}>
            Sarah &amp; James · Apr 14, 2026
          </p>
        </div>
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
          Scroll to zoom · ← → to navigate
        </span>
      </div>
    </div>
  );
}
