"use client";

import { create } from "zustand";
import { temporal } from "zundo";
import type { EditorNode, EditorState, ColorPalette, Typography, ButtonStyle, Viewport, LogoSettings } from "./types";
import { DEFAULT_PALETTE, DEFAULT_TYPOGRAPHY, DEFAULT_BUTTONS, DEFAULT_LOGO } from "./types";
import { TEMPLATES, DEFAULT_TEMPLATE_ID, type TemplateId } from "./templates/registry";

/** Serializable design saved per-portfolio (Portfolio.editorState). */
export interface PortfolioDesign {
  templateId?:     TemplateId;
  nodes?:          Record<string, EditorNode>;
  palette?:        ColorPalette;
  typography?:     Typography;
  buttons?:        ButtonStyle;
  logo?:           LogoSettings;
  hiddenSections?: string[];
}

interface EditorStore extends EditorState {
  templateId:         TemplateId;
  readOnly:           boolean;
  galleryPhotos:      { src: string; title?: string }[];
  setReadOnly:        (v: boolean) => void;
  setGalleryPhotos:   (p: { src: string; title?: string }[]) => void;
  hydrateDesign:      (design: PortfolioDesign) => void;
  setTemplate:        (id: TemplateId) => void;
  selectNode:         (id: string | null) => void;
  setEditing:         (id: string | null) => void;
  setViewport:        (v: Viewport) => void;
  setSelectedSection: (id: string | null) => void;
  setHoveredSection:  (id: string | null) => void;
  updateNode:         (id: string, patch: Partial<EditorNode>) => void;
  setPalette:         (patch: Partial<ColorPalette>) => void;
  setTypography:      (patch: Partial<Typography>) => void;
  setButtons:         (patch: Partial<ButtonStyle>) => void;
  setLogo:            (patch: Partial<LogoSettings>) => void;
  hideSection:        (id: string) => void;
  showSection:        (id: string) => void;
  reset:              () => void;
}

export const useEditorStore = create<EditorStore>()(
  temporal(
    (set) => ({
      templateId:      DEFAULT_TEMPLATE_ID,
      readOnly:        false,
      galleryPhotos:   [],
      nodes:           TEMPLATES[DEFAULT_TEMPLATE_ID]!.initialNodes,
      palette:         DEFAULT_PALETTE,
      typography:      DEFAULT_TYPOGRAPHY,
      buttons:         DEFAULT_BUTTONS,
      logo:            DEFAULT_LOGO,
      selectedId:      null,
      editingId:       null,
      viewport:        "desktop",
      selectedSection: null,
      hoveredSection:  null,
      hiddenSections:  [],

      setReadOnly: (v) => set({ readOnly: v }),
      setGalleryPhotos: (p) => set({ galleryPhotos: p }),

      /** Load a saved design into the store (used by the editor + public render). */
      hydrateDesign: (d) => set((s) => {
        const templateId = d.templateId && TEMPLATES[d.templateId] ? d.templateId : s.templateId;
        const base = TEMPLATES[templateId]!.initialNodes;
        return {
          templateId,
          // Merge saved node edits over the template defaults so designs saved
          // before new nodes existed (e.g. nav links / CTA) still get defaults
          // instead of rendering empty.
          nodes:           d.nodes ? { ...base, ...d.nodes } : base,
          palette:         d.palette ?? DEFAULT_PALETTE,
          typography:      d.typography ?? DEFAULT_TYPOGRAPHY,
          buttons:         d.buttons ? { ...DEFAULT_BUTTONS, ...d.buttons } : DEFAULT_BUTTONS,
          logo:            d.logo ?? DEFAULT_LOGO,
          hiddenSections:  d.hiddenSections ?? [],
          selectedId:      null,
          editingId:       null,
          selectedSection: null,
          hoveredSection:  null,
        };
      }),

      setTemplate: (id) => set({
        templateId:      id,
        nodes:           TEMPLATES[id]!.initialNodes,
        selectedId:      null,
        editingId:       null,
        selectedSection: null,
        hiddenSections:  [],
      }),

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

      setButtons: (patch) =>
        set((s) => ({ buttons: { ...s.buttons, ...patch } })),

      setLogo: (patch) =>
        set((s) => ({ logo: { ...s.logo, ...patch } })),

      hideSection: (id) =>
        set((s) => ({ hiddenSections: [...s.hiddenSections.filter((x) => x !== id), id] })),

      showSection: (id) =>
        set((s) => ({ hiddenSections: s.hiddenSections.filter((x) => x !== id) })),

      reset: () =>
        set((s) => ({
          nodes: TEMPLATES[s.templateId]!.initialNodes,
          palette: DEFAULT_PALETTE, typography: DEFAULT_TYPOGRAPHY, buttons: DEFAULT_BUTTONS,
          logo: DEFAULT_LOGO, selectedId: null, editingId: null,
          viewport: "desktop", selectedSection: null, hiddenSections: [],
        })),
    }),
    {
      partialize: (s) => ({
        nodes: s.nodes, palette: s.palette, typography: s.typography,
        buttons: s.buttons, logo: s.logo, hiddenSections: s.hiddenSections,
      }),
    }
  )
);

export type { EditorStore };
