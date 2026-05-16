/* Links data — types, defaults, fonts.
   Mirrors the canonical pattern used by delivery (lib/delivery/data.ts):
   a single LinksPage shape that the editor reads/writes via Zustand and the
   templates consume via a `page` prop. */

export type LinkType   = "link" | "divider" | "whatsapp" | "instagram" | "email" | "delivery";
export type BgType     = "solid" | "gradient" | "image";
export type BtnShape   = "square" | "rounded" | "pill";
export type BtnVariant = "filled" | "outline" | "glass";
export type LinksTemplateName = "brooklyn" | "halcyon";

export interface LinkItem {
  id:       string;
  type:     LinkType;
  title:    string;
  url:      string;
  enabled:  boolean;
  icon:     string;
  // whatsapp
  waCountry?: string;
  waPhone?:   string;
  waMessage?: string;
  // instagram
  igUsername?: string;
  // email
  emailAddress?: string;
  emailSubject?: string;
}

export interface LinksPage {
  id:           string;
  template:     LinksTemplateName;

  // Profile
  displayName:  string;
  bio:          string;
  avatarUrl:    string;
  avatarBg:     string;
  avatarInitial: string;

  // Links list
  links:        LinkItem[];

  // Background
  bgType:           BgType;
  bgColor:          string;
  bgGradFrom:       string;
  bgGradTo:         string;
  bgGradAngle:      number;
  bgImageUrl:       string;
  bgOverlayColor:   string;
  bgOverlayOpacity: number;

  // Buttons
  btnShape:    BtnShape;
  btnVariant:  BtnVariant;
  btnBg:       string;
  btnText:     string;
  btnBorder:   string;

  // Typography
  fontFamily:  string;
  fontWeight:  string;
  textColor:   string;
  subColor:    string;

  /** Free-form per-template labels (e.g. brooklyn marquee text, profession line,
   *  stats labels). Templates read with a fallback; empty string hides. */
  labels:      Record<string, string>;

  createdAt:   string;
}

/* Each font: label shown in UI, CSS font-family value, Google Fonts API name */
export const LINKS_FONTS: { label: string; value: string; gfName: string }[] = [
  { label: "Inter",              value: "Inter, sans-serif",            gfName: "Inter" },
  { label: "DM Sans",            value: "'DM Sans', sans-serif",        gfName: "DM Sans" },
  { label: "Poppins",            value: "Poppins, sans-serif",          gfName: "Poppins" },
  { label: "Outfit",             value: "Outfit, sans-serif",           gfName: "Outfit" },
  { label: "Nunito",             value: "Nunito, sans-serif",           gfName: "Nunito" },
  { label: "Montserrat",         value: "Montserrat, sans-serif",       gfName: "Montserrat" },
  { label: "Work Sans",          value: "'Work Sans', sans-serif",      gfName: "Work Sans" },
  { label: "Josefin Sans",       value: "'Josefin Sans', sans-serif",   gfName: "Josefin Sans" },
  { label: "Raleway",            value: "Raleway, sans-serif",          gfName: "Raleway" },
  { label: "Playfair Display",   value: "'Playfair Display', serif",    gfName: "Playfair Display" },
  { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif",  gfName: "Cormorant Garamond" },
  { label: "Lora",               value: "Lora, serif",                  gfName: "Lora" },
  { label: "Cinzel",             value: "Cinzel, serif",                gfName: "Cinzel" },
  { label: "Space Grotesk",      value: "'Space Grotesk', sans-serif",  gfName: "Space Grotesk" },
  { label: "Space Mono",         value: "'Space Mono', monospace",      gfName: "Space Mono" },
  { label: "DM Serif Display",   value: "'DM Serif Display', serif",    gfName: "DM Serif Display" },
  { label: "Source Code Pro",    value: "'Source Code Pro', monospace", gfName: "Source Code Pro" },
  { label: "Bebas Neue",         value: "'Bebas Neue', sans-serif",     gfName: "Bebas Neue" },
];

export const FONT_WEIGHTS: { label: string; value: string }[] = [
  { label: "Light",     value: "300" },
  { label: "Regular",   value: "400" },
  { label: "Medium",    value: "500" },
  { label: "Semibold",  value: "600" },
  { label: "Bold",      value: "700" },
  { label: "Extrabold", value: "800" },
];

export const LINKS_TEMPLATES: { id: LinksTemplateName; label: string; desc: string; accent: string }[] = [
  { id: "brooklyn", label: "Brooklyn", desc: "Urban dark theme with red accent, marquee strip, italic serif name", accent: "#E8382C" },
  { id: "halcyon",  label: "Halcyon",  desc: "Warm dark editorial, italic display, ember-orange accent",           accent: "#C2410C" },
];

/* Resolve the actual href for a link, based on its type. Lets the templates
   ignore type-specific URL plumbing — they just call effectiveLinkUrl(item)
   and get a ready-to-click string. */
export function effectiveLinkUrl(link: LinkItem): string {
  switch (link.type) {
    case "whatsapp": {
      const phone = `${link.waCountry ?? ""}${(link.waPhone ?? "").replace(/\D/g, "")}`;
      if (!phone) return link.url || "";
      const msg = link.waMessage ? `?text=${encodeURIComponent(link.waMessage)}` : "";
      return `https://wa.me/${phone}${msg}`;
    }
    case "instagram":
      if (link.igUsername) return `https://instagram.com/${link.igUsername.replace(/^@/, "")}`;
      return link.url || "";
    case "email": {
      if (!link.emailAddress) return link.url || "";
      const subj = link.emailSubject ? `?subject=${encodeURIComponent(link.emailSubject)}` : "";
      return `mailto:${link.emailAddress}${subj}`;
    }
    default:
      return link.url || "";
  }
}

export const DEFAULT_LINKS: LinkItem[] = [
  { id: "1", type: "link", title: "Portfolio website", url: "https://sofia.frame.so",              enabled: true,  icon: "globe"    },
  { id: "2", type: "link", title: "Instagram",         url: "https://instagram.com/sofiachenphoto", enabled: true,  icon: "ig"       },
  { id: "3", type: "link", title: "Book a session",    url: "https://sofia.frame.so/book",          enabled: true,  icon: "calendar" },
  { id: "4", type: "link", title: "Print shop",        url: "https://sofia.frame.so/prints",        enabled: false, icon: "shop"     },
];

export const DEFAULT_PAGE: LinksPage = {
  id:           "default",
  template:     "brooklyn",
  displayName:  "Sofia Chen",
  bio:          "Fine art & portrait photographer · Buenos Aires",
  avatarUrl:    "",
  avatarBg:     "#fad502",
  avatarInitial: "S",
  links:        DEFAULT_LINKS,
  bgType:       "solid",
  bgColor:      "#0D0D0D",
  bgGradFrom:   "#111111",
  bgGradTo:     "#333333",
  bgGradAngle:  135,
  bgImageUrl:       "",
  bgOverlayColor:   "#000000",
  bgOverlayOpacity: 0.4,
  btnShape:     "square",
  btnVariant:   "outline",
  btnBg:        "#161616",
  btnText:      "#F0EFE9",
  btnBorder:    "#1F1F1F",
  fontFamily:   "'Space Grotesk', sans-serif",
  fontWeight:   "400",
  textColor:    "#F0EFE9",
  subColor:     "#7A7A7A",
  labels:       {},
  createdAt:    "Apr 2026",
};
