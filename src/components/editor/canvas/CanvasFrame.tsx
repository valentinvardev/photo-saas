"use client";

import { useEditorStore } from "~/lib/editor/store";
import { EditableTemplate } from "./EditableTemplate";

interface Props {
  scale: number;
  width: number;
}

export function CanvasFrame({ scale, width }: Props) {
  const { palette, viewport } = useEditorStore();

  return (
    <div
      style={{
        width,
        transformOrigin: "top center",
        transform: `scale(${scale})`,
        // Pull up the space that scale leaves behind
        marginBottom: `calc((${scale} - 1) * ${width}px)`,
        flexShrink: 0,
      }}
    >
      <div
        className="canvas-frame"
        style={{
          width,
          background: palette.bg,
          minHeight: 600,
          position: "relative",
          /* Inject palette + font variables inline so they cascade into the template */
          // @ts-expect-error CSS custom properties
          "--ed-bg":     palette.bg,
          "--ed-fg":     palette.fg,
          "--ed-accent": palette.accent,
          "--ed-muted":  palette.muted,
        }}
      >
        <EditableTemplate viewport={viewport} />
      </div>
    </div>
  );
}
