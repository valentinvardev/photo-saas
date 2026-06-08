"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useEditorStore } from "~/lib/editor/store";
import type { EditorNode } from "~/lib/editor/types";
import { FontPickerModal } from "./FontPickerModal";
import { useT } from "~/components/providers/LangProvider";

/** Plain-text sample from a node's HTML content (fallback preview text). */
function sampleFromContent(html?: string): string {
  return (html ?? "").replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").trim();
}

/* Quick-pick sizes offered in the datalist next to the numeric px field. */
const SIZE_STEPS = [10, 12, 14, 16, 20, 24, 32, 48, 72];
const WEIGHT_PRESETS = [
  { tkey: "wThin",  value: 100 },
  { tkey: "wLight", value: 300 },
  { tkey: "wReg",   value: 400 },
  { tkey: "wMed",   value: 500 },
  { tkey: "wSemi",  value: 600 },
  { tkey: "wBold",  value: 700 },
  { tkey: "wBlack", value: 900 },
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

const numStyle: React.CSSProperties = {
  appearance: "textfield",
  MozAppearance: "textfield",
  background: "var(--ec-raised)",
  border: "1px solid var(--ec-lift)",
  color: "var(--ec-label)",
  fontSize: 11,
  fontFamily: "inherit",
  padding: "4px 5px 4px 7px",
  borderRadius: 5,
  outline: "none",
  height: 26,
  width: 56,
  textAlign: "left",
};

function iconBtn(active: boolean): React.CSSProperties {
  return {
    background: active ? "#facc15" : "transparent",
    border: `1px solid ${active ? "#facc15" : "transparent"}`,
    color: active ? "#111" : "var(--ec-sub)",
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
  const { t } = useT();
  const node = selectedId ? nodes[selectedId] : undefined;
  const isText = !!node && (node.type === "heading" || node.type === "paragraph" || node.type === "logo");

  const barRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [fontModalOpen, setFontModalOpen] = useState(false);

  // Re-measure the selected element's position whenever it (or anything that
  // changes its box) updates, and on scroll/resize. The canvas frame isn't
  // CSS-scaled, so getBoundingClientRect maps straight to fixed coordinates.
  // The toolbar is clamped to the visible region (device screen ∩ canvas
  // viewport) so it never spills over the editor chrome, and hides when the
  // selected element scrolls out of view.
  useLayoutEffect(() => {
    if (!isText || !selectedId) { setPos(null); return; }

    let raf = 0;
    const measure = () => {
      const el     = document.querySelector(`[data-node-id="${CSS.escape(selectedId)}"]`);
      const screen = document.querySelector(".editor-canvas-scroll");
      const vp     = document.querySelector(".editor-canvas-viewport");
      if (!el || !screen || !vp) { setPos(null); return; }

      const r = el.getBoundingClientRect();
      const s = screen.getBoundingClientRect();
      const v = vp.getBoundingClientRect();

      // Visible region = device screen clipped to the canvas viewport.
      const minY = Math.max(s.top, v.top);
      const maxY = Math.min(s.bottom, v.bottom);
      const minX = Math.max(s.left, v.left);
      const maxX = Math.min(s.right, v.right);

      // Hide when the element is scrolled out of that region.
      if (r.bottom < minY + 2 || r.top > maxY - 2) { setPos(null); return; }

      const w = barRef.current?.offsetWidth  ?? 360;
      const h = barRef.current?.offsetHeight ?? 34;

      let top = r.top - GAP - h;            // prefer above the element
      if (top < minY + 4) top = r.bottom + GAP; // flip below if it would overflow the top
      top = Math.max(minY + 4, Math.min(top, maxY - h - 4));
      const left = Math.max(minX + 4, Math.min(r.left, maxX - w - 4));

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
  }, [isText, selectedId, viewport, node?.fontSize, node?.fontWeight, node?.fontStyle, node?.textAlign, node?.fontFamily, node?.content, node?.hidden]);

  if (!isText || !node) return null;

  const update = (patch: Partial<EditorNode>) => updateNode(selectedId!, patch);
  const isItalic = node.fontStyle === "italic";
  const align    = node.textAlign ?? "";
  const sizePx   = node.fontSize ? parseInt(node.fontSize, 10) : NaN;
  const color    = node.color ?? "";

  const alignIcons: Record<string, React.ReactNode> = {
    left:   <svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M0 1h12M0 5h8M0 9h10"/></svg>,
    center: <svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M0 1h12M2 5h8M1 9h10"/></svg>,
    right:  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M0 1h12M4 5h8M2 9h10"/></svg>,
  };

  return (
    <>
    {pos && createPortal(
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
      {/* Font family — opens the typography modal */}
      <button
        onClick={() => setFontModalOpen(true)}
        title={t("editor.toolbar.fontFamily")}
        style={{ display: "flex", alignItems: "center", gap: 5, height: 26, padding: "0 8px", background: "var(--ec-raised)", border: "1px solid var(--ec-lift)", borderRadius: 5, cursor: "pointer", color: "var(--ec-label)", flexShrink: 0 }}
      >
        <span style={{ fontFamily: node.fontFamily || "inherit", fontSize: 12, fontWeight: 600, lineHeight: 1 }}>{t("editor.toolbar.font")}</span>
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>

      <Divider />

      {/* Size — exact px (datalist offers common presets) */}
      <input
        type="number"
        min={6}
        max={400}
        step={1}
        list="ftt-size-steps"
        value={Number.isFinite(sizePx) ? sizePx : ""}
        onChange={(e) => {
          const v = e.target.value.trim();
          update({ fontSize: v ? `${parseInt(v, 10)}px` : undefined });
        }}
        placeholder={t("editor.toolbar.size")}
        title={t("editor.toolbar.fontSize")}
        className="ed-num-input"
        style={numStyle}
      />
      <datalist id="ftt-size-steps">
        {SIZE_STEPS.map((s) => <option key={s} value={s} />)}
      </datalist>

      {/* Weight */}
      <select
        value={node.fontWeight ?? ""}
        onChange={(e) => update({ fontWeight: e.target.value ? Number(e.target.value) : undefined })}
        title={t("editor.toolbar.fontWeight")}
        style={selectStyle}
      >
        <option value="">{t("editor.toolbar.weight")}</option>
        {WEIGHT_PRESETS.map((p) => <option key={p.value} value={p.value}>{t(`editor.toolbar.${p.tkey}`)}</option>)}
      </select>

      <Divider />

      {/* Text color — click opens the native picker; right-click resets */}
      <button
        onClick={() => colorRef.current?.click()}
        onContextMenu={(e) => { e.preventDefault(); update({ color: undefined }); }}
        title={t("editor.toolbar.textColor")}
        style={{ ...iconBtn(false), position: "relative" }}
      >
        <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, lineHeight: 1 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: "var(--ec-label)" }}>A</span>
          <span style={{ width: 14, height: 3, borderRadius: 1, background: color || "var(--ec-sub)" }} />
        </span>
        <input
          ref={colorRef}
          type="color"
          value={color || "#000000"}
          onChange={(e) => update({ color: e.target.value })}
          style={{ position: "absolute", left: 4, bottom: 0, width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
        />
      </button>

      <Divider />

      {/* Italic */}
      <button onClick={() => update({ fontStyle: isItalic ? "normal" : "italic" })} title={t("editor.toolbar.italic")} style={iconBtn(isItalic)}>
        <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><text x="0" y="11" style={{ fontStyle: "italic", fontSize: "13px", fontFamily: "serif", fill: "currentColor" }}>I</text></svg>
      </button>

      {/* Alignment */}
      {(["left", "center", "right"] as const).map((a) => (
        <button key={a} onClick={() => update({ textAlign: align === a ? undefined : a })} title={t(`editor.toolbar.align${a.charAt(0).toUpperCase()}${a.slice(1)}`)} style={iconBtn(align === a)}>
          {alignIcons[a]}
        </button>
      ))}

      <Divider />

      {/* Remove element */}
      <button
        onClick={() => { update({ hidden: true }); selectNode(null); }}
        title={t("editor.toolbar.remove")}
        style={{ ...iconBtn(false), color: "#f87171" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(248,113,113,0.12)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
      </button>
    </div>,
    document.body,
    )}

    {fontModalOpen && (
      <FontPickerModal
        value={node.fontFamily}
        fallbackSample={sampleFromContent(node.content)}
        onSelect={(stack) => update({ fontFamily: stack })}
        onClose={() => setFontModalOpen(false)}
      />
    )}
    </>
  );
}
