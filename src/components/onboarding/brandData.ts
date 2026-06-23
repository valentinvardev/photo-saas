import type { ColorPalette, Typography, EditorNode } from "~/lib/editor/types";
import type { PortfolioContent } from "~/lib/portfolio/data";

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
export type TemplateOption = { id: "minimal-bw" | "atelier" | "halcyon"; variant: "minimal" | "atelier" | "halcyon" };

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  { id: "minimal-bw", variant: "minimal" },
  { id: "atelier",    variant: "atelier" },
  { id: "halcyon",    variant: "halcyon" },
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

/* ── Content the user uploads during onboarding (photos + folders) ── */
export type OnbFolder = { id: string; name: string };
export type OnbPhoto = { id: string; url: string; filename: string; folderId: string | null };

/* Assemble the uploaded photos/folders into the portfolio content tree the
   editor + public render expect (one "Work" category holding loose photos and
   the user's folders). */
export function buildOnboardingContent(locale: string, folders: OnbFolder[], photos: OnbPhoto[]): PortfolioContent {
  const catId = "cat-work";
  const directPhotoIds = photos.filter((p) => !p.folderId).map((p) => p.id);
  const photosRec: PortfolioContent["photos"] = {};
  for (const p of photos) photosRec[p.id] = { id: p.id, src: p.url, visibility: "public" };
  const foldersRec: PortfolioContent["folders"] = {};
  for (const f of folders) {
    foldersRec[f.id] = { id: f.id, title: f.name, photoIds: photos.filter((p) => p.folderId === f.id).map((p) => p.id), visibility: "public" };
  }
  return {
    categoryIds: [catId],
    categories: { [catId]: { id: catId, name: locale === "es" ? "Trabajos" : "Work", slug: "work", folderIds: folders.map((f) => f.id), directPhotoIds, visibility: "public" } },
    folders: foldersRec,
    photos: photosRec,
  };
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Build the per-node overrides that seed a fresh minimal-bw portfolio with the
   user's identity — and, when locale is Spanish, Spanish default copy so the
   template itself reads in Spanish. Merged over the template defaults. */
export function buildMinimalNodes(locale: string, id: Identity, logoText?: string, contact?: { email?: string; phone?: string }, avatarUrl?: string): Record<string, EditorNode> {
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
    /* Demo bio — shown when the user hasn't entered their bio yet.
       The if(id.bio) block further below will override these with the real bio. */
    put(n("hero-sub",    "paragraph", "Documentando la tensión silenciosa entre la presencia y la ausencia. Trabajo exhibido en América del Norte y Europa."));
    put(n("about-body-1","paragraph", "James Hollis es un fotógrafo documental y de retrato radicado en Nueva York, con más de una década de trabajo en encargos editoriales, proyectos personales y fotografía de exposición."));
    put(n("about-body-2","paragraph", "Sus proyectos de largo plazo exploran la intersección entre la memoria, la geografía y la identidad — a menudo a través de colaboraciones con comunidades en transición."));
    put(n("quote-text",  "paragraph", "“La cámara es un instrumento que enseña a las personas a ver sin una cámara.”"));
  }

  /* Identity overrides (only when provided) */
  if (id.first || id.last) {
    put(n("nav-logo", "logo", esc(initials(id))));
    const head = id.last ? `${esc(id.first)}<br/><em>${esc(id.last)}</em>` : esc(id.first);
    put(n("hero-heading", "heading", head));
    put(n("footer-copyright", "paragraph", `© ${year} ${esc(name)}`));
  }
  // Custom logo wordmark overrides the initials.
  if (logoText && logoText.trim()) put(n("nav-logo", "logo", esc(logoText.trim())));
  const eyebrow = (es ? "Fotografía" : "Photography") + (id.location ? ` · ${esc(id.location)}` : "");
  put(n("hero-eyebrow", "paragraph", eyebrow));
  if (id.bio) {
    put(n("hero-sub", "paragraph", esc(id.bio)));
    put(n("about-body-1", "paragraph", esc(id.bio)));
  }
  if (id.location) put(n("about-caption", "paragraph", esc(id.location)));
  // Profile photo → the About portrait.
  if (avatarUrl) out["about-image"] = { id: "about-image", type: "image", src: avatarUrl };

  // Contact details — seed from the collected email + WhatsApp phone, hiding
  // any unused slots so the template's demo addresses don't linger.
  const details: { label: string; value: string }[] = [];
  if (contact?.email?.trim()) details.push({ label: es ? "Correo" : "Email", value: contact.email.trim() });
  if (contact?.phone?.trim()) details.push({ label: "WhatsApp", value: contact.phone.trim() });
  if (details.length > 0) {
    for (let i = 0; i < 3; i++) {
      const idx = i + 1;
      const d = details[i];
      if (d) {
        put(n(`contact-d${idx}-label`, "paragraph", esc(d.label)));
        put(n(`contact-d${idx}-value`, "paragraph", esc(d.value)));
      } else {
        out[`contact-d${idx}-label`] = { id: `contact-d${idx}-label`, type: "paragraph", hidden: true };
        out[`contact-d${idx}-value`] = { id: `contact-d${idx}-value`, type: "paragraph", hidden: true };
      }
    }
  }

  return out;
}

/* Locale-aware default nodes for the Atelier template. */
export function buildAtelierNodes(locale: string, id: Identity): Record<string, EditorNode> {
  const es = locale === "es";
  const out: Record<string, EditorNode> = {};
  const n = (nid: string, type: EditorNode["type"], content: string): void => { out[nid] = { id: nid, type, content }; };

  if (es) {
    n("atl-hero-eyebrow",  "paragraph", "Una celebración en movimiento · 247 fotografías");
    n("atl-hero-subtitle", "paragraph", "Un fin de semana en los jardines de Buenos Aires, capturado al ritmo más lento.");
    n("atl-hero-caption",  "paragraph", "Placa 01 · La portada");
    n("atl-hero-date",     "paragraph", "14 de abril de 2026");
    n("atl-coll-title",    "heading",   "La colección");
    n("atl-coll-meta",     "paragraph", "247 fotografías · curadas a mano");
    n("atl-quote-text",    "paragraph", "“La tarde más lenta y más hermosa. Cada momento ya parecía un recuerdo.”");
    n("atl-close-eyebrow", "paragraph", "III · Una nota");
    n("atl-close-heading", "heading",   "Gracias por dejarnos estar allí.");
    n("atl-close-body",    "paragraph", "Tu galería es tuya para siempre. Descarga la colección completa en alta resolución, comparte imágenes con quien quieras o imprime directamente desde el estudio.");
    n("atl-close-cta-1",   "paragraph", "Descargar todo");
    n("atl-close-cta-2",   "paragraph", "Pedir impresiones");
  }

  if (id.first || id.last) {
    const year = new Date().getFullYear();
    const name = fullName(id);
    n("atl-nav-brand",    "logo",      esc(name || "Atelier"));
    n("atl-hero-title",   "heading",   esc(id.first) + (id.last ? ` <em>&amp;</em> ${esc(id.last)}` : ""));
    n("atl-footer-brand", "paragraph", esc(name));
    n("atl-footer-copy",  "paragraph", `© ${year}${id.location ? " · " + esc(id.location) : ""}`);
    n("atl-nav-subtitle", "paragraph", esc(name) + (es ? " · Abr 2026" : " · Apr 2026"));
  }

  return out;
}

/* Locale-aware default nodes for the Halcyon template. */
export function buildHalcyonNodes(locale: string, id: Identity): Record<string, EditorNode> {
  const es = locale === "es";
  const out: Record<string, EditorNode> = {};
  const n = (nid: string, type: EditorNode["type"], content: string): void => { out[nid] = { id: nid, type, content }; };

  if (es) {
    n("hl-cover-title",      "heading",   "La luz<br/>sigue <em>llegando.</em>");
    n("hl-work-label",       "paragraph", "Trabajo Seleccionado");
    n("hl-viewall",          "paragraph", "Ver todos los trabajos");
    n("hl-archive-eyebrow",  "paragraph", "Explorar el archivo completo");
    n("hl-archive-title",    "heading",   "Cada <em>fotografía,</em><br/>en una sola sala.");
    n("hl-archive-sub",      "paragraph", "Doce años de bodas, editoriales y habitaciones silenciosas — reunidas aquí. Abre el archivo y explora.");
    n("hl-archive-cta",      "paragraph", "Abrir el archivo");
    n("hl-about-label",      "paragraph", "Sobre mí");
    n("hl-about-heading",    "heading",   "Imágenes para <em>quedarse,</em><br/>no para deslizar.");
    n("hl-about-cta",        "paragraph", "Contacto");
    n("hl-contact-eyebrow",  "paragraph", "Disponible para comisiones 2025");
    n("hl-contact-heading",  "heading",   "Inicia una <em>conversación.</em>");
    n("hl-contact-tag",      "paragraph", "Cuéntame sobre el día, el lugar, las personas. El mejor trabajo siempre empieza con una carta larga y una respuesta pausada.");
    n("hl-footer-copy",      "paragraph", "© 2024 · Todas las fotografías © Lior Avni");
  }

  if (id.first || id.last) {
    const name = fullName(id);
    n("hl-mark-name", "logo",      esc(name || "Halcyon"));
    n("hl-mark-sub",  "paragraph", es ? "Estudio · Fotografía" : "Studio · Photography");
    if (id.bio) n("hl-about-bio", "paragraph", esc(id.bio));
    if (id.location) n("hl-mark-sub", "paragraph", (es ? "Estudio · " : "Studio · ") + esc(id.location));
  }

  return out;
}
