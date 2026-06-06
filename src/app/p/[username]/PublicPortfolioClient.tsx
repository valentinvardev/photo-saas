"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "~/components/ui/Logo";
import { api } from "~/trpc/react";
import type { PortfolioContent, Photo, Category, Folder } from "~/lib/portfolio/data";
import { flattenContentPhotos } from "~/lib/portfolio/contentPhotos";
import { PortfolioSiteRender } from "~/components/portfolio/PortfolioSiteRender";
import type { PortfolioDesign } from "~/lib/editor/store";

function isDesign(v: unknown): v is PortfolioDesign {
  return !!v && typeof v === "object" && (("nodes" in v) || ("templateId" in v) || ("palette" in v));
}

/* ── Content helpers ─────────────────────────────────────────── */

function isContent(c: unknown): c is PortfolioContent {
  if (!c || typeof c !== "object") return false;
  const v = c as Partial<PortfolioContent>;
  return Array.isArray(v.categoryIds) && !!v.categories && !!v.folders && !!v.photos;
}

const isVisible = (v: { visibility: string }) => v.visibility === "public";

/* A flat, ordered list of every public photo in the portfolio (for the lightbox). */
function collectPhotos(content: PortfolioContent): Photo[] {
  const out: Photo[] = [];
  for (const catId of content.categoryIds) {
    const cat = content.categories[catId];
    if (!cat || !isVisible(cat)) continue;
    for (const pid of cat.directPhotoIds) {
      const p = content.photos[pid];
      if (p && isVisible(p)) out.push(p);
    }
    for (const fid of cat.folderIds) {
      const fol = content.folders[fid];
      if (!fol || !isVisible(fol)) continue;
      for (const pid of fol.photoIds) {
        const p = content.photos[pid];
        if (p && isVisible(p)) out.push(p);
      }
    }
  }
  return out;
}

/* ── Photo grid tile ─────────────────────────────────────────── */
function PhotoTile({ photo, onOpen }: { photo: Photo; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group relative block w-full overflow-hidden rounded-lg bg-[var(--bg-subtle)]"
      style={{ aspectRatio: photo.title ? undefined : "1 / 1" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt={photo.title ?? ""}
        loading="lazy"
        className="w-full h-full object-cover aspect-square transition-transform duration-500 group-hover:scale-105"
      />
      {photo.title && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <span className="font-sans text-xs font-medium text-white">{photo.title}</span>
        </div>
      )}
    </button>
  );
}

/* ── Lightbox ────────────────────────────────────────────────── */
function Lightbox({ photos, index, onIndex, onClose }: {
  photos: Photo[]; index: number; onIndex: (i: number) => void; onClose: () => void;
}) {
  const photo = photos[index]!;
  const prev = useCallback(() => onIndex(Math.max(0, index - 1)), [index, onIndex]);
  const next = useCallback(() => onIndex(Math.min(photos.length - 1, index + 1)), [index, photos.length, onIndex]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose, prev, next]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      {index > 0 && (
        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </button>
      )}
      {index < photos.length - 1 && (
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo.src} alt={photo.title ?? ""} className="max-w-full max-h-full object-contain rounded" />
      {photo.title && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[11px] text-white/60">{photo.title}</div>
      )}
    </motion.div>
  );
}

/* ── Section (category) ──────────────────────────────────────── */
function CategorySection({ category, content, onOpenPhoto }: {
  category: Category; content: PortfolioContent; onOpenPhoto: (src: string) => void;
}) {
  const directPhotos = category.directPhotoIds.map((id) => content.photos[id]).filter((p): p is Photo => !!p && isVisible(p));
  const folders = category.folderIds.map((id) => content.folders[id]).filter((f): f is Folder => !!f && isVisible(f));

  const hasContent = directPhotos.length > 0 || folders.some((f) => f.photoIds.some((pid) => content.photos[pid] && isVisible(content.photos[pid]!)));
  if (!hasContent) return null;

  return (
    <section className="mb-16">
      <h2 className="font-sans font-black text-[var(--fg)] text-xl sm:text-2xl mb-1">{category.name}</h2>
      {category.description && <p className="font-serif text-sm text-[var(--fg-muted)] mb-5 max-w-xl">{category.description}</p>}
      {!category.description && <div className="mb-5" />}

      {directPhotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-8">
          {directPhotos.map((p) => <PhotoTile key={p.id} photo={p} onOpen={() => onOpenPhoto(p.src)} />)}
        </div>
      )}

      {folders.map((fol) => {
        const photos = fol.photoIds.map((id) => content.photos[id]).filter((p): p is Photo => !!p && isVisible(p));
        if (photos.length === 0) return null;
        return (
          <div key={fol.id} className="mb-8">
            <h3 className="font-mono text-[11px] uppercase tracking-widest text-[var(--fg-muted)] mb-3">{fol.title}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {photos.map((p) => <PhotoTile key={p.id} photo={p} onOpen={() => onOpenPhoto(p.src)} />)}
            </div>
          </div>
        );
      })}
    </section>
  );
}

/* ── Password gate ───────────────────────────────────────────── */
function PasswordGate({ title, wrong, onSubmit }: { title: string; wrong: boolean; onSubmit: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-6">
      <div className="w-full max-w-sm text-center">
        <div className="w-12 h-12 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center mx-auto mb-5 text-[var(--fg-muted)]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        </div>
        <h1 className="font-sans font-black text-[var(--fg)] text-xl mb-1">{title}</h1>
        <p className="font-serif text-sm text-[var(--fg-muted)] mb-6">This portfolio is private. Enter the password to view it.</p>
        <form onSubmit={(e) => { e.preventDefault(); if (pw.trim()) onSubmit(pw); }}>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoFocus
            placeholder="Password"
            className={`w-full rounded-xl px-4 py-3 font-sans text-sm text-[var(--fg)] bg-[var(--bg-card)] border ${wrong ? "border-red-500" : "border-[var(--border)]"} placeholder:text-[var(--fg-muted)] focus:outline-none focus:border-yellow transition-colors`}
          />
          {wrong && <p className="font-mono text-[11px] text-red-400 mt-2">Wrong password — try again.</p>}
          <button type="submit" className="btn-primary w-full rounded-xl py-3 font-sans font-bold text-sm mt-3">Unlock</button>
        </form>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
export function PublicPortfolioClient({ slug }: { slug: string }) {
  const [password, setPassword] = useState<string | undefined>(undefined);
  const { data, isLoading, isError } = api.portfolio.getPublicBySlug.useQuery({ slug, password });

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  // Count one view per load (once unlocked).
  const trackView = api.portfolio.trackView.useMutation();
  const tracked = useRef(false);
  useEffect(() => {
    if (data && !data.locked && !tracked.current) { tracked.current = true; trackView.mutate({ slug }); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.locked]);

  // Password gate — content is withheld by the server until the right password.
  if (data?.locked) {
    return <PasswordGate title={data.title} wrong={password !== undefined} onSubmit={setPassword} />;
  }

  // If the portfolio was built in the website builder, render that design.
  if (data && isDesign(data.editorState)) {
    return <PortfolioSiteRender design={data.editorState} galleryPhotos={flattenContentPhotos(data.content)} />;
  }

  const content = data && isContent(data.content) ? data.content : null;
  const allPhotos = content ? collectPhotos(content) : [];

  function openPhoto(src: string) {
    const idx = allPhotos.findIndex((p) => p.src === src);
    if (idx >= 0) setLightboxIdx(idx);
  }

  const ownerName = data?.user?.name ?? "";
  const initial = (data?.title ?? "?").charAt(0).toUpperCase();
  const cover = allPhotos[0]?.src;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      {/* Top bar */}
      <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <Link href="/"><Logo height={36} /></Link>
        <Link href="/dashboard" className="font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] border border-[var(--border)] px-3 py-1.5 rounded-lg transition-colors">
          Open dashboard
        </Link>
      </div>

      {isLoading ? (
        <div className="pt-32 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-[var(--border)] border-t-yellow animate-spin" />
        </div>
      ) : isError || !data ? (
        <div className="pt-40 text-center px-6">
          <h1 className="font-sans font-black text-[var(--fg)] text-2xl mb-2">Portfolio not found</h1>
          <p className="font-serif text-sm text-[var(--fg-muted)]">This portfolio doesn’t exist or hasn’t been published yet.</p>
        </div>
      ) : (
        <>
          {/* Hero */}
          <div className="relative pt-[52px]">
            <div className="relative h-56 sm:h-72 overflow-hidden bg-[var(--bg-subtle)]">
              {cover ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={cover} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--bg-subtle)] to-[var(--bg-card)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/20 to-transparent" />
            </div>
            <div className="absolute bottom-0 translate-y-1/2 left-6 sm:left-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-yellow ring-4 ring-[var(--bg)] flex items-center justify-center shadow-xl overflow-hidden">
                {data.user?.avatarUrl
                  ? // eslint-disable-next-line @next/next/no-img-element
                    <img src={data.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  : <span className="font-sans font-black text-[#111] text-3xl sm:text-4xl">{initial}</span>}
              </div>
            </div>
          </div>

          {/* Title + owner */}
          <div className="px-6 sm:px-10 mt-14 mb-10">
            <h1 className="font-sans font-black text-[var(--fg)] text-2xl sm:text-3xl">{data.title}</h1>
            {ownerName && <p className="font-mono text-xs text-[var(--fg-muted)] mt-1">by {ownerName}</p>}
          </div>

          {/* Content */}
          <div className="px-6 sm:px-10">
            {!content || allPhotos.length === 0 ? (
              <p className="font-serif text-sm text-[var(--fg-muted)] pb-24">This portfolio has no published photos yet.</p>
            ) : (
              <div className="pb-24">
                {content.categoryIds
                  .map((id) => content.categories[id])
                  .filter((c): c is Category => !!c && isVisible(c))
                  .map((cat) => (
                    <CategorySection key={cat.id} category={cat} content={content} onOpenPhoto={openPhoto} />
                  ))}
              </div>
            )}
          </div>
        </>
      )}

      <AnimatePresence>
        {lightboxIdx !== null && allPhotos[lightboxIdx] && (
          <Lightbox photos={allPhotos} index={lightboxIdx} onIndex={setLightboxIdx} onClose={() => setLightboxIdx(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
