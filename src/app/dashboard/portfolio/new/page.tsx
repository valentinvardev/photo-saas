"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LivePreviewThumbnail, DevicePreviewModal } from "~/components/dashboard/DevicePreviewModal";
import { TEMPLATE_URL, TEMPLATES } from "~/lib/portfolio/mock";
import { useUploadPhotos } from "~/lib/photo/upload";
import { api } from "~/trpc/react";
import { useT } from "~/components/providers/LangProvider";

const STEP_COUNT = 5;

type LibPhoto = { id: string; url: string; filename: string };

/** Build a portfolio content tree from the photos picked at creation time —
 *  one default category holding them, so they show up in the editor + public site. */
function buildContent(photos: LibPhoto[], categoryName: string) {
  const catId = "cat-" + Date.now();
  const photoMap: Record<string, { id: string; src: string; title?: string; visibility: string }> = {};
  const directPhotoIds: string[] = [];
  for (const p of photos) {
    const pid = "ph-" + p.id;
    photoMap[pid] = { id: pid, src: p.url, title: p.filename, visibility: "public" };
    directPhotoIds.push(pid);
  }
  return {
    categoryIds: [catId],
    categories: { [catId]: { id: catId, name: categoryName || "Gallery", slug: "gallery", folderIds: [], directPhotoIds, visibility: "public" } },
    folders: {},
    photos: photoMap,
  };
}

/* ── Step dots ───────────────────────────────────────────────── */
function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${
          i === current ? "w-5 bg-yellow" : i < current ? "w-2 bg-yellow/50" : "w-2 bg-[var(--border)]"
        }`} />
      ))}
    </div>
  );
}

/* ── Real photo picker grid (from the user's library) ────────── */
function PickerGrid({
  library, isLoading, selectedPhotos, onTogglePhoto, onUploadClick, uploading, progress,
}: {
  library: LibPhoto[]; isLoading: boolean; selectedPhotos: Set<string>;
  onTogglePhoto: (id: string) => void; onUploadClick: () => void;
  uploading: boolean; progress: { done: number; total: number };
}) {
  const { t } = useT();
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="font-mono text-[10px] text-[var(--fg-muted)]">
          {selectedPhotos.size > 0 ? t("nw.picker.selected", { n: selectedPhotos.size }) : t("nw.picker.tap")}
        </p>
        <button onClick={onUploadClick} disabled={uploading}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow text-[#111] font-sans text-[11px] font-bold hover:bg-yellow/90 disabled:opacity-50 transition-colors">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          {uploading ? `${progress.done}/${progress.total}…` : t("nw.picker.upload")}
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-4 gap-[3px]">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[4/3] bg-[var(--bg-subtle)] animate-pulse rounded" />)}
        </div>
      ) : library.length === 0 ? (
        <div className="py-10 text-center border border-dashed border-[var(--border)] rounded-xl">
          <p className="font-sans text-sm font-medium text-[var(--fg)]">{t("nw.picker.emptyTitle")}</p>
          <p className="font-sans text-xs text-[var(--fg-muted)] mt-1 mb-3">{t("nw.picker.emptyBody")}</p>
          <button onClick={onUploadClick} disabled={uploading}
            className="px-4 py-2 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold hover:bg-yellow/90 disabled:opacity-50 transition-colors">
            {uploading ? t("nw.picker.uploading", { done: progress.done, total: progress.total }) : t("nw.picker.uploadPhotos")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-[3px]">
          {library.map((ph) => {
            const on = selectedPhotos.has(ph.id);
            return (
              <button key={ph.id} onClick={() => onTogglePhoto(ph.id)}
                className={`relative aspect-[4/3] overflow-hidden rounded transition-all ${on ? "ring-2 ring-yellow ring-inset" : "hover:opacity-90"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ph.url} alt={ph.filename} className="w-full h-full object-cover" draggable={false} />
                {on && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-yellow flex items-center justify-center">
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Confirm structure panel ─────────────────────────────────── */
function StructurePreview({ photos }: { photos: LibPhoto[] }) {
  const { t } = useT();
  if (photos.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="font-sans text-sm text-[var(--fg-muted)]">{t("nw.preview.none")}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
      <div className="border border-[var(--border)] rounded-lg overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-subtle)] border-b border-[var(--border)]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          <span className="font-sans text-xs font-semibold text-[var(--fg)]">{t("nw.preview.gallery")}</span>
          <span className="font-mono text-[9px] text-[var(--fg-muted)] ml-auto">{photos.length === 1 ? t("nw.preview.photoOne") : t("nw.preview.photos", { n: photos.length })}</span>
        </div>
        <div className="grid grid-cols-6 gap-px bg-[var(--border)] p-px">
          {photos.map((ph) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img key={ph.id} src={ph.url} alt={ph.filename} className="w-full aspect-square object-cover" />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function NewPortfolioPage() {
  const router = useRouter();
  const { t } = useT();
  const [step,            setStep]            = useState(0);
  const [name,            setName]            = useState("");
  const [selectedPhotos,  setSelectedPhotos]  = useState<Set<string>>(new Set());
  const [template,        setTemplate]        = useState(TEMPLATES[0]!);
  const [domain,          setDomain]          = useState<"free" | "custom">("free");
  const [customDomain,    setCustomDomain]    = useState("");
  const [previewOpen,     setPreviewOpen]     = useState(false);
  const [newId,           setNewId]           = useState<string | null>(null);
  const [creating,        setCreating]        = useState(false);
  const [createError,     setCreateError]     = useState<string | null>(null);

  const utils = api.useUtils();
  const createMut = api.portfolio.create.useMutation();

  /* Real photo library */
  const { data: libData, isLoading: libLoading } = api.photo.list.useQuery({ limit: 200 });
  const library: LibPhoto[] = (libData?.items ?? []).map((p) => ({ id: p.id, url: p.url, filename: p.filename }));
  const { upload, uploading, progress } = useUploadPhotos();
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    try { const made = await upload(files); await utils.photo.list.invalidate();
      // auto-select freshly uploaded photos
      setSelectedPhotos((p) => { const n = new Set(p); made.forEach((m) => n.add(m.id)); return n; });
    } catch { /* hook surfaces error */ }
  }

  const pickedPhotos = library.filter((p) => selectedPhotos.has(p.id));

  /** Persist the portfolio, then advance to the success step. Retries once
   *  with a suffixed slug if the chosen slug is already taken. */
  async function createPortfolio() {
    if (creating) return;
    setCreating(true);
    setCreateError(null);
    const content = pickedPhotos.length > 0 ? buildContent(pickedPhotos, name.trim()) : undefined;
    const payload = { title: name.trim(), template, content };
    try {
      let made;
      try {
        made = await createMut.mutateAsync({ ...payload, slug });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        if (msg.toLowerCase().includes("slug")) {
          made = await createMut.mutateAsync({ ...payload, slug: `${slug}-${Math.random().toString(36).slice(2, 6)}` });
        } else {
          throw err;
        }
      }
      setNewId(made.id);
      void utils.portfolio.list.invalidate();
      setStep(4);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Could not create portfolio.");
    } finally {
      setCreating(false);
    }
  }

  const canNext   = step === 0 ? !!name.trim() : true;
  const isDone    = step === 4;
  const previewUrl = TEMPLATE_URL[template];

  function togglePhoto(id: string) {
    setSelectedPhotos((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function back() {
    if (step === 0) router.push("/dashboard/portfolio");
    else setStep(step - 1);
  }

  const slug      = name ? name.toLowerCase().replace(/\s+/g, "-") : "your-portfolio";
  const domainStr = domain === "custom" && customDomain ? customDomain : `${slug}.portapic.app`;
  const totalSel  = selectedPhotos.size;

  /* Right panel content */
  function rightPanel() {
    if (step === 0) return (
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="font-sans font-bold text-[var(--fg)] text-lg">{t("nw.right.galleryTitle")}</h2>
          <p className="font-sans text-sm text-[var(--fg-muted)] mt-0.5">{t("nw.right.galleryBody")}</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
        <PickerGrid
          library={library} isLoading={libLoading}
          selectedPhotos={selectedPhotos} onTogglePhoto={togglePhoto}
          onUploadClick={() => fileRef.current?.click()} uploading={uploading} progress={progress}
        />
      </div>
    );

    if (step === 1) return (
      <div className="flex flex-col gap-3 h-full">
        <div>
          <h2 className="font-sans font-bold text-[var(--fg)] text-lg">{t("nw.right.overviewTitle")}</h2>
          <p className="font-sans text-sm text-[var(--fg-muted)] mt-0.5">
            {totalSel > 0 ? t("nw.right.overviewWith") : t("nw.right.overviewNone")}
          </p>
        </div>
        <StructurePreview photos={pickedPhotos} />
      </div>
    );

    if (step === 2) return (
      <div className="flex flex-col gap-3 h-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans font-bold text-[var(--fg)] text-lg">{t("nw.right.previewTitle")}</h2>
            <p className="font-sans text-sm text-[var(--fg-muted)] mt-0.5">{t("nw.right.showing", { template })}</p>
          </div>
          {previewUrl && (
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex items-center gap-1.5 font-sans text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {t("nw.right.fullPreview")}
            </button>
          )}
        </div>
        {previewUrl ? (
          <div className="flex-1 overflow-hidden border border-[var(--border)] min-h-[360px]">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-card)]">
              <span className="w-2 h-2 rounded-full bg-red-400/60"/><span className="w-2 h-2 rounded-full bg-yellow/60"/><span className="w-2 h-2 rounded-full bg-green-400/60"/>
              <span className="font-mono text-[10px] text-[var(--fg-muted)] ml-2 truncate">{domainStr}</span>
            </div>
            <LivePreviewThumbnail url={previewUrl} baseWidth={1280} className="w-full h-full" />
          </div>
        ) : (
          <div className="flex-1 rounded-xl border border-dashed border-[var(--border)] flex items-center justify-center">
            <p className="font-sans text-sm text-[var(--fg-muted)]">{t("nw.right.noPreview")}</p>
          </div>
        )}
      </div>
    );

    if (step === 3) return (
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-sans font-bold text-[var(--fg)] text-lg">{t("nw.right.addressTitle")}</h2>
          <p className="font-sans text-sm text-[var(--fg-muted)] mt-0.5">{t("nw.right.addressBody")}</p>
        </div>
        <div className="border border-[var(--border)] overflow-hidden rounded-lg">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[var(--border)] bg-[var(--bg-card)]">
            <span className="w-2 h-2 rounded-full bg-red-400/60"/><span className="w-2 h-2 rounded-full bg-yellow/60"/><span className="w-2 h-2 rounded-full bg-green-400/60"/>
            <div className="flex-1 flex items-center gap-1.5 bg-[var(--bg)] border border-[var(--border)] rounded px-2 py-1 ml-1">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 shrink-0"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <span className="font-mono text-[10px] text-[var(--fg)] truncate">{domainStr}</span>
            </div>
          </div>
          <div className="p-6 bg-[var(--bg-subtle)] flex flex-col gap-3">
            <div className="h-3 w-36 bg-[var(--border)] rounded-full" />
            <div className="h-2 w-52 bg-[var(--border)]/50 rounded-full" />
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-[var(--border)]/40 rounded-sm" />)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-green-500/5 border border-green-500/20">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span className="font-mono text-[10px] text-green-400">{t("nw.right.ssl")}</span>
        </div>
      </div>
    );

    return null;
  }

  return (
    <div className="min-h-full flex flex-col p-5 sm:p-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 max-w-6xl mx-auto w-full">
        <button onClick={back} className="flex items-center gap-1.5 font-sans text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          {step === 0 ? t("nw.topBack") : t("nw.back")}
        </button>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest hidden sm:block">
            {t(`nw.steps.s${Math.min(step, STEP_COUNT - 1)}`)}
          </span>
          <StepDots current={step} total={STEP_COUNT} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto w-full flex-1">
        {isDone ? (
          <div className="flex flex-col items-center justify-center text-center gap-6 py-16">
            {/* Circle + checkmark */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
              className="relative w-20 h-20"
            >
              {/* Pulsing ring */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0] }}
                transition={{ delay: 0.35, duration: 0.9, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-yellow/30"
              />
              {/* Circle */}
              <div className="absolute inset-0 rounded-full bg-yellow/10 border border-yellow/30 flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" strokeLinecap="round">
                  <motion.path
                    d="M20 6L9 17l-5-5"
                    stroke="#fad502"
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.45, ease: "easeOut" }}
                  />
                </svg>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.35 }}
            >
              <h1 className="font-sans font-black text-[var(--fg)] text-3xl mb-2">{t("nw.done.title")}</h1>
              <p className="font-sans text-sm text-[var(--fg-muted)] leading-relaxed max-w-sm mx-auto">
                {t("nw.done.body", { name, template })}
                {totalSel > 0 && (selectedPhotos.size === 1 ? t("nw.done.photosSuffixOne") : t("nw.done.photosSuffix", { n: selectedPhotos.size }))}
              </p>
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.3 }}
            >
              <button onClick={() => router.push("/dashboard/portfolio")} className="px-5 py-2.5 rounded-xl border border-[var(--border)] font-sans text-sm font-medium text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
                {t("nw.done.goToPortfolio")}
              </button>
              <button onClick={() => router.push(newId ? `/dashboard/portfolio/${newId}` : "/dashboard/portfolio")} className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 transition-colors">
                {t("nw.done.openEditor")}
              </button>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">

            {/* Left — form */}
            <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div key={step}
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.18 }}
                  className="px-6 py-6 min-h-[280px]"
                >
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] mb-4">{t(`nw.steps.s${step}`)}</p>

                  {step === 0 && (
                    <div className="space-y-4">
                      <h1 className="font-sans font-black text-[var(--fg)] text-2xl">{t("nw.step0.title")}</h1>
                      <p className="font-sans text-sm text-[var(--fg-muted)]">{t("nw.step0.body")}</p>
                      <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) setStep(1); }}
                        placeholder={t("nw.step0.placeholder")}
                        className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:border-yellow transition-colors"
                      />
                      {totalSel > 0 && (
                        <p className="font-mono text-[10px] text-yellow">
                          {selectedPhotos.size === 1 ? t("nw.step0.selectedArrowOne") : t("nw.step0.selectedArrow", { n: selectedPhotos.size })}
                        </p>
                      )}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-4">
                      <h1 className="font-sans font-black text-[var(--fg)] text-2xl">{t("nw.step1.title")}</h1>
                      <p className="font-sans text-sm text-[var(--fg-muted)]">
                        {t("nw.step1.body")}
                      </p>
                      <div className="rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] px-4 py-3">
                        <div className="flex items-center gap-2">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          <span className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest">
                            {selectedPhotos.size === 1 ? t("nw.step1.selectedOne") : t("nw.step1.selected", { n: selectedPhotos.size })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-3">
                      <h1 className="font-sans font-black text-[var(--fg)] text-2xl">{t("nw.step2.title")}</h1>
                      <p className="font-sans text-sm text-[var(--fg-muted)]">{t("nw.step2.body")}</p>
                      <div className="flex flex-col gap-2">
                        {TEMPLATES.map((tpl) => (
                          <button key={tpl} onClick={() => setTemplate(tpl)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${template === tpl ? "border-yellow bg-yellow/5" : "border-[var(--border)] hover:border-[var(--fg-muted)]"}`}
                          >
                            <div className="w-16 h-10 overflow-hidden bg-[var(--bg-subtle)] shrink-0 border border-[var(--border)] rounded-sm">
                              {TEMPLATE_URL[tpl] && <LivePreviewThumbnail url={TEMPLATE_URL[tpl]!} baseWidth={1280} className="w-full h-full" />}
                            </div>
                            <span className="font-sans text-sm font-semibold text-[var(--fg)] flex-1">{tpl}</span>
                            {template === tpl && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fad502" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
                          </button>
                        ))}

                        {/* Browse all templates */}
                        <a
                          href="/dashboard/templates"
                          target="_blank"
                          className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-[var(--border)] text-left transition-all hover:border-yellow hover:bg-yellow/5 group"
                        >
                          <div className="w-16 h-10 bg-[var(--bg-subtle)] shrink-0 border border-[var(--border)] rounded-sm flex items-center justify-center text-[var(--fg-muted)] group-hover:text-yellow transition-colors">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                            </svg>
                          </div>
                          <span className="font-sans text-sm font-semibold text-[var(--fg-muted)] group-hover:text-[var(--fg)] flex-1 transition-colors">{t("nw.step2.browseAll")}</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--fg-muted)] group-hover:text-yellow transition-colors shrink-0">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-3">
                      <h1 className="font-sans font-black text-[var(--fg)] text-2xl">{t("nw.step3.title")}</h1>
                      <p className="font-sans text-sm text-[var(--fg-muted)]">{t("nw.step3.body")}</p>
                      <div className="flex flex-col gap-2">
                        {([
                          { id: "free" as const,   label: t("nw.step3.free"),   sub: "sofia.portapic.app" },
                          { id: "custom" as const, label: t("nw.step3.custom"), sub: "yourdomain.com", badge: "Gold" },
                        ]).map((opt) => (
                          <button key={opt.id} onClick={() => setDomain(opt.id)}
                            className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${domain === opt.id ? "border-yellow bg-yellow/5" : "border-[var(--border)] hover:border-[var(--fg-muted)]"}`}
                          >
                            <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${domain === opt.id ? "border-yellow" : "border-[var(--fg-muted)]"}`}>
                              {domain === opt.id && <div className="w-2 h-2 rounded-full bg-yellow" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-sans text-sm font-semibold text-[var(--fg)]">{opt.label}</span>
                                {opt.badge && <span className="font-mono text-[9px] bg-yellow/10 text-yellow border border-yellow/20 px-1.5 py-0.5 rounded uppercase tracking-wider">{opt.badge}</span>}
                              </div>
                              <div className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">{opt.sub}</div>
                              {opt.id === "custom" && domain === "custom" && (
                                <input value={customDomain} onChange={(e) => setCustomDomain(e.target.value)}
                                  placeholder={t("nw.step3.customPlaceholder")}
                                  className="mt-2 w-full font-mono text-xs text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors"
                                />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between">
                <button onClick={back} className="px-4 py-2 rounded-xl border border-[var(--border)] font-sans text-sm font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
                  {step === 0 ? t("nw.footer.cancel") : t("nw.footer.back")}
                </button>
                <div className="flex items-center gap-2">
                  {step === 1 && (
                    <button onClick={() => setStep(step + 1)} className="font-sans text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
                      {t("nw.footer.skip")}
                    </button>
                  )}
                  {createError && (
                    <span className="font-mono text-[10px] text-red-400 max-w-[180px] truncate" title={createError}>{createError}</span>
                  )}
                  <button
                    disabled={!canNext || creating}
                    onClick={() => { if (step === 3) void createPortfolio(); else setStep(step + 1); }}
                    className="px-5 py-2 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 disabled:opacity-40 transition-colors"
                  >
                    {creating ? t("nw.footer.creating") : step === 3 ? t("nw.footer.create") : step === 1 ? t("nw.footer.confirm") : t("nw.footer.continue")}
                  </button>
                </div>
              </div>
            </div>

            {/* Right — contextual panel */}
            <AnimatePresence mode="wait">
              <motion.div key={step}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="hidden lg:block"
              >
                {rightPanel()}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Template device preview */}
      <AnimatePresence>
        {previewOpen && previewUrl && (
          <DevicePreviewModal url={previewUrl} title={template} subtitle={t("nw.previewSubtitle", { template })} onClose={() => setPreviewOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
