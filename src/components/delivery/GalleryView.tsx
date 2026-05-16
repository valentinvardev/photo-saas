"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { ALL_GALLERY_SEEDS, effectiveStyle, type DeliveryPage, type TemplateName } from "~/lib/delivery/data";
import { EditableText, EditableImage, EditableHoverStyles, type FontSlot } from "./editable";

/* ──────────────────────────────────────────────────────────────────────────
   GalleryView — live, per-template preview rendered from DeliveryPage state.

   Edit primitives:
     • Pass `set` from the Builder to enable in-place editing of text fields
       and image swap on the cover. Omit it for the public delivery page.
     • Theme overrides cascade through `effectiveStyle(page)` so the same
       renderer respects either the template's defaults OR the user's custom
       colors / fontFamily without forking the code.
────────────────────────────────────────────────────────────────────────── */

type Setter = <K extends keyof DeliveryPage>(k: K, v: DeliveryPage[K]) => void;

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

/* Cover image styling: lets photographers crop ("cover") or letterbox
   ("contain") and adjust the focal point. Falls back to centered cover. */
function coverImgStyle(page: DeliveryPage, extra: CSSProperties = {}): CSSProperties {
  return {
    width: "100%", height: "100%",
    objectFit: page.coverFit ?? "cover",
    objectPosition: `${page.coverPositionX ?? 50}% ${page.coverPositionY ?? 50}%`,
    background: page.coverFit === "contain" ? "#000" : undefined,
    ...extra,
  };
}

/* Watermarks are auto-enabled whenever the photographer is monetising (direct
   sale). For gift / free delivery pages they're off. */
function shouldWatermark(page: DeliveryPage) {
  return page.mode === "direct";
}

/* Pick a font for a given slot. Empty user value → fall back to the template
   built-in. Templates use slot 1 for display/headings, 2 for body, 3 for mono. */
function fontSlot(page: DeliveryPage, slot: 1 | 2 | 3, fallback: string) {
  const v = slot === 1 ? page.fontFamily1 : slot === 2 ? page.fontFamily2 : page.fontFamily3;
  return v && v.trim() ? v : fallback;
}

type DeliveryView = "gallery" | "password";

interface RendererProps {
  page: DeliveryPage;
  isMobile: boolean;
  view?: DeliveryView;
  set?: Setter;
  onRequestCoverChange?: () => void;
}

/* Shared password gate — rendered when `view === "password"`. Each template
   passes its own theme tokens and fonts so the gate matches the gallery. */
function PasswordGate({
  page, set, isMobile, theme, fDisplay, fMono, fBody,
}: {
  page: DeliveryPage; set?: Setter; isMobile: boolean;
  theme: { bg: string; fg: string; muted: string; accent: string; line: string; raised: string };
  fDisplay: string; fMono: string; fBody: string;
}) {
  return (
    <div style={{ background: theme.bg, color: theme.fg, fontFamily: fBody, minHeight: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }} className="w-full h-full">
      <FontStylesheet />
      <EditableHoverStyles />

      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "16px 18px" : "22px 32px", borderBottom: `1px solid ${theme.line}` }}>
        <LogoBlock
          page={page} set={set} fallback="STUDIO" fontSlot={3}
          imageHeight={isMobile ? 16 : 20}
          textStyle={{ fontFamily: fMono, fontSize: isMobile ? 9 : 10, letterSpacing: "0.2em", textTransform: "uppercase", color: theme.fg }}
        />
        <span style={{ fontFamily: fMono, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: theme.muted }}>Private</span>
      </header>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isMobile ? "32px 24px" : "64px 32px", textAlign: "center", gap: 18 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: theme.raised, border: `1px solid ${theme.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: theme.accent }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        </div>

        <EditableText
          fieldPath="passwordTitle" value={page.passwordTitle} onChange={set ? (v) => set("passwordTitle", v) : undefined}
          as="h1" fontSlot={1}
          style={{ fontFamily: fDisplay, fontSize: isMobile ? 32 : 48, lineHeight: 1, margin: 0, fontWeight: 400, letterSpacing: "-0.02em" }}
        />
        <EditableText
          fieldPath="passwordSubtitle" value={page.passwordSubtitle} onChange={set ? (v) => set("passwordSubtitle", v) : undefined}
          as="p" multiline fontSlot={2}
          style={{ fontFamily: fBody, fontSize: isMobile ? 13 : 14, lineHeight: 1.5, margin: 0, color: theme.muted, maxWidth: 360 }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 320, marginTop: 8 }}>
          <input
            type="password" placeholder="••••••••"
            readOnly
            style={{
              fontFamily: fMono, fontSize: 14, padding: "12px 16px", textAlign: "center",
              background: theme.raised, border: `1px solid ${theme.line}`, color: theme.fg,
              letterSpacing: "0.32em", outline: "none",
            }}
          />
          <EditableText
            fieldPath="passwordButtonLabel" value={page.passwordButtonLabel} onChange={set ? (v) => set("passwordButtonLabel", v) : undefined}
            as="button" fontSlot={3}
            style={{
              fontFamily: fMono, fontSize: 11, padding: "12px 18px",
              background: theme.accent, color: theme.bg, border: "none",
              letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700,
              cursor: "pointer",
            }}
          />
        </div>

        <EditableText
          fieldPath="passwordHint" value={page.passwordHint} onChange={set ? (v) => set("passwordHint", v) : undefined}
          as="p" multiline fontSlot={3}
          style={{ fontFamily: fMono, fontSize: 10, letterSpacing: "0.14em", color: theme.muted, margin: 0, marginTop: 6 }}
        />
      </div>

      <footer style={{ padding: isMobile ? "16px" : "20px 32px", borderTop: `1px solid ${theme.line}`, color: theme.muted, fontFamily: fMono, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", textAlign: "center" }}>
        Delivered with Portapic · © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

/* Renders the brand mark honouring page.logoMode (none / text / image /
   image+text). When mode is "none" returns null so the entire logo slot is
   removed from the template's layout. */
function LogoBlock({
  page, set, fallback, fontSlot: slot, textStyle, imageHeight,
}: {
  page: DeliveryPage;
  set?: Setter;
  fallback: string;
  fontSlot: FontSlot;
  textStyle: CSSProperties;
  imageHeight: number;
}) {
  if (page.logoMode === "none") return null;
  const showImage = page.logoMode === "image" || page.logoMode === "image+text";
  const showText  = page.logoMode === "text"  || page.logoMode === "image+text";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, lineHeight: 1 }}>
      {showImage && page.logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={page.logoUrl} alt="" style={{ height: imageHeight, width: "auto", objectFit: "contain", display: "block" }} />
      )}
      {showText && (
        <EditableText
          fieldPath="logoText"
          value={page.logoText || fallback}
          onChange={set ? (v) => set("logoText", v) : undefined}
          as="span"
          fontSlot={slot}
          style={textStyle}
        />
      )}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   HALCYON — warm dark, serif italic, sectioned chapters
══════════════════════════════════════════════════════════════════════════ */

function HalcyonPreview({ page, isMobile, set, view = "gallery", onRequestCoverChange }: RendererProps) {
  const baseT = { bg: "#0E0D0B", fg: "#EFEAE0", muted: "#8A8378", line: "#2C2925", raised: "#1A1815", accent: "#C2410C" };
  const ts = effectiveStyle(page);
  const t = page.customColors ? { ...baseT, bg: ts.bg, fg: ts.fg, accent: ts.accent } : baseT;
  const photos = picks(page);
  const [first, second] = page.client.split(/\s*&\s*|\s+y\s+|\s+and\s+/);
  const fDisplay = fontSlot(page, 1, HALCYON_FONTS.serif);
  const fBody    = fontSlot(page, 2, HALCYON_FONTS.sans);
  const fMono    = fontSlot(page, 3, HALCYON_FONTS.mono);
  const wm = shouldWatermark(page);

  if (view === "password") {
    return <PasswordGate page={page} set={set} isMobile={isMobile} theme={t} fDisplay={fDisplay} fBody={fBody} fMono={fMono} />;
  }

  return (
    <div style={{ background: t.bg, color: t.fg, fontFamily: fBody, minHeight: "100%", overflowY: "auto" }} className="w-full h-full">
      <FontStylesheet />
      <EditableHoverStyles />
      <div style={{ height: 3, background: t.accent }} />

      {/* Hero */}
      <EditableImage
        fieldPath="coverUrl"
        onRequestChange={onRequestCoverChange}
        style={{ position: "relative", height: isMobile ? 220 : 360, overflow: "hidden" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverFor(page)} alt="" style={coverImgStyle(page)} />
        <div style={{ position: "absolute", inset: 0, background: t.accent, mixBlendMode: "multiply", opacity: 0.55 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(14,13,11,0.35) 0%,rgba(14,13,11,0) 30%,rgba(14,13,11,0.7) 75%,rgba(14,13,11,0.96) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, padding: isMobile ? "16px 18px" : "24px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between", color: t.fg }}>
          <LogoBlock
            page={page} set={set} fallback="HALCYON" fontSlot={3}
            imageHeight={isMobile ? 18 : 22}
            textStyle={{ fontFamily: fMono, fontSize: isMobile ? 9 : 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.85 }}
          />
          <div>
            <div style={{ fontFamily: fMono, fontSize: isMobile ? 9 : 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.8, marginBottom: 6 }} data-font-slot={3}>
              For{" "}
              <EditableText fieldPath="client" value={page.client} onChange={set ? (v) => set("client", v) : undefined} as="span" fontSlot={3} />
              {" · "}{page.photoCount || photos.length} photographs
            </div>
            <h1 style={{ fontFamily: fDisplay, fontSize: isMobile ? 36 : 64, lineHeight: 0.95, letterSpacing: "-0.02em", margin: 0, fontWeight: 400 }} data-font-slot={1}>
              {first ?? page.title} <em style={{ fontStyle: "italic", color: t.accent }}>&amp; {second ?? ""}</em>
            </h1>
          </div>
        </div>
      </EditableImage>

      {/* Welcome */}
      {(page.welcomeMessage || set) && (
        <div style={{ padding: isMobile ? "20px 18px 0" : "28px 32px 0", maxWidth: 640 }}>
          <EditableText
            fieldPath="welcomeMessage" value={page.welcomeMessage} onChange={set ? (v) => set("welcomeMessage", v) : undefined}
            as="p" multiline fontSlot={1}
            placeholder={set ? "Write a personal message to your client…" : ""}
            style={{ fontFamily: fDisplay, fontStyle: "italic", fontSize: isMobile ? 14 : 17, lineHeight: 1.55, color: page.welcomeMessage ? t.fg : t.muted, margin: 0 }}
          />
        </div>
      )}

      {/* Section label + photo grid */}
      <div style={{ padding: isMobile ? "18px 18px 32px" : "32px 32px 48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, color: t.muted, marginBottom: 16, fontFamily: fMono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>
          <span>The Day</span>
          <hr style={{ flex: 1, border: 0, borderTop: `1px solid ${t.line}` }} />
          <span>{photos.length} frames</span>
        </div>
        {page.layout === "masonry" ? (
          <div style={{ columns: isMobile ? 2 : 3, columnGap: 10 }}>
            {photos.map((seed, i) => (
              <div key={seed} style={{ breakInside: "avoid", marginBottom: 10, position: "relative", overflow: "hidden", background: t.raised }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl(seed, 600, 480 + (i % 4) * 80)} alt="" style={{ width: "100%", display: "block" }} />
                {wm && <Watermark text={page.logoText || "HALCYON"} fontFamily={fMono} />}
                {page.mode === "direct" && page.pricePerPhoto > 0 && <PriceTag price={page.pricePerPhoto} bg="rgba(14,13,11,0.7)" fg={t.fg} fontFamily={fMono} />}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: 10 }}>
            {photos.map((seed) => (
              <div key={seed} style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", background: t.raised }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl(seed, 600, 750)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                {wm && <Watermark text={page.logoText || "HALCYON"} fontFamily={fMono} />}
                {page.mode === "direct" && page.pricePerPhoto > 0 && <PriceTag price={page.pricePerPhoto} bg="rgba(14,13,11,0.7)" fg={t.fg} fontFamily={fMono} />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: isMobile ? "18px" : "28px 32px", borderTop: `1px solid ${t.line}`, color: t.muted, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontFamily: fMono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: fDisplay, fontSize: 16, color: t.fg, textTransform: "none", letterSpacing: 0 }}>
          <LogoBlock
            page={page} set={set} fallback="Halcyon" fontSlot={1}
            imageHeight={18}
            textStyle={{ fontFamily: fDisplay, fontSize: 16, color: t.fg }}
          />
          {page.logoMode !== "none" && <em style={{ color: t.accent, fontStyle: "italic" }}> Studio</em>}
        </span>
        <span>© {new Date().getFullYear()} · Delivered with Portapic</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BROOKLYN — dark + red accent, bold sans
══════════════════════════════════════════════════════════════════════════ */

function BrooklynPreview({ page, isMobile, set, view = "gallery", onRequestCoverChange }: RendererProps) {
  const baseT = { bg: "#0D0D0D", fg: "#F0EFE9", muted: "#7A7A7A", line: "#1F1F1F", raised: "#161616", accent: "#E8382C" };
  const ts = effectiveStyle(page);
  const t = page.customColors ? { ...baseT, bg: ts.bg, fg: ts.fg, accent: ts.accent } : baseT;
  const photos = picks(page);
  /* Brooklyn has no serif — slot 1 maps to its display sans, slot 2 to its body sans. */
  const fDisplay = fontSlot(page, 1, BROOKLYN_FONTS.sans);
  const fBody    = fontSlot(page, 2, BROOKLYN_FONTS.sans);
  const fMono    = fontSlot(page, 3, BROOKLYN_FONTS.mono);
  const wm = shouldWatermark(page);

  if (view === "password") {
    return <PasswordGate page={page} set={set} isMobile={isMobile} theme={t} fDisplay={fDisplay} fBody={fBody} fMono={fMono} />;
  }

  return (
    <div style={{ background: t.bg, color: t.fg, fontFamily: fBody, minHeight: "100%", overflowY: "auto" }} className="w-full h-full">
      <FontStylesheet />
      <EditableHoverStyles />
      <div style={{ height: 3, background: t.accent }} />

      <EditableImage
        fieldPath="coverUrl" onRequestChange={onRequestCoverChange}
        style={{ position: "relative", height: isMobile ? 220 : 360, overflow: "hidden" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverFor(page)} alt="" style={coverImgStyle(page, { filter: "contrast(1.05)" })} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(13,13,13,0.25) 0%,rgba(13,13,13,0) 30%,rgba(13,13,13,0.85) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, padding: isMobile ? "16px 18px" : "24px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: fMono, fontSize: isMobile ? 9 : 10, letterSpacing: "0.32em", textTransform: "uppercase", color: t.accent }} data-font-slot={3}>
            <LogoBlock
              page={page} set={set} fallback="BROOKLYN" fontSlot={3}
              imageHeight={isMobile ? 16 : 20}
              textStyle={{ fontFamily: fMono, fontSize: isMobile ? 9 : 10, letterSpacing: "0.32em", textTransform: "uppercase", color: t.accent }}
            />
            {page.logoMode !== "none" && <span>/ Client Gallery</span>}
            {page.logoMode === "none" && <span>Client Gallery</span>}
          </div>
          <div>
            <div style={{ fontFamily: fMono, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: t.muted, marginBottom: 8 }} data-font-slot={3}>
              <EditableText fieldPath="client" value={page.client} onChange={set ? (v) => set("client", v) : undefined} as="span" fontSlot={3} />
              {" · "}{page.photoCount || photos.length} frames
            </div>
            <EditableText
              fieldPath="title" value={page.title} onChange={set ? (v) => set("title", v) : undefined}
              as="h1" fontSlot={1}
              style={{ fontFamily: fDisplay, fontWeight: 700, fontSize: isMobile ? 32 : 56, lineHeight: 1, letterSpacing: "-0.03em", margin: 0, textTransform: "uppercase" }}
            />
          </div>
        </div>
      </EditableImage>

      <div style={{ padding: isMobile ? "18px" : "28px 32px" }}>
        {(page.welcomeMessage || set) && (
          <EditableText
            fieldPath="welcomeMessage" value={page.welcomeMessage} onChange={set ? (v) => set("welcomeMessage", v) : undefined}
            as="p" multiline fontSlot={2}
            placeholder={set ? "Write a personal message to your client…" : ""}
            style={{ fontFamily: fBody, fontSize: isMobile ? 13 : 15, lineHeight: 1.55, color: page.welcomeMessage ? t.fg : t.muted, margin: "0 0 24px", maxWidth: 600, display: "block" }}
          />
        )}
        {page.layout === "masonry" ? (
          <div style={{ columns: isMobile ? 2 : 4, columnGap: 6 }}>
            {photos.map((seed, i) => (
              <div key={seed} style={{ breakInside: "avoid", marginBottom: 6, position: "relative", overflow: "hidden", background: t.raised }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl(seed, 600, 500 + (i % 4) * 100)} alt="" style={{ width: "100%", display: "block" }} />
                {wm && <Watermark text={page.logoText || "BROOKLYN"} fontFamily={fMono} />}
                {page.mode === "direct" && page.pricePerPhoto > 0 && <PriceTag price={page.pricePerPhoto} bg={t.accent} fg={t.bg} fontFamily={fMono} />}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 6 }}>
            {photos.map((seed) => (
              <div key={seed} style={{ position: "relative", aspectRatio: "1", overflow: "hidden", background: t.raised }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl(seed, 600, 600)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {wm && <Watermark text={page.logoText || "BROOKLYN"} fontFamily={fMono} />}
                {page.mode === "direct" && page.pricePerPhoto > 0 && <PriceTag price={page.pricePerPhoto} bg={t.accent} fg={t.bg} fontFamily={fMono} />}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: isMobile ? "18px" : "24px 32px", borderTop: `1px solid ${t.line}`, color: t.muted, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontFamily: fMono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase" }}>
        <LogoBlock
          page={page} set={set} fallback="BROOKLYN" fontSlot={3}
          imageHeight={18}
          textStyle={{ color: t.fg, fontWeight: 700, fontFamily: fMono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase" }}
        />
        <span>© {new Date().getFullYear()} · Portapic</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MINIMAL — white paper, serif italic, strict grid
══════════════════════════════════════════════════════════════════════════ */

function MinimalPreview({ page, isMobile, set, view = "gallery", onRequestCoverChange }: RendererProps) {
  const baseT = { bg: "#FAFAFA", fg: "#111111", muted: "#888888", line: "#E8E8E8", raised: "#FFFFFF", accent: "#111111" };
  const ts = effectiveStyle(page);
  const t = page.customColors ? { ...baseT, bg: ts.bg, fg: ts.fg, accent: ts.accent } : baseT;
  const photos = picks(page);
  const [first, second] = page.client.split(/\s*&\s*|\s+y\s+|\s+and\s+/);
  const fDisplay = fontSlot(page, 1, MINIMAL_FONTS.serif);
  const fBody    = fontSlot(page, 2, MINIMAL_FONTS.sans);
  const fMono    = fontSlot(page, 3, MINIMAL_FONTS.mono);
  const wm = shouldWatermark(page);

  if (view === "password") {
    return <PasswordGate page={page} set={set} isMobile={isMobile} theme={t} fDisplay={fDisplay} fBody={fBody} fMono={fMono} />;
  }

  return (
    <div style={{ background: t.bg, color: t.fg, fontFamily: fBody, minHeight: "100%", overflowY: "auto" }} className="w-full h-full">
      <FontStylesheet />
      <EditableHoverStyles />

      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "16px 18px" : "22px 32px", borderBottom: `1px solid ${t.line}`, background: t.raised }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: fDisplay, fontSize: 20, letterSpacing: "-0.02em", fontWeight: 500 }} data-font-slot={1}>
          <LogoBlock
            page={page} set={set} fallback="Studio" fontSlot={1}
            imageHeight={24}
            textStyle={{ fontFamily: fDisplay, fontSize: 20, letterSpacing: "-0.02em", fontWeight: 500 }}
          />
          {page.logoMode !== "none" && <em style={{ fontStyle: "italic", color: t.muted }}> Minimal</em>}
        </span>
        <span style={{ fontFamily: fMono, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: t.muted }} data-font-slot={3}>
          <EditableText fieldPath="client" value={page.client} onChange={set ? (v) => set("client", v) : undefined} as="span" fontSlot={3} />
        </span>
      </header>

      {/* Hero (text-only, paper) */}
      <section style={{ padding: isMobile ? "48px 24px 32px" : "72px 32px 48px", textAlign: "center", borderBottom: `1px solid ${t.line}` }}>
        <div style={{ fontFamily: fMono, fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: t.muted, marginBottom: 18 }} data-font-slot={3}>
          For your eyes only · {page.photoCount || photos.length} photographs
        </div>
        <h1 style={{ fontFamily: fDisplay, fontSize: isMobile ? 44 : 80, lineHeight: 0.95, letterSpacing: "-0.02em", margin: 0, fontWeight: 400 }} data-font-slot={1}>
          {first ?? page.title}{second ? <><br /><em style={{ fontStyle: "italic" }}>&amp; {second}</em></> : null}
        </h1>
        {(page.welcomeMessage || set) && (
          <EditableText
            fieldPath="welcomeMessage" value={page.welcomeMessage} onChange={set ? (v) => set("welcomeMessage", v) : undefined}
            as="p" multiline fontSlot={1}
            placeholder={set ? "Write a personal message to your client…" : ""}
            style={{ fontFamily: fDisplay, fontStyle: "italic", fontSize: isMobile ? 14 : 16, lineHeight: 1.55, color: t.muted, maxWidth: 460, margin: "20px auto 0", display: "block" }}
          />
        )}
      </section>

      {(page.coverUrl || set) && (
        <EditableImage
          fieldPath="coverUrl" onRequestChange={onRequestCoverChange}
          style={{ position: "relative", height: isMobile ? 220 : 360, overflow: "hidden", background: t.raised, borderBottom: `1px solid ${t.line}` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverFor(page)} alt="" style={coverImgStyle(page, { display: "block" })} />
        </EditableImage>
      )}

      <section style={{ padding: isMobile ? "32px 18px" : "48px 32px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 24 }}>
          <span style={{ fontFamily: fMono, fontSize: 10, letterSpacing: "0.18em", color: t.muted, textTransform: "uppercase" }} data-font-slot={3}>01</span>
          <h2 style={{ fontFamily: fDisplay, fontSize: isMobile ? 28 : 36, letterSpacing: "-0.02em", lineHeight: 1, margin: 0, fontWeight: 400 }} data-font-slot={1}>
            The <em style={{ fontStyle: "italic", color: t.muted }}>Day</em>
          </h2>
          <hr style={{ flex: 1, border: 0, borderTop: `1px solid ${t.line}` }} />
        </div>
        {page.layout === "masonry" ? (
          <div style={{ columns: isMobile ? 2 : 4, columnGap: 12 }}>
            {photos.map((seed, i) => (
              <div key={seed} style={{ breakInside: "avoid", marginBottom: 12, position: "relative", overflow: "hidden", background: t.raised, border: `1px solid ${t.line}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl(seed, 600, 600 + (i % 4) * 100)} alt="" style={{ width: "100%", display: "block" }} />
                {wm && <Watermark text={page.logoText || "STUDIO"} fontFamily={fMono} dark />}
                {page.mode === "direct" && page.pricePerPhoto > 0 && <PriceTag price={page.pricePerPhoto} bg="rgba(255,255,255,0.92)" fg={t.fg} fontFamily={fMono} />}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 12 }}>
            {photos.map((seed) => (
              <div key={seed} style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", background: t.raised, border: `1px solid ${t.line}` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl(seed, 600, 750)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {wm && <Watermark text={page.logoText || "STUDIO"} fontFamily={fMono} dark />}
                {page.mode === "direct" && page.pricePerPhoto > 0 && <PriceTag price={page.pricePerPhoto} bg="rgba(255,255,255,0.92)" fg={t.fg} fontFamily={fMono} />}
              </div>
            ))}
          </div>
        )}
      </section>

      <footer style={{ padding: isMobile ? "18px" : "28px 32px", borderTop: `1px solid ${t.line}`, color: t.muted, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontFamily: fMono, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: fDisplay, fontSize: 16, color: t.fg, textTransform: "none", letterSpacing: 0 }}>
          <LogoBlock
            page={page} set={set} fallback="Studio" fontSlot={1}
            imageHeight={18}
            textStyle={{ fontFamily: fDisplay, fontSize: 16, color: t.fg }}
          />
          {page.logoMode !== "none" && <em style={{ fontStyle: "italic", color: t.muted }}>Minimal</em>}
        </span>
        <span>© {new Date().getFullYear()} · Portapic</span>
      </footer>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   GENERIC — fallback for vogue (and any future template without a renderer)
══════════════════════════════════════════════════════════════════════════ */

function GenericPreview({ page, isMobile, set, view = "gallery", onRequestCoverChange }: RendererProps) {
  const ts = effectiveStyle(page);
  const photos = picks(page);
  const fDisplay = fontSlot(page, 1, "Inter, sans-serif");
  const fBody    = fontSlot(page, 2, page.fontFamily || "Inter, sans-serif");
  const fMono    = fontSlot(page, 3, "monospace");

  if (view === "password") {
    const theme = { bg: ts.bg, fg: ts.fg, muted: ts.muted, accent: ts.accent, line: ts.muted + "33", raised: ts.accent };
    return <PasswordGate page={page} set={set} isMobile={isMobile} theme={theme} fDisplay={fDisplay} fBody={fBody} fMono={fMono} />;
  }

  return (
    <div className="w-full h-full overflow-y-auto" style={{ background: ts.bg, color: ts.fg, fontFamily: fBody }}>
      <EditableHoverStyles />
      <EditableImage
        fieldPath="coverUrl" onRequestChange={onRequestCoverChange}
        style={{ position: "relative", height: isMobile ? 200 : 320, overflow: "hidden" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverFor(page)} alt="" style={coverImgStyle(page)} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.7))" }} />
        <div style={{ position: "absolute", bottom: isMobile ? 16 : 28, left: isMobile ? 16 : 28, right: isMobile ? 16 : 28, color: "#fff" }}>
          <p style={{ fontFamily: fMono, fontSize: isMobile ? 9 : 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7, marginBottom: 4 }} data-font-slot={3}>
            <EditableText fieldPath="client" value={page.client} onChange={set ? (v) => set("client", v) : undefined} as="span" fontSlot={3} />
            {" · "}{page.photoCount || photos.length} photos
          </p>
          <EditableText
            fieldPath="title" value={page.title} onChange={set ? (v) => set("title", v) : undefined}
            as="h1" fontSlot={1}
            style={{ fontFamily: fDisplay, fontWeight: 900, fontSize: isMobile ? 28 : 48, lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0 }}
          />
        </div>
      </EditableImage>
      {(page.welcomeMessage || set) && (
        <div style={{ padding: isMobile ? "14px 14px 0" : "28px 28px 0", maxWidth: 600 }}>
          <EditableText
            fieldPath="welcomeMessage" value={page.welcomeMessage} onChange={set ? (v) => set("welcomeMessage", v) : undefined}
            as="p" multiline fontSlot={2}
            placeholder={set ? "Write a personal message to your client…" : ""}
            style={{ fontFamily: fBody, fontSize: isMobile ? 13 : 15, lineHeight: 1.55, color: ts.muted, margin: 0 }}
          />
        </div>
      )}
      <div style={{ padding: isMobile ? 14 : 28 }}>
        {page.layout === "masonry" ? (
          <div style={{ columns: isMobile ? 2 : 3, columnGap: 8 }}>
            {photos.map((seed, i) => (
              <div key={seed} style={{ breakInside: "avoid", marginBottom: 8, position: "relative", overflow: "hidden", background: ts.accent }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl(seed, 600, 500 + (i % 4) * 100)} alt="" style={{ width: "100%", display: "block" }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: 8 }}>
            {photos.map((seed) => (
              <div key={seed} style={{ position: "relative", aspectRatio: "1", overflow: "hidden", background: ts.accent }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl(seed, 600, 600)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        )}
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

const RENDERERS: Record<TemplateName, (props: RendererProps) => React.JSX.Element> = {
  halcyon:  HalcyonPreview,
  brooklyn: BrooklynPreview,
  minimal:  MinimalPreview,
  vogue:    GenericPreview,
};

export function GalleryView({
  page, viewport = "desktop", view = "gallery", set, onRequestCoverChange,
}: {
  page: DeliveryPage;
  viewport?: "mobile" | "desktop";
  view?: DeliveryView;
  set?: Setter;
  onRequestCoverChange?: () => void;
}) {
  const isMobile = viewport === "mobile";
  const Renderer = RENDERERS[page.template] ?? GenericPreview;
  return <Renderer page={page} isMobile={isMobile} view={view} set={set} onRequestCoverChange={onRequestCoverChange} />;
}

/* Preview frame — browser/phone chrome around the live template, with
   viewport (desktop/mobile) and view (gallery/password) toggles. */
export function PreviewFrame({
  page, view, onViewChange, set, onRequestCoverChange,
}: {
  page: DeliveryPage;
  view: DeliveryView;
  onViewChange: (v: DeliveryView) => void;
  set?: Setter;
  onRequestCoverChange?: () => void;
}) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center gap-3 py-3 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden" title={page.passwordEnabled ? undefined : "Password protection is off. You can still edit the gate."}>
          {(["password", "gallery"] as const).map((v) => (
            <button key={v} onClick={() => onViewChange(v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium transition-colors ${
                view === v ? "bg-[var(--fg)] text-[var(--bg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              {v === "password" ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              )}
              {v === "password" ? "Password" : "Gallery"}
              {v === "password" && !page.passwordEnabled && view !== "password" && (
                <span className="ml-1 w-1.5 h-1.5 rounded-full bg-[var(--fg-muted)]" title="Protection is off" />
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
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
      </div>

      <div className="flex-1 flex items-center justify-center overflow-auto bg-[var(--bg)] relative p-6">
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{ backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="relative z-10">
          {viewport === "desktop" ? (
            <div className="rounded-xl overflow-hidden border border-[var(--border)] shadow-2xl bg-[var(--bg-card)]" style={{ width: 1040 }}>
              <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow/70" />
                  <div className="w-3 h-3 rounded-full bg-green-400/70" />
                </div>
                <span className="font-mono text-[10px] text-[var(--fg-muted)] tracking-widest uppercase">Portapic</span>
                <span className="w-12" />
              </div>
              <div style={{ height: 640 }}>
                <GalleryView page={page} viewport="desktop" view={view} set={set} onRequestCoverChange={onRequestCoverChange} />
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
                  <GalleryView page={page} viewport="mobile" view={view} set={set} onRequestCoverChange={onRequestCoverChange} />
                </div>
              </div>
              <div className="absolute rounded-l-sm" style={{ left: -3, top: 100, width: 3, height: 30, background: "#333" }} />
              <div className="absolute rounded-l-sm" style={{ left: -3, top: 138, width: 3, height: 38, background: "#333" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
