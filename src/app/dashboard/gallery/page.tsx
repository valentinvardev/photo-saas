"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "~/trpc/react";
import { useUploadPhotos } from "~/lib/photo/upload";

/* ── Icons ── */
const UploadIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const TrashIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>;
const CloseIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>;

function fmtSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

type GPhoto = { id: string; url: string; filename: string; size: number; width: number | null; height: number | null };

/* ── Lightbox ── */
function Lightbox({ photos, index, onIndex, onClose }: { photos: GPhoto[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const photo = photos[index]!;
  const prev = useCallback(() => onIndex(Math.max(0, index - 1)), [index, onIndex]);
  const next = useCallback(() => onIndex(Math.min(photos.length - 1, index + 1)), [index, photos.length, onIndex]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); };
    window.addEventListener("keydown", fn); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose, prev, next]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"><CloseIcon /></button>
      {index > 0 && <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg></button>}
      {index < photos.length - 1 && <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.url} alt={photo.filename} className="max-w-full max-h-full object-contain rounded" />
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[11px] text-white/50">
        {photo.filename} · {fmtSize(photo.size)}{photo.width ? ` · ${photo.width}×${photo.height}px` : ""} · {index + 1}/{photos.length}
      </div>
    </motion.div>
  );
}

/* ── Page ── */
export default function GalleryPage() {
  const utils = api.useUtils();
  const { data, isLoading } = api.photo.list.useQuery({ limit: 200 });
  const photos: GPhoto[] = data?.items ?? [];

  const { upload, uploading, progress, error } = useUploadPhotos();
  const deleteMut = api.photo.delete.useMutation();

  const fileRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const clearSel = () => { setSelected(new Set()); setSelectMode(false); };

  async function doUpload(files: File[]) {
    if (files.length === 0) return;
    try { await upload(files); await utils.photo.list.invalidate(); } catch { /* hook surfaces error */ }
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    await doUpload(files);
  }

  async function deleteSelected() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} photo${selected.size > 1 ? "s" : ""}? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await Promise.all([...selected].map((id) => deleteMut.mutateAsync({ id })));
      await utils.photo.list.invalidate();
      clearSel();
    } finally { setDeleting(false); }
  }

  /* Drag-and-drop from the OS */
  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    void doUpload(files);
  }

  return (
    <div
      className="min-h-full relative"
      onDragOver={(e) => { e.preventDefault(); if (!dragOver) setDragOver(true); }}
      onDragLeave={(e) => { if (e.relatedTarget === null) setDragOver(false); }}
      onDrop={onDrop}
    >
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />

      {/* Header */}
      <div className="bg-[var(--bg)] border-b border-[var(--border)] px-5 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-sans font-black text-[var(--fg)] text-lg leading-none">Gallery</h1>
            <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-1">
              {isLoading ? "Loading…" : `${photos.length} photo${photos.length !== 1 ? "s" : ""}`}
              {uploading && ` · uploading ${progress.done}/${progress.total}…`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {photos.length > 0 && (
              selectMode ? (
                <button onClick={clearSel} className="font-mono text-[10px] text-[var(--fg-muted)] hover:text-[var(--fg)] px-2 py-1 rounded-lg transition-colors">Done</button>
              ) : (
                <button onClick={() => setSelectMode(true)} className="font-mono text-[10px] text-[var(--fg-muted)] hover:text-[var(--fg)] px-2 py-1 rounded-lg transition-colors">Select</button>
              )
            )}
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="btn-primary flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-semibold disabled:opacity-50">
              <UploadIcon /> {uploading ? `Uploading ${progress.done}/${progress.total}…` : "Upload"}
            </button>
          </div>
        </div>
        {error && <p className="font-mono text-[10px] text-red-400 mt-2">{error}</p>}
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6" style={{ gap: "1px", backgroundColor: "var(--border)" }}>
          {Array.from({ length: 18 }).map((_, i) => <div key={i} className="aspect-square bg-[var(--bg-subtle)] animate-pulse" />)}
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center mb-4 text-[var(--fg-muted)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <p className="font-sans font-semibold text-[var(--fg)] mb-1">Your gallery is empty</p>
          <p className="font-serif text-sm text-[var(--fg-muted)] mb-5">Drag photos here, or upload from your device.</p>
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary px-5 py-2.5 rounded-xl font-sans font-bold text-sm disabled:opacity-50">
            {uploading ? `Uploading ${progress.done}/${progress.total}…` : "Upload photos"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6" style={{ gap: "1px", backgroundColor: "var(--border)" }}>
          {photos.map((photo, i) => {
            const isSel = selected.has(photo.id);
            return (
              <div key={photo.id}
                className="relative aspect-square overflow-hidden cursor-pointer group bg-[var(--bg-subtle)]"
                style={{ boxShadow: isSel ? "inset 0 0 0 3px #fad502" : "none" }}
                onClick={() => { if (selectMode) toggle(photo.id); else setLightboxIdx(i); }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.filename} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-0 inset-x-0 px-1.5 py-1 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="font-mono text-[9px] text-white truncate">{photo.filename}</p>
                </div>
                {(selectMode || isSel) && (
                  <div onClick={(e) => { e.stopPropagation(); toggle(photo.id); }}
                    className={`absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${isSel ? "bg-yellow" : "bg-black/40 border border-white/40"}`}>
                    {isSel && <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#111" strokeWidth="2.5"><path d="M2 6l3 3 5-5"/></svg>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Selection action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl">
            <span className="font-mono text-[11px] text-[var(--fg-muted)]">{selected.size} selected</span>
            <button onClick={deleteSelected} disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/40 text-red-400 font-sans text-xs font-bold hover:bg-red-500/10 disabled:opacity-50 transition-colors">
              <TrashIcon /> {deleting ? "Deleting…" : "Delete"}
            </button>
            <button onClick={clearSel} className="font-mono text-[10px] text-[var(--fg-muted)] hover:text-[var(--fg)] px-2 transition-colors">Clear</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drag overlay */}
      <AnimatePresence>
        {dragOver && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)]/80 backdrop-blur-sm pointer-events-none">
            <div className="flex flex-col items-center gap-3 px-10 py-8 rounded-2xl border-2 border-dashed border-yellow">
              <span className="text-yellow"><UploadIcon /></span>
              <p className="font-sans font-bold text-[var(--fg)]">Drop to upload</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && photos[lightboxIdx] && (
          <Lightbox photos={photos} index={lightboxIdx} onIndex={setLightboxIdx} onClose={() => setLightboxIdx(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
