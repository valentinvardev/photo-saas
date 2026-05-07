"use client";

import { useEffect, useRef, useState } from "react";
import { VT_U, VAULT_BRAND, VAULT_CATEGORIES, VAULT_TOTALS, type VtFolder } from "~/lib/vault/data";

type Lightbox = { folder: VtFolder; idx: number } | null;

export default function VaultPortfolioPage() {
  const D = { brand: VAULT_BRAND, categories: VAULT_CATEGORIES, totals: VAULT_TOTALS };
  const [chapter,  setChapter]  = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<Lightbox>(null);
  const [navOpen,  setNavOpen]  = useState(false);
  const chaptersRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const els = chaptersRef.current.filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && e.intersectionRatio > 0.4) {
          const no = (e.target as HTMLElement).dataset.chapterNo;
          if (no) setChapter(no);
        }
      });
    }, { threshold: [0, 0.4, 0.8], rootMargin: "-30% 0px -30% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function scrollToCat(id: string) {
    const el = document.getElementById(`vt-ch-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="vt-root">
      <style>{VT_CSS}</style>

      <header className="vt-top">
        <div className="vt-top-l">
          <button className="vt-hamb" aria-label="menu" onClick={() => setNavOpen(true)}>
            <span></span><span></span><span></span>
          </button>
          <span className="vt-disp vt-top-mark">VAULT</span>
          <span className="vt-mono vt-top-edition" style={{ color: "var(--vt-muted)" }}>{D.brand.edition}</span>
        </div>
        <div className="vt-top-c vt-mono">
          {chapter ? <>Chapter <strong style={{ color: "var(--vt-fg)" }}>{chapter}</strong> of {String(D.totals.categories).padStart(2, "0")}</> : <>An archive</>}
        </div>
        <div className="vt-top-r">
          <span className="vt-mono vt-top-author" style={{ color: "var(--vt-muted)" }}>
            {D.brand.photographer} <span style={{ color: "var(--vt-muted)", margin: "0 8px" }}>·</span> {D.brand.based}
          </span>
          <a href="#vt-toc" className="vt-top-cta vt-mono">Contact</a>
        </div>
      </header>

      {/* Mobile / desktop slide-in nav */}
      <div className={`vt-nav ${navOpen ? "is-open" : ""}`} aria-hidden={!navOpen}>
        <div className="vt-nav-bg" onClick={() => setNavOpen(false)} />
        <aside className="vt-nav-panel">
          <header className="vt-nav-head">
            <span className="vt-disp" style={{ fontSize: 22 }}>VAULT</span>
            <button className="vt-nav-x" onClick={() => setNavOpen(false)} aria-label="close">✕</button>
          </header>
          <ol className="vt-nav-list">
            {D.categories.map((cat) => (
              <li key={cat.id}>
                <button onClick={() => { setNavOpen(false); scrollToCat(cat.id); }}>
                  <span className="vt-mono" style={{ color: "var(--vt-muted)" }}>{cat.no}</span>
                  <span className="vt-disp">{cat.name}</span>
                </button>
              </li>
            ))}
          </ol>
          <hr style={{ border: 0, borderTop: "1px solid var(--vt-line)", margin: 0 }} />
          <ol className="vt-nav-sublist">
            <li><button onClick={() => { setNavOpen(false); document.getElementById("vt-toc")?.scrollIntoView({ behavior: "smooth" }); }}><span className="vt-mono">→</span><span>Index of contents</span></button></li>
            <li><button onClick={() => setNavOpen(false)}><span className="vt-mono">→</span><span>Contact the studio</span></button></li>
          </ol>
          <footer className="vt-nav-foot">
            <span className="vt-mono" style={{ color: "var(--vt-muted)" }}>{D.brand.based}</span>
            <span className="vt-mono" style={{ color: "var(--vt-accent)" }}>{D.brand.edition}</span>
          </footer>
        </aside>
      </div>

      {/* COVER */}
      <section className="vt-cover">
        <div className="vt-cover-grid">
          <div className="vt-cover-l">
            <div className="vt-mono vt-cover-eye">An archive of pictures<br />by {D.brand.photographer}.</div>
            <h1 className="vt-cover-title vt-disp">
              <span>VAULT</span>
              <span className="vt-cover-amp">&amp;</span>
              <span>INDEX</span>
            </h1>
            <div className="vt-cover-meta">
              <div><div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Edition</div><div className="vt-disp" style={{ fontSize: 30 }}>06</div></div>
              <div><div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Year</div><div className="vt-disp" style={{ fontSize: 30 }}>2026</div></div>
              <div><div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Categories</div><div className="vt-disp" style={{ fontSize: 30 }}>{String(D.totals.categories).padStart(2, "0")}</div></div>
              <div><div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Folders</div><div className="vt-disp" style={{ fontSize: 30 }}>{String(D.totals.folders).padStart(2, "0")}</div></div>
              <div><div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Photographs</div><div className="vt-disp" style={{ fontSize: 30, color: "var(--vt-accent)" }}>{String(D.totals.photos).padStart(3, "0")}</div></div>
            </div>
            <a href="#vt-toc" className="vt-cover-cta">
              <span className="vt-mono">Read the index</span>
              <span aria-hidden style={{ marginLeft: 14, display: "inline-flex" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="13 6 19 12 13 18" />
                </svg>
              </span>
            </a>
          </div>
          <div className="vt-cover-r">
            <figure className="vt-cover-plate">
              <div className="vt-imgwrap" style={{ aspectRatio: "3 / 4" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={VT_U(D.categories[0]!.cover, 1400)} alt="" />
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* INDEX */}
      <section id="vt-toc" className="vt-toc">
        <header className="vt-toc-head">
          <span className="vt-mono">— Index —</span>
          <h2 className="vt-disp">CONTENTS</h2>
          <p className="vt-toc-lede">Four chapters, eleven folders, {D.totals.photos} photographs.<br />Click any line to descend.</p>
        </header>

        <ol className="vt-toc-list">
          {D.categories.map((cat, ci) => (
            <li key={cat.id} className="vt-toc-cat">
              <button className="vt-toc-cat-row" onClick={() => scrollToCat(cat.id)}>
                <span className="vt-mono vt-toc-no">{cat.no}</span>
                <span className="vt-toc-name vt-disp">{cat.name}</span>
                <span className="vt-toc-dots" aria-hidden></span>
                <span className="vt-toc-meta vt-mono">
                  {cat.folders.length} folders <span className="vt-toc-sep">·</span> {cat.folders.reduce((a, f) => a + f.photos.length, 0)} photos <span className="vt-toc-sep">·</span> {cat.span}
                </span>
                <span className="vt-toc-page vt-mono">p. {String((ci + 1) * 16).padStart(3, "0")}</span>
              </button>
              <ul className="vt-toc-folders">
                {cat.folders.map((f) => (
                  <li key={f.id} className="vt-toc-folder">
                    <button className="vt-toc-folder-btn" onClick={() => {
                      const el = document.getElementById(`vt-fd-${f.id}`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}>
                      <span className="vt-mono vt-toc-fno">{f.no}</span>
                      <span className="vt-toc-fname">{f.name}</span>
                      <span className="vt-toc-fnote vt-mono">{f.note}</span>
                      <span className="vt-toc-fcount vt-mono">{String(f.photos.length).padStart(2, "0")} pl. ↗</span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {/* CHAPTERS */}
      {D.categories.map((cat, ci) => (
        <section
          key={cat.id}
          id={`vt-ch-${cat.id}`}
          ref={(el) => { chaptersRef.current[ci] = el; }}
          data-chapter-no={cat.no}
          className="vt-chapter"
        >
          <div className="vt-ch-cover">
            <div className="vt-imgwrap vt-ch-cover-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={VT_U(cat.cover, 2000)} alt="" />
              <div className="vt-ch-cover-tint" />
            </div>
            <div className="vt-ch-cover-text">
              <div className="vt-mono" style={{ color: "rgba(244,240,230,.65)" }}>Chapter {cat.no} of {String(D.totals.categories).padStart(2, "0")}</div>
              <h2 className="vt-disp vt-ch-name">{cat.name}</h2>
              <div className="vt-ch-summary">
                <p>{cat.summary}</p>
                <div className="vt-mono" style={{ color: "rgba(244,240,230,.65)", marginTop: 14 }}>
                  {cat.folders.length} folders · {cat.folders.reduce((a, f) => a + f.photos.length, 0)} photographs · {cat.span}
                </div>
              </div>
            </div>
            <div className="vt-ch-foliage vt-disp">{cat.no}</div>
          </div>

          <div className="vt-folders">
            {cat.folders.map((f) => (
              <article key={f.id} id={`vt-fd-${f.id}`} className="vt-folder">
                <header className="vt-folder-head">
                  <span className="vt-mono vt-folder-no">{f.no}</span>
                  <h3 className="vt-folder-name vt-disp">{f.name}</h3>
                  <div className="vt-folder-meta">
                    <span className="vt-mono">{f.place}</span>
                    <span className="vt-mono" style={{ color: "var(--vt-muted)" }}>{f.date}</span>
                    <span className="vt-mono" style={{ color: "var(--vt-muted)" }}>{String(f.photos.length).padStart(2, "0")} plates</span>
                  </div>
                  <p className="vt-folder-note">{f.note}</p>
                </header>

                <div className="vt-rail">
                  <div className="vt-rail-track" style={{ animationDuration: `${Math.max(28, f.photos.length * 5)}s` }}>
                    {[...f.photos, ...f.photos].map((pid, pi) => {
                      const real = pi % f.photos.length;
                      return (
                        <figure
                          key={pi}
                          className={`vt-plate ${real % 3 === 1 ? "is-tall" : real % 5 === 4 ? "is-wide" : ""}`}
                          onClick={() => setLightbox({ folder: f, idx: real })}
                          aria-hidden={pi >= f.photos.length}
                        >
                          <div className="vt-imgwrap vt-plate-img">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={VT_U(pid, 1100)} alt="" loading="lazy" />
                          </div>
                          <figcaption className="vt-mono vt-plate-cap">
                            <span style={{ color: "var(--vt-accent)" }}>{f.no}.{String(real + 1).padStart(2, "0")}</span>
                            <span style={{ color: "var(--vt-muted)", marginLeft: 10 }}>plate {String(real + 1).padStart(2, "0")} of {String(f.photos.length).padStart(2, "0")}</span>
                          </figcaption>
                        </figure>
                      );
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <footer className="vt-colophon">
        <div className="vt-colophon-mark vt-disp">VAULT</div>
        <div className="vt-colophon-grid">
          <div>
            <div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Photographer</div>
            <div>{D.brand.photographer}</div>
            <div className="vt-mono" style={{ color: "var(--vt-muted)", marginTop: 6 }}>{D.brand.based}</div>
          </div>
          <div>
            <div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Edition</div>
            <div>{D.brand.edition}</div>
            <div className="vt-mono" style={{ color: "var(--vt-muted)", marginTop: 6 }}>Set in Anton, Manrope &amp; JetBrains Mono.</div>
          </div>
          <div>
            <div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Contact</div>
            <div>hello@vault.studio</div>
            <div className="vt-mono" style={{ color: "var(--vt-muted)", marginTop: 6 }}>For commissions &amp; the archive.</div>
          </div>
          <div>
            <div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Built with</div>
            <div style={{ color: "var(--vt-accent)" }}>FRAME</div>
            <div className="vt-mono" style={{ color: "var(--vt-muted)", marginTop: 6 }}>©2018 — 2026</div>
          </div>
        </div>
      </footer>

      {lightbox && (
        <Lightbox
          folder={lightbox.folder}
          idx={lightbox.idx}
          onClose={() => setLightbox(null)}
          onNext={() => setLightbox((s) => s && ({ ...s, idx: (s.idx + 1) % s.folder.photos.length }))}
          onPrev={() => setLightbox((s) => s && ({ ...s, idx: (s.idx - 1 + s.folder.photos.length) % s.folder.photos.length }))}
        />
      )}
    </div>
  );
}

function Lightbox({ folder, idx, onClose, onNext, onPrev }: { folder: VtFolder; idx: number; onClose: () => void; onNext: () => void; onPrev: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNext, onPrev]);

  return (
    <div className="vt-lb">
      <div className="vt-lb-bg" onClick={onClose} />
      <header className="vt-lb-head">
        <span className="vt-mono">
          <span style={{ color: "var(--vt-accent)" }}>{folder.no}.{String(idx + 1).padStart(2, "0")}</span>
          <span style={{ margin: "0 10px", opacity: 0.5 }}>·</span>
          {folder.name} · {folder.place}
        </span>
        <button className="vt-lb-x" onClick={onClose}>✕</button>
      </header>
      <div className="vt-lb-stage">
        <button className="vt-lb-nav vt-lb-prev" onClick={onPrev}>←</button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={VT_U(folder.photos[idx]!, 1800)} alt="" />
        <button className="vt-lb-nav vt-lb-next" onClick={onNext}>→</button>
      </div>
      <footer className="vt-lb-foot vt-mono">plate {String(idx + 1).padStart(2, "0")} of {String(folder.photos.length).padStart(2, "0")}</footer>
    </div>
  );
}

const VT_CSS = `
.vt-root{ font-family:var(--vt-sans); color:var(--vt-fg); background:var(--vt-bg); padding-top:48px; -webkit-font-smoothing:antialiased }
.vt-root .vt-mono{ font-family:var(--vt-mono); font-size:11px; letter-spacing:.06em; text-transform:uppercase }
.vt-root .vt-disp{ font-family:var(--vt-display); letter-spacing:.005em; line-height:.86; text-transform:uppercase }
.vt-root .vt-imgwrap{ position:relative; overflow:hidden; background:var(--vt-paper) }
.vt-root .vt-imgwrap img{ width:100%; height:100%; object-fit:cover; display:block }
.vt-root ::selection{ background:var(--vt-accent); color:var(--vt-bg) }

.vt-top{ position:fixed; top:0; left:0; right:0; height:48px; z-index:60; display:grid; grid-template-columns: 1fr 1fr 1fr; align-items:center; padding: 0 22px; background:var(--vt-bg); border-bottom:1px solid var(--vt-line) }
.vt-top-l{ display:flex; align-items:center; gap:12px }
.vt-top-c{ text-align:center; color:var(--vt-muted) }
.vt-top-c strong{ color:var(--vt-fg); margin:0 2px }
.vt-top-r{ text-align:right; display:flex; align-items:center; justify-content:flex-end; gap:14px }
.vt-top-mark{ font-size:22px; line-height:1 }
.vt-hamb{ width:30px; height:30px; border:0; background:transparent; cursor:pointer; display:none; flex-direction:column; align-items:center; justify-content:center; gap:5px; color:var(--vt-fg); padding:0 }
.vt-hamb span{ display:block; width:18px; height:1px; background:currentColor }
.vt-top-cta{ display:inline-flex; align-items:center; padding:7px 14px; background:var(--vt-fg); color:var(--vt-bg); transition:background .25s ease; text-decoration:none }
.vt-top-cta:hover{ background:var(--vt-accent) }
@media (max-width:900px){ .vt-top-edition{ display:none } .vt-top-author{ display:none } .vt-hamb{ display:flex } }
@media (max-width:760px){ .vt-top{ grid-template-columns: auto 1fr auto; height:44px; padding:0 14px } .vt-top-c{ display:none } .vt-top-mark{ font-size:18px } }

/* SLIDE-IN NAV */
.vt-nav{ position:fixed; inset:0; z-index:90; pointer-events:none }
.vt-nav.is-open{ pointer-events:auto }
.vt-nav-bg{ position:absolute; inset:0; background:rgba(14,12,10,.5); opacity:0; transition:opacity .5s var(--vt-ease) }
.vt-nav.is-open .vt-nav-bg{ opacity:1 }
.vt-nav-panel{ position:absolute; left:0; top:0; bottom:0; width:min(420px, 92vw); background:var(--vt-bg); padding:18px 22px; transform:translateX(-100%); transition:transform .5s var(--vt-ease); display:flex; flex-direction:column; gap:18px; border-right:1px solid var(--vt-line) }
.vt-nav.is-open .vt-nav-panel{ transform:translateX(0) }
.vt-nav-head{ display:flex; align-items:center; justify-content:space-between; padding-bottom:14px; border-bottom:1px solid var(--vt-line) }
.vt-nav-x{ appearance:none; border:1px solid var(--vt-line); background:transparent; width:34px; height:34px; cursor:pointer; color:var(--vt-fg) }
.vt-nav-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:6px }
.vt-nav-list button{ width:100%; appearance:none; border:0; background:transparent; cursor:pointer; text-align:left; display:grid; grid-template-columns: 50px 1fr; gap:14px; align-items:baseline; padding:14px 4px; color:var(--vt-fg); border-bottom:1px solid var(--vt-line); transition:padding .25s var(--vt-ease), color .2s ease }
.vt-nav-list button:hover{ padding-left:14px; color:var(--vt-accent) }
.vt-nav-list .vt-disp{ font-size:30px; line-height:.95 }
.vt-nav-sublist{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:4px }
.vt-nav-sublist button{ width:100%; appearance:none; border:0; background:transparent; cursor:pointer; text-align:left; display:grid; grid-template-columns: 24px 1fr; gap:12px; padding:10px 4px; color:var(--vt-muted); transition:color .2s ease, padding .2s ease }
.vt-nav-sublist button:hover{ color:var(--vt-accent); padding-left:8px }
.vt-nav-foot{ margin-top:auto; padding-top:14px; border-top:1px solid var(--vt-line); display:flex; justify-content:space-between }

.vt-cover{ min-height: calc(100vh - 48px); padding: clamp(28px,4vw,56px); border-bottom:1px solid var(--vt-line); display:flex; flex-direction:column; justify-content:stretch }
.vt-cover-grid{ flex:1; display:grid; grid-template-columns: 1.2fr 1fr; gap: clamp(28px,5vw,80px); align-items:stretch }
.vt-cover-l{ display:flex; flex-direction:column; justify-content:space-between; gap:32px }
.vt-cover-eye{ color:var(--vt-muted); font-size:11px; line-height:1.6; max-width:30ch }
.vt-cover-title{ font-size: clamp(72px,18vw,320px); line-height:.85; letter-spacing:.005em; display:flex; flex-direction:column }
.vt-cover-amp{ align-self:flex-start; font-family:var(--vt-display); font-size: clamp(48px,9vw,140px); color:var(--vt-accent); line-height:.7; margin: -.05em 0 -.05em .04em }
.vt-cover-meta{ display:grid; grid-template-columns:repeat(5,1fr); gap:24px; padding:24px 0; border-top:1px solid var(--vt-line); border-bottom:1px solid var(--vt-line) }
.vt-cover-meta > div > div:first-child{ margin-bottom:6px }
.vt-cover-cta{ align-self:flex-start; display:inline-flex; align-items:center; padding:14px 24px; background:var(--vt-fg); color:var(--vt-bg); transition:background .25s ease; cursor:pointer; text-decoration:none }
.vt-cover-cta:hover{ background:var(--vt-accent) }
.vt-cover-r{ display:flex; align-items:flex-end }
.vt-cover-plate{ margin:0; width:100% }
.vt-cover-plate figcaption{ padding-top:10px; color:var(--vt-fg) }
@media (max-width:900px){ .vt-cover-grid{ grid-template-columns:1fr } .vt-cover-meta{ grid-template-columns:repeat(3,1fr); gap:18px } .vt-cover-r{ order:-1; max-width:340px } }

.vt-toc{ padding: clamp(80px,12vh,140px) clamp(28px,4vw,56px); border-bottom:1px solid var(--vt-line) }
.vt-toc-head{ max-width:780px; margin: 0 auto clamp(40px,6vh,80px); text-align:center; display:flex; flex-direction:column; align-items:center; gap:18px }
.vt-toc-head h2{ font-size: clamp(56px,14vw,200px); margin:0; line-height:.85 }
.vt-toc-head .vt-mono{ color:var(--vt-muted) }
.vt-toc-lede{ margin:0; max-width:46ch; font-size:18px; line-height:1.5; color:var(--vt-muted) }

.vt-toc-list{ list-style:none; margin: 0 auto; padding:0; max-width:1100px; display:flex; flex-direction:column; gap:36px }
.vt-toc-cat{ display:flex; flex-direction:column }
.vt-toc-cat-row{ appearance:none; border:0; background:transparent; cursor:pointer; text-align:left; display:grid; grid-template-columns: 60px 1fr auto auto auto; gap:18px; align-items:baseline; padding:18px 4px; border-bottom:1px solid var(--vt-line); transition: padding .35s var(--vt-ease), color .25s ease; color:inherit }
.vt-toc-cat-row:hover{ padding-left:14px; color:var(--vt-accent) }
.vt-toc-no{ color:var(--vt-muted); font-size:13px }
.vt-toc-name{ font-size: clamp(28px,5vw,64px); line-height:.95 }
.vt-toc-dots{ flex:1; height:1px; align-self:center; background-image: radial-gradient(circle, var(--vt-line) 1px, transparent 1px); background-size: 8px 1px; background-repeat: repeat-x }
.vt-toc-meta{ color:var(--vt-muted) }
.vt-toc-sep{ margin:0 6px; opacity:.4 }
.vt-toc-page{ color:var(--vt-fg); padding-left:14px; border-left:1px solid var(--vt-line); margin-left:14px }

.vt-toc-folders{ list-style:none; margin: 8px 0 0 60px; padding:0; display:flex; flex-direction:column; gap:6px }
.vt-toc-folder{ color:var(--vt-muted); border-bottom:1px dotted var(--vt-line) }
.vt-toc-folder-btn{ width:100%; appearance:none; border:0; background:transparent; cursor:pointer; text-align:left; display:grid; grid-template-columns: 70px 1fr 2fr auto; gap:14px; align-items:baseline; padding: 10px 4px; color:inherit; transition: padding .25s var(--vt-ease), color .2s ease }
.vt-toc-folder-btn:hover{ padding-left:14px; color:var(--vt-accent) }
.vt-toc-folder-btn:hover .vt-toc-fname{ color:var(--vt-accent) }
.vt-toc-fno{ color:var(--vt-accent) }
.vt-toc-fname{ font-family:var(--vt-display); font-size:22px; color:var(--vt-fg); letter-spacing:.005em; text-transform:uppercase }
.vt-toc-fnote{ font-size:11px }
.vt-toc-fcount{ color:var(--vt-fg) }
@media (max-width:760px){ .vt-toc-cat-row{ grid-template-columns: 40px 1fr auto } .vt-toc-dots, .vt-toc-meta{ display:none } .vt-toc-folder-btn{ grid-template-columns: 50px 1fr auto } .vt-toc-folder .vt-toc-fnote{ display:none } }

.vt-chapter{ border-bottom:1px solid var(--vt-line) }
.vt-ch-cover{ position:relative; height:min(80dvh,760px); width:100%; overflow:hidden; isolation:isolate; color:#F0EADA; display:grid; align-items:end; padding: 0 clamp(28px,4vw,56px) clamp(36px,6vh,72px); background:#222 }
.vt-root .vt-chapter .vt-ch-cover-img{ position:absolute; inset:0; z-index:0; background:#222 }
.vt-root .vt-chapter .vt-ch-cover-img img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover }
.vt-ch-cover-tint{ position:absolute; inset:0; z-index:1; background: linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.1) 30%, rgba(0,0,0,.45) 60%, rgba(0,0,0,.95) 100%) }
.vt-ch-cover-text{ position:relative; z-index:2; max-width:740px; display:flex; flex-direction:column; gap:14px }
.vt-ch-name{ margin:0; font-size:clamp(56px,14vw,220px); line-height:.85; color:#F4F0E6 }
.vt-ch-summary{ display:flex; flex-direction:column; max-width:50ch }
.vt-ch-summary p{ margin:0; font-size:18px; line-height:1.5; color:#F4F0E6; font-family:var(--vt-sans); font-weight:400 }
.vt-ch-foliage{ position:absolute; right:clamp(28px,4vw,56px); top:clamp(24px,4vh,40px); font-size: clamp(96px,22vw,360px); line-height:.8; color:rgba(255,255,255,.18); pointer-events:none }

.vt-folders{ padding: clamp(48px,8vh,90px) 0; display:flex; flex-direction:column; gap: clamp(56px,9vh,100px) }
.vt-folder{ position:relative }
.vt-folder-head{ display:grid; grid-template-columns: 90px 1fr 1fr; gap:24px; padding: 0 clamp(28px,4vw,56px) 22px; align-items:end; border-bottom:1px solid var(--vt-line); margin-bottom:24px }
.vt-folder-no{ color:var(--vt-accent) }
.vt-folder-name{ margin:0; font-size:clamp(34px,6vw,96px); line-height:.9 }
.vt-folder-meta{ display:flex; flex-direction:column; gap:4px; align-items:flex-end; text-align:right }
.vt-folder-note{ grid-column: 2 / -1; max-width:62ch; margin:0; font-size:16px; line-height:1.55; color:var(--vt-muted); font-style:italic }
@media (max-width:760px){ .vt-folder-head{ grid-template-columns: 50px 1fr } .vt-folder-meta{ grid-column: 1 / -1; align-items:flex-start; text-align:left; flex-direction:row; gap:14px; flex-wrap:wrap } .vt-folder-note{ grid-column:1 / -1 } }

.vt-rail{ overflow:hidden; padding-bottom: 14px; -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 4%, #000 96%, transparent 100%); mask-image: linear-gradient(90deg, transparent 0, #000 4%, #000 96%, transparent 100%) }
.vt-rail-track{ display:flex; align-items:flex-end; gap:14px; width:max-content; animation: vt-glide 60s linear infinite; padding: 0 clamp(28px,4vw,56px) }
.vt-rail-track:hover{ animation-play-state: paused }
@keyframes vt-glide{ to { transform: translateX(-50%) } }
.vt-plate{ flex: 0 0 auto; width: clamp(220px,26vw,380px); margin:0; cursor:zoom-in; display:flex; flex-direction:column; gap:8px }
.vt-plate-img{ aspect-ratio: 4 / 5; transition: transform .4s var(--vt-ease) }
.vt-plate.is-tall .vt-plate-img{ aspect-ratio: 3 / 5 }
.vt-plate.is-wide{ width: clamp(360px,36vw,520px) }
.vt-plate.is-wide .vt-plate-img{ aspect-ratio: 4 / 3 }
.vt-plate:hover .vt-plate-img{ transform: translateY(-4px) }
.vt-plate-cap{ display:flex; align-items:baseline }
@media (prefers-reduced-motion: reduce){ .vt-rail{ overflow-x:auto } .vt-rail-track{ animation:none; width:auto } }

.vt-colophon{ background:var(--vt-fg); color:var(--vt-bg); padding: clamp(80px,12vh,140px) clamp(28px,4vw,56px) 36px }
.vt-colophon-mark{ font-size:clamp(96px,22vw,320px); line-height:.85; padding-bottom: 36px; border-bottom:1px solid rgba(244,240,230,.15); margin-bottom: 36px }
.vt-colophon-grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:24px; font-size:14px }
.vt-colophon-grid > div > div:first-child{ margin-bottom:6px }
@media (max-width:760px){ .vt-colophon-grid{ grid-template-columns:repeat(2,1fr) } }

.vt-lb{ position:fixed; inset:0; z-index:200; display:flex; flex-direction:column }
.vt-lb-bg{ position:absolute; inset:0; background:rgba(14,12,10,.96) }
.vt-lb-head, .vt-lb-stage, .vt-lb-foot{ position:relative; z-index:1; color:#F0EADA }
.vt-lb-head{ display:flex; justify-content:space-between; align-items:center; padding:18px 24px; border-bottom:1px solid rgba(244,240,230,.12) }
.vt-lb-x{ appearance:none; border:1px solid rgba(244,240,230,.18); background:transparent; color:inherit; width:34px; height:34px; cursor:pointer }
.vt-lb-stage{ flex:1; display:flex; align-items:center; justify-content:center; padding:30px; min-height:0 }
.vt-lb-stage img{ max-width:100%; max-height:100%; object-fit:contain }
.vt-lb-nav{ appearance:none; background:transparent; border:1px solid rgba(244,240,230,.18); color:inherit; width:48px; height:48px; cursor:pointer; position:absolute; top:50%; transform:translateY(-50%); font-family:var(--vt-display); font-size:22px }
.vt-lb-nav:hover{ background:rgba(244,240,230,.08) }
.vt-lb-prev{ left:24px } .vt-lb-next{ right:24px }
.vt-lb-foot{ padding:14px 24px; border-top:1px solid rgba(244,240,230,.12); color:rgba(244,240,230,.6); text-align:center }
`;
