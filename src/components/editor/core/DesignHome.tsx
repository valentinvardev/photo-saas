"use client";

import { useEditorStore } from "~/lib/editor/store";
import { ColorPalettePanel } from "~/components/editor/panels/ColorPalettePanel";
import { TypographyPanel } from "~/components/editor/panels/TypographyPanel";
import { ColorSwatch } from "~/components/editor/shared/ColorSwatch";

/* ── Card wrapper ── */
function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section style={{ background: "var(--ec-bg)", border: "1px solid var(--ec-raised)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--ec-raised)" }}>
        <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--ec-text)" }}>{title}</h2>
        {desc && <p style={{ margin: "3px 0 0", fontSize: 11, color: "var(--ec-dim)", lineHeight: 1.5 }}>{desc}</p>}
      </div>
      {children}
    </section>
  );
}

/* ── Pages overview ── */
function PageGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 8h18M7 3v5" /><path d="M7 12h10M7 15h7" />
    </svg>
  );
}

function PageCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ textAlign: "left", background: "var(--ec-raised)", border: "1px solid var(--ec-lift)", borderRadius: 10, overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", padding: 0 }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#facc15"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--ec-lift)"; }}
    >
      <div style={{ height: 92, background: "linear-gradient(135deg, var(--ec-lift), var(--ec-raised))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ec-sub)" }}>
        <PageGlyph />
      </div>
      <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ec-text)" }}>Home</div>
          <div style={{ fontSize: 10, color: "var(--ec-dim)", fontFamily: "monospace" }}>The portfolio page</div>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#111", background: "#facc15", padding: "4px 8px", borderRadius: 5, whiteSpace: "nowrap" }}>Edit →</span>
      </div>
    </button>
  );
}

function ComingSoonPageCard({ label }: { label: string }) {
  return (
    <div style={{ background: "var(--ec-bg)", border: "1px dashed var(--ec-lift)", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column", opacity: 0.6 }}>
      <div style={{ height: 92, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ec-ghost)" }}>
        <PageGlyph />
      </div>
      <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ec-sub)" }}>{label}</div>
        <span style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ec-dim)", border: "1px solid var(--ec-lift)", padding: "2px 6px", borderRadius: 4 }}>Soon</span>
      </div>
    </div>
  );
}

/* ── Buttons design ── */
function ButtonsPanel() {
  const { buttons, setButtons, palette } = useEditorStore();
  const bg = buttons.bg || palette.fg;
  const fg = buttons.fg || palette.bg;
  const labelStyle: React.CSSProperties = { color: "var(--ec-sub)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 };

  return (
    <div style={{ padding: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* Controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
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

        <div>
          <label style={labelStyle}>Colors</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <ColorSwatch label="Button color" value={bg} onChange={(v) => setButtons({ bg: v })} />
            <ColorSwatch label="Label color"  value={fg} onChange={(v) => setButtons({ fg: v })} />
          </div>
          {(buttons.bg || buttons.fg) && (
            <button
              onClick={() => setButtons({ bg: "", fg: "" })}
              style={{ marginTop: 8, background: "none", border: "1px solid var(--ec-lift)", color: "var(--ec-sub)", fontSize: 10, padding: "4px 9px", borderRadius: 4, cursor: "pointer", fontFamily: "inherit" }}
            >
              Reset to palette
            </button>
          )}
        </div>
      </div>

      {/* Live preview */}
      <div style={{ background: palette.bg, borderRadius: 8, border: "1px solid var(--ec-raised)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: 20, flexWrap: "wrap" }}>
        <button style={{ background: bg, color: fg, border: `1px solid ${bg}`, borderRadius: buttons.radius, padding: "11px 22px", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "default" }}>
          Hire me
        </button>
        <button style={{ background: "transparent", color: bg, border: `1px solid ${bg}`, borderRadius: buttons.radius, padding: "11px 22px", fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "default" }}>
          About
        </button>
      </div>
    </div>
  );
}

/* ── Design home (overview) ── */
export function DesignHome({ onEnterPage }: { onEnterPage: () => void }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#161616", padding: "40px 32px 80px" }}>
      <div style={{ maxWidth: 880, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Heading */}
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--ec-bright)", letterSpacing: "-0.01em" }}>Design system</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--ec-muted)", lineHeight: 1.5 }}>
            Set the colors, type and button style every page shares. Then open a page to edit its content.
          </p>
        </div>

        {/* Pages */}
        <Card title="Pages" desc="Open a page to edit its content and layout in the page editor.">
          <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
            <PageCard onClick={onEnterPage} />
            <ComingSoonPageCard label="Standalone gallery" />
            <ComingSoonPageCard label="Link in bio" />
          </div>
        </Card>

        {/* Colors */}
        <Card title="Colors" desc="Applied site-wide via CSS variables.">
          <ColorPalettePanel />
        </Card>

        {/* Typography */}
        <Card title="Typography" desc="Fonts for headings, body and labels.">
          <TypographyPanel />
        </Card>

        {/* Buttons */}
        <Card title="Buttons" desc="Corner radius and colors for the site's buttons.">
          <ButtonsPanel />
        </Card>
      </div>
    </div>
  );
}
