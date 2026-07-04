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
export type TemplateOption = { id: "minimal-bw" | "atelier" | "halcyon" | "meridian" | "vernissage" | "serenata"; variant: "minimal" | "atelier" | "halcyon" | "meridian" | "vernissage" | "serenata" };

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  { id: "minimal-bw", variant: "minimal" },
  { id: "atelier",    variant: "atelier" },
  { id: "halcyon",    variant: "halcyon" },
  { id: "meridian",   variant: "meridian" },
  { id: "vernissage", variant: "vernissage" },
  { id: "serenata",   variant: "serenata" },
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

/* Meridian — Spanish demo copy + identity overrides. */
export function buildMeridianNodes(locale: string, id: Identity, contact?: { email?: string; phone?: string }): Record<string, EditorNode> {
  const es = locale === "es";
  const out: Record<string, EditorNode> = {};
  const n = (nid: string, type: EditorNode["type"], content: string): void => { out[nid] = { id: nid, type, content }; };

  if (es) {
    n("mrd-nav-item-1",    "paragraph", "Trabajos");
    n("mrd-nav-item-2",    "paragraph", "Sobre mí");
    n("mrd-nav-item-3",    "paragraph", "Contacto");
    n("mrd-nav-cta",       "paragraph", "Reservar sesión");
    n("mrd-hero-eyebrow",  "paragraph", "Fotografía editorial y de autor");
    n("mrd-hero-title",    "heading",   "Cada cuadro,<br/><em>medido.</em>");
    n("mrd-hero-sub",      "paragraph", "Retratos, espacios y paisajes silenciosos — fotografiados con la paciencia de una sala de galería.");
    n("mrd-hero-meta",     "paragraph", "Desde 2014");
    n("mrd-hero-cta-1",    "paragraph", "Ver el trabajo");
    n("mrd-hero-cta-2",    "paragraph", "Sobre el estudio");
    n("mrd-hero-caption",  "paragraph", "Sala I — mañana");
    n("mrd-work-label",    "paragraph", "Trabajo seleccionado");
    n("mrd-work-intro",    "paragraph", "Una selección rotativa de encargos recientes y series personales.");
    n("mrd-serv-label",    "paragraph", "Servicios");
    n("mrd-serv-1-title",  "heading",   "Sesiones de retrato");
    n("mrd-serv-1-desc",   "paragraph", "En estudio o exteriores. De una hora a un día completo — con dirección incluida, sin apuros.");
    n("mrd-serv-2-title",  "heading",   "Editorial y marcas");
    n("mrd-serv-2-desc",   "paragraph", "Campañas, lookbooks e interiores para publicaciones y estudios que valoran la contención.");
    n("mrd-serv-3-title",  "heading",   "Bodas, en silencio");
    n("mrd-serv-3-desc",   "paragraph", "Un enfoque documental para ceremonias íntimas — sin listas de poses, sin interrupciones.");
    n("mrd-about-label",   "paragraph", "Sobre mí");
    n("mrd-about-heading", "heading",   "Luz, geometría<br/>y <em>tiempo suficiente.</em>");
    n("mrd-about-body",    "paragraph", "Fotografío como un curador cuelga una sala: despacio, y con un argumento. Diez años entre editorial, arquitectura y retrato me enseñaron que las imágenes más fuertes son las que dejás de recortar.");
    n("mrd-stat-1-label",  "paragraph", "Años");
    n("mrd-stat-2-label",  "paragraph", "Encargos");
    n("mrd-stat-3-label",  "paragraph", "Exposiciones");
    n("mrd-contact-label",   "paragraph", "Contacto");
    n("mrd-contact-heading", "heading",   "Encargá<br/><em>una serie.</em>");
    n("mrd-contact-body",    "paragraph", "Contame del proyecto — el lugar, las personas, la fecha límite. Respondo cada mensaje en menos de dos días.");
    n("mrd-contact-d1-label", "paragraph", "Estudio");
    n("mrd-contact-d2-label", "paragraph", "Teléfono");
    n("mrd-contact-d3-label", "paragraph", "Visitas");
  }

  if (id.first || id.last) {
    const year = new Date().getFullYear();
    const name = fullName(id);
    n("mrd-nav-brand",    "logo",      esc(name));
    n("mrd-footer-brand", "logo",      esc(name));
    n("mrd-footer-copy",  "paragraph", `© ${year} ${esc(name)}`);
  }
  if (id.location) n("mrd-hero-meta", "paragraph", (es ? "Desde 2014 · " : "Est. 2014 · ") + esc(id.location));
  if (id.bio) {
    n("mrd-hero-sub",   "paragraph", esc(id.bio));
    n("mrd-about-body", "paragraph", esc(id.bio));
  }
  if (contact?.email) n("mrd-contact-d1-value", "paragraph", esc(contact.email));
  if (contact?.phone) n("mrd-contact-d2-value", "paragraph", esc(contact.phone));
  if (id.location)    n("mrd-contact-d3-value", "paragraph", esc(id.location) + (es ? " — con cita previa" : " — by appointment"));

  return out;
}

/* Vernissage — Spanish demo copy + identity overrides. */
export function buildVernissageNodes(locale: string, id: Identity, contact?: { email?: string; phone?: string }): Record<string, EditorNode> {
  const es = locale === "es";
  const out: Record<string, EditorNode> = {};
  const n = (nid: string, type: EditorNode["type"], content: string): void => { out[nid] = { id: nid, type, content }; };

  if (es) {
    n("vrn-nav-item-1",    "paragraph", "Exposición");
    n("vrn-nav-item-2",    "paragraph", "Artista");
    n("vrn-nav-item-3",    "paragraph", "Contacto");
    n("vrn-nav-cta",       "paragraph", "Visita privada");
    n("vrn-hero-eyebrow",  "paragraph", "Exposición individual · Sala 1");
    n("vrn-hero-title",    "heading",   "Noche de<br/><em>inauguración</em>");
    n("vrn-hero-dates",    "paragraph", "12 sep · Puertas 19:00 — hasta tarde");
    n("vrn-hero-sub",      "paragraph", "Doce fotografías, colgadas por una noche. La sala está a oscuras, las obras iluminadas — recorrela y dejá que cada pieza tome la pared frente a vos.");
    n("vrn-hero-cta",      "paragraph", "Entrar a la galería");
    n("vrn-gallery-label", "paragraph", "La exposición");
    n("vrn-gallery-note",  "paragraph", "Texto de sala — deslizá o usá las flechas. Cada fotografía pasa al frente enmarcada, con su placa de museo; hacé clic en la pieza frontal para verla de cerca.");
    n("vrn-endwall-title", "heading",   "Fin de la exposición.<br/><em>Gracias por la visita.</em>");
    n("vrn-endwall-cta",   "paragraph", "Encargar al artista");
    n("vrn-about-label",   "paragraph", "El artista");
    n("vrn-about-heading", "heading",   "Colgar una sala es<br/><em>un argumento.</em>");
    n("vrn-about-body",    "paragraph", "Construyo exposiciones, no feeds. Cada serie se ordena como una sala — una pieza de apertura, una larga pared central, una imagen de cierre que te llevás a casa.");
    n("vrn-stat-1-label",  "paragraph", "Exposiciones");
    n("vrn-stat-2-label",  "paragraph", "Ciudades");
    n("vrn-stat-3-label",  "paragraph", "Obras colocadas");
    n("vrn-contact-label",   "paragraph", "Contacto");
    n("vrn-contact-heading", "heading",   "Solicitá una<br/><em>visita privada.</em>");
    n("vrn-contact-body",    "paragraph", "Para encargos, venta de copias y préstamos de exposición. Contame qué paredes tenés en mente.");
    n("vrn-contact-d1-label", "paragraph", "Estudio");
    n("vrn-contact-d2-label", "paragraph", "Teléfono");
    n("vrn-contact-d3-label", "paragraph", "Galería");
  }

  if (id.first || id.last) {
    const year = new Date().getFullYear();
    const name = fullName(id);
    n("vrn-nav-brand",    "logo",      esc(name.toUpperCase()));
    n("vrn-footer-brand", "logo",      esc(name.toUpperCase()));
    n("vrn-footer-copy",  "paragraph", `© ${year} ${esc(name)}${es ? " — todas las obras" : " — all works"}`);
  }
  if (id.bio) n("vrn-about-body", "paragraph", esc(id.bio));
  if (contact?.email) n("vrn-contact-d1-value", "paragraph", esc(contact.email));
  if (contact?.phone) n("vrn-contact-d2-value", "paragraph", esc(contact.phone));
  if (id.location)    n("vrn-contact-d3-value", "paragraph", esc(id.location) + (es ? " — con cita previa" : " — by appointment"));

  return out;
}

/* Serenata — Spanish demo copy + identity overrides. */
export function buildSerenataNodes(locale: string, id: Identity, contact?: { email?: string; phone?: string }): Record<string, EditorNode> {
  const es = locale === "es";
  const out: Record<string, EditorNode> = {};
  const n = (nid: string, type: EditorNode["type"], content: string): void => { out[nid] = { id: nid, type, content }; };

  if (es) {
    n("ser-nav-item-1",   "paragraph", "El álbum");
    n("ser-nav-item-2",   "paragraph", "Sobre mí");
    n("ser-nav-item-3",   "paragraph", "Contacto");
    n("ser-nav-cta",      "paragraph", "Consultá tu fecha");
    n("ser-hero-eyebrow", "paragraph", "Fotografía de bodas · a donde el amor vaya");
    n("ser-hero-title",   "heading",   "Tu día,<br/><em>contado despacio.</em>");
    n("ser-hero-sub",     "paragraph", "Sin poses rígidas ni listas de fotos gritadas por el jardín. Fotografío lo de en medio — las manos, la risa, la abuela que bailó primero.");
    n("ser-hero-cta-1",   "paragraph", "Abrir el álbum");
    n("ser-hero-cta-2",   "paragraph", "Consultá tu fecha");
    n("ser-album-label",  "paragraph", "El álbum");
    n("ser-album-note",   "paragraph", "Una boda real, de principio a fin — pasá las páginas como las pasarán sus familias, un domingo, dentro de muchos años.");
    n("ser-album-dedication", "paragraph", "Para los que lloraron primero,<br/>y los que se quedaron hasta que se encendieron las luces.");
    n("ser-mom-label",    "paragraph", "El día");
    n("ser-mom-1-title",  "heading",   "Los preparativos");
    n("ser-mom-1-desc",   "paragraph", "Las horas tranquilas — botones, cartas, respiraciones profundas. Llego temprano y desaparezco entre ustedes.");
    n("ser-mom-2-title",  "heading",   "La ceremonia");
    n("ser-mom-2-desc",   "paragraph", "Trabajo desde los bordes, en silencio. No vas a recordar que estuve; vas a recordar todo lo demás.");
    n("ser-mom-3-title",  "heading",   "La fiesta");
    n("ser-mom-3-desc",   "paragraph", "Flash encendido, zapatos fuera. Acá el álbum se gana sus últimas y más ruidosas páginas.");
    n("ser-quote-label",  "paragraph", "Palabras bonitas");
    n("ser-quote-text",   "paragraph", "“Nos olvidamos de que estaba — y de alguna manera estaba en todas partes. Nuestro álbum termina con mi papá riéndose hasta llorar. Esa foto vale toda la boda.”");
    n("ser-quote-author", "paragraph", "— Carla y Julián, casados en Mendoza");
    n("ser-about-label",  "paragraph", "La fotógrafa");
    n("ser-about-heading","heading",   "Fotografío bodas<br/>como <em>cartas de amor.</em>");
    n("ser-about-body",   "paragraph", "Nueve años, ciento cuarenta bodas, y todavía lloro en los votos. Mis parejas quieren fotos honestas — color suave de película, luz real, y un álbum que se lea como se sintió el día.");
    n("ser-stat-1-label", "paragraph", "Bodas");
    n("ser-stat-2-label", "paragraph", "Años");
    n("ser-stat-3-label", "paragraph", "Países");
    n("ser-contact-label",   "paragraph", "Tu fecha");
    n("ser-contact-heading", "heading",   "Contame sobre<br/><em>tu día.</em>");
    n("ser-contact-body",    "paragraph", "La fecha, el lugar, cómo se conocieron — lo que sientan importante. Tomo pocas bodas por año, así que escribí temprano.");
    n("ser-contact-d1-label", "paragraph", "Email");
    n("ser-contact-d2-label", "paragraph", "Teléfono");
    n("ser-contact-d3-label", "paragraph", "Base en");
    n("ser-footer-copy",  "paragraph", "© 2025 — con amor");
  }

  if (id.first || id.last) {
    const year = new Date().getFullYear();
    const name = fullName(id);
    n("ser-nav-brand",    "logo",      esc(name));
    n("ser-footer-brand", "logo",      esc(name));
    n("ser-footer-copy",  "paragraph", `© ${year} ${esc(name)}${es ? " — con amor" : " — with love"}`);
  }
  if (id.bio) n("ser-about-body", "paragraph", esc(id.bio));
  if (contact?.email) n("ser-contact-d1-value", "paragraph", esc(contact.email));
  if (contact?.phone) n("ser-contact-d2-value", "paragraph", esc(contact.phone));
  if (id.location)    n("ser-contact-d3-value", "paragraph", esc(id.location) + (es ? " — viajo a donde haga falta" : " — travelling worldwide"));

  return out;
}
