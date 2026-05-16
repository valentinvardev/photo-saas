"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_PAGE, type LinksPage } from "./data";

/* Single-page model for the Linktree-style links surface: a photographer
   has one canonical links page (their "@username" hub). The page is
   identified by id but in practice we only ever have one. Multi-page
   support can layer on top later — the interface mirrors the delivery
   store so the migration is mechanical. */

interface LinksStore {
  page:     LinksPage;
  hydrated: boolean;
  setHydrated: () => void;
  update:   (patch: Partial<LinksPage>) => void;
  reset:    () => void;
  get:      (id?: string) => LinksPage;
}

export const useLinksStore = create<LinksStore>()(
  persist(
    (set, get) => ({
      page:     DEFAULT_PAGE,
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      update: (patch) => set((s) => ({ page: { ...s.page, ...patch } })),
      reset:  () => set({ page: DEFAULT_PAGE }),
      get:    () => get().page,
    }),
    {
      name: "portapic-links-page",
      version: 1,
      onRehydrateStorage: () => (state) => { state?.setHydrated(); },
    },
  ),
);
