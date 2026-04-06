"use client";

import { useEditorStore } from "~/lib/editor/store";
import { TextPanel } from "./TextPanel";
import { ImagePanel } from "./ImagePanel";

interface Props {
  nodeId: string;
}

export function PanelTabs({ nodeId }: Props) {
  const { nodes } = useEditorStore();
  const node = nodes[nodeId];
  const isImage = node?.type === "image";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Node label */}
      <div style={{ padding: "10px 14px 12px", borderBottom: "1px solid #1a1a1a" }}>
        <p style={{ color: "#444", fontSize: 10, margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {isImage ? "Image" : "Text"} — <span style={{ color: "#666" }}>{node?.id ?? nodeId}</span>
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {isImage ? <ImagePanel nodeId={nodeId} /> : <TextPanel nodeId={nodeId} />}
      </div>
    </div>
  );
}
