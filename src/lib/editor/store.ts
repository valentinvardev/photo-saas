"use client";

import { create } from "zustand";
import { temporal } from "zundo";
import type { EditorNode, EditorState, ColorPalette } from "./types";
import { DEFAULT_PALETTE } from "./types";

/* ── Default nodes matching EditableTemplate ─────────────────────────── */
const INITIAL_NODES: Record<string, EditorNode> = {
  "nav-logo": { id: "nav-logo", type: "nav-logo", content: "JAMES HOLLIS" },
  "hero-heading": { id: "hero-heading", type: "heading", content: "Documenting<br/>the world." },
  "hero-sub": { id: "hero-sub", type: "paragraph", content: "Editorial & documentary photography — twenty years in the field." },
  "about-heading": { id: "about-heading", type: "heading", content: "A career built on patience." },
  "about-body": { id: "about-body", type: "paragraph", content: "James Hollis is an award-winning documentary photographer whose work has appeared in Time, National Geographic, and Le Monde. Based between New York and Oaxaca." },
  "about-image": { id: "about-image", type: "image", src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80", alt: "James Hollis" },
  "contact-heading": { id: "contact-heading", type: "heading", content: "Let's work together." },
  "contact-body": { id: "contact-body", type: "paragraph", content: "For editorial commissions, licensing enquiries, and exhibition proposals." },
  "contact-email": { id: "contact-email", type: "paragraph", content: "james@jameshollis.com" },
};

/* ── Store interface ─────────────────────────────────────────────────── */
interface EditorStore extends EditorState {
  selectNode: (id: string | null) => void;
  setEditing: (id: string | null) => void;
  updateNode: (id: string, patch: Partial<EditorNode>) => void;
  setPalette: (patch: Partial<ColorPalette>) => void;
  reset: () => void;
}

/* ── Store ────────────────────────────────────────────────────────────── */
export const useEditorStore = create<EditorStore>()(
  temporal(
    (set) => ({
      nodes: INITIAL_NODES,
      palette: DEFAULT_PALETTE,
      selectedId: null,
      editingId: null,

      selectNode: (id) => set({ selectedId: id, editingId: null }),
      setEditing: (id) => set({ editingId: id }),

      updateNode: (id, patch) =>
        set((s) => ({
          nodes: {
            ...s.nodes,
            [id]: { ...s.nodes[id]!, ...patch },
          },
        })),

      setPalette: (patch) =>
        set((s) => ({ palette: { ...s.palette, ...patch } })),

      reset: () =>
        set({ nodes: INITIAL_NODES, palette: DEFAULT_PALETTE, selectedId: null, editingId: null }),
    }),
    {
      // Only track nodes + palette in undo history, not selection state
      partialize: (s) => ({ nodes: s.nodes, palette: s.palette }),
    }
  )
);

export type { EditorStore };
