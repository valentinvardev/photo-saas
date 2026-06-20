"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { api } from "~/trpc/react";
import { useT } from "~/components/providers/LangProvider";
import { ConfirmModal } from "~/components/ui/ConfirmModal";

function fmtDate(d: Date | string) {
  const date = new Date(d);
  return date.toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function InboxPage() {
  const { t } = useT();
  const utils = api.useUtils();
  const { data, isLoading } = api.contact.list.useQuery();
  const markRead = api.contact.markRead.useMutation();
  const del = api.contact.delete.useMutation();
  const msgs = data ?? [];
  const unread = msgs.filter((m) => !m.read).length;
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  async function refresh() {
    await Promise.all([utils.contact.list.invalidate(), utils.contact.unreadCount.invalidate()]);
  }
  async function toggleRead(id: string, read: boolean) { await markRead.mutateAsync({ id, read }); await refresh(); }
  async function confirmDelete() {
    if (!pendingDelete) return;
    await del.mutateAsync({ id: pendingDelete });
    await refresh();
    setPendingDelete(null);
  }

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="mb-4">
        <h1 className="font-sans font-black text-[var(--fg)] text-xl">{t("inbox.title")}</h1>
        <p className="font-mono text-xs text-[var(--fg-muted)] mt-0.5">
          {isLoading ? t("inbox.loading") : unread > 0 ? t("inbox.unread", { n: unread }) : t("inbox.allRead")}
        </p>
      </div>

      {/* What this is */}
      <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--fg-muted)] shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <p className="font-sans text-xs text-[var(--fg-muted)] leading-relaxed">{t("inbox.about")}</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-[var(--bg-subtle)] animate-pulse" />
          ))}
        </div>
      ) : msgs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center mb-4 text-[var(--fg-muted)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>
          </div>
          <p className="font-sans font-semibold text-[var(--fg)] mb-1">{t("inbox.emptyTitle")}</p>
          <p className="font-serif text-sm text-[var(--fg-muted)]">{t("inbox.emptyBody")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {msgs.map((m) => (
            <div key={m.id}
              className={`rounded-2xl border p-4 transition-colors ${m.read ? "border-[var(--border)] bg-[var(--bg-card)]" : "border-yellow/40 bg-yellow/5"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {!m.read && <span className="w-1.5 h-1.5 rounded-full bg-yellow shrink-0" />}
                    <span className="font-sans font-bold text-[var(--fg)] text-sm truncate">{m.name}</span>
                  </div>
                  <a href={`mailto:${m.email}`} className="font-mono text-[11px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">{m.email}</a>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="font-mono text-[10px] text-[var(--fg-muted)] mr-1">{fmtDate(m.createdAt)}</span>
                  <button onClick={() => toggleRead(m.id, !m.read)} title={m.read ? t("inbox.markUnread") : t("inbox.markRead")}
                    className="p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
                    {m.read ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </button>
                  <button onClick={() => setPendingDelete(m.id)} title={t("inbox.delete")}
                    className="p-1.5 rounded-lg text-[var(--fg-muted)] hover:text-red-400 hover:bg-[var(--bg-subtle)] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>
                  </button>
                </div>
              </div>

              <p className="font-serif text-sm text-[var(--fg)] mt-3 whitespace-pre-wrap leading-relaxed">{m.message}</p>

              <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-[var(--border)]">
                <span className="font-mono text-[10px] text-[var(--fg-muted)] truncate">{m.portfolio?.title ?? "—"}</span>
                <a href={`mailto:${m.email}?subject=${encodeURIComponent(t("inbox.replySubject"))}`}
                  className="font-mono text-[10px] text-yellow uppercase tracking-widest hover:underline shrink-0">
                  {t("inbox.reply")}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {pendingDelete && (
          <ConfirmModal
            title={t("inbox.delete")}
            body={t("inbox.deleteConfirm")}
            confirmLabel={t("inbox.delete")}
            cancelLabel={t("inbox.cancel")}
            busy={del.isPending}
            onConfirm={confirmDelete}
            onClose={() => setPendingDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
