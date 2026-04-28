"use client";

/**
 * AtelierTemplate — adapted fork of src/app/template/atelier/page.tsx
 * for the FRAME website builder.  See docs/template-adapter-guide.md.
 *
 * Differences from the source template:
 *  1. Password gate skipped — the editor renders the gallery directly.
 *  2. Entrance curtain animation skipped — distracting and one-time only.
 *  3. Topbar changed from `position: sticky` → `position: relative` so it
 *     doesn't escape the device frame.
 *  4. Hero entrance stagger removed; rendered in final state.
 *  5. Editable text/image nodes wrapped with EditableNode primitives.
 *  6. All top-level sections have `atl-section-*` ids matching SECTIONS
 *     in src/lib/editor/templates/atelier.tsx.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { useEditorStore } from "~/lib/editor/store";
import type { Viewport } from "~/lib/editor/types";
import { EditableNode, EditableText, EditableImage, LogoImage } from "./primitives";

const SERIF = "var(--tpl-serif), 'Cormorant Garamond', Georgia, serif";
const SANS  = "var(--tpl-sans), Inter, -apple-system, sans-serif";
const MONO  = "var(--tpl-mono), 'Space Mono', ui-monospace, monospace";

/* Editorial layout — each photo gets a deliberate column/row span */
const PHOTOS: { seed: number; col: number; row: number }[] = [
  { seed: 201,  col: 8, row: 5 },
  { seed: 1024, col: 4, row: 5 },
  { seed: 1015, col: 4, row: 3 },
  { seed: 433,  col: 4, row: 3 },
  { seed: 64,   col: 4, row: 3 },
  { seed: 100,  col: 6, row: 4 },
  { seed: 357,  col: 6, row: 4 },
  { seed: 200,  col: 4, row: 3 },
  { seed: 250,  col: 8, row: 4 },
  { seed: 300,  col: 4, row: 4 },
  { seed: 1042, col: 6, row: 3 },
  { seed: 1080, col: 6, row: 3 },
  { seed: 411,  col: 4, row: 4 },
  { seed: 522,  col: 8, row: 4 },
];

export function AtelierTemplate({ viewport }: { viewport: Viewport }) {
  const { selectNode, logo } = useEditorStore();
  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  /* Responsive scaling — mirrors the source template's clamp() values */
  const padX = isMobile ? 20 : isTablet ? 32 : 48;

  /* Brand renders text/image/both based on Settings > Logo.
     Image uses logo.width (height auto) so it scales with the Settings stepper. */
  function Brand({ nodeId }: { nodeId: string }) {
    const textEl = (
      <EditableNode id={nodeId} tag="span">
        <EditableText id={nodeId} />
      </EditableNode>
    );
    if (logo.mode === "image" && logo.imageUrl) {
      return <LogoImage src={logo.imageUrl} alt={logo.text} width={logo.width} crop={logo.imageCrop} />;
    }
    if (logo.mode === "image+text" && logo.imageUrl) {
      return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <LogoImage src={logo.imageUrl} width={logo.width} crop={logo.imageCrop} />
          {textEl}
        </span>
      );
    }
    return textEl;
  }

  return (
    <main
      onClick={() => selectNode(null)}
      style={{ background: "#fafaf8", color: "#0a0a0a", fontFamily: SANS, minHeight: "100%" }}
    >

      {/* ── Topbar ───────────────────────────────────────────── */}
      <nav
        id="atl-section-nav"
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr auto" : "1fr auto 1fr",
          alignItems: "center",
          padding: `${isMobile ? 16 : 22}px ${padX}px`,
          borderBottom: "1px solid rgba(216,212,204,0.6)",
          background: "rgba(250,250,248,0.95)",
          fontFamily: MONO, fontSize: isMobile ? 10 : 11,
          letterSpacing: "0.22em", textTransform: "uppercase", color: "#0a0a0a",
          gap: 12,
        }}
      >
        <Brand nodeId="atl-nav-brand" />

        {!isMobile && (
          <EditableNode id="atl-nav-subtitle" tag="span" style={{ color: "#7a766f", textAlign: "center" }}>
            <EditableText id="atl-nav-subtitle" />
          </EditableNode>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: isMobile ? 14 : 24 }}>
          {!isMobile && <span style={{ color: "#0a0a0a" }}>The collection</span>}
          <span style={{
            color: "#0a0a0a",
            borderBottom: "1px solid #0a0a0a", paddingBottom: 1,
          }}>Download ↓</span>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header
        id="atl-section-hero"
        style={{
          padding: `${isMobile ? 60 : 100}px ${padX}px ${isMobile ? 40 : 80}px`,
          textAlign: "center", maxWidth: 980, margin: "0 auto",
        }}
      >
        <EditableNode id="atl-hero-eyebrow" tag="p" style={{
          fontFamily: MONO, fontSize: 11, letterSpacing: "0.22em",
          textTransform: "uppercase", color: "#7a766f", marginBottom: 36,
        }}>
          <EditableText id="atl-hero-eyebrow" />
        </EditableNode>

        <EditableNode id="atl-hero-title" tag="h1" style={{
          fontFamily: SERIF,
          fontSize: isMobile ? 64 : isTablet ? 96 : "clamp(72px, 12vw, 152px)",
          fontWeight: 300, lineHeight: 0.92, letterSpacing: "-0.035em",
          margin: 0, marginBottom: 20, color: "#0a0a0a",
        }}>
          <EditableText id="atl-hero-title" />
        </EditableNode>

        <EditableNode id="atl-hero-subtitle" tag="p" style={{
          fontFamily: SERIF,
          fontSize: isMobile ? 18 : "clamp(20px, 2.4vw, 28px)",
          fontStyle: "italic", color: "#4a4742", lineHeight: 1.4,
          fontWeight: 300, maxWidth: 640, margin: "0 auto",
        }}>
          <EditableText id="atl-hero-subtitle" />
        </EditableNode>

        <div style={{ width: 1, height: isMobile ? 32 : 48, background: "#0a0a0a", margin: `${isMobile ? 48 : 72}px auto 0` }} />
      </header>

      {/* ── Cover photo ──────────────────────────────────────── */}
      <section
        id="atl-section-cover"
        style={{ padding: `0 ${padX}px ${isMobile ? 60 : 96}px`, maxWidth: 1480, margin: "0 auto" }}
      >
        <EditableNode id="atl-hero-photo" style={{
          aspectRatio: "16/9", overflow: "hidden", background: "#000",
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.25)",
        }}>
          <EditableImage id="atl-hero-photo" imgStyle={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </EditableNode>

        <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
          <EditableNode id="atl-hero-caption" tag="p" style={{
            fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em",
            textTransform: "uppercase", color: "#7a766f", margin: 0,
          }}>
            <EditableText id="atl-hero-caption" />
          </EditableNode>
          <EditableNode id="atl-hero-date" tag="p" style={{
            fontFamily: SERIF, fontStyle: "italic", fontSize: 16, color: "#4a4742", margin: 0,
          }}>
            <EditableText id="atl-hero-date" />
          </EditableNode>
        </div>
      </section>

      {/* ── Section divider — collection ─────────────────────── */}
      <section
        id="atl-section-collection"
        style={{
          padding: `${isMobile ? 56 : 80}px ${padX}px ${isMobile ? 40 : 56}px`,
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          borderTop: "1px solid #d8d4cc",
          maxWidth: 1480, margin: "0 auto",
          flexWrap: "wrap", gap: 24,
        }}
      >
        <div>
          <EditableNode id="atl-coll-roman" tag="p" style={{
            fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em",
            textTransform: "uppercase", color: "#7a766f", marginBottom: 12, margin: 0,
          }}>
            <EditableText id="atl-coll-roman" />
          </EditableNode>
          <EditableNode id="atl-coll-title" tag="h2" style={{
            fontFamily: SERIF,
            fontSize: isMobile ? 44 : "clamp(44px, 6vw, 72px)",
            fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.015em",
            margin: 0, marginTop: 12, lineHeight: 1, color: "#0a0a0a",
          }}>
            <EditableText id="atl-coll-title" />
          </EditableNode>
        </div>
        <EditableNode id="atl-coll-meta" tag="p" style={{
          fontFamily: MONO, fontSize: 11, letterSpacing: "0.22em",
          textTransform: "uppercase", color: "#7a766f", textAlign: "right", margin: 0,
        }}>
          <EditableText id="atl-coll-meta" />
        </EditableNode>

        {/* Editorial grid (decorative — not editable per README) */}
        <div style={{ width: "100%", marginTop: isMobile ? 40 : 56 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${isMobile ? 4 : 12}, 1fr)`,
            gap: isMobile ? 8 : 16,
            gridAutoRows: isMobile ? 56 : 84,
          }}>
            {PHOTOS.map((p, i) => (
              <Plate
                key={p.seed}
                seed={p.seed}
                idx={i}
                total={PHOTOS.length}
                col={isMobile ? Math.min(p.col, 4) : p.col}
                row={isMobile ? Math.max(2, Math.floor(p.row * 0.7)) : p.row}
                onOpen={() => setLightboxIdx(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Pull quote ───────────────────────────────────────── */}
      <section
        id="atl-section-quote"
        style={{
          padding: `${isMobile ? 64 : 120}px ${padX}px`,
          maxWidth: 880, margin: "0 auto",
          textAlign: "center",
          borderTop: "1px solid #d8d4cc",
          borderBottom: "1px solid #d8d4cc",
        }}
      >
        <EditableNode id="atl-quote-text" tag="blockquote" style={{
          fontFamily: SERIF,
          fontSize: isMobile ? 22 : "clamp(28px, 3.8vw, 44px)",
          fontWeight: 300, fontStyle: "italic", lineHeight: 1.35,
          letterSpacing: "-0.005em", margin: 0, color: "#1a1a1a",
        }}>
          <EditableText id="atl-quote-text" />
        </EditableNode>
        <EditableNode id="atl-quote-author" tag="p" style={{
          marginTop: 32, fontFamily: MONO, fontSize: 10, letterSpacing: "0.25em",
          textTransform: "uppercase", color: "#7a766f",
        }}>
          <EditableText id="atl-quote-author" />
        </EditableNode>
      </section>

      {/* ── Closing block ────────────────────────────────────── */}
      <section
        id="atl-section-closing"
        style={{ padding: `${isMobile ? 64 : 96}px ${padX}px ${isMobile ? 56 : 80}px`, maxWidth: 1480, margin: "0 auto" }}
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 32 : 64,
          alignItems: "center",
        }}>
          <EditableNode id="atl-close-image" style={{
            aspectRatio: "4/5", overflow: "hidden", background: "#000",
          }}>
            <EditableImage id="atl-close-image" imgStyle={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </EditableNode>

          <div>
            <EditableNode id="atl-close-eyebrow" tag="p" style={{
              fontFamily: MONO, fontSize: 11, letterSpacing: "0.22em",
              textTransform: "uppercase", color: "#7a766f", marginBottom: 24, margin: 0,
            }}>
              <EditableText id="atl-close-eyebrow" />
            </EditableNode>

            <EditableNode id="atl-close-heading" tag="h3" style={{
              fontFamily: SERIF,
              fontSize: isMobile ? 32 : "clamp(36px, 4.5vw, 56px)",
              fontWeight: 300, fontStyle: "italic", letterSpacing: "-0.015em",
              lineHeight: 1.05, margin: 0, marginTop: 24, marginBottom: 28, color: "#0a0a0a",
            }}>
              <EditableText id="atl-close-heading" />
            </EditableNode>

            <EditableNode id="atl-close-body" tag="p" style={{
              fontSize: 15, lineHeight: 1.7, color: "#3a3a3a", maxWidth: 460, marginBottom: 28, margin: 0,
            }}>
              <EditableText id="atl-close-body" />
            </EditableNode>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
              <EditableNode id="atl-close-cta-1" tag="span" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 26px", background: "#0a0a0a", color: "#fafaf8",
                fontFamily: MONO, fontSize: 11, letterSpacing: "0.18em",
                textTransform: "uppercase", cursor: "pointer",
              }}>
                <EditableText id="atl-close-cta-1" />
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
              </EditableNode>
              <EditableNode id="atl-close-cta-2" tag="span" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                padding: "14px 26px", background: "transparent", color: "#0a0a0a",
                border: "1px solid #0a0a0a",
                fontFamily: MONO, fontSize: 11, letterSpacing: "0.18em",
                textTransform: "uppercase", cursor: "pointer",
              }}>
                <EditableText id="atl-close-cta-2" />
              </EditableNode>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer
        id="atl-section-footer"
        style={{
          padding: `${isMobile ? 32 : 48}px ${padX}px ${isMobile ? 40 : 64}px`,
          borderTop: "1px solid #d8d4cc",
          display: "flex", justifyContent: "space-between", alignItems: "flex-end",
          flexWrap: "wrap", gap: 32,
        }}
      >
        <div>
          <div style={{
            fontFamily: SERIF, fontStyle: "italic", fontSize: 28, color: "#0a0a0a",
            marginBottom: 8, fontWeight: 300, letterSpacing: "-0.01em",
          }}>
            <Brand nodeId="atl-footer-brand" />
          </div>
          <EditableNode id="atl-footer-copy" tag="p" style={{
            fontFamily: MONO, fontSize: 10, letterSpacing: "0.2em",
            textTransform: "uppercase", color: "#7a766f", margin: 0,
          }}>
            <EditableText id="atl-footer-copy" />
          </EditableNode>
        </div>
        <nav style={{ display: "flex", gap: 28, fontFamily: MONO, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          <span style={{ color: "#3a3a3a", paddingBottom: 2 }}>Contact</span>
          <span style={{ color: "#3a3a3a", paddingBottom: 2 }}>Instagram</span>
          <span style={{ color: "#3a3a3a", paddingBottom: 2 }}>Print shop</span>
        </nav>
      </footer>

      {/* ── Lightbox (preview interaction) ───────────────────── */}
      {lightboxIdx !== null && (
        <Lightbox photos={PHOTOS} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
    </main>
  );
}

/* ── Decorative photo plate (per README, not wrapped) ───────── */
function Plate({ seed, idx, total, col, row, onOpen }: { seed: number; idx: number; total: number; col: number; row: number; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <figure
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => { e.stopPropagation(); onOpen(); }}
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
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 50%)",
        opacity: hover ? 1 : 0.6,
        transition: "opacity 300ms ease",
        pointerEvents: "none",
      }} />
      <figcaption style={{
        position: "absolute", bottom: 14, left: 16, right: 16,
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        color: "#fafaf8",
        transition: "transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        transform: hover ? "translateY(0)" : "translateY(2px)",
        pointerEvents: "none",
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

/* ── Lightbox (overlay preview, kept fixed per README) ──────── */
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
    <div
      onClick={(e) => e.stopPropagation()}
      style={{ position: "fixed", inset: 0, zIndex: 1100, background: "#0a0a0a", display: "flex", flexDirection: "column", userSelect: "none" }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)", pointerEvents: "none" }}>
        <button onClick={onClose} style={{ pointerEvents: "auto", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", padding: "6px 10px", fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>
          {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
        <div style={{ pointerEvents: "auto" }}>
          {zoom > 1 && (
            <button onClick={resetView} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)", cursor: "pointer", padding: "5px 10px", fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              {Math.round(zoom * 100)}% · Reset
            </button>
          )}
        </div>
      </div>

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
    </div>
  );
}
