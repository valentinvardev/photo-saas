"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolioContentStore } from "~/lib/portfolio/store";
import { contentSummary, type Visibility } from "~/lib/portfolio/data";

/* ── Visibility ─────────────────────────────────────────────── */

const VIS_META: Record<Visibility, { label: string; dot: string; text: string }> = {
  public: { label: "Public", dot: "bg-green-400",         text: "text-green-400"         },
  draft:  { label: "Draft",  dot: "bg-yellow",            text: "text-yellow"            },
  hidden: { label: "Hidden", dot: "bg-[var(--fg-muted)]", text: "text-[var(--fg-muted)]" },
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

/* ── Inline rename ──────────────────────────────────────────── */

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

/* ── Main tree ──────────────────────────────────────────────── */

export function ContentTree({ portfolioId }: { portfolioId: string }) {
  const store    = usePortfolioContentStore();
  const content  = store.getContent(portfolioId);
  const summary  = contentSummary(content);

  const [expanded, setExpanded] = useState<Set<string>>(new Set(content.categoryIds));
  const toggleExp = (id: string) =>
    setExpanded((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-sans font-bold text-[var(--fg)] text-base">Content</h2>
          <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5 uppercase tracking-widest">
            {summary.categories} categories · {summary.folders} folders · {summary.photos} photos
          </p>
        </div>
        <button
          onClick={() => store.addCategory(portfolioId, "New category")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold hover:bg-yellow/90 transition-colors"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Category
        </button>
      </div>

      {/* Tree */}
      {content.categoryIds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] p-12 text-center text-[var(--fg-muted)]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-40"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
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
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)]">
                  <button onClick={() => toggleExp(catId)} className="w-5 h-5 flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform: `rotate(${isOpen ? 90 : 0}deg)`, transition: "transform 0.15s" }}>
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--fg-muted)] shrink-0"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
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
                    className="text-[var(--fg-muted)] hover:text-yellow transition-colors w-7 h-7 flex items-center justify-center rounded hover:bg-[var(--bg-subtle)]"
                    title="Add folder"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
                  </button>
                  <button
                    onClick={() => { if (confirm(`Delete category "${cat.name}" and all its content?`)) store.removeCategory(portfolioId, catId); }}
                    className="text-[var(--fg-muted)] hover:text-red-400 transition-colors w-7 h-7 flex items-center justify-center rounded hover:bg-[var(--bg-subtle)]"
                    title="Delete category"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
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
                      <div className="p-4 space-y-2 bg-[var(--bg-subtle)]/40">
                        {/* Folders */}
                        {cat.folderIds.map((folId) => {
                          const fol = content.folders[folId]; if (!fol) return null;
                          return (
                            <div key={folId} className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)]">
                              <div className="flex items-center gap-2 px-3 py-2.5">
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
                                  className="text-[var(--fg-muted)] hover:text-yellow transition-colors w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--bg-subtle)]"
                                  title="Add photo"
                                >
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                </button>
                                <button
                                  onClick={() => { if (confirm(`Delete folder "${fol.title}"?`)) store.removeFolder(portfolioId, folId); }}
                                  className="text-[var(--fg-muted)] hover:text-red-400 transition-colors w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--bg-subtle)]"
                                  title="Delete folder"
                                >
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                                </button>
                              </div>
                              {fol.photoIds.length > 0 && (
                                <div className="grid grid-cols-8 gap-1.5 px-3 pb-3">
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
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" className="opacity-0 group-hover:opacity-100"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
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
                            <div className="grid grid-cols-8 gap-1.5">
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
                          className="w-full py-2.5 rounded-lg border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors font-sans text-xs flex items-center justify-center gap-1.5"
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
