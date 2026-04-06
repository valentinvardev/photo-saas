"use client";

import { useState } from "react";
import { useEditorStore } from "~/lib/editor/store";
import { TiptapEditor } from "~/components/editor/toolbars/TiptapEditor";

/* ─────────────────────────────────────────────────────────────────────────
   EditableNode — wraps any element to make it selectable/editable
───────────────────────────────────────────────────────────────────────── */
function EditableNode({
  id,
  children,
  style,
  className,
  tag: Tag = "div",
}: {
  id: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  tag?: keyof React.JSX.IntrinsicElements;
}) {
  const { selectedId, editingId, selectNode, setEditing } = useEditorStore();
  const selected = selectedId === id;
  const editing  = editingId === id;

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!selected) { selectNode(id); return; }
  }
  function handleDoubleClick(e: React.MouseEvent) {
    e.stopPropagation();
    selectNode(id);
    setEditing(id);
  }

  const El = Tag as "div";
  return (
    <El
      data-editor-node=""
      data-node-id={id}
      data-selected={selected ? "true" : undefined}
      data-editing={editing ? "true" : undefined}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{ position: "relative", ...style }}
      className={className}
    >
      {children}
    </El>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   EditableText — selectable text node, Tiptap on double-click
───────────────────────────────────────────────────────────────────────── */
function EditableText({
  id,
  style,
}: {
  id: string;
  style?: React.CSSProperties;
}) {
  const { nodes, editingId, updateNode } = useEditorStore();
  const node    = nodes[id];
  const content = node?.content ?? "";
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
    <span
      style={{ display: "block", ...style }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   EditableImage
───────────────────────────────────────────────────────────────────────── */
function EditableImage({
  id,
  imgStyle,
}: {
  id: string;
  imgStyle?: React.CSSProperties;
}) {
  const { nodes } = useEditorStore();
  const node = nodes[id];
  const src  = node?.src ?? "";
  const alt  = node?.alt ?? "";

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} style={imgStyle} />;
}

/* ─────────────────────────────────────────────────────────────────────────
   WORKS data (same as original)
───────────────────────────────────────────────────────────────────────── */
const WORKS = [
  { id: 1,  seed: 20,  title: "Wanderers",        year: "2024", cat: "Documentary" },
  { id: 2,  seed: 37,  title: "The Quiet City",    year: "2023", cat: "Urban"       },
  { id: 3,  seed: 48,  title: "Peripheral",        year: "2023", cat: "Street"      },
  { id: 4,  seed: 63,  title: "Aftermath",         year: "2022", cat: "Documentary" },
  { id: 5,  seed: 71,  title: "Still Life No. 4",  year: "2022", cat: "Studio"      },
  { id: 6,  seed: 82,  title: "Northern Light",    year: "2024", cat: "Landscape"   },
  { id: 7,  seed: 95,  title: "Between Sessions",  year: "2021", cat: "Portrait"    },
  { id: 8,  seed: 108, title: "Threshold",         year: "2021", cat: "Documentary" },
];

const STATS = [
  { value: "14",   unit: "Years"    },
  { value: "280+", unit: "Projects" },
  { value: "9",    unit: "Cities"   },
];

const PRESS = [
  { name: "The New Yorker", year: "2023" },
  { name: "Aperture",       year: "2022" },
  { name: "Foam Magazine",  year: "2022" },
  { name: "Zeit Magazin",   year: "2021" },
  { name: "LensCulture",    year: "2020" },
];

/* Photo cell for the work grid */
function Cell({ seed, title, cat, year }: { seed: number; title: string; cat: string; year: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ position: "relative", overflow: "hidden", width: "100%", height: "100%", background: "#111" }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`https://picsum.photos/seed/${seed}/800/1000?grayscale`} alt={title}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block",
          filter: hov ? "brightness(0.5)" : "brightness(0.88)",
          transform: hov ? "scale(1.05)" : "scale(1)",
          transition: "filter 0.5s ease, transform 0.65s ease" }} />
      {hov && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "1rem", pointerEvents: "none" }}>
          <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "rgba(255,255,255,0.55)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.25rem" }}>
            {cat} · {year}
          </span>
          <span style={{ fontFamily: "var(--tpl-serif,serif)", fontStyle: "italic", fontSize: "18px", color: "#fafafa", lineHeight: 1.2 }}>
            {title}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN EDITABLE TEMPLATE
───────────────────────────────────────────────────────────────────────── */
export function EditableTemplate() {
  const { selectNode } = useEditorStore();

  const px = "7vw";

  return (
    <div
      style={{ background: "var(--ed-bg, #fafafa)", color: "var(--ed-fg, #0a0a0a)", fontFamily: "var(--tpl-sans,sans-serif)", minHeight: "100%" }}
      onClick={() => selectNode(null)}
    >
      {/* ═══ NAV ═══ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 10,
        display: "flex", alignItems: "center",
        height: "64px",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        background: "rgba(250,250,250,0.95)",
        backdropFilter: "blur(12px)",
        padding: "0 3rem",
      }}>
        <EditableNode id="nav-logo">
          <EditableText
            id="nav-logo"
            style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "13px", fontWeight: 700, letterSpacing: "0.18em", color: "var(--ed-fg,#0a0a0a)", textTransform: "uppercase" }}
          />
        </EditableNode>
        <div style={{ marginLeft: "auto", display: "flex", gap: "2rem", alignItems: "center" }}>
          {["Work", "About", "Press", "Contact"].map((l) => (
            <span key={l} style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "12px", color: "var(--ed-muted, #666)", letterSpacing: "0.06em" }}>{l}</span>
          ))}
          <span style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.08em", color: "var(--ed-bg,#fafafa)", background: "var(--ed-fg,#0a0a0a)", padding: "7px 18px" }}>
            Hire me
          </span>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "90vh" }}>
        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "5rem 5rem 5rem 7vw" }}>
          <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", letterSpacing: "0.25em", color: "var(--ed-muted,#999)", textTransform: "uppercase", marginBottom: "2rem" }}>
            Documentary &amp; Portrait · New York
          </span>

          <EditableNode id="hero-heading" tag="h1" style={{ fontFamily: "var(--tpl-serif,serif)", fontWeight: 300, fontSize: "clamp(72px,8vw,128px)", lineHeight: 0.92, letterSpacing: "-0.02em", color: "var(--ed-fg,#0a0a0a)", margin: "0 0 2rem" }}>
            <EditableText id="hero-heading" />
          </EditableNode>

          <div style={{ width: "40px", height: "1px", background: "var(--ed-fg,#0a0a0a)", margin: "0 0 2rem" }} />

          <EditableNode id="hero-sub" style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontWeight: 300, fontSize: "15px", lineHeight: 1.7, color: "var(--ed-muted,#555)", maxWidth: "380px" }}>
            <EditableText id="hero-sub" />
          </EditableNode>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "2.5rem" }}>
            <span style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ed-bg,#fafafa)", background: "var(--ed-accent,#0a0a0a)", padding: "12px 24px" }}>
              View work
            </span>
            <span style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "11px", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ed-fg,#0a0a0a)", padding: "12px 24px", border: "1px solid #ccc" }}>
              About
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "auto", paddingTop: "4rem" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "var(--ed-muted,#888)", letterSpacing: "0.12em" }}>
              Available for commissions — Q4 2025
            </span>
          </div>
        </div>

        {/* Photos */}
        <div style={{ display: "grid", gridTemplateRows: "60% 40%", gap: "3px" }}>
          <div style={{ position: "relative", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://picsum.photos/seed/201/900/1100?grayscale" alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.88)" }} />
          </div>
          <div style={{ position: "relative", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://picsum.photos/seed/202/900/700?grayscale" alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.82)" }} />
          </div>
        </div>
      </section>

      {/* ═══ WORK GRID ═══ */}
      <section style={{ padding: `5rem ${px}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
          <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", fontWeight: 700, color: "#bbb", letterSpacing: "0.2em", textTransform: "uppercase" }}>01</span>
          <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
          <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", color: "#bbb", letterSpacing: "0.15em", textTransform: "uppercase" }}>Selected Work</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "280px 280px 360px 320px", gap: "3px" }}>
          <div style={{ gridRow: "1/3", gridColumn: "1" }}>   <Cell {...WORKS[0]!} /></div>
          <div style={{ gridRow: "1",   gridColumn: "2" }}>   <Cell {...WORKS[1]!} /></div>
          <div style={{ gridRow: "1",   gridColumn: "3" }}>   <Cell {...WORKS[2]!} /></div>
          <div style={{ gridRow: "2",   gridColumn: "2" }}>   <Cell {...WORKS[3]!} /></div>
          <div style={{ gridRow: "2",   gridColumn: "3" }}>   <Cell {...WORKS[4]!} /></div>
          <div style={{ gridRow: "3",   gridColumn: "1/3" }}> <Cell {...WORKS[5]!} /></div>
          <div style={{ gridRow: "3",   gridColumn: "3" }}>   <Cell {...WORKS[6]!} /></div>
          <div style={{ gridRow: "4",   gridColumn: "1" }}>   <Cell {...WORKS[7]!} /></div>
          <div style={{ gridRow: "4",   gridColumn: "2/4" }}> <Cell {...WORKS[0]!} /></div>
        </div>

        <div style={{ marginTop: "2.5rem", display: "flex", justifyContent: "flex-end" }}>
          <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--ed-fg,#0a0a0a)", display: "flex", alignItems: "center", gap: "0.75rem", borderBottom: "1px solid var(--ed-fg,#0a0a0a)", paddingBottom: "2px" }}>
            All projects ({WORKS.length})
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </span>
        </div>
      </section>

      {/* ═══ PULL QUOTE ═══ */}
      <section style={{ padding: "6rem 7vw", background: "var(--ed-accent,#0a0a0a)", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
        <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>On practice</span>
        <blockquote style={{ fontFamily: "var(--tpl-serif,serif)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(28px,3.5vw,52px)", lineHeight: 1.3, color: "#f0f0f0", maxWidth: "900px", textAlign: "center", margin: 0 }}>
          &ldquo;The camera is an instrument that teaches people how to see without a camera.&rdquo;
        </blockquote>
        <cite style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", fontStyle: "normal" }}>— Dorothea Lange</cite>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" style={{ padding: "7rem 7vw", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
            <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", fontWeight: 700, color: "#bbb", letterSpacing: "0.2em", textTransform: "uppercase" }}>02</span>
            <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
            <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", color: "#bbb", letterSpacing: "0.15em", textTransform: "uppercase" }}>About</span>
          </div>

          <EditableNode id="about-heading" tag="h2" style={{ fontFamily: "var(--tpl-serif,serif)", fontWeight: 400, fontSize: "clamp(36px,4vw,56px)", lineHeight: 1.1, color: "var(--ed-fg,#0a0a0a)", margin: "0 0 1.5rem", letterSpacing: "-0.02em" }}>
            <EditableText id="about-heading" />
          </EditableNode>

          <EditableNode id="about-body" style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontWeight: 300, fontSize: "15px", lineHeight: 1.8, color: "var(--ed-muted,#4a4a4a)", marginBottom: "2rem" }}>
            <EditableText id="about-body" />
          </EditableNode>

          <div style={{ display: "flex", gap: "3rem", paddingTop: "2rem", borderTop: "1px solid #e0e0e0" }}>
            {STATS.map((s) => (
              <div key={s.value}>
                <div style={{ fontFamily: "var(--tpl-serif,serif)", fontSize: "36px", fontWeight: 300, color: "var(--ed-fg,#0a0a0a)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "11px", color: "var(--ed-muted,#888)", marginTop: "4px" }}>{s.unit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* About image */}
        <EditableNode id="about-image" style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: "12px", left: "12px", right: "-12px", bottom: "-12px", border: "1px solid #d8d8d8" }} />
          <div style={{ position: "relative", zIndex: 1, width: "100%", aspectRatio: "4/5", overflow: "hidden" }}>
            <EditableImage
              id="about-image"
              imgStyle={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "brightness(0.9)" }}
            />
          </div>
          <div style={{ position: "absolute", bottom: "-16px", right: "0", zIndex: 2, background: "#fafafa", padding: "7px 12px", border: "1px solid #e8e8e8" }}>
            <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "#aaa", letterSpacing: "0.18em", textTransform: "uppercase" }}>Brooklyn, NY · 2024</span>
          </div>
        </EditableNode>
      </section>

      {/* ═══ PRESS ═══ */}
      <section style={{ padding: "5rem 7vw", background: "#f2f2f0", borderTop: "1px solid #e0e0e0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
          <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", fontWeight: 700, color: "#bbb", letterSpacing: "0.2em", textTransform: "uppercase" }}>03</span>
          <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
          <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", color: "#bbb", letterSpacing: "0.15em", textTransform: "uppercase" }}>Press &amp; Features</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1px", background: "#d8d8d8" }}>
          {PRESS.map((p) => (
            <div key={p.name} style={{ background: "#f2f2f0", padding: "2rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <span style={{ fontFamily: "var(--tpl-serif,serif)", fontSize: "18px", fontWeight: 400, color: "#0a0a0a", lineHeight: 1.2 }}>{p.name}</span>
              <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", color: "#aaa", letterSpacing: "0.15em" }}>{p.year}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" style={{ padding: "8rem 7vw", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
            <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", fontWeight: 700, color: "#bbb", letterSpacing: "0.2em", textTransform: "uppercase" }}>04</span>
            <div style={{ flex: 1, height: "1px", background: "#e0e0e0" }} />
            <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "10px", color: "#bbb", letterSpacing: "0.15em", textTransform: "uppercase" }}>Contact</span>
          </div>

          <EditableNode id="contact-heading" tag="h2" style={{ fontFamily: "var(--tpl-serif,serif)", fontWeight: 300, fontSize: "clamp(40px,5vw,72px)", lineHeight: 1.05, color: "var(--ed-fg,#0a0a0a)", margin: "0 0 1.5rem", letterSpacing: "-0.02em" }}>
            <EditableText id="contact-heading" />
          </EditableNode>

          <EditableNode id="contact-body" style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontWeight: 300, fontSize: "14px", lineHeight: 1.7, color: "var(--ed-muted,#666)", marginBottom: "2rem" }}>
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
                <span style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "13px", color: "var(--ed-muted,#333)" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact form (static in editor) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {["First name", "Last name"].map((ph) => (
              <div key={ph} style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "13px", padding: "11px 13px", border: "1px solid #d8d8d8", color: "#aaa" }}>{ph}</div>
            ))}
          </div>
          <div style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "13px", padding: "11px 13px", border: "1px solid #d8d8d8", color: "#aaa" }}>Email address</div>
          <div style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "13px", padding: "11px 13px", border: "1px solid #d8d8d8", color: "#aaa", height: "100px" }}>Tell me about your project...</div>
          <div style={{ fontFamily: "var(--tpl-sans,sans-serif)", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ed-bg,#fafafa)", background: "var(--ed-accent,#0a0a0a)", padding: "13px", textAlign: "center" }}>
            Send message
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "2rem 7vw", borderTop: "1px solid #e0e0e0", display: "flex", alignItems: "center", gap: "2rem", justifyContent: "space-between" }}>
        <EditableNode id="nav-logo">
          <EditableText
            id="nav-logo"
            style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--ed-fg,#0a0a0a)", textTransform: "uppercase" }}
          />
        </EditableNode>
        <span style={{ fontFamily: "var(--tpl-mono,monospace)", fontSize: "9px", color: "#bbb", letterSpacing: "0.12em" }}>© 2025 James Hollis Photography</span>
        <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
          {[
            { label: "Instagram", icon: <svg key="ig" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/></svg> },
            { label: "X",         icon: <svg key="x" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
            { label: "YouTube",   icon: <svg key="yt" width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
            { label: "Facebook",  icon: <svg key="fb" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
          ].map((s) => (
            <span key={s.label} style={{ color: "#aaa", display: "flex", alignItems: "center" }}>{s.icon}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
