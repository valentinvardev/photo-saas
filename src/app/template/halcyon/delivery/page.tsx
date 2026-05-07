"use client";

import { useEffect, useMemo, useState } from "react";
import { HL_TOKENS, HL_FONTS, HL_DELIVERY, hlBaseCss, type HlPhoto } from "~/lib/halcyon/data";

type Lightbox = { photos: (HlPhoto & { sectionId?: string; sectionLabel?: string })[]; index: number } | null;

export default function HalcyonDeliveryPage() {
  const t    = HL_TOKENS;
  const data = HL_DELIVERY;

  const [unlocked, setUnlocked]   = useState(false);
  const [curtain,  setCurtain]    = useState(false);
  const [pwd,      setPwd]        = useState("");
  const [shake,    setShake]      = useState(false);
  const [filter,   setFilter]     = useState<"all" | "fav">("all");
  const [favs,     setFavs]       = useState<Set<string>>(new Set());
  const [sel,      setSel]        = useState<Set<string>>(new Set());
  const [lightbox, setLightbox]   = useState<Lightbox>(null);

  const allPhotos = useMemo(
    () => data.sections.flatMap((s) => s.photos.map((p) => ({ ...p, sectionId: s.id, sectionLabel: s.label }))),
    [data]
  );
  const visiblePhotos = useMemo(
    () => (filter === "fav" ? allPhotos.filter((p) => favs.has(p.id)) : allPhotos),
    [filter, favs, allPhotos]
  );

  function tryUnlock(e?: React.FormEvent) {
    e?.preventDefault?.();
    /* Demo gate: any non-empty input unlocks. Real validation happens
       server-side once the page is wired to a real client gallery. */
    if (!pwd.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setCurtain(true);
    setTimeout(() => setUnlocked(true), 550);
    setTimeout(() => setCurtain(false), 1100);
  }
  function toggleFav(id: string) { setFavs((f) => { const n = new Set(f); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleSel(id: string) { setSel ((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function selectAll() {
    if (sel.size === visiblePhotos.length) setSel(new Set());
    else setSel(new Set(visiblePhotos.map((p) => p.id)));
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
    <div className="hl-root" style={{ minHeight: "100dvh", position: "relative", overflow: "hidden" }}>
      <style>{hlBaseCss(t)}</style>
      <style>{`
        .hd-stripe{position:absolute;top:0;left:0;right:0;height:3px;background:${t.accent};z-index:30}

        .hd-gate{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${t.bg};z-index:20;padding:48px}
        .hd-gate-wm{display:flex;flex-direction:column;align-items:center;gap:48px;max-width:440px;width:100%}
        .hd-mark{width:80px;height:80px;border:1px solid ${t.line};display:flex;align-items:center;justify-content:center;font-family:${HL_FONTS.serif};font-size:30px;letter-spacing:-0.02em}
        .hd-mark em{font-style:italic}
        .hd-gate h1{font-family:${HL_FONTS.serif};font-size:72px;line-height:0.95;letter-spacing:-0.03em;text-align:center;font-weight:400}
        .hd-gate h1 em{font-style:italic;color:${t.accent}}
        .hd-gate .meta{font-family:${HL_FONTS.mono};font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${t.muted};text-align:center}
        .hd-gate-form{width:100%;display:flex;flex-direction:column;gap:14px}
        .hd-pwd{background:${t.raised};border:1px solid ${t.line};color:${t.fg};padding:18px 20px;font-family:${HL_FONTS.mono};font-size:13px;letter-spacing:0.06em;text-align:center;outline:none;transition:border-color .25s ease}
        .hd-pwd:focus{border-color:${t.accent}}
        .hd-pwd.shake{animation:hdShake .42s cubic-bezier(.36,.07,.19,.97);border-color:${t.accent}}
        @keyframes hdShake{10%,90%{transform:translateX(-2px)}20%,80%{transform:translateX(4px)}30%,50%,70%{transform:translateX(-7px)}40%,60%{transform:translateX(7px)}}
        .hd-gate-foot{font-family:${HL_FONTS.mono};font-size:10px;letter-spacing:0.1em;color:${t.muted};text-align:center;text-transform:uppercase}

        .hd-curtain{position:absolute;inset:0;background:${t.accent};z-index:60;transform:translateX(-100%);pointer-events:none}
        .hd-curtain.run{animation:hdCurtain 1.1s cubic-bezier(0.76,0,0.24,1) forwards}
        @keyframes hdCurtain{0%{transform:translateX(-100%)}50%{transform:translateX(0)}100%{transform:translateX(100%)}}

        .hd-hero{position:relative;height:560px;overflow:hidden}
        .hd-hero img{width:100%;height:100%;object-fit:cover}
        .hd-hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,13,11,0.3) 0%,rgba(14,13,11,0) 30%,rgba(14,13,11,0.85) 100%)}
        .hd-hero-mark{position:absolute;top:32px;left:32px;display:flex;align-items:center;gap:14px;color:${t.fg};z-index:2}
        .hd-hero-mark .m{width:44px;height:44px;border:1px solid rgba(239,234,224,0.4);display:flex;align-items:center;justify-content:center;font-family:${HL_FONTS.serif};font-size:16px}
        .hd-hero-mark .m em{font-style:italic}
        .hd-hero-meta{position:absolute;bottom:48px;left:32px;right:32px;display:flex;justify-content:space-between;align-items:flex-end;color:${t.fg};z-index:2;flex-wrap:wrap;gap:24px}
        .hd-hero-title{font-family:${HL_FONTS.serif};font-size:96px;letter-spacing:-0.03em;line-height:0.95;font-weight:400}
        .hd-hero-title em{font-style:italic;color:${t.accent}}
        .hd-hero-sub{font-family:${HL_FONTS.mono};font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${t.fg};opacity:0.85;margin-top:18px}

        .hd-cta{display:grid;grid-template-columns:1fr auto;gap:48px;padding:64px 32px;border-bottom:1px solid ${t.line};align-items:end}
        .hd-cta h3{font-family:${HL_FONTS.serif};font-size:36px;line-height:1.1;letter-spacing:-0.02em;font-weight:400;margin-bottom:14px}
        .hd-cta h3 em{font-style:italic}
        .hd-cta p{color:${t.muted};max-width:540px;line-height:1.6}
        @media(max-width:780px){.hd-cta{grid-template-columns:1fr}}

        .hd-tb{position:sticky;top:0;background:${t.bg};display:flex;align-items:center;justify-content:space-between;padding:16px 32px;border-bottom:1px solid ${t.line};z-index:10;flex-wrap:wrap;gap:12px}
        .hd-tb-l{display:flex;gap:8px;align-items:center}
        .hd-pill{font-family:${HL_FONTS.mono};font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:8px 14px;border:1px solid ${t.line};color:${t.muted};background:transparent;cursor:pointer;transition:all .2s ease}
        .hd-pill.active{background:${t.fg};color:${t.bg};border-color:${t.fg}}
        .hd-pill:hover:not(.active){color:${t.fg}}
        .hd-pill .c{margin-left:8px;color:${t.accent}}
        .hd-pill.active .c{color:${t.bg};opacity:0.6}
        .hd-tb-r{display:flex;gap:12px;align-items:center;font-family:${HL_FONTS.mono};font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:${t.muted};flex-wrap:wrap}

        .hd-chap{padding:96px 32px 32px;border-top:1px solid ${t.line}}
        .hd-chap:first-of-type{border-top:0}
        .hd-chap-head{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-bottom:48px;align-items:end}
        @media(max-width:780px){.hd-chap-head{grid-template-columns:1fr}}
        .hd-chap-eyebrow{display:flex;align-items:center;gap:14px;color:${t.muted};margin-bottom:24px;font-family:${HL_FONTS.mono};font-size:10px;letter-spacing:0.14em;text-transform:uppercase}
        .hd-chap-eyebrow .n{color:${t.accent}}
        .hd-chap h2{font-family:${HL_FONTS.serif};font-size:84px;line-height:0.95;letter-spacing:-0.03em;font-weight:400}
        .hd-chap h2 em{font-style:italic}
        .hd-chap-meta{font-family:${HL_FONTS.mono};font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:${t.muted};margin-bottom:14px}
        .hd-chap-note{font-family:${HL_FONTS.serif};font-style:italic;font-size:18px;line-height:1.5;color:${t.fg};opacity:0.85;max-width:440px}

        .hd-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
        @media(max-width:980px){.hd-grid{grid-template-columns:repeat(3,1fr)}}
        @media(max-width:640px){.hd-grid{grid-template-columns:repeat(2,1fr);gap:6px}}
        .hd-cell{position:relative;aspect-ratio:3/4;cursor:zoom-in;overflow:hidden;background:${t.raised}}
        .hd-cell img{width:100%;height:100%;object-fit:cover;transition:transform .9s cubic-bezier(0.22,1,0.36,1)}
        .hd-cell:hover img{transform:scale(1.04)}
        .hd-cell-meta{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:10px;pointer-events:none;background:linear-gradient(180deg,rgba(14,13,11,0.4) 0%,rgba(14,13,11,0) 30%,rgba(14,13,11,0) 70%,rgba(14,13,11,0.5) 100%);opacity:0;transition:opacity .25s ease}
        .hd-cell:hover .hd-cell-meta{opacity:1}
        .hd-cell-actions{display:flex;justify-content:space-between;pointer-events:auto}
        .hd-cell-no{font-family:${HL_FONTS.mono};font-size:9px;letter-spacing:0.1em;color:${t.fg};opacity:0.85;text-transform:uppercase}
        .hd-cell-fav{position:absolute;top:10px;right:10px;width:28px;height:28px;border:1px solid rgba(239,234,224,0.4);background:rgba(14,13,11,0.4);color:${t.fg};display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(6px);transition:all .2s ease;opacity:0}
        .hd-cell:hover .hd-cell-fav,.hd-cell-fav.on{opacity:1}
        .hd-cell-fav.on{background:${t.accent};border-color:${t.accent}}
        .hd-cell.selected::after{content:"";position:absolute;inset:0;border:2px solid ${t.accent};pointer-events:none}
        .hd-cell-sel{position:absolute;top:10px;left:10px;width:22px;height:22px;border:1px solid rgba(239,234,224,0.6);background:rgba(14,13,11,0.4);display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(6px);transition:all .2s ease;opacity:0;font-size:12px;color:${t.fg}}
        .hd-cell:hover .hd-cell-sel,.hd-cell-sel.on{opacity:1}
        .hd-cell-sel.on{background:${t.accent};border-color:${t.accent}}

        .hd-foot{padding:48px 32px;border-top:1px solid ${t.line};display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px}
        .hd-foot .m{font-family:${HL_FONTS.serif};font-size:18px}
        .hd-foot .m em{font-style:italic}

        .hd-floater{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:${t.fg};color:${t.bg};display:flex;align-items:center;gap:18px;padding:14px 14px 14px 22px;border-radius:48px;box-shadow:0 24px 60px rgba(0,0,0,0.5);font-family:${HL_FONTS.mono};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;z-index:15;animation:hdFloat .35s cubic-bezier(0.22,1,0.36,1)}
        @keyframes hdFloat{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}
        .hd-floater button{appearance:none;border:0;background:transparent;color:${t.bg};font-family:${HL_FONTS.mono};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;padding:8px 12px;border-radius:24px}
        .hd-floater .dl{background:${t.accent};color:${t.fg}}
        .hd-floater .dl:hover{background:${t.bg};color:${t.fg}}

        .hd-lb{position:fixed;inset:0;z-index:80;background:rgba(8,8,7,0.97);display:flex;align-items:center;justify-content:center;animation:hdFade .35s ease}
        @keyframes hdFade{from{opacity:0}to{opacity:1}}
        .hd-lb-img{max-width:78vw;max-height:78vh;object-fit:contain;box-shadow:0 30px 80px rgba(0,0,0,0.6)}
        .hd-lb-meta{position:fixed;bottom:32px;left:0;right:0;padding:0 48px;display:flex;justify-content:space-between;color:${t.fg};flex-wrap:wrap;gap:12px}
        .hd-lb-counter{font-family:${HL_FONTS.mono};font-size:11px;letter-spacing:0.1em;text-transform:uppercase}
        .hd-lb-cap{font-family:${HL_FONTS.serif};font-style:italic;font-size:18px}
        .hd-lb-actions{display:flex;gap:8px}
        .hd-lb-btn{background:transparent;border:1px solid ${t.line};color:${t.fg};font-family:${HL_FONTS.mono};font-size:10px;letter-spacing:0.1em;text-transform:uppercase;padding:8px 14px;cursor:pointer;transition:all .2s ease}
        .hd-lb-btn:hover{background:${t.fg};color:${t.bg}}
        .hd-lb-btn.on{background:${t.accent};border-color:${t.accent};color:${t.fg}}
        .hd-lb-arrow{position:fixed;top:50%;transform:translateY(-50%);background:transparent;border:1px solid ${t.line};color:${t.fg};width:48px;height:48px;cursor:pointer;font-family:${HL_FONTS.mono};font-size:14px;transition:all .25s ease;z-index:81}
        .hd-lb-arrow:hover{background:${t.fg};color:${t.bg}}
        .hd-lb-arrow.l{left:32px}.hd-lb-arrow.r{right:32px}
        .hd-lb-x{position:fixed;top:32px;right:32px;background:transparent;border:0;color:${t.fg};cursor:pointer;font-family:${HL_FONTS.mono};font-size:11px;letter-spacing:0.1em;text-transform:uppercase;z-index:81}
      `}</style>

      <div className="hd-stripe" />

      <div className={`hd-curtain ${curtain ? "run" : ""}`} />

      {!unlocked && (
        <div className="hd-gate">
          <div className="hd-gate-wm">
            <div className="hd-mark">H<em>L</em></div>
            <div>
              <div className="hl-eyebrow" style={{ textAlign: "center", marginBottom: 18 }}>Private Delivery · Halcyon Studio</div>
              <h1>Margot &<br /><em>Auden</em></h1>
            </div>
            <div className="meta">
              {data.eventDate} &nbsp;·&nbsp; {data.total} photographs &nbsp;·&nbsp; expires in {data.expiryDays} days
            </div>
            <form className="hd-gate-form" onSubmit={tryUnlock}>
              <input
                className={`hd-pwd ${shake ? "shake" : ""}`}
                type="password"
                placeholder="ENTER PASSWORD"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                autoFocus
              />
              <button type="submit" className="hl-btn hl-btn-accent" style={{ justifyContent: "center" }}>
                Open the gallery →
              </button>
            </form>
            <div className="hd-gate-foot">
              Trouble? Write to <span style={{ color: t.fg }}>studio@halcyon.photo</span><br />
              <span style={{ opacity: 0.6 }}>Hint: a city in Portugal</span>
            </div>
          </div>
        </div>
      )}

      {unlocked && (
        <>
          <section className="hd-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.sections[0]!.photos[0]!.src} alt="" />
            <div className="hd-hero-mark">
              <div className="m">H<em>L</em></div>
              <div>
                <div className="hl-mono" style={{ opacity: 0.7 }}>Halcyon · Delivery</div>
                <div style={{ fontFamily: HL_FONTS.serif, fontSize: 16, fontStyle: "italic", marginTop: 2 }}>by Lior Avni</div>
              </div>
            </div>
            <div className="hd-hero-meta">
              <div>
                <h1 className="hd-hero-title">Margot &<br /><em>Auden</em></h1>
                <div className="hd-hero-sub">{data.eventDate} &nbsp;·&nbsp; {data.eventLocation} &nbsp;·&nbsp; {data.total} frames</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="hl-mono" style={{ color: t.fg, opacity: 0.7, marginBottom: 6 }}>Chapter</div>
                <div style={{ fontFamily: HL_FONTS.serif, fontSize: 22, fontStyle: "italic" }}>One day, in three acts.</div>
              </div>
            </div>
          </section>

          <section className="hd-cta">
            <div>
              <div className="hl-eyebrow" style={{ marginBottom: 18 }}><span style={{ color: t.accent }}>●</span> Welcome, Margot &amp; Auden</div>
              <h3>Take your time, then <em>take them home.</em></h3>
              <p>Your full gallery has been retouched and color-graded. Mark the favorites you want printed, or download the whole archive at full resolution. The link stays open for sixty days — long enough to share with family before life moves on.</p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="hl-btn">Download favorites</button>
              <button className="hl-btn hl-btn-accent">Download all (4.2 GB) ↓</button>
            </div>
          </section>

          <div className="hd-tb">
            <div className="hd-tb-l">
              <button className={`hd-pill ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All <span className="c">{allPhotos.length}</span></button>
              <button className={`hd-pill ${filter === "fav" ? "active" : ""}`} onClick={() => setFilter("fav")}>Favorites <span className="c">{favs.size}</span></button>
            </div>
            <div className="hd-tb-r">
              <span style={{ marginRight: 6 }}>{visiblePhotos.length} showing</span>
              <button className="hd-pill" onClick={selectAll}>{sel.size === visiblePhotos.length && sel.size > 0 ? "Deselect all" : "Select all"}</button>
              <button className="hd-pill" style={{ background: t.accent, borderColor: t.accent, color: t.fg }}>Download ↓</button>
            </div>
          </div>

          {data.sections.map((sec) => {
            const showing = filter === "fav" ? sec.photos.filter((p) => favs.has(p.id)) : sec.photos;
            if (filter === "fav" && showing.length === 0) return null;
            return (
              <section key={sec.id} className="hd-chap">
                <div className="hd-chap-head">
                  <div>
                    <div className="hd-chap-eyebrow">
                      <span className="n">Ch · {sec.no}</span>
                      <span style={{ flex: 1, height: 1, background: t.line }} />
                      <span>{sec.label}</span>
                    </div>
                    <h2>{sec.label.charAt(0)}<em>{sec.label.slice(1).toLowerCase()}</em></h2>
                  </div>
                  <div>
                    <div className="hd-chap-meta">{sec.photos.length} photographs · {sec.id}</div>
                    <p className="hd-chap-note">&ldquo;{sec.note}&rdquo;</p>
                  </div>
                </div>
                <div className="hd-grid">
                  {showing.map((ph, i) => {
                    const photoIdx = allPhotos.findIndex((x) => x.id === ph.id);
                    return (
                      <div
                        key={ph.id}
                        className={`hd-cell ${sel.has(ph.id) ? "selected" : ""}`}
                        onClick={(e) => {
                          if (e.shiftKey) toggleSel(ph.id);
                          else setLightbox({ photos: allPhotos, index: photoIdx });
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ph.src} alt={ph.title} />
                        <div className={`hd-cell-sel ${sel.has(ph.id) ? "on" : ""}`} onClick={(e) => { e.stopPropagation(); toggleSel(ph.id); }}>{sel.has(ph.id) ? "✓" : ""}</div>
                        <div className={`hd-cell-fav ${favs.has(ph.id) ? "on" : ""}`} onClick={(e) => { e.stopPropagation(); toggleFav(ph.id); }}>♥</div>
                        <div className="hd-cell-meta">
                          <div className="hd-cell-actions"><span /><span /></div>
                          <div className="hd-cell-no">{sec.no}.{String(i + 1).padStart(3, "0")}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <footer className="hd-foot">
            <div className="m">Halcyon<em> Studio</em></div>
            <div className="hl-mono" style={{ color: t.muted }}>Delivered {data.eventDate} · expires in {data.expiryDays} days</div>
            <div className="hl-mono"><a className="hl-link" href="#">Help</a> &nbsp;·&nbsp; <a className="hl-link" href="#">Print Shop</a></div>
          </footer>

          {sel.size > 0 && (
            <div className="hd-floater">
              <span><b style={{ fontFamily: HL_FONTS.serif, fontStyle: "italic", fontSize: 16, fontWeight: 400 }}>{sel.size}</b> &nbsp; selected</span>
              <button onClick={() => setSel(new Set())}>Clear</button>
              <button className="dl">Download ↓</button>
            </div>
          )}

          {lightbox && lightbox.photos[lightbox.index] && (
            <div className="hd-lb" onClick={(e) => { if (e.target === e.currentTarget) setLightbox(null); }}>
              <button className="hd-lb-x" onClick={() => setLightbox(null)}>Close ✕</button>
              <button className="hd-lb-arrow l" onClick={() => setLightbox((l) => l && ({ ...l, index: (l.index - 1 + l.photos.length) % l.photos.length }))}>←</button>
              <button className="hd-lb-arrow r" onClick={() => setLightbox((l) => l && ({ ...l, index: (l.index + 1) % l.photos.length }))}>→</button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hd-lb-img" src={lightbox.photos[lightbox.index]!.src} alt="" />
              <div className="hd-lb-meta">
                <div className="hd-lb-counter">{String(lightbox.index + 1).padStart(3, "0")} / {String(lightbox.photos.length).padStart(3, "0")} &nbsp;·&nbsp; {lightbox.photos[lightbox.index]!.sectionLabel?.toLowerCase()}</div>
                <div className="hd-lb-cap">{lightbox.photos[lightbox.index]!.title}</div>
                <div className="hd-lb-actions">
                  <button className={`hd-lb-btn ${favs.has(lightbox.photos[lightbox.index]!.id) ? "on" : ""}`} onClick={() => toggleFav(lightbox.photos[lightbox.index]!.id)}>♥ Favorite (F)</button>
                  <button className="hd-lb-btn">↓ Download</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
