"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";

const GALLERY_SEEDS = [
  20, 37, 48, 63, 71, 82, 95, 108, 133, 145, 156, 167,
  201, 202, 210, 220, 230, 240, 250, 300,
];

export function ImageGalleryModal({
  value,
  title = "Select image",
  onChange,
  onClose,
}: {
  value: string;
  title?: string;
  onChange: (url: string) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(value);
  const [tab, setTab] = useState<"gallery" | "url">("gallery");
  const [urlDraft, setUrlDraft] = useState(value);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploaded((prev) => [url, ...prev]);
    setSelected(url);
    e.target.value = "";
  }

  const allSeeds = [...uploaded, ...GALLERY_SEEDS.map((s) => `https://picsum.photos/seed/${s}/800/800?grayscale`)];

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1, background: "none", border: "none",
    borderBottom: `2px solid ${active ? "#2563eb" : "transparent"}`,
    color: active ? "#93c5fd" : "#444",
    fontSize: 11, padding: "7px 0", cursor: "pointer",
    fontFamily: "inherit",
  });

  return createPortal(
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        style={{ width: 700, height: 460, background: "#0d0d0d", border: "1px solid #2a2a2a", borderRadius: 8, display: "flex", flexDirection: "column", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #1a1a1a", flexShrink: 0 }}>
          <span style={{ color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", padding: 2, display: "flex" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Left: gallery */}
          <div style={{ width: 360, borderRight: "1px solid #1a1a1a", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", borderBottom: "1px solid #1a1a1a", flexShrink: 0 }}>
              <button style={tabStyle(tab === "gallery")} onClick={() => setTab("gallery")}>Gallery</button>
              <button style={tabStyle(tab === "url")}     onClick={() => setTab("url")}>URL</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
              {tab === "gallery" ? (
                <>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                  <button
                    onClick={() => fileRef.current?.click()}
                    style={{
                      width: "100%", marginBottom: 8, background: "none",
                      border: "1px dashed #2a2a2a", color: "#555", fontSize: 11,
                      padding: "7px", borderRadius: 4, cursor: "pointer",
                      fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#facc15"; e.currentTarget.style.color = "#facc15"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#555"; }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                    Upload photo
                  </button>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
                    {allSeeds.map((url, i) => {
                      const isActive = selected === url;
                      const thumb = url.startsWith("blob:") ? url : url.replace("800/800", "200/200");
                      return (
                        <div
                          key={i}
                          onClick={() => setSelected(url)}
                          style={{
                            aspectRatio: "1/1", overflow: "hidden", cursor: "pointer", borderRadius: 3,
                            border: isActive ? "2px solid #2563eb" : "2px solid transparent",
                            position: "relative",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          {isActive && (
                            <div style={{ position: "absolute", top: 3, right: 3, width: 14, height: 14, background: "#2563eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div>
                  <input
                    value={urlDraft}
                    onChange={(e) => setUrlDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && urlDraft.trim()) setSelected(urlDraft.trim()); }}
                    placeholder="https://..."
                    style={{
                      width: "100%", background: "#111", border: "1px solid #2a2a2a",
                      color: "#eee", fontSize: 12, padding: "7px 8px", borderRadius: 4,
                      outline: "none", boxSizing: "border-box", fontFamily: "monospace",
                    }}
                  />
                  <button
                    onClick={() => { if (urlDraft.trim()) setSelected(urlDraft.trim()); }}
                    style={{ marginTop: 8, width: "100%", background: "#1a2a3a", border: "1px solid #2563eb", color: "#93c5fd", fontSize: 11, padding: "7px", borderRadius: 4, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Use URL
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: preview */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 14, gap: 10 }}>
            <div style={{ flex: 1, background: "#111", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {selected ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
              ) : (
                <span style={{ color: "#2a2a2a", fontSize: 11 }}>No image selected</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => { if (selected) { onChange(selected); onClose(); } }}
                disabled={!selected}
                style={{
                  flex: 1, background: selected ? "#1a2a3a" : "#111",
                  border: `1px solid ${selected ? "#2563eb" : "#1f1f1f"}`,
                  color: selected ? "#93c5fd" : "#333",
                  fontSize: 11, padding: "8px", borderRadius: 4,
                  cursor: selected ? "pointer" : "default", fontFamily: "inherit", fontWeight: 600,
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function ImagePickerButton({
  value,
  title,
  onChange,
}: {
  value: string;
  title?: string;
  onChange: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {value && (
          <div style={{ width: 32, height: 32, borderRadius: 3, overflow: "hidden", flexShrink: 0, background: "#111" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        )}
        <button
          onClick={() => setOpen(true)}
          style={{
            flex: 1, background: "#1a1a1a", border: "1px solid #2a2a2a",
            color: "#666", fontSize: 11, padding: "6px 10px", borderRadius: 4,
            cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          {value ? "Change image" : "Select from gallery"}
        </button>
      </div>
      {open && <ImageGalleryModal value={value} title={title} onChange={onChange} onClose={() => setOpen(false)} />}
    </>
  );
}
