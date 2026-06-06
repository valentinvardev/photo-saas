import type { EditorNode } from "../types";
import type { SectionDef } from "./types";

/* ─── Icons ─── */
function NavIcon()    { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>; }
function HeroIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="18" height="10" rx="1"/><path d="M3 17h18M7 21h10"/></svg>; }
function GridIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>; }
function QuoteIcon()  { return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>; }
function UserIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function PaperIcon()  { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8L2 8v12a2 2 0 002 2z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>; }
function MailIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>; }
function FooterIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M3 7h18M3 12h18M3 17h8"/></svg>; }

export const MINIMAL_BW_NODES: Record<string, EditorNode> = {
  "nav-logo":         { id: "nav-logo",         type: "logo",      content: "J·H" },
  // Container node — holds no text itself; selecting it sets the font size for
  // all the nav links at once (links inherit font-size from it).
  "nav-links":        { id: "nav-links",        type: "paragraph", content: "" },
  "nav-item-1":       { id: "nav-item-1",       type: "paragraph", content: "Work" },
  "nav-item-2":       { id: "nav-item-2",       type: "paragraph", content: "About" },
  "nav-item-3":       { id: "nav-item-3",       type: "paragraph", content: "Press" },
  "nav-item-4":       { id: "nav-item-4",       type: "paragraph", content: "Contact" },
  "nav-cta":          { id: "nav-cta",          type: "paragraph", content: "Hire me" },

  "hero-eyebrow":     { id: "hero-eyebrow",     type: "paragraph", content: "Documentary & Portrait · New York" },
  "hero-heading":     { id: "hero-heading",     type: "heading",   content: "James<br/><em>Hollis</em>" },
  "hero-sub":         { id: "hero-sub",         type: "paragraph", content: "Documenting the quiet tension between presence and absence. Work exhibited across North America and Europe." },
  "hero-avail":       { id: "hero-avail",       type: "paragraph", content: "Available for commissions — Q4 2025" },
  "hero-image-1":     { id: "hero-image-1",     type: "image",     src: "https://picsum.photos/seed/201/900/1100?grayscale", alt: "" },
  "hero-image-2":     { id: "hero-image-2",     type: "image",     src: "https://picsum.photos/seed/202/900/700?grayscale",  alt: "" },

  "quote-eyebrow":    { id: "quote-eyebrow",    type: "paragraph", content: "On practice" },
  "quote-text":       { id: "quote-text",       type: "paragraph", content: "“The camera is an instrument that teaches people how to see without a camera.”" },
  "quote-author":     { id: "quote-author",     type: "paragraph", content: "— Dorothea Lange" },

  "about-heading":    { id: "about-heading",    type: "heading",   content: "A career built on<br/><em>patience</em>" },
  "about-body-1":     { id: "about-body-1",     type: "paragraph", content: "James Hollis is a New York-based documentary and portrait photographer with over a decade of work spanning editorial commissions, personal projects, and exhibition photography." },
  "about-body-2":     { id: "about-body-2",     type: "paragraph", content: "His long-form projects explore the intersection of memory, geography, and identity — often through extended collaborations with communities in transition." },
  "about-image":      { id: "about-image",      type: "image",     src: "https://picsum.photos/seed/1084/600/750?grayscale", alt: "James Hollis" },
  "about-caption":    { id: "about-caption",    type: "paragraph", content: "Brooklyn, NY · 2024" },
  "stat-1-value":     { id: "stat-1-value",     type: "paragraph", content: "14"   },
  "stat-1-label":     { id: "stat-1-label",     type: "paragraph", content: "Years" },
  "stat-2-value":     { id: "stat-2-value",     type: "paragraph", content: "280+" },
  "stat-2-label":     { id: "stat-2-label",     type: "paragraph", content: "Projects" },
  "stat-3-value":     { id: "stat-3-value",     type: "paragraph", content: "9"    },
  "stat-3-label":     { id: "stat-3-label",     type: "paragraph", content: "Cities" },

  "press-1":          { id: "press-1",          type: "paragraph", content: "The New Yorker" },
  "press-1-year":     { id: "press-1-year",     type: "paragraph", content: "2023" },
  "press-2":          { id: "press-2",          type: "paragraph", content: "Aperture" },
  "press-2-year":     { id: "press-2-year",     type: "paragraph", content: "2022" },
  "press-3":          { id: "press-3",          type: "paragraph", content: "Foam Magazine" },
  "press-3-year":     { id: "press-3-year",     type: "paragraph", content: "2022" },
  "press-4":          { id: "press-4",          type: "paragraph", content: "Zeit Magazin" },
  "press-4-year":     { id: "press-4-year",     type: "paragraph", content: "2021" },
  "press-5":          { id: "press-5",          type: "paragraph", content: "LensCulture" },
  "press-5-year":     { id: "press-5-year",     type: "paragraph", content: "2020" },

  "contact-heading":  { id: "contact-heading",  type: "heading",   content: "Let’s create<br/><em>something.</em>" },
  "contact-body":     { id: "contact-body",     type: "paragraph", content: "For editorial commissions, exhibition inquiries, and long-form project proposals." },

  "footer-copyright": { id: "footer-copyright", type: "paragraph", content: "© 2025 James Hollis Photography" },
};

export const MINIMAL_BW_SECTIONS: SectionDef[] = [
  { id: "section-nav", label: "Navigation", icon: <NavIcon />, locked: true,
    elements: [
      { nodeId: "nav-logo",   label: "Logo",            type: "text" },
      { nodeId: "nav-links",  label: "Links (size)",    type: "text" },
      { nodeId: "nav-item-1", label: "Link 1",          type: "text" },
      { nodeId: "nav-item-2", label: "Link 2",          type: "text" },
      { nodeId: "nav-item-3", label: "Link 3",          type: "text" },
      { nodeId: "nav-item-4", label: "Link 4",          type: "text" },
      { nodeId: "nav-cta",    label: "Button",          type: "text" },
    ] },
  { id: "section-hero", label: "Hero", icon: <HeroIcon />, locked: false,
    elements: [
      { nodeId: "hero-eyebrow",  label: "Eyebrow",       type: "text"  },
      { nodeId: "hero-heading",  label: "Heading",       type: "text"  },
      { nodeId: "hero-sub",      label: "Subtitle",      type: "text"  },
      { nodeId: "hero-avail",    label: "Availability",  type: "text"  },
      { nodeId: "hero-image-1",  label: "Main image",    type: "image" },
      { nodeId: "hero-image-2",  label: "Second image",  type: "image" },
    ] },
  { id: "work", label: "Work", icon: <GridIcon />, locked: false, elements: [] },
  { id: "section-quote", label: "Quote", icon: <QuoteIcon />, locked: false,
    elements: [
      { nodeId: "quote-eyebrow", label: "Eyebrow", type: "text" },
      { nodeId: "quote-text",    label: "Quote",   type: "text" },
      { nodeId: "quote-author",  label: "Author",  type: "text" },
    ] },
  { id: "about", label: "About", icon: <UserIcon />, locked: false,
    elements: [
      { nodeId: "about-heading",  label: "Heading",     type: "text"  },
      { nodeId: "about-body-1",   label: "Paragraph 1", type: "text"  },
      { nodeId: "about-body-2",   label: "Paragraph 2", type: "text"  },
      { nodeId: "stat-1-value",   label: "Stat 1 — val", type: "text" },
      { nodeId: "stat-1-label",   label: "Stat 1 — lbl", type: "text" },
      { nodeId: "stat-2-value",   label: "Stat 2 — val", type: "text" },
      { nodeId: "stat-2-label",   label: "Stat 2 — lbl", type: "text" },
      { nodeId: "stat-3-value",   label: "Stat 3 — val", type: "text" },
      { nodeId: "stat-3-label",   label: "Stat 3 — lbl", type: "text" },
      { nodeId: "about-image",    label: "Portrait",    type: "image" },
      { nodeId: "about-caption",  label: "Caption",     type: "text"  },
    ] },
  { id: "press", label: "Press", icon: <PaperIcon />, locked: false,
    elements: [
      { nodeId: "press-1",      label: "Publication 1", type: "text" },
      { nodeId: "press-1-year", label: "Year 1",        type: "text" },
      { nodeId: "press-2",      label: "Publication 2", type: "text" },
      { nodeId: "press-2-year", label: "Year 2",        type: "text" },
      { nodeId: "press-3",      label: "Publication 3", type: "text" },
      { nodeId: "press-3-year", label: "Year 3",        type: "text" },
      { nodeId: "press-4",      label: "Publication 4", type: "text" },
      { nodeId: "press-4-year", label: "Year 4",        type: "text" },
      { nodeId: "press-5",      label: "Publication 5", type: "text" },
      { nodeId: "press-5-year", label: "Year 5",        type: "text" },
    ] },
  { id: "contact", label: "Contact", icon: <MailIcon />, locked: false,
    elements: [
      { nodeId: "contact-heading", label: "Heading", type: "text" },
      { nodeId: "contact-body",    label: "Body",    type: "text" },
    ] },
  { id: "section-footer", label: "Footer", icon: <FooterIcon />, locked: true,
    elements: [
      { nodeId: "nav-logo",          label: "Logo",      type: "text" },
      { nodeId: "footer-copyright",  label: "Copyright", type: "text" },
    ] },
];
