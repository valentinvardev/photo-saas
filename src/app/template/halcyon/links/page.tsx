"use client";

import { HL_TOKENS, HL_FONTS, HL_PHOTOS, hlBaseCss } from "~/lib/halcyon/data";

export default function HalcyonLinksPage() {
  const t = HL_TOKENS;
  const links = [
    { label: "Book a session",   sub: "2025 commissions · waitlist",       href: "#", accent: true  },
    { label: "Portfolio",        sub: "Selected work · 2014–2024",         href: "/template/halcyon"                  },
    { label: "Recent delivery",  sub: "Margot & Auden · Sep 2024",         href: "/template/halcyon/delivery"         },
    { label: "The Journal",      sub: "Notes from the field · monthly",    href: "#" },
    { label: "Print Shop",       sub: "Limited editions · signed",         href: "#" },
    { label: "Instagram",        sub: "@lior.avni · 38.4k",                 href: "#" },
  ];
  const stats = [
    { v: "12",  l: "Years"  },
    { v: "184", l: "Stories" },
    { v: "LIS", l: "Based"  },
  ];

  return (
    <div className="hl-root" style={{ minHeight: "100dvh", position: "relative", overflow: "hidden" }}>
      <style>{hlBaseCss(t)}</style>
      <style>{`
        .hk-stripe{height:3px;background:${t.accent}}
        .hk-marquee{overflow:hidden;border-bottom:1px solid ${t.line};padding:10px 0}
        .hk-marquee-track{display:flex;gap:48px;white-space:nowrap;animation:hkMarq 42s linear infinite;font-family:${HL_FONTS.mono};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${t.muted}}
        .hk-marquee-track span b{color:${t.fg};font-weight:400}
        .hk-marquee-track span em{color:${t.accent};font-style:normal}
        @keyframes hkMarq{from{transform:translateX(0)}to{transform:translateX(-50%)}}

        .hk-wrap{padding:48px 32px 32px;display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center}
        .hk-avatar{width:108px;height:108px;border-radius:50%;border:1px solid ${t.line};padding:6px;position:relative}
        .hk-avatar::after{content:"";position:absolute;top:-4px;right:-4px;width:14px;height:14px;border-radius:50%;background:${t.accent};border:3px solid ${t.bg}}
        .hk-avatar img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}
        .hk-eyebrow{font-family:${HL_FONTS.mono};font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${t.accent}}
        .hk-name{font-family:${HL_FONTS.serif};font-size:48px;line-height:1;letter-spacing:-0.02em}
        .hk-name em{font-style:italic}
        .hk-bio{color:${t.muted};max-width:340px;line-height:1.55;font-size:14px}

        .hk-stack{display:flex;flex-direction:column;gap:10px;width:100%;max-width:380px;margin-top:8px}
        .hk-link{display:flex;justify-content:space-between;align-items:center;padding:16px 18px;border:1px solid ${t.line};background:${t.raised};color:${t.fg};text-decoration:none;cursor:pointer;transition:all .3s cubic-bezier(0.22,1,0.36,1)}
        .hk-link:hover{transform:translateX(4px);border-color:${t.fg}}
        .hk-link.accent{background:${t.accent};border-color:${t.accent};color:${t.fg}}
        .hk-link.accent:hover{background:${t.fg};color:${t.bg};border-color:${t.fg}}
        .hk-link.accent:hover .l,.hk-link.accent:hover .s,.hk-link.accent:hover .ar{color:${t.bg}}
        .hk-link.accent:hover .s{opacity:0.7}
        .hk-link .l{font-family:${HL_FONTS.serif};font-size:18px;text-align:left}
        .hk-link.accent .l{font-style:italic;color:${t.fg}}
        .hk-link .s{font-family:${HL_FONTS.mono};font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:${t.muted};display:block;margin-top:3px;text-align:left}
        .hk-link.accent .s{color:${t.fg};opacity:0.85}
        .hk-link .ar{font-family:${HL_FONTS.mono};font-size:14px;color:${t.muted};transition:transform .3s ease,color .3s ease}
        .hk-link:hover .ar{color:${t.fg};transform:translateX(2px)}
        .hk-link.accent .ar{color:${t.fg}}

        .hk-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;width:100%;max-width:380px;margin-top:10px;border-top:1px solid ${t.line};border-bottom:1px solid ${t.line}}
        .hk-stats > div{padding:14px 0;border-right:1px solid ${t.line}}
        .hk-stats > div:last-child{border-right:0}
        .hk-stats .v{font-family:${HL_FONTS.serif};font-size:26px;line-height:1}
        .hk-stats .l{font-family:${HL_FONTS.mono};font-size:9px;letter-spacing:0.12em;color:${t.muted};text-transform:uppercase;margin-top:5px}

        .hk-foot{font-family:${HL_FONTS.mono};font-size:9px;letter-spacing:0.14em;color:${t.muted};text-transform:uppercase;margin-top:12px}
        .hk-foot em{font-style:normal;color:${t.accent}}
      `}</style>

      <div className="hk-stripe" />
      <div className="hk-marquee">
        <div className="hk-marquee-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>
              <b>HALCYON STUDIO</b> &nbsp;<em>●</em>&nbsp; PHOTOGRAPHY BY LIOR AVNI &nbsp;<em>●</em>&nbsp; LISBON · NEW YORK &nbsp;<em>●</em>&nbsp; AVAILABLE FOR 2025 &nbsp;<em>●</em>&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="hk-wrap">
        <div className="hk-avatar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HL_PHOTOS.portraits![2]!.src} alt="Lior Avni" />
        </div>
        <div className="hk-eyebrow">Photographer · Lisbon</div>
        <div className="hk-name">Lior <em>Avni</em></div>
        <div className="hk-bio">Editorial, weddings, and quiet rooms. Shooting on film and slow digital since 2012.</div>

        <div className="hk-stack">
          {links.map((l, i) => (
            <a key={i} className={`hk-link ${l.accent ? "accent" : ""}`} href={l.href}>
              <span>
                <span className="l">{l.label}</span>
                <span className="s">{l.sub}</span>
              </span>
              <span className="ar">→</span>
            </a>
          ))}
        </div>

        <div className="hk-stats">
          {stats.map((s) => (
            <div key={s.l}>
              <div className="v">{s.v}</div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="hk-foot">Built with <em>FRAME</em> · © MMXXIV</div>
      </div>
    </div>
  );
}
