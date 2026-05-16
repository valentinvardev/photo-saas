"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* ── Tokens ── */
const T = {
  bg:     "#FAFAFA",
  fg:     "#111111",
  muted:  "#888888",
  line:   "#E8E8E8",
  raised: "#FFFFFF",
  ink:    "#111111",
};
const F = {
  serif: "var(--mn-serif), 'Cormorant Garamond', serif",
  sans:  "var(--mn-sans), 'DM Sans', system-ui, sans-serif",
  mono:  "var(--mn-mono), 'Space Mono', ui-monospace, monospace",
};

/* ── Seed data ── */
const CLIENT     = "Halberg & Park";
const EVENT_DATE = "April 2024";
const PHOTOGRAPHER = "Studio Minimal";
const SECTIONS = [
  { id: "preparations", label: "Preparations",  photos: [10, 71, 82, 93, 100, 111] },
  { id: "ceremony",     label: "Ceremony",      photos: [144, 155, 166, 177, 188, 199, 210] },
  { id: "portraits",    label: "Portraits",     photos: [22, 33, 44, 55] },
  { id: "reception",    label: "Reception",     photos: [232, 243, 254, 265, 276, 287, 298, 309] },
];
const ALL_PHOTOS = SECTIONS.flatMap((s) =>
  s.photos.map((seed) => ({ id: `${s.id}-${seed}`, seed, section: s.id, sectionLabel: s.label }))
);
const COVER_SEED = 401;
type Photo = (typeof ALL_PHOTOS)[number];

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════ */

export default function MinimalDeliveryPage() {
  const [unlocked,   setUnlocked]   = useState(false);
  const [pwd,        setPwd]        = useState("");
  const [shake,      setShake]      = useState(false);

  const [filter,     setFilter]     = useState<"all" | "fav">("all");
  const [favs,       setFavs]       = useState<Set<string>>(new Set());
  const [sel,        setSel]        = useState<Set<string>>(new Set());
  const [lightbox,   setLightbox]   = useState<{ photos: Photo[]; index: number } | null>(null);
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
    if (!pwd.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 420);
      return;
    }
    setUnlocked(true);
  }
  function toggleFav(id: string) { setFavs((f) => { const n = new Set(f); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleSel(id: string) { setSel ((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function selectAllVisible() {
    if (sel.size === visible.length) setSel(new Set());
    else setSel(new Set(visible.map((p) => p.id)));
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!lightbox) return;
      if (e.key === "Escape")     setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((l) => l && ({ ...l, index: (l.index + 1) % l.photos.length }));
      if (e.key === "ArrowLeft")  setLightbox((l) => l && ({ ...l, index: (l.index - 1 + l.photos.length) % l.photos.length }));
      if (e.key.toLowerCase() === "f") {
        const cur = lightbox.photos[lightbox.index];
        if (cur) toggleFav(cur.id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <div style={{ background: T.bg, color: T.fg, minHeight: "100dvh", fontFamily: F.sans, position: "relative", overflow: "hidden" }}>
      <style>{`
        .mn-link{text-decoration:none;color:inherit}
        .mn-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 20px;font-family:${F.mono};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;border:1px solid ${T.line};background:${T.raised};color:${T.fg};cursor:pointer;transition:background .25s ease,color .25s ease,border-color .25s ease}
        .mn-btn:hover{background:${T.fg};color:${T.bg};border-color:${T.fg}}
        .mn-btn-primary{background:${T.fg};color:${T.bg};border-color:${T.fg}}
        .mn-btn-primary:hover{background:transparent;color:${T.fg}}
        .mn-btn-ghost{background:transparent;border-color:transparent;color:${T.muted}}
        .mn-btn-ghost:hover{color:${T.fg};background:transparent;border-color:transparent}

        @keyframes mnShake{10%,90%{transform:translateX(-1px)}20%,80%{transform:translateX(2px)}30%,50%,70%{transform:translateX(-4px)}40%,60%{transform:translateX(4px)}}
        @keyframes mnFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

        .mn-gate{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${T.bg};z-index:20;padding:48px}
        .mn-gate-inner{display:flex;flex-direction:column;align-items:center;gap:36px;max-width:380px;width:100%;text-align:center}
        .mn-mark{width:64px;height:64px;border:1px solid ${T.line};display:flex;align-items:center;justify-content:center;font-family:${F.serif};font-size:24px;letter-spacing:-0.02em}
        .mn-mark em{font-style:italic}
        .mn-gate h1{font-family:${F.serif};font-size:64px;line-height:0.95;letter-spacing:-0.02em;font-weight:400;margin:0}
        .mn-gate h1 em{font-style:italic;color:${T.muted}}
        .mn-meta{font-family:${F.mono};font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:${T.muted}}
        .mn-pwd-form{width:100%;display:flex;flex-direction:column;gap:12px}
        .mn-pwd{background:${T.raised};border:1px solid ${T.line};color:${T.fg};padding:14px 16px;font-family:${F.mono};font-size:13px;letter-spacing:0.06em;text-align:center;outline:none;transition:border-color .25s ease}
        .mn-pwd:focus{border-color:${T.fg}}
        .mn-pwd.shake{animation:mnShake .42s cubic-bezier(.36,.07,.19,.97);border-color:${T.fg}}

        .mn-stripe{height:1px;background:${T.line}}
        .mn-nav{display:flex;justify-content:space-between;align-items:center;padding:24px 32px;border-bottom:1px solid ${T.line};background:${T.raised};position:sticky;top:0;z-index:30;animation:mnFade .5s ease both}
        .mn-nav .brand{font-family:${F.serif};font-size:22px;letter-spacing:-0.02em;font-weight:500}
        .mn-nav .brand em{font-style:italic;color:${T.muted}}
        .mn-nav .meta{font-family:${F.mono};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${T.muted}}
        @media(max-width:680px){.mn-nav{padding:16px 20px}.mn-nav .meta{display:none}}

        .mn-hero{padding:96px 32px 64px;text-align:center;border-bottom:1px solid ${T.line};animation:mnFade .6s ease both}
        .mn-eyebrow{font-family:${F.mono};font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:${T.muted};margin-bottom:24px}
        .mn-hero h1{font-family:${F.serif};font-size:96px;line-height:0.95;letter-spacing:-0.025em;font-weight:400;margin:0 0 16px}
        .mn-hero h1 em{font-style:italic}
        .mn-hero .sub{font-family:${F.serif};font-size:18px;line-height:1.6;color:${T.muted};max-width:520px;margin:24px auto 0;font-style:italic}
        @media(max-width:680px){.mn-hero{padding:64px 20px 48px}.mn-hero h1{font-size:52px}}

        .mn-info{display:grid;grid-template-columns:repeat(4,1fr);max-width:880px;margin:48px auto 0;border-top:1px solid ${T.line};border-bottom:1px solid ${T.line}}
        .mn-info > div{padding:18px 0;border-right:1px solid ${T.line};text-align:center}
        .mn-info > div:last-child{border-right:0}
        .mn-info .v{font-family:${F.serif};font-size:22px;letter-spacing:-0.01em;line-height:1;font-weight:400}
        .mn-info .l{font-family:${F.mono};font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:${T.muted};margin-top:6px}
        @media(max-width:680px){.mn-info{grid-template-columns:repeat(2,1fr)}.mn-info > div:nth-child(2){border-right:0}.mn-info > div:nth-child(1),.mn-info > div:nth-child(2){border-bottom:1px solid ${T.line}}}

        .mn-toolbar{position:sticky;top:65px;z-index:20;background:${T.bg};border-bottom:1px solid ${T.line};padding:14px 32px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
        .mn-tabs{display:inline-flex;border:1px solid ${T.line};background:${T.raised};border-radius:0}
        .mn-tab{background:transparent;border:0;padding:8px 18px;font-family:${F.mono};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${T.muted};cursor:pointer;transition:color .25s ease,background .25s ease}
        .mn-tab.on{background:${T.fg};color:${T.bg}}
        .mn-tab:not(.on):hover{color:${T.fg}}
        .mn-tools{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
        .mn-counter{font-family:${F.mono};font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${T.muted}}
        .mn-counter b{color:${T.fg};font-weight:400}
        @media(max-width:680px){.mn-toolbar{padding:12px 20px;top:57px}}

        .mn-section{padding:48px 32px}
        .mn-section-head{display:flex;align-items:baseline;gap:14px;margin-bottom:24px}
        .mn-section-no{font-family:${F.mono};font-size:10px;letter-spacing:0.18em;color:${T.muted};text-transform:uppercase}
        .mn-section-title{font-family:${F.serif};font-size:36px;letter-spacing:-0.02em;line-height:1;font-weight:400}
        .mn-section-title em{font-style:italic;color:${T.muted}}
        .mn-section-line{flex:1;border:0;border-top:1px solid ${T.line}}
        .mn-section-count{font-family:${F.mono};font-size:10px;color:${T.muted}}

        .mn-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        @media(max-width:1100px){.mn-grid{grid-template-columns:repeat(3,1fr)}}
        @media(max-width:780px){.mn-grid{grid-template-columns:repeat(2,1fr)}}
        .mn-cell{position:relative;aspect-ratio:4/5;background:${T.raised};border:1px solid ${T.line};overflow:hidden;cursor:pointer;animation:mnFade .5s ease both}
        .mn-cell img{width:100%;height:100%;object-fit:cover;display:block}
        .mn-cell .controls{position:absolute;left:8px;right:8px;bottom:8px;display:flex;justify-content:space-between;align-items:center;opacity:0;transition:opacity .25s ease}
        .mn-cell:hover .controls,.mn-cell.has-fav .controls,.mn-cell.has-sel .controls{opacity:1}
        .mn-icon-btn{width:30px;height:30px;display:flex;align-items:center;justify-content:center;background:${T.raised};border:1px solid ${T.line};color:${T.fg};cursor:pointer;transition:background .2s ease,color .2s ease}
        .mn-icon-btn.on{background:${T.fg};color:${T.bg};border-color:${T.fg}}
        .mn-icon-btn:hover{background:${T.fg};color:${T.bg};border-color:${T.fg}}
        .mn-cell.has-sel{outline:2px solid ${T.fg};outline-offset:-2px}

        .mn-foot{padding:48px 32px;border-top:1px solid ${T.line};display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px}
        .mn-foot .mark{font-family:${F.serif};font-size:18px}
        .mn-foot .mark em{font-style:italic;color:${T.muted}}
        .mn-foot .mono{font-family:${F.mono};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${T.muted}}

        .mn-floater{position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:${T.fg};color:${T.bg};display:flex;gap:12px;align-items:center;padding:10px 14px 10px 18px;border-radius:999px;box-shadow:0 16px 48px rgba(0,0,0,0.18);z-index:40;animation:mnFade .25s ease both}
        .mn-floater .label{font-family:${F.mono};font-size:11px;letter-spacing:0.16em;text-transform:uppercase}
        .mn-floater .dl{background:${T.bg};color:${T.fg};border:0;padding:8px 14px;font-family:${F.mono};font-size:10px;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;border-radius:999px}

        .mn-lb{position:fixed;inset:0;background:rgba(20,20,20,0.94);z-index:60;display:flex;align-items:center;justify-content:center;animation:mnFade .25s ease both}
        .mn-lb img{max-width:88vw;max-height:82vh;object-fit:contain;background:${T.bg};box-shadow:0 30px 80px rgba(0,0,0,0.5)}
        .mn-lb-x{position:fixed;top:24px;right:32px;background:transparent;border:0;color:${T.bg};font-family:${F.mono};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;cursor:pointer}
        .mn-lb-arrow{position:fixed;top:50%;transform:translateY(-50%);width:48px;height:48px;background:transparent;border:1px solid rgba(255,255,255,0.4);color:${T.bg};font-family:${F.mono};font-size:14px;cursor:pointer;transition:background .2s ease,color .2s ease}
        .mn-lb-arrow:hover{background:${T.bg};color:${T.fg}}
        .mn-lb-arrow.l{left:24px}.mn-lb-arrow.r{right:24px}
        .mn-lb-meta{position:fixed;bottom:24px;left:0;right:0;display:flex;justify-content:space-between;padding:0 32px;color:${T.bg};flex-wrap:wrap;gap:8px}
        .mn-lb-meta .cap{font-family:${F.serif};font-style:italic;font-size:18px}
        .mn-lb-meta .num{font-family:${F.mono};font-size:11px;letter-spacing:0.16em;text-transform:uppercase}
      `}</style>

      {/* ── Gate ─────────────────────────────────────────── */}
      {!unlocked && (
        <div className="mn-gate">
          <div className="mn-gate-inner">
            <div className="mn-mark">M<em>n</em></div>
            <div>
              <div className="mn-meta" style={{ marginBottom: 18 }}>{PHOTOGRAPHER} · Client Gallery</div>
              <h1>{CLIENT.split(" & ")[0]} <em>&amp;</em> {CLIENT.split(" & ")[1]}</h1>
            </div>
            <div className="mn-meta">{EVENT_DATE} · {ALL_PHOTOS.length} photos</div>
            <form className="mn-pwd-form" onSubmit={tryUnlock}>
              <input
                className={`mn-pwd ${shake ? "shake" : ""}`}
                type="password"
                placeholder="Access code"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                autoFocus
              />
              <button type="submit" className="mn-btn mn-btn-primary" style={{ justifyContent: "center" }}>
                Open gallery
              </button>
            </form>
            <div className="mn-meta" style={{ marginTop: 8 }}>Private · Do not share</div>
          </div>
        </div>
      )}

      {/* ── Gallery ──────────────────────────────────────── */}
      {unlocked && (
        <>
          <div className="mn-stripe" />
          <header className="mn-nav">
            <a className="mn-link brand" href="#">Studio<em> Minimal</em></a>
            <span className="meta">{CLIENT} · {EVENT_DATE}</span>
          </header>

          <section className="mn-hero">
            <div className="mn-eyebrow">For your eyes only</div>
            <h1>{CLIENT.split(" & ")[0]}<br /><em>&amp; {CLIENT.split(" & ")[1]}</em></h1>
            <p className="sub">A small set of photographs from the day. Browse, favourite, and pick what you want printed.</p>
            <div className="mn-info">
              <div><div className="v">{ALL_PHOTOS.length}</div><div className="l">Photographs</div></div>
              <div><div className="v">{SECTIONS.length}</div><div className="l">Chapters</div></div>
              <div><div className="v">{EVENT_DATE.split(" ")[0]}</div><div className="l">Month</div></div>
              <div><div className="v">{favs.size}</div><div className="l">Favourites</div></div>
            </div>
          </section>

          <div className="mn-toolbar">
            <div className="mn-tabs">
              <button className={`mn-tab ${filter === "all" ? "on" : ""}`} onClick={() => setFilter("all")}>All · {ALL_PHOTOS.length}</button>
              <button className={`mn-tab ${filter === "fav" ? "on" : ""}`} onClick={() => setFilter("fav")}>Favourites · {favs.size}</button>
            </div>
            <div className="mn-tools">
              <span className="mn-counter">Selected <b>{sel.size}</b> / {visible.length}</span>
              <button className="mn-btn mn-btn-ghost" onClick={selectAllVisible}>{sel.size === visible.length && visible.length > 0 ? "Clear" : "Select all"}</button>
            </div>
          </div>

          {groups.map((g, gi) => (
            <section key={g.id} className="mn-section">
              <div className="mn-section-head">
                <span className="mn-section-no">{String(gi + 1).padStart(2, "0")}</span>
                <h2 className="mn-section-title">{g.label.split(" ")[0]} <em>{g.label.split(" ").slice(1).join(" ")}</em></h2>
                <hr className="mn-section-line" />
                <span className="mn-section-count">{g.items.length} photographs</span>
              </div>
              <div className="mn-grid">
                {g.items.map((p, idx) => {
                  const isFav = favs.has(p.id);
                  const isSel = sel.has(p.id);
                  return (
                    <div
                      key={p.id}
                      className={`mn-cell ${isFav ? "has-fav" : ""} ${isSel ? "has-sel" : ""}`}
                      onClick={() => setLightbox({ photos: g.items, index: idx })}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://picsum.photos/seed/${p.seed}/800/1000`} alt="" loading="lazy" />
                      <div className="controls">
                        <button
                          className={`mn-icon-btn ${isFav ? "on" : ""}`}
                          onClick={(e) => { e.stopPropagation(); toggleFav(p.id); }}
                          aria-label="Favourite"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                          </svg>
                        </button>
                        <button
                          className={`mn-icon-btn ${isSel ? "on" : ""}`}
                          onClick={(e) => { e.stopPropagation(); toggleSel(p.id); }}
                          aria-label="Select"
                        >
                          {isSel ? (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          ) : (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/></svg>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          <footer className="mn-foot">
            <div className="mark">Studio<em> Minimal</em></div>
            <div className="mono">© {EVENT_DATE.split(" ").pop()} · For private use</div>
            <div className="mono">{ALL_PHOTOS.length} photographs · {SECTIONS.length} chapters</div>
          </footer>
        </>
      )}

      {/* ── Floating selection bar ───────────────────────── */}
      {unlocked && sel.size > 0 && (
        <div className="mn-floater">
          <span className="label">{sel.size} selected</span>
          <button className="dl" onClick={() => setSel(new Set())}>Clear</button>
          <button className="dl">Download ↓</button>
        </div>
      )}

      {/* ── Lightbox ─────────────────────────────────────── */}
      {lightbox && lightbox.photos[lightbox.index] && (
        <div className="mn-lb"
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
          <button className="mn-lb-x" onClick={() => setLightbox(null)}>Close ✕</button>
          <button className="mn-lb-arrow l" onClick={() => setLightbox((l) => l && ({ ...l, index: (l.index - 1 + l.photos.length) % l.photos.length }))}>←</button>
          <button className="mn-lb-arrow r" onClick={() => setLightbox((l) => l && ({ ...l, index: (l.index + 1) % l.photos.length }))}>→</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://picsum.photos/seed/${lightbox.photos[lightbox.index]!.seed}/1600/2000`} alt="" />
          <div className="mn-lb-meta">
            <div className="num">{String(lightbox.index + 1).padStart(2, "0")} / {String(lightbox.photos.length).padStart(2, "0")}</div>
            <div className="cap">{lightbox.photos[lightbox.index]!.sectionLabel}</div>
            <div className="num">Press F to favourite</div>
          </div>
        </div>
      )}

      {/* keep the placeholder cover seed referenced so unused import warnings don't appear in extracted builds */}
      <span style={{ display: "none" }} aria-hidden>{COVER_SEED}</span>
    </div>
  );
}
