"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   Lumière — Pastel editorial portfolio template for FRAME
   Palette  warm cream · dusty blush · sage · soft lavender
   Fonts    Cormorant Garamond · DM Sans · Space Mono (via layout)
───────────────────────────────────────────────────────────── */

const C = {
  bg:      "#faf8f5",
  blush:   "#f2e8e7",
  sage:    "#e8ede9",
  lav:     "#ece8f4",
  ink:     "#2a2520",
  mid:     "#5a534e",
  muted:   "#9a9088",
  rose:    "#c4a99a",
  dim:     "rgba(42,37,32,0.09)",
  dimMed:  "rgba(42,37,32,0.16)",
} as const;

const SERIF = "var(--tpl-serif), 'Cormorant Garamond', Georgia, serif";
const SANS  = "var(--tpl-sans), 'DM Sans', system-ui, sans-serif";
const MONO  = "var(--tpl-mono), 'Space Mono', ui-monospace, monospace";

const WORKS = [
  {
    seed: 452, title: "Golden Hour",
    year: "2024", cat: "Portrait",
    desc: "A series exploring the way afternoon light dissolves form — skin and shadow in slow conversation.",
  },
  {
    seed: 338, title: "Still Waters",
    year: "2024", cat: "Landscape",
    desc: "Coastal studies at low tide, where the horizon blurs and reflection becomes the only truth.",
  },
  {
    seed: 866, title: "Bloom",
    year: "2023", cat: "Editorial",
    desc: "A fashion collaboration set in an abandoned greenhouse, reclaimed by wildflowers and quiet light.",
  },
];

const GALLERY = [
  { seed: 20,  tall: true  },
  { seed: 37,  tall: false },
  { seed: 48,  tall: false },
  { seed: 63,  tall: true  },
  { seed: 71,  tall: false },
  { seed: 82,  tall: true  },
  { seed: 95,  tall: false },
  { seed: 108, tall: true  },
  { seed: 133, tall: false },
  { seed: 145, tall: false },
  { seed: 156, tall: true  },
  { seed: 167, tall: false },
];

const STATS = [
  { value: "11", label: "Years" },
  { value: "340+", label: "Projects" },
  { value: "6", label: "Countries" },
];

export default function LumierePage() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <main style={{ fontFamily: SANS, background: C.bg, color: C.ink, overflowX: "hidden" }}>

      <LumiereNav scrolled={scrolled} />
      <HeroSection />
      <SelectedWorksSection />
      <GallerySection onOpen={(i) => setLightboxIdx(i)} />
      <AboutSection />
      <FooterSection />

      {lightboxIdx !== null && (
        <GalleryLightbox
          photos={GALLERY}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </main>
  );
}

/* ── Nav ──────────────────────────────────────────────────────── */

function LumiereNav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 clamp(24px, 5vw, 72px)",
      height: 64,
      background: scrolled ? "rgba(250,248,245,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.dim}` : "1px solid transparent",
      transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
    }}>
      {/* Logo */}
      <span style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 400, letterSpacing: "0.04em", color: C.ink }}>
        Sofia Marlowe
      </span>

      {/* Desktop nav */}
      <nav style={{ display: "flex", gap: 40, alignItems: "center" }}>
        {["Work", "About", "Journal", "Contact"].map((item) => (
          <a
            key={item}
            href="#"
            style={{
              fontFamily: SANS, fontSize: 11, fontWeight: 500,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: C.mid, textDecoration: "none",
              borderBottom: "1px solid transparent",
              paddingBottom: 1,
              transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.ink; e.currentTarget.style.borderBottomColor = C.rose; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.mid; e.currentTarget.style.borderBottomColor = "transparent"; }}
          >
            {item}
          </a>
        ))}
        <a
          href="#"
          style={{
            fontFamily: SANS, fontSize: 11, fontWeight: 500,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: C.bg, background: C.ink,
            padding: "8px 20px", textDecoration: "none",
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = C.rose; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = C.ink; }}
        >
          Hire me
        </a>
      </nav>
    </header>
  );
}

/* ── Hero ─────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      paddingTop: 64,
    }}>
      {/* Left — text */}
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "80px clamp(24px, 5vw, 72px) 80px clamp(24px, 5vw, 72px)",
        gap: 32,
      }}>
        <div>
          <p style={{
            fontFamily: MONO, fontSize: 10, letterSpacing: "0.28em",
            textTransform: "uppercase", color: C.rose, marginBottom: 28,
          }}>
            Photographer · Paris & New York
          </p>
          <h1 style={{
            fontFamily: SERIF,
            fontSize: "clamp(52px, 6.5vw, 92px)",
            fontWeight: 300, fontStyle: "italic",
            lineHeight: 1.0, letterSpacing: "-0.02em",
            color: C.ink, margin: 0,
          }}>
            Light is my<br />
            <span style={{ color: C.rose }}>language.</span>
          </h1>
        </div>

        <p style={{
          fontFamily: SANS, fontSize: 15, fontWeight: 300,
          lineHeight: 1.75, color: C.mid,
          maxWidth: 380,
        }}>
          I document the quiet hours between — when light softens and people forget
          the camera is there. Portraits, landscapes, and editorial work.
        </p>

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href="#" style={{
            fontFamily: SANS, fontSize: 11, fontWeight: 500,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: C.bg, background: C.ink,
            padding: "13px 28px", textDecoration: "none",
            transition: "background 0.25s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.rose; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.ink; }}
          >
            View work
          </a>
          <a href="#" style={{
            fontFamily: SANS, fontSize: 11, fontWeight: 500,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: C.ink, textDecoration: "none",
            borderBottom: `1px solid ${C.dimMed}`,
            paddingBottom: 2,
          }}>
            About me
          </a>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 40, paddingTop: 16, borderTop: `1px solid ${C.dim}` }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{ fontFamily: SERIF, fontSize: 32, fontWeight: 300, color: C.ink, lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, marginTop: 4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — image */}
      <div style={{ position: "relative", overflow: "hidden", background: C.blush }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/452/900/1200"
          alt="Hero"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* Soft gradient at bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 200,
          background: "linear-gradient(to top, rgba(242,232,231,0.55) 0%, transparent 100%)",
          pointerEvents: "none",
        }} />
        {/* Floating caption */}
        <div style={{
          position: "absolute", bottom: 28, right: 28,
          fontFamily: MONO, fontSize: 9, letterSpacing: "0.22em",
          textTransform: "uppercase", color: "rgba(250,248,245,0.85)",
        }}>
          Paris, 2024
        </div>
      </div>
    </section>
  );
}

/* ── Selected Works ───────────────────────────────────────────── */

function SelectedWorksSection() {
  return (
    <section style={{ background: C.bg, padding: "120px clamp(24px, 5vw, 72px)" }}>
      {/* Section header */}
      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between",
        marginBottom: 80, borderBottom: `1px solid ${C.dim}`, paddingBottom: 20,
      }}>
        <h2 style={{
          fontFamily: SERIF, fontSize: "clamp(32px, 4vw, 52px)",
          fontWeight: 300, fontStyle: "italic", color: C.ink, margin: 0,
        }}>
          Selected works
        </h2>
        <a href="#" style={{
          fontFamily: MONO, fontSize: 10, letterSpacing: "0.2em",
          textTransform: "uppercase", color: C.muted, textDecoration: "none",
          borderBottom: `1px solid ${C.dimMed}`, paddingBottom: 1,
        }}>
          View all →
        </a>
      </div>

      {/* Work items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {WORKS.map((work, i) => (
          <WorkItem key={work.seed} work={work} index={i} />
        ))}
      </div>
    </section>
  );
}

function WorkItem({ work, index }: { work: typeof WORKS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const even = index % 2 === 0;

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: even ? "1fr 1fr" : "1fr 1fr",
        gap: "clamp(32px, 5vw, 80px)",
        alignItems: "center",
        padding: "64px 0",
        borderBottom: `1px solid ${C.dim}`,
        cursor: "pointer",
      }}
    >
      {/* Image */}
      <div
        style={{
          order: even ? 0 : 1,
          overflow: "hidden",
          aspectRatio: index === 1 ? "16/9" : "4/3",
          background: index === 0 ? C.blush : index === 1 ? C.sage : C.lav,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/${work.seed}/800/600`}
          alt={work.title}
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transform: hovered ? "scale(1.03)" : "scale(1)",
            transition: "transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        />
      </div>

      {/* Text */}
      <div style={{ order: even ? 1 : 0, padding: "8px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <span style={{
            fontFamily: SERIF, fontSize: 72, fontWeight: 300,
            color: C.dim, lineHeight: 1, userSelect: "none",
          }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span style={{
            fontFamily: MONO, fontSize: 9, letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: C.rose,
            background: C.blush, padding: "4px 10px",
          }}>
            {work.cat}
          </span>
        </div>

        <h3 style={{
          fontFamily: SERIF,
          fontSize: "clamp(32px, 4vw, 52px)",
          fontWeight: 300, fontStyle: "italic",
          color: C.ink, margin: "0 0 16px",
          lineHeight: 1.1,
          borderBottom: hovered ? `1px solid ${C.rose}` : "1px solid transparent",
          display: "inline-block",
          transition: "border-color 0.3s",
        }}>
          {work.title}
        </h3>

        <p style={{
          fontFamily: SANS, fontSize: 14, fontWeight: 300,
          lineHeight: 1.75, color: C.mid, maxWidth: 420,
          marginBottom: 28,
        }}>
          {work.desc}
        </p>

        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.16em", color: C.muted }}>
            {work.year}
          </span>
          <a href="#" style={{
            fontFamily: SANS, fontSize: 11, fontWeight: 500,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: C.ink, textDecoration: "none",
            display: "flex", alignItems: "center", gap: 6,
            opacity: hovered ? 1 : 0.5,
            transition: "opacity 0.3s",
          }}>
            Open project
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </div>
    </article>
  );
}

/* ── Gallery ──────────────────────────────────────────────────── */

function GallerySection({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <section style={{ background: C.blush, padding: "120px clamp(24px, 5vw, 72px)" }}>
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        marginBottom: 56,
      }}>
        <div>
          <p style={{
            fontFamily: MONO, fontSize: 10, letterSpacing: "0.28em",
            textTransform: "uppercase", color: C.rose, marginBottom: 10,
          }}>
            Archive
          </p>
          <h2 style={{
            fontFamily: SERIF, fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 300, fontStyle: "italic", color: C.ink, margin: 0,
          }}>
            The collection
          </h2>
        </div>
        <span style={{
          fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em",
          textTransform: "uppercase", color: C.muted,
        }}>
          {GALLERY.length} photographs
        </span>
      </div>

      {/* Masonry-like grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
      }}>
        {GALLERY.map((photo, i) => (
          <GalleryPlate key={photo.seed} photo={photo} index={i} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

function GalleryPlate({ photo, index, onOpen }: {
  photo: typeof GALLERY[0]; index: number; onOpen: (i: number) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <figure
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(index)}
      style={{
        margin: 0, position: "relative", overflow: "hidden",
        aspectRatio: photo.tall ? "3/4" : "4/3",
        background: C.lav, cursor: "zoom-in",
        gridRow: photo.tall ? "span 1" : "span 1",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${photo.seed}/600/600`}
        alt=""
        style={{
          width: "100%", height: "100%", objectFit: "cover", display: "block",
          transform: hovered ? "scale(1.05)" : "scale(1)",
          filter: hovered ? "saturate(1.08)" : "saturate(0.9)",
          transition: "transform 600ms cubic-bezier(0.2, 0.8, 0.2, 1), filter 500ms ease",
        }}
      />

      {/* Overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(42,37,32,0.28)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 300ms ease",
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
      }}>
        <span style={{
          fontFamily: MONO, fontSize: 9, letterSpacing: "0.28em",
          textTransform: "uppercase", color: "rgba(250,248,245,0.9)",
        }}>
          ↗ Open
        </span>
      </div>

      {/* Index */}
      <div style={{
        position: "absolute", bottom: 12, left: 14,
        fontFamily: MONO, fontSize: 8, letterSpacing: "0.2em",
        color: "rgba(250,248,245,0.55)",
        transition: "opacity 0.3s",
        opacity: hovered ? 0 : 1,
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>
    </figure>
  );
}

/* ── About ────────────────────────────────────────────────────── */

function AboutSection() {
  return (
    <section style={{
      background: C.bg,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      minHeight: "80vh",
    }}>
      {/* Portrait */}
      <div style={{ position: "relative", overflow: "hidden", background: C.sage }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/700/800/1000"
          alt="Sofia Marlowe"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(232,237,233,0.3) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Text */}
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "80px clamp(40px, 6vw, 96px)",
        gap: 32,
      }}>
        <div>
          <p style={{
            fontFamily: MONO, fontSize: 10, letterSpacing: "0.28em",
            textTransform: "uppercase", color: C.rose, marginBottom: 16,
          }}>
            About the artist
          </p>
          <h2 style={{
            fontFamily: SERIF,
            fontSize: "clamp(40px, 5vw, 64px)",
            fontWeight: 300, fontStyle: "italic",
            color: C.ink, margin: "0 0 8px",
            lineHeight: 1.05,
          }}>
            Sofia Marlowe
          </h2>
          <p style={{
            fontFamily: SANS, fontSize: 12, fontWeight: 500,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: C.muted, margin: 0,
          }}>
            Visual artist · documentary photographer
          </p>
        </div>

        <p style={{
          fontFamily: SANS, fontSize: 15, fontWeight: 300,
          lineHeight: 1.8, color: C.mid,
        }}>
          I grew up between two coasts and three languages, which taught me that
          light speaks differently in every latitude. My practice sits at the
          intersection of documentary restraint and editorial vision — always
          looking for the moment before the moment.
        </p>

        <p style={{
          fontFamily: SANS, fontSize: 15, fontWeight: 300,
          lineHeight: 1.8, color: C.mid,
        }}>
          Currently based in Paris, available for commissions worldwide.
          My work has appeared in <em>Vogue</em>, <em>The New Yorker</em>,
          and <em>National Geographic Traveler</em>.
        </p>

        {/* Stats */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 24, paddingTop: 24,
          borderTop: `1px solid ${C.dim}`,
        }}>
          {STATS.map((s) => (
            <div key={s.label}>
              <div style={{
                fontFamily: SERIF, fontSize: 40, fontWeight: 300,
                color: C.ink, lineHeight: 1,
              }}>
                {s.value}
              </div>
              <div style={{
                fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em",
                textTransform: "uppercase", color: C.muted, marginTop: 6,
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <a href="#" style={{
          display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start",
          fontFamily: SANS, fontSize: 11, fontWeight: 500,
          letterSpacing: "0.12em", textTransform: "uppercase",
          color: C.ink, textDecoration: "none",
          borderBottom: `1px solid ${C.dimMed}`, paddingBottom: 2,
        }}>
          Full biography
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </section>
  );
}

/* ── Services / Quote band ────────────────────────────────────── */

function FooterSection() {
  return (
    <>
      {/* Contact band */}
      <section style={{
        background: C.lav,
        padding: "96px clamp(24px, 5vw, 72px)",
        textAlign: "center",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 32,
      }}>
        <p style={{
          fontFamily: MONO, fontSize: 10, letterSpacing: "0.28em",
          textTransform: "uppercase", color: C.rose,
        }}>
          Let's collaborate
        </p>
        <h2 style={{
          fontFamily: SERIF,
          fontSize: "clamp(36px, 5vw, 72px)",
          fontWeight: 300, fontStyle: "italic",
          color: C.ink, margin: 0, lineHeight: 1.1,
          maxWidth: 640,
        }}>
          Every project begins with a conversation.
        </h2>
        <p style={{
          fontFamily: SANS, fontSize: 15, fontWeight: 300,
          lineHeight: 1.7, color: C.mid, maxWidth: 480,
        }}>
          Whether you have a brief or just an idea, I'd love to hear about it.
          Commissions, editorial, and limited print inquiries welcome.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <a href="#" style={{
            fontFamily: SANS, fontSize: 11, fontWeight: 500,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: C.bg, background: C.ink,
            padding: "14px 32px", textDecoration: "none",
            transition: "background 0.25s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.rose; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.ink; }}
          >
            Get in touch
          </a>
          <a href="#" style={{
            fontFamily: SANS, fontSize: 11, fontWeight: 500,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: C.ink, background: "transparent",
            padding: "14px 32px", textDecoration: "none",
            border: `1px solid ${C.dimMed}`,
            transition: "border-color 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.rose; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.dimMed; }}
          >
            View prints
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: C.ink,
        padding: "48px clamp(24px, 5vw, 72px)",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: 24,
      }}>
        <div>
          <div style={{
            fontFamily: SERIF, fontSize: 20, fontStyle: "italic", fontWeight: 300,
            color: "rgba(250,248,245,0.9)", marginBottom: 6,
          }}>
            Sofia Marlowe
          </div>
          <div style={{
            fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "rgba(250,248,245,0.35)",
          }}>
            © 2024 · All rights reserved
          </div>
        </div>

        <div style={{ display: "flex", gap: 32 }}>
          {["Work", "About", "Journal", "Contact"].map((item) => (
            <a key={item} href="#" style={{
              fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em",
              textTransform: "uppercase", color: "rgba(250,248,245,0.45)",
              textDecoration: "none", transition: "color 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(250,248,245,0.9)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(250,248,245,0.45)"; }}
            >
              {item}
            </a>
          ))}
        </div>

        <div style={{ display: "flex", gap: 20, justifyContent: "flex-end" }}>
          {["Instagram", "Behance", "Substack"].map((s) => (
            <a key={s} href="#" style={{
              fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em",
              textTransform: "uppercase", color: "rgba(250,248,245,0.35)",
              textDecoration: "none", transition: "color 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = C.rose; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(250,248,245,0.35)"; }}
            >
              {s}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
}

/* ── Lightbox ─────────────────────────────────────────────────── */

function GalleryLightbox({
  photos, startIndex, onClose,
}: { photos: typeof GALLERY; startIndex: number; onClose: () => void }) {
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

  const onMD = (e: React.MouseEvent) => {
    if (zoom <= 1) return; e.preventDefault(); setDrag(true);
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onMM = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({ x: dragRef.current.ox + e.clientX - dragRef.current.sx, y: dragRef.current.oy + e.clientY - dragRef.current.sy });
  };
  const onMU = () => setDrag(false);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(30,26,23,0.96)", display: "flex", flexDirection: "column", userSelect: "none" }}
    >
      {/* Top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 28px",
        background: "linear-gradient(to bottom, rgba(30,26,23,0.7), transparent)",
        pointerEvents: "none",
      }}>
        <button onClick={onClose} style={{
          pointerEvents: "auto", background: "none", border: "none",
          cursor: "pointer", color: "rgba(250,248,245,0.65)",
          padding: "6px 10px", fontFamily: MONO, fontSize: 10,
          letterSpacing: "0.22em", textTransform: "uppercase",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(250,248,245,0.3)" }}>
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
        {zoom > 1 && (
          <button onClick={resetView} style={{
            pointerEvents: "auto",
            background: "rgba(250,248,245,0.08)", border: "1px solid rgba(250,248,245,0.1)",
            color: "rgba(250,248,245,0.55)", cursor: "pointer", padding: "5px 10px",
            fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
          }}>
            {Math.round(zoom * 100)}% · Reset
          </button>
        )}
      </div>

      {/* Image container */}
      <div
        ref={containerRef}
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "72px 80px",
          cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
          overflow: "hidden",
        }}
        onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/${photo.seed}/1600/1200`}
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

      {/* Prev / Next */}
      {index > 0 && (
        <button onClick={prev} style={{
          position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)",
          background: "rgba(250,248,245,0.07)", border: "1px solid rgba(250,248,245,0.1)",
          color: "rgba(250,248,245,0.6)", cursor: "pointer",
          width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
      )}
      {index < photos.length - 1 && (
        <button onClick={next} style={{
          position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)",
          background: "rgba(250,248,245,0.07)", border: "1px solid rgba(250,248,245,0.1)",
          color: "rgba(250,248,245,0.6)", cursor: "pointer",
          width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      )}

      {/* Thumbnail strip */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        display: "flex", gap: 6, padding: "16px 28px",
        background: "linear-gradient(to top, rgba(30,26,23,0.8), transparent)",
        overflowX: "auto", justifyContent: "center",
      }}>
        {photos.map((p, i) => (
          <button
            key={p.seed}
            onClick={() => { setIndex(i); resetView(); }}
            style={{
              flex: "0 0 52px", height: 36,
              padding: 0, border: i === index ? "2px solid rgba(201,168,154,0.8)" : "2px solid transparent",
              cursor: "pointer", overflow: "hidden", borderRadius: 2,
              transition: "border-color 0.2s",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://picsum.photos/seed/${p.seed}/120/80`}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
