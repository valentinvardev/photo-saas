"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "zustand";
import { useEditorStore } from "~/lib/editor/store";
import { saveState } from "~/lib/editor/localStorage";
import { useEditorTheme } from "~/lib/editor/editorTheme";
import type { Viewport } from "~/lib/editor/types";
import { api } from "~/trpc/react";
import { useT } from "~/components/providers/LangProvider";

const VIEWPORT_PX: Record<Viewport, number> = { desktop: 1280, tablet: 768, mobile: 375 };

/* ── Icons ── */
function UndoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
    </svg>
  );
}
function RedoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 7v6h-6" /><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13" />
    </svg>
  );
}
function SaveIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}
function DesktopIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}
function TabletIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function MobileIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

const VIEWPORT_ICONS: Record<Viewport, React.ReactNode> = {
  desktop: <DesktopIcon />,
  tablet:  <TabletIcon />,
  mobile:  <MobileIcon />,
};
export function TopBar({ portfolioId, saving }: {
  portfolioId?: string;
  saving?: boolean;
} = {}) {
  const { nodes, palette, typography, logo, reset, viewport, setViewport } = useEditorStore();
  const { t } = useT();
  const vpLabel = (v: Viewport) => t(`editor.viewport.${v}`, { w: VIEWPORT_PX[v] });
  const exitTo = portfolioId ? `/dashboard/portfolio/${portfolioId}` : "/dashboard/templates";
  const { undo, redo, pastStates, futureStates } = useStore(useEditorStore.temporal);
  const { theme, toggle } = useEditorTheme();
  const router = useRouter();
  const [showExitModal, setShowExitModal] = useState(false);

  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;
  const hasChanges = pastStates.length > 0;

  // Publish state (DB-backed editor only)
  const portfolioQuery = api.portfolio.get.useQuery(
    { id: portfolioId! },
    { enabled: !!portfolioId },
  );
  const isPublished = portfolioQuery.data?.status === "published";
  const updateStatus = api.portfolio.update.useMutation({
    onSuccess: () => { void portfolioQuery.refetch(); },
  });
  function togglePublish() {
    if (!portfolioId || updateStatus.isPending) return;
    updateStatus.mutate({ id: portfolioId, status: isPublished ? "draft" : "published" });
  }

  function handleBack() {
    // With a portfolioId the design autosaves, so leaving is always safe.
    if (hasChanges && !portfolioId) setShowExitModal(true);
    else router.push(exitTo);
  }

  function handleSaveAndExit() {
    saveState({ nodes, palette, typography, logo });
    router.push(exitTo);
  }

  function handleDiscard() {
    router.push(exitTo);
  }

  const divider = <div style={{ width: 1, height: 18, background: "var(--ec-border)", margin: "0 2px" }} />;

  return (
    <>
    <header
      style={{
        height: "var(--ed-topbar-h)",
        background: "var(--ec-bg)",
        borderBottom: "1px solid var(--ec-line)",
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        gap: 10,
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      {/* Back */}
      <button
        onClick={handleBack}
        title={t("editor.backToDashboard")}
        style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 4, background: "none", border: "none", cursor: "pointer", color: "var(--ec-sub)", padding: "4px 5px", borderRadius: 3 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      </button>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 6 }}>
        <div style={{ width: 20, height: 20, background: "#facc15", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontWeight: 900, fontSize: 9, color: "#111", lineHeight: 1 }}>F</span>
        </div>
        <span style={{ color: "var(--ec-muted)", fontSize: 11, letterSpacing: "-0.01em" }}>{t("editor.builder")}</span>
      </div>

      {divider}

      {/* Undo / Redo */}
      <button onClick={() => undo()} disabled={!canUndo} title={`${t("editor.undo")} (Ctrl+Z)`}
        style={{ background: "none", border: "none", cursor: canUndo ? "pointer" : "not-allowed", color: canUndo ? "var(--ec-label)" : "var(--ec-ghost)", padding: "4px 5px", borderRadius: 3, display: "flex", alignItems: "center" }}>
        <UndoIcon />
      </button>
      <button onClick={() => redo()} disabled={!canRedo} title={`${t("editor.redo")} (Ctrl+Shift+Z)`}
        style={{ background: "none", border: "none", cursor: canRedo ? "pointer" : "not-allowed", color: canRedo ? "var(--ec-label)" : "var(--ec-ghost)", padding: "4px 5px", borderRadius: 3, display: "flex", alignItems: "center" }}>
        <RedoIcon />
      </button>

      {divider}

      {/* Viewport toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 1, background: "var(--ec-raised)", border: "1px solid var(--ec-border)", borderRadius: 5, padding: "2px 3px" }}>
        {(["desktop", "tablet", "mobile"] as Viewport[]).map((v) => (
          <button
            key={v}
            onClick={() => setViewport(v)}
            title={vpLabel(v)}
            style={{
              background: viewport === v ? "var(--ec-border)" : "none",
              border: "none",
              cursor: "pointer",
              color: viewport === v ? "var(--ec-bright)" : "var(--ec-sub)",
              padding: "4px 7px",
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              transition: "color 0.15s, background 0.15s",
            }}
          >
            {VIEWPORT_ICONS[v]}
          </button>
        ))}
      </div>

      {/* Viewport size label */}
      <span style={{ fontFamily: "monospace", fontSize: 10, color: "var(--ec-dim)", marginLeft: 2 }}>
        {viewport === "desktop" ? "1280" : viewport === "tablet" ? "768" : "375"}px
      </span>

      {divider}

      {/* Light / Dark mode toggle */}
      <button
        onClick={toggle}
        title={theme === "dark" ? t("auth.lightMode") : t("auth.darkMode")}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--ec-sub)", padding: "4px 5px", borderRadius: 3,
          display: "flex", alignItems: "center",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ec-text)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ec-sub)"; }}
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>

      <div style={{ flex: 1 }} />

      {/* Reset */}
      <button
        onClick={() => { if (confirm(t("editor.resetConfirm"))) reset(); }}
        style={{ background: "none", border: "1px solid rgba(248,113,113,0.4)", cursor: "pointer", color: "#f87171", padding: "3px 9px", borderRadius: 4, fontSize: 11 }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(248,113,113,0.1)"; e.currentTarget.style.borderColor = "#f87171"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.4)"; }}
      >
        {t("editor.reset")}
      </button>

      {/* Preview — opens the actual built site (read-only render of the design) */}
      <a
        href={portfolioId ? `/editor/${portfolioId}/preview` : "/templates/minimal-bw"}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1px solid var(--ec-border)", color: "var(--ec-label)", padding: "5px 11px", borderRadius: 4, fontSize: 11, textDecoration: "none" }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        {t("editor.preview")}
      </a>

      {/* Publish / Unpublish — reflects the portfolio's published state (DB editor only) */}
      {portfolioId && (
        isPublished ? (
          <button
            onClick={togglePublish}
            disabled={updateStatus.isPending}
            title={t("editor.unpublishHint")}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.5)", color: "#22c55e", padding: "5px 11px", borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: updateStatus.isPending ? "default" : "pointer" }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            {updateStatus.isPending ? t("editor.updating") : t("editor.published")}
          </button>
        ) : (
          <button
            onClick={togglePublish}
            disabled={updateStatus.isPending || portfolioQuery.isLoading}
            title={t("editor.publishHint")}
            style={{ display: "flex", alignItems: "center", gap: 5, background: "#facc15", border: "1px solid #facc15", color: "#111", padding: "5px 12px", borderRadius: 4, fontSize: 11, fontWeight: 700, cursor: updateStatus.isPending ? "default" : "pointer" }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            {updateStatus.isPending ? t("editor.publishing") : t("editor.publish")}
          </button>
        )
      )}

      {/* Save — DB autosave indicator when tied to a portfolio, else manual localStorage save */}
      {portfolioId ? (
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--ec-sub)", padding: "5px 12px", minWidth: 74 }}>
          {saving ? (
            <>
              <span style={{ width: 11, height: 11, borderRadius: "50%", border: "1.5px solid var(--ec-border)", borderTopColor: "#facc15", display: "inline-block", animation: "ed-spin 0.7s linear infinite" }} />
              {t("editor.saving")}
            </>
          ) : (
            <>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              {t("editor.saved")}
            </>
          )}
          <style>{`@keyframes ed-spin { to { transform: rotate(360deg); } }`}</style>
        </span>
      ) : (
        <button
          onClick={() => saveState({ nodes, palette, typography, logo })}
          style={{ background: "#facc15", border: "none", cursor: "pointer", color: "#111", padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}
        >
          <SaveIcon /> {t("editor.save")}
        </button>
      )}
    </header>

      {/* Exit confirmation modal */}
      {showExitModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
          }}
          onClick={() => setShowExitModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--ec-bg)",
              border: "1px solid var(--ec-border)",
              borderRadius: 14,
              width: "100%", maxWidth: 360,
              boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ padding: "20px 22px 16px", borderBottom: "1px solid var(--ec-line)" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--ec-text)", margin: 0 }}>
                {t("editor.exit.title")}
              </p>
              <p style={{ fontSize: 12, color: "var(--ec-muted)", marginTop: 4, lineHeight: 1.5 }}>
                {t("editor.exit.body")}
              </p>
            </div>

            {/* Actions */}
            <div style={{ padding: "14px 22px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Save & exit — primary */}
              <button
                onClick={handleSaveAndExit}
                style={{
                  width: "100%", padding: "9px 16px", borderRadius: 8,
                  background: "#facc15", border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: 700, color: "#111",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                <SaveIcon /> {t("editor.exit.saveAndExit")}
              </button>

              {/* Don't save */}
              <button
                onClick={handleDiscard}
                style={{
                  width: "100%", padding: "9px 16px", borderRadius: 8,
                  background: "none", border: "1px solid var(--ec-border)", cursor: "pointer",
                  fontSize: 13, fontWeight: 500, color: "var(--ec-label)",
                }}
              >
                {t("editor.exit.dontSave")}
              </button>

              {/* Cancel */}
              <button
                onClick={() => setShowExitModal(false)}
                style={{
                  width: "100%", padding: "7px 16px", borderRadius: 8,
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 12, color: "var(--ec-dim)",
                }}
              >
                {t("editor.exit.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
