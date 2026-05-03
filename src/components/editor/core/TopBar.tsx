"use client";

import Link from "next/link";
import { useStore } from "zustand";
import { useEditorStore } from "~/lib/editor/store";
import { saveState } from "~/lib/editor/localStorage";
import { useEditorTheme } from "~/lib/editor/editorTheme";
import type { Viewport } from "~/lib/editor/types";

/* ── Icons ── */
function UndoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
    </svg>
  );
}
function RedoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7v6h-6" /><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13" />
    </svg>
  );
}
function SaveIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}
function DesktopIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}
function TabletIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function MobileIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

const VIEWPORT_ICONS: Record<Viewport, React.ReactNode> = {
  desktop: <DesktopIcon />,
  tablet:  <TabletIcon />,
  mobile:  <MobileIcon />,
};
const VIEWPORT_LABELS: Record<Viewport, string> = {
  desktop: "Desktop (1280px)",
  tablet:  "Tablet (768px)",
  mobile:  "Mobile (375px)",
};

export function TopBar() {
  const { nodes, palette, typography, logo, reset, viewport, setViewport } = useEditorStore();
  const { undo, redo, pastStates, futureStates } = useStore(useEditorStore.temporal);
  const { theme, toggle } = useEditorTheme();

  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  const divider = <div style={{ width: 1, height: 18, background: "var(--ec-border)", margin: "0 2px" }} />;

  return (
    <header
      style={{
        height: "var(--ed-topbar-h)",
        background: "var(--ec-bg)",
        borderBottom: "1px solid var(--ec-line)",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 6,
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      {/* Back */}
      <Link
        href="/dashboard/templates"
        style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 4, textDecoration: "none", color: "var(--ec-sub)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      </Link>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 6 }}>
        <div style={{ width: 20, height: 20, background: "#facc15", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontWeight: 900, fontSize: 9, color: "#111", lineHeight: 1 }}>F</span>
        </div>
        <span style={{ color: "var(--ec-muted)", fontSize: 11, letterSpacing: "-0.01em" }}>Minimal BW</span>
      </div>

      {divider}

      {/* Undo / Redo */}
      <button onClick={() => undo()} disabled={!canUndo} title="Undo (Ctrl+Z)"
        style={{ background: "none", border: "none", cursor: canUndo ? "pointer" : "not-allowed", color: canUndo ? "var(--ec-label)" : "var(--ec-ghost)", padding: "4px 5px", borderRadius: 3, display: "flex", alignItems: "center" }}>
        <UndoIcon />
      </button>
      <button onClick={() => redo()} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)"
        style={{ background: "none", border: "none", cursor: canRedo ? "pointer" : "not-allowed", color: canRedo ? "var(--ec-label)" : "var(--ec-ghost)", padding: "4px 5px", borderRadius: 3, display: "flex", alignItems: "center" }}>
        <RedoIcon />
      </button>

      {divider}

      {/* Viewport toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 1, background: "var(--ec-raised)", border: "1px solid var(--ec-border)", borderRadius: 5, padding: "2px 3px" }}>
        {(["desktop", "tablet", "mobile"] as Viewport[]).map((v) => (
          <button
            key={v}
            onClick={() => setViewport(v)}
            title={VIEWPORT_LABELS[v]}
            style={{
              background: viewport === v ? "var(--ec-border)" : "none",
              border: "none",
              cursor: "pointer",
              color: viewport === v ? "var(--ec-bright)" : "var(--ec-sub)",
              padding: "4px 7px",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              transition: "color 0.15s, background 0.15s",
            }}
          >
            {VIEWPORT_ICONS[v]}
          </button>
        ))}
      </div>

      {/* Viewport size label */}
      <span style={{ fontFamily: "monospace", fontSize: 10, color: "var(--ec-dim)", marginLeft: 2 }}>
        {viewport === "desktop" ? "1280" : viewport === "tablet" ? "768" : "375"}px
      </span>

      {divider}

      {/* Light / Dark mode toggle */}
      <button
        onClick={toggle}
        title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--ec-sub)", padding: "4px 5px", borderRadius: 3,
          display: "flex", alignItems: "center",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ec-text)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ec-sub)"; }}
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>

      <div style={{ flex: 1 }} />

      {/* Reset */}
      <button
        onClick={() => { if (confirm("Reset all changes?")) reset(); }}
        style={{ background: "none", border: "1px solid var(--ec-lift)", cursor: "pointer", color: "var(--ec-sub)", padding: "3px 9px", borderRadius: 4, fontSize: 11 }}
      >
        Reset
      </button>

      {/* Preview */}
      <a
        href="/templates/minimal-bw"
        target="_blank"
        style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1px solid var(--ec-border)", color: "var(--ec-label)", padding: "3px 9px", borderRadius: 4, fontSize: 11, textDecoration: "none" }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Preview
      </a>

      {/* Save */}
      <button
        onClick={() => saveState({ nodes, palette, typography, logo })}
        style={{ background: "#facc15", border: "none", cursor: "pointer", color: "#111", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}
      >
        <SaveIcon /> Save
      </button>
    </header>
  );
}
