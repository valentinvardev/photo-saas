"use client";

import { useState } from "react";

/* ─── Brooklyn Links ─────────────────────────────────────────────
   Same design language as the Brooklyn portfolio template.
   Urban, high-contrast, red accents, Space Grotesk / Space Mono.
─────────────────────────────────────────────────────────────── */

const RED   = "#E8382C";
const BLACK = "#0D0D0D";
const STONE = "#F0EFE9";
const GRAY  = "#7A7A7A";
const DIM   = "#2A2A2A";

const SERIF = "var(--bk-serif), 'DM Serif Display', Georgia, serif";
const SANS  = "var(--bk-sans), 'Space Grotesk', system-ui, sans-serif";
const MONO  = "var(--bk-mono), 'Space Mono', monospace";

const LINKS = [
  { label: "Portfolio",         sub: "View my full work",       href: "#", accent: false },
  { label: "Book a session",    sub: "Portraits · Weddings · Editorial", href: "#", accent: true  },
  { label: "Client gallery",    sub: "Download your photos",    href: "#", accent: false },
  { label: "Print shop",        sub: "Limited edition prints",  href: "#", accent: false },
  { label: "Instagram",         sub: "@morrison.photo",         href: "#", accent: false },
  { label: "Contact",           sub: "hello@morrison.photo",    href: "#", accent: false },
];

const STATS = [
  { value: "12", label: "Years" },
  { value: "800+", label: "Sessions" },
  { value: "NYC", label: "Based" },
];

export default function BrooklynLinksPage() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <main style={{ fontFamily: SANS, background: BLACK, color: STONE, minHeight: "100dvh", display: "flex", flexDirection: "column" }}>

      {/* Red top bar */}
      <div style={{ height: 3, background: RED, flexShrink: 0 }} />

      {/* Marquee strip */}
      <div style={{
        background: RED, overflow: "hidden", height: 28,
        display: "flex", alignItems: "center",
        flexShrink: 0,
      }}>
        <div style={{
          display: "flex", gap: 0,
          animation: "marquee-links 22s linear infinite",
          whiteSpace: "nowrap",
        }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: BLACK, padding: "0 32px" }}>
              Morrison Photo · NYC · est. 2013 · Book now ·&nbsp;
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-links {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      {/* Main content */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
        padding: "56px 24px 64px",
        maxWidth: 520, margin: "0 auto", width: "100%",
      }}>

        {/* Avatar */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          overflow: "hidden", marginBottom: 24,
          border: `2px solid ${DIM}`,
          flexShrink: 0,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://picsum.photos/seed/700/160/160" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        {/* Name */}
        <h1 style={{
          fontFamily: SERIF, fontStyle: "italic",
          fontSize: "clamp(32px, 8vw, 48px)",
          fontWeight: 400, color: STONE,
          letterSpacing: "-0.02em", lineHeight: 1,
          margin: "0 0 6px", textAlign: "center",
        }}>
          Morrison
        </h1>
        <p style={{
          fontFamily: MONO, fontSize: 10, letterSpacing: "0.28em",
          textTransform: "uppercase", color: RED,
          margin: "0 0 8px",
        }}>
          Photographer
        </p>
        <p style={{
          fontFamily: SANS, fontSize: 13, color: GRAY,
          textAlign: "center", lineHeight: 1.6,
          margin: "0 0 36px", maxWidth: 320,
        }}>
          Documentary + Portrait + Editorial · New York City
        </p>

        {/* Links */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
          {LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 20px",
                background: link.accent
                  ? (hovered === i ? "#c0291f" : RED)
                  : (hovered === i ? DIM : "#161616"),
                border: `1px solid ${link.accent ? "transparent" : (hovered === i ? GRAY : "#1f1f1f")}`,
                color: link.accent ? BLACK : STONE,
                textDecoration: "none",
                transition: "background 0.2s, border-color 0.2s, transform 0.15s",
                transform: hovered === i ? "translateX(4px)" : "translateX(0)",
              }}
            >
              <div>
                <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>
                  {link.label}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", marginTop: 2, opacity: 0.6 }}>
                  {link.sub}
                </div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ opacity: hovered === i ? 1 : 0.3, transition: "opacity 0.2s, transform 0.2s", transform: hovered === i ? "translateX(2px)" : "none", flexShrink: 0 }}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: 0, marginTop: 48, width: "100%",
          borderTop: `1px solid ${DIM}`, paddingTop: 32,
          justifyContent: "space-around",
        }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 32, fontWeight: 400, color: STONE, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: GRAY, marginTop: 5 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 48, display: "flex", alignItems: "center", gap: 4,
          fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em",
          textTransform: "uppercase", color: DIM,
        }}>
          <span>Built with</span>
          <span style={{ color: RED, fontWeight: 700 }}>FRAME</span>
        </div>
      </div>
    </main>
  );
}
