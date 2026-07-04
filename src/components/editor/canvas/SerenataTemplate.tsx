"use client";

/**
 * SerenataTemplate — a wedding photographer template for the FRAME builder.
 * Signature 3D element: THE WEDDING ALBUM. A physical album rendered in CSS 3D
 * that opens and turns its pages with a real rotateY page-flip — linen cover
 * with the couple's names, a dedication page, photographs mounted on ivory
 * paper with vintage photo corners, a ribbon bookmark. Photos lie flat and
 * frontal on every spread (the Vernissage lesson); the 3D lives in the turn.
 * No WebGL, no new dependencies. See docs/templates/serenata.md.
 *
 * Compliance with docs/template-adapter-guide.md (pitfalls 1–11):
 *  - No injected CSS — all inline styles on the editor variables.
 *  - Responsive from the `viewport` prop (album geometry scales per device).
 *  - Album pages come from store.galleryPhotos (demo seeds as fallback); hero
 *    + portrait are EditableImage nodes.
 *  - Buttons/labels editable via the Clickable pattern; contact follows
 *    store.contact; lightbox and wheel-capture only on the live site.
 *  - Cover texts edit while the album is closed; the dedication page is flat
 *    on the left page once the cover is turned (net rotation 0). Selecting
 *    any of those nodes in the editor auto-turns the album to show them.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useEditorStore } from "~/lib/editor/store";
import { api } from "~/trpc/react";
import { fillWaTemplate } from "~/lib/editor/wa";
import type { Viewport } from "~/lib/editor/types";
import { EditableNode, EditableText, EditableImage, LogoImage } from "./primitives";

/* ── Design tokens — resolve the Design-panel variables ── */
const C = {
  bg:     "var(--ed-bg, #FBF7F2)",
  fg:     "var(--ed-fg, #40342F)",
  accent: "var(--ed-accent, #B07C70)",
  muted:  "var(--ed-muted, #A5988E)",
  line:   "color-mix(in srgb, var(--ed-fg, #40342F) 13%, transparent)",
  raised: "color-mix(in srgb, var(--ed-accent, #B07C70) 7%, var(--ed-bg, #FBF7F2))",
  body:   "color-mix(in srgb, var(--ed-fg, #40342F) 84%, var(--ed-bg, #FBF7F2))",
};
const SERIF = "var(--tpl-serif, 'Cormorant Garamond', Georgia, serif)";
const SANS  = "var(--tpl-sans, 'Raleway', system-ui, sans-serif)";
const MONO  = "var(--tpl-mono, 'Courier Prime', ui-monospace, monospace)";
/* Serenata breaks the platform's mono/sans/serif habit with a fourth voice:
   a calligraphic script for the brand, numerals and dedications — the hand
   that addresses wedding envelopes. Template constant, not user-swappable. */
const SCRIPT = "'Great Vibes', 'Segoe Script', cursive";
const PAPER = "#FFFDFA";
const CHAMPAGNE = "#F8F1E7";

/* Invitation smallcaps — widely tracked Raleway, the register of a wedding
   invitation. Replaces the uppercase-mono eyebrow treatment used elsewhere;
   Courier survives only inside the album (folio numbers), as typed captions. */
const caps = (size: number, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: SANS, fontWeight: 600, fontSize: size, letterSpacing: "0.3em", textTransform: "uppercase", ...extra,
});
const mono = (size: number, extra?: React.CSSProperties): React.CSSProperties => ({
  fontFamily: MONO, fontSize: size, letterSpacing: "0.14em", textTransform: "uppercase", ...extra,
});

const DEMO = [1059, 331, 65, 342, 447, 76, 358, 452, 1035, 429, 64, 219, 1024, 320].map((seed, i) => ({
  id: `d${i}`, src: `https://picsum.photos/seed/${seed}/900/1100`, title: "",
}));

type Work = { id: string; src: string; title?: string };

function useWorks(): Work[] {
  const galleryPhotos = useEditorStore((s) => s.galleryPhotos);
  return useMemo(() => {
    if (galleryPhotos.length === 0) return DEMO;
    return galleryPhotos.map((p, i) => ({ id: `g${i}`, src: p.src, title: p.title }));
  }, [galleryPhotos]);
}

/* ── Clickable — real control on the live site, plain span in the editor ── */
function Clickable({ kind = "button", href, onActivate, style, children }: {
  kind?: "button" | "a";
  href?: string;
  onActivate?: () => void;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const readOnly = useEditorStore((s) => s.readOnly);
  const base: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 10, ...style };
  if (!readOnly) return <span style={{ ...base, cursor: "default" }}>{children}</span>;
  if (kind === "a") return <a href={href} style={{ ...base, textDecoration: "none" }}>{children}</a>;
  return <button onClick={onActivate} style={{ ...base, cursor: "pointer" }}>{children}</button>;
}

const btnSolid: React.CSSProperties = {
  fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase",
  color: "var(--ed-btn-fg, var(--ed-bg, #FBF7F2))", background: "var(--ed-btn-bg, var(--ed-accent, #B07C70))",
  border: "1px solid var(--ed-btn-bg, var(--ed-accent, #B07C70))", borderRadius: "var(--ed-btn-radius, 0)",
  padding: "14px 28px",
};
const btnGhost: React.CSSProperties = {
  fontFamily: SANS, fontSize: 12, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase",
  color: C.fg, background: "transparent", border: `1px solid ${C.line}`,
  borderRadius: "var(--ed-btn-radius, 0)", padding: "14px 28px",
};

function Label({ index, nodeId, isMobile }: { index: string; nodeId: string; isMobile: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: isMobile ? 26 : 40 }}>
      <span style={{ fontFamily: SCRIPT, fontSize: 21, lineHeight: 1, color: C.accent }}>{index}</span>
      <div style={{ flex: 1, height: 1, background: C.line }} />
      <EditableNode id={nodeId} tag="span" style={{ ...caps(9), color: C.muted }}>
        <EditableText id={nodeId} display="inline" />
      </EditableNode>
    </div>
  );
}

/* Vintage photo corners around a mounted print */
function PhotoCorners({ inset = 4 }: { inset?: number }) {
  const c = "color-mix(in srgb, var(--ed-accent, #B07C70) 34%, #EFE6DA)";
  const s: React.CSSProperties = { position: "absolute", width: 0, height: 0, borderStyle: "solid", pointerEvents: "none" };
  const t = 15;
  return (
    <>
      <span style={{ ...s, top: inset, left: inset, borderWidth: `${t}px ${t}px 0 0`, borderColor: `${c} transparent transparent transparent` }} />
      <span style={{ ...s, top: inset, right: inset, borderWidth: `0 ${t}px ${t}px 0`, borderColor: `transparent ${c} transparent transparent` }} />
      <span style={{ ...s, bottom: inset, left: inset, borderWidth: `${t}px 0 0 ${t}px`, borderColor: `transparent transparent transparent ${c}` }} />
      <span style={{ ...s, bottom: inset, right: inset, borderWidth: `0 0 ${t}px ${t}px`, borderColor: `transparent transparent ${c} transparent` }} />
    </>
  );
}

/* ═══════════════════════════════════════════
   THE ALBUM — CSS 3D page-flip book
═══════════════════════════════════════════ */
function Album({ works, viewport, onOpen }: { works: Work[]; viewport: Viewport; onOpen: (i: number) => void }) {
  const readOnly   = useEditorStore((s) => s.readOnly);
  const selectedId = useEditorStore((s) => s.selectedId);
  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";

  const PW = isMobile ? 152 : isTablet ? 250 : 330;   // page width
  const PH = isMobile ? 200 : isTablet ? 330 : 430;   // page height
  const photos = works.slice(0, 16);
  const photoSheets = Math.ceil(photos.length / 2);
  const S = 1 + photoSheets + 1;                      // cover + photos + back cover
  const [flipped, setFlipped] = useState(0);          // sheets turned, 0..S
  const [boost, setBoost] = useState<number | null>(null); // sheet on top mid-flip
  const boostTimer = useRef<number | null>(null);

  const bump = (idx: number) => {
    setBoost(idx);
    if (boostTimer.current) window.clearTimeout(boostTimer.current);
    boostTimer.current = window.setTimeout(() => setBoost(null), 1100);
  };
  const go = (d: 1 | -1) => {
    const idx = d === 1 ? flipped : flipped - 1;
    if (idx < 0 || idx >= S) return;
    bump(idx);
    setFlipped((f) => f + d);
  };

  /* Editor nicety: selecting a cover/dedication node turns the album to it. */
  useEffect(() => {
    if (readOnly) return;
    if (selectedId === "ser-album-title" || selectedId === "ser-album-date") setFlipped(0);
    if (selectedId === "ser-album-dedication") setFlipped((f) => (f < 1 ? 1 : f));
  }, [readOnly, selectedId]);

  /* Swipe — horizontal; vertical stays free for page scroll. */
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const draggedRef = useRef(false);
  const onPointerDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, moved: false }; };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    if (Math.abs(e.clientX - drag.current.x) > 8) { drag.current.moved = true; draggedRef.current = true; }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (drag.current?.moved) {
      const dx = e.clientX - drag.current.x;
      if (dx < -50) go(1);
      else if (dx > 50) go(-1);
    }
    drag.current = null;
    setTimeout(() => { draggedRef.current = false; }, 0);
  };

  /* Wheel — live site only, so the editor canvas scroll is never hijacked. */
  const vpRef = useRef<HTMLDivElement>(null);
  const wheelAcc = useRef(0);
  useEffect(() => {
    if (!readOnly) return;
    const el = vpRef.current;
    if (!el) return;
    const fn = (e: WheelEvent) => {
      e.preventDefault();
      wheelAcc.current += e.deltaY + e.deltaX;
      if (Math.abs(wheelAcc.current) > 110) {
        go(wheelAcc.current > 0 ? 1 : -1);
        wheelAcc.current = 0;
      }
    };
    el.addEventListener("wheel", fn, { passive: false });
    return () => el.removeEventListener("wheel", fn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly, flipped, S]);

  const stageH = PH + (isMobile ? 150 : 190);
  /* Keep the visible part of the book centred: closed → cover centred;
     fully turned → back centred; open → spine centred. */
  const bookX = flipped === 0 ? PW / 2 : flipped === S ? -PW / 2 : 0;

  const face = (rotated: boolean): React.CSSProperties => ({
    position: "absolute", inset: 0, backfaceVisibility: "hidden",
    transform: rotated ? "rotateY(180deg)" : undefined,
    overflow: "hidden", boxSizing: "border-box",
  });

  /* A photo page (paper, mounted print, photo corners, folio number) */
  function PhotoPage({ idx, side }: { idx: number; side: "recto" | "verso" }) {
    const w = photos[idx];
    const pad = isMobile ? 10 : 20;
    if (!w) {
      /* Blank end-paper — fills the last verso of an odd-numbered album */
      return (
        <div style={{ position: "absolute", inset: 0, background: PAPER, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.accent, opacity: 0.45 }} />
        </div>
      );
    }
    return (
      <div style={{ position: "absolute", inset: 0, background: PAPER, padding: pad, boxSizing: "border-box" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", background: "#fff", padding: isMobile ? 5 : 9, boxSizing: "border-box", boxShadow: "0 2px 10px rgba(64,52,47,0.12)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={w.src} alt={w.title ?? ""} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <PhotoCorners inset={isMobile ? -2 : -3} />
        </div>
        <span style={{ position: "absolute", bottom: 4, [side === "recto" ? "right" : "left"]: 10, ...mono(7), color: C.muted } as React.CSSProperties}>
          {String(idx + 1).padStart(2, "0")}
        </span>
        {/* Spine shadow */}
        <div style={{ position: "absolute", top: 0, bottom: 0, [side === "recto" ? "left" : "right"]: 0, width: isMobile ? 10 : 18, pointerEvents: "none",
          background: `linear-gradient(${side === "recto" ? "90deg" : "270deg"}, rgba(64,52,47,0.14), transparent)` } as React.CSSProperties} />
      </div>
    );
  }

  return (
    <div
      ref={vpRef}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
      style={{ position: "relative", height: stageH, overflow: "hidden", background: C.raised,
        borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`,
        touchAction: "pan-y", userSelect: "none" }}
    >
      {/* Table shadow */}
      <div style={{ position: "absolute", left: "50%", top: `calc(50% + ${PH / 2 - 8}px)`, transform: "translateX(-50%)",
        width: PW * 2.3, height: 34, borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(50% 50% at 50% 50%, rgba(64,52,47,0.20), transparent 70%)" }} />

      {/* Book */}
      <div style={{ position: "absolute", left: "50%", top: "46%", width: PW * 2, height: PH,
        transform: `translate(-50%, -50%) translateX(${bookX}px)`, transition: "transform 0.9s cubic-bezier(0.4,0.05,0.2,1)",
        perspective: isMobile ? 1300 : 2000 }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>

          {/* Album boards (peek out behind the pages once open) */}
          <div style={{ position: "absolute", left: -5, top: -5, width: PW + 5, height: PH + 10,
            background: "color-mix(in srgb, var(--ed-accent, #B07C70) 76%, #241b18)", borderRadius: "6px 0 0 6px",
            opacity: flipped > 0 ? 1 : 0, transition: "opacity 0.4s ease 0.3s", boxShadow: "0 18px 40px -16px rgba(64,52,47,0.45)" }} />
          <div style={{ position: "absolute", right: -5, top: -5, width: PW + 5, height: PH + 10,
            background: "color-mix(in srgb, var(--ed-accent, #B07C70) 76%, #241b18)", borderRadius: "0 6px 6px 0",
            opacity: flipped < S ? 1 : 0, transition: "opacity 0.4s ease 0.3s", boxShadow: "0 18px 40px -16px rgba(64,52,47,0.45)" }} />

          {/* Ribbon bookmark — its tail hangs out below the pages (it lives
              INSIDE the book, so it renders under every sheet, never on top) */}
          <div style={{ position: "absolute", left: `calc(50% + ${PW * 0.3}px)`, top: PH - 30, width: 13, height: isMobile ? 52 : 66,
            background: "color-mix(in srgb, var(--ed-accent, #B07C70) 88%, #241b18)",
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 84%, 0 100%)",
            opacity: flipped === S ? 0 : 1, transition: "opacity 0.4s ease", pointerEvents: "none",
            boxShadow: "0 4px 10px rgba(64,52,47,0.3)" }} />

          {/* Sheets — right half, hinged on the spine */}
          {Array.from({ length: S }, (_, i) => {
            const isFlipped = i < flipped;
            const z = (isFlipped ? i : S - i) + (boost === i ? S + 8 : 0);
            return (
              <div key={i}
                onClick={() => { if (!draggedRef.current) go(isFlipped ? -1 : 1); }}
                style={{
                  position: "absolute", left: "50%", top: 0, width: PW, height: PH,
                  transformOrigin: "left center",
                  transform: `rotateY(${isFlipped ? -180 : 0}deg)`,
                  transition: "transform 1.05s cubic-bezier(0.45,0.05,0.2,1)",
                  transformStyle: "preserve-3d", zIndex: z, cursor: "pointer",
                }}>
                {i === 0 ? (
                  <>
                    {/* Cover — linen, the couple's names in the calligrapher's hand */}
                    <div style={{ ...face(false), background: "linear-gradient(140deg, color-mix(in srgb, var(--ed-accent, #B07C70) 88%, #2c211d) 0%, color-mix(in srgb, var(--ed-accent, #B07C70) 66%, #1d1512) 100%)", borderRadius: "0 6px 6px 0", boxShadow: "inset 0 0 40px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ position: "absolute", inset: isMobile ? 8 : 14, border: `1px solid ${CHAMPAGNE}55`, borderRadius: 2, pointerEvents: "none" }} />
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: isMobile ? 8 : 14, padding: "0 10%", textAlign: "center" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: CHAMPAGNE, opacity: 0.75 }} />
                        <EditableNode id="ser-album-title" tag="h3" style={{ fontFamily: SCRIPT, fontWeight: 400, fontSize: isMobile ? 24 : isTablet ? 37 : 46, lineHeight: 1.25, color: CHAMPAGNE, margin: 0, textShadow: "0 1px 1px rgba(0,0,0,0.35)" }}>
                          <EditableText id="ser-album-title" />
                        </EditableNode>
                        <div style={{ width: isMobile ? 28 : 44, height: 1, background: `${CHAMPAGNE}66` }} />
                        <EditableNode id="ser-album-date" tag="div" style={{ ...caps(isMobile ? 7 : 8.5), color: CHAMPAGNE, opacity: 0.85 }}>
                          <EditableText id="ser-album-date" display="inline" />
                        </EditableNode>
                      </div>
                    </div>
                    {/* Inside cover — handwritten dedication page */}
                    <div style={{ ...face(true), background: PAPER, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: isMobile ? 8 : 12, padding: "0 10%", textAlign: "center" }}>
                      <EditableNode id="ser-album-dedication" tag="p" style={{ fontFamily: SCRIPT, fontWeight: 400, fontSize: isMobile ? 15 : isTablet ? 20 : 25, lineHeight: 1.55, color: "#40342F", margin: 0 }}>
                        <EditableText id="ser-album-dedication" />
                      </EditableNode>
                      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: isMobile ? 10 : 18, background: "linear-gradient(270deg, rgba(64,52,47,0.14), transparent)", pointerEvents: "none" }} />
                    </div>
                  </>
                ) : i === S - 1 ? (
                  <>
                    {/* Colophon — the album's last page */}
                    <div style={{ ...face(false), background: PAPER, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: isMobile ? 8 : 12 }}>
                      <span style={{ fontFamily: SCRIPT, fontSize: isMobile ? 22 : 30, lineHeight: 1, color: C.accent }}>fin.</span>
                      <span style={{ ...mono(7.5), color: C.muted }}>— every album ends dancing —</span>
                      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: isMobile ? 10 : 18, background: "linear-gradient(90deg, rgba(64,52,47,0.14), transparent)", pointerEvents: "none" }} />
                    </div>
                    {/* Back cover — plain linen, so the album closes like a real one */}
                    <div style={{ ...face(true), background: "linear-gradient(220deg, color-mix(in srgb, var(--ed-accent, #B07C70) 88%, #2c211d) 0%, color-mix(in srgb, var(--ed-accent, #B07C70) 66%, #1d1512) 100%)", borderRadius: "6px 0 0 6px", boxShadow: "inset 0 0 40px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ position: "absolute", inset: isMobile ? 8 : 14, border: `1px solid ${CHAMPAGNE}44`, borderRadius: 2, pointerEvents: "none" }} />
                      <span style={{ fontFamily: SCRIPT, fontSize: isMobile ? 15 : 20, color: CHAMPAGNE, opacity: 0.6 }}>s.</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={face(false)}><PhotoPage idx={(i - 1) * 2} side="recto" /></div>
                    <div style={face(true)}><PhotoPage idx={(i - 1) * 2 + 1} side="verso" /></div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hint — fades once opened */}
      <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)",
        ...caps(7.5), color: C.muted, background: "color-mix(in srgb, var(--ed-bg, #FBF7F2) 84%, transparent)",
        border: `1px solid ${C.line}`, padding: "7px 13px", pointerEvents: "none",
        opacity: flipped > 0 ? 0 : 1, transition: "opacity 0.5s ease" }}>
        Open the album — tap the cover or swipe
      </div>

      {/* HUD */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", gap: 14, padding: isMobile ? "10px 14px" : "12px 22px", background: "color-mix(in srgb, var(--ed-bg, #FBF7F2) 88%, transparent)", borderTop: `1px solid ${C.line}`, backdropFilter: "blur(6px)" }}>
        <span style={{ ...caps(8), color: C.fg, flexShrink: 0, minWidth: 74 }}>
          {flipped === 0 ? "Cover" : flipped === S ? "Closed" : flipped === S - 1 ? "Fin" : `Pages ${flipped}/${photoSheets}`}
        </span>
        <div style={{ flex: 1, height: 2, background: C.line, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(flipped / S) * 100}%`, background: C.accent, transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)" }} />
        </div>
        {readOnly && flipped > 0 && flipped <= photoSheets && (
          <button onClick={(e) => { e.stopPropagation(); onOpen(Math.min(photos.length - 1, Math.max(0, (flipped - 1) * 2))); }}
            title="View this spread"
            style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${C.line}`, background: "transparent", color: C.fg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
          </button>
        )}
        {[{ d: -1 as const, g: "‹" }, { d: 1 as const, g: "›" }].map((b) => (
          <button key={b.g} onClick={(e) => { e.stopPropagation(); go(b.d); }}
            style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.line}`, background: "transparent", color: C.fg, fontSize: 17, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: SANS }}>
            {b.g}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Lightbox (live site only) ── */
function Lightbox({ works, startIndex, onClose }: { works: Work[]; startIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(startIndex);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, works.length - 1));
      if (e.key === "ArrowLeft")  setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, works.length]);
  const w = works[index]!;
  const arrow: React.CSSProperties = {
    position: "absolute", top: "50%", transform: "translateY(-50%)", width: 44, height: 44,
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
    background: "rgba(251,247,242,0.07)", border: "1px solid rgba(251,247,242,0.2)",
    color: "rgba(251,247,242,0.85)", borderRadius: "50%",
  };
  return (
    <div onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(24,18,16,0.96)", display: "flex", alignItems: "center", justifyContent: "center", padding: "56px 64px" }}>
      <button onClick={onClose} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", cursor: "pointer", color: "rgba(251,247,242,0.7)", ...mono(11) }}>Close ✕</button>
      {index > 0 && <button onClick={() => setIndex((i) => i - 1)} style={{ ...arrow, left: 16 }}>←</button>}
      {index < works.length - 1 && <button onClick={() => setIndex((i) => i + 1)} style={{ ...arrow, right: 16 }}>→</button>}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={w.src} alt={w.title ?? ""} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
      <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 32px", color: "rgba(251,247,242,0.6)" }}>
        <span style={mono(10)}>{String(index + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}</span>
        {w.title && <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 16, color: "rgba(251,247,242,0.85)" }}>{w.title}</span>}
        <span />
      </div>
    </div>
  );
}

/* ── Contact form — follows store.contact (inbox vs WhatsApp) ── */
function SerenataContactForm() {
  const contact  = useEditorStore((s) => s.contact);
  const siteSlug = useEditorStore((s) => s.siteSlug);
  const readOnly = useEditorStore((s) => s.readOnly);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const submit = api.contact.submit.useMutation();

  const field: React.CSSProperties = {
    fontFamily: SANS, fontSize: 13, padding: "13px 15px", width: "100%", boxSizing: "border-box",
    background: PAPER, border: `1px solid ${C.line}`, color: "#40342F", outline: "none",
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!readOnly) return;
    const fd = new FormData(e.currentTarget);
    const name    = String(fd.get("name") ?? "").trim();
    const email   = String(fd.get("email") ?? "").trim();
    const date    = String(fd.get("date") ?? "").trim();
    const body    = String(fd.get("message") ?? "").trim();
    const message = [date && `Date: ${date}`, body].filter(Boolean).join(" — ");

    if (contact.mode === "whatsapp") {
      const digits = contact.whatsapp.replace(/[^\d]/g, "");
      const text   = fillWaTemplate(contact.waTemplate, { name, email, message });
      window.open(digits ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : `https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      setStatus("sent");
      return;
    }
    if (!siteSlug) { setStatus("sent"); return; }
    try {
      setStatus("sending");
      await submit.mutateAsync({ slug: siteSlug, name: name || "—", email: email || "hello@example.com", message: message || "—" });
      setStatus("sent");
    } catch { setStatus("error"); }
  }

  if (status === "sent") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start", padding: "16px 0" }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.accent }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 21, color: C.fg }}>
          {contact.mode === "whatsapp" ? "Opening WhatsApp…" : "Sent — I'll write back within two days."}
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <input name="name" placeholder="Your names" style={field} />
        <input name="date" placeholder="Your date (if you have one)" style={field} />
      </div>
      <input name="email" type="email" placeholder="Email" style={field} />
      <textarea name="message" rows={5} placeholder="The place, the plan, how you met…" style={{ ...field, resize: "vertical" }} />
      {status === "error" && <span style={{ ...mono(10), color: "#c2412a", textTransform: "none", letterSpacing: 0 }}>Couldn&apos;t send — please try again.</span>}
      <button type="submit" disabled={status === "sending"} style={{ ...btnSolid, cursor: "pointer", opacity: status === "sending" ? 0.6 : 1 }}>
        {contact.mode === "whatsapp" ? "Send via WhatsApp" : status === "sending" ? "Sending…" : "Send the letter"}
      </button>
    </form>
  );
}

/* ═══════════════════════════════════════════
   TEMPLATE
═══════════════════════════════════════════ */
export function SerenataTemplate({ viewport }: { viewport: Viewport }) {
  const { selectNode, logo, grid, readOnly } = useEditorStore();
  const isMobile = viewport === "mobile";
  const isTablet = viewport === "tablet";
  const px = isMobile ? "1.35rem" : isTablet ? "4vw" : "6vw";

  const works = useWorks();
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const openLightbox = (i: number) => { if (readOnly) setLightboxIdx(i); };

  /* Flat fallback layouts (Design > Grid) */
  const cols = isMobile ? Math.min(grid.columns, 2) : isTablet ? Math.min(grid.columns, 3) : grid.columns;
  const [visibleCount, setVisibleCount] = useState(grid.pageSize);
  useEffect(() => { setVisibleCount(grid.pageSize); }, [grid.pageSize, grid.loadMore, grid.layout, works.length]);
  const pagedWorks  = grid.loadMore ? works.slice(0, visibleCount) : works.slice(0, 9);
  const canLoadMore = grid.loadMore && visibleCount < works.length;
  const albumWorks  = works.slice(0, 16);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  function Brand({ nodeId, size = 21, color }: { nodeId: string; size?: number; color?: string }) {
    const textEl = (
      <EditableNode id={nodeId} tag="span" style={{ fontFamily: SCRIPT, fontWeight: 400, fontSize: size * 1.3, lineHeight: 1, letterSpacing: "0.01em", color: color ?? C.fg }}>
        <EditableText id={nodeId} display="inline" />
      </EditableNode>
    );
    if (logo.mode === "image" && logo.imageUrl) return <LogoImage src={logo.imageUrl} alt={logo.text} width={logo.width} crop={logo.imageCrop} />;
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

  const navItems = [
    { id: "ser-nav-item-1", fn: () => scrollTo("ser-gallery") },
    { id: "ser-nav-item-2", fn: () => scrollTo("ser-about") },
    { id: "ser-nav-item-3", fn: () => scrollTo("ser-contact") },
  ];

  const heroH = isMobile ? 540 : isTablet ? 640 : 700;

  return (
    <div onClick={() => selectNode(null)}
      style={{ background: C.bg, color: C.fg, minHeight: "100%", fontFamily: SANS }}>

      {/* ── NAV ── */}
      <nav id="section-nav" style={{ position: "relative", zIndex: 50, display: "flex", alignItems: "center", height: isMobile ? 60 : 76, padding: `0 ${px}`, borderBottom: `1px solid ${C.line}`, background: C.bg }}>
        <Brand nodeId="ser-nav-brand" size={isMobile ? 19 : 22} />
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 14 : 30, marginLeft: "auto" }}>
          {!isMobile && navItems.map((item) => (
            <Clickable key={item.id} onActivate={item.fn}
              style={{ background: "none", border: "none", padding: 0, fontFamily: SANS, fontSize: 12, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: C.fg, opacity: 0.6 }}>
              <EditableNode id={item.id} tag="span"><EditableText id={item.id} display="inline" /></EditableNode>
            </Clickable>
          ))}
          <Clickable onActivate={() => scrollTo("ser-contact")} style={{ ...btnSolid, padding: isMobile ? "10px 16px" : "11px 20px", fontSize: 11 }}>
            <EditableNode id="ser-nav-cta" tag="span"><EditableText id="ser-nav-cta" display="inline" /></EditableNode>
          </Clickable>
        </div>
      </nav>

      {/* ── HERO — full-bleed with soft scrim ── */}
      <section id="ser-hero" style={{ position: "relative", height: heroH, overflow: "hidden" }}>
        <EditableNode id="ser-hero-image" style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <EditableImage id="ser-hero-image" imgStyle={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </EditableNode>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(180deg, rgba(24,18,16,0.42) 0%, rgba(24,18,16,0.12) 32%, rgba(24,18,16,0.14) 62%, rgba(24,18,16,0.6) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: `0 ${px}`, zIndex: 2 }}>
          <EditableNode id="ser-hero-eyebrow" tag="span" style={{ ...caps(9), color: CHAMPAGNE, opacity: 0.92, display: "inline-flex", alignItems: "center", gap: 10, marginBottom: isMobile ? 18 : 26 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: CHAMPAGNE, display: "inline-block" }} />
            <EditableText id="ser-hero-eyebrow" display="inline" />
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: CHAMPAGNE, display: "inline-block" }} />
          </EditableNode>
          <EditableNode id="ser-hero-title" tag="h1" style={{ fontFamily: SERIF, fontWeight: 500, fontSize: isMobile ? "clamp(44px,12vw,64px)" : "clamp(60px,6.5vw,110px)", lineHeight: 1.02, letterSpacing: "-0.015em", color: "#FFFDFA", margin: `0 0 ${isMobile ? "1.1rem" : "1.6rem"}`, textShadow: "0 2px 30px rgba(24,18,16,0.35)" }}>
            <EditableText id="ser-hero-title" />
          </EditableNode>
          <EditableNode id="ser-hero-sub" style={{ fontFamily: SANS, fontWeight: 400, fontSize: isMobile ? 14 : 15.5, lineHeight: 1.75, color: "rgba(255,253,250,0.88)", maxWidth: 520, marginBottom: isMobile ? "1.7rem" : "2.3rem" }}>
            <EditableText id="ser-hero-sub" />
          </EditableNode>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <Clickable onActivate={() => scrollTo("ser-gallery")} style={btnSolid}>
              <EditableNode id="ser-hero-cta-1" tag="span"><EditableText id="ser-hero-cta-1" display="inline" /></EditableNode>
            </Clickable>
            <Clickable onActivate={() => scrollTo("ser-contact")} style={{ ...btnGhost, color: "#FFFDFA", borderColor: "rgba(255,253,250,0.5)" }}>
              <EditableNode id="ser-hero-cta-2" tag="span"><EditableText id="ser-hero-cta-2" display="inline" /></EditableNode>
            </Clickable>
          </div>
        </div>
      </section>

      {/* ── THE ALBUM (3D showcase) ── */}
      <section id="ser-gallery" style={{ paddingTop: isMobile ? "2.5rem" : "4rem" }}>
        <div style={{ padding: `0 ${px}` }}>
          <Label index="i." nodeId="ser-album-label" isMobile={isMobile} />
          <EditableNode id="ser-album-note" style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: isMobile ? 17 : 21, color: C.body, maxWidth: 560, marginBottom: isMobile ? "1.6rem" : "2.4rem" }}>
            <EditableText id="ser-album-note" />
          </EditableNode>
        </div>

        {grid.layout === "corridor" ? (
          <Album works={albumWorks} viewport={viewport} onOpen={openLightbox} />
        ) : (
          <div style={{ padding: `0 ${px} ${isMobile ? "1rem" : "2rem"}` }}>
            {grid.layout === "masonry" ? (
              <div style={{ columnCount: cols, columnGap: grid.gap }}>
                {pagedWorks.map((w, i) => (
                  <div key={w.id} style={{ breakInside: "avoid", marginBottom: grid.gap, cursor: "pointer", background: C.raised }} onClick={() => openLightbox(i)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={w.src} alt={w.title ?? ""} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: grid.gap }}>
                {pagedWorks.map((w, i) => (
                  <div key={w.id} style={{ position: "relative", aspectRatio: isMobile ? "1 / 1" : "4 / 5", overflow: "hidden", cursor: "pointer", background: C.raised }} onClick={() => openLightbox(i)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={w.src} alt={w.title ?? ""} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: grid.fit, display: "block" }} />
                  </div>
                ))}
              </div>
            )}
            {canLoadMore && (
              <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
                <button onClick={() => setVisibleCount((c) => c + grid.pageSize)} style={{ ...btnGhost, cursor: "pointer" }}>Load more ↓</button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── THE DAY — three moments ── */}
      <section id="ser-moments" style={{ padding: `${isMobile ? "3.5rem" : "6rem"} ${px}` }}>
        <Label index="ii." nodeId="ser-mom-label" isMobile={isMobile} />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: isMobile ? "2.2rem" : "3.5rem" }}>
          {([["ser-mom-1-title","ser-mom-1-desc","i."],["ser-mom-2-title","ser-mom-2-desc","ii."],["ser-mom-3-title","ser-mom-3-desc","iii."]] as const).map(([tId, dId, num]) => (
            <div key={tId}>
              <span style={{ fontFamily: SCRIPT, fontSize: 30, lineHeight: 1, color: C.accent, display: "block", marginBottom: 12 }}>{num}</span>
              <EditableNode id={tId} tag="h3" style={{ fontFamily: SERIF, fontWeight: 500, fontSize: isMobile ? 24 : 28, lineHeight: 1.12, color: C.fg, margin: "0 0 0.7rem", letterSpacing: "-0.005em" }}>
                <EditableText id={tId} />
              </EditableNode>
              <EditableNode id={dId} style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.75, color: C.body }}>
                <EditableText id={dId} />
              </EditableNode>
            </div>
          ))}
        </div>
      </section>

      {/* ── KIND WORDS ── */}
      <section id="ser-quote" style={{ padding: `${isMobile ? "3.5rem" : "5.5rem"} ${px}`, background: C.raised, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, textAlign: "center" }}>
        <Label index="iii." nodeId="ser-quote-label" isMobile={isMobile} />
        <span style={{ fontFamily: SERIF, fontSize: isMobile ? 54 : 76, lineHeight: 0.6, color: C.accent, display: "block", marginBottom: "0.6rem" }}>“</span>
        <EditableNode id="ser-quote-text" tag="blockquote" style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: isMobile ? "clamp(19px,5.5vw,26px)" : "clamp(24px,2.6vw,34px)", lineHeight: 1.45, color: C.fg, maxWidth: 800, margin: "0 auto 1.4rem", letterSpacing: "-0.005em" }}>
          <EditableText id="ser-quote-text" />
        </EditableNode>
        <EditableNode id="ser-quote-author" tag="div" style={{ ...caps(8.5), color: C.muted }}>
          <EditableText id="ser-quote-author" display="inline" />
        </EditableNode>
      </section>

      {/* ── THE PHOTOGRAPHER — arched portrait ── */}
      <section id="ser-about" style={{ padding: `${isMobile ? "3.5rem" : "6rem"} ${px}` }}>
        <Label index="iv." nodeId="ser-about-label" isMobile={isMobile} />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "minmax(250px, 350px) 1fr", gap: isMobile ? "2.4rem" : "5rem", alignItems: "start" }}>
          {/* Chapel-arch portrait */}
          <EditableNode id="ser-about-image" style={{ position: "relative", width: "100%", maxWidth: isMobile ? 290 : undefined, aspectRatio: "4 / 5.4", overflow: "hidden", borderRadius: "50% 50% 0 0 / 34% 34% 0 0", border: `1px solid ${C.line}`, background: PAPER, padding: 9, boxSizing: "border-box", boxShadow: "0 24px 48px -22px rgba(64,52,47,0.35)" }}>
            <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: "50% 50% 0 0 / 34% 34% 0 0" }}>
              <EditableImage id="ser-about-image" imgStyle={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </EditableNode>
          <div>
            <EditableNode id="ser-about-heading" tag="h2" style={{ fontFamily: SERIF, fontWeight: 500, fontSize: isMobile ? "clamp(30px,9vw,42px)" : "clamp(38px,3.8vw,58px)", lineHeight: 1.08, letterSpacing: "-0.012em", color: C.fg, margin: "0 0 1.3rem" }}>
              <EditableText id="ser-about-heading" />
            </EditableNode>
            <EditableNode id="ser-about-body" style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.85, color: C.body, maxWidth: 560, marginBottom: "2.1rem" }}>
              <EditableText id="ser-about-body" />
            </EditableNode>
            <div style={{ display: "flex", gap: isMobile ? "1.8rem" : "3rem", paddingTop: "1.7rem", borderTop: `1px solid ${C.line}` }}>
              {([["ser-stat-1-value","ser-stat-1-label"],["ser-stat-2-value","ser-stat-2-label"],["ser-stat-3-value","ser-stat-3-label"]] as const).map(([vId, lId]) => (
                <div key={vId}>
                  <EditableNode id={vId} style={{ fontFamily: SERIF, fontSize: isMobile ? 28 : 36, fontWeight: 500, color: C.accent, lineHeight: 1 }}>
                    <EditableText id={vId} />
                  </EditableNode>
                  <EditableNode id={lId} style={{ ...caps(8), color: C.muted, marginTop: 7 }}>
                    <EditableText id={lId} />
                  </EditableNode>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── YOUR DATE (contact) ── */}
      <section id="ser-contact" style={{ padding: `${isMobile ? "3.5rem" : "6rem"} ${px} ${isMobile ? "4rem" : "6.5rem"}`, borderTop: `1px solid ${C.line}`, background: C.raised }}>
        <Label index="v." nodeId="ser-contact-label" isMobile={isMobile} />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "2.5rem" : "5rem", alignItems: "start" }}>
          <div>
            <EditableNode id="ser-contact-heading" tag="h2" style={{ fontFamily: SERIF, fontWeight: 500, fontSize: isMobile ? "clamp(34px,10vw,46px)" : "clamp(40px,4.2vw,64px)", lineHeight: 1.05, letterSpacing: "-0.012em", color: C.fg, margin: "0 0 1.3rem" }}>
              <EditableText id="ser-contact-heading" />
            </EditableNode>
            <EditableNode id="ser-contact-body" style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.8, color: C.body, maxWidth: 420, marginBottom: "2rem" }}>
              <EditableText id="ser-contact-body" />
            </EditableNode>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {([["ser-contact-d1-label","ser-contact-d1-value"],["ser-contact-d2-label","ser-contact-d2-value"],["ser-contact-d3-label","ser-contact-d3-value"]] as const).map(([lId, vId]) => (
                <div key={lId} style={{ display: "flex", gap: "1.2rem", alignItems: "baseline" }}>
                  <EditableNode id={lId} tag="span" style={{ ...caps(8), color: C.accent, minWidth: 66 }}>
                    <EditableText id={lId} display="inline" />
                  </EditableNode>
                  <EditableNode id={vId} tag="span" style={{ fontFamily: SANS, fontSize: 13.5, color: C.fg }}>
                    <EditableText id={vId} display="inline" />
                  </EditableNode>
                </div>
              ))}
            </div>
          </div>
          <SerenataContactForm />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="section-footer" style={{ padding: `1.9rem ${px}`, borderTop: `1px solid ${C.line}`, display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", justifyContent: "space-between", gap: "0.9rem" }}>
        <Brand nodeId="ser-footer-brand" size={18} />
        <EditableNode id="ser-footer-copy" tag="span" style={{ ...caps(7.5), color: C.muted }}>
          <EditableText id="ser-footer-copy" display="inline" />
        </EditableNode>
        <span style={{ fontFamily: SCRIPT, fontSize: 19, lineHeight: 1, color: C.accent }}>hasta el último baile</span>
      </footer>

      {readOnly && lightboxIdx !== null && (
        <Lightbox works={grid.layout === "corridor" ? albumWorks : pagedWorks} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      )}
    </div>
  );
}
