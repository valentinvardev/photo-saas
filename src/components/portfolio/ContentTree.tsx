"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePortfolioContentStore } from "~/lib/portfolio/store";
import { contentSummary, type Visibility } from "~/lib/portfolio/data";
import { PhotoPickerModal } from "./PhotoPickerModal";
import { ConfirmModal } from "~/components/ui/ConfirmModal";
import { Toggle } from "~/components/ui/Toggle";

/* Press gesture thresholds: hold to drag, quick tap to preview. */
const HOLD_MS = 200;   // press-and-hold before a drag begins
const CLICK_MOVE = 8;  // px — under this on release = a click (opens lightbox)
const DRAG_MOVE = 10;  // px — over this before the hold starts a drag immediately

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
  overDelete:     boolean;
}

/* ── Photo lightbox (click to preview) ────────────────────────── */
function PhotoLightbox({ items, index, onIndex, onClose, onDelete }: {
  items: { id: string; src: string }[];
  index: number; onIndex: (i: number) => void; onClose: () => void; onDelete: (id: string) => void;
}) {
  const item = items[index];
  const prev = useCallback(() => onIndex(Math.max(0, index - 1)), [index, onIndex]);
  const next = useCallback(() => onIndex(Math.min(items.length - 1, index + 1)), [index, items.length, onIndex]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); };
    window.addEventListener("keydown", fn); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose, prev, next]);
  if (!item) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <button onClick={() => onDelete(item.id)}
        className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 font-sans text-xs font-semibold transition-colors">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>
        Delete
      </button>
      <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      {index > 0 && (
        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
      )}
      {index < items.length - 1 && (
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.src} alt="" className="max-w-full max-h-full object-contain rounded" draggable={false} />
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[13px] text-white/50">{index + 1} / {items.length}</div>
    </motion.div>
  );
}

/* ── Photo grid ───────────────────────────────────────────────────
   Purely presentational — press/drag logic lives in ContentTree.
   Receives `drag` to compute liveOrder and highlight drop position. */

function PhotoGrid({
  folderId, photoIds, photos, drag, onPressStart, onAddClick,
}: {
  folderId:    string;
  photoIds:    string[];
  photos:      Record<string, { id: string; src: string; visibility: Visibility }>;
  drag:        DragState | null;
  onPressStart: (e: React.PointerEvent, photoId: string, folderId: string, src: string) => void;
  onAddClick:  () => void;
}) {
  const isSource   = drag?.sourceFolderId === folderId;
  const isTarget   = drag?.targetFolderId === folderId && !drag.overDelete;
  const isDragging = drag !== null;

  /* Compute displayed order based on drag state */
  let liveOrder: string[];
  if (!isDragging) {
    liveOrder = photoIds;
  } else if (isSource && isTarget) {
    const rest = photoIds.filter((id) => id !== drag.photoId);
    liveOrder = [...rest.slice(0, drag.dropIdx), drag.photoId, ...rest.slice(drag.dropIdx)];
  } else if (isSource) {
    liveOrder = photoIds.filter((id) => id !== drag.photoId);
  } else if (isTarget) {
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
        const isPreview = isThisDragged && isTarget && !isSource;
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
            onPointerDown={(e) => onPressStart(e, pid, folderId, ph.src)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ph.src} alt="" className="w-full h-full object-cover pointer-events-none" draggable={false} />
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

  const dragRef    = useRef<DragState | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);

  const foldersSnap = useRef(content.folders);
  foldersSnap.current = content.folders;

  const [pickFor, setPickFor] = useState<{ folderId: string } | null>(null);
  const [confirmFolderId, setConfirmFolderId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ folderId: string; index: number } | null>(null);

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

  function openLightbox(folderId: string, photoId: string) {
    const fol = foldersSnap.current[folderId];
    const idx = fol ? fol.photoIds.indexOf(photoId) : 0;
    setLightbox({ folderId, index: Math.max(0, idx) });
  }

  /* ── Drag engine ─────────────────────────────────────────────── */
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
      overDelete: false,
    };
    dragRef.current = initial;
    setDrag(initial);

    /* Freeze page scrolling while dragging so the image can be moved freely
       (e.g. onto another folder or the delete strip) without the list moving. */
    const preventScroll = (e: Event) => e.preventDefault();
    document.addEventListener("wheel", preventScroll, { passive: false });
    document.addEventListener("touchmove", preventScroll, { passive: false });
    const prevUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = "none";

    function onMove(e: PointerEvent) {
      const d = dragRef.current;
      if (!d) return;

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const overDelete = !!el?.closest("[data-delete-zone]");

      const folderEl    = el?.closest("[data-folder-id]");
      const tgtFolderId = folderEl?.getAttribute("data-folder-id") ?? d.targetFolderId;

      const folderChanged = tgtFolderId !== d.targetFolderId;
      let dropIdx: number;
      if (folderChanged) {
        const tgt = foldersSnap.current[tgtFolderId];
        dropIdx = tgt ? tgt.photoIds.filter((id) => id !== d.photoId).length : 0;
      } else {
        dropIdx = d.dropIdx;
      }

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

      const dropEndEl = el?.closest("[data-drop-end]");
      if (dropEndEl) {
        const eid = dropEndEl.getAttribute("data-drop-end") ?? tgtFolderId;
        const tgt = foldersSnap.current[eid];
        dropIdx = tgt ? tgt.photoIds.filter((id) => id !== d.photoId).length : 0;
      }

      const updated: DragState = { ...d, pos: { x: e.clientX, y: e.clientY }, targetFolderId: tgtFolderId, dropIdx, overDelete };
      dragRef.current = updated;
      setDrag({ ...updated });
    }

    function finish() {
      const d = dragRef.current;
      if (d) {
        const { photoId: pid, sourceFolderId, targetFolderId, dropIdx, overDelete } = d;
        if (overDelete) {
          store.removePhoto(portfolioId, pid);
        } else if (sourceFolderId === targetFolderId) {
          const folder = foldersSnap.current[sourceFolderId];
          if (folder) {
            const rest     = folder.photoIds.filter((id) => id !== pid);
            const newOrder = [...rest.slice(0, dropIdx), pid, ...rest.slice(dropIdx)];
            if (newOrder.join(",") !== folder.photoIds.join(",")) {
              store.reorderFolderPhotos(portfolioId, sourceFolderId, newOrder);
            }
          }
        } else {
          store.movePhoto(portfolioId, pid, sourceFolderId, targetFolderId, dropIdx);
        }
      }
      dragRef.current = null;
      setDrag(null);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup",   finish);
      document.removeEventListener("pointercancel", finish);
      document.removeEventListener("wheel", preventScroll);
      document.removeEventListener("touchmove", preventScroll);
      document.body.style.userSelect = prevUserSelect;
    }

    document.addEventListener("pointermove",   onMove);
    document.addEventListener("pointerup",     finish);
    document.addEventListener("pointercancel", finish);
  }, [portfolioId, store]);

  /* ── Press gesture: hold to drag, quick tap to open the lightbox ── */
  const beginPress = useCallback((
    e: React.PointerEvent, photoId: string, folderId: string, src: string,
  ) => {
    if (dragRef.current) return;
    e.preventDefault();
    const size = (e.currentTarget as HTMLElement).getBoundingClientRect().width;
    const startX = e.clientX, startY = e.clientY;
    let armed = true; // still deciding click vs drag

    const holdTimer = setTimeout(() => {
      if (!armed) return;
      armed = false;
      cleanup();
      startDrag(photoId, folderId, src, size, startX, startY);
    }, HOLD_MS);

    function preMove(ev: PointerEvent) {
      if (!armed) return;
      const dist = Math.hypot(ev.clientX - startX, ev.clientY - startY);
      if (dist > DRAG_MOVE) {
        armed = false;
        clearTimeout(holdTimer);
        cleanup();
        startDrag(photoId, folderId, src, size, startX, startY);
      }
    }
    function preUp(ev: PointerEvent) {
      clearTimeout(holdTimer);
      cleanup();
      if (!armed) return;
      armed = false;
      const dist = Math.hypot(ev.clientX - startX, ev.clientY - startY);
      if (dist < CLICK_MOVE) openLightbox(folderId, photoId);
    }
    function cleanup() {
      document.removeEventListener("pointermove", preMove);
      document.removeEventListener("pointerup", preUp);
      document.removeEventListener("pointercancel", preUp);
    }
    document.addEventListener("pointermove", preMove);
    document.addEventListener("pointerup", preUp);
    document.addEventListener("pointercancel", preUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDrag]);

  /* Lightbox items for the open folder (read live so deletes reflect) */
  const lbFolder = lightbox ? content.folders[lightbox.folderId] : null;
  const lbItems = lbFolder
    ? lbFolder.photoIds.map((id) => content.photos[id]).filter((p): p is NonNullable<typeof p> => !!p).map((p) => ({ id: p.id, src: p.src }))
    : [];

  function deleteFromLightbox(id: string) {
    store.removePhoto(portfolioId, id);
    setLightbox((lb) => {
      if (!lb) return null;
      const fol = store.getContent(portfolioId).folders[lb.folderId];
      const len = fol ? fol.photoIds.length : 0;
      if (len === 0) return null;
      return { ...lb, index: Math.min(lb.index, len - 1) };
    });
  }

  const confirmFolder = confirmFolderId ? content.folders[confirmFolderId] : null;

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans font-bold text-[var(--fg)] text-base">Content</h2>
          <p className="font-mono text-[12px] text-[var(--fg-muted)] mt-0.5 uppercase tracking-widest">
            {summary.folders} folder{summary.folders !== 1 ? "s" : ""} · {summary.photos} photo{summary.photos !== 1 ? "s" : ""}
          </p>
          {summary.photos > 0 && (
            <p className="font-mono text-[12px] text-[var(--fg-muted)]/70 mt-1 flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>
              Hold &amp; drag to reorder or move · click to preview
            </p>
          )}
        </div>
        <button
          onClick={addFolder}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] font-mono text-[12px] uppercase tracking-widest text-[var(--fg-muted)] hover:text-yellow hover:border-yellow transition-colors"
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
                && !drag.overDelete
                && drag.targetFolderId === folId
                && drag.sourceFolderId !== folId;

              return (
                <motion.div
                  key={folId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
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
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--fg-muted)] shrink-0"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                    <EditableLabel
                      value={fol.title}
                      onSave={(n) => store.renameFolder(portfolioId, folId, n)}
                      className="font-sans text-sm font-semibold text-[var(--fg)] flex-1 min-w-0"
                    />
                    {isCrossTarget && (
                      <span className="font-mono text-[13px] text-yellow uppercase tracking-widest shrink-0">
                        Drop here
                      </span>
                    )}
                    <span className="font-mono text-[13px] text-[var(--fg-muted)] shrink-0">
                      {fol.photoIds.length} photo{fol.photoIds.length !== 1 ? "s" : ""}
                    </span>
                    <VisibilityToggle v={fol.visibility} onChange={(next) => store.setFolderVis(portfolioId, folId, next)} />
                    <button
                      onClick={() => setConfirmFolderId(folId)}
                      className="text-[var(--fg-muted)] hover:text-red-400 transition-colors w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10"
                      title="Delete folder"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>
                    </button>
                  </div>

                  {/* Photo grid */}
                  <div className="p-3">
                    <PhotoGrid
                      folderId={folId}
                      photoIds={fol.photoIds}
                      photos={content.photos}
                      drag={drag}
                      onPressStart={beginPress}
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
          className={`fixed pointer-events-none z-[55] rounded overflow-hidden shadow-2xl ring-2 ${drag.overDelete ? "ring-red-500" : "ring-yellow/60"}`}
          style={{
            width:     drag.ghostSize,
            height:    drag.ghostSize,
            left:      drag.pos.x - drag.ghostSize / 2,
            top:       drag.pos.y - drag.ghostSize / 2,
            transform: drag.overDelete ? "rotate(3deg) scale(0.9)" : "rotate(2deg) scale(1.05)",
            opacity:   drag.overDelete ? 0.85 : 1,
            transition: "transform 0.12s ease, opacity 0.12s ease",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={drag.ghostSrc} alt="" className="w-full h-full object-cover" draggable={false} />
        </div>
      )}

      {/* ── Delete strip — appears while dragging; drop here to delete ── */}
      <AnimatePresence>
        {drag && (
          <motion.div
            data-delete-zone
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2.5 rounded-2xl border shadow-2xl font-sans font-semibold text-sm transition-all duration-150 ${
              drag.overDelete
                ? "bg-red-500 border-red-500 text-white px-7 py-4 scale-105"
                : "bg-[var(--bg-card)] border-red-500/40 text-red-400 px-6 py-3.5"
            }`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>
            {drag.overDelete ? "Release to delete" : "Drag here to delete"}
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* ── Photo lightbox ── */}
      <AnimatePresence>
        {lightbox && lbItems[lightbox.index] && (
          <PhotoLightbox
            items={lbItems}
            index={lightbox.index}
            onIndex={(i) => setLightbox((lb) => (lb ? { ...lb, index: i } : null))}
            onClose={() => setLightbox(null)}
            onDelete={deleteFromLightbox}
          />
        )}
      </AnimatePresence>

      {/* ── Delete folder confirmation ── */}
      <AnimatePresence>
        {confirmFolder && confirmFolderId && (
          <ConfirmModal
            title="Delete folder"
            body={`Delete "${confirmFolder.title}"? The photos inside go back to your library and aren't deleted.`}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            onConfirm={() => { store.removeFolder(portfolioId, confirmFolderId); setConfirmFolderId(null); }}
            onClose={() => setConfirmFolderId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
