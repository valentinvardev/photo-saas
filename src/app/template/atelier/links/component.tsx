"use client";

/* ─── Atelier Links — canonical component ────────────────────────────
   Warm minimal editorial: Cormorant Garamond + Inter + Space Mono,
   off-white #fafaf8 ground, ink #0a0a0a, warm muted #7a766f.

   Rendered in three places:
     • /dashboard/links — live preview phone in the editor
     • /l/[id]          — public client-facing route
     • /template/atelier/links — public demo (reads from store)
   ─────────────────────────────────────────────────────────────────── */

import { effectiveLinkUrl, type LinksPage, type LinkItem } from "~/lib/links/data";

const T = {
  bg:     "#fafaf8",
  fg:     "#0a0a0a",
  muted:  "#7a766f",
  line:   "#d8d4cc",
  raised: "#ffffff",
};

const F = {
  serif: "var(--atelier-serif), 'Cormorant Garamond', serif",
  sans:  "var(--atelier-sans), Inter, -apple-system, sans-serif",
  mono:  "var(--atelier-mono), 'Space Mono', ui-monospace, monospace",
};

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

export interface AtelierLinksProps {
  page: LinksPage;
}

export function AtelierLinks({ page }: AtelierLinksProps) {
  const enabledLinks = page.links.filter((l) => l.enabled && l.type !== "divider");

  const nameParts = page.displayName.trim().split(" ");
  const nameFirst = nameParts.slice(0, -1).join(" ");
  const nameLast  = nameParts[nameParts.length - 1] ?? "";

  const rawStats = [
    { v: page.labels?.stat1_v, l: page.labels?.stat1_l || "Years"    },
    { v: page.labels?.stat2_v, l: page.labels?.stat2_l || "Projects" },
    { v: page.labels?.stat3_v, l: page.labels?.stat3_l || "Based"    },
  ].filter((s): s is { v: string; l: string } => !!s.v);

  const eyebrow  = page.labels?.eyebrow || "Photographer";
  const noteText = page.labels?.note    || "";

  return (
    <div style={{ background: T.bg, color: T.fg, minHeight: "100dvh", fontFamily: F.sans }}>
      <style>{`
        .al-line{height:1px;background:${T.line}}

        .al-wrap{padding:56px 32px 56px;max-width:440px;margin:0 auto;display:flex;flex-direction:column;align-items:center;gap:24px}

        .al-avatar{width:100px;height:100px;border-radius:50%;border:1px solid ${T.line};padding:5px}
        .al-avatar img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}
        .al-avatar-init{width:100%;height:100%;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:${F.serif};font-size:34px;font-style:italic;background:${T.raised}}

        .al-eyebrow{font-family:${F.mono};font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:${T.muted};text-align:center}

        .al-name{font-family:${F.serif};font-size:52px;line-height:0.96;letter-spacing:-0.025em;font-weight:300;text-align:center;margin-top:-6px}
        .al-name em{font-style:italic;font-weight:400}

        .al-bio{font-family:${F.serif};font-style:italic;font-size:17px;line-height:1.6;color:${T.muted};max-width:320px;text-align:center;font-weight:300}

        .al-divider{display:flex;align-items:center;gap:16px;width:100%}
        .al-divider hr{flex:1;border:0;border-top:1px solid ${T.line}}
        .al-divider span{font-family:${F.mono};font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:${T.muted}}

        .al-stack{display:flex;flex-direction:column;width:100%}
        .al-link{display:flex;justify-content:space-between;align-items:center;padding:18px 0;border-bottom:1px solid ${T.line};color:${T.fg};text-decoration:none;transition:padding-left .3s ease;gap:12px}
        .al-stack .al-link:first-child{border-top:1px solid ${T.line}}
        .al-link:hover{padding-left:8px}
        .al-link .l{font-family:${F.serif};font-size:20px;font-weight:300;line-height:1.1;transition:font-style .2s}
        .al-link:hover .l{font-style:italic}
        .al-link .s{font-family:${F.mono};font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:${T.muted};display:block;margin-top:3px}
        .al-link .ar{font-family:${F.mono};font-size:13px;color:${T.muted};flex-shrink:0;transition:transform .3s ease,color .3s ease}
        .al-link:hover .ar{color:${T.fg};transform:translateX(2px)}

        .al-note{font-family:${F.serif};font-style:italic;font-size:15px;line-height:1.65;color:${T.muted};max-width:320px;text-align:center;font-weight:300}

        .al-stats{display:grid;grid-template-columns:repeat(${rawStats.length || 3},1fr);width:100%;border-top:1px solid ${T.line};border-bottom:1px solid ${T.line}}
        .al-stats>div{padding:18px 0;border-right:1px solid ${T.line};text-align:center}
        .al-stats>div:last-child{border-right:0}
        .al-stats .v{font-family:${F.serif};font-size:28px;font-weight:300;letter-spacing:-0.01em;line-height:1}
        .al-stats .l{font-family:${F.mono};font-size:9px;letter-spacing:0.14em;color:${T.muted};text-transform:uppercase;margin-top:6px}

        .al-foot{font-family:${F.mono};font-size:9px;letter-spacing:0.16em;color:${T.muted};text-transform:uppercase;text-align:center}
      `}</style>

      <div className="al-line" />

      <div className="al-wrap">
        {/* Avatar */}
        <div className="al-avatar">
          {page.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={page.avatarUrl} alt={page.displayName} />
          ) : (
            <div className="al-avatar-init" style={{ background: page.avatarBg || T.raised, color: T.fg }}>
              {page.avatarInitial || page.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="al-eyebrow">{eyebrow}</div>

        <div className="al-name">
          {nameFirst && <>{nameFirst} </>}
          <em>{nameLast}</em>
        </div>

        {page.bio && <div className="al-bio">{page.bio}</div>}

        {enabledLinks.length > 0 && (
          <>
            <div className="al-divider">
              <hr />
              <span>Links</span>
              <hr />
            </div>
            <div className="al-stack">
              {enabledLinks.map((item) => {
                const href = effectiveLinkUrl(item) || "#";
                const sub  = linkSub(item);
                return (
                  <a key={item.id} className="al-link" href={href}>
                    <span>
                      <span className="l">{item.title}</span>
                      {sub && <span className="s">{sub}</span>}
                    </span>
                    <span className="ar">→</span>
                  </a>
                );
              })}
            </div>
          </>
        )}

        {noteText && <div className="al-note">{noteText}</div>}

        {rawStats.length > 0 && (
          <div className="al-stats">
            {rawStats.map((s) => (
              <div key={s.l}>
                <div className="v">{s.v}</div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>
        )}

        <div className="al-foot">Built with <span style={{ color: T.fg }}>FRAME</span> · © MMXXIV</div>
      </div>
    </div>
  );
}
