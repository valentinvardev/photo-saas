"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ── Photo picker — pick one or many photos from your gallery ──
   For now the gallery is mocked with picsum seeds. Wire to a real
   gallery store when available. */

const GALLERY_SEEDS = Array.from({ length: 60 }, (_, i) => 10 + i);

export function PhotoPickerModal({ multi = true, onPick, onClose }: {
  multi?:  boolean;
  onPick:  (urls: string[]) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  function toggle(seed: number) {
    if (!multi) {
      onPick([`https://picsum.photos/seed/${seed}/600/800`]);
      onClose();
      return;
    }
    setSelected((p) => { const n = new Set(p); n.has(seed) ? n.delete(seed) : n.add(seed); return n; });
  }

  function commit() {
    if (selected.size === 0) return;
    onPick([...selected].map((s) => `https://picsum.photos/seed/${s}/600/800`));
    onClose();
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
        className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-xl w-full max-w-3xl max-h-[85dvh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] shrink-0">
          <div>
            <h2 className="font-sans font-black text-[var(--fg)] text-base leading-none">Pick photo{multi ? "s" : ""}</h2>
            <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-1 uppercase tracking-widest">
              From your gallery · {GALLERY_SEEDS.length} available
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {GALLERY_SEEDS.map((seed) => {
              const isSelected = selected.has(seed);
              return (
                <button
                  key={seed}
                  onClick={() => toggle(seed)}
                  className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                    isSelected ? "border-yellow ring-2 ring-yellow/30" : "border-transparent hover:border-[var(--fg-muted)]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`https://picsum.photos/seed/${seed}/300/300`} alt="" className="w-full h-full object-cover" />
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
