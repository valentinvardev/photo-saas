import dynamic from "next/dynamic";
import type { Viewport } from "../types";
import type { TemplateDef } from "./types";
import { MINIMAL_BW_NODES, MINIMAL_BW_SECTIONS } from "./minimal-bw";
import { ATELIER_NODES, ATELIER_SECTIONS } from "./atelier";
import { HALCYON_NODES, HALCYON_SECTIONS } from "./halcyon";
import { DEFAULT_LOGO } from "../types";

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
       panel can then change any of them. Typography uses fonts already loaded
       in the editor (Instrument Serif / Geist aren't bundled) that match the
       warm-editorial character. */
    defaultPalette: { bg: "#0E0D0B", fg: "#EFEAE0", accent: "#C2410C", muted: "#8A8378" },
    defaultTypography: {
      serif: "'Fraunces', Georgia, serif",
      sans:  "'Inter', system-ui, sans-serif",
      mono:  "'JetBrains Mono', monospace",
    },
    defaultLogo: { ...DEFAULT_LOGO, text: "Halcyon" },
  },
};

export type TemplateId = keyof typeof TEMPLATES;
export const DEFAULT_TEMPLATE_ID: TemplateId = "minimal-bw";
