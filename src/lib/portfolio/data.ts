/* ─── Portfolio content model ─────────────────────────────────
   Three-level hierarchy: Category → Folder → Photo.
   - Levels are optional: a category can hold photos directly,
     a portfolio can have just one category, etc.
   - Visibility per node so users can hide entire branches.
   - All entities normalized into Records<id, T> for cheap reorder/edit.
─────────────────────────────────────────────────────────── */

export type Visibility = "public" | "draft" | "hidden";

export interface Photo {
  id:         string;
  src:        string;
  title?:     string;
  caption?:   string;
  date?:      string;
  tags?:      string[];
  visibility: Visibility;
}

export interface Folder {
  id:            string;
  title:         string;
  description?:  string;
  coverPhotoId?: string;
  photoIds:      string[];
  visibility:    Visibility;
}

export interface Category {
  id:             string;
  name:           string;
  slug:           string;
  description?:   string;
  coverPhotoId?:  string;
  folderIds:      string[];
  directPhotoIds: string[];
  visibility:     Visibility;
}

export interface PortfolioContent {
  categoryIds: string[];                        // ordered
  categories:  Record<string, Category>;
  folders:     Record<string, Folder>;
  photos:      Record<string, Photo>;
}

/* ── Helpers ─────────────────────────────────────────────────── */

export function emptyContent(): PortfolioContent {
  return { categoryIds: [], categories: {}, folders: {}, photos: {} };
}

export function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "untitled";
}

/* Counts for UI summary lines */
export function contentSummary(c: PortfolioContent | undefined) {
  if (!c) return { categories: 0, folders: 0, photos: 0 };
  return {
    categories: c.categoryIds.length,
    folders:    Object.keys(c.folders).length,
    photos:     Object.keys(c.photos).length,
  };
}

/* ── Seed content for demos ─────────────────────────────────── */

function makePhoto(seed: number, title?: string): Photo {
  return { id: `ph-${seed}`, src: `https://picsum.photos/seed/${seed}/600/800`, title, visibility: "public" };
}

function makeFolder(id: string, title: string, photos: number[]): Folder {
  return { id, title, photoIds: photos.map((s) => `ph-${s}`), visibility: "public" };
}

export const SEED_CONTENT: Record<string, PortfolioContent> = {
  "1": {
    categoryIds: ["cat-weddings", "cat-portraits", "cat-editorial"],
    categories: {
      "cat-weddings": {
        id: "cat-weddings", name: "Weddings", slug: "weddings",
        description: "Documented love stories from coast to coast.",
        folderIds: ["fol-sj-2024", "fol-ed-2024"],
        directPhotoIds: [],
        visibility: "public",
      },
      "cat-portraits": {
        id: "cat-portraits", name: "Portraits", slug: "portraits",
        folderIds: ["fol-studio-2024"],
        directPhotoIds: ["ph-501", "ph-502"],
        visibility: "public",
      },
      "cat-editorial": {
        id: "cat-editorial", name: "Editorial", slug: "editorial",
        description: "Magazine and brand assignments.",
        folderIds: [],
        directPhotoIds: ["ph-601", "ph-602", "ph-603"],
        visibility: "draft",
      },
    },
    folders: {
      "fol-sj-2024":     makeFolder("fol-sj-2024",     "Sarah & James — Hudson Valley", [10, 11, 12, 13, 14, 15]),
      "fol-ed-2024":     makeFolder("fol-ed-2024",     "Emma & David — Mexico City",     [101, 102, 103, 104]),
      "fol-studio-2024": makeFolder("fol-studio-2024", "Studio sessions Q1",             [301, 302, 303]),
    },
    photos: {
      ...Object.fromEntries([10, 11, 12, 13, 14, 15].map((s) => [`ph-${s}`, makePhoto(s)])),
      ...Object.fromEntries([101, 102, 103, 104].map((s) => [`ph-${s}`, makePhoto(s)])),
      ...Object.fromEntries([301, 302, 303].map((s) => [`ph-${s}`, makePhoto(s)])),
      "ph-501": makePhoto(501, "Cover candidate"),
      "ph-502": makePhoto(502),
      "ph-601": makePhoto(601),
      "ph-602": makePhoto(602),
      "ph-603": makePhoto(603),
    },
  },
};
