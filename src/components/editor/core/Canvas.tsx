"use client";

import { useEffect, useRef } from "react";
import { useEditorStore } from "~/lib/editor/store";
import { deviceContentRef } from "~/lib/editor/deviceRef";
import { EditableTemplate } from "~/components/editor/canvas/EditableTemplate";

/* ─────────────────────────────────────────────────────────────────────────
   Device content heights (visible scroll window, in px)
───────────────────────────────────────────────────────────────────────── */
const CONTENT_H = { mobile: 660, tablet: 756, desktop: 660 } as const;

/* ─────────────────────────────────────────────────────────────────────────
   Shared content wrapper — the scrollable "screen" inside each device
───────────────────────────────────────────────────────────────────────── */
function DeviceScreen({
  refEl,
  height,
  width,
  radius = 0,
  children,
}: {
  refEl: React.RefObject<HTMLDivElement | null>;
  height: number;
  width?: number | string;
  radius?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={refEl}
      className="editor-canvas-scroll"
      style={{
        width:        width ?? "100%",
        height,
        overflowY:    "auto",
        overflowX:    "hidden",
        background:   "#fafafa",
        borderRadius: radius,
        flexShrink:   0,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Mobile frame  — iPhone Dynamic Island style
───────────────────────────────────────────────────────────────────────── */
function MobileFrame({ contentRef }: { contentRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      style={{
        width:        393,
        background:   "#111",
        borderRadius: 50,
        padding:      "0 9px",
        boxShadow:    "0 40px 80px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.06)",
        flexShrink:   0,
      }}
    >
      {/* Dynamic Island */}
      <div style={{ height: 44, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: 126, height: 34, background: "#000", borderRadius: 20 }} />
      </div>

      {/* Screen */}
      <DeviceScreen refEl={contentRef} height={CONTENT_H.mobile} width={375} radius={4}>
        <EditableTemplate viewport="mobile" />
      </DeviceScreen>

      {/* Home indicator */}
      <div style={{ height: 36, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: 134, height: 5, background: "#333", borderRadius: 3 }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Tablet frame  — iPad style
───────────────────────────────────────────────────────────────────────── */
function TabletFrame({ contentRef }: { contentRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      style={{
        width:        816,
        background:   "#111",
        borderRadius: 28,
        padding:      "18px 24px 40px",
        boxShadow:    "0 40px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.06)",
        flexShrink:   0,
      }}
    >
      {/* Top bezel — camera dot */}
      <div style={{ height: 14, display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2a2a2a" }} />
      </div>

      {/* Screen */}
      <DeviceScreen refEl={contentRef} height={CONTENT_H.tablet} width={768} radius={6}>
        <EditableTemplate viewport="tablet" />
      </DeviceScreen>

      {/* Home bar */}
      <div style={{ height: 20, display: "flex", justifyContent: "center", alignItems: "center", marginTop: 12 }}>
        <div style={{ width: 120, height: 5, background: "#2a2a2a", borderRadius: 3 }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Desktop frame  — Browser chrome style
───────────────────────────────────────────────────────────────────────── */
function DesktopFrame({ contentRef }: { contentRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div
      style={{
        width:     "100%",
        maxWidth:  1280,
        borderRadius: 10,
        overflow:  "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        flexShrink: 0,
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          height:     40,
          background: "#1e1e1e",
          display:    "flex",
          alignItems: "center",
          padding:    "0 14px",
          gap:        6,
          borderBottom: "1px solid #2a2a2a",
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 6, marginRight: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
        </div>
        {/* Nav arrows */}
        <div style={{ display: "flex", gap: 4, marginRight: 8 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
        {/* URL bar */}
        <div
          style={{
            flex:        1,
            height:      26,
            background:  "#2a2a2a",
            borderRadius: 6,
            display:     "flex",
            alignItems:  "center",
            gap:         6,
            padding:     "0 10px",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#666" }}>jameshollis.frame.co</span>
        </div>
      </div>

      {/* Screen */}
      <DeviceScreen refEl={contentRef} height={CONTENT_H.desktop}>
        <EditableTemplate viewport="desktop" />
      </DeviceScreen>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Canvas
───────────────────────────────────────────────────────────────────────── */
export function Canvas() {
  const { selectNode, viewport } = useEditorStore();
  const contentRef = useRef<HTMLDivElement>(null);

  // Keep the module-level ref in sync with the current content div
  useEffect(() => {
    deviceContentRef.current = contentRef.current;
    return () => { deviceContentRef.current = null; };
  }, [viewport]); // rebind whenever viewport switches (new DOM node)

  return (
    <div
      style={{
        flex:           1,
        overflowY:      "auto",
        overflowX:      "hidden",
        background:     "#161616",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "flex-start",
        padding:        "36px 40px 60px",
        gap:            0,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) selectNode(null);
      }}
    >
      {viewport === "mobile"  && <MobileFrame  contentRef={contentRef} />}
      {viewport === "tablet"  && <TabletFrame  contentRef={contentRef} />}
      {viewport === "desktop" && <DesktopFrame contentRef={contentRef} />}

      {/* Device label */}
      <div style={{ marginTop: 14, fontFamily: "monospace", fontSize: 10, color: "#333", letterSpacing: "0.08em" }}>
        {viewport === "mobile"  ? "iPhone 15 Pro · 393×852"  :
         viewport === "tablet"  ? "iPad Air · 820×1180"      :
                                  "Desktop · 1280px"}
      </div>
    </div>
  );
}
