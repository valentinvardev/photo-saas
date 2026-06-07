"use client";

import { useEffect, useState } from "react";
import { useEditorStore, type PortfolioDesign } from "~/lib/editor/store";
import { TEMPLATES, DEFAULT_TEMPLATE_ID } from "~/lib/editor/templates/registry";
import type { Viewport } from "~/lib/editor/types";

// Load the builder's @fontsource CSS so the rendered site uses the right fonts.
import "~/lib/editor/fonts";

/** Real responsive viewport from the window width (the builder template is
 *  driven by a `viewport` prop rather than CSS breakpoints). */
function useViewport(): Viewport {
  const [vp, setVp] = useState<Viewport>("desktop");
  useEffect(() => {
    const calc = () => setVp(window.innerWidth < 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop");
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return vp;
}

/**
 * Read-only render of a portfolio's website-builder design for the public site.
 * Hydrates the editor store with the saved design + the portfolio's real photos,
 * flips it to read-only, then renders the template full-bleed.
 */
export function PortfolioSiteRender({ design, galleryPhotos }: {
  design: PortfolioDesign;
  galleryPhotos: { src: string; title?: string }[];
}) {
  const hydrateDesign    = useEditorStore((s) => s.hydrateDesign);
  const setGalleryPhotos = useEditorStore((s) => s.setGalleryPhotos);
  const setReadOnly      = useEditorStore((s) => s.setReadOnly);
  const palette          = useEditorStore((s) => s.palette);
  const typography       = useEditorStore((s) => s.typography);
  const buttons          = useEditorStore((s) => s.buttons);
  const hiddenSections   = useEditorStore((s) => s.hiddenSections);
  const templateId       = useEditorStore((s) => s.templateId);

  const [ready, setReady] = useState(false);
  const viewport = useViewport();

  useEffect(() => {
    setReadOnly(true);
    hydrateDesign(design);
    setGalleryPhotos(galleryPhotos);
    setReady(true);
  }, [design, galleryPhotos, setReadOnly, hydrateDesign, setGalleryPhotos]);

  if (!ready) return <div style={{ minHeight: "100vh", background: design.palette?.bg ?? "#fafafa" }} />;

  const Component = TEMPLATES[templateId]?.Component ?? TEMPLATES[DEFAULT_TEMPLATE_ID]!.Component;

  return (
    <div className="canvas-frame" style={{ minHeight: "100vh", background: palette.bg }}>
      <Component viewport={viewport} />
      <style>{`
        .canvas-frame {
          --ed-bg: ${palette.bg};
          --ed-fg: ${palette.fg};
          --ed-accent: ${palette.accent};
          --ed-muted: ${palette.muted};
          --tpl-serif: ${typography.serif};
          --tpl-sans: ${typography.sans};
          --tpl-mono: ${typography.mono};
          --ed-btn-radius: ${buttons.radius}px;
          --ed-btn-bg: ${buttons.bg || "var(--ed-fg)"};
          --ed-btn-fg: ${buttons.fg || "var(--ed-bg)"};
        }
        ${hiddenSections.map((id) => `#${id} { display: none !important; }`).join("\n")}
      `}</style>
    </div>
  );
}
