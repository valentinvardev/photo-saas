"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LivePreviewThumbnail, DevicePreviewModal } from "~/components/dashboard/DevicePreviewModal";
import { TEMPLATE_URL, TEMPLATES } from "~/lib/portfolio/mock";

const STEPS = ["Name & Photos", "Structure", "Template", "Domain", "Done"] as const;

/* ── Mock data ───────────────────────────────────────────────── */
const MOCK_FOLDERS = [
  { id: "f1", name: "Weddings",   seeds: ["w1","w2","w3","w4","w5","w6"] },
  { id: "f2", name: "Portraits",  seeds: ["p1","p2","p3","p4"] },
  { id: "f3", name: "Landscapes", seeds: ["l1","l2","l3","l4","l5"] },
  { id: "f4", name: "Commercial", seeds: ["c1","c2","c3"] },
];
const STANDALONE = [
  { id: "s1", seed: "sp1" },{ id: "s2", seed: "sp2" },
  { id: "s3", seed: "sp3" },{ id: "s4", seed: "sp4" },
  { id: "s5", seed: "sp5" },{ id: "s6", seed: "sp6" },
];

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

/* ── Photo + folder picker grid ──────────────────────────────── */
function PickerGrid({
  selectedFolders, selectedPhotos,
  onToggleFolder, onTogglePhoto,
}: {
  selectedFolders: Set<string>; selectedPhotos: Set<string>;
  onToggleFolder: (id: string) => void; onTogglePhoto: (id: string) => void;
}) {
  const totalSelected = selectedFolders.size + selectedPhotos.size;

  return (
    <div>
      {/* All tiles same size — no col-span mixing */}
      <div className="grid grid-cols-4 gap-[3px]">

        {MOCK_FOLDERS.map((folder) => {
          const on = selectedFolders.has(folder.id);
          return (
            <button
              key={folder.id}
              onClick={() => onToggleFolder(folder.id)}
              className={`relative aspect-[4/3] overflow-hidden transition-all ${
                on ? "ring-2 ring-yellow ring-inset" : "hover:opacity-90"
              }`}
            >
              {/* 2×2 photo collage */}
              <div className="absolute inset-0 grid grid-cols-2 gap-[1px]">
                {folder.seeds.slice(0, 4).map((seed, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img key={i} src={`https://picsum.photos/seed/${seed}/120/90?grayscale`} alt="" className="w-full h-full object-cover" draggable={false} />
                ))}
              </div>
              {/* Folder name overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 py-1 flex items-center gap-1">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                <span className="font-sans text-[9px] font-semibold text-white truncate">{folder.name}</span>
                <span className="font-mono text-[8px] text-white/50 ml-auto shrink-0">{folder.seeds.length}</span>
              </div>
              {on && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-yellow flex items-center justify-center">
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
              )}
            </button>
          );
        })}

        {STANDALONE.map((ph) => {
          const on = selectedPhotos.has(ph.id);
          return (
            <button
              key={ph.id}
              onClick={() => onTogglePhoto(ph.id)}
              className={`relative aspect-[4/3] overflow-hidden transition-all ${
                on ? "ring-2 ring-yellow ring-inset" : "hover:opacity-90"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://picsum.photos/seed/${ph.seed}/300/225?grayscale`} alt="" className="w-full h-full object-cover" draggable={false} />
              {on && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-yellow flex items-center justify-center">
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="4" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
              )}
            </button>
          );
        })}

      </div>

      <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-2">
        {totalSelected > 0
          ? `${selectedFolders.size > 0 ? `${selectedFolders.size} folder${selectedFolders.size !== 1 ? "s" : ""}` : ""}${selectedFolders.size > 0 && selectedPhotos.size > 0 ? " + " : ""}${selectedPhotos.size > 0 ? `${selectedPhotos.size} photo${selectedPhotos.size !== 1 ? "s" : ""}` : ""} selected`
          : "Select folders or individual photos — you can add more later"}
      </p>
    </div>
  );
}

/* ── Confirm structure panel ─────────────────────────────────── */
function StructurePreview({
  selectedFolders, selectedPhotos,
}: {
  selectedFolders: Set<string>; selectedPhotos: Set<string>;
}) {
  const folders = MOCK_FOLDERS.filter((f) => selectedFolders.has(f.id));
  const photos  = STANDALONE.filter((p) => selectedPhotos.has(p.id));

  return (
    <div className="flex flex-col gap-4 overflow-y-auto max-h-[60vh]">
      {folders.map((folder) => (
        <div key={folder.id} className="border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-subtle)] border-b border-[var(--border)]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
            <span className="font-sans text-xs font-semibold text-[var(--fg)]">{folder.name}</span>
            <span className="font-mono text-[9px] text-[var(--fg-muted)] ml-auto">{folder.seeds.length} photos</span>
          </div>
          <div className="grid grid-cols-6 gap-px bg-[var(--border)] p-px">
            {folder.seeds.map((seed) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={seed} src={`https://picsum.photos/seed/${seed}/80/80?grayscale`} alt="" className="w-full aspect-square object-cover" />
            ))}
          </div>
        </div>
      ))}

      {photos.length > 0 && (
        <div className="border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 bg-[var(--bg-subtle)] border-b border-[var(--border)]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span className="font-sans text-xs font-semibold text-[var(--fg)]">Unsorted photos</span>
            <span className="font-mono text-[9px] text-[var(--fg-muted)] ml-auto">{photos.length} photos</span>
          </div>
          <div className="grid grid-cols-6 gap-px bg-[var(--border)] p-px">
            {photos.map((ph) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={ph.id} src={`https://picsum.photos/seed/${ph.seed}/80/80?grayscale`} alt="" className="w-full aspect-square object-cover" />
            ))}
          </div>
        </div>
      )}

      {folders.length === 0 && photos.length === 0 && (
        <div className="py-8 text-center">
          <p className="font-sans text-sm text-[var(--fg-muted)]">No content selected — you can add photos in the editor.</p>
        </div>
      )}
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function NewPortfolioPage() {
  const router = useRouter();
  const [step,            setStep]            = useState(0);
  const [name,            setName]            = useState("");
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(new Set());
  const [selectedPhotos,  setSelectedPhotos]  = useState<Set<string>>(new Set());
  const [template,        setTemplate]        = useState(TEMPLATES[0]!);
  const [domain,          setDomain]          = useState<"free" | "custom">("free");
  const [customDomain,    setCustomDomain]    = useState("");
  const [previewOpen,     setPreviewOpen]     = useState(false);

  const canNext   = step === 0 ? !!name.trim() : true;
  const isDone    = step === 4;
  const previewUrl = TEMPLATE_URL[template];

  function toggleFolder(id: string) {
    setSelectedFolders((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function togglePhoto(id: string) {
    setSelectedPhotos((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function back() {
    if (step === 0) router.push("/dashboard/portfolio");
    else setStep(step - 1);
  }

  const slug      = name ? name.toLowerCase().replace(/\s+/g, "-") : "your-portfolio";
  const domainStr = domain === "custom" && customDomain ? customDomain : `${slug}.portapic.app`;
  const totalSel  = selectedFolders.size + selectedPhotos.size;

  /* Right panel content */
  function rightPanel() {
    if (step === 0) return (
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="font-sans font-bold text-[var(--fg)] text-lg">Your gallery</h2>
          <p className="font-sans text-sm text-[var(--fg-muted)] mt-0.5">Select folders or individual photos to include.</p>
        </div>
        <PickerGrid
          selectedFolders={selectedFolders} selectedPhotos={selectedPhotos}
          onToggleFolder={toggleFolder} onTogglePhoto={togglePhoto}
        />
      </div>
    );

    if (step === 1) return (
      <div className="flex flex-col gap-3 h-full">
        <div>
          <h2 className="font-sans font-bold text-[var(--fg)] text-lg">Content overview</h2>
          <p className="font-sans text-sm text-[var(--fg-muted)] mt-0.5">
            {totalSel > 0 ? "Your portfolio will be organized like this." : "Nothing selected yet — that's fine, add photos later."}
          </p>
        </div>
        <StructurePreview selectedFolders={selectedFolders} selectedPhotos={selectedPhotos} />
      </div>
    );

    if (step === 2) return (
      <div className="flex flex-col gap-3 h-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans font-bold text-[var(--fg)] text-lg">Live preview</h2>
            <p className="font-sans text-sm text-[var(--fg-muted)] mt-0.5">Showing <strong>{template}</strong>.</p>
          </div>
          {previewUrl && (
            <button
              onClick={() => setPreviewOpen(true)}
              className="flex items-center gap-1.5 font-sans text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Full preview
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
            <p className="font-sans text-sm text-[var(--fg-muted)]">No preview available</p>
          </div>
        )}
      </div>
    );

    if (step === 3) return (
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-sans font-bold text-[var(--fg)] text-lg">Your address</h2>
          <p className="font-sans text-sm text-[var(--fg-muted)] mt-0.5">The URL clients will use to reach your portfolio.</p>
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
          <span className="font-mono text-[10px] text-green-400">SSL secured · Free forever</span>
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
          {step === 0 ? "Portfolio" : "Back"}
        </button>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest hidden sm:block">
            {STEPS[Math.min(step, STEPS.length - 1)]}
          </span>
          <StepDots current={step} total={STEPS.length} />
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
              <h1 className="font-sans font-black text-[var(--fg)] text-3xl mb-2">Ready to go!</h1>
              <p className="font-sans text-sm text-[var(--fg-muted)] leading-relaxed max-w-sm mx-auto">
                <span className="text-[var(--fg)] font-medium">{name}</span> is set up with the {template} template
                {totalSel > 0 && ` · ${selectedFolders.size > 0 ? `${selectedFolders.size} folder${selectedFolders.size !== 1 ? "s" : ""}` : ""}${selectedFolders.size > 0 && selectedPhotos.size > 0 ? " + " : ""}${selectedPhotos.size > 0 ? `${selectedPhotos.size} photo${selectedPhotos.size !== 1 ? "s" : ""}` : ""}`}.
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
                Go to portfolio
              </button>
              <button onClick={() => router.push("/dashboard/portfolio/1")} className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 transition-colors">
                Open editor →
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
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] mb-4">{STEPS[step]}</p>

                  {step === 0 && (
                    <div className="space-y-4">
                      <h1 className="font-sans font-black text-[var(--fg)] text-2xl">Name your portfolio</h1>
                      <p className="font-sans text-sm text-[var(--fg-muted)]">This is how it'll appear in your dashboard and browser tab.</p>
                      <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) setStep(1); }}
                        placeholder="Sofia Chen Photography"
                        className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:border-yellow transition-colors"
                      />
                      {totalSel > 0 && (
                        <p className="font-mono text-[10px] text-yellow">
                          {selectedFolders.size > 0 && `${selectedFolders.size} folder${selectedFolders.size !== 1 ? "s" : ""}`}
                          {selectedFolders.size > 0 && selectedPhotos.size > 0 && " + "}
                          {selectedPhotos.size > 0 && `${selectedPhotos.size} photo${selectedPhotos.size !== 1 ? "s" : ""}`} selected →
                        </p>
                      )}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-4">
                      <h1 className="font-sans font-black text-[var(--fg)] text-2xl">Confirm structure</h1>
                      <p className="font-sans text-sm text-[var(--fg-muted)]">
                        Review how your portfolio will be organized. You can rename folders and reorganize anytime in the editor.
                      </p>
                      <div className="rounded-xl bg-[var(--bg-subtle)] border border-[var(--border)] px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                          <span className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest">
                            {selectedFolders.size} folder{selectedFolders.size !== 1 ? "s" : ""} · {selectedPhotos.size} unsorted photo{selectedPhotos.size !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          {MOCK_FOLDERS.filter((f) => selectedFolders.has(f.id)).map((f) => (
                            <div key={f.id} className="flex items-center gap-2 text-[var(--fg)] font-sans text-xs py-0.5">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                              {f.name}
                              <span className="text-[var(--fg-muted)] ml-auto">{f.seeds.length} photos</span>
                            </div>
                          ))}
                          {selectedPhotos.size > 0 && (
                            <div className="flex items-center gap-2 text-[var(--fg-muted)] font-sans text-xs py-0.5">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                              Unsorted
                              <span className="ml-auto">{selectedPhotos.size} photos</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-3">
                      <h1 className="font-sans font-black text-[var(--fg)] text-2xl">Pick a template</h1>
                      <p className="font-sans text-sm text-[var(--fg-muted)]">Choose what feels closest to your style.</p>
                      <div className="flex flex-col gap-2">
                        {TEMPLATES.map((t) => (
                          <button key={t} onClick={() => setTemplate(t)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${template === t ? "border-yellow bg-yellow/5" : "border-[var(--border)] hover:border-[var(--fg-muted)]"}`}
                          >
                            <div className="w-16 h-10 overflow-hidden bg-[var(--bg-subtle)] shrink-0 border border-[var(--border)] rounded-sm">
                              {TEMPLATE_URL[t] && <LivePreviewThumbnail url={TEMPLATE_URL[t]!} baseWidth={1280} className="w-full h-full" />}
                            </div>
                            <span className="font-sans text-sm font-semibold text-[var(--fg)] flex-1">{t}</span>
                            {template === t && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fad502" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
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
                          <span className="font-sans text-sm font-semibold text-[var(--fg-muted)] group-hover:text-[var(--fg)] flex-1 transition-colors">Browse all templates</span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--fg-muted)] group-hover:text-yellow transition-colors shrink-0">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-3">
                      <h1 className="font-sans font-black text-[var(--fg)] text-2xl">Choose your domain</h1>
                      <p className="font-sans text-sm text-[var(--fg-muted)]">Start free, upgrade any time.</p>
                      <div className="flex flex-col gap-2">
                        {([
                          { id: "free" as const,   label: "Free subdomain", sub: "sofia.portapic.app" },
                          { id: "custom" as const, label: "Custom domain",   sub: "yourdomain.com", badge: "Gold" },
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
                                  placeholder="yourdomain.com"
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
                  {step === 0 ? "Cancel" : "← Back"}
                </button>
                <div className="flex items-center gap-2">
                  {step === 1 && (
                    <button onClick={() => setStep(step + 1)} className="font-sans text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
                      Skip for now
                    </button>
                  )}
                  <button disabled={!canNext} onClick={() => setStep(step + 1)}
                    className="px-5 py-2 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 disabled:opacity-40 transition-colors"
                  >
                    {step === 3 ? "Create portfolio" : step === 1 ? "Confirm →" : "Continue →"}
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
          <DevicePreviewModal url={previewUrl} title={template} subtitle={`${template} template`} onClose={() => setPreviewOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
