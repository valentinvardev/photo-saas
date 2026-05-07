"use client";

import { useEffect, useMemo, useState } from "react";
import { MN_TOKENS, MN_FONTS, MN_DELIVERY, mnBaseCss } from "~/lib/monolith/data";
import type { HlPhoto } from "~/lib/halcyon/data";

type LbPhoto = HlPhoto & { sectionId: string; sectionLabel: string; sectionNo: string };
type Lightbox = { photos: LbPhoto[]; index: number } | null;

export default function MonolithDeliveryPage() {
  const t = MN_TOKENS;
  const data = MN_DELIVERY;

  const [unlocked, setUnlocked] = useState(false);
  const [pwd,      setPwd]      = useState("");
  const [err,      setErr]      = useState(false);
  const [filter,   setFilter]   = useState<"all" | "fav">("all");
  const [favs,     setFavs]     = useState<Set<string>>(new Set());
  const [sel,      setSel]      = useState<Set<string>>(new Set());
  const [lightbox, setLightbox] = useState<Lightbox>(null);

  const allPhotos: LbPhoto[] = useMemo(
    () => data.sections.flatMap((s) => s.photos.map((p) => ({ ...p, sectionId: s.id, sectionLabel: s.label, sectionNo: s.no }))),
    [data.sections]
  );
  const visible = useMemo(
    () => filter === "fav" ? allPhotos.filter((p) => favs.has(p.id)) : allPhotos,
    [filter, favs, allPhotos]
  );

  function tryUnlock(e?: React.FormEvent) {
    e?.preventDefault?.();
    /* Demo gate — any non-empty input unlocks. Real validation server-side. */
    if (!pwd.trim()) {
      setErr(true);
      setTimeout(() => setErr(false), 500);
      return;
    }
    setUnlocked(true);
  }
  function toggleFav(id: string) { setFavs((f) => { const n = new Set(f); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function toggleSel(id: string) { setSel ((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; }); }

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
    <div className="mn-root" style={{ minHeight: "100dvh", position: "relative", overflow: "hidden" }}>
      <style>{mnBaseCss(t)}</style>
      <style>{`
        .md-stripe{height:4px;background:${t.accent}}

        /* gate */
        .md-gate{position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr;background:${t.bg};z-index:20}
        @media(max-width:780px){.md-gate{grid-template-columns:1fr}}
        .md-gate-l{padding:48px;display:flex;flex-direction:column;justify-content:space-between;border-right:1px solid ${t.line};gap:32px}
        @media(max-width:780px){.md-gate-l{padding:28px;border-right:0;border-bottom:1px solid ${t.line}}}
        .md-gate-mark{display:flex;align-items:center;gap:10px;font-family:${MN_FONTS.display};font-weight:800;font-size:26px;letter-spacing:-0.03em}
        .md-gate-mark .sq{width:14px;height:14px;background:${t.accent}}
        .md-gate h1{font-family:${MN_FONTS.display};font-weight:800;font-size:88px;letter-spacing:-0.05em;line-height:0.92}
        .md-gate h1 .ac{color:${t.accent}}
        @media(max-width:780px){.md-gate h1{font-size:48px}}
        .md-gate-meta{display:grid;grid-template-columns:1fr 1fr;border:1px solid ${t.line}}
        .md-gate-meta > div{padding:14px 18px;border-right:1px solid ${t.line};border-bottom:1px solid ${t.line}}
        .md-gate-meta > div:nth-child(2n){border-right:0}
        .md-gate-meta > div:nth-last-child(-n+2){border-bottom:0}
        .md-gate-meta .k{font-family:${MN_FONTS.mono};font-size:10px;color:${t.muted};text-transform:uppercase;margin-bottom:5px}
        .md-gate-meta .v{font-family:${MN_FONTS.display};font-weight:700;font-size:18px}
        .md-gate-r{padding:48px;display:flex;flex-direction:column;justify-content:center;gap:18px;background:${t.fg};color:${t.bg}}
        @media(max-width:780px){.md-gate-r{padding:28px}}
        .md-gate-r .eb{font-family:${MN_FONTS.mono};font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:${t.muted}}
        .md-gate-r h3{font-family:${MN_FONTS.display};font-weight:700;font-size:32px;letter-spacing:-0.03em;margin-bottom:8px}
        .md-pwd{background:transparent;border:0;border-bottom:2px solid ${t.bg};color:${t.bg};padding:18px 0;font-family:${MN_FONTS.display};font-weight:700;font-size:26px;letter-spacing:0.04em;outline:none;width:100%;text-transform:lowercase}
        .md-pwd::placeholder{color:rgba(245,244,241,0.4)}
        .md-pwd.err{border-color:${t.accent};animation:mdShake .42s cubic-bezier(.36,.07,.19,.97)}
        @keyframes mdShake{10%,90%{transform:translateX(-2px)}20%,80%{transform:translateX(4px)}30%,50%,70%{transform:translateX(-7px)}40%,60%{transform:translateX(7px)}}
        .md-gate-r .hint{font-family:${MN_FONTS.mono};font-size:10px;text-transform:uppercase;color:${t.muted};letter-spacing:0.06em}

        /* hero */
        .md-hero{display:grid;grid-template-columns:5fr 7fr;border-bottom:1px solid ${t.line}}
        @media(max-width:980px){.md-hero{grid-template-columns:1fr}}
        .md-hero-l{padding:48px 32px;display:flex;flex-direction:column;justify-content:space-between;border-right:1px solid ${t.line};gap:24px}
        @media(max-width:980px){.md-hero-l{padding:32px 20px;border-right:0;border-bottom:1px solid ${t.line}}}
        .md-hero-l .eb{font-family:${MN_FONTS.mono};font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:${t.muted};display:flex;align-items:center;gap:10px}
        .md-hero-l .eb .dot{width:8px;height:8px;border-radius:50%;background:${t.accent}}
        .md-hero-l h1{font-family:${MN_FONTS.display};font-weight:800;font-size:88px;letter-spacing:-0.05em;line-height:0.92;margin:24px 0 32px}
        @media(max-width:780px){.md-hero-l h1{font-size:54px}}
        .md-hero-l h1 .ac{color:${t.accent}}
        .md-hero-l .meta{display:grid;grid-template-columns:1fr 1fr;border:1px solid ${t.line};border-bottom:0}
        .md-hero-l .meta > div{padding:14px 18px;border-right:1px solid ${t.line};border-bottom:1px solid ${t.line}}
        .md-hero-l .meta > div:nth-child(2n){border-right:0}
        .md-hero-l .meta .k{font-family:${MN_FONTS.mono};font-size:10px;color:${t.muted};text-transform:uppercase;margin-bottom:5px;letter-spacing:0.06em}
        .md-hero-l .meta .v{font-family:${MN_FONTS.display};font-weight:700;font-size:18px;letter-spacing:-0.02em}
        .md-hero-r{position:relative;overflow:hidden;min-height:360px}
        .md-hero-r img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .md-hero-r .mark{position:absolute;left:24px;bottom:24px;background:${t.fg};color:${t.bg};padding:8px 12px;font-family:${MN_FONTS.mono};font-size:10px;letter-spacing:0.06em;text-transform:uppercase}

        /* CTA */
        .md-cta{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid ${t.line}}
        @media(max-width:980px){.md-cta{grid-template-columns:1fr}}
        .md-cta-l{padding:48px 32px;border-right:1px solid ${t.line}}
        @media(max-width:980px){.md-cta-l{padding:32px 20px;border-right:0;border-bottom:1px solid ${t.line}}}
        .md-cta-l h3{font-family:${MN_FONTS.display};font-weight:700;font-size:36px;letter-spacing:-0.03em;line-height:1.05;margin-bottom:14px}
        .md-cta-l p{color:${t.muted};line-height:1.6;font-size:15px;max-width:520px}
        .md-cta-r{padding:48px 32px;display:flex;flex-direction:column;justify-content:center;gap:14px}
        @media(max-width:980px){.md-cta-r{padding:32px 20px}}

        /* toolbar */
        .md-tb{position:sticky;top:0;display:grid;grid-template-columns:auto 1fr auto;align-items:center;padding:14px 28px;border-bottom:1px solid ${t.line};background:${t.bg};z-index:10;gap:14px}
        @media(max-width:980px){.md-tb{grid-template-columns:1fr;padding:12px 20px;gap:8px}.md-tb .c{display:none !important}}
        .md-tb .l{display:flex;gap:8px;flex-wrap:wrap}
        .md-tb .c{justify-self:center;font-family:${MN_FONTS.mono};font-size:10px;text-transform:uppercase;color:${t.muted};display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
        .md-tb .c .nav{cursor:pointer;color:${t.fg}}
        .md-tb .c .nav:hover{color:${t.accent}}
        .md-tb .r{display:flex;gap:8px;align-items:center;font-family:${MN_FONTS.mono};font-size:10px;text-transform:uppercase;color:${t.muted};flex-wrap:wrap}
        .md-pill{font-family:${MN_FONTS.mono};font-size:10px;letter-spacing:0.06em;text-transform:uppercase;padding:9px 14px;border:1px solid ${t.line};color:${t.fg};background:transparent;cursor:pointer;transition:all .15s ease}
        .md-pill.on{background:${t.fg};color:${t.bg};border-color:${t.fg}}
        .md-pill .c{margin-left:8px;color:${t.accent}}
        .md-pill.on .c{color:${t.bg};opacity:0.5}

        /* section */
        .md-section{border-bottom:1px solid ${t.line}}
        .md-section-h{display:grid;grid-template-columns:auto 1fr auto;align-items:center;padding:32px 28px;gap:24px;border-bottom:1px solid ${t.line}}
        @media(max-width:780px){.md-section-h{grid-template-columns:1fr;padding:24px 20px;gap:14px}}
        .md-section-h .no{font-family:${MN_FONTS.display};font-weight:800;font-size:80px;letter-spacing:-0.05em;line-height:0.85;color:${t.fg}}
        @media(max-width:780px){.md-section-h .no{font-size:54px}}
        .md-section-h .no .ac{color:${t.accent}}
        .md-section-h .ti{font-family:${MN_FONTS.display};font-weight:700;font-size:42px;letter-spacing:-0.04em}
        @media(max-width:780px){.md-section-h .ti{font-size:28px}}
        .md-section-h .info{display:grid;grid-template-columns:repeat(3,auto);gap:18px;font-family:${MN_FONTS.mono};font-size:11px;text-transform:uppercase;color:${t.muted}}
        .md-section-h .info b{color:${t.fg};font-weight:500}

        .md-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0}
        @media(max-width:980px){.md-grid{grid-template-columns:repeat(3,1fr)}.md-cell:nth-child(4n){border-right:1px solid ${t.line}}.md-cell:nth-child(3n){border-right:0}}
        @media(max-width:680px){.md-grid{grid-template-columns:repeat(2,1fr)}.md-cell:nth-child(3n){border-right:1px solid ${t.line}}.md-cell:nth-child(2n){border-right:0}}
        .md-cell{position:relative;aspect-ratio:3/4;cursor:zoom-in;overflow:hidden;background:${t.hairline};border-right:1px solid ${t.line};border-bottom:1px solid ${t.line}}
        .md-cell:nth-child(4n){border-right:0}
        .md-cell img{width:100%;height:100%;object-fit:cover;transition:transform .55s cubic-bezier(0.22,1,0.36,1)}
        .md-cell:hover img{transform:scale(1.04)}
        .md-cell .n{position:absolute;top:10px;left:10px;background:${t.bg};color:${t.fg};font-family:${MN_FONTS.mono};font-size:9px;letter-spacing:0.06em;text-transform:uppercase;padding:4px 7px}
        .md-cell .acts{position:absolute;top:10px;right:10px;display:flex;gap:6px}
        .md-act{width:28px;height:28px;border:1px solid ${t.line};background:${t.bg};color:${t.fg};display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;transition:all .15s ease;opacity:0}
        .md-cell:hover .md-act,.md-act.on{opacity:1}
        .md-act:hover{background:${t.fg};color:${t.bg}}
        .md-act.on{background:${t.accent};border-color:${t.accent};color:#FFF}
        .md-cell.selected::after{content:"";position:absolute;inset:0;outline:3px solid ${t.accent};outline-offset:-3px;pointer-events:none}

        /* footer */
        .md-foot{display:grid;grid-template-columns:1fr 1fr 1fr;padding:20px 32px;font-family:${MN_FONTS.mono};font-size:10px;text-transform:uppercase;color:${t.muted}}
        .md-foot .c{text-align:center}.md-foot .r{text-align:right}
        @media(max-width:780px){.md-foot{grid-template-columns:1fr;text-align:left;padding:18px 20px;gap:6px}.md-foot .c,.md-foot .r{text-align:left}}

        /* selection floater */
        .md-floater{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:${t.fg};color:${t.bg};display:flex;align-items:center;gap:14px;padding:12px 12px 12px 18px;box-shadow:0 24px 60px rgba(0,0,0,0.18);font-family:${MN_FONTS.mono};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;z-index:15}
        .md-floater button{appearance:none;border:0;background:transparent;color:${t.bg};font-family:${MN_FONTS.mono};font-size:11px;text-transform:uppercase;cursor:pointer;padding:8px 12px;letter-spacing:0.06em}
        .md-floater .dl{background:${t.accent};color:#FFF}
        .md-floater .dl:hover{background:${t.bg};color:${t.fg}}
        .md-floater b{font-family:${MN_FONTS.display};font-weight:800;font-size:18px;color:${t.accent}}

        /* lightbox */
        .md-lb{position:fixed;inset:0;z-index:80;background:${t.bg};display:flex;align-items:center;justify-content:center}
        .md-lb-bar{position:fixed;top:0;left:0;right:0;display:grid;grid-template-columns:1fr 1fr 1fr;padding:18px 28px;border-bottom:1px solid ${t.line};background:${t.bg};font-family:${MN_FONTS.mono};font-size:11px;text-transform:uppercase;color:${t.fg};letter-spacing:0.06em}
        .md-lb-bar .c{justify-self:center}.md-lb-bar .r{justify-self:end;display:flex;gap:8px}
        .md-lb-img{max-width:78vw;max-height:74vh;object-fit:contain}
        .md-lb-foot{position:fixed;bottom:0;left:0;right:0;display:grid;grid-template-columns:1fr 1fr 1fr;padding:16px 28px;border-top:1px solid ${t.line};background:${t.bg};font-family:${MN_FONTS.mono};font-size:11px;text-transform:uppercase;color:${t.fg};letter-spacing:0.06em}
        .md-lb-foot .c{justify-self:center}.md-lb-foot .r{justify-self:end;display:flex;gap:8px}
        .md-lb-arrow{position:fixed;top:50%;transform:translateY(-50%);width:48px;height:48px;border:1px solid ${t.line};background:${t.bg};color:${t.fg};cursor:pointer;font-size:14px;transition:all .18s ease;display:flex;align-items:center;justify-content:center}
        .md-lb-arrow:hover{background:${t.fg};color:${t.bg}}
        .md-lb-arrow.l{left:24px}.md-lb-arrow.r{right:24px}
        .md-lb-x{background:transparent;border:0;font-family:${MN_FONTS.mono};font-size:11px;text-transform:uppercase;color:${t.fg};cursor:pointer;letter-spacing:0.06em}
        .md-lb-act{font-family:${MN_FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:0.06em;padding:7px 12px;border:1px solid ${t.line};background:${t.bg};color:${t.fg};cursor:pointer;transition:all .15s ease}
        .md-lb-act:hover{background:${t.fg};color:${t.bg}}
        .md-lb-act.on{background:${t.accent};border-color:${t.accent};color:#FFF}
      `}</style>

      <div className="md-stripe" />

      {!unlocked && (
        <div className="md-gate">
          <div className="md-gate-l">
            <div className="md-gate-mark"><span className="sq" />Monolith</div>
            <div>
              <div className="mn-eyebrow" style={{ color: t.muted, marginBottom: 14 }}>Private delivery · Ref. {data.ref}</div>
              <h1>{data.client.split(" & ")[0]} <span className="ac">&amp;</span><br />{data.client.split(" & ")[1]}</h1>
            </div>
            <div className="md-gate-meta">
              <div><div className="k">Date</div><div className="v">{data.eventDate}</div></div>
              <div><div className="k">Frames</div><div className="v">{data.total}</div></div>
              <div><div className="k">Location</div><div className="v">Alenquer, PT</div></div>
              <div><div className="k">Expires in</div><div className="v">{data.expiryDays}d</div></div>
            </div>
          </div>
          <div className="md-gate-r">
            <div className="eb">Step 01 / Authenticate</div>
            <h3>Enter delivery code.</h3>
            <form onSubmit={tryUnlock}>
              <input className={`md-pwd ${err ? "err" : ""}`} type="password" placeholder="* * * * * *" value={pwd} onChange={(e) => setPwd(e.target.value)} autoFocus />
            </form>
            <button className="mn-btn accent" onClick={() => tryUnlock()} style={{ alignSelf: "flex-start" }}>Open delivery →</button>
            <div className="hint">Hint: a city in Portugal · Trouble? studio@monolith.photo</div>
          </div>
        </div>
      )}

      {unlocked && (
        <>
          <section className="md-hero">
            <div className="md-hero-l">
              <div className="eb"><span className="dot" />Delivery · {data.ref}</div>
              <h1>{data.client.split(" & ")[0]}<br /><span className="ac">&amp;</span> {data.client.split(" & ")[1]}</h1>
              <div className="meta">
                <div><div className="k">Date</div><div className="v">{data.eventDate}</div></div>
                <div><div className="k">Photographer</div><div className="v">Y. Sokol</div></div>
                <div><div className="k">Location</div><div className="v">Alenquer, PT</div></div>
                <div><div className="k">Frames</div><div className="v">{data.total}</div></div>
                <div><div className="k">Sections</div><div className="v">{data.sections.length}</div></div>
                <div><div className="k">Expires in</div><div className="v">{data.expiryDays} days</div></div>
              </div>
            </div>
            <div className="md-hero-r">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.sections[0]!.photos[0]!.src} alt="" />
              <div className="mark">Cover · 01.01</div>
            </div>
          </section>

          <section className="md-cta">
            <div className="md-cta-l">
              <h3>Take your time.<br />Mark favorites. Download anything.</h3>
              <p>Your full gallery is retouched and color-graded. Use the <b>♥</b> to flag prints. Shift-click any photo to multi-select. The link expires {data.expiryDays} days from delivery.</p>
            </div>
            <div className="md-cta-r">
              <button className="mn-btn">Download favorites only</button>
              <button className="mn-btn solid">Download all · 4.2 GB ↓</button>
              <button className="mn-btn" style={{ borderColor: t.hairline, color: t.muted }}>Order prints →</button>
            </div>
          </section>

          <div className="md-tb">
            <div className="l">
              <button className={`md-pill ${filter === "all" ? "on" : ""}`} onClick={() => setFilter("all")}>All <span className="c">{allPhotos.length}</span></button>
              <button className={`md-pill ${filter === "fav" ? "on" : ""}`} onClick={() => setFilter("fav")}>Favorites <span className="c">{favs.size}</span></button>
            </div>
            <div className="c">
              {data.sections.map((s) => (
                <span key={s.id} className="nav" onClick={() => {
                  document.getElementById(`md-sec-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}>{s.no} · {s.label}</span>
              ))}
            </div>
            <div className="r">
              <span>{visible.length} showing</span>
              <button className="md-pill" onClick={() => sel.size === visible.length ? setSel(new Set()) : setSel(new Set(visible.map((p) => p.id)))}>
                {sel.size === visible.length && sel.size > 0 ? "Deselect" : "Select all"}
              </button>
              <button className="md-pill" style={{ background: t.accent, borderColor: t.accent, color: "#FFF" }}>Download ↓</button>
            </div>
          </div>

          {data.sections.map((sec) => {
            const showing = filter === "fav" ? sec.photos.filter((p) => favs.has(p.id)) : sec.photos;
            if (filter === "fav" && showing.length === 0) return null;
            return (
              <section key={sec.id} id={`md-sec-${sec.id}`} className="md-section">
                <div className="md-section-h">
                  <div className="no"><span className="ac">{sec.no.charAt(0)}</span>{sec.no.charAt(1)}</div>
                  <div className="ti">{sec.label}</div>
                  <div className="info">
                    <span><b>{sec.photos.length}</b> frames</span>
                    <span>·</span>
                    <span>Marked: <b>{sec.photos.filter((p) => favs.has(p.id)).length}</b></span>
                    <span>·</span>
                    <span>{sec.id.toUpperCase()}</span>
                  </div>
                </div>
                <div className="md-grid">
                  {showing.map((ph, i) => {
                    const photoIdx = allPhotos.findIndex((x) => x.id === ph.id);
                    return (
                      <div
                        key={ph.id + i}
                        className={`md-cell ${sel.has(ph.id) ? "selected" : ""}`}
                        onClick={(e) => {
                          if (e.shiftKey) toggleSel(ph.id);
                          else if (photoIdx >= 0) setLightbox({ photos: allPhotos, index: photoIdx });
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={ph.src} alt={ph.title} />
                        <div className="n">{sec.no}.{String(i + 1).padStart(3, "0")}</div>
                        <div className="acts">
                          <div className={`md-act ${sel.has(ph.id) ? "on" : ""}`} onClick={(e) => { e.stopPropagation(); toggleSel(ph.id); }}>{sel.has(ph.id) ? "✓" : "+"}</div>
                          <div className={`md-act ${favs.has(ph.id) ? "on" : ""}`} onClick={(e) => { e.stopPropagation(); toggleFav(ph.id); }}>♥</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <footer className="md-foot">
            <div>© Studio Yara Sokol</div>
            <div className="c">Delivered {data.eventDate} · expires in {data.expiryDays}d</div>
            <div className="r">v12.04 · {data.ref}</div>
          </footer>

          {sel.size > 0 && (
            <div className="md-floater">
              <span><b>{sel.size}</b> selected</span>
              <button onClick={() => setSel(new Set())}>Clear</button>
              <button className="dl">Download ↓</button>
            </div>
          )}

          {lightbox && lightbox.photos[lightbox.index] && (
            <div className="md-lb">
              <div className="md-lb-bar">
                <span>{String(lightbox.index + 1).padStart(3, "0")} / {String(lightbox.photos.length).padStart(3, "0")}</span>
                <span className="c">{lightbox.photos[lightbox.index]!.sectionNo} · {lightbox.photos[lightbox.index]!.sectionLabel}</span>
                <span className="r"><button className="md-lb-x" onClick={() => setLightbox(null)}>Close ✕</button></span>
              </div>
              <button className="md-lb-arrow l" onClick={() => setLightbox((l) => l && ({ ...l, index: (l.index - 1 + l.photos.length) % l.photos.length }))}>←</button>
              <button className="md-lb-arrow r" onClick={() => setLightbox((l) => l && ({ ...l, index: (l.index + 1) % l.photos.length }))}>→</button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="md-lb-img" src={lightbox.photos[lightbox.index]!.src} alt="" />
              <div className="md-lb-foot">
                <span>{lightbox.photos[lightbox.index]!.title}</span>
                <span className="c">{lightbox.photos[lightbox.index]!.date}</span>
                <span className="r">
                  <button className={`md-lb-act ${favs.has(lightbox.photos[lightbox.index]!.id) ? "on" : ""}`} onClick={() => toggleFav(lightbox.photos[lightbox.index]!.id)}>♥ Favorite (F)</button>
                  <button className="md-lb-act">↓ Download</button>
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
