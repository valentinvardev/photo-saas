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
      version: 9,
      /* Migration history
         v2: cinematic/editorial templates remapped to vogue/minimal.
         v5: example pages reseeded for the four real templates.
         v6: 3-slot typography (fontFamily1/2/3) backfilled with empty.
         v7: monetization simplified — "selection" mode removed; selection
             modes remapped to "gift"; selectionLimit/proofingEnabled/
             watermark fields dropped (watermark is now derived from
             mode === "direct"); password-gate copy fields added.
         v8: cover image controls — coverFit + coverPositionX/Y added,
             defaulting to ("cover", 50, 50). */
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
          state.pages = INITIAL_PAGES;
        }
        if (version < 6) {
          state.pages = state.pages.map((p) => {
            const withDefaults: Partial<DeliveryPage> = { fontFamily1: "", fontFamily2: "", fontFamily3: "" };
            return { ...withDefaults, ...p } as DeliveryPage;
          });
        }
        if (version < 7) {
          state.pages = state.pages.map((raw) => {
            const old = raw as DeliveryPage & { selectionLimit?: number; proofingEnabled?: boolean; watermark?: boolean };
            /* Drop obsolete fields */
            const { selectionLimit: _sl, proofingEnabled: _pe, watermark: _wm, ...rest } = old;
            void _sl; void _pe; void _wm;
            return {
              ...rest,
              /* "selection" no longer exists — fall back to "gift" */
              mode: old.mode === "direct" ? "direct" : "gift",
              /* New password copy fields */
              passwordTitle:    "Private gallery",
              passwordSubtitle: "Enter the access code to view.",
              passwordHint:     "Hint: it was shared with you by email.",
              passwordButtonLabel: "Unlock gallery",
            } as DeliveryPage;
          });
        }
        if (version < 8) {
          state.pages = state.pages.map((p) => {
            const defaults: Partial<DeliveryPage> = { coverFit: "cover", coverPositionX: 50, coverPositionY: 50 };
            return { ...defaults, ...p } as DeliveryPage;
          });
        }
        if (version < 9) {
          state.pages = state.pages.map((p) => {
            const defaults: Partial<DeliveryPage> = { logoWidth: 0 };
            return { ...defaults, ...p } as DeliveryPage;
          });
        }
        return state as DeliveryStore;
      },
      onRehydrateStorage: () => (state) => { state?.setHydrated(); },
    },
  ),
);
