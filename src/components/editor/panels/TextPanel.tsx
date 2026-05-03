"use client";

import { useEditorStore } from "~/lib/editor/store";

interface Props {
  nodeId: string;
}

export function TextPanel({ nodeId }: Props) {
  const { nodes, updateNode } = useEditorStore();
  const node = nodes[nodeId];

  if (!node) return null;

  // Strip basic HTML tags for the plain-text textarea value
  const plainText = (node.content ?? "").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    // Convert newlines back to <br/> and store
    const html = e.target.value.replace(/\n/g, "<br/>");
    updateNode(nodeId, { content: html });
  }

  return (
    <div style={{ padding: "16px 12px" }}>
      <label style={{ color: "var(--ec-sub)", fontSize: 10, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {node.type === "heading" ? "Heading" : "Paragraph"}
      </label>

      <textarea
        value={plainText}
        onChange={handleChange}
        rows={4}
        style={{
          width: "100%",
          background: "var(--ec-surface)",
          border: "1px solid var(--ec-border)",
          borderRadius: 4,
          color: "var(--ec-text)",
          fontSize: 13,
          lineHeight: 1.6,
          padding: "8px 10px",
          resize: "vertical",
          outline: "none",
          fontFamily: "inherit",
          boxSizing: "border-box",
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "#2563eb"; }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = "var(--ec-border)"; }}
      />

      <p style={{ color: "var(--ec-dim)", fontSize: 10, margin: "8px 0 0", lineHeight: 1.5 }}>
        Double-click on the canvas to edit with rich text formatting.
      </p>
    </div>
  );
}
