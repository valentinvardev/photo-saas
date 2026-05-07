"use client";

import { VT_U, VAULT_BRAND, VAULT_TOTALS } from "~/lib/vault/data";

export default function VaultLinksPage() {
  const links = [
    { no: "01", label: "Book a session",        sub: "Editorial · weddings · private commissions",       href: "#",                          accent: true  },
    { no: "02", label: "The archive",           sub: "Four chapters · eleven folders · all plates",      href: "/template/vault"                            },
    { no: "03", label: "Latest delivery",       sub: "Marais · Seraphine & Theo · Jun 2025",             href: "/template/vault/delivery"                   },
    { no: "04", label: "The Journal",           sub: "Notes from the field · twice monthly",             href: "#"                                          },
    { no: "05", label: "Print Shop",            sub: "Limited editions · signed & numbered",             href: "#"                                          },
    { no: "06", label: "Instagram",             sub: "@ines.aurelio · 24.6K",                            href: "#"                                          },
  ];

  return (
    <div className="vt-root vk-root">
      <style>{VK_CSS}</style>

      <header className="vt-top">
        <div className="vt-top-l">
          <span className="vt-disp" style={{ fontSize: 22 }}>VAULT</span>
          <span className="vt-mono" style={{ marginLeft: 12, color: "var(--vt-muted)" }}>{VAULT_BRAND.edition}</span>
        </div>
        <div className="vt-top-c vt-mono">— Index of links —</div>
        <div className="vt-top-r vt-mono">{VAULT_BRAND.photographer} <span style={{ color: "var(--vt-muted)", margin: "0 8px" }}>·</span> {VAULT_BRAND.based}</div>
      </header>

      <main className="vk-page">
        <header className="vk-head">
          <div className="vt-imgwrap vk-portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={VT_U("1531746020798-e6953c6e8e04", 600)} alt={VAULT_BRAND.photographer} />
          </div>
          <div className="vk-head-text">
            <span className="vt-mono" style={{ color: "var(--vt-muted)" }}>— Photographer · {VAULT_BRAND.based} —</span>
            <h1 className="vt-disp vk-name">
              <span>INES</span>
              <span className="vk-name-amp">&amp;</span>
              <span>AURELIO</span>
            </h1>
            <p className="vk-bio">
              Available worldwide for editorial, weddings &amp; private commissions through Q1 2026. Letters welcome.
            </p>
          </div>
        </header>

        <section className="vk-meta">
          <div><div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Years</div><div className="vt-disp" style={{ fontSize: 28 }}>08</div></div>
          <div><div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Folders</div><div className="vt-disp" style={{ fontSize: 28 }}>{String(VAULT_TOTALS.folders).padStart(2, "0")}</div></div>
          <div><div className="vt-mono" style={{ color: "var(--vt-muted)" }}>Plates</div><div className="vt-disp" style={{ fontSize: 28, color: "var(--vt-accent)" }}>{String(VAULT_TOTALS.photos).padStart(3, "0")}</div></div>
        </section>

        <ol className="vk-stack">
          {links.map((l) => (
            <li key={l.no}>
              <a className={`vk-link ${l.accent ? "is-accent" : ""}`} href={l.href}>
                <span className="vt-mono vk-link-no">{l.no}</span>
                <span className="vk-link-text">
                  <span className="vt-disp vk-link-label">{l.label}</span>
                  <span className="vt-mono vk-link-sub">{l.sub}</span>
                </span>
                <span className="vk-link-arrow">↗</span>
              </a>
            </li>
          ))}
        </ol>

        <footer className="vk-foot vt-mono">
          <span>©2018 — 2026</span>
          <span>Built with <span style={{ color: "var(--vt-accent)" }}>FRAME</span></span>
        </footer>
      </main>
    </div>
  );
}

const VK_CSS = `
.vt-root{ font-family:var(--vt-sans); color:var(--vt-fg); background:var(--vt-bg); padding-top:48px; -webkit-font-smoothing:antialiased }
.vt-root .vt-mono{ font-family:var(--vt-mono); font-size:11px; letter-spacing:.06em; text-transform:uppercase }
.vt-root .vt-disp{ font-family:var(--vt-display); letter-spacing:.005em; line-height:.86; text-transform:uppercase }
.vt-root .vt-imgwrap{ position:relative; overflow:hidden; background:var(--vt-paper) }
.vt-root .vt-imgwrap img{ width:100%; height:100%; object-fit:cover; display:block }

.vt-top{ position:fixed; top:0; left:0; right:0; height:48px; z-index:60; display:grid; grid-template-columns: 1fr 1fr 1fr; align-items:center; padding: 0 22px; background:var(--vt-bg); border-bottom:1px solid var(--vt-line) }
.vt-top-l{ display:flex; align-items:baseline; gap:12px }
.vt-top-c{ text-align:center; color:var(--vt-muted) }
.vt-top-r{ text-align:right; color:var(--vt-muted) }
@media (max-width:760px){ .vt-top{ grid-template-columns: 1fr auto; height:44px } .vt-top-c{ display:none } }

.vk-page{ max-width:780px; margin: 0 auto; padding: clamp(40px,8vh,80px) clamp(20px,4vw,40px) clamp(40px,6vh,80px); display:flex; flex-direction:column; gap: clamp(28px,5vh,56px) }
.vk-head{ display:grid; grid-template-columns: 160px 1fr; gap: clamp(20px,4vw,40px); align-items:center; padding-bottom:32px; border-bottom:1px solid var(--vt-line) }
.vk-portrait{ aspect-ratio: 1; border:1px solid var(--vt-line) }
.vk-head-text{ display:flex; flex-direction:column; gap:14px }
.vk-name{ margin:0; font-size: clamp(48px,9vw,96px); display:flex; flex-direction:column; line-height:.85 }
.vk-name-amp{ font-family:var(--vt-display); color:var(--vt-accent); font-size: clamp(36px,7vw,72px); line-height:.7; align-self:flex-start; margin: -.05em 0 -.05em .04em }
.vk-bio{ margin:0; color:var(--vt-muted); font-size:14px; line-height:1.55; max-width:42ch }
@media (max-width:560px){ .vk-head{ grid-template-columns:1fr } .vk-portrait{ max-width:200px } }

.vk-meta{ display:grid; grid-template-columns:repeat(3,1fr); gap:24px; padding:18px 0; border-top:1px solid var(--vt-line); border-bottom:1px solid var(--vt-line); text-align:center }
.vk-meta > div > div:first-child{ margin-bottom:6px }

.vk-stack{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:0; border-top:1px solid var(--vt-line) }
.vk-link{ display:grid; grid-template-columns: 56px 1fr 32px; gap:14px; align-items:center; padding: 22px 14px; color:var(--vt-fg); text-decoration:none; border-bottom:1px solid var(--vt-line); transition: padding .25s var(--vt-ease), background .25s ease, color .2s ease; background:transparent }
.vk-link:hover{ padding-left:24px; background:var(--vt-paper) }
.vk-link:hover .vk-link-arrow{ color:var(--vt-accent); transform:translate(3px,-3px) }
.vk-link.is-accent{ background:var(--vt-fg); color:var(--vt-bg) }
.vk-link.is-accent .vk-link-no{ color:var(--vt-accent) }
.vk-link.is-accent .vk-link-sub{ color:rgba(244,240,230,.6) }
.vk-link.is-accent:hover{ background:var(--vt-accent); color:#fff }
.vk-link.is-accent:hover .vk-link-no{ color:#fff; opacity:.7 }
.vk-link.is-accent:hover .vk-link-sub{ color:rgba(255,255,255,.75) }
.vk-link.is-accent:hover .vk-link-arrow{ color:#fff }
.vk-link-no{ color:var(--vt-muted); font-size:13px }
.vk-link-text{ display:flex; flex-direction:column; gap:4px; min-width:0 }
.vk-link-label{ font-size: clamp(20px,3.4vw,28px); line-height:1 }
.vk-link-sub{ color:var(--vt-muted); font-size:10px }
.vk-link-arrow{ font-family:var(--vt-display); font-size:22px; color:var(--vt-muted); transition: transform .25s var(--vt-ease), color .2s ease }

.vk-foot{ display:flex; justify-content:space-between; padding-top:18px; color:var(--vt-muted) }
`;
