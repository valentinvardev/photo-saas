"use client";

import { useEditorStore } from "~/lib/editor/store";
import { PanelTabs } from "~/components/editor/panels/PanelTabs";
import { ColorPalettePanel } from "~/components/editor/panels/ColorPalettePanel";
import { useState } from "react";

type Tab = "element" | "palette";

export function Sidebar() {
  const { selectedId } = useEditorStore();
  const [tab, setTab] = useState<Tab>("element");

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    background: "none",
    border: "none",
    borderBottom: `2px solid ${active ? "#facc15" : "transparent"}`,
    color: active ? "#eee" : "#555",
    fontSize: 11,
    padding: "9px 0",
    cursor: "pointer",
    letterSpacing: "0.04em",
    fontFamily: "inherit",
    transition: "color 0.15s",
  });

  return (
    <aside
      style={{
        width: "var(--ed-sidebar-w)",
        height: "100%",
        background: "#0d0d0d",
        borderRight: "1px solid #1f1f1f",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid #1f1f1f", flexShrink: 0 }}>
        <button style={tabStyle(tab === "element")} onClick={() => setTab("element")}>
          {selectedId ? "Element" : "Layers"}
        </button>
        <button style={tabStyle(tab === "palette")} onClick={() => setTab("palette")}>
          Colors
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "palette" ? (
          <ColorPalettePanel />
        ) : selectedId ? (
          <PanelTabs nodeId={selectedId} />
        ) : (
          <EmptyState />
        )}
      </div>
    </aside>
  );
}

function EmptyState() {
  return (
    <div style={{ padding: "24px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Hint */}
      <div style={{ textAlign: "center", paddingTop: 24 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2a2a2a" strokeWidth="1.5" style={{ margin: "0 auto 8px", display: "block" }}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 9h6M9 12h6M9 15h4" />
        </svg>
        <p style={{ color: "#444", fontSize: 11, lineHeight: 1.6, margin: 0 }}>
          Click any element on the canvas to select it.
        </p>
      </div>

      {/* Editable nodes list */}
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 16 }}>
        <p style={{ color: "#333", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>
          Editable elements
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { id: "nav-logo",        label: "Nav logo",         type: "text"  },
            { id: "hero-heading",    label: "Hero heading",     type: "text"  },
            { id: "hero-sub",        label: "Hero subtitle",    type: "text"  },
            { id: "hero-avail",      label: "Availability",     type: "text"  },
            { id: "about-heading",   label: "About heading",    type: "text"  },
            { id: "about-body-1",    label: "About paragraph 1",type: "text"  },
            { id: "about-body-2",    label: "About paragraph 2",type: "text"  },
            { id: "about-image",     label: "About photo",      type: "image" },
            { id: "quote-text",      label: "Quote text",       type: "text"  },
            { id: "contact-heading", label: "Contact heading",  type: "text"  },
            { id: "contact-body",    label: "Contact body",     type: "text"  },
          ].map((item) => {
            const { selectNode } = useEditorStore.getState();
            return (
              <button
                key={item.id}
                onClick={() => selectNode(item.id)}
                style={{ display: "flex", alignItems: "center", gap: 7, background: "none", border: "none", cursor: "pointer", padding: "5px 6px", borderRadius: 3, textAlign: "left" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#1a1a1a"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
              >
                <span style={{ color: item.type === "image" ? "#7c3aed" : "#2563eb", fontSize: 9, fontFamily: "monospace", background: item.type === "image" ? "#1a0a2e" : "#0a1628", padding: "1px 5px", borderRadius: 2 }}>
                  {item.type === "image" ? "img" : "txt"}
                </span>
                <span style={{ color: "#555", fontSize: 11 }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
