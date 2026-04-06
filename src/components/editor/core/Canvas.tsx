"use client";

import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "~/lib/editor/store";
import { CanvasFrame } from "~/components/editor/canvas/CanvasFrame";

export function Canvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const { selectNode } = useEditorStore();

  // Compute scale so 1280px template fits with padding
  useEffect(() => {
    function compute() {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth - 80; // 40px padding each side
      const ratio = w / 1280;
      setScale(Math.min(ratio, 1));
    }
    compute();
    const ro = new ResizeObserver(compute);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="editor-canvas-scroll"
      style={{
        flex: 1,
        overflow: "auto",
        background: "var(--ed-canvas-bg)",
        padding: "40px 40px 80px",
      }}
      onClick={(e) => {
        // Deselect when clicking canvas background
        if (e.target === e.currentTarget) selectNode(null);
      }}
    >
      <CanvasFrame scale={scale} />
    </div>
  );
}
