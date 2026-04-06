"use client";

import { useEffect } from "react";
import { useEditorStore } from "~/lib/editor/store";
import { loadState } from "~/lib/editor/localStorage";
import { TopBar } from "./TopBar";
import { Canvas } from "./Canvas";
import { Sidebar } from "./Sidebar";

// Side-effect: load all @fontsource CSS
import "~/lib/editor/fonts";

export function EditorShell() {
  const { updateNode, setPalette } = useEditorStore();

  // Hydrate from localStorage on first render
  useEffect(() => {
    const saved = loadState();
    if (!saved) return;
    for (const [id, node] of Object.entries(saved.nodes)) {
      updateNode(id, node);
    }
    setPalette(saved.palette);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "#0a0a0a" }}>
      <TopBar />

      {/* Main area — sidebar LEFT, canvas RIGHT */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar />
        <Canvas />
      </div>
    </div>
  );
}
