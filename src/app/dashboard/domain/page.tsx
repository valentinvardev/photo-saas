"use client";

import { useState } from "react";
import { useCart } from "~/lib/cart";
import { AnimatePresence, motion } from "framer-motion";
import { DevicePreviewModal, LivePreviewThumbnail } from "~/components/dashboard/DevicePreviewModal";
import { Toggle } from "~/components/ui/Toggle";

const PAGE_PREVIEW_URLS: Record<"portfolio" | "links" | "delivery", string> = {
  portfolio: "/templates/minimal-bw",
  links:     "/template/brooklyn/links",
  delivery:  "/template/brooklyn/delivery",
};

const inputCls =
  "font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow/60 focus:ring-1 focus:ring-yellow/20 transition placeholder:text-[var(--fg-muted)]";

const FREE_DOMAIN = "sofia-chen.portapic.app";

/* ── Copy button with flash ───────────────────────────────────── */
function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    void navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 font-sans text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
        copied
          ? "border-green-400/40 bg-green-400/10 text-green-400"
          : "border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--fg-muted)] hover:text-[var(--fg)]"
      } ${className ?? ""}`}
    >
      {copied ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* ── Free domain row ──────────────────────────────────────────── */
function FreeDomainRow({ isActive }: { isActive: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
      <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? "bg-green-400" : "bg-[var(--border)]"}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm text-[var(--fg)]">{FREE_DOMAIN}</span>
          <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--fg-muted)]">Free</span>
          {isActive && (
            <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-green-400/10 border border-green-400/20 text-green-400">Active</span>
          )}
        </div>
        {!isActive && (
          <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">Fallback — your custom domain is active.</p>
        )}
      </div>
      <CopyButton value={`https://${FREE_DOMAIN}`} />
    </div>
  );
}

/* ── Custom domain row ────────────────────────────────────────── */
function CustomDomainRow({ domain, verified, onRemove }: {
  domain:   string;
  verified: boolean;
  onRemove: () => void;
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 bg-[var(--bg-card)] border rounded-xl ${
      verified ? "border-[var(--border)]" : "border-yellow/30"
    }`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${verified ? "bg-green-400" : "bg-yellow animate-pulse"}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm text-[var(--fg)]">{domain}</span>
          <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--fg-muted)]">Custom</span>
          {verified ? (
            <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-green-400/10 border border-green-400/20 text-green-400">Active</span>
          ) : (
            <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-yellow/10 border border-yellow/20 text-yellow">Pending DNS</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {verified && <CopyButton value={`https://${domain}`} />}
        <button
          onClick={onRemove}
          className="font-sans text-xs text-[var(--fg-muted)] hover:text-red-400 transition-colors px-2 py-1.5"
          title="Remove domain"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
        </button>
      </div>
    </div>
  );
}

/* ── DNS setup banner ─────────────────────────────────────────── */
function SetupBanner({ domain, onVerify }: { domain: string; onVerify: () => void }) {
  const [checking, setChecking] = useState(false);

  function check() {
    setChecking(true);
    setTimeout(() => { setChecking(false); onVerify(); }, 1800);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-yellow/30 bg-yellow/5 p-4 flex flex-col gap-3"
    >
      <div className="flex items-start gap-3">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fad502" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm font-semibold text-[var(--fg)]">Waiting for DNS verification</p>
          <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">
            Add this record at your registrar (GoDaddy, Namecheap, Cloudflare…). DNS changes can take up to 48 hours.
          </p>
        </div>
      </div>

      {/* DNS record */}
      <div className="grid grid-cols-3 gap-2">
        {[["Type", "CNAME"], ["Name", "@"], ["Value", "cname.portapic.app"]].map(([k, v]) => (
          <div key={k} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-3 py-2">
            <p className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-wider mb-0.5">{k}</p>
            <p className="font-mono text-xs text-[var(--fg)] break-all">{v}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="font-sans text-xs text-[var(--fg-muted)]">
          Pointing to <span className="font-mono text-[var(--fg)]">{domain}</span>
        </p>
        <button
          onClick={check}
          disabled={checking}
          className="flex items-center gap-1.5 font-sans text-xs font-semibold px-4 py-2 rounded-lg bg-yellow text-[#111] hover:bg-yellow/90 disabled:opacity-60 transition-colors"
        >
          {checking ? (
            <>
              <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
              Checking…
            </>
          ) : "Check now"}
        </button>
      </div>
    </motion.div>
  );
}

/* ── Add domain panel ─────────────────────────────────────────── */
const FAKE_RESULTS = (q: string) => [
  { domain: `${q}.com`,         available: true,  price: "$12" },
  { domain: `${q}.photography`, available: true,  price: "$28" },
  { domain: `${q}.co`,          available: false },
  { domain: `${q}photo.com`,    available: true,  price: "$14" },
];

function SearchResult({ domain, available, price }: { domain: string; available: boolean; price?: string }) {
  const { addItem, hasItem, setOpen } = useCart();
  const inCart = hasItem(domain);
  function handleAdd() {
    addItem({ type: "domain", name: domain, detail: `${price ?? "free"}/yr`, price: (price ? parseInt(price.replace("$", ""), 10) : 0) * 100, period: "year" });
  }
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0">
      <span className={`w-2 h-2 rounded-full shrink-0 ${available ? "bg-green-400" : "bg-[var(--border)]"}`} />
      <span className="font-mono text-sm text-[var(--fg)] flex-1">{domain}</span>
      {available ? (
        <>
          <span className="font-sans text-xs text-[var(--fg-muted)]">{price}/yr</span>
          {inCart ? (
            <button onClick={() => setOpen(true)} className="font-sans text-xs font-semibold text-yellow border border-yellow/40 bg-yellow/10 px-3 py-1.5 rounded-lg hover:bg-yellow/20 transition-colors">In cart →</button>
          ) : (
            <button onClick={handleAdd} className="font-sans text-xs font-semibold bg-yellow text-[#111] px-3 py-1.5 rounded-lg hover:bg-yellow/90 transition-colors">Add to cart</button>
          )}
        </>
      ) : (
        <span className="font-sans text-xs text-[var(--fg-muted)]">Taken</span>
      )}
    </div>
  );
}

function AddDomainPanel({ onConnect, onClose }: {
  onConnect: (domain: string) => void;
  onClose:   () => void;
}) {
  const [flow,         setFlow]         = useState<"connect" | "buy" | null>(null);
  const [connectInput, setConnectInput] = useState("");
  const [search,       setSearch]       = useState("");
  const [results,      setResults]      = useState<ReturnType<typeof FAKE_RESULTS> | null>(null);

  function runSearch() {
    const q = search.trim().replace(/\s+/g, "-").toLowerCase();
    if (q) setResults(FAKE_RESULTS(q));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18 }}
      className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <p className="font-sans text-sm font-semibold text-[var(--fg)]">Add a custom domain</p>
        <button onClick={onClose} className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors p-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>

      {/* Flow selector */}
      {flow === null && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
          <button
            onClick={() => setFlow("connect")}
            className="flex items-start gap-3 p-4 rounded-xl border border-[var(--border)] hover:border-yellow/40 text-left transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)] group-hover:text-yellow transition-colors shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
            </div>
            <div>
              <p className="font-sans text-sm font-semibold text-[var(--fg)]">I already have a domain</p>
              <p className="font-sans text-xs text-[var(--fg-muted)] mt-1">Connect via CNAME record at your registrar.</p>
            </div>
          </button>
          <button
            onClick={() => setFlow("buy")}
            className="flex items-start gap-3 p-4 rounded-xl border border-[var(--border)] hover:border-yellow/40 text-left transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)] group-hover:text-yellow transition-colors shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.97-1.67L23 6H6"/></svg>
            </div>
            <div>
              <p className="font-sans text-sm font-semibold text-[var(--fg)]">Buy a new domain</p>
              <p className="font-sans text-xs text-[var(--fg-muted)] mt-1">Search and purchase — from $12/yr.</p>
            </div>
          </button>
        </div>
      )}

      {/* Connect existing */}
      {flow === "connect" && (
        <div className="p-4 flex flex-col gap-4">
          <button onClick={() => setFlow(null)} className="flex items-center gap-1.5 font-sans text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back
          </button>
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] mb-1.5">Your domain</label>
            <input
              autoFocus
              className={`${inputCls} w-full`}
              placeholder="sofiachen.com"
              value={connectInput}
              onChange={(e) => setConnectInput(e.target.value.replace(/^https?:\/\//, "").toLowerCase())}
              onKeyDown={(e) => { if (e.key === "Enter" && connectInput) onConnect(connectInput); }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="font-sans text-sm text-[var(--fg-muted)] border border-[var(--border)] px-4 py-2 rounded-lg hover:text-[var(--fg)] transition-colors">Cancel</button>
            <button
              disabled={!connectInput.trim()}
              onClick={() => onConnect(connectInput.trim())}
              className="font-sans text-sm font-semibold px-5 py-2 rounded-lg bg-yellow text-[#111] hover:bg-yellow/90 disabled:opacity-40 transition-colors"
            >
              Connect domain →
            </button>
          </div>
        </div>
      )}

      {/* Buy a domain */}
      {flow === "buy" && (
        <div className="flex flex-col">
          <div className="p-4 pb-0 flex items-center gap-2">
            <button onClick={() => setFlow(null)} className="flex items-center gap-1.5 font-sans text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
          </div>
          <div className="px-4 pt-3 pb-4 flex gap-2">
            <input
              autoFocus
              className={`${inputCls} flex-1`}
              placeholder="sofiachen"
              value={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
            />
            <button onClick={runSearch} className="font-sans text-sm font-semibold px-4 py-2 rounded-lg bg-yellow text-[#111] hover:bg-yellow/90 transition-colors">
              Search
            </button>
          </div>
          {results && (
            <div className="border-t border-[var(--border)]">
              {results.map((r) => <SearchResult key={r.domain} {...r} />)}
            </div>
          )}
          {!results && (
            <div className="px-4 pb-5 text-center">
              <p className="font-sans text-xs text-[var(--fg-muted)]">After purchasing, connect it via "I already have a domain".</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ── Edit page button ─────────────────────────────────────────── */
function EditPageButton({ href }: { href: string }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <a href={href} className="hidden sm:flex font-sans text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors items-center gap-1.5">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Edit
      </a>
      <button onClick={() => setShowModal(true)} className="sm:hidden font-sans text-xs font-medium px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors flex items-center gap-1.5">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        Edit
      </button>
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6"
            style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.45)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 pt-6 pb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center mb-4">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="text-[var(--fg-muted)]"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                </div>
                <h2 className="font-sans font-bold text-[var(--fg)] text-base mb-1">Desktop feature</h2>
                <p className="font-sans text-sm text-[var(--fg-muted)] leading-relaxed">The page editor is designed for larger screens. Open Portapic on your computer to edit this page.</p>
              </div>
              <div className="px-6 pb-6">
                <button onClick={() => setShowModal(false)} className="w-full py-2.5 rounded-xl bg-[var(--fg)] text-[var(--bg)] font-sans text-sm font-semibold hover:opacity-90 transition-opacity">Got it</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Route row ────────────────────────────────────────────────── */
function RouteRow({ icon, label, hint, prefix, slug, onSlug, locked }: {
  icon: React.ReactNode; label: string; hint: string;
  prefix: string; slug: string; onSlug?: (v: string) => void; locked?: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-4 sm:px-6 py-4">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className="shrink-0 w-8 h-8 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)]">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm font-medium text-[var(--fg)]">{label}</p>
          <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">{hint}</p>
        </div>
      </div>
      <div className="md:shrink-0 flex items-center bg-[var(--bg)] border border-[var(--border)] rounded-lg overflow-hidden min-w-0 ml-11 md:ml-0">
        <span className="font-mono text-xs text-[var(--fg-muted)] pl-3 pr-0.5 select-none truncate min-w-0">{prefix}</span>
        {locked ? (
          <span className="font-mono text-xs text-[var(--fg-muted)] italic px-2 py-2 select-none shrink-0">root</span>
        ) : (
          <input
            value={slug}
            onChange={(e) => onSlug?.(e.target.value.replace(/[^a-z0-9-]/g, "").toLowerCase())}
            className="font-mono text-xs text-[var(--fg)] bg-transparent outline-none px-2 py-2 w-24 md:w-28 focus:bg-[var(--bg-subtle)] transition-colors shrink-0"
          />
        )}
      </div>
    </div>
  );
}

/* ── Manage modal ─────────────────────────────────────────────── */
type PageId = "portfolio" | "links" | "delivery";

function ManageModal({ pageId, url, onClose }: { pageId: PageId; url: string; onClose: () => void }) {
  const [published, setPublished] = useState(true);
  const [seoIndex,  setSeoIndex]  = useState(true);
  const [pwProtect, setPwProtect] = useState(false);
  const [seoTitle,  setSeoTitle]  = useState("");
  const [seoDesc,   setSeoDesc]   = useState("");

  const titles: Record<PageId, string> = { portfolio: "Portfolio settings", links: "Links page settings", delivery: "Delivery settings" };
  const builderHref: Record<PageId, string> = { portfolio: "/editor/minimal-bw", links: "/editor/minimal-bw", delivery: "/editor/atelier" };
  const builderTemplate: Record<PageId, string> = { portfolio: "Minimal BW", links: "Default", delivery: "Atelier" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
          <div>
            <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">{titles[pageId]}</h2>
            <p className="font-mono text-[11px] text-[var(--fg-muted)] mt-0.5">{url}</p>
          </div>
          <button onClick={onClose} className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors p-1 rounded-lg hover:bg-[var(--bg-subtle)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <p className="font-sans text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-3">Visibility</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans text-sm font-medium text-[var(--fg)]">Published</p>
                <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">{published ? "Publicly accessible." : "Hidden — only you can see it."}</p>
              </div>
              <Toggle checked={published} onChange={setPublished} ariaLabel="Published" />
            </div>
          </div>
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <p className="font-sans text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-3">Design</p>
            <a href={builderHref[pageId]} target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-[var(--bg-subtle)] border border-[var(--border)] hover:border-yellow/40 rounded-xl p-3 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-yellow/10 border border-yellow/20 flex items-center justify-center text-yellow shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-medium text-[var(--fg)]">Visual builder</p>
                <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">Template: {builderTemplate[pageId]}</p>
              </div>
              <span className="shrink-0 font-sans text-xs font-semibold bg-yellow text-[#111] px-3.5 py-2 rounded-lg flex items-center gap-1.5">Open builder</span>
            </a>
          </div>
          {(pageId === "portfolio" || pageId === "links") && (
            <div className="px-6 py-4 border-b border-[var(--border)] flex flex-col gap-3">
              <p className="font-sans text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider">SEO</p>
              <input className={`${inputCls} w-full`} placeholder="Sofia Chen — Documentary Photographer" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} />
              <textarea className={`${inputCls} w-full resize-none`} rows={2} placeholder="Portfolio of Sofia Chen…" value={seoDesc} onChange={e => setSeoDesc(e.target.value)} />
              <div className="flex items-center justify-between">
                <p className="font-sans text-sm font-medium text-[var(--fg)]">Search indexing</p>
                <Toggle checked={seoIndex} onChange={setSeoIndex} ariaLabel="SEO indexing" />
              </div>
            </div>
          )}
          <div className="px-6 py-4">
            <p className="font-sans text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-3">Access</p>
            <div className="flex items-center justify-between">
              <p className="font-sans text-sm font-medium text-[var(--fg)]">Password protection</p>
              <Toggle checked={pwProtect} onChange={setPwProtect} ariaLabel="Password protection" />
            </div>
            {pwProtect && <input className={`${inputCls} w-full mt-3`} type="password" placeholder="Set a password…" />}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[var(--border)] flex justify-end gap-2 shrink-0">
          <button onClick={onClose} className="font-sans text-sm text-[var(--fg-muted)] border border-[var(--border)] px-4 py-2 rounded-lg hover:text-[var(--fg)] transition-colors">Cancel</button>
          <button onClick={onClose} className="font-sans text-sm font-semibold px-5 py-2 rounded-lg bg-yellow text-[#111] hover:bg-yellow/90 transition-colors">Save</button>
        </div>
      </div>
    </div>
  );
}

/* ── Page card ────────────────────────────────────────────────── */
function PageCard({ pageId, label, url, status: initialStatus, meta, icon, editHref, onManage }: {
  pageId: PageId; label: string; url: string; status: "live" | "draft";
  meta: string; icon: React.ReactNode; editHref: string; onManage: () => void;
}) {
  const [status, setStatus]           = useState<"live" | "draft">(initialStatus);
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewUrl = PAGE_PREVIEW_URLS[pageId];
  const metaChips  = meta.split(/\s*·\s*/).filter(Boolean);

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden flex flex-col sm:flex-row">
      <button
        onClick={() => setPreviewOpen(true)}
        className="shrink-0 sm:w-44 md:w-48 border-b sm:border-b-0 sm:border-r border-[var(--border)] bg-[var(--bg-subtle)] flex flex-col text-left group/thumb cursor-pointer relative"
        aria-label="Preview"
      >
        <div className="flex items-center gap-1 px-2 py-2 border-b border-[var(--border)] bg-[var(--bg-card)]">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-yellow/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
        </div>
        <div className="relative flex-1 w-full aspect-[16/9] sm:aspect-auto">
          <LivePreviewThumbnail url={previewUrl} baseWidth={1280} className="w-full h-full" />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover/thumb:bg-black/40 transition-colors duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
          </div>
        </div>
      </button>
      <div className="flex-1 min-w-0 flex flex-col p-4 sm:px-5 sm:py-4 gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)] shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-sans text-sm font-semibold text-[var(--fg)]">{label}</span>
              <button
                onClick={() => setStatus(s => s === "live" ? "draft" : "live")}
                className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border transition-colors ${
                  status === "live"
                    ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
                    : "bg-[var(--bg-subtle)] text-[var(--fg-muted)] border-[var(--border)] hover:border-yellow/40 hover:text-yellow"
                }`}
              >{status}</button>
            </div>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-1.5">
              {metaChips.map((chip, i) => (
                <span key={i} className="inline-flex items-center font-sans text-[11px] text-[var(--fg-muted)]">
                  {i > 0 && <span className="text-[var(--border)] mr-1.5">·</span>}
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[var(--bg-subtle)] border border-[var(--border)] rounded-lg px-3 py-2 min-w-0">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--fg-muted)] shrink-0"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          <span className="font-mono text-[11px] text-[var(--fg-muted)] truncate flex-1 min-w-0">{url}</span>
          <CopyButton value={`https://${url}`} className="border-0 bg-transparent px-1 py-0.5" />
        </div>
        <div className="flex items-center gap-2 mt-auto">
          <EditPageButton href={editHref} />
          <button onClick={onManage} className="ml-auto font-sans text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-lg bg-yellow text-[#111] hover:bg-yellow/90 transition-colors flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            Manage
          </button>
        </div>
      </div>
      <AnimatePresence>
        {previewOpen && (
          <DevicePreviewModal url={previewUrl} title={label} subtitle={url} onClose={() => setPreviewOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */

export default function DomainPage() {
  const [customDomain,  setCustomDomain]  = useState("");
  const [domainVerified, setDomainVerified] = useState(false);
  const [showAddPanel,  setShowAddPanel]  = useState(false);
  const [routeLinks,    setRouteLinks]    = useState("links");
  const [routeDelivery, setRouteDelivery] = useState("d");
  const [modalPage,     setModalPage]     = useState<PageId | null>(null);
  const [saved,         setSaved]         = useState(false);

  const activeDomain = customDomain && domainVerified ? customDomain : FREE_DOMAIN;

  function handleConnect(domain: string) {
    setCustomDomain(domain);
    setShowAddPanel(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

      {/* ── Header ── */}
      <div>
        <h1 className="font-sans font-black text-[var(--fg)] text-xl">Domain</h1>
        <p className="font-sans text-sm text-[var(--fg-muted)] mt-0.5">Manage the address where your site lives.</p>
      </div>

      {/* ── Domains ── */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">Your domains</h2>
          {!customDomain && !showAddPanel && (
            <button
              onClick={() => setShowAddPanel(true)}
              className="flex items-center gap-1.5 font-sans text-xs font-medium text-[var(--fg-muted)] border border-[var(--border)] px-3 py-1.5 rounded-lg hover:text-yellow hover:border-yellow transition-colors"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add custom domain
            </button>
          )}
        </div>

        {/* Free domain */}
        <FreeDomainRow isActive={!customDomain || !domainVerified} />

        {/* Custom domain */}
        {customDomain && (
          <CustomDomainRow
            domain={customDomain}
            verified={domainVerified}
            onRemove={() => { setCustomDomain(""); setDomainVerified(false); }}
          />
        )}

        {/* DNS setup banner — shown until verified */}
        <AnimatePresence>
          {customDomain && !domainVerified && (
            <SetupBanner domain={customDomain} onVerify={() => setDomainVerified(true)} />
          )}
        </AnimatePresence>

        {/* Add domain panel */}
        <AnimatePresence>
          {showAddPanel && !customDomain && (
            <AddDomainPanel onConnect={handleConnect} onClose={() => setShowAddPanel(false)} />
          )}
        </AnimatePresence>
      </section>

      {/* ── Page cards ── */}
      <section className="flex flex-col gap-3">
        <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">Your pages</h2>
        <PageCard
          pageId="portfolio" label="Portfolio" url={activeDomain} status="live"
          meta="Minimal BW · 8 sections · Last edited 2h ago" editHref="/editor/minimal-bw"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
          onManage={() => setModalPage("portfolio")}
        />
        <PageCard
          pageId="links" label="Links" url={`${activeDomain}/${routeLinks || "links"}`} status="live"
          meta="4 active links · Dark theme · 128 clicks this month" editHref="/dashboard/links"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>}
          onManage={() => setModalPage("links")}
        />
        <PageCard
          pageId="delivery" label="Delivery" url={`${activeDomain}/${routeDelivery || "d"}/client-name`} status="draft"
          meta="2 active galleries · Password protected · Full resolution" editHref="/dashboard/delivery"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>}
          onManage={() => setModalPage("delivery")}
        />
      </section>

      {/* ── Manage modal ── */}
      {modalPage && (
        <ManageModal
          pageId={modalPage}
          url={modalPage === "portfolio" ? activeDomain : modalPage === "links" ? `${activeDomain}/${routeLinks || "links"}` : `${activeDomain}/${routeDelivery || "d"}/client-name`}
          onClose={() => setModalPage(null)}
        />
      )}

      {/* ── URL routes ── */}
      <section>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-[var(--border)]">
            <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">URL routes</h2>
            <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5 break-all">
              Customize the path for each page under <span className="font-mono text-[var(--fg)]">{activeDomain}</span>
            </p>
          </div>
          <div className="divide-y divide-[var(--border)]">
            <RouteRow
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
              label="Portfolio" hint="Served at the root — cannot be changed."
              prefix={`${activeDomain}/`} slug="" locked
            />
            <RouteRow
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>}
              label="Links page" hint="Your Linktree-style page."
              prefix={`${activeDomain}/`} slug={routeLinks} onSlug={setRouteLinks}
            />
            <RouteRow
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>}
              label="Client deliveries" hint="Each gallery uses this prefix + the client slug."
              prefix={`${activeDomain}/`} slug={routeDelivery} onSlug={setRouteDelivery}
            />
          </div>
          <div className="px-4 sm:px-6 py-4 border-t border-[var(--border)] bg-[var(--bg-subtle)] flex flex-col gap-1.5">
            <p className="font-sans text-[11px] font-semibold text-[var(--fg-muted)] uppercase tracking-wider mb-0.5">Live URLs</p>
            {[
              { label: "Portfolio", path: "" },
              { label: "Links",     path: `/${routeLinks || "links"}` },
              { label: "Delivery",  path: `/${routeDelivery || "d"}/client-name` },
            ].map(({ label, path }) => (
              <div key={label} className="flex items-baseline gap-2 min-w-0">
                <span className="font-sans text-[11px] text-[var(--fg-muted)] w-16 shrink-0">{label}</span>
                <span className="font-mono text-[11px] text-[var(--fg)] truncate min-w-0">{activeDomain}{path}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Save ── */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`font-sans text-sm font-semibold px-5 py-2 rounded-lg transition-all ${
            saved ? "bg-green-500 text-white" : "bg-yellow text-[#111] hover:bg-yellow/90"
          }`}
        >
          {saved ? "Saved" : "Save changes"}
        </button>
      </div>

    </div>
  );
}
