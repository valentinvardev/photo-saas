"use client";

import { useState } from "react";
import { useEditorStore } from "~/lib/editor/store";
import { TextPanel } from "./TextPanel";
import { ImagePanel } from "./ImagePanel";
import { ColorPalettePanel } from "./ColorPalettePanel";

interface Props {
  nodeId: string;
}

const TAB_STYLES: React.CSSProperties = {
  flex: 1,
  background: "none",
  border: "none",
  borderBottom: "2px solid transparent",
  color: "#666",
  fontSize: 12,
  padding: "10px 0",
  cursor: "pointer",
  fontFamily: "inherit",
};

const TAB_ACTIVE: React.CSSProperties = {
  ...TAB_STYLES,
  color: "#eee",
  borderBottomColor: "#facc15",
};

export function PanelTabs({ nodeId }: Props) {
  const { nodes } = useEditorStore();
  const node = nodes[nodeId];
  const isImage = node?.type === "image";

  const [tab, setTab] = useState<"content" | "palette">("content");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Selected node label */}
      <div style={{ padding: "10px 12px 0", borderBottom: "1px solid #1f1f1f" }}>
        <p style={{ color: "#555", fontSize: 10, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Selected: <span style={{ color: "#888" }}>{node?.id ?? nodeId}</span>
        </p>
        <div style={{ display: "flex" }}>
          <button style={tab === "content" ? TAB_ACTIVE : TAB_STYLES} onClick={() => setTab("content")}>
            {isImage ? "Image" : "Text"}
          </button>
          <button style={tab === "palette" ? TAB_ACTIVE : TAB_STYLES} onClick={() => setTab("palette")}>
            Colors
          </button>
        </div>
      </div>

      {/* Panel content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "content" ? (
          isImage ? <ImagePanel nodeId={nodeId} /> : <TextPanel nodeId={nodeId} />
        ) : (
          <ColorPalettePanel />
        )}
      </div>
    </div>
  );
}
