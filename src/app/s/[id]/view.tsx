"use client";

import { useState } from "react";
import { Logo } from "~/components/ui/Logo";
import { motion, AnimatePresence } from "framer-motion";

/* Mock shared photos — in production these come from the DB by shareId.
   The seeds mirror what the gallery uses so thumbnails feel consistent. */
const MOCK_PHOTOS = [
  { id: "1", seed: 11, name: "DSC_0847.jpg",       w: 5472, h: 3648 },
  { id: "2", seed: 22, name: "Portrait_01.jpg",     w: 4000, h: 5000 },
  { id: "3", seed: 33, name: "Golden_Hour.jpg",     w: 6000, h: 4000 },
  { id: "4", seed: 55, name: "Commercial_02.jpg",   w: 4500, h: 3000 },
  { id: "5", seed: 66, name: "Portrait_Studio.jpg", w: 3840, h: 5760 },
  { id: "6", seed: 77, name: "Events_01.jpg",       w: 5000, h: 3333 },
];

const MOCK_SENDER = "Sofia Chen";
const MOCK_EXPIRES = "7 days";

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}

function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: typeof MOCK_PHOTOS;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const photo = photos[index]!;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-black"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-mono text-[11px] text-white/50 truncate max-w-[60%]">
          {photo.name} · {index + 1} / {photos.length}
        </span>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Image */}
      <div className="flex-1 flex items-center justify-center p-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/${photo.seed}/1400/900?grayscale`}
          alt={photo.name}
          draggable={false}
          onClick={(e) => e.stopPropagation()}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Nav arrows */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/10 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
      )}
      {index < photos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/10 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      )}
    </motion.div>
  );
}

export function ShareView({ shareId }: { shareId: string }) {
  void shareId;
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <div className="min-h-dvh bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-white/8">
        <Logo height={40} />
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest hidden sm:block">
            View only · expires in {MOCK_EXPIRES}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/6 border border-white/10 text-white/50">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {MOCK_EXPIRES}
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Sender info */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-yellow flex items-center justify-center shrink-0">
              <span className="font-sans font-black text-[#111] text-[11px]">
                {MOCK_SENDER.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-sans text-sm font-semibold text-white leading-none">{MOCK_SENDER}</p>
              <p className="font-mono text-[10px] text-white/40 mt-0.5">shared {MOCK_PHOTOS.length} photos with you</p>
            </div>
          </div>
        </div>

        {/* Photo grid */}
        <div className="columns-2 sm:columns-3 gap-2 space-y-2">
          {MOCK_PHOTOS.map((photo, idx) => (
            <button
              key={photo.id}
              onClick={() => setLightboxIdx(idx)}
              className="group relative w-full overflow-hidden rounded-lg block break-inside-avoid"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://picsum.photos/seed/${photo.seed}/600/800?grayscale`}
                alt={photo.name}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <ExpandIcon />
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center">
          <p className="font-mono text-[10px] text-white/25 uppercase tracking-widest">
            This link will expire automatically · Powered by Portapic
          </p>
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            photos={MOCK_PHOTOS}
            index={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
            onPrev={() => setLightboxIdx((i) => (i !== null && i > 0 ? i - 1 : i))}
            onNext={() => setLightboxIdx((i) => (i !== null && i < MOCK_PHOTOS.length - 1 ? i + 1 : i))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
