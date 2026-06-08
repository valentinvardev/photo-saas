"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useEditorStore } from "~/lib/editor/store";
import { TEMPLATES } from "~/lib/editor/templates/registry";
import type { SectionDef } from "~/lib/editor/templates/types";
import { deviceContentRef } from "~/lib/editor/deviceRef";
import { ImagePickerButton } from "~/components/editor/panels/ImageGalleryModal";
import { ImageCropModal } from "~/components/editor/panels/ImageCropModal";
import { ColorPalettePanel } from "~/components/editor/panels/ColorPalettePanel";
import { TypographyPanel } from "~/components/editor/panels/TypographyPanel";
import { ButtonsPanel } from "~/components/editor/panels/ButtonsPanel";
import { GridPanel } from "~/components/editor/panels/GridPanel";
import { useT } from "~/components/providers/LangProvider";

function LockIcon() {
  return <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
}
function TextNodeIcon() {
  return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M4 6h16M4 10h16M4 14h8M4 18h10"/></svg>;
}
function ImageNodeIcon() {
  return <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>;
}

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
  const { templateId, selectedSection, setSelectedSection, setHoveredSection, selectNode, selectedId, hiddenSections, hideSection, showSection } = useEditorStore();
  const { t } = useT();
  const SECTIONS: SectionDef[] = TEMPLATES[templateId]!.sections;
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const first = SECTIONS.find((s) => !s.locked);
    return new Set(first ? [first.id] : []);
  });
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
        <span style={{ color: "var(--ec-bright)", fontSize: 12, fontWeight: 600 }}>{t("editor.pages.home")}</span>
        <span style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: 9, color: "var(--ec-dim)", background: "var(--ec-raised)", padding: "1px 5px", borderRadius: 2 }}>{t("editor.pages.pageBadge")}</span>
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
              <span style={{ color: "var(--ec-dim)", display: "flex" }}>{section.icon}</span>
              <span style={{ fontSize: 11, color: "var(--ec-dim)", flex: 1, textDecoration: "line-through" }}>{section.label}</span>
              <button
                onClick={() => showSection(section.id)}
                style={{ background: "none", border: "1px solid var(--ec-border)", color: "var(--ec-sub)", fontSize: 9, padding: "2px 6px", borderRadius: 3, cursor: "pointer", fontFamily: "inherit" }}
              >
                {t("editor.pages.restore")}
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
                  background:  isSelected ? "rgba(250,204,21,0.12)" : "none",
                  border:      "none",
                  borderLeft:  isSelected ? "2px solid #facc15" : "2px solid transparent",
                  cursor:      "pointer",
                  padding:     "5px 12px 5px 20px",
                  textAlign:   "left",
                  color:       isSelected ? "#facc15" : "var(--ec-muted)",
                  transition:  "background 0.1s, color 0.1s",
                }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "var(--ec-raised)"; }}
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
                <span style={{ color: isSelected ? "#facc15" : "var(--ec-dim)", display: "flex" }}>{section.icon}</span>

                {/* Label */}
                <span style={{ flex: 1, fontSize: 11, fontWeight: isSelected ? 500 : 400 }}>{section.label}</span>

                {/* Lock or drag handle */}
                {section.locked ? (
                  <span style={{ color: "var(--ec-ghost)", display: "flex", marginRight: 4 }}><LockIcon /></span>
                ) : (
                  <span style={{ color: "var(--ec-border)", fontSize: 12, marginRight: 4, letterSpacing: -2 }}>⠿</span>
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
              <div style={{ borderLeft: "1px solid var(--ec-line)", marginLeft: 28 }}>
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
                        background: elSelected ? "rgba(250,204,21,0.1)" : "none",
                        border:     "none",
                        borderLeft: elSelected ? "2px solid #facc15" : "2px solid transparent",
                        cursor:     "pointer",
                        padding:    "4px 10px 4px 10px",
                        textAlign:  "left",
                        color:      elSelected ? "#facc15" : "var(--ec-sub)",
                      }}
                      onMouseEnter={(e) => { if (!elSelected) e.currentTarget.style.background = "var(--ec-surface)"; }}
                      onMouseLeave={(e) => { if (!elSelected) e.currentTarget.style.background = "none"; }}
                    >
                      <span style={{ color: el.type === "image" ? "#7c3aed" : "#facc15", display: "flex" }}>
                        {el.type === "image" ? <ImageNodeIcon /> : <TextNodeIcon />}
                      </span>
                      <span style={{ fontSize: 11 }}>{el.label}</span>
                      <span style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: 9, color: "var(--ec-border)" }}>
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
  const { t } = useT();

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
          background: "none", border: "none", cursor: "pointer", color: "var(--ec-dim)",
          padding: "2px 4px", borderRadius: 3, display: "flex", alignItems: "center",
          opacity: isOpen ? 1 : undefined,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--ec-lift)"; e.currentTarget.style.color = "var(--ec-label)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--ec-dim)"; }}
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
              background: "var(--ec-raised)", border: "1px solid var(--ec-border)", borderRadius: 6,
              minWidth: 140, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <MenuItem label={t("editor.pages.scrollTo")} onClick={() => { onScrollTo(); onClose(); }} />
            <div style={{ height: 1, background: "var(--ec-lift)", margin: "2px 0" }} />
            <MenuItem label={t("editor.pages.delete")} onClick={onDelete} disabled={locked} danger />
          </div>
        </>,
        document.body
      )}
    </div>
  );
}

function MenuItem({ label, onClick, disabled, danger }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  const { t } = useT();
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        display: "block", width: "100%", textAlign: "left",
        background: "none", border: "none",
        padding: "7px 12px", fontSize: 11,
        color: disabled ? "var(--ec-ghost)" : danger ? "#f87171" : "var(--ec-label)",
        cursor: disabled ? "default" : "pointer",
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = "var(--ec-lift)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
    >
      {label} {disabled && <span style={{ fontSize: 9, color: "var(--ec-border)" }}>— {t("editor.pages.templateLocked")}</span>}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SHARED — panel heading + divider + coming-soon row
═══════════════════════════════════════════════════════════════════════ */
function PanelHeading({ title, desc }: { title: string; desc?: string }) {
  return (
    <div style={{ padding: "18px 16px 10px" }}>
      <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--ec-bright)", letterSpacing: "-0.01em" }}>{title}</h3>
      {desc && <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--ec-dim)", lineHeight: 1.5 }}>{desc}</p>}
    </div>
  );
}

function SectionDivider() {
  return <div style={{ height: 1, background: "var(--ec-raised)", margin: "8px 0" }} />;
}

function ComingSoonRow({ label, icon }: { label: string; icon: React.ReactNode }) {
  const { t } = useT();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 16px", opacity: 0.6 }}>
      <span style={{ color: "var(--ec-ghost)", display: "flex", flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 12.5, fontWeight: 500, color: "var(--ec-sub)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      <span style={{ fontFamily: "monospace", fontSize: 8.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ec-dim)", border: "1px solid var(--ec-lift)", padding: "2px 6px", borderRadius: 4, flexShrink: 0 }}>{t("editor.settings.soon")}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   DESIGN TAB — global design system (applies to every page)
═══════════════════════════════════════════════════════════════════════ */
function DesignTab() {
  const { t } = useT();
  return (
    <div style={{ paddingBottom: 32 }}>
      <PanelHeading title={t("editor.design.colors")} desc={t("editor.design.colorsDesc")} />
      <ColorPalettePanel />

      <SectionDivider />
      <PanelHeading title={t("editor.design.typography")} desc={t("editor.design.typographyDesc")} />
      <TypographyPanel />

      <SectionDivider />
      <PanelHeading title={t("editor.design.buttons")} desc={t("editor.design.buttonsDesc")} />
      <ButtonsPanel />

      <SectionDivider />
      <PanelHeading title={t("editor.design.grid")} desc={t("editor.design.gridDesc")} />
      <GridPanel />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SETTINGS TAB
═══════════════════════════════════════════════════════════════════════ */
/* node ids that mirror the Logo Text setting per template — keeps the
   Settings tab text input in sync with the brand on the canvas */
const BRAND_NODES: Record<string, string[]> = {
  "minimal-bw": ["nav-logo"],
  "atelier":    ["atl-nav-brand", "atl-footer-brand"],
};

const LOGO_WIDTH_MIN  = 16;
const LOGO_WIDTH_MAX  = 240;
const LOGO_WIDTH_STEP = 1;

function LogoWidthSlider({
  width, onChange, labelStyle,
}: {
  width: number;
  onChange: (w: number) => void;
  labelStyle: React.CSSProperties;
}) {
  const { t } = useT();
  const pct = ((width - LOGO_WIDTH_MIN) / (LOGO_WIDTH_MAX - LOGO_WIDTH_MIN)) * 100;
  /* Custom-painted track: filled portion uses the editor's blue accent */
  const trackBg = `linear-gradient(to right, #facc15 0%, #facc15 ${pct}%, var(--ec-border) ${pct}%, var(--ec-border) 100%)`;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 5 }}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>{t("editor.settings.logoWidth")}</label>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--ec-muted)" }}>{width}<span style={{ color: "var(--ec-dim)" }}>px</span></span>
      </div>
      <input
        type="range"
        min={LOGO_WIDTH_MIN}
        max={LOGO_WIDTH_MAX}
        step={LOGO_WIDTH_STEP}
        value={width}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ed-logo-width-range"
        style={{
          width: "100%", appearance: "none", WebkitAppearance: "none",
          height: 4, borderRadius: 2, background: trackBg, outline: "none",
          cursor: "grab",
        }}
      />
      {/* Inline thumb styling — applies only to inputs in the editor sidebar */}
      <style>{`
        .ed-logo-width-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px; border-radius: 50%;
          background: var(--ec-bright); border: 2px solid #facc15;
          cursor: grab; margin-top: 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .ed-logo-width-range::-webkit-slider-thumb:active { cursor: grabbing; }
        .ed-logo-width-range::-moz-range-thumb {
          width: 14px; height: 14px; border-radius: 50%;
          background: var(--ec-bright); border: 2px solid #facc15;
          cursor: grab;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .ed-logo-width-range::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

function LogoCropButton({
  imageUrl, crop, onChange, labelStyle,
}: {
  imageUrl: string;
  crop?: { x: number; y: number; w: number; h: number; aspectRatio: number };
  onChange: (crop: { x: number; y: number; w: number; h: number; aspectRatio: number } | null) => void;
  labelStyle: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const hasCrop = !!crop;
  const { t } = useT();

  return (
    <div>
      <label style={labelStyle}>{t("editor.settings.crop")}</label>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!imageUrl}
        style={{
          width: "100%", background: "var(--ec-raised)", border: "1px solid var(--ec-border)",
          color: imageUrl ? "var(--ec-muted)" : "var(--ec-ghost)", fontSize: 11, padding: "7px 10px",
          borderRadius: 4, cursor: imageUrl ? "pointer" : "default",
          fontFamily: "inherit", textAlign: "left",
          display: "flex", alignItems: "center", gap: 8,
        }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2v14a2 2 0 002 2h14"/><path d="M18 22V8a2 2 0 00-2-2H2"/>
        </svg>
        <span style={{ flex: 1 }}>{hasCrop ? t("editor.settings.adjustCrop") : t("editor.settings.cropImage")}</span>
        {hasCrop && (
          <span style={{ fontFamily: "monospace", fontSize: 9, color: "#facc15", background: "rgba(250,204,21,0.12)", border: "1px solid #facc15", padding: "1px 5px", borderRadius: 3 }}>
            ON
          </span>
        )}
      </button>
      {open && imageUrl && (
        <ImageCropModal
          src={imageUrl}
          value={crop}
          onChange={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function SettingsTab() {
  const { logo, setLogo, templateId, updateNode } = useEditorStore();
  const { t } = useT();

  function updateLogoText(value: string) {
    setLogo({ text: value });
    const ids = BRAND_NODES[templateId] ?? [];
    for (const id of ids) updateNode(id, { content: value });
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--ec-surface)", border: "1px solid var(--ec-border)",
    color: "var(--ec-text)", fontSize: 12, padding: "7px 8px", borderRadius: 4,
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  };
  const labelStyle: React.CSSProperties = {
    color: "var(--ec-sub)", fontSize: 10, textTransform: "uppercase",
    letterSpacing: "0.1em", display: "block", marginBottom: 5,
  };

  const modeStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, background: active ? "rgba(250,204,21,0.12)" : "var(--ec-raised)",
    border: `1px solid ${active ? "#facc15" : "var(--ec-border)"}`,
    color: active ? "#facc15" : "var(--ec-sub)",
    fontSize: 10, padding: "5px 4px", borderRadius: 3,
    cursor: "pointer", fontFamily: "inherit", textAlign: "center",
  });

  return (
    <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 18 }}>

      {/* Logo */}
      <div>
        <p style={{ color: "var(--ec-dim)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 12px", fontWeight: 600 }}>{t("editor.settings.logo")}</p>

        {/* Mode selector */}
        <label style={labelStyle}>{t("editor.settings.displayMode")}</label>
        <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
          {(["text", "image", "image+text"] as const).map((m) => (
            <button key={m} style={modeStyle(logo.mode === m)} onClick={() => setLogo({ mode: m })}>
              {m === "text" ? t("editor.settings.modeText") : m === "image" ? t("editor.settings.modeImage") : t("editor.settings.modeBoth")}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(logo.mode === "text" || logo.mode === "image+text") && (
            <div>
              <label style={labelStyle}>{t("editor.settings.logoText")}</label>
              <input value={logo.text} onChange={(e) => updateLogoText(e.target.value)} style={inputStyle} />
            </div>
          )}
          {(logo.mode === "image" || logo.mode === "image+text") && (
            <>
              <div>
                <label style={labelStyle}>{t("editor.settings.logoImage")}</label>
                <ImagePickerButton
                  value={logo.imageUrl}
                  onChange={(url) => setLogo({ imageUrl: url, imageCrop: undefined })}
                />
              </div>
              <LogoCropButton
                imageUrl={logo.imageUrl}
                crop={logo.imageCrop}
                onChange={(c) => setLogo({ imageCrop: c ?? undefined })}
                labelStyle={labelStyle}
              />
              <div>
                <label style={labelStyle}>{t("editor.settings.altLogo")}</label>
                <ImagePickerButton value={logo.altImageUrl} onChange={(url) => setLogo({ altImageUrl: url })} />
              </div>
              <LogoWidthSlider width={logo.width} onChange={(w) => setLogo({ width: w })} labelStyle={labelStyle} />
            </>
          )}
          <div>
            <label style={labelStyle}>{t("editor.settings.favicon")}</label>
            <ImagePickerButton value={logo.faviconUrl} onChange={(url) => setLogo({ faviconUrl: url })} />
          </div>
        </div>
      </div>

      {/* Site info */}
      <div style={{ borderTop: "1px solid var(--ec-raised)", paddingTop: 16 }}>
        <p style={{ color: "var(--ec-dim)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 12px", fontWeight: 600 }}>{t("editor.settings.site")}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <label style={labelStyle}>{t("editor.settings.title")}</label>
            <input defaultValue="James Hollis Photography" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>{t("editor.settings.description")}</label>
            <textarea defaultValue="Documentary & portrait photography — New York."
              rows={3} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div>
            <label style={labelStyle}>{t("editor.settings.domain")}</label>
            <input defaultValue="portapic.com/jameshollis" style={{ ...inputStyle, color: "var(--ec-dim)" }} disabled />
            <p style={{ color: "var(--ec-border)", fontSize: 10, margin: "4px 0 0" }}>{t("editor.settings.customDomainsPro")}</p>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div style={{ borderTop: "1px solid var(--ec-raised)", paddingTop: 16 }}>
        <p style={{ color: "var(--ec-dim)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 12px", fontWeight: 600 }}>{t("editor.settings.socialLinks")}</p>
        {[
          { label: "Instagram", placeholder: "@jameshollis" },
          { label: "X / Twitter", placeholder: "@jhollis" },
        ].map((s) => (
          <div key={s.label} style={{ marginBottom: 8 }}>
            <label style={labelStyle}>{s.label}</label>
            <input placeholder={s.placeholder} style={{ ...inputStyle, color: "var(--ec-sub)" }} />
          </div>
        ))}
      </div>

      {/* Export */}
      <div style={{ borderTop: "1px solid var(--ec-raised)", paddingTop: 16 }}>
        <p style={{ color: "var(--ec-dim)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 10px", fontWeight: 600 }}>{t("editor.settings.export")}</p>
        <button
          onClick={() => alert(t("editor.settings.exportComingSoon"))}
          style={{
            width: "100%", background: "var(--ec-raised)", border: "1px solid var(--ec-border)",
            color: "var(--ec-muted)", fontSize: 11, padding: "8px", borderRadius: 4,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          {t("editor.settings.exportHtml")}
        </button>
        <p style={{ color: "var(--ec-border)", fontSize: 10, margin: "6px 0 0", lineHeight: 1.4 }}>
          {t("editor.settings.exportDesc")}
        </p>
      </div>

      {/* More — coming soon */}
      <div style={{ borderTop: "1px solid var(--ec-raised)", paddingTop: 16 }}>
        <p style={{ color: "var(--ec-dim)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 6px", fontWeight: 600 }}>{t("editor.settings.more")}</p>
        <div style={{ margin: "0 -14px" }}>
          <ComingSoonRow label={t("editor.settings.seoManager")} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>} />
          <ComingSoonRow label={t("editor.settings.tracking")} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>} />
          <ComingSoonRow label={t("editor.settings.customDomain")} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18 14 14 0 010-18"/></svg>} />
          <ComingSoonRow label={t("editor.settings.advanced")} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/></svg>} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SIDEBAR ROOT — one panel, three modes (Pages · Design · Settings)
═══════════════════════════════════════════════════════════════════════ */
export type SidebarTab = "pages" | "design" | "settings";

const NAV_TABS: { id: SidebarTab; tkey: string; icon: React.ReactNode }[] = [
  {
    id: "pages",
    tkey: "page",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 8h18M7 3v5"/></svg>,
  },
  {
    id: "design",
    tkey: "design",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7a2.8 2.8 0 00-4-4l-7 7"/><path d="M8 15l-3 3a2 2 0 002.8 2.8L11 18"/><path d="M14.5 6.5l3 3"/></svg>,
  },
  {
    id: "settings",
    tkey: "settings",
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.2.62.78 1.05 1.43 1.09H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  },
];

export function Sidebar({ tab, setTab }: { tab: SidebarTab; setTab: (t: SidebarTab) => void }) {
  const { t } = useT();
  return (
    <aside
      style={{
        width:       "var(--ed-sidebar-w)",
        height:      "100%",
        background:  "var(--ec-bg)",
        borderRight: "1px solid var(--ec-raised)",
        display:     "flex",
        flexDirection: "column",
        overflow:    "hidden",
        flexShrink:  0,
      }}
    >
      {/* Mode switcher — Page (content) · Design (system) · Settings */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--ec-raised)", flexShrink: 0 }}>
        {NAV_TABS.map((nav) => {
          const active = tab === nav.id;
          const label = t(`editor.tabs.${nav.tkey}`);
          return (
            <button
              key={nav.id}
              onClick={() => setTab(nav.id)}
              title={label}
              style={{
                flex: 1,
                background: active ? "rgba(250,204,21,0.07)" : "none",
                border: "none",
                borderBottom: `2px solid ${active ? "#facc15" : "transparent"}`,
                color: active ? "#facc15" : "var(--ec-dim)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 10.5,
                fontWeight: active ? 600 : 500,
                padding: "10px 0 8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "var(--ec-muted)"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "var(--ec-dim)"; }}
            >
              {nav.icon}
              {label}
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "pages"    && <PagesTab />}
        {tab === "design"   && <DesignTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </aside>
  );
}
