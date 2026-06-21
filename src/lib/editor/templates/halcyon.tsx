import type { EditorNode } from "../types";
import type { SectionDef } from "./types";
import { HL_PHOTOS } from "~/lib/halcyon/data";

/* ─── Icons ─── */
function NavIcon()    { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>; }
function HeroIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="18" height="10" rx="1"/><path d="M3 17h18M7 21h10"/></svg>; }
function GridIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>; }
function StarIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 7 7 .5-5.5 4.5 2 7-6.5-4-6.5 4 2-7L2 9.5 9 9z"/></svg>; }
function UserIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function MailIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>; }
function FooterIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M3 7h18M3 12h18M3 17h8"/></svg>; }

export const HALCYON_NODES: Record<string, EditorNode> = {
  /* Nav wordmark */
  "hl-mark-name":      { id: "hl-mark-name",      type: "logo",      content: "Halcyon" },
  "hl-mark-sub":       { id: "hl-mark-sub",       type: "paragraph", content: "Studio · Lisbon" },

  /* Cover */
  "hl-cover-image":    { id: "hl-cover-image",    type: "image",     src: HL_PHOTOS.arch![0]!.src, alt: "" },
  "hl-cover-title":    { id: "hl-cover-title",    type: "heading",   content: "The light<br/>keeps <em>arriving.</em>" },

  /* Selected work */
  "hl-work-label":     { id: "hl-work-label",     type: "paragraph", content: "Selected Work" },
  "hl-viewall":        { id: "hl-viewall",        type: "paragraph", content: "View all works" },

  /* Archive banner */
  "hl-archive-eyebrow": { id: "hl-archive-eyebrow", type: "paragraph", content: "Browse the full archive" },
  "hl-archive-title":   { id: "hl-archive-title",   type: "heading",   content: "Every <em>photograph,</em><br/>in one room." },
  "hl-archive-sub":     { id: "hl-archive-sub",     type: "paragraph", content: "Twelve years of weddings, editorial and quiet rooms — gathered together. Open the archive and wander." },
  "hl-archive-cta":     { id: "hl-archive-cta",     type: "paragraph", content: "Open the archive" },

  /* About */
  "hl-about-label":    { id: "hl-about-label",    type: "paragraph", content: "About" },
  "hl-about-image":    { id: "hl-about-image",    type: "image",     src: HL_PHOTOS.portraits![2]!.src, alt: "Portrait" },
  "hl-about-heading":  { id: "hl-about-heading",  type: "heading",   content: "Pictures to <em>live with,</em><br/>not scroll past." },
  "hl-about-bio":      { id: "hl-about-bio",      type: "paragraph", content: "Lior Avni makes photographs that feel like memory — patient, slightly out of reach. Trained at the Royal Academy of Art, The Hague; working between Lisbon and New York since 2018. Editorial work for The Gentlewoman, Apartamento, Cereal. Private commissions for families, couples, and brands who want pictures to live with, not scroll past." },
  "hl-about-cta":      { id: "hl-about-cta",      type: "paragraph", content: "Contact" },

  /* Contact */
  "hl-contact-eyebrow": { id: "hl-contact-eyebrow", type: "paragraph", content: "Available for 2025 commissions" },
  "hl-contact-heading": { id: "hl-contact-heading", type: "heading",   content: "Begin a <em>conversation.</em>" },
  "hl-contact-tag":     { id: "hl-contact-tag",     type: "paragraph", content: "Tell me about the day, the room, the people. The best work always starts with a long letter and a slow reply." },

  /* Footer */
  "hl-footer-mark":    { id: "hl-footer-mark",    type: "logo",      content: "Halcyon<em> Studio</em>" },
  "hl-footer-copy":    { id: "hl-footer-copy",    type: "paragraph", content: "© 2024 · All photographs © Lior Avni" },
};

export const HALCYON_SECTIONS: SectionDef[] = [
  { id: "section-nav", label: "Navigation", icon: <NavIcon />, locked: true,
    elements: [
      { nodeId: "hl-mark-name", label: "Wordmark",  type: "text" },
      { nodeId: "hl-mark-sub",  label: "Subtitle",  type: "text" },
    ] },
  { id: "hl-cover", label: "Cover", icon: <HeroIcon />, locked: false,
    elements: [
      { nodeId: "hl-cover-image", label: "Cover image", type: "image" },
      { nodeId: "hl-cover-title", label: "Title",       type: "text"  },
    ] },
  { id: "hl-work", label: "Selected Work", icon: <GridIcon />, locked: false,
    elements: [
      { nodeId: "hl-work-label", label: "Section label",    type: "text" },
      { nodeId: "hl-viewall",    label: "View-all button",  type: "text" },
    ] },
  { id: "hl-archive", label: "Archive", icon: <StarIcon />, locked: false,
    elements: [
      { nodeId: "hl-archive-eyebrow", label: "Eyebrow",  type: "text" },
      { nodeId: "hl-archive-title",   label: "Heading",  type: "text" },
      { nodeId: "hl-archive-sub",     label: "Subtitle", type: "text" },
      { nodeId: "hl-archive-cta",     label: "Button",   type: "text" },
    ] },
  { id: "hl-about", label: "About", icon: <UserIcon />, locked: false,
    elements: [
      { nodeId: "hl-about-label",   label: "Section label", type: "text"  },
      { nodeId: "hl-about-image",   label: "Portrait",      type: "image" },
      { nodeId: "hl-about-heading", label: "Heading",       type: "text"  },
      { nodeId: "hl-about-bio",     label: "Bio",           type: "text"  },
      { nodeId: "hl-about-cta",     label: "Contact button", type: "text" },
    ] },
  { id: "contact", label: "Contact", icon: <MailIcon />, locked: false,
    elements: [
      { nodeId: "hl-contact-eyebrow", label: "Eyebrow",  type: "text" },
      { nodeId: "hl-contact-heading", label: "Heading",  type: "text" },
      { nodeId: "hl-contact-tag",     label: "Tagline",  type: "text" },
    ] },
  { id: "section-footer", label: "Footer", icon: <FooterIcon />, locked: true,
    elements: [
      { nodeId: "hl-footer-mark", label: "Wordmark",  type: "text" },
      { nodeId: "hl-footer-copy", label: "Copyright", type: "text" },
    ] },
];
