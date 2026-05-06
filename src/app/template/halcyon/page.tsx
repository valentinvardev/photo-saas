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
  const [drawerHoverId, setDrawerHoverId] = useState<string | null>(null);
  const [showAllWorks,  setShowAllWorks]  = useState(false);
  const [indexPhotoIdx, setIndexPhotoIdx] = useState(0);
  const [drawerPhotoIdx,setDrawerPhotoIdx]= useState(0);

  /* Cycle the floating index thumbnail through that project's photos. */
  useEffect(() => {
    setIndexPhotoIdx(0);
    if (hoverIdx < 0) return;
    const proj = data.projects[hoverIdx];
    if (!proj || proj.photos.length <= 1) return;
    const id = setInterval(() => setIndexPhotoIdx((p) => (p + 1) % proj.photos.length), 1100);
    return () => clearInterval(id);
  }, [hoverIdx, data.projects]);

  /* Same for the drawer image — cycle while a menu item is hovered. */
  useEffect(() => {
    setDrawerPhotoIdx(0);
    if (!drawerHoverId) return;
    const proj = data.projects.find((p) => p.id === drawerHoverId);
    if (!proj || proj.photos.length <= 1) return;
    const id = setInterval(() => setDrawerPhotoIdx((p) => (p + 1) % proj.photos.length), 1100);
    return () => clearInterval(id);
  }, [drawerHoverId, data.projects]);

  /* What image the drawer should show right now */
  const drawerProject = drawerHoverId ? data.projects.find((p) => p.id === drawerHoverId) : null;
  const drawerImageSrc = drawerProject ? drawerProject.photos[drawerPhotoIdx % drawerProject.photos.length]!.src : data.projects[0]!.cover;

  /* What image the index float should show */
  const indexProject = hoverIdx >= 0 ? data.projects[hoverIdx] : null;
  const indexImageSrc = indexProject ? indexProject.photos[indexPhotoIdx % indexProject.photos.length]!.src : null;

  const VISIBLE_WORKS = 3;
  const visibleProjects = showAllWorks ? data.projects : data.projects.slice(0, VISIBLE_WORKS);
  const hiddenCount     = data.projects.length - VISIBLE_WORKS;

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
        .hp-nav{position:absolute;top:0;left:0;right:0;z-index:30;display:flex;justify-content:space-between;align-items:center;padding:28px 32px;color:${t.fg}}
        .hp-mark{display:inline-flex;flex-direction:column;align-items:center;gap:2px;color:${t.fg};line-height:1;text-shadow:0 1px 24px rgba(0,0,0,0.55)}
        .hp-mark .wm{font-family:${HL_FONTS.serif};font-size:28px;letter-spacing:-0.02em;font-weight:400;display:flex;align-items:center;gap:8px}
        .hp-mark .wm em{font-style:italic;font-weight:400}
        .hp-mark .wm .glyph{width:6px;height:6px;border-radius:50%;border:1px solid ${t.fg};display:inline-block}
        .hp-mark .sub{font-family:${HL_FONTS.mono};font-size:9px;letter-spacing:0.32em;text-transform:uppercase;opacity:0.7;margin-top:4px}
        .hp-burger{display:flex;flex-direction:column;gap:5px;cursor:pointer;background:transparent;border:0;padding:8px}
        .hp-burger span{display:block;width:22px;height:1px;background:${t.fg};transition:transform .3s ease;box-shadow:0 1px 8px rgba(0,0,0,0.55)}
        .hp-burger:hover span:first-child{transform:translateX(-3px)}
        .hp-burger:hover span:last-child{transform:translateX(3px)}

        .hp-cover{position:relative;height:780px;overflow:hidden}
        .hp-cover-img{position:absolute;inset:0;background:url('${data.projects[2]!.cover}') center/cover}
        /* Two layered gradients: stronger top scrim so nav reads, plus the
           bottom darkening that anchors the title. */
        .hp-cover-img::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,13,11,0.78) 0%,rgba(14,13,11,0.42) 14%,rgba(14,13,11,0) 30%,rgba(14,13,11,0) 50%,rgba(14,13,11,0.55) 75%,rgba(14,13,11,0.95) 100%)}
        .hp-cover-meta{position:absolute;bottom:48px;left:32px;right:32px;display:flex;justify-content:space-between;align-items:flex-end;gap:48px;flex-wrap:wrap}
        .hp-cover-title{font-family:${HL_FONTS.serif};font-size:140px;line-height:0.92;letter-spacing:-0.04em;font-weight:400}
        .hp-cover-title em{font-style:italic;font-weight:400}
        @media(max-width:780px){
          .hp-cover{height:560px}
          .hp-cover-title{font-size:72px}
          .hp-cover-meta{bottom:32px;left:20px;right:20px;gap:20px}
          .hp-nav{padding:18px 20px}
        }
        /* Scroll hint: dot drifts upward (against the page-flow), a small
           counter-cue. Track lives below the resting position. */
        .hp-scroll-hint{display:flex;flex-direction:column;align-items:center;gap:10px;color:${t.fg}}
        .hp-scroll-hint .track{position:relative;width:1px;height:44px;background:rgba(239,234,224,0.22);overflow:hidden}
        .hp-scroll-hint .track::after{content:"";position:absolute;left:-1.5px;bottom:0;width:4px;height:4px;border-radius:50%;background:${t.fg};animation:hpScrollDot 1.8s infinite cubic-bezier(0.22,1,0.36,1)}
        @keyframes hpScrollDot{
          0%   { transform: translateY(6px);  opacity: 0 }
          18%  { opacity: 1 }
          82%  { opacity: 1 }
          100% { transform: translateY(-46px); opacity: 0 }
        }

        .hp-section-label{display:flex;align-items:center;gap:14px;padding:0 32px;margin:96px 0 32px;color:${t.muted}}
        .hp-section-label hr{flex:1;border:0;border-top:1px solid ${t.line}}

        .hp-index{padding:0 32px;border-top:1px solid ${t.line};position:relative}
        .hp-index-row{display:grid;grid-template-columns:60px 1fr 200px 120px 32px;gap:24px;align-items:center;padding:28px 0;border-bottom:1px solid ${t.line};cursor:pointer;position:relative;transition:padding .35s cubic-bezier(0.22,1,0.36,1)}
        .hp-index-row .no{font-family:${HL_FONTS.mono};font-size:11px;letter-spacing:0.08em;color:${t.muted}}
        .hp-index-row .ti{font-family:${HL_FONTS.serif};font-size:54px;line-height:1;letter-spacing:-0.02em;font-weight:400;transition:transform .22s cubic-bezier(0.22,1,0.36,1),color .15s ease}
        .hp-index-row .ta{font-family:${HL_FONTS.mono};font-size:10px;letter-spacing:0.1em;color:${t.muted};text-transform:uppercase}
        .hp-index-row .yr{font-family:${HL_FONTS.mono};font-size:11px;color:${t.muted};text-align:right}
        .hp-index-row .ar{justify-self:end;color:${t.muted};transition:transform .35s ease,color .35s ease}
        /* Hover-only flourishes: italic + slide kick in only on devices that
           actually have a cursor. On touch, none of this animates. */
        @media (hover:hover) and (pointer:fine){
          .hp-index-row:hover{padding-left:18px}
          .hp-index-row:hover .ti{font-style:italic;transform:translateX(8px)}
          .hp-index-row:hover .ar{transform:translateX(6px);color:${t.accent}}
        }
        @media(max-width:780px){
          .hp-index-row{grid-template-columns:40px 1fr 24px;gap:12px}
          .hp-index-row .ti{font-size:30px}
          .hp-index-row .ta,.hp-index-row .yr{display:none}
        }

        .hp-thumb-float{position:absolute;width:240px;height:300px;pointer-events:none;z-index:5;opacity:0;transition:opacity .2s ease,transform .25s cubic-bezier(0.22,1,0.36,1);overflow:hidden;background:${t.raised}}
        .hp-thumb-float.show{opacity:1}
        @media (hover:none){.hp-thumb-float{display:none}}
        .hp-thumb-float img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;animation:hpThumbImg .55s cubic-bezier(0.22,1,0.36,1) both}
        @keyframes hpThumbImg{from{opacity:0;transform:scale(1.05)}to{opacity:1;transform:scale(1)}}

        .hp-view-all-row{display:flex;justify-content:center;padding:32px 32px 0;animation:hpFadeUp .35s cubic-bezier(0.22,1,0.36,1)}

        /* Hero feature: bold orange banner that really sells the gallery */
        .hp-allphotos{margin:96px 32px 0;padding:80px 64px;background:${t.accent};color:${t.fg};position:relative;overflow:hidden;display:grid;grid-template-columns:1fr auto;gap:48px;align-items:end}
        .hp-allphotos::before{content:"";position:absolute;inset:0;background:radial-gradient(120% 120% at 100% 0%,rgba(255,255,255,0.10) 0%,rgba(255,255,255,0) 55%);pointer-events:none}
        .hp-allphotos .eyebrow{font-family:${HL_FONTS.mono};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${t.fg};opacity:0.75;margin-bottom:24px}
        .hp-allphotos h2{font-family:${HL_FONTS.serif};font-size:120px;line-height:0.9;letter-spacing:-0.035em;font-weight:400;color:${t.fg}}
        .hp-allphotos h2 em{font-style:italic}
        .hp-allphotos .sub{font-family:${HL_FONTS.sans};font-size:15px;line-height:1.6;color:${t.fg};opacity:0.85;max-width:460px;margin-top:24px}
        .hp-allphotos .meta{display:flex;gap:32px;margin-top:32px;font-family:${HL_FONTS.mono};font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:${t.fg};opacity:0.7}
        .hp-allphotos .meta b{display:block;font-family:${HL_FONTS.serif};font-style:italic;font-size:28px;letter-spacing:-0.01em;font-weight:400;color:${t.fg};opacity:1;margin-bottom:6px;text-transform:none}
        .hp-allphotos .cta{display:inline-flex;align-items:center;gap:16px;padding:22px 32px;background:${t.bg};color:${t.fg};border:0;cursor:pointer;font-family:${HL_FONTS.mono};font-size:12px;letter-spacing:0.18em;text-transform:uppercase;transition:transform .3s cubic-bezier(0.22,1,0.36,1),background .3s ease}
        .hp-allphotos .cta:hover{transform:translateY(-3px);background:${t.fg};color:${t.bg}}
        .hp-allphotos .cta .ico{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:${t.accent};color:${t.fg};font-size:16px;transition:transform .3s ease,background .3s ease}
        .hp-allphotos .cta:hover .ico{transform:rotate(-12deg);background:${t.bg};color:${t.fg}}
        @media(max-width:980px){
          .hp-allphotos{grid-template-columns:1fr;padding:56px 32px;align-items:start}
          .hp-allphotos h2{font-size:72px}
        }
        @media(max-width:640px){
          .hp-allphotos{margin:64px 16px 0;padding:48px 24px}
          .hp-allphotos h2{font-size:54px}
        }
        @keyframes hpFadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

        /* Equal-height row: portrait stretches to match the heading +
           bio + stats column. Padding-bottom keeps the next section's
           border-top off the stats' bottom border. */
        .hp-about{display:grid;grid-template-columns:320px 1fr;gap:64px;padding:0 32px 96px;align-items:stretch}
        @media(max-width:780px){.hp-about{grid-template-columns:1fr;gap:32px;padding-bottom:64px}.hp-about-portrait{aspect-ratio:1/1 !important;max-width:280px;min-height:0 !important}}
        .hp-about-portrait{background:url('${HL_PHOTOS.portraits![2]!.src}') center/cover;background-color:${t.raised};width:100%;min-height:480px}
        .hp-about h2{font-family:${HL_FONTS.serif};font-size:72px;line-height:0.95;letter-spacing:-0.03em;margin-bottom:24px;font-weight:400}
        .hp-about h2 em{font-style:italic}
        .hp-about p{font-size:16px;line-height:1.7;color:${t.fg};max-width:520px}
        .hp-about-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:48px;border-top:1px solid ${t.line};border-bottom:1px solid ${t.line};max-width:560px}
        .hp-about-stats > div{padding:24px 20px;border-right:1px solid ${t.line}}
        .hp-about-stats > div:first-child{padding-left:0}
        .hp-about-stats > div:last-child{padding-right:0;border-right:0}
        .hp-about-stats .v{font-family:${HL_FONTS.serif};font-size:34px;line-height:1;font-weight:400}
        .hp-about-stats .l{font-family:${HL_FONTS.mono};font-size:9px;letter-spacing:0.12em;color:${t.muted};text-transform:uppercase;margin-top:10px;white-space:nowrap}

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

        /* Drawer: menu owns the left side, big poster image on the right
           that swaps to the hovered project's photos with a crossfade. */
        .hp-drawer{position:fixed;inset:0;z-index:50;background:${t.bg};display:flex;align-items:center;gap:64px;padding:64px;transform:translateX(-100%);transition:transform .55s cubic-bezier(0.76,0,0.24,1)}
        .hp-drawer.open{transform:translateX(0)}
        .hp-drawer .col-l{flex:1;min-width:0;max-width:640px}
        .hp-drawer .col-r{flex-shrink:0;width:540px;aspect-ratio:3/4;max-height:84vh;position:relative;border:1px solid ${t.line};overflow:hidden;background:${t.raised}}
        .hp-drawer .col-r img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;animation:hpDrawerImg .6s cubic-bezier(0.22,1,0.36,1) both}
        .hp-drawer .col-r .label{position:absolute;left:0;right:0;bottom:0;font-family:${HL_FONTS.mono};font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:${t.fg};padding:14px 18px;background:rgba(14,13,11,0.85);backdrop-filter:blur(10px);border-top:1px solid rgba(239,234,224,0.08);display:flex;justify-content:space-between;align-items:center;opacity:0;transform:translateY(8px);transition:opacity .3s ease,transform .3s ease}
        .hp-drawer .col-r.has-hover .label{opacity:1;transform:translateY(0)}
        .hp-drawer .col-r .label em{font-family:${HL_FONTS.serif};font-style:italic;font-size:14px;color:${t.fg};letter-spacing:0;text-transform:none}
        @keyframes hpDrawerImg{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:scale(1)}}
        @media(max-width:1280px){.hp-drawer .col-r{width:440px}}
        @media(max-width:1100px){.hp-drawer .col-r{width:360px}}
        @media(max-width:980px){.hp-drawer{padding:48px}.hp-drawer .col-r{width:300px}}
        @media(max-width:780px){.hp-drawer{padding:32px}.hp-drawer .col-l{flex:1;width:100%}.hp-drawer .col-r{display:none}}
        .hp-drawer ul{list-style:none}
        .hp-drawer li{padding:18px 0;border-bottom:1px solid ${t.line};font-family:${HL_FONTS.serif};font-size:48px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:padding .35s ease,color .35s ease}
        .hp-drawer li:hover{padding-left:16px;font-style:italic;color:${t.accent}}
        .hp-drawer li .n{font-family:${HL_FONTS.mono};font-size:11px;color:${t.muted};font-style:normal}
        .hp-drawer li .all-icon{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border:1px solid ${t.line};border-radius:50%;color:${t.fg};transition:all .25s ease}
        .hp-drawer li:hover .all-icon{border-color:${t.fg};background:${t.fg};color:${t.bg};transform:translateX(4px)}
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
        <div className="hp-mark">
          <div className="wm"><span className="glyph" aria-hidden /><span>Halcyon</span></div>
          <div className="sub">Studio · Lisbon</div>
        </div>
        <span aria-hidden style={{ width: 38 }} />{/* spacer to keep mark centered */}
      </div>

      <section className="hp-cover">
        <div className="hp-cover-img" />
        <div className="hp-cover-meta">
          <div>
            <h1 className="hp-cover-title">
              The light<br />keeps <em>arriving.</em>
            </h1>
          </div>
          <div className="hp-scroll-hint">
            <span className="hl-mono" style={{ color: t.fg, opacity: 0.75, letterSpacing: "0.18em" }}>Scroll</span>
            <div className="track" />
          </div>
        </div>
      </section>

      <div className="hp-section-label hl-mono">
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
          {indexImageSrc && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={indexImageSrc} src={indexImageSrc} alt="" />
          )}
        </div>
        {visibleProjects.map((p, i) => (
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

      {/* View all works (only when there's more to show) */}
      {hiddenCount > 0 && !showAllWorks && (
        <div className="hp-view-all-row">
          <button className="hl-btn hl-btn-accent" onClick={() => setShowAllWorks(true)}>
            View all {data.projects.length} works <span>↓</span>
          </button>
        </div>
      )}

      <section className="hp-allphotos">
        <div>
          <div className="eyebrow">Browse the full archive</div>
          <h2>Every <em>photograph,</em><br />in one room.</h2>
          <p className="sub">Twelve years of weddings, editorial and quiet rooms — gathered together. Open the archive and wander.</p>
          <div className="meta">
            <div><b>184</b>Photographs</div>
            <div><b>{data.projects.length}</b>Projects</div>
            <div><b>2014–2024</b>Span</div>
          </div>
        </div>
        <button className="cta" onClick={() => setGalleryOpen(true)}>
          Open the archive
          <span className="ico" aria-hidden>↗</span>
        </button>
      </section>

      <div className="hp-section-label hl-mono">
        <span>About</span>
        <hr />
        <span>Lior Avni · b. 1989</span>
      </div>
      <section className="hp-about">
        <div className="hp-about-portrait" role="img" aria-label="Portrait" />
        <div>
          <h2>Pictures to <em>live with,</em><br />not scroll past.</h2>
          <p>{data.brand.bio}</p>
        </div>
      </section>

      <section className="hp-contact">
        <div className="hl-eyebrow" style={{ marginBottom: 24 }}>Available for 2025 commissions</div>
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

      <div className={`hp-drawer ${navOpen ? "open" : ""}`} onMouseLeave={() => setDrawerHoverId(null)}>
        <button className="hp-drawer-close" onClick={() => setNavOpen(false)}>Close ✕</button>
        <div className="col-l">
          <div className="hl-eyebrow" style={{ marginBottom: 32 }}>My work</div>
          <ul>
            {data.projects.map((p) => (
              <li
                key={p.id}
                onMouseEnter={() => setDrawerHoverId(p.id)}
                onClick={() => { setActiveProject(p.id); setNavOpen(false); }}
              >
                <span>{p.title}</span>
                <span className="n">{p.no} · {p.year}</span>
              </li>
            ))}
            <li
              onMouseEnter={() => setDrawerHoverId(null)}
              onClick={() => { setGalleryOpen(true); setNavOpen(false); }}
            >
              <span>All photographs</span>
              <span className="all-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </span>
            </li>
          </ul>
        </div>
        <div className={`col-r ${drawerHoverId ? "has-hover" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={drawerImageSrc} src={drawerImageSrc} alt="" />
          {drawerProject && (
            <div className="label">
              <em>{drawerProject.title}</em>
              <span>{(drawerPhotoIdx % drawerProject.photos.length) + 1} / {drawerProject.photos.length}</span>
            </div>
          )}
        </div>
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

      <AnimatePresence>
      {galleryOpen && (
        <motion.div
          key="hp-gallery"
          className="hp-gallery"
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32, scale: 0.97, transition: { duration: 0.32, ease: [0.76, 0, 0.24, 1] } }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <button className="hp-detail-close" style={{ position: "absolute" }} onClick={() => setGalleryOpen(false)} aria-label="Close gallery"><span>✕</span></button>
          <div className="hp-gallery-head">
            <h2>Every <em>photograph,</em><br />in one room.</h2>
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
        </motion.div>
      )}
      </AnimatePresence>

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
