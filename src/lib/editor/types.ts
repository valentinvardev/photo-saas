export type NodeType =
  | "heading"
  | "paragraph"
  | "image"
  | "nav-logo"
  | "nav-link"
  | "button";

export interface EditorNode {
  id: string;
  type: NodeType;
  /** HTML content for text nodes */
  content?: string;
  /** Image src for image nodes */
  src?: string;
  /** Alt text for image nodes */
  alt?: string;
}

export interface ColorPalette {
  bg: string;
  fg: string;
  accent: string;
  muted: string;
}

export interface EditorState {
  nodes: Record<string, EditorNode>;
  palette: ColorPalette;
  selectedId: string | null;
  editingId: string | null;
}

export const DEFAULT_PALETTE: ColorPalette = {
  bg: "#ffffff",
  fg: "#0a0a0a",
  accent: "#0a0a0a",
  muted: "#6b7280",
};
