"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HL_TOKENS, HL_FONTS, HL_PORTFOLIO, HL_PHOTOS, hlBaseCss, type HlPhoto } from "~/lib/halcyon/data";

type Lightbox = { photos: (HlPhoto & { projectTitle?: string })[]; index: number } | null;

export default function HalcyonPortfolioPage() {
  const t    = HL_TOKENS;
  const data = HL_PORTFOLIO;

  const [navOpen,       setNavOpen]       = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [galleryOpen,   setGalleryOpen]   = useState(false);
  const [lightbox,      setLightbox]      = useState<Lightbox>(null);
  const [hoverIdx,      setHoverIdx]      = useState(-1);

  const allPhotos = useMemo(
    () => data.projects.flatMap((p) => p.photos.map((ph) => ({ ...ph, projectTitle: p.title }))),
    [data]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (lightbox)             setLightbox(null);
        else if (galleryOpen)     setGalleryOpen(false);
        else if (activeProject)   setActiveProject(null);
        else if (navOpen)         setNavOpen(false);
      }
      if (lightbox) {
        if (e.key === "ArrowRight") setLightbox((l) => l && ({ ...l, index: (l.index + 1) % l.photos.length }));
        if (e.key === "ArrowLeft")  setLightbox((l) => l && ({ ...l, index: (l.index - 1 + l.photos.length) % l.photos.length }));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, galleryOpen, activeProject, navOpen]);

  const project = data.projects.find((p) => p.id === activeProject);

  return (
    <div className="hl-root" style={{ minHeight: "100dvh", position: "relative", overflow: "hidden" }}>
      <style>{hlBaseCss(t)}</style>
      <style>{`
        .hp-nav{position:absolute;top:0;left:0;right:0;z-index:30;display:flex;justify-content:space-between;align-items:center;padding:24px 32px;color:${t.fg};text-shadow:0 1px 16px rgba(0,0,0,0.55)}
        .hp-mark{font-family:${HL_FONTS.serif};font-size:24px;letter-spacing:-0.02em;font-weight:400;color:${t.fg};padding:6px 14px;border-radius:999px;background:rgba(14,13,11,0.32);backdrop-filter:blur(10px);border:1px solid rgba(239,234,224,0.18)}
        .hp-mark em{font-style:italic;font-weight:400;color:${t.accent}}
        .hp-burger{display:flex;flex-direction:column;gap:5px;cursor:pointer;background:transparent;border:0;padding:8px}
        .hp-burger span{display:block;width:22px;height:1px;background:${t.fg};transition:transform .3s ease}
        .hp-burger:hover span:first-child{transform:translateX(-3px)}
        .hp-burger:hover span:last-child{transform:translateX(3px)}

        .hp-cover{position:relative;height:780px;overflow:hidden}
        .hp-cover-img{position:absolute;inset:0;background:url('${data.projects[1]!.cover}') center/cover}
        .hp-cover-img::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,13,11,0.35) 0%,rgba(14,13,11,0) 22%,rgba(14,13,11,0) 45%,rgba(14,13,11,0.55) 75%,rgba(14,13,11,0.92) 100%)}
        .hp-cover-meta{position:absolute;bottom:48px;left:32px;right:32px;display:flex;justify-content:space-between;align-items:flex-end;gap:48px;flex-wrap:wrap}
        .hp-cover-title{font-family:${HL_FONTS.serif};font-size:140px;line-height:0.92;letter-spacing:-0.04em;font-weight:400}
        .hp-cover-title em{font-style:italic;font-weight:400}
        @media(max-width:780px){.hp-cover-title{font-size:88px}}
        .hp-scroll-hint{display:flex;flex-direction:column;align-items:center;gap:6px;color:${t.fg}}
        .hp-scroll-hint .line{width:1px;height:36px;background:${t.fg};opacity:0.5;animation:hpScrollLine 2.4s infinite ease-in-out}
        @keyframes hpScrollLine{0%{transform:scaleY(0.2);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}50.01%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0.2);transform-origin:bottom}}

        .hp-section-label{display:flex;align-items:center;gap:14px;padding:0 32px;margin:96px 0 32px;color:${t.muted}}
        .hp-section-label .dot{width:6px;height:6px;border-radius:50%;background:${t.accent}}
        .hp-section-label hr{flex:1;border:0;border-top:1px solid ${t.line}}

        .hp-index{padding:0 32px;border-top:1px solid ${t.line};position:relative}
        .hp-index-row{display:grid;grid-template-columns:60px 1fr 200px 120px 32px;gap:24px;align-items:center;padding:28px 0;border-bottom:1px solid ${t.line};cursor:pointer;position:relative;transition:padding .35s cubic-bezier(0.22,1,0.36,1)}
        .hp-index-row:hover{padding-left:18px}
        .hp-index-row .no{font-family:${HL_FONTS.mono};font-size:11px;letter-spacing:0.08em;color:${t.muted}}
        .hp-index-row .ti{font-family:${HL_FONTS.serif};font-size:54px;line-height:1;letter-spacing:-0.02em;font-weight:400;transition:transform .22s cubic-bezier(0.22,1,0.36,1),color .15s ease}
        .hp-index-row:hover .ti{font-style:italic;transform:translateX(8px)}
        .hp-index-row .ta{font-family:${HL_FONTS.mono};font-size:10px;letter-spacing:0.1em;color:${t.muted};text-transform:uppercase}
        .hp-index-row .yr{font-family:${HL_FONTS.mono};font-size:11px;color:${t.muted};text-align:right}
        .hp-index-row .ar{justify-self:end;color:${t.muted};transition:transform .35s ease,color .35s ease}
        .hp-index-row:hover .ar{transform:translateX(6px);color:${t.accent}}
        @media(max-width:780px){
          .hp-index-row{grid-template-columns:40px 1fr 24px;gap:12px}
          .hp-index-row .ti{font-size:30px}
          .hp-index-row .ta,.hp-index-row .yr{display:none}
        }

        .hp-thumb-float{position:absolute;width:240px;height:300px;pointer-events:none;z-index:5;opacity:0;transition:opacity .2s ease,transform .25s cubic-bezier(0.22,1,0.36,1)}
        .hp-thumb-float.show{opacity:1}
        .hp-thumb-float img{width:100%;height:100%;object-fit:cover}

        .hp-cta-row{display:flex;justify-content:space-between;align-items:center;padding:48px 32px 0;flex-wrap:wrap;gap:16px}

        .hp-about{display:grid;grid-template-columns:1fr 1.2fr;gap:64px;padding:0 32px;align-items:center}
        @media(max-width:780px){.hp-about{grid-template-columns:1fr;gap:32px}}
        .hp-about-portrait{aspect-ratio:3/4;background:url('${HL_PHOTOS.portraits![2]!.src}') center/cover;background-color:${t.raised}}
        .hp-about h2{font-family:${HL_FONTS.serif};font-size:72px;line-height:0.95;letter-spacing:-0.03em;margin-bottom:24px;font-weight:400}
        .hp-about h2 em{font-style:italic}
        .hp-about p{font-size:16px;line-height:1.7;color:${t.fg};max-width:520px}
        .hp-about-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:48px;border-top:1px solid ${t.line};border-bottom:1px solid ${t.line};max-width:520px}
        .hp-about-stats > div{padding:20px 0;border-right:1px solid ${t.line}}
        .hp-about-stats > div:last-child{border-right:0}
        .hp-about-stats .v{font-family:${HL_FONTS.serif};font-size:36px;line-height:1;font-weight:400}
        .hp-about-stats .l{font-family:${HL_FONTS.mono};font-size:9px;letter-spacing:0.12em;color:${t.muted};text-transform:uppercase;margin-top:8px}

        .hp-contact{padding:120px 32px;text-align:center;border-top:1px solid ${t.line}}
        .hp-contact h2{font-family:${HL_FONTS.serif};font-size:96px;line-height:1;letter-spacing:-0.03em;font-weight:400;margin-bottom:24px}
        @media(max-width:780px){.hp-contact h2{font-size:56px}}
        .hp-contact h2 em{font-style:italic;color:${t.accent}}
        .hp-contact .tag{max-width:480px;margin:0 auto 40px;color:${t.muted};line-height:1.6}
        .hp-contact-form{max-width:520px;margin:0 auto;display:grid;gap:0}
        .hp-contact-form input,.hp-contact-form textarea{background:transparent;border:0;border-bottom:1px solid ${t.line};color:${t.fg};font-family:${HL_FONTS.sans};font-size:14px;padding:18px 0;outline:none;transition:border-color .2s ease}
        .hp-contact-form input:focus,.hp-contact-form textarea:focus{border-color:${t.accent}}
        .hp-contact-form textarea{resize:none;min-height:120px;font-family:${HL_FONTS.sans}}
        .hp-contact-actions{display:flex;justify-content:space-between;align-items:center;margin-top:32px;flex-wrap:wrap;gap:12px}

        .hp-foot{display:flex;justify-content:space-between;align-items:center;padding:32px;border-top:1px solid ${t.line};color:${t.muted};flex-wrap:wrap;gap:16px}
        .hp-foot .mark{font-family:${HL_FONTS.serif};font-size:18px;color:${t.fg}}
        .hp-foot .mark em{font-style:italic}
        .hp-foot .links{display:flex;gap:24px}

        .hp-drawer{position:fixed;inset:0;z-index:50;background:${t.bg};display:flex;align-items:center;padding:48px 64px;transform:translateX(-100%);transition:transform .55s cubic-bezier(0.76,0,0.24,1)}
        .hp-drawer.open{transform:translateX(0)}
        .hp-drawer .col-l{width:55%}
        .hp-drawer .col-r{width:45%;height:80%;background:url('${data.projects[0]!.cover}') center/cover}
        @media(max-width:780px){.hp-drawer{padding:32px}.hp-drawer .col-l{width:100%}.hp-drawer .col-r{display:none}}
        .hp-drawer ul{list-style:none}
        .hp-drawer li{padding:18px 0;border-bottom:1px solid ${t.line};font-family:${HL_FONTS.serif};font-size:48px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:padding .35s ease,color .35s ease}
        .hp-drawer li:hover{padding-left:16px;font-style:italic;color:${t.accent}}
        .hp-drawer li .n{font-family:${HL_FONTS.mono};font-size:11px;color:${t.muted};font-style:normal}
        .hp-drawer-close{position:absolute;top:24px;right:32px;background:transparent;border:0;color:${t.fg};cursor:pointer;font-family:${HL_FONTS.mono};font-size:11px;letter-spacing:0.1em;text-transform:uppercase}

        .hp-detail{position:fixed;inset:0;z-index:40;background:${t.bg};overflow-y:auto;animation:hpFade .6s cubic-bezier(0.22,1,0.36,1)}
        @keyframes hpFade{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .hp-detail-hero{position:relative;height:520px;overflow:hidden}
        .hp-detail-hero img{width:100%;height:100%;object-fit:cover}
        .hp-detail-hero::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,13,11,0.25) 0%,rgba(14,13,11,0) 30%,rgba(14,13,11,0) 45%,rgba(14,13,11,0.65) 75%,rgba(14,13,11,0.96) 100%);z-index:1}
        .hp-detail-meta{position:absolute;bottom:48px;left:32px;right:32px;display:flex;justify-content:space-between;align-items:flex-end;gap:48px;color:#ffffff;flex-wrap:wrap;z-index:2}
        .hp-detail-title{font-family:${HL_FONTS.serif};font-size:104px;line-height:0.95;letter-spacing:-0.03em;font-weight:400;color:#ffffff;text-shadow:0 2px 24px rgba(0,0,0,0.45)}
        @media(max-width:780px){.hp-detail-title{font-size:56px}}
        .hp-detail-title em{font-style:italic}
        .hp-detail-info{font-family:${HL_FONTS.mono};font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;display:grid;gap:8px;text-align:right;min-width:220px}
        .hp-detail-info .row{display:flex;justify-content:space-between;gap:18px;border-bottom:1px solid rgba(255,255,255,0.4);padding-bottom:6px}
        /* Masonry — preserves each photo's native aspect ratio (portrait,
           square, more vertical) without forced cropping. Column-based so
           heights auto-balance; tighter padding than the old span-12 grid. */
        .hp-detail-grid{padding:48px 32px;column-count:3;column-gap:14px}
        @media(max-width:1100px){.hp-detail-grid{column-count:2}}
        @media(max-width:640px){.hp-detail-grid{column-count:1}}
        .hp-detail-grid .item{break-inside:avoid;margin-bottom:14px;position:relative;cursor:pointer;overflow:hidden;background:${t.raised}}
        .hp-detail-grid .item img{width:100%;height:auto;display:block;transition:transform .9s cubic-bezier(0.22,1,0.36,1)}
        .hp-detail-grid .item:hover img{transform:scale(1.04)}
        .hp-detail-back{position:fixed;top:24px;left:32px;z-index:41}
        .hp-detail-close{position:fixed;top:24px;right:32px;z-index:41;width:44px;height:44px;border-radius:50%;border:1px solid ${t.line};background:${t.raised};color:${t.fg};cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:${HL_FONTS.mono};font-size:14px;transition:all .25s ease}
        .hp-detail-close:hover{background:${t.fg};color:${t.bg};border-color:${t.fg};transform:rotate(90deg)}
        .hp-detail-close span{display:block;line-height:1}

        .hp-gallery{position:fixed;inset:0;z-index:45;background:${t.bg};overflow-y:auto;padding:32px;animation:hpFade .6s cubic-bezier(0.22,1,0.36,1)}
        .hp-gallery-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:48px;padding-top:48px;flex-wrap:wrap;gap:16px}
        .hp-gallery-head h2{font-family:${HL_FONTS.serif};font-size:96px;letter-spacing:-0.03em;line-height:0.95;font-weight:400}
        @media(max-width:780px){.hp-gallery-head h2{font-size:48px}}
        .hp-gallery-head h2 em{font-style:italic}
        .hp-mason{column-count:4;column-gap:18px}
        @media(max-width:1100px){.hp-mason{column-count:3}}
        @media(max-width:680px){.hp-mason{column-count:2;column-gap:8px}}
        .hp-mason .cell{break-inside:avoid;margin-bottom:18px;cursor:pointer;overflow:hidden;position:relative}
        .hp-mason .cell img{width:100%;display:block;transition:opacity .3s ease}
        .hp-mason .cell:hover img{opacity:0.85}
        .hp-mason .cell .cap{position:absolute;left:12px;bottom:12px;font-family:${HL_FONTS.mono};font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:${t.fg};background:rgba(14,13,11,0.7);padding:4px 8px;opacity:0;transition:opacity .25s ease}
        .hp-mason .cell:hover .cap{opacity:1}

        .hp-lb{position:fixed;inset:0;z-index:60;background:rgba(8,8,7,0.96);display:flex;align-items:center;justify-content:center;animation:hpFade .35s ease}
        .hp-lb-img{max-width:78vw;max-height:78vh;object-fit:contain;box-shadow:0 30px 80px rgba(0,0,0,0.6)}
        .hp-lb-meta{position:fixed;bottom:32px;left:0;right:0;display:flex;justify-content:space-between;padding:0 48px;color:${t.fg};flex-wrap:wrap;gap:8px}
        .hp-lb-counter{font-family:${HL_FONTS.mono};font-size:11px;letter-spacing:0.1em;text-transform:uppercase}
        .hp-lb-cap{font-family:${HL_FONTS.serif};font-style:italic;font-size:18px}
        .hp-lb-arrow{position:fixed;top:50%;transform:translateY(-50%);background:transparent;border:1px solid ${t.line};color:${t.fg};width:48px;height:48px;cursor:pointer;font-family:${HL_FONTS.mono};font-size:14px;transition:all .25s ease}
        .hp-lb-arrow:hover{background:${t.fg};color:${t.bg}}
        .hp-lb-arrow.l{left:32px}.hp-lb-arrow.r{right:32px}
        .hp-lb-x{position:fixed;top:32px;right:32px;background:transparent;border:0;color:${t.fg};cursor:pointer;font-family:${HL_FONTS.mono};font-size:11px;letter-spacing:0.1em;text-transform:uppercase}
      `}</style>

      <div className="hp-nav">
        <button className="hp-burger" onClick={() => setNavOpen(true)} aria-label="Open menu">
          <span></span><span></span><span></span>
        </button>
        <div className="hp-mark">Halcyon<em> Studio</em></div>
        <div className="hl-mono" style={{ color: t.fg, opacity: 0.85 }}>Lisbon · NYC · 24°</div>
      </div>

      <section className="hp-cover">
        <div className="hp-cover-img" />
        <div className="hp-cover-meta">
          <div>
            <div className="hl-eyebrow" style={{ color: t.fg, opacity: 0.7, marginBottom: 24 }}>
              <span style={{ color: t.accent }}>●</span>&nbsp;&nbsp;Photographs, 2014 — 2024
            </div>
            <h1 className="hp-cover-title">
              The light<br />keeps <em>arriving.</em>
            </h1>
          </div>
          <div className="hp-scroll-hint">
            <span className="hl-mono" style={{ color: t.fg, opacity: 0.7 }}>Scroll</span>
            <div className="line" />
          </div>
        </div>
      </section>

      <div className="hp-section-label hl-mono">
        <span className="dot" />
        <span>Selected Work</span>
        <hr />
        <span>{String(data.projects.length).padStart(2, "0")} Projects</span>
      </div>
      <div
        className="hp-index"
        onMouseLeave={() => setHoverIdx(-1)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const el = document.getElementById("hp-thumb-float");
          if (el) {
            /* Position the preview to the right of the cursor, vertically
               centered on it. Image is 300px tall → top offset = -150 */
            el.style.left = `${e.clientX - r.left + 24}px`;
            el.style.top  = `${e.clientY - r.top - 150}px`;
          }
        }}
      >
        <div id="hp-thumb-float" className={`hp-thumb-float ${hoverIdx >= 0 ? "show" : ""}`}>
          {hoverIdx >= 0 && data.projects[hoverIdx] && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={data.projects[hoverIdx]!.cover} alt="" />
          )}
        </div>
        {data.projects.map((p, i) => (
          <div
            key={p.id}
            className="hp-index-row"
            onMouseEnter={() => setHoverIdx(i)}
            onClick={() => setActiveProject(p.id)}
          >
            <span className="no">{p.no}</span>
            <span className="ti">{p.title}</span>
            <span className="ta">{p.tags.join(" · ")}</span>
            <span className="yr">{p.year}</span>
            <span className="ar">→</span>
          </div>
        ))}
      </div>

      <div className="hp-cta-row">
        <span className="hl-mono" style={{ color: t.muted }}>Or browse by photograph</span>
        <button className="hl-btn" onClick={() => setGalleryOpen(true)}>
          View all 184 photographs <span style={{ color: t.accent }}>↗</span>
        </button>
      </div>

      <div className="hp-section-label hl-mono">
        <span className="dot" />
        <span>About</span>
        <hr />
        <span>Lior Avni · b. 1989</span>
      </div>
      <section className="hp-about">
        <div className="hp-about-portrait" role="img" aria-label="Portrait" />
        <div>
          <h2>Pictures to <em>live with,</em><br />not scroll past.</h2>
          <p>{data.brand.bio}</p>
          <div className="hp-about-stats">
            {data.brand.stats.map((s) => (
              <div key={s.label}>
                <div className="v">{s.value}</div>
                <div className="l">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hp-contact">
        <div className="hl-eyebrow" style={{ marginBottom: 24 }}>
          <span style={{ color: t.accent }}>●</span>&nbsp;&nbsp;Available for 2025 commissions
        </div>
        <h2>Begin a <em>conversation.</em></h2>
        <p className="tag">Tell me about the day, the room, the people. The best work always starts with a long letter and a slow reply.</p>
        <form className="hp-contact-form" onSubmit={(e) => e.preventDefault()}>
          <input placeholder="Your name" />
          <input placeholder="Email" type="email" />
          <input placeholder="Project · date · place" />
          <textarea placeholder="A few sentences about what you have in mind." />
          <div className="hp-contact-actions">
            <span className="hl-mono" style={{ color: t.muted }}>or write to studio@halcyon.photo</span>
            <button type="submit" className="hl-btn hl-btn-accent">Send letter →</button>
          </div>
        </form>
      </section>

      <footer className="hp-foot">
        <div className="mark">Halcyon<em> Studio</em></div>
        <div className="hl-mono">© MMXXIV · All photographs © Lior Avni</div>
        <div className="links hl-mono">
          <a className="hl-link" href="#">Instagram</a>
          <a className="hl-link" href="#">Journal</a>
          <a className="hl-link" href="#">Print Shop</a>
          <a className="hl-link" href="#">Colophon</a>
        </div>
      </footer>

      <div className={`hp-drawer ${navOpen ? "open" : ""}`}>
        <button className="hp-drawer-close" onClick={() => setNavOpen(false)}>Close ✕</button>
        <div className="col-l">
          <div className="hl-eyebrow" style={{ marginBottom: 32 }}>Index</div>
          <ul>
            {data.projects.map((p) => (
              <li key={p.id} onClick={() => { setActiveProject(p.id); setNavOpen(false); }}>
                <span>{p.title}</span>
                <span className="n">{p.no} · {p.year}</span>
              </li>
            ))}
            <li onClick={() => { setGalleryOpen(true); setNavOpen(false); }}>
              <span>All photographs</span>
              <span className="n">↗</span>
            </li>
          </ul>
        </div>
        <div className="col-r" />
      </div>

      <AnimatePresence>
      {project && (
        <motion.div
          key="hp-detail"
          className="hp-detail"
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32, scale: 0.97, transition: { duration: 0.32, ease: [0.76, 0, 0.24, 1] } }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <button className="hl-btn hl-btn-accent hp-detail-back" onClick={() => setActiveProject(null)}>← Back to home</button>
          <button className="hp-detail-close" onClick={() => setActiveProject(null)} aria-label="Close project"><span>✕</span></button>
          <div className="hp-detail-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.cover} alt={project.title} />
            <div className="hp-detail-meta">
              <h1 className="hp-detail-title">{project.title.split(" ").map((w, i) => i % 2 ? <em key={i}>{w} </em> : <span key={i}>{w} </span>)}</h1>
              <div className="hp-detail-info">
                <div className="row"><span>No.</span><span>{project.no}</span></div>
                <div className="row"><span>Year</span><span>{project.year}</span></div>
                <div className="row"><span>Tags</span><span>{project.tags.join(" · ")}</span></div>
                <div className="row"><span>Frames</span><span>{project.photos.length}</span></div>
              </div>
            </div>
          </div>
          <div className="hp-detail-grid">
            {project.photos.map((ph, i) => (
              <div key={ph.id} className="item" onClick={() => setLightbox({ photos: project.photos, index: i })}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ph.src} alt={ph.title} loading="lazy" />
              </div>
            ))}
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {galleryOpen && (
        <div className="hp-gallery">
          <button className="hl-btn hp-detail-back" style={{ position: "absolute", top: 24, left: 32 }} onClick={() => setGalleryOpen(false)}>← Close</button>
          <button className="hp-detail-close" style={{ position: "absolute" }} onClick={() => setGalleryOpen(false)} aria-label="Close gallery"><span>✕</span></button>
          <div className="hp-gallery-head">
            <div>
              <div className="hl-eyebrow" style={{ marginBottom: 16 }}>The Archive · 2014–2024</div>
              <h2>Every <em>photograph,</em><br />in one room.</h2>
            </div>
            <div className="hl-mono" style={{ color: t.muted, textAlign: "right" }}>
              {allPhotos.length} frames<br />Across {data.projects.length} stories
            </div>
          </div>
          <div className="hp-mason">
            {allPhotos.map((ph, i) => (
              <div key={ph.id + i} className="cell" onClick={() => setLightbox({ photos: allPhotos, index: i })}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ph.src} alt={ph.title} />
                <div className="cap">{ph.title} · {ph.projectTitle}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lightbox && lightbox.photos[lightbox.index] && (
        <div className="hp-lb" onClick={(e) => { if (e.target === e.currentTarget) setLightbox(null); }}>
          <button className="hp-lb-x" onClick={() => setLightbox(null)}>Close ✕</button>
          <button className="hp-lb-arrow l" onClick={() => setLightbox((l) => l && ({ ...l, index: (l.index - 1 + l.photos.length) % l.photos.length }))}>←</button>
          <button className="hp-lb-arrow r" onClick={() => setLightbox((l) => l && ({ ...l, index: (l.index + 1) % l.photos.length }))}>→</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hp-lb-img" src={lightbox.photos[lightbox.index]!.src} alt="" />
          <div className="hp-lb-meta">
            <div className="hp-lb-counter">{String(lightbox.index + 1).padStart(3, "0")} / {String(lightbox.photos.length).padStart(3, "0")}</div>
            <div className="hp-lb-cap">{lightbox.photos[lightbox.index]!.title}</div>
            <div className="hp-lb-counter">{lightbox.photos[lightbox.index]!.date}</div>
          </div>
        </div>
      )}
    </div>
  );
}
