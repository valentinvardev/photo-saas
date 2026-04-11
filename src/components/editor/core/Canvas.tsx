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
      <div className="canvas-frame" style={{ minHeight: "100%" }}>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Mobile frame  — iPhone 15 Pro (titanium, Dynamic Island)
───────────────────────────────────────────────────────────────────────── */
function MobileFrame({ contentRef }: { contentRef: React.RefObject<HTMLDivElement | null> }) {
  const BUTTON_COLOR = "linear-gradient(180deg,#323232 0%,#282828 50%,#2e2e2e 100%)";
  return (
    <div style={{ position: "relative", flexShrink: 0, padding: "0 4px" }}>
      {/* Left buttons — Action (top), Volume Up, Volume Down */}
      <div style={{ position: "absolute", left: 0, top: 106, width: 4, height: 30, background: BUTTON_COLOR, borderRadius: "3px 0 0 3px", boxShadow: "-1px 0 2px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: 0, top: 156, width: 4, height: 56, background: BUTTON_COLOR, borderRadius: "3px 0 0 3px", boxShadow: "-1px 0 2px rgba(0,0,0,0.6)" }} />
      <div style={{ position: "absolute", left: 0, top: 224, width: 4, height: 56, background: BUTTON_COLOR, borderRadius: "3px 0 0 3px", boxShadow: "-1px 0 2px rgba(0,0,0,0.6)" }} />
      {/* Right button — Power / Side */}
      <div style={{ position: "absolute", right: 0, top: 180, width: 4, height: 90, background: BUTTON_COLOR, borderRadius: "0 3px 3px 0", boxShadow: "1px 0 2px rgba(0,0,0,0.6)" }} />

      {/* Phone body */}
      <div
        style={{
          width:        393,
          background:   "linear-gradient(145deg, #2c2c2e 0%, #1c1c1e 40%, #242426 100%)",
          borderRadius: 56,
          padding:      "0 9px",
          boxShadow: [
            "0 60px 120px rgba(0,0,0,0.85)",
            "0 20px 40px rgba(0,0,0,0.5)",
            "inset 0 0 0 0.5px rgba(255,255,255,0.14)",
            "inset 0 1px 0 rgba(255,255,255,0.08)",
            "inset 0 -1px 0 rgba(0,0,0,0.4)",
          ].join(", "),
        }}
      >
        {/* Top bar — Status bar + Dynamic Island */}
        <div style={{ height: 50, display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
          {/* Status bar — left: time */}
          <span style={{
            position: "absolute", left: 22, top: "50%", transform: "translateY(-50%)",
            fontFamily: "'SF Pro Display', -apple-system, monospace",
            fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.88)",
            letterSpacing: "-0.03em", lineHeight: 1,
          }}>9:41</span>

          {/* Status bar — right: WiFi + Battery */}
          <div style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 5 }}>
            {/* WiFi */}
            <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
              <path d="M7.5 10a1 1 0 100-2 1 1 0 000 2z" fill="rgba(255,255,255,0.85)"/>
              <path d="M4.8 7.6a3.8 3.8 0 015.4 0" stroke="rgba(255,255,255,0.85)" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M2.4 5.2a6.5 6.5 0 0110.2 0" stroke="rgba(255,255,255,0.85)" strokeWidth="1.3" strokeLinecap="round"/>
              <path d="M0 2.8A10 10 0 0115 2.8" stroke="rgba(255,255,255,0.85)" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            {/* Battery */}
            <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
              <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
              <rect x="2" y="2" width="13" height="7" rx="1.5" fill="rgba(255,255,255,0.88)"/>
              <path d="M19.5 3.5v4c.8-.3 1.5-1 1.5-2s-.7-1.7-1.5-2z" fill="rgba(255,255,255,0.55)"/>
            </svg>
          </div>

          {/* Speaker grille top */}
          <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%) translateX(-52px)", width: 22, height: 4, background: "#111", borderRadius: 2, opacity: 0.6 }} />
          {/* Dynamic Island */}
          <div style={{
            width: 124, height: 36,
            background: "#000",
            borderRadius: 20,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 2px rgba(0,0,0,0.8)",
            display: "flex", alignItems: "center", justifyContent: "flex-end",
            paddingRight: 11, gap: 6,
          }}>
            {/* Camera ring */}
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#0d0d0d", boxShadow: "0 0 0 1.5px #1a1a1a, inset 0 0 4px rgba(80,130,255,0.18)" }} />
          </div>
        </div>

        {/* Screen */}
        <DeviceScreen refEl={contentRef} height={CONTENT_H.mobile} width={375} radius={14}>
          <EditableTemplate viewport="mobile" />
        </DeviceScreen>

        {/* Home bar */}
        <div style={{ height: 44, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ width: 134, height: 5, background: "rgba(255,255,255,0.22)", borderRadius: 3 }} />
        </div>
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
