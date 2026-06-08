"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FONT_OPTIONS } from "~/lib/editor/fonts";
import { api } from "~/trpc/react";

const CATEGORY_LABELS: Record<string, string> = {
  serif: "Serif",
  sans:  "Sans serif",
  mono:  "Monospace",
};
const CATEGORY_ORDER = ["serif", "sans", "mono"] as const;

interface Props {
  value?: string;          // current fontFamily stack (undefined = template default)
  fallbackSample?: string; // node text, used when the owner has no name yet
  onSelect: (stack: string | undefined) => void;
  onClose: () => void;
}

export function FontPickerModal({ value, fallbackSample, onSelect, onClose }: Props) {
  const { data: me } = api.user.me.useQuery();
  const [hovered, setHovered] = useState<string | null>(null);

  // Esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [onClose]);

  const sample =
    (me?.name?.trim()) ||
    (fallbackSample?.trim()) ||
    "Your Name";

  const previewStack = hovered ?? value ?? "var(--tpl-serif, serif)";

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 3000,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 480, maxHeight: "82vh",
          background: "var(--ec-bg, #111)", border: "1px solid var(--ec-raised, #222)",
          borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "16px 18px 14px", borderBottom: "1px solid var(--ec-raised)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--ec-bright)", letterSpacing: "-0.01em" }}>Typography</h2>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ec-sub)", padding: 2, display: "flex" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          {/* Live preview of the sample name in the focused font */}
          <div style={{ background: "var(--ec-raised)", borderRadius: 9, padding: "18px 16px", textAlign: "center", overflow: "hidden" }}>
            <span style={{ fontFamily: previewStack, fontSize: 34, color: "var(--ec-bright)", lineHeight: 1.1, wordBreak: "break-word" }}>
              {sample}
            </span>
          </div>
        </div>

        {/* Font list */}
        <div style={{ overflowY: "auto", padding: "8px 8px 12px" }}>
          {/* Default / reset */}
          <button
            onClick={() => { onSelect(undefined); onClose(); }}
            onMouseEnter={() => setHovered("var(--tpl-serif, serif)")}
            style={rowStyle(value === undefined)}
          >
            <span style={{ fontSize: 14, color: value === undefined ? "#facc15" : "var(--ec-label)" }}>Template default</span>
            {value === undefined && <Check />}
          </button>

          {CATEGORY_ORDER.map((cat) => {
            const fonts = FONT_OPTIONS.filter((f) => f.category === cat);
            if (fonts.length === 0) return null;
            return (
              <div key={cat} style={{ marginTop: 8 }}>
                <p style={{ margin: "8px 10px 4px", fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ec-dim)", fontWeight: 600 }}>
                  {CATEGORY_LABELS[cat]}
                </p>
                {fonts.map((f) => {
                  const active = value === f.stack;
                  return (
                    <button
                      key={f.value}
                      onClick={() => { onSelect(f.stack); onClose(); }}
                      onMouseEnter={() => setHovered(f.stack)}
                      style={rowStyle(active)}
                    >
                      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, minWidth: 0 }}>
                        <span style={{ fontFamily: f.stack, fontSize: 18, color: active ? "#facc15" : "var(--ec-label)", lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 320 }}>
                          {sample}
                        </span>
                        <span style={{ fontSize: 10.5, color: "var(--ec-dim)" }}>{f.label}</span>
                      </span>
                      {active && <Check />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function rowStyle(active: boolean): React.CSSProperties {
  return {
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
    width: "100%", textAlign: "left", cursor: "pointer",
    background: active ? "rgba(250,204,21,0.1)" : "none",
    border: "1px solid " + (active ? "rgba(250,204,21,0.4)" : "transparent"),
    borderRadius: 8, padding: "9px 12px", fontFamily: "inherit",
  };
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
