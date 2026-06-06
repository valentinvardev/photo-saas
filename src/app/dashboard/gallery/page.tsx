"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "~/trpc/react";
import { useUploadPhotos } from "~/lib/photo/upload";

/* ── Icons ── */
const UploadIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const TrashIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>;
const CloseIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const FolderIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>;
const BackIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>;
const MoveIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><line x1="12" y1="10" x2="12" y2="16"/><line x1="9" y1="13" x2="15" y2="13"/></svg>;
const PencilIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;

function fmtSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

type GPhoto = { id: string; url: string; originalUrl: string; filename: string; size: number; width: number | null; height: number | null };
type GFolder = { id: string; name: string; count: number; coverUrl: string | null };
type FolderModalState = { mode: "create" | "rename"; id?: string; moveAfter?: boolean } | null;

/* ── Folder name modal (styled) ── */
function FolderModal({ mode, initial, busy, onSubmit, onClose }: {
  mode: "create" | "rename"; initial: string; busy: boolean;
  onSubmit: (name: string) => void; onClose: () => void;
}) {
  const [name, setName] = useState(initial);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); inputRef.current?.select(); }, []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);
  const valid = name.trim().length > 0;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-lg bg-yellow/10 border border-yellow/30 flex items-center justify-center text-yellow"><FolderIcon /></span>
            <h2 className="font-sans text-base font-bold text-[var(--fg)]">{mode === "create" ? "New folder" : "Rename folder"}</h2>
          </div>
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && valid && !busy) onSubmit(name.trim()); }}
            placeholder="Folder name"
            maxLength={80}
            className="w-full rounded-xl px-4 py-2.5 font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] placeholder:text-[var(--fg-muted)] focus:outline-none focus:border-yellow transition-colors"
          />
        </div>
        <div className="flex border-t border-[var(--border)]">
          <button onClick={onClose} className="flex-1 font-sans text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] py-3 transition-colors border-r border-[var(--border)]">Cancel</button>
          <button onClick={() => valid && onSubmit(name.trim())} disabled={!valid || busy}
            className="flex-1 font-sans text-sm font-semibold text-yellow hover:bg-yellow/10 py-3 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {busy ? "Saving…" : mode === "create" ? "Create" : "Save"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Lightbox ── */
function Lightbox({ photos, index, onIndex, onClose }: { photos: GPhoto[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const photo = photos[index]!;
  const [loaded, setLoaded] = useState(false);
  const prev = useCallback(() => onIndex(Math.max(0, index - 1)), [index, onIndex]);
  const next = useCallback(() => onIndex(Math.min(photos.length - 1, index + 1)), [index, photos.length, onIndex]);
  /* Reset the loaded state whenever the shown photo changes (open / navigate). */
  useEffect(() => { setLoaded(false); }, [photo.originalUrl]);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); };
    window.addEventListener("keydown", fn); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose, prev, next]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 sm:p-10"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors z-10"><CloseIcon /></button>
      {index > 0 && <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center z-10"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg></button>}
      {index < photos.length - 1 && <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center z-10"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>}

      {/* Framed, smaller image area with a skeleton until the image loads */}
      <div className="relative flex items-center justify-center w-[min(88vw,760px)] h-[min(78vh,620px)]">
        {!loaded && <div className="absolute inset-0 rounded-lg bg-white/10 animate-pulse" />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photo.originalUrl}
          src={photo.originalUrl}
          alt={photo.filename}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={`max-w-full max-h-full object-contain rounded-lg transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[11px] text-white/50">
        {photo.filename} · {fmtSize(photo.size)}{photo.width ? ` · ${photo.width}×${photo.height}px` : ""} · {index + 1}/{photos.length}
      </div>
    </motion.div>
  );
}

/* ── Page ── */
export default function GalleryPage() {
  const utils = api.useUtils();
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const { data: foldersData } = api.photo.listFolders.useQuery();
  const folders: GFolder[] = foldersData ?? [];
  // At root (activeFolder === null) pass folderId:null so the main grid shows
  // only un-filed photos — photos inside a folder stay in that folder only.
  const { data, isLoading } = api.photo.list.useQuery({ limit: 200, folderId: activeFolder });
  const photos: GPhoto[] = data?.items ?? [];

  const { upload, uploading, progress, error } = useUploadPhotos();
  const deleteMut       = api.photo.delete.useMutation();
  const createFolderMut = api.photo.createFolder.useMutation();
  const renameFolderMut = api.photo.renameFolder.useMutation();
  const deleteFolderMut = api.photo.deleteFolder.useMutation();
  const moveMut         = api.photo.moveToFolder.useMutation();

  const fileRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [moveMenu, setMoveMenu] = useState(false);
  const [folderModal, setFolderModal] = useState<FolderModalState>(null);
  const [folderBusy, setFolderBusy] = useState(false);

  const activeFolderObj = folders.find((f) => f.id === activeFolder) ?? null;

  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const clearSel = () => { setSelected(new Set()); setSelectMode(false); setMoveMenu(false); };
  const refresh = async () => { await Promise.all([utils.photo.list.invalidate(), utils.photo.listFolders.invalidate()]); };

  async function doUpload(files: File[]) {
    if (files.length === 0) return;
    try { await upload(files, { folderId: activeFolder }); await refresh(); } catch { /* hook surfaces error */ }
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
    try { await Promise.all([...selected].map((id) => deleteMut.mutateAsync({ id }))); await refresh(); clearSel(); }
    finally { setDeleting(false); }
  }

  async function moveSelected(folderId: string | null) {
    if (selected.size === 0) return;
    await moveMut.mutateAsync({ photoIds: [...selected], folderId });
    await refresh();
    clearSel();
  }

  async function submitFolder(name: string) {
    if (!folderModal) return;
    setFolderBusy(true);
    try {
      if (folderModal.mode === "rename" && folderModal.id) {
        await renameFolderMut.mutateAsync({ id: folderModal.id, name });
      } else {
        const f = await createFolderMut.mutateAsync({ name });
        if (folderModal.moveAfter && selected.size > 0) {
          await moveMut.mutateAsync({ photoIds: [...selected], folderId: f.id });
          clearSel();
        }
      }
      await refresh();
      setFolderModal(null);
    } finally { setFolderBusy(false); }
  }

  async function deleteActiveFolder() {
    if (!activeFolderObj) return;
    if (!confirm(`Delete folder "${activeFolderObj.name}"? The photos inside will be moved back to your library (not deleted).`)) return;
    await deleteFolderMut.mutateAsync({ id: activeFolderObj.id });
    setActiveFolder(null);
    await refresh();
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    void doUpload(files);
  }

  const showFolders = activeFolder === null && folders.length > 0;

  return (
    <div className="min-h-full relative"
      onDragOver={(e) => { e.preventDefault(); if (!dragOver) setDragOver(true); }}
      onDragLeave={(e) => { if (e.relatedTarget === null) setDragOver(false); }}
      onDrop={onDrop}>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />

      {/* Header */}
      <div className="bg-[var(--bg)] border-b border-[var(--border)] px-5 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            {activeFolder !== null && (
              <button onClick={() => { setActiveFolder(null); clearSel(); }} className="p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors shrink-0"><BackIcon /></button>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-sans font-black text-[var(--fg)] text-lg leading-none truncate">{activeFolderObj ? activeFolderObj.name : "Gallery"}</h1>
                {activeFolderObj && (
                  <>
                    <button onClick={() => setFolderModal({ mode: "rename", id: activeFolderObj.id })} className="p-1 rounded text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors" title="Rename folder"><PencilIcon /></button>
                    <button onClick={deleteActiveFolder} className="p-1 rounded text-[var(--fg-muted)] hover:text-red-400 hover:bg-[var(--bg-subtle)] transition-colors" title="Delete folder"><TrashIcon /></button>
                  </>
                )}
              </div>
              <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-1">
                {isLoading ? "Loading…" : `${photos.length} photo${photos.length !== 1 ? "s" : ""}`}
                {uploading && ` · uploading ${progress.done}/${progress.total}…`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {photos.length > 0 && (
              selectMode
                ? <button onClick={clearSel} className="font-mono text-[10px] text-[var(--fg-muted)] hover:text-[var(--fg)] px-2 py-1 rounded-lg transition-colors">Done</button>
                : <button onClick={() => setSelectMode(true)} className="font-mono text-[10px] text-[var(--fg-muted)] hover:text-[var(--fg)] px-2 py-1 rounded-lg transition-colors">Select</button>
            )}
            {activeFolder === null && (
              <button onClick={() => setFolderModal({ mode: "create" })} className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border)] bg-[var(--bg-card)] text-[var(--fg)] text-xs font-sans font-medium hover:border-[var(--fg-muted)] transition-colors rounded-lg">
                <FolderIcon /> New folder
              </button>
            )}
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="btn-primary flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans font-semibold disabled:opacity-50">
              <UploadIcon /> {uploading ? `Uploading ${progress.done}/${progress.total}…` : "Upload"}
            </button>
          </div>
        </div>
        {error && <p className="font-mono text-[10px] text-red-400 mt-2">{error}</p>}
      </div>

      {/* Grid: folders + photos share one grid (prototype style) */}
      {isLoading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6" style={{ gap: "1px", backgroundColor: "var(--border)" }}>
          {Array.from({ length: 18 }).map((_, i) => <div key={i} className="aspect-square bg-[var(--bg-subtle)] animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6" style={{ gap: "1px", backgroundColor: "var(--border)" }}>

          {/* Back tile (inside a folder) */}
          {activeFolder !== null && (
            <button onClick={() => { setActiveFolder(null); clearSel(); }}
              className="relative aspect-square bg-[var(--bg-subtle)] flex flex-col items-center justify-center gap-1.5 group hover:bg-[var(--bg-card)] transition-colors">
              <span className="text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors"><BackIcon /></span>
              <span className="font-mono text-[9px] text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors">All photos</span>
            </button>
          )}

          {/* Folder tiles (root only) */}
          {showFolders && folders.map((f) => (
            <button key={f.id} onClick={() => { setActiveFolder(f.id); clearSel(); }}
              className="relative aspect-square overflow-hidden group bg-[var(--bg-subtle)]">
              {f.coverUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={f.coverUrl} alt="" className="w-full h-full object-cover opacity-55 group-hover:opacity-70 group-hover:scale-105 transition-all duration-300" />
              ) : null}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 text-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" opacity="0.7"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                <span className="font-sans font-bold text-white text-xs truncate max-w-full">{f.name}</span>
                <span className="font-mono text-[9px] text-white/60">{f.count} photo{f.count !== 1 ? "s" : ""}</span>
              </div>
            </button>
          ))}

          {/* Photo tiles */}
          {photos.map((photo, i) => {
            const isSel = selected.has(photo.id);
            return (
              <div key={photo.id}
                className="relative aspect-square overflow-hidden cursor-pointer group bg-[var(--bg-subtle)]"
                style={{ boxShadow: isSel ? "inset 0 0 0 3px #fad502" : "none" }}
                onClick={() => { if (selectMode) toggle(photo.id); else setLightboxIdx(i); }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt={photo.filename} loading="lazy" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
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

          {/* Empty state (no photos and, at root, no folders) */}
          {photos.length === 0 && !showFolders && activeFolder === null && (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center mb-4 text-[var(--fg-muted)]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
              <p className="font-sans font-semibold text-[var(--fg)] mb-1">Your gallery is empty</p>
              <p className="font-serif text-sm text-[var(--fg-muted)] mb-5">Drag photos here, or upload from your device.</p>
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary px-5 py-2.5 rounded-xl font-sans font-bold text-sm disabled:opacity-50">
                {uploading ? `Uploading ${progress.done}/${progress.total}…` : "Upload photos"}
              </button>
            </div>
          )}
          {photos.length === 0 && activeFolder !== null && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center px-6">
              <p className="font-sans font-semibold text-[var(--fg)] mb-1">This folder is empty</p>
              <p className="font-serif text-sm text-[var(--fg-muted)] mb-5">Upload here, or move photos in from your library.</p>
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary px-5 py-2.5 rounded-xl font-sans font-bold text-sm disabled:opacity-50">
                {uploading ? `Uploading ${progress.done}/${progress.total}…` : "Upload photos"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Selection action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl">
            <span className="font-mono text-[11px] text-[var(--fg-muted)]">{selected.size} selected</span>

            <div className="relative">
              <button onClick={() => setMoveMenu((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--fg)] font-sans text-xs font-medium hover:border-[var(--fg-muted)] transition-colors">
                <MoveIcon /> Move to
              </button>
              {moveMenu && (
                <div className="absolute bottom-full mb-2 left-0 w-48 max-h-60 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl py-1">
                  <button onClick={() => { setMoveMenu(false); setFolderModal({ mode: "create", moveAfter: true }); }} className="w-full text-left px-3 py-2 font-sans text-xs text-yellow hover:bg-[var(--bg-subtle)] transition-colors">+ New folder…</button>
                  {activeFolder !== null && (
                    <button onClick={() => moveSelected(null)} className="w-full text-left px-3 py-2 font-sans text-xs text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">Remove from folder</button>
                  )}
                  {folders.filter((f) => f.id !== activeFolder).map((f) => (
                    <button key={f.id} onClick={() => moveSelected(f.id)} className="w-full text-left px-3 py-2 font-sans text-xs text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors flex items-center gap-2">
                      <span className="text-[var(--fg-muted)]"><FolderIcon /></span>{f.name}
                    </button>
                  ))}
                  {folders.length === 0 && <p className="px-3 py-2 font-sans text-[11px] text-[var(--fg-muted)]">No folders yet</p>}
                </div>
              )}
            </div>

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
              <p className="font-sans font-bold text-[var(--fg)]">Drop to upload{activeFolderObj ? ` to ${activeFolderObj.name}` : ""}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Folder modal */}
      <AnimatePresence>
        {folderModal && (
          <FolderModal
            mode={folderModal.mode}
            initial={folderModal.mode === "rename" ? (activeFolderObj?.name ?? folders.find((f) => f.id === folderModal.id)?.name ?? "") : ""}
            busy={folderBusy}
            onSubmit={submitFolder}
            onClose={() => setFolderModal(null)}
          />
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
