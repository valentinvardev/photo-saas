"use client";

import { useState } from "react";
import { useEditorStore } from "~/lib/editor/store";

interface Props {
  nodeId: string;
}

export function ImagePanel({ nodeId }: Props) {
  const { nodes, updateNode } = useEditorStore();
  const node = nodes[nodeId];
  const [draft, setDraft] = useState(node?.src ?? "");

  function apply() {
    updateNode(nodeId, { src: draft.trim() });
  }

  return (
    <div style={{ padding: "16px 12px" }}>
      <label style={{ color: "#888", fontSize: 11, display: "block", marginBottom: 6 }}>Image URL</label>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") apply(); }}
        placeholder="https://..."
        style={{
          width: "100%",
          background: "#0a0a0a",
          border: "1px solid #333",
          color: "#eee",
          fontSize: 12,
          padding: "7px 8px",
          borderRadius: 4,
          outline: "none",
          boxSizing: "border-box",
          marginBottom: 8,
        }}
      />
      <button
        onClick={apply}
        style={{
          width: "100%",
          background: "#222",
          border: "1px solid #333",
          color: "#eee",
          fontSize: 12,
          padding: "7px",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Apply
      </button>

      {/* Preview */}
      {node?.src && (
        <div style={{ marginTop: 12, borderRadius: 4, overflow: "hidden", aspectRatio: "4/3" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={node.src}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      )}

      <p style={{ color: "#444", fontSize: 10, marginTop: 10, lineHeight: 1.5 }}>
        Paste any image URL or use a service like Unsplash.<br />
        Enter to apply.
      </p>
    </div>
  );
}
