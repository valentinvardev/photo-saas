"use client";

import { useState } from "react";
import { useCart } from "~/lib/cart";
import { LivePreviewThumbnail } from "~/components/dashboard/DevicePreviewModal";

/* Live URLs each page type points to — used to render real iframe
   previews in the page rows and the manage modal. */
const PAGE_PREVIEW_URLS: Record<"portfolio" | "links" | "delivery", string> = {
  portfolio: "/templates/minimal-bw",
  links:     "/template/brooklyn/links",
  delivery:  "/template/brooklyn/delivery",
};

const inputCls =
  "font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow/60 focus:ring-1 focus:ring-yellow/20 transition placeholder:text-[var(--fg-muted)]";

/* ─── tiny reusable browser chrome ─── */
function BrowserMockup({ url, children }: { url: string; children?: React.ReactNode }) {
  return (
    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
        <span className="w-2 h-2 rounded-full bg-red-400/60" />
        <span className="w-2 h-2 rounded-full bg-yellow/60" />
        <span className="w-2 h-2 rounded-full bg-green-400/60" />
        <div className="flex items-center gap-1.5 flex-1 bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--fg-muted)] shrink-0">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <span className="font-mono text-[10px] text-[var(--fg-muted)] truncate">{url}</span>
        </div>
      </div>
      {children ?? (
        <div className="px-3 py-4">
          <div className="h-1.5 w-24 bg-[var(--border)] rounded-full mb-2" />
          <div className="h-1 w-16 bg-[var(--border-subtle)] rounded-full" />
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)]" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── route row ─── */
function RouteRow({ icon, label, hint, prefix, slug, onSlug, locked }: {
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
      <div className="shrink-0 flex items-center bg-[var(--bg)] border border-[var(--border)] rounded-lg overflow-hidden">
        <span className="font-mono text-xs text-[var(--fg-muted)] pl-3 pr-0.5 select-none whitespace-nowrap">{prefix}</span>
        {locked ? (
          <span className="font-mono text-xs text-[var(--fg-muted)] italic px-2 py-2 select-none">root</span>
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

/* ─── domain search result row ─── */
function SearchResult({ domain, available, price }: { domain: string; available: boolean; price?: string }) {
  const { addItem, hasItem, setOpen } = useCart();
  const inCart = hasItem(domain);

  function handleAdd() {
    const cents = price ? parseInt(price.replace("$", ""), 10) * 100 : 0;
    addItem({ type: "domain", name: domain, detail: `${price ?? "free"}/yr`, price: cents, period: "year" });
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-subtle)] last:border-0">
      <span className={`w-2 h-2 rounded-full shrink-0 ${available ? "bg-green-400" : "bg-[var(--border)]"}`} />
      <span className="font-mono text-sm text-[var(--fg)] flex-1">{domain}</span>
      {available ? (
        <>
          <span className="font-sans text-xs text-[var(--fg-muted)]">{price}/yr</span>
          {inCart ? (
            <button
              onClick={() => setOpen(true)}
              className="font-sans text-xs font-semibold text-yellow border border-yellow/40 bg-yellow/10 px-3 py-1.5 rounded-lg hover:bg-yellow/20 transition-colors"
            >
              In cart →
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="font-sans text-xs font-semibold bg-yellow text-[#111] px-3 py-1.5 rounded-lg hover:bg-yellow/90 transition-colors"
            >
              Add to cart
            </button>
          )}
        </>
      ) : (
        <span className="font-sans text-xs text-[var(--fg-muted)]">Taken</span>
      )}
    </div>
  );
}

/* ─── manage modal ─── */
type PageId = "portfolio" | "links" | "delivery";

function ManageModal({ pageId, url, onClose }: { pageId: PageId; url: string; onClose: () => void }) {
  const [published, setPublished] = useState(true);
  const [seoIndex,  setSeoIndex]  = useState(true);
  const [pwProtect, setPwProtect] = useState(false);
  const [seoTitle,  setSeoTitle]  = useState("");
  const [seoDesc,   setSeoDesc]   = useState("");

  const titles: Record<PageId, string> = {
    portfolio: "Portfolio settings",
    links:     "Links page settings",
    delivery:  "Delivery settings",
  };

  /* visual builder route per page type. Each route loads EditorShell with the
     adapted template registered in src/lib/editor/templates/registry.tsx */
  const builderHref: Record<PageId, string> = {
    portfolio: "/editor/minimal-bw",
    links:     "/editor/minimal-bw", // links template not yet adapted
    delivery:  "/editor/atelier",
  };
  const builderTemplate: Record<PageId, string> = {
    portfolio: "Minimal BW",
    links:     "Default",
    delivery:  "Atelier",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* panel */}
      <div className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
          <div>
            <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">{titles[pageId]}</h2>
            <p className="font-mono text-[11px] text-[var(--fg-muted)] mt-0.5">{url}</p>
          </div>
          <button onClick={onClose} className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors p-1 rounded-lg hover:bg-[var(--bg-subtle)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* scrollable body */}
        <div className="overflow-y-auto flex-1">

          {/* visibility */}
          <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
            <p className="font-sans text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-3">Visibility</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans text-sm font-medium text-[var(--fg)]">Published</p>
                <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">
                  {published ? "Publicly accessible at your domain." : "Hidden — only you can see it."}
                </p>
              </div>
              <button
                onClick={() => setPublished(p => !p)}
                className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${published ? "bg-yellow" : "bg-[var(--border)]"}`}
                role="switch" aria-checked={published}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${published ? "translate-x-4" : ""}`} />
              </button>
            </div>
          </div>

          {/* design — unified across all page types */}
          <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
            <p className="font-sans text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-3">Design</p>
            <a
              href={builderHref[pageId]}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-[var(--bg-subtle)] border border-[var(--border)] hover:border-yellow/40 rounded-xl p-3 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-yellow/10 border border-yellow/20 flex items-center justify-center text-yellow shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-medium text-[var(--fg)]">Visual builder</p>
                <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">Edit images, text and layout — everything in one place.</p>
                <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-1">Template: {builderTemplate[pageId]}</p>
              </div>
              <span className="shrink-0 font-sans text-xs font-semibold bg-yellow text-[#111] px-3.5 py-2 rounded-lg group-hover:bg-yellow-dark transition-colors flex items-center gap-1.5">
                Open builder
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </span>
            </a>
          </div>

          {/* page-specific operational sections (links/galleries) */}
          {pageId === "links" && (
            <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
              <p className="font-sans text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-3">Links</p>
              <div className="flex items-center justify-between bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl px-4 py-3">
                <div>
                  <p className="font-sans text-sm font-medium text-[var(--fg)]">4 active links</p>
                  <p className="font-sans text-xs text-[var(--fg-muted)]">Instagram, Website, Booking, Shop</p>
                </div>
                <a href="/dashboard/links" className="font-sans text-xs font-semibold text-yellow hover:text-yellow-dark transition-colors">Manage</a>
              </div>
            </div>
          )}

          {pageId === "delivery" && (
            <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex flex-col gap-3">
              <p className="font-sans text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">Galleries</p>
              <div className="flex items-center justify-between bg-[var(--bg-subtle)] border border-[var(--border)] rounded-xl px-4 py-3">
                <div>
                  <p className="font-sans text-sm font-medium text-[var(--fg)]">2 active galleries</p>
                  <p className="font-sans text-xs text-[var(--fg-muted)]">Garcia Wedding · Smith Portraits</p>
                </div>
                <a href="/dashboard/delivery" className="font-sans text-xs font-semibold text-yellow hover:text-yellow-dark transition-colors">View all</a>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Default watermark", value: "Off" },
                  { label: "Download resolution", value: "Full" },
                  { label: "Expiration", value: "30 days" },
                  { label: "Proofing mode", value: "Off" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg px-3 py-2.5">
                    <p className="font-sans text-[11px] text-[var(--fg-muted)]">{label}</p>
                    <p className="font-sans text-xs font-semibold text-[var(--fg)] mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEO — portfolio & links only */}
          {(pageId === "portfolio" || pageId === "links") && (
            <div className="px-6 py-4 border-b border-[var(--border-subtle)] flex flex-col gap-3">
              <p className="font-sans text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">SEO</p>
              <div>
                <label className="block font-sans text-xs font-semibold text-[var(--fg-secondary)] mb-1.5">Page title</label>
                <input className={`${inputCls} w-full`} placeholder="Sofia Chen — Documentary Photographer" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} />
              </div>
              <div>
                <label className="block font-sans text-xs font-semibold text-[var(--fg-secondary)] mb-1.5">Meta description</label>
                <textarea className={`${inputCls} w-full resize-none`} rows={2} placeholder="Portfolio of Sofia Chen, documentary and portrait photographer based in New York." value={seoDesc} onChange={e => setSeoDesc(e.target.value)} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-sans text-sm font-medium text-[var(--fg)]">Search engine indexing</p>
                  <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">Allow Google and Bing to index this page.</p>
                </div>
                <button
                  onClick={() => setSeoIndex(p => !p)}
                  className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${seoIndex ? "bg-yellow" : "bg-[var(--border)]"}`}
                  role="switch" aria-checked={seoIndex}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${seoIndex ? "translate-x-4" : ""}`} />
                </button>
              </div>
            </div>
          )}

          {/* password protection */}
          <div className="px-6 py-4 border-b border-[var(--border-subtle)]">
            <p className="font-sans text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-3">Access</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans text-sm font-medium text-[var(--fg)]">Password protection</p>
                <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">Require a password to view this page.</p>
              </div>
              <button
                onClick={() => setPwProtect(p => !p)}
                className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${pwProtect ? "bg-yellow" : "bg-[var(--border)]"}`}
                role="switch" aria-checked={pwProtect}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${pwProtect ? "translate-x-4" : ""}`} />
              </button>
            </div>
            {pwProtect && (
              <input className={`${inputCls} w-full mt-3`} type="password" placeholder="Set a password…" />
            )}
          </div>

          {/* danger zone */}
          <div className="px-6 py-4">
            <p className="font-sans text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-3">Danger zone</p>
            <div className="flex gap-2">
              <button className="font-sans text-xs font-semibold text-[var(--fg-muted)] border border-[var(--border)] px-3 py-2 rounded-lg hover:text-[var(--fg)] transition-colors">
                Unpublish
              </button>
              {pageId !== "delivery" && (
                <button className="font-sans text-xs font-semibold text-red-500 border border-red-500/20 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors">
                  Reset content
                </button>
              )}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="px-6 py-4 border-t border-[var(--border)] flex justify-end gap-2 shrink-0">
          <button onClick={onClose} className="font-sans text-sm text-[var(--fg-muted)] border border-[var(--border)] px-4 py-2 rounded-lg hover:text-[var(--fg)] transition-colors">
            Cancel
          </button>
          <button
            onClick={onClose}
            className="font-sans text-sm font-semibold px-5 py-2 rounded-lg bg-yellow text-[#111] hover:bg-yellow-dark transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── page card (horizontal, 1-col) ─── */
function PageCard({ pageId, label, url, status: initialStatus, meta, icon, editHref, onManage }: {
  pageId: PageId; label: string; url: string; status: "live" | "draft";
  meta: string; icon: React.ReactNode; editHref: string; onManage: () => void;
}) {
  const [status, setStatus] = useState<"live" | "draft">(initialStatus);
  const [copied, setCopied] = useState(false);

  function copy() {
    void navigator.clipboard.writeText(`https://${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  /* Live iframe preview of the actual template page */
  const previewUrl = PAGE_PREVIEW_URLS[pageId];

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden flex gap-0">

      {/* left: live preview in browser chrome */}
      <div className="shrink-0 w-48 border-r border-[var(--border)] bg-[var(--bg-subtle)] flex flex-col">
        <div className="flex items-center gap-1 px-2 py-2 border-b border-[var(--border)] bg-[var(--bg-card)]">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-yellow/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
        </div>
        <LivePreviewThumbnail
          url={previewUrl}
          baseWidth={1280}
          className="flex-1 w-full"
        />
      </div>

      {/* right: info + actions */}
      <div className="flex-1 min-w-0 flex flex-col px-5 py-4 gap-3">

        {/* title row */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)] shrink-0 mt-0.5">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-sans text-sm font-semibold text-[var(--fg)]">{label}</span>
              {/* live/draft toggle pill */}
              <button
                onClick={() => setStatus(s => s === "live" ? "draft" : "live")}
                className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border transition-colors ${
                  status === "live"
                    ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
                    : "bg-[var(--bg-subtle)] text-[var(--fg-muted)] border-[var(--border)] hover:border-yellow/40 hover:text-yellow"
                }`}
              >
                {status}
              </button>
            </div>
            <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">{meta}</p>
          </div>
        </div>

        {/* url row */}
        <div className="flex items-center gap-2 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg px-3 py-2">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--fg-muted)] shrink-0">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <span className="font-mono text-[11px] text-[var(--fg-muted)] truncate flex-1">{url}</span>
          <button onClick={copy} className="shrink-0 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
            {copied
              ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            }
          </button>
        </div>

        {/* action row */}
        <div className="flex items-center gap-2 mt-auto">
          <a
            href={`https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors flex items-center gap-1.5"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Preview
          </a>
          <a
            href={editHref}
            className="font-sans text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors flex items-center gap-1.5"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </a>
          <button
            onClick={onManage}
            className="ml-auto font-sans text-xs font-semibold px-4 py-1.5 rounded-lg bg-yellow text-[#111] hover:bg-yellow-dark transition-colors flex items-center gap-1.5"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            Manage
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════ */

type DomainChoice = null | "free" | "custom";
type CustomFlow  = null | "existing" | "buy";

const FAKE_SEARCH_RESULTS = (q: string) => [
  { domain: `${q}.com`,    available: true,  price: "$12" },
  { domain: `${q}.photography`, available: true, price: "$28" },
  { domain: `${q}.co`,    available: false },
  { domain: `${q}photo.com`, available: true, price: "$14" },
  { domain: `${q}-studio.com`, available: true, price: "$12" },
];

export default function DomainPage() {
  const [domainChoice, setDomainChoice] = useState<DomainChoice>(null);
  const [customFlow,   setCustomFlow]   = useState<CustomFlow>(null);
  const [customDomainInput, setCustomDomainInput] = useState("");
  const [domainSearch, setDomainSearch] = useState("");
  const [searchResults, setSearchResults] = useState<ReturnType<typeof FAKE_SEARCH_RESULTS> | null>(null);
  const [configured, setConfigured] = useState(false);
  const [saved, setSaved] = useState(false);
  const [routeLinks, setRouteLinks]       = useState("links");
  const [routeDelivery, setRouteDelivery] = useState("d");
  const [modalPage, setModalPage] = useState<PageId | null>(null);

  const freeSubdomain = "sofia-chen.frame.so";
  const activeDomain =
    domainChoice === "custom" && customDomainInput
      ? customDomainInput
      : freeSubdomain;

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  function runSearch() {
    const q = domainSearch.trim().replace(/\s+/g, "-").toLowerCase();
    if (!q) return;
    setSearchResults(FAKE_SEARCH_RESULTS(q));
  }

  function reset() {
    setDomainChoice(null);
    setCustomFlow(null);
    setCustomDomainInput("");
    setDomainSearch("");
    setSearchResults(null);
    setConfigured(false);
  }

  /* ─── DASHBOARD (after setup is done) ─── */
  if (configured) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* top bar */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-sans text-xl font-bold text-[var(--fg)]">Domain</h1>
            <p className="font-sans text-sm text-[var(--fg-muted)] mt-0.5">All your public pages, in one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-2.5">
              <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
              <span className="font-mono text-sm text-[var(--fg)]">{activeDomain}</span>
              {domainChoice === "custom" && (
                <span className="font-mono text-[9px] font-bold text-yellow bg-yellow/10 border border-yellow/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider ml-1">Pro</span>
              )}
            </div>
            <button
              onClick={reset}
              className="font-sans text-xs text-[var(--fg-muted)] border border-[var(--border)] px-3 py-2 rounded-lg hover:text-[var(--fg)] transition-colors"
            >
              Change
            </button>
          </div>
        </div>

        {/* ssl / dns status — only for custom */}
        {domainChoice === "custom" && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)]">
              <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">Connection status</h2>
            </div>
            <div className="divide-y divide-[var(--border-subtle)]">
              {[
                { label: "DNS propagation", status: "Verified", ok: true },
                { label: "SSL certificate",  status: "Active",   ok: true },
                { label: "CNAME record",     status: "Detected", ok: true },
              ].map(({ label, status, ok }) => (
                <div key={label} className="flex items-center gap-3 px-6 py-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={ok ? "#4ade80" : "#facc15"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    {ok ? <polyline points="20 6 9 17 4 12"/> : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>}
                  </svg>
                  <span className="font-sans text-sm text-[var(--fg)] flex-1">{label}</span>
                  <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${ok ? "text-green-400" : "text-yellow"}`}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* page cards */}
        <div className="flex flex-col gap-3">
          <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">Your pages</h2>
          <PageCard
            pageId="portfolio"
            label="Portfolio"
            url={activeDomain}
            status="live"
            meta="Minimal BW · 8 sections · Last edited 2h ago"
            editHref="/editor/minimal-bw"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
            onManage={() => setModalPage("portfolio")}
          />
          <PageCard
            pageId="links"
            label="Links"
            url={`${activeDomain}/${routeLinks || "links"}`}
            status="live"
            meta="4 active links · Dark theme · 128 clicks this month"
            editHref="/dashboard/links"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>}
            onManage={() => setModalPage("links")}
          />
          <PageCard
            pageId="delivery"
            label="Delivery"
            url={`${activeDomain}/${routeDelivery || "d"}/client-name`}
            status="draft"
            meta="2 active galleries · Password protected · Full resolution"
            editHref="/dashboard/delivery"
            icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>}
            onManage={() => setModalPage("delivery")}
          />
        </div>

        {/* manage modal */}
        {modalPage && (
          <ManageModal
            pageId={modalPage}
            url={
              modalPage === "portfolio" ? activeDomain
              : modalPage === "links"   ? `${activeDomain}/${routeLinks || "links"}`
              : `${activeDomain}/${routeDelivery || "d"}/client-name`
            }
            onClose={() => setModalPage(null)}
          />
        )}

        {/* routes config */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">URL routes</h2>
            <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">
              Customize the path for each page under <span className="font-mono text-[var(--fg)]">{activeDomain}</span>
            </p>
          </div>
          <div className="divide-y divide-[var(--border-subtle)]">
            <RouteRow
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
              label="Portfolio"
              hint="Served at the root — this path cannot be changed."
              prefix={`${activeDomain}/`}
              slug=""
              locked
            />
            <RouteRow
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>}
              label="Links page"
              hint="Your Linktree-style page with social links and CTAs."
              prefix={`${activeDomain}/`}
              slug={routeLinks}
              onSlug={setRouteLinks}
            />
            <RouteRow
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>}
              label="Client deliveries"
              hint="Each gallery uses this prefix + the client slug."
              prefix={`${activeDomain}/`}
              slug={routeDelivery}
              onSlug={setRouteDelivery}
            />
          </div>
          <div className="px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-subtle)] flex flex-col gap-1.5">
            <p className="font-sans text-[11px] font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-0.5">Live URLs</p>
            {[
              { label: "Portfolio", path: "" },
              { label: "Links",     path: `/${routeLinks || "links"}` },
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
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     SETUP FLOW
  ═══════════════════════════════════════════════════════════════ */
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

      {/* breadcrumb */}
      <div>
        <h1 className="font-sans text-xl font-bold text-[var(--fg)]">Domain setup</h1>
        <div className="flex items-center gap-1.5 mt-2">
          {[
            { label: "Choose type", done: domainChoice !== null },
            { label: "Connect",     done: configured },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center gap-1.5">
              <span className={`font-sans text-xs ${step.done ? "text-yellow font-semibold" : domainChoice === null && i === 0 ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"}`}>
                {step.label}
              </span>
              {i < arr.length - 1 && <span className="text-[var(--border)] text-xs">/</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ── STEP 1: free vs custom ── */}
      {domainChoice === null && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Free */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 pt-5 pb-4 border-b border-[var(--border-subtle)]">
              <span className="inline-flex items-center gap-1.5 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-full px-2.5 py-1 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="font-mono text-[9px] font-bold text-[var(--fg-muted)] uppercase tracking-wider">Free</span>
              </span>
              <p className="font-sans text-sm font-semibold text-[var(--fg)]">Free subdomain</p>
              <p className="font-sans text-xs text-[var(--fg-muted)] mt-1">Ready instantly, no payment needed.</p>
            </div>
            <div className="px-5 py-4 flex-1 flex flex-col gap-3">
              <BrowserMockup url={`https://${freeSubdomain}`}>
                <LivePreviewThumbnail url={PAGE_PREVIEW_URLS.portfolio} baseWidth={1280} className="aspect-[4/3] w-full" />
              </BrowserMockup>
              <p className="font-mono text-[11px] text-[var(--fg-muted)] text-center break-all">{freeSubdomain}</p>
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={() => { setDomainChoice("free"); setConfigured(true); }}
                className="w-full font-sans text-sm font-semibold py-2.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--bg)] transition-colors"
              >
                Continue with free
              </button>
            </div>
          </div>

          {/* Custom .com */}
          <div className="bg-[var(--bg-card)] border-2 border-yellow/40 rounded-xl overflow-hidden flex flex-col relative">
            <div className="absolute top-3.5 right-3.5">
              <span className="inline-flex items-center gap-1 bg-yellow/10 border border-yellow/30 rounded-full px-2.5 py-1">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="#facc15" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span className="font-mono text-[9px] font-bold text-yellow uppercase tracking-wider">Pro</span>
              </span>
            </div>
            <div className="px-5 pt-5 pb-4 border-b border-[var(--border-subtle)]">
              <p className="font-sans text-sm font-semibold text-[var(--fg)] mt-1">Custom .com domain</p>
              <p className="font-sans text-xs text-[var(--fg-muted)] mt-1">Your own address — clients never see "frame.so".</p>
            </div>
            <div className="px-5 py-4 flex-1 flex flex-col gap-3">
              <BrowserMockup url="https://sofiachen.com">
                <LivePreviewThumbnail url={PAGE_PREVIEW_URLS.portfolio} baseWidth={1280} className="aspect-[4/3] w-full" />
              </BrowserMockup>
              <ul className="flex flex-col gap-2 mt-1">
                {[
                  ["Credibility", "Clients trust a branded domain."],
                  ["SEO boost", "Custom domains rank higher."],
                  ["Brand recall", "sofiachen.com is memorable."],
                  ["No lock-in", "Your domain stays yours."],
                ].map(([title, desc]) => (
                  <li key={title} className="flex items-start gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
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

      {/* ── STEP 2: existing vs buy (only for custom) ── */}
      {domainChoice === "custom" && customFlow === null && (
        <>
          <div className="flex items-center gap-3">
            <button onClick={() => setDomainChoice(null)} className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">Do you already own a domain?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Already have one */}
            <button
              onClick={() => setCustomFlow("existing")}
              className="bg-[var(--bg-card)] border border-[var(--border)] hover:border-yellow/50 rounded-xl p-5 text-left flex flex-col gap-3 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)] group-hover:text-yellow transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                </svg>
              </div>
              <div>
                <p className="font-sans text-sm font-semibold text-[var(--fg)]">I already have a domain</p>
                <p className="font-sans text-xs text-[var(--fg-muted)] mt-1">Connect an existing domain by adding a CNAME record at your registrar.</p>
              </div>
              <span className="font-sans text-xs font-semibold text-yellow flex items-center gap-1 mt-auto">
                Connect it
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </span>
            </button>

            {/* Buy a new one */}
            <button
              onClick={() => setCustomFlow("buy")}
              className="bg-[var(--bg-card)] border border-[var(--border)] hover:border-yellow/50 rounded-xl p-5 text-left flex flex-col gap-3 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)] group-hover:text-yellow transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.97-1.67L23 6H6"/>
                </svg>
              </div>
              <div>
                <p className="font-sans text-sm font-semibold text-[var(--fg)]">Buy a new domain</p>
                <p className="font-sans text-xs text-[var(--fg-muted)] mt-1">Search for an available domain and purchase it — from $12/yr.</p>
              </div>
              <span className="font-sans text-xs font-semibold text-yellow flex items-center gap-1 mt-auto">
                Search domains
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </span>
            </button>
          </div>
        </>
      )}

      {/* ── STEP 2a: connect existing domain ── */}
      {domainChoice === "custom" && customFlow === "existing" && (
        <>
          <div className="flex items-center gap-3">
            <button onClick={() => setCustomFlow(null)} className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">Connect your domain</h2>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col gap-0">
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

              <div className="bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg px-4 py-3 flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p className="font-sans text-xs text-[var(--fg-muted)]">
                    Add the following DNS record at your registrar (GoDaddy, Namecheap, Cloudflare, etc.)
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[["Type", "CNAME"], ["Name", "@"], ["Value", "cname.frame.so"]].map(([k, v]) => (
                    <div key={k} className="bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2">
                      <p className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-wider">{k}</p>
                      <p className="font-mono text-xs text-[var(--fg)] mt-0.5 break-all">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="font-sans text-[11px] text-[var(--fg-muted)]">DNS changes can take up to 48 hours to propagate. We'll email you once it's verified.</p>
              </div>
            </div>

            <div className="px-6 pb-5">
              <button
                disabled={!customDomainInput}
                onClick={() => setConfigured(true)}
                className="w-full font-sans text-sm font-semibold py-2.5 rounded-lg bg-yellow text-[#111] hover:bg-yellow-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm &amp; go to dashboard
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── STEP 2b: buy a domain ── */}
      {domainChoice === "custom" && customFlow === "buy" && (
        <>
          <div className="flex items-center gap-3">
            <button onClick={() => setCustomFlow(null)} className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">Find your domain</h2>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--border)] flex gap-2">
              <input
                className={`${inputCls} flex-1`}
                placeholder="sofiachen"
                value={domainSearch}
                onChange={(e) => setDomainSearch(e.target.value.replace(/\s+/g, "-").toLowerCase())}
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
              />
              <button
                onClick={runSearch}
                className="font-sans text-sm font-semibold px-4 py-2 rounded-lg bg-yellow text-[#111] hover:bg-yellow-dark transition-colors"
              >
                Search
              </button>
            </div>

            {searchResults === null ? (
              <div className="px-6 py-10 text-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-[var(--border)] mb-3">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <p className="font-sans text-sm text-[var(--fg-muted)]">Type your name and hit Search to check availability.</p>
              </div>
            ) : (
              <div>
                {searchResults.map((r) => (
                  <SearchResult key={r.domain} {...r} />
                ))}
              </div>
            )}
          </div>

          {searchResults !== null && (
            <p className="font-sans text-xs text-[var(--fg-muted)] text-center -mt-2">
              After purchasing, come back and use "I already have a domain" to connect it.
            </p>
          )}
        </>
      )}

    </div>
  );
}
