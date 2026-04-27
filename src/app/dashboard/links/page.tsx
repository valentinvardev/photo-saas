"use client";

import { useState, useCallback, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════════════════ */

interface LinkItem {
  id: string;
  type: "link" | "divider" | "whatsapp" | "instagram" | "email" | "delivery";
  title: string;
  url: string;
  enabled: boolean;
  icon: string;
  // whatsapp
  waCountry?: string;
  waPhone?: string;
  waMessage?: string;
  // instagram
  igUsername?: string;
  // email
  emailAddress?: string;
  emailSubject?: string;
}

type BgType     = "solid" | "gradient" | "image";
type BtnShape   = "square" | "rounded" | "pill";
type BtnVariant = "filled" | "outline" | "glass";

interface PageConfig {
  displayName:   string;
  bio:           string;
  avatarUrl:     string;
  avatarBg:      string;
  avatarInitial: string;
  bgType:        BgType;
  bgColor:       string;
  bgGradFrom:    string;
  bgGradTo:      string;
  bgGradAngle:   number;
  bgImageUrl:        string;
  bgOverlayColor:    string;
  bgOverlayOpacity:  number;
  btnShape:      BtnShape;
  btnVariant:    BtnVariant;
  btnBg:         string;
  btnText:       string;
  btnBorder:     string;
  fontFamily:    string;
  fontWeight:    string;
  textColor:     string;
  subColor:      string;
}

/* ══════════════════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════════════════ */

/* Each entry: label shown in UI, CSS font-family value, Google Fonts API name */
const FONTS: { label: string; value: string; gfName: string }[] = [
  { label: "Inter",              value: "Inter, sans-serif",                  gfName: "Inter" },
  { label: "DM Sans",            value: "'DM Sans', sans-serif",              gfName: "DM Sans" },
  { label: "Poppins",            value: "Poppins, sans-serif",                gfName: "Poppins" },
  { label: "Outfit",             value: "Outfit, sans-serif",                 gfName: "Outfit" },
  { label: "Nunito",             value: "Nunito, sans-serif",                 gfName: "Nunito" },
  { label: "Montserrat",         value: "Montserrat, sans-serif",             gfName: "Montserrat" },
  { label: "Work Sans",          value: "'Work Sans', sans-serif",            gfName: "Work Sans" },
  { label: "Josefin Sans",       value: "'Josefin Sans', sans-serif",         gfName: "Josefin Sans" },
  { label: "Raleway",            value: "Raleway, sans-serif",                gfName: "Raleway" },
  { label: "Playfair Display",   value: "'Playfair Display', serif",          gfName: "Playfair Display" },
  { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif",        gfName: "Cormorant Garamond" },
  { label: "Lora",               value: "Lora, serif",                        gfName: "Lora" },
  { label: "Cinzel",             value: "Cinzel, serif",                      gfName: "Cinzel" },
  { label: "Space Mono",         value: "'Space Mono', monospace",            gfName: "Space Mono" },
  { label: "Source Code Pro",    value: "'Source Code Pro', monospace",       gfName: "Source Code Pro" },
  { label: "Bebas Neue",         value: "'Bebas Neue', sans-serif",           gfName: "Bebas Neue" },
];

const FONT_WEIGHTS: { label: string; value: string }[] = [
  { label: "Light",      value: "300" },
  { label: "Regular",    value: "400" },
  { label: "Medium",     value: "500" },
  { label: "Semibold",   value: "600" },
  { label: "Bold",       value: "700" },
  { label: "Extrabold",  value: "800" },
];

type ThemePreset = { name: string; previewBg: string; config: Partial<PageConfig> };

const THEMES: ThemePreset[] = [
  {
    name: "Dark", previewBg: "#111111",
    config: { bgType: "solid", bgColor: "#111111", btnShape: "rounded", btnVariant: "outline",
      btnBg: "#111111", btnText: "#ffffff", btnBorder: "#ffffff",
      textColor: "#ffffff", subColor: "#999999", fontFamily: "Inter, sans-serif", fontWeight: "400" },
  },
  {
    name: "Light", previewBg: "#f8f8f8",
    config: { bgType: "solid", bgColor: "#f8f8f8", btnShape: "pill", btnVariant: "filled",
      btnBg: "#111111", btnText: "#ffffff", btnBorder: "#111111",
      textColor: "#111111", subColor: "#666666", fontFamily: "Inter, sans-serif", fontWeight: "400" },
  },
  {
    name: "Sunset", previewBg: "linear-gradient(135deg,#f5a623,#d0021b)",
    config: { bgType: "gradient", bgGradFrom: "#f5a623", bgGradTo: "#d0021b", bgGradAngle: 135,
      btnShape: "pill", btnVariant: "glass", btnBg: "#f5a623", btnText: "#ffffff", btnBorder: "rgba(255,255,255,0.4)",
      textColor: "#ffffff", subColor: "rgba(255,255,255,0.75)", fontFamily: "Raleway, sans-serif", fontWeight: "600" },
  },
  {
    name: "Ocean", previewBg: "linear-gradient(160deg,#0f2027,#2980b9)",
    config: { bgType: "gradient", bgGradFrom: "#0f2027", bgGradTo: "#2980b9", bgGradAngle: 160,
      btnShape: "rounded", btnVariant: "glass", btnBg: "#2980b9", btnText: "#ffffff", btnBorder: "rgba(255,255,255,0.3)",
      textColor: "#ffffff", subColor: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif", fontWeight: "500" },
  },
  {
    name: "Rose", previewBg: "linear-gradient(135deg,#fce4ec,#f48fb1)",
    config: { bgType: "gradient", bgGradFrom: "#fce4ec", bgGradTo: "#f48fb1", bgGradAngle: 135,
      btnShape: "pill", btnVariant: "filled", btnBg: "#e91e63", btnText: "#ffffff", btnBorder: "#e91e63",
      textColor: "#880e4f", subColor: "#ad1457", fontFamily: "Lora, serif", fontWeight: "400" },
  },
  {
    name: "Forest", previewBg: "#1a2e1a",
    config: { bgType: "solid", bgColor: "#1a2e1a", btnShape: "square", btnVariant: "filled",
      btnBg: "#2d5a2d", btnText: "#e8f5e9", btnBorder: "#4caf50",
      textColor: "#e8f5e9", subColor: "#a5d6a7", fontFamily: "Lora, serif", fontWeight: "400" },
  },
  {
    name: "Midnight", previewBg: "linear-gradient(180deg,#0a0a1a,#1a1a3e)",
    config: { bgType: "gradient", bgGradFrom: "#0a0a1a", bgGradTo: "#1a1a3e", bgGradAngle: 180,
      btnShape: "pill", btnVariant: "filled", btnBg: "#7c3aed", btnText: "#ffffff", btnBorder: "#7c3aed",
      textColor: "#ffffff", subColor: "#a78bfa", fontFamily: "Poppins, sans-serif", fontWeight: "600" },
  },
  {
    name: "Sand", previewBg: "#fafaf9",
    config: { bgType: "solid", bgColor: "#fafaf9", btnShape: "rounded", btnVariant: "outline",
      btnBg: "#fafaf9", btnText: "#292524", btnBorder: "#d6d3d1",
      textColor: "#292524", subColor: "#78716c", fontFamily: "Poppins, sans-serif", fontWeight: "400" },
  },
];

const DEFAULT_LINKS: LinkItem[] = [
  { id: "1", type: "link",    title: "Portfolio website",  url: "https://sofia.frame.so",               enabled: true,  icon: "globe"  },
  { id: "2", type: "link",    title: "Instagram",          url: "https://instagram.com/sofiachenphoto",  enabled: true,  icon: "ig"     },
  { id: "3", type: "link",    title: "Book a session",     url: "https://sofia.frame.so/book",           enabled: true,  icon: "calendar" },
  { id: "4", type: "link",    title: "Print shop",         url: "https://sofia.frame.so/prints",         enabled: false, icon: "shop"   },
];

const DEFAULT_CONFIG: PageConfig = {
  displayName:   "Sofia Chen",
  bio:           "Fine art & portrait photographer · Buenos Aires",
  avatarUrl:     "",
  avatarBg:      "#fad502",
  avatarInitial: "S",
  bgType:        "solid",
  bgColor:       "#111111",
  bgGradFrom:    "#111111",
  bgGradTo:      "#333333",
  bgGradAngle:   135,
  bgImageUrl:        "",
  bgOverlayColor:    "#000000",
  bgOverlayOpacity:  0.4,
  btnShape:      "rounded",
  btnVariant:    "outline",
  btnBg:         "#111111",
  btnText:       "#ffffff",
  btnBorder:     "#ffffff",
  fontFamily:    "Inter, sans-serif",
  fontWeight:    "400",
  textColor:     "#ffffff",
  subColor:      "#999999",
};

/* ══════════════════════════════════════════════════════════════════════════
   GOOGLE FONT LOADER
   Injects a <link> into <head> for the currently selected font.
══════════════════════════════════════════════════════════════════════════ */

function GoogleFontLoader({ fontFamily }: { fontFamily: string }) {
  useEffect(() => {
    const entry = FONTS.find((f) => f.value === fontFamily);
    if (!entry) return;

    const id = `gf-${entry.gfName.replace(/\s/g, "-").toLowerCase()}`;
    if (document.getElementById(id)) return;

    const link = document.createElement("link");
    link.id   = id;
    link.rel  = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${entry.gfName.replace(/ /g, "+")}:wght@300;400;500;600;700;800&display=swap`;
    document.head.appendChild(link);
  }, [fontFamily]);

  return null;
}

/* ══════════════════════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════════════════════ */

function DragDots() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="5" cy="4"  r="1.4"/><circle cx="11" cy="4"  r="1.4"/>
      <circle cx="5" cy="8"  r="1.4"/><circle cx="11" cy="8"  r="1.4"/>
      <circle cx="5" cy="12" r="1.4"/><circle cx="11" cy="12" r="1.4"/>
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  );
}
function ChevUp() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  );
}
function ChevDown() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  );
}
function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}
function DividerIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SMART LINK HELPERS
══════════════════════════════════════════════════════════════════════════ */

const COUNTRY_CODES = [
  { code: "54",  label: "Argentina (+54)"  },
  { code: "1",   label: "USA / Canada (+1)" },
  { code: "55",  label: "Brasil (+55)"     },
  { code: "34",  label: "España (+34)"     },
  { code: "52",  label: "México (+52)"     },
  { code: "57",  label: "Colombia (+57)"   },
  { code: "56",  label: "Chile (+56)"      },
  { code: "598", label: "Uruguay (+598)"   },
  { code: "595", label: "Paraguay (+595)"  },
  { code: "51",  label: "Perú (+51)"       },
  { code: "44",  label: "UK (+44)"         },
  { code: "49",  label: "Germany (+49)"    },
  { code: "33",  label: "France (+33)"     },
  { code: "39",  label: "Italy (+39)"      },
];

const LINK_ICONS: { id: string; label: string; svg: React.ReactNode }[] = [
  { id: "link",     label: "Link",      svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg> },
  { id: "globe",    label: "Website",   svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
  { id: "camera",   label: "Camera",    svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg> },
  { id: "calendar", label: "Calendar",  svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id: "shop",     label: "Shop",      svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> },
  { id: "mail",     label: "Email",     svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg> },
  { id: "phone",    label: "Phone",     svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg> },
  { id: "ig",       label: "Instagram", svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> },
  { id: "wa",       label: "WhatsApp",  svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg> },
  { id: "yt",       label: "YouTube",   svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg> },
  { id: "tt",       label: "TikTok",    svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></svg> },
  { id: "x",        label: "X",         svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
];

function getLinkIcon(iconId: string, size = 14): React.ReactNode {
  const found = LINK_ICONS.find((i) => i.id === iconId);
  if (!found) return LINK_ICONS[0]!.svg;
  // Re-clone with size
  return found.svg;
}

function buildLinkUrl(link: LinkItem): string {
  if (link.type === "whatsapp") {
    const phone = (link.waCountry ?? "54") + (link.waPhone ?? "").replace(/\D/g, "");
    if (!phone) return "";
    const msg = link.waMessage ? `?text=${encodeURIComponent(link.waMessage)}` : "";
    return `https://wa.me/${phone}${msg}`;
  }
  if (link.type === "instagram") {
    const user = (link.igUsername ?? "").replace(/^@/, "");
    return user ? `https://instagram.com/${user}` : "";
  }
  if (link.type === "email") {
    if (!link.emailAddress) return "";
    const sub = link.emailSubject ? `?subject=${encodeURIComponent(link.emailSubject)}` : "";
    return `mailto:${link.emailAddress}${sub}`;
  }
  return link.url;
}

const SMART_TYPES: {
  type: LinkItem["type"];
  label: string;
  description: string;
  defaultIcon: string;
  disabled?: boolean;
  color: string;
  svg: React.ReactNode;
}[] = [
  {
    type: "link", label: "Custom link", description: "Any URL",
    defaultIcon: "link", color: "#444",
    svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  },
  {
    type: "whatsapp", label: "WhatsApp", description: "Phone + optional message",
    defaultIcon: "wa", color: "#22c55e",
    svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>,
  },
  {
    type: "instagram", label: "Instagram", description: "@username",
    defaultIcon: "ig", color: "#e1306c",
    svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>,
  },
  {
    type: "email", label: "Email", description: "Address + optional subject",
    defaultIcon: "mail", color: "#3b82f6",
    svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>,
  },
  {
    type: "delivery", label: "Delivery page", description: "Link a client gallery",
    defaultIcon: "camera", color: "#666", disabled: true,
    svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>,
  },
];

/* ══════════════════════════════════════════════════════════════════════════
   GALLERY PICKER MODAL
══════════════════════════════════════════════════════════════════════════ */

const GALLERY_SEEDS = [
  20, 37, 48, 63, 71, 82, 95, 108, 133, 145, 156, 167,
  201, 202, 210, 220, 230, 240, 250, 300, 42, 55, 77, 99,
];

function GalleryPickerModal({
  value,
  onSelect,
  onClose,
}: {
  value: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(value);
  const [tab, setTab] = useState<"gallery" | "url">("gallery");
  const [urlDraft, setUrlDraft] = useState(value);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploaded((prev) => [url, ...prev]);
    setSelected(url);
    e.target.value = "";
  }

  const allPhotos = [
    ...uploaded,
    ...GALLERY_SEEDS.map((s) => `https://picsum.photos/seed/${s}/800/800`),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[700px] h-[480px] bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] shrink-0">
          <span className="font-mono text-xs text-[var(--fg-muted)] uppercase tracking-widest">Select image</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: gallery */}
          <div className="w-[360px] border-r border-[var(--border)] flex flex-col">
            <div className="flex border-b border-[var(--border)] shrink-0">
              {(["gallery", "url"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 font-sans text-xs py-2.5 capitalize transition-colors border-b-2 -mb-px ${
                    tab === t ? "border-yellow text-[var(--fg)]" : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {tab === "gallery" ? (
                <>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full mb-3 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:border-yellow hover:text-yellow transition-colors font-sans text-xs"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                    Upload photo
                  </button>
                  <div className="grid grid-cols-4 gap-2">
                    {allPhotos.map((url, i) => {
                      const isActive = selected === url;
                      return (
                        <div
                          key={i}
                          onClick={() => setSelected(url)}
                          className={`aspect-square overflow-hidden rounded-lg cursor-pointer relative border-2 transition-all ${
                            isActive ? "border-yellow" : "border-transparent hover:border-[var(--fg-muted)]"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          {isActive && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-yellow rounded-full flex items-center justify-center">
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <input
                    value={urlDraft}
                    onChange={(e) => setUrlDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && urlDraft.trim()) setSelected(urlDraft.trim()); }}
                    placeholder="https://..."
                    className="w-full font-mono text-xs text-[var(--fg)] bg-[var(--bg-subtle)] rounded-lg px-3 py-2 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
                  />
                  <button
                    onClick={() => { if (urlDraft.trim()) setSelected(urlDraft.trim()); }}
                    className="w-full rounded-lg border border-[var(--border)] py-2 font-sans text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
                  >
                    Use URL
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: preview */}
          <div className="flex-1 flex flex-col p-4 gap-3">
            <div className="flex-1 bg-[var(--bg-subtle)] rounded-xl flex items-center justify-center overflow-hidden">
              {selected ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected} alt="" className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="font-mono text-xs text-[var(--fg-muted)]">No image selected</span>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                disabled={!selected}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--border)] font-sans text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2v14a2 2 0 002 2h14M18 22V8a2 2 0 00-2-2H2"/></svg>
                Crop
              </button>
              <button
                onClick={() => { if (selected) { onSelect(selected); onClose(); } }}
                disabled={!selected}
                className="flex-[2] py-2 rounded-xl bg-yellow text-[#111] font-sans font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SMALL HELPERS
══════════════════════════════════════════════════════════════════════════ */

function AvatarPhotoButton({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(true)}
          className="flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors font-sans text-xs"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          {value ? "Change photo" : "Upload photo"}
        </button>
        {value && (
          <button
            onClick={() => onChange("")}
            className="font-mono text-[10px] text-[var(--fg-muted)] hover:text-red-400 transition-colors"
          >
            Remove
          </button>
        )}
      </div>
      {open && <GalleryPickerModal value={value} onSelect={onChange} onClose={() => setOpen(false)} />}
    </>
  );
}

function BgImageButton({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex items-center gap-2">
        {value && (
          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-[var(--border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <button
          onClick={() => setOpen(true)}
          className="flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:border-yellow hover:text-yellow transition-colors font-sans text-xs"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          {value ? "Change background" : "Select from gallery"}
        </button>
      </div>
      {open && <GalleryPickerModal value={value} onSelect={onChange} onClose={() => setOpen(false)} />}
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-muted)] mb-2.5">
      {children}
    </p>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-center gap-2">
      <span className="font-sans text-xs text-[var(--fg-muted)] flex-1 truncate">{label}</span>
      <div className="flex items-center gap-1.5 border border-[var(--border)] rounded-lg px-2 py-1 hover:border-[var(--fg-muted)] transition-colors cursor-pointer" onClick={() => inputRef.current?.click()}>
        <div className="relative w-4 h-4 shrink-0">
          <div className="w-4 h-4 rounded border border-black/10" style={{ background: value }} />
          <input
            ref={inputRef}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ position: "absolute", top: 0, left: 0, width: 1, height: 1, opacity: 0, border: "none", padding: 0, cursor: "pointer" }}
          />
        </div>
        <span className="font-mono text-[11px] text-[var(--fg)] w-14 select-none">{value}</span>
      </div>
    </div>
  );
}

/* Fixed toggle: w-9 (36px) container, w-4 (16px) ball.
   Unchecked: ball at x=2px. Checked: 36-16-2=18px → translate-x-[18px] */
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      style={{
        position:        "relative",
        display:         "inline-flex",
        flexShrink:      0,
        width:           36,
        height:          20,
        borderRadius:    9999,
        border:          checked ? "none" : "1px solid var(--border)",
        padding:         0,
        cursor:          "pointer",
        backgroundColor: checked ? "#fad502" : "var(--bg-subtle)",
        transition:      "background-color 150ms",
      }}
    >
      <span
        style={{
          position:        "absolute",
          top:             2,
          left:            checked ? 18 : 2,
          width:           16,
          height:          16,
          borderRadius:    "50%",
          backgroundColor: checked ? "#111111" : "var(--fg-muted)",
          boxShadow:       "0 1px 3px rgba(0,0,0,0.25)",
          transition:      "left 150ms, background-color 150ms",
          pointerEvents:   "none",
        }}
      />
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LINKS TAB  –  with real HTML5 drag-and-drop
══════════════════════════════════════════════════════════════════════════ */

function LinksTab({
  links,
  setLinks,
}: {
  links: LinkItem[];
  setLinks: React.Dispatch<React.SetStateAction<LinkItem[]>>;
}) {
  const [editingId,    setEditingId]    = useState<string | null>(null);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState<string | null>(null);
  const [dragId,       setDragId]       = useState<string | null>(null);
  const [dragOverId,   setDragOverId]   = useState<string | null>(null);
  const dragSide = useRef<"top" | "bottom">("bottom");

  /* ── mutations ── */
  const addLink = (type: LinkItem["type"] = "link") => {
    const smartType = SMART_TYPES.find((t) => t.type === type);
    const id = `lnk-${Date.now()}`;
    setLinks((p) => [...p, {
      id, type, title: smartType?.label ?? "New link",
      url: "", enabled: true, icon: smartType?.defaultIcon ?? "link",
    }]);
    setEditingId(id);
    setShowTypePicker(false);
  };
  const addDivider = () =>
    setLinks((p) => [...p, { id: `div-${Date.now()}`, type: "divider", title: "Section", url: "", enabled: true, icon: "" }]);
  const remove = (id: string) => setLinks((p) => p.filter((l) => l.id !== id));
  const toggle = (id: string) => setLinks((p) => p.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
  const patch = (id: string, changes: Partial<LinkItem>) =>
    setLinks((p) => p.map((l) => (l.id === id ? { ...l, ...changes } : l)));
  const moveUp = (idx: number) =>
    setLinks((p) => {
      if (idx === 0) return p;
      const a = [...p];
      const t = a[idx - 1]!; a[idx - 1] = a[idx]!; a[idx] = t;
      return a;
    });
  const moveDown = (idx: number) =>
    setLinks((p) => {
      if (idx >= p.length - 1) return p;
      const a = [...p];
      const t = a[idx]!; a[idx] = a[idx + 1]!; a[idx + 1] = t;
      return a;
    });

  /* ── drag handlers ── */
  const onDragStart = (e: React.DragEvent, id: string) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    // ghost image transparency
    const el = e.currentTarget as HTMLElement;
    e.dataTransfer.setDragImage(el, el.offsetWidth / 2, 20);
  };

  const onDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    // determine side
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragSide.current = e.clientY < rect.top + rect.height / 2 ? "top" : "bottom";
    setDragOverId(id);
  };

  const onDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) { reset(); return; }
    setLinks((p) => {
      const from = p.findIndex((l) => l.id === dragId);
      const to   = p.findIndex((l) => l.id === targetId);
      if (from === -1 || to === -1) return p;
      const a = [...p];
      const [item] = a.splice(from, 1);
      const insertAt = dragSide.current === "top"
        ? (to > from ? to - 1 : to)
        : (to < from ? to + 1 : to);
      a.splice(insertAt, 0, item!);
      return a;
    });
    reset();
  };

  const reset = () => { setDragId(null); setDragOverId(null); };

  return (
    <div className="flex flex-col gap-3">
      {/* Add buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowTypePicker((v) => !v)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed font-sans text-xs font-medium transition-colors ${showTypePicker ? "border-yellow text-yellow" : "border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)]"}`}
        >
          <PlusIcon /> Add link
        </button>
        <button
          onClick={addDivider}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-dashed border-[var(--border)] font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
        >
          <DividerIcon /> Divider
        </button>
      </div>

      {/* Type picker */}
      {showTypePicker && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3 flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] mb-1">Choose type</span>
          {SMART_TYPES.map((t) => (
            <button
              key={t.type}
              disabled={t.disabled}
              onClick={() => addLink(t.type)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${t.disabled ? "opacity-35 cursor-not-allowed" : "hover:bg-[var(--bg-subtle)]"}`}
            >
              <span style={{ color: t.color }}>{t.svg}</span>
              <div className="flex-1 min-w-0">
                <span className="font-sans text-xs font-medium text-[var(--fg)] block">{t.label}</span>
                <span className="font-mono text-[10px] text-[var(--fg-muted)]">{t.description}</span>
              </div>
              {t.disabled && <span className="font-mono text-[9px] bg-[var(--bg-subtle)] text-[var(--fg-muted)] px-1.5 py-0.5 rounded tracking-wider uppercase">Soon</span>}
            </button>
          ))}
        </div>
      )}

      {/* Items */}
      <div className="flex flex-col gap-1.5">
        {links.map((link, idx) => {
          const isDragging  = dragId     === link.id;
          const isDragOver  = dragOverId === link.id && dragId !== link.id;

          return (
            <div
              key={link.id}
              draggable
              onDragStart={(e) => onDragStart(e, link.id)}
              onDragOver={(e)  => onDragOver(e, link.id)}
              onDrop={(e)      => onDrop(e, link.id)}
              onDragEnd={reset}
              className={[
                "rounded-xl border bg-[var(--bg)] transition-all select-none",
                isDragging ? "opacity-40 scale-[0.98]" : "opacity-100",
                isDragOver
                  ? "border-yellow shadow-[0_0_0_1px_var(--color-yellow)]"
                  : "border-[var(--border)]",
                !link.enabled && !isDragging ? "opacity-50" : "",
              ].join(" ")}
            >
              {link.type === "divider" ? (
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <span className="text-[var(--fg-muted)] cursor-grab active:cursor-grabbing shrink-0"><DragDots /></span>
                  <input
                    value={link.title}
                    onChange={(e) => patch(link.id, { title: e.target.value })}
                    className="flex-1 min-w-0 font-sans text-xs text-[var(--fg-muted)] italic bg-transparent outline-none"
                    placeholder="Section label"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => moveUp(idx)}     className="p-0.5 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"><ChevUp /></button>
                    <button onClick={() => moveDown(idx)}   className="p-0.5 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"><ChevDown /></button>
                    <button onClick={() => remove(link.id)} className="p-0.5 text-[var(--fg-muted)] hover:text-red-400 transition-colors"><TrashIcon /></button>
                  </div>
                </div>
              ) : (
                <div className="px-3 py-2.5">
                  <div className="flex items-start gap-2">
                    <span className="text-[var(--fg-muted)] cursor-grab active:cursor-grabbing shrink-0 mt-1"><DragDots /></span>

                    <div className="flex-1 min-w-0">
                      {editingId === link.id ? (
                        <div className="flex flex-col gap-2">
                          {/* Title + icon row */}
                          <div className="flex gap-1.5">
                            {/* Icon picker trigger */}
                            <button
                              onClick={() => setShowIconPicker(showIconPicker === link.id ? null : link.id)}
                              className={`shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${showIconPicker === link.id ? "border-yellow text-yellow bg-yellow/10" : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)]"}`}
                            >
                              {getLinkIcon(link.icon)}
                            </button>
                            <input
                              autoFocus
                              value={link.title}
                              onChange={(e) => patch(link.id, { title: e.target.value })}
                              className="flex-1 font-sans text-sm font-medium text-[var(--fg)] bg-[var(--bg-subtle)] rounded-lg px-2.5 py-1.5 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
                              placeholder="Link title"
                            />
                          </div>

                          {/* Icon picker grid */}
                          {showIconPicker === link.id && (
                            <div className="grid grid-cols-6 gap-1 p-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)]">
                              {LINK_ICONS.map((ic) => (
                                <button
                                  key={ic.id}
                                  onClick={() => { patch(link.id, { icon: ic.id }); setShowIconPicker(null); }}
                                  title={ic.label}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${link.icon === ic.id ? "bg-yellow/15 text-yellow" : "text-[var(--fg-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--fg)]"}`}
                                >
                                  {ic.svg}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Smart inputs by type */}
                          {link.type === "link" && (
                            <input
                              value={link.url}
                              onChange={(e) => patch(link.id, { url: e.target.value })}
                              className="w-full font-mono text-xs text-[var(--fg-muted)] bg-[var(--bg-subtle)] rounded-lg px-2.5 py-1.5 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
                              placeholder="https://"
                            />
                          )}
                          {link.type === "whatsapp" && (
                            <div className="flex flex-col gap-1.5">
                              <div className="flex gap-1.5">
                                <select
                                  value={link.waCountry ?? "54"}
                                  onChange={(e) => patch(link.id, { waCountry: e.target.value })}
                                  className="font-mono text-xs text-[var(--fg)] bg-[var(--bg-subtle)] rounded-lg px-2 py-1.5 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
                                >
                                  {COUNTRY_CODES.map((c) => (
                                    <option key={c.code} value={c.code}>{c.label}</option>
                                  ))}
                                </select>
                                <input
                                  value={link.waPhone ?? ""}
                                  onChange={(e) => patch(link.id, { waPhone: e.target.value.replace(/\D/g, "") })}
                                  className="flex-1 font-mono text-xs text-[var(--fg-muted)] bg-[var(--bg-subtle)] rounded-lg px-2.5 py-1.5 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
                                  placeholder="Phone number"
                                />
                              </div>
                              <input
                                value={link.waMessage ?? ""}
                                onChange={(e) => patch(link.id, { waMessage: e.target.value })}
                                className="w-full font-mono text-xs text-[var(--fg-muted)] bg-[var(--bg-subtle)] rounded-lg px-2.5 py-1.5 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
                                placeholder="Pre-filled message (optional)"
                              />
                              {link.waPhone && (
                                <p className="font-mono text-[10px] text-[var(--fg-muted)] truncate">
                                  wa.me/{link.waCountry ?? "54"}{link.waPhone}
                                </p>
                              )}
                            </div>
                          )}
                          {link.type === "instagram" && (
                            <div>
                              <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono text-xs text-[var(--fg-muted)]">@</span>
                                <input
                                  value={link.igUsername ?? ""}
                                  onChange={(e) => patch(link.id, { igUsername: e.target.value.replace(/^@/, "") })}
                                  className="w-full font-mono text-xs text-[var(--fg-muted)] bg-[var(--bg-subtle)] rounded-lg pl-6 pr-2.5 py-1.5 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
                                  placeholder="username"
                                />
                              </div>
                              {link.igUsername && (
                                <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-1">instagram.com/{link.igUsername}</p>
                              )}
                            </div>
                          )}
                          {link.type === "email" && (
                            <div className="flex flex-col gap-1.5">
                              <input
                                value={link.emailAddress ?? ""}
                                onChange={(e) => patch(link.id, { emailAddress: e.target.value })}
                                className="w-full font-mono text-xs text-[var(--fg-muted)] bg-[var(--bg-subtle)] rounded-lg px-2.5 py-1.5 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
                                placeholder="email@example.com"
                                type="email"
                              />
                              <input
                                value={link.emailSubject ?? ""}
                                onChange={(e) => patch(link.id, { emailSubject: e.target.value })}
                                className="w-full font-mono text-xs text-[var(--fg-muted)] bg-[var(--bg-subtle)] rounded-lg px-2.5 py-1.5 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
                                placeholder="Subject (optional)"
                              />
                            </div>
                          )}

                          <button
                            onClick={() => { setEditingId(null); setShowIconPicker(null); }}
                            className="self-start font-sans text-xs text-yellow hover:opacity-80 transition-opacity"
                          >
                            Done
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setEditingId(link.id)} className="text-left w-full group flex items-center gap-2">
                          <span className="text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors shrink-0">
                            {getLinkIcon(link.icon)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-sans text-sm font-medium text-[var(--fg)] group-hover:text-yellow transition-colors leading-tight truncate">
                              {link.title || "Untitled"}
                            </div>
                            <div className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5 truncate">
                              {buildLinkUrl(link) || "Not configured"}
                            </div>
                          </div>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0 mt-0.5">
                      <Toggle checked={link.enabled} onChange={() => toggle(link.id)} />
                      <button onClick={() => moveUp(idx)}     className="p-0.5 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"><ChevUp /></button>
                      <button onClick={() => moveDown(idx)}   className="p-0.5 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"><ChevDown /></button>
                      <button onClick={() => remove(link.id)} className="p-0.5 text-[var(--fg-muted)] hover:text-red-400 transition-colors"><TrashIcon /></button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {links.length === 0 && (
        <p className="text-center py-10 font-sans text-xs text-[var(--fg-muted)]">
          No links yet. Add your first one above.
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   APPEARANCE TAB
══════════════════════════════════════════════════════════════════════════ */

function AppearanceTab({ config, setConfig }: { config: PageConfig; setConfig: React.Dispatch<React.SetStateAction<PageConfig>> }) {
  const set = useCallback(
    <K extends keyof PageConfig>(key: K, value: PageConfig[K]) =>
      setConfig((prev) => ({ ...prev, [key]: value })),
    [setConfig],
  );

  return (
    <div className="flex flex-col gap-6">

      {/* ── Profile ── */}
      <div>
        <SectionLabel>Profile</SectionLabel>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {/* Avatar preview */}
            <div
              className="w-12 h-12 rounded-full shrink-0 border-2 border-[var(--border)] overflow-hidden flex items-center justify-center font-sans font-black text-xl text-[#111]"
              style={{ background: config.avatarUrl ? "transparent" : config.avatarBg }}
            >
              {config.avatarUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={config.avatarUrl} alt="" className="w-full h-full object-cover" />
                : config.avatarInitial
              }
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              {/* Photo button */}
              <AvatarPhotoButton value={config.avatarUrl} onChange={(url) => set("avatarUrl", url)} />
              {!config.avatarUrl && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-xs text-[var(--fg-muted)] w-10 shrink-0">Initial</span>
                    <input
                      value={config.avatarInitial}
                      onChange={(e) => set("avatarInitial", e.target.value.slice(0, 2).toUpperCase())}
                      className="w-10 font-sans text-sm text-center font-bold text-[var(--fg)] bg-[var(--bg-subtle)] rounded-lg px-2 py-1 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
                    />
                  </div>
                  <ColorRow label="Color" value={config.avatarBg} onChange={(v) => set("avatarBg", v)} />
                </>
              )}
            </div>
          </div>
          <div>
            <span className="font-sans text-xs text-[var(--fg-muted)] block mb-1">Display name</span>
            <input
              value={config.displayName}
              onChange={(e) => set("displayName", e.target.value)}
              className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg-subtle)] rounded-lg px-3 py-2 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
            />
          </div>
          <div>
            <span className="font-sans text-xs text-[var(--fg-muted)] block mb-1">Bio</span>
            <textarea
              value={config.bio}
              onChange={(e) => set("bio", e.target.value)}
              rows={2}
              className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg-subtle)] rounded-lg px-3 py-2 outline-none border border-[var(--border)] focus:border-yellow transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* ── Background ── */}
      <div>
        <SectionLabel>Background</SectionLabel>
        <div className="flex gap-0.5 p-1 bg-[var(--bg-subtle)] rounded-xl mb-3">
          {(["solid", "gradient", "image"] as BgType[]).map((t) => (
            <button
              key={t}
              onClick={() => set("bgType", t)}
              className={`flex-1 font-sans text-xs py-1.5 rounded-lg capitalize transition-all ${
                config.bgType === t
                  ? "bg-[var(--bg-card)] text-[var(--fg)] shadow-sm font-medium"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {config.bgType === "solid" && (
          <ColorRow label="Color" value={config.bgColor} onChange={(v) => set("bgColor", v)} />
        )}
        {config.bgType === "gradient" && (
          <div className="flex flex-col gap-2">
            <ColorRow label="From" value={config.bgGradFrom} onChange={(v) => set("bgGradFrom", v)} />
            <ColorRow label="To"   value={config.bgGradTo}   onChange={(v) => set("bgGradTo",   v)} />
            <div className="flex items-center gap-2">
              <span className="font-sans text-xs text-[var(--fg-muted)] flex-1">Angle</span>
              <input
                type="range" min={0} max={360} value={config.bgGradAngle}
                onChange={(e) => set("bgGradAngle", Number(e.target.value))}
                className="w-24 accent-yellow"
              />
              <span className="font-mono text-xs text-[var(--fg)] w-8 text-right">{config.bgGradAngle}°</span>
            </div>
            <div
              className="h-7 rounded-lg"
              style={{ background: `linear-gradient(${config.bgGradAngle}deg, ${config.bgGradFrom}, ${config.bgGradTo})` }}
            />
          </div>
        )}
        {config.bgType === "image" && (
          <div className="flex flex-col gap-2">
            <BgImageButton value={config.bgImageUrl} onChange={(url) => set("bgImageUrl", url)} />
            <div className="flex flex-col gap-2 pt-1 border-t border-[var(--border)]">
              <span className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest">Overlay</span>
              <ColorRow label="Color" value={config.bgOverlayColor} onChange={(v) => set("bgOverlayColor", v)} />
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs text-[var(--fg-muted)] flex-1">Opacity</span>
                <input
                  type="range" min={0} max={1} step={0.05}
                  value={config.bgOverlayOpacity}
                  onChange={(e) => set("bgOverlayOpacity", Number(e.target.value))}
                  className="w-24 accent-yellow"
                />
                <span className="font-mono text-xs text-[var(--fg)] w-8 text-right">
                  {Math.round(config.bgOverlayOpacity * 100)}%
                </span>
              </div>
              {/* Overlay preview swatch */}
              <div
                className="h-6 rounded-lg border border-[var(--border)]"
                style={{ background: config.bgOverlayColor, opacity: config.bgOverlayOpacity }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Buttons ── */}
      <div>
        <SectionLabel>Buttons</SectionLabel>
        <div className="flex flex-col gap-3">
          {/* Shape */}
          <div>
            <span className="font-sans text-xs text-[var(--fg-muted)] block mb-2">Shape</span>
            <div className="flex gap-2">
              {(
                [
                  { value: "square",  label: "Square",  br: "0px"    },
                  { value: "rounded", label: "Rounded", br: "12px"   },
                  { value: "pill",    label: "Pill",    br: "9999px" },
                ] as { value: BtnShape; label: string; br: string }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set("btnShape", opt.value)}
                  className={`flex-1 py-2.5 border font-sans text-xs transition-all ${
                    config.btnShape === opt.value
                      ? "border-yellow bg-yellow/10 text-[var(--fg)] font-medium"
                      : "border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)]"
                  }`}
                  style={{ borderRadius: opt.br }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {/* Variant */}
          <div>
            <span className="font-sans text-xs text-[var(--fg-muted)] block mb-2">Style</span>
            <div className="flex gap-2">
              {(["filled", "outline", "glass"] as BtnVariant[]).map((v) => (
                <button
                  key={v}
                  onClick={() => set("btnVariant", v)}
                  className={`flex-1 py-2 rounded-xl border capitalize font-sans text-xs transition-all ${
                    config.btnVariant === v
                      ? "border-yellow bg-yellow/10 text-[var(--fg)] font-medium"
                      : "border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)]"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Colors ── */}
      <div>
        <SectionLabel>Colors</SectionLabel>
        <div className="flex flex-col gap-2.5">
          <ColorRow label="Button fill"   value={config.btnBg}     onChange={(v) => set("btnBg",     v)} />
          <ColorRow label="Button text"   value={config.btnText}   onChange={(v) => set("btnText",   v)} />
          <ColorRow label="Button border" value={config.btnBorder} onChange={(v) => set("btnBorder", v)} />
          <div className="h-px bg-[var(--border)] my-0.5" />
          <ColorRow label="Page text"     value={config.textColor} onChange={(v) => set("textColor", v)} />
          <ColorRow label="Subtext"       value={config.subColor}  onChange={(v) => set("subColor",  v)} />
        </div>
      </div>

      {/* ── Typography ── */}
      <div>
        <SectionLabel>Typography</SectionLabel>
        <div className="flex flex-col gap-2.5">
          <div>
            <span className="font-sans text-xs text-[var(--fg-muted)] block mb-1.5">Font family</span>
            <select
              value={config.fontFamily}
              onChange={(e) => set("fontFamily", e.target.value)}
              className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg-subtle)] rounded-lg px-3 py-2 outline-none border border-[var(--border)] focus:border-yellow transition-colors cursor-pointer"
            >
              {FONTS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <div>
            <span className="font-sans text-xs text-[var(--fg-muted)] block mb-1.5">Font weight</span>
            <div className="grid grid-cols-3 gap-1.5">
              {FONT_WEIGHTS.map((w) => (
                <button
                  key={w.value}
                  onClick={() => set("fontWeight", w.value)}
                  className={`py-1.5 rounded-lg border font-sans text-xs transition-all ${
                    config.fontWeight === w.value
                      ? "border-yellow bg-yellow/10 text-[var(--fg)]"
                      : "border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)]"
                  }`}
                  style={{ fontWeight: w.value }}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Themes ── */}
      <div>
        <SectionLabel>Themes</SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.name}
              onClick={() => setConfig((prev) => ({ ...prev, ...t.config }))}
              className="flex flex-col items-center gap-1.5 group"
              title={t.name}
            >
              <div
                className="w-full aspect-square rounded-xl border-2 border-transparent group-hover:border-yellow transition-all shadow-sm"
                style={{ background: t.previewBg }}
              />
              <span className="font-sans text-[9px] text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors w-full text-center truncate">
                {t.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PREVIEW
══════════════════════════════════════════════════════════════════════════ */

function getBgStyle(c: PageConfig): React.CSSProperties {
  if (c.bgType === "gradient")
    return { background: `linear-gradient(${c.bgGradAngle}deg, ${c.bgGradFrom}, ${c.bgGradTo})` };
  if (c.bgType === "image" && c.bgImageUrl)
    return { backgroundImage: `url(${c.bgImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" };
  return { background: c.bgColor };
}

function getBtnStyle(c: PageConfig): React.CSSProperties {
  /* square = 0, rounded = 14px, pill = 9999px */
  const radius =
    c.btnShape === "pill"    ? "9999px" :
    c.btnShape === "rounded" ? "14px"   : "0px";

  if (c.btnVariant === "outline")
    return { borderRadius: radius, background: "transparent", color: c.btnText, border: `1.5px solid ${c.btnBorder}` };
  if (c.btnVariant === "glass")
    return { borderRadius: radius, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", color: c.btnText, border: "1px solid rgba(255,255,255,0.25)" };
  return { borderRadius: radius, background: c.btnBg, color: c.btnText, border: "none" };
}

function LinkTreeView({ links, config }: { links: LinkItem[]; config: PageConfig }) {
  const enabled  = links.filter((l) => l.enabled);
  const btnStyle = getBtnStyle(config);

  return (
    <div
      className="w-full h-full overflow-y-auto relative"
      style={{ ...getBgStyle(config), fontFamily: config.fontFamily }}
    >
      {/* Overlay — only for image background */}
      {config.bgType === "image" && config.bgImageUrl && config.bgOverlayOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: config.bgOverlayColor, opacity: config.bgOverlayOpacity }}
        />
      )}
      <div className="relative flex flex-col items-center px-5 pt-10 pb-12 gap-4">
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shrink-0"
          style={{ background: config.avatarUrl ? "transparent" : config.avatarBg, color: "#111111", fontFamily: config.fontFamily, fontWeight: "800", fontSize: "1.5rem" }}
        >
          {config.avatarUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={config.avatarUrl} alt="" className="w-full h-full object-cover" />
            : config.avatarInitial
          }
        </div>
        {/* Name + bio */}
        <div className="text-center">
          <div style={{ color: config.textColor, fontWeight: config.fontWeight, fontSize: "15px", lineHeight: 1.3 }}>
            {config.displayName}
          </div>
          {config.bio && (
            <div style={{ color: config.subColor, fontSize: "11px", marginTop: "4px", lineHeight: 1.5 }}>
              {config.bio}
            </div>
          )}
        </div>
        {/* Links */}
        <div className="w-full flex flex-col gap-2.5 mt-1">
          {enabled.map((link) =>
            link.type === "divider" ? (
              <div key={link.id} className="flex items-center gap-2 py-0.5">
                <div className="flex-1 h-px" style={{ background: `${config.subColor}40` }} />
                {link.title && (
                  <span style={{ color: config.subColor, fontSize: "9px", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {link.title}
                  </span>
                )}
                <div className="flex-1 h-px" style={{ background: `${config.subColor}40` }} />
              </div>
            ) : (
              <div
                key={link.id}
                className="w-full py-3 px-4 flex items-center justify-center gap-1.5"
                style={{ ...btnStyle, fontSize: "12px", fontWeight: config.fontWeight }}
              >
                {link.icon && (
                  <span style={{ opacity: 0.75, display: "flex", alignItems: "center" }}>
                    {getLinkIcon(link.icon)}
                  </span>
                )}
                {link.title}
              </div>
            )
          )}
        </div>
        {/* Watermark */}
        <div style={{ marginTop: "16px", fontFamily: "Inter, sans-serif", fontWeight: 900, fontSize: "9px", letterSpacing: "0.15em", color: `${config.subColor}60` }}>
          FRAME
        </div>
      </div>
    </div>
  );
}

function PhoneShell({ links, config }: { links: LinkItem[]; config: PageConfig }) {
  return (
    <div className="relative" style={{ width: 280, height: 568 }}>
      <div className="absolute inset-0 rounded-[40px] shadow-2xl" style={{ background: "linear-gradient(145deg,#2a2a2a,#1a1a1a)" }} />
      <div className="absolute inset-[5px] rounded-[36px] bg-black overflow-hidden">
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pt-3 pb-1 pointer-events-none">
          <span style={{ fontFamily: "monospace", fontSize: "9px", fontWeight: "bold", color: "rgba(255,255,255,0.8)" }}>9:41</span>
          <div style={{ width: 80, height: 20, background: "#000", borderRadius: 9999 }} />
          <div className="flex items-center gap-1">
            <svg width="11" height="8" viewBox="0 0 24 18" fill="none">
              <path d="M1 1c6.1-1.3 15.9-1.3 22 0M5 6.5c3.9-.9 10.1-.9 14 0M9 12c2-.5 6-.5 8 0" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity={0.8}/>
            </svg>
            <svg width="18" height="9" viewBox="0 0 26 12" fill="none">
              <rect x="1" y="1" width="20" height="10" rx="2.5" stroke="white" strokeWidth="1.5" opacity={0.8}/>
              <rect x="3" y="3" width="14" height="6" rx="1.5" fill="white" opacity={0.8}/>
              <path d="M23 4v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity={0.8}/>
            </svg>
          </div>
        </div>
        <div className="absolute inset-0">
          <LinkTreeView links={links} config={config} />
        </div>
      </div>
      {/* Buttons */}
      <div className="absolute rounded-l-sm" style={{ left: -3.5, top: 100, width: 3.5, height: 32, background: "#333" }} />
      <div className="absolute rounded-l-sm" style={{ left: -3.5, top: 144, width: 3.5, height: 40, background: "#333" }} />
      <div className="absolute rounded-l-sm" style={{ left: -3.5, top: 196, width: 3.5, height: 40, background: "#333" }} />
      <div className="absolute rounded-r-sm" style={{ right: -3.5, top: 148, width: 3.5, height: 56, background: "#333" }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════ */

export default function LinksPage() {
  const [links,     setLinks]     = useState<LinkItem[]>(DEFAULT_LINKS);
  const [config,    setConfig]    = useState<PageConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<"links" | "appearance">("links");
  const [copied,    setCopied]    = useState(false);

  const publicUrl = "frame.so/@sofia";

  const copyUrl = () => {
    navigator.clipboard.writeText(`https://${publicUrl}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Load selected Google Font */}
      <GoogleFontLoader fontFamily={config.fontFamily} />

      <div className="flex flex-col h-full">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
          <div>
            <h1 className="font-sans font-bold text-lg text-[var(--fg)] leading-tight">Link Page</h1>
            <p className="font-mono text-xs text-[var(--fg-muted)] mt-0.5">{publicUrl}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyUrl}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-sans text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
            >
              <CopyIcon />
              {copied ? "Copied!" : "Copy link"}
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-sans text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
              <ExternalIcon /> Open
            </button>
            <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-yellow text-[#111] text-xs font-sans font-semibold hover:opacity-90 transition-opacity">
              Save changes
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left panel */}
          <div className="w-80 shrink-0 flex flex-col border-r border-[var(--border)] bg-[var(--bg-card)]">
            <div className="flex border-b border-[var(--border)] shrink-0">
              {(["links", "appearance"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 font-sans text-sm capitalize transition-all border-b-2 ${
                    activeTab === tab
                      ? "border-yellow text-[var(--fg)] font-semibold"
                      : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "links" ? (
                <LinksTab links={links} setLinks={setLinks} />
              ) : (
                <AppearanceTab config={config} setConfig={setConfig} />
              )}
            </div>
          </div>

          {/* Preview pane */}
          <div className="flex-1 flex items-center justify-center overflow-auto bg-[var(--bg)] relative">
            <div
              className="absolute inset-0 pointer-events-none opacity-60"
              style={{
                backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10 py-12">
              <PhoneShell links={links} config={config} />
              <p className="text-center font-mono text-[11px] text-[var(--fg-muted)] mt-5">{publicUrl}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
