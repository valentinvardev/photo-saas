import dynamic from "next/dynamic";
import type { Viewport } from "../types";
import type { TemplateDef } from "./types";
import { MINIMAL_BW_NODES, MINIMAL_BW_SECTIONS } from "./minimal-bw";
import { ATELIER_NODES, ATELIER_SECTIONS } from "./atelier";
import { HALCYON_NODES, HALCYON_SECTIONS } from "./halcyon";
import { MERIDIAN_NODES, MERIDIAN_SECTIONS } from "./meridian";
import { VERNISSAGE_NODES, VERNISSAGE_SECTIONS } from "./vernissage";
import { SERENATA_NODES, SERENATA_SECTIONS } from "./serenata";
import { DEFAULT_LOGO, DEFAULT_GRID } from "../types";

/* Lazy-loaded canvas components — kept out of the registry's import graph
   so the editor only loads the template it actually renders. */
const MinimalBWComponent = dynamic<{ viewport: Viewport }>(
  () => import("~/components/editor/canvas/EditableTemplate").then((m) => m.EditableTemplate),
  { ssr: false }
);
const AtelierComponent = dynamic<{ viewport: Viewport }>(
  () => import("~/components/editor/canvas/AtelierTemplate").then((m) => m.AtelierTemplate),
  { ssr: false }
);
const HalcyonComponent = dynamic<{ viewport: Viewport }>(
  () => import("~/components/editor/canvas/HalcyonTemplate").then((m) => m.HalcyonTemplate),
  { ssr: false }
);
const MeridianComponent = dynamic<{ viewport: Viewport }>(
  () => import("~/components/editor/canvas/MeridianTemplate").then((m) => m.MeridianTemplate),
  { ssr: false }
);
const VernissageComponent = dynamic<{ viewport: Viewport }>(
  () => import("~/components/editor/canvas/VernissageTemplate").then((m) => m.VernissageTemplate),
  { ssr: false }
);
const SerenataComponent = dynamic<{ viewport: Viewport }>(
  () => import("~/components/editor/canvas/SerenataTemplate").then((m) => m.SerenataTemplate),
  { ssr: false }
);

export const TEMPLATES: Record<string, TemplateDef> = {
  "minimal-bw": {
    id: "minimal-bw",
    name: "Minimal BW",
    initialNodes: MINIMAL_BW_NODES,
    sections: MINIMAL_BW_SECTIONS,
    Component: MinimalBWComponent,
  },
  "atelier": {
    id: "atelier",
    name: "Atelier",
    initialNodes: ATELIER_NODES,
    sections: ATELIER_SECTIONS,
    Component: AtelierComponent,
  },
  "halcyon": {
    id: "halcyon",
    name: "Halcyon",
    initialNodes: HALCYON_NODES,
    sections: HALCYON_SECTIONS,
    Component: HalcyonComponent,
    /* Halcyon is a warm-dark editorial template — it opens with its own dark
       palette + typography rather than the global light defaults. The Design
       panel can then change any of them. */
    defaultPalette: { bg: "#0E0D0B", fg: "#EFEAE0", accent: "#C2410C", muted: "#8A8378" },
    defaultTypography: {
      serif: "'Instrument Serif', Georgia, serif",
      sans:  "'Geist', system-ui, sans-serif",
      mono:  "'Geist Mono', monospace",
    },
    defaultLogo: { ...DEFAULT_LOGO, text: "Halcyon" },
    /* Halcyon's signature is the typographic project index; it also supports the
       shared photo grids so the work section is consistent with Minimal BW. */
    defaultGrid: { ...DEFAULT_GRID, layout: "index" },
    layouts: ["index", "mosaic", "uniform", "masonry"],
  },
  "meridian": {
    id: "meridian",
    name: "Meridian",
    initialNodes: MERIDIAN_NODES,
    sections: MERIDIAN_SECTIONS,
    Component: MeridianComponent,
    /* Meridian is a cool gallery/museum template — plaster background, ink
       text, deep steel-blue accent. See docs/templates/meridian.md. */
    defaultPalette: { bg: "#F4F2ED", fg: "#16181B", accent: "#2E4E6B", muted: "#8B8E93" },
    defaultTypography: {
      serif: "'Playfair Display', Georgia, serif",
      sans:  "'Manrope', system-ui, sans-serif",
      mono:  "'IBM Plex Mono', monospace",
    },
    defaultLogo: { ...DEFAULT_LOGO, text: "Meridian" },
    /* Gallery hang: an even grid with generous spacing is the signature. */
    defaultGrid: { ...DEFAULT_GRID, layout: "uniform", columns: 3, gap: 14 },
    layouts: ["uniform", "mosaic", "masonry"],
  },
  "vernissage": {
    id: "vernissage",
    name: "Vernissage",
    initialNodes: VERNISSAGE_NODES,
    sections: VERNISSAGE_SECTIONS,
    Component: VernissageComponent,
    /* Vernissage is the white-cube 3D exhibition — a coverflow showcase where
       the active photo faces the visitor. See docs/templates/vernissage.md. */
    defaultPalette: { bg: "#F6F5F1", fg: "#131518", accent: "#A63A22", muted: "#90928F" },
    defaultTypography: {
      serif: "'Fraunces', Georgia, serif",
      sans:  "'Space Grotesk', system-ui, sans-serif",
      mono:  "'Space Mono', monospace",
    },
    defaultLogo: { ...DEFAULT_LOGO, text: "VERNISSAGE" },
    defaultGrid: { ...DEFAULT_GRID, layout: "corridor", columns: 3, gap: 12 },
    layouts: ["corridor", "uniform", "masonry"],
  },
  "serenata": {
    id: "serenata",
    name: "Serenata",
    initialNodes: SERENATA_NODES,
    sections: SERENATA_SECTIONS,
    Component: SerenataComponent,
    /* Serenata is the wedding template — ivory, rosewood and a 3D wedding
       album that turns its pages. See docs/templates/serenata.md. */
    defaultPalette: { bg: "#FBF7F2", fg: "#40342F", accent: "#B07C70", muted: "#A5988E" },
    defaultTypography: {
      serif: "'Cormorant Garamond', Georgia, serif",
      sans:  "'Raleway', system-ui, sans-serif",
      mono:  "'Courier Prime', monospace",
    },
    defaultLogo: { ...DEFAULT_LOGO, text: "Serenata" },
    defaultGrid: { ...DEFAULT_GRID, layout: "corridor", columns: 3, gap: 12 },
    layouts: ["corridor", "uniform", "masonry"],
  },
};

export type TemplateId = keyof typeof TEMPLATES;
export const DEFAULT_TEMPLATE_ID: TemplateId = "minimal-bw";
