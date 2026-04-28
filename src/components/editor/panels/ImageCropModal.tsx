"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import type { ImageCrop } from "~/lib/editor/types";

const MIN_PCT = 5; // minimum crop region size, in % of source

type Handle = "nw" | "ne" | "sw" | "se" | null;

export function ImageCropModal({
  src,
  value,
  onChange,
  onClose,
}: {
  src: string;
  value?: ImageCrop;
  onChange: (crop: ImageCrop | null) => void;
  onClose: () => void;
}) {
  /* Crop state in % of source image */
  const [crop, setCrop] = useState(() =>
    value ?? { x: 10, y: 10, w: 80, h: 80, aspectRatio: 1 }
  );
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);

  /* Refs for drag tracking */
  const wrapRef   = useRef<HTMLDivElement>(null);
  const dragRef   = useRef<{
    type: "move" | Handle;
    startMouseX: number; startMouseY: number;
    startCrop:  ImageCrop;
  } | null>(null);

  function handleImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
  }

  /* Returns the wrapper's pixel size for converting deltas to % */
  function wrapSize() {
    const r = wrapRef.current?.getBoundingClientRect();
    return r ? { w: r.width, h: r.height } : { w: 1, h: 1 };
  }

  const onPointerMove = useCallback((e: PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const { w: ww, h: wh } = wrapSize();
    const dxPct = ((e.clientX - d.startMouseX) / ww) * 100;
    const dyPct = ((e.clientY - d.startMouseY) / wh) * 100;
    const c     = d.startCrop;
    let next: ImageCrop = { ...c };

    if (d.type === "move") {
      next.x = clamp(c.x + dxPct, 0, 100 - c.w);
      next.y = clamp(c.y + dyPct, 0, 100 - c.h);
    } else if (d.type === "nw") {
      const newX = clamp(c.x + dxPct, 0, c.x + c.w - MIN_PCT);
      const newY = clamp(c.y + dyPct, 0, c.y + c.h - MIN_PCT);
      next.x = newX;     next.y = newY;
      next.w = c.w + (c.x - newX);
      next.h = c.h + (c.y - newY);
    } else if (d.type === "ne") {
      const newY = clamp(c.y + dyPct, 0, c.y + c.h - MIN_PCT);
      next.y = newY;
      next.w = clamp(c.w + dxPct, MIN_PCT, 100 - c.x);
      next.h = c.h + (c.y - newY);
    } else if (d.type === "sw") {
      const newX = clamp(c.x + dxPct, 0, c.x + c.w - MIN_PCT);
      next.x = newX;
      next.w = c.w + (c.x - newX);
      next.h = clamp(c.h + dyPct, MIN_PCT, 100 - c.y);
    } else if (d.type === "se") {
      next.w = clamp(c.w + dxPct, MIN_PCT, 100 - c.x);
      next.h = clamp(c.h + dyPct, MIN_PCT, 100 - c.y);
    }
    setCrop(next);
  }, []);

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup",   onPointerUp);
  }, [onPointerMove]);

  function startDrag(type: "move" | Handle) {
    return (e: React.PointerEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current = {
        type, startMouseX: e.clientX, startMouseY: e.clientY,
        startCrop: crop,
      };
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup",   onPointerUp);
    };
  }

  /* ESC to close */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  function apply() {
    if (!imgSize) return;
    /* Capture the cropped region's pixel aspect ratio so renderers can size
       the wrapper without re-loading the image. */
    const aspectRatio = (crop.w * imgSize.w) / (crop.h * imgSize.h);
    onChange({ ...crop, aspectRatio });
    onClose();
  }

  function reset() {
    onChange(null);
    onClose();
  }

  /* CSS for the cropped preview thumbnail */
  const previewStyle: React.CSSProperties = {
    width: 96,
    aspectRatio: imgSize ? (crop.w * imgSize.w) / (crop.h * imgSize.h) : 1,
    overflow: "hidden",
    position: "relative",
    background: "#000",
    borderRadius: 4,
  };

  return createPortal(
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        style={{ width: 640, maxWidth: "95vw", background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: 8, display: "flex", flexDirection: "column", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #1a1a1a", flexShrink: 0 }}>
          <span style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>Crop logo</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", padding: 2, display: "flex" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

          {/* Image with crop rectangle overlay */}
          <div
            ref={wrapRef}
            style={{
              position: "relative",
              maxWidth: "100%",
              maxHeight: 360,
              background: "#000",
              userSelect: "none",
              touchAction: "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt=""
              draggable={false}
              onLoad={handleImgLoad}
              style={{ display: "block", maxWidth: "100%", maxHeight: 360, width: "auto", height: "auto", opacity: 0.55 }}
            />

            {/* Crop window — bright cutout on top of the dimmed image */}
            <div
              onPointerDown={startDrag("move")}
              style={{
                position: "absolute",
                left:   `${crop.x}%`,
                top:    `${crop.y}%`,
                width:  `${crop.w}%`,
                height: `${crop.h}%`,
                cursor: "move",
                border: "1px solid rgba(255,255,255,0.95)",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.6)",
                overflow: "visible",
              }}
            >
              {/* Crisp cutout — re-show the full image at its native position
                  so the cropped area appears at full opacity */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                draggable={false}
                style={{
                  position: "absolute",
                  left:  `${(-crop.x / crop.w) * 100}%`,
                  top:   `${(-crop.y / crop.h) * 100}%`,
                  width:  `${(100 / crop.w) * 100}%`,
                  height: `${(100 / crop.h) * 100}%`,
                  pointerEvents: "none",
                }}
              />

              {/* Rule-of-thirds grid */}
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                <div style={{ position: "absolute", top: 0, bottom: 0, left: "33.33%",  width: 1, background: "rgba(255,255,255,0.35)" }} />
                <div style={{ position: "absolute", top: 0, bottom: 0, left: "66.66%", width: 1, background: "rgba(255,255,255,0.35)" }} />
                <div style={{ position: "absolute", left: 0, right: 0, top: "33.33%",  height: 1, background: "rgba(255,255,255,0.35)" }} />
                <div style={{ position: "absolute", left: 0, right: 0, top: "66.66%", height: 1, background: "rgba(255,255,255,0.35)" }} />
              </div>

              {/* Corner handles */}
              {(["nw","ne","sw","se"] as const).map((corner) => (
                <div
                  key={corner}
                  onPointerDown={startDrag(corner)}
                  style={{
                    position: "absolute",
                    width: 12, height: 12, background: "#fff", borderRadius: 2,
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.5)",
                    cursor: corner === "nw" || corner === "se" ? "nwse-resize" : "nesw-resize",
                    ...(corner.startsWith("n") ? { top: -6 }    : { bottom: -6 }),
                    ...(corner.endsWith("w")   ? { left: -6 }   : { right: -6 }),
                  }}
                />
              ))}
            </div>
          </div>

          {/* Footer row: preview + numeric readout */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
            {imgSize && (
              <>
                <div style={previewStyle}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    style={{
                      position: "absolute",
                      left:  `${(-crop.x / crop.w) * 100}%`,
                      top:   `${(-crop.y / crop.h) * 100}%`,
                      width:  `${(100 / crop.w) * 100}%`,
                      height: `${(100 / crop.h) * 100}%`,
                    }}
                  />
                </div>
                <div style={{ flex: 1, fontFamily: "monospace", fontSize: 11, color: "#666", lineHeight: 1.6 }}>
                  <div>x {Math.round(crop.x)}% · y {Math.round(crop.y)}%</div>
                  <div>w {Math.round(crop.w)}% · h {Math.round(crop.h)}%</div>
                  <div style={{ color: "#444" }}>
                    {Math.round(crop.w / 100 * imgSize.w)} × {Math.round(crop.h / 100 * imgSize.h)} px
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer buttons */}
        <div style={{ display: "flex", gap: 8, padding: "12px 16px", borderTop: "1px solid #1a1a1a", flexShrink: 0 }}>
          <button
            onClick={reset}
            style={{
              background: "none", border: "1px solid #2a2a2a",
              color: "#666", fontSize: 11, padding: "7px 12px", borderRadius: 4,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Reset crop
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={onClose}
            style={{
              background: "#1a1a1a", border: "1px solid #2a2a2a",
              color: "#888", fontSize: 11, padding: "7px 14px", borderRadius: 4,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
          <button
            onClick={apply}
            disabled={!imgSize}
            style={{
              background: "#1a2a3a", border: "1px solid #2563eb",
              color: "#93c5fd", fontSize: 11, padding: "7px 16px", borderRadius: 4,
              cursor: imgSize ? "pointer" : "default", fontFamily: "inherit", fontWeight: 600,
            }}
          >
            Apply crop
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
