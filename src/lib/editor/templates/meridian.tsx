import type { EditorNode } from "../types";
import type { SectionDef } from "./types";

/* ─── Icons ─── */
function NavIcon()    { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>; }
function HeroIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="18" height="10" rx="1"/><path d="M3 17h18M7 21h10"/></svg>; }
function GridIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>; }
function ListIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>; }
function UserIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function MailIcon()   { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>; }
function FooterIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M3 7h18M3 12h18M3 17h8"/></svg>; }

export const MERIDIAN_NODES: Record<string, EditorNode> = {
  /* Nav */
  "mrd-nav-brand":     { id: "mrd-nav-brand",     type: "logo",      content: "Meridian" },
  "mrd-nav-item-1":    { id: "mrd-nav-item-1",    type: "paragraph", content: "Work" },
  "mrd-nav-item-2":    { id: "mrd-nav-item-2",    type: "paragraph", content: "About" },
  "mrd-nav-item-3":    { id: "mrd-nav-item-3",    type: "paragraph", content: "Contact" },
  "mrd-nav-cta":       { id: "mrd-nav-cta",       type: "paragraph", content: "Book a session" },

  /* Hero */
  "mrd-hero-eyebrow":  { id: "mrd-hero-eyebrow",  type: "paragraph", content: "Fine-art & editorial photography" },
  "mrd-hero-title":    { id: "mrd-hero-title",    type: "heading",   content: "Every frame,<br/><em>measured.</em>" },
  "mrd-hero-sub":      { id: "mrd-hero-sub",      type: "paragraph", content: "Portraits, spaces and quiet landscapes — photographed with the patience of a gallery hang. Based between Lisbon and Madrid." },
  "mrd-hero-meta":     { id: "mrd-hero-meta",     type: "paragraph", content: "Est. 2014 · Lisboa — Madrid" },
  "mrd-hero-cta-1":    { id: "mrd-hero-cta-1",    type: "paragraph", content: "View the work" },
  "mrd-hero-cta-2":    { id: "mrd-hero-cta-2",    type: "paragraph", content: "About the studio" },
  "mrd-hero-image":    { id: "mrd-hero-image",    type: "image",     src: "https://picsum.photos/seed/411/1100/1400", alt: "" },
  "mrd-hero-caption":  { id: "mrd-hero-caption",  type: "paragraph", content: "Sala I — Tagus, morning" },

  /* Work */
  "mrd-work-label":    { id: "mrd-work-label",    type: "paragraph", content: "Selected work" },
  "mrd-work-intro":    { id: "mrd-work-intro",    type: "paragraph", content: "A rotating selection from recent commissions and personal series." },

  /* Services */
  "mrd-serv-label":    { id: "mrd-serv-label",    type: "paragraph", content: "Services" },
  "mrd-serv-1-title":  { id: "mrd-serv-1-title",  type: "heading",   content: "Portrait sessions" },
  "mrd-serv-1-desc":   { id: "mrd-serv-1-desc",   type: "paragraph", content: "Studio or on location. One hour to a full day — direction included, never rushed." },
  "mrd-serv-2-title":  { id: "mrd-serv-2-title",  type: "heading",   content: "Editorial & brand" },
  "mrd-serv-2-desc":   { id: "mrd-serv-2-desc",   type: "paragraph", content: "Campaigns, lookbooks and interiors for publications and studios that value restraint." },
  "mrd-serv-3-title":  { id: "mrd-serv-3-title",  type: "heading",   content: "Weddings, quietly" },
  "mrd-serv-3-desc":   { id: "mrd-serv-3-desc",   type: "paragraph", content: "A documentary approach for small ceremonies — no posing lists, no interruptions." },

  /* About */
  "mrd-about-label":   { id: "mrd-about-label",   type: "paragraph", content: "About" },
  "mrd-about-image":   { id: "mrd-about-image",   type: "image",     src: "https://picsum.photos/seed/1027/900/1150", alt: "Portrait" },
  "mrd-about-heading": { id: "mrd-about-heading", type: "heading",   content: "Light, geometry<br/>and <em>enough time.</em>" },
  "mrd-about-body":    { id: "mrd-about-body",    type: "paragraph", content: "I photograph the way a curator hangs a room: slowly, and with an argument. Ten years across editorial, architecture and portraiture taught me that the strongest images are the ones you stop cropping. Clients include publications, hotels and families who wanted their walls to say something." },
  "mrd-stat-1-value":  { id: "mrd-stat-1-value",  type: "paragraph", content: "10+" },
  "mrd-stat-1-label":  { id: "mrd-stat-1-label",  type: "paragraph", content: "Years" },
  "mrd-stat-2-value":  { id: "mrd-stat-2-value",  type: "paragraph", content: "120" },
  "mrd-stat-2-label":  { id: "mrd-stat-2-label",  type: "paragraph", content: "Commissions" },
  "mrd-stat-3-value":  { id: "mrd-stat-3-value",  type: "paragraph", content: "6" },
  "mrd-stat-3-label":  { id: "mrd-stat-3-label",  type: "paragraph", content: "Exhibitions" },

  /* Contact */
  "mrd-contact-label":   { id: "mrd-contact-label",   type: "paragraph", content: "Contact" },
  "mrd-contact-heading": { id: "mrd-contact-heading", type: "heading",   content: "Commission<br/><em>a series.</em>" },
  "mrd-contact-body":    { id: "mrd-contact-body",    type: "paragraph", content: "Tell me about the project — the place, the people, the deadline. I answer every letter within two days." },
  "mrd-contact-d1-label": { id: "mrd-contact-d1-label", type: "paragraph", content: "Studio" },
  "mrd-contact-d1-value": { id: "mrd-contact-d1-value", type: "paragraph", content: "studio@meridian.photo" },
  "mrd-contact-d2-label": { id: "mrd-contact-d2-label", type: "paragraph", content: "Phone" },
  "mrd-contact-d2-value": { id: "mrd-contact-d2-value", type: "paragraph", content: "+351 910 000 000" },
  "mrd-contact-d3-label": { id: "mrd-contact-d3-label", type: "paragraph", content: "Visits" },
  "mrd-contact-d3-value": { id: "mrd-contact-d3-value", type: "paragraph", content: "Rua do Século 12, Lisboa — by appointment" },

  /* Footer */
  "mrd-footer-brand":  { id: "mrd-footer-brand",  type: "logo",      content: "Meridian" },
  "mrd-footer-copy":   { id: "mrd-footer-copy",   type: "paragraph", content: "© 2025 Meridian Studio — all photographs" },
};

export const MERIDIAN_SECTIONS: SectionDef[] = [
  { id: "section-nav", label: "Navigation", icon: <NavIcon />, locked: true,
    elements: [
      { nodeId: "mrd-nav-brand",  label: "Logo",   type: "text" },
      { nodeId: "mrd-nav-item-1", label: "Link 1", type: "text" },
      { nodeId: "mrd-nav-item-2", label: "Link 2", type: "text" },
      { nodeId: "mrd-nav-item-3", label: "Link 3", type: "text" },
      { nodeId: "mrd-nav-cta",    label: "Button", type: "text" },
    ] },
  { id: "mrd-hero", label: "Hero", icon: <HeroIcon />, locked: false,
    elements: [
      { nodeId: "mrd-hero-eyebrow", label: "Eyebrow",     type: "text"  },
      { nodeId: "mrd-hero-title",   label: "Heading",     type: "text"  },
      { nodeId: "mrd-hero-sub",     label: "Subtitle",    type: "text"  },
      { nodeId: "mrd-hero-meta",    label: "Meta line",   type: "text"  },
      { nodeId: "mrd-hero-cta-1",   label: "Button 1",    type: "text"  },
      { nodeId: "mrd-hero-cta-2",   label: "Button 2",    type: "text"  },
      { nodeId: "mrd-hero-image",   label: "Hero image",  type: "image" },
      { nodeId: "mrd-hero-caption", label: "Caption",     type: "text"  },
    ] },
  { id: "mrd-work", label: "Work", icon: <GridIcon />, locked: false,
    elements: [
      { nodeId: "mrd-work-label", label: "Section label", type: "text" },
      { nodeId: "mrd-work-intro", label: "Intro line",    type: "text" },
    ] },
  { id: "mrd-services", label: "Services", icon: <ListIcon />, locked: false,
    elements: [
      { nodeId: "mrd-serv-label",   label: "Section label",   type: "text" },
      { nodeId: "mrd-serv-1-title", label: "Service 1 — ttl", type: "text" },
      { nodeId: "mrd-serv-1-desc",  label: "Service 1 — txt", type: "text" },
      { nodeId: "mrd-serv-2-title", label: "Service 2 — ttl", type: "text" },
      { nodeId: "mrd-serv-2-desc",  label: "Service 2 — txt", type: "text" },
      { nodeId: "mrd-serv-3-title", label: "Service 3 — ttl", type: "text" },
      { nodeId: "mrd-serv-3-desc",  label: "Service 3 — txt", type: "text" },
    ] },
  { id: "mrd-about", label: "About", icon: <UserIcon />, locked: false,
    elements: [
      { nodeId: "mrd-about-label",   label: "Section label", type: "text"  },
      { nodeId: "mrd-about-image",   label: "Portrait",      type: "image" },
      { nodeId: "mrd-about-heading", label: "Heading",       type: "text"  },
      { nodeId: "mrd-about-body",    label: "Bio",           type: "text"  },
      { nodeId: "mrd-stat-1-value",  label: "Stat 1 — val",  type: "text"  },
      { nodeId: "mrd-stat-1-label",  label: "Stat 1 — lbl",  type: "text"  },
      { nodeId: "mrd-stat-2-value",  label: "Stat 2 — val",  type: "text"  },
      { nodeId: "mrd-stat-2-label",  label: "Stat 2 — lbl",  type: "text"  },
      { nodeId: "mrd-stat-3-value",  label: "Stat 3 — val",  type: "text"  },
      { nodeId: "mrd-stat-3-label",  label: "Stat 3 — lbl",  type: "text"  },
    ] },
  { id: "mrd-contact", label: "Contact", icon: <MailIcon />, locked: false,
    elements: [
      { nodeId: "mrd-contact-label",    label: "Section label",  type: "text" },
      { nodeId: "mrd-contact-heading",  label: "Heading",        type: "text" },
      { nodeId: "mrd-contact-body",     label: "Body",           type: "text" },
      { nodeId: "mrd-contact-d1-label", label: "Detail 1 — lbl", type: "text" },
      { nodeId: "mrd-contact-d1-value", label: "Detail 1 — val", type: "text" },
      { nodeId: "mrd-contact-d2-label", label: "Detail 2 — lbl", type: "text" },
      { nodeId: "mrd-contact-d2-value", label: "Detail 2 — val", type: "text" },
      { nodeId: "mrd-contact-d3-label", label: "Detail 3 — lbl", type: "text" },
      { nodeId: "mrd-contact-d3-value", label: "Detail 3 — val", type: "text" },
    ] },
  { id: "section-footer", label: "Footer", icon: <FooterIcon />, locked: true,
    elements: [
      { nodeId: "mrd-footer-brand", label: "Logo",      type: "text" },
      { nodeId: "mrd-footer-copy",  label: "Copyright", type: "text" },
    ] },
];
