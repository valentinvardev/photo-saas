"use client";

import { useEffect, useMemo, useState } from "react";
import { VT_U, VAULT_BRAND, VAULT_CATEGORIES } from "~/lib/vault/data";

/* The first wedding folder of Vault's archive doubles as the demo client gallery. */
const FOLDER = VAULT_CATEGORIES[0]!.folders[0]!;
const ALL_FOLDERS = VAULT_CATEGORIES.flatMap((c) => c.folders.map((f) => ({ ...f, catName: c.name })));
const DELIVERY = {
  ref:        "VLT-2025-0614",
  client:     "Seraphine & Theo",
  date:       "Jun 14, 2025",
  location:   "Paris, FR",
  expiryDays: 60,
  cover:      FOLDER.photos[0]!,
};

type LbItem = { photoId: string; idx: number; chapter: string; chapterNo: string };

export default function VaultDeliveryPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pwd,      setPwd]      = useState("");
  const [shake,    setShake]    = useState(false);
  const [favs,     setFavs]     = useState<Set<string>>(new Set());
  const [filter,   setFilter]   = useState<"all" | "fav">("all");
  const [lightbox, setLightbox] = useState<LbItem | null>(null);

  const allPhotos = useMemo(
    () => ALL_FOLDERS.flatMap((f) => f.photos.map((id, i) => ({ id: `${f.id}-${i}`, photoId: id, chapter: f.name, chapterNo: f.no }))),
    []
  );
  const total = allPhotos.length;

  function tryUnlock(e: React.FormEvent) {
    e.preventDefault();
    /* Demo gate — any non-empty input unlocks. */
    if (!pwd.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setUnlocked(true);
  }
  function toggleFav(id: string) {
    setFavs((f) => { const n = new Set(f); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!lightbox) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((l) => l && ({ ...l, idx: (l.idx + 1) % total, photoId: allPhotos[(l.idx + 1) % total]!.photoId, chapter: allPhotos[(l.idx + 1) % total]!.chapter, chapterNo: allPhotos[(l.idx + 1) % total]!.chapterNo }));
      if (e.key === "ArrowLeft")  setLightbox((l) => l && ({ ...l, idx: (l.idx - 1 + total) % total, photoId: allPhotos[(l.idx - 1 + total) % total]!.photoId, chapter: allPhotos[(l.idx - 1 + total) % total]!.chapter, chapterNo: allPhotos[(l.idx - 1 + total) % total]!.chapterNo }));
      if (e.key.toLowerCase() === "f" && lightbox) toggleFav(allPhotos[lightbox.idx]!.id);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, allPhotos, total]);

  return (
    <div className="vt-root vd-root">
      <style>{VD_CSS}</style>

      {!unlocked && (
        <div className={`vd-gate ${shake ? "is-shake" : ""}`}>
          <div className="vd-gate-bg vt-imgwrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={VT_U(DELIVERY.cover, 2200)} alt="" />
            <div className="vd-gate-tint" />
          </div>

          <header className="vd-gate-top">
            <span className="vt-disp" style={{ fontSize: 22, color: "#F0EADA" }}>VAULT</span>
            <span className="vt-mono" style={{ color: "rgba(244,240,230,.7)" }}>Private delivery · Ref. {DELIVERY.ref}</span>
          </header>

          <div className="vd-gate-card">
            <span className="vt-mono" style={{ color: "rgba(244,240,230,.6)", letterSpacing: ".18em" }}>— A delivery for —</span>
            <h1 className="vt-disp vd-gate-title">
              <span>SERAPHINE</span>
              <span className="vd-gate-amp">&amp;</span>
              <span>THEO</span>
            </h1>
            <div className="vd-gate-line vt-mono">
              {DELIVERY.date} <span className="vd-gate-dot">·</span> {DELIVERY.location} <span className="vd-gate-dot">·</span> {total} plates
            </div>
            <form className="vd-gate-form" onSubmit={tryUnlock}>
              <label className="vt-mono" htmlFor="vd-pwd">Passphrase</label>
              <div className="vd-gate-input">
                <input id="vd-pwd" type="text" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="enter passphrase" spellCheck={false} autoComplete="off" />
                <button type="submit" className="vd-gate-go">
                  <span>Open</span>
                  <span style={{ fontFamily: "var(--vt-display)", fontSize: 18 }}>→</span>
                </button>
              </div>
              <p className="vt-mono vd-gate-hint">Try anything · contact: hello@vault.studio</p>
            </form>
          </div>

          <footer className="vd-gate-foot vt-mono">
            <span>built with <span style={{ color: "var(--vt-accent)" }}>FRAME</span></span>
            <span>{VAULT_BRAND.photographer} · {VAULT_BRAND.based}</span>
          </footer>
        </div>
      )}

      {unlocked && (
        <>
          <header className="vt-top">
            <div className="vt-top-l">
              <span className="vt-disp" style={{ fontSize: 22 }}>VAULT</span>
              <span className="vt-mono" style={{ marginLeft: 12, color: "var(--vt-muted)" }}>{DELIVERY.ref}</span>
            </div>
            <div className="vt-top-c vt-mono">— Private delivery —</div>
            <div className="vt-top-r vt-mono">{DELIVERY.client}</div>
          </header>

          <section className="vd-hero">
            <div className="vd-hero-l">
              <div className="vt-mono" style={{ color: "var(--vt-muted)", letterSpacing: ".18em" }}>— A delivery for —</div>
              <h1 className="vt-disp vd-hero-title">
                <span>SERAPHINE</span>
                <span className="vd-hero-amp">&amp;</span>
                <span>THEO</span>
              </h1>
              <div className="vd-hero-meta">
                <div><div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Date</div><div className="vt-disp" style={{ fontSize: 24 }}>{DELIVERY.date}</div></div>
                <div><div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Place</div><div className="vt-disp" style={{ fontSize: 24 }}>{DELIVERY.location}</div></div>
                <div><div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Plates</div><div className="vt-disp" style={{ fontSize: 24 }}>{total}</div></div>
                <div><div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Expires</div><div className="vt-disp" style={{ fontSize: 24 }}>{DELIVERY.expiryDays}d</div></div>
              </div>
            </div>
            <div className="vd-hero-r vt-imgwrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={VT_U(DELIVERY.cover, 1600)} alt="" />
            </div>
          </section>

          <section className="vd-cta">
            <p className="vd-cta-lede">Take your time. Mark favourites with the <strong style={{ color: "var(--vt-accent)" }}>♥</strong>. We&rsquo;ll print whatever you choose.</p>
            <div className="vd-cta-btns">
              <button className="vd-btn">Download favourites</button>
              <button className="vd-btn is-primary">Download all · 4.2 GB ↓</button>
            </div>
          </section>

          <div className="vd-tb">
            <div className="vd-tb-l">
              <button className={`vd-pill ${filter === "all" ? "on" : ""}`} onClick={() => setFilter("all")}>All <span className="c">{total}</span></button>
              <button className={`vd-pill ${filter === "fav" ? "on" : ""}`} onClick={() => setFilter("fav")}>Favourites <span className="c">{favs.size}</span></button>
            </div>
            <div className="vd-tb-r vt-mono">{filter === "fav" ? favs.size : total} showing</div>
          </div>

          {ALL_FOLDERS.map((f) => {
            const items = f.photos
              .map((pid, i) => ({ id: `${f.id}-${i}`, photoId: pid, idx: allPhotos.findIndex((x) => x.id === `${f.id}-${i}`) }))
              .filter((it) => filter !== "fav" || favs.has(it.id));
            if (filter === "fav" && items.length === 0) return null;
            return (
              <section key={f.id} className="vd-section">
                <header className="vd-section-h">
                  <span className="vt-mono vd-section-no" style={{ color: "var(--vt-accent)" }}>{f.no}</span>
                  <h2 className="vt-disp vd-section-name">{f.name}</h2>
                  <div className="vd-section-info vt-mono">
                    <span>{f.place}</span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span>{f.date}</span>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span>{f.photos.length} plates</span>
                  </div>
                  <p className="vd-section-note">{f.note}</p>
                </header>
                <div className="vd-grid">
                  {items.map((it) => (
                    <figure
                      key={it.id}
                      className={`vd-cell ${favs.has(it.id) ? "is-fav" : ""}`}
                      onClick={() => setLightbox({ photoId: it.photoId, idx: it.idx, chapter: f.name, chapterNo: f.no })}
                    >
                      <div className="vt-imgwrap vd-cell-img">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={VT_U(it.photoId, 900)} alt="" loading="lazy" />
                      </div>
                      <button className={`vd-fav ${favs.has(it.id) ? "on" : ""}`} aria-label="favorite" onClick={(e) => { e.stopPropagation(); toggleFav(it.id); }}>
                        <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9-9 1-9 5-9 4 3 4 3 0-3 4-3 7 4 5 9-9 9-9 9z" fill={favs.has(it.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6"/></svg>
                      </button>
                      <div className="vd-cell-cap vt-mono">
                        <span style={{ color: "var(--vt-accent)" }}>{f.no}.{String(it.idx + 1 - allPhotos.findIndex((x) => x.chapterNo === f.no)).padStart(2, "0")}</span>
                      </div>
                    </figure>
                  ))}
                </div>
              </section>
            );
          })}

          <footer className="vd-foot">
            <div className="vd-foot-mark vt-disp">THANK YOU.</div>
            <div className="vd-foot-meta">
              <div><div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Delivered</div><div>{DELIVERY.date}</div></div>
              <div><div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Expires</div><div>in {DELIVERY.expiryDays} days</div></div>
              <div><div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Photographer</div><div>{VAULT_BRAND.photographer}</div></div>
              <div><div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Need help?</div><div>hello@vault.studio</div></div>
            </div>
          </footer>

          {favs.size > 0 && (
            <div className="vd-floater vt-mono">
              <span><b style={{ color: "var(--vt-accent)" }}>{favs.size}</b> favourited</span>
              <button onClick={() => setFavs(new Set())}>Clear</button>
              <button className="dl">Download ↓</button>
            </div>
          )}

          {lightbox && (
            <div className="vd-lb">
              <div className="vd-lb-bg" onClick={() => setLightbox(null)} />
              <header className="vd-lb-head">
                <span className="vt-mono">
                  <span style={{ color: "var(--vt-accent)" }}>{lightbox.chapterNo}</span>
                  <span style={{ margin: "0 10px", opacity: 0.5 }}>·</span>
                  {lightbox.chapter} · {String(lightbox.idx + 1).padStart(3, "0")} / {String(total).padStart(3, "0")}
                </span>
                <button className="vd-lb-x" onClick={() => setLightbox(null)}>✕</button>
              </header>
              <div className="vd-lb-stage">
                <button className="vd-lb-nav vd-lb-prev" onClick={() => {
                  const ni = (lightbox.idx - 1 + total) % total;
                  const ph = allPhotos[ni]!;
                  setLightbox({ photoId: ph.photoId, idx: ni, chapter: ph.chapter, chapterNo: ph.chapterNo });
                }}>←</button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={VT_U(lightbox.photoId, 1800)} alt="" />
                <button className="vd-lb-nav vd-lb-next" onClick={() => {
                  const ni = (lightbox.idx + 1) % total;
                  const ph = allPhotos[ni]!;
                  setLightbox({ photoId: ph.photoId, idx: ni, chapter: ph.chapter, chapterNo: ph.chapterNo });
                }}>→</button>
              </div>
              <footer className="vd-lb-foot vt-mono">
                <button className={`vd-lb-act ${favs.has(allPhotos[lightbox.idx]!.id) ? "on" : ""}`} onClick={() => toggleFav(allPhotos[lightbox.idx]!.id)}>
                  ♥ {favs.has(allPhotos[lightbox.idx]!.id) ? "Favorited" : "Favorite"} <span style={{ opacity: 0.5 }}>· F</span>
                </button>
                <button className="vd-lb-act">↓ Download plate</button>
              </footer>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const VD_CSS = `
.vt-root{ font-family:var(--vt-sans); color:var(--vt-fg); background:var(--vt-bg); -webkit-font-smoothing:antialiased }
.vt-root .vt-mono{ font-family:var(--vt-mono); font-size:11px; letter-spacing:.06em; text-transform:uppercase }
.vt-root .vt-disp{ font-family:var(--vt-display); letter-spacing:.005em; line-height:.86; text-transform:uppercase }
.vt-root .vt-imgwrap{ position:relative; overflow:hidden; background:var(--vt-paper) }
.vt-root .vt-imgwrap img{ width:100%; height:100%; object-fit:cover; display:block }

.vt-top{ position:fixed; top:0; left:0; right:0; height:48px; z-index:60; display:grid; grid-template-columns: 1fr 1fr 1fr; align-items:center; padding: 0 22px; background:var(--vt-bg); border-bottom:1px solid var(--vt-line) }
.vt-top-l{ display:flex; align-items:baseline; gap:12px }
.vt-top-c{ text-align:center; color:var(--vt-muted) }
.vt-top-r{ text-align:right; color:var(--vt-muted) }
@media (max-width:760px){ .vt-top{ grid-template-columns: 1fr auto; height:44px } .vt-top-c{ display:none } }

/* GATE */
.vd-gate{ position:relative; min-height:100dvh; isolation:isolate; color:#F0EADA; padding: 22px clamp(20px,4vw,56px); display:grid; grid-template-rows: auto 1fr auto }
.vd-gate.is-shake{ animation: vd-shake .55s var(--vt-ease) }
@keyframes vd-shake{ 10%,90%{transform:translateX(-2px)} 30%,50%,70%{transform:translateX(-8px)} 40%,60%{transform:translateX(8px)} }
.vd-gate-bg{ position:absolute; inset:0; z-index:-1; background:#222 }
.vd-gate-tint{ position:absolute; inset:0; background: radial-gradient(120% 80% at 50% 50%, rgba(0,0,0,.2), rgba(0,0,0,.75)) }
.vd-gate-top{ display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap }
.vd-gate-card{ align-self:center; justify-self:center; width:min(640px,94vw); text-align:center; display:flex; flex-direction:column; gap:14px; padding:48px 32px; background:rgba(20,18,15,.55); backdrop-filter:blur(28px) saturate(140%); -webkit-backdrop-filter:blur(28px) saturate(140%); border:1px solid rgba(244,240,230,.18) }
.vd-gate-title{ margin:0; font-size: clamp(56px,11vw,120px); display:flex; flex-direction:column; align-items:center; line-height:.85 }
.vd-gate-amp{ font-family:var(--vt-display); color:var(--vt-accent); font-size: clamp(40px,8vw,80px); line-height:.7; margin: -.05em 0 -.05em .04em }
.vd-gate-line{ color:rgba(244,240,230,.85); margin-top:6px }
.vd-gate-dot{ color:var(--vt-accent); margin:0 8px }

.vd-gate-form{ display:flex; flex-direction:column; gap:8px; margin-top:24px; align-items:stretch; text-align:left }
.vd-gate-form > label{ color:rgba(244,240,230,.6) }
.vd-gate-input{ display:flex; align-items:stretch; border:1px solid rgba(244,240,230,.3); background:rgba(0,0,0,.25) }
.vd-gate-input input{ flex:1; appearance:none; background:transparent; border:0; padding:18px 20px; color:#F0EADA; font-family:var(--vt-display); font-size:24px; letter-spacing:.02em; outline:none; min-width:0; text-transform:lowercase }
.vd-gate-input input::placeholder{ color:rgba(244,240,230,.4) }
.vd-gate-go{ appearance:none; border:0; padding:0 24px; background:var(--vt-accent); color:#fff; font-family:var(--vt-mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; display:flex; align-items:center; gap:10px; cursor:pointer; transition:gap .25s ease }
.vd-gate-go:hover{ gap:14px }
.vd-gate-hint{ color:rgba(244,240,230,.4); margin:8px 0 0 }
.vd-gate-foot{ display:flex; justify-content:space-between; color:rgba(244,240,230,.5); flex-wrap:wrap; gap:8px }

/* HERO */
.vd-hero{ display:grid; grid-template-columns: 5fr 7fr; gap:0; border-bottom:1px solid var(--vt-line); margin-top:48px }
.vd-hero-l{ padding: clamp(40px,7vh,72px) clamp(28px,4vw,56px); display:flex; flex-direction:column; gap:24px; border-right:1px solid var(--vt-line) }
.vd-hero-title{ margin:0; font-size: clamp(56px,11vw,128px); display:flex; flex-direction:column; line-height:.85 }
.vd-hero-amp{ font-family:var(--vt-display); color:var(--vt-accent); font-size: clamp(40px,8vw,80px); line-height:.7; align-self:flex-start; margin: -.05em 0 -.05em .04em }
.vd-hero-meta{ display:grid; grid-template-columns: repeat(2,1fr); gap:24px; padding-top:24px; border-top:1px solid var(--vt-line); margin-top:auto }
.vd-hero-meta > div > div:first-child{ margin-bottom:6px }
.vd-hero-r{ position:relative; min-height: 320px }
@media (max-width:980px){ .vd-hero{ grid-template-columns:1fr } .vd-hero-l{ border-right:0; border-bottom:1px solid var(--vt-line) } .vd-hero-r{ min-height: 260px } }

/* CTA */
.vd-cta{ display:grid; grid-template-columns: 1fr auto; gap:28px; align-items:center; padding: clamp(28px,5vh,48px) clamp(28px,4vw,56px); border-bottom:1px solid var(--vt-line); flex-wrap:wrap }
.vd-cta-lede{ margin:0; font-size: clamp(15px,1.6vw,17px); color:var(--vt-fg); line-height:1.5; max-width:60ch }
.vd-cta-btns{ display:flex; gap:10px; flex-wrap:wrap }
.vd-btn{ appearance:none; cursor:pointer; padding:14px 22px; font-family:var(--vt-mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase; border:1px solid var(--vt-line); background:transparent; color:var(--vt-fg); transition:background .2s ease, color .2s ease, border-color .2s ease }
.vd-btn:hover{ background:var(--vt-fg); color:var(--vt-bg) }
.vd-btn.is-primary{ background:var(--vt-accent); border-color:var(--vt-accent); color:#fff }
.vd-btn.is-primary:hover{ background:var(--vt-fg); border-color:var(--vt-fg); color:var(--vt-bg) }
@media (max-width:760px){ .vd-cta{ grid-template-columns:1fr } }

/* TOOLBAR */
.vd-tb{ position:sticky; top:48px; z-index:30; display:flex; justify-content:space-between; align-items:center; gap:14px; padding: 12px clamp(28px,4vw,56px); background:var(--vt-bg); border-bottom:1px solid var(--vt-line) }
.vd-tb-l{ display:flex; gap:8px }
.vd-pill{ appearance:none; cursor:pointer; padding:8px 14px; border:1px solid var(--vt-line); background:transparent; color:var(--vt-fg); font-family:var(--vt-mono); font-size:11px; letter-spacing:.06em; text-transform:uppercase; transition:background .2s ease, color .2s ease }
.vd-pill.on{ background:var(--vt-fg); color:var(--vt-bg) }
.vd-pill .c{ margin-left:8px; color:var(--vt-accent) }
.vd-pill.on .c{ color:var(--vt-bg); opacity:.55 }
.vd-tb-r{ color:var(--vt-muted) }

/* SECTION */
.vd-section{ border-bottom:1px solid var(--vt-line) }
.vd-section-h{ display:grid; grid-template-columns: 90px 1fr 1fr; gap:24px; padding: clamp(36px,6vh,72px) clamp(28px,4vw,56px) 24px; align-items:end }
.vd-section-no{ font-size:13px }
.vd-section-name{ margin:0; font-size: clamp(36px,6vw,84px); line-height:.9 }
.vd-section-info{ display:flex; gap:10px; justify-content:flex-end; color:var(--vt-muted); flex-wrap:wrap }
.vd-section-note{ grid-column: 2 / -1; max-width:62ch; margin:0; font-size:15px; line-height:1.55; color:var(--vt-muted); font-style:italic }
@media (max-width:760px){ .vd-section-h{ grid-template-columns: 50px 1fr } .vd-section-info{ grid-column: 1 / -1; justify-content:flex-start } .vd-section-note{ grid-column: 1 / -1 } }

.vd-grid{ display:grid; grid-template-columns: repeat(4,1fr); gap:0; padding: 0 0 clamp(36px,6vh,72px) }
@media (max-width:1100px){ .vd-grid{ grid-template-columns: repeat(3,1fr) } }
@media (max-width:760px){ .vd-grid{ grid-template-columns: repeat(2,1fr) } }

.vd-cell{ position:relative; cursor:zoom-in; margin:0; border-right:1px solid var(--vt-line); border-bottom:1px solid var(--vt-line) }
.vd-cell-img{ aspect-ratio: 3/4; transition: transform .4s var(--vt-ease) }
.vd-cell:hover .vd-cell-img img{ transform: scale(1.03) }
.vd-cell-img img{ transition: transform .55s var(--vt-ease) }
.vd-cell-cap{ position:absolute; left:10px; bottom:10px; background:var(--vt-bg); padding:4px 7px; color:var(--vt-fg); font-size:9px }
.vd-cell.is-fav{ box-shadow: inset 0 0 0 3px var(--vt-accent) }
.vd-fav{ position:absolute; top:10px; right:10px; appearance:none; border:1px solid var(--vt-line); background:var(--vt-bg); color:var(--vt-fg); width:30px; height:30px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; transition: all .2s ease; opacity:0 }
.vd-cell:hover .vd-fav, .vd-fav.on{ opacity:1 }
.vd-fav.on{ background:var(--vt-accent); border-color:var(--vt-accent); color:#fff }
.vd-fav:hover{ background:var(--vt-fg); color:var(--vt-bg) }

/* FOOTER */
.vd-foot{ background:var(--vt-fg); color:var(--vt-bg); padding: clamp(60px,10vh,120px) clamp(28px,4vw,56px) 36px }
.vd-foot-mark{ font-size: clamp(80px,16vw,200px); padding-bottom:36px; border-bottom:1px solid rgba(244,240,230,.18) }
.vd-foot-meta{ display:grid; grid-template-columns:repeat(4,1fr); gap:24px; padding-top:36px; font-size:14px }
.vd-foot-meta > div > div:first-child{ margin-bottom:6px }
@media (max-width:760px){ .vd-foot-meta{ grid-template-columns:repeat(2,1fr) } }

/* FLOATER */
.vd-floater{ position:fixed; left:50%; bottom:24px; transform:translateX(-50%); background:var(--vt-fg); color:var(--vt-bg); display:flex; align-items:center; gap:14px; padding:12px 14px 12px 18px; box-shadow:0 24px 60px rgba(0,0,0,.18); z-index:40 }
.vd-floater button{ appearance:none; border:0; background:transparent; color:var(--vt-bg); font-family:var(--vt-mono); font-size:11px; text-transform:uppercase; cursor:pointer; padding:8px 12px; letter-spacing:.06em }
.vd-floater .dl{ background:var(--vt-accent); color:#fff }
.vd-floater b{ font-family:var(--vt-display); font-size:18px }

/* LIGHTBOX */
.vd-lb{ position:fixed; inset:0; z-index:80; background:var(--vt-fg); color:#F0EADA; display:flex; flex-direction:column }
.vd-lb-bg{ position:absolute; inset:0 }
.vd-lb-head{ position:relative; display:flex; justify-content:space-between; align-items:center; padding:18px 24px; border-bottom:1px solid rgba(244,240,230,.12); z-index:1 }
.vd-lb-x{ appearance:none; border:1px solid rgba(244,240,230,.18); background:transparent; color:inherit; width:34px; height:34px; cursor:pointer }
.vd-lb-stage{ position:relative; flex:1; display:flex; align-items:center; justify-content:center; padding:30px; min-height:0; z-index:1 }
.vd-lb-stage img{ max-width:100%; max-height:100%; object-fit:contain }
.vd-lb-nav{ appearance:none; background:transparent; border:1px solid rgba(244,240,230,.18); color:inherit; width:48px; height:48px; cursor:pointer; position:absolute; top:50%; transform:translateY(-50%); font-family:var(--vt-display); font-size:22px }
.vd-lb-nav:hover{ background:rgba(244,240,230,.08) }
.vd-lb-prev{ left:24px } .vd-lb-next{ right:24px }
.vd-lb-foot{ position:relative; display:flex; justify-content:center; gap:10px; padding:14px 24px; border-top:1px solid rgba(244,240,230,.12); z-index:1 }
.vd-lb-act{ appearance:none; cursor:pointer; padding:8px 14px; border:1px solid rgba(244,240,230,.18); background:transparent; color:inherit; font-family:var(--vt-mono); font-size:10px; letter-spacing:.06em; text-transform:uppercase; transition: all .2s ease }
.vd-lb-act:hover{ background:rgba(244,240,230,.08) }
.vd-lb-act.on{ background:var(--vt-accent); border-color:var(--vt-accent); color:#fff }
`;
