"use client";

import { useEditorStore } from "~/lib/editor/store";
import { ColorPalettePanel } from "~/components/editor/panels/ColorPalettePanel";
import { TypographyPanel } from "~/components/editor/panels/TypographyPanel";
import { ColorSwatch } from "~/components/editor/shared/ColorSwatch";

/* ── Card wrapper ── */
function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section style={{ background: "var(--ec-bg)", border: "1px solid var(--ec-raised)", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ padding: "11px 14px", borderBottom: "1px solid var(--ec-raised)" }}>
        <h2 style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "var(--ec-text)" }}>{title}</h2>
        {desc && <p style={{ margin: "3px 0 0", fontSize: 10.5, color: "var(--ec-dim)", lineHeight: 1.5 }}>{desc}</p>}
      </div>
      {children}
    </section>
  );
}

/* ── Pages overview ── */
function PageGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 8h18M7 3v5" /><path d="M7 12h10M7 15h7" />
    </svg>
  );
}

function PageCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ textAlign: "left", background: "var(--ec-raised)", border: "1px solid var(--ec-lift)", borderRadius: 9, overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column", padding: 0 }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#facc15"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--ec-lift)"; }}
    >
      <div style={{ height: 70, background: "linear-gradient(135deg, var(--ec-lift), var(--ec-raised))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ec-sub)" }}>
        <PageGlyph />
      </div>
      <div style={{ padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ec-text)" }}>Home</div>
          <div style={{ fontSize: 9.5, color: "var(--ec-dim)", fontFamily: "monospace" }}>Portfolio page</div>
        </div>
        <span style={{ fontSize: 9.5, fontWeight: 700, color: "#111", background: "#facc15", padding: "3px 7px", borderRadius: 5, whiteSpace: "nowrap" }}>Edit →</span>
      </div>
    </button>
  );
}

function ComingSoonPageCard({ label }: { label: string }) {
  return (
    <div style={{ background: "var(--ec-bg)", border: "1px dashed var(--ec-lift)", borderRadius: 9, overflow: "hidden", display: "flex", flexDirection: "column", opacity: 0.6 }}>
      <div style={{ height: 70, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ec-ghost)" }}>
        <PageGlyph />
      </div>
      <div style={{ padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ec-sub)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</div>
        <span style={{ fontFamily: "monospace", fontSize: 8.5, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ec-dim)", border: "1px solid var(--ec-lift)", padding: "2px 5px", borderRadius: 4, flexShrink: 0 }}>Soon</span>
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
    <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Corner radius */}
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

      {/* Colors */}
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

      {/* Live preview */}
      <div style={{ background: palette.bg, borderRadius: 8, border: "1px solid var(--ec-raised)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: 16, flexWrap: "wrap" }}>
        <button style={{ background: bg, color: fg, border: `1px solid ${bg}`, borderRadius: buttons.radius, padding: "10px 18px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "default" }}>
          Hire me
        </button>
        <button style={{ background: "transparent", color: bg, border: `1px solid ${bg}`, borderRadius: buttons.radius, padding: "10px 18px", fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "default" }}>
          About
        </button>
      </div>
    </div>
  );
}

/* ── Design home — the builder's overview, shown as a sidebar with the
   live canvas on the right. Sets the variables every page shares. ── */
export function DesignHome({ onEnterPage }: { onEnterPage: () => void }) {
  return (
    <aside
      style={{
        width: 340,
        flexShrink: 0,
        height: "100%",
        overflowY: "auto",
        background: "var(--ec-bg)",
        borderRight: "1px solid var(--ec-raised)",
        padding: "16px 14px 60px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* Heading */}
      <div>
        <h1 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "var(--ec-bright)", letterSpacing: "-0.01em" }}>Design system</h1>
        <p style={{ margin: "5px 0 0", fontSize: 11.5, color: "var(--ec-muted)", lineHeight: 1.5 }}>
          Set what every page shares, then open a page to edit its content.
        </p>
      </div>

      {/* Pages */}
      <Card title="Pages" desc="Open a page to edit it.">
        <div style={{ padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <PageCard onClick={onEnterPage} />
          <ComingSoonPageCard label="Gallery" />
          <ComingSoonPageCard label="Link in bio" />
        </div>
      </Card>

      {/* Colors */}
      <Card title="Colors" desc="Applied site-wide.">
        <ColorPalettePanel />
      </Card>

      {/* Typography */}
      <Card title="Typography" desc="Headings, body and labels.">
        <TypographyPanel />
      </Card>

      {/* Buttons */}
      <Card title="Buttons" desc="Corner radius and colors.">
        <ButtonsPanel />
      </Card>
    </aside>
  );
}
