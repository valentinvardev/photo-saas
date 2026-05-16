/* Delivery data — types, constants, defaults */

export type DeliveryMode    = "gift" | "direct" | "selection";
export type LayoutStyle     = "grid" | "masonry";
export type TemplateName    = "minimal" | "vogue" | "brooklyn" | "halcyon";
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
  /**
   * Typography slots — each template renders its display, body and mono
   * elements using slots 1/2/3 respectively. Empty string = use the
   * template's built-in default for that slot.
   *
   * `fontFamily` is the legacy single-font field kept for store migration;
   * new code reads `fontFamily1/2/3`.
   */
  fontFamily:       string;
  fontFamily1:      string;  // display / headings (template's serif or display sans)
  fontFamily2:      string;  // body (template's body sans)
  fontFamily3:      string;  // mono / labels (template's monospace)
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
  fontFamily1: "",
  fontFamily2: "",
  fontFamily3: "",
};

/* Cover URLs lifted from the actual template asset banks so each
   example card looks like a real shoot from that template, not a
   random placeholder. */
const HALCYON_WEDDING_COVER  = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=70";
const HALCYON_PORTRAIT_COVER = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=70";
const BROOKLYN_COVER_DARK    = "https://picsum.photos/seed/10/1200/800";

export const INITIAL_PAGES: DeliveryPage[] = [
  {
    id: "dp1", title: "Wedding Gallery", client: "Margot & Auden",
    status: "active", photoCount: 247, photoSeeds: [10,11,12,13,14,15,16,17,18,19,20,21], coverSeed: 401, coverUrl: HALCYON_WEDDING_COVER,
    views: 12, lastViewed: "2 hours ago", createdAt: "Apr 2, 2026", expiresAt: "May 2, 2026",
    passwordEnabled: true,  password: "lisbon", whitelistEnabled: false, whitelist: [],
    mode: "selection", selectionLimit: 30, pricePerPhoto: 0, priceFullGallery: 0,
    watermark: true, downloadRes: "choice", proofingEnabled: false,
    template: "halcyon", layout: "masonry", welcomeMessage: "Margot & Auden — thank you for a beautiful day. Browse and pick your 30 favorites.", showUpsellBanner: false,
    ...DEFAULT_BRANDING, logoText: "HALCYON",
  },
  {
    id: "dp2", title: "Album Cover Shoot", client: "Morrison Photo",
    status: "active", photoCount: 24, photoSeeds: [10,11,12,13,14,15,16,17,18,19,20,21], coverSeed: 10, coverUrl: BROOKLYN_COVER_DARK,
    views: 47, lastViewed: "yesterday", createdAt: "Apr 12, 2026", expiresAt: "Jun 12, 2026",
    passwordEnabled: true,  password: "morrison2026", whitelistEnabled: false, whitelist: [],
    mode: "direct", selectionLimit: 0, pricePerPhoto: 0, priceFullGallery: 0,
    watermark: false, downloadRes: "full", proofingEnabled: false,
    template: "brooklyn", layout: "grid", welcomeMessage: "Final selects from the album cover shoot.", showUpsellBanner: false,
    ...DEFAULT_BRANDING, logoText: "MORRISON",
  },
  {
    id: "dp3", title: "Portrait Session", client: "Emma K.",
    status: "active", photoCount: 48, photoSeeds: [30,31,32,33,34,35], coverSeed: 403, coverUrl: HALCYON_PORTRAIT_COVER,
    views: 34, lastViewed: "3 days ago", createdAt: "Apr 1, 2026", expiresAt: "May 1, 2026",
    passwordEnabled: false, password: "", whitelistEnabled: false, whitelist: [],
    mode: "direct", selectionLimit: 0, pricePerPhoto: 12, priceFullGallery: 399,
    watermark: true, downloadRes: "full", proofingEnabled: false,
    template: "halcyon", layout: "masonry", welcomeMessage: "Hi Emma! Your portraits are ready. Purchase individual photos or grab the full set.", showUpsellBanner: true,
    ...DEFAULT_BRANDING, logoText: "EMMA K.",
  },
  {
    id: "dp4", title: "Halberg & Park — Wedding", client: "Halberg & Park",
    status: "draft", photoCount: 124, photoSeeds: [10, 71, 82, 93, 100, 111, 144, 155], coverSeed: 401, coverUrl: "https://picsum.photos/seed/82/1200/800",
    views: 0, lastViewed: null, createdAt: "Apr 8, 2026", expiresAt: null,
    passwordEnabled: true, password: "halberg", whitelistEnabled: false, whitelist: [],
    mode: "selection", selectionLimit: 40, pricePerPhoto: 0, priceFullGallery: 0,
    watermark: true, downloadRes: "choice", proofingEnabled: false,
    template: "minimal", layout: "grid", welcomeMessage: "A small selection from your day. Pick your 40 favourites — we'll print them.", showUpsellBanner: false,
    ...DEFAULT_BRANDING, logoText: "STUDIO MN",
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
  { id: "halcyon",  label: "Halcyon",  desc: "Magazine-paced warm dark gallery with curtain reveal and sectioned chapters", accent: "#C2410C", fg: "#EFEAE0", sub: "#8A8378" },
  { id: "brooklyn", label: "Brooklyn", desc: "Urban dark theme with red accents and Space Grotesk type",                    accent: "#E8382C", fg: "#F0EFE9", sub: "#7A7A7A" },
  { id: "minimal",  label: "Minimal",  desc: "Clean white space, serif typography, subtle grid",                            accent: "#f5f5f5", fg: "#111111", sub: "#888888" },
  { id: "vogue",    label: "Vogue",    desc: "High-contrast black, bold editorial headlines",                               accent: "#111111", fg: "#ffffff", sub: "#666666" },
];

export const TEMPLATE_STYLES: Record<TemplateName, { bg: string; fg: string; muted: string; accent: string; btnBg: string; btnFg: string }> = {
  halcyon:  { bg: "#0E0D0B", fg: "#EFEAE0", muted: "#8A8378", accent: "#C2410C", btnBg: "#C2410C", btnFg: "#EFEAE0" },
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
