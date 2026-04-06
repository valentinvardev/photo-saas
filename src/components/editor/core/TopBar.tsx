"use client";

import { useStore } from "zustand";
import { useEditorStore } from "~/lib/editor/store";
import { saveState } from "~/lib/editor/localStorage";

function UndoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
    </svg>
  );
}
function RedoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7v6h-6" /><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13" />
    </svg>
  );
}
function SaveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function TopBar() {
  const { nodes, palette, reset } = useEditorStore();
  const { undo, redo, pastStates, futureStates } = useStore(useEditorStore.temporal);

  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  function handleSave() {
    saveState({ nodes, palette });
  }

  function handlePreview() {
    window.open("/templates/minimal-bw", "_blank");
  }

  return (
    <header
      style={{
        height: "var(--ed-topbar-h)",
        background: "#111",
        borderBottom: "1px solid #222",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 8,
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 8 }}>
        <div style={{ width: 22, height: 22, background: "#facc15", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontWeight: 900, fontSize: 10, color: "#111", lineHeight: 1 }}>F</span>
        </div>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: "-0.02em" }}>FRAME</span>
        <span style={{ color: "#555", fontSize: 12, marginLeft: 2 }}>/ Minimal BW</span>
      </div>

      <div style={{ width: 1, height: 20, background: "#333", margin: "0 4px" }} />

      {/* Undo / Redo */}
      <button
        onClick={() => undo()}
        disabled={!canUndo}
        title="Undo"
        style={{
          background: "none", border: "none", cursor: canUndo ? "pointer" : "not-allowed",
          color: canUndo ? "#ccc" : "#444", padding: "4px 6px", borderRadius: 4, display: "flex",
        }}
      >
        <UndoIcon />
      </button>
      <button
        onClick={() => redo()}
        disabled={!canRedo}
        title="Redo"
        style={{
          background: "none", border: "none", cursor: canRedo ? "pointer" : "not-allowed",
          color: canRedo ? "#ccc" : "#444", padding: "4px 6px", borderRadius: 4, display: "flex",
        }}
      >
        <RedoIcon />
      </button>

      <div style={{ flex: 1 }} />

      {/* Reset */}
      <button
        onClick={() => { if (confirm("Reset all changes?")) reset(); }}
        style={{
          background: "none", border: "1px solid #333", cursor: "pointer",
          color: "#888", padding: "4px 10px", borderRadius: 4, fontSize: 12,
        }}
      >
        Reset
      </button>

      {/* Preview */}
      <button
        onClick={handlePreview}
        style={{
          background: "none", border: "1px solid #444", cursor: "pointer",
          color: "#ccc", padding: "4px 10px", borderRadius: 4, fontSize: 12,
          display: "flex", alignItems: "center", gap: 5,
        }}
      >
        <EyeIcon /> Preview
      </button>

      {/* Save */}
      <button
        onClick={handleSave}
        style={{
          background: "#facc15", border: "none", cursor: "pointer",
          color: "#111", padding: "5px 12px", borderRadius: 4, fontSize: 12,
          fontWeight: 700, display: "flex", alignItems: "center", gap: 5,
        }}
      >
        <SaveIcon /> Save
      </button>
    </header>
  );
}
