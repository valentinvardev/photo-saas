export type NodeType =
  | "heading"
  | "paragraph"
  | "image"
  | "logo"
  | "nav-link"
  | "button";

export type Viewport = "mobile" | "tablet" | "desktop";

export interface EditorNode {
  id: string;
  type: NodeType;
  content?: string;
  src?: string;
  alt?: string;
  hidden?: boolean;
  /* Text style overrides — applied on top of template defaults */
  fontSize?: string;
  fontWeight?: number | string;
  fontStyle?: "normal" | "italic";
  textAlign?: "left" | "center" | "right";
  /* Image style overrides */
  objectFit?: "cover" | "contain" | "fill" | "none";
  objectPosition?: string;
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

export interface LogoSettings {
  mode: "text" | "image" | "image+text";
  text: string;
  imageUrl: string;
  altImageUrl: string;
  faviconUrl: string;
  /* Image logo width in px — height is auto to preserve aspect ratio */
  width: number;
}

export interface EditorState {
  nodes: Record<string, EditorNode>;
  palette: ColorPalette;
  typography: Typography;
  logo: LogoSettings;
  selectedId: string | null;
  editingId: string | null;
  viewport: Viewport;
  selectedSection: string | null;
  hoveredSection: string | null;
  hiddenSections: string[];
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

export const DEFAULT_LOGO: LogoSettings = {
  mode:        "text",
  text:        "J·H",
  imageUrl:    "",
  altImageUrl: "",
  faviconUrl:  "",
  width:       32,
};
