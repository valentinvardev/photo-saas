"use client";

/* ─── Brooklyn Delivery — canonical client gallery ────────────────────
   Single source of truth: this component is rendered both by the
   public route /d/[id], and (without `embedded`-style mode) by the
   delivery editor's preview frame. All copy + cover + theme flow from
   the DeliveryPage data; nothing is hardcoded per-client.

   The default export here is the public demo at /template/brooklyn/delivery
   — it pulls the first brooklyn page from the store (or DEFAULT_PAGE) so
   the marketing surface keeps working.
─────────────────────────────────────────────────────────────────── */

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { effectiveStyle, INITIAL_PAGES, type DeliveryPage } from "~/lib/delivery/data";
import { useDeliveryStore } from "~/lib/delivery/store";
import { EditableText, EditableImage, EditableHoverStyles, type FontSlot } from "~/components/delivery/editable";

const RED   = "#E8382C";
const BLACK = "#0D0D0D";
const DARK  = "#161616";
const STONE = "#F0EFE9";
const GRAY  = "#7A7A7A";
const DIM   = "#2A2A2A";

const FALLBACK_SANS  = "var(--bk-sans), 'Space Grotesk', system-ui, sans-serif";
const FALLBACK_MONO  = "var(--bk-mono), 'Space Mono', monospace";
const FALLBACK_SERIF = "var(--bk-serif), 'DM Serif Display', Georgia, serif";

const CURTAIN_EASE     = [0.76, 0, 0.24, 1] as const;
const CURTAIN_DURATION = 1.1;

type Setter = <K extends keyof DeliveryPage>(k: K, v: DeliveryPage[K]) => void;
type DeliveryView = "gallery" | "password";

interface BrooklynDeliveryProps {
  page: DeliveryPage;
  /** "password" forces the gate, "gallery" forces the gallery. When omitted,
   *  the gate is shown if page.passwordEnabled and `onUnlock` hasn't been called. */
  view?: DeliveryView;
  /** Editor only — receiving this turns on EditableText/EditableImage primitives
   *  and disables blocking UI (lightbox, mobile selection bar, curtain). */
  set?: Setter;
  /** Editor only — open the cover image picker. */
  onRequestCoverChange?: () => void;
  /** Public route — fired when the user enters the correct password. */
  onUnlock?: (password: string) => void;
}

/* ── Slot helpers ────────────────────────────────────────────── */

function slotFor(page: DeliveryPage, slot: FontSlot, fallback: string) {
  const v = slot === 1 ? page.fontFamily1 : slot === 2 ? page.fontFamily2 : page.fontFamily3;
  return v && v.trim() ? v : fallback;
}

function themeFor(page: DeliveryPage) {
  const ts = effectiveStyle(page);
  return page.customColors
    ? { bg: ts.bg, fg: ts.fg, muted: GRAY, line: DIM, raised: DARK, accent: ts.accent, btnBg: ts.btnBg, btnFg: ts.btnFg }
    : { bg: BLACK, fg: STONE, muted: GRAY, line: DIM, raised: DARK, accent: RED, btnBg: RED, btnFg: BLACK };
}

function coverImgStyle(page: DeliveryPage, extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    width: "100%", height: "100%",
    objectFit: page.coverFit ?? "cover",
    objectPosition: `${page.coverPositionX ?? 50}% ${page.coverPositionY ?? 50}%`,
    background: page.coverFit === "contain" ? "#000" : undefined,
    display: "block",
    ...extra,
  };
}

/* Distribute page.photoSeeds into 3 chapters, preserving Brooklyn's
   editorial structure. If there are fewer than 6 photos we collapse to
   a single "Gallery" section so the layout doesn't look empty. */
const SECTION_DEFAULTS = [
  { id: "ceremony",  label: "Ceremony",  note: "Vows, rings, and the long walk back down the aisle." },
  { id: "portraits", label: "Portraits", note: "Quiet moments between the two of you, golden hour above the river." },
  { id: "reception", label: "Reception", note: "Toasts, first dance, and the kind of party that ended at 2am." },
] as const;

function chaptersForPage(page: DeliveryPage) {
  const seeds = page.photoSeeds.length > 0 ? page.photoSeeds : [10, 71, 82, 93, 100, 111, 122, 133, 144, 155, 166, 177];
  if (seeds.length < 6) {
    return [{ ...SECTION_DEFAULTS[0], label: "Gallery", note: "Your complete delivery.", photos: seeds }];
  }
  const third = Math.floor(seeds.length / 3);
  return [
    { ...SECTION_DEFAULTS[0], photos: seeds.slice(0, third) },
    { ...SECTION_DEFAULTS[1], photos: seeds.slice(third, third * 2) },
    { ...SECTION_DEFAULTS[2], photos: seeds.slice(third * 2) },
  ];
}

/* ══════════════════════════════════════════════════════════════════
   PUBLIC API — single component, two views
══════════════════════════════════════════════════════════════════ */

export function BrooklynDelivery({ page, view, set, onRequestCoverChange, onUnlock }: BrooklynDeliveryProps) {
  /* Public route: track unlock state internally if no explicit view */
  const [internalUnlocked, setInternalUnlocked] = useState(!page.passwordEnabled);
  const [transitioning, setTransitioning]       = useState(false);

  const isEditor = !!set;
  const resolvedView: DeliveryView =
    view ?? (page.passwordEnabled && !internalUnlocked ? "password" : "gallery");

  function handleUnlockAttempt(pwd: string) {
    /* In the editor we don't actually validate — the gate is for editing copy. */
    if (isEditor) { onUnlock?.(pwd); return; }
    if (pwd === page.password || !page.passwordEnabled) {
      setTransitioning(true);
      const half = (CURTAIN_DURATION * 1000) / 2;
      setTimeout(() => setInternalUnlocked(true), half);
      setTimeout(() => setTransitioning(false), CURTAIN_DURATION * 1000 + 50);
      onUnlock?.(pwd);
      return true;
    }
    return false;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: isEditor ? undefined : "100dvh" }}>
      <EditableHoverStyles />
      {resolvedView === "password" ? (
        <PasswordGate page={page} set={set} onSubmit={handleUnlockAttempt} />
      ) : (
        <Gallery page={page} set={set} onRequestCoverChange={onRequestCoverChange} isEditor={isEditor} />
      )}

      {!isEditor && (
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
                fontFamily: slotFor(page, 3, FALLBACK_MONO),
                fontSize: 12, letterSpacing: "0.32em", textTransform: "uppercase",
                color: BLACK, fontWeight: 700, textAlign: "center", padding: "0 24px",
              }}>
                Welcome, {(page.client || "").split(/\s*&\s*/)[0] || page.client}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

/* ── Stagger variants — photos cascade in ────────────────────── */
const gridVariants: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.1 } },
};
const photoVariants: Variants = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ══════════════════════════════════════════════════════════════════
   PASSWORD GATE
══════════════════════════════════════════════════════════════════ */

function PasswordGate({ page, set, onSubmit }: { page: DeliveryPage; set?: Setter; onSubmit: (pwd: string) => boolean | void }) {
  const t        = themeFor(page);
  const fSerif   = slotFor(page, 1, FALLBACK_SERIF);
  const fSans    = slotFor(page, 2, FALLBACK_SANS);
  const fMono    = slotFor(page, 3, FALLBACK_MONO);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  function attempt() {
    if (!value.trim()) {
      setError(true); setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2000);
      return;
    }
    const result = onSubmit(value);
    if (result === false) {
      setError(true); setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2000);
    }
  }

  return (
    <main style={{ fontFamily: fSans, background: t.bg, color: t.fg, minHeight: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "auto" }}>
      <div style={{ height: 3, background: t.accent, flexShrink: 0 }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, justifyContent: "center" }}>
          <span style={{ width: 8, height: 8, background: t.accent, display: "inline-block" }} />
          <EditableText
            fieldPath="logoText" value={page.logoText || "STUDIO"} onChange={set ? (v) => set("logoText", v) : undefined}
            as="span" fontSlot={3}
            style={{ fontFamily: fMono, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: t.accent }}
          />
          <span style={{ fontFamily: fMono, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: t.accent }} data-font-slot={3}>
            · Client Gallery
          </span>
        </div>

        <EditableText
          fieldPath="passwordTitle"
          value={page.passwordTitle}
          onChange={set ? (v) => set("passwordTitle", v) : undefined}
          as="h1" fontSlot={1}
          style={{
            fontFamily: fSerif, fontStyle: "italic", fontSize: "clamp(28px, 8vw, 52px)",
            fontWeight: 400, color: t.fg, letterSpacing: "-0.02em", lineHeight: 1,
            textAlign: "center", margin: "0 0 8px",
          }}
        />
        <EditableText
          fieldPath="passwordSubtitle"
          value={page.passwordSubtitle}
          onChange={set ? (v) => set("passwordSubtitle", v) : undefined}
          as="p" multiline fontSlot={3}
          style={{ fontFamily: fMono, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: t.muted, margin: "0 0 40px", textAlign: "center", maxWidth: 380 }}
        />

        <div style={{ width: "100%", maxWidth: 340, animation: shake ? "bk-shake 0.4s ease" : "none" }}>
          <style>{`
            @keyframes bk-shake {
              0%,100% { transform: translateX(0); }
              20%,60% { transform: translateX(-8px); }
              40%,80% { transform: translateX(8px); }
            }
          `}</style>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontFamily: fMono, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: t.muted }}>
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
                background: t.raised, border: `1px solid ${error ? t.accent : t.line}`,
                color: t.fg, fontFamily: fMono, fontSize: 13,
                outline: "none", letterSpacing: "0.08em",
                transition: "border-color 0.2s", boxSizing: "border-box",
              }}
            />
            {error && (
              <p style={{ fontFamily: fMono, fontSize: 9, letterSpacing: "0.16em", color: t.accent, margin: 0 }}>
                Incorrect code. Try again.
              </p>
            )}
            <EditableText
              fieldPath="passwordButtonLabel"
              value={page.passwordButtonLabel}
              onChange={set ? (v) => set("passwordButtonLabel", v) : undefined}
              as="button" fontSlot={3}
              style={{
                width: "100%", padding: "14px",
                background: t.btnBg, border: "none",
                color: t.btnFg, fontFamily: fMono, fontSize: 11,
                fontWeight: 700, letterSpacing: "0.18em",
                textTransform: "uppercase", cursor: "pointer",
                transition: "background 0.2s", marginTop: 4,
              }}
            />
          </div>
        </div>

        <EditableText
          fieldPath="passwordHint"
          value={page.passwordHint}
          onChange={set ? (v) => set("passwordHint", v) : undefined}
          as="p" multiline fontSlot={3}
          placeholder={set ? "Optional hint" : ""}
          style={{ fontFamily: fMono, fontSize: 9, color: t.muted, letterSpacing: "0.12em", marginTop: 32, textAlign: "center", maxWidth: 320 }}
        />
      </div>
    </main>
  );
}

/* ══════════════════════════════════════════════════════════════════
   GALLERY — main view
══════════════════════════════════════════════════════════════════ */

type FilterMode = "all" | "favorites";

function Gallery({
  page, set, onRequestCoverChange, isEditor,
}: {
  page: DeliveryPage; set?: Setter; onRequestCoverChange?: () => void; isEditor: boolean;
}) {
  const t      = themeFor(page);
  const fSerif = slotFor(page, 1, FALLBACK_SERIF);
  const fSans  = slotFor(page, 2, FALLBACK_SANS);
  const fMono  = slotFor(page, 3, FALLBACK_MONO);

  const chapters     = chaptersForPage(page);
  const allPhotos    = chapters.flatMap((c) => c.photos.map((seed) => ({ seed, section: c.id })));
  const photoCount   = allPhotos.length;

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [selected,    setSelected]    = useState<Set<number>>(new Set());
  const [favorites,   setFavorites]   = useState<Set<number>>(new Set());
  const [filter,      setFilter]      = useState<FilterMode>("all");
  const [downloading, setDownloading] = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const scrollerRef = useRef<HTMLElement>(null);

  /* Scroll detection — works both in viewport (public route) and inside
     the editor's preview iframe-like container. */
  useEffect(() => {
    if (isEditor) return;
    const fn = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [isEditor]);

  function toggleSelect(idx: number) {
    if (isEditor) return;
    setSelected((p) => { const n = new Set(p); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });
  }
  function toggleFavorite(idx: number) {
    if (isEditor) return;
    setFavorites((p) => { const n = new Set(p); n.has(idx) ? n.delete(idx) : n.add(idx); return n; });
  }
  function selectAllVisible(visibleIdxs: number[]) {
    if (isEditor) return;
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

  const visibleIndices = allPhotos.map((_, i) => i).filter((i) => filter === "all" || favorites.has(i));
  const downloadLabel = selected.size > 0 ? `Download ${selected.size}` : "Download all";

  return (
    <main ref={scrollerRef} style={{ fontFamily: fSans, background: t.bg, color: t.fg, minHeight: "100%", height: isEditor ? "100%" : undefined, overflowY: isEditor ? "auto" : undefined }}>
      <div style={{ height: 3, background: t.accent }} />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header style={{ position: "relative", overflow: "hidden" }}>
        <EditableImage
          fieldPath="coverUrl"
          onRequestChange={onRequestCoverChange}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            maxHeight: isEditor ? 360 : "70dvh",
            minHeight: 240,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.coverUrl || `https://picsum.photos/seed/${page.coverSeed}/1800/1000`}
            alt={`${page.client} cover`}
            style={coverImgStyle(page)}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(13,13,13,0.2) 0%, rgba(13,13,13,0.1) 30%, rgba(13,13,13,0.85) 100%)",
            pointerEvents: "none",
          }} />

          {/* Photographer mark */}
          <div style={{
            position: "absolute", top: 16, left: 16,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ width: 8, height: 8, background: t.accent, display: "inline-block" }} />
            <EditableText
              fieldPath="logoText" value={page.logoText || "STUDIO"} onChange={set ? (v) => set("logoText", v) : undefined}
              as="span" fontSlot={3}
              style={{ fontFamily: fMono, fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: t.fg }}
            />
          </div>

          {/* Title block */}
          <div style={{
            position: "absolute",
            left: "clamp(16px, 4vw, 48px)",
            right: "clamp(16px, 4vw, 48px)",
            bottom: "clamp(20px, 4vw, 40px)",
          }}>
            <p style={{
              fontFamily: fMono, fontSize: 10, letterSpacing: "0.28em",
              textTransform: "uppercase", color: t.accent, margin: "0 0 12px",
            }} data-font-slot={3}>
              <EditableText fieldPath="title" value={page.title} onChange={set ? (v) => set("title", v) : undefined} as="span" fontSlot={3} />
              {" · "}{chapters.length} chapters
            </p>
            <EditableText
              fieldPath="client" value={page.client} onChange={set ? (v) => set("client", v) : undefined}
              as="h1" fontSlot={1}
              style={{
                fontFamily: fSerif, fontStyle: "italic",
                fontSize: "clamp(36px, 8vw, 92px)", fontWeight: 400,
                color: t.fg, letterSpacing: "-0.025em", lineHeight: 0.95,
                margin: "0 0 12px",
              }}
            />
            <div style={{
              display: "flex", gap: "clamp(8px, 2vw, 20px)",
              flexWrap: "wrap", alignItems: "center",
              fontFamily: fMono, fontSize: 10, letterSpacing: "0.18em",
              textTransform: "uppercase", color: t.fg,
            }} data-font-slot={3}>
              <span>{page.createdAt}</span>
              <span style={{ color: t.muted }}>·</span>
              <span>{photoCount} photos</span>
            </div>
          </div>
        </EditableImage>

        {/* CTA strip */}
        <div style={{
          background: t.raised, borderBottom: `1px solid ${t.line}`,
          padding: "16px clamp(16px, 4vw, 48px)",
          display: "flex", flexWrap: "wrap", gap: 12,
          alignItems: "center", justifyContent: "space-between",
        }}>
          <EditableText
            fieldPath="welcomeMessage" value={page.welcomeMessage} onChange={set ? (v) => set("welcomeMessage", v) : undefined}
            as="p" multiline fontSlot={2}
            placeholder={isEditor ? "Welcome your client — what should they do with this gallery?" : ""}
            style={{
              fontFamily: fSans, fontSize: 13, fontWeight: 300, color: t.fg,
              margin: 0, lineHeight: 1.5, maxWidth: 520, flex: "1 1 280px",
            }}
          />
          <button
            onClick={isEditor ? undefined : simulateDownload}
            disabled={downloading}
            style={{
              flexShrink: 0,
              background: downloading ? t.line : t.btnBg, border: "none",
              color: downloading ? t.muted : t.btnFg,
              fontFamily: fMono, fontSize: 10, letterSpacing: "0.2em",
              textTransform: "uppercase", fontWeight: 700,
              padding: "11px 20px", cursor: isEditor || downloading ? "default" : "pointer",
              display: "inline-flex", alignItems: "center", gap: 8,
              transition: "background 0.2s",
            }}
          >
            {downloading ? <Spinner /> : <DownloadIcon />}
            {downloading ? "Preparing zip…" : "Download all"}
          </button>
        </div>
      </header>

      {/* ── Sticky toolbar ───────────────────────────────────── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: t.bg, borderBottom: `1px solid ${t.line}`,
        boxShadow: scrolled ? "0 6px 20px rgba(0,0,0,0.5)" : "none",
        transition: "box-shadow 0.2s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px clamp(12px, 4vw, 48px)", flexWrap: "wrap" }}>
          <div style={{ display: "flex", border: `1px solid ${t.line}` }}>
            <FilterPill active={filter === "all"} onClick={() => setFilter("all")} accent={t.accent} muted={t.muted} fg={t.fg} mono={fMono}>
              All <span style={{ opacity: 0.55, marginLeft: 4 }}>{allPhotos.length}</span>
            </FilterPill>
            <FilterPill active={filter === "favorites"} onClick={() => setFilter("favorites")} accent={t.accent} muted={t.muted} fg={t.fg} mono={fMono}>
              <Heart filled={filter === "favorites"} size={9} />
              <span style={{ marginLeft: 5 }}>Favorites</span>
              <span style={{ opacity: 0.55, marginLeft: 4 }}>{favorites.size}</span>
            </FilterPill>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {selected.size > 0 && (
              <span style={{ fontFamily: fMono, fontSize: 9, letterSpacing: "0.18em", color: t.accent, textTransform: "uppercase" }}>
                {selected.size} selected
              </span>
            )}
            <button
              onClick={() => selectAllVisible(visibleIndices)}
              style={{
                background: "none", border: `1px solid ${t.line}`, color: t.muted,
                fontFamily: fMono, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
                padding: "6px 12px", cursor: isEditor ? "default" : "pointer",
              }}
            >
              {visibleIndices.every((i) => selected.has(i)) && visibleIndices.length > 0 ? "Deselect" : "Select all"}
            </button>
            <button
              onClick={isEditor ? undefined : simulateDownload}
              disabled={downloading || (filter === "favorites" && favorites.size === 0)}
              className="bk-desktop-only"
              style={{
                background: downloading ? t.line : t.btnBg, border: "none",
                color: downloading ? t.muted : t.btnFg,
                fontFamily: fMono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
                fontWeight: 700, padding: "7px 14px",
                cursor: isEditor || downloading ? "default" : "pointer",
                display: "inline-flex", alignItems: "center", gap: 6,
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
        @media (max-width: 640px) { .bk-desktop-only { display: none !important; } }
      `}</style>

      {/* ── Sectioned grid ───────────────────────────────────── */}
      {filter === "favorites" && favorites.size === 0 ? (
        <EmptyFavorites onClear={() => setFilter("all")} fSerif={fSerif} fSans={fSans} fMono={fMono} t={t} />
      ) : (
        chapters.map((section, si) => {
          const sectionStart = chapters.slice(0, si).reduce((acc, c) => acc + c.photos.length, 0);
          const indices = section.photos
            .map((_, i) => sectionStart + i)
            .filter((i) => filter === "all" || favorites.has(i));

          if (indices.length === 0) return null;

          const cols = page.layout === "masonry" ? { cols: 4, mobile: 2 } : { cols: 4, mobile: 2 };

          return (
            <section key={section.id} style={{
              padding: "clamp(28px, 5vw, 48px) clamp(12px, 4vw, 48px) clamp(16px, 3vw, 32px)",
              borderTop: si > 0 ? `1px solid ${t.line}` : "none",
            }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                <span style={{ fontFamily: fMono, fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase", color: t.accent }} data-font-slot={3}>
                  Ch {String(si + 1).padStart(2, "0")}
                </span>
                <h2 style={{
                  fontFamily: fSerif, fontStyle: "italic",
                  fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 400,
                  color: t.fg, letterSpacing: "-0.01em", lineHeight: 1,
                  margin: 0,
                }} data-font-slot={1}>
                  {section.label}
                </h2>
                <span style={{ fontFamily: fMono, fontSize: 10, letterSpacing: "0.18em", color: t.muted, textTransform: "uppercase" }} data-font-slot={3}>
                  {indices.length} photos
                </span>
                <p style={{
                  flexBasis: "100%", fontFamily: fSans, fontSize: 12,
                  fontWeight: 300, color: t.muted, margin: "4px 0 0", lineHeight: 1.6,
                }}>
                  {section.note}
                </p>
              </div>

              {page.layout === "masonry" ? (
                <motion.div
                  variants={gridVariants} initial="hidden" animate="visible"
                  style={{ columns: cols.cols, columnGap: 4 }}
                  className="bk-masonry"
                >
                  {indices.map((idx) => (
                    <motion.div key={allPhotos[idx]!.seed} variants={photoVariants}
                      style={{ breakInside: "avoid", marginBottom: 4 }}
                    >
                      <GalleryThumb
                        seed={allPhotos[idx]!.seed}
                        index={idx}
                        selected={selected.has(idx)}
                        favorite={favorites.has(idx)}
                        masonryHeight={420 + (idx % 4) * 80}
                        onSelect={() => toggleSelect(idx)}
                        onFavorite={() => toggleFavorite(idx)}
                        onOpen={() => !isEditor && setLightboxIdx(idx)}
                        accent={t.accent} bg={t.line} fg={t.fg}
                        mono={fMono}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  variants={gridVariants} initial="hidden" animate="visible"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(min(160px, 100%), 1fr))",
                    gap: 4,
                  }}
                  className="bk-grid"
                >
                  {indices.map((idx) => (
                    <GalleryThumb
                      key={allPhotos[idx]!.seed}
                      seed={allPhotos[idx]!.seed}
                      index={idx}
                      selected={selected.has(idx)}
                      favorite={favorites.has(idx)}
                      onSelect={() => toggleSelect(idx)}
                      onFavorite={() => toggleFavorite(idx)}
                      onOpen={() => !isEditor && setLightboxIdx(idx)}
                      accent={t.accent} bg={t.line} fg={t.fg}
                      mono={fMono}
                    />
                  ))}
                </motion.div>
              )}

              <style>{`
                @media (min-width: 1024px) { .bk-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important; } }
                @media (min-width: 640px) and (max-width: 1023px) { .bk-grid { grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)) !important; } }
                @media (max-width: 639px) { .bk-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 3px !important; } .bk-masonry { columns: 2 !important; } }
              `}</style>
            </section>
          );
        })
      )}

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{
        borderTop: `1px solid ${t.line}`,
        padding: "clamp(20px, 4vw, 32px) clamp(16px, 4vw, 48px) calc(clamp(20px, 4vw, 32px) + env(safe-area-inset-bottom, 0))",
      }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <EditableText
              fieldPath="logoText" value={page.logoText || "STUDIO"} onChange={set ? (v) => set("logoText", v) : undefined}
              as="div" fontSlot={1}
              style={{
                fontFamily: fSerif, fontStyle: "italic", fontSize: 24, fontWeight: 400,
                color: t.fg, letterSpacing: "-0.01em", lineHeight: 1, marginBottom: 6,
              }}
            />
            <p style={{
              fontFamily: fMono, fontSize: 9, letterSpacing: "0.2em",
              textTransform: "uppercase", color: t.muted, margin: 0,
            }} data-font-slot={3}>
              © {new Date().getFullYear()} · Delivered with Portapic
            </p>
          </div>
          <nav style={{ display: "flex", gap: 20, fontFamily: fMono, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            {["Print shop", "Contact", "Instagram"].map((item) => (
              <a key={item} href="#" style={{ color: t.muted, textDecoration: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = t.fg; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = t.muted; }}
              >{item}</a>
            ))}
          </nav>
        </div>
      </footer>

      {/* Mobile floating selection bar — disabled in editor mode */}
      {!isEditor && (
        <AnimatePresence>
          {selected.size > 0 && (
            <motion.div
              key="bk-floater"
              initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "fixed", left: 16, right: 16, bottom: 16, zIndex: 60,
                background: t.bg, border: `1px solid ${t.accent}`,
                padding: "10px 14px",
                display: "flex", alignItems: "center", gap: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                maxWidth: 480, marginLeft: "auto", marginRight: "auto",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: fMono, fontSize: 9, letterSpacing: "0.22em", color: t.accent, textTransform: "uppercase" }}>
                  {selected.size} selected
                </div>
                <div style={{ fontFamily: fMono, fontSize: 8, letterSpacing: "0.18em", color: t.muted, textTransform: "uppercase", marginTop: 2 }}>
                  Ready to download
                </div>
              </div>
              <button
                onClick={() => setSelected(new Set())}
                style={{
                  background: "none", border: `1px solid ${t.line}`, color: t.muted,
                  fontFamily: fMono, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
                  padding: "8px 12px", cursor: "pointer",
                }}
              >Clear</button>
              <button
                onClick={simulateDownload}
                disabled={downloading}
                style={{
                  background: downloading ? t.line : t.btnBg, border: "none",
                  color: downloading ? t.muted : t.btnFg,
                  fontFamily: fMono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700,
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
      )}

      {/* Lightbox — disabled in editor mode */}
      {!isEditor && lightboxIdx !== null && (
        <BrooklynLightbox
          startIndex={lightboxIdx}
          allPhotos={allPhotos}
          favorites={favorites}
          onFavorite={toggleFavorite}
          onClose={() => setLightboxIdx(null)}
          theme={t}
          fMono={fMono}
        />
      )}
    </main>
  );
}

/* ── Empty favorites state ──────────────────────────────────── */
function EmptyFavorites({ onClear, fSerif, fSans, fMono, t }: { onClear: () => void; fSerif: string; fSans: string; fMono: string; t: ReturnType<typeof themeFor> }) {
  return (
    <div style={{ padding: "60px clamp(16px, 4vw, 48px)", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
      <div style={{ color: t.line }}><Heart filled={false} size={28} /></div>
      <h3 style={{ fontFamily: fSerif, fontStyle: "italic", fontSize: 22, fontWeight: 400, color: t.fg, margin: 0 }}>
        No favorites yet
      </h3>
      <p style={{ fontFamily: fSans, fontSize: 13, color: t.muted, margin: 0, maxWidth: 320, lineHeight: 1.6 }}>
        Tap the heart on any photo to mark it as a favorite.
      </p>
      <button onClick={onClear} style={{
        background: "none", border: `1px solid ${t.line}`, color: t.fg,
        fontFamily: fMono, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
        padding: "10px 18px", cursor: "pointer", marginTop: 8,
      }}>Browse all photos →</button>
    </div>
  );
}

/* ── Filter pill ─────────────────────────────────────────────── */
function FilterPill({ active, onClick, children, accent, muted, fg, mono }: {
  active: boolean; onClick: () => void; children: React.ReactNode;
  accent: string; muted: string; fg: string; mono: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? accent : "none",
        border: "none",
        color: active ? fg === STONE ? BLACK : "#000" : muted,
        fontFamily: mono, fontSize: 9, letterSpacing: "0.18em",
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

/* ── Icons ───────────────────────────────────────────────────── */
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
      fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  );
}
function Spinner({ small }: { small?: boolean }) {
  const sz = small ? 9 : 11;
  return (
    <span style={{
      width: sz, height: sz, borderRadius: "50%",
      border: `2px solid currentColor`, borderTopColor: "transparent",
      display: "inline-block", animation: "bk-spin 0.7s linear infinite",
    }} />
  );
}

/* ── Photo thumb ─────────────────────────────────────────────── */
function GalleryThumb({
  seed, index, selected, favorite, masonryHeight, onSelect, onFavorite, onOpen, accent, bg, fg, mono,
}: {
  seed: number; index: number; selected: boolean; favorite: boolean;
  masonryHeight?: number;
  onSelect: () => void; onFavorite: () => void; onOpen: () => void;
  accent: string; bg: string; fg: string; mono: string;
}) {
  const [hovered, setHovered] = useState(false);
  const showOverlay = hovered || selected || favorite;
  const imgHeight = masonryHeight ?? 480;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        aspectRatio: masonryHeight ? undefined : "1",
        overflow: "hidden",
        background: bg, cursor: "pointer",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://picsum.photos/seed/${seed}/480/${imgHeight}`}
        alt={`Photo ${index + 1}`}
        onClick={onOpen}
        style={{
          width: "100%",
          height: masonryHeight ? "auto" : "100%",
          objectFit: "cover",
          display: "block",
          transform: hovered ? "scale(1.04)" : "scale(1)",
          transition: "transform 500ms cubic-bezier(0.2,0.8,0.2,1)",
        }}
      />

      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: 56,
        background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
        opacity: showOverlay ? 1 : 0, transition: "opacity 0.2s", pointerEvents: "none",
      }} />

      <button
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        aria-label={selected ? "Deselect photo" : "Select photo"}
        style={{
          position: "absolute", top: 8, left: 8, width: 24, height: 24,
          background: selected ? accent : "rgba(0,0,0,0.55)",
          border: `1.5px solid ${selected ? accent : "rgba(255,255,255,0.6)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", padding: 0,
          opacity: showOverlay ? 1 : 0, transition: "opacity 0.2s", backdropFilter: "blur(2px)",
        }}
      >
        {selected && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={BLACK} strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
        )}
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onFavorite(); }}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        style={{
          position: "absolute", top: 8, right: 8, width: 24, height: 24, padding: 0,
          background: "rgba(0,0,0,0.55)",
          border: `1.5px solid ${favorite ? accent : "rgba(255,255,255,0.6)"}`,
          color: favorite ? accent : "rgba(255,255,255,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          opacity: favorite || hovered ? 1 : 0, transition: "opacity 0.2s", backdropFilter: "blur(2px)",
        }}
      >
        <Heart filled={favorite} size={11} />
      </button>

      <span style={{
        position: "absolute", bottom: 8, left: 10,
        fontFamily: mono, fontSize: 9, letterSpacing: "0.18em",
        color: "rgba(255,255,255,0.85)",
        opacity: showOverlay ? 1 : 0, transition: "opacity 0.2s", pointerEvents: "none",
      }}>
        #{String(index + 1).padStart(3, "0")}
      </span>
      {/* swallow fg variable so TS doesn't flag unused */}
      <span style={{ display: "none" }} aria-hidden>{fg}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════════════════════════ */

function BrooklynLightbox({
  startIndex, allPhotos, favorites, onFavorite, onClose, theme, fMono,
}: {
  startIndex: number;
  allPhotos: Array<{ seed: number; section: string }>;
  favorites: Set<number>;
  onFavorite: (idx: number) => void;
  onClose: () => void;
  theme: ReturnType<typeof themeFor>;
  fMono: string;
}) {
  const [index, setIndex]   = useState(startIndex);
  const [zoom, setZoom]     = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDrag] = useState(false);
  const dragRef             = useRef({ sx: 0, sy: 0, ox: 0, oy: 0 });
  const containerRef        = useRef<HTMLDivElement>(null);
  const touchStartX         = useRef<number | null>(null);
  const photo               = allPhotos[index]!;
  const isFav               = favorites.has(index);

  const resetView = useCallback(() => { setZoom(1); setOffset({ x: 0, y: 0 }); }, []);
  const prev = useCallback(() => { setIndex((i) => Math.max(i - 1, 0)); resetView(); }, [resetView]);
  const next = useCallback(() => { setIndex((i) => Math.min(i + 1, allPhotos.length - 1)); resetView(); }, [resetView, allPhotos.length]);

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
    if (zoom <= 1) return;
    e.preventDefault(); setDrag(true);
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onMM = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({ x: dragRef.current.ox + e.clientX - dragRef.current.sx, y: dragRef.current.oy + e.clientY - dragRef.current.sy });
  };
  const onMU = () => setDrag(false);

  const onTS = (e: React.TouchEvent) => {
    if (zoom > 1) return;
    touchStartX.current = e.touches[0]!.clientX;
  };
  const onTE = (e: React.TouchEvent) => {
    if (zoom > 1 || touchStartX.current === null) return;
    const dx = e.changedTouches[0]!.clientX - touchStartX.current;
    if (Math.abs(dx) > 60) { if (dx > 0) prev(); else next(); }
    touchStartX.current = null;
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(8,8,8,0.97)",
      display: "flex", flexDirection: "column",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px", borderBottom: `1px solid ${theme.line}`, flexShrink: 0, gap: 8,
      }}>
        <button onClick={onClose} style={{
          background: "none", border: `1px solid ${theme.line}`, cursor: "pointer", color: theme.muted,
          fontFamily: fMono, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
          padding: "7px 12px", display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          <span className="bk-desktop-only">Back</span>
        </button>

        <span style={{
          fontFamily: fMono, fontSize: 9, letterSpacing: "0.22em",
          textTransform: "uppercase", color: theme.muted,
        }}>
          {String(index + 1).padStart(3, "0")} / {String(allPhotos.length).padStart(3, "0")} ·{" "}
          <span style={{ color: theme.accent }}>{photo.section}</span>
        </span>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onFavorite(index)}
            aria-label={isFav ? "Remove favorite" : "Mark favorite"}
            style={{
              background: isFav ? theme.accent : "none",
              border: `1px solid ${isFav ? theme.accent : theme.line}`,
              color: isFav ? theme.btnFg : theme.muted,
              cursor: "pointer", padding: "7px 10px",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}
          >
            <Heart filled={isFav} size={11} />
          </button>
          <button style={{
            background: theme.accent, border: "none", cursor: "pointer", color: theme.btnFg,
            fontFamily: fMono, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
            fontWeight: 700, padding: "7px 12px",
            display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            <DownloadIcon size={10} />
            <span className="bk-desktop-only">Download</span>
          </button>
        </div>
      </div>

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

      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="bk-desktop-only"
          style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
            background: theme.line, border: `1px solid ${theme.line}`, color: theme.fg, cursor: "pointer",
            width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
      )}
      {index < allPhotos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="bk-desktop-only"
          style={{
            position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
            background: theme.line, border: `1px solid ${theme.line}`, color: theme.fg, cursor: "pointer",
            width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DEFAULT EXPORT — public demo route at /template/brooklyn/delivery
══════════════════════════════════════════════════════════════════ */

export default function BrooklynDeliveryDemo() {
  const storePage = useDeliveryStore((s) => s.pages.find((p) => p.template === "brooklyn"));
  const hydrated  = useDeliveryStore((s) => s.hydrated);

  /* While hydrating from localStorage, render the seed page from INITIAL_PAGES
     so the demo never shows a blank flash. */
  const page = storePage ?? INITIAL_PAGES.find((p) => p.template === "brooklyn") ?? INITIAL_PAGES[0]!;

  if (!hydrated && !storePage) {
    return (
      <div style={{ height: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: BLACK, color: GRAY }}>
        <span style={{ fontFamily: FALLBACK_MONO, fontSize: 11 }}>Loading…</span>
      </div>
    );
  }

  return <BrooklynDelivery page={page} />;
}
