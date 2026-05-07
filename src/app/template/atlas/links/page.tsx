"use client";

import { ATLAS_U } from "~/lib/atlas/data";

export default function AtlasLinksPage() {
  const links = [
    { label: "Book a session",                sub: "Weddings · editorial · brand",                 href: "#",                              accent: true },
    { label: "View the index",                sub: "Five projects, the rest in the archive",       href: "/template/atlas"                              },
    { label: "Latest delivery — Marais",      sub: "For Seraphine & Theo · password required",     href: "/template/atlas/delivery"                     },
    { label: "The journal",                   sub: "Notes from the road, on Substack",             href: "#"                                            },
    { label: "Are.na — moodboards",           sub: "What we're looking at this season",            href: "#"                                            },
    { label: "Email the studio",              sub: "hello@atlas.studio · replies in 24h",          href: "mailto:hello@atlas.studio"                    },
  ];

  return (
    <div className="atl-root">
      <style>{ATL_CSS}</style>
      <div className="atd-stripe" />

      <div className="atl-marquee">
        <div className="atl-marquee-track">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="atl-marquee-item">
              Atlas Studio <span className="atl-marquee-dot">✺</span> photographer at large <span className="atl-marquee-dot">✺</span>
            </span>
          ))}
        </div>
      </div>

      <main className="atl-card">
        <div className="atl-avatar at-imgwrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ATLAS_U("1531746020798-e6953c6e8e04", 400)} alt="Atlas Studio" />
        </div>

        <span className="at-mono atl-eye">— Photographer —</span>
        <h1 className="atl-name">
          <span style={{ fontFamily: "var(--at-display)", fontStyle: "italic", fontWeight: 400 }}>atlas</span>
          <span style={{ fontFamily: "var(--at-display)", fontWeight: 500 }}>studio.</span>
        </h1>
        <p className="atl-bio">A small studio between Paris &amp; Lisbon. Weddings, editorial, &amp; the in-between.</p>

        <ul className="atl-links">
          {links.map((l, i) => (
            <li key={i}>
              <a href={l.href} className={`atl-link ${l.accent ? "is-accent" : ""}`}>
                <span className="atl-link-no at-mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="atl-link-text">
                  <span className="atl-link-label">{l.label}</span>
                  <span className="atl-link-sub">{l.sub}</span>
                </span>
                <span className="atl-link-arrow">↗</span>
              </a>
            </li>
          ))}
        </ul>

        <ul className="atl-stats">
          <li><span className="atl-stat-num">07</span><span className="at-mono">years</span></li>
          <li><span className="atl-stat-num">142</span><span className="at-mono">weddings</span></li>
          <li><span className="atl-stat-num">PAR / LIS</span><span className="at-mono">based</span></li>
        </ul>

        <footer className="atl-foot at-mono">
          built with <span style={{ color: "var(--at-accent)" }}>FRAME</span>
        </footer>
      </main>
    </div>
  );
}

const ATL_CSS = `
.atl-root{ min-height:100vh; background:var(--at-bg); color:var(--at-fg); font-family:var(--at-sans); position:relative; padding-top:24px }
.atl-root .at-mono{ font-family:var(--at-mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase }
.atl-root .at-imgwrap{ position:relative; overflow:hidden; background:var(--at-raised) }
.atl-root .at-imgwrap img{ width:100%; height:100%; object-fit:cover }
.atd-stripe{ position:fixed; top:0; left:0; right:0; height:3px; background:var(--at-accent); z-index:60 }

.atl-marquee{ border-top:1px solid var(--at-line); border-bottom:1px solid var(--at-line); overflow:hidden; padding:14px 0 }
.atl-marquee-track{ display:flex; gap:32px; white-space:nowrap; animation: atl-marquee 36s linear infinite; font-family:var(--at-display); font-style:italic; font-size:clamp(20px,3vw,30px); letter-spacing:-.02em }
.atl-marquee-dot{ color:var(--at-accent); font-style:normal; margin:0 12px }
@keyframes atl-marquee{ to { transform: translateX(-50%) } }

.atl-card{ width:min(540px, 92vw); margin: clamp(40px,8vh,80px) auto clamp(32px,5vh,60px); display:flex; flex-direction:column; align-items:center; text-align:center; gap:14px; padding: 0 8px }
.atl-avatar{ width:96px; height:96px; border-radius:50%; overflow:hidden; border:2px solid var(--at-line) }
.atl-eye{ color:var(--at-muted); margin-top:4px }
.atl-name{ margin:0; font-size: clamp(48px,9vw,78px); line-height:.92; letter-spacing:-.045em; display:flex; gap:.12em; flex-wrap:wrap; justify-content:center }
.atl-bio{ margin:0; max-width:36ch; color:var(--at-muted); font-size:15px; line-height:1.5 }

.atl-links{ list-style:none; margin:24px 0 0; padding:0; width:100%; display:flex; flex-direction:column; gap:8px }
.atl-link{ display:grid; grid-template-columns: 32px 1fr 24px; align-items:center; gap:14px; padding:18px 18px; text-decoration:none; color:inherit; background:var(--at-raised); border:1px solid var(--at-line); transition: transform .25s var(--at-reveal), background .25s ease, border-color .25s ease, padding .25s var(--at-reveal); text-align:left }
.atl-link:hover{ transform:translateX(4px); border-color:var(--at-fg) }
.atl-link.is-accent{ background:var(--at-accent); color:#fff; border-color:var(--at-accent) }
.atl-link.is-accent:hover{ background:#0E22DD; border-color:#0E22DD }
.atl-link-no{ color:var(--at-muted) }
.atl-link.is-accent .atl-link-no{ color:rgba(255,255,255,.6) }
.atl-link-text{ display:flex; flex-direction:column; gap:2px; min-width:0 }
.atl-link-label{ font-family:var(--at-display); font-weight:500; font-size:18px; letter-spacing:-.01em }
.atl-link-sub{ font-size:12px; color:var(--at-muted) }
.atl-link.is-accent .atl-link-sub{ color:rgba(255,255,255,.7) }
.atl-link-arrow{ color:var(--at-muted); transition: transform .25s var(--at-reveal); font-size:16px }
.atl-link:hover .atl-link-arrow{ transform:translate(3px,-3px); color:var(--at-fg) }
.atl-link.is-accent .atl-link-arrow{ color:rgba(255,255,255,.85) }

.atl-stats{ list-style:none; margin:32px 0 0; padding:24px 0 0; display:flex; gap:18px; width:100%; justify-content:space-around; border-top:1px solid var(--at-line) }
.atl-stats li{ display:flex; flex-direction:column; gap:2px; align-items:center }
.atl-stat-num{ font-family:var(--at-display); font-weight:500; font-size:clamp(20px,3vw,30px); letter-spacing:-.03em; line-height:1 }
.atl-stats .at-mono{ color:var(--at-muted) }
.atl-foot{ margin-top:24px; color:var(--at-muted); font-size:10px }
`;
