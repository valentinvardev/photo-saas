"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolioContentStore } from "~/lib/portfolio/store";
import { contentSummary, type Visibility } from "~/lib/portfolio/data";
import { PhotoPickerModal } from "./PhotoPickerModal";

/* ── Visibility ─────────────────────────────────────────────── */

/* Binary on/off — "hidden" maps to off, anything else to on. Toggling
   off always sets "hidden"; toggling on always sets "public". */
const isVisible = (v: Visibility) => v !== "hidden";

function VisibilityToggle({ v, onChange }: { v: Visibility; onChange: (next: Visibility) => void }) {
  const on = isVisible(v);
  return (
    <button
      onClick={() => onChange(on ? "hidden" : "public")}
      role="switch"
      aria-checked={on}
      title={on ? "Visible — click to hide" : "Hidden — click to show"}
      className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-md hover:bg-[var(--bg-subtle)] transition-colors"
    >
      {on ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--fg)]">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--fg-muted)]">
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>
      )}
      {/* Switch */}
      <span
        className={`relative inline-block w-7 h-3.5 rounded-full transition-colors ${
          on ? "bg-yellow" : "bg-[var(--bg-subtle)] border border-[var(--fg-muted)]"
        }`}
      >
        <span
          className="absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all"
          style={{ left: on ? 14 : 2, background: on ? "#111" : "var(--fg)" }}
        />
      </span>
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

/* ── Reorderable photo grid (native HTML5 DnD + layout animations) ─
   framer-motion's Reorder is a 1D widget; for a wrapping grid we use
   native drag events. motion.div + layout prop animates items into
   their new positions when the underlying array changes. */

function PhotoGrid({ photoIds, photos, onReorder, onRemove, onAddClick }: {
  photoIds: string[];
  photos:   Record<string, { id: string; src: string; visibility: Visibility }>;
  onReorder: (newOrder: string[]) => void;
  onRemove:  (id: string) => void;
  onAddClick: () => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId,     setOverId]     = useState<string | null>(null);

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, id: string) {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
    /* Firefox needs a non-empty payload to start a drag */
    e.dataTransfer.setData("text/plain", id);
  }
  function handleDragOver(e: React.DragEvent<HTMLDivElement>, id: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== overId) setOverId(id);
  }
  function handleDragLeave(id: string) {
    if (id === overId) setOverId(null);
  }
  function handleDrop(e: React.DragEvent<HTMLDivElement>, targetId: string) {
    e.preventDefault();
    e.stopPropagation();
    const from = draggingId;
    cleanup();
    if (!from || from === targetId) return;
    const next     = [...photoIds];
    const fromIdx  = next.indexOf(from);
    const toIdx    = next.indexOf(targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    next.splice(fromIdx, 1);
    next.splice(toIdx, 0, from);
    onReorder(next);
  }
  function cleanup() {
    setDraggingId(null);
    setOverId(null);
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
      {photoIds.map((pid) => {
        const ph = photos[pid]; if (!ph) return null;
        const isDragging = pid === draggingId;
        const isOver     = pid === overId && overId !== draggingId;
        return (
          <motion.div
            key={pid}
            layout
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            draggable
            onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, pid)}
            onDragOver={(e) => handleDragOver(e as unknown as React.DragEvent<HTMLDivElement>, pid)}
            onDragLeave={() => handleDragLeave(pid)}
            onDrop={(e) => handleDrop(e as unknown as React.DragEvent<HTMLDivElement>, pid)}
            onDragEnd={cleanup}
            className={`relative aspect-square overflow-hidden rounded border cursor-grab active:cursor-grabbing transition-all ${
              isOver ? "border-yellow ring-2 ring-yellow/30 scale-105" : "border-[var(--border)]"
            }`}
            style={{
              opacity:   isDragging ? 0.3 : ph.visibility === "hidden" ? 0.35 : 1,
              transform: isOver ? undefined : "scale(1)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ph.src} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
            <button
              onClick={(e) => { e.stopPropagation(); if (confirm("Remove this photo?")) onRemove(pid); }}
              onMouseDown={(e) => e.stopPropagation()}
              className="absolute top-1 right-1 w-5 h-5 rounded bg-black/60 text-white opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              title="Remove photo"
              draggable={false}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </motion.div>
        );
      })}

      {/* Add tile */}
      <button
        onClick={onAddClick}
        className="aspect-square rounded border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:text-yellow hover:border-yellow hover:bg-yellow/5 transition-colors flex flex-col items-center justify-center gap-1"
        title="Add photo from gallery"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span className="font-mono text-[8px] uppercase tracking-widest">Add</span>
      </button>
    </div>
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

  /* Photo picker target — when set, opens picker and the chosen photos are
     added to this destination. Lives in tree state so a single picker
     instance handles every "Add" tile. */
  const [pickFor, setPickFor] = useState<{ categoryId?: string; folderId?: string } | null>(null);

  function onPickPhotos(urls: string[]) {
    if (!pickFor) return;
    for (const url of urls) {
      store.addPhoto(portfolioId, pickFor, url);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="font-sans font-bold text-[var(--fg)] text-base">Content</h2>
        <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5 uppercase tracking-widest">
          {summary.categories} categories · {summary.folders} folders · {summary.photos} photos
        </p>
      </div>

      {/* Inline "Create category" line — replaces the old + Category button */}
      <button
        onClick={() => store.addCategory(portfolioId, "New category")}
        className="group w-full flex items-center gap-3 py-3 px-4 rounded-xl border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:text-yellow hover:border-yellow hover:bg-yellow/5 transition-colors"
      >
        <span className="h-px flex-1 bg-[var(--border)] group-hover:bg-yellow/40 transition-colors" />
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest font-semibold">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create category
        </span>
        <span className="h-px flex-1 bg-[var(--border)] group-hover:bg-yellow/40 transition-colors" />
      </button>

      {/* Tree */}
      {content.categoryIds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] p-12 text-center text-[var(--fg-muted)]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-40"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
          <p className="font-sans text-sm font-semibold text-[var(--fg)] mb-1">No categories yet</p>
          <p className="font-sans text-xs">Use the line above to create your first category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {content.categoryIds.map((catId) => {
            const cat = content.categories[catId]!;
            const isOpen = expanded.has(catId);
            const photoCount = cat.directPhotoIds.length + cat.folderIds.reduce((sum, fid) => sum + (content.folders[fid]?.photoIds.length ?? 0), 0);

            return (
              <div key={catId} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
                {/* Category header — only visibility + delete; create child happens via inline tiles */}
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
                  <VisibilityToggle v={cat.visibility} onChange={(next) => store.setCategoryVis(portfolioId, catId, next)} />
                  <button
                    onClick={() => { if (confirm(`Delete category "${cat.name}" and all its content?`)) store.removeCategory(portfolioId, catId); }}
                    className="text-[var(--fg-muted)] hover:text-red-400 transition-colors w-7 h-7 flex items-center justify-center rounded hover:bg-[var(--bg-subtle)]"
                    title="Delete category"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-3 bg-[var(--bg-subtle)]/40">
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
                                <VisibilityToggle v={fol.visibility} onChange={(next) => store.setFolderVis(portfolioId, folId, next)} />
                                <button
                                  onClick={() => { if (confirm(`Delete folder "${fol.title}"?`)) store.removeFolder(portfolioId, folId); }}
                                  className="text-[var(--fg-muted)] hover:text-red-400 transition-colors w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--bg-subtle)]"
                                  title="Delete folder"
                                >
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                                </button>
                              </div>
                              <div className="px-3 pb-3">
                                <PhotoGrid
                                  photoIds={fol.photoIds}
                                  photos={content.photos}
                                  onReorder={(ids) => store.reorderFolderPhotos(portfolioId, folId, ids)}
                                  onRemove={(pid) => store.removePhoto(portfolioId, pid)}
                                  onAddClick={() => setPickFor({ folderId: folId })}
                                />
                              </div>
                            </div>
                          );
                        })}

                        {/* Inline "Create folder" tile — same dashed style as Add photo */}
                        <button
                          onClick={() => store.addFolder(portfolioId, catId, "New folder")}
                          className="group w-full flex items-center gap-3 py-3 px-4 rounded-lg border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:text-yellow hover:border-yellow hover:bg-yellow/5 transition-colors bg-[var(--bg-card)]"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
                          <span className="font-mono text-[10px] uppercase tracking-widest font-semibold">
                            Create folder
                          </span>
                          <span className="h-px flex-1 bg-[var(--border)] group-hover:bg-yellow/40 transition-colors" />
                        </button>

                        {/* Direct photos in category (always show grid so users can add) */}
                        <div className="rounded-lg border border-[var(--border)] p-3 bg-[var(--bg-card)]">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)]">
                              Direct photos · {cat.directPhotoIds.length}
                            </span>
                            <span className="text-[var(--fg-muted)] text-[10px]">·</span>
                            <span className="font-mono text-[9px] text-[var(--fg-muted)]">drag to reorder</span>
                          </div>
                          <PhotoGrid
                            photoIds={cat.directPhotoIds}
                            photos={content.photos}
                            onReorder={(ids) => store.reorderCategoryPhotos(portfolioId, catId, ids)}
                            onRemove={(pid) => store.removePhoto(portfolioId, pid)}
                            onAddClick={() => setPickFor({ categoryId: catId })}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Photo picker — shared instance for every Add tile */}
      <AnimatePresence>
        {pickFor && (
          <PhotoPickerModal
            multi
            onPick={onPickPhotos}
            onClose={() => setPickFor(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
