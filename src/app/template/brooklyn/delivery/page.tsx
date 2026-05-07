"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

/* ─── Brooklyn Delivery ──────────────────────────────────────────
   Password-protected client gallery. Same Brooklyn design language.
   Editorial structure with hero + sections + mobile-first toolbar.
─────────────────────────────────────────────────────────────── */

const RED   = "#E8382C";
const BLACK = "#0D0D0D";
const DARK  = "#161616";
const STONE = "#F0EFE9";
const GRAY  = "#7A7A7A";
const DIM   = "#2A2A2A";

const SANS  = "var(--bk-sans), 'Space Grotesk', system-ui, sans-serif";
const MONO  = "var(--bk-mono), 'Space Mono', monospace";
const SERIF = "var(--bk-serif), 'DM Serif Display', Georgia, serif";

const CLIENT_PASSWORD = "sarah2025";
const CLIENT_NAME     = "Sarah & James";
const EVENT_LOCATION  = "Hudson Valley, NY";
const EVENT_DATE      = "October 18, 2025";
const PHOTOGRAPHER    = "Morrison Photo";
const COVER_SEED      = 10;

/* Photos grouped by chapter — gives the gallery editorial structure */
const SECTIONS = [
  {
    id:    "ceremony",
    label: "Ceremony",
    note:  "Vows, rings, and the long walk back down the aisle.",
    photos: [10, 71, 82, 93, 100, 111, 122, 133],
  },
  {
    id:    "portraits",
    label: "Portraits",
    note:  "Quiet moments between the two of you, golden hour above the river.",
    photos: [232, 243, 254, 265, 276, 287],
  },
  {
    id:    "reception",
    label: "Reception",
    note:  "Toasts, first dance, and the kind of party that ended at 2am.",
    photos: [144, 155, 166, 177, 188, 199, 210, 221, 298, 309],
  },
] as const;

type SectionId = typeof SECTIONS[number]["id"];

/* Flat list of all photos with their section — used for selection,
   lightbox navigation, and the favourites filter */
const ALL_PHOTOS = SECTIONS.flatMap((s) =>
  s.photos.map((seed) => ({ seed, section: s.id as SectionId }))
);
const PHOTO_COUNT = ALL_PHOTOS.length;

const CURTAIN_EASE     = [0.76, 0, 0.24, 1] as const;
const CURTAIN_DURATION = 1.1;

/* ── Page entry ─────────────────────────────────────────────── */

export default function BrooklynDeliveryPage() {
  const [unlocked, setUnlocked]           = useState(false);
  const [transitioning, setTransitioning] = useState(false);

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
              textAlign: "center", padding: "0 24px",
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
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } },
};
const photoVariants: Variants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Password gate ──────────────────────────────────────────── */

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function attempt() {
    /* Demo gate: any non-empty input unlocks. Real validation happens
       server-side once the page is wired to a real client gallery. */
    if (!value.trim()) {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2000);
      return;
    }
    onUnlock();
  }

  return (
    <main style={{ fontFamily: SANS, background: BLACK, color: STONE, minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 3, background: RED }} />

      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "32px 20px",
      }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: RED, marginBottom: 32, textAlign: "center" }}>
          {PHOTOGRAPHER} · Client Gallery
        </div>

        <h1 style={{
          fontFamily: SERIF, fontStyle: "italic",
          fontSize: "clamp(28px, 8vw, 52px)", fontWeight: 400,
          color: STONE, letterSpacing: "-0.02em", lineHeight: 1,
          textAlign: "center", margin: "0 0 8px",
        }}>
          {CLIENT_NAME}
        </h1>
        <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: GRAY, margin: "0 0 40px", textAlign: "center" }}>
          {EVENT_DATE} · {PHOTO_COUNT} photos
        </p>

        <div style={{
          width: "100%", maxWidth: 340,
          animation: shake ? "bk-shake 0.4s ease" : "none",
        }}>
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
                width: "100%", padding: "14px",
                background: RED, border: "none",
                color: BLACK, fontFamily: MONO, fontSize: 11,
                fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase", cursor: "pointer",
                transition: "background 0.2s",
                marginTop: 4,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#c0291f"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = RED; }}
            >
              Access gallery →
            </button>
          </div>
        </div>

        <p style={{ fontFamily: MONO, fontSize: 9, color: DIM, letterSpacing: "0.12em", marginTop: 32, textAlign: "center", maxWidth: 320 }}>
          Gallery expires in 90 days · Forgot your code? Contact {PHOTOGRAPHER}
        </p>
      </div>
    </main>
  );
}

/* ── Gallery (main view) ────────────────────────────────────── */

type FilterMode = "all" | "favorites";

function Gallery() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [selected,    setSelected]    = useState<Set<number>>(new Set());
  const [favorites,   setFavorites]   = useState<Set<number>>(new Set());
  const [filter,      setFilter]      = useState<FilterMode>("all");
  const [downloading, setDownloading] = useState(false);
  const [scrolled,    setScrolled]    = useState(false);

  /* Sticky toolbar shows shadow once you scroll past the hero */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  function toggleSelect(idx: number) {
    setSelected((p) => {
      const n = new Set(p); n.has(idx) ? n.delete(idx) : n.add(idx); return n;
    });
  }
  function toggleFavorite(idx: number) {
    setFavorites((p) => {
      const n = new Set(p); n.has(idx) ? n.delete(idx) : n.add(idx); return n;
    });
  }
  function selectAllVisible(visibleIdxs: number[]) {
    const allSelected = visibleIdxs.every((i) => selected.has(i));
    setSelected((p) => {
      const n = new Set(p);
      if (allSelected) visibleIdxs.forEach((i) => n.delete(i));
      else visibleIdxs.forEach((i) => n.add(i));
      return n;
    });
  }
  function simulateDownload() {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2200);
  }

  /* Filter — favourites mode hides non-favourite photos */
  const visibleIndices = ALL_PHOTOS
    .map((_, i) => i)
    .filter((i) => filter === "all" || favorites.has(i));

  const visibleCount = visibleIndices.length;
  const downloadCount = selected.size > 0 ? selected.size : visibleCount;
  const downloadLabel = selected.size > 0 ? `Download ${selected.size}` : "Download all";

  return (
    <main style={{ fontFamily: SANS, background: BLACK, color: STONE, minHeight: "100dvh" }}>
      <div style={{ height: 3, background: RED }} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header style={{ position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "relative",
          aspectRatio: "16 / 9",
          maxHeight: "70dvh",
          minHeight: 320,
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://picsum.photos/seed/${COVER_SEED}/1800/1000`}
            alt={`${CLIENT_NAME} cover`}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* Gradient + grain */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(13,13,13,0.2) 0%, rgba(13,13,13,0.1) 30%, rgba(13,13,13,0.85) 100%)",
            pointerEvents: "none",
          }} />

          {/* Photographer mark */}
          <div style={{
            position: "absolute", top: 16, left: 16,
            display: "flex", alignItems: "center", gap: 8,
            fontFamily: MONO, fontSize: 9, letterSpacing: "0.3em",
            textTransform: "uppercase", color: STONE,
          }}>
            <span style={{ width: 8, height: 8, background: RED, display: "inline-block" }} />
            {PHOTOGRAPHER}
          </div>

          {/* Title block — bottom-left */}
          <div style={{
            position: "absolute",
            left: "clamp(16px, 4vw, 48px)",
            right: "clamp(16px, 4vw, 48px)",
            bottom: "clamp(20px, 4vw, 40px)",
          }}>
            <p style={{
              fontFamily: MONO, fontSize: 10, letterSpacing: "0.28em",
              textTransform: "uppercase", color: RED, margin: "0 0 12px",
            }}>
              Wedding Gallery · {SECTIONS.length} chapters
            </p>
            <h1 style={{
              fontFamily: SERIF, fontStyle: "italic",
              fontSize: "clamp(36px, 8vw, 92px)", fontWeight: 400,
              color: STONE, letterSpacing: "-0.025em", lineHeight: 0.95,
              margin: "0 0 12px",
            }}>
              {CLIENT_NAME}
            </h1>
            <div style={{
              display: "flex", gap: "clamp(8px, 2vw, 20px)",
              flexWrap: "wrap", alignItems: "center",
              fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em",
              textTransform: "uppercase", color: STONE,
            }}>
              <span>{EVENT_DATE}</span>
              <span style={{ color: GRAY }}>·</span>
              <span>{EVENT_LOCATION}</span>
              <span style={{ color: GRAY }}>·</span>
              <span>{PHOTO_COUNT} photos</span>
            </div>
          </div>
        </div>

        {/* Hero CTA strip — separate from image so it doesn't fight the title */}
        <div style={{
          background: DARK,
          borderBottom: `1px solid ${DIM}`,
          padding: "16px clamp(16px, 4vw, 48px)",
          display: "flex", flexWrap: "wrap", gap: 12,
          alignItems: "center", justifyContent: "space-between",
        }}>
          <p style={{
            fontFamily: SANS, fontSize: 13, fontWeight: 300, color: STONE,
            margin: 0, lineHeight: 1.5, maxWidth: 520,
          }}>
            These are your photos. Tap any image to enlarge, double-tap or hit the
            heart to favourite, or select multiple to download as a zip.
          </p>
          <button
            onClick={simulateDownload}
            disabled={downloading}
            style={{
              flexShrink: 0,
              background: downloading ? DIM : RED, border: "none",
              color: downloading ? GRAY : BLACK,
              fontFamily: MONO, fontSize: 10, letterSpacing: "0.2em",
              textTransform: "uppercase", fontWeight: 700,
              padding: "11px 20px", cursor: downloading ? "default" : "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => { if (!downloading) e.currentTarget.style.background = "#c0291f"; }}
            onMouseLeave={(e) => { if (!downloading) e.currentTarget.style.background = RED; }}
          >
            {downloading ? <Spinner /> : <DownloadIcon />}
            {downloading ? "Preparing zip…" : "Download all"}
          </button>
        </div>
      </header>

      {/* ── Sticky toolbar ───────────────────────────────────── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: BLACK,
        borderBottom: `1px solid ${DIM}`,
        boxShadow: scrolled ? "0 6px 20px rgba(0,0,0,0.5)" : "none",
        transition: "box-shadow 0.2s",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px clamp(12px, 4vw, 48px)",
          flexWrap: "wrap",
        }}>
          {/* Filter pills */}
          <div style={{ display: "flex", border: `1px solid ${DIM}`, borderRadius: 0 }}>
            <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
              All <span style={{ opacity: 0.55, marginLeft: 4 }}>{ALL_PHOTOS.length}</span>
            </FilterPill>
            <FilterPill active={filter === "favorites"} onClick={() => setFilter("favorites")}>
              <Heart filled={filter === "favorites"} size={9} />
              <span style={{ marginLeft: 5 }}>Favorites</span>
              <span style={{ opacity: 0.55, marginLeft: 4 }}>{favorites.size}</span>
            </FilterPill>
          </div>

          <div style={{ flex: 1 }} />

          {/* Selection count + actions — desktop */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {selected.size > 0 && (
              <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", color: RED, textTransform: "uppercase" }}>
                {selected.size} selected
              </span>
            )}
            <button
              onClick={() => selectAllVisible(visibleIndices)}
              style={{
                background: "none", border: `1px solid ${DIM}`, color: GRAY,
                fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
                padding: "6px 12px", cursor: "pointer",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = GRAY; e.currentTarget.style.color = STONE; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = DIM; e.currentTarget.style.color = GRAY; }}
            >
              {visibleIndices.every((i) => selected.has(i)) && visibleIndices.length > 0 ? "Deselect" : "Select all"}
            </button>
            {/* Desktop download — hidden on mobile (mobile uses floater) */}
            <button
              onClick={simulateDownload}
              disabled={downloading || (filter === "favorites" && favorites.size === 0)}
              className="bk-desktop-only"
              style={{
                background: downloading ? DIM : RED, border: "none",
                color: downloading ? GRAY : BLACK,
                fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
                fontWeight: 700, padding: "7px 14px",
                cursor: downloading ? "default" : "pointer",
                display: "inline-flex", alignItems: "center", gap: 6,
                transition: "background 0.2s",
              }}
            >
              {downloading ? <Spinner small /> : <DownloadIcon size={10} />}
              {downloading ? "…" : selected.size > 0 ? `Download ${selected.size}` : "Download all"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bk-spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .bk-desktop-only { display: none !important; }
        }
      `}</style>

      {/* ── Sectioned grid ───────────────────────────────────── */}
      {filter === "favorites" && favorites.size === 0 ? (
        <EmptyFavorites onClear={() => setFilter("all")} />
      ) : (
        SECTIONS.map((section, si) => {
          const indices = ALL_PHOTOS
            .map((p, i) => ({ p, i }))
            .filter(({ p }) => p.section === section.id)
            .filter(({ i }) => filter === "all" || favorites.has(i))
            .map(({ i }) => i);

          if (indices.length === 0) return null;

          return (
            <section key={section.id} style={{
              padding: "clamp(28px, 5vw, 48px) clamp(12px, 4vw, 48px) clamp(16px, 3vw, 32px)",
              borderTop: si > 0 ? `1px solid ${DIM}` : "none",
            }}>
              {/* Section header */}
              <div style={{
                display: "flex", alignItems: "baseline", gap: 16,
                marginBottom: 20, flexWrap: "wrap",
              }}>
                <span style={{
                  fontFamily: MONO, fontSize: 10, letterSpacing: "0.32em",
                  textTransform: "uppercase", color: RED,
                }}>
                  Ch {String(si + 1).padStart(2, "0")}
                </span>
                <h2 style={{
                  fontFamily: SERIF, fontStyle: "italic",
                  fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 400,
                  color: STONE, letterSpacing: "-0.01em", lineHeight: 1,
                  margin: 0,
                }}>
                  {section.label}
                </h2>
                <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", color: GRAY, textTransform: "uppercase" }}>
                  {indices.length} photos
                </span>
                <p style={{
                  flexBasis: "100%", fontFamily: SANS, fontSize: 12,
                  fontWeight: 300, color: GRAY, margin: "4px 0 0", lineHeight: 1.6,
                }}>
                  {section.note}
                </p>
              </div>

              {/* Grid */}
              <motion.div
                variants={gridVariants}
                initial="hidden"
                animate="visible"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(160px, 100%), 1fr))",
                  gap: 4,
                }}
                className="bk-grid"
              >
                {indices.map((idx) => (
                  <GalleryThumb
                    key={ALL_PHOTOS[idx]!.seed}
                    seed={ALL_PHOTOS[idx]!.seed}
                    index={idx}
                    selected={selected.has(idx)}
                    favorite={favorites.has(idx)}
                    onSelect={() => toggleSelect(idx)}
                    onFavorite={() => toggleFavorite(idx)}
                    onOpen={() => setLightboxIdx(idx)}
                  />
                ))}
              </motion.div>

              <style>{`
                @media (min-width: 1024px) { .bk-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important; } }
                @media (min-width: 640px) and (max-width: 1023px) { .bk-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important; } }
                @media (max-width: 639px) { .bk-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 3px !important; } }
              `}</style>
            </section>
          );
        })
      )}

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${DIM}`,
        padding: "clamp(20px, 4vw, 32px) clamp(16px, 4vw, 48px) calc(clamp(20px, 4vw, 32px) + env(safe-area-inset-bottom, 0))",
        marginBottom: 0,
      }}>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 24,
          justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <div style={{
              fontFamily: SERIF, fontStyle: "italic", fontSize: 24, fontWeight: 400,
              color: STONE, letterSpacing: "-0.01em", lineHeight: 1, marginBottom: 6,
            }}>
              {PHOTOGRAPHER}
            </div>
            <p style={{
              fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em",
              textTransform: "uppercase", color: GRAY, margin: 0,
            }}>
              © 2025 · All photos delivered Oct 22, 2025
            </p>
          </div>
          <nav style={{ display: "flex", gap: 20, fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            {["Print shop", "Album builder", "Contact", "Instagram"].map((item) => (
              <a key={item} href="#" style={{ color: GRAY, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = STONE; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = GRAY; }}
              >{item}</a>
            ))}
          </nav>
        </div>
      </footer>

      {/* Mobile floating selection bar — appears when items selected */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            key="bk-floater"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bk-floater"
            style={{
              position: "fixed", left: 16, right: 16, bottom: 16, zIndex: 60,
              background: BLACK, border: `1px solid ${RED}`,
              padding: "10px 14px",
              display: "flex", alignItems: "center", gap: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              maxWidth: 480, marginLeft: "auto", marginRight: "auto",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.22em", color: RED, textTransform: "uppercase" }}>
                {selected.size} selected
              </div>
              <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.18em", color: GRAY, textTransform: "uppercase", marginTop: 2 }}>
                Ready to download
              </div>
            </div>
            <button
              onClick={() => setSelected(new Set())}
              style={{
                background: "none", border: `1px solid ${DIM}`, color: GRAY,
                fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
                padding: "8px 12px", cursor: "pointer",
              }}
            >Clear</button>
            <button
              onClick={simulateDownload}
              disabled={downloading}
              style={{
                background: downloading ? DIM : RED, border: "none",
                color: downloading ? GRAY : BLACK,
                fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700,
                padding: "9px 14px", cursor: downloading ? "default" : "pointer",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}
            >
              {downloading ? <Spinner small /> : <DownloadIcon size={11} />}
              {downloading ? "…" : downloadLabel}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <BrooklynLightbox
          startIndex={lightboxIdx}
          favorites={favorites}
          onFavorite={toggleFavorite}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </main>
  );
}

/* ── Empty favorites state ──────────────────────────────────── */
function EmptyFavorites({ onClear }: { onClear: () => void }) {
  return (
    <div style={{
      padding: "60px clamp(16px, 4vw, 48px)",
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 16, textAlign: "center",
    }}>
      <div style={{ color: DIM }}><Heart filled={false} size={28} /></div>
      <h3 style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 22, fontWeight: 400, color: STONE, margin: 0 }}>
        No favorites yet
      </h3>
      <p style={{ fontFamily: SANS, fontSize: 13, color: GRAY, margin: 0, maxWidth: 320, lineHeight: 1.6 }}>
        Tap the heart on any photo to mark it as a favorite — useful for picking the ones you'll print or share.
      </p>
      <button
        onClick={onClear}
        style={{
          background: "none", border: `1px solid ${DIM}`, color: STONE,
          fontFamily: MONO, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
          padding: "10px 18px", cursor: "pointer", marginTop: 8,
        }}
      >Browse all photos →</button>
    </div>
  );
}

/* ── Filter pill button ─────────────────────────────────────── */
function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? RED : "none",
        border: "none",
        color: active ? BLACK : GRAY,
        fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em",
        textTransform: "uppercase", fontWeight: active ? 700 : 400,
        padding: "7px 12px", cursor: "pointer",
        display: "inline-flex", alignItems: "center",
        transition: "background 0.18s, color 0.18s",
      }}
    >
      {children}
    </button>
  );
}

/* ── Reusable icons ─────────────────────────────────────────── */
function DownloadIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
    </svg>
  );
}
function Heart({ filled, size = 12 }: { filled: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  );
}
function Spinner({ small }: { small?: boolean }) {
  const sz = small ? 9 : 11;
  return (
    <span style={{
      width: sz, height: sz, borderRadius: "50%",
      border: `2px solid ${GRAY}`, borderTopColor: "transparent",
      display: "inline-block", animation: "bk-spin 0.7s linear infinite",
    }} />
  );
}

/* ── Photo thumbnail ────────────────────────────────────────── */
function GalleryThumb({ seed, index, selected, favorite, onSelect, onFavorite, onOpen }: {
  seed: number; index: number; selected: boolean; favorite: boolean;
  onSelect: () => void; onFavorite: () => void; onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const showOverlay = hovered || selected || favorite;

  return (
    <motion.div
      variants={photoVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", aspectRatio: "1", overflow: "hidden",
        background: DIM, cursor: "pointer",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${seed}/480/480`}
        alt={`Photo ${index + 1}`}
        onClick={onOpen}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          transform: hovered ? "scale(1.04)" : "scale(1)",
          transition: "transform 500ms cubic-bezier(0.2,0.8,0.2,1)",
        }}
      />

      {/* Bottom gradient — keeps controls legible regardless of photo */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: 56,
        background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
        opacity: showOverlay ? 1 : 0,
        transition: "opacity 0.2s",
        pointerEvents: "none",
      }} />

      {/* Top-left: select checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        aria-label={selected ? "Deselect photo" : "Select photo"}
        style={{
          position: "absolute", top: 8, left: 8,
          width: 24, height: 24,
          background: selected ? RED : "rgba(0,0,0,0.55)",
          border: `1.5px solid ${selected ? RED : "rgba(255,255,255,0.6)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", padding: 0,
          opacity: showOverlay ? 1 : 0,
          transition: "opacity 0.2s, background 0.18s, border-color 0.18s",
          backdropFilter: "blur(2px)",
        }}
      >
        {selected && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={BLACK} strokeWidth="3" strokeLinecap="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        )}
      </button>

      {/* Top-right: favorite */}
      <button
        onClick={(e) => { e.stopPropagation(); onFavorite(); }}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        style={{
          position: "absolute", top: 8, right: 8,
          width: 24, height: 24, padding: 0,
          background: "rgba(0,0,0,0.55)",
          border: `1.5px solid ${favorite ? RED : "rgba(255,255,255,0.6)"}`,
          color: favorite ? RED : "rgba(255,255,255,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          opacity: favorite || hovered ? 1 : 0,
          transition: "opacity 0.2s, color 0.18s, border-color 0.18s",
          backdropFilter: "blur(2px)",
        }}
      >
        <Heart filled={favorite} size={11} />
      </button>

      {/* Bottom-left: index */}
      <span style={{
        position: "absolute", bottom: 8, left: 10,
        fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em",
        color: "rgba(255,255,255,0.85)",
        opacity: showOverlay ? 1 : 0,
        transition: "opacity 0.2s",
        pointerEvents: "none",
      }}>
        #{String(index + 1).padStart(3, "0")}
      </span>
    </motion.div>
  );
}

/* ── Lightbox ───────────────────────────────────────────────── */

function BrooklynLightbox({ startIndex, favorites, onFavorite, onClose }: {
  startIndex: number;
  favorites: Set<number>;
  onFavorite: (idx: number) => void;
  onClose: () => void;
}) {
  const [index, setIndex]   = useState(startIndex);
  const [zoom, setZoom]     = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDrag] = useState(false);
  const dragRef             = useRef({ sx: 0, sy: 0, ox: 0, oy: 0 });
  const containerRef        = useRef<HTMLDivElement>(null);
  const touchStartX         = useRef<number | null>(null);
  const photo               = ALL_PHOTOS[index]!;
  const isFav               = favorites.has(index);

  const resetView = useCallback(() => { setZoom(1); setOffset({ x: 0, y: 0 }); }, []);
  const prev = useCallback(() => { setIndex((i) => Math.max(i - 1, 0)); resetView(); }, [resetView]);
  const next = useCallback(() => { setIndex((i) => Math.min(i + 1, ALL_PHOTOS.length - 1)); resetView(); }, [resetView]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "f" || e.key === "F") onFavorite(index);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, next, prev, onFavorite, index]);

  /* Wheel zoom — desktop */
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

  /* Mouse drag — when zoomed */
  const onMD = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault(); setDrag(true);
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onMM = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({ x: dragRef.current.ox + e.clientX - dragRef.current.sx, y: dragRef.current.oy + e.clientY - dragRef.current.sy });
  };
  const onMU = () => setDrag(false);

  /* Touch swipe — only when not zoomed */
  const onTS = (e: React.TouchEvent) => {
    if (zoom > 1) return;
    touchStartX.current = e.touches[0]!.clientX;
  };
  const onTE = (e: React.TouchEvent) => {
    if (zoom > 1 || touchStartX.current === null) return;
    const dx = e.changedTouches[0]!.clientX - touchStartX.current;
    if (Math.abs(dx) > 60) {
      if (dx > 0) prev();
      else next();
    }
    touchStartX.current = null;
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(8,8,8,0.97)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Top bar */}
      <div onClick={(e) => e.stopPropagation()} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px", borderBottom: `1px solid ${DIM}`, flexShrink: 0,
        gap: 8,
      }}>
        <button onClick={onClose} style={{
          background: "none", border: `1px solid ${DIM}`, cursor: "pointer", color: GRAY,
          fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
          padding: "7px 12px", display: "inline-flex", alignItems: "center", gap: 6,
          transition: "border-color 0.2s, color 0.2s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = GRAY; e.currentTarget.style.color = STONE; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = DIM; e.currentTarget.style.color = GRAY; }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          <span className="bk-desktop-only">Back</span>
        </button>

        <span style={{
          fontFamily: MONO, fontSize: 9, letterSpacing: "0.22em",
          textTransform: "uppercase", color: GRAY,
        }}>
          {String(index + 1).padStart(3, "0")} / {String(ALL_PHOTOS.length).padStart(3, "0")} ·{" "}
          <span style={{ color: RED }}>{photo.section}</span>
        </span>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onFavorite(index)}
            aria-label={isFav ? "Remove favorite" : "Mark favorite"}
            style={{
              background: isFav ? RED : "none",
              border: `1px solid ${isFav ? RED : DIM}`,
              color: isFav ? BLACK : GRAY,
              cursor: "pointer", padding: "7px 10px",
              display: "inline-flex", alignItems: "center", gap: 6,
              transition: "background 0.18s, border-color 0.18s, color 0.18s",
            }}
            onMouseEnter={(e) => { if (!isFav) { e.currentTarget.style.borderColor = GRAY; e.currentTarget.style.color = STONE; } }}
            onMouseLeave={(e) => { if (!isFav) { e.currentTarget.style.borderColor = DIM; e.currentTarget.style.color = GRAY; } }}
          >
            <Heart filled={isFav} size={11} />
          </button>
          <button style={{
            background: RED, border: "none", cursor: "pointer", color: BLACK,
            fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
            fontWeight: 700, padding: "7px 12px",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <DownloadIcon size={10} />
            <span className="bk-desktop-only">Download</span>
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}
        onTouchStart={onTS} onTouchEnd={onTE}
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px clamp(16px, 6vw, 72px)", overflow: "hidden",
          cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default",
          touchAction: zoom > 1 ? "none" : "pan-y",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photo.seed}
          src={`https://picsum.photos/seed/${photo.seed}/1600/1200`}
          alt={`Photo ${index + 1}`}
          draggable={false}
          style={{
            maxWidth: "100%", maxHeight: "100%", objectFit: "contain",
            pointerEvents: "none", display: "block",
            transform: `translate(${offset.x}px,${offset.y}px) scale(${zoom})`,
            transition: dragging ? "none" : "transform 0.18s ease",
          }}
        />
      </div>

      {/* Arrows — desktop only */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="bk-desktop-only"
          style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
            background: DIM, border: `1px solid ${DIM}`, color: STONE, cursor: "pointer",
            width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = RED; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = DIM; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
      )}
      {index < ALL_PHOTOS.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="bk-desktop-only"
          style={{
            position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
            background: DIM, border: `1px solid ${DIM}`, color: STONE, cursor: "pointer",
            width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = RED; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = DIM; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      )}

      {/* Mobile bottom navigator — prev/next + swipe hint */}
      <div onClick={(e) => e.stopPropagation()} className="bk-mobile-only" style={{
        display: "none",
        padding: "10px 16px calc(10px + env(safe-area-inset-bottom, 0))",
        borderTop: `1px solid ${DIM}`,
        alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <button onClick={prev} disabled={index === 0} style={{
          background: index === 0 ? "none" : DIM, border: `1px solid ${DIM}`,
          color: index === 0 ? DIM : STONE, padding: "8px 14px",
          fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
          cursor: index === 0 ? "default" : "pointer",
        }}>← Prev</button>
        <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.2em", color: DIM, textTransform: "uppercase" }}>
          Swipe to browse
        </span>
        <button onClick={next} disabled={index === ALL_PHOTOS.length - 1} style={{
          background: index === ALL_PHOTOS.length - 1 ? "none" : DIM, border: `1px solid ${DIM}`,
          color: index === ALL_PHOTOS.length - 1 ? DIM : STONE, padding: "8px 14px",
          fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
          cursor: index === ALL_PHOTOS.length - 1 ? "default" : "pointer",
        }}>Next →</button>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .bk-mobile-only { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
