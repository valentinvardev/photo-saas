"use client";

import { useState } from "react";
import { useEditorStore } from "~/lib/editor/store";
import { FONT_OPTIONS } from "~/lib/editor/fonts";
import { DEFAULT_TYPOGRAPHY, type Typography } from "~/lib/editor/types";
import { FontPickerModal } from "~/components/editor/canvas/FontPickerModal";

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
  const options  = FONT_OPTIONS.filter((f) => f.category === category);
  const active   = options.find((f) => value.includes(f.value));
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <label style={{ color: "var(--ec-sub)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {label}
        </label>
        <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#facc15", background: "rgba(250,204,21,0.12)", border: "1px solid rgba(250,204,21,0.35)", padding: "2px 7px", borderRadius: 4 }}>
          {category}
        </span>
      </div>

      {/* Font preview strip */}
      <div style={{ marginBottom: 8, padding: "8px 10px", background: "var(--ec-surface)", borderRadius: 4, border: "1px solid var(--ec-border)" }}>
        <span style={{ fontFamily: active?.stack ?? value, fontSize: 18, color: "var(--ec-text)", lineHeight: 1 }}>
          {active?.label ?? "Font"}
        </span>
        <span style={{ fontFamily: active?.stack ?? value, fontSize: 11, color: "var(--ec-sub)", marginLeft: 8 }}>
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
            background:   "var(--ec-bg)",
            border:       "1px solid var(--ec-border)",
            color:        "var(--ec-label)",
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
          width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--ec-sub)"
          strokeWidth="2" strokeLinecap="round"
          style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>

      {/* View all fonts — opens the searchable typography modal for this role */}
      <button
        onClick={() => setModalOpen(true)}
        style={{
          width: "100%", marginTop: 6, display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 6, background: "var(--ec-bg)", border: "1px solid var(--ec-line)", borderRadius: 4,
          padding: "7px 10px", cursor: "pointer", color: "var(--ec-label)", fontFamily: "inherit", fontSize: 11,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#facc15"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--ec-line)"; }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V5h16v2M9 5v14M7 19h4"/><path d="M14 19l3-9 3 9M14.8 16.5h4.4"/></svg>
          View all fonts
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ec-sub)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>

      {modalOpen && (
        <FontPickerModal
          value={value}
          initialTab={category}
          onSelect={(stack) => onChange(stack ?? DEFAULT_TYPOGRAPHY[role])}
          onClose={() => setModalOpen(false)}
        />
      )}
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
      <p style={{ color: "var(--ec-dim)", fontSize: 10, margin: "0 0 14px", lineHeight: 1.5 }}>
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
