"use client";

import { useEffect } from "react";
import { useEditorStore } from "~/lib/editor/store";
import { loadState } from "~/lib/editor/localStorage";
import { TopBar } from "./TopBar";
import { Canvas } from "./Canvas";
import { Sidebar } from "./Sidebar";
import { InspectorPanel } from "~/components/editor/panels/InspectorPanel";
import type { TemplateId } from "~/lib/editor/templates/registry";

// Side-effect: load all @fontsource CSS
import "~/lib/editor/fonts";

export function EditorShell({ templateId }: { templateId?: TemplateId } = {}) {
  const {
    setTemplate, updateNode, setPalette, setTypography, setLogo,
    palette, typography, selectedSection, hoveredSection,
    hiddenSections,
  } = useEditorStore();

  // Set the active template before any other hydration
  useEffect(() => {
    if (templateId) setTemplate(templateId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  // Hydrate from localStorage on first render
  useEffect(() => {
    const saved = loadState();
    if (!saved) return;
    for (const [id, node] of Object.entries(saved.nodes)) {
      updateNode(id, node);
    }
    setPalette(saved.palette);
    if (saved.typography) setTypography(saved.typography);
    if (saved.logo) setLogo(saved.logo);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", background: "#0a0a0a" }}>
      <TopBar />

      {/* Main area — Sidebar · InspectorPanel (when node selected) · Canvas */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar />
        <InspectorPanel />
        <Canvas />
      </div>

      {/*
        Global style injections:
        1. Palette + typography CSS variables on .canvas-frame
        2. Section hover/selection amber outlines
        3. Hidden sections (display:none)
        4. Hidden nodes (display:none via data-node-id attribute)
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

        ${hiddenSections.map((id) => `#${id} { display: none !important; }`).join("\n")}
      `}</style>
    </div>
  );
}
