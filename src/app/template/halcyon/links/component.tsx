"use client";

/* ─── Halcyon Links — canonical component ────────────────────────────
   Same visual language as the Halcyon portfolio: dark editorial,
   ember-orange accent, italic display serif, space mono labels,
   horizontal marquee ticker.

   Rendered in three places:
     • /dashboard/links — live preview phone in the editor
     • /l/[id]          — public client-facing route
     • /template/halcyon/links — public demo (reads from store)
   ─────────────────────────────────────────────────────────────────── */

import { HL_TOKENS, HL_FONTS, hlBaseCss } from "~/lib/halcyon/data";
import { effectiveLinkUrl, type LinksPage, type LinkItem } from "~/lib/links/data";

export interface HalcyonLinksProps {
  page: LinksPage;
}

function linkSub(item: LinkItem): string {
  if (item.type === "instagram" && item.igUsername) return `@${item.igUsername}`;
  if (item.type === "whatsapp")                     return "WhatsApp";
  if (item.type === "email" && item.emailAddress)   return item.emailAddress;
  if (item.type === "delivery")                     return "Photo gallery";
  try {
    return new URL(item.url).hostname.replace("www.", "");
  } catch {
    return "";
  }
}

export function HalcyonLinks({ page }: HalcyonLinksProps) {
  const t = HL_TOKENS;

  const enabledLinks  = page.links.filter((l) => l.enabled && l.type !== "divider");
  const marqueeText   = page.labels?.marquee  || "HALCYON STUDIO";
  const eyebrow       = page.labels?.eyebrow  || "Photographer";
  const rawStats = [
    { v: page.labels?.stat1_v, l: page.labels?.stat1_l || "Years"    },
    { v: page.labels?.stat2_v, l: page.labels?.stat2_l || "Projects" },
    { v: page.labels?.stat3_v, l: page.labels?.stat3_l || "Based"    },
  ].filter((s): s is { v: string; l: string } => !!s.v);

  const nameParts = page.displayName.trim().split(" ");
  const nameFirst = nameParts.slice(0, -1).join(" ");
  const nameLast  = nameParts[nameParts.length - 1] ?? "";

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

        .hk-wrap{padding:48px 32px 40px;display:flex;flex-direction:column;align-items:center;gap:20px;text-align:center}
        .hk-avatar{width:108px;height:108px;border-radius:50%;border:1px solid ${t.line};padding:6px;position:relative}
        .hk-avatar::after{content:"";position:absolute;top:-4px;right:-4px;width:14px;height:14px;border-radius:50%;background:${t.accent};border:3px solid ${t.bg}}
        .hk-avatar img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}
        .hk-avatar-init{width:100%;height:100%;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:${HL_FONTS.serif};font-size:36px;font-style:italic}
        .hk-eyebrow{font-family:${HL_FONTS.mono};font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:${t.accent}}
        .hk-name{font-family:${HL_FONTS.serif};font-size:48px;line-height:1;letter-spacing:-0.02em;color:${t.fg}}
        .hk-name em{font-style:italic}
        .hk-bio{color:${t.muted};max-width:340px;line-height:1.55;font-size:14px}

        .hk-stack{display:flex;flex-direction:column;gap:10px;width:100%;max-width:380px;margin-top:8px}
        .hk-link{display:flex;justify-content:space-between;align-items:center;padding:16px 18px;border:1px solid ${t.line};background:${t.raised};color:${t.fg};text-decoration:none;cursor:pointer;transition:all .3s cubic-bezier(0.22,1,0.36,1)}
        .hk-link:hover{transform:translateX(4px);border-color:${t.fg}}
        .hk-link.accent{background:${t.accent};border-color:${t.accent};color:${t.fg}}
        .hk-link.accent:hover{background:${t.fg};color:${t.bg};border-color:${t.fg}}
        .hk-link .l{font-family:${HL_FONTS.serif};font-size:18px;text-align:left}
        .hk-link.accent .l{font-style:italic}
        .hk-link .s{font-family:${HL_FONTS.mono};font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:${t.muted};display:block;margin-top:3px;text-align:left}
        .hk-link.accent .s{color:${t.fg};opacity:0.85}
        .hk-link .ar{font-family:${HL_FONTS.mono};font-size:14px;color:${t.muted};transition:transform .3s ease,color .3s ease}
        .hk-link:hover .ar,.hk-link.accent .ar{color:${t.fg}}
        .hk-link:hover .ar{transform:translateX(2px)}

        .hk-stats{display:grid;grid-template-columns:repeat(${rawStats.length || 3},1fr);gap:0;width:100%;max-width:380px;margin-top:10px;border-top:1px solid ${t.line};border-bottom:1px solid ${t.line}}
        .hk-stats > div{padding:14px 0;border-right:1px solid ${t.line}}
        .hk-stats > div:last-child{border-right:0}
        .hk-stats .v{font-family:${HL_FONTS.serif};font-size:26px;line-height:1;color:${t.fg}}
        .hk-stats .l{font-family:${HL_FONTS.mono};font-size:9px;letter-spacing:0.12em;color:${t.muted};text-transform:uppercase;margin-top:5px}

        .hk-foot{font-family:${HL_FONTS.mono};font-size:9px;letter-spacing:0.14em;color:${t.muted};text-transform:uppercase;margin-top:12px}
        .hk-foot em{font-style:normal;color:${t.accent}}
      `}</style>

      <div className="hk-stripe" />

      <div className="hk-marquee">
        <div className="hk-marquee-track">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>
              <b>{marqueeText}</b> &nbsp;<em>●</em>&nbsp; {page.displayName.toUpperCase()} &nbsp;<em>●</em>&nbsp; {eyebrow.toUpperCase()} &nbsp;<em>●</em>&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="hk-wrap">
        {/* Avatar */}
        <div className="hk-avatar">
          {page.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={page.avatarUrl} alt={page.displayName} />
          ) : (
            <div className="hk-avatar-init" style={{ background: page.avatarBg || t.raised, color: t.fg }}>
              {page.avatarInitial || page.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="hk-eyebrow">{eyebrow}</div>

        {/* Display name: last word in italic */}
        <div className="hk-name">
          {nameFirst && <>{nameFirst} </>}
          <em>{nameLast}</em>
        </div>

        {page.bio && <div className="hk-bio">{page.bio}</div>}

        {enabledLinks.length > 0 && (
          <div className="hk-stack">
            {enabledLinks.map((item, i) => {
              const href = effectiveLinkUrl(item) || "#";
              const sub  = linkSub(item);
              return (
                <a key={item.id} className={`hk-link${i === 0 ? " accent" : ""}`} href={href}>
                  <span>
                    <span className="l">{item.title}</span>
                    {sub && <span className="s">{sub}</span>}
                  </span>
                  <span className="ar">→</span>
                </a>
              );
            })}
          </div>
        )}

        {rawStats.length > 0 && (
          <div className="hk-stats">
            {rawStats.map((s) => (
              <div key={s.l}>
                <div className="v">{s.v}</div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>
        )}

        <div className="hk-foot">Built with <em>FRAME</em> · © MMXXIV</div>
      </div>
    </div>
  );
}
