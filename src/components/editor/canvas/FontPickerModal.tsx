"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FONT_OPTIONS, type FontOption } from "~/lib/editor/fonts";
import { api } from "~/trpc/react";
import { useT } from "~/components/providers/LangProvider";

type Tab = "all" | "serif" | "sans" | "mono";

const TABS: Tab[] = ["all", "serif", "sans", "mono"];
const CATEGORY_LABEL_KEY: Record<string, string> = { serif: "catSerif", sans: "catSans", mono: "catMono" };
const CATEGORY_ORDER: Array<FontOption["category"]> = ["serif", "sans", "mono"];

interface Props {
  value?: string;            // current fontFamily stack (undefined = template default)
  fallbackSample?: string;   // node text, used when the owner has no name yet
  initialTab?: Tab;          // open on a given category (defaults to All)
  onSelect: (stack: string | undefined) => void;
  onClose: () => void;
}

export function FontPickerModal({ value, fallbackSample, initialTab, onSelect, onClose }: Props) {
  const { data: me } = api.user.me.useQuery();
  const { t } = useT();
  const [hovered, setHovered] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>(initialTab ?? "all");
  const [query, setQuery] = useState("");

  // Esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [onClose]);

  const sample = (me?.name?.trim()) || (fallbackSample?.trim()) || "Your Name";
  const previewStack = hovered ?? value ?? "var(--tpl-serif, serif)";

  const q = query.trim().toLowerCase();
  const matches = (f: FontOption) =>
    (tab === "all" || f.category === tab) && (!q || f.label.toLowerCase().includes(q));
  const filtered = FONT_OPTIONS.filter(matches);
  const grouped = tab === "all" && !q; // show category headers only on the unfiltered All view

  const fontRow = (f: FontOption) => {
    const active = value === f.stack;
    return (
      <button
        key={f.value}
        onClick={() => { onSelect(f.stack); onClose(); }}
        onMouseEnter={() => setHovered(f.stack)}
        style={rowStyle(active)}
      >
        <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, minWidth: 0 }}>
          <span style={{ fontFamily: f.stack, fontSize: 19, color: active ? "#facc15" : "var(--ec-label)", lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 420 }}>
            {sample}
          </span>
          <span style={{ fontSize: 10.5, color: "var(--ec-dim)" }}>{f.label}</span>
        </span>
        {active && <Check />}
      </button>
    );
  };

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 3000,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <style>{`
        .ed-fontlist::-webkit-scrollbar { width: 9px; }
        .ed-fontlist::-webkit-scrollbar-track { background: transparent; }
        .ed-fontlist::-webkit-scrollbar-thumb { background: var(--ec-lift, #333); border-radius: 5px; border: 2px solid var(--ec-bg, #111); }
        .ed-fontlist::-webkit-scrollbar-thumb:hover { background: var(--ec-muted, #666); }
        .ed-fontlist { scrollbar-width: thin; scrollbar-color: var(--ec-lift, #333) transparent; }
        .ed-fontsearch::placeholder { color: var(--ec-sub, #999); font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; font-size: 15px; opacity: 1; }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 560, height: "min(680px, 90vh)",
          background: "var(--ec-bg, #111)", border: "1px solid var(--ec-raised, #222)",
          borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div style={{ padding: "16px 18px 14px", borderBottom: "1px solid var(--ec-raised)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--ec-bright)", letterSpacing: "-0.01em" }}>{t("editor.fontModal.title")}</h2>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ec-sub)", padding: 2, display: "flex" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          {/* Live preview of the sample name in the focused font */}
          <div style={{ background: "var(--ec-raised)", borderRadius: 9, padding: "16px", textAlign: "center", overflow: "hidden", height: 76, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: previewStack, fontSize: 34, color: "var(--ec-bright)", lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
              {sample}
            </span>
          </div>
        </div>

        {/* Search + tabs */}
        <div style={{ padding: "12px 16px 10px", borderBottom: "1px solid var(--ec-raised)", flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ec-dim)" strokeWidth="2" strokeLinecap="round" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/></svg>
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <input
              autoFocus
              className="ed-fontsearch"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("editor.fontModal.search")}
              style={{
                width: "100%", boxSizing: "border-box", background: "var(--ec-raised)",
                border: "1px solid var(--ec-lift)", color: "var(--ec-label)", fontSize: 13,
                padding: "9px 10px 9px 30px", borderRadius: 7, outline: "none", fontFamily: "inherit",
              }}
            />
            {query && (
              <button onClick={() => setQuery("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--ec-dim)", padding: 2, display: "flex" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            )}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {TABS.map((id) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  style={{
                    flex: 1, background: active ? "rgba(250,204,21,0.14)" : "var(--ec-raised)",
                    border: `1px solid ${active ? "#facc15" : "var(--ec-lift)"}`,
                    color: active ? "#facc15" : "var(--ec-sub)", fontSize: 11, fontWeight: active ? 600 : 500,
                    padding: "6px 4px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  {t(`editor.fontModal.${id}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Font list — fills the remaining height and scrolls */}
        <div className="ed-fontlist" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "8px 8px 12px" }}>
          {/* Template default / reset — only on the unfiltered view */}
          {!q && (
            <button
              onClick={() => { onSelect(undefined); onClose(); }}
              onMouseEnter={() => setHovered("var(--tpl-serif, serif)")}
              style={rowStyle(value === undefined)}
            >
              <span style={{ fontSize: 14, color: value === undefined ? "#facc15" : "var(--ec-label)" }}>{t("editor.fontModal.templateDefault")}</span>
              {value === undefined && <Check />}
            </button>
          )}

          {filtered.length === 0 && (
            <p style={{ textAlign: "center", color: "var(--ec-dim)", fontSize: 12, padding: "28px 0" }}>{t("editor.fontModal.noMatch", { q: query })}</p>
          )}

          {grouped
            ? CATEGORY_ORDER.map((cat) => {
                const fonts = filtered.filter((f) => f.category === cat);
                if (fonts.length === 0) return null;
                return (
                  <div key={cat} style={{ marginTop: 8 }}>
                    <p style={{ margin: "8px 10px 4px", fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--ec-dim)", fontWeight: 600 }}>
                      {t(`editor.fontModal.${CATEGORY_LABEL_KEY[cat]}`)}
                    </p>
                    {fonts.map(fontRow)}
                  </div>
                );
              })
            : filtered.map(fontRow)}
        </div>
      </div>
    </div>,
    document.body,
  );
}

function rowStyle(active: boolean): React.CSSProperties {
  return {
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
    width: "100%", textAlign: "left", cursor: "pointer",
    background: active ? "rgba(250,204,21,0.1)" : "none",
    border: "1px solid " + (active ? "rgba(250,204,21,0.4)" : "transparent"),
    borderRadius: 8, padding: "9px 12px", fontFamily: "inherit",
  };
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
