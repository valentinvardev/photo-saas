"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LivePreviewThumbnail } from "~/components/dashboard/DevicePreviewModal";
import { TEMPLATE_URL, TEMPLATES } from "~/lib/portfolio/mock";

const STEPS = ["Name & Photos", "Template", "Domain", "Done"] as const;

const GALLERY_PHOTOS = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  seed: `gal${i + 10}`,
}));

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

function PhotoPickerGrid({ selected, onToggle }: {
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-5 gap-1.5">
        {GALLERY_PHOTOS.map((ph) => {
          const on = selected.has(ph.id);
          return (
            <button
              key={ph.id}
              onClick={() => onToggle(ph.id)}
              className={`relative aspect-square rounded-lg overflow-hidden transition-all select-none ${
                on ? "ring-2 ring-yellow ring-offset-1 ring-offset-[var(--bg-card)]" : "hover:opacity-80"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://picsum.photos/seed/${ph.seed}/200/200?grayscale`} alt="" className="w-full h-full object-cover" draggable={false} />
              {on && (
                <div className="absolute inset-0 bg-yellow/20 flex items-start justify-end p-1">
                  <div className="w-4 h-4 rounded-full bg-yellow flex items-center justify-center">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-3">
        {selected.size > 0
          ? `${selected.size} photo${selected.size !== 1 ? "s" : ""} selected — you can add more later`
          : "Select photos to kick off your portfolio — optional"}
      </p>
    </div>
  );
}

export default function NewPortfolioPage() {
  const router = useRouter();
  const [step,          setStep]          = useState(0);
  const [name,          setName]          = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [template,      setTemplate]      = useState(TEMPLATES[0]!);
  const [domain,        setDomain]        = useState<"free" | "custom">("free");
  const [customDomain,  setCustomDomain]  = useState("");

  const canNext = step === 0 ? !!name.trim() : true;
  const isDone  = step === 3;

  function togglePhoto(id: string) {
    setSelectedPhotos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function back() {
    if (step === 0) router.push("/dashboard/portfolio");
    else setStep(step - 1);
  }

  /* ── Right panel — changes per step ── */
  function RightPanel() {
    const slug = name ? name.toLowerCase().replace(/\s+/g, "-") : "your-portfolio";

    if (step === 0) return (
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-sans font-bold text-[var(--fg)] text-lg">Add some photos</h2>
          <p className="font-sans text-sm text-[var(--fg-muted)] mt-1">Pick from your gallery to populate the portfolio right away.</p>
        </div>
        <PhotoPickerGrid selected={selectedPhotos} onToggle={togglePhoto} />
      </div>
    );

    if (step === 1) {
      const previewUrl = TEMPLATE_URL[template];
      return (
        <div className="flex flex-col gap-4 h-full">
          <div>
            <h2 className="font-sans font-bold text-[var(--fg)] text-lg">Live preview</h2>
            <p className="font-sans text-sm text-[var(--fg-muted)] mt-1">
              Showing <strong>{template}</strong> — updates as you pick.
            </p>
          </div>
          {previewUrl && (
            <div className="flex-1 rounded-xl overflow-hidden border border-[var(--border)] min-h-[340px]">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-card)]">
                <span className="w-2 h-2 rounded-full bg-red-400/60"/><span className="w-2 h-2 rounded-full bg-yellow/60"/><span className="w-2 h-2 rounded-full bg-green-400/60"/>
                <span className="font-mono text-[10px] text-[var(--fg-muted)] ml-2 truncate">{slug}.portapic.app</span>
              </div>
              <LivePreviewThumbnail url={previewUrl} baseWidth={1280} className="w-full h-full" />
            </div>
          )}
        </div>
      );
    }

    if (step === 2) {
      const domainStr = domain === "custom" && customDomain ? customDomain : `${slug}.portapic.app`;
      return (
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-sans font-bold text-[var(--fg)] text-lg">Your address</h2>
            <p className="font-sans text-sm text-[var(--fg-muted)] mt-1">Visitors will reach your portfolio at this URL.</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[var(--border)] bg-[var(--bg-card)]">
              <span className="w-2 h-2 rounded-full bg-red-400/60"/><span className="w-2 h-2 rounded-full bg-yellow/60"/><span className="w-2 h-2 rounded-full bg-green-400/60"/>
              <div className="flex-1 flex items-center gap-1.5 bg-[var(--bg)] border border-[var(--border)] rounded-md px-2 py-1 ml-1">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400 shrink-0"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                <span className="font-mono text-[10px] text-[var(--fg)] truncate">{domainStr}</span>
              </div>
            </div>
            <div className="p-6 bg-[var(--bg-subtle)] flex flex-col gap-3">
              <div className="h-3 w-36 bg-[var(--border)] rounded-full" />
              <div className="h-2 w-52 bg-[var(--border)]/50 rounded-full" />
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[...Array(6)].map((_, i) => <div key={i} className="aspect-square rounded-lg bg-[var(--border)]/40" />)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-500/5 border border-green-500/20">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span className="font-mono text-[10px] text-green-400">SSL secured · Free forever</span>
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
          {step === 0 ? "Portfolio" : "Back"}
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
              <h1 className="font-sans font-black text-[var(--fg)] text-3xl mb-2">Ready to go!</h1>
              <p className="font-sans text-sm text-[var(--fg-muted)] leading-relaxed max-w-sm mx-auto">
                <span className="text-[var(--fg)] font-medium">{name}</span> is set up with the {template} template
                {selectedPhotos.size > 0 && ` and ${selectedPhotos.size} photo${selectedPhotos.size !== 1 ? "s" : ""} ready`}.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => router.push("/dashboard/portfolio")} className="px-5 py-2.5 rounded-xl border border-[var(--border)] font-sans text-sm font-medium text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
                Go to portfolio
              </button>
              <button onClick={() => router.push("/dashboard/portfolio/1")} className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 transition-colors">
                Open editor →
              </button>
            </div>
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
                      <h1 className="font-sans font-black text-[var(--fg)] text-2xl">Name your portfolio</h1>
                      <p className="font-sans text-sm text-[var(--fg-muted)]">This is how it'll appear in your dashboard and browser tab.</p>
                      <input
                        autoFocus value={name} onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) setStep(1); }}
                        placeholder="Sofia Chen Photography"
                        className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:border-yellow transition-colors"
                      />
                      {selectedPhotos.size > 0 && (
                        <p className="font-mono text-[10px] text-yellow">{selectedPhotos.size} photo{selectedPhotos.size !== 1 ? "s" : ""} selected</p>
                      )}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-3">
                      <h1 className="font-sans font-black text-[var(--fg)] text-2xl">Pick a template</h1>
                      <p className="font-sans text-sm text-[var(--fg-muted)]">Choose what feels closest to your style.</p>
                      <div className="flex flex-col gap-2">
                        {TEMPLATES.map((t) => (
                          <button key={t} onClick={() => setTemplate(t)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${template === t ? "border-yellow bg-yellow/5" : "border-[var(--border)] hover:border-[var(--fg-muted)]"}`}
                          >
                            <div className="w-16 h-10 rounded-lg overflow-hidden bg-[var(--bg-subtle)] shrink-0 border border-[var(--border)]">
                              {TEMPLATE_URL[t] && <LivePreviewThumbnail url={TEMPLATE_URL[t]!} baseWidth={1280} className="w-full h-full" />}
                            </div>
                            <span className="font-sans text-sm font-semibold text-[var(--fg)] flex-1">{t}</span>
                            {template === t && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fad502" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-3">
                      <h1 className="font-sans font-black text-[var(--fg)] text-2xl">Choose your domain</h1>
                      <p className="font-sans text-sm text-[var(--fg-muted)]">Start free, upgrade any time.</p>
                      <div className="flex flex-col gap-2">
                        {([
                          { id: "free" as const,   label: "Free subdomain", sub: "sofia.portapic.app" },
                          { id: "custom" as const, label: "Custom domain",   sub: "yourdomain.com",   badge: "Gold" },
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
                <button disabled={!canNext} onClick={() => setStep(step + 1)}
                  className="px-5 py-2 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 disabled:opacity-40 transition-colors"
                >
                  {step === 2 ? "Create portfolio" : "Continue →"}
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
                {RightPanel()}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
