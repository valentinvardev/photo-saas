"use client";

import { useEffect } from "react";
import { useEditorStore } from "~/lib/editor/store";
import { loadState } from "~/lib/editor/localStorage";
import { TopBar } from "./TopBar";
import { Canvas } from "./Canvas";
import { RightSidebar } from "./RightSidebar";

// Load fontsource CSS (side-effect imports)
import "~/lib/editor/fonts";

export function EditorShell() {
  const { nodes: _n, palette, reset: _r, updateNode, setPalette } = useEditorStore();

  // Hydrate from localStorage on first render
  useEffect(() => {
    const saved = loadState();
    if (!saved) return;

    // Restore nodes
    for (const [id, node] of Object.entries(saved.nodes)) {
      updateNode(id, node);
    }
    // Restore palette
    setPalette(saved.palette);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        background: "#0a0a0a",
      }}
    >
      <TopBar />

      {/* Main area */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Canvas />
        <RightSidebar />
      </div>

      {/* Inject palette CSS variables into the canvas */}
      <style>{`
        .canvas-frame {
          --ed-bg: ${palette.bg};
          --ed-fg: ${palette.fg};
          --ed-accent: ${palette.accent};
          --ed-muted: ${palette.muted};
        }
      `}</style>
    </div>
  );
}
