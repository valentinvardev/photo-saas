import type { EditorNode, Viewport, ColorPalette, Typography, ButtonStyle, LogoSettings } from "../types";

export interface SectionElement {
  nodeId: string;
  label: string;
  type: "text" | "image";
}

export interface SectionDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  locked: boolean;
  elements: SectionElement[];
}

export interface TemplateDef {
  id: string;
  name: string;
  initialNodes: Record<string, EditorNode>;
  sections: SectionDef[];
  Component: React.ComponentType<{ viewport: Viewport }>;
  /* Per-template design defaults. When omitted the editor falls back to the
     global DEFAULT_* values. Used by dark/branded templates (e.g. Halcyon) so
     they open with their own palette + typography instead of the light default. */
  defaultPalette?:    ColorPalette;
  defaultTypography?: Typography;
  defaultButtons?:    ButtonStyle;
  defaultLogo?:       LogoSettings;
}
