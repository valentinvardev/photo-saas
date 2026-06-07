"use client";

import { useState } from "react";
import { useEditorStore } from "~/lib/editor/store";

/* Picsum seeds used in the template + extras for a browsable gallery */
const GALLERY_SEEDS = [
  20, 37, 48, 63, 71, 82, 95, 108, 133, 145, 156, 167,
  201, 202, 210, 220, 230, 240, 250, 300, 310, 320, 330, 400,
];

interface Props { nodeId: string }

export function ImagePanel({ nodeId }: Props) {
  const { nodes, updateNode } = useEditorStore();
  const node = nodes[nodeId];

  const [tab, setTab]   = useState<"gallery" | "url">("gallery");
  const [draft, setDraft] = useState(node?.src ?? "");

  function applyUrl() {
    const v = draft.trim();
    if (v) updateNode(nodeId, { src: v });
  }

  function applyFromGallery(seed: number) {
    updateNode(nodeId, { src: `https://picsum.photos/seed/${seed}/800/1000?grayscale` });
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, background: "none", border: "none",
    borderBottom: `2px solid ${active ? "#facc15" : "transparent"}`,
    color: active ? "#facc15" : "#444",
    fontSize: 11, padding: "7px 0", cursor: "pointer",
    fontFamily: "inherit", transition: "color 0.15s",
  });

  return (
    <div style={{ padding: "0 0 12px" }}>
      {/* Current preview */}
      {node?.src && (
        <div style={{ margin: "0 12px 12px", borderRadius: 6, overflow: "hidden", aspectRatio: "4/3", position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={node.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)" }} />
          <span style={{ position: "absolute", bottom: 6, left: 8, fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.6)" }}>current</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #1a1a1a", margin: "0 0 12px" }}>
        <button style={tabStyle(tab === "gallery")} onClick={() => setTab("gallery")}>Gallery</button>
        <button style={tabStyle(tab === "url")}     onClick={() => setTab("url")}>URL</button>
      </div>

      {tab === "gallery" && (
        <div style={{ padding: "0 12px" }}>
          <p style={{ color: "#444", fontSize: 10, margin: "0 0 10px", lineHeight: 1.5 }}>
            Click any photo to apply. More images coming from your media library.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3 }}>
            {GALLERY_SEEDS.map((seed) => {
              const url = `https://picsum.photos/seed/${seed}/400/500?grayscale`;
              const isActive = node?.src?.includes(`seed/${seed}/`);
              return (
                <div
                  key={seed}
                  onClick={() => applyFromGallery(seed)}
                  style={{
                    aspectRatio: "4/5", overflow: "hidden", cursor: "pointer", borderRadius: 3,
                    border: isActive ? "2px solid #facc15" : "2px solid transparent",
                    position: "relative", transition: "border-color 0.15s",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  {isActive && (
                    <div style={{ position: "absolute", top: 3, right: 3, width: 14, height: 14, background: "#facc15", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "url" && (
        <div style={{ padding: "0 12px" }}>
          <label style={{ color: "#555", fontSize: 10, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Image URL
          </label>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") applyUrl(); }}
            placeholder="https://..."
            style={{
              width: "100%", background: "#0d0d0d", border: "1px solid #2a2a2a",
              color: "#eee", fontSize: 12, padding: "7px 8px", borderRadius: 4,
              outline: "none", boxSizing: "border-box", marginBottom: 8,
              fontFamily: "monospace",
            }}
          />
          <button
            onClick={applyUrl}
            style={{
              width: "100%", background: "rgba(250,204,21,0.12)", border: "1px solid #facc15",
              color: "#facc15", fontSize: 12, padding: "7px", borderRadius: 4,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Apply URL
          </button>
          <p style={{ color: "#333", fontSize: 10, marginTop: 8, lineHeight: 1.5 }}>
            Paste any direct image URL. Supports JPG, PNG, WebP, GIF, SVG.
          </p>
        </div>
      )}
    </div>
  );
}
