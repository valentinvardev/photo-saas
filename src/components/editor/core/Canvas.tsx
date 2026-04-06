"use client";

import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "~/lib/editor/store";
import { CanvasFrame } from "~/components/editor/canvas/CanvasFrame";

const VIEWPORT_WIDTHS = { desktop: 1280, tablet: 768, mobile: 375 } as const;

export function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale]   = useState(1);
  const { selectNode, viewport } = useEditorStore();

  const templateW = VIEWPORT_WIDTHS[viewport];

  useEffect(() => {
    function compute() {
      if (!containerRef.current) return;
      const avail = containerRef.current.clientWidth - 80; // 40px padding each side
      setScale(Math.min(avail / templateW, 1));
    }
    compute();
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [templateW]);

  return (
    <div
      ref={containerRef}
      className="editor-canvas-scroll"
      style={{
        flex: 1,
        overflow: "auto",
        background: "var(--ed-canvas-bg)",
        padding: "32px 40px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) selectNode(null);
      }}
    >
      <CanvasFrame scale={scale} width={templateW} />

      {/* Viewport label below canvas */}
      <div className="viewport-label" style={{ marginTop: scale < 1 ? `calc((${scale} - 1) * ${templateW}px + 16px)` : "16px" }}>
        {viewport} · {templateW}px
      </div>
    </div>
  );
}
