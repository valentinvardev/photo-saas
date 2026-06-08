"use client";

import { useEditorStore } from "~/lib/editor/store";
import { ColorSwatch } from "~/components/editor/shared/ColorSwatch";
import { useT } from "~/components/providers/LangProvider";

export function ColorPalettePanel() {
  const { palette, setPalette } = useEditorStore();
  const { t } = useT();

  const swatches: Array<{ key: keyof typeof palette; label: string }> = [
    { key: "bg",     label: t("editor.colors.background") },
    { key: "fg",     label: t("editor.colors.text")       },
    { key: "accent", label: t("editor.colors.accent")     },
    { key: "muted",  label: t("editor.colors.muted")      },
  ];

  return (
    <div style={{ padding: "16px 12px" }}>
      <p style={{ color: "var(--ec-sub)", fontSize: 11, margin: "0 0 12px", lineHeight: 1.4 }}>
        {t("editor.colors.note")}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {swatches.map(({ key, label }) => (
          <ColorSwatch
            key={key}
            label={label}
            value={palette[key]}
            onChange={(val) => setPalette({ [key]: val })}
          />
        ))}
      </div>

      {/* Preset palettes */}
      <div style={{ marginTop: 20, borderTop: "1px solid var(--ec-line)", paddingTop: 16 }}>
        <p style={{ color: "var(--ec-sub)", fontSize: 11, margin: "0 0 10px" }}>{t("editor.colors.presets")}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[
            { label: "Classic BW",  palette: { bg: "#fafafa", fg: "var(--ec-bg)", accent: "var(--ec-bg)", muted: "#6b7280" } },
            { label: "Dark Mode",   palette: { bg: "var(--ec-bg)", fg: "#f0f0f0", accent: "#f0f0f0", muted: "#9ca3af" } },
            { label: "Warm Cream",  palette: { bg: "#fdf6ec", fg: "#1a1208", accent: "#8b5e3c", muted: "#8a7a68" } },
            { label: "Cool Slate",  palette: { bg: "#f0f4f8", fg: "#1e293b", accent: "#334155", muted: "#64748b" } },
          ].map((p) => (
            <button
              key={p.label}
              onClick={() => setPalette(p.palette)}
              style={{
                background: p.palette.bg,
                border: `1px solid ${p.palette.fg}22`,
                color: p.palette.fg,
                fontSize: 10,
                padding: "4px 8px",
                borderRadius: 3,
                cursor: "pointer",
                fontFamily: "monospace",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
