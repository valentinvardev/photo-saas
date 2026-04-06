"use client";

import { EditableTemplate } from "./EditableTemplate";

interface Props {
  scale: number;
}

export function CanvasFrame({ scale }: Props) {
  return (
    <div
      style={{
        width: 1280,
        transformOrigin: "top center",
        transform: `scale(${scale})`,
        // Collapse extra whitespace caused by scale
        marginBottom: `calc((${scale} - 1) * 100%)`,
      }}
    >
      <div
        className="canvas-frame"
        style={{
          width: 1280,
          background: "var(--ed-bg, #fff)",
          minHeight: 800,
          position: "relative",
        }}
      >
        <EditableTemplate />
      </div>
    </div>
  );
}
