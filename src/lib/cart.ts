"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ── Types ─────────────────────────────────────────────────── */

export type CartItemType = "domain" | "template";

export interface CartItem {
  id:       string;
  type:     CartItemType;
  name:     string;
  detail:   string;        // "12.00/yr" or "One-time · Free"
  price:    number;        // USD cents, 0 = free
  period?:  "year" | "one-time";
}

interface CartStore {
  items:      CartItem[];
  open:       boolean;
  addItem:    (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  clearCart:  () => void;
  setOpen:    (open: boolean) => void;
  hasItem:    (name: string) => boolean;
}

/* ── Store ─────────────────────────────────────────────────── */

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      open:  false,

      addItem: (item) => {
        const id = `${item.type}-${item.name.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}`;
        set((s) => ({ items: [...s.items, { ...item, id }], open: true }));
      },

      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      clearCart: () => set({ items: [] }),

      setOpen: (open) => set({ open }),

      hasItem: (name) => get().items.some((i) => i.name === name),
    }),
    { name: "frame-cart", partialize: (s) => ({ items: s.items }) }
  )
);
