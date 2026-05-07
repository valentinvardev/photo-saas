"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_PAGES, DEFAULT_PAGE, type DeliveryPage } from "./data";

interface DeliveryStore {
  pages:    DeliveryPage[];
  hydrated: boolean;
  setHydrated: () => void;
  add:      (title: string, client: string) => DeliveryPage;
  update:   (id: string, patch: Partial<DeliveryPage>) => void;
  remove:   (id: string) => void;
  duplicate:(id: string) => void;
  get:      (id: string) => DeliveryPage | undefined;
}

export const useDeliveryStore = create<DeliveryStore>()(
  persist(
    (set, get) => ({
      pages: INITIAL_PAGES,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      add: (title, client) => {
        const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        const newPage: DeliveryPage = {
          ...DEFAULT_PAGE,
          id: `dp-${Date.now()}`,
          title, client,
          createdAt: now,
        };
        set((s) => ({ pages: [newPage, ...s.pages] }));
        return newPage;
      },
      update: (id, patch) => set((s) => ({ pages: s.pages.map((p) => p.id === id ? { ...p, ...patch } : p) })),
      remove: (id) => set((s) => ({ pages: s.pages.filter((p) => p.id !== id) })),
      duplicate: (id) => set((s) => {
        const page = s.pages.find((p) => p.id === id);
        if (!page) return s;
        return { pages: [...s.pages, { ...page, id: `dp-${Date.now()}`, title: `${page.title} (Copy)`, status: "draft", views: 0, lastViewed: null }] };
      }),
      get: (id) => get().pages.find((p) => p.id === id),
    }),
    {
      name: "frame-delivery-pages",
      version: 5,
      /* v2: cinematic and editorial templates removed — map old values
         to the closest visual replacements so previously-saved client
         pages keep rendering.
         v3: example pages reseeded to showcase the four real templates
         (Halcyon, Brooklyn, Minimal, Vogue). */
      migrate: (persisted, version) => {
        const state = persisted as { pages?: DeliveryPage[] } | undefined;
        if (!state?.pages) return state as DeliveryStore;
        if (version < 2) {
          state.pages = state.pages.map((p) => {
            const t = (p as { template: string }).template;
            if (t === "cinematic") return { ...p, template: "vogue" };
            if (t === "editorial") return { ...p, template: "minimal" };
            return p;
          });
        }
        if (version < 5) {
          /* Reseed examples so each card uses a template that actually
             has a delivery page route, with template-relevant covers. */
          state.pages = INITIAL_PAGES;
        }
        return state as DeliveryStore;
      },
      onRehydrateStorage: () => (state) => { state?.setHydrated(); },
    },
  ),
);
