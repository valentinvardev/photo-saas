"use client";

import { useEditorStore } from "~/lib/editor/store";
import { PanelTabs } from "~/components/editor/panels/PanelTabs";

export function RightSidebar() {
  const { selectedId } = useEditorStore();

  return (
    <aside
      style={{
        width: "var(--ed-sidebar-w)",
        height: "100%",
        background: "#111",
        borderLeft: "1px solid #222",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {selectedId ? (
        <PanelTabs nodeId={selectedId} />
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: 24,
            textAlign: "center",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 9h6M9 12h6M9 15h4" />
          </svg>
          <p style={{ color: "#555", fontSize: 12, lineHeight: 1.5 }}>
            Click any element on the canvas to edit it.
          </p>
        </div>
      )}
    </aside>
  );
}
