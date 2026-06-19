"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

/**
 * Reusable confirmation dialog — a styled replacement for the native
 * window.confirm(). Render it inside an <AnimatePresence> and toggle on state.
 */
export function ConfirmModal({
  title,
  body,
  confirmLabel,
  cancelLabel,
  busy = false,
  danger = true,
  onConfirm,
  onClose,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel: string;
  busy?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && !busy) onConfirm();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, onConfirm, busy]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${danger ? "bg-red-500/10 border border-red-500/30 text-red-400" : "bg-yellow/10 border border-yellow/30 text-yellow"}`}>
              {danger ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              )}
            </span>
            <h2 className="font-sans text-base font-bold text-[var(--fg)]">{title}</h2>
          </div>
          <p className="font-serif text-sm text-[var(--fg-muted)] leading-relaxed">{body}</p>
        </div>
        <div className="flex border-t border-[var(--border)]">
          <button onClick={onClose} disabled={busy}
            className="flex-1 font-sans text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] py-3 transition-colors border-r border-[var(--border)] disabled:opacity-50">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} disabled={busy}
            className={`flex-1 font-sans text-sm font-semibold py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${danger ? "text-red-400 hover:bg-red-500/10" : "text-yellow hover:bg-yellow/10"}`}>
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
