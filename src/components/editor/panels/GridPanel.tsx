"use client";

import { useEditorStore } from "~/lib/editor/store";

/* ─────────────────────────────────────────────────────────────────
   Gallery grid — layout, columns, spacing and "load more". Drives the
   "Selected work" section. Lives in the Design tab.
───────────────────────────────────────────────────────────────── */
const labelStyle: React.CSSProperties = {
  color: "var(--ec-sub)", fontSize: 10, textTransform: "uppercase",
  letterSpacing: "0.1em", display: "block", marginBottom: 9,
};

function Segmented({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            style={{
              flex: 1,
              background: active ? "rgba(250,204,21,0.14)" : "var(--ec-raised)",
              border: `1px solid ${active ? "#facc15" : "var(--ec-lift)"}`,
              color: active ? "#facc15" : "var(--ec-sub)",
              fontSize: 11, fontWeight: active ? 600 : 500,
              padding: "7px 4px", borderRadius: 6, cursor: "pointer",
              fontFamily: "inherit", textAlign: "center",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Slider({ label, value, suffix, min, max, step, onChange }: {
  label: string; value: number; suffix?: string;
  min: number; max: number; step: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>{label}</label>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--ec-muted)" }}>{value}{suffix}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#facc15", cursor: "pointer" }}
      />
    </div>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", background: "none", border: "none", cursor: "pointer",
        padding: 0, fontFamily: "inherit",
      }}
    >
      <span style={{ ...labelStyle, marginBottom: 0 }}>{label}</span>
      <span style={{
        width: 34, height: 18, borderRadius: 9, flexShrink: 0,
        background: on ? "#facc15" : "var(--ec-lift)",
        position: "relative", transition: "background 0.15s",
      }}>
        <span style={{
          position: "absolute", top: 2, left: on ? 18 : 2,
          width: 14, height: 14, borderRadius: "50%",
          background: on ? "#111" : "var(--ec-sub)", transition: "left 0.15s",
        }} />
      </span>
    </button>
  );
}

export function GridPanel() {
  const { grid, setGrid } = useEditorStore();
  const uniform = grid.layout === "uniform";

  return (
    <div style={{ padding: "14px 14px 4px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Layout */}
      <div>
        <label style={labelStyle}>Layout</label>
        <Segmented
          value={grid.layout}
          onChange={(v) => setGrid({ layout: v as "mosaic" | "uniform" })}
          options={[
            { value: "mosaic",  label: "Mosaic" },
            { value: "uniform", label: "Grid" },
          ]}
        />
        <p style={{ margin: "8px 0 0", fontSize: 10.5, color: "var(--ec-dim)", lineHeight: 1.5 }}>
          {uniform ? "An even grid of equal cells." : "An editorial layout with mixed cell sizes."}
        </p>
      </div>

      {/* Columns — uniform only */}
      {uniform && (
        <Slider label="Columns" value={grid.columns} min={2} max={5} step={1}
          onChange={(v) => setGrid({ columns: v })} />
      )}

      {/* Spacing */}
      <Slider label="Spacing" value={grid.gap} suffix="px" min={0} max={24} step={1}
        onChange={(v) => setGrid({ gap: v })} />

      {/* Load more — uniform only */}
      {uniform && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Toggle label="Load more" on={grid.loadMore} onChange={(v) => setGrid({ loadMore: v })} />
          {grid.loadMore && (
            <Slider label="Photos per batch" value={grid.pageSize} min={3} max={24} step={3}
              onChange={(v) => setGrid({ pageSize: v })} />
          )}
          <p style={{ margin: "-4px 0 0", fontSize: 10.5, color: "var(--ec-dim)", lineHeight: 1.5 }}>
            {grid.loadMore
              ? "Shows photos in batches behind a “Load more” button."
              : "Shows a selection with an “All projects” link."}
          </p>
        </div>
      )}
    </div>
  );
}
