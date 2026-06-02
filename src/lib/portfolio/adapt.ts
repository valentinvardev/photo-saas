import type { Portfolio } from "./mock";

/** Shape returned by api.portfolio.list / get for the fields the UI needs. */
export type DbPortfolio = {
  id: string;
  title: string;
  slug: string;
  status: string;
  template: string;
  customDomain: string | null;
  views: number;
  createdAt: Date;
  updatedAt: Date;
};

/** Stable pseudo-random seed from a cuid — used for picsum cover fallbacks. */
function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h) % 1000;
}

function relativeTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const mins = Math.round((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.round(hrs / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString();
}

/**
 * Map a DB portfolio row to the rich view-model the dashboard UI expects.
 * Analytics/SEO fields (weeklyViews, uniqueVisitors, seo) are placeholders
 * until those features are wired — the backend doesn't model them yet.
 */
export function dbToView(db: DbPortfolio): Portfolio {
  return {
    id: db.id,
    name: db.title,
    slug: db.slug,
    template: db.template,
    status: db.status === "published" ? "published" : "draft",
    visits: db.views,
    uniqueVisitors: 0,
    pages: 0,
    updatedAt: relativeTime(db.updatedAt),
    publishedAt: null,
    seed: seedFromId(db.id),
    customDomain: db.customDomain,
    seo: { title: db.title, description: "" },
    passwordProtected: false,
    weeklyViews: [0, 0, 0, 0, 0, 0, 0],
  };
}
