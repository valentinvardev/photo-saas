import dynamic from "next/dynamic";
import type { Viewport } from "../types";
import type { TemplateDef } from "./types";
import { MINIMAL_BW_NODES, MINIMAL_BW_SECTIONS } from "./minimal-bw";
import { ATELIER_NODES, ATELIER_SECTIONS } from "./atelier";

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
};

export type TemplateId = keyof typeof TEMPLATES;
export const DEFAULT_TEMPLATE_ID: TemplateId = "minimal-bw";
