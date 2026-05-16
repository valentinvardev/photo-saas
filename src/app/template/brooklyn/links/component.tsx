"use client";

/* ─── Brooklyn Links — canonical component ───────────────────────────
   Same design language as the Brooklyn portfolio: urban dark, red
   accent, italic serif name, Space Grotesk body, Space Mono labels.

   This component is the single source of truth for the Brooklyn Links
   surface. Rendered in three places:
     • /dashboard/links — inside the live preview phone
     • /l/[id]          — public client-facing route
     • /template/brooklyn/links — public demo (defaults from store)

   Like the canonical Brooklyn delivery, it carries its own next/font
   imports so the typography matches anywhere it's rendered.
   ─────────────────────────────────────────────────────────────────── */

import { useState } from "react";
import { DM_Serif_Display, Space_Grotesk, Space_Mono } from "next/font/google";
import type { CSSProperties } from "react";
import { EditableText, EditableImage, EditableHoverStyles } from "~/components/delivery/editable";
import { effectiveLinkUrl, type LinksPage, type LinkItem } from "~/lib/links/data";

const bkSerif = DM_Serif_Display({ subsets: ["latin"], weight: ["400"], style: ["normal", "italic"], display: "swap", variable: "--bk-serif" });
const bkSans  = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap", variable: "--bk-sans" });
const bkMono  = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--bk-mono" });
const BK_FONT_CLASSES = `${bkSerif.variable} ${bkSans.variable} ${bkMono.variable}`;

const SERIF = "var(--bk-serif), 'DM Serif Display', Georgia, serif";
const MONO  = "var(--bk-mono), 'Space Mono', monospace";

type Patch = (patch: Partial<LinksPage>) => void;

interface BrooklynLinksProps {
  page: LinksPage;
  /** When defined, text labels become editable inline. */
  patch?: Patch;
  /** When defined, the avatar shows a "change image" affordance and clicking opens this. */
  onRequestAvatarChange?: () => void;
}

/* ── helpers ─────────────────────────────────────────────────────── */

function lbl(page: LinksPage, key: string, fallback: string): string {
  return page.labels?.[key] ?? fallback;
}
function setLbl(patch: Patch | undefined, page: LinksPage, key: string): ((v: string) => void) | undefined {
  if (!patch) return undefined;
  return (v: string) => patch({ labels: { ...(page.labels ?? {}), [key]: v } });
}

/* The brooklyn template overrides palette aggressively — accent always red,
   dark surface, body sans + mono. But colours still flow from the page so a
   photographer can tone them down without losing the visual identity. */
function brooklynTheme(page: LinksPage) {
  return {
    bg:     page.bgColor || "#0D0D0D",
    fg:     page.textColor || "#F0EFE9",
    sub:    page.subColor  || "#7A7A7A",
    accent: "#E8382C",
    line:   "#2A2A2A",
    raised: "#161616",
    btnBg:     page.btnBg     || "#161616",
    btnText:   page.btnText   || "#F0EFE9",
    btnBorder: page.btnBorder || "#1F1F1F",
  };
}

function brooklynBackground(page: LinksPage): CSSProperties {
  if (page.bgType === "gradient") {
    return { background: `linear-gradient(${page.bgGradAngle}deg, ${page.bgGradFrom}, ${page.bgGradTo})` };
  }
  if (page.bgType === "image" && page.bgImageUrl) {
    return {
      backgroundImage: `linear-gradient(${page.bgOverlayColor}${Math.round((page.bgOverlayOpacity ?? 0.4) * 255).toString(16).padStart(2, "0")}, ${page.bgOverlayColor}${Math.round((page.bgOverlayOpacity ?? 0.4) * 255).toString(16).padStart(2, "0")}), url(${page.bgImageUrl})`,
      backgroundSize: "cover", backgroundPosition: "center",
    };
  }
  return { background: page.bgColor || "#0D0D0D" };
}

function buttonStyle(page: LinksPage, t: ReturnType<typeof brooklynTheme>, hovered: boolean): CSSProperties {
  const radius = page.btnShape === "pill" ? 9999 : page.btnShape === "rounded" ? 12 : 0;
  const base: CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 20px", borderRadius: radius,
    textDecoration: "none",
    transition: "background 0.2s, border-color 0.2s, transform 0.15s",
    transform: hovered ? "translateX(4px)" : "translateX(0)",
    fontFamily: page.fontFamily || "'Space Grotesk', sans-serif",
  };
  if (page.btnVariant === "filled") {
    return { ...base, background: hovered ? withOverlay(t.btnBg, 0.85) : t.btnBg, color: t.btnText, border: `1px solid ${t.btnBg}` };
  }
  if (page.btnVariant === "glass") {
    return { ...base, background: hovered ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)", color: t.btnText, border: `1px solid ${t.btnBorder}`, backdropFilter: "blur(8px)" };
  }
  // outline
  return { ...base, background: hovered ? t.raised : "transparent", color: t.btnText, border: `1px solid ${t.btnBorder}` };
}

function withOverlay(hex: string, opacity: number): string {
  /* Quick darken-on-hover for filled buttons. Mixes the colour toward black. */
  if (!hex.startsWith("#") || (hex.length !== 7 && hex.length !== 4)) return hex;
  const full = hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
  const r = parseInt(full.slice(1, 3), 16);
  const g = parseInt(full.slice(3, 5), 16);
  const b = parseInt(full.slice(5, 7), 16);
  const m = (n: number) => Math.max(0, Math.min(255, Math.round(n * opacity)));
  return `rgb(${m(r)}, ${m(g)}, ${m(b)})`;
}

/* ── Public component ─────────────────────────────────────────────── */

export function BrooklynLinks({ page, patch, onRequestAvatarChange }: BrooklynLinksProps) {
  const t = brooklynTheme(page);
  const isEditor = !!patch;
  const visibleLinks = page.links.filter((l) => l.enabled);

  return (
    <main
      className={BK_FONT_CLASSES}
      style={{
        fontFamily: page.fontFamily || "'Space Grotesk', sans-serif",
        fontWeight: page.fontWeight || "400",
        color: t.fg,
        minHeight: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        overflowY: "auto",
        ...brooklynBackground(page),
      }}
    >
      <EditableHoverStyles />

      {/* Red top bar */}
      <div style={{ height: 3, background: t.accent, flexShrink: 0 }} />

      {/* Marquee strip */}
      {lbl(page, "marquee", "Morrison Photo · NYC · est. 2013 · Book now") && (
        <div style={{
          background: t.accent, overflow: "hidden", height: 28,
          display: "flex", alignItems: "center", flexShrink: 0,
        }}>
          <div style={{
            display: "flex", gap: 0,
            animation: "bk-links-marquee 22s linear infinite",
            whiteSpace: "nowrap",
          }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={i} style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: t.bg, padding: "0 32px" }}>
                {lbl(page, "marquee", "Morrison Photo · NYC · est. 2013 · Book now")}&nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      )}
      <style>{`
        @keyframes bk-links-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      {/* Marquee text editor — rendered as a thin invisible row in editor mode */}
      {isEditor && (
        <div style={{ padding: "4px 24px 0", textAlign: "center" }}>
          <EditableText
            fieldPath="labels.marquee"
            value={lbl(page, "marquee", "Morrison Photo · NYC · est. 2013 · Book now")}
            onChange={setLbl(patch, page, "marquee")}
            as="span"
            placeholder="Marquee text · click to edit"
            style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: t.sub, opacity: 0.7 }}
          />
        </div>
      )}

      {/* Main content */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
        padding: "40px 24px 48px",
        maxWidth: 520, margin: "0 auto", width: "100%",
      }}>

        {/* Avatar */}
        <EditableImage
          fieldPath="avatarUrl"
          onRequestChange={onRequestAvatarChange}
          style={{
            width: 88, height: 88, borderRadius: "50%",
            overflow: "hidden", marginBottom: 20,
            border: `2px solid ${t.line}`, flexShrink: 0,
            background: page.avatarBg,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {page.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={page.avatarUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 36, fontWeight: 400, color: t.bg }}>
              {page.avatarInitial || page.displayName?.charAt(0)?.toUpperCase() || "?"}
            </span>
          )}
        </EditableImage>

        {/* Name */}
        <EditableText
          fieldPath="displayName"
          value={page.displayName}
          onChange={patch ? (v) => patch({ displayName: v }) : undefined}
          as="h1"
          style={{
            fontFamily: SERIF, fontStyle: "italic",
            fontSize: "clamp(32px, 8vw, 48px)",
            fontWeight: 400, color: t.fg,
            letterSpacing: "-0.02em", lineHeight: 1,
            margin: "0 0 6px", textAlign: "center",
          }}
        />

        <EditableText
          fieldPath="labels.profession"
          value={lbl(page, "profession", "Photographer")}
          onChange={setLbl(patch, page, "profession")}
          as="p"
          hideIfEmpty
          style={{
            fontFamily: MONO, fontSize: 10, letterSpacing: "0.28em",
            textTransform: "uppercase", color: t.accent,
            margin: "0 0 10px",
          }}
        />

        <EditableText
          fieldPath="bio"
          value={page.bio}
          onChange={patch ? (v) => patch({ bio: v }) : undefined}
          as="p" multiline hideIfEmpty
          placeholder={isEditor ? "Tell visitors what you do · click to edit" : ""}
          style={{
            fontSize: 13, color: t.sub, fontFamily: page.fontFamily || "'Space Grotesk', sans-serif",
            textAlign: "center", lineHeight: 1.6,
            margin: "0 0 32px", maxWidth: 320, display: "block",
          }}
        />

        {/* Links */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
          {visibleLinks.length === 0 && isEditor && (
            <div style={{ padding: "32px 16px", textAlign: "center", border: `1px dashed ${t.line}`, color: t.sub, fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              No links yet — add some from the sidebar
            </div>
          )}
          {visibleLinks.map((link, i) => (
            <BrooklynLinkRow key={link.id} link={link} index={i} page={page} t={t} patch={patch} />
          ))}
        </div>

        {/* Stats — three editable values + labels, hidden when all empty */}
        <StatsRow page={page} patch={patch} t={t} />

        {/* Footer */}
        <div style={{
          marginTop: 36, display: "flex", alignItems: "center", gap: 4,
          fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em",
          textTransform: "uppercase", color: t.line,
        }}>
          <span>Built with</span>
          <span style={{ color: t.accent, fontWeight: 700 }}>Portapic</span>
        </div>
      </div>
    </main>
  );
}

/* ── Subcomponents ────────────────────────────────────────────────── */

function BrooklynLinkRow({ link, index, page, t, patch }: {
  link: LinkItem;
  index: number;
  page: LinksPage;
  t: ReturnType<typeof brooklynTheme>;
  patch?: Patch;
}) {
  const [hovered, setHovered] = useState(false);
  const isEditor = !!patch;
  /* Update a single link in the array, keyed by id. */
  const updateLink = (k: keyof LinkItem, value: string) => {
    if (!patch) return;
    patch({ links: page.links.map((l) => l.id === link.id ? { ...l, [k]: value } : l) });
  };

  const resolvedHref = effectiveLinkUrl(link);
  const subtitle = link.type === "instagram"
    ? (link.igUsername ? `@${link.igUsername}` : "")
    : link.type === "email"
    ? (link.emailAddress ?? "")
    : link.type === "whatsapp"
    ? `+${link.waCountry ?? ""} ${link.waPhone ?? ""}`.trim()
    : resolvedHref;

  return (
    <a
      href={isEditor ? undefined : resolvedHref}
      target={isEditor ? undefined : "_blank"} rel={isEditor ? undefined : "noreferrer"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={buttonStyle(page, t, hovered)}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <EditableText
          fieldPath={`links[${index}].title`}
          value={link.title}
          onChange={isEditor ? (v) => updateLink("title", v) : undefined}
          as="div"
          style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em", color: "inherit" }}
        />
        {subtitle && (
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", marginTop: 2, opacity: 0.6, color: "inherit", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {subtitle}
          </div>
        )}
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ opacity: hovered ? 1 : 0.3, transition: "opacity 0.2s, transform 0.2s", transform: hovered ? "translateX(2px)" : "none", flexShrink: 0 }}>
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </a>
  );
}

function StatsRow({ page, patch, t }: { page: LinksPage; patch?: Patch; t: ReturnType<typeof brooklynTheme> }) {
  const stats = [
    { vKey: "stat1Value", lKey: "stat1Label", vDef: "12",   lDef: "Years"    },
    { vKey: "stat2Value", lKey: "stat2Label", vDef: "800+", lDef: "Sessions" },
    { vKey: "stat3Value", lKey: "stat3Label", vDef: "NYC",  lDef: "Based"    },
  ] as const;
  const anyShown = stats.some((s) => lbl(page, s.vKey, s.vDef) || lbl(page, s.lKey, s.lDef));
  if (!anyShown && !patch) return null;

  return (
    <div style={{
      display: "flex", gap: 0, marginTop: 44, width: "100%",
      borderTop: `1px solid ${t.line}`, paddingTop: 28,
      justifyContent: "space-around",
    }}>
      {stats.map((s) => (
        <div key={s.vKey} style={{ textAlign: "center" }}>
          <EditableText
            fieldPath={`labels.${s.vKey}`}
            value={lbl(page, s.vKey, s.vDef)}
            onChange={setLbl(patch, page, s.vKey)}
            as="div" hideIfEmpty
            style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 30, fontWeight: 400, color: t.fg, lineHeight: 1 }}
          />
          <EditableText
            fieldPath={`labels.${s.lKey}`}
            value={lbl(page, s.lKey, s.lDef)}
            onChange={setLbl(patch, page, s.lKey)}
            as="div" hideIfEmpty
            style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: t.sub, marginTop: 5 }}
          />
        </div>
      ))}
    </div>
  );
}
