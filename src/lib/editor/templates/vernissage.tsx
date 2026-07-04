import type { EditorNode } from "../types";
import type { SectionDef } from "./types";

/* ─── Icons ─── */
function NavIcon()    { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>; }
function HeroIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="18" height="10" rx="1"/><path d="M3 17h18M7 21h10"/></svg>; }
function CubeIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>; }
function UserIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function MailIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>; }
function FooterIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M3 7h18M3 12h18M3 17h8"/></svg>; }

export const VERNISSAGE_NODES: Record<string, EditorNode> = {
  /* Nav */
  "vrn-nav-brand":     { id: "vrn-nav-brand",     type: "logo",      content: "VERNISSAGE" },
  "vrn-nav-item-1":    { id: "vrn-nav-item-1",    type: "paragraph", content: "Exhibition" },
  "vrn-nav-item-2":    { id: "vrn-nav-item-2",    type: "paragraph", content: "Artist" },
  "vrn-nav-item-3":    { id: "vrn-nav-item-3",    type: "paragraph", content: "Contact" },
  "vrn-nav-cta":       { id: "vrn-nav-cta",       type: "paragraph", content: "Private view" },

  /* Hero — exhibition poster */
  "vrn-hero-eyebrow":  { id: "vrn-hero-eyebrow",  type: "paragraph", content: "Solo exhibition · Room 1" },
  "vrn-hero-title":    { id: "vrn-hero-title",    type: "heading",   content: "Opening<br/><em>Night</em>" },
  "vrn-hero-dates":    { id: "vrn-hero-dates",    type: "paragraph", content: "12 Sep · Doors 19:00 — late" },
  "vrn-hero-sub":      { id: "vrn-hero-sub",      type: "paragraph", content: "Twelve photographs, hung for one night. The room is dark, the works are lit — walk through and let each piece take the wall in front of you." },
  "vrn-hero-cta":      { id: "vrn-hero-cta",      type: "paragraph", content: "Enter the gallery" },

  /* Gallery (3D showcase) */
  "vrn-gallery-label": { id: "vrn-gallery-label", type: "paragraph", content: "The exhibition" },
  "vrn-gallery-note":  { id: "vrn-gallery-note",  type: "paragraph", content: "Wall text — swipe or use the arrows. Each photograph takes the wall in front of you; click the frontal piece to view it up close." },
  "vrn-endwall-title": { id: "vrn-endwall-title", type: "heading",   content: "The collection<br/><em>continues.</em>" },
  "vrn-endwall-cta":   { id: "vrn-endwall-cta",   type: "paragraph", content: "View all work" },

  /* About */
  "vrn-about-label":   { id: "vrn-about-label",   type: "paragraph", content: "The artist" },
  "vrn-about-image":   { id: "vrn-about-image",   type: "image",     src: "https://picsum.photos/seed/823/900/1150", alt: "Portrait" },
  "vrn-about-heading": { id: "vrn-about-heading", type: "heading",   content: "Hanging a room is<br/><em>an argument.</em>" },
  "vrn-about-body":    { id: "vrn-about-body",    type: "paragraph", content: "I build exhibitions, not feeds. Each series is sequenced like a room — an opening piece, a long middle wall, a closing image you carry home. Commissions follow the same discipline: fewer photographs, hung with intention." },
  "vrn-stat-1-value":  { id: "vrn-stat-1-value",  type: "paragraph", content: "14" },
  "vrn-stat-1-label":  { id: "vrn-stat-1-label",  type: "paragraph", content: "Exhibitions" },
  "vrn-stat-2-value":  { id: "vrn-stat-2-value",  type: "paragraph", content: "9" },
  "vrn-stat-2-label":  { id: "vrn-stat-2-label",  type: "paragraph", content: "Cities" },
  "vrn-stat-3-value":  { id: "vrn-stat-3-value",  type: "paragraph", content: "300+" },
  "vrn-stat-3-label":  { id: "vrn-stat-3-label",  type: "paragraph", content: "Works placed" },

  /* Contact */
  "vrn-contact-label":    { id: "vrn-contact-label",    type: "paragraph", content: "Contact" },
  "vrn-contact-heading":  { id: "vrn-contact-heading",  type: "heading",   content: "Request a<br/><em>private view.</em>" },
  "vrn-contact-body":     { id: "vrn-contact-body",     type: "paragraph", content: "For commissions, print sales and exhibition loans. Tell me about the walls you have in mind." },
  "vrn-contact-d1-label": { id: "vrn-contact-d1-label", type: "paragraph", content: "Studio" },
  "vrn-contact-d1-value": { id: "vrn-contact-d1-value", type: "paragraph", content: "studio@vernissage.photo" },
  "vrn-contact-d2-label": { id: "vrn-contact-d2-label", type: "paragraph", content: "Phone" },
  "vrn-contact-d2-value": { id: "vrn-contact-d2-value", type: "paragraph", content: "+34 600 000 000" },
  "vrn-contact-d3-label": { id: "vrn-contact-d3-label", type: "paragraph", content: "Gallery" },
  "vrn-contact-d3-value": { id: "vrn-contact-d3-value", type: "paragraph", content: "C. de la Palma 24, Madrid — by appointment" },

  /* Footer */
  "vrn-footer-brand":  { id: "vrn-footer-brand",  type: "logo",      content: "VERNISSAGE" },
  "vrn-footer-copy":   { id: "vrn-footer-copy",   type: "paragraph", content: "© 2025 Vernissage — all works" },
};

export const VERNISSAGE_SECTIONS: SectionDef[] = [
  { id: "section-nav", label: "Navigation", icon: <NavIcon />, locked: true,
    elements: [
      { nodeId: "vrn-nav-brand",  label: "Logo",   type: "text" },
      { nodeId: "vrn-nav-item-1", label: "Link 1", type: "text" },
      { nodeId: "vrn-nav-item-2", label: "Link 2", type: "text" },
      { nodeId: "vrn-nav-item-3", label: "Link 3", type: "text" },
      { nodeId: "vrn-nav-cta",    label: "Button", type: "text" },
    ] },
  { id: "vrn-hero", label: "Poster", icon: <HeroIcon />, locked: false,
    elements: [
      { nodeId: "vrn-hero-eyebrow", label: "Eyebrow",  type: "text" },
      { nodeId: "vrn-hero-title",   label: "Title",    type: "text" },
      { nodeId: "vrn-hero-dates",   label: "Dates",    type: "text" },
      { nodeId: "vrn-hero-sub",     label: "Statement", type: "text" },
      { nodeId: "vrn-hero-cta",     label: "Button",   type: "text" },
    ] },
  { id: "vrn-gallery", label: "3D Gallery", icon: <CubeIcon />, locked: false,
    elements: [
      { nodeId: "vrn-gallery-label", label: "Section label",   type: "text" },
      { nodeId: "vrn-gallery-note",  label: "Wall text",       type: "text" },
      { nodeId: "vrn-endwall-title", label: "Closing — title", type: "text" },
      { nodeId: "vrn-endwall-cta",   label: "Closing — button", type: "text" },
    ] },
  { id: "vrn-about", label: "Artist", icon: <UserIcon />, locked: false,
    elements: [
      { nodeId: "vrn-about-label",   label: "Section label", type: "text"  },
      { nodeId: "vrn-about-image",   label: "Portrait",      type: "image" },
      { nodeId: "vrn-about-heading", label: "Heading",       type: "text"  },
      { nodeId: "vrn-about-body",    label: "Bio",           type: "text"  },
      { nodeId: "vrn-stat-1-value",  label: "Stat 1 — val",  type: "text"  },
      { nodeId: "vrn-stat-1-label",  label: "Stat 1 — lbl",  type: "text"  },
      { nodeId: "vrn-stat-2-value",  label: "Stat 2 — val",  type: "text"  },
      { nodeId: "vrn-stat-2-label",  label: "Stat 2 — lbl",  type: "text"  },
      { nodeId: "vrn-stat-3-value",  label: "Stat 3 — val",  type: "text"  },
      { nodeId: "vrn-stat-3-label",  label: "Stat 3 — lbl",  type: "text"  },
    ] },
  { id: "vrn-contact", label: "Contact", icon: <MailIcon />, locked: false,
    elements: [
      { nodeId: "vrn-contact-label",    label: "Section label",  type: "text" },
      { nodeId: "vrn-contact-heading",  label: "Heading",        type: "text" },
      { nodeId: "vrn-contact-body",     label: "Body",           type: "text" },
      { nodeId: "vrn-contact-d1-label", label: "Detail 1 — lbl", type: "text" },
      { nodeId: "vrn-contact-d1-value", label: "Detail 1 — val", type: "text" },
      { nodeId: "vrn-contact-d2-label", label: "Detail 2 — lbl", type: "text" },
      { nodeId: "vrn-contact-d2-value", label: "Detail 2 — val", type: "text" },
      { nodeId: "vrn-contact-d3-label", label: "Detail 3 — lbl", type: "text" },
      { nodeId: "vrn-contact-d3-value", label: "Detail 3 — val", type: "text" },
    ] },
  { id: "section-footer", label: "Footer", icon: <FooterIcon />, locked: true,
    elements: [
      { nodeId: "vrn-footer-brand", label: "Logo",      type: "text" },
      { nodeId: "vrn-footer-copy",  label: "Copyright", type: "text" },
    ] },
];
