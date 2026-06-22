"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "~/trpc/react";
import { useT } from "~/components/providers/LangProvider";

type Tab = "photos" | "folders" | "portfolios";

/** Pick a photo selection, a folder, or a portfolio and share it into the chat. */
export function ChatSharePicker({ onClose, onShared }: { onClose: () => void; onShared: (url: string, title?: string) => void }) {
  const { t } = useT();
  const [tab, setTab] = useState<Tab>("photos");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const photos     = api.photo.list.useQuery({ limit: 60 });
  const folders    = api.photo.listFolders.useQuery();
  const portfolios = api.portfolio.list.useQuery();
  const createShare = api.share.create.useMutation();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  function toggle(id: string) {
    setSelected((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }
  async function sharePhotos() {
    if (selected.size === 0 || createShare.isPending) return;
    try { const r = await createShare.mutateAsync({ kind: "photos", photoIds: [...selected] }); onShared(`${origin}/v/${r.id}`); onClose(); } catch { /* ignore */ }
  }
  async function shareFolder(id: string, name: string) {
    if (createShare.isPending) return;
    try { const r = await createShare.mutateAsync({ kind: "folder", folderId: id }); onShared(`${origin}/v/${r.id}`, name); onClose(); } catch { /* ignore */ }
  }
  function sharePortfolio(slug: string, title: string) {
    onShared(`${origin}/p/${slug}`, title); onClose();
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "photos",     label: t("share.tabPhotos") },
    { id: "folders",    label: t("share.tabFolders") },
    { id: "portfolios", label: t("share.tabPortfolios") },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md max-h-[80vh] flex flex-col bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header + tabs */}
        <div className="px-4 pt-4 shrink-0">
          <h2 className="font-sans text-base font-bold text-[var(--fg)] mb-3">{t("share.title")}</h2>
          <div className="flex gap-1 p-1 rounded-xl bg-[var(--bg-subtle)]">
            {tabs.map((tb) => (
              <button key={tb.id} onClick={() => setTab(tb.id)}
                className={`flex-1 py-1.5 rounded-lg font-sans text-xs font-semibold transition-colors ${tab === tb.id ? "bg-[var(--bg-card)] text-[var(--fg)] shadow-sm" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"}`}>
                {tb.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === "photos" && (
            photos.isLoading ? <Spinner /> :
            (photos.data?.items.length ?? 0) === 0 ? <Empty text={t("share.emptyPhotos")} /> : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {photos.data!.items.map((p) => {
                  const on = selected.has(p.id);
                  return (
                    <button key={p.id} onClick={() => toggle(p.id)}
                      className={`relative aspect-square rounded-lg overflow-hidden bg-[var(--bg-subtle)] ${on ? "ring-2 ring-yellow" : ""}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.url} alt={p.filename} loading="lazy" className="w-full h-full object-cover" />
                      {on && <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-yellow text-[#111] flex items-center justify-center"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>}
                    </button>
                  );
                })}
              </div>
            )
          )}

          {tab === "folders" && (
            folders.isLoading ? <Spinner /> :
            (folders.data?.length ?? 0) === 0 ? <Empty text={t("share.emptyFolders")} /> : (
              <div className="flex flex-col gap-1.5">
                {folders.data!.map((f) => (
                  <button key={f.id} onClick={() => shareFolder(f.id, f.name)} disabled={createShare.isPending}
                    className="flex items-center gap-3 p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-subtle)] disabled:opacity-50 transition-colors text-left">
                    <span className="w-11 h-11 rounded-lg overflow-hidden bg-[var(--bg-subtle)] shrink-0 flex items-center justify-center">
                      {f.coverUrl
                        ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={f.coverUrl} alt="" className="w-full h-full object-cover" />
                        : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--fg-muted)" strokeWidth="1.5"><path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-sans text-sm font-medium text-[var(--fg)] truncate">{f.name}</div>
                      <div className="font-mono text-[12px] text-[var(--fg-muted)]">{f.count} {f.count === 1 ? t("share.photoOne") : t("share.photoN")}</div>
                    </div>
                  </button>
                ))}
              </div>
            )
          )}

          {tab === "portfolios" && (
            portfolios.isLoading ? <Spinner /> :
            (portfolios.data?.length ?? 0) === 0 ? <Empty text={t("share.emptyPortfolios")} /> : (
              <div className="flex flex-col gap-1.5">
                {portfolios.data!.map((p) => {
                  const published = p.status === "published";
                  return (
                    <button key={p.id} onClick={() => published && sharePortfolio(p.slug, p.title)} disabled={!published}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-subtle)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left">
                      <span className="w-9 h-9 rounded-lg bg-[var(--bg-subtle)] shrink-0 flex items-center justify-center text-[var(--fg-muted)]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="font-sans text-sm font-medium text-[var(--fg)] truncate">{p.title}</div>
                        <div className="font-mono text-[12px] text-[var(--fg-muted)]">{published ? `/p/${p.slug}` : t("share.draftOnly")}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="flex border-t border-[var(--border)] shrink-0">
          <button onClick={onClose} className="flex-1 font-sans text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] py-3 transition-colors border-r border-[var(--border)]">
            {t("share.close")}
          </button>
          <button onClick={sharePhotos} disabled={tab !== "photos" || selected.size === 0 || createShare.isPending}
            className="flex-1 font-sans text-sm font-semibold text-yellow hover:bg-yellow/10 py-3 transition-colors disabled:opacity-40">
            {tab === "photos" && selected.size > 0 ? t("share.sharePhotosN", { n: selected.size }) : t("share.sendToChat")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Spinner() {
  return <div className="py-16 flex justify-center"><div className="w-5 h-5 rounded-full border-2 border-[var(--border)] border-t-yellow animate-spin" /></div>;
}
function Empty({ text }: { text: string }) {
  return <p className="py-16 text-center font-serif text-sm text-[var(--fg-muted)]">{text}</p>;
}
