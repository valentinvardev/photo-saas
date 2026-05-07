"use client";

import { useState } from "react";
import { ALL_GALLERY_SEEDS, effectiveStyle, type DeliveryPage, type TemplateName } from "~/lib/delivery/data";

/* ──────────────────────────────────────────────────────────────────────────
   GalleryView — live, per-template preview rendered from DeliveryPage state.
   Edits in the builder sidebar flow straight into these renderers, so the
   preview always reflects what the photographer will ship.
────────────────────────────────────────────────────────────────────────── */

const HALCYON_FONTS = {
  serif: "'Instrument Serif', 'Cormorant Garamond', Georgia, serif",
  sans:  "'Geist', 'Inter', system-ui, sans-serif",
  mono:  "'Geist Mono', 'JetBrains Mono', ui-monospace, monospace",
};
const BROOKLYN_FONTS = {
  sans:  "'Space Grotesk', 'Inter', system-ui, sans-serif",
  mono:  "'Space Mono', ui-monospace, monospace",
};
const MINIMAL_FONTS = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans:  "'DM Sans', 'Inter', system-ui, sans-serif",
  mono:  "'Space Mono', ui-monospace, monospace",
};

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?" +
  "family=Instrument+Serif:ital@0;1&" +
  "family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&" +
  "family=DM+Sans:wght@400;500;700&" +
  "family=Space+Grotesk:wght@400;500;700&" +
  "family=Space+Mono:wght@400;700&" +
  "family=Geist:wght@400;500;600&" +
  "family=Geist+Mono:wght@400;500&" +
  "display=swap";

function FontStylesheet() {
  /* Inline link tag — runs once per preview render, browser de-dupes. */
  return <link rel="stylesheet" href={FONTS_HREF} />;
}

function photoUrl(seed: number, w = 800, h = 1000) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

function picks(page: DeliveryPage) {
  const seeds = page.photoSeeds.length > 0 ? page.photoSeeds : ALL_GALLERY_SEEDS.slice(0, 12);
  return seeds.slice(0, 12);
}

function coverFor(page: DeliveryPage) {
  return page.coverUrl || `https://picsum.photos/seed/${page.coverSeed}/1600/900`;
}

function selectionMeta(page: DeliveryPage, photoCount: number) {
  if (page.mode !== "selection") return null;
  return { picked: 3, limit: page.selectionLimit, total: photoCount };
}

/* ══════════════════════════════════════════════════════════════════════════
   HALCYON — warm dark, serif italic, sectioned chapters
══════════════════════════════════════════════════════════════════════════ */

function HalcyonPreview({ page, isMobile }: { page: DeliveryPage; isMobile: boolean }) {
  const t = { bg: "#0E0D0B", fg: "#EFEAE0", muted: "#8A8378", line: "#2C2925", raised: "#1A1815", accent: "#C2410C" };
  const photos = picks(page);
  const sel = selectionMeta(page, photos.length);
  const [first, second] = page.client.split(/\s*&\s*|\s+y\s+|\s+and\s+/);

  return (
    <div style={{ background: t.bg, color: t.fg, fontFamily: HALCYON_FONTS.sans, minHeight: "100%", overflowY: "auto" }} className="w-full h-full">
      <FontStylesheet />
      <div style={{ height: 3, background: t.accent }} />

      {/* Hero */}
      <div style={{ position: "relative", height: isMobile ? 220 : 360, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverFor(page)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: t.accent, mixBlendMode: "multiply", opacity: 0.55 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(14,13,11,0.35) 0%,rgba(14,13,11,0) 30%,rgba(14,13,11,0.7) 75%,rgba(14,13,11,0.96) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, padding: isMobile ? "16px 18px" : "24px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between", color: t.fg }}>
          <div style={{ fontFamily: HALCYON_FONTS.mono, fontSize: isMobile ? 9 : 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.85 }}>
            {page.logoText || "HALCYON"}
          </div>
          <div>
            <div style={{ fontFamily: HALCYON_FONTS.mono, fontSize: isMobile ? 9 : 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.8, marginBottom: 6 }}>
              For {page.client} · {page.photoCount || photos.length} photographs
            </div>
            <h1 style={{ fontFamily: HALCYON_FONTS.serif, fontSize: isMobile ? 36 : 64, lineHeight: 0.95, letterSpacing: "-0.02em", margin: 0, fontWeight: 400 }}>
              {first ?? page.title} <em style={{ fontStyle: "italic", color: t.accent }}>&amp; {second ?? ""}</em>
            </h1>
          </div>
        </div>
      </div>

      {/* Selection bar */}
      {sel && (
        <div style={{ background: t.raised, borderBottom: `1px solid ${t.line}`, padding: isMobile ? "10px 16px" : "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: HALCYON_FONTS.mono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: t.muted }}>
            <span style={{ color: t.fg }}>{sel.picked}</span> / {sel.limit} chosen
          </div>
          <button style={{ background: t.accent, color: t.fg, border: 0, fontFamily: HALCYON_FONTS.mono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", padding: "8px 14px", cursor: "pointer" }}>Submit</button>
        </div>
      )}

      {/* Welcome */}
      {page.welcomeMessage && (
        <div style={{ padding: isMobile ? "20px 18px 0" : "28px 32px 0", maxWidth: 640 }}>
          <p style={{ fontFamily: HALCYON_FONTS.serif, fontStyle: "italic", fontSize: isMobile ? 14 : 17, lineHeight: 1.55, color: t.fg, margin: 0 }}>
            {page.welcomeMessage}
          </p>
        </div>
      )}

      {/* Section label + photo grid */}
      <div style={{ padding: isMobile ? "18px 18px 32px" : "32px 32px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, color: t.muted, marginBottom: 16, fontFamily: HALCYON_FONTS.mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          <span>The Day</span>
          <hr style={{ flex: 1, border: 0, borderTop: `1px solid ${t.line}` }} />
          <span>{photos.length} frames</span>
        </div>
        <div style={{ columns: isMobile ? 2 : 3, columnGap: 10 }}>
          {photos.map((seed, i) => (
            <div key={seed} style={{ breakInside: "avoid", marginBottom: 10, position: "relative", overflow: "hidden", background: t.raised }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl(seed, 600, 480 + (i % 4) * 80)} alt="" style={{ width: "100%", display: "block" }} />
              {page.watermark && <Watermark text={page.logoText || "HALCYON"} fontFamily={HALCYON_FONTS.mono} />}
              {page.mode === "selection" && <FavBadge accent={t.accent} />}
              {page.mode === "direct" && page.pricePerPhoto > 0 && <PriceTag price={page.pricePerPhoto} bg="rgba(14,13,11,0.7)" fg={t.fg} fontFamily={HALCYON_FONTS.mono} />}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: isMobile ? "18px" : "28px 32px", borderTop: `1px solid ${t.line}`, color: t.muted, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontFamily: HALCYON_FONTS.mono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase" }}>
        <span style={{ fontFamily: HALCYON_FONTS.serif, fontSize: 16, color: t.fg, textTransform: "none", letterSpacing: 0 }}>
          {page.logoText || "Halcyon"}<em style={{ color: t.accent, fontStyle: "italic" }}> Studio</em>
        </span>
        <span>© {new Date().getFullYear()} · Delivered with FRAME</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BROOKLYN — dark + red accent, bold sans
══════════════════════════════════════════════════════════════════════════ */

function BrooklynPreview({ page, isMobile }: { page: DeliveryPage; isMobile: boolean }) {
  const t = { bg: "#0D0D0D", fg: "#F0EFE9", muted: "#7A7A7A", line: "#1F1F1F", raised: "#161616", accent: "#E8382C" };
  const photos = picks(page);
  const sel = selectionMeta(page, photos.length);

  return (
    <div style={{ background: t.bg, color: t.fg, fontFamily: BROOKLYN_FONTS.sans, minHeight: "100%", overflowY: "auto" }} className="w-full h-full">
      <FontStylesheet />
      <div style={{ height: 3, background: t.accent }} />

      <div style={{ position: "relative", height: isMobile ? 220 : 360, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverFor(page)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.05)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(13,13,13,0.25) 0%,rgba(13,13,13,0) 30%,rgba(13,13,13,0.85) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, padding: isMobile ? "16px 18px" : "24px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontFamily: BROOKLYN_FONTS.mono, fontSize: isMobile ? 9 : 10, letterSpacing: "0.32em", textTransform: "uppercase", color: t.accent }}>
            {page.logoText || "BROOKLYN"} / Client Gallery
          </div>
          <div>
            <div style={{ fontFamily: BROOKLYN_FONTS.mono, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: t.muted, marginBottom: 8 }}>
              {page.client} · {page.photoCount || photos.length} frames
            </div>
            <h1 style={{ fontWeight: 700, fontSize: isMobile ? 32 : 56, lineHeight: 1, letterSpacing: "-0.03em", margin: 0, textTransform: "uppercase" }}>
              {page.title}
            </h1>
          </div>
        </div>
      </div>

      {sel && (
        <div style={{ background: t.raised, borderBottom: `1px solid ${t.line}`, padding: isMobile ? "10px 16px" : "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: BROOKLYN_FONTS.mono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: t.muted }}>
            <span style={{ color: t.fg }}>{sel.picked}</span> / {sel.limit} selected
          </div>
          <button style={{ background: t.accent, color: t.bg, border: 0, fontFamily: BROOKLYN_FONTS.mono, fontWeight: 700, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", padding: "8px 14px", cursor: "pointer" }}>Submit selection</button>
        </div>
      )}

      <div style={{ padding: isMobile ? "18px" : "28px 32px" }}>
        {page.welcomeMessage && (
          <p style={{ fontFamily: BROOKLYN_FONTS.sans, fontSize: isMobile ? 13 : 15, lineHeight: 1.55, color: t.fg, margin: "0 0 24px", maxWidth: 600 }}>
            {page.welcomeMessage}
          </p>
        )}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 6 }}>
          {photos.map((seed) => (
            <div key={seed} style={{ position: "relative", aspectRatio: "1", overflow: "hidden", background: t.raised }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl(seed, 600, 600)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {page.watermark && <Watermark text={page.logoText || "BROOKLYN"} fontFamily={BROOKLYN_FONTS.mono} />}
              {page.mode === "selection" && <FavBadge accent={t.accent} square />}
              {page.mode === "direct" && page.pricePerPhoto > 0 && <PriceTag price={page.pricePerPhoto} bg={t.accent} fg={t.bg} fontFamily={BROOKLYN_FONTS.mono} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: isMobile ? "18px" : "24px 32px", borderTop: `1px solid ${t.line}`, color: t.muted, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontFamily: BROOKLYN_FONTS.mono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase" }}>
        <span style={{ color: t.fg, fontWeight: 700 }}>{page.logoText || "BROOKLYN"}</span>
        <span>© {new Date().getFullYear()} · FRAME</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MINIMAL — white paper, serif italic, strict grid
══════════════════════════════════════════════════════════════════════════ */

function MinimalPreview({ page, isMobile }: { page: DeliveryPage; isMobile: boolean }) {
  const t = { bg: "#FAFAFA", fg: "#111111", muted: "#888888", line: "#E8E8E8", raised: "#FFFFFF", accent: "#111111" };
  const photos = picks(page);
  const sel = selectionMeta(page, photos.length);
  const [first, second] = page.client.split(/\s*&\s*|\s+y\s+|\s+and\s+/);

  return (
    <div style={{ background: t.bg, color: t.fg, fontFamily: MINIMAL_FONTS.sans, minHeight: "100%", overflowY: "auto" }} className="w-full h-full">
      <FontStylesheet />

      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "16px 18px" : "22px 32px", borderBottom: `1px solid ${t.line}`, background: t.raised }}>
        <span style={{ fontFamily: MINIMAL_FONTS.serif, fontSize: 20, letterSpacing: "-0.02em", fontWeight: 500 }}>
          {page.logoText || "Studio"}<em style={{ fontStyle: "italic", color: t.muted }}> Minimal</em>
        </span>
        <span style={{ fontFamily: MINIMAL_FONTS.mono, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: t.muted }}>
          {page.client}
        </span>
      </header>

      {/* Hero (text-only, paper) */}
      <section style={{ padding: isMobile ? "48px 24px 32px" : "72px 32px 48px", textAlign: "center", borderBottom: `1px solid ${t.line}` }}>
        <div style={{ fontFamily: MINIMAL_FONTS.mono, fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: t.muted, marginBottom: 18 }}>
          For your eyes only · {page.photoCount || photos.length} photographs
        </div>
        <h1 style={{ fontFamily: MINIMAL_FONTS.serif, fontSize: isMobile ? 44 : 80, lineHeight: 0.95, letterSpacing: "-0.02em", margin: 0, fontWeight: 400 }}>
          {first ?? page.title}{second ? <><br /><em style={{ fontStyle: "italic" }}>&amp; {second}</em></> : null}
        </h1>
        {page.welcomeMessage && (
          <p style={{ fontFamily: MINIMAL_FONTS.serif, fontStyle: "italic", fontSize: isMobile ? 14 : 16, lineHeight: 1.55, color: t.muted, maxWidth: 460, margin: "20px auto 0" }}>
            {page.welcomeMessage}
          </p>
        )}
      </section>

      {sel && (
        <div style={{ background: t.bg, borderBottom: `1px solid ${t.line}`, padding: isMobile ? "12px 18px" : "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: MINIMAL_FONTS.mono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: t.muted }}>
            <span style={{ color: t.fg }}>{sel.picked}</span> / {sel.limit} chosen
          </div>
          <button style={{ background: t.fg, color: t.bg, border: 0, fontFamily: MINIMAL_FONTS.mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", padding: "8px 18px", cursor: "pointer" }}>Submit</button>
        </div>
      )}

      <section style={{ padding: isMobile ? "32px 18px" : "48px 32px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 24 }}>
          <span style={{ fontFamily: MINIMAL_FONTS.mono, fontSize: 10, letterSpacing: "0.18em", color: t.muted, textTransform: "uppercase" }}>01</span>
          <h2 style={{ fontFamily: MINIMAL_FONTS.serif, fontSize: isMobile ? 28 : 36, letterSpacing: "-0.02em", lineHeight: 1, margin: 0, fontWeight: 400 }}>
            The <em style={{ fontStyle: "italic", color: t.muted }}>Day</em>
          </h2>
          <hr style={{ flex: 1, border: 0, borderTop: `1px solid ${t.line}` }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12 }}>
          {photos.map((seed) => (
            <div key={seed} style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", background: t.raised, border: `1px solid ${t.line}` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl(seed, 600, 750)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {page.watermark && <Watermark text={page.logoText || "STUDIO"} fontFamily={MINIMAL_FONTS.mono} dark />}
              {page.mode === "selection" && <FavBadge accent={t.fg} square />}
              {page.mode === "direct" && page.pricePerPhoto > 0 && <PriceTag price={page.pricePerPhoto} bg="rgba(255,255,255,0.92)" fg={t.fg} fontFamily={MINIMAL_FONTS.mono} />}
            </div>
          ))}
        </div>
      </section>

      <footer style={{ padding: isMobile ? "18px" : "28px 32px", borderTop: `1px solid ${t.line}`, color: t.muted, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontFamily: MINIMAL_FONTS.mono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase" }}>
        <span style={{ fontFamily: MINIMAL_FONTS.serif, fontSize: 16, color: t.fg, textTransform: "none", letterSpacing: 0 }}>{page.logoText || "Studio"} <em style={{ fontStyle: "italic", color: t.muted }}>Minimal</em></span>
        <span>© {new Date().getFullYear()} · FRAME</span>
      </footer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   GENERIC — fallback for vogue (and any future template without a renderer)
══════════════════════════════════════════════════════════════════════════ */

function GenericPreview({ page, isMobile }: { page: DeliveryPage; isMobile: boolean }) {
  const ts = effectiveStyle(page);
  const photos = picks(page);

  return (
    <div className="w-full h-full overflow-y-auto" style={{ background: ts.bg, color: ts.fg, fontFamily: page.fontFamily || "Inter, sans-serif" }}>
      <div style={{ position: "relative", height: isMobile ? 200 : 320, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverFor(page)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.7))" }} />
        <div style={{ position: "absolute", bottom: isMobile ? 16 : 28, left: isMobile ? 16 : 28, right: isMobile ? 16 : 28, color: "#fff" }}>
          <p style={{ fontFamily: "monospace", fontSize: isMobile ? 9 : 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7, marginBottom: 4 }}>
            {page.client} · {page.photoCount || photos.length} photos
          </p>
          <h1 style={{ fontWeight: 900, fontSize: isMobile ? 28 : 48, lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0 }}>{page.title}</h1>
        </div>
      </div>
      <div style={{ padding: isMobile ? 14 : 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: 8 }}>
          {photos.map((seed) => (
            <div key={seed} style={{ position: "relative", aspectRatio: "1", overflow: "hidden", background: ts.accent }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl(seed, 600, 600)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Shared bits ── */

function Watermark({ text, fontFamily, dark }: { text: string; fontFamily: string; dark?: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      <span style={{ color: dark ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.32)", fontFamily, fontWeight: 700, fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", transform: "rotate(-20deg)" }}>{text}</span>
    </div>
  );
}
function FavBadge({ accent, square }: { accent: string; square?: boolean }) {
  return (
    <button style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, background: "rgba(0,0,0,0.4)", border: 0, borderRadius: square ? 0 : "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.4" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
    </button>
  );
}
function PriceTag({ price, bg, fg, fontFamily }: { price: number; bg: string; fg: string; fontFamily: string }) {
  return (
    <div style={{ position: "absolute", bottom: 6, left: 6, background: bg, color: fg, fontFamily, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "3px 8px" }}>
      ${price}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PUBLIC API
══════════════════════════════════════════════════════════════════════════ */

const RENDERERS: Record<TemplateName, (props: { page: DeliveryPage; isMobile: boolean }) => React.JSX.Element> = {
  halcyon:  HalcyonPreview,
  brooklyn: BrooklynPreview,
  minimal:  MinimalPreview,
  vogue:    GenericPreview,
};

export function GalleryView({ page, viewport = "desktop" }: { page: DeliveryPage; viewport?: "mobile" | "desktop" }) {
  const isMobile = viewport === "mobile";
  const Renderer = RENDERERS[page.template] ?? GenericPreview;
  return <Renderer page={page} isMobile={isMobile} />;
}

/* Preview frame for builder canvas — desktop browser mockup or mobile phone */
export function PreviewFrame({ page }: { page: DeliveryPage }) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="flex flex-col h-full">
      {/* Viewport toggle */}
      <div className="flex items-center justify-center gap-1 py-3 border-b border-[var(--border)] shrink-0">
        {(["desktop", "mobile"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setViewport(v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-medium transition-colors ${
              viewport === v ? "bg-[var(--bg-card)] text-[var(--fg)] border border-[var(--border)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
            }`}
          >
            {v === "desktop" ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            ) : (
              <svg width="11" height="13" viewBox="0 0 18 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="1" width="16" height="22" rx="3"/><line x1="7" y1="20" x2="11" y2="20"/></svg>
            )}
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center overflow-auto bg-[var(--bg)] relative p-6">
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{ backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="relative z-10">
          {viewport === "desktop" ? (
            <div className="rounded-xl overflow-hidden border border-[var(--border)] shadow-2xl bg-[var(--bg-card)]" style={{ width: 760 }}>
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow/70" />
                  <div className="w-3 h-3 rounded-full bg-green-400/70" />
                </div>
                <div className="flex-1 mx-3 bg-[var(--bg)] border border-[var(--border)] rounded-md px-3 py-1 flex items-center gap-2">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span className="font-mono text-[10px] text-[var(--fg-muted)] truncate">altafoto.com.ar/d/{page.id}</span>
                </div>
              </div>
              <div style={{ height: 560 }}>
                <GalleryView page={page} viewport="desktop" />
              </div>
            </div>
          ) : (
            <div className="relative" style={{ width: 280, height: 580 }}>
              <div className="absolute inset-0 rounded-[40px] shadow-2xl" style={{ background: "linear-gradient(145deg,#2a2a2a,#1a1a1a)" }} />
              <div className="absolute inset-[5px] rounded-[36px] overflow-hidden bg-black">
                <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pt-3 pb-1 pointer-events-none">
                  <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: "bold", color: "rgba(255,255,255,0.85)" }}>9:41</span>
                  <div style={{ width: 70, height: 18, background: "#000", borderRadius: 9999 }} />
                  <div className="flex items-center gap-0.5">
                    <svg width="11" height="8" viewBox="0 0 24 18" fill="none"><path d="M1 1c6.1-1.3 15.9-1.3 22 0M5 7c3.9-.9 10.1-.9 14 0M9 13c2-.5 6-.5 8 0" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity={0.85}/></svg>
                    <svg width="16" height="8" viewBox="0 0 26 12" fill="none"><rect x="1" y="1" width="20" height="10" rx="2.5" stroke="white" strokeWidth="1.5" opacity={0.85}/><rect x="3" y="3" width="14" height="6" rx="1.5" fill="white" opacity={0.85}/></svg>
                  </div>
                </div>
                <div className="absolute inset-0 pt-9">
                  <GalleryView page={page} viewport="mobile" />
                </div>
              </div>
              <div className="absolute rounded-l-sm" style={{ left: -3, top: 100, width: 3, height: 30, background: "#333" }} />
              <div className="absolute rounded-l-sm" style={{ left: -3, top: 138, width: 3, height: 38, background: "#333" }} />
              <div className="absolute rounded-r-sm" style={{ right: -3, top: 138, width: 3, height: 56, background: "#333" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
