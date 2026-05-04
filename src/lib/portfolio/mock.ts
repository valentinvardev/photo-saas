/* Mock portfolios for the dashboard. Each one references a real
   template we ship via TEMPLATE_URL so the live preview renders. */

export type PortfolioStatus = "published" | "draft";

export interface Portfolio {
  id:                string;
  name:              string;
  slug:              string;
  template:          string;
  status:            PortfolioStatus;
  visits:            number;
  uniqueVisitors:    number;
  pages:             number;
  updatedAt:         string;
  publishedAt:       string | null;
  seed:              number;
  customDomain:      string | null;
  seo:               { title: string; description: string };
  passwordProtected: boolean;
  weeklyViews:       number[];
}

export const TEMPLATE_URL: Record<string, string> = {
  "Brooklyn":   "/template/brooklyn",
  "Minimal BW": "/templates/minimal-bw",
  "Petal":      "/templates/lumiere",
};

export const TEMPLATES = ["Brooklyn", "Minimal BW", "Petal"];

export const MOCK_PORTFOLIOS: Portfolio[] = [
  {
    id: "1",
    name: "Sofia Chen Photography",
    slug: "sofia-chen",
    template: "Brooklyn",
    status: "published",
    visits: 1284, uniqueVisitors: 832, pages: 6,
    updatedAt: "2 hours ago", publishedAt: "Jan 12, 2025",
    seed: 201,
    customDomain: "sofiachenphoto.com",
    seo: { title: "Sofia Chen — Fine Art Photography", description: "Award-winning fine art and wedding photographer based in San Francisco, CA." },
    passwordProtected: false,
    weeklyViews: [34, 52, 41, 67, 89, 72, 93],
  },
  {
    id: "2",
    name: "Urban Frames",
    slug: "urban-frames",
    template: "Minimal BW",
    status: "published",
    visits: 438, uniqueVisitors: 291, pages: 4,
    updatedAt: "3 days ago", publishedAt: "Feb 3, 2025",
    seed: 202,
    customDomain: null,
    seo: { title: "Urban Frames — Street & Documentary", description: "Street photography and urban documentary work from around the world." },
    passwordProtected: false,
    weeklyViews: [12, 18, 9, 24, 31, 28, 21],
  },
  {
    id: "3",
    name: "Patagonia Series",
    slug: "patagonia-series",
    template: "Petal",
    status: "draft",
    visits: 0, uniqueVisitors: 0, pages: 3,
    updatedAt: "1 week ago", publishedAt: null,
    seed: 203,
    customDomain: null,
    seo: { title: "Patagonia — A Visual Journey", description: "" },
    passwordProtected: true,
    weeklyViews: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "4",
    name: "Commercial Work",
    slug: "commercial-work",
    template: "Minimal BW",
    status: "published",
    visits: 67, uniqueVisitors: 54, pages: 5,
    updatedAt: "5 days ago", publishedAt: "Mar 1, 2025",
    seed: 204,
    customDomain: null,
    seo: { title: "Commercial Photography — Sofia Chen", description: "Product and brand photography for leading companies." },
    passwordProtected: false,
    weeklyViews: [5, 8, 3, 11, 9, 7, 12],
  },
];

export function getPortfolioById(id: string): Portfolio | undefined {
  return MOCK_PORTFOLIOS.find((p) => p.id === id);
}
