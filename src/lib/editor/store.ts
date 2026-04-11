"use client";

import { create } from "zustand";
import { temporal } from "zundo";
import type { EditorNode, EditorState, ColorPalette, Typography, Viewport, LogoSettings } from "./types";
import { DEFAULT_PALETTE, DEFAULT_TYPOGRAPHY, DEFAULT_LOGO } from "./types";

const INITIAL_NODES: Record<string, EditorNode> = {
  /* Navigation */
  "nav-logo":         { id: "nav-logo",         type: "logo",      content: "J·H" },

  /* Hero */
  "hero-heading":     { id: "hero-heading",     type: "heading",   content: "James<br/><em>Hollis</em>" },
  "hero-sub":         { id: "hero-sub",         type: "paragraph", content: "Documenting the quiet tension between presence and absence. Work exhibited across North America and Europe." },
  "hero-avail":       { id: "hero-avail",       type: "paragraph", content: "Available for commissions — Q4 2025" },
  "hero-image-1":     { id: "hero-image-1",     type: "image",     src: "https://picsum.photos/seed/201/900/1100?grayscale", alt: "" },
  "hero-image-2":     { id: "hero-image-2",     type: "image",     src: "https://picsum.photos/seed/202/900/700?grayscale",  alt: "" },

  /* Quote */
  "quote-text":       { id: "quote-text",       type: "paragraph", content: "\u201cThe camera is an instrument that teaches people how to see without a camera.\u201d" },
  "quote-author":     { id: "quote-author",     type: "paragraph", content: "— Dorothea Lange" },

  /* About */
  "about-heading":    { id: "about-heading",    type: "heading",   content: "A career built on<br/><em>patience</em>" },
  "about-body-1":     { id: "about-body-1",     type: "paragraph", content: "James Hollis is a New York-based documentary and portrait photographer with over a decade of work spanning editorial commissions, personal projects, and exhibition photography." },
  "about-body-2":     { id: "about-body-2",     type: "paragraph", content: "His long-form projects explore the intersection of memory, geography, and identity — often through extended collaborations with communities in transition." },
  "about-image":      { id: "about-image",      type: "image",     src: "https://picsum.photos/seed/1084/600/750?grayscale", alt: "James Hollis" },
  "about-caption":    { id: "about-caption",    type: "paragraph", content: "Brooklyn, NY · 2024" },
  "stat-1-value":     { id: "stat-1-value",     type: "paragraph", content: "14"   },
  "stat-1-label":     { id: "stat-1-label",     type: "paragraph", content: "Years" },
  "stat-2-value":     { id: "stat-2-value",     type: "paragraph", content: "280+" },
  "stat-2-label":     { id: "stat-2-label",     type: "paragraph", content: "Projects" },
  "stat-3-value":     { id: "stat-3-value",     type: "paragraph", content: "9"    },
  "stat-3-label":     { id: "stat-3-label",     type: "paragraph", content: "Cities" },

  /* Press */
  "press-1":          { id: "press-1",          type: "paragraph", content: "The New Yorker" },
  "press-1-year":     { id: "press-1-year",     type: "paragraph", content: "2023" },
  "press-2":          { id: "press-2",          type: "paragraph", content: "Aperture" },
  "press-2-year":     { id: "press-2-year",     type: "paragraph", content: "2022" },
  "press-3":          { id: "press-3",          type: "paragraph", content: "Foam Magazine" },
  "press-3-year":     { id: "press-3-year",     type: "paragraph", content: "2022" },
  "press-4":          { id: "press-4",          type: "paragraph", content: "Zeit Magazin" },
  "press-4-year":     { id: "press-4-year",     type: "paragraph", content: "2021" },
  "press-5":          { id: "press-5",          type: "paragraph", content: "LensCulture" },
  "press-5-year":     { id: "press-5-year",     type: "paragraph", content: "2020" },

  /* Contact */
  "contact-heading":  { id: "contact-heading",  type: "heading",   content: "Let\u2019s create<br/><em>something.</em>" },
  "contact-body":     { id: "contact-body",     type: "paragraph", content: "For editorial commissions, exhibition inquiries, and long-form project proposals." },

  /* Footer */
  "footer-copyright": { id: "footer-copyright", type: "paragraph", content: "\u00a9 2025 James Hollis Photography" },
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
