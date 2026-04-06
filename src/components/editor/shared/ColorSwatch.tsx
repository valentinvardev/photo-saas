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
        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "6px 8px", borderRadius: 4, background: open ? "#1a1a1a" : "transparent" }}
      >
        <div style={{ width: 18, height: 18, borderRadius: 3, background: value, border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0 }} />
        <span style={{ flex: 1, color: "#aaa", fontSize: 12 }}>{label}</span>
        <span style={{ fontFamily: "monospace", fontSize: 10, color: "#666" }}>{value}</span>
      </div>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: "calc(100% + 6px)",
            zIndex: 100,
            background: "#1a1a1a",
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
            <span style={{ color: "#666", fontSize: 11 }}>#</span>
            <HexColorInput
              color={value}
              onChange={onChange}
              style={{ background: "#0a0a0a", border: "1px solid #333", color: "#eee", fontSize: 12, padding: "4px 6px", width: "100%", borderRadius: 3, outline: "none", fontFamily: "monospace" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
