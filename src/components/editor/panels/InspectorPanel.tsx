"use client";

import { useState } from "react";
import { useEditorStore } from "~/lib/editor/store";
import type { EditorNode } from "~/lib/editor/types";
import { ImageGalleryModal } from "./ImageGalleryModal";

/* ─────────────────────────────────────────────────────────────────
   Shared primitives
───────────────────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: "var(--ec-dim)", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 8px", fontWeight: 600 }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--ec-raised)", margin: "14px 0" }} />;
}

/* ─────────────────────────────────────────────────────────────────
   Text Inspector
───────────────────────────────────────────────────────────────── */
const SIZE_PRESETS = [
  { label: "XS",   value: "10px"  },
  { label: "SM",   value: "12px"  },
  { label: "Base", value: "14px"  },
  { label: "MD",   value: "16px"  },
  { label: "LG",   value: "20px"  },
  { label: "XL",   value: "24px"  },
  { label: "2XL",  value: "32px"  },
  { label: "3XL",  value: "48px"  },
  { label: "Disp", value: "72px"  },
];

const WEIGHT_PRESETS = [
  { label: "Thin",   value: 100 },
  { label: "Light",  value: 300 },
  { label: "Reg",    value: 400 },
  { label: "Med",    value: 500 },
  { label: "Semi",   value: 600 },
  { label: "Bold",   value: 700 },
  { label: "Black",  value: 900 },
];

function TextInspector({ node, update }: { node: EditorNode; update: (patch: Partial<EditorNode>) => void }) {
  const currentSize   = node.fontSize   ?? "";
  const currentWeight = node.fontWeight ?? "";
  const isItalic      = node.fontStyle  === "italic";
  const align         = node.textAlign  ?? "";

  return (
    <div>
      {/* Font size */}
      <SectionLabel>Size</SectionLabel>
      <div style={{ display: "flex", gap: 2, flexWrap: "wrap", marginBottom: 6 }}>
        {SIZE_PRESETS.map((p) => {
          const active = currentSize === p.value;
          return (
            <button
              key={p.label}
              onClick={() => update({ fontSize: active ? undefined : p.value })}
              style={{
                background: active ? "#2563eb" : "var(--ec-raised)",
                border: `1px solid ${active ? "#2563eb" : "var(--ec-lift)"}`,
                color: active ? "#fff" : "var(--ec-sub)",
                fontSize: 9, padding: "3px 6px", borderRadius: 3, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      {/* Custom size input */}
      <input
        value={currentSize}
        onChange={(e) => update({ fontSize: e.target.value || undefined })}
        placeholder="e.g. 18px, 1.5rem, clamp(…)"
        style={{
          width: "100%", background: "var(--ec-bg)", border: "1px solid var(--ec-lift)", color: "var(--ec-label)",
          fontSize: 11, padding: "5px 8px", borderRadius: 4, outline: "none",
          boxSizing: "border-box", fontFamily: "monospace",
        }}
      />

      <Divider />

      {/* Font weight */}
      <SectionLabel>Weight</SectionLabel>
      <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {WEIGHT_PRESETS.map((p) => {
          const active = String(currentWeight) === String(p.value);
          return (
            <button
              key={p.label}
              onClick={() => update({ fontWeight: active ? undefined : p.value })}
              style={{
                background: active ? "#2563eb" : "var(--ec-raised)",
                border: `1px solid ${active ? "#2563eb" : "var(--ec-lift)"}`,
                color: active ? "#fff" : "var(--ec-sub)",
                fontSize: 9, padding: "3px 6px", borderRadius: 3, cursor: "pointer",
                fontFamily: "inherit", fontWeight: p.value,
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      <Divider />

      {/* Style & Alignment */}
      <SectionLabel>Style &amp; Alignment</SectionLabel>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {/* Italic toggle */}
        <button
          onClick={() => update({ fontStyle: isItalic ? "normal" : "italic" })}
          title="Italic"
          style={{
            background: isItalic ? "#2563eb" : "var(--ec-raised)",
            border: `1px solid ${isItalic ? "#2563eb" : "var(--ec-lift)"}`,
            color: isItalic ? "#fff" : "var(--ec-sub)",
            width: 28, height: 28, borderRadius: 4, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
            <text x="0" y="11" style={{ fontStyle: "italic", fontSize: "13px", fontFamily: "serif", fill: "currentColor" }}>I</text>
          </svg>
        </button>

        <div style={{ width: 1, height: 20, background: "var(--ec-lift)" }} />

        {/* Alignment */}
        {(["left", "center", "right"] as const).map((a) => {
          const active = align === a;
          const icons: Record<string, React.ReactNode> = {
            left:   <svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M0 1h12M0 5h8M0 9h10"/></svg>,
            center: <svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M0 1h12M2 5h8M1 9h10"/></svg>,
            right:  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M0 1h12M4 5h8M2 9h10"/></svg>,
          };
          return (
            <button
              key={a}
              onClick={() => update({ textAlign: active ? undefined : a })}
              title={`Align ${a}`}
              style={{
                background: active ? "#2563eb" : "var(--ec-raised)",
                border: `1px solid ${active ? "#2563eb" : "var(--ec-lift)"}`,
                color: active ? "#fff" : "var(--ec-sub)",
                width: 28, height: 28, borderRadius: 4, cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >
              {icons[a]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Image Inspector
───────────────────────────────────────────────────────────────── */
const FIT_OPTIONS = [
  { label: "Cover",   value: "cover"   as const, desc: "Fill — crops if needed" },
  { label: "Contain", value: "contain" as const, desc: "Fit — letterbox" },
  { label: "Fill",    value: "fill"    as const, desc: "Stretch to fill" },
  { label: "None",    value: "none"    as const, desc: "Original size" },
];

const POSITION_OPTIONS = [
  { label: "Top",    value: "center top"    },
  { label: "Center", value: "center center" },
  { label: "Bottom", value: "center bottom" },
  { label: "Left",   value: "left center"   },
  { label: "Right",  value: "right center"  },
];

function ImageInspector({ node, update }: { node: EditorNode; update: (patch: Partial<EditorNode>) => void }) {
  const fit = node.objectFit ?? "cover";
  const pos = node.objectPosition ?? "center center";
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState(node.src ?? "");

  function applyUrl() {
    const v = urlDraft.trim();
    if (v) update({ src: v });
  }

  return (
    <div>
      {/* Source */}
      <SectionLabel>Source</SectionLabel>
      {node.src && (
        <div style={{ marginBottom: 8, borderRadius: 4, overflow: "hidden", aspectRatio: "4/3", background: "var(--ec-bg)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={node.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}
      <input
        value={urlDraft}
        onChange={(e) => setUrlDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") applyUrl(); }}
        placeholder="https://..."
        style={{
          width: "100%", background: "var(--ec-bg)", border: "1px solid var(--ec-line)",
          color: "var(--ec-label)", fontSize: 11, padding: "6px 8px", borderRadius: 4,
          outline: "none", boxSizing: "border-box", fontFamily: "monospace",
          marginBottom: 6,
        }}
      />
      <div style={{ display: "flex", gap: 4 }}>
        <button
          onClick={applyUrl}
          disabled={!urlDraft.trim() || urlDraft.trim() === node.src}
          style={{
            flex: 1, background: "var(--ec-raised)", border: "1px solid var(--ec-lift)",
            color: "var(--ec-muted)", fontSize: 10, padding: "6px", borderRadius: 4,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Apply URL
        </button>
        <button
          onClick={() => setGalleryOpen(true)}
          style={{
            flex: 1, background: "rgba(37,99,235,0.12)", border: "1px solid #2563eb",
            color: "#2563eb", fontSize: 10, padding: "6px", borderRadius: 4,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          Gallery
        </button>
      </div>

      {galleryOpen && (
        <ImageGalleryModal
          value={node.src ?? ""}
          title="Select image"
          onChange={(url) => { update({ src: url }); setUrlDraft(url); }}
          onClose={() => setGalleryOpen(false)}
        />
      )}

      <Divider />

      {/* Object fit */}
      <SectionLabel>Fit</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {FIT_OPTIONS.map((o) => {
          const active = fit === o.value;
          return (
            <button
              key={o.value}
              onClick={() => update({ objectFit: o.value })}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: active ? "rgba(37,99,235,0.15)" : "var(--ec-bg)",
                border: `1px solid ${active ? "#2563eb" : "var(--ec-line)"}`,
                color: active ? "#2563eb" : "var(--ec-sub)",
                fontSize: 11, padding: "6px 10px", borderRadius: 4, cursor: "pointer",
                fontFamily: "inherit", textAlign: "left",
              }}
            >
              <span style={{ fontWeight: active ? 600 : 400 }}>{o.label}</span>
              <span style={{ fontSize: 9, color: active ? "#60a5fa" : "#333" }}>{o.desc}</span>
            </button>
          );
        })}
      </div>

      <Divider />

      {/* Object position */}
      <SectionLabel>Focus</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {POSITION_OPTIONS.map((o) => {
          const active = pos === o.value;
          return (
            <button
              key={o.value}
              onClick={() => update({ objectPosition: o.value })}
              style={{
                background: active ? "#2563eb" : "var(--ec-raised)",
                border: `1px solid ${active ? "#2563eb" : "var(--ec-lift)"}`,
                color: active ? "#fff" : "var(--ec-sub)",
                fontSize: 10, padding: "4px 8px", borderRadius: 3, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Inspector Panel root
───────────────────────────────────────────────────────────────── */
export function InspectorPanel() {
  const { selectedId, nodes, updateNode, selectNode } = useEditorStore();

  if (!selectedId) return null;
  const node = nodes[selectedId];
  if (!node) return null;

  const isText  = node.type === "heading" || node.type === "paragraph" || node.type === "logo";
  const isImage = node.type === "image";
  if (!isText && !isImage) return null;

  function update(patch: Partial<EditorNode>) {
    updateNode(selectedId!, patch);
  }

  return (
    <aside
      style={{
        width: 220,
        background: "var(--ec-bg)",
        borderRight: "1px solid var(--ec-raised)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 12px", borderBottom: "1px solid var(--ec-raised)", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563eb" }} />
          <span style={{ color: "var(--ec-sub)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {isImage ? "Image" : "Text"}
          </span>
        </div>
        <button
          onClick={() => selectNode(null)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#333", padding: 2, display: "flex" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      {/* Node ID */}
      <div style={{ padding: "6px 12px", borderBottom: "1px solid #111" }}>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: "var(--ec-border)" }}>{selectedId}</span>
      </div>

      {/* Controls */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px" }}>
        {isText  && <TextInspector  node={node} update={update} />}
        {isImage && <ImageInspector node={node} update={update} />}

        <Divider />

        {/* Delete node */}
        <button
          onClick={() => { update({ hidden: true }); selectNode(null); }}
          style={{
            width: "100%", background: "none", border: "1px solid #2a1010",
            color: "#f87171", fontSize: 11, padding: "6px", borderRadius: 4,
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 6, fontFamily: "inherit",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#1a0808"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
          Remove element
        </button>
      </div>
    </aside>
  );
}
