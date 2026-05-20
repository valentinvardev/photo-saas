"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePortfolioContentStore } from "~/lib/portfolio/store";
import { contentSummary, type Visibility } from "~/lib/portfolio/data";
import { PhotoPickerModal } from "./PhotoPickerModal";
import { Toggle } from "~/components/ui/Toggle";

/* ── Visibility toggle ────────────────────────────────────────── */
const isVisible = (v: Visibility) => v !== "hidden";

function VisibilityToggle({ v, onChange }: { v: Visibility; onChange: (next: Visibility) => void }) {
  return (
    <Toggle
      checked={isVisible(v)}
      onChange={(on) => onChange(on ? "public" : "hidden")}
      ariaLabel="Toggle visibility"
    />
  );
}

/* ── Inline rename ──────────────────────────────────────────────*/
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
      autoFocus value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") { setDraft(value); setEditing(false); }
      }}
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

/* ── Photo grid with pointer-based drag-and-drop ─────────────────
   Pointer events work on both mouse and touch without the ghost-image
   issues of HTML5 DnD. The dragged tile follows the cursor as a
   floating clone; all other tiles stay in place. An insertion gap
   appears at the computed drop position — no layout animations. */

function PhotoGrid({ photoIds, photos, onReorder, onRemove, onAddClick }: {
  photoIds:   string[];
  photos:     Record<string, { id: string; src: string; visibility: Visibility }>;
  onReorder:  (newOrder: string[]) => void;
  onRemove:   (id: string) => void;
  onAddClick: () => void;
}) {
  const gridRef    = useRef<HTMLDivElement>(null);
  const dragData   = useRef<{
    id:       string;
    fromIdx:  number;
    startX:   number;
    startY:   number;
    cellW:    number;
    cellH:    number;
    cols:     number;
  } | null>(null);

  const [dragId,  setDragId]  = useState<string | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [ghostPos, setGhostPos] = useState({ x: 0, y: 0 });

  /* Compute which grid index the pointer is hovering over */
  function pointerToIndex(clientX: number, clientY: number): number | null {
    const grid = gridRef.current;
    if (!grid || !dragData.current) return null;
    const rect = grid.getBoundingClientRect();
    const { cellW, cellH, cols } = dragData.current;
    const gx = clientX - rect.left;
    const gy = clientY - rect.top;
    const col = Math.max(0, Math.min(cols - 1, Math.floor(gx / cellW)));
    const row = Math.max(0, Math.floor(gy / cellH));
    const idx = row * cols + col;
    return Math.min(idx, photoIds.length - 1);
  }

  const onPointerDown = useCallback((e: React.PointerEvent, id: string, fromIdx: number) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const grid = gridRef.current;
    if (!grid) return;
    const firstCell = grid.children[0] as HTMLElement | undefined;
    if (!firstCell) return;
    const fr = firstCell.getBoundingClientRect();
    const gap = 6; // gap-1.5 = 6px
    const cellW = fr.width + gap;
    const cellH = fr.height + gap;

    /* Compute cols from grid container width */
    const gridWidth = grid.getBoundingClientRect().width;
    const cols = Math.round(gridWidth / cellW);

    dragData.current = { id, fromIdx, startX: e.clientX, startY: e.clientY, cellW, cellH, cols };
    setDragId(id);
    setGhostPos({ x: e.clientX, y: e.clientY });
    setOverIdx(fromIdx);
  }, [photoIds]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragData.current) return;
    setGhostPos({ x: e.clientX, y: e.clientY });
    const idx = pointerToIndex(e.clientX, e.clientY);
    if (idx !== null) setOverIdx(idx);
  }, [photoIds]);

  const onPointerUp = useCallback(() => {
    const d = dragData.current;
    if (!d) return;
    const from = d.fromIdx;
    const to   = overIdx ?? from;
    dragData.current = null;
    setDragId(null);
    setOverIdx(null);

    if (from === to) return;
    const next = [...photoIds];
    next.splice(from, 1);
    next.splice(to, 0, d.id);
    onReorder(next);
  }, [photoIds, overIdx, onReorder]);

  /* Build rendered order with gap inserted at drop position */
  const rendered = photoIds.map((pid, idx) => ({ pid, idx }));

  return (
    <div className="relative">
      {/* Ghost — follows pointer */}
      {dragId && (() => {
        const ph = photos[dragId];
        if (!ph) return null;
        const firstCell = gridRef.current?.children[0] as HTMLElement | undefined;
        const size = firstCell ? firstCell.getBoundingClientRect().width : 60;
        return (
          <div
            className="fixed pointer-events-none z-50 rounded overflow-hidden shadow-2xl ring-2 ring-yellow/60"
            style={{
              width: size, height: size,
              left: ghostPos.x - size / 2,
              top:  ghostPos.y - size / 2,
              transform: "rotate(2deg) scale(1.05)",
              transition: "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ph.src} alt="" className="w-full h-full object-cover" draggable={false} />
          </div>
        );
      })()}

      <div
        ref={gridRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8"
        style={{ gap: 6 }}
      >
        {rendered.map(({ pid, idx }) => {
          const ph = photos[pid]; if (!ph) return null;
          const isDragging = pid === dragId;
          const isGap      = overIdx !== null && idx === overIdx && !isDragging;

          return (
            <div key={pid} className="relative" style={{ display: "contents" }}>
              {/* Insertion gap BEFORE */}
              {isGap && overIdx !== null && overIdx < (dragData.current?.fromIdx ?? 0) && (
                <div className="aspect-square rounded border-2 border-dashed border-yellow bg-yellow/5" />
              )}

              <div
                className={`relative aspect-square overflow-hidden rounded border cursor-grab active:cursor-grabbing select-none ${
                  isDragging ? "opacity-20 border-yellow/40" : "border-[var(--border)]"
                } ${ph.visibility === "hidden" ? "opacity-40" : ""}`}
                onPointerDown={(e) => onPointerDown(e, pid, idx)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ph.src} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
                {/* Remove button */}
                <button
                  onClick={(e) => { e.stopPropagation(); if (confirm("Remove this photo?")) onRemove(pid); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 w-5 h-5 rounded bg-black/60 text-white opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                  title="Remove"
                  draggable={false}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>

              {/* Insertion gap AFTER */}
              {isGap && overIdx !== null && overIdx >= (dragData.current?.fromIdx ?? 0) && (
                <div className="aspect-square rounded border-2 border-dashed border-yellow bg-yellow/5" />
              )}
            </div>
          );
        })}

        {/* Add tile */}
        <button
          onClick={onAddClick}
          className="aspect-square rounded border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:text-yellow hover:border-yellow hover:bg-yellow/5 transition-colors flex flex-col items-center justify-center gap-1"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span className="font-mono text-[8px] uppercase tracking-widest">Add</span>
        </button>
      </div>
    </div>
  );
}

/* ── Main content tree — folders only, no categories ─────────────
   Categories still exist in the store (for backwards compatibility)
   but the UI collapses them. All folders appear at the top level.
   New folders go into the first existing category, or a "main"
   category is auto-created if none exists. ────────────────────── */

export function ContentTree({ portfolioId }: { portfolioId: string }) {
  const store   = usePortfolioContentStore();
  const content = store.getContent(portfolioId);
  const summary = contentSummary(content);

  const [pickFor, setPickFor] = useState<{ folderId: string } | null>(null);

  /* Collect all folder IDs in display order (from all categories) */
  const allFolderIds = content.categoryIds.flatMap(
    (catId) => content.categories[catId]?.folderIds ?? [],
  );

  /* Ensure a default category exists before creating a folder */
  function ensureDefaultCat(): string {
    if (content.categoryIds.length > 0) return content.categoryIds[0]!;
    return store.addCategory(portfolioId, "main");
  }

  function addFolder() {
    const catId = ensureDefaultCat();
    store.addFolder(portfolioId, catId, "New folder");
  }

  function onPickPhotos(urls: string[]) {
    if (!pickFor) return;
    for (const url of urls) {
      store.addPhoto(portfolioId, { folderId: pickFor.folderId }, url);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans font-bold text-[var(--fg)] text-base">Content</h2>
          <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5 uppercase tracking-widest">
            {summary.folders} folder{summary.folders !== 1 ? "s" : ""} · {summary.photos} photo{summary.photos !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={addFolder}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)] hover:text-yellow hover:border-yellow transition-colors"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New folder
        </button>
      </div>

      {/* Folder list */}
      {allFolderIds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] p-12 text-center text-[var(--fg-muted)]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-40" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
          <p className="font-sans text-sm font-semibold text-[var(--fg)] mb-1">No folders yet</p>
          <p className="font-sans text-xs">Click "New folder" to create your first one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {allFolderIds.map((folId) => {
              const fol = content.folders[folId];
              if (!fol) return null;
              return (
                <motion.div
                  key={folId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden"
                >
                  {/* Folder header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="text-[var(--fg-muted)] shrink-0"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                    <EditableLabel
                      value={fol.title}
                      onSave={(n) => store.renameFolder(portfolioId, folId, n)}
                      className="font-sans text-sm font-semibold text-[var(--fg)] flex-1 min-w-0"
                    />
                    <span className="font-mono text-[9px] text-[var(--fg-muted)] shrink-0">{fol.photoIds.length} photo{fol.photoIds.length !== 1 ? "s" : ""}</span>
                    <VisibilityToggle v={fol.visibility} onChange={(next) => store.setFolderVis(portfolioId, folId, next)} />
                    <button
                      onClick={() => { if (confirm(`Delete folder "${fol.title}"?`)) store.removeFolder(portfolioId, folId); }}
                      className="text-[var(--fg-muted)] hover:text-red-400 transition-colors w-6 h-6 flex items-center justify-center rounded hover:bg-[var(--bg-subtle)]"
                      title="Delete folder"
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                    </button>
                  </div>

                  {/* Photo grid */}
                  <div className="p-3">
                    <PhotoGrid
                      photoIds={fol.photoIds}
                      photos={content.photos}
                      onReorder={(ids) => store.reorderFolderPhotos(portfolioId, folId, ids)}
                      onRemove={(pid) => store.removePhoto(portfolioId, pid)}
                      onAddClick={() => setPickFor({ folderId: folId })}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Photo picker */}
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
