"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDeliveryStore } from "~/lib/delivery/store";

const STEPS = ["Client & Photos", "Access", "Done"] as const;

const MOCK_FOLDERS = [
  { id: "f1", name: "Ceremony",  seeds: ["cr1","cr2","cr3","cr4","cr5","cr6"] },
  { id: "f2", name: "Reception", seeds: ["rc1","rc2","rc3","rc4"] },
  { id: "f3", name: "Portraits", seeds: ["pt1","pt2","pt3","pt4","pt5"] },
];
const STANDALONE = [
  { id: "s1", seed: "dl1" },{ id: "s2", seed: "dl2" },
  { id: "s3", seed: "dl3" },{ id: "s4", seed: "dl4" },
  { id: "s5", seed: "dl5" },{ id: "s6", seed: "dl6" },
];

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

function PickerGrid({
  selectedFolders, selectedPhotos,
  onToggleFolder, onTogglePhoto,
}: {
  selectedFolders: Set<string>; selectedPhotos: Set<string>;
  onToggleFolder: (id: string) => void; onTogglePhoto: (id: string) => void;
}) {
  return (
    <div>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {MOCK_FOLDERS.map((folder) => {
          const on = selectedFolders.has(folder.id);
          return (
            <button key={folder.id} onClick={() => onToggleFolder(folder.id)}
              className={`relative overflow-hidden transition-all col-span-2 ${on ? "ring-2 ring-yellow ring-inset" : "hover:opacity-90"}`}
              style={{ aspectRatio: "8/3" }}
            >
              <div className="absolute inset-0 grid grid-cols-2 gap-[2px]">
                {folder.seeds.slice(0, 4).map((seed, i) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img key={i} src={`https://picsum.photos/seed/${seed}/200/150?grayscale`} alt="" className="w-full h-full object-cover" draggable={false} />
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-2 gap-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                <span className="font-sans text-[11px] font-semibold text-white truncate">{folder.name}</span>
                <span className="font-mono text-[9px] text-white/60 ml-auto shrink-0">{folder.seeds.length}</span>
              </div>
              {on && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-yellow flex items-center justify-center">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
              )}
            </button>
          );
        })}
        {STANDALONE.map((ph) => {
          const on = selectedPhotos.has(ph.id);
          return (
            <button key={ph.id} onClick={() => onTogglePhoto(ph.id)}
              className={`relative overflow-hidden transition-all ${on ? "ring-2 ring-yellow ring-inset" : "hover:opacity-90"}`}
              style={{ aspectRatio: "4/3" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://picsum.photos/seed/${ph.seed}/300/225?grayscale`} alt="" className="w-full h-full object-cover" draggable={false} />
              {on && (
                <div className="absolute inset-0 bg-yellow/15 flex items-start justify-end p-1">
                  <div className="w-4 h-4 rounded-full bg-yellow flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-2">
        {(selectedFolders.size + selectedPhotos.size) > 0
          ? `${selectedFolders.size > 0 ? `${selectedFolders.size} folder${selectedFolders.size !== 1 ? "s" : ""}` : ""}${selectedFolders.size > 0 && selectedPhotos.size > 0 ? " + " : ""}${selectedPhotos.size > 0 ? `${selectedPhotos.size} photo${selectedPhotos.size !== 1 ? "s" : ""}` : ""} selected`
          : "Select folders or individual photos for this delivery"}
      </p>
    </div>
  );
}

export default function NewDeliveryPage() {
  const router = useRouter();
  const add    = useDeliveryStore((s) => s.add);

  const [step,            setStep]            = useState(0);
  const [title,           setTitle]           = useState("");
  const [client,          setClient]          = useState("");
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(new Set());
  const [selectedPhotos,  setSelectedPhotos]  = useState<Set<string>>(new Set());
  const [mode,            setMode]            = useState<"gift" | "direct">("gift");
  const [access,          setAccess]          = useState<"public" | "password">("public");

  const canNext  = step === 0 ? !!(title.trim() && client.trim()) : true;
  const isDone   = step === 2;
  const totalSel = selectedFolders.size + selectedPhotos.size;

  function toggleFolder(id: string) {
    setSelectedFolders((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function togglePhoto(id: string) {
    setSelectedPhotos((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function back() {
    if (step === 0) router.push("/dashboard/delivery");
    else setStep(step - 1);
  }

  function finish() {
    const newPage = add(title.trim(), client.trim());
    router.push(`/delivery/edit/${newPage.id}`);
  }

  /* ── Right panel ── */
  function rightPanel() {
    if (step === 0) return (
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="font-sans font-bold text-[var(--fg)] text-lg">Select photos to deliver</h2>
          <p className="font-sans text-sm text-[var(--fg-muted)] mt-0.5">Pick from your gallery. You can add or remove photos later.</p>
        </div>
        <PickerGrid
          selectedFolders={selectedFolders} selectedPhotos={selectedPhotos}
          onToggleFolder={toggleFolder} onTogglePhoto={togglePhoto}
        />
      </div>
    );

    if (step === 1) {
      const isGift   = mode === "gift";
      const isPublic = access === "public";
      return (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-sans font-bold text-[var(--fg)] text-lg">What your client sees</h2>
            <p className="font-sans text-sm text-[var(--fg-muted)] mt-0.5">A preview of how {client || "your client"} will receive the gallery.</p>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-yellow flex items-center justify-center shrink-0">
                  <span className="font-sans font-black text-[#111] text-[10px]">S</span>
                </div>
                <div>
                  <p className="font-sans text-xs font-semibold text-[var(--fg)] leading-none">{title || "Gallery title"}</p>
                  <p className="font-sans text-[10px] text-[var(--fg-muted)] mt-0.5">from Sofia Chen</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`inline-flex items-center gap-1 font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                  isPublic ? "border-green-400/30 bg-green-400/10 text-green-400" : "border-yellow/30 bg-yellow/10 text-yellow"
                }`}>
                  {isPublic ? "Public" : "Protected"}
                </span>
                <span className={`inline-flex font-mono text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                  isGift ? "border-[var(--border)] text-[var(--fg-muted)]" : "border-yellow/30 bg-yellow/10 text-yellow"
                }`}>
                  {isGift ? "Free" : "For sale"}
                </span>
              </div>
            </div>

            {/* Photo grid — varied sizes, no radius */}
            <div className="flex flex-col gap-[3px] bg-[var(--bg-subtle)] p-[3px]">
              {/* Row 1: single wide landscape */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://picsum.photos/seed/dlv_h1/800/350?grayscale" alt="" className="w-full object-cover" style={{ height: 140 }} draggable={false} />

              {/* Row 2: two side-by-side */}
              <div className="grid grid-cols-2 gap-[3px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://picsum.photos/seed/dlv_h2/400/300?grayscale" alt="" className="w-full object-cover" style={{ height: 100 }} draggable={false} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://picsum.photos/seed/dlv_h3/400/300?grayscale" alt="" className="w-full object-cover" style={{ height: 100 }} draggable={false} />
              </div>

              {/* Row 3: three equal */}
              <div className="grid grid-cols-3 gap-[3px]">
                {["dlv_h4","dlv_h5","dlv_h6"].map((seed) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img key={seed} src={`https://picsum.photos/seed/${seed}/280/210?grayscale`} alt="" className="w-full object-cover" style={{ height: 72 }} draggable={false} />
                ))}
              </div>

              {/* Row 4: 1 portrait + 2 stacked */}
              <div className="grid gap-[3px]" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://picsum.photos/seed/dlv_p1/300/400?grayscale" alt="" className="w-full object-cover" style={{ height: 130 }} draggable={false} />
                <div className="flex flex-col gap-[3px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://picsum.photos/seed/dlv_h7/300/200?grayscale" alt="" className="w-full object-cover flex-1" style={{ height: 63 }} draggable={false} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://picsum.photos/seed/dlv_h8/300/200?grayscale" alt="" className="w-full object-cover flex-1" style={{ height: 63 }} draggable={false} />
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="px-4 py-3 flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] text-[var(--fg-muted)]">
                {totalSel > 0 ? `${totalSel} item${totalSel !== 1 ? "s" : ""} · ` : ""}Expires in 30 days
              </span>
              <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold hover:bg-yellow/90 transition-colors">
                {isGift ? "Download all" : "View & purchase"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="min-h-full flex flex-col p-5 sm:p-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 max-w-6xl mx-auto w-full">
        <button onClick={back} className="flex items-center gap-1.5 font-sans text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          {step === 0 ? "Delivery" : "Back"}
        </button>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-widest hidden sm:block">{STEPS[Math.min(step, STEPS.length - 1)]}</span>
          <StepDots current={step} total={STEPS.length} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto w-full flex-1">
        {isDone ? (
          <div className="flex flex-col items-center justify-center text-center gap-6 py-16">
            <div className="w-20 h-20 rounded-full bg-yellow/10 border border-yellow/30 flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fad502" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <div>
              <h1 className="font-sans font-black text-[var(--fg)] text-3xl mb-2">Delivery ready!</h1>
              <p className="font-sans text-sm text-[var(--fg-muted)] leading-relaxed max-w-sm mx-auto">
                <span className="text-[var(--fg)] font-medium">{title}</span> for{" "}
                <span className="text-[var(--fg)] font-medium">{client}</span> is set up
                {selectedPhotos.size > 0 && ` with ${selectedPhotos.size} photo${selectedPhotos.size !== 1 ? "s" : ""}`}.
                Add your photos and send the link.
              </p>
            </div>
            <button onClick={finish} className="flex items-center gap-1.5 px-7 py-3 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 transition-colors">
              Add photos & configure →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">

            {/* Left — form card */}
            <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.18 }}
                  className="px-6 py-6 min-h-[280px]"
                >
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] mb-4">{STEPS[step]}</p>

                  {step === 0 && (
                    <div className="space-y-4">
                      <div>
                        <h1 className="font-sans font-black text-[var(--fg)] text-2xl mb-1">New delivery</h1>
                        <p className="font-sans text-sm text-[var(--fg-muted)]">Who are you delivering to?</p>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] block mb-1.5">Gallery title</label>
                          <input
                            autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
                            placeholder="Wedding Gallery"
                            className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:border-yellow transition-colors"
                          />
                        </div>
                        <div>
                          <label className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] block mb-1.5">Client name</label>
                          <input
                            value={client} onChange={(e) => setClient(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter" && canNext) setStep(1); }}
                            placeholder="Sarah & James"
                            className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:border-yellow transition-colors"
                          />
                        </div>
                      </div>
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
                      <div>
                        <h1 className="font-sans font-black text-[var(--fg)] text-2xl mb-1">Access & pricing</h1>
                        <p className="font-sans text-sm text-[var(--fg-muted)]">How should your client receive the photos?</p>
                      </div>
                      <div className="space-y-2">
                        {([
                          { id: "gift" as const,   label: "Gift / Free",  desc: "Client downloads at no cost",      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5" rx="1"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg> },
                          { id: "direct" as const, label: "Direct Sale",  desc: "Buy individually or as a bundle",  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
                        ]).map((opt) => (
                          <button key={opt.id} onClick={() => setMode(opt.id)}
                            className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${mode === opt.id ? "border-yellow bg-yellow/5" : "border-[var(--border)] hover:border-[var(--fg-muted)]"}`}
                          >
                            <span className={`mt-0.5 ${mode === opt.id ? "text-yellow" : "text-[var(--fg-muted)]"}`}>{opt.icon}</span>
                            <div>
                              <div className="font-sans text-sm font-semibold text-[var(--fg)]">{opt.label}</div>
                              <div className="font-sans text-xs text-[var(--fg-muted)]">{opt.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        {([
                          { id: "public" as const,   label: "Public" },
                          { id: "password" as const, label: "Password protected" },
                        ]).map((opt) => (
                          <button key={opt.id} onClick={() => setAccess(opt.id)}
                            className={`flex-1 py-2 rounded-xl border font-sans text-xs font-medium transition-all ${access === opt.id ? "border-yellow text-[var(--fg)] bg-yellow/5" : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)]"}`}
                          >
                            {opt.label}
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
                <button disabled={!canNext} onClick={() => setStep(step + 1)}
                  className="px-5 py-2 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 disabled:opacity-40 transition-colors"
                >
                  {step === 1 ? "Create delivery" : "Continue →"}
                </button>
              </div>
            </div>

            {/* Right — contextual panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
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
    </div>
  );
}
