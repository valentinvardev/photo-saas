"use client";

/* ─── Minimal Links — canonical component ────────────────────────────
   Same visual language as the Minimal delivery: white, square, clean.
   Cormorant Garamond serif · DM Sans body · Space Mono labels.

   Rendered in three places:
     • /dashboard/links — live preview phone in the editor
     • /l/[id]          — public client-facing route
     • /template/minimal/links — public demo (reads from store)
   ─────────────────────────────────────────────────────────────────── */

import { effectiveLinkUrl, type LinksPage, type LinkItem } from "~/lib/links/data";

const T = {
  bg:     "#FAFAFA",
  fg:     "#111111",
  muted:  "#888888",
  line:   "#E8E8E8",
  raised: "#FFFFFF",
};

const F = {
  serif: "var(--mn-serif), 'Cormorant Garamond', serif",
  sans:  "var(--mn-sans), 'DM Sans', system-ui, sans-serif",
  mono:  "var(--mn-mono), 'Space Mono', ui-monospace, monospace",
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

export interface MinimalLinksProps {
  page: LinksPage;
}

export function MinimalLinks({ page }: MinimalLinksProps) {
  const enabledLinks = page.links.filter((l) => l.enabled && l.type !== "divider");

  const nameParts = page.displayName.trim().split(" ");
  const nameFirst = nameParts.slice(0, -1).join(" ");
  const nameLast  = nameParts[nameParts.length - 1] ?? "";

  const rawStats = [
    { v: page.labels?.stat1_v, l: page.labels?.stat1_l || "Years"    },
    { v: page.labels?.stat2_v, l: page.labels?.stat2_l || "Projects" },
    { v: page.labels?.stat3_v, l: page.labels?.stat3_l || "Based"    },
  ].filter((s): s is { v: string; l: string } => !!s.v);

  const eyebrow = page.labels?.eyebrow || "Photographer";

  return (
    <div style={{ background: T.bg, color: T.fg, minHeight: "100dvh", fontFamily: F.sans }}>
      <style>{`
        .ml-stripe{height:1px;background:${T.line}}

        .ml-wrap{padding:56px 32px 52px;max-width:420px;margin:0 auto;display:flex;flex-direction:column;align-items:center;text-align:center;gap:22px}

        .ml-avatar{width:96px;height:96px;border:1px solid ${T.line};padding:6px}
        .ml-avatar img{width:100%;height:100%;object-fit:cover;display:block}
        .ml-avatar-init{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:${F.serif};font-size:32px;font-style:italic}

        .ml-eyebrow{font-family:${F.mono};font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:${T.muted}}

        .ml-name{font-family:${F.serif};font-size:52px;line-height:1;letter-spacing:-0.02em;font-weight:400}
        .ml-name em{font-style:italic}

        .ml-bio{font-family:${F.serif};font-style:italic;font-size:16px;line-height:1.6;color:${T.muted};max-width:320px}

        .ml-rule{width:32px;height:1px;background:${T.line}}

        .ml-stack{display:flex;flex-direction:column;gap:0;width:100%;border:1px solid ${T.line}}
        .ml-link{display:flex;justify-content:space-between;align-items:center;padding:16px 18px;color:${T.fg};text-decoration:none;background:${T.raised};border-bottom:1px solid ${T.line};transition:background .25s ease,color .25s ease}
        .ml-link:last-child{border-bottom:0}
        .ml-link:hover{background:${T.fg};color:${T.bg}}
        .ml-link.primary{background:${T.fg};color:${T.bg}}
        .ml-link.primary:hover{background:#333;color:${T.bg}}
        .ml-link .l{font-family:${F.serif};font-size:18px;text-align:left}
        .ml-link.primary .l{font-style:italic}
        .ml-link .s{font-family:${F.mono};font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:${T.muted};display:block;margin-top:2px;text-align:left}
        .ml-link.primary .s,.ml-link:hover .s{color:rgba(250,250,250,0.6)}
        .ml-link .ar{font-family:${F.mono};font-size:13px;transition:transform .25s ease;flex-shrink:0}
        .ml-link:hover .ar{transform:translateX(2px)}

        .ml-stats{display:grid;grid-template-columns:repeat(${rawStats.length || 3},1fr);width:100%;border:1px solid ${T.line}}
        .ml-stats>div{padding:16px 0;border-right:1px solid ${T.line}}
        .ml-stats>div:last-child{border-right:0}
        .ml-stats .v{font-family:${F.serif};font-size:28px;line-height:1}
        .ml-stats .l{font-family:${F.mono};font-size:9px;letter-spacing:0.14em;color:${T.muted};text-transform:uppercase;margin-top:5px}

        .ml-foot{font-family:${F.mono};font-size:9px;letter-spacing:0.16em;color:${T.muted};text-transform:uppercase}
      `}</style>

      <div className="ml-stripe" />

      <div className="ml-wrap">
        {/* Avatar */}
        <div className="ml-avatar">
          {page.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={page.avatarUrl} alt={page.displayName} />
          ) : (
            <div className="ml-avatar-init" style={{ background: page.avatarBg || T.raised, color: T.fg }}>
              {page.avatarInitial || page.displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="ml-eyebrow">{eyebrow}</div>

        <div className="ml-name">
          {nameFirst && <>{nameFirst} </>}
          <em>{nameLast}</em>
        </div>

        {page.bio && <div className="ml-bio">{page.bio}</div>}

        <div className="ml-rule" />

        {enabledLinks.length > 0 && (
          <div className="ml-stack">
            {enabledLinks.map((item, i) => {
              const href = effectiveLinkUrl(item) || "#";
              const sub  = linkSub(item);
              return (
                <a key={item.id} className={`ml-link${i === 0 ? " primary" : ""}`} href={href}>
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
          <div className="ml-stats">
            {rawStats.map((s) => (
              <div key={s.l}>
                <div className="v">{s.v}</div>
                <div className="l">{s.l}</div>
              </div>
            ))}
          </div>
        )}

        <div className="ml-foot">Built with <span style={{ color: T.fg }}>FRAME</span> · © MMXXIV</div>
      </div>
    </div>
  );
}
