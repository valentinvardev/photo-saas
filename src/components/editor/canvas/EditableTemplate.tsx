"use client";

/**
 * EditableTemplate — Minimal BW
 *
 * This is a faithful fork of src/app/templates/minimal-bw/page.tsx adapted
 * for the FRAME website builder.  See docs/template-adapter-guide.md for the
 * full adaptation rules.
 *
 * Key differences from the source template:
 *  1. Nav is `position: relative` (was `position: fixed`). Fixed elements
 *     escape the scaled canvas container and overlap the editor chrome.
 *  2. `useBreakpoint()` is replaced by the `viewport` prop coming from the
 *     editor store, so the responsive layout is driven by the viewport toggle
 *     in the TopBar rather than the actual window size.
 *  3. Key content nodes are wrapped with <EditableNode> so they can be
 *     selected, highlighted, and edited via the sidebar.
 *  4. Gallery and Lightbox are kept fully functional — they use
 *     `position: fixed` which overlays the editor chrome; that is acceptable
 *     because it lets the designer preview the interaction.
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useEditorStore } from "~/lib/editor/store";
import { TiptapEditor } from "~/components/editor/toolbars/TiptapEditor";
import type { Viewport } from "~/lib/editor/types";

/* ═══════════════════════════════════════════
   EDITABLE NODE PRIMITIVE
═══════════════════════════════════════════ */
function EditableNode({
  id,
  children,
  style,
  tag: Tag = "div",
}: {
  id: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  tag?: "div" | "h1" | "h2" | "h3" | "p" | "span" | "blockquote";
}) {
  const { selectedId, editingId, selectNode, setEditing, nodes } = useEditorStore();
  const node     = nodes[id];
  const selected = selectedId === id;
  const editing  = editingId  === id;

  // Node is hidden (deleted by user)
  if (node?.hidden) return null;

  // Style overrides stored per-node (from InspectorPanel)
  const overrides: React.CSSProperties = {};
  if (node?.fontSize)      overrides.fontSize      = node.fontSize;
  if (node?.fontWeight)    overrides.fontWeight    = node.fontWeight;
  if (node?.fontStyle)     overrides.fontStyle     = node.fontStyle;
  if (node?.textAlign)     overrides.textAlign     = node.textAlign;

  const El = Tag as "div";
  return (
    <El
      data-editor-node=""
      data-node-id={id}
      data-selected={selected ? "true" : undefined}
      data-editing={editing ? "true" : undefined}
      onClick={(e) => { e.stopPropagation(); selectNode(id); }}
      onDoubleClick={(e) => { e.stopPropagation(); selectNode(id); setEditing(id); }}
      style={{ position: "relative", ...style, ...overrides }}
    >
      {children}
    </El>
  );
}

/* ═══════════════════════════════════════════
   EDITABLE TEXT — shows Tiptap on dbl-click
═══════════════════════════════════════════ */
function EditableText({ id, style }: { id: string; style?: React.CSSProperties }) {
  const { nodes, editingId, updateNode } = useEditorStore();
  const content = nodes[id]?.content ?? "";
  const editing = editingId === id;

  if (editing) {
    return (
      <TiptapEditor
        id={id}
        content={content}
        onUpdate={(html) => updateNode(id, { content: html })}
        style={style}
      />
    );
  }
  return (
    <span style={{ display: "block", ...style }} dangerouslySetInnerHTML={{ __html: content }} />
  );
}

/* ═══════════════════════════════════════════
   EDITABLE IMAGE
═══════════════════════════════════════════ */
function EditableImage({ id, imgStyle }: { id: string; imgStyle?: React.CSSProperties }) {
  const node = useEditorStore((s) => s.nodes[id]);
  const style: React.CSSProperties = { ...imgStyle };
  if (node?.objectFit)     style.objectFit     = node.objectFit;
  if (node?.objectPosition) style.objectPosition = node.objectPosition;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={node?.src ?? ""} alt={node?.alt ?? ""} style={style} />;
}

/* ═══════════════════════════════════════════
   DATA  (identical to source template)
═══════════════════════════════════════════ */
const WORKS = [
  { id: 1,  seed: 20,  title: "Wanderers",        year: "2024", cat: "Documentary", w: 5472, h: 3648 },
  { id: 2,  seed: 37,  title: "The Quiet City",    year: "2023", cat: "Urban",       w: 4000, h: 5000 },
  { id: 3,  seed: 48,  title: "Peripheral",        year: "2023", cat: "Street",      w: 6000, h: 4000 },
  { id: 4,  seed: 63,  title: "Aftermath",         year: "2022", cat: "Documentary", w: 5472, h: 3648 },
  { id: 5,  seed: 71,  title: "Still Life No. 4",  year: "2022", cat: "Studio",      w: 4000, h: 4000 },
  { id: 6,  seed: 82,  title: "Northern Light",    year: "2024", cat: "Landscape",   w: 7000, h: 4667 },
  { id: 7,  seed: 95,  title: "Between Sessions",  year: "2021", cat: "Portrait",    w: 3840, h: 5760 },
  { id: 8,  seed: 108, title: "Threshold",         year: "2021", cat: "Documentary", w: 5472, h: 3648 },
  { id: 9,  seed: 133, title: "Margins",           year: "2020", cat: "Urban",       w: 4500, h: 3000 },
  { id: 10, seed: 145, title: "Salt Flat Study",   year: "2023", cat: "Landscape",   w: 6000, h: 4000 },
  { id: 11, seed: 156, title: "Interior IV",       year: "2022", cat: "Studio",      w: 3500, h: 4375 },
  { id: 12, seed: 167, title: "Anonymous",         year: "2024", cat: "Portrait",    w: 4000, h: 5000 },
];


type Work = typeof WORKS[0];

/* ═══════════════════════════════════════════
   PHOTO CELL
═══════════════════════════════════════════ */
function Cell({ w, onClick }: { w: Work; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ position: "relative", overflow: "hidden", cursor: "pointer", width: "100%", height: "100%", background: "#111" }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={onClick}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://picsum.photos/seed/${w.seed}/800/1000?grayscale`} alt={w.title}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block",
          filter: hov ? "brightness(0.5)" : "brightness(0.88)",
          transform: hov ? "scale(1.05)" : "scale(1)",
          transition: "filter 0.5s ease, transform 0.65s ease" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "1rem", opacity: hov ? 1 : 0, transition: "opacity 0.3s ease", pointerEvents: "none" }}>
        <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: "0.25rem" }}>
          {w.cat} · {w.year}
        </span>
        <span style={{ fontFamily: "var(--tpl-serif,serif)", fontStyle: "italic", fontSize: "18px", color: "var(--ed-bg, #fafafa)", lineHeight: 1.2 }}>
          {w.title}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LIGHTBOX
═══════════════════════════════════════════ */
function Lightbox({ works, startIndex, onClose }: { works: Work[]; startIndex: number; onClose: () => void }) {
  const [index, setIndex]   = useState(startIndex);
  const [zoom, setZoom]     = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDrag] = useState(false);
  const dragRef             = useRef({ sx: 0, sy: 0, ox: 0, oy: 0 });
  const containerRef        = useRef<HTMLDivElement>(null);
  const w                   = works[index]!;
  const resetView = useCallback(() => { setZoom(1); setOffset({ x: 0, y: 0 }); }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") { setIndex((i) => Math.min(i + 1, works.length - 1)); resetView(); }
      if (e.key === "ArrowLeft")  { setIndex((i) => Math.max(i - 1, 0)); resetView(); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, works.length, resetView]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const fn = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((prev) => {
        const next = Math.min(Math.max(prev * (e.deltaY < 0 ? 1.12 : 0.9), 1), 8);
        if (next === 1) setOffset({ x: 0, y: 0 });
        return next;
      });
    };
    el.addEventListener("wheel", fn, { passive: false });
    return () => el.removeEventListener("wheel", fn);
  }, []);

  const onMD = (e: React.MouseEvent) => { if (zoom <= 1) return; e.preventDefault(); setDrag(true); dragRef.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y }; };
  const onMM = (e: React.MouseEvent) => { if (!dragging) return; setOffset({ x: dragRef.current.ox + e.clientX - dragRef.current.sx, y: dragRef.current.oy + e.clientY - dragRef.current.sy }); };
  const onMU = () => setDrag(false);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "#000", display: "flex", flexDirection: "column", userSelect: "none" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)", pointerEvents: "none" }}>
        <button style={{ pointerEvents: "auto", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", padding: "4px 8px", fontFamily: "var(--tpl-mono,monospace)", fontSize: "11px", display: "flex", alignItems: "center", gap: "6px" }} onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Back
        </button>
        <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{w.title} · {index + 1} / {works.length}</span>
        <div style={{ pointerEvents: "auto" }}>
          {zoom > 1 && <button onClick={resetView} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: "4px 10px", fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", borderRadius: "4px" }}>{Math.round(zoom * 100)}% · Reset</button>}
        </div>
      </div>
      <div ref={containerRef} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "64px 48px", cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "default", overflow: "hidden" }}
        onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://picsum.photos/seed/${w.seed}/1400/900?grayscale`} alt={w.title} draggable={false}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", pointerEvents: "none", display: "block",
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, transformOrigin: "center",
            transition: dragging ? "none" : "transform 0.15s ease" }} />
      </div>
      {index > 0 && <button onClick={() => { setIndex((i) => Math.max(i - 1, 0)); resetView(); }} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", cursor: "pointer", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg></button>}
      {index < works.length - 1 && <button onClick={() => { setIndex((i) => Math.min(i + 1, works.length - 1)); resetView(); }} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", cursor: "pointer", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 20px", background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", pointerEvents: "none" }}>
        <div>
          <div style={{ fontFamily: "var(--tpl-serif,serif)", fontStyle: "italic", fontSize: "18px", color: "#fff", marginBottom: "2px" }}>{w.title}</div>
          <div style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" }}>{w.cat} · {w.year}</div>
        </div>
        <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>{w.w} × {w.h}px</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   GALLERY MODAL
═══════════════════════════════════════════ */
function GalleryModal({ onClose }: { onClose: () => void }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [filter, setFilter]               = useState("All");

  const cats    = ["All", ...Array.from(new Set(WORKS.map((w) => w.cat)))];
  const visible = filter === "All" ? WORKS : WORKS.filter((w) => w.cat === filter);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape" && lightboxIndex === null) onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, lightboxIndex]);

  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "var(--ed-fg, #0a0a0a)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2.5rem", height: "60px", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0, gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", padding: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
            <span style={{ fontFamily: "var(--tpl-serif,serif)", fontStyle: "italic", fontSize: "18px", color: "#fff" }}>All Work</span>
            <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em" }}>{visible.length}</span>
          </div>
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "2px" }}>
            {cats.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)}
                style={{ background: filter === cat ? "#fff" : "rgba(255,255,255,0.06)", border: "1px solid", borderColor: filter === cat ? "#fff" : "rgba(255,255,255,0.1)", color: filter === cat ? "var(--ed-fg, #0a0a0a)" : "rgba(255,255,255,0.5)", fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 12px", cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap", flexShrink: 0 }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "2rem 2.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "3px" }}>
            {visible.map((w, i) => (
              <div key={w.id} style={{ aspectRatio: "4/5", cursor: "pointer" }} onClick={() => setLightboxIndex(i)}>
                <Cell w={w} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {lightboxIndex !== null && <Lightbox works={visible} startIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />}
    </>
  );
}

/* ═══════════════════════════════════════════
   NAV  (adapted: position relative, no scroll effect)
═══════════════════════════════════════════ */
function Nav({ onOpenGallery, isMobile }: { onOpenGallery: () => void; isMobile: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logo } = useEditorStore();
  const mono = { fontFamily: "var(--tpl-mono,monospace)" } as const;
  const sans = { fontFamily: "var(--tpl-sans,sans-serif)" } as const;

  // Renders the logo based on Settings mode
  function LogoMark({ dark = false }: { dark?: boolean }) {
    const imgSrc = dark && logo.altImageUrl ? logo.altImageUrl : logo.imageUrl;
    const textEl = (
      <EditableNode id="nav-logo" tag="span" style={{ ...mono, fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", color: dark ? "var(--ed-bg, #fafafa)" : "var(--ed-fg, #0a0a0a)", textTransform: "uppercase" }}>
        <EditableText id="nav-logo" />
      </EditableNode>
    );
    if (logo.mode === "image" && imgSrc) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={imgSrc} alt={logo.text} style={{ height: 28, objectFit: "contain" }} />;
    }
    if (logo.mode === "image+text" && imgSrc) {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgSrc} alt="" style={{ height: 24, objectFit: "contain" }} />
          {textEl}
        </div>
      );
    }
    return textEl;
  }

  const navBase: React.CSSProperties = {
    /* ADAPTER NOTE: was `position: fixed`. Changed to `position: relative` so
       the nav stays inside the canvas scroll container and doesn't overlay
       the editor chrome. The hero section's paddingTop is set to 0 here too. */
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    height: isMobile ? "56px" : "72px",
    borderBottom: "1px solid #e8e8e8",
    background: "var(--ed-bg, #fafafa)",
    backdropFilter: "blur(12px)",
    padding: isMobile ? "0 1.25rem" : "0 3rem",
  };

  if (isMobile) {
    return (
      <>
        <nav id="section-nav" style={navBase}>
          <button onClick={() => setMenuOpen(true)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", color: "var(--ed-fg, #0a0a0a)", display: "flex", flexDirection: "column", gap: "5px" }}>
            <span style={{ display: "block", width: "20px", height: "1.5px", background: "var(--ed-fg, #0a0a0a)" }} />
            <span style={{ display: "block", width: "14px", height: "1.5px", background: "var(--ed-fg, #0a0a0a)" }} />
            <span style={{ display: "block", width: "20px", height: "1.5px", background: "var(--ed-fg, #0a0a0a)" }} />
          </button>
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <LogoMark />
          </div>
          <button onClick={onOpenGallery}
            style={{ ...sans, marginLeft: "auto", fontSize: "10px", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--ed-fg, #0a0a0a)", background: "none", border: "1px solid #0a0a0a", padding: "6px 14px", cursor: "pointer" }}>
            Work
          </button>
        </nav>
        {/* Mobile drawer */}
        <div style={{ position: "fixed", inset: 0, zIndex: 1500, pointerEvents: menuOpen ? "auto" : "none" }}>
          <div onClick={() => setMenuOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", opacity: menuOpen ? 1 : 0, transition: "opacity 0.3s ease", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "80%", maxWidth: "320px", background: "var(--ed-bg, #fafafa)", transform: menuOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.35s cubic-bezier(0.32,0.72,0,1)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", height: "56px", borderBottom: "1px solid #e8e8e8" }}>
              <span style={{ ...mono, fontSize: "13px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--ed-fg, #0a0a0a)", textTransform: "uppercase" }}>J·H</span>
              <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", padding: "4px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <nav style={{ flex: 1, padding: "2rem 1.5rem", display: "flex", flexDirection: "column" }}>
              {[
                { label: "Work",    action: () => { setMenuOpen(false); onOpenGallery(); } },
                { label: "About",   action: () => { setMenuOpen(false); document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); } },
                { label: "Press",   action: () => { setMenuOpen(false); document.getElementById("press")?.scrollIntoView({ behavior: "smooth" }); } },
                { label: "Contact", action: () => { setMenuOpen(false); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); } },
              ].map((item, i) => (
                <button key={item.label} onClick={item.action}
                  style={{ ...sans, textAlign: "left", background: "none", border: "none", borderBottom: "1px solid #f0f0f0", padding: "1.25rem 0", fontSize: "22px", fontWeight: 300, color: "var(--ed-fg, #0a0a0a)", cursor: "pointer",
                    fontFamily: i === 0 ? "var(--tpl-serif,serif)" : "var(--tpl-sans,sans-serif)", fontStyle: i === 0 ? "italic" : "normal" }}>
                  {item.label}
                </button>
              ))}
            </nav>
            <div style={{ padding: "1.5rem", borderTop: "1px solid #e8e8e8" }}>
              <button style={{ ...sans, width: "100%", padding: "13px", background: "var(--ed-fg, #0a0a0a)", color: "var(--ed-bg, #fafafa)", border: "none", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>Hire me</button>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "1rem" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
                <span style={{ ...mono, fontSize: "9px", color: "#888", letterSpacing: "0.12em" }}>Available for commissions — Q4 2025</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <nav id="section-nav" style={navBase}>
      <LogoMark />
      <div style={{ display: "flex", gap: "2.5rem", alignItems: "center", marginLeft: "auto" }}>
        {[
          { label: "Work",    fn: onOpenGallery },
          { label: "About",   fn: () => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }) },
          { label: "Press",   fn: () => document.getElementById("press")?.scrollIntoView({ behavior: "smooth" }) },
          { label: "Contact", fn: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
        ].map((item) => (
          <button key={item.label} onClick={item.fn}
            style={{ ...sans, background: "none", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 400, letterSpacing: "0.06em", color: "var(--ed-fg, #0a0a0a)", opacity: 0.55, transition: "opacity 0.2s", padding: 0 }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.55"; }}>
            {item.label}
          </button>
        ))}
        <button style={{ ...sans, fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", color: "var(--ed-bg, #fafafa)", background: "var(--ed-fg, #0a0a0a)", padding: "7px 18px", border: "1px solid #0a0a0a", cursor: "pointer", transition: "background 0.2s, color 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ed-fg, #0a0a0a)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--ed-fg, #0a0a0a)"; e.currentTarget.style.color = "var(--ed-bg, #fafafa)"; }}>
          Hire me
        </button>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   SECTION LABEL  (identical to source)
═══════════════════════════════════════════ */
function Label({ index, text }: { index: string; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
      <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", fontWeight: 700, color: "#bbb", letterSpacing: "0.2em", textTransform: "uppercase" as const }}>{index}</span>
      <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
      <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", color: "#bbb", letterSpacing: "0.15em", textTransform: "uppercase" as const }}>{text}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN EDITABLE TEMPLATE
═══════════════════════════════════════════ */
export function EditableTemplate({ viewport }: { viewport: Viewport }) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const { selectNode } = useEditorStore();

  /* Derive breakpoint flags from the editor viewport prop
     instead of reading window.innerWidth */
  const isMobile  = viewport === "mobile";
  const isTablet  = viewport === "tablet";

  const px = isMobile ? "1.5rem" : isTablet ? "5vw" : "7vw";
  const featured = WORKS.slice(0, 8);

  return (
    <div
      style={{ background: "var(--ed-bg, #fafafa)", color: "var(--ed-fg, #0a0a0a)", minHeight: "100%", fontFamily: "var(--tpl-sans,sans-serif)" }}
      onClick={() => selectNode(null)}
    >
      {/* SECTION IDS: used by the sidebar Pages tree to scroll-to and highlight sections.
          nav-section, hero-section, work (existing), section-quote,
          about (existing), press (existing), contact (existing), footer-section */}
      <Nav onOpenGallery={() => setGalleryOpen(true)} isMobile={isMobile} />

      {/* ════ HERO ════ */}
      <section
        id="section-hero"
        style={{
          minHeight: "92vh",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          /* ADAPTER NOTE: paddingTop was `isMobile ? "56px" : "72px"` to compensate
             for the fixed nav. With position:relative nav it's now 0. */
          paddingTop: 0,
        }}
      >
        {/* Left — text */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: isMobile ? "3rem 1.5rem 2.5rem" : isTablet ? "4rem 3rem 4rem 5vw" : "5rem 5rem 5rem 7vw" }}>
          <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", letterSpacing: "0.25em", color: "#999", textTransform: "uppercase", marginBottom: "2rem" }}>
            Documentary &amp; Portrait · New York
          </span>

          <EditableNode id="hero-heading" tag="h1" style={{ fontFamily: "var(--tpl-serif,serif)", fontWeight: 300, fontSize: isMobile ? "72px" : "clamp(72px,8vw,128px)", lineHeight: 0.92, letterSpacing: "-0.02em", color: "var(--ed-fg, #0a0a0a)", margin: "0 0 2rem" }}>
            <EditableText id="hero-heading" />
          </EditableNode>

          <div style={{ width: "40px", height: "1px", background: "var(--ed-fg, #0a0a0a)", margin: "0 0 2rem" }} />

          <EditableNode id="hero-sub" style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontWeight: 300, fontSize: "15px", lineHeight: 1.7, color: "#555", maxWidth: "380px" }}>
            <EditableText id="hero-sub" />
          </EditableNode>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
            <button onClick={() => setGalleryOpen(true)}
              style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ed-bg, #fafafa)", background: "var(--ed-fg, #0a0a0a)", padding: "12px 24px", border: "1px solid #0a0a0a", cursor: "pointer", transition: "background 0.2s, color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ed-fg, #0a0a0a)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--ed-fg, #0a0a0a)"; e.currentTarget.style.color = "var(--ed-bg, #fafafa)"; }}>
              View work
            </button>
            <a href="#about"
              style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ed-fg, #0a0a0a)", padding: "12px 24px", border: "1px solid #ccc", textDecoration: "none", transition: "border-color 0.2s", display: "inline-block" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--ed-fg, #0a0a0a)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#ccc"; }}>
              About
            </a>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: isMobile ? "2rem" : "auto", paddingTop: isMobile ? "0" : "4rem" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.5)", flexShrink: 0 }} />
            <EditableNode id="hero-avail" tag="span" style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "#888", letterSpacing: "0.12em" }}>
              <EditableText id="hero-avail" />
            </EditableNode>
          </div>
        </div>

        {/* Right — stacked photos (desktop/tablet editable, mobile single) */}
        {!isMobile && (
          <div style={{ display: "grid", gridTemplateRows: "60% 40%", gap: "3px" }}>
            <EditableNode id="hero-image-1" style={{ overflow: "hidden" }}>
              <EditableImage id="hero-image-1" imgStyle={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.88)" }} />
            </EditableNode>
            <EditableNode id="hero-image-2" style={{ overflow: "hidden" }}>
              <EditableImage id="hero-image-2" imgStyle={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.82)" }} />
            </EditableNode>
          </div>
        )}
        {isMobile && (
          <EditableNode id="hero-image-1" style={{ overflow: "hidden", height: "50vw", minHeight: "220px" }}>
            <EditableImage id="hero-image-1" imgStyle={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.88)" }} />
          </EditableNode>
        )}
      </section>

      {/* ════ WORK ════ */}
      <section id="work" style={{ padding: `5rem ${px}` }}>
        <Label index="01" text="Selected Work" />

        {!isMobile && (
          <div style={{ display: "grid", gridTemplateColumns: isTablet ? "1fr 1fr" : "2fr 1fr 1fr", gridTemplateRows: isTablet ? "240px 240px 240px 240px" : "280px 280px 360px 320px", gap: "3px" }}>
            {isTablet ? (
              featured.map((w) => <div key={w.id}><Cell w={w} onClick={() => setGalleryOpen(true)} /></div>)
            ) : (
              <>
                <div style={{ gridRow: "1/3", gridColumn: "1" }}>   <Cell w={featured[0]!} onClick={() => setGalleryOpen(true)} /></div>
                <div style={{ gridRow: "1",   gridColumn: "2" }}>   <Cell w={featured[1]!} onClick={() => setGalleryOpen(true)} /></div>
                <div style={{ gridRow: "1",   gridColumn: "3" }}>   <Cell w={featured[2]!} onClick={() => setGalleryOpen(true)} /></div>
                <div style={{ gridRow: "2",   gridColumn: "2" }}>   <Cell w={featured[3]!} onClick={() => setGalleryOpen(true)} /></div>
                <div style={{ gridRow: "2",   gridColumn: "3" }}>   <Cell w={featured[4]!} onClick={() => setGalleryOpen(true)} /></div>
                <div style={{ gridRow: "3",   gridColumn: "1/3" }}> <Cell w={featured[5]!} onClick={() => setGalleryOpen(true)} /></div>
                <div style={{ gridRow: "3",   gridColumn: "3" }}>   <Cell w={featured[6]!} onClick={() => setGalleryOpen(true)} /></div>
                <div style={{ gridRow: "4",   gridColumn: "1" }}>   <Cell w={featured[7]!} onClick={() => setGalleryOpen(true)} /></div>
                <div style={{ gridRow: "4",   gridColumn: "2/4" }}> <Cell w={featured[0]!} onClick={() => setGalleryOpen(true)} /></div>
              </>
            )}
          </div>
        )}
        {isMobile && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px" }}>
            {featured.map((w) => (
              <div key={w.id} style={{ aspectRatio: "1/1" }}><Cell w={w} onClick={() => setGalleryOpen(true)} /></div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "2.5rem", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={() => setGalleryOpen(true)}
            style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ed-fg, #0a0a0a)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid #0a0a0a", paddingBottom: "2px" }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.45"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
            All projects ({WORKS.length})
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </section>

      {/* ════ PULL QUOTE ════ */}
      <section id="section-quote" style={{ padding: `${isMobile ? "4rem" : "6rem"} ${px}`, background: "var(--ed-fg, #0a0a0a)", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
        <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>On practice</span>
        <EditableNode id="quote-text" tag="blockquote" style={{ fontFamily: "var(--tpl-serif,serif)", fontStyle: "italic", fontWeight: 300, fontSize: isMobile ? "clamp(22px,7vw,36px)" : "clamp(28px,3.5vw,52px)", lineHeight: 1.3, color: "var(--ed-bg, #f0f0f0)", maxWidth: "900px", textAlign: "center", margin: 0, letterSpacing: "-0.01em" }}>
          <EditableText id="quote-text" />
        </EditableNode>
        <EditableNode id="quote-author" tag="span" style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>
          <EditableText id="quote-author" />
        </EditableNode>
      </section>

      {/* ════ ABOUT ════ */}
      <section id="about" style={{ padding: `${isMobile ? "4rem" : "7rem"} ${px}`, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "3rem" : "6rem", alignItems: "center" }}>
        <div>
          <Label index="02" text="About" />
          <EditableNode id="about-heading" tag="h2" style={{ fontFamily: "var(--tpl-serif,serif)", fontWeight: 400, fontSize: isMobile ? "clamp(32px,10vw,48px)" : "clamp(36px,4vw,56px)", lineHeight: 1.1, color: "var(--ed-fg, #0a0a0a)", margin: "0 0 1.5rem", letterSpacing: "-0.02em" }}>
            <EditableText id="about-heading" />
          </EditableNode>
          <EditableNode id="about-body-1" style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontWeight: 300, fontSize: "15px", lineHeight: 1.8, color: "#4a4a4a", marginBottom: "1.25rem" }}>
            <EditableText id="about-body-1" />
          </EditableNode>
          <EditableNode id="about-body-2" style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontWeight: 300, fontSize: "15px", lineHeight: 1.8, color: "#4a4a4a", marginBottom: "2rem" }}>
            <EditableText id="about-body-2" />
          </EditableNode>
          <div style={{ display: "flex", gap: isMobile ? "2rem" : "3rem", paddingTop: "2rem", borderTop: "1px solid #e0e0e0" }}>
            {([["stat-1-value","stat-1-label"],["stat-2-value","stat-2-label"],["stat-3-value","stat-3-label"]] as const).map(([vId, lId]) => (
              <div key={vId}>
                <EditableNode id={vId} style={{ fontFamily: "var(--tpl-serif,serif)", fontSize: isMobile ? "28px" : "36px", fontWeight: 300, color: "var(--ed-fg, #0a0a0a)", lineHeight: 1 }}>
                  <EditableText id={vId} />
                </EditableNode>
                <EditableNode id={lId} style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "11px", color: "#888", marginTop: "4px" }}>
                  <EditableText id={lId} />
                </EditableNode>
              </div>
            ))}
          </div>
        </div>

        {/* Portrait photo (editable image) */}
        <EditableNode id="about-image" style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: "12px", left: "12px", right: "-12px", bottom: "-12px", border: "1px solid #d8d8d8" }} />
          <div style={{ position: "relative", zIndex: 1, width: "100%", aspectRatio: "4/5", overflow: "hidden" }}>
            <EditableImage
              id="about-image"
              imgStyle={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "brightness(0.9)" }}
            />
          </div>
          <div style={{ position: "absolute", bottom: "-16px", right: "0", zIndex: 2, background: "var(--ed-bg, #fafafa)", padding: "7px 12px", border: "1px solid #e8e8e8" }}>
            <EditableNode id="about-caption" tag="span" style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "#aaa", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              <EditableText id="about-caption" />
            </EditableNode>
          </div>
        </EditableNode>
      </section>

      {/* ════ PRESS ════ */}
      <section id="press" style={{ padding: `${isMobile ? "3.5rem" : "5rem"} ${px}`, background: "#f2f2f0", borderTop: "1px solid #e0e0e0" }}>
        <Label index="03" text="Press &amp; Features" />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : isTablet ? "repeat(3,1fr)" : "repeat(5,1fr)", gap: "1px", background: "#d8d8d8" }}>
          {(["press-1","press-2","press-3","press-4","press-5"] as const).map((id, i) => {
            if (isMobile && i >= 4) return null;
            return (
              <div key={id} style={{ background: "var(--ed-bg, #f2f2f0)", padding: isMobile ? "1.25rem" : "2rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <EditableNode id={id} style={{ fontFamily: "var(--tpl-serif,serif)", fontSize: isMobile ? "15px" : "18px", fontWeight: 400, color: "var(--ed-fg, #0a0a0a)", lineHeight: 1.2 }}>
                  <EditableText id={id} />
                </EditableNode>
                <EditableNode id={`${id}-year`} style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", color: "#aaa", letterSpacing: "0.15em" }}>
                  <EditableText id={`${id}-year`} />
                </EditableNode>
              </div>
            );
          })}
        </div>
      </section>

      {/* ════ CONTACT ════ */}
      <section id="contact" style={{ padding: `${isMobile ? "4rem" : "8rem"} ${px}`, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "3rem" : "6rem", alignItems: "start" }}>
        <div>
          <Label index="04" text="Contact" />
          <EditableNode id="contact-heading" tag="h2" style={{ fontFamily: "var(--tpl-serif,serif)", fontWeight: 300, fontSize: isMobile ? "clamp(36px,11vw,56px)" : "clamp(40px,5vw,72px)", lineHeight: 1.05, color: "var(--ed-fg, #0a0a0a)", margin: "0 0 1.5rem", letterSpacing: "-0.02em" }}>
            <EditableText id="contact-heading" />
          </EditableNode>
          <EditableNode id="contact-body" style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontWeight: 300, fontSize: "14px", lineHeight: 1.7, color: "#666", marginBottom: "2rem" }}>
            <EditableText id="contact-body" />
          </EditableNode>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {[
              { label: "General",  value: "hello@jameshollis.com" },
              { label: "Bookings", value: "bookings@jameshollis.com" },
              { label: "Agent",    value: "+1 (212) 555 0184" },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", gap: "1.25rem", alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "#aaa", letterSpacing: "0.2em", textTransform: "uppercase", minWidth: "52px" }}>{row.label}</span>
                <span style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "13px", color: "#333" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {["First name", "Last name"].map((ph) => (
              <input key={ph} placeholder={ph}
                style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "13px", fontWeight: 300, padding: "11px 13px", border: "1px solid #d8d8d8", background: "transparent", color: "var(--ed-fg, #0a0a0a)", outline: "none", transition: "border-color 0.2s", width: "100%", boxSizing: "border-box" as const }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--ed-fg, #0a0a0a)"; }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = "#d8d8d8"; }} />
            ))}
          </div>
          <input type="email" placeholder="Email address"
            style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "13px", fontWeight: 300, padding: "11px 13px", border: "1px solid #d8d8d8", background: "transparent", color: "var(--ed-fg, #0a0a0a)", outline: "none", transition: "border-color 0.2s", width: "100%", boxSizing: "border-box" as const }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--ed-fg, #0a0a0a)"; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = "#d8d8d8"; }} />
          <textarea placeholder="Tell me about your project..." rows={5}
            style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "13px", fontWeight: 300, padding: "11px 13px", border: "1px solid #d8d8d8", background: "transparent", color: "var(--ed-fg, #0a0a0a)", outline: "none", resize: "vertical", transition: "border-color 0.2s", width: "100%", boxSizing: "border-box" as const }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--ed-fg, #0a0a0a)"; }}
            onBlur={(e)  => { e.currentTarget.style.borderColor = "#d8d8d8"; }} />
          <button type="submit"
            style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ed-bg, #fafafa)", background: "var(--ed-fg, #0a0a0a)", border: "1px solid #0a0a0a", padding: "13px", cursor: "pointer", transition: "background 0.2s, color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ed-fg, #0a0a0a)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--ed-fg, #0a0a0a)"; e.currentTarget.style.color = "var(--ed-bg, #fafafa)"; }}>
            Send message
          </button>
        </form>
      </section>

      {/* ════ FOOTER ════ */}
      <footer id="section-footer" style={{ padding: `2rem ${px}`, borderTop: "1px solid #e0e0e0", display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? "1.25rem" : "2rem", justifyContent: "space-between" }}>
        <EditableNode id="nav-logo" tag="span" style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--ed-fg, #0a0a0a)", textTransform: "uppercase" }}>
          <EditableText id="nav-logo" />
        </EditableNode>
        {!isMobile && (
          <EditableNode id="footer-copyright" tag="span" style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "#bbb", letterSpacing: "0.12em" }}>
            <EditableText id="footer-copyright" />
          </EditableNode>
        )}
        <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
          {[
            { label: "Instagram", href: "#", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg> },
            { label: "X",         href: "#", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
            { label: "YouTube",   href: "#", icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
            { label: "Facebook",  href: "#", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
          ].map((s) => (
            <a key={s.label} href={s.href} aria-label={s.label}
              style={{ color: "#aaa", textDecoration: "none", display: "flex", alignItems: "center", transition: "color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ed-fg, #0a0a0a)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#aaa"; }}>
              {s.icon}
            </a>
          ))}
        </div>
        {isMobile && (
          <EditableNode id="footer-copyright" tag="span" style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "#bbb", letterSpacing: "0.1em" }}>
            <EditableText id="footer-copyright" />
          </EditableNode>
        )}
      </footer>

      {galleryOpen && <GalleryModal onClose={() => setGalleryOpen(false)} />}
    </div>
  );
}
