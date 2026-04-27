"use client";

import { useState } from "react";
import { ALL_GALLERY_SEEDS, effectiveStyle, type DeliveryPage } from "~/lib/delivery/data";

const heights = [110, 80, 140, 100, 120, 90, 130, 85, 115, 95, 125, 100];

export function GalleryView({ page, viewport = "desktop" }: { page: DeliveryPage; viewport?: "mobile" | "desktop" }) {
  const ts = effectiveStyle(page);
  const allSeeds = page.photoSeeds.length > 0 ? page.photoSeeds : ALL_GALLERY_SEEDS.slice(0, 12);
  const photos = allSeeds.slice(0, 12);
  const isMobile = viewport === "mobile";
  const coverSrc = page.coverUrl || `https://picsum.photos/seed/${page.coverSeed}/1600/800?grayscale`;

  return (
    <div
      className="w-full h-full overflow-y-auto flex flex-col"
      style={{ background: ts.bg, fontFamily: page.fontFamily || "Inter, sans-serif", fontSize: isMobile ? 12 : 13 }}
    >
      {/* Upsell banner */}
      {page.mode === "direct" && page.showUpsellBanner && page.priceFullGallery > 0 && (
        <div style={{ background: ts.btnBg, color: ts.btnFg, padding: isMobile ? "8px 12px" : "10px 20px", textAlign: "center", fontSize: isMobile ? 10 : 11, fontWeight: 600 }}>
          Get all {page.photoCount || 12} photos for ${page.priceFullGallery} — save {Math.max(0, Math.round((1 - page.priceFullGallery / ((page.pricePerPhoto || 15) * (page.photoCount || 12))) * 100))}%
          <button style={{ marginLeft: 12, background: ts.bg, color: ts.bg === "#ffffff" ? "#111" : ts.fg, border: "none", borderRadius: 4, padding: "2px 10px", fontWeight: 700, fontSize: 10, cursor: "pointer" }}>Buy now</button>
        </div>
      )}

      {/* Cover */}
      <div className="relative shrink-0 overflow-hidden" style={{ height: isMobile ? 220 : 380 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={coverSrc} alt="" className="w-full h-full object-cover" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.6))" }}/>
        {/* Logo */}
        {page.logoMode !== "none" && (
          <div style={{ position: "absolute", top: isMobile ? 14 : 22, left: isMobile ? 14 : 28, display: "flex", alignItems: "center", gap: 8 }}>
            {(page.logoMode === "image" || page.logoMode === "image+text") && page.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={page.logoUrl} alt="" style={{ height: isMobile ? 26 : 34, width: "auto", objectFit: "contain", borderRadius: 4 }} />
            )}
            {(page.logoMode === "text" || page.logoMode === "image+text") && page.logoText && (
              <span style={{ color: "#fff", fontWeight: 900, fontSize: isMobile ? 14 : 18, letterSpacing: "0.06em", fontFamily: page.fontFamily }}>{page.logoText}</span>
            )}
          </div>
        )}
        {/* Title block */}
        <div style={{ position: "absolute", bottom: isMobile ? 16 : 28, left: isMobile ? 14 : 28, right: isMobile ? 14 : 28, color: "#fff" }}>
          <p style={{ fontFamily: "monospace", fontSize: isMobile ? 9 : 11, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.7, marginBottom: 4 }}>
            {page.client} · {page.photoCount || photos.length} photos
          </p>
          <h1 style={{ fontFamily: page.fontFamily, fontWeight: 900, fontSize: isMobile ? 26 : 44, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 6 }}>
            {page.title}
          </h1>
          {page.welcomeMessage && (
            <p style={{ fontSize: isMobile ? 11 : 14, lineHeight: 1.5, maxWidth: 540, opacity: 0.9, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
              {page.welcomeMessage}
            </p>
          )}
        </div>
      </div>

      {/* Selection progress */}
      {page.mode === "selection" && (
        <div style={{ background: ts.accent, padding: isMobile ? "10px 14px" : "14px 28px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: ts.muted, fontSize: isMobile ? 9 : 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
              Your selection — 3 of {page.selectionLimit} photos chosen
            </div>
            <div style={{ height: 4, background: ts.bg, borderRadius: 9999 }}>
              <div style={{ height: "100%", width: `${(3 / page.selectionLimit) * 100}%`, background: "#fad502", borderRadius: 9999 }} />
            </div>
          </div>
          <button style={{ background: ts.btnBg, color: ts.btnFg, border: "none", borderRadius: 6, padding: isMobile ? "6px 14px" : "8px 18px", fontSize: isMobile ? 11 : 12, fontWeight: 700, cursor: "pointer" }}>
            Submit
          </button>
        </div>
      )}

      {/* Photo grid */}
      <div style={{ padding: isMobile ? "12px 12px" : "24px 28px", flex: 1 }}>
        {page.layout === "masonry" ? (
          <div style={{ columns: isMobile ? 2 : 3, gap: 8 }}>
            {photos.map((seed: number, i: number) => (
              <div key={seed} style={{ breakInside: "avoid", marginBottom: 8, position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://picsum.photos/seed/${seed}/600/${(heights[i] ?? 100) * 4}?grayscale`}
                  alt=""
                  style={{ width: "100%", display: "block", borderRadius: 4 }}
                />
                {page.watermark && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: isMobile ? 11 : 16, fontWeight: 900, letterSpacing: "0.25em", transform: "rotate(-20deg)", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>{page.logoText || "STUDIO"}</span>
                  </div>
                )}
                {page.mode === "selection" && (
                  <button style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                  </button>
                )}
                {page.mode === "direct" && page.pricePerPhoto > 0 && (
                  <div style={{ position: "absolute", bottom: 6, left: 6, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", borderRadius: 4, padding: "3px 8px", color: "#fff", fontSize: 10, fontWeight: 700 }}>
                    ${page.pricePerPhoto}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 3}, 1fr)`, gap: 8 }}>
            {photos.map((seed: number) => (
              <div key={seed} style={{ position: "relative", aspectRatio: "1", overflow: "hidden", borderRadius: 4 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://picsum.photos/seed/${seed}/600/600?grayscale`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                {page.watermark && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: isMobile ? 10 : 14, fontWeight: 900, letterSpacing: "0.25em", transform: "rotate(-20deg)" }}>{page.logoText || "STUDIO"}</span>
                  </div>
                )}
                {page.mode === "selection" && (
                  <button style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                  </button>
                )}
                {page.mode === "direct" && page.pricePerPhoto > 0 && (
                  <div style={{ position: "absolute", bottom: 6, left: 6, background: "rgba(0,0,0,0.55)", borderRadius: 4, padding: "3px 8px", color: "#fff", fontSize: 10, fontWeight: 700 }}>
                    ${page.pricePerPhoto}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: isMobile ? "16px 14px" : "24px 28px", borderTop: `1px solid ${ts.muted}25`, background: ts.accent }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ color: ts.muted, fontSize: isMobile ? 10 : 11 }}>
            © {new Date().getFullYear()} {page.logoText || "Studio"} — Delivered with FRAME
          </div>
          {page.proofingEnabled && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: ts.muted, fontSize: isMobile ? 10 : 11 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={ts.muted} strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              Click any photo to leave a comment
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Preview frame for builder canvas — desktop browser mockup or mobile phone */
export function PreviewFrame({ page }: { page: DeliveryPage }) {
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="flex flex-col h-full">
      {/* Viewport toggle */}
      <div className="flex items-center justify-center gap-1 py-3 border-b border-[var(--border)] shrink-0">
        {(["desktop", "mobile"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setViewport(v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-medium transition-colors ${
              viewport === v ? "bg-[var(--bg-card)] text-[var(--fg)] border border-[var(--border)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
            }`}
          >
            {v === "desktop" ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            ) : (
              <svg width="11" height="13" viewBox="0 0 18 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="1" width="16" height="22" rx="3"/><line x1="7" y1="20" x2="11" y2="20"/></svg>
            )}
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center overflow-auto bg-[var(--bg)] relative p-6">
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{ backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="relative z-10">
          {viewport === "desktop" ? (
            <div className="rounded-xl overflow-hidden border border-[var(--border)] shadow-2xl bg-[var(--bg-card)]" style={{ width: 760 }}>
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/70" />
                  <div className="w-3 h-3 rounded-full bg-yellow/70" />
                  <div className="w-3 h-3 rounded-full bg-green-400/70" />
                </div>
                <div className="flex-1 mx-3 bg-[var(--bg)] border border-[var(--border)] rounded-md px-3 py-1 flex items-center gap-2">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span className="font-mono text-[10px] text-[var(--fg-muted)] truncate">altafoto.com.ar/d/{page.id}</span>
                </div>
              </div>
              <div style={{ height: 560 }}>
                <GalleryView page={page} viewport="desktop" />
              </div>
            </div>
          ) : (
            <div className="relative" style={{ width: 280, height: 580 }}>
              <div className="absolute inset-0 rounded-[40px] shadow-2xl" style={{ background: "linear-gradient(145deg,#2a2a2a,#1a1a1a)" }} />
              <div className="absolute inset-[5px] rounded-[36px] overflow-hidden bg-black">
                <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pt-3 pb-1 pointer-events-none">
                  <span style={{ fontFamily: "monospace", fontSize: 9, fontWeight: "bold", color: "rgba(255,255,255,0.85)" }}>9:41</span>
                  <div style={{ width: 70, height: 18, background: "#000", borderRadius: 9999 }} />
                  <div className="flex items-center gap-0.5">
                    <svg width="11" height="8" viewBox="0 0 24 18" fill="none"><path d="M1 1c6.1-1.3 15.9-1.3 22 0M5 7c3.9-.9 10.1-.9 14 0M9 13c2-.5 6-.5 8 0" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity={0.85}/></svg>
                    <svg width="16" height="8" viewBox="0 0 26 12" fill="none"><rect x="1" y="1" width="20" height="10" rx="2.5" stroke="white" strokeWidth="1.5" opacity={0.85}/><rect x="3" y="3" width="14" height="6" rx="1.5" fill="white" opacity={0.85}/></svg>
                  </div>
                </div>
                <div className="absolute inset-0 pt-9">
                  <GalleryView page={page} viewport="mobile" />
                </div>
              </div>
              <div className="absolute rounded-l-sm" style={{ left: -3, top: 100, width: 3, height: 30, background: "#333" }} />
              <div className="absolute rounded-l-sm" style={{ left: -3, top: 138, width: 3, height: 38, background: "#333" }} />
              <div className="absolute rounded-r-sm" style={{ right: -3, top: 138, width: 3, height: 56, background: "#333" }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
