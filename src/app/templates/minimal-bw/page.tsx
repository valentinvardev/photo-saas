"use client";

import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────
   Minimal BW — A portfolio template for FRAME
   Fonts: Cormorant Garamond · DM Sans · Space Mono
───────────────────────────────────────────── */

const WORKS = [
  { id: 1,  seed: 20,  title: "Wanderers",          year: "2024", cat: "Documentary" },
  { id: 2,  seed: 37,  title: "The Quiet City",      year: "2023", cat: "Urban" },
  { id: 3,  seed: 48,  title: "Peripheral",          year: "2023", cat: "Street" },
  { id: 4,  seed: 63,  title: "Aftermath",           year: "2022", cat: "Documentary" },
  { id: 5,  seed: 71,  title: "Still Life No. 4",    year: "2022", cat: "Studio" },
  { id: 6,  seed: 82,  title: "Northern Light",      year: "2024", cat: "Landscape" },
  { id: 7,  seed: 95,  title: "Between Sessions",    year: "2021", cat: "Portrait" },
  { id: 8,  seed: 108, title: "Threshold",           year: "2021", cat: "Documentary" },
];

const STATS = [
  { value: "14", unit: "Years",    label: "of practice" },
  { value: "280+", unit: "Projects", label: "completed" },
  { value: "9",   unit: "Cities",   label: "worked in" },
];

const PRESS = [
  { name: "The New Yorker",  year: "2023" },
  { name: "Aperture",        year: "2022" },
  { name: "Foam Magazine",   year: "2022" },
  { name: "Zeit Magazin",    year: "2021" },
  { name: "LensCulture",     year: "2020" },
];

/* ── Nav ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 3rem",
        height: scrolled ? "52px" : "72px",
        borderBottom: scrolled ? "1px solid #e8e8e8" : "1px solid transparent",
        background: scrolled ? "rgba(250,250,250,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "height 0.3s ease, background 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Logo */}
      <span
        style={{
          fontFamily: "var(--tpl-mono, monospace)",
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: "#0a0a0a",
          textTransform: "uppercase",
        }}
      >
        J·H
      </span>

      {/* Links */}
      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
        {["Work", "About", "Press", "Contact"].map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase()}`}
            style={{
              fontFamily: "var(--tpl-sans, sans-serif)",
              fontSize: "12px",
              fontWeight: 400,
              letterSpacing: "0.06em",
              color: "#0a0a0a",
              textDecoration: "none",
              opacity: 0.55,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.55")}
          >
            {link}
          </a>
        ))}
        <a
          href="#contact"
          style={{
            fontFamily: "var(--tpl-sans, sans-serif)",
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.08em",
            color: "#fafafa",
            background: "#0a0a0a",
            padding: "7px 18px",
            border: "1px solid #0a0a0a",
            textDecoration: "none",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#0a0a0a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0a0a0a";
            e.currentTarget.style.color = "#fafafa";
          }}
        >
          Hire me
        </a>
      </div>
    </nav>
  );
}

/* ── Section label ── */
function Label({ index, text }: { index: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3.5rem" }}>
      <span
        style={{
          fontFamily: "var(--tpl-mono, monospace)",
          fontSize: "10px",
          fontWeight: 700,
          color: "#aaa",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        {index}
      </span>
      <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
      <span
        style={{
          fontFamily: "var(--tpl-mono, monospace)",
          fontSize: "10px",
          color: "#aaa",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        {text}
      </span>
    </div>
  );
}

/* ── Photo cell: image always fills the cell via absolute positioning ── */
function Cell({ w }: { w: typeof WORKS[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ position: "relative", overflow: "hidden", cursor: "pointer", background: "#111" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${w.seed}/800/1000?grayscale`}
        alt={w.title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          filter: hovered ? "brightness(0.55)" : "brightness(0.88)",
          transform: hovered ? "scale(1.05)" : "scale(1)",
          transition: "filter 0.5s ease, transform 0.65s ease",
        }}
      />
      {/* Hover label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "1.5rem",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      >
        <span style={{ fontFamily: "var(--tpl-mono, monospace)", fontSize: "9px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
          {w.cat} · {w.year}
        </span>
        <span style={{ fontFamily: "var(--tpl-serif, serif)", fontStyle: "italic", fontSize: "22px", color: "#fafafa", lineHeight: 1.2 }}>
          {w.title}
        </span>
      </div>
    </div>
  );
}

/* ── Main template page ── */
export default function MinimalBWTemplate() {
  return (
    <div
      style={{
        background: "#fafafa",
        color: "#0a0a0a",
        minHeight: "100vh",
        fontFamily: "var(--tpl-sans, sans-serif)",
      }}
    >
      <Nav />

      {/* ════ HERO ════ */}
      <section
        style={{
          minHeight: "100vh",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          paddingTop: "72px",
        }}
      >
        {/* Left — typography */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "5rem 5rem 5rem 7vw",
          }}
        >
          <span
            style={{
              fontFamily: "var(--tpl-mono, monospace)",
              fontSize: "10px",
              letterSpacing: "0.25em",
              color: "#999",
              textTransform: "uppercase",
              marginBottom: "2.5rem",
            }}
          >
            Documentary & Portrait · New York
          </span>

          <h1
            style={{
              fontFamily: "var(--tpl-serif, serif)",
              fontWeight: 300,
              fontSize: "clamp(72px, 8vw, 128px)",
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
              color: "#0a0a0a",
              margin: 0,
            }}
          >
            James
            <br />
            <span style={{ fontStyle: "italic" }}>Hollis</span>
          </h1>

          <div
            style={{
              width: "48px",
              height: "1px",
              background: "#0a0a0a",
              margin: "2.5rem 0",
            }}
          />

          <p
            style={{
              fontFamily: "var(--tpl-sans, sans-serif)",
              fontWeight: 300,
              fontSize: "15px",
              lineHeight: 1.7,
              color: "#555",
              maxWidth: "360px",
            }}
          >
            Documenting the quiet tension between presence and absence. Work exhibited across North America and Europe.
          </p>

          <div style={{ display: "flex", gap: "1rem", marginTop: "3rem" }}>
            <a
              href="#work"
              style={{
                fontFamily: "var(--tpl-sans, sans-serif)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#fafafa",
                background: "#0a0a0a",
                padding: "13px 28px",
                border: "1px solid #0a0a0a",
                textDecoration: "none",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#0a0a0a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#0a0a0a";
                e.currentTarget.style.color = "#fafafa";
              }}
            >
              View work
            </a>
            <a
              href="#about"
              style={{
                fontFamily: "var(--tpl-sans, sans-serif)",
                fontSize: "11px",
                fontWeight: 400,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                background: "transparent",
                padding: "13px 28px",
                border: "1px solid #ccc",
                textDecoration: "none",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0a0a0a")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ccc")}
            >
              About
            </a>
          </div>

          {/* Availability indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "auto", paddingTop: "4rem" }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 8px rgba(34,197,94,0.6)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--tpl-mono, monospace)",
                fontSize: "10px",
                color: "#888",
                letterSpacing: "0.12em",
              }}
            >
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
          Single flat grid — explicit pixel row heights eliminate all sizing ambiguity.
          Images use position:absolute inset:0 so they always fill regardless of container.

          Layout:
            cols: [2fr] [1fr] [1fr]
            rows: [280px] [280px] [360px] [320px]

            (r1-r2, c1)  big tall left
            (r1,    c2)  top mid
            (r1,    c3)  top right
            (r2,    c2)  bottom mid
            (r2,    c3)  bottom right
            (r3,    c1-c2) wide left panoramic
            (r3,    c3)  portrait right
            (r4,    c1)  portrait left
            (r4,    c2-c3) wide right panoramic
        */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            gridTemplateRows: "280px 280px 360px 320px",
            gap: "3px",
          }}
        >
          <div style={{ gridRow: "1 / 3", gridColumn: "1" }}><Cell w={WORKS[0]!} /></div>
          <div style={{ gridRow: "1",     gridColumn: "2" }}><Cell w={WORKS[1]!} /></div>
          <div style={{ gridRow: "1",     gridColumn: "3" }}><Cell w={WORKS[2]!} /></div>
          <div style={{ gridRow: "2",     gridColumn: "2" }}><Cell w={WORKS[3]!} /></div>
          <div style={{ gridRow: "2",     gridColumn: "3" }}><Cell w={WORKS[4]!} /></div>
          <div style={{ gridRow: "3",     gridColumn: "1 / 3" }}><Cell w={WORKS[5]!} /></div>
          <div style={{ gridRow: "3",     gridColumn: "3" }}><Cell w={WORKS[6]!} /></div>
          <div style={{ gridRow: "4",     gridColumn: "1" }}><Cell w={WORKS[7]!} /></div>
          <div style={{ gridRow: "4",     gridColumn: "2 / 4" }}><Cell w={WORKS[0]!} /></div>
        </div>

        {/* See all link */}
        <div style={{ marginTop: "3rem", display: "flex", justifyContent: "flex-end" }}>
          <a
            href="#"
            style={{
              fontFamily: "var(--tpl-mono, monospace)",
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#0a0a0a",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              borderBottom: "1px solid #0a0a0a",
              paddingBottom: "2px",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.5")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            All projects
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* ════ PULL QUOTE ════ */}
      <section
        style={{
          padding: "6rem 7vw",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--tpl-mono, monospace)",
            fontSize: "9px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          On practice
        </span>
        <blockquote
          style={{
            fontFamily: "var(--tpl-serif, serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(28px, 3.5vw, 52px)",
            lineHeight: 1.3,
            color: "#f0f0f0",
            maxWidth: "900px",
            textAlign: "center",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          &ldquo;The camera is an instrument that teaches people how to see without a camera.&rdquo;
        </blockquote>
        <cite
          style={{
            fontFamily: "var(--tpl-sans, sans-serif)",
            fontSize: "11px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.1em",
            fontStyle: "normal",
          }}
        >
          — Dorothea Lange
        </cite>
      </section>

      {/* ════ ABOUT ════ */}
      <section id="about" style={{ padding: "7rem 7vw", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem" }}>
        <div>
          <Label index="02" text="About" />
          <h2
            style={{
              fontFamily: "var(--tpl-serif, serif)",
              fontWeight: 400,
              fontSize: "clamp(36px, 4vw, 56px)",
              lineHeight: 1.1,
              color: "#0a0a0a",
              margin: "0 0 2rem",
              letterSpacing: "-0.02em",
            }}
          >
            A career built on
            <br />
            <span style={{ fontStyle: "italic" }}>patience</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--tpl-sans, sans-serif)",
              fontWeight: 300,
              fontSize: "15px",
              lineHeight: 1.8,
              color: "#4a4a4a",
              marginBottom: "1.5rem",
            }}
          >
            James Hollis is a New York-based documentary and portrait photographer with over a decade of work spanning editorial commissions, personal projects, and exhibition photography.
          </p>
          <p
            style={{
              fontFamily: "var(--tpl-sans, sans-serif)",
              fontWeight: 300,
              fontSize: "15px",
              lineHeight: 1.8,
              color: "#4a4a4a",
              marginBottom: "2.5rem",
            }}
          >
            His long-form projects explore the intersection of memory, geography, and identity — often through extended collaborations with communities in transition.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "3rem", paddingTop: "2rem", borderTop: "1px solid #e0e0e0" }}>
            {STATS.map((s) => (
              <div key={s.value}>
                <div
                  style={{
                    fontFamily: "var(--tpl-serif, serif)",
                    fontSize: "36px",
                    fontWeight: 300,
                    color: "#0a0a0a",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--tpl-sans, sans-serif)",
                    fontSize: "12px",
                    color: "#888",
                    marginTop: "4px",
                  }}
                >
                  {s.unit}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo + caption */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/315/700/900?grayscale"
              alt="James Hollis"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "brightness(0.88)" }}
            />
          </div>
          {/* Floating caption */}
          <div
            style={{
              position: "absolute",
              bottom: "-1.5rem",
              left: "-1.5rem",
              background: "#fafafa",
              padding: "1rem 1.25rem",
              border: "1px solid #e8e8e8",
            }}
          >
            <div
              style={{
                fontFamily: "var(--tpl-mono, monospace)",
                fontSize: "9px",
                color: "#999",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: "3px",
              }}
            >
              Brooklyn, NY · 2024
            </div>
            <div
              style={{
                fontFamily: "var(--tpl-serif, serif)",
                fontStyle: "italic",
                fontSize: "14px",
                color: "#333",
              }}
            >
              Portrait by Elena Marchetti
            </div>
          </div>
        </div>
      </section>

      {/* ════ PRESS ════ */}
      <section id="press" style={{ padding: "5rem 7vw", background: "#f2f2f0", borderTop: "1px solid #e0e0e0" }}>
        <Label index="03" text="Press & Features" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "1px",
            background: "#d8d8d8",
          }}
        >
          {PRESS.map((p) => (
            <div
              key={p.name}
              style={{
                background: "#f2f2f0",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--tpl-serif, serif)",
                  fontSize: "18px",
                  fontWeight: 400,
                  color: "#0a0a0a",
                  lineHeight: 1.2,
                }}
              >
                {p.name}
              </span>
              <span
                style={{
                  fontFamily: "var(--tpl-mono, monospace)",
                  fontSize: "10px",
                  color: "#aaa",
                  letterSpacing: "0.15em",
                }}
              >
                {p.year}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ════ CONTACT ════ */}
      <section
        id="contact"
        style={{
          padding: "8rem 7vw",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6rem",
          alignItems: "start",
        }}
      >
        <div>
          <Label index="04" text="Contact" />
          <h2
            style={{
              fontFamily: "var(--tpl-serif, serif)",
              fontWeight: 300,
              fontSize: "clamp(40px, 5vw, 72px)",
              lineHeight: 1.05,
              color: "#0a0a0a",
              margin: "0 0 2rem",
              letterSpacing: "-0.02em",
            }}
          >
            Let&apos;s create
            <br />
            <span style={{ fontStyle: "italic" }}>something.</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--tpl-sans, sans-serif)",
              fontWeight: 300,
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#666",
              marginBottom: "2.5rem",
            }}
          >
            For editorial commissions, exhibition inquiries, and long-form project proposals.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { label: "General",  value: "hello@jameshollis.com" },
              { label: "Bookings", value: "bookings@jameshollis.com" },
              { label: "Agent",    value: "+1 (212) 555 0184" },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", gap: "1.5rem", alignItems: "baseline" }}>
                <span
                  style={{
                    fontFamily: "var(--tpl-mono, monospace)",
                    fontSize: "9px",
                    color: "#aaa",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    minWidth: "56px",
                  }}
                >
                  {row.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--tpl-sans, sans-serif)",
                    fontSize: "13px",
                    color: "#333",
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {["First name", "Last name"].map((ph) => (
              <input
                key={ph}
                placeholder={ph}
                style={{
                  fontFamily: "var(--tpl-sans, sans-serif)",
                  fontSize: "13px",
                  fontWeight: 300,
                  padding: "12px 14px",
                  border: "1px solid #d8d8d8",
                  background: "transparent",
                  color: "#0a0a0a",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#0a0a0a")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#d8d8d8")}
              />
            ))}
          </div>
          <input
            placeholder="Email address"
            type="email"
            style={{
              fontFamily: "var(--tpl-sans, sans-serif)",
              fontSize: "13px",
              fontWeight: 300,
              padding: "12px 14px",
              border: "1px solid #d8d8d8",
              background: "transparent",
              color: "#0a0a0a",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0a0a0a")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#d8d8d8")}
          />
          <textarea
            placeholder="Tell me about your project..."
            rows={5}
            style={{
              fontFamily: "var(--tpl-sans, sans-serif)",
              fontSize: "13px",
              fontWeight: 300,
              padding: "12px 14px",
              border: "1px solid #d8d8d8",
              background: "transparent",
              color: "#0a0a0a",
              outline: "none",
              resize: "vertical",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#0a0a0a")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#d8d8d8")}
          />
          <button
            type="submit"
            style={{
              fontFamily: "var(--tpl-sans, sans-serif)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#fafafa",
              background: "#0a0a0a",
              border: "1px solid #0a0a0a",
              padding: "14px",
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#0a0a0a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0a0a0a";
              e.currentTarget.style.color = "#fafafa";
            }}
          >
            Send message
          </button>
        </form>
      </section>

      {/* ════ FOOTER ════ */}
      <footer
        style={{
          padding: "2.5rem 7vw",
          borderTop: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "2rem",
        }}
      >
        <span
          style={{
            fontFamily: "var(--tpl-mono, monospace)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "#0a0a0a",
          }}
        >
          J·H
        </span>
        <span
          style={{
            fontFamily: "var(--tpl-mono, monospace)",
            fontSize: "9px",
            color: "#bbb",
            letterSpacing: "0.12em",
          }}
        >
          © 2025 James Hollis Photography
        </span>
        <div style={{ display: "flex", gap: "2rem" }}>
          {["Instagram", "Behance", "Vimeo"].map((s) => (
            <a
              key={s}
              href="#"
              style={{
                fontFamily: "var(--tpl-sans, sans-serif)",
                fontSize: "11px",
                color: "#888",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0a0a0a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
            >
              {s}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
