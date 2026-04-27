"use client";

import { useState } from "react";

const SERIF = "var(--atelier-serif), 'Cormorant Garamond', 'Playfair Display', Georgia, serif";
const SANS  = "var(--atelier-sans), Inter, -apple-system, sans-serif";
const MONO  = "var(--atelier-mono), 'Space Mono', ui-monospace, monospace";

const HERO_SEED = 1015;

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

export default function AtelierTemplate() {
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
            <Plate key={p.seed} seed={p.seed} idx={i} total={PHOTOS.length} col={p.col} row={p.row} />
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
function Plate({ seed, idx, total, col, row }: { seed: number; idx: number; total: number; col: number; row: number }) {
  const [hover, setHover] = useState(false);
  return (
    <figure
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        gridColumn: `span ${col}`, gridRow: `span ${row}`,
        margin: 0, position: "relative", overflow: "hidden",
        background: "#0a0a0a", cursor: "pointer",
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
          ↓ Download
        </span>
      </figcaption>
    </figure>
  );
}
