/* Delivery data — types, constants, defaults */

export type DeliveryMode    = "gift" | "direct" | "selection";
export type LayoutStyle     = "grid" | "masonry";
export type TemplateName    = "minimal" | "vogue" | "brooklyn";
export type DeliveryStatus  = "draft" | "active" | "expired";
export type LogoMode        = "none" | "text" | "image" | "image+text";

export interface DeliveryPage {
  id:               string;
  title:            string;
  client:           string;
  status:           DeliveryStatus;
  photoCount:       number;
  photoSeeds:       number[];
  coverSeed:        number;
  coverUrl:         string;
  views:            number;
  lastViewed:       string | null;
  createdAt:        string;
  expiresAt:        string | null;
  // Security
  passwordEnabled:  boolean;
  password:         string;
  whitelistEnabled: boolean;
  whitelist:        string[];
  // Monetization
  mode:             DeliveryMode;
  selectionLimit:   number;
  pricePerPhoto:    number;
  priceFullGallery: number;
  watermark:        boolean;
  downloadRes:      "full" | "web" | "choice";
  proofingEnabled:  boolean;
  // Aesthetic
  template:         TemplateName;
  layout:           LayoutStyle;
  welcomeMessage:   string;
  showUpsellBanner: boolean;
  // Branding
  logoMode:         LogoMode;
  logoText:         string;
  logoUrl:          string;
  customColors:     boolean;
  colorBg:          string;
  colorFg:          string;
  colorAccent:      string;
  colorBtnBg:       string;
  colorBtnFg:       string;
  fontFamily:       string;
}

export const ALL_GALLERY_SEEDS = Array.from({ length: 48 }, (_, i) => i + 10);

export const DEFAULT_BRANDING = {
  logoMode: "text" as LogoMode,
  logoText: "STUDIO",
  logoUrl: "",
  customColors: false,
  colorBg: "#ffffff", colorFg: "#111111",
  colorAccent: "#f5f5f5",
  colorBtnBg: "#111111", colorBtnFg: "#ffffff",
  fontFamily: "Inter, sans-serif",
};

export const INITIAL_PAGES: DeliveryPage[] = [
  {
    id: "dp1", title: "Wedding Gallery", client: "Sarah & James",
    status: "active", photoCount: 247, photoSeeds: [10,11,12,13,14,15,16,17,18,19,20,21], coverSeed: 401, coverUrl: "",
    views: 12, lastViewed: "2 hours ago", createdAt: "Apr 2, 2026", expiresAt: "May 2, 2026",
    passwordEnabled: true,  password: "sarah2026", whitelistEnabled: false, whitelist: [],
    mode: "selection", selectionLimit: 30, pricePerPhoto: 0, priceFullGallery: 0,
    watermark: true, downloadRes: "choice", proofingEnabled: false,
    template: "minimal", layout: "masonry", welcomeMessage: "Sarah & James — thank you for a beautiful day. Browse and select your 30 favorites.", showUpsellBanner: false,
    ...DEFAULT_BRANDING, logoText: "S&J",
  },
  {
    id: "dp2", title: "Commercial Shoot", client: "Nike Brand",
    status: "draft", photoCount: 84, photoSeeds: [22,23,24,25,26,27,28,29], coverSeed: 402, coverUrl: "",
    views: 0, lastViewed: null, createdAt: "Apr 8, 2026", expiresAt: null,
    passwordEnabled: false, password: "", whitelistEnabled: true, whitelist: ["brand@nike.com", "creative@nike.com"],
    mode: "gift", selectionLimit: 0, pricePerPhoto: 0, priceFullGallery: 0,
    watermark: false, downloadRes: "full", proofingEnabled: true,
    template: "vogue", layout: "grid", welcomeMessage: "Here are the final assets from the Spring '26 campaign.", showUpsellBanner: false,
    ...DEFAULT_BRANDING, logoText: "STUDIO",
  },
  {
    id: "dp3", title: "Portrait Session", client: "Emma K.",
    status: "expired", photoCount: 48, photoSeeds: [30,31,32,33,34,35], coverSeed: 403, coverUrl: "",
    views: 34, lastViewed: "3 days ago", createdAt: "Mar 1, 2026", expiresAt: "Apr 1, 2026",
    passwordEnabled: false, password: "", whitelistEnabled: false, whitelist: [],
    mode: "direct", selectionLimit: 0, pricePerPhoto: 12, priceFullGallery: 399,
    watermark: true, downloadRes: "full", proofingEnabled: false,
    template: "minimal", layout: "grid", welcomeMessage: "Hi Emma! Your portraits are ready. Purchase individual photos or grab the full set.", showUpsellBanner: true,
    ...DEFAULT_BRANDING, logoText: "EMMA K.",
  },
  {
    id: "dp4", title: "Album Cover Shoot", client: "Morrison Photo",
    status: "active", photoCount: 24, photoSeeds: [10,11,12,13,14,15,16,17,18,19,20,21], coverSeed: 10, coverUrl: "",
    views: 47, lastViewed: "yesterday", createdAt: "Apr 12, 2026", expiresAt: "Jun 12, 2026",
    passwordEnabled: true,  password: "morrison2026", whitelistEnabled: false, whitelist: [],
    mode: "direct", selectionLimit: 0, pricePerPhoto: 0, priceFullGallery: 0,
    watermark: false, downloadRes: "full", proofingEnabled: false,
    template: "brooklyn", layout: "grid", welcomeMessage: "Final selects from the album cover shoot.", showUpsellBanner: false,
    ...DEFAULT_BRANDING, logoText: "MORRISON",
  },
];

export const DEFAULT_PAGE: Omit<DeliveryPage, "id" | "title" | "client" | "createdAt"> = {
  status: "draft", photoCount: 0, photoSeeds: [], coverSeed: 404, coverUrl: "",
  views: 0, lastViewed: null, expiresAt: null,
  passwordEnabled: false, password: "", whitelistEnabled: false, whitelist: [],
  mode: "gift", selectionLimit: 20, pricePerPhoto: 15, priceFullGallery: 299,
  watermark: true, downloadRes: "full", proofingEnabled: false,
  template: "minimal", layout: "grid", welcomeMessage: "", showUpsellBanner: true,
  ...DEFAULT_BRANDING,
};

export const DELIVERY_FONTS: { label: string; value: string }[] = [
  { label: "Inter",         value: "Inter, sans-serif" },
  { label: "DM Sans",       value: "'DM Sans', sans-serif" },
  { label: "Playfair",      value: "'Playfair Display', serif" },
  { label: "Cormorant",     value: "'Cormorant Garamond', serif" },
  { label: "Space Grotesk", value: "'Space Grotesk', sans-serif" },
  { label: "Manrope",       value: "Manrope, sans-serif" },
  { label: "DM Serif",      value: "'DM Serif Display', serif" },
  { label: "Archivo",       value: "Archivo, sans-serif" },
];

export const TEMPLATES: { id: TemplateName; label: string; desc: string; accent: string; fg: string; sub: string }[] = [
  { id: "minimal",  label: "Minimal",  desc: "Clean white space, serif typography, subtle grid",         accent: "#f5f5f5", fg: "#111111", sub: "#888888" },
  { id: "vogue",    label: "Vogue",    desc: "High-contrast black, bold editorial headlines",            accent: "#111111", fg: "#ffffff", sub: "#666666" },
  { id: "brooklyn", label: "Brooklyn", desc: "Urban dark theme with red accents and Space Grotesk type", accent: "#0D0D0D", fg: "#F0EFE9", sub: "#7A7A7A" },
];

export const TEMPLATE_STYLES: Record<TemplateName, { bg: string; fg: string; muted: string; accent: string; btnBg: string; btnFg: string }> = {
  minimal:  { bg: "#ffffff", fg: "#111111", muted: "#888888", accent: "#f5f5f5", btnBg: "#111111", btnFg: "#ffffff" },
  vogue:    { bg: "#0a0a0a", fg: "#ffffff", muted: "#888888", accent: "#1a1a1a", btnBg: "#ffffff", btnFg: "#000000" },
  brooklyn: { bg: "#0D0D0D", fg: "#F0EFE9", muted: "#7A7A7A", accent: "#161616", btnBg: "#E8382C", btnFg: "#0D0D0D" },
};

export const STATUS_META: Record<DeliveryStatus, { dot: string; text: string; label: string }> = {
  active:  { dot: "bg-green-400",         text: "text-green-400",          label: "Active"  },
  draft:   { dot: "bg-[var(--fg-muted)]", text: "text-[var(--fg-muted)]",  label: "Draft"   },
  expired: { dot: "bg-red-400",           text: "text-red-400",            label: "Expired" },
};

export function effectiveStyle(p: DeliveryPage): { bg: string; fg: string; muted: string; accent: string; btnBg: string; btnFg: string } {
  const t = TEMPLATE_STYLES[p.template];
  if (!p.customColors) return t;
  return { bg: p.colorBg, fg: p.colorFg, muted: t.muted, accent: p.colorAccent, btnBg: p.colorBtnBg, btnFg: p.colorBtnFg };
}
