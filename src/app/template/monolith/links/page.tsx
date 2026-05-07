"use client";

import { MN_TOKENS, MN_FONTS, MN_PHOTOS, mnBaseCss } from "~/lib/monolith/data";

export default function MonolithLinksPage() {
  const t = MN_TOKENS;
  const links = [
    { no: "01", label: "Book a session",   sub: "2025 commissions · waitlist open", href: "#",                                accent: true },
    { no: "02", label: "Portfolio",        sub: "Selected work · 2014–2024",         href: "/template/monolith"                              },
    { no: "03", label: "Recent delivery",  sub: "Margot & Auden · Sep 2024",         href: "/template/monolith/delivery"                     },
    { no: "04", label: "The Journal",      sub: "Notes from the field · monthly",    href: "#"                                               },
    { no: "05", label: "Print Shop",       sub: "Limited editions · signed",         href: "#"                                               },
    { no: "06", label: "Instagram",        sub: "@yara.sokol · 38.4K",               href: "#"                                               },
  ];

  return (
    <div className="mn-root" style={{ minHeight: "100dvh", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <style>{mnBaseCss(t)}</style>
      <style>{`
        .mk-stripe{height:4px;background:${t.accent}}
        .mk-bar{display:grid;grid-template-columns:auto 1fr auto;align-items:center;padding:14px 20px;border-bottom:1px solid ${t.line};font-family:${MN_FONTS.mono};font-size:10px;text-transform:uppercase;color:${t.muted};letter-spacing:0.06em}
        .mk-bar .dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:${t.accent};margin-right:6px;animation:mkPulse 2s infinite}
        @keyframes mkPulse{0%,100%{opacity:1}50%{opacity:0.4}}
        .mk-mark{justify-self:center;font-family:${MN_FONTS.display};font-weight:800;font-size:14px;letter-spacing:-0.02em;display:flex;align-items:center;gap:6px;color:${t.fg}}
        .mk-mark .sq{width:10px;height:10px;background:${t.accent}}

        .mk-hero{padding:32px 20px;border-bottom:1px solid ${t.line}}
        .mk-hero-row{display:grid;grid-template-columns:80px 1fr;gap:16px;align-items:center}
        .mk-avatar{width:80px;height:80px;border:1px solid ${t.line};overflow:hidden}
        .mk-avatar img{width:100%;height:100%;object-fit:cover;display:block}
        .mk-name{font-family:${MN_FONTS.display};font-weight:800;font-size:34px;letter-spacing:-0.04em;line-height:0.95}
        .mk-name .ac{color:${t.accent}}
        .mk-eb{font-family:${MN_FONTS.mono};font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:${t.muted};margin-bottom:5px}
        .mk-bio{font-size:13px;color:${t.muted};line-height:1.5;margin-top:14px;padding-top:14px;border-top:1px solid ${t.hairline}}
        .mk-bio b{color:${t.fg};font-weight:500}

        .mk-stack{display:flex;flex-direction:column;gap:0;border-bottom:1px solid ${t.line}}
        .mk-link{display:grid;grid-template-columns:46px 1fr auto;align-items:center;padding:18px 20px;border-top:1px solid ${t.line};color:${t.fg};text-decoration:none;cursor:pointer;transition:all .18s ease;background:${t.bg};gap:8px}
        .mk-link:hover{background:${t.fg};color:${t.bg}}
        .mk-link:hover .sub{color:rgba(245,244,241,0.65)}
        .mk-link:hover .ar{color:${t.accent}}
        .mk-link.accent{background:${t.accent};color:#FFF;border-top-color:${t.accent}}
        .mk-link.accent:hover{background:${t.fg};color:${t.bg};border-top-color:${t.fg}}
        .mk-link.accent:hover .ar{color:${t.accent}}
        .mk-link.accent:hover .sub{color:rgba(245,244,241,0.65)}
        .mk-link .no{font-family:${MN_FONTS.mono};font-size:11px;letter-spacing:0.06em}
        .mk-link .lbl{font-family:${MN_FONTS.display};font-weight:700;font-size:22px;letter-spacing:-0.03em;line-height:1}
        .mk-link.accent .lbl{font-weight:800}
        .mk-link .sub{font-family:${MN_FONTS.mono};font-size:9px;letter-spacing:0.06em;text-transform:uppercase;color:${t.muted};margin-top:4px;display:block;transition:color .18s ease}
        .mk-link.accent .sub{color:rgba(255,255,255,0.75)}
        .mk-link .ar{font-family:${MN_FONTS.mono};font-size:16px;transition:transform .18s ease,color .18s ease}
        .mk-link:hover .ar{transform:translateX(3px)}

        .mk-stats{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid ${t.line}}
        .mk-stats > div{padding:14px 12px;border-right:1px solid ${t.line};text-align:center}
        .mk-stats > div:last-child{border-right:0}
        .mk-stats .v{font-family:${MN_FONTS.display};font-weight:800;font-size:26px;letter-spacing:-0.03em}
        .mk-stats .l{font-family:${MN_FONTS.mono};font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:${t.muted};margin-top:4px}

        .mk-foot{padding:14px 20px;display:flex;justify-content:space-between;font-family:${MN_FONTS.mono};font-size:9px;letter-spacing:0.08em;text-transform:uppercase;color:${t.muted}}
        .mk-foot .ac{color:${t.accent}}
      `}</style>

      <div className="mk-stripe" />
      <div className="mk-bar">
        <span><span className="dot" />Online</span>
        <span className="mk-mark"><span className="sq" />Monolith</span>
        <span>v12 / 04</span>
      </div>

      <div className="mk-hero">
        <div className="mk-hero-row">
          <div className="mk-avatar">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MN_PHOTOS.portraits![2]!.src} alt="Yara" />
          </div>
          <div>
            <div className="mk-eb">Photographer · Berlin</div>
            <div className="mk-name">Yara<br /><span className="ac">Sokol.</span></div>
          </div>
        </div>
        <div className="mk-bio"><b>Architecture, identity, quiet documentary.</b> Available worldwide for editorial, commercial, and private commissions through Q1 2025.</div>
      </div>

      <div className="mk-stack">
        {links.map((l) => (
          <a key={l.no} className={`mk-link ${l.accent ? "accent" : ""}`} href={l.href}>
            <span className="no">{l.no}</span>
            <span>
              <span className="lbl">{l.label}</span>
              <span className="sub">{l.sub}</span>
            </span>
            <span className="ar">→</span>
          </a>
        ))}
      </div>

      <div className="mk-stats">
        <div><div className="v">12</div><div className="l">Years</div></div>
        <div><div className="v">184</div><div className="l">Frames</div></div>
        <div><div className="v">DE</div><div className="l">Based</div></div>
      </div>

      <div className="mk-foot">
        <span>© MMXXIV</span>
        <span>Built in <span className="ac">Berlin</span></span>
      </div>
    </div>
  );
}
