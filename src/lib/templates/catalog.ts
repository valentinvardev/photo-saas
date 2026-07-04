import type { TemplateId } from "~/lib/editor/templates/registry";

/**
 * Canonical catalog of the portfolio templates a user can actually create.
 * Single source of truth for the onboarding template step and the
 * portfolio-creation wizard — every entry maps to a real editor template
 * (registry id) plus the static demo page used for live previews.
 */
export type CatalogTemplate = {
  /** Real editor template id — what editorState.templateId stores. */
  id: TemplateId;
  /** Display name; also persisted as Portfolio.template. */
  name: string;
  /** i18n stem: name/desc resolve via `onb.template.${i18nKey}Name|Desc`. */
  i18nKey: "minimal" | "atelier" | "halcyon";
  /** Static demo page rendered inside preview iframes (`?lang=` aware). */
  demoUrl: string;
  /** Brand palette shown as swatches on the catalog cards. */
  palette: { bg: string; fg: string; accent: string; muted: string };
  /** Headline font family, shown as the card specimen. */
  serif: string;
};

export const TEMPLATE_CATALOG: CatalogTemplate[] = [
  {
    id: "minimal-bw",
    name: "Minimal BW",
    i18nKey: "minimal",
    demoUrl: "/templates/minimal-bw",
    palette: { bg: "#fafafa", fg: "#0a0a0a", accent: "#0a0a0a", muted: "#a8a8a8" },
    serif: "'Cormorant Garamond', Georgia, serif",
  },
  {
    id: "atelier",
    name: "Atelier",
    i18nKey: "atelier",
    demoUrl: "/template/atelier",
    palette: { bg: "#f3eee2", fg: "#2a2520", accent: "#c9a89a", muted: "#9c8e7a" },
    serif: "'Cormorant Garamond', Georgia, serif",
  },
  {
    id: "halcyon",
    name: "Halcyon",
    i18nKey: "halcyon",
    demoUrl: "/template/halcyon",
    palette: { bg: "#0E0D0B", fg: "#EFEAE0", accent: "#C2410C", muted: "#8A8378" },
    serif: "'Instrument Serif', Georgia, serif",
  },
];

export const DEFAULT_CATALOG_TEMPLATE = TEMPLATE_CATALOG[0]!;

export function catalogTemplate(id: string): CatalogTemplate {
  return TEMPLATE_CATALOG.find((t) => t.id === id) ?? DEFAULT_CATALOG_TEMPLATE;
}
