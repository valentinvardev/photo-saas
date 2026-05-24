"use client";

/* Atelier Delivery — standalone client gallery demo
   Visual language: warm editorial (#fafaf8, Cormorant Garamond + Space Mono).
   Same grid/lightbox pattern as Minimal Delivery; Atelier password gate UX. */

import { useEffect, useMemo, useRef, useState } from "react";

const T = {
  bg:    "#fafaf8",
  fg:    "#0a0a0a",
  muted: "#7a766f",
  line:  "#d8d4cc",
  light: "#ffffff",
};

const F = {
  serif: "var(--atelier-serif), 'Cormorant Garamond', serif",
  sans:  "var(--atelier-sans), Inter, -apple-system, sans-serif",
  mono:  "var(--atelier-mono), 'Space Mono', ui-monospace, monospace",
};

const CLIENT      = "Elena & Marcus";
const EVENT_DATE  = "March 2026";
const STUDIO_NAME = "Atelier";
const SECTIONS = [
  { id: "morning",   label: "The Morning",  photos: [10, 71, 82, 93, 100, 111] },
  { id: "ceremony",  label: "Ceremony",     photos: [144, 155, 166, 177, 188, 199, 210] },
  { id: "portraits", label: "Portraits",    photos: [22, 33, 44, 55] },
  { id: "reception", label: "The Evening",  photos: [232, 243, 254, 265, 276, 287, 298, 309] },
];

const ALL_PHOTOS = SECTIONS.flatMap((s) =>
  s.photos.map((seed) => ({ id: `${s.id}-${seed}`, seed, section: s.id, sectionLabel: s.label }))
);
type Photo = (typeof ALL_PHOTOS)[number];

export default function AtelierDeliveryPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd]           = useState("");
  const [error, setError]       = useState(false);
  const [filter, setFilter]     = useState<"all" | "fav">("all");
  const [favs, setFavs]         = useState<Set<string>>(new Set());
  const [sel, setSel]           = useState<Set<string>>(new Set());
  const [lightbox, setLightbox] = useState<{ photos: Photo[]; index: number } | null>(null);
  const lbTouchX = useRef(0);

  const visible = useMemo(
    () => (filter === "fav" ? ALL_PHOTOS.filter((p) => favs.has(p.id)) : ALL_PHOTOS),
    [filter, favs]
  );
  const groups = useMemo(() => {
    const g: Record<string, Photo[]> = {};
    visible.forEach((p) => { (g[p.section] ||= []).push(p); });
    return SECTIONS.filter((s) => g[s.id]?.length).map((s) => ({ ...s, items: g[s.id]! }));
  }, [visible]);

  function tryUnlock(e?: React.FormEvent) {
    e?.preventDefault?.();
    if (!pwd.trim()) { setError(true); return; }
    setUnlocked(true);
  }
  function toggleFav(id: string) { setFavs((f) => { const n = new Set(f); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleSel(id: string) { setSel((s)  => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function clearSel() { setSel(new Set()); }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!lightbox) return;
      if (e.key === "Escape")     setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((l) => l && ({ ...l, index: (l.index + 1) % l.photos.length }));
      if (e.key === "ArrowLeft")  setLightbox((l) => l && ({ ...l, index: (l.index - 1 + l.photos.length) % l.photos.length }));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <div style={{ background: T.bg, color: T.fg, minHeight: "100dvh", fontFamily: F.sans }}>
      <style>{`
        .atd-nav{position:sticky;top:0;z-index:30;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:20px 40px;border-bottom:1px solid ${T.line};background:rgba(250,250,248,0.88);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
        .atd-brand{font-family:${F.serif};font-size:20px;font-weight:300;font-style:italic;letter-spacing:-0.01em}
        .atd-meta{font-family:${F.mono};font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:${T.muted};text-align:center}
        .atd-dl{font-family:${F.mono};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${T.fg};text-decoration:none;border-bottom:1px solid ${T.fg};padding-bottom:1px;justify-self:end}
        @media(max-width:600px){.atd-nav{grid-template-columns:1fr auto;padding:16px 20px}.atd-meta{display:none}}

        .atd-hero{padding:80px 40px 56px;text-align:center;border-bottom:1px solid ${T.line}}
        .atd-eyebrow{font-family:${F.mono};font-size:10px;letter-spacing:0.26em;text-transform:uppercase;color:${T.muted};margin-bottom:20px}
        .atd-h1{font-family:${F.serif};font-size:clamp(56px,10vw,100px);line-height:0.95;letter-spacing:-0.025em;font-weight:300;margin:0 0 14px}
        .atd-h1 em{font-style:italic;font-weight:400;color:#3a3a3a}
        .atd-sub{font-family:${F.serif};font-style:italic;font-size:clamp(15px,2vw,20px);color:${T.muted};max-width:460px;margin:14px auto 0;font-weight:300;line-height:1.55}
        @media(max-width:600px){.atd-hero{padding:56px 20px 40px}}

        .atd-info{display:grid;grid-template-columns:repeat(4,1fr);max-width:760px;margin:40px auto 0;border-top:1px solid ${T.line};border-bottom:1px solid ${T.line}}
        .atd-info>div{padding:16px 0;border-right:1px solid ${T.line};text-align:center}
        .atd-info>div:last-child{border-right:0}
        .atd-info .v{font-family:${F.serif};font-size:24px;font-weight:300;letter-spacing:-0.01em;line-height:1}
        .atd-info .l{font-family:${F.mono};font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:${T.muted};margin-top:6px}
        @media(max-width:600px){.atd-info{grid-template-columns:repeat(2,1fr)}.atd-info>div:nth-child(2){border-right:0}.atd-info>div:nth-child(1),.atd-info>div:nth-child(2){border-bottom:1px solid ${T.line}}}

        .atd-bar{position:sticky;top:61px;z-index:20;background:${T.bg};border-bottom:1px solid ${T.line};padding:14px 40px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
        .atd-tabs{display:inline-flex;border:1px solid ${T.line}}
        .atd-tab{background:transparent;border:0;padding:8px 18px;font-family:${F.mono};font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${T.muted};cursor:pointer;transition:color .2s,background .2s}
        .atd-tab.on{background:${T.fg};color:${T.bg}}
        .atd-tab:not(.on):hover{color:${T.fg}}
        .atd-count{font-family:${F.mono};font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:${T.muted}}
        .atd-count b{color:${T.fg};font-weight:400}
        @media(max-width:600px){.atd-bar{padding:12px 20px;top:53px}}

        .atd-sect{padding:56px 40px}
        .atd-sect-head{display:flex;align-items:baseline;gap:14px;margin-bottom:28px;border-bottom:1px solid ${T.line};padding-bottom:16px}
        .atd-sect-no{font-family:${F.mono};font-size:10px;letter-spacing:0.2em;color:${T.muted};text-transform:uppercase}
        .atd-sect-title{font-family:${F.serif};font-size:clamp(28px,4vw,44px);font-weight:300;font-style:italic;letter-spacing:-0.015em;line-height:1}
        .atd-sect-n{font-family:${F.mono};font-size:10px;color:${T.muted};margin-left:auto}
        @media(max-width:600px){.atd-sect{padding:40px 20px}}

        .atd-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        @media(max-width:900px){.atd-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:480px){.atd-grid{grid-template-columns:repeat(2,1fr);gap:6px}}
        .atd-cell{position:relative;aspect-ratio:4/5;overflow:hidden;cursor:pointer;background:#000}
        .atd-cell img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s cubic-bezier(0.2,0.8,0.2,1)}
        .atd-cell:hover img{transform:scale(1.05)}
        .atd-veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.4) 0%,transparent 50%);opacity:0;transition:opacity .3s ease;pointer-events:none}
        .atd-cell:hover .atd-veil{opacity:1}
        .atd-ctrl{position:absolute;left:8px;right:8px;bottom:8px;display:flex;justify-content:space-between;align-items:center;opacity:0;transition:opacity .3s ease}
        .atd-cell:hover .atd-ctrl,.atd-cell.fav .atd-ctrl,.atd-cell.sel .atd-ctrl{opacity:1}
        .atd-ibtn{width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:rgba(250,250,248,0.88);border:1px solid rgba(0,0,0,0.06);color:${T.fg};cursor:pointer;transition:background .2s,color .2s;border-radius:2px}
        .atd-ibtn.on{background:${T.fg};color:${T.bg}}
        .atd-ibtn:hover{background:${T.fg};color:${T.bg}}
        .atd-cell.sel{outline:2px solid ${T.fg};outline-offset:-2px}

        .atd-foot{padding:48px 40px 64px;border-top:1px solid ${T.line};display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:24px}
        .atd-foot-brand{font-family:${F.serif};font-size:22px;font-weight:300;font-style:italic;letter-spacing:-0.01em}
        .atd-foot-mono{font-family:${F.mono};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${T.muted}}
        @media(max-width:600px){.atd-foot{padding:40px 20px 56px}}

        .atd-floater{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:${T.fg};color:${T.bg};display:flex;gap:12px;align-items:center;padding:10px 14px 10px 20px;box-shadow:0 16px 48px rgba(0,0,0,0.15);z-index:50;white-space:nowrap}
        .atd-floater .label{font-family:${F.mono};font-size:11px;letter-spacing:0.14em;text-transform:uppercase}
        .atd-floater .act{background:${T.bg};color:${T.fg};border:0;padding:8px 14px;font-family:${F.mono};font-size:10px;letter-spacing:0.16em;text-transform:uppercase;cursor:pointer}

        .atd-lb{position:fixed;inset:0;background:rgba(10,10,10,0.96);z-index:60;display:flex;align-items:center;justify-content:center}
        .atd-lb img{max-width:88vw;max-height:84vh;object-fit:contain;display:block}
        .atd-lb-top{position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:20px 28px;background:linear-gradient(to bottom,rgba(0,0,0,0.5),transparent)}
        .atd-lb-top button{background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.7);font-family:${F.mono};font-size:10px;letter-spacing:0.2em;text-transform:uppercase;display:flex;align-items:center;gap:8px}
        .atd-lb-nav{position:absolute;top:50%;transform:translateY(-50%);width:48px;height:48px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.7);cursor:pointer;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .2s}
        .atd-lb-nav:hover{background:rgba(255,255,255,0.14)}
        .atd-lb-nav.prev{left:20px}.atd-lb-nav.next{right:20px}
        .atd-lb-bot{position:absolute;bottom:0;left:0;right:0;padding:20px 28px;background:linear-gradient(to top,rgba(0,0,0,0.5),transparent);display:flex;justify-content:space-between;align-items:flex-end}
        .atd-lb-bot .cap{font-family:${F.serif};font-style:italic;font-size:20px;color:rgba(250,250,248,0.9);font-weight:300}
        .atd-lb-bot .num{font-family:${F.mono};font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.4)}
      `}</style>

      {/* ── Gate ─────────────────────────────────────────────────── */}
      {!unlocked && (
        <div style={{
          minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          background: `linear-gradient(135deg, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.6) 100%), url(https://picsum.photos/seed/144/2400/1600) center/cover`,
          color: "#fafaf8",
        }}>
          <div style={{ width: 400, maxWidth: "100%", background: "rgba(10,10,10,0.52)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)", padding: "52px 44px", textAlign: "center" }}>
            <p style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>
              {STUDIO_NAME} · Private Gallery
            </p>
            <h1 style={{ fontFamily: F.serif, fontSize: 52, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1, margin: "0 0 6px", color: "#fafaf8" }}>
              Elena <span style={{ fontStyle: "italic", fontWeight: 400 }}>&amp;</span> Marcus
            </h1>
            <p style={{ fontFamily: F.serif, fontStyle: "italic", fontSize: 16, color: "rgba(250,250,248,0.6)", fontWeight: 300, margin: "0 0 40px", lineHeight: 1.5 }}>
              {EVENT_DATE} · {ALL_PHOTOS.length} photographs
            </p>
            <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.25)", margin: "0 auto 36px" }} />
            <form onSubmit={tryUnlock} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                type="password" value={pwd}
                onChange={(e) => { setPwd(e.target.value); setError(false); }}
                placeholder="Access key"
                autoFocus
                style={{
                  background: "transparent", border: "none",
                  borderBottom: `1px solid ${error ? "#f59e9e" : "rgba(255,255,255,0.22)"}`,
                  color: "#fafaf8", fontFamily: F.serif, fontSize: 18, fontStyle: "italic",
                  padding: "12px 0", outline: "none", width: "100%", boxSizing: "border-box" as const,
                }}
              />
              {error && (
                <p style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "#f59e9e", margin: 0, textAlign: "left" }}>
                  Incorrect — try again
                </p>
              )}
              <button type="submit" style={{ marginTop: 16, padding: "15px 24px", background: "#fafaf8", color: "#0a0a0a", border: "none", cursor: "pointer", fontFamily: F.mono, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                Open gallery
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </form>
            <p style={{ marginTop: 28, fontFamily: F.mono, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>
              Private · For recipient only
            </p>
          </div>
        </div>
      )}

      {/* ── Gallery ──────────────────────────────────────────────── */}
      {unlocked && (
        <>
          <nav className="atd-nav">
            <span className="atd-brand">Atelier</span>
            <span className="atd-meta">{CLIENT} · {EVENT_DATE}</span>
            <a href="#" className="atd-dl">Download ↓</a>
          </nav>

          <section className="atd-hero">
            <div className="atd-eyebrow">A private collection</div>
            <h1 className="atd-h1">Elena <em>&amp; Marcus</em></h1>
            <p className="atd-sub">Your gallery from the day — photographs in the moments they happened.</p>
            <div className="atd-info">
              <div><div className="v">{ALL_PHOTOS.length}</div><div className="l">Photographs</div></div>
              <div><div className="v">{SECTIONS.length}</div><div className="l">Chapters</div></div>
              <div><div className="v">{EVENT_DATE.split(" ")[0]}</div><div className="l">Month</div></div>
              <div><div className="v">{favs.size}</div><div className="l">Favourites</div></div>
            </div>
          </section>

          <div className="atd-bar">
            <div className="atd-tabs">
              <button className={`atd-tab${filter === "all" ? " on" : ""}`} onClick={() => setFilter("all")}>
                All · {ALL_PHOTOS.length}
              </button>
              <button className={`atd-tab${filter === "fav" ? " on" : ""}`} onClick={() => setFilter("fav")}>
                Favourites · {favs.size}
              </button>
            </div>
            <span className="atd-count">Selected <b>{sel.size}</b> / {visible.length}</span>
          </div>

          {groups.map((g, gi) => (
            <section key={g.id} className="atd-sect">
              <div className="atd-sect-head">
                <span className="atd-sect-no">{String(gi + 1).padStart(2, "0")}</span>
                <h2 className="atd-sect-title">{g.label}</h2>
                <span className="atd-sect-n">{g.items.length} photographs</span>
              </div>
              <div className="atd-grid">
                {g.items.map((p, idx) => {
                  const isFav = favs.has(p.id);
                  const isSel = sel.has(p.id);
                  return (
                    <div
                      key={p.id}
                      className={`atd-cell${isFav ? " fav" : ""}${isSel ? " sel" : ""}`}
                      onClick={() => setLightbox({ photos: g.items, index: idx })}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://picsum.photos/seed/${p.seed}/800/1000`} alt="" loading="lazy" />
                      <div className="atd-veil" />
                      <div className="atd-ctrl">
                        <button
                          className={`atd-ibtn${isFav ? " on" : ""}`}
                          onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }}
                          aria-label="Favourite"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                          </svg>
                        </button>
                        <button
                          className={`atd-ibtn${isSel ? " on" : ""}`}
                          onClick={(e) => { e.stopPropagation(); toggleSel(p.id); }}
                          aria-label="Select"
                        >
                          {isSel
                            ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="1"/></svg>
                          }
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          <footer className="atd-foot">
            <div>
              <div className="atd-foot-brand">Atelier</div>
              <div className="atd-foot-mono" style={{ marginTop: 6 }}>© {EVENT_DATE.split(" ").pop()} · For private use</div>
            </div>
            <div className="atd-foot-mono">{ALL_PHOTOS.length} photographs · {SECTIONS.length} chapters</div>
          </footer>
        </>
      )}

      {/* ── Floating selection bar ───────────────────────────────── */}
      {unlocked && sel.size > 0 && (
        <div className="atd-floater">
          <span className="label">{sel.size} selected</span>
          <button className="act" onClick={clearSel}>Clear</button>
          <button className="act">Download ↓</button>
        </div>
      )}

      {/* ── Lightbox ────────────────────────────────────────────── */}
      {lightbox && lightbox.photos[lightbox.index] && (
        <div
          className="atd-lb"
          onClick={(e) => { if (e.target === e.currentTarget) setLightbox(null); }}
          onTouchStart={(e) => { if (e.touches[0]) lbTouchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const t = e.changedTouches[0]; if (!t) return;
            const dx = lbTouchX.current - t.clientX;
            if (Math.abs(dx) > 40) {
              if (dx > 0) setLightbox((l) => l && ({ ...l, index: (l.index + 1) % l.photos.length }));
              else        setLightbox((l) => l && ({ ...l, index: (l.index - 1 + l.photos.length) % l.photos.length }));
            }
          }}
        >
          <div className="atd-lb-top">
            <button onClick={() => setLightbox(null)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Close
            </button>
            <span style={{ fontFamily: F.mono, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
              {String(lightbox.index + 1).padStart(2, "0")} / {String(lightbox.photos.length).padStart(2, "0")}
            </span>
            <button style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", padding: "5px 12px", fontFamily: F.mono, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", color: "rgba(255,255,255,0.65)" }}>
              ↓ Save
            </button>
          </div>

          {lightbox.index > 0 && (
            <button className="atd-lb-nav prev" onClick={() => setLightbox((l) => l && ({ ...l, index: l.index - 1 }))}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </button>
          )}
          {lightbox.index < lightbox.photos.length - 1 && (
            <button className="atd-lb-nav next" onClick={() => setLightbox((l) => l && ({ ...l, index: l.index + 1 }))}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://picsum.photos/seed/${lightbox.photos[lightbox.index]!.seed}/1600/2000`} alt="" />

          <div className="atd-lb-bot">
            <div className="cap">{lightbox.photos[lightbox.index]!.sectionLabel}</div>
            <div className="num">← → to navigate</div>
          </div>
        </div>
      )}
    </div>
  );
}
