"use client";

import { create } from "zustand";
import { temporal } from "zundo";
import type { EditorNode, EditorState, ColorPalette, Typography, Viewport, LogoSettings } from "./types";
import { DEFAULT_PALETTE, DEFAULT_TYPOGRAPHY, DEFAULT_LOGO } from "./types";

const INITIAL_NODES: Record<string, EditorNode> = {
  "nav-logo":        { id: "nav-logo",        type: "logo",      content: "J·H" },
  "hero-heading":    { id: "hero-heading",    type: "heading",   content: "James<br/><em>Hollis</em>" },
  "hero-sub":        { id: "hero-sub",        type: "paragraph", content: "Documenting the quiet tension between presence and absence. Work exhibited across North America and Europe." },
  "hero-avail":      { id: "hero-avail",      type: "paragraph", content: "Available for commissions — Q4 2025" },
  "about-heading":   { id: "about-heading",   type: "heading",   content: "A career built on<br/><em>patience</em>" },
  "about-body-1":    { id: "about-body-1",    type: "paragraph", content: "James Hollis is a New York-based documentary and portrait photographer with over a decade of work spanning editorial commissions, personal projects, and exhibition photography." },
  "about-body-2":    { id: "about-body-2",    type: "paragraph", content: "His long-form projects explore the intersection of memory, geography, and identity — often through extended collaborations with communities in transition." },
  "about-image":     { id: "about-image",     type: "image",     src: "https://picsum.photos/seed/1084/600/750?grayscale", alt: "James Hollis" },
  "quote-text":      { id: "quote-text",      type: "paragraph", content: "\u201cThe camera is an instrument that teaches people how to see without a camera.\u201d" },
  "quote-author":    { id: "quote-author",    type: "paragraph", content: "— Dorothea Lange" },
  "contact-heading": { id: "contact-heading", type: "heading",   content: "Let\u2019s create<br/><em>something.</em>" },
  "contact-body":    { id: "contact-body",    type: "paragraph", content: "For editorial commissions, exhibition inquiries, and long-form project proposals." },
};

interface EditorStore extends EditorState {
  selectNode:         (id: string | null) => void;
  setEditing:         (id: string | null) => void;
  setViewport:        (v: Viewport) => void;
  setSelectedSection: (id: string | null) => void;
  setHoveredSection:  (id: string | null) => void;
  updateNode:         (id: string, patch: Partial<EditorNode>) => void;
  setPalette:         (patch: Partial<ColorPalette>) => void;
  setTypography:      (patch: Partial<Typography>) => void;
  setLogo:            (patch: Partial<LogoSettings>) => void;
  hideSection:        (id: string) => void;
  showSection:        (id: string) => void;
  reset:              () => void;
}

export const useEditorStore = create<EditorStore>()(
  temporal(
    (set) => ({
      nodes:           INITIAL_NODES,
      palette:         DEFAULT_PALETTE,
      typography:      DEFAULT_TYPOGRAPHY,
      logo:            DEFAULT_LOGO,
      selectedId:      null,
      editingId:       null,
      viewport:        "desktop",
      selectedSection: null,
      hoveredSection:  null,
      hiddenSections:  [],

      selectNode:    (id) => set({ selectedId: id, editingId: null }),
      setEditing:    (id) => set({ editingId: id }),
      setViewport:   (v)  => set({ viewport: v, selectedSection: null }),
      setSelectedSection: (id) => set({ selectedSection: id }),
      setHoveredSection:  (id) => set({ hoveredSection: id }),

      updateNode: (id, patch) =>
        set((s) => ({ nodes: { ...s.nodes, [id]: { ...s.nodes[id]!, ...patch } } })),

      setPalette: (patch) =>
        set((s) => ({ palette: { ...s.palette, ...patch } })),

      setTypography: (patch) =>
        set((s) => ({ typography: { ...s.typography, ...patch } })),

      setLogo: (patch) =>
        set((s) => ({ logo: { ...s.logo, ...patch } })),

      hideSection: (id) =>
        set((s) => ({ hiddenSections: [...s.hiddenSections.filter((x) => x !== id), id] })),

      showSection: (id) =>
        set((s) => ({ hiddenSections: s.hiddenSections.filter((x) => x !== id) })),

      reset: () =>
        set({
          nodes: INITIAL_NODES, palette: DEFAULT_PALETTE, typography: DEFAULT_TYPOGRAPHY,
          logo: DEFAULT_LOGO, selectedId: null, editingId: null,
          viewport: "desktop", selectedSection: null, hiddenSections: [],
        }),
    }),
    {
      partialize: (s) => ({
        nodes: s.nodes, palette: s.palette, typography: s.typography,
        logo: s.logo, hiddenSections: s.hiddenSections,
      }),
    }
  )
);

export type { EditorStore };
