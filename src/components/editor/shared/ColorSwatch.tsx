"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { HexColorPicker, HexColorInput } from "react-colorful";

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

/* Picker popover dimensions (react-colorful default + hex input + padding). */
const PW = 220;
const PH = 252;

export function ColorSwatch({ label, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const btnRef = useRef<HTMLDivElement>(null);

  function toggle() {
    if (open) { setOpen(false); return; }
    const r = btnRef.current?.getBoundingClientRect();
    if (r) {
      // Below the swatch, or above it when there isn't room; clamped to the viewport.
      const top = r.bottom + PH + 8 > window.innerHeight ? Math.max(8, r.top - PH - 8) : r.bottom + 8;
      const left = Math.min(Math.max(8, r.left), window.innerWidth - PW - 8);
      setPos({ top, left });
    }
    setOpen(true);
  }

  return (
    <div ref={btnRef} style={{ position: "relative" }}>
      <div
        onClick={toggle}
        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "6px 8px", borderRadius: 4, background: open ? "var(--ec-raised)" : "transparent" }}
      >
        <div style={{ width: 18, height: 18, borderRadius: 3, background: value, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }} />
        <span style={{ flex: 1, color: "var(--ec-label)", fontSize: 12 }}>{label}</span>
        <span style={{ fontFamily: "monospace", fontSize: 12, color: "var(--ec-sub)" }}>{value}</span>
      </div>

      {/* Portalled to <body> with fixed positioning so the panel's overflow can't
          clip it — this is what made the picker unreachable on the phone editor. */}
      {open && createPortal(
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 9998 }}
            onPointerDown={() => setOpen(false)}
          />
          <div
            onPointerDown={(e) => e.stopPropagation()}
            style={{
              position: "fixed", top: pos.top, left: pos.left, zIndex: 9999,
              width: PW, background: "var(--ec-raised)", border: "1px solid #333",
              borderRadius: 6, padding: 12, display: "flex", flexDirection: "column", gap: 8,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
            }}
          >
            <HexColorPicker color={value} onChange={onChange} style={{ width: "100%" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "var(--ec-sub)", fontSize: 13 }}>#</span>
              <HexColorInput
                color={value}
                onChange={onChange}
                style={{ background: "var(--ec-bg)", border: "1px solid #333", color: "var(--ec-bright)", fontSize: 12, padding: "4px 6px", width: "100%", borderRadius: 3, outline: "none", fontFamily: "monospace" }}
              />
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
