"use client";

import type { ColorPalette, Typography } from "~/lib/editor/types";
import { fullName, initials, type Identity, type TemplateOption } from "./brandData";

const COPY = {
  en: { nav: ["Work", "About", "Contact"], cta: "View work", eyebrow: "Photography", avail: "Available for commissions", selected: "Selected work", bioFallback: "Documenting the quiet moments between people and places." },
  es: { nav: ["Trabajos", "Sobre mí", "Contacto"], cta: "Ver trabajos", eyebrow: "Fotografía", avail: "Disponible para encargos", selected: "Trabajos seleccionados", bioFallback: "Documentando los momentos tranquilos entre las personas y los lugares." },
  pt: { nav: ["Trabalhos", "Sobre", "Contato"], cta: "Ver trabalhos", eyebrow: "Fotografia", avail: "Disponível para encomendas", selected: "Trabalhos selecionados", bioFallback: "Documentando os momentos tranquilos entre pessoas e lugares." },
};

/**
 * Live, branded portfolio mock for the onboarding right panel. Reflects the
 * user's palette, font pairing, identity and template variant in real time.
 */
export function BrandPreview({
  palette, fonts, identity, variant, locale,
}: {
  palette: ColorPalette;
  fonts: Typography;
  identity: Identity;
  variant: TemplateOption["variant"];
  locale: string;
}) {
  const t = COPY[locale as keyof typeof COPY] ?? COPY.en;
  const name = fullName(identity) || (locale === "es" ? "Tu Nombre" : "Your Name");
  const first = identity.first || name.split(" ")[0] || name;
  const last = identity.last;
  const eyebrow = `${t.eyebrow}${identity.location ? ` · ${identity.location}` : ""}`;
  const bio = identity.bio || t.bioFallback;
  const centered = variant === "atelier";

  const photos = [11, 24, 37, 48, 63, 71];

  return (
    <div
      style={{
        width: "100%", borderRadius: 12, overflow: "hidden",
        border: "1px solid var(--border)", boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
        background: palette.bg,
      }}
    >
      {/* Browser chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: "color-mix(in srgb, var(--bg-card) 80%, transparent)", borderBottom: "1px solid var(--border)" }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e" }} />
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
        <div style={{ flex: 1, textAlign: "center", fontFamily: "monospace", fontSize: 10, color: "var(--fg-muted)", letterSpacing: "0.04em" }}>
          {(name.toLowerCase().replace(/[^a-z]+/g, "") || "yourname")}.portapic.com
        </div>
        <span style={{ width: 28 }} />
      </div>

      {/* Portfolio body */}
      <div style={{ background: palette.bg, color: palette.fg, fontFamily: fonts.sans, height: 420, overflow: "hidden" }}>
        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px" }}>
          <span style={{ fontFamily: fonts.mono, fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: palette.fg }}>{initials(identity)}</span>
          <div style={{ display: "flex", gap: 18 }}>
            {t.nav.map((l) => (
              <span key={l} style={{ fontFamily: fonts.sans, fontSize: 11, color: palette.muted, letterSpacing: "0.04em" }}>{l}</span>
            ))}
            <span style={{ fontFamily: fonts.sans, fontSize: 11, fontWeight: 600, color: palette.accent }}>{t.cta}</span>
          </div>
        </div>

        {/* Hero */}
        <div style={{ padding: centered ? "26px 22px 18px" : "22px 22px 16px", textAlign: centered ? "center" : "left" }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 9.5, letterSpacing: "0.25em", textTransform: "uppercase", color: palette.accent, marginBottom: 12 }}>{eyebrow}</div>
          <div style={{ fontFamily: fonts.serif, fontWeight: 300, fontSize: centered ? 46 : 52, lineHeight: 0.95, letterSpacing: "-0.02em", color: palette.fg }}>
            {first}{last && (<><br /><em style={{ fontStyle: "italic" }}>{last}</em></>)}
          </div>
          <p style={{ fontFamily: fonts.sans, fontWeight: 300, fontSize: 12.5, lineHeight: 1.6, color: palette.muted, maxWidth: centered ? 360 : 300, margin: centered ? "14px auto 0" : "14px 0 0" }}>
            {bio}
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: centered ? "center" : "flex-start" }}>
            <span style={{ fontFamily: fonts.sans, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: palette.bg, background: palette.accent, padding: "9px 16px", borderRadius: variant === "atelier" ? 0 : 2 }}>{t.cta}</span>
            <span style={{ fontFamily: fonts.sans, fontSize: 10.5, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: palette.fg, border: `1px solid color-mix(in srgb, ${palette.fg} 30%, transparent)`, padding: "9px 16px", borderRadius: variant === "atelier" ? 0 : 2 }}>{t.nav[1]}</span>
          </div>
        </div>

        {/* Section label + photo grid */}
        <div style={{ padding: "8px 22px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: fonts.mono, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: palette.muted }}>{t.selected}</span>
            <div style={{ flex: 1, height: 1, background: `color-mix(in srgb, ${palette.fg} 14%, transparent)` }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
            {photos.map((seed) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={seed} src={`https://picsum.photos/seed/${seed}/300/240?grayscale`} alt="" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block", filter: "brightness(0.95)" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
