import type { PortfolioContent } from "./data";

function isContent(c: unknown): c is PortfolioContent {
  if (!c || typeof c !== "object") return false;
  const v = c as Partial<PortfolioContent>;
  return Array.isArray(v.categoryIds) && !!v.categories && !!v.folders && !!v.photos;
}

/**
 * Flatten a portfolio's content tree into an ordered list of visible photos
 * (categories → direct photos → folders → folder photos). Used to feed the
 * website-builder gallery and the public render.
 */
export function flattenContentPhotos(content: unknown): { src: string; title?: string }[] {
  if (!isContent(content)) return [];
  const out: { src: string; title?: string }[] = [];
  for (const catId of content.categoryIds) {
    const cat = content.categories[catId];
    if (!cat || cat.visibility === "hidden") continue;
    for (const pid of cat.directPhotoIds) {
      const p = content.photos[pid];
      if (p && p.visibility !== "hidden") out.push({ src: p.src, title: p.title });
    }
    for (const fid of cat.folderIds) {
      const fol = content.folders[fid];
      if (!fol || fol.visibility === "hidden") continue;
      for (const pid of fol.photoIds) {
        const p = content.photos[pid];
        if (p && p.visibility !== "hidden") out.push({ src: p.src, title: p.title });
      }
    }
  }
  return out;
}
