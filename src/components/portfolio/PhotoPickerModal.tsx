"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { api } from "~/trpc/react";
import { useUploadPhotos } from "~/lib/photo/upload";

/* ── Photo picker — pick one or many photos from your library ──
   Lists the real photo library (api.photo.list) and can upload new photos
   in place (createUpload → Storage → confirm). Returns the selected photos'
   public URLs via onPick. */

export function PhotoPickerModal({ multi = true, onPick, onClose }: {
  multi?:  boolean;
  onPick:  (urls: string[]) => void;
  onClose: () => void;
}) {
  const utils = api.useUtils();
  const { data, isLoading } = api.photo.list.useQuery({ limit: 200 });
  const photos = data?.items ?? [];

  const { upload, uploading, progress } = useUploadPhotos();
  const fileRef = useRef<HTMLInputElement>(null);

  const [selected, setSelected] = useState<Set<string>>(new Set()); // by url

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  function toggle(url: string) {
    if (!multi) { onPick([url]); onClose(); return; }
    setSelected((p) => { const n = new Set(p); n.has(url) ? n.delete(url) : n.add(url); return n; });
  }

  function commit() {
    if (selected.size === 0) return;
    onPick([...selected]);
    onClose();
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    try {
      await upload(files);
      await utils.photo.list.invalidate();
    } catch {
      /* error surfaced by the hook; keep the modal open */
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-xl w-full max-w-4xl max-h-[85dvh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden file input */}
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] shrink-0">
          <div>
            <h2 className="font-sans font-black text-[var(--fg)] text-base leading-none">Pick photo{multi ? "s" : ""}</h2>
            <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-1 uppercase tracking-widest">
              From your library · {photos.length} photo{photos.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold hover:bg-yellow/90 disabled:opacity-50 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {uploading ? `Uploading ${progress.done}/${progress.total}…` : "Upload"}
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Body — photo grid */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          {isLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-md bg-[var(--bg-subtle)] animate-pulse" />
              ))}
            </div>
          ) : photos.length === 0 ? (
            <div className="h-full min-h-[240px] flex items-center justify-center text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--fg-muted)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <div>
                  <p className="font-sans text-sm font-semibold text-[var(--fg)]">Your library is empty</p>
                  <p className="font-sans text-xs text-[var(--fg-muted)] mt-1">Upload photos to start building your portfolio.</p>
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold hover:bg-yellow/90 disabled:opacity-50 transition-colors"
                >
                  {uploading ? `Uploading ${progress.done}/${progress.total}…` : "Upload photos"}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
              {photos.map((photo) => {
                const isSelected = selected.has(photo.url);
                return (
                  <button
                    key={photo.id}
                    onClick={() => toggle(photo.url)}
                    className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                      isSelected ? "border-yellow ring-2 ring-yellow/30" : "border-transparent hover:border-[var(--fg-muted)]"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt={photo.filename} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-yellow/20 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-yellow flex items-center justify-center">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {multi && (
          <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-4 border-t border-[var(--border)]">
            <span className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest">
              {selected.size} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={commit}
                disabled={selected.size === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold hover:bg-yellow/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Add {selected.size > 0 ? selected.size : ""} photo{selected.size !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
