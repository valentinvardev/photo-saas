"use client";

import { useEditorStore } from "~/lib/editor/store";
import { FONT_OPTIONS } from "~/lib/editor/fonts";

interface Props {
  nodeId: string;
}

export function TextPanel({ nodeId }: Props) {
  const { nodes, editingId, setEditing } = useEditorStore();
  const node    = nodes[nodeId];
  const editing = editingId === nodeId;

  if (!node) return null;

  return (
    <div style={{ padding: "16px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          {node.type === "heading" ? "Heading" : "Paragraph"}
        </span>
        <button
          onClick={() => setEditing(editing ? null : nodeId)}
          style={{
            background: editing ? "#7c3aed" : "#222",
            border: "1px solid",
            borderColor: editing ? "#7c3aed" : "#333",
            color: "#eee",
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          {editing ? "Done" : "Edit text"}
        </button>
      </div>

      {editing && (
        <div style={{ background: "#0d0d0d", border: "1px solid #2d2d2d", borderRadius: 4, padding: "8px 10px", marginBottom: 12 }}>
          <p style={{ color: "#555", fontSize: 11, margin: 0, lineHeight: 1.5 }}>
            Double-click the element on the canvas to start editing inline. Press <kbd style={{ background: "#222", padding: "1px 4px", borderRadius: 2 }}>Esc</kbd> when done.
          </p>
        </div>
      )}

      {/* Content preview */}
      <div style={{ marginTop: 8 }}>
        <label style={{ color: "#555", fontSize: 10, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>Content preview</label>
        <div
          style={{ background: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: 4, padding: "8px 10px", color: "#666", fontSize: 12, minHeight: 40, lineHeight: 1.5 }}
          dangerouslySetInnerHTML={{ __html: node.content ?? "" }}
        />
      </div>

      {/* Font hint */}
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Font families</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {FONT_OPTIONS.slice(0, 6).map((f) => (
            <span
              key={f.value}
              style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#666", fontSize: 10, padding: "3px 7px", borderRadius: 3, fontFamily: f.stack }}
            >
              {f.label}
            </span>
          ))}
        </div>
        <p style={{ color: "#444", fontSize: 10, margin: 0, lineHeight: 1.4 }}>
          Use the typography toolbar that appears above the element when editing to change font family.
        </p>
      </div>
    </div>
  );
}
