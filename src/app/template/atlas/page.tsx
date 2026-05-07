"use client";

import { useEffect, useRef, useState } from "react";
import { ATLAS_U, ATLAS_PROJECTS, ATLAS_RATIOS, AT_FONTS } from "~/lib/atlas/data";

export default function AtlasPortfolioPage() {
  const [navOpen, setNavOpen]   = useState(false);
  const [hovered, setHovered]   = useState<string | null>(null);
  const [cursor,  setCursor]    = useState({ x: 0, y: 0 });
  const [active,  setActive]    = useState<string | null>(null);
  const [waOpen,  setWaOpen]    = useState(false);
  const [waMsg,   setWaMsg]     = useState("Hi Atlas — I'd like to talk about a project. ");
  const [lightbox, setLightbox] = useState<{ photos: string[]; idx: number } | null>(null);
  const indexRef = useRef<HTMLDivElement>(null);
  const project = ATLAS_PROJECTS.find((p) => p.id === active);

  function onMove(e: React.MouseEvent) {
    if (!indexRef.current) return;
    const r = indexRef.current.getBoundingClientRect();
    setCursor({ x: e.clientX - r.left, y: e.clientY - r.top });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (lightbox) setLightbox(null);
        else if (waOpen) setWaOpen(false);
        else if (active) setActive(null);
        else if (navOpen) setNavOpen(false);
      }
      if (lightbox) {
        if (e.key === "ArrowRight") setLightbox((l) => l && ({ ...l, idx: (l.idx + 1) % l.photos.length }));
        if (e.key === "ArrowLeft")  setLightbox((l) => l && ({ ...l, idx: (l.idx - 1 + l.photos.length) % l.photos.length }));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, waOpen, active, navOpen]);

  return (
    <div className="atp-root">
      <style>{ATP_CSS}</style>

      {/* fixed top chrome — hamburger + brand wordmark + contact */}
      <header className="atp-top">
        <button className="atp-hamb" aria-label="menu" onClick={() => setNavOpen(true)}>
          <span></span><span></span><span></span>
        </button>
        <div className="atp-top-brand">
          <span className="at-mark">a</span>
          <span className="atp-top-name">
            <span style={{ fontFamily: AT_FONTS.display, fontStyle: "italic", fontWeight: 400 }}>atlas</span>
            <span style={{ fontFamily: AT_FONTS.display, fontWeight: 600, marginLeft: 4 }}>studio.</span>
          </span>
        </div>
        <a href="#contact" className="atp-top-cta">Contact <span className="atp-top-cta-dot">●</span></a>
      </header>

      {/* Cover */}
      <section className="atp-cover">
        <div className="atp-cover-img at-imgwrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ATLAS_U("1469371670807-013ccf25f16a", 2200)} alt="" />
          <div className="atp-cover-tint" />
        </div>
        <div className="atp-cover-grid">
          <div className="atp-cover-eye">
            <span className="at-mono" style={{ color: "#fff", opacity: 0.65 }}>↳ Index 001 — 042</span>
          </div>
          <h1 className="atp-cover-title">
            <span>Photographer</span>
            <span className="atp-cover-italic">at large,</span>
            <span>since</span>
            <span className="atp-cover-num">2018</span>
          </h1>
          <div className="atp-cover-foot">
            <div>
              <div className="at-mono" style={{ color: "#fff", opacity: 0.55, marginBottom: 6 }}>Selected work</div>
              <div style={{ fontFamily: AT_FONTS.sans, color: "#fff", fontWeight: 500, fontSize: 15, letterSpacing: "-.01em" }}>
                Five years of weddings, editorial &amp; the in-between
              </div>
            </div>
            <a className="atp-cover-cta" href="#index">
              <span>Scroll for the work</span>
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none"><circle cx="17" cy="17" r="16.5" stroke="currentColor" opacity=".5"/><path d="M13 15l4 4 4-4" stroke="currentColor" strokeWidth="1.4" fill="none"/></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Index (cursor-follow image on desktop only) */}
      <section id="index" ref={indexRef} className="atp-index" onMouseMove={onMove}>
        <div className="atp-section-head">
          <span className="at-mono" style={{ color: "var(--at-muted)" }}>(02) Index</span>
          <h2 className="atp-h2">
            Five projects, <em>chosen</em>.<br />
            The rest in <span style={{ color: "var(--at-accent)" }}>the archive ↗</span>
          </h2>
        </div>

        <ul className="atp-list" onMouseLeave={() => setHovered(null)}>
          {ATLAS_PROJECTS.map((p) => (
            <li
              key={p.id}
              className={`atp-row ${hovered === p.id ? "is-hover" : ""} ${hovered && hovered !== p.id ? "is-dim" : ""}`}
              onMouseEnter={() => setHovered(p.id)}
              onClick={() => setActive(p.id)}
            >
              <span className="atp-row-no">{p.no}</span>
              <span className="atp-row-title">
                {p.title}<span className="atp-row-em" style={{ fontFamily: AT_FONTS.display }}>, <em>{p.subtitle.split(" ")[0]!.toLowerCase()}</em></span>
              </span>
              <span className="atp-row-kind">{p.kind}</span>
              <span className="atp-row-place">{p.place}</span>
              <span className="atp-row-year">{p.year}</span>
              <span className="atp-row-arrow">↗</span>
            </li>
          ))}
        </ul>

        {hovered && (() => {
          const p = ATLAS_PROJECTS.find((x) => x.id === hovered);
          if (!p) return null;
          return (
            <div className="atp-cursor" style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }}>
              <div className="at-imgwrap atp-cursor-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ATLAS_U(p.cover, 900)} alt="" />
              </div>
              <div className="atp-cursor-meta">
                <span className="at-mono" style={{ opacity: 0.55 }}>{p.no} ↗</span>
                <span style={{ fontFamily: AT_FONTS.display, fontStyle: "italic", fontSize: 13 }}>{p.title}</span>
              </div>
            </div>
          );
        })()}
      </section>

      {/* Marquee */}
      <div className="atp-marquee">
        <div className="atp-marquee-track">
          {Array.from({ length: 3 }).flatMap((_, k) => [
            "Atlas Studio","——","Available August through October","——",
            "Bookings open: weddings · editorial · brand","——","Now showing — Marais","——",
          ].map((t, i) => (
            <span key={`${k}-${i}`} className="atp-marquee-item">{t === "——" ? <span className="atp-marquee-dot">✺</span> : t}</span>
          )))}
        </div>
      </div>

      {/* About */}
      <section className="atp-about">
        <div className="atp-section-head">
          <span className="at-mono" style={{ color: "var(--at-muted)" }}>(04) Studio</span>
          <h2 className="atp-h2">
            A small studio<br />
            <em style={{ fontFamily: AT_FONTS.display }}>making pictures</em> with care.
          </h2>
        </div>
        <div className="atp-about-grid">
          <figure className="atp-portrait">
            <div className="at-imgwrap" style={{ aspectRatio: "4 / 5" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ATLAS_U("1531746020798-e6953c6e8e04", 1100)} alt="Portrait of the photographer" />
            </div>
            <figcaption className="at-mono" style={{ color: "var(--at-muted)", marginTop: 10 }}>
              Felix Marchand · Founder
            </figcaption>
          </figure>
          <div className="atp-about-copy">
            <p className="atp-about-lede">
              Atlas is a one-person studio working between <em style={{ fontFamily: AT_FONTS.display }}>Paris and Lisbon</em>, photographing weddings, editorial portraits, and the occasional brand campaign.
            </p>
            <p className="atp-about-body">
              We work in small numbers. Eighteen weddings a year, four or five editorial commissions, and whatever else asks to be made. Each one gets a dedicated index — quiet, generous, organised the way we&rsquo;d want to receive it ourselves.
            </p>
            <p className="atp-about-body">
              We are unapologetically slow about delivery, fast about replies, and entirely allergic to the words <em style={{ fontFamily: AT_FONTS.display }}>capture, journey,</em> and <em style={{ fontFamily: AT_FONTS.display }}>magical.</em>
            </p>
            <ul className="atp-stats">
              <li><span className="atp-stat-num">07</span><span className="at-mono">years</span></li>
              <li><span className="atp-stat-num">142</span><span className="at-mono">weddings</span></li>
              <li><span className="atp-stat-num">29</span><span className="at-mono">countries</span></li>
              <li><span className="atp-stat-num">06</span><span className="at-mono">awards</span></li>
            </ul>
            <div className="atp-press">
              <span className="at-mono" style={{ color: "var(--at-muted)" }}>As featured in</span>
              <div className="atp-press-row">
                <span style={{ fontFamily: AT_FONTS.display, fontStyle: "italic", fontSize: 22 }}>Vogue</span>
                <span style={{ fontFamily: AT_FONTS.display, fontWeight: 600, fontSize: 18, letterSpacing: "-.04em" }}>Apartamento</span>
                <span style={{ fontFamily: AT_FONTS.mono, fontSize: 14, letterSpacing: ".06em" }}>IGNANT</span>
                <span style={{ fontFamily: AT_FONTS.display, fontStyle: "italic", fontSize: 20 }}>Kinfolk</span>
                <span style={{ fontFamily: AT_FONTS.sans, fontWeight: 700, fontSize: 16, letterSpacing: "-.02em" }}>It&rsquo;s Nice That</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="atp-contact">
        <div className="atp-contact-eye">
          <span className="at-mono">(05) Make something</span>
        </div>
        <h2 className="atp-contact-h">
          <span>Tell us about</span>
          <span style={{ fontFamily: AT_FONTS.display, fontStyle: "italic" }}>the day,</span>
          <span>the place,</span>
          <span style={{ color: "var(--at-accent)" }}>the feeling.</span>
        </h2>
        <div className="atp-contact-grid">
          <a className="atp-contact-row" href="mailto:hello@atlas.studio">
            <span className="at-mono" style={{ color: "var(--at-muted)" }}>email</span>
            <span className="atp-contact-val">hello@atlas.studio</span>
            <span className="atp-contact-arrow">↗</span>
          </a>
          <a className="atp-contact-row" href="#" target="_blank" rel="noopener noreferrer">
            <span className="at-mono" style={{ color: "var(--at-muted)" }}>instagram</span>
            <span className="atp-contact-val">@atlas.studio</span>
            <span className="atp-contact-arrow">↗</span>
          </a>
          <button type="button" className="atp-contact-row atp-contact-wa" onClick={() => setWaOpen(true)}>
            <span className="at-mono" style={{ color: "var(--at-muted)" }}>whatsapp</span>
            <span className="atp-contact-val" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style={{ color: "#25D366" }} aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-18.5A8.5 8.5 0 0 0 4.59 16.32L4 20l3.793-1.057A8.5 8.5 0 1 0 12 3.5z"/>
              </svg>
              Chat on WhatsApp
            </span>
            <span className="atp-contact-arrow">→</span>
          </button>
          <a className="atp-contact-row" href="#">
            <span className="at-mono" style={{ color: "var(--at-muted)" }}>brief</span>
            <span className="atp-contact-val">Send a project brief</span>
            <span className="atp-contact-arrow">↗</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="atp-footer">
        <div className="atp-footer-mark">
          <span style={{ fontFamily: AT_FONTS.display, fontStyle: "italic", fontSize: "clamp(80px, 18vw, 240px)", letterSpacing: "-.04em", lineHeight: 0.9 }}>atlas</span>
          <span style={{ fontFamily: AT_FONTS.display, fontWeight: 500, fontSize: "clamp(80px, 18vw, 240px)", letterSpacing: "-.04em", lineHeight: 0.9 }}>studio.</span>
        </div>
        <div className="atp-footer-meta">
          <div>
            <div className="at-mono" style={{ color: "var(--at-muted)", marginBottom: 6 }}>©2018—2026</div>
            <div>Atlas Studio · Paris / Lisbon</div>
          </div>
          <div className="atp-footer-cols">
            <ul><li className="at-mono" style={{ color: "var(--at-muted)" }}>nav</li><li>Index</li><li>Studio</li><li>Journal</li><li>Contact</li></ul>
            <ul><li className="at-mono" style={{ color: "var(--at-muted)" }}>elsewhere</li><li>Instagram</li><li>Are.na</li><li>Substack</li></ul>
            <ul><li className="at-mono" style={{ color: "var(--at-muted)" }}>colophon</li><li>Bricolage Grotesque</li><li>Geist</li><li>Built with FRAME</li></ul>
          </div>
        </div>
      </footer>

      {/* Slide-in nav */}
      <div className={`atp-nav ${navOpen ? "is-open" : ""}`} aria-hidden={!navOpen}>
        <div className="atp-nav-bg" onClick={() => setNavOpen(false)} />
        <aside className="atp-nav-panel">
          <header className="atp-nav-head">
            <span className="at-mark invert">a</span>
            <span className="at-mono" style={{ marginLeft: 10 }}>Atlas Studio</span>
            <button className="atp-nav-x" onClick={() => setNavOpen(false)} aria-label="close">✕</button>
          </header>
          <ol className="atp-nav-list">
            <li onClick={() => { setNavOpen(false); document.getElementById("index")?.scrollIntoView({ behavior: "smooth" }); }}>
              <span className="at-mono">00</span><span style={{ fontFamily: AT_FONTS.display }}>Index</span><span className="atp-nav-arrow">↗</span>
            </li>
            {ATLAS_PROJECTS.map((p) => (
              <li key={p.id} onClick={() => { setNavOpen(false); setActive(p.id); }}>
                <span className="at-mono">{p.no}</span>
                <span style={{ fontFamily: AT_FONTS.display }}>{p.title}</span>
                <span className="atp-nav-arrow">↗</span>
              </li>
            ))}
          </ol>
          <hr className="at-hr" />
          <ol className="atp-nav-sublist">
            <li onClick={() => { setNavOpen(false); document.querySelector(".atp-about")?.scrollIntoView({ behavior: "smooth" }); }}>
              <span className="at-mono">06</span><span>Studio</span>
            </li>
            <li onClick={() => { setNavOpen(false); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}>
              <span className="at-mono">07</span><span>Contact</span>
            </li>
            <li onClick={() => setNavOpen(false)}>
              <span className="at-mono">08</span><span>Journal</span>
            </li>
          </ol>
          <footer className="atp-nav-foot">
            <div className="at-mono" style={{ color: "var(--at-muted)" }}>open for</div>
            <div>Aug — Oct 2026</div>
          </footer>
        </aside>
      </div>

      {/* Project detail — visualizer for the clicked project */}
      {project && (
        <div className="atp-detail">
          <header className="atp-detail-bar">
            <div className="atp-detail-l">
              <span className="at-mono" style={{ color: "var(--at-muted)" }}>{project.no} / {project.kind}</span>
              <span className="at-mono" style={{ color: "var(--at-muted)" }}>{project.place} · {project.year}</span>
            </div>
            <div className="atp-detail-c" style={{ fontFamily: AT_FONTS.display, fontWeight: 500 }}>{project.title}<em style={{ fontStyle: "italic", color: "var(--at-muted)", marginLeft: 8 }}>— {project.subtitle}</em></div>
            <button className="atp-detail-x" onClick={() => setActive(null)} aria-label="Close project">✕</button>
          </header>
          <div className="atp-detail-hero at-imgwrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ATLAS_U(project.cover, 2200)} alt={project.title} />
          </div>
          <div className="atp-detail-grid">
            {project.photos.map((pid, i) => (
              <figure key={pid + i} className="atp-detail-cell" onClick={() => setLightbox({ photos: project.photos, idx: i })}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ATLAS_U(pid, 1200)} alt="" loading="lazy" style={{ width: "100%", height: "auto", display: "block", aspectRatio: ATLAS_RATIOS[pid] || 4/5, objectFit: "cover" }} />
                <figcaption className="at-mono atp-detail-cap">{String(i + 1).padStart(3, "0")} / {String(project.photos.length).padStart(3, "0")}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox (project detail) */}
      {lightbox && lightbox.photos[lightbox.idx] && (
        <div className="atp-lb" onClick={(e) => { if (e.target === e.currentTarget) setLightbox(null); }}>
          <header className="atp-lb-head">
            <span className="at-mono">{String(lightbox.idx + 1).padStart(3, "0")} / {String(lightbox.photos.length).padStart(3, "0")}</span>
            <button className="atp-lb-x" onClick={() => setLightbox(null)}>Close ✕</button>
          </header>
          <button className="atp-lb-arrow l" onClick={() => setLightbox((l) => l && ({ ...l, idx: (l.idx - 1 + l.photos.length) % l.photos.length }))}>←</button>
          <button className="atp-lb-arrow r" onClick={() => setLightbox((l) => l && ({ ...l, idx: (l.idx + 1) % l.photos.length }))}>→</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="atp-lb-img" src={ATLAS_U(lightbox.photos[lightbox.idx]!, 1800)} alt="" />
        </div>
      )}

      {/* WhatsApp modal */}
      {waOpen && (
        <div className="atp-wa" onClick={(e) => { if (e.target === e.currentTarget) setWaOpen(false); }}>
          <div className="atp-wa-card">
            <header className="atp-wa-head">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="#25D366" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-18.5A8.5 8.5 0 0 0 4.59 16.32L4 20l3.793-1.057A8.5 8.5 0 1 0 12 3.5z"/>
                </svg>
                <div>
                  <div style={{ fontFamily: AT_FONTS.display, fontWeight: 500, fontSize: 22, letterSpacing: "-.02em" }}>Chat on WhatsApp</div>
                  <div className="at-mono" style={{ color: "var(--at-muted)" }}>+33 6 12 34 56 78 · usually replies in 24h</div>
                </div>
              </div>
              <button className="atp-wa-x" onClick={() => setWaOpen(false)} aria-label="close">✕</button>
            </header>
            <textarea className="atp-wa-msg" value={waMsg} onChange={(e) => setWaMsg(e.target.value)} rows={5} />
            <a
              className="atp-wa-send"
              href={`https://wa.me/33612345678?text=${encodeURIComponent(waMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setWaOpen(false)}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden><path d="M2 21l1.65-3.8A8.5 8.5 0 1 1 7.05 21L2 21z" opacity=".25"/><path d="M21 12a9 9 0 1 1-3.5-7.07"/></svg>
              Open WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

const ATP_CSS = `
.atp-root{ font-family:var(--at-sans); background:var(--at-bg); color:var(--at-fg) }
.atp-root .at-mono{ font-family:var(--at-mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase }
.atp-root .at-imgwrap{ position:relative; overflow:hidden; background:var(--at-raised) }
.atp-root .at-imgwrap img{ width:100%; height:100%; object-fit:cover }
.atp-root .at-mark{ display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; background:var(--at-fg); color:var(--at-bg); font-family:var(--at-display); font-style:italic; font-weight:500 }
.atp-root .at-mark.invert{ background:var(--at-bg); color:var(--at-fg) }
.atp-root .at-hr{ border:0; height:1px; background:var(--at-line); margin:0 }

.atp-top{ position:fixed; top:0; left:0; right:0; z-index:40; display:grid; grid-template-columns: auto 1fr auto; align-items:center; gap:14px; padding:14px 22px; background:var(--at-fg); color:var(--at-bg); border-bottom:1px solid var(--at-fg) }
.atp-hamb{ width:38px; height:38px; border:1px solid rgba(239,234,224,.35); border-radius:999px; background:transparent; color:var(--at-bg); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px; cursor:pointer; transition:background .25s ease, border-color .25s ease }
.atp-hamb span{ display:block; width:14px; height:1px; background:currentColor }
.atp-hamb:hover{ background:rgba(239,234,224,.1); border-color:rgba(239,234,224,.7) }
.atp-top-brand{ display:flex; align-items:center; gap:12px; justify-self:center }
.atp-top-brand .at-mark{ background:var(--at-bg); color:var(--at-fg) }
.atp-top-name{ font-size:22px; letter-spacing:-.025em; line-height:1; color:var(--at-bg) }
.atp-top-cta{ display:inline-flex; align-items:center; gap:8px; padding:8px 14px; border:1px solid rgba(239,234,224,.35); border-radius:999px; color:var(--at-bg); font-family:var(--at-mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; transition:background .25s ease, border-color .25s ease }
.atp-top-cta:hover{ background:rgba(239,234,224,.1); border-color:var(--at-bg) }
.atp-top-cta-dot{ color:var(--at-accent); font-size:10px; line-height:1 }
@media (max-width:700px){ .atp-top{ padding:12px 14px; gap:8px } .atp-top-name{ font-size:18px } .atp-top-cta{ padding:7px 11px; font-size:10px } }
@media (max-width:420px){ .atp-top-brand .at-mark{ display:none } }

.atp-cover{ position:relative; min-height:100vh; min-height:100dvh; width:100%; display:grid; align-items:end; padding-top:64px; color:#fff; isolation:isolate; background:var(--at-fg) }
.atp-root .atp-cover .atp-cover-img{ position:absolute; inset:0; z-index:0 }
.atp-root .atp-cover .atp-cover-img img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover }
.atp-cover-tint{ position:absolute; inset:0; background: linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.2) 30%, rgba(0,0,0,.2) 55%, rgba(0,0,0,.85) 100%) }
.atp-cover-grid{ position:relative; z-index:1; display:grid; grid-template-rows: auto 1fr auto; grid-template-areas: "eye" "title" "foot"; width:100%; padding: clamp(70px,12vh,110px) clamp(20px,4vw,56px) clamp(30px,6vh,56px); min-height:100vh; min-height:100dvh }
.atp-cover-eye{ grid-area:eye }
.atp-cover-title{ grid-area:title; align-self:end; margin:0; font-family:var(--at-display); font-weight:500; line-height:.92; letter-spacing:-0.045em; font-size: clamp(48px, 11vw, 180px); display:flex; flex-wrap:wrap; gap: 0 .25em }
.atp-cover-italic{ font-style:italic; font-weight:400 }
.atp-cover-num{ font-feature-settings:"ss01" 1, "tnum" 1; font-style:italic; font-weight:300; border-bottom: 4px solid var(--at-accent); padding-bottom:.04em }
.atp-cover-foot{ grid-area:foot; display:flex; align-items:end; justify-content:space-between; gap:24px; padding-top:24px; border-top:1px solid rgba(255,255,255,.18) }
.atp-cover-cta{ display:inline-flex; align-items:center; gap:14px; padding:8px 8px 8px 18px; border:1px solid rgba(255,255,255,.35); border-radius:999px; color:#fff; font-family:var(--at-mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; transition:background .25s ease, transform .25s var(--at-reveal) }
.atp-cover-cta:hover{ background:rgba(255,255,255,.1); transform:translateY(-2px) }
@media (max-width:700px){ .atp-cover-foot{ flex-direction:column; align-items:flex-start } }

.atp-section-head{ display:grid; grid-template-columns: 200px 1fr; gap:32px; align-items:start; padding: clamp(80px,12vh,140px) clamp(20px,4vw,56px) clamp(40px,6vh,60px) }
.atp-h2{ margin:0; font-family:var(--at-display); font-weight:500; font-size:clamp(38px,6vw,84px); line-height:1.0; letter-spacing:-.04em }
.atp-h2 em{ font-style:italic; font-weight:400 }
@media (max-width:760px){ .atp-section-head{ grid-template-columns:1fr; gap:18px } }

.atp-index{ position:relative; padding-bottom: clamp(40px,8vh,100px) }
.atp-list{ list-style:none; margin:0; padding:0 clamp(20px,4vw,56px); border-top:1px solid var(--at-line) }
.atp-row{ display:grid; grid-template-columns: 50px 1fr 140px 180px 80px 30px; gap:18px; align-items:center; padding:26px 0; cursor:pointer; border-bottom:1px solid var(--at-line); transition:opacity .35s var(--at-reveal), padding .35s var(--at-reveal), color .25s ease; color:var(--at-fg) }
.atp-row.is-dim{ opacity:.32 }
.atp-row.is-hover{ padding-left:14px; color:var(--at-fg) }
.atp-row-no{ font-family:var(--at-mono); font-size:11px; letter-spacing:.08em; color:var(--at-muted) }
.atp-row-title{ font-family:var(--at-display); font-weight:500; font-size:clamp(28px, 4.6vw, 64px); letter-spacing:-.035em; line-height:1.0 }
.atp-row-em em{ font-style:italic; font-weight:400; color:var(--at-muted) }
.atp-row-kind{ font-family:var(--at-mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--at-muted) }
.atp-row-place{ font-family:var(--at-sans); font-size:14px }
.atp-row-year{ font-family:var(--at-mono); font-size:13px; color:var(--at-muted) }
.atp-row-arrow{ font-size:18px; color:var(--at-muted); transition:transform .3s var(--at-reveal) }
.atp-row.is-hover .atp-row-arrow{ color:var(--at-accent); transform:translate(4px,-4px) }
@media (max-width:980px){ .atp-row{ grid-template-columns: 40px 1fr 80px 30px } .atp-row-place,.atp-row-year{ display:none } }
@media (max-width:560px){ .atp-row{ grid-template-columns: 1fr 30px; row-gap:6px; padding:22px 0 } .atp-row-no{ grid-column:1 / 3 } .atp-row-kind{ grid-column:1 / 3 } }

.atp-cursor{ position:absolute; left:0; top:0; pointer-events:none; z-index:5; width:280px; transition:transform .15s linear; margin-left:32px; margin-top:-30px }
.atp-cursor-img{ aspect-ratio: 4 / 5; border-radius:2px; box-shadow:0 30px 60px rgba(0,0,0,.18) }
.atp-cursor-meta{ display:flex; justify-content:space-between; align-items:baseline; padding-top:10px; color:var(--at-fg) }
@media (hover:none){ .atp-cursor{ display:none } }

.atp-marquee{ background:var(--at-fg); color:var(--at-bg); border-top:1px solid var(--at-fg); border-bottom:1px solid var(--at-fg); overflow:hidden; padding:18px 0 }
.atp-marquee-track{ display:flex; gap:48px; white-space:nowrap; animation: atp-marquee 38s linear infinite; font-family:var(--at-display); font-style:italic; font-size:clamp(24px,5vw,64px); letter-spacing:-.03em }
.atp-marquee-item{ display:inline-block }
.atp-marquee-dot{ color:var(--at-accent); font-style:normal }
@keyframes atp-marquee{ to { transform: translateX(-33.333%) } }

.atp-about{ padding-bottom: clamp(60px,8vh,100px) }
.atp-about-grid{ display:grid; grid-template-columns: 5fr 7fr; gap: clamp(28px,5vw,80px); padding: 0 clamp(20px,4vw,56px); align-items:start }
.atp-portrait{ margin:0; position:sticky; top:90px }
.atp-about-copy p{ margin:0 0 22px }
.atp-about-lede{ font-family:var(--at-display); font-weight:400; font-size:clamp(22px,2.6vw,38px); line-height:1.18; letter-spacing:-.02em }
.atp-about-lede em{ font-style:italic }
.atp-about-body{ font-family:var(--at-sans); font-size:17px; line-height:1.55; color:var(--at-muted); max-width:60ch }
.atp-about-body em{ color:var(--at-fg); font-style:italic; font-family:var(--at-display) }
.atp-stats{ list-style:none; padding:32px 0 0; margin:32px 0 0; border-top:1px solid var(--at-line); display:grid; grid-template-columns:repeat(4,1fr); gap:18px }
.atp-stats li{ display:flex; flex-direction:column; gap:4px }
.atp-stat-num{ font-family:var(--at-display); font-weight:500; font-size:clamp(28px,4.4vw,60px); letter-spacing:-.04em; line-height:1 }
.atp-stats .at-mono{ color:var(--at-muted) }
.atp-press{ margin-top:42px; padding-top:22px; border-top:1px solid var(--at-line) }
.atp-press-row{ display:flex; flex-wrap:wrap; gap:32px; align-items:center; margin-top:12px; color:var(--at-muted) }
@media (max-width:900px){ .atp-about-grid{ grid-template-columns:1fr } .atp-portrait{ position:static; max-width:380px } .atp-stats{ grid-template-columns:repeat(2,1fr) } }

.atp-contact{ padding: clamp(80px,10vh,120px) clamp(20px,4vw,56px) clamp(60px,8vh,100px); border-top:1px solid var(--at-line) }
.atp-contact-eye{ display:flex; gap:14px; color:var(--at-muted); margin-bottom:36px }
.atp-contact-h{ margin:0 0 56px; font-family:var(--at-display); font-weight:500; font-size:clamp(40px,7vw,110px); line-height:.95; letter-spacing:-.045em; display:flex; flex-wrap:wrap; gap: 0 .22em }
.atp-contact-grid{ display:grid; grid-template-columns: 1fr 1fr; gap:0; border-top:1px solid var(--at-line) }
.atp-contact-row{ display:grid; grid-template-columns: 140px 1fr 30px; gap:24px; align-items:baseline; padding:28px 6px; border-bottom:1px solid var(--at-line); transition:padding .25s var(--at-reveal), color .2s ease; cursor:pointer }
.atp-contact-row:nth-child(odd){ border-right:1px solid var(--at-line); padding-right:30px }
.atp-contact-row:hover{ padding-left:18px; color:var(--at-accent) }
.atp-contact-val{ font-family:var(--at-display); font-weight:500; font-size:clamp(20px,2.4vw,36px); letter-spacing:-.03em }
.atp-contact-arrow{ font-size:18px; color:var(--at-muted); transition:transform .25s var(--at-reveal) }
.atp-contact-row:hover .atp-contact-arrow{ transform:translate(4px,-4px); color:var(--at-accent) }
@media (max-width:760px){ .atp-contact-grid{ grid-template-columns:1fr } .atp-contact-row:nth-child(odd){ border-right:0; padding-right:6px } .atp-contact-row{ grid-template-columns: 100px 1fr 24px; gap:14px } }

.atp-footer{ background:var(--at-fg); color:var(--at-bg); padding: clamp(60px,10vh,120px) clamp(20px,4vw,56px) 28px }
.atp-footer-mark{ display:flex; flex-direction:column; align-items:flex-start; line-height:.85; padding-bottom:clamp(28px,5vh,60px); border-bottom:1px solid rgba(239,234,224,.18) }
.atp-footer-meta{ display:grid; grid-template-columns: 1fr 2fr; gap:24px; padding-top:36px }
.atp-footer-cols{ display:grid; grid-template-columns: repeat(3,1fr); gap:24px }
.atp-footer-cols ul{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:6px; font-size:14px }
.atp-footer-cols ul li:first-child{ margin-bottom:6px }
@media (max-width:760px){ .atp-footer-meta{ grid-template-columns:1fr } .atp-footer-cols{ grid-template-columns:repeat(2,1fr) } }

.atp-nav{ position:fixed; inset:0; z-index:90; pointer-events:none }
.atp-nav.is-open{ pointer-events:auto }
.atp-nav-bg{ position:absolute; inset:0; background:rgba(14,14,14,.5); opacity:0; transition:opacity .5s var(--at-curtain) }
.atp-nav.is-open .atp-nav-bg{ opacity:1 }
.atp-nav-panel{ position:absolute; left:0; top:0; bottom:0; width:min(440px,92vw); background:var(--at-bg); color:var(--at-fg); padding: 22px 28px; transform:translateX(-100%); transition:transform .55s var(--at-curtain); display:flex; flex-direction:column }
.atp-nav.is-open .atp-nav-panel{ transform:translateX(0) }
.atp-nav-head{ display:flex; align-items:center; gap:8px; padding-bottom:24px; border-bottom:1px solid var(--at-line) }
.atp-nav-x{ margin-left:auto; appearance:none; border:1px solid var(--at-line); background:transparent; width:34px; height:34px; border-radius:999px; cursor:pointer }
.atp-nav-list{ list-style:none; margin:0; padding:24px 0; display:flex; flex-direction:column; gap:14px }
.atp-nav-list li{ display:grid; grid-template-columns: 40px 1fr 24px; align-items:baseline; gap:12px; font-size:34px; line-height:1; letter-spacing:-.03em; cursor:pointer }
.atp-nav-list li:hover{ color:var(--at-accent) }
.atp-nav-list li .at-mono{ color:var(--at-muted) }
.atp-nav-arrow{ font-size:18px; color:var(--at-muted) }
.atp-nav-sublist{ list-style:none; margin:14px 0 0; padding:0; display:flex; flex-direction:column; gap:10px }
.atp-nav-sublist li{ display:grid; grid-template-columns:40px 1fr; gap:12px; font-family:var(--at-sans); font-size:18px; color:var(--at-muted) }
.atp-nav-foot{ margin-top:auto; padding-top:18px; border-top:1px solid var(--at-line); display:flex; justify-content:space-between; align-items:baseline; font-size:14px }

/* PROJECT DETAIL */
.atp-detail{ position:fixed; inset:0; z-index:80; background:var(--at-bg); color:var(--at-fg); overflow-y:auto; animation: atp-fade .4s var(--at-reveal) }
@keyframes atp-fade{ from{opacity:0; transform:translateY(12px)} to{opacity:1; transform:none} }
.atp-detail-bar{ position:sticky; top:0; z-index:5; display:grid; grid-template-columns: 1fr auto auto; gap:14px; align-items:center; padding:18px 24px; background:var(--at-bg); border-bottom:1px solid var(--at-line) }
.atp-detail-l{ display:flex; gap:14px; flex-wrap:wrap }
.atp-detail-c{ font-size: clamp(20px,2.4vw,32px); letter-spacing:-.02em; line-height:1; justify-self:center; text-align:center }
.atp-detail-x{ appearance:none; border:1px solid var(--at-line); background:transparent; color:var(--at-fg); width:38px; height:38px; border-radius:999px; cursor:pointer; transition:background .2s ease, color .2s ease }
.atp-detail-x:hover{ background:var(--at-fg); color:var(--at-bg); border-color:var(--at-fg) }
.atp-detail-hero{ height: clamp(280px, 50vh, 560px); border-bottom:1px solid var(--at-line) }
.atp-detail-grid{ column-count:3; column-gap:14px; padding:24px clamp(16px,4vw,40px) clamp(48px,10vh,96px) }
.atp-detail-cell{ position:relative; margin:0 0 14px; cursor:zoom-in; overflow:hidden; background:var(--at-raised); break-inside:avoid; display:block }
.atp-detail-cap{ position:absolute; left:10px; bottom:10px; background:var(--at-bg); padding:5px 8px; color:var(--at-muted); font-size:9px; letter-spacing:.08em }
@media (max-width:1100px){ .atp-detail-grid{ column-count:2 } }
@media (max-width:560px){ .atp-detail-grid{ column-count:1 } .atp-detail-c{ display:none } }

/* LIGHTBOX */
.atp-lb{ position:fixed; inset:0; z-index:100; background:rgba(11,11,11,.96); display:flex; align-items:center; justify-content:center }
.atp-lb-head{ position:fixed; top:0; left:0; right:0; display:flex; justify-content:space-between; align-items:center; padding:18px 24px; border-bottom:1px solid rgba(239,234,224,.12); color:#EFEAE0; font-family:var(--at-mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase }
.atp-lb-x{ background:transparent; border:0; color:inherit; cursor:pointer; font-family:var(--at-mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase }
.atp-lb-img{ max-width:84vw; max-height:78vh; object-fit:contain; box-shadow:0 30px 80px rgba(0,0,0,.5) }
.atp-lb-arrow{ position:fixed; top:50%; transform:translateY(-50%); width:48px; height:48px; border-radius:999px; border:1px solid rgba(239,234,224,.18); background:transparent; color:#EFEAE0; cursor:pointer; font-family:var(--at-display); font-size:22px }
.atp-lb-arrow:hover{ background:rgba(239,234,224,.08) }
.atp-lb-arrow.l{ left:24px } .atp-lb-arrow.r{ right:24px }

/* CONTACT WHATSAPP ROW */
.atp-contact-wa{ appearance:none; border:0; background:transparent; cursor:pointer; text-align:left; font:inherit; color:inherit; width:100% }

/* WHATSAPP MODAL */
.atp-wa{ position:fixed; inset:0; z-index:120; background:rgba(11,11,11,.6); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:20px; animation: atp-fade .25s ease }
.atp-wa-card{ width:min(480px, 100%); background:var(--at-bg); border:1px solid var(--at-line); padding:24px; display:flex; flex-direction:column; gap:18px; box-shadow:0 30px 80px rgba(0,0,0,.3) }
.atp-wa-head{ display:flex; justify-content:space-between; align-items:flex-start; gap:14px }
.atp-wa-x{ appearance:none; border:1px solid var(--at-line); background:transparent; color:var(--at-fg); width:32px; height:32px; border-radius:999px; cursor:pointer; flex-shrink:0; transition:background .2s ease, color .2s ease }
.atp-wa-x:hover{ background:var(--at-fg); color:var(--at-bg); border-color:var(--at-fg) }
.atp-wa-msg{ width:100%; background:var(--at-raised); border:1px solid var(--at-line); color:var(--at-fg); padding:16px; font-family:var(--at-sans); font-size:14px; line-height:1.55; resize:vertical; outline:none; min-height:120px; transition:border-color .2s ease }
.atp-wa-msg:focus{ border-color:var(--at-fg) }
.atp-wa-send{ display:inline-flex; align-items:center; justify-content:center; gap:10px; padding:16px 22px; background:#25D366; color:#062417; font-family:var(--at-mono); font-size:11px; letter-spacing:.1em; text-transform:uppercase; font-weight:700; transition:filter .2s ease, transform .2s ease; text-decoration:none }
.atp-wa-send:hover{ filter:brightness(1.05); transform:translateY(-1px) }
`;
