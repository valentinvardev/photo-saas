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
  const { updateNode, setPalette, setTypography, palette, typography, selectedSection, hoveredSection } = useEditorStore();

  // Hydrate from localStorage on first render
  useEffect(() => {
    const saved = loadState();
    if (!saved) return;
    for (const [id, node] of Object.entries(saved.nodes)) {
      updateNode(id, node);
    }
    setPalette(saved.palette);
    if (saved.typography) setTypography(saved.typography);
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

      {/*
        Global style injections:
        1. Palette CSS variables on .canvas-frame
        2. Template font overrides via --tpl-* variables
        3. Section hover/selection highlights using the section HTML ids
      */}
      <style>{`
        .canvas-frame {
          --ed-bg:     ${palette.bg};
          --ed-fg:     ${palette.fg};
          --ed-accent: ${palette.accent};
          --ed-muted:  ${palette.muted};
          --tpl-serif: ${typography.serif};
          --tpl-sans:  ${typography.sans};
          --tpl-mono:  ${typography.mono};
        }

        ${hoveredSection && hoveredSection !== selectedSection
          ? `#${hoveredSection} { outline: 1.5px dashed rgba(251,191,36,0.45) !important; outline-offset: -1px; }`
          : ""
        }

        ${selectedSection
          ? `#${selectedSection} { outline: 2px solid rgba(251,191,36,0.8) !important; outline-offset: -2px; }`
          : ""
        }
      `}</style>
    </div>
  );
}
