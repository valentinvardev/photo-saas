"use client";

import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "~/lib/editor/store";
import { TEMPLATES, DEFAULT_TEMPLATE_ID, type TemplateId } from "~/lib/editor/templates/registry";
import type { ColorPalette, Typography, EditorNode, LogoSettings } from "~/lib/editor/types";

// Load the builder's @fontsource CSS so the real template renders the chosen fonts.
import "~/lib/editor/fonts";

/* The template is authored at desktop width; we render it at this fixed width and
   scale it down with a CSS transform to fit whatever the preview pane gives us. */
const FRAME_W = 1280;

/**
 * Renders the *real* website-builder template (the same component the editor and
 * the public site use) with the user's onboarding branding applied live.
 *
 * It hydrates the shared editor store in read-only mode and re-hydrates whenever
 * the chosen palette / fonts / template / identity / photos change, so the
 * onboarding preview is a faithful, scaled view of the real portfolio.
 *
 * `scrollable` lets the person scroll the whole site (used on the content step,
 * so uploaded photos can be browsed as they come in).
 */
export function LiveTemplatePreview({
  templateId,
  palette,
  typography,
  nodes,
  logo,
  galleryPhotos,
  slug,
  scrollable = false,
}: {
  templateId: TemplateId;
  palette: ColorPalette;
  typography: Typography;
  nodes?: Record<string, EditorNode>;
  logo?: LogoSettings;
  galleryPhotos?: { src: string; title?: string }[];
  slug: string;
  scrollable?: boolean;
}) {
  const hydrateDesign    = useEditorStore((s) => s.hydrateDesign);
  const setGalleryPhotos = useEditorStore((s) => s.setGalleryPhotos);
  const setReadOnly      = useEditorStore((s) => s.setReadOnly);
  const storeTemplateId  = useEditorStore((s) => s.templateId);

  const [ready, setReady] = useState(false);

  // `nodes` / `galleryPhotos` are fresh objects every parent render, so depend on
  // a stable string key instead — re-hydrate only when the content changes.
  const designKey = JSON.stringify({ templateId, palette, typography, nodes, logo, galleryPhotos });
  useEffect(() => {
    setReadOnly(true);
    setGalleryPhotos(galleryPhotos ?? []);
    hydrateDesign({ templateId, palette, typography, nodes, logo });
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designKey]);

  // Scale the fixed-width frame to fit the pane width.
  const paneRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.42);
  const [innerH, setInnerH] = useState(0);

  useEffect(() => {
    const el = paneRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      if (w > 0) setScale(w / FRAME_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Track the rendered template height so the scroll area is sized to the scaled
  // content (CSS transforms don't shrink the layout box).
  useEffect(() => {
    if (!scrollable) return;
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setInnerH(el.scrollHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [scrollable, ready, designKey]);

  const Component = TEMPLATES[storeTemplateId]?.Component ?? TEMPLATES[DEFAULT_TEMPLATE_ID]!.Component;

  const frameVars = {
    "--ed-bg": palette.bg,
    "--ed-fg": palette.fg,
    "--ed-accent": palette.accent,
    "--ed-muted": palette.muted,
    "--tpl-serif": typography.serif,
    "--tpl-sans": typography.sans,
    "--tpl-mono": typography.mono,
    "--ed-btn-radius": "0px",
    "--ed-btn-bg": "var(--ed-fg)",
    "--ed-btn-fg": "var(--ed-bg)",
    position: "absolute",
    top: 0,
    left: 0,
    width: FRAME_W,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
    // Purely visual — clicks must not open the gallery/lightbox over the wizard.
    pointerEvents: "none",
  } as React.CSSProperties;

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Browser chrome */}
      <div className="shrink-0 h-[34px] bg-[#1e1e1e] flex items-center gap-2 px-3 border-b border-[#2a2a2a]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 h-[20px] rounded bg-[#2a2a2a] flex items-center gap-1.5 px-2 ml-2 min-w-0">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" className="shrink-0"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          <span className="font-mono text-[10px] text-[#777] truncate">portapic.com/p/{slug || "tu-portafolio"}</span>
        </div>
      </div>

      {/* Scaled real template — clipped or scrollable */}
      <div ref={paneRef} className="relative flex-1 min-h-0" style={{ overflowY: scrollable ? "auto" : "hidden", overflowX: "hidden", background: palette.bg }}>
        <div style={{ position: "relative", width: "100%", height: scrollable ? innerH * scale : "100%" }}>
          <div ref={innerRef} style={frameVars}>
            {ready && <Component viewport="desktop" />}
          </div>
        </div>
      </div>
    </div>
  );
}
