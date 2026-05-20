"use client";

import { useState, useRef, useEffect } from "react";
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

/* ── Photo grid — pointer-based drag-and-drop ────────────────────
   Strategy: track dragId + dropIdx. liveOrder is derived inline —
   photoIds with dragId removed, then reinserted at dropIdx.
   Each tile fires onPointerEnter to update dropIdx. No geometry
   math, no gap tiles. The dragged item stays visible at reduced
   opacity to show where it will land. Works on mouse and touch. */

function PhotoGrid({ photoIds, photos, onReorder, onRemove, onAddClick }: {
  photoIds:   string[];
  photos:     Record<string, { id: string; src: string; visibility: Visibility }>;
  onReorder:  (newOrder: string[]) => void;
  onRemove:   (id: string) => void;
  onAddClick: () => void;
}) {
  const [dragId,   setDragId]   = useState<string | null>(null);
  const [dropIdx,  setDropIdx]  = useState(0);
  const [ghostPos, setGhostPos] = useState({ x: 0, y: 0 });
  const ghostSrc  = useRef("");
  const ghostSize = useRef(60);

  const isDragging = dragId !== null;

  /* filtered = photoIds without the dragged item */
  const filteredIds = isDragging ? photoIds.filter(id => id !== dragId) : photoIds;

  /* liveOrder = filtered with dragged item reinserted at dropIdx */
  const liveOrder: string[] = isDragging
    ? [...filteredIds.slice(0, dropIdx), dragId, ...filteredIds.slice(dropIdx)]
    : photoIds;

  function handlePointerDown(e: React.PointerEvent, pid: string) {
    if (isDragging) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const ph = photos[pid];
    if (ph) ghostSrc.current = ph.src;
    ghostSize.current = (e.currentTarget as HTMLElement).getBoundingClientRect().width;
    const origIdx = photoIds.indexOf(pid);
    setDragId(pid);
    setDropIdx(origIdx); // start at original position
    setGhostPos({ x: e.clientX, y: e.clientY });
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging) return;
    setGhostPos({ x: e.clientX, y: e.clientY });
  }

  function handlePointerUp() {
    if (!dragId) return;
    /* Compute final order from current state */
    const fi = photoIds.filter(id => id !== dragId);
    const finalOrder = [...fi.slice(0, dropIdx), dragId, ...fi.slice(dropIdx)];
    if (finalOrder.join(",") !== photoIds.join(",")) {
      onReorder(finalOrder);
    }
    setDragId(null);
  }

  function handleTileEnter(pid: string) {
    if (!isDragging || pid === dragId) return;
    const fi = photoIds.filter(id => id !== dragId);
    const idx = fi.indexOf(pid);
    if (idx !== -1) setDropIdx(idx);
  }

  return (
    <div
      className="relative"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Ghost — follows pointer */}
      {isDragging && (
        <div
          className="fixed pointer-events-none z-50 rounded overflow-hidden shadow-2xl ring-2 ring-yellow/60"
          style={{
            width:  ghostSize.current,
            height: ghostSize.current,
            left:   ghostPos.x - ghostSize.current / 2,
            top:    ghostPos.y - ghostSize.current / 2,
            transform: "rotate(2deg) scale(1.05)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ghostSrc.current} alt="" className="w-full h-full object-cover" draggable={false} />
        </div>
      )}

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
        {liveOrder.map((pid) => {
          const ph = photos[pid];
          if (!ph) return null;
          const isTheDragged = pid === dragId;

          return (
            <div
              key={pid}
              className={[
                "relative aspect-square overflow-hidden rounded border select-none",
                isDragging ? "cursor-grabbing" : "cursor-grab",
                isTheDragged
                  ? "opacity-20 border-yellow/40"
                  : ph.visibility === "hidden"
                    ? "opacity-40 border-[var(--border)]"
                    : "border-[var(--border)]",
              ].join(" ")}
              onPointerDown={(e) => handlePointerDown(e, pid)}
              onPointerEnter={() => handleTileEnter(pid)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ph.src} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
              {!isTheDragged && (
                <button
                  onClick={(e) => { e.stopPropagation(); if (confirm("Remove this photo?")) onRemove(pid); }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="absolute top-1 right-1 w-5 h-5 rounded bg-black/60 text-white opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                  title="Remove"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              )}
            </div>
          );
        })}

        {/* Add tile — hovering over it during drag moves item to end */}
        <button
          onClick={onAddClick}
          onPointerEnter={() => { if (isDragging) setDropIdx(filteredIds.length); }}
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
   Categories still exist in the store (backwards compat) but the
   UI collapses them. All folders appear at the top level.
   New folders go into the first existing category, or a "main"
   category is auto-created if none exists. ────────────────────── */

export function ContentTree({ portfolioId }: { portfolioId: string }) {
  const store   = usePortfolioContentStore();
  const content = store.getContent(portfolioId);
  const summary = contentSummary(content);

  const [pickFor, setPickFor] = useState<{ folderId: string } | null>(null);

  const allFolderIds = content.categoryIds.flatMap(
    (catId) => content.categories[catId]?.folderIds ?? [],
  );

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
