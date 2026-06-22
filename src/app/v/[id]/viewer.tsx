"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "~/components/ui/Logo";
import { api } from "~/trpc/react";

type Photo = { id: string; src: string; full: string; width: number | null; height: number | null; filename: string };

function Lightbox({ photos, index, onIndex, onClose }: { photos: Photo[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 sm:p-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors z-10">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      {index > 0 && (
        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center z-10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
      )}
      {index < photos.length - 1 && (
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center z-10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.full} alt={photo.filename} className="max-w-full max-h-full object-contain rounded" />
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[13px] text-white/50">{index + 1} / {photos.length}</div>
    </motion.div>
  );
}

export function ShareViewer({ id }: { id: string }) {
  const { data, isLoading, isError } = api.share.get.useQuery({ id });
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--border)]">
        <Link href="/"><Logo height={32} /></Link>
        <Link href="/dashboard" className="font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] border border-[var(--border)] px-3 py-1.5 rounded-lg transition-colors">
          Open Portapic
        </Link>
      </div>

      {isLoading ? (
        <div className="pt-32 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-[var(--border)] border-t-yellow animate-spin" />
        </div>
      ) : isError || !data ? (
        <div className="pt-40 text-center px-6">
          <h1 className="font-sans font-black text-[var(--fg)] text-2xl mb-2">Link not found</h1>
          <p className="font-serif text-sm text-[var(--fg-muted)]">This share link is invalid or was removed.</p>
        </div>
      ) : data.kind === "portfolio" ? (
        <div className="pt-32 text-center px-6">
          <h1 className="font-sans font-black text-[var(--fg)] text-2xl mb-1">{data.title}</h1>
          <p className="font-serif text-sm text-[var(--fg-muted)] mb-6">A photography portfolio.</p>
          <a href={`/p/${data.slug}`} className="btn-primary inline-flex px-5 py-2.5 rounded-xl font-sans font-bold text-sm">View portfolio →</a>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-5">
            <h1 className="font-sans font-black text-[var(--fg)] text-xl sm:text-2xl">{data.title || (data.kind === "folder" ? "Shared folder" : "Shared photos")}</h1>
            <p className="font-mono text-[12px] text-[var(--fg-muted)] mt-1 uppercase tracking-widest">{data.photos.length} {data.photos.length === 1 ? "photo" : "photos"}</p>
          </div>
          {data.photos.length === 0 ? (
            <p className="font-serif text-sm text-[var(--fg-muted)] py-16 text-center">Nothing to show here.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {data.photos.map((p, i) => (
                <button key={p.id} onClick={() => setLightbox(i)} className="relative aspect-square overflow-hidden rounded-lg bg-[var(--bg-subtle)] group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt={p.filename} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {lightbox !== null && data && data.photos[lightbox] && (
          <Lightbox photos={data.photos} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
