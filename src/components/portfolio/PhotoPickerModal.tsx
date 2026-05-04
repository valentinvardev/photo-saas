"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/* ── Photo picker — pick one or many photos from your gallery ──
   The gallery is mocked with picsum seeds + a list of mock folders.
   Replace MOCK_GALLERY / MOCK_FOLDERS with the real gallery store
   when it lands; the component shape (left rail of folders + main
   grid) is already final. */

interface MockFolder {
  id:    string;
  label: string;
  seeds: number[];
}

const MOCK_FOLDERS: MockFolder[] = [
  { id: "recent",    label: "Recent uploads", seeds: Array.from({ length: 18 }, (_, i) => 100 + i) },
  { id: "weddings",  label: "Weddings",       seeds: Array.from({ length: 24 }, (_, i) => 200 + i) },
  { id: "editorial", label: "Editorial",      seeds: Array.from({ length: 12 }, (_, i) => 300 + i) },
  { id: "personal",  label: "Personal",       seeds: Array.from({ length: 9  }, (_, i) => 400 + i) },
  { id: "raw",       label: "Raw / unsorted", seeds: Array.from({ length: 33 }, (_, i) => 500 + i) },
];

const ALL_SEEDS = MOCK_FOLDERS.flatMap((f) => f.seeds);

export function PhotoPickerModal({ multi = true, onPick, onClose }: {
  multi?:  boolean;
  onPick:  (urls: string[]) => void;
  onClose: () => void;
}) {
  const [folderId, setFolderId] = useState<string>("all");
  const [selected, setSelected] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  const seeds = useMemo(() => {
    if (folderId === "all") return ALL_SEEDS;
    return MOCK_FOLDERS.find((f) => f.id === folderId)?.seeds ?? [];
  }, [folderId]);

  const folderRows: { id: string; label: string; count: number }[] = [
    { id: "all", label: "All photos", count: ALL_SEEDS.length },
    ...MOCK_FOLDERS.map((f) => ({ id: f.id, label: f.label, count: f.seeds.length })),
  ];

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
        className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-xl w-full max-w-4xl max-h-[85dvh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] shrink-0">
          <div>
            <h2 className="font-sans font-black text-[var(--fg)] text-base leading-none">Pick photo{multi ? "s" : ""}</h2>
            <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-1 uppercase tracking-widest">
              From your gallery · {ALL_SEEDS.length} available
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Body — folder rail + photo grid */}
        <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-[200px_1fr] overflow-hidden">

          {/* Left: folder rail */}
          <aside className="border-b sm:border-b-0 sm:border-r border-[var(--border)] bg-[var(--bg-subtle)]/40 overflow-y-auto">
            <div className="p-2 flex flex-col gap-0.5">
              {folderRows.map((f) => {
                const active = folderId === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFolderId(f.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-left font-sans text-xs transition-colors ${
                      active
                        ? "bg-[var(--bg-card)] text-[var(--fg)] font-semibold"
                        : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-card)]"
                    }`}
                  >
                    {f.id === "all" ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                    )}
                    <span className="flex-1 truncate">{f.label}</span>
                    <span className="font-mono text-[9px] text-[var(--fg-muted)] shrink-0">{f.count}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right: photo grid */}
          <div className="overflow-y-auto p-4">
            {seeds.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-[var(--fg-muted)]">
                <div>
                  <p className="font-sans text-sm font-semibold text-[var(--fg)]">This folder is empty</p>
                  <p className="font-sans text-xs mt-1">Pick a different folder on the left.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
                {seeds.map((seed) => {
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
            )}
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
