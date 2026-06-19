"use client";

import { useEffect, useState } from "react";
import { useT } from "~/components/providers/LangProvider";

const INTRO_KEY = "frame-mobile-builder-intro";

/**
 * Phone-only chrome for the website builder: a bottom Edit/Preview toggle,
 * draggable edge handles to switch panes, and a one-time intro overlay.
 */
export function MobileBuilderChrome({ pane, setPane }: { pane: 0 | 1; setPane: (p: 0 | 1) => void }) {
  const { t } = useT();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    try { if (localStorage.getItem(INTRO_KEY) !== "1") setShowIntro(true); } catch { /* ignore */ }
  }, []);

  function dismissIntro() {
    setShowIntro(false);
    try { localStorage.setItem(INTRO_KEY, "1"); } catch { /* ignore */ }
  }

  const pill = (label: string, target: 0 | 1, icon: React.ReactNode) => {
    const active = pane === target;
    return (
      <button onClick={() => setPane(target)}
        style={{
          display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 999,
          background: active ? "#facc15" : "transparent",
          color: active ? "#111" : "var(--ec-label)",
          border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: active ? 700 : 500,
          transition: "background 0.18s, color 0.18s",
        }}>
        {icon}{label}
      </button>
    );
  };

  return (
    <>
      {/* Bottom Edit / Preview toggle */}
      <div style={{
        position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 60,
        display: "flex", alignItems: "center", gap: 2, padding: 3,
        background: "var(--ec-bg)", border: "1px solid var(--ec-border)", borderRadius: 999,
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}>
        {pill(t("editor.mobile.edit"), 0, (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        ))}
        {pill(t("editor.mobile.preview"), 1, (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
        ))}
      </div>

      {/* One-time intro overlay */}
      {showIntro && (
        <div onClick={dismissIntro}
          style={{ position: "fixed", inset: 0, zIndex: 80, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ width: "100%", maxWidth: 320, background: "var(--ec-bg)", border: "1px solid var(--ec-border)", borderRadius: 16, padding: "22px 20px", textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 14 }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7l-4 5 4 5"/><path d="M16 7l4 5-4 5"/><line x1="12" y1="3" x2="12" y2="21"/></svg>
            </div>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "var(--ec-bright)" }}>{t("editor.mobile.introTitle")}</h2>
            <p style={{ margin: "8px 0 18px", fontSize: 13, lineHeight: 1.6, color: "var(--ec-muted)" }}>{t("editor.mobile.introBody")}</p>
            <button onClick={dismissIntro}
              style={{ width: "100%", padding: "10px 16px", borderRadius: 10, background: "#facc15", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#111", fontFamily: "inherit" }}>
              {t("editor.mobile.gotIt")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
