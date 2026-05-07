"use client";

import { useEffect, useMemo, useState } from "react";
import { MN_TOKENS, MN_FONTS, MN_PORTFOLIO, mnBaseCss, type MnProject } from "~/lib/monolith/data";
import type { HlPhoto } from "~/lib/halcyon/data";

type Lightbox = { photos: HlPhoto[]; index: number } | null;

export default function MonolithPortfolioPage() {
  const t = MN_TOKENS;
  const data = MN_PORTFOLIO;

  const [filter, setFilter]     = useState("ALL");
  const [active, setActive]     = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<Lightbox>(null);

  const visible = useMemo(
    () => filter === "ALL" ? data.projects : data.projects.filter((p) => p.tag === filter),
    [filter, data.projects]
  );
  const project = data.projects.find((p) => p.id === active);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (lightbox) setLightbox(null);
        else if (active) setActive(null);
      }
      if (lightbox) {
        if (e.key === "ArrowRight") setLightbox((l) => l && ({ ...l, index: (l.index + 1) % l.photos.length }));
        if (e.key === "ArrowLeft")  setLightbox((l) => l && ({ ...l, index: (l.index - 1 + l.photos.length) % l.photos.length }));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, active]);

  /* Build mosaic rows that always sum to 12 cols. */
  const rows = useMemo(() => {
    const patterns: { cls: string; take: number }[] = [
      { cls: "r-8-4",   take: 2 },
      { cls: "r-4-4-4", take: 3 },
      { cls: "r-4-8",   take: 2 },
      { cls: "r-6-6",   take: 2 },
    ];
    const out: { cls: string; items: MnProject[] }[] = [];
    let i = 0, p = 0;
    const items = [...visible];
    while (i < items.length) {
      const pat = patterns[p % patterns.length]!;
      const chunk = items.slice(i, i + pat.take);
      let cls = pat.cls;
      if (chunk.length < pat.take) {
        if (chunk.length === 1)      cls = "r-12";
        else if (chunk.length === 2) cls = "r-6-6";
        else if (chunk.length === 3) cls = "r-4-4-4";
      }
      out.push({ cls, items: chunk });
      i += chunk.length;
      p++;
    }
    return out;
  }, [visible]);

  return (
    <div className="mn-root" style={{ minHeight: "100dvh", position: "relative", overflow: "hidden" }}>
      <style>{mnBaseCss(t)}</style>
      <style>{`
        .mp-nav{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:20px 28px;border-bottom:1px solid ${t.line};position:sticky;top:0;background:${t.bg};z-index:20}
        .mp-nav .l,.mp-nav .r{display:flex;gap:24px;align-items:center}
        .mp-nav .r{justify-self:end}
        .mp-mark{font-family:${MN_FONTS.display};font-weight:800;font-size:24px;letter-spacing:-0.04em;justify-self:center;display:flex;align-items:center;gap:10px}
        .mp-mark .sq{width:14px;height:14px;background:${t.accent}}
        .mp-nav a{font-size:12px;font-weight:500;text-transform:uppercase;letter-spacing:0.04em;color:${t.fg};text-decoration:none;cursor:pointer}
        .mp-nav a:hover{color:${t.accent}}
        .mp-status{display:flex;align-items:center;gap:8px;font-family:${MN_FONTS.mono};font-size:11px;text-transform:uppercase;color:${t.muted}}
        .mp-status .dot{width:8px;height:8px;border-radius:50%;background:${t.accent};animation:mpPulse 2s infinite ease-in-out}
        @keyframes mpPulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @media(max-width:780px){.mp-nav{grid-template-columns:auto 1fr auto;padding:14px 18px}.mp-nav .l,.mp-nav .r .mp-status{display:none}.mp-mark{justify-self:start;font-size:20px}}

        .mp-hero{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid ${t.line}}
        .mp-hero-l{padding:64px 32px 48px;display:flex;flex-direction:column;justify-content:space-between;border-right:1px solid ${t.line}}
        .mp-hero h1{font-family:${MN_FONTS.display};font-weight:800;font-size:clamp(44px, 11vw, 128px);letter-spacing:-0.05em;line-height:0.88;color:${t.fg};word-break:break-word;overflow-wrap:break-word;hyphens:auto}
        .mp-hero h1 .ac{color:${t.accent}}
        .mp-hero h1 sup{font-size:16px;vertical-align:super;font-weight:500;letter-spacing:0;color:${t.muted}}
        .mp-hero-meta{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;margin-top:48px;padding-top:24px;border-top:1px solid ${t.line}}
        .mp-hero-meta .k{font-family:${MN_FONTS.mono};font-size:10px;text-transform:uppercase;color:${t.muted};margin-bottom:6px}
        .mp-hero-meta .v{font-family:${MN_FONTS.display};font-weight:700;font-size:30px;letter-spacing:-0.03em}
        .mp-hero-r{position:relative;overflow:hidden;min-height:480px}
        .mp-hero-r img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .mp-hero-r .marker{position:absolute;top:24px;right:24px;background:${t.accent};color:#FFF;padding:6px 10px;font-family:${MN_FONTS.mono};font-size:10px;letter-spacing:0.06em;text-transform:uppercase;z-index:2}
        .mp-hero-r .info{position:absolute;left:24px;bottom:24px;color:#FFF;font-family:${MN_FONTS.mono};font-size:11px;text-transform:uppercase;letter-spacing:0.04em;z-index:2;background:rgba(10,10,10,0.7);padding:10px 14px;backdrop-filter:blur(8px)}
        @media(max-width:980px){
          .mp-hero{grid-template-columns:1fr}
          .mp-hero-l{padding:40px 20px;border-right:0;border-bottom:1px solid ${t.line}}
          .mp-hero-meta{grid-template-columns:repeat(2,1fr);gap:16px}
          .mp-hero-r{min-height:320px}
        }
        @media(max-width:520px){
          .mp-hero h1 sup{font-size:11px}
          .mp-hero-meta .v{font-size:22px}
          .mp-hero-meta{margin-top:32px;padding-top:18px}
        }

        .mp-tagbar{display:flex;align-items:center;gap:12px;padding:16px 28px;border-bottom:1px solid ${t.line};overflow-x:auto}
        .mp-tag{font-family:${MN_FONTS.mono};font-size:11px;letter-spacing:0.04em;text-transform:uppercase;padding:9px 14px;border:1px solid transparent;background:transparent;color:${t.muted};cursor:pointer;transition:all .15s ease;white-space:nowrap}
        .mp-tag:hover{color:${t.fg}}
        .mp-tag.on{background:${t.fg};color:${t.bg};border-color:${t.fg}}
        .mp-tagbar .count{margin-left:auto;font-family:${MN_FONTS.mono};font-size:11px;text-transform:uppercase;color:${t.muted};white-space:nowrap}

        .mp-grid{display:flex;flex-direction:column}
        .mp-row{display:grid;gap:0}
        .mp-row.r-8-4{grid-template-columns:8fr 4fr}
        .mp-row.r-4-4-4{grid-template-columns:1fr 1fr 1fr}
        .mp-row.r-4-8{grid-template-columns:4fr 8fr}
        .mp-row.r-6-6{grid-template-columns:1fr 1fr}
        .mp-row.r-12{grid-template-columns:1fr}
        .mp-card{position:relative;border-bottom:1px solid ${t.line};border-right:1px solid ${t.line};cursor:pointer;overflow:hidden;background:${t.raised};height:480px}
        .mp-row.r-4-4-4 .mp-card,.mp-row.r-6-6 .mp-card{height:380px}
        .mp-card:last-child{border-right:0}
        .mp-card .img{position:absolute;inset:0;background-position:center;background-size:cover;transition:transform .55s cubic-bezier(0.22,1,0.36,1)}
        .mp-card:hover .img{transform:scale(1.04)}
        .mp-card .label{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:space-between;align-items:flex-end;padding:20px 22px;background:linear-gradient(180deg,rgba(10,10,10,0) 0%,rgba(10,10,10,0.8) 100%);color:#FFF}
        .mp-card .num{font-family:${MN_FONTS.mono};font-size:11px;text-transform:uppercase;letter-spacing:0.06em;opacity:0.85;margin-bottom:6px}
        .mp-card .ti{font-family:${MN_FONTS.display};font-weight:700;font-size:32px;letter-spacing:-0.03em;line-height:1}
        .mp-card .ta{font-family:${MN_FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:0.08em;text-align:right;opacity:0.85}
        .mp-card .yr{font-family:${MN_FONTS.mono};font-size:11px;text-align:right;opacity:0.85}
        .mp-card .arrow{position:absolute;top:16px;right:16px;width:36px;height:36px;background:${t.accent};color:#FFF;display:flex;align-items:center;justify-content:center;font-family:${MN_FONTS.mono};font-size:14px;opacity:0;transform:translateY(-4px);transition:all .25s ease}
        .mp-card:hover .arrow{opacity:1;transform:translateY(0)}
        .mp-row.r-4-4-4 .mp-card .ti{font-size:22px}
        .mp-row.r-8-4 .mp-card:nth-child(2) .ti,.mp-row.r-4-8 .mp-card:nth-child(1) .ti{font-size:24px}
        @media(max-width:780px){
          .mp-row.r-8-4,.mp-row.r-4-4-4,.mp-row.r-4-8,.mp-row.r-6-6{grid-template-columns:1fr}
          .mp-card{height:320px;border-right:0}
          .mp-card .ti{font-size:24px !important}
        }

        .mp-about{display:grid;grid-template-columns:1fr 2fr;border-top:1px solid ${t.line};border-bottom:1px solid ${t.line}}
        .mp-about-l{padding:48px 32px;border-right:1px solid ${t.line}}
        .mp-about-l .eb{font-family:${MN_FONTS.mono};font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:${t.muted};margin-bottom:14px}
        .mp-about-l h3{font-family:${MN_FONTS.display};font-weight:800;font-size:64px;letter-spacing:-0.04em;line-height:0.95}
        .mp-about-r{padding:48px 32px;display:grid;grid-template-columns:1.4fr 1fr;gap:48px}
        .mp-about-r p{font-size:18px;line-height:1.5;max-width:540px}
        .mp-about-stats{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid ${t.line}}
        .mp-about-stats > div{padding:16px;border-right:1px solid ${t.line};border-bottom:1px solid ${t.line}}
        .mp-about-stats > div:nth-child(2n){border-right:0}
        .mp-about-stats > div:nth-last-child(-n+2){border-bottom:0}
        .mp-about-stats .v{font-family:${MN_FONTS.display};font-weight:700;font-size:32px;letter-spacing:-0.03em}
        .mp-about-stats .l{font-family:${MN_FONTS.mono};font-size:10px;text-transform:uppercase;color:${t.muted};margin-top:4px}
        @media(max-width:980px){.mp-about{grid-template-columns:1fr}.mp-about-l{border-right:0;border-bottom:1px solid ${t.line};padding:32px 20px}.mp-about-l h3{font-size:42px}.mp-about-r{grid-template-columns:1fr;gap:24px;padding:32px 20px}}

        .mp-press{padding:48px 32px;border-bottom:1px solid ${t.line}}
        .mp-press-h{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:32px;flex-wrap:wrap;gap:12px}
        .mp-press-h h3{font-family:${MN_FONTS.display};font-weight:800;font-size:48px;letter-spacing:-0.04em}
        .mp-press-list{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:1px solid ${t.line}}
        .mp-press-list .row{padding:18px 22px;border-right:1px solid ${t.line};border-bottom:1px solid ${t.line};display:flex;justify-content:space-between;align-items:center}
        .mp-press-list .row:nth-child(3n){border-right:0}
        .mp-press-list .row:nth-last-child(-n+3){border-bottom:0}
        .mp-press-list .name{font-family:${MN_FONTS.display};font-weight:700;font-size:22px;letter-spacing:-0.02em}
        .mp-press-list .yr{font-family:${MN_FONTS.mono};font-size:11px;color:${t.muted}}
        @media(max-width:780px){.mp-press{padding:32px 20px}.mp-press-h h3{font-size:32px}.mp-press-list{grid-template-columns:1fr}.mp-press-list .row{border-right:0}.mp-press-list .row:nth-last-child(-n+3){border-bottom:1px solid ${t.line}}.mp-press-list .row:last-child{border-bottom:0}}

        .mp-cta{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid ${t.line}}
        .mp-cta-l{padding:96px 32px;border-right:1px solid ${t.line};background:${t.fg};color:${t.bg}}
        .mp-cta-l .eb{font-family:${MN_FONTS.mono};font-size:10px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.7;margin-bottom:18px}
        .mp-cta-l h2{font-family:${MN_FONTS.display};font-weight:800;font-size:96px;letter-spacing:-0.05em;line-height:0.92;margin-bottom:32px}
        .mp-cta-l h2 .ac{color:${t.accent}}
        .mp-cta-r{padding:96px 32px;display:flex;flex-direction:column;justify-content:center;gap:18px}
        .mp-cta-r .label{font-family:${MN_FONTS.mono};font-size:10px;text-transform:uppercase;color:${t.muted};letter-spacing:0.08em}
        .mp-cta-r .v{font-family:${MN_FONTS.display};font-weight:700;font-size:32px;letter-spacing:-0.03em}
        .mp-cta-r .v a{color:${t.fg};text-decoration:none;border-bottom:1px solid ${t.fg};padding-bottom:2px;cursor:pointer}
        .mp-cta-r .v a:hover{color:${t.accent};border-color:${t.accent}}
        .mp-cta-r hr{border:0;border-top:1px solid ${t.line};margin:8px 0}
        @media(max-width:980px){.mp-cta{grid-template-columns:1fr}.mp-cta-l{padding:48px 24px;border-right:0}.mp-cta-l h2{font-size:56px}.mp-cta-r{padding:32px 24px}.mp-cta-r .v{font-size:24px}}

        .mp-foot-big{background:${t.bg};border-top:1px solid ${t.line};color:${t.fg}}
        .mp-foot-mark{padding:64px 32px 32px;display:grid;grid-template-columns:1fr 1.4fr;gap:48px;align-items:end;border-bottom:1px solid ${t.line}}
        .mp-foot-logo{font-family:${MN_FONTS.display};font-weight:800;font-size:120px;letter-spacing:-0.05em;line-height:0.9;display:flex;align-items:center;gap:18px}
        .mp-foot-logo .sq{width:54px;height:54px;background:${t.accent};display:inline-block}
        .mp-foot-logo .ac{color:${t.accent}}
        .mp-foot-tag{font-size:18px;line-height:1.5;color:${t.muted};max-width:520px;justify-self:end}
        .mp-foot-cols{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid ${t.line}}
        .mp-foot-cols .col{padding:36px 32px;border-right:1px solid ${t.line};display:flex;flex-direction:column;gap:8px}
        .mp-foot-cols .col:last-child{border-right:0}
        .mp-foot-cols .h{font-family:${MN_FONTS.mono};font-size:10px;text-transform:uppercase;color:${t.muted};letter-spacing:0.08em;margin-bottom:14px}
        .mp-foot-cols .col a{font-family:${MN_FONTS.display};font-weight:600;font-size:18px;letter-spacing:-0.02em;color:${t.fg};text-decoration:none;cursor:pointer;transition:color .15s ease}
        .mp-foot-cols .col a:hover{color:${t.accent}}
        .mp-foot-cols .addr{font-family:${MN_FONTS.mono};font-size:11px;line-height:1.7;color:${t.fg};text-transform:uppercase;letter-spacing:0.04em}
        .mp-foot-base{display:grid;grid-template-columns:2fr 1fr 1fr;gap:24px;padding:18px 32px}
        .mp-foot-base .col{font-family:${MN_FONTS.mono};font-size:10px;text-transform:uppercase;color:${t.muted};letter-spacing:0.06em;line-height:1.6}
        .mp-foot-base a{color:${t.muted};text-decoration:none;margin-right:16px;cursor:pointer}
        .mp-foot-base a:hover{color:${t.fg}}
        @media(max-width:980px){.mp-foot-mark{grid-template-columns:1fr;padding:40px 20px 20px}.mp-foot-logo{font-size:64px}.mp-foot-logo .sq{width:32px;height:32px}.mp-foot-tag{justify-self:start}.mp-foot-cols{grid-template-columns:repeat(2,1fr)}.mp-foot-cols .col{padding:24px 20px}.mp-foot-cols .col:nth-child(2){border-right:0}.mp-foot-cols .col:nth-child(-n+2){border-bottom:1px solid ${t.line}}.mp-foot-base{grid-template-columns:1fr;padding:16px 20px}.mp-foot-base .col{text-align:left !important}}

        /* project detail */
        .mp-detail{position:fixed;inset:0;z-index:30;background:${t.bg};overflow-y:auto;animation:mpFade .4s cubic-bezier(0.22,1,0.36,1)}
        @keyframes mpFade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .mp-detail-bar{position:sticky;top:0;background:${t.bg};display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:18px 28px;border-bottom:1px solid ${t.line};z-index:5}
        .mp-detail-bar .ti{justify-self:center;font-family:${MN_FONTS.display};font-weight:700;font-size:22px;letter-spacing:-0.03em}
        .mp-detail-bar .l{font-family:${MN_FONTS.mono};font-size:11px;text-transform:uppercase;color:${t.muted}}
        .mp-detail-bar .r{justify-self:end;display:flex;gap:8px}
        .mp-detail-close{width:38px;height:38px;border:1px solid ${t.line};background:${t.bg};color:${t.fg};cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all .18s ease}
        .mp-detail-close:hover{background:${t.fg};color:${t.bg};border-color:${t.fg}}
        .mp-detail-hero{position:relative;height:560px;border-bottom:1px solid ${t.line}}
        .mp-detail-hero img{width:100%;height:100%;object-fit:cover}
        .mp-detail-meta{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid ${t.line}}
        .mp-detail-meta > div{padding:20px 22px;border-right:1px solid ${t.line}}
        .mp-detail-meta > div:last-child{border-right:0}
        .mp-detail-meta .k{font-family:${MN_FONTS.mono};font-size:10px;text-transform:uppercase;color:${t.muted};margin-bottom:6px}
        .mp-detail-meta .v{font-family:${MN_FONTS.display};font-weight:700;font-size:24px;letter-spacing:-0.03em}
        .mp-detail-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:0}
        .mp-detail-grid .it{position:relative;height:520px;border-bottom:1px solid ${t.line};border-right:1px solid ${t.line};cursor:zoom-in;overflow:hidden}
        .mp-detail-grid .it:nth-child(2n){border-right:0}
        .mp-detail-grid .it img{width:100%;height:100%;object-fit:cover;transition:transform .55s cubic-bezier(0.22,1,0.36,1)}
        .mp-detail-grid .it:hover img{transform:scale(1.03)}
        .mp-detail-grid .it .n{position:absolute;top:14px;left:14px;background:${t.bg};color:${t.fg};font-family:${MN_FONTS.mono};font-size:10px;letter-spacing:0.06em;text-transform:uppercase;padding:6px 8px}
        @media(max-width:780px){.mp-detail-hero{height:320px}.mp-detail-meta{grid-template-columns:repeat(2,1fr)}.mp-detail-meta > div:nth-child(2n){border-right:0}.mp-detail-meta > div:nth-child(-n+2){border-bottom:1px solid ${t.line}}.mp-detail-grid{grid-template-columns:1fr}.mp-detail-grid .it{height:380px;border-right:0}}

        /* lightbox */
        .mp-lb{position:fixed;inset:0;z-index:60;background:rgba(245,244,241,0.98);display:flex;align-items:center;justify-content:center}
        .mp-lb-img{max-width:80vw;max-height:80vh;object-fit:contain;box-shadow:0 30px 80px rgba(0,0,0,0.2)}
        .mp-lb-bar{position:fixed;top:0;left:0;right:0;display:flex;justify-content:space-between;padding:18px 28px;border-bottom:1px solid ${t.line};background:${t.bg};font-family:${MN_FONTS.mono};font-size:11px;text-transform:uppercase;color:${t.fg}}
        .mp-lb-arrow{position:fixed;top:50%;transform:translateY(-50%);width:48px;height:48px;border:1px solid ${t.line};background:${t.bg};color:${t.fg};cursor:pointer;font-size:14px;transition:all .18s ease;display:flex;align-items:center;justify-content:center}
        .mp-lb-arrow:hover{background:${t.fg};color:${t.bg}}
        .mp-lb-arrow.l{left:24px}.mp-lb-arrow.r{right:24px}
      `}</style>

      {/* Nav */}
      <nav className="mp-nav">
        <div className="l">
          <a>Index</a><a>Studio</a><a>Journal</a>
        </div>
        <div className="mp-mark"><span className="sq" />Monolith</div>
        <div className="r">
          <div className="mp-status"><span className="dot" />Available 2025</div>
          <button className="mn-btn solid">Contact →</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="mp-hero">
        <div className="mp-hero-l">
          <div>
            <div className="mn-eyebrow" style={{ color: t.muted, marginBottom: 24 }}>{data.brand.studio} · Vol. 12 · 2024</div>
            <h1>
              Photographs<br />
              that <span className="ac">work</span>.<sup>(184)</sup>
            </h1>
          </div>
          <div className="mp-hero-meta">
            {data.brand.stats.map((s) => (
              <div key={s.l}>
                <div className="k">{s.l}</div>
                <div className="v">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mp-hero-r">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={data.projects[3]!.cover} alt="" />
          <div className="marker">FEATURED · A4</div>
          <div className="info">Rooms Without Us — Frama, 2023</div>
        </div>
      </section>

      {/* Tag bar */}
      <div className="mp-tagbar">
        {data.tags.map((tag) => (
          <button key={tag} className={`mp-tag ${filter === tag ? "on" : ""}`} onClick={() => setFilter(tag)}>
            {tag}
            <span style={{ marginLeft: 6, opacity: 0.6 }}>
              {tag === "ALL" ? data.projects.length : data.projects.filter((p) => p.tag === tag).length}
            </span>
          </button>
        ))}
        <span className="count">SHOWING {visible.length} / {data.projects.length}</span>
      </div>

      {/* Mosaic */}
      <div className="mp-grid">
        {rows.map((row, ri) => (
          <div key={ri} className={`mp-row ${row.cls}`}>
            {row.items.map((p) => (
              <div key={p.id} className="mp-card" onClick={() => setActive(p.id)}>
                <div className="img" style={{ backgroundImage: `url('${p.cover}')` }} />
                <div className="arrow">→</div>
                <div className="label">
                  <div>
                    <div className="num">{p.no} · {p.client}</div>
                    <div className="ti">{p.title}</div>
                  </div>
                  <div>
                    <div className="ta">{p.tag}</div>
                    <div className="yr">{p.year}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* About */}
      <section className="mp-about">
        <div className="mp-about-l">
          <div className="eb">02 · About</div>
          <h3>Studio<br /><span style={{ color: t.accent }}>Yara</span><br />Sokol.</h3>
        </div>
        <div className="mp-about-r">
          <p>{data.brand.bio}</p>
          <div className="mp-about-stats">
            {data.brand.stats.map((s) => (
              <div key={s.l}>
                <div className="v">{s.v}</div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press */}
      <section className="mp-press">
        <div className="mp-press-h">
          <div>
            <div className="mn-eyebrow" style={{ color: t.muted, marginBottom: 8 }}>03 · Selected Press</div>
            <h3>Featured in.</h3>
          </div>
          <div className="mn-mono" style={{ color: t.muted }}>↓ {data.press.length} publications</div>
        </div>
        <div className="mp-press-list">
          {data.press.map((p) => (
            <div key={p.name} className="row">
              <span className="name">{p.name}</span>
              <span className="yr">{p.year}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mp-cta">
        <div className="mp-cta-l">
          <div className="eb">04 · Contact</div>
          <h2>Let&rsquo;s make<br />something <span className="ac">specific</span>.</h2>
          <button className="mn-btn accent">Start a project →</button>
        </div>
        <div className="mp-cta-r">
          <div>
            <div className="label">Email</div>
            <div className="v"><a>studio@monolith.photo</a></div>
          </div>
          <hr />
          <div>
            <div className="label">Studio</div>
            <div className="v">Berlin · Mitte</div>
          </div>
          <hr />
          <div>
            <div className="label">Instagram</div>
            <div className="v"><a>@yara.sokol</a></div>
          </div>
          <hr />
          <div>
            <div className="label">Booking</div>
            <div className="v">2025 Q1 — open</div>
          </div>
        </div>
      </section>

      {/* Big footer */}
      <footer className="mp-foot-big">
        <div className="mp-foot-mark">
          <div>
            <div className="mn-eyebrow" style={{ color: t.muted, marginBottom: 18 }}>05 · Colophon</div>
            <div className="mp-foot-logo">
              <span className="sq" />Monolith<span className="ac">.</span>
            </div>
          </div>
          <p className="mp-foot-tag">Photographs that work — for editorial, brand, and private commissions. Studio Yara Sokol, working from Berlin since 2013.</p>
        </div>
        <div className="mp-foot-cols">
          <div className="col">
            <div className="h">Studio</div>
            <a>Index</a><a>Journal</a><a>About</a><a>Press</a><a>Contact</a>
          </div>
          <div className="col">
            <div className="h">Series</div>
            <a>Quiet Hours</a><a>Slow Country</a><a>Held Briefly</a><a>Rooms Without Us</a><a>All projects</a>
          </div>
          <div className="col">
            <div className="h">Elsewhere</div>
            <a>Instagram ↗</a><a>Are.na ↗</a><a>It&rsquo;s Nice That ↗</a><a>Newsletter ↗</a>
          </div>
          <div className="col">
            <div className="h">Studio</div>
            <div className="addr">Linienstraße 142<br />10115 Berlin<br />Germany</div>
            <a style={{ marginTop: 12 }}>studio@monolith.photo</a>
            <a>+49 30 1234 5678</a>
          </div>
        </div>
        <div className="mp-foot-base">
          <div className="col">© Studio Yara Sokol · MMXXIV — All photographs are the property of the studio and may not be reproduced without permission.</div>
          <div className="col"><a>Imprint</a><a>Privacy</a><a>Colophon</a><a>RSS</a></div>
          <div className="col" style={{ textAlign: "right" }}>v12.04 · Built in Berlin · No cookies, no tracking</div>
        </div>
      </footer>

      {/* Project detail */}
      {project && (
        <div className="mp-detail">
          <div className="mp-detail-bar">
            <div className="l">{project.no} / {project.tag}</div>
            <div className="ti">{project.title}</div>
            <div className="r">
              <button className="mp-detail-close" onClick={() => setActive(null)} aria-label="Close project">✕</button>
            </div>
          </div>
          <div className="mp-detail-hero">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.cover} alt={project.title} />
          </div>
          <div className="mp-detail-meta">
            <div><div className="k">Client</div><div className="v">{project.client}</div></div>
            <div><div className="k">Year</div><div className="v">{project.year}</div></div>
            <div><div className="k">Frames</div><div className="v">{project.photos.length}</div></div>
            <div><div className="k">Tag</div><div className="v">{project.tag}</div></div>
          </div>
          <div className="mp-detail-grid">
            {project.photos.map((ph, i) => (
              <div key={ph.id + i} className="it" onClick={() => setLightbox({ photos: project.photos, index: i })}>
                <div className="n">{String(i + 1).padStart(2, "0")} / {String(project.photos.length).padStart(2, "0")}</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ph.src} alt={ph.title} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && lightbox.photos[lightbox.index] && (
        <div className="mp-lb" onClick={(e) => { if (e.target === e.currentTarget) setLightbox(null); }}>
          <div className="mp-lb-bar">
            <span>{String(lightbox.index + 1).padStart(3, "0")} / {String(lightbox.photos.length).padStart(3, "0")}</span>
            <span>{lightbox.photos[lightbox.index]!.title}</span>
            <button onClick={() => setLightbox(null)} style={{ background: "transparent", border: 0, fontFamily: MN_FONTS.mono, fontSize: 11, textTransform: "uppercase", color: t.fg, cursor: "pointer", letterSpacing: "0.06em" }}>Close ✕</button>
          </div>
          <button className="mp-lb-arrow l" onClick={() => setLightbox((l) => l && ({ ...l, index: (l.index - 1 + l.photos.length) % l.photos.length }))}>←</button>
          <button className="mp-lb-arrow r" onClick={() => setLightbox((l) => l && ({ ...l, index: (l.index + 1) % l.photos.length }))}>→</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="mp-lb-img" src={lightbox.photos[lightbox.index]!.src} alt="" />
        </div>
      )}
    </div>
  );
}
