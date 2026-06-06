"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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

/* ── Inline rename ────────────────────────────────────────────── */
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

/* ── Shared drag state ────────────────────────────────────────── */
interface DragState {
  photoId:        string;
  sourceFolderId: string;
  targetFolderId: string;
  dropIdx:        number;
  ghostSrc:       string;
  ghostSize:      number;
  pos:            { x: number; y: number };
}

/* ── Photo grid ───────────────────────────────────────────────────
   Purely presentational — drag logic lives in ContentTree.
   Receives `drag` to compute liveOrder and highlight drop position.
   Uses data attributes for hit-testing from the document listener. */

function PhotoGrid({
  folderId, photoIds, photos, drag, onDragStart, onRemove, onAddClick,
}: {
  folderId:    string;
  photoIds:    string[];
  photos:      Record<string, { id: string; src: string; visibility: Visibility }>;
  drag:        DragState | null;
  onDragStart: (photoId: string, folderId: string, src: string, size: number, x: number, y: number) => void;
  onRemove:    (id: string) => void;
  onAddClick:  () => void;
}) {
  const isSource   = drag?.sourceFolderId === folderId;
  const isTarget   = drag?.targetFolderId === folderId;
  const isDragging = drag !== null;

  /* Compute displayed order based on drag state */
  let liveOrder: string[];
  if (!isDragging) {
    liveOrder = photoIds;
  } else if (isSource && isTarget) {
    /* Reordering within this folder — show dragged item at dropIdx */
    const rest = photoIds.filter((id) => id !== drag.photoId);
    liveOrder = [...rest.slice(0, drag.dropIdx), drag.photoId, ...rest.slice(drag.dropIdx)];
  } else if (isSource) {
    /* Photo left this folder — hide it */
    liveOrder = photoIds.filter((id) => id !== drag.photoId);
  } else if (isTarget) {
    /* Photo is arriving here from another folder — show preview at dropIdx */
    const rest = photoIds.filter((id) => id !== drag.photoId);
    liveOrder = [...rest.slice(0, drag.dropIdx), drag.photoId, ...rest.slice(drag.dropIdx)];
  } else {
    liveOrder = photoIds;
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1.5">
      {liveOrder.map((pid) => {
        const ph = photos[pid];
        if (!ph) return null;

        const isThisDragged = isDragging && pid === drag.photoId;
        /* "preview" = dragged photo appearing in a folder it doesn't belong to yet */
        const isPreview = isThisDragged && isTarget && !isSource;
        /* "ghost slot" = dragged photo shown in-place in its own folder */
        const isGhostSlot = isThisDragged && isSource && isTarget;

        return (
          <div
            key={pid}
            data-photo-id={pid}
            className={[
              "relative aspect-square overflow-hidden rounded border select-none",
              isDragging ? "cursor-grabbing" : "cursor-grab",
              isGhostSlot  ? "opacity-20 border-yellow/40 ring-1 ring-yellow/30" :
              isPreview    ? "opacity-60 ring-2 ring-yellow border-yellow" :
              ph.visibility === "hidden" ? "opacity-40 border-[var(--border)]" :
                             "border-[var(--border)]",
            ].join(" ")}
            onPointerDown={(e) => {
              if (isDragging) return;
              e.preventDefault();
              const size = (e.currentTarget as HTMLElement).getBoundingClientRect().width;
              onDragStart(pid, folderId, ph.src, size, e.clientX, e.clientY);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ph.src} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />

            {!isThisDragged && (
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

      {/* Add tile — data-drop-end marks it as "append to this folder" */}
      <button
        onClick={onAddClick}
        data-drop-end={folderId}
        className="aspect-square rounded border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:text-yellow hover:border-yellow hover:bg-yellow/5 transition-colors flex flex-col items-center justify-center gap-1"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        <span className="font-mono text-[8px] uppercase tracking-widest">Add</span>
      </button>
    </div>
  );
}

/* ── Main content tree ─────────────────────────────────────────── */

export function ContentTree({ portfolioId }: { portfolioId: string }) {
  const store   = usePortfolioContentStore();
  const content = store.getContent(portfolioId);
  const summary = contentSummary(content);

  /* Drag state — ref for the event-listener closure, state for rendering */
  const dragRef    = useRef<DragState | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);

  /* Snapshot of folder data used inside the pointer-move closure.
     Updated synchronously on every render so the closure always has
     the latest photoId lists without needing to re-register listeners. */
  const foldersSnap = useRef(content.folders);
  foldersSnap.current = content.folders;

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

  /* ── Drag engine ───────────────────────────────────────────────
     Uses document-level pointermove / pointerup so the ghost can
     cross folder boundaries. elementFromPoint() detects the folder
     and photo tile under the cursor each frame. */

  const startDrag = useCallback((
    photoId: string, folderId: string, src: string, size: number, startX: number, startY: number,
  ) => {
    const folder = foldersSnap.current[folderId];
    const initial: DragState = {
      photoId,
      sourceFolderId: folderId,
      targetFolderId: folderId,
      dropIdx: folder ? folder.photoIds.indexOf(photoId) : 0,
      ghostSrc: src,
      ghostSize: size,
      pos: { x: startX, y: startY },
    };
    dragRef.current = initial;
    setDrag(initial);

    function onMove(e: PointerEvent) {
      const d = dragRef.current;
      if (!d) return;

      /* Find the element under the cursor (ghost is pointer-events-none) */
      const el = document.elementFromPoint(e.clientX, e.clientY);

      /* Which folder are we over? */
      const folderEl    = el?.closest("[data-folder-id]");
      const tgtFolderId = folderEl?.getAttribute("data-folder-id") ?? d.targetFolderId;

      /* Determine drop index within the target folder */
      const folderChanged = tgtFolderId !== d.targetFolderId;
      let dropIdx: number;

      if (folderChanged) {
        /* Entering a new folder — default to appending at the end */
        const tgt = foldersSnap.current[tgtFolderId];
        dropIdx = tgt ? tgt.photoIds.filter((id) => id !== d.photoId).length : 0;
      } else {
        dropIdx = d.dropIdx;
      }

      /* Refine by hovered photo tile */
      const tileEl      = el?.closest("[data-photo-id]");
      const hoveredPhid = tileEl?.getAttribute("data-photo-id");
      if (hoveredPhid && hoveredPhid !== d.photoId) {
        const tgt = foldersSnap.current[tgtFolderId];
        if (tgt) {
          const filtered = tgt.photoIds.filter((id) => id !== d.photoId);
          const idx = filtered.indexOf(hoveredPhid);
          if (idx !== -1) dropIdx = idx;
        }
      }

      /* "Add" button at the end of a folder grid → append */
      const dropEndEl = el?.closest("[data-drop-end]");
      if (dropEndEl) {
        const eid = dropEndEl.getAttribute("data-drop-end") ?? tgtFolderId;
        const tgt = foldersSnap.current[eid];
        dropIdx = tgt ? tgt.photoIds.filter((id) => id !== d.photoId).length : 0;
      }

      const updated: DragState = {
        ...d,
        pos:            { x: e.clientX, y: e.clientY },
        targetFolderId: tgtFolderId,
        dropIdx,
      };
      dragRef.current = updated;
      setDrag({ ...updated });
    }

    function finish() {
      const d = dragRef.current;
      if (!d) return;

      const { photoId, sourceFolderId, targetFolderId, dropIdx } = d;

      if (sourceFolderId === targetFolderId) {
        /* Reorder within the same folder */
        const folder = foldersSnap.current[sourceFolderId];
        if (folder) {
          const rest     = folder.photoIds.filter((id) => id !== photoId);
          const newOrder = [...rest.slice(0, dropIdx), photoId, ...rest.slice(dropIdx)];
          if (newOrder.join(",") !== folder.photoIds.join(",")) {
            store.reorderFolderPhotos(portfolioId, sourceFolderId, newOrder);
          }
        }
      } else {
        /* Move to a different folder */
        store.movePhoto(portfolioId, photoId, sourceFolderId, targetFolderId, dropIdx);
      }

      dragRef.current = null;
      setDrag(null);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup",   finish);
      document.removeEventListener("pointercancel", finish);
    }

    document.addEventListener("pointermove",   onMove);
    document.addEventListener("pointerup",     finish);
    document.addEventListener("pointercancel", finish);
  }, [portfolioId, store]);

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
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

      {/* ── Folder list ── */}
      {allFolderIds.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] p-12 text-center text-[var(--fg-muted)]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3 opacity-40" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
          <p className="font-sans text-sm font-semibold text-[var(--fg)] mb-1">No folders yet</p>
          <p className="font-sans text-xs mb-4">Create your first one to start organizing photos.</p>
          <button
            onClick={addFolder}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-yellow text-[#111] font-sans text-xs font-semibold hover:bg-yellow-dark transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New folder
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {allFolderIds.map((folId) => {
              const fol = content.folders[folId];
              if (!fol) return null;

              const isCrossTarget = drag !== null
                && drag.targetFolderId === folId
                && drag.sourceFolderId !== folId;

              return (
                <motion.div
                  key={folId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  /* data-folder-id is the hit-test anchor for elementFromPoint */
                  data-folder-id={folId}
                  className={[
                    "rounded-xl border overflow-hidden transition-colors duration-150",
                    isCrossTarget
                      ? "border-yellow bg-yellow/5"
                      : "border-[var(--border)] bg-[var(--bg-card)]",
                  ].join(" ")}
                >
                  {/* Folder header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="text-[var(--fg-muted)] shrink-0"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                    <EditableLabel
                      value={fol.title}
                      onSave={(n) => store.renameFolder(portfolioId, folId, n)}
                      className="font-sans text-sm font-semibold text-[var(--fg)] flex-1 min-w-0"
                    />
                    {isCrossTarget && (
                      <span className="font-mono text-[9px] text-yellow uppercase tracking-widest shrink-0">
                        Drop here
                      </span>
                    )}
                    <span className="font-mono text-[9px] text-[var(--fg-muted)] shrink-0">
                      {fol.photoIds.length} photo{fol.photoIds.length !== 1 ? "s" : ""}
                    </span>
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
                      folderId={folId}
                      photoIds={fol.photoIds}
                      photos={content.photos}
                      drag={drag}
                      onDragStart={startDrag}
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

      {/* ── Drag ghost — follows the pointer globally ── */}
      {drag && (
        <div
          className="fixed pointer-events-none z-50 rounded overflow-hidden shadow-2xl ring-2 ring-yellow/60"
          style={{
            width:     drag.ghostSize,
            height:    drag.ghostSize,
            left:      drag.pos.x - drag.ghostSize / 2,
            top:       drag.pos.y - drag.ghostSize / 2,
            transform: "rotate(2deg) scale(1.05)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={drag.ghostSrc} alt="" className="w-full h-full object-cover" draggable={false} />
        </div>
      )}

      {/* ── Photo picker ── */}
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
