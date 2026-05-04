"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DevicePreviewModal, LivePreviewThumbnail } from "~/components/dashboard/DevicePreviewModal";
import { usePortfolioContentStore } from "~/lib/portfolio/store";
import { contentSummary, type Visibility } from "~/lib/portfolio/data";

/* ── Mock data ── */
const TEMPLATES = ["Brooklyn", "Minimal BW", "Petal"];

/* Map template name → live preview URL we ship */
const TEMPLATE_URL: Record<string, string> = {
  "Brooklyn":   "/template/brooklyn",
  "Minimal BW": "/templates/minimal-bw",
  "Petal":      "/templates/lumiere",
};

const MOCK_PORTFOLIOS = [
  {
    id: "1",
    name: "Sofia Chen Photography",
    slug: "sofia-chen",
    template: "Brooklyn",
    status: "published" as const,
    visits: 1284,
    uniqueVisitors: 832,
    pages: 6,
    updatedAt: "2 hours ago",
    publishedAt: "Jan 12, 2025",
    seed: 201,
    customDomain: "sofiachenphoto.com",
    seo: { title: "Sofia Chen — Fine Art Photography", description: "Award-winning fine art and wedding photographer based in San Francisco, CA." },
    passwordProtected: false,
    weeklyViews: [34, 52, 41, 67, 89, 72, 93],
  },
  {
    id: "2",
    name: "Urban Frames",
    slug: "urban-frames",
    template: "Minimal BW",
    status: "published" as const,
    visits: 438,
    uniqueVisitors: 291,
    pages: 4,
    updatedAt: "3 days ago",
    publishedAt: "Feb 3, 2025",
    seed: 202,
    customDomain: null,
    seo: { title: "Urban Frames — Street & Documentary", description: "Street photography and urban documentary work from around the world." },
    passwordProtected: false,
    weeklyViews: [12, 18, 9, 24, 31, 28, 21],
  },
  {
    id: "3",
    name: "Patagonia Series",
    slug: "patagonia-series",
    template: "Petal",
    status: "draft" as const,
    visits: 0,
    uniqueVisitors: 0,
    pages: 3,
    updatedAt: "1 week ago",
    publishedAt: null,
    seed: 203,
    customDomain: null,
    seo: { title: "Patagonia — A Visual Journey", description: "" },
    passwordProtected: true,
    weeklyViews: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "4",
    name: "Commercial Work",
    slug: "commercial-work",
    template: "Minimal BW",
    status: "published" as const,
    visits: 67,
    uniqueVisitors: 54,
    pages: 5,
    updatedAt: "5 days ago",
    publishedAt: "Mar 1, 2025",
    seed: 204,
    customDomain: null,
    seo: { title: "Commercial Photography — Sofia Chen", description: "Product and brand photography for leading companies." },
    passwordProtected: false,
    weeklyViews: [5, 8, 3, 11, 9, 7, 12],
  },
];

type Portfolio = typeof MOCK_PORTFOLIOS[0];

/* ── Mini sparkline ── */
function Sparkline({ data, color = "#fad502" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  const w = 80; const h = 28;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Portfolio card ── */
function PortfolioCard({ p, onOpen }: { p: Portfolio; onOpen: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="group border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden hover:border-[var(--fg-muted)] transition-all duration-200 cursor-pointer"
      onClick={onOpen}
    >
      {/* Cover — live render of the actual portfolio template */}
      <div className="relative h-32 overflow-hidden bg-[var(--bg-subtle)]">
        {TEMPLATE_URL[p.template] ? (
          <LivePreviewThumbnail
            url={TEMPLATE_URL[p.template]!}
            baseWidth={1280}
            className="w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={`https://picsum.photos/seed/${p.seed}/600/338?grayscale`} alt={p.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Status badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono backdrop-blur-sm ${
          p.status === "published" ? "bg-black/40 text-green-400" : "bg-black/40 text-[var(--fg-muted)] text-white/60"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${p.status === "published" ? "bg-green-400" : "bg-white/40"} animate-pulse`} />
          {p.status === "published" ? "Published" : "Draft"}
        </div>

        {/* Template badge */}
        <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm text-[10px] font-mono text-white/70">
          {p.template}
        </div>

        {/* Three-dot menu */}
        <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-9 w-40 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] shadow-lg overflow-hidden z-10"
              >
                {([
                  { label: "Edit website",  icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
                  { label: "View live",     icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> },
                  { label: p.status === "published" ? "Unpublish" : "Publish", icon: p.status === "published"
                    ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> },
                  { label: "Duplicate",     icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> },
                  { label: "Delete",        icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>, danger: true },
                ] as { label: string; icon: React.ReactNode; danger?: boolean }[]).map((action) => (
                  <button
                    key={action.label}
                    onClick={() => setMenuOpen(false)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-left font-sans text-xs transition-colors ${
                      action.danger
                        ? "text-red-400 hover:bg-red-500/10"
                        : "text-[var(--fg)] hover:bg-[var(--bg-subtle)]"
                    }`}
                  >
                    <span className="w-4 flex items-center justify-center shrink-0 opacity-60">{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-sans font-bold text-[var(--fg)] text-xs truncate">{p.name}</h3>
            <a
              href={`https://${p.customDomain ?? `${p.slug}.frame.co`}`}
              onClick={(e) => e.stopPropagation()}
              className="font-mono text-[10px] text-[var(--fg-muted)] hover:text-yellow transition-colors truncate block"
              target="_blank" rel="noopener noreferrer"
            >
              {p.customDomain ?? `${p.slug}.frame.co`}
            </a>
          </div>
          <Sparkline data={p.weeklyViews} />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] text-[var(--fg-muted)]">{p.visits.toLocaleString()} visits</span>
            <span className="font-mono text-[9px] text-[var(--fg-muted)]">{p.pages}p</span>
          </div>
          <div className="font-mono text-[9px] text-[var(--fg-muted)]">{p.updatedAt}</div>
        </div>
      </div>
    </div>
  );
}

/* ── Modal tabs ── */
type ModalTab = "overview" | "content" | "seo" | "analytics";

function ModalTabs({ active, onChange }: { active: ModalTab; onChange: (t: ModalTab) => void }) {
  const tabs: { id: ModalTab; label: string }[] = [
    { id: "overview",  label: "Overview" },
    { id: "content",   label: "Content"  },
    { id: "seo",       label: "SEO"      },
    { id: "analytics", label: "Analytics" },
  ];
  return (
    <div className="flex border-b border-[var(--border)]">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-4 py-3 font-sans text-sm font-medium border-b-2 transition-colors ${
            active === t.id
              ? "border-yellow text-[var(--fg)]"
              : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)]"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Content tab: Category → Folder → Photo tree ─────────────
   Lets the user manage the portfolio's content hierarchy without
   leaving the modal. Each level supports inline rename, visibility
   toggle, add child, and remove. */

const VIS_META: Record<Visibility, { label: string; dot: string; text: string }> = {
  public: { label: "Public",  dot: "bg-green-400",         text: "text-green-400"         },
  draft:  { label: "Draft",   dot: "bg-yellow",            text: "text-yellow"            },
  hidden: { label: "Hidden",  dot: "bg-[var(--fg-muted)]", text: "text-[var(--fg-muted)]" },
};
const VIS_CYCLE: Visibility[] = ["public", "draft", "hidden"];
const cycleVis = (v: Visibility) => VIS_CYCLE[(VIS_CYCLE.indexOf(v) + 1) % VIS_CYCLE.length]!;

function VisibilityChip({ v, onClick }: { v: Visibility; onClick?: () => void }) {
  const m = VIS_META[v];
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-widest bg-[var(--bg-subtle)] border border-[var(--border)] ${m.text} hover:border-[var(--fg-muted)] transition-colors`}
      title="Click to cycle visibility"
    >
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </button>
  );
}

/* Inline rename — stays a span until clicked, then becomes an input */
function EditableLabel({ value, onSave, className }: {
  value: string; onSave: (next: string) => void; className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value);
  useEffect(() => setDraft(value), [value]);

  function commit() {
    setEditing(false);
    if (draft.trim() && draft !== value) onSave(draft.trim());
  }

  if (editing) return (
    <input
      autoFocus
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setDraft(value); setEditing(false); } }}
      className={`bg-[var(--bg)] border border-yellow rounded px-1.5 py-0.5 outline-none ${className ?? ""}`}
    />
  );
  return (
    <button
      onClick={() => setEditing(true)}
      className={`text-left hover:underline decoration-dashed underline-offset-2 ${className ?? ""}`}
      title="Click to rename"
    >
      {value}
    </button>
  );
}

function ContentTab({ portfolioId }: { portfolioId: string }) {
  const store    = usePortfolioContentStore();
  const content  = store.getContent(portfolioId);
  const summary  = contentSummary(content);

  const [expanded, setExpanded] = useState<Set<string>>(new Set(content.categoryIds));
  const toggleExp = (id: string) =>
    setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-sans font-bold text-[var(--fg)] text-sm">Content</h3>
          <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">
            {summary.categories} categories · {summary.folders} folders · {summary.photos} photos
          </p>
        </div>
        <button
          onClick={() => store.addCategory(portfolioId, "New category")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold hover:bg-yellow/90 transition-colors"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Category
        </button>
      </div>

      {/* Tree */}
      {content.categoryIds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-[var(--fg-muted)]">
          <p className="font-sans text-sm font-semibold text-[var(--fg)] mb-1">No categories yet</p>
          <p className="font-sans text-xs">Add a category to start organizing your work.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {content.categoryIds.map((catId) => {
            const cat = content.categories[catId]!;
            const isOpen = expanded.has(catId);
            const photoCount = cat.directPhotoIds.length + cat.folderIds.reduce((sum, fid) => sum + (content.folders[fid]?.photoIds.length ?? 0), 0);

            return (
              <div key={catId} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                {/* Category header */}
                <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[var(--border)]">
                  <button onClick={() => toggleExp(catId)} className="w-5 h-5 flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform: `rotate(${isOpen ? 90 : 0}deg)`, transition: "transform 0.15s" }}>
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--fg-muted)] shrink-0"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                  <EditableLabel
                    value={cat.name}
                    onSave={(n) => store.renameCategory(portfolioId, catId, n)}
                    className="font-sans text-sm font-semibold text-[var(--fg)] flex-1 min-w-0"
                  />
                  <span className="font-mono text-[9px] text-[var(--fg-muted)] shrink-0">
                    {cat.folderIds.length}f · {photoCount}p
                  </span>
                  <VisibilityChip v={cat.visibility} onClick={() => store.setCategoryVis(portfolioId, catId, cycleVis(cat.visibility))} />
                  <button
                    onClick={() => store.addFolder(portfolioId, catId, "New folder")}
                    className="text-[var(--fg-muted)] hover:text-yellow transition-colors w-6 h-6 flex items-center justify-center"
                    title="Add folder"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
                  </button>
                  <button
                    onClick={() => { if (confirm(`Delete category "${cat.name}" and all its content?`)) store.removeCategory(portfolioId, catId); }}
                    className="text-[var(--fg-muted)] hover:text-red-400 transition-colors w-6 h-6 flex items-center justify-center"
                    title="Delete category"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                  </button>
                </div>

                {/* Children */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 space-y-2 bg-[var(--bg-subtle)]/40">
                        {/* Folders */}
                        {cat.folderIds.map((folId) => {
                          const fol = content.folders[folId]; if (!fol) return null;
                          return (
                            <div key={folId} className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)]">
                              <div className="flex items-center gap-2 px-3 py-2">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--fg-muted)] shrink-0"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                                <EditableLabel
                                  value={fol.title}
                                  onSave={(n) => store.renameFolder(portfolioId, folId, n)}
                                  className="font-sans text-xs font-medium text-[var(--fg)] flex-1 min-w-0"
                                />
                                <span className="font-mono text-[9px] text-[var(--fg-muted)] shrink-0">{fol.photoIds.length}p</span>
                                <VisibilityChip v={fol.visibility} onClick={() => store.setFolderVis(portfolioId, folId, cycleVis(fol.visibility))} />
                                <button
                                  onClick={() => {
                                    const seed = Math.floor(Math.random() * 9000) + 1000;
                                    store.addPhoto(portfolioId, { folderId: folId }, `https://picsum.photos/seed/${seed}/600/800`);
                                  }}
                                  className="text-[var(--fg-muted)] hover:text-yellow transition-colors w-5 h-5 flex items-center justify-center"
                                  title="Add photo"
                                >
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                </button>
                                <button
                                  onClick={() => { if (confirm(`Delete folder "${fol.title}"?`)) store.removeFolder(portfolioId, folId); }}
                                  className="text-[var(--fg-muted)] hover:text-red-400 transition-colors w-5 h-5 flex items-center justify-center"
                                  title="Delete folder"
                                >
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                                </button>
                              </div>
                              {fol.photoIds.length > 0 && (
                                <div className="grid grid-cols-6 gap-1 px-3 pb-3">
                                  {fol.photoIds.map((pid) => {
                                    const ph = content.photos[pid]; if (!ph) return null;
                                    return (
                                      <button
                                        key={pid}
                                        onClick={() => { if (confirm("Remove this photo?")) store.removePhoto(portfolioId, pid); }}
                                        className="relative aspect-square overflow-hidden rounded border border-[var(--border)] group"
                                        style={{ opacity: ph.visibility === "hidden" ? 0.35 : 1 }}
                                      >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={ph.src} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/40 transition-colors flex items-center justify-center">
                                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="opacity-0 group-hover:opacity-100"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Direct photos in category (no folder) */}
                        {cat.directPhotoIds.length > 0 && (
                          <div className="rounded-lg border border-dashed border-[var(--border)] p-3 bg-[var(--bg-card)]">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)]">No folder · {cat.directPhotoIds.length} photos</span>
                            </div>
                            <div className="grid grid-cols-6 gap-1">
                              {cat.directPhotoIds.map((pid) => {
                                const ph = content.photos[pid]; if (!ph) return null;
                                return (
                                  <button
                                    key={pid}
                                    onClick={() => { if (confirm("Remove this photo?")) store.removePhoto(portfolioId, pid); }}
                                    className="relative aspect-square overflow-hidden rounded border border-[var(--border)] group"
                                    style={{ opacity: ph.visibility === "hidden" ? 0.35 : 1 }}
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={ph.src} alt="" className="w-full h-full object-cover" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Quick-add photo to category */}
                        <button
                          onClick={() => {
                            const seed = Math.floor(Math.random() * 9000) + 1000;
                            store.addPhoto(portfolioId, { categoryId: catId }, `https://picsum.photos/seed/${seed}/600/800`);
                          }}
                          className="w-full py-2 rounded-lg border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors font-sans text-xs flex items-center justify-center gap-1.5"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          Add photo to "{cat.name}"
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Portfolio detail modal ── */
function PortfolioModal({ p, onClose }: { p: Portfolio; onClose: () => void }) {
  const [tab, setTab]                 = useState<ModalTab>("overview");
  const [published, setPublished]     = useState(p.status === "published");
  const [copied, setCopied]           = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const url        = p.customDomain ?? `${p.slug}.frame.co`;
  const previewUrl = TEMPLATE_URL[p.template];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  const copyUrl = () => {
    void navigator.clipboard.writeText(`https://${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 w-full max-w-xl h-full bg-[var(--bg)] border-l border-[var(--border)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover banner */}
        <div className="relative h-40 shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://picsum.photos/seed/${p.seed}/800/320?grayscale`} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
          <div className="absolute bottom-4 left-4 right-12">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono ${published ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/50"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${published ? "bg-green-400" : "bg-white/40"}`} />
                {published ? "Published" : "Draft"}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-[10px] font-mono">{p.template}</span>
            </div>
            <h2 className="font-sans font-black text-white text-lg truncate">{p.name}</h2>
          </div>
        </div>

        {/* URL bar */}
        <div className="px-5 py-3 border-b border-[var(--border)] flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] min-w-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--fg-muted)] shrink-0"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
            <span className="font-mono text-xs text-[var(--fg)] truncate">{url}</span>
          </div>
          <button onClick={copyUrl} className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-xs font-sans font-medium text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
            {copied ? (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg><span className="text-green-400">Copied!</span></>
            ) : (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>Copy</>
            )}
          </button>
          <button
            onClick={() => previewUrl && setPreviewOpen(true)}
            disabled={!previewUrl}
            title={previewUrl ? "Preview live site" : "No preview available"}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] disabled:opacity-40 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>

        {/* Tabs */}
        <ModalTabs active={tab} onChange={setTab} />

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {tab === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-5 space-y-5">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Total visits", value: p.visits.toLocaleString() },
                    { label: "Unique visitors", value: p.uniqueVisitors.toLocaleString() },
                    { label: "Pages", value: String(p.pages) },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-3">
                      <div className="font-mono text-[10px] text-[var(--fg-muted)] mb-1">{stat.label}</div>
                      <div className="font-sans font-black text-xl text-[var(--fg)]">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Details */}
                <div className="rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
                  {[
                    { label: "Template", value: p.template, action: "Change" },
                    { label: "Custom domain", value: p.customDomain ?? `${p.slug}.frame.co`, action: p.customDomain ? "Manage" : "Connect" },
                    { label: "Published", value: p.publishedAt ?? "Not published" },
                    { label: "Last updated", value: p.updatedAt },
                    { label: "Password protection", value: p.passwordProtected ? "Enabled" : "Off", action: "Toggle" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between px-4 py-3">
                      <span className="font-mono text-xs text-[var(--fg-muted)]">{row.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-sm text-[var(--fg)]">{row.value}</span>
                        {row.action && (
                          <button className="font-mono text-[11px] text-yellow hover:underline">{row.action}</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === "content" && (
              <motion.div key="content" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <ContentTab portfolioId={p.id} />
              </motion.div>
            )}

            {tab === "seo" && (
              <motion.div key="seo" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-5 space-y-4">
                <div>
                  <label className="block font-mono text-[11px] text-[var(--fg-muted)] uppercase tracking-widest mb-1.5">Meta title</label>
                  <input
                    defaultValue={p.seo.title}
                    className="w-full rounded-xl px-4 py-3 font-sans text-sm text-[var(--fg)] bg-[var(--bg-card)] border border-[var(--border)] focus:outline-none focus:border-yellow transition-colors"
                  />
                  <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-1">{p.seo.title.length}/60 characters</p>
                </div>
                <div>
                  <label className="block font-mono text-[11px] text-[var(--fg-muted)] uppercase tracking-widest mb-1.5">Meta description</label>
                  <textarea
                    defaultValue={p.seo.description}
                    rows={3}
                    className="w-full rounded-xl px-4 py-3 font-sans text-sm text-[var(--fg)] bg-[var(--bg-card)] border border-[var(--border)] focus:outline-none focus:border-yellow transition-colors resize-none"
                  />
                  <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-1">{p.seo.description.length}/160 characters</p>
                </div>

                {/* Search preview */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
                  <p className="font-mono text-[10px] text-[var(--fg-muted)] mb-3 uppercase tracking-widest">Search preview</p>
                  <div className="font-sans text-base text-blue-400 hover:underline cursor-default truncate">{p.seo.title || p.name}</div>
                  <div className="font-mono text-[11px] text-green-600 truncate">https://{url}</div>
                  <div className="font-sans text-xs text-[var(--fg-muted)] mt-1 line-clamp-2">{p.seo.description || "No description set."}</div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] text-[var(--fg-muted)] uppercase tracking-widest mb-1.5">OG Image</label>
                  <div className="rounded-xl border-2 border-dashed border-[var(--border)] h-32 flex flex-col items-center justify-center gap-2 text-[var(--fg-muted)] hover:border-yellow hover:text-yellow transition-colors cursor-pointer">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                    <span className="font-mono text-xs">Upload OG image (1200×630)</span>
                  </div>
                </div>

                <button className="btn-primary w-full rounded-xl py-3 font-sans font-bold text-sm">Save SEO settings</button>
              </motion.div>
            )}

            {tab === "analytics" && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-5 space-y-5">
                {/* Weekly chart */}
                <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-sans font-semibold text-sm text-[var(--fg)]">Page views</span>
                    <span className="font-mono text-xs text-[var(--fg-muted)]">Last 7 days</span>
                  </div>
                  {/* Full-width sparkline chart */}
                  {(() => {
                    const data = p.weeklyViews;
                    const max = Math.max(...data, 1);
                    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                    const w = 400; const h = 80;
                    const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`).join(" ");
                    const fillPts = `0,${h} ${pts} ${w},${h}`;
                    return (
                      <div>
                        <svg width="100%" viewBox={`0 0 ${w} ${h + 4}`} className="overflow-visible">
                          <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#fad502" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#fad502" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <polygon points={fillPts} fill="url(#chartGrad)" />
                          <polyline points={pts} fill="none" stroke="#fad502" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          {data.map((v, i) => (
                            <circle key={i} cx={(i / (data.length - 1)) * w} cy={h - (v / max) * h} r="3" fill="#fad502" />
                          ))}
                        </svg>
                        <div className="flex justify-between mt-1">
                          {days.map((d) => <span key={d} className="font-mono text-[9px] text-[var(--fg-muted)]">{d}</span>)}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Top pages */}
                <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
                    <span className="font-sans font-semibold text-sm text-[var(--fg)]">Top pages</span>
                  </div>
                  {[
                    { page: "Home", views: Math.round(p.visits * 0.45) },
                    { page: "Portfolio", views: Math.round(p.visits * 0.28) },
                    { page: "About", views: Math.round(p.visits * 0.14) },
                    { page: "Contact", views: Math.round(p.visits * 0.08) },
                    { page: "Shop", views: Math.round(p.visits * 0.05) },
                  ].map((row) => (
                    <div key={row.page} className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0">
                      <span className="font-sans text-sm text-[var(--fg)] flex-1">/{row.page.toLowerCase()}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 rounded-full bg-[var(--bg-subtle)] overflow-hidden">
                          <div className="h-full rounded-full bg-yellow" style={{ width: `${(row.views / p.visits) * 100}%` }} />
                        </div>
                        <span className="font-mono text-xs text-[var(--fg-muted)] w-12 text-right">{row.views}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Referrers */}
                <div className="rounded-xl border border-[var(--border)] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
                    <span className="font-sans font-semibold text-sm text-[var(--fg)]">Top referrers</span>
                  </div>
                  {[
                    { source: "Direct", pct: 42 },
                    { source: "Instagram", pct: 31 },
                    { source: "Google", pct: 18 },
                    { source: "Twitter / X", pct: 9 },
                  ].map((row) => (
                    <div key={row.source} className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] last:border-0">
                      <span className="font-sans text-sm text-[var(--fg)] flex-1">{row.source}</span>
                      <span className="font-mono text-xs text-[var(--fg-muted)]">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action footer */}
        <div className="shrink-0 px-5 py-4 border-t border-[var(--border)] bg-[var(--bg-card)] flex items-center gap-2 flex-wrap">
          <button className="btn-primary flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-sans font-bold text-sm">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            Edit website
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm font-sans font-medium text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
            Change template
          </button>
          <button
            onClick={() => setPublished((v) => !v)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-sm font-sans font-medium transition-colors ${
              published
                ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                : "border-green-500/30 text-green-400 hover:bg-green-500/10"
            }`}
          >
            {published ? "Unpublish" : "Publish"}
          </button>
          <button className="ml-auto text-sm font-sans text-red-400 hover:text-red-300 transition-colors px-2">
            Delete
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {previewOpen && previewUrl && (
          <DevicePreviewModal
            url={previewUrl}
            title={p.name}
            subtitle={url}
            onClose={() => setPreviewOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── New portfolio modal ── */
function NewPortfolioModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [template, setTemplate] = useState(TEMPLATES[0]!);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-md rounded-2xl bg-[var(--bg)] border border-[var(--border)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-sans font-black text-[var(--fg)] text-lg">New portfolio</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="block font-mono text-[11px] text-[var(--fg-muted)] uppercase tracking-widest mb-1.5">Portfolio name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Photography"
              className="w-full rounded-xl px-4 py-3 font-sans text-sm text-[var(--fg)] bg-[var(--bg-card)] border border-[var(--border)] focus:outline-none focus:border-yellow transition-colors"
            />
            {name && (
              <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-1">
                URL: {name.toLowerCase().replace(/\s+/g, "-")}.frame.co
              </p>
            )}
          </div>
          <div>
            <label className="block font-mono text-[11px] text-[var(--fg-muted)] uppercase tracking-widest mb-2">Choose template</label>
            <div className="grid grid-cols-3 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`rounded-xl p-3 border-2 text-center transition-all ${
                    template === t ? "border-yellow bg-yellow/10" : "border-[var(--border)] hover:border-[var(--fg-muted)]"
                  }`}
                >
                  <div className="w-full aspect-video rounded-lg mb-2 bg-[var(--bg-subtle)]" />
                  <span className={`font-mono text-[11px] ${template === t ? "text-yellow" : "text-[var(--fg-muted)]"}`}>{t}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[var(--border)] flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-[var(--border)] font-sans text-sm font-medium text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">Cancel</button>
          <button
            disabled={!name.trim()}
            className="btn-primary px-5 py-2 rounded-xl font-sans font-bold text-sm disabled:opacity-40"
          >
            Create portfolio
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const selectedPortfolio = MOCK_PORTFOLIOS.find((p) => p.id === selectedId) ?? null;
  const published = MOCK_PORTFOLIOS.filter((p) => p.status === "published").length;
  const drafts    = MOCK_PORTFOLIOS.filter((p) => p.status === "draft").length;

  return (
    <div className="p-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-sans font-black text-[var(--fg)] text-xl">Portfolio</h1>
          <p className="font-mono text-xs text-[var(--fg-muted)] mt-0.5">
            <span className="text-green-400">{published} published</span>
            {drafts > 0 && <> · <span>{drafts} draft{drafts > 1 ? "s" : ""}</span></>}
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="btn-primary flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-sans font-bold text-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New portfolio
        </button>
      </div>

      {/* ── Grid ── */}
      {MOCK_PORTFOLIOS.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center mb-4 text-[var(--fg-muted)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
          </div>
          <p className="font-sans font-semibold text-[var(--fg)] mb-1">No portfolios yet</p>
          <p className="font-serif text-sm text-[var(--fg-muted)] mb-5">Create your first portfolio website</p>
          <button onClick={() => setShowNewModal(true)} className="btn-primary px-5 py-2.5 rounded-xl font-sans font-bold text-sm">
            Create portfolio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {MOCK_PORTFOLIOS.map((p) => (
            <PortfolioCard key={p.id} p={p} onOpen={() => setSelectedId(p.id)} />
          ))}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {selectedPortfolio && (
          <PortfolioModal p={selectedPortfolio} onClose={() => setSelectedId(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showNewModal && <NewPortfolioModal onClose={() => setShowNewModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
