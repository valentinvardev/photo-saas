"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useEditorStore } from "~/lib/editor/store";
import { deviceContentRef } from "~/lib/editor/deviceRef";
import { ColorPalettePanel } from "~/components/editor/panels/ColorPalettePanel";
import { TypographyPanel } from "~/components/editor/panels/TypographyPanel";
import { TextPanel } from "~/components/editor/panels/TextPanel";
import { ImagePanel } from "~/components/editor/panels/ImagePanel";

/* ═══════════════════════════════════════════════════════════════════════
   SECTION TREE  (static definition for Minimal BW single-page template)
═══════════════════════════════════════════════════════════════════════ */
interface SectionElement {
  nodeId: string;
  label: string;
  type: "text" | "image";
}
interface SectionDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  locked: boolean;
  elements: SectionElement[];
}

function NavIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>;
}
function HeroIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="18" height="10" rx="1"/><path d="M3 17h18M7 21h10"/></svg>;
}
function GridIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
}
function QuoteIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>;
}
function UserIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function PaperIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8L2 8v12a2 2 0 002 2z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>;
}
function MailIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>;
}
function FooterIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M3 7h18M3 12h18M3 17h8"/></svg>;
}
function LockIcon() {
  return <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
}
function TextNodeIcon() {
  return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M4 6h16M4 10h16M4 14h8M4 18h10"/></svg>;
}
function ImageNodeIcon() {
  return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>;
}

const SECTIONS: SectionDef[] = [
  {
    id: "section-nav", label: "Navigation", icon: <NavIcon />, locked: true,
    elements: [{ nodeId: "nav-logo", label: "Logo text", type: "text" }],
  },
  {
    id: "section-hero", label: "Hero", icon: <HeroIcon />, locked: false,
    elements: [
      { nodeId: "hero-heading", label: "Heading",      type: "text" },
      { nodeId: "hero-sub",     label: "Subtitle",     type: "text" },
      { nodeId: "hero-avail",   label: "Availability", type: "text" },
    ],
  },
  {
    id: "work", label: "Work", icon: <GridIcon />, locked: false,
    elements: [],
  },
  {
    id: "section-quote", label: "Quote", icon: <QuoteIcon />, locked: false,
    elements: [
      { nodeId: "quote-text",   label: "Quote",  type: "text" },
      { nodeId: "quote-author", label: "Author", type: "text" },
    ],
  },
  {
    id: "about", label: "About", icon: <UserIcon />, locked: false,
    elements: [
      { nodeId: "about-heading", label: "Heading",     type: "text"  },
      { nodeId: "about-body-1",  label: "Paragraph 1", type: "text"  },
      { nodeId: "about-body-2",  label: "Paragraph 2", type: "text"  },
      { nodeId: "about-image",   label: "Portrait",    type: "image" },
    ],
  },
  {
    id: "press", label: "Press", icon: <PaperIcon />, locked: false,
    elements: [],
  },
  {
    id: "contact", label: "Contact", icon: <MailIcon />, locked: false,
    elements: [
      { nodeId: "contact-heading", label: "Heading", type: "text" },
      { nodeId: "contact-body",    label: "Body",    type: "text" },
    ],
  },
  {
    id: "section-footer", label: "Footer", icon: <FooterIcon />, locked: true,
    elements: [{ nodeId: "nav-logo", label: "Logo text", type: "text" }],
  },
];

/* ═══════════════════════════════════════════════════════════════════════
   SCROLL TO SECTION HELPER
═══════════════════════════════════════════════════════════════════════ */
function scrollToSection(sectionId: string) {
  const container = deviceContentRef.current;
  if (!container) return;
  const target = container.querySelector(`#${sectionId}`) as HTMLElement | null;
  if (!target) return;
  // offsetTop is relative to the offsetParent chain — walk up to find offset within container
  let offset = 0;
  let el: HTMLElement | null = target;
  while (el && el !== container) {
    offset += el.offsetTop;
    el = el.offsetParent as HTMLElement | null;
  }
  container.scrollTo({ top: Math.max(0, offset - 16), behavior: "smooth" });
}

/* ═══════════════════════════════════════════════════════════════════════
   PAGES TAB
═══════════════════════════════════════════════════════════════════════ */
function PagesTab() {
  const { selectedSection, setSelectedSection, setHoveredSection, selectNode, selectedId, hiddenSections, hideSection, showSection } = useEditorStore();
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["section-hero"]));
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleSectionClick(section: SectionDef) {
    setSelectedSection(section.id);
    scrollToSection(section.id);
    if (!expanded.has(section.id) && section.elements.length > 0) {
      toggleExpand(section.id);
    }
  }

  return (
    <div style={{ padding: "8px 0" }}>
      {/* Page root node */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 14px", marginBottom: 4,
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="1.75" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span style={{ color: "#eee", fontSize: 12, fontWeight: 600 }}>Home</span>
        <span style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: 9, color: "#444", background: "#1a1a1a", padding: "1px 5px", borderRadius: 2 }}>page</span>
      </div>

      {/* Section rows */}
      {SECTIONS.map((section) => {
        const isHidden   = hiddenSections.includes(section.id);
        const isSelected = selectedSection === section.id;
        const isExpanded = expanded.has(section.id);

        /* Hidden section — show a minimal restore row */
        if (isHidden) {
          return (
            <div key={section.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 14px 4px 28px", opacity: 0.45 }}>
              <span style={{ color: "#444", display: "flex" }}>{section.icon}</span>
              <span style={{ fontSize: 11, color: "#444", flex: 1, textDecoration: "line-through" }}>{section.label}</span>
              <button
                onClick={() => showSection(section.id)}
                style={{ background: "none", border: "1px solid #2a2a2a", color: "#555", fontSize: 9, padding: "2px 6px", borderRadius: 3, cursor: "pointer", fontFamily: "inherit" }}
              >
                Restore
              </button>
            </div>
          );
        }

        return (
          <div key={section.id}>
            {/* Section row */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <button
                onClick={() => handleSectionClick(section)}
                style={{
                  display:     "flex",
                  alignItems:  "center",
                  gap:         6,
                  width:       "100%",
                  background:  isSelected ? "rgba(37,99,235,0.12)" : "none",
                  border:      "none",
                  borderLeft:  isSelected ? "2px solid #2563eb" : "2px solid transparent",
                  cursor:      "pointer",
                  padding:     "5px 12px 5px 20px",
                  textAlign:   "left",
                  color:       isSelected ? "#93c5fd" : "#888",
                  transition:  "background 0.1s, color 0.1s",
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#1a1a1a"; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "none"; }}
              >
                {/* Expand chevron */}
                <span
                  style={{
                    width: 10, display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: section.elements.length > 0 ? 1 : 0,
                    transition: "transform 0.15s",
                    transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                  onClick={(e) => { e.stopPropagation(); toggleExpand(section.id); }}
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </span>

                {/* Icon */}
                <span style={{ color: isSelected ? "#60a5fa" : "#444", display: "flex" }}>{section.icon}</span>

                {/* Label */}
                <span style={{ flex: 1, fontSize: 11, fontWeight: isSelected ? 500 : 400 }}>{section.label}</span>

                {/* Lock or drag handle */}
                {section.locked ? (
                  <span style={{ color: "#333", display: "flex", marginRight: 4 }}><LockIcon /></span>
                ) : (
                  <span style={{ color: "#2a2a2a", fontSize: 12, marginRight: 4, letterSpacing: -2 }}>⠿</span>
                )}
              </button>

              {/* Three-dot menu button (appears on hover via CSS would be complex — use state) */}
              <ThreeDotMenu
                sectionId={section.id}
                locked={section.locked}
                isOpen={menuOpen === section.id}
                onOpen={() => setMenuOpen(section.id)}
                onClose={() => setMenuOpen(null)}
                onScrollTo={() => scrollToSection(section.id)}
                onDelete={() => { hideSection(section.id); setMenuOpen(null); if (selectedSection === section.id) setSelectedSection(null); }}
              />
            </div>

            {/* Element children */}
            {isExpanded && section.elements.length > 0 && (
              <div style={{ borderLeft: "1px solid #1f1f1f", marginLeft: 28 }}>
                {section.elements.map((el) => {
                  const elSelected = selectedId === el.nodeId;
                  return (
                    <button
                      key={el.nodeId}
                      onClick={(e) => { e.stopPropagation(); selectNode(el.nodeId); scrollToSection(section.id); }}
                      style={{
                        display:    "flex",
                        alignItems: "center",
                        gap:        6,
                        width:      "100%",
                        background: elSelected ? "rgba(37,99,235,0.1)" : "none",
                        border:     "none",
                        borderLeft: elSelected ? "2px solid #2563eb" : "2px solid transparent",
                        cursor:     "pointer",
                        padding:    "4px 10px 4px 10px",
                        textAlign:  "left",
                        color:      elSelected ? "#93c5fd" : "#555",
                      }}
                      onMouseEnter={(e) => { if (!elSelected) e.currentTarget.style.background = "#161616"; }}
                      onMouseLeave={(e) => { if (!elSelected) e.currentTarget.style.background = "none"; }}
                    >
                      <span style={{ color: el.type === "image" ? "#7c3aed" : "#2563eb", display: "flex" }}>
                        {el.type === "image" ? <ImageNodeIcon /> : <TextNodeIcon />}
                      </span>
                      <span style={{ fontSize: 11 }}>{el.label}</span>
                      <span style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: 9, color: "#2a2a2a" }}>
                        {el.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* Three-dot context menu */
function ThreeDotMenu({ sectionId: _id, locked, isOpen, onOpen, onClose, onScrollTo, onDelete }: {
  sectionId: string;
  locked: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onScrollTo: () => void;
  onDelete: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });

  function handleToggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (isOpen) { onClose(); return; }
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 4, right: window.innerWidth - r.right });
    }
    onOpen();
  }

  return (
    /* No transform on this wrapper — transform creates a fixed-position containing
       block which would trap the portal-rendered popup */
    <div style={{ position: "absolute", right: 6, top: 0, bottom: 0, display: "flex", alignItems: "center" }}>
      <button
        ref={btnRef}
        onClick={handleToggle}
        style={{
          background: "none", border: "none", cursor: "pointer", color: "#444",
          padding: "2px 4px", borderRadius: 3, display: "flex", alignItems: "center",
          opacity: isOpen ? 1 : undefined,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#222"; e.currentTarget.style.color = "#aaa"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#444"; }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
      </button>

      {isOpen && createPortal(
        <>
          {/* Backdrop — closes menu on outside click */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 9998 }}
            onClick={(e) => { e.stopPropagation(); onClose(); }}
          />
          {/* Popup — portalled to body so no stacking context can hide it */}
          <div
            style={{
              position: "fixed", top: pos.top, right: pos.right, zIndex: 9999,
              background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6,
              minWidth: 140, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <MenuItem label="Scroll to" onClick={() => { onScrollTo(); onClose(); }} />
            <div style={{ height: 1, background: "#222", margin: "2px 0" }} />
            <MenuItem label="Delete" onClick={onDelete} disabled={locked} danger />
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

function MenuItem({ label, onClick, disabled, danger }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        display: "block", width: "100%", textAlign: "left",
        background: "none", border: "none",
        padding: "7px 12px", fontSize: 11,
        color: disabled ? "#333" : danger ? "#f87171" : "#aaa",
        cursor: disabled ? "default" : "pointer",
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "#222"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
    >
      {label} {disabled && <span style={{ fontSize: 9, color: "#2a2a2a" }}>— template</span>}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ELEMENT PANEL — shown below section tree when a node is selected
═══════════════════════════════════════════════════════════════════════ */
function ElementPanel({ nodeId }: { nodeId: string }) {
  const { nodes } = useEditorStore();
  const node = nodes[nodeId];
  const isImage = node?.type === "image";

  return (
    <div style={{ borderTop: "1px solid #1a1a1a", marginTop: 4 }}>
      {/* Header */}
      <div style={{ padding: "8px 14px", display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: isImage ? "#7c3aed" : "#2563eb", display: "flex" }}>
          {isImage ? <ImageNodeIcon /> : <TextNodeIcon />}
        </span>
        <span style={{ color: "#666", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {isImage ? "Image" : "Text"} — <span style={{ color: "#444" }}>{nodeId}</span>
        </span>
      </div>
      {isImage ? <ImagePanel nodeId={nodeId} /> : <TextPanel nodeId={nodeId} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   DESIGN TAB
═══════════════════════════════════════════════════════════════════════ */
function DesignTab() {
  const [section, setSection] = useState<"colors" | "type">("colors");

  const pillStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, background: active ? "#222" : "none", border: "none",
    color: active ? "#eee" : "#555", fontSize: 11, padding: "5px 0",
    cursor: "pointer", borderRadius: 4, fontFamily: "inherit",
  });

  return (
    <div>
      {/* Sub-nav */}
      <div style={{ display: "flex", gap: 2, padding: "10px 12px 6px", background: "#0d0d0d" }}>
        <button style={pillStyle(section === "colors")} onClick={() => setSection("colors")}>Colors</button>
        <button style={pillStyle(section === "type")}   onClick={() => setSection("type")}>Typography</button>
      </div>

      {section === "colors" ? <ColorPalettePanel /> : <TypographyPanel />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SETTINGS TAB
═══════════════════════════════════════════════════════════════════════ */
function SettingsTab() {
  const { logo, setLogo } = useEditorStore();

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "#0a0a0a", border: "1px solid #1f1f1f",
    color: "#ccc", fontSize: 12, padding: "7px 8px", borderRadius: 4,
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  };
  const labelStyle: React.CSSProperties = {
    color: "#555", fontSize: 10, textTransform: "uppercase",
    letterSpacing: "0.1em", display: "block", marginBottom: 5,
  };

  const modeStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, background: active ? "#1a2a3a" : "#111",
    border: `1px solid ${active ? "#2563eb" : "#1f1f1f"}`,
    color: active ? "#93c5fd" : "#555",
    fontSize: 10, padding: "5px 4px", borderRadius: 3,
    cursor: "pointer", fontFamily: "inherit", textAlign: "center",
  });

  return (
    <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Logo */}
      <div>
        <p style={{ color: "#444", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 12px", fontWeight: 600 }}>Logo</p>

        {/* Mode selector */}
        <label style={labelStyle}>Display mode</label>
        <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
          {(["text", "image", "image+text"] as const).map((m) => (
            <button key={m} style={modeStyle(logo.mode === m)} onClick={() => setLogo({ mode: m })}>
              {m === "text" ? "Text" : m === "image" ? "Image" : "Both"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <label style={labelStyle}>Logo text</label>
            <input value={logo.text} onChange={(e) => setLogo({ text: e.target.value })} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Logo image URL</label>
            <input value={logo.imageUrl} onChange={(e) => setLogo({ imageUrl: e.target.value })} placeholder="https://..." style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Alt logo (dark bg)</label>
            <input value={logo.altImageUrl} onChange={(e) => setLogo({ altImageUrl: e.target.value })} placeholder="https://..." style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Favicon URL</label>
            <input value={logo.faviconUrl} onChange={(e) => setLogo({ faviconUrl: e.target.value })} placeholder="https://..." style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Site info */}
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 16 }}>
        <p style={{ color: "#444", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 12px", fontWeight: 600 }}>Site</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input defaultValue="James Hollis Photography" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea defaultValue="Documentary & portrait photography — New York."
              rows={3} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div>
            <label style={labelStyle}>Domain</label>
            <input defaultValue="jameshollis.frame.co" style={{ ...inputStyle, color: "#444" }} disabled />
            <p style={{ color: "#2a2a2a", fontSize: 10, margin: "4px 0 0" }}>Custom domains — upgrade to Pro</p>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 16 }}>
        <p style={{ color: "#444", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 12px", fontWeight: 600 }}>Social links</p>
        {[
          { label: "Instagram", placeholder: "@jameshollis" },
          { label: "X / Twitter", placeholder: "@jhollis" },
        ].map((s) => (
          <div key={s.label} style={{ marginBottom: 8 }}>
            <label style={labelStyle}>{s.label}</label>
            <input placeholder={s.placeholder} style={{ ...inputStyle, color: "#555" }} />
          </div>
        ))}
      </div>

      {/* Export */}
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 16 }}>
        <p style={{ color: "#444", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 10px", fontWeight: 600 }}>Export</p>
        <button
          onClick={() => alert("HTML export — coming soon.")}
          style={{
            width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a",
            color: "#888", fontSize: 11, padding: "8px", borderRadius: 4,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Export HTML
        </button>
        <p style={{ color: "#2a2a2a", fontSize: 10, margin: "6px 0 0", lineHeight: 1.4 }}>
          Downloads a static HTML file of the current template with all your edits applied.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SIDEBAR ROOT
═══════════════════════════════════════════════════════════════════════ */
type SidebarTab = "pages" | "design" | "settings";

export function Sidebar() {
  const [tab, setTab] = useState<SidebarTab>("pages");
  const { selectedId } = useEditorStore();

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    background: "none",
    border: "none",
    borderBottom: `2px solid ${active ? "#facc15" : "transparent"}`,
    color: active ? "#eee" : "#444",
    fontSize: 11,
    padding: "9px 0",
    cursor: "pointer",
    letterSpacing: "0.04em",
    fontFamily: "inherit",
    transition: "color 0.15s",
  });

  return (
    <aside
      style={{
        width:       "var(--ed-sidebar-w)",
        height:      "100%",
        background:  "#0d0d0d",
        borderRight: "1px solid #1a1a1a",
        display:     "flex",
        flexDirection: "column",
        overflow:    "hidden",
        flexShrink:  0,
      }}
    >
      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid #1a1a1a", flexShrink: 0 }}>
        <button style={tabStyle(tab === "pages")}    onClick={() => setTab("pages")}>Page</button>
        <button style={tabStyle(tab === "design")}   onClick={() => setTab("design")}>Design</button>
        <button style={tabStyle(tab === "settings")} onClick={() => setTab("settings")}>Settings</button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "pages" && (
          <>
            <PagesTab />
            {/* Element panel — appears below tree when a node is selected */}
            {selectedId && <ElementPanel nodeId={selectedId} />}
          </>
        )}
        {tab === "design"   && <DesignTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </aside>
  );
}
