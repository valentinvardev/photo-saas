"use client";

import { useState } from "react";

const inputCls =
  "font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow/60 focus:ring-1 focus:ring-yellow/20 transition placeholder:text-[var(--fg-muted)]";

function DomainPreviewBar({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 w-full">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--fg-muted)] shrink-0">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
      <span className="font-mono text-xs text-[var(--fg-muted)] truncate">{url}</span>
    </div>
  );
}

function RouteRow({
  icon, label, hint, prefix, slug, onSlug, locked,
}: {
  icon: React.ReactNode; label: string; hint: string;
  prefix: string; slug: string; onSlug?: (v: string) => void; locked?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-sm font-medium text-[var(--fg)]">{label}</p>
        <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">{hint}</p>
      </div>
      <div className="shrink-0 flex items-center gap-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-lg overflow-hidden">
        <span className="font-mono text-xs text-[var(--fg-muted)] pl-3 pr-0.5 select-none whitespace-nowrap">{prefix}</span>
        {locked ? (
          <span className="font-mono text-xs text-[var(--fg)] px-2 py-2 select-none">{slug}</span>
        ) : (
          <input
            value={slug}
            onChange={(e) => onSlug?.(e.target.value.replace(/[^a-z0-9-]/g, "").toLowerCase())}
            className="font-mono text-xs text-[var(--fg)] bg-transparent outline-none px-2 py-2 w-28 focus:bg-[var(--bg-subtle)] transition-colors"
          />
        )}
      </div>
    </div>
  );
}

export default function DomainPage() {
  const [domainChoice, setDomainChoice] = useState<null | "free" | "custom">(null);
  const [customDomainInput, setCustomDomainInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [routeLinks, setRouteLinks] = useState("links");
  const [routeDelivery, setRouteDelivery] = useState("d");

  const freeSubdomain = "sofia-chen.frame.so";
  const activeDomain = domainChoice === "custom" && customDomainInput ? customDomainInput : freeSubdomain;

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="font-sans text-xl font-bold text-[var(--fg)]">Domain</h1>
        <p className="font-sans text-sm text-[var(--fg-muted)] mt-1">
          Configure the address where clients find your portfolio, links, and delivery galleries.
        </p>
      </div>

      {/* ── Step 1: choose domain type ── */}
      {domainChoice === null && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Free option */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 pt-5 pb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-full px-2.5 py-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="font-mono text-[9px] font-bold text-[var(--fg-muted)] uppercase tracking-wider">Free</span>
                </span>
              </div>
              <p className="font-sans text-sm font-semibold text-[var(--fg)]">Free subdomain</p>
              <p className="font-sans text-xs text-[var(--fg-muted)] mt-1">Ready instantly, no payment needed.</p>
            </div>

            {/* mini browser preview */}
            <div className="px-5 py-4 flex-1 flex flex-col gap-3">
              <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
                  <span className="w-2 h-2 rounded-full bg-red-400/60" />
                  <span className="w-2 h-2 rounded-full bg-yellow/60" />
                  <span className="w-2 h-2 rounded-full bg-green-400/60" />
                  <DomainPreviewBar url={`https://${freeSubdomain}`} />
                </div>
                <div className="px-3 py-4">
                  <div className="h-1.5 w-24 bg-[var(--border)] rounded-full mb-2" />
                  <div className="h-1 w-16 bg-[var(--border-subtle)] rounded-full" />
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-8 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)]" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="font-mono text-[11px] text-[var(--fg-muted)] text-center break-all">{freeSubdomain}</p>
            </div>

            <div className="px-5 pb-5">
              <button
                onClick={() => setDomainChoice("free")}
                className="w-full font-sans text-sm font-semibold py-2.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--bg)] transition-colors"
              >
                Continue with free
              </button>
            </div>
          </div>

          {/* Custom .com option */}
          <div className="bg-[var(--bg-card)] border-2 border-yellow/40 rounded-xl overflow-hidden flex flex-col relative">
            <div className="absolute top-3.5 right-3.5">
              <span className="inline-flex items-center gap-1 bg-yellow/10 border border-yellow/30 rounded-full px-2.5 py-1">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="#facc15" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span className="font-mono text-[9px] font-bold text-yellow uppercase tracking-wider">Pro</span>
              </span>
            </div>

            <div className="px-5 pt-5 pb-4 border-b border-[var(--border-subtle)]">
              <p className="font-sans text-sm font-semibold text-[var(--fg)] mt-1">Custom .com domain</p>
              <p className="font-sans text-xs text-[var(--fg-muted)] mt-1">Your own professional address — clients will never see "frame.so".</p>
            </div>

            <div className="px-5 py-4 flex-1 flex flex-col gap-3">
              {/* mini browser with .com */}
              <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
                  <span className="w-2 h-2 rounded-full bg-red-400/60" />
                  <span className="w-2 h-2 rounded-full bg-yellow/60" />
                  <span className="w-2 h-2 rounded-full bg-green-400/60" />
                  <DomainPreviewBar url="https://sofiachen.com" />
                </div>
                <div className="px-3 py-4">
                  <div className="h-1.5 w-24 bg-[var(--border)] rounded-full mb-2" />
                  <div className="h-1 w-16 bg-[var(--border-subtle)] rounded-full" />
                  <div className="mt-3 grid grid-cols-3 gap-1.5">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-8 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)]" />
                    ))}
                  </div>
                </div>
              </div>

              {/* benefits list */}
              <ul className="flex flex-col gap-2 mt-1">
                {[
                  ["Credibility", "Clients trust a branded domain — it signals a serious professional."],
                  ["SEO boost", "Search engines rank custom domains higher than subdomains."],
                  ["Brand recall", "sofiachen.com is easier to remember and share."],
                  ["No platform lock-in", "Your domain stays yours, even if you switch tools."],
                ].map(([title, desc]) => (
                  <li key={title} className="flex items-start gap-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span className="font-sans text-xs text-[var(--fg-muted)]">
                      <span className="font-semibold text-[var(--fg)]">{title} — </span>{desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-5 pb-5">
              <button
                onClick={() => setDomainChoice("custom")}
                className="w-full font-sans text-sm font-semibold py-2.5 rounded-lg bg-yellow text-[#111] hover:bg-yellow-dark transition-colors"
              >
                Get a .com domain
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Custom domain input ── */}
      {domainChoice === "custom" && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">Connect your domain</h2>
              <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">Point an existing domain to FRAME or purchase one through your registrar.</p>
            </div>
            <button onClick={() => { setDomainChoice(null); setCustomDomainInput(""); }} className="font-sans text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
              Change
            </button>
          </div>
          <div className="px-6 py-5 flex flex-col gap-4">
            <div>
              <label className="block font-sans text-xs font-semibold text-[var(--fg-secondary)] mb-1.5">Your domain</label>
              <input
                className={`${inputCls} w-full`}
                placeholder="sofiachen.com"
                value={customDomainInput}
                onChange={(e) => setCustomDomainInput(e.target.value.replace(/^https?:\/\//, "").toLowerCase())}
              />
            </div>
            <div className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg px-4 py-3 flex flex-col gap-2">
              <p className="font-sans text-xs font-semibold text-[var(--fg)]">DNS configuration</p>
              <p className="font-sans text-xs text-[var(--fg-muted)]">Add a CNAME record at your registrar pointing to <span className="font-mono text-yellow">cname.frame.so</span></p>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {[["Type", "CNAME"], ["Name", "@"], ["Value", "cname.frame.so"]].map(([k, v]) => (
                  <div key={k} className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2">
                    <p className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-wider">{k}</p>
                    <p className="font-mono text-xs text-[var(--fg)] mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Free domain confirmation ── */}
      {domainChoice === "free" && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <div>
              <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">Your domain</h2>
              <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">Free subdomain — active immediately.</p>
            </div>
            <button onClick={() => setDomainChoice(null)} className="font-sans text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
              Change
            </button>
          </div>
          <div className="px-6 py-4 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
            <span className="font-mono text-sm text-[var(--fg)]">{freeSubdomain}</span>
            <span className="ml-auto font-sans text-[10px] text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">Active</span>
          </div>
        </div>
      )}

      {/* ── Routes dashboard ── */}
      {domainChoice !== null && (
        <>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)]">
              <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">Page routes</h2>
              <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">
                Control the URL path for each of your public pages under{" "}
                <span className="font-mono text-[var(--fg)]">{activeDomain}</span>
              </p>
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              <RouteRow
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                }
                label="Portfolio"
                hint="Your main photography portfolio — served at the root path."
                prefix={`${activeDomain}/`}
                slug=""
                locked
              />
              <RouteRow
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
                  </svg>
                }
                label="Links page"
                hint="Your Linktree-style page with social links and CTAs."
                prefix={`${activeDomain}/`}
                slug={routeLinks}
                onSlug={setRouteLinks}
              />
              <RouteRow
                icon={
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                }
                label="Client deliveries"
                hint="Each delivery gallery uses this prefix + the client slug."
                prefix={`${activeDomain}/`}
                slug={routeDelivery}
                onSlug={setRouteDelivery}
              />
            </div>

            {/* live URL preview strip */}
            <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-subtle)] flex flex-col gap-2">
              <p className="font-sans text-[11px] font-semibold text-[var(--fg-muted)] uppercase tracking-wider">URL preview</p>
              {[
                { label: "Portfolio", path: "" },
                { label: "Links",     path: routeLinks ? `/${routeLinks}` : "/links" },
                { label: "Delivery",  path: `/${routeDelivery || "d"}/client-name` },
              ].map(({ label, path }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="font-sans text-[11px] text-[var(--fg-muted)] w-16 shrink-0">{label}</span>
                  <span className="font-mono text-[11px] text-[var(--fg)]">{activeDomain}{path}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className={`font-sans text-sm font-semibold px-5 py-2 rounded-lg transition-all ${
                saved ? "bg-green-500 text-white" : "bg-yellow text-[#111] hover:bg-yellow-dark"
              }`}
            >
              {saved ? "Saved" : "Save changes"}
            </button>
          </div>
        </>
      )}

    </div>
  );
}
