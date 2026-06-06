"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useEditorStore } from "~/lib/editor/store";
import type { EditorNode } from "~/lib/editor/types";

/* Presets — mirror the old InspectorPanel so behaviour is unchanged. */
const SIZE_PRESETS = [
  { label: "XS",   value: "10px" },
  { label: "SM",   value: "12px" },
  { label: "Base", value: "14px" },
  { label: "MD",   value: "16px" },
  { label: "LG",   value: "20px" },
  { label: "XL",   value: "24px" },
  { label: "2XL",  value: "32px" },
  { label: "3XL",  value: "48px" },
  { label: "Disp", value: "72px" },
];
const WEIGHT_PRESETS = [
  { label: "Thin",  value: 100 },
  { label: "Light", value: 300 },
  { label: "Reg",   value: 400 },
  { label: "Med",   value: 500 },
  { label: "Semi",  value: 600 },
  { label: "Bold",  value: 700 },
  { label: "Black", value: 900 },
];

const GAP = 10; // space between the toolbar and the text

const selectStyle: React.CSSProperties = {
  appearance: "none",
  background: "var(--ec-raised)",
  border: "1px solid var(--ec-lift)",
  color: "var(--ec-label)",
  fontSize: 11,
  fontFamily: "inherit",
  padding: "4px 18px 4px 7px",
  borderRadius: 5,
  cursor: "pointer",
  outline: "none",
  height: 26,
  // tiny chevron
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='3' stroke-linecap='round'><path d='M6 9l6 6 6-6'/></svg>\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 5px center",
};

function iconBtn(active: boolean): React.CSSProperties {
  return {
    background: active ? "#2563eb" : "transparent",
    border: `1px solid ${active ? "#2563eb" : "transparent"}`,
    color: active ? "#fff" : "var(--ec-sub)",
    width: 26, height: 26, borderRadius: 5, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  };
}

function Divider() {
  return <div style={{ width: 1, height: 16, background: "var(--ec-lift)", flexShrink: 0 }} />;
}

export function FloatingTextToolbar() {
  const { selectedId, nodes, viewport, updateNode, selectNode } = useEditorStore();
  const node = selectedId ? nodes[selectedId] : undefined;
  const isText = !!node && (node.type === "heading" || node.type === "paragraph" || node.type === "logo");

  const barRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  // Re-measure the selected element's position whenever it (or anything that
  // changes its box) updates, and on scroll/resize. The canvas frame isn't
  // CSS-scaled, so getBoundingClientRect maps straight to fixed coordinates.
  useLayoutEffect(() => {
    if (!isText || !selectedId) { setPos(null); return; }

    let raf = 0;
    const measure = () => {
      const el = document.querySelector(`[data-node-id="${CSS.escape(selectedId)}"]`);
      if (!el) { setPos(null); return; }
      const r = el.getBoundingClientRect();
      const w = barRef.current?.offsetWidth  ?? 360;
      const h = barRef.current?.offsetHeight ?? 34;
      let top = r.top - GAP - h;
      if (top < 8) top = r.bottom + GAP;               // flip below if no room above
      const left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
      setPos({ top, left });
    };
    const onScrollResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };

    measure();
    requestAnimationFrame(measure); // 2nd pass once the bar has a real width
    window.addEventListener("scroll", onScrollResize, true); // capture: inner scroll containers too
    window.addEventListener("resize", onScrollResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollResize, true);
      window.removeEventListener("resize", onScrollResize);
    };
  }, [isText, selectedId, viewport, node?.fontSize, node?.fontWeight, node?.fontStyle, node?.textAlign, node?.content, node?.hidden]);

  if (!isText || !node || !pos) return null;

  const update = (patch: Partial<EditorNode>) => updateNode(selectedId!, patch);
  const isItalic = node.fontStyle === "italic";
  const align    = node.textAlign ?? "";

  const alignIcons: Record<string, React.ReactNode> = {
    left:   <svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M0 1h12M0 5h8M0 9h10"/></svg>,
    center: <svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M0 1h12M2 5h8M1 9h10"/></svg>,
    right:  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M0 1h12M4 5h8M2 9h10"/></svg>,
  };

  return createPortal(
    <div
      ref={barRef}
      style={{
        position: "fixed", top: pos.top, left: pos.left, zIndex: 1000,
        display: "flex", alignItems: "center", gap: 4,
        padding: 4,
        background: "var(--ec-bg, #111)",
        border: "1px solid var(--ec-raised, #222)",
        borderRadius: 9,
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Size */}
      <select
        value={node.fontSize ?? ""}
        onChange={(e) => update({ fontSize: e.target.value || undefined })}
        title="Font size"
        style={selectStyle}
      >
        <option value="">Size</option>
        {SIZE_PRESETS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
      </select>

      {/* Weight */}
      <select
        value={node.fontWeight ?? ""}
        onChange={(e) => update({ fontWeight: e.target.value ? Number(e.target.value) : undefined })}
        title="Font weight"
        style={selectStyle}
      >
        <option value="">Weight</option>
        {WEIGHT_PRESETS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
      </select>

      <Divider />

      {/* Italic */}
      <button onClick={() => update({ fontStyle: isItalic ? "normal" : "italic" })} title="Italic" style={iconBtn(isItalic)}>
        <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><text x="0" y="11" style={{ fontStyle: "italic", fontSize: "13px", fontFamily: "serif", fill: "currentColor" }}>I</text></svg>
      </button>

      {/* Alignment */}
      {(["left", "center", "right"] as const).map((a) => (
        <button key={a} onClick={() => update({ textAlign: align === a ? undefined : a })} title={`Align ${a}`} style={iconBtn(align === a)}>
          {alignIcons[a]}
        </button>
      ))}

      <Divider />

      {/* Remove element */}
      <button
        onClick={() => { update({ hidden: true }); selectNode(null); }}
        title="Remove element"
        style={{ ...iconBtn(false), color: "#f87171" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(248,113,113,0.12)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
      </button>
    </div>,
    document.body,
  );
}
