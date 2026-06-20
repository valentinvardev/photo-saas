"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "~/trpc/react";
import { useT } from "~/components/providers/LangProvider";

/** Reusable share dialog — shows the public link, copy, and "send to chat". */
export function ShareModal({ url, title, onClose }: { url: string; title?: string; onClose: () => void }) {
  const { t } = useT();
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const sendChat = api.chat.send.useMutation();

  async function copy() {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* ignore */ }
  }
  async function sendToChat() {
    try { await sendChat.mutateAsync({ body: `${title ? title + " — " : ""}${url}` }); setSent(true); } catch { /* ignore */ }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-8 h-8 rounded-lg bg-yellow/10 border border-yellow/30 flex items-center justify-center text-yellow">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>
            </span>
            <div className="min-w-0">
              <h2 className="font-sans text-base font-bold text-[var(--fg)]">{t("share.title")}</h2>
              {title && <p className="font-sans text-[11px] text-[var(--fg-muted)] truncate">{title}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5">
            <span className="flex-1 min-w-0 font-mono text-xs text-[var(--fg-muted)] truncate">{url}</span>
            <button onClick={copy} className="shrink-0 px-2.5 py-1 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold hover:bg-yellow/90 transition-colors">
              {copied ? t("share.copied") : t("share.copy")}
            </button>
          </div>
        </div>
        <div className="flex border-t border-[var(--border)]">
          <button onClick={onClose} className="flex-1 font-sans text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] py-3 transition-colors border-r border-[var(--border)]">
            {t("share.close")}
          </button>
          <button onClick={sendToChat} disabled={sent || sendChat.isPending}
            className="flex-1 flex items-center justify-center gap-1.5 font-sans text-sm font-semibold text-yellow hover:bg-yellow/10 py-3 transition-colors disabled:opacity-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
            {sent ? t("share.sentToChat") : t("share.sendToChat")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
