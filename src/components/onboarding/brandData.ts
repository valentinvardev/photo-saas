import type { ColorPalette, Typography, EditorNode } from "~/lib/editor/types";

/* ── Accent palettes the user picks from (their "brand color") ── */
export type PaletteOption = { id: string } & ColorPalette;

export const PALETTES: PaletteOption[] = [
  { id: "noir",     bg: "#fafafa", fg: "#0a0a0a", accent: "#0a0a0a", muted: "#6b7280" },
  { id: "sand",     bg: "#fdf6ec", fg: "#1a1208", accent: "#a86a3d", muted: "#8a7a68" },
  { id: "slate",    bg: "#eef2f6", fg: "#1e293b", accent: "#3b5168", muted: "#64748b" },
  { id: "forest",   bg: "#f1f5f1", fg: "#13241a", accent: "#2f6b4f", muted: "#6b7d72" },
  { id: "plum",     bg: "#f7f1f6", fg: "#231220", accent: "#7d3f6e", muted: "#8a6f84" },
  { id: "midnight", bg: "#10131a", fg: "#f2f2f2", accent: "#fad502", muted: "#9aa0aa" },
];

/* ── Font pairings (heading serif + body sans) ── */
export type PairingOption = { id: string; serif: string; sans: string };

const MONO = "'Space Mono', monospace";

export const PAIRINGS: PairingOption[] = [
  { id: "editorial", serif: "'Cormorant Garamond', Georgia, serif", sans: "'DM Sans', system-ui, sans-serif" },
  { id: "modern",    serif: "'Playfair Display', Georgia, serif",   sans: "'Inter', system-ui, sans-serif" },
  { id: "warm",      serif: "'Fraunces', Georgia, serif",           sans: "'Manrope', system-ui, sans-serif" },
  { id: "clean",     serif: "'Lora', Georgia, serif",               sans: "'Outfit', system-ui, sans-serif" },
  { id: "bold",      serif: "'Syne', system-ui, sans-serif",        sans: "'Space Grotesk', system-ui, sans-serif" },
];

export function pairingTypography(p: PairingOption): Typography {
  return { serif: p.serif, sans: p.sans, mono: MONO };
}

/* ── Template options (real editor templates that render with branding) ── */
export type TemplateOption = { id: "minimal-bw" | "atelier"; variant: "minimal" | "atelier" };

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  { id: "minimal-bw", variant: "minimal" },
  { id: "atelier",    variant: "atelier" },
];

/* ── Identity collected in onboarding ── */
export type Identity = { first: string; last: string; location: string; bio: string };

export function fullName(id: Identity) {
  return `${id.first} ${id.last}`.trim();
}
export function initials(id: Identity) {
  const a = id.first.trim()[0] ?? "";
  const b = id.last.trim()[0] ?? "";
  return (a + (b ? "·" + b : "")).toUpperCase() || "—";
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Build the per-node overrides that seed a fresh minimal-bw portfolio with the
   user's identity — and, when locale is Spanish, Spanish default copy so the
   template itself reads in Spanish. Merged over the template defaults. */
export function buildMinimalNodes(locale: string, id: Identity): Record<string, EditorNode> {
  const es = locale === "es";
  const name = fullName(id);
  const year = new Date().getFullYear();
  const n = (nid: string, type: EditorNode["type"], content: string): [string, EditorNode] => [nid, { id: nid, type, content }];
  const out: Record<string, EditorNode> = {};
  const put = (entry: [string, EditorNode]) => { out[entry[0]] = entry[1]; };

  /* Spanish template copy (applies regardless of identity) */
  if (es) {
    put(n("nav-item-1", "paragraph", "Trabajos"));
    put(n("nav-item-2", "paragraph", "Sobre mí"));
    put(n("nav-item-3", "paragraph", "Prensa"));
    put(n("nav-item-4", "paragraph", "Contacto"));
    put(n("nav-cta", "paragraph", "Contratar"));
    put(n("label-work", "paragraph", "Trabajos seleccionados"));
    put(n("label-about", "paragraph", "Sobre mí"));
    put(n("label-press", "paragraph", "Prensa"));
    put(n("label-contact", "paragraph", "Contacto"));
    put(n("work-all-label", "paragraph", "Todos los proyectos"));
    put(n("hero-avail", "paragraph", "Disponible para encargos"));
    put(n("quote-eyebrow", "paragraph", "Sobre el oficio"));
    put(n("about-heading", "heading", "Una carrera basada en<br/><em>la paciencia</em>"));
    put(n("contact-heading", "heading", "Creemos<br/><em>algo juntos.</em>"));
    put(n("contact-body", "paragraph", "Para encargos editoriales, consultas de exposiciones y propuestas de proyectos de largo plazo."));
    put(n("contact-d2-label", "paragraph", "Reservas"));
    put(n("contact-d3-label", "paragraph", "Agente"));
    put(n("stat-1-label", "paragraph", "Años"));
    put(n("stat-2-label", "paragraph", "Proyectos"));
    put(n("stat-3-label", "paragraph", "Ciudades"));
  }

  /* Identity overrides (only when provided) */
  if (id.first || id.last) {
    put(n("nav-logo", "logo", esc(initials(id))));
    const head = id.last ? `${esc(id.first)}<br/><em>${esc(id.last)}</em>` : esc(id.first);
    put(n("hero-heading", "heading", head));
    put(n("footer-copyright", "paragraph", `© ${year} ${esc(name)}`));
  }
  const eyebrow = (es ? "Fotografía" : "Photography") + (id.location ? ` · ${esc(id.location)}` : "");
  put(n("hero-eyebrow", "paragraph", eyebrow));
  if (id.bio) {
    put(n("hero-sub", "paragraph", esc(id.bio)));
    put(n("about-body-1", "paragraph", esc(id.bio)));
  }
  if (id.location) put(n("about-caption", "paragraph", esc(id.location)));

  return out;
}
