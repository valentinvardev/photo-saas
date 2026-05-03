"use client";

import { useState, useRef, useEffect } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export function ColorSwatch({ label, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onOut);
    return () => document.removeEventListener("mousedown", onOut);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "6px 8px", borderRadius: 4, background: open ? "var(--ec-raised)" : "transparent" }}
      >
        <div style={{ width: 18, height: 18, borderRadius: 3, background: value, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }} />
        <span style={{ flex: 1, color: "var(--ec-label)", fontSize: 12 }}>{label}</span>
        <span style={{ fontFamily: "monospace", fontSize: 10, color: "var(--ec-sub)" }}>{value}</span>
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 6px)",
            zIndex: 100,
            background: "var(--ec-raised)",
            border: "1px solid #333",
            borderRadius: 6,
            padding: 12,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <HexColorPicker color={value} onChange={onChange} />
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "var(--ec-sub)", fontSize: 11 }}>#</span>
            <HexColorInput
              color={value}
              onChange={onChange}
              style={{ background: "var(--ec-bg)", border: "1px solid #333", color: "var(--ec-bright)", fontSize: 12, padding: "4px 6px", width: "100%", borderRadius: 3, outline: "none", fontFamily: "monospace" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
