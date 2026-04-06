"use client";

import { useEditorStore } from "~/lib/editor/store";
import { FONT_OPTIONS } from "~/lib/editor/fonts";
import type { Typography } from "~/lib/editor/types";

/* ─────────────────────────────────────────────────────────────────────────
   Font picker for a single type role (serif / sans / mono)
───────────────────────────────────────────────────────────────────────── */
function FontPicker({
  role,
  label,
  category,
  value,
  onChange,
}: {
  role: keyof Typography;
  label: string;
  category: "serif" | "sans" | "mono";
  value: string;
  onChange: (stack: string) => void;
}) {
  const options = FONT_OPTIONS.filter((f) => f.category === category);
  const active  = options.find((f) => value.includes(f.value));

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <label style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {label}
        </label>
        <span style={{ fontFamily: "monospace", fontSize: 9, color: "#333", background: "#1a1a1a", padding: "1px 5px", borderRadius: 2 }}>
          {category}
        </span>
      </div>

      {/* Font preview strip */}
      <div style={{ marginBottom: 8, padding: "8px 10px", background: "#0a0a0a", borderRadius: 4, border: "1px solid #1a1a1a" }}>
        <span style={{ fontFamily: active?.stack ?? value, fontSize: 18, color: "#ccc", lineHeight: 1 }}>
          {active?.label ?? "Font"}
        </span>
        <span style={{ fontFamily: active?.stack ?? value, fontSize: 11, color: "#555", marginLeft: 8 }}>
          Aa Bb Cc
        </span>
      </div>

      {/* Select */}
      <div style={{ position: "relative" }}>
        <select
          value={active?.value ?? ""}
          onChange={(e) => {
            const found = options.find((f) => f.value === e.target.value);
            if (found) onChange(found.stack);
          }}
          style={{
            width:        "100%",
            background:   "#111",
            border:       "1px solid #2a2a2a",
            color:        "#aaa",
            fontSize:     12,
            padding:      "6px 28px 6px 8px",
            borderRadius: 4,
            outline:      "none",
            cursor:       "pointer",
            appearance:   "none",
            WebkitAppearance: "none",
            fontFamily:   "inherit",
          }}
        >
          {options.map((f) => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.stack }}>
              {f.label}
            </option>
          ))}
        </select>
        {/* Chevron */}
        <svg
          width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#555"
          strokeWidth="2" strokeLinecap="round"
          style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>

      {/* Font grid options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, marginTop: 6 }}>
        {options.map((f) => (
          <button
            key={f.value}
            onClick={() => onChange(f.stack)}
            style={{
              background:   value.includes(f.value) ? "#1a2a3a" : "#111",
              border:       `1px solid ${value.includes(f.value) ? "#2563eb" : "#1f1f1f"}`,
              borderRadius: 3,
              padding:      "5px 7px",
              cursor:       "pointer",
              textAlign:    "left",
            }}
          >
            <span style={{ fontFamily: f.stack, fontSize: 13, color: value.includes(f.value) ? "#93c5fd" : "#555", display: "block", lineHeight: 1.2 }}>
              Ag
            </span>
            <span style={{ fontFamily: "inherit", fontSize: 9, color: "#333", display: "block", marginTop: 2 }}>
              {f.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Typography panel
───────────────────────────────────────────────────────────────────────── */
export function TypographyPanel() {
  const { typography, setTypography } = useEditorStore();

  return (
    <div style={{ padding: "14px 12px" }}>
      <p style={{ color: "#444", fontSize: 10, margin: "0 0 14px", lineHeight: 1.5 }}>
        Changes apply site-wide via CSS variables.
      </p>

      <FontPicker
        role="serif"
        label="Serif — headings"
        category="serif"
        value={typography.serif}
        onChange={(stack) => setTypography({ serif: stack })}
      />
      <FontPicker
        role="sans"
        label="Sans — body"
        category="sans"
        value={typography.sans}
        onChange={(stack) => setTypography({ sans: stack })}
      />
      <FontPicker
        role="mono"
        label="Mono — labels"
        category="mono"
        value={typography.mono}
        onChange={(stack) => setTypography({ mono: stack })}
      />
    </div>
  );
}
