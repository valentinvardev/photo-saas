import type { EditorNode, Viewport } from "../types";

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
}
