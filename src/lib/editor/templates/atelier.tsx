import type { EditorNode } from "../types";
import type { SectionDef } from "./types";

/* ─── Icons ─── */
function NavIcon()       { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>; }
function HeroIcon()      { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="18" height="10" rx="1"/><path d="M3 17h18M7 21h10"/></svg>; }
function PhotoIcon()     { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>; }
function GridIcon()      { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>; }
function QuoteIcon()     { return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>; }
function NoteIcon()      { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>; }
function FooterIcon()    { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M3 7h18M3 12h18M3 17h8"/></svg>; }

export const ATELIER_NODES: Record<string, EditorNode> = {
  /* Topbar */
  "atl-nav-brand":     { id: "atl-nav-brand",     type: "logo",      content: "Atelier" },
  "atl-nav-subtitle":  { id: "atl-nav-subtitle",  type: "paragraph", content: "Sarah &amp; James · Apr 2026" },

  /* Hero */
  "atl-hero-eyebrow":  { id: "atl-hero-eyebrow",  type: "paragraph", content: "A celebration in motion · 247 photographs" },
  "atl-hero-title":    { id: "atl-hero-title",    type: "heading",   content: 'Sarah <em>&amp;</em> James' },
  "atl-hero-subtitle": { id: "atl-hero-subtitle", type: "paragraph", content: "A weekend in the gardens of Buenos Aires, captured at the slowest pace." },

  /* Hero photo */
  "atl-hero-photo":    { id: "atl-hero-photo",    type: "image",     src: "https://picsum.photos/seed/1015/2400/1350", alt: "" },
  "atl-hero-caption":  { id: "atl-hero-caption",  type: "paragraph", content: "Plate 01 · The cover" },
  "atl-hero-date":     { id: "atl-hero-date",     type: "paragraph", content: "April 14, 2026" },

  /* Collection divider */
  "atl-coll-roman":    { id: "atl-coll-roman",    type: "paragraph", content: "II" },
  "atl-coll-title":    { id: "atl-coll-title",    type: "heading",   content: "The collection" },
  "atl-coll-meta":     { id: "atl-coll-meta",     type: "paragraph", content: "247 photographs · curated by hand" },

  /* Quote */
  "atl-quote-text":    { id: "atl-quote-text",    type: "paragraph", content: "“The slowest, most beautiful afternoon. Every moment looked like it was already a memory.”" },
  "atl-quote-author":  { id: "atl-quote-author",  type: "paragraph", content: "Felipe Aravena · Photographer" },

  /* Closing block */
  "atl-close-image":   { id: "atl-close-image",   type: "image",     src: "https://picsum.photos/seed/606/1000/1250", alt: "" },
  "atl-close-eyebrow": { id: "atl-close-eyebrow", type: "paragraph", content: "III · A note" },
  "atl-close-heading": { id: "atl-close-heading", type: "heading",   content: "Thank you for letting us be there." },
  "atl-close-body":    { id: "atl-close-body",    type: "paragraph", content: "Your gallery is yours forever. Download the full collection in high resolution, share single images with anyone you’d like, or print directly through the studio." },
  "atl-close-cta-1":   { id: "atl-close-cta-1",   type: "paragraph", content: "Download all" },
  "atl-close-cta-2":   { id: "atl-close-cta-2",   type: "paragraph", content: "Order prints" },

  /* Footer */
  "atl-footer-brand":  { id: "atl-footer-brand",  type: "paragraph", content: "Atelier" },
  "atl-footer-copy":   { id: "atl-footer-copy",   type: "paragraph", content: "© 2026 · Buenos Aires" },
};

export const ATELIER_SECTIONS: SectionDef[] = [
  { id: "atl-section-nav", label: "Topbar", icon: <NavIcon />, locked: true,
    elements: [
      { nodeId: "atl-nav-brand",    label: "Brand",    type: "text" },
      { nodeId: "atl-nav-subtitle", label: "Subtitle", type: "text" },
    ] },
  { id: "atl-section-hero", label: "Hero", icon: <HeroIcon />, locked: false,
    elements: [
      { nodeId: "atl-hero-eyebrow",  label: "Eyebrow",  type: "text" },
      { nodeId: "atl-hero-title",    label: "Title",    type: "text" },
      { nodeId: "atl-hero-subtitle", label: "Subtitle", type: "text" },
    ] },
  { id: "atl-section-cover", label: "Cover photo", icon: <PhotoIcon />, locked: false,
    elements: [
      { nodeId: "atl-hero-photo",   label: "Photo",   type: "image" },
      { nodeId: "atl-hero-caption", label: "Caption", type: "text"  },
      { nodeId: "atl-hero-date",    label: "Date",    type: "text"  },
    ] },
  { id: "atl-section-collection", label: "The collection", icon: <GridIcon />, locked: false,
    elements: [
      { nodeId: "atl-coll-roman", label: "Roman numeral", type: "text" },
      { nodeId: "atl-coll-title", label: "Title",         type: "text" },
      { nodeId: "atl-coll-meta",  label: "Meta",          type: "text" },
    ] },
  { id: "atl-section-quote", label: "Pull quote", icon: <QuoteIcon />, locked: false,
    elements: [
      { nodeId: "atl-quote-text",   label: "Quote",  type: "text" },
      { nodeId: "atl-quote-author", label: "Author", type: "text" },
    ] },
  { id: "atl-section-closing", label: "Closing note", icon: <NoteIcon />, locked: false,
    elements: [
      { nodeId: "atl-close-image",   label: "Image",       type: "image" },
      { nodeId: "atl-close-eyebrow", label: "Eyebrow",     type: "text"  },
      { nodeId: "atl-close-heading", label: "Heading",     type: "text"  },
      { nodeId: "atl-close-body",    label: "Body",        type: "text"  },
      { nodeId: "atl-close-cta-1",   label: "Button — primary",   type: "text" },
      { nodeId: "atl-close-cta-2",   label: "Button — secondary", type: "text" },
    ] },
  { id: "atl-section-footer", label: "Footer", icon: <FooterIcon />, locked: true,
    elements: [
      { nodeId: "atl-footer-brand", label: "Brand",     type: "text" },
      { nodeId: "atl-footer-copy",  label: "Copyright", type: "text" },
    ] },
];
