"use client";

import { useState } from "react";
import { useEditorStore } from "~/lib/editor/store";
import type { EditorNode } from "~/lib/editor/types";
import { ImageGalleryModal } from "./ImageGalleryModal";
import { useT } from "~/components/providers/LangProvider";

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
   Image Inspector

   Text formatting (size / weight / style / alignment) now lives in the
   floating toolbar above the selected text — see FloatingTextToolbar.
───────────────────────────────────────────────────────────────── */
const FIT_OPTIONS = [
  { labelKey: "fitCover",   value: "cover"   as const, descKey: "fitCoverDesc" },
  { labelKey: "fitContain", value: "contain" as const, descKey: "fitContainDesc" },
  { labelKey: "fitFill",    value: "fill"    as const, descKey: "fitFillDesc" },
  { labelKey: "fitNone",    value: "none"    as const, descKey: "fitNoneDesc" },
];

const POSITION_OPTIONS = [
  { labelKey: "top",    value: "center top"    },
  { labelKey: "center", value: "center center" },
  { labelKey: "bottom", value: "center bottom" },
  { labelKey: "left",   value: "left center"   },
  { labelKey: "right",  value: "right center"  },
];

function ImageInspector({ node, update }: { node: EditorNode; update: (patch: Partial<EditorNode>) => void }) {
  const { t } = useT();
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
      <SectionLabel>{t("editor.inspector.source")}</SectionLabel>
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
          {t("editor.inspector.applyUrl")}
        </button>
        <button
          onClick={() => setGalleryOpen(true)}
          style={{
            flex: 1, background: "rgba(250,204,21,0.12)", border: "1px solid #facc15",
            color: "#facc15", fontSize: 10, padding: "6px", borderRadius: 4,
            cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          {t("editor.inspector.gallery")}
        </button>
      </div>

      {galleryOpen && (
        <ImageGalleryModal
          value={node.src ?? ""}
          title={t("editor.inspector.selectImage")}
          onChange={(url) => { update({ src: url }); setUrlDraft(url); }}
          onClose={() => setGalleryOpen(false)}
        />
      )}

      <Divider />

      {/* Object fit */}
      <SectionLabel>{t("editor.inspector.fit")}</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {FIT_OPTIONS.map((o) => {
          const active = fit === o.value;
          return (
            <button
              key={o.value}
              onClick={() => update({ objectFit: o.value })}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: active ? "rgba(250,204,21,0.15)" : "var(--ec-bg)",
                border: `1px solid ${active ? "#facc15" : "var(--ec-line)"}`,
                color: active ? "#facc15" : "var(--ec-sub)",
                fontSize: 11, padding: "6px 10px", borderRadius: 4, cursor: "pointer",
                fontFamily: "inherit", textAlign: "left",
              }}
            >
              <span style={{ fontWeight: active ? 600 : 400 }}>{t(`editor.inspector.${o.labelKey}`)}</span>
              <span style={{ fontSize: 9, color: active ? "#facc15" : "#333" }}>{t(`editor.inspector.${o.descKey}`)}</span>
            </button>
          );
        })}
      </div>

      <Divider />

      {/* Object position */}
      <SectionLabel>{t("editor.inspector.focus")}</SectionLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {POSITION_OPTIONS.map((o) => {
          const active = pos === o.value;
          return (
            <button
              key={o.value}
              onClick={() => update({ objectPosition: o.value })}
              style={{
                background: active ? "#facc15" : "var(--ec-raised)",
                border: `1px solid ${active ? "#facc15" : "var(--ec-lift)"}`,
                color: active ? "#111" : "var(--ec-sub)",
                fontSize: 10, padding: "4px 8px", borderRadius: 3, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {t(`editor.inspector.${o.labelKey}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Inspector Panel root — images only. Text nodes are formatted via the
   floating toolbar, so this panel collapses for them.
───────────────────────────────────────────────────────────────── */
export function InspectorPanel() {
  const { selectedId, nodes, updateNode, selectNode } = useEditorStore();
  const { t } = useT();

  if (!selectedId) return null;
  const node = nodes[selectedId];
  if (!node || node.type !== "image") return null;

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
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#facc15" }} />
          <span style={{ color: "var(--ec-sub)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {t("editor.inspector.image")}
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
        <ImageInspector node={node} update={update} />

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
          {t("editor.inspector.removeElement")}
        </button>
      </div>
    </aside>
  );
}
