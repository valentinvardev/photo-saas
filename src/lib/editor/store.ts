"use client";

import { create } from "zustand";
import { temporal } from "zundo";
import type { EditorNode, EditorState, ColorPalette, Typography, Viewport, LogoSettings } from "./types";
import { DEFAULT_PALETTE, DEFAULT_TYPOGRAPHY, DEFAULT_LOGO } from "./types";
import { TEMPLATES, DEFAULT_TEMPLATE_ID, type TemplateId } from "./templates/registry";

interface EditorStore extends EditorState {
  templateId:         TemplateId;
  setTemplate:        (id: TemplateId) => void;
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
      templateId:      DEFAULT_TEMPLATE_ID,
      nodes:           TEMPLATES[DEFAULT_TEMPLATE_ID]!.initialNodes,
      palette:         DEFAULT_PALETTE,
      typography:      DEFAULT_TYPOGRAPHY,
      logo:            DEFAULT_LOGO,
      selectedId:      null,
      editingId:       null,
      viewport:        "desktop",
      selectedSection: null,
      hoveredSection:  null,
      hiddenSections:  [],

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

      setLogo: (patch) =>
        set((s) => ({ logo: { ...s.logo, ...patch } })),

      hideSection: (id) =>
        set((s) => ({ hiddenSections: [...s.hiddenSections.filter((x) => x !== id), id] })),

      showSection: (id) =>
        set((s) => ({ hiddenSections: s.hiddenSections.filter((x) => x !== id) })),

      reset: () =>
        set((s) => ({
          nodes: TEMPLATES[s.templateId]!.initialNodes,
          palette: DEFAULT_PALETTE, typography: DEFAULT_TYPOGRAPHY,
          logo: DEFAULT_LOGO, selectedId: null, editingId: null,
          viewport: "desktop", selectedSection: null, hiddenSections: [],
        })),
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
