"use client";

import { useEffect, useRef, useState } from "react";
import { useEditorStore, type PortfolioDesign } from "~/lib/editor/store";
import { loadState } from "~/lib/editor/localStorage";
import { EditorThemeProvider, THEME_VARS, useEditorTheme } from "~/lib/editor/editorTheme";
import { api } from "~/trpc/react";
import { TopBar } from "./TopBar";
import { Canvas } from "./Canvas";
import { Sidebar, type SidebarTab } from "./Sidebar";
import { InspectorPanel } from "~/components/editor/panels/InspectorPanel";
import { FloatingTextToolbar } from "~/components/editor/canvas/FloatingTextToolbar";
import type { TemplateId } from "~/lib/editor/templates/registry";

// Side-effect: load all @fontsource CSS
import "~/lib/editor/fonts";

interface ShellProps {
  templateId?:    TemplateId;
  portfolioId?:   string;
  initialDesign?: PortfolioDesign;
  galleryPhotos?: { src: string; title?: string }[];
}

function EditorShellInner({ templateId, portfolioId, initialDesign, galleryPhotos }: ShellProps) {
  const {
    setTemplate, updateNode, setPalette, setTypography, setLogo,
    hydrateDesign, setGalleryPhotos, setReadOnly,
    setSelectedSection, setHoveredSection,
    palette, typography, buttons, grid, selectedSection, hoveredSection, hiddenSections,
    nodes, logo,
  } = useEditorStore();

  // One left panel, three modes. Design (the global system) is shown first.
  const [tab, setTab] = useState<SidebarTab>("design");

  // Canvas editing works in every tab, so the element selection is kept when
  // switching. Only the Pages-tree section highlight is cleared on the way out
  // so its big outline doesn't linger over Design/Settings.
  function changeTab(next: SidebarTab) {
    if (next !== "pages") {
      setSelectedSection(null);
      setHoveredSection(null);
    }
    setTab(next);
  }

  const { theme } = useEditorTheme();
  const saveDesign = api.portfolio.saveDesign.useMutation();

  const hydrated  = useRef(false);
  const lastSaved = useRef<string | null>(null);

  /* ── DB-backed editor (tied to a portfolio) ── */
  useEffect(() => {
    if (!portfolioId) return;
    setReadOnly(false);
    hydrateDesign(initialDesign ?? { templateId: "minimal-bw" });
    setGalleryPhotos(galleryPhotos ?? []);
    lastSaved.current = JSON.stringify(initialDesign ?? {});
    hydrated.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolioId]);

  /* Debounced autosave of the design to the DB. */
  useEffect(() => {
    if (!portfolioId || !hydrated.current) return;
    const design: PortfolioDesign = {
      templateId: useEditorStore.getState().templateId,
      nodes, palette, typography, buttons, grid, logo, hiddenSections,
    };
    const json = JSON.stringify(design);
    if (json === lastSaved.current) return;
    const t = setTimeout(() => {
      saveDesign.mutate({ id: portfolioId, editorState: design });
      lastSaved.current = json;
    }, 1000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, palette, typography, buttons, grid, logo, hiddenSections, portfolioId]);

  /* ── Legacy localStorage editor (/editor/minimal-bw) ── */
  useEffect(() => {
    if (portfolioId) return;          // DB path handles its own load
    if (templateId) setTemplate(templateId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  useEffect(() => {
    if (portfolioId) return;
    const saved = loadState();
    if (!saved) return;
    for (const [id, node] of Object.entries(saved.nodes)) updateNode(id, node);
    setPalette(saved.palette);
    if (saved.typography) setTypography(saved.typography);
    if (saved.logo) setLogo(saved.logo);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: "flex", flexDirection: "column", height: "100dvh",
        background: "#0a0a0a",
        ...THEME_VARS[theme],
      }}
    >
      <TopBar
        portfolioId={portfolioId}
        saving={saveDesign.isPending}
      />

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <Sidebar tab={tab} setTab={changeTab} />
        {/* Canvas editing is available in every tab: the image inspector and the
            floating text toolbar self-hide until an element is selected. */}
        <InspectorPanel />
        <Canvas />
      </div>

      {/* Floating formatting toolbar — appears above the selected text node */}
      <FloatingTextToolbar />

      <style>{`
        :root {
          ${(Object.entries(THEME_VARS[theme]) as [string, string][]).map(([k, v]) => `${k}: ${v};`).join(" ")}
        }
        .canvas-frame {
          --ed-bg:     ${palette.bg};
          --ed-fg:     ${palette.fg};
          --ed-accent: ${palette.accent};
          --ed-muted:  ${palette.muted};
          --tpl-serif: ${typography.serif};
          --tpl-sans:  ${typography.sans};
          --tpl-mono:  ${typography.mono};
          --ed-btn-radius: ${buttons.radius}px;
          --ed-btn-bg: ${buttons.bg || "var(--ed-fg)"};
          --ed-btn-fg: ${buttons.fg || "var(--ed-bg)"};
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

export function EditorShell(props: ShellProps = {}) {
  return (
    <EditorThemeProvider>
      <EditorShellInner {...props} />
    </EditorThemeProvider>
  );
}
