"use client";

import { create } from "zustand";
import { temporal } from "zundo";
import type { EditorNode, EditorState, ColorPalette, Viewport } from "./types";
import { DEFAULT_PALETTE } from "./types";

/* ── Default nodes matching EditableTemplate ─────────────────────────── */
const INITIAL_NODES: Record<string, EditorNode> = {
  "nav-logo":        { id: "nav-logo",        type: "nav-logo",   content: "J·H" },
  "hero-heading":    { id: "hero-heading",    type: "heading",    content: "James<br/><em>Hollis</em>" },
  "hero-sub":        { id: "hero-sub",        type: "paragraph",  content: "Documenting the quiet tension between presence and absence. Work exhibited across North America and Europe." },
  "hero-avail":      { id: "hero-avail",      type: "paragraph",  content: "Available for commissions — Q4 2025" },
  "about-heading":   { id: "about-heading",   type: "heading",    content: "A career built on<br/><em>patience</em>" },
  "about-body-1":    { id: "about-body-1",    type: "paragraph",  content: "James Hollis is a New York-based documentary and portrait photographer with over a decade of work spanning editorial commissions, personal projects, and exhibition photography." },
  "about-body-2":    { id: "about-body-2",    type: "paragraph",  content: "His long-form projects explore the intersection of memory, geography, and identity — often through extended collaborations with communities in transition." },
  "about-image":     { id: "about-image",     type: "image",      src: "https://picsum.photos/seed/1084/600/750?grayscale", alt: "James Hollis" },
  "quote-text":      { id: "quote-text",      type: "paragraph",  content: "\u201cThe camera is an instrument that teaches people how to see without a camera.\u201d" },
  "quote-author":    { id: "quote-author",    type: "paragraph",  content: "— Dorothea Lange" },
  "contact-heading": { id: "contact-heading", type: "heading",    content: "Let\u2019s create<br/><em>something.</em>" },
  "contact-body":    { id: "contact-body",    type: "paragraph",  content: "For editorial commissions, exhibition inquiries, and long-form project proposals." },
};

/* ── Store interface ─────────────────────────────────────────────────── */
interface EditorStore extends EditorState {
  selectNode:   (id: string | null) => void;
  setEditing:   (id: string | null) => void;
  setViewport:  (v: Viewport) => void;
  updateNode:   (id: string, patch: Partial<EditorNode>) => void;
  setPalette:   (patch: Partial<ColorPalette>) => void;
  reset:        () => void;
}

/* ── Store ────────────────────────────────────────────────────────────── */
export const useEditorStore = create<EditorStore>()(
  temporal(
    (set) => ({
      nodes:      INITIAL_NODES,
      palette:    DEFAULT_PALETTE,
      selectedId: null,
      editingId:  null,
      viewport:   "desktop",

      selectNode:  (id) => set({ selectedId: id, editingId: null }),
      setEditing:  (id) => set({ editingId: id }),
      setViewport: (v)  => set({ viewport: v }),

      updateNode: (id, patch) =>
        set((s) => ({
          nodes: { ...s.nodes, [id]: { ...s.nodes[id]!, ...patch } },
        })),

      setPalette: (patch) =>
        set((s) => ({ palette: { ...s.palette, ...patch } })),

      reset: () =>
        set({ nodes: INITIAL_NODES, palette: DEFAULT_PALETTE, selectedId: null, editingId: null, viewport: "desktop" }),
    }),
    {
      // Only undo nodes + palette changes, not UI state
      partialize: (s) => ({ nodes: s.nodes, palette: s.palette }),
    }
  )
);

export type { EditorStore };
