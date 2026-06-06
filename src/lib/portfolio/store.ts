"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  SEED_CONTENT, emptyContent, slugify,
  type PortfolioContent, type Category, type Folder, type Photo, type Visibility,
} from "./data";

interface PortfolioContentStore {
  /* All content keyed by portfolio id */
  byPortfolio: Record<string, PortfolioContent>;
  hydrated:    boolean;

  setHydrated: () => void;

  /* Hydrate a portfolio's whole content tree from the server (canonical on load) */
  setContent: (portfolioId: string, content: PortfolioContent) => void;

  /* Read */
  getContent: (portfolioId: string) => PortfolioContent;

  /* Categories */
  addCategory:    (portfolioId: string, name: string) => string;
  renameCategory: (portfolioId: string, categoryId: string, name: string) => void;
  setCategoryVis: (portfolioId: string, categoryId: string, v: Visibility) => void;
  removeCategory: (portfolioId: string, categoryId: string) => void;

  /* Folders */
  addFolder:    (portfolioId: string, categoryId: string, title: string) => string;
  renameFolder: (portfolioId: string, folderId: string, title: string) => void;
  setFolderVis: (portfolioId: string, folderId: string, v: Visibility) => void;
  removeFolder: (portfolioId: string, folderId: string) => void;

  /* Photos */
  addPhoto:     (portfolioId: string, parent: { categoryId?: string; folderId?: string }, src: string, title?: string) => string;
  setPhotoVis:  (portfolioId: string, photoId: string, v: Visibility) => void;
  removePhoto:  (portfolioId: string, photoId: string) => void;

  /* Reorder */
  reorderCategories:        (portfolioId: string, ids: string[]) => void;
  reorderFolderPhotos:      (portfolioId: string, folderId: string, ids: string[]) => void;
  reorderCategoryPhotos:    (portfolioId: string, categoryId: string, ids: string[]) => void;

  /* Move photo between folders */
  movePhoto: (portfolioId: string, photoId: string, fromFolderId: string, toFolderId: string, atIndex: number) => void;
}

/* Helper — produce a fresh content object for portfolios with no entry yet */
function ensureContent(byPortfolio: Record<string, PortfolioContent>, portfolioId: string): PortfolioContent {
  return byPortfolio[portfolioId] ?? emptyContent();
}

/* Unique id generator. Date.now() alone collides when several ids are created
   in the same millisecond (e.g. adding multiple photos in a loop), which used
   to overwrite photos and duplicate ids in photoIds. The seq + random suffix
   guarantees uniqueness within a session. */
let _idSeq = 0;
function uid(prefix: string): string {
  _idSeq = (_idSeq + 1) % 1_000_000;
  return `${prefix}-${Date.now().toString(36)}${_idSeq.toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/* De-duplicate photo id lists — repairs content corrupted by the old id
   collisions so existing folders stop showing duplicate tiles. */
function dedupeContent(c: PortfolioContent): PortfolioContent {
  const folders = Object.fromEntries(
    Object.entries(c.folders).map(([fid, f]) => [fid, { ...f, photoIds: [...new Set(f.photoIds)] }]),
  );
  const categories = Object.fromEntries(
    Object.entries(c.categories).map(([cid, cat]) => [cid, { ...cat, directPhotoIds: [...new Set(cat.directPhotoIds)] }]),
  );
  return { ...c, folders, categories };
}

/* ─── Store ──────────────────────────────────────────────────── */

export const usePortfolioContentStore = create<PortfolioContentStore>()(
  persist(
    (set, get) => ({
      byPortfolio: SEED_CONTENT,
      hydrated:    false,

      setHydrated: () => set({ hydrated: true }),

      setContent: (portfolioId, content) => set((s) => ({
        byPortfolio: { ...s.byPortfolio, [portfolioId]: content },
      })),

      getContent: (portfolioId) => ensureContent(get().byPortfolio, portfolioId),

      /* ── Categories ── */
      addCategory: (portfolioId, name) => {
        const id = uid("cat");
        set((s) => {
          const c = ensureContent(s.byPortfolio, portfolioId);
          const cat: Category = {
            id, name: name.trim() || "Untitled", slug: slugify(name),
            folderIds: [], directPhotoIds: [], visibility: "draft",
          };
          return {
            byPortfolio: {
              ...s.byPortfolio,
              [portfolioId]: {
                ...c,
                categoryIds: [...c.categoryIds, id],
                categories:  { ...c.categories, [id]: cat },
              },
            },
          };
        });
        return id;
      },

      renameCategory: (portfolioId, categoryId, name) => set((s) => {
        const c = ensureContent(s.byPortfolio, portfolioId);
        const cat = c.categories[categoryId]; if (!cat) return s;
        return {
          byPortfolio: {
            ...s.byPortfolio,
            [portfolioId]: {
              ...c,
              categories: { ...c.categories, [categoryId]: { ...cat, name, slug: slugify(name) } },
            },
          },
        };
      }),

      setCategoryVis: (portfolioId, categoryId, v) => set((s) => {
        const c = ensureContent(s.byPortfolio, portfolioId);
        const cat = c.categories[categoryId]; if (!cat) return s;
        return {
          byPortfolio: {
            ...s.byPortfolio,
            [portfolioId]: { ...c, categories: { ...c.categories, [categoryId]: { ...cat, visibility: v } } },
          },
        };
      }),

      removeCategory: (portfolioId, categoryId) => set((s) => {
        const c = ensureContent(s.byPortfolio, portfolioId);
        const cat = c.categories[categoryId]; if (!cat) return s;
        /* Cascade: drop any folders + photos owned exclusively by this category */
        const folders = { ...c.folders };
        const photos  = { ...c.photos };
        for (const fid of cat.folderIds) {
          const f = folders[fid];
          if (f) {
            for (const pid of f.photoIds) delete photos[pid];
            delete folders[fid];
          }
        }
        for (const pid of cat.directPhotoIds) delete photos[pid];
        const { [categoryId]: _, ...categories } = c.categories;
        return {
          byPortfolio: {
            ...s.byPortfolio,
            [portfolioId]: {
              ...c,
              categoryIds: c.categoryIds.filter((x) => x !== categoryId),
              categories, folders, photos,
            },
          },
        };
      }),

      /* ── Folders ── */
      addFolder: (portfolioId, categoryId, title) => {
        const id = uid("fol");
        set((s) => {
          const c = ensureContent(s.byPortfolio, portfolioId);
          const cat = c.categories[categoryId]; if (!cat) return s;
          const fol: Folder = { id, title: title.trim() || "Untitled folder", photoIds: [], visibility: "draft" };
          return {
            byPortfolio: {
              ...s.byPortfolio,
              [portfolioId]: {
                ...c,
                folders:    { ...c.folders, [id]: fol },
                categories: { ...c.categories, [categoryId]: { ...cat, folderIds: [...cat.folderIds, id] } },
              },
            },
          };
        });
        return id;
      },

      renameFolder: (portfolioId, folderId, title) => set((s) => {
        const c = ensureContent(s.byPortfolio, portfolioId);
        const fol = c.folders[folderId]; if (!fol) return s;
        return {
          byPortfolio: {
            ...s.byPortfolio,
            [portfolioId]: { ...c, folders: { ...c.folders, [folderId]: { ...fol, title } } },
          },
        };
      }),

      setFolderVis: (portfolioId, folderId, v) => set((s) => {
        const c = ensureContent(s.byPortfolio, portfolioId);
        const fol = c.folders[folderId]; if (!fol) return s;
        return {
          byPortfolio: {
            ...s.byPortfolio,
            [portfolioId]: { ...c, folders: { ...c.folders, [folderId]: { ...fol, visibility: v } } },
          },
        };
      }),

      removeFolder: (portfolioId, folderId) => set((s) => {
        const c = ensureContent(s.byPortfolio, portfolioId);
        const fol = c.folders[folderId]; if (!fol) return s;
        const photos = { ...c.photos };
        for (const pid of fol.photoIds) delete photos[pid];
        const { [folderId]: _, ...folders } = c.folders;
        const categories = Object.fromEntries(
          Object.entries(c.categories).map(([cid, cat]) => [cid, { ...cat, folderIds: cat.folderIds.filter((x) => x !== folderId) }]),
        );
        return {
          byPortfolio: { ...s.byPortfolio, [portfolioId]: { ...c, folders, photos, categories } },
        };
      }),

      /* ── Photos ── */
      addPhoto: (portfolioId, parent, src, title) => {
        const id = uid("ph");
        set((s) => {
          const c = ensureContent(s.byPortfolio, portfolioId);
          const photo: Photo = { id, src, title, visibility: "public" };
          let categories = c.categories;
          let folders    = c.folders;
          if (parent.folderId) {
            const fol = c.folders[parent.folderId];
            if (!fol) return s;
            folders = { ...c.folders, [parent.folderId]: { ...fol, photoIds: [...fol.photoIds, id] } };
          } else if (parent.categoryId) {
            const cat = c.categories[parent.categoryId];
            if (!cat) return s;
            categories = { ...c.categories, [parent.categoryId]: { ...cat, directPhotoIds: [...cat.directPhotoIds, id] } };
          } else {
            return s;
          }
          return {
            byPortfolio: {
              ...s.byPortfolio,
              [portfolioId]: { ...c, photos: { ...c.photos, [id]: photo }, folders, categories },
            },
          };
        });
        return id;
      },

      setPhotoVis: (portfolioId, photoId, v) => set((s) => {
        const c = ensureContent(s.byPortfolio, portfolioId);
        const ph = c.photos[photoId]; if (!ph) return s;
        return {
          byPortfolio: {
            ...s.byPortfolio,
            [portfolioId]: { ...c, photos: { ...c.photos, [photoId]: { ...ph, visibility: v } } },
          },
        };
      }),

      removePhoto: (portfolioId, photoId) => set((s) => {
        const c = ensureContent(s.byPortfolio, portfolioId);
        if (!c.photos[photoId]) return s;
        const { [photoId]: _, ...photos } = c.photos;
        const folders = Object.fromEntries(
          Object.entries(c.folders).map(([fid, f]) => [fid, { ...f, photoIds: f.photoIds.filter((x) => x !== photoId) }]),
        );
        const categories = Object.fromEntries(
          Object.entries(c.categories).map(([cid, cat]) => [cid, { ...cat, directPhotoIds: cat.directPhotoIds.filter((x) => x !== photoId) }]),
        );
        return {
          byPortfolio: { ...s.byPortfolio, [portfolioId]: { ...c, photos, folders, categories } },
        };
      }),

      /* ── Reorder ── */
      reorderCategories: (portfolioId, ids) => set((s) => {
        const c = ensureContent(s.byPortfolio, portfolioId);
        return { byPortfolio: { ...s.byPortfolio, [portfolioId]: { ...c, categoryIds: ids } } };
      }),

      reorderFolderPhotos: (portfolioId, folderId, ids) => set((s) => {
        const c = ensureContent(s.byPortfolio, portfolioId);
        const fol = c.folders[folderId]; if (!fol) return s;
        return {
          byPortfolio: {
            ...s.byPortfolio,
            [portfolioId]: { ...c, folders: { ...c.folders, [folderId]: { ...fol, photoIds: ids } } },
          },
        };
      }),

      reorderCategoryPhotos: (portfolioId, categoryId, ids) => set((s) => {
        const c = ensureContent(s.byPortfolio, portfolioId);
        const cat = c.categories[categoryId]; if (!cat) return s;
        return {
          byPortfolio: {
            ...s.byPortfolio,
            [portfolioId]: { ...c, categories: { ...c.categories, [categoryId]: { ...cat, directPhotoIds: ids } } },
          },
        };
      }),

      movePhoto: (portfolioId, photoId, fromFolderId, toFolderId, atIndex) => set((s) => {
        const c = ensureContent(s.byPortfolio, portfolioId);
        const src = c.folders[fromFolderId];
        const tgt = c.folders[toFolderId];
        if (!src || !tgt) return s;
        const srcIds = src.photoIds.filter((id) => id !== photoId);
        const tgtIds = tgt.photoIds.filter((id) => id !== photoId);
        tgtIds.splice(Math.max(0, Math.min(atIndex, tgtIds.length)), 0, photoId);
        return {
          byPortfolio: {
            ...s.byPortfolio,
            [portfolioId]: {
              ...c,
              folders: {
                ...c.folders,
                [fromFolderId]: { ...src, photoIds: srcIds },
                [toFolderId]:   { ...tgt, photoIds: tgtIds },
              },
            },
          },
        };
      }),
    }),
    {
      name:    "frame-portfolio-content",
      version: 2,
      /* v2: repair duplicate photo ids left behind by the old Date.now() id
         collisions, so existing folders stop rendering duplicate tiles. */
      migrate: (persisted) => {
        const state = persisted as { byPortfolio?: Record<string, PortfolioContent> } | undefined;
        if (state?.byPortfolio) {
          state.byPortfolio = Object.fromEntries(
            Object.entries(state.byPortfolio).map(([pid, c]) => [pid, dedupeContent(c)]),
          );
        }
        return state as never;
      },
      onRehydrateStorage: () => (state) => { state?.setHydrated(); },
    },
  ),
);
