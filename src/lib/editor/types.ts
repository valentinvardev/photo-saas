export type NodeType =
  | "heading"
  | "paragraph"
  | "image"
  | "nav-logo"
  | "nav-link"
  | "button";

export type Viewport = "mobile" | "tablet" | "desktop";

export interface EditorNode {
  id: string;
  type: NodeType;
  content?: string;
  src?: string;
  alt?: string;
}

export interface ColorPalette {
  bg: string;
  fg: string;
  accent: string;
  muted: string;
}

export interface Typography {
  serif: string;
  sans: string;
  mono: string;
}

export interface EditorState {
  nodes: Record<string, EditorNode>;
  palette: ColorPalette;
  typography: Typography;
  selectedId: string | null;
  editingId: string | null;
  viewport: Viewport;
  selectedSection: string | null;
  hoveredSection: string | null;
}

export const DEFAULT_PALETTE: ColorPalette = {
  bg:     "#fafafa",
  fg:     "#0a0a0a",
  accent: "#0a0a0a",
  muted:  "#6b7280",
};

export const DEFAULT_TYPOGRAPHY: Typography = {
  serif: "'Cormorant Garamond', Georgia, serif",
  sans:  "'DM Sans', system-ui, sans-serif",
  mono:  "'Space Mono', monospace",
};
