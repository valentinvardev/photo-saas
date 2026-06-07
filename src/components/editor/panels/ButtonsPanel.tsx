"use client";

import { useEditorStore } from "~/lib/editor/store";
import { ColorSwatch } from "~/components/editor/shared/ColorSwatch";

/* ─────────────────────────────────────────────────────────────────
   Buttons — global button shape + colors. Lives in the Design tab.
───────────────────────────────────────────────────────────────── */
export function ButtonsPanel() {
  const { buttons, setButtons, palette } = useEditorStore();
  const bg = buttons.bg || palette.fg;
  const fg = buttons.fg || palette.bg;
  const labelStyle: React.CSSProperties = {
    color: "var(--ec-sub)", fontSize: 10, textTransform: "uppercase",
    letterSpacing: "0.1em", display: "block", marginBottom: 9,
  };

  return (
    <div style={{ padding: "14px 14px 4px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Corner radius */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Corner radius</label>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--ec-muted)" }}>{buttons.radius}px</span>
        </div>
        <input
          type="range" min={0} max={32} step={1}
          value={buttons.radius}
          onChange={(e) => setButtons({ radius: Number(e.target.value) })}
          style={{ width: "100%", accentColor: "#facc15", cursor: "pointer" }}
        />
      </div>

      {/* Colors */}
      <div>
        <label style={labelStyle}>Colors</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <ColorSwatch label="Button color" value={bg} onChange={(v) => setButtons({ bg: v })} />
          <ColorSwatch label="Label color"  value={fg} onChange={(v) => setButtons({ fg: v })} />
        </div>
        {(buttons.bg || buttons.fg) && (
          <button
            onClick={() => setButtons({ bg: "", fg: "" })}
            style={{ marginTop: 10, background: "none", border: "1px solid var(--ec-lift)", color: "var(--ec-sub)", fontSize: 10, padding: "5px 10px", borderRadius: 4, cursor: "pointer", fontFamily: "inherit" }}
          >
            Reset to palette
          </button>
        )}
      </div>

      {/* Live preview */}
      <div>
        <label style={labelStyle}>Preview</label>
        <div style={{ background: palette.bg, borderRadius: 8, border: "1px solid var(--ec-raised)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: 22, flexWrap: "wrap" }}>
          <button style={{ background: bg, color: fg, border: `1px solid ${bg}`, borderRadius: buttons.radius, padding: "10px 18px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "default" }}>
            Hire me
          </button>
          <button style={{ background: "transparent", color: bg, border: `1px solid ${bg}`, borderRadius: buttons.radius, padding: "10px 18px", fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "default" }}>
            About
          </button>
        </div>
      </div>
    </div>
  );
}
