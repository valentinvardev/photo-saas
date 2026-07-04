import type { EditorNode } from "../types";
import type { SectionDef } from "./types";

/* ─── Icons ─── */
function NavIcon()    { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>; }
function HeroIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="18" height="10" rx="1"/><path d="M3 17h18M7 21h10"/></svg>; }
function BookIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>; }
function SunIcon()    { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>; }
function QuoteIcon()  { return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>; }
function UserIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function MailIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>; }
function FooterIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M3 7h18M3 12h18M3 17h8"/></svg>; }

export const SERENATA_NODES: Record<string, EditorNode> = {
  /* Nav */
  "ser-nav-brand":     { id: "ser-nav-brand",     type: "logo",      content: "Serenata" },
  "ser-nav-item-1":    { id: "ser-nav-item-1",    type: "paragraph", content: "The album" },
  "ser-nav-item-2":    { id: "ser-nav-item-2",    type: "paragraph", content: "About" },
  "ser-nav-item-3":    { id: "ser-nav-item-3",    type: "paragraph", content: "Contact" },
  "ser-nav-cta":       { id: "ser-nav-cta",       type: "paragraph", content: "Check my date" },

  /* Hero */
  "ser-hero-image":    { id: "ser-hero-image",    type: "image",     src: "https://picsum.photos/seed/1059/1800/1100", alt: "" },
  "ser-hero-eyebrow":  { id: "ser-hero-eyebrow",  type: "paragraph", content: "Wedding photography · anywhere love goes" },
  "ser-hero-title":    { id: "ser-hero-title",    type: "heading",   content: "Your day,<br/><em>told slowly.</em>" },
  "ser-hero-sub":      { id: "ser-hero-sub",      type: "paragraph", content: "No stiff poses, no shot lists shouted across the lawn. I photograph the in-between — the hands, the laughter, the grandmother who danced first." },
  "ser-hero-cta-1":    { id: "ser-hero-cta-1",    type: "paragraph", content: "Open the album" },
  "ser-hero-cta-2":    { id: "ser-hero-cta-2",    type: "paragraph", content: "Check my date" },

  /* Album (3D showcase) */
  "ser-album-label":      { id: "ser-album-label",      type: "paragraph", content: "The album" },
  "ser-album-note":       { id: "ser-album-note",       type: "paragraph", content: "One real wedding, start to finish — turn the pages the way their families will, on a Sunday, years from now." },
  "ser-album-title":      { id: "ser-album-title",      type: "heading",   content: "Sofía <em>&</em> Tomás" },
  "ser-album-date":       { id: "ser-album-date",       type: "paragraph", content: "09 . 09 . 2025 — Patagonia" },
  "ser-album-dedication": { id: "ser-album-dedication", type: "paragraph", content: "For the ones who cried first,<br/>and the ones who stayed until the lights came on." },

  /* The day — three moments */
  "ser-mom-label":     { id: "ser-mom-label",     type: "paragraph", content: "The day" },
  "ser-mom-1-title":   { id: "ser-mom-1-title",   type: "heading",   content: "Getting ready" },
  "ser-mom-1-desc":    { id: "ser-mom-1-desc",    type: "paragraph", content: "The quiet hours — buttons, letters, deep breaths. I arrive early and disappear into them." },
  "ser-mom-2-title":   { id: "ser-mom-2-title",   type: "heading",   content: "The ceremony" },
  "ser-mom-2-desc":    { id: "ser-mom-2-desc",    type: "paragraph", content: "I work from the edges, in silence. You will not remember I was there; you will remember everything else." },
  "ser-mom-3-title":   { id: "ser-mom-3-title",   type: "heading",   content: "The party" },
  "ser-mom-3-desc":    { id: "ser-mom-3-desc",    type: "paragraph", content: "Flash on, shoes off. This is where the album earns its last, loudest pages." },

  /* Kind words */
  "ser-quote-label":   { id: "ser-quote-label",   type: "paragraph", content: "Kind words" },
  "ser-quote-text":    { id: "ser-quote-text",    type: "paragraph", content: "“We forgot she was there — and somehow she was everywhere. Our album ends with my father laughing so hard he's crying. That photo is worth the whole wedding.”" },
  "ser-quote-author":  { id: "ser-quote-author",  type: "paragraph", content: "— Carla & Julián, married in Mendoza" },

  /* The photographer */
  "ser-about-label":   { id: "ser-about-label",   type: "paragraph", content: "The photographer" },
  "ser-about-image":   { id: "ser-about-image",   type: "image",     src: "https://picsum.photos/seed/64/900/1150", alt: "Portrait" },
  "ser-about-heading": { id: "ser-about-heading", type: "heading",   content: "I photograph weddings<br/>like <em>love letters.</em>" },
  "ser-about-body":    { id: "ser-about-body",    type: "paragraph", content: "Nine years, one hundred and forty weddings, and I still cry at vows. My couples want honest pictures — film-soft colour, real light, and an album that reads like the day felt. If that sounds like you, I'd love to hear your plan." },
  "ser-stat-1-value":  { id: "ser-stat-1-value",  type: "paragraph", content: "140" },
  "ser-stat-1-label":  { id: "ser-stat-1-label",  type: "paragraph", content: "Weddings" },
  "ser-stat-2-value":  { id: "ser-stat-2-value",  type: "paragraph", content: "9" },
  "ser-stat-2-label":  { id: "ser-stat-2-label",  type: "paragraph", content: "Years" },
  "ser-stat-3-value":  { id: "ser-stat-3-value",  type: "paragraph", content: "18" },
  "ser-stat-3-label":  { id: "ser-stat-3-label",  type: "paragraph", content: "Countries" },

  /* Contact */
  "ser-contact-label":    { id: "ser-contact-label",    type: "paragraph", content: "Your date" },
  "ser-contact-heading":  { id: "ser-contact-heading",  type: "heading",   content: "Tell me about<br/><em>your day.</em>" },
  "ser-contact-body":     { id: "ser-contact-body",     type: "paragraph", content: "The date, the place, how you met — whatever feels important. I take a limited number of weddings a year, so write early." },
  "ser-contact-d1-label": { id: "ser-contact-d1-label", type: "paragraph", content: "Email" },
  "ser-contact-d1-value": { id: "ser-contact-d1-value", type: "paragraph", content: "hola@serenata.photo" },
  "ser-contact-d2-label": { id: "ser-contact-d2-label", type: "paragraph", content: "Phone" },
  "ser-contact-d2-value": { id: "ser-contact-d2-value", type: "paragraph", content: "+54 9 261 000 0000" },
  "ser-contact-d3-label": { id: "ser-contact-d3-label", type: "paragraph", content: "Based in" },
  "ser-contact-d3-value": { id: "ser-contact-d3-value", type: "paragraph", content: "Mendoza — travelling worldwide" },

  /* Footer */
  "ser-footer-brand":  { id: "ser-footer-brand",  type: "logo",      content: "Serenata" },
  "ser-footer-copy":   { id: "ser-footer-copy",   type: "paragraph", content: "© 2025 Serenata — with love" },
};

export const SERENATA_SECTIONS: SectionDef[] = [
  { id: "section-nav", label: "Navigation", icon: <NavIcon />, locked: true,
    elements: [
      { nodeId: "ser-nav-brand",  label: "Logo",   type: "text" },
      { nodeId: "ser-nav-item-1", label: "Link 1", type: "text" },
      { nodeId: "ser-nav-item-2", label: "Link 2", type: "text" },
      { nodeId: "ser-nav-item-3", label: "Link 3", type: "text" },
      { nodeId: "ser-nav-cta",    label: "Button", type: "text" },
    ] },
  { id: "ser-hero", label: "Hero", icon: <HeroIcon />, locked: false,
    elements: [
      { nodeId: "ser-hero-image",   label: "Cover image", type: "image" },
      { nodeId: "ser-hero-eyebrow", label: "Eyebrow",     type: "text"  },
      { nodeId: "ser-hero-title",   label: "Heading",     type: "text"  },
      { nodeId: "ser-hero-sub",     label: "Subtitle",    type: "text"  },
      { nodeId: "ser-hero-cta-1",   label: "Button 1",    type: "text"  },
      { nodeId: "ser-hero-cta-2",   label: "Button 2",    type: "text"  },
    ] },
  { id: "ser-gallery", label: "Album", icon: <BookIcon />, locked: false,
    elements: [
      { nodeId: "ser-album-label",      label: "Section label",  type: "text" },
      { nodeId: "ser-album-note",       label: "Intro line",     type: "text" },
      { nodeId: "ser-album-title",      label: "Cover — names",  type: "text" },
      { nodeId: "ser-album-date",       label: "Cover — date",   type: "text" },
      { nodeId: "ser-album-dedication", label: "Dedication page", type: "text" },
    ] },
  { id: "ser-moments", label: "The day", icon: <SunIcon />, locked: false,
    elements: [
      { nodeId: "ser-mom-label",   label: "Section label",  type: "text" },
      { nodeId: "ser-mom-1-title", label: "Moment 1 — ttl", type: "text" },
      { nodeId: "ser-mom-1-desc",  label: "Moment 1 — txt", type: "text" },
      { nodeId: "ser-mom-2-title", label: "Moment 2 — ttl", type: "text" },
      { nodeId: "ser-mom-2-desc",  label: "Moment 2 — txt", type: "text" },
      { nodeId: "ser-mom-3-title", label: "Moment 3 — ttl", type: "text" },
      { nodeId: "ser-mom-3-desc",  label: "Moment 3 — txt", type: "text" },
    ] },
  { id: "ser-quote", label: "Kind words", icon: <QuoteIcon />, locked: false,
    elements: [
      { nodeId: "ser-quote-label",  label: "Section label", type: "text" },
      { nodeId: "ser-quote-text",   label: "Quote",         type: "text" },
      { nodeId: "ser-quote-author", label: "Couple",        type: "text" },
    ] },
  { id: "ser-about", label: "Photographer", icon: <UserIcon />, locked: false,
    elements: [
      { nodeId: "ser-about-label",   label: "Section label", type: "text"  },
      { nodeId: "ser-about-image",   label: "Portrait",      type: "image" },
      { nodeId: "ser-about-heading", label: "Heading",       type: "text"  },
      { nodeId: "ser-about-body",    label: "Bio",           type: "text"  },
      { nodeId: "ser-stat-1-value",  label: "Stat 1 — val",  type: "text"  },
      { nodeId: "ser-stat-1-label",  label: "Stat 1 — lbl",  type: "text"  },
      { nodeId: "ser-stat-2-value",  label: "Stat 2 — val",  type: "text"  },
      { nodeId: "ser-stat-2-label",  label: "Stat 2 — lbl",  type: "text"  },
      { nodeId: "ser-stat-3-value",  label: "Stat 3 — val",  type: "text"  },
      { nodeId: "ser-stat-3-label",  label: "Stat 3 — lbl",  type: "text"  },
    ] },
  { id: "ser-contact", label: "Your date", icon: <MailIcon />, locked: false,
    elements: [
      { nodeId: "ser-contact-label",    label: "Section label",  type: "text" },
      { nodeId: "ser-contact-heading",  label: "Heading",        type: "text" },
      { nodeId: "ser-contact-body",     label: "Body",           type: "text" },
      { nodeId: "ser-contact-d1-label", label: "Detail 1 — lbl", type: "text" },
      { nodeId: "ser-contact-d1-value", label: "Detail 1 — val", type: "text" },
      { nodeId: "ser-contact-d2-label", label: "Detail 2 — lbl", type: "text" },
      { nodeId: "ser-contact-d2-value", label: "Detail 2 — val", type: "text" },
      { nodeId: "ser-contact-d3-label", label: "Detail 3 — lbl", type: "text" },
      { nodeId: "ser-contact-d3-value", label: "Detail 3 — val", type: "text" },
    ] },
  { id: "section-footer", label: "Footer", icon: <FooterIcon />, locked: true,
    elements: [
      { nodeId: "ser-footer-brand", label: "Logo",      type: "text" },
      { nodeId: "ser-footer-copy",  label: "Copyright", type: "text" },
    ] },
];
