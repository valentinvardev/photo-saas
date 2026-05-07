"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ATLAS_U, ATLAS_DELIVERY, ATLAS_RATIOS } from "~/lib/atlas/data";

type LbItem = { chapter: string; key: string; photoId: string; idx: number; list: { key: string; photoId: string }[] };

export default function AtlasDeliveryPage() {
  const D = ATLAS_DELIVERY;
  const [stage,    setStage]    = useState<"lock" | "curtain" | "gallery">("lock");
  const [pwd,      setPwd]      = useState("");
  const [shake,    setShake]    = useState(false);
  const [favs,     setFavs]     = useState<Set<string>>(new Set());
  const [filter,   setFilter]   = useState<"all" | "favs">("all");
  const [scrolled, setScrolled] = useState(false);
  const [lightbox, setLightbox] = useState<LbItem | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useMemo(() => {
    const flat: { id: string; photoId: string; chapter: string }[] = [];
    D.chapters.forEach((c) => c.photos.forEach((id, i) => flat.push({ id: `${c.id}-${i}`, photoId: id, chapter: c.label })));
    return flat;
  }, [D]);

  function tryUnlock(e: React.FormEvent) {
    e.preventDefault();
    /* Demo gate — any non-empty input unlocks. */
    if (!pwd.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    setStage("curtain");
    setTimeout(() => setStage("gallery"), 600);
  }

  function toggleFav(id: string) {
    setFavs((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  useEffect(() => {
    if (stage !== "gallery") return;
    const el = galleryRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > window.innerHeight * 0.4);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [stage]);

  return (
    <div className="atd-root">
      <style>{ATD_CSS}</style>
      <div className="atd-stripe" />

      {stage === "lock" && (
        <div className={`atd-lock ${shake ? "is-shake" : ""}`}>
          <div className="atd-lock-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ATLAS_U(D.cover, 2000)} alt="" />
            <div className="atd-lock-bg-tint" />
          </div>
          <header className="atd-lock-top">
            <div className="atd-lock-mark">
              <span className="at-mark invert">a</span>
              <span style={{ marginLeft: 10, fontFamily: "var(--at-mono)", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase" }}>Atlas Studio</span>
            </div>
            <div className="atd-lock-meta at-mono">private gallery · expires in 30 days</div>
          </header>

          <div className="atd-lock-card">
            <span className="at-mono atd-lock-eye">A delivery for —</span>
            <h1 className="atd-lock-title">
              <span style={{ fontFamily: "var(--at-display)", fontStyle: "italic", fontWeight: 400 }}>Seraphine</span>
              <span style={{ opacity: 0.55 }}>&amp;</span>
              <span style={{ fontFamily: "var(--at-display)", fontStyle: "italic", fontWeight: 400 }}>Theo</span>
            </h1>
            <div className="atd-lock-line at-mono">
              {D.date} <span className="atd-lock-dot">·</span> {D.location} <span className="atd-lock-dot">·</span> {D.count} photographs
            </div>
            <form className="atd-lock-form" onSubmit={tryUnlock}>
              <label className="at-mono" htmlFor="atd-pwd">Passphrase</label>
              <div className="atd-lock-input">
                <input id="atd-pwd" type="text" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="enter passphrase" spellCheck={false} autoComplete="off" />
                <button type="submit" className="atd-lock-go">
                  <span>Open</span>
                  <span className="atd-lock-arrow">→</span>
                </button>
              </div>
              <p className="atd-lock-hint at-mono">try: <em style={{ fontFamily: "var(--at-display)" }}>marais</em></p>
            </form>
          </div>

          <footer className="atd-lock-foot at-mono">
            <span>built with <span style={{ color: "var(--at-accent)" }}>FRAME</span></span>
            <span>contact: hello@atlas.studio</span>
          </footer>
        </div>
      )}

      {stage === "curtain" && <div className="atd-curtain" />}

      {stage === "gallery" && (
        <div className="atd-gallery" ref={galleryRef}>
          <header className="atd-hero">
            <div className="atd-hero-img at-imgwrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ATLAS_U(D.cover, 2400)} alt="" />
              <div className="atd-hero-tint" />
            </div>
            <div className="atd-hero-mark">
              <span className="at-mark invert">a</span>
              <span style={{ marginLeft: 10, fontFamily: "var(--at-mono)", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "#fff" }}>Atlas Studio</span>
            </div>
            <div className="atd-hero-block">
              <span className="at-mono" style={{ color: "rgba(255,255,255,.7)" }}>(your gallery)</span>
              <h1 className="atd-hero-title">
                <span style={{ fontFamily: "var(--at-display)", fontStyle: "italic", fontWeight: 400 }}>Marais —</span>
                <span style={{ display: "block", fontFamily: "var(--at-display)", fontWeight: 500 }}>A summer wedding.</span>
              </h1>
              <div className="atd-hero-meta at-mono">
                {D.date} <span style={{ opacity: 0.5, margin: "0 10px" }}>·</span> {D.location} <span style={{ opacity: 0.5, margin: "0 10px" }}>·</span> {D.count} photographs
              </div>
            </div>
          </header>

          <section className="atd-cta">
            <div>
              <span className="at-mono" style={{ color: "var(--at-muted)" }}>(welcome)</span>
              <p className="atd-cta-lede">
                Seraphine, Theo — <em style={{ fontFamily: "var(--at-display)" }}>here it is.</em>
                <br />One hundred and forty-two from the day, organised in four chapters. Take your time. Favourite the ones you love; we&rsquo;ll work from there.
              </p>
            </div>
            <div className="atd-cta-actions">
              <button className="atd-btn atd-btn-primary"><span>Download all</span><span style={{ opacity: 0.6, marginLeft: 10 }}>2.1 GB · zip</span></button>
              <button className="atd-btn atd-btn-ghost">Share with family</button>
            </div>
          </section>

          <div className={`atd-toolbar ${scrolled ? "is-scrolled" : ""}`}>
            <div className="atd-pills">
              <button className={`atd-pill ${filter === "all" ? "is-active" : ""}`} onClick={() => setFilter("all")}>All <span className="atd-pill-count">{D.count}</span></button>
              <button className={`atd-pill ${filter === "favs" ? "is-active" : ""}`} onClick={() => setFilter("favs")}>
                <svg width="11" height="11" viewBox="0 0 24 24" style={{ marginRight: 6 }}><path d="M12 21s-7-4.5-9-9 1-9 5-9 4 3 4 3 0-3 4-3 7 4 5 9-9 9-9 9z" fill="currentColor"/></svg>
                Favorites <span className="atd-pill-count">{favs.size}</span>
              </button>
            </div>
            <div className="atd-tools">
              <span className="at-mono atd-tools-meta">{filter === "favs" ? favs.size : D.count} shown</span>
              <button className="atd-tool-btn">Select all</button>
              <button className="atd-tool-btn atd-tool-primary">↓ Download selection</button>
            </div>
          </div>

          {D.chapters.map((ch) => {
            const visible = ch.photos
              .map((id, i) => ({ key: `${ch.id}-${i}`, photoId: id }))
              .filter((p) => filter !== "favs" || favs.has(p.key));
            if (visible.length === 0 && filter === "favs") return null;
            return (
              <section key={ch.id} className="atd-chapter">
                <div className="atd-chapter-head">
                  <span className="at-mono atd-ch-no">{ch.no}</span>
                  <h2 className="atd-ch-title">{ch.label}</h2>
                  <span className="at-mono atd-ch-count">{ch.photos.length} photos</span>
                  <em className="atd-ch-note" style={{ fontFamily: "var(--at-display)" }}>{ch.note}</em>
                </div>
                <div className="atd-grid atd-grid-masonry">
                  {visible.map((p, i) => {
                    const ratio = ATLAS_RATIOS[p.photoId] || 4 / 5;
                    return (
                      <figure
                        key={p.key}
                        className={`atd-cell ${favs.has(p.key) ? "is-fav" : ""}`}
                        style={{ aspectRatio: ratio }}
                        onClick={() => setLightbox({ chapter: ch.label, key: p.key, photoId: p.photoId, idx: i, list: visible })}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ATLAS_U(p.photoId, 900)} alt="" loading="lazy" />
                        <div className="atd-cell-overlay">
                          <span className="at-mono atd-cell-no">{String(i + 1).padStart(3, "0")}</span>
                          <button className="atd-fav" aria-label="favorite" onClick={(e) => { e.stopPropagation(); toggleFav(p.key); }}>
                            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9-9 1-9 5-9 4 3 4 3 0-3 4-3 7 4 5 9-9 9-9 9z" fill={favs.has(p.key) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6"/></svg>
                          </button>
                        </div>
                      </figure>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <footer className="atd-foot">
            <div className="atd-foot-mark" style={{ fontFamily: "var(--at-display)", fontStyle: "italic", fontSize: "clamp(60px, 13vw, 160px)", letterSpacing: "-.04em", lineHeight: 0.9 }}>thank you.</div>
            <div className="atd-foot-meta">
              <div><div className="at-mono" style={{ color: "var(--at-muted)" }}>delivered</div><div>{D.date}</div></div>
              <div><div className="at-mono" style={{ color: "var(--at-muted)" }}>expires</div><div>July 14, 2025</div></div>
              <div><div className="at-mono" style={{ color: "var(--at-muted)" }}>photographer</div><div>Atlas Studio</div></div>
              <div><div className="at-mono" style={{ color: "var(--at-muted)" }}>need help?</div><div>hello@atlas.studio</div></div>
            </div>
          </footer>

          {favs.size > 0 && (
            <div className="atd-mobile-floater">
              <span><strong>{favs.size}</strong> selected</span>
              <button onClick={() => setFavs(new Set())}>Clear</button>
              <button className="atd-btn atd-btn-primary atd-btn-sm">↓ Download</button>
            </div>
          )}
        </div>
      )}

      {lightbox && (
        <Lightbox
          item={lightbox}
          favs={favs}
          onToggleFav={toggleFav}
          onClose={() => setLightbox(null)}
          onNext={() => setLightbox((l) => {
            if (!l) return null;
            const i = l.list.findIndex((x) => x.key === l.key);
            const ni = (i + 1) % l.list.length;
            const next = l.list[ni]!;
            return { ...l, key: next.key, photoId: next.photoId, idx: ni };
          })}
          onPrev={() => setLightbox((l) => {
            if (!l) return null;
            const i = l.list.findIndex((x) => x.key === l.key);
            const ni = (i - 1 + l.list.length) % l.list.length;
            const prev = l.list[ni]!;
            return { ...l, key: prev.key, photoId: prev.photoId, idx: ni };
          })}
        />
      )}
    </div>
  );
}

function Lightbox({ item, favs, onToggleFav, onClose, onNext, onPrev }: {
  item: LbItem; favs: Set<string>; onToggleFav: (k: string) => void;
  onClose: () => void; onNext: () => void; onPrev: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "f" || e.key === "F") onToggleFav(item.key);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, onNext, onPrev, onClose, onToggleFav]);

  const isFav = favs.has(item.key);
  return (
    <div className="atd-lb" role="dialog" aria-modal="true">
      <div className="atd-lb-bg" onClick={onClose} />
      <div className="atd-lb-frame">
        <header className="atd-lb-head">
          <span className="at-mono">{String(item.idx + 1).padStart(3, "0")} / {String(item.list.length).padStart(3, "0")} <span style={{ opacity: 0.5, margin: "0 8px" }}>·</span> {item.chapter}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="atd-lb-btn" onClick={() => onToggleFav(item.key)}>
              <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9-9 1-9 5-9 4 3 4 3 0-3 4-3 7 4 5 9-9 9-9 9z" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6"/></svg>
              <span>{isFav ? "Favorited" : "Favorite"} <span style={{ opacity: 0.5 }}>· F</span></span>
            </button>
            <button className="atd-lb-btn">↓ <span>Download</span></button>
            <button className="atd-lb-btn atd-lb-x" onClick={onClose}>✕</button>
          </div>
        </header>
        <div className="atd-lb-stage">
          <button className="atd-lb-nav atd-lb-prev" onClick={onPrev} aria-label="previous">←</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ATLAS_U(item.photoId, 1800)} alt="" />
          <button className="atd-lb-nav atd-lb-next" onClick={onNext} aria-label="next">→</button>
        </div>
      </div>
    </div>
  );
}

const ATD_CSS = `
.atd-root{ font-family:var(--at-sans); color:var(--at-fg); background:var(--at-bg) }
.atd-root .at-mono{ font-family:var(--at-mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase }
.atd-root .at-imgwrap{ position:relative; overflow:hidden; background:var(--at-raised) }
.atd-root .at-imgwrap img{ width:100%; height:100%; object-fit:cover }
.atd-root .at-mark{ display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; background:var(--at-fg); color:var(--at-bg); font-family:var(--at-display); font-style:italic; font-weight:500 }
.atd-root .at-mark.invert{ background:var(--at-bg); color:var(--at-fg) }
.atd-stripe{ position:fixed; top:0; left:0; right:0; height:3px; background:var(--at-accent); z-index:60 }

.atd-lock{ position:relative; min-height:100vh; min-height:100dvh; width:100%; display:grid; grid-template-rows: auto 1fr auto; align-items:stretch; color:#EFEAE0; isolation:isolate; padding: 22px clamp(20px,4vw,56px) }
.atd-lock.is-shake{ animation: atd-shake .55s var(--at-curtain) }
@keyframes atd-shake{ 10%,90%{transform:translateX(-2px)} 20%,80%{transform:translateX(4px)} 30%,50%,70%{transform:translateX(-8px)} 40%,60%{transform:translateX(8px)} }
.atd-lock-bg{ position:absolute; inset:0; z-index:-1; overflow:hidden }
.atd-lock-bg img{ width:100%; height:100%; object-fit:cover; filter: saturate(.85) contrast(1.02) }
.atd-lock-bg-tint{ position:absolute; inset:0; background: radial-gradient(120% 80% at 50% 50%, rgba(0,0,0,.2), rgba(0,0,0,.7)) }

.atd-lock-top{ display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap }
.atd-lock-mark{ display:flex; align-items:center }
.atd-lock-meta{ color:rgba(239,234,224,.7); font-size:11px }

.atd-lock-card{ align-self:center; justify-self:center; width:min(560px, 92vw); text-align:center; display:flex; flex-direction:column; gap:14px; padding:48px 32px; background:rgba(14,14,14,.5); backdrop-filter:blur(28px) saturate(140%); -webkit-backdrop-filter:blur(28px) saturate(140%); border:.5px solid rgba(255,255,255,.18) }
.atd-lock-eye{ color:rgba(239,234,224,.6); margin-bottom:6px }
.atd-lock-title{ margin:0; font-size: clamp(40px, 7vw, 88px); line-height:.95; letter-spacing:-.04em; display:flex; gap:.18em; justify-content:center; flex-wrap:wrap }
.atd-lock-line{ color:rgba(239,234,224,.85); font-size:11px; margin-top:2px }
.atd-lock-dot{ color:var(--at-accent); margin:0 8px }

.atd-lock-form{ display:flex; flex-direction:column; gap:8px; margin-top:24px; align-items:stretch; text-align:left }
.atd-lock-form > label{ color:rgba(239,234,224,.6) }
.atd-lock-input{ display:flex; align-items:stretch; border:1px solid rgba(239,234,224,.3); background:rgba(0,0,0,.25) }
.atd-lock-input input{ flex:1; appearance:none; background:transparent; border:0; padding:18px 20px; color:#EFEAE0; font-family:var(--at-display); font-size:22px; letter-spacing:-.01em; outline:none; min-width:0 }
.atd-lock-input input::placeholder{ color:rgba(239,234,224,.4); font-style:italic }
.atd-lock-go{ appearance:none; border:0; padding:0 24px; background:var(--at-accent); color:#fff; font-family:var(--at-mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; display:flex; align-items:center; gap:10px; cursor:pointer; transition:background .25s ease, gap .25s ease }
.atd-lock-go:hover{ background:#0E22DD; gap:14px }
.atd-lock-arrow{ font-family:var(--at-display); font-size:18px }
.atd-lock-hint{ color:rgba(239,234,224,.4); margin:8px 0 0 }
.atd-lock-foot{ display:flex; justify-content:space-between; color:rgba(239,234,224,.5); font-size:10px; flex-wrap:wrap; gap:8px }
@media (max-width:520px){ .atd-lock-card{ padding:32px 22px } }

.atd-curtain{ position:fixed; inset:0; z-index:120; background:var(--at-accent); animation: atd-curtain 1.1s var(--at-curtain) forwards; transform-origin:left center }
@keyframes atd-curtain{ 0%{ clip-path: inset(0 100% 0 0) } 45%{ clip-path: inset(0 0 0 0) } 100%{ clip-path: inset(0 0 0 100%) } }

.atd-gallery{ position:relative; min-height:100vh; animation: atd-fade .8s var(--at-reveal) .3s both }
@keyframes atd-fade{ from{opacity:0;transform:translateY(10px)} to{opacity:1; transform:none} }

.atd-hero{ position:relative; height: min(70dvh, 720px); width:100%; overflow:hidden; isolation:isolate; color:#fff }
.atd-hero-img{ position:absolute; inset:0; z-index:-1 }
.atd-hero-tint{ position:absolute; inset:0; background: linear-gradient(180deg, rgba(0,0,0,.4) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,.55) 100%) }
.atd-hero-mark{ position:absolute; top:22px; left:clamp(20px,4vw,56px); display:flex; align-items:center }
.atd-hero-block{ position:absolute; left:clamp(20px,4vw,56px); bottom:clamp(28px,5vh,56px); right:clamp(20px,4vw,56px); display:flex; flex-direction:column; gap:18px }
.atd-hero-title{ margin:0; font-family:var(--at-display); font-size:clamp(40px, 8vw, 128px); line-height:.92; letter-spacing:-.045em }
.atd-hero-meta{ color:rgba(255,255,255,.85); font-size:11px }

.atd-cta{ display:grid; grid-template-columns: 1fr auto; gap:32px; align-items:end; padding: clamp(40px,6vh,72px) clamp(20px,4vw,56px); border-bottom:1px solid var(--at-line) }
.atd-cta-lede{ margin:14px 0 0; font-family:var(--at-display); font-weight:400; font-size:clamp(20px,2.6vw,32px); line-height:1.25; letter-spacing:-.02em; max-width:60ch }
.atd-cta-actions{ display:flex; gap:10px; flex-wrap:wrap }
.atd-btn{ appearance:none; border:0; cursor:pointer; font-family:var(--at-mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; padding:18px 22px; transition:transform .25s var(--at-reveal), background .25s ease, color .25s ease }
.atd-btn-primary{ background:var(--at-fg); color:var(--at-bg) }
.atd-btn-primary:hover{ background:var(--at-accent); color:#fff }
.atd-btn-ghost{ background:transparent; color:var(--at-fg); border:1px solid var(--at-line) }
.atd-btn-ghost:hover{ border-color:var(--at-fg) }
.atd-btn-sm{ padding:10px 14px; font-size:10px }
@media (max-width:760px){ .atd-cta{ grid-template-columns:1fr } }

.atd-toolbar{ position:sticky; top:3px; z-index:30; display:flex; justify-content:space-between; align-items:center; gap:18px; padding: 14px clamp(20px,4vw,56px); background:var(--at-bg); border-bottom:1px solid transparent; transition: box-shadow .3s ease, border-color .3s ease; flex-wrap:wrap }
.atd-toolbar.is-scrolled{ border-color:var(--at-line); box-shadow:0 8px 30px rgba(14,14,14,.05) }
.atd-pills{ display:flex; gap:6px; padding:4px; background:var(--at-raised); border-radius:999px }
.atd-pill{ appearance:none; border:0; background:transparent; cursor:pointer; display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:999px; font-family:var(--at-mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--at-muted); transition:background .25s ease, color .25s ease }
.atd-pill.is-active{ background:var(--at-fg); color:var(--at-bg) }
.atd-pill-count{ opacity:.65; margin-left:4px }
.atd-tools{ display:flex; align-items:center; gap:14px; flex-wrap:wrap }
.atd-tools-meta{ color:var(--at-muted) }
.atd-tool-btn{ appearance:none; border:0; background:transparent; cursor:pointer; font-family:var(--at-mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--at-fg); padding:8px 12px; border-radius:999px; transition:background .25s ease }
.atd-tool-btn:hover{ background:var(--at-raised) }
.atd-tool-primary{ background:var(--at-accent); color:#fff }
.atd-tool-primary:hover{ background:#0E22DD; color:#fff }
@media (max-width:760px){ .atd-tools .atd-tool-btn:not(.atd-tool-primary){ display:none } }

.atd-chapter{ padding: clamp(40px,6vh,80px) clamp(20px,4vw,56px) }
.atd-chapter-head{ display:grid; grid-template-columns: auto auto 1fr auto; align-items:end; gap:24px; padding-bottom:24px; margin-bottom:24px; border-bottom:1px solid var(--at-line) }
.atd-ch-no{ color:var(--at-accent) }
.atd-ch-title{ margin:0; font-family:var(--at-display); font-weight:500; font-size:clamp(28px,5vw,72px); letter-spacing:-.04em; line-height:1 }
.atd-ch-count{ color:var(--at-muted) }
.atd-ch-note{ grid-column: 1 / -1; max-width:60ch; color:var(--at-muted); font-size:clamp(14px,1.6vw,18px); margin-top:4px }
@media (max-width:760px){ .atd-chapter-head{ grid-template-columns: auto 1fr } .atd-ch-count{ grid-column: 1 / -1 } }

.atd-grid{ display:grid; gap: 14px }
.atd-grid-masonry{ column-count: 4; column-gap: 14px; display:block }
.atd-grid-masonry .atd-cell{ width:100%; break-inside:avoid; margin-bottom:14px; aspect-ratio: auto !important; display:block }
@media (max-width:1100px){ .atd-grid-masonry{ column-count:3 } }
@media (max-width:720px){ .atd-grid-masonry{ column-count:2 } }
@media (max-width:420px){ .atd-grid-masonry{ column-count:1 } }

.atd-cell{ position:relative; overflow:hidden; cursor:zoom-in; background:var(--at-raised); margin:0; transition: transform .35s var(--at-reveal) }
.atd-cell img{ width:100%; height:100%; object-fit:cover; display:block }
.atd-grid-masonry .atd-cell img{ height:auto }
.atd-cell-overlay{ position:absolute; inset:0; padding:10px; display:flex; justify-content:space-between; align-items:flex-start; pointer-events:none; opacity:0; transition: opacity .25s ease; background: linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,0) 40%, rgba(0,0,0,0) 60%, rgba(0,0,0,.45)); color:#fff }
.atd-cell:hover .atd-cell-overlay,.atd-cell.is-fav .atd-cell-overlay{ opacity:1 }
.atd-cell-no{ font-size:10px; letter-spacing:.08em; opacity:.85 }
.atd-fav{ appearance:none; border:0; background:rgba(0,0,0,.4); color:#fff; width:30px; height:30px; border-radius:999px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; pointer-events:auto; transition: background .2s ease, color .2s ease }
.atd-fav:hover{ background:rgba(0,0,0,.6) }
.atd-cell.is-fav .atd-fav{ background:var(--at-accent); color:#fff }
.atd-cell.is-fav { box-shadow: inset 0 0 0 2px var(--at-accent) }

.atd-foot{ background:var(--at-fg); color:var(--at-bg); padding: clamp(60px,10vh,120px) clamp(20px,4vw,56px) 28px }
.atd-foot-mark{ padding-bottom:36px; border-bottom:1px solid rgba(239,234,224,.18) }
.atd-foot-meta{ display:grid; grid-template-columns:repeat(4,1fr); gap:24px; padding-top:36px; font-size:14px }
.atd-foot-meta > div > div:first-child{ margin-bottom:6px }
@media (max-width:760px){ .atd-foot-meta{ grid-template-columns:repeat(2,1fr) } }

.atd-mobile-floater{ position:fixed; left:14px; right:14px; bottom: calc(14px + env(safe-area-inset-bottom)); z-index:50; display:none; align-items:center; gap:14px; padding:12px 14px; background:var(--at-fg); color:var(--at-bg); border-radius:999px; font-family:var(--at-mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase; box-shadow:0 12px 30px rgba(0,0,0,.25) }
.atd-mobile-floater button{ appearance:none; border:0; background:transparent; color:inherit; cursor:pointer; padding:6px 10px }
.atd-mobile-floater .atd-btn{ margin-left:auto }
@media (max-width:760px){ .atd-mobile-floater{ display:flex } }

.atd-lb{ position:fixed; inset:0; z-index:200; display:flex; align-items:center; justify-content:center }
.atd-lb-bg{ position:absolute; inset:0; background:rgba(11,11,11,.96); animation: atd-fade-in .25s ease }
@keyframes atd-fade-in{ from{opacity:0} to{opacity:1} }
.atd-lb-frame{ position:relative; z-index:1; width:100%; height:100%; display:flex; flex-direction:column; color:#EFEAE0 }
.atd-lb-head{ display:flex; justify-content:space-between; align-items:center; padding:18px 24px; border-bottom:1px solid rgba(239,234,224,.12); font-family:var(--at-mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase }
.atd-lb-btn{ display:inline-flex; align-items:center; gap:8px; appearance:none; border:1px solid rgba(239,234,224,.18); background:transparent; color:inherit; padding:8px 14px; cursor:pointer; transition:background .2s ease; font-family:var(--at-mono); font-size:10px; letter-spacing:.08em; text-transform:uppercase }
.atd-lb-btn:hover{ background:rgba(239,234,224,.08) }
.atd-lb-x{ width:36px; padding:0; justify-content:center }
.atd-lb-stage{ flex:1; position:relative; display:flex; align-items:center; justify-content:center; padding:40px; min-height:0 }
.atd-lb-stage img{ max-width:100%; max-height:100%; object-fit:contain }
.atd-lb-nav{ appearance:none; background:transparent; border:1px solid rgba(239,234,224,.18); color:inherit; width:48px; height:48px; border-radius:999px; cursor:pointer; position:absolute; top:50%; transform:translateY(-50%); font-family:var(--at-display); font-size:22px; transition:background .2s ease }
.atd-lb-nav:hover{ background:rgba(239,234,224,.08) }
.atd-lb-prev{ left:24px } .atd-lb-next{ right:24px }
`;
