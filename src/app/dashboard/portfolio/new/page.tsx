"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LivePreviewThumbnail } from "~/components/dashboard/DevicePreviewModal";
import { TEMPLATE_URL, TEMPLATES } from "~/lib/portfolio/mock";

const STEPS = ["Name", "Template", "Domain", "Done"] as const;

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-300 ${
            i === current ? "w-5 bg-yellow" : i < current ? "w-2 bg-yellow/50" : "w-2 bg-[var(--border)]"
          }`}
        />
      ))}
    </div>
  );
}

export default function NewPortfolioPage() {
  const router = useRouter();
  const [step, setStep]   = useState(0);
  const [name, setName]   = useState("");
  const [template, setTemplate] = useState(TEMPLATES[0]!);
  const [domain, setDomain]     = useState<"free" | "custom">("free");
  const [customDomain, setCustomDomain] = useState("");

  const canNext = step === 0 ? !!name.trim() : true;

  function back() {
    if (step === 0) router.push("/dashboard/portfolio");
    else setStep(step - 1);
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6">
      {/* Top bar */}
      <div className="w-full max-w-md mb-5 flex items-center justify-between">
        <button
          onClick={back}
          className="flex items-center gap-1.5 font-sans text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          {step === 0 ? "Portfolio" : "Back"}
        </button>
        <StepDots current={step} total={STEPS.length} />
      </div>

      {/* Wizard card */}
      <div className="w-full max-w-md rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
            className="px-6 py-6 min-h-[280px]"
          >
            <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] mb-4">
              {STEPS[step]}
            </p>

            {step === 0 && (
              <div className="space-y-3">
                <h1 className="font-sans font-black text-[var(--fg)] text-2xl">Name your portfolio</h1>
                <p className="font-sans text-sm text-[var(--fg-muted)]">
                  This is how it'll appear in your dashboard and in the browser tab.
                </p>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && name.trim()) setStep(1); }}
                  placeholder="Sofia Chen Photography"
                  className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:border-yellow transition-colors mt-2"
                />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <h1 className="font-sans font-black text-[var(--fg)] text-2xl">Pick a template</h1>
                <p className="font-sans text-sm text-[var(--fg-muted)]">
                  You can change this later. Choose what feels closest to your style.
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {TEMPLATES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTemplate(t)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        template === t
                          ? "border-yellow ring-2 ring-yellow/20 bg-yellow/5"
                          : "border-[var(--border)] hover:border-[var(--fg-muted)]"
                      }`}
                    >
                      <div className="aspect-video rounded-lg overflow-hidden bg-[var(--bg-subtle)] mb-2">
                        {TEMPLATE_URL[t] && (
                          <LivePreviewThumbnail url={TEMPLATE_URL[t]!} baseWidth={1280} className="w-full h-full" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-xs font-semibold text-[var(--fg)]">{t}</span>
                        {template === t && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fad502" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <h1 className="font-sans font-black text-[var(--fg)] text-2xl">Choose your domain</h1>
                <p className="font-sans text-sm text-[var(--fg-muted)]">
                  Start free, upgrade to a custom domain any time.
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={() => setDomain("free")}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                      domain === "free" ? "border-yellow bg-yellow/5" : "border-[var(--border)] hover:border-[var(--fg-muted)]"
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${domain === "free" ? "border-yellow" : "border-[var(--fg-muted)]"}`}>
                      {domain === "free" && <div className="w-2 h-2 rounded-full bg-yellow" />}
                    </div>
                    <div>
                      <div className="font-sans text-sm font-semibold text-[var(--fg)]">Free subdomain</div>
                      <div className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">sofia.portapic.app</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setDomain("custom")}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                      domain === "custom" ? "border-yellow bg-yellow/5" : "border-[var(--border)] hover:border-[var(--fg-muted)]"
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${domain === "custom" ? "border-yellow" : "border-[var(--fg-muted)]"}`}>
                      {domain === "custom" && <div className="w-2 h-2 rounded-full bg-yellow" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-sm font-semibold text-[var(--fg)]">Custom domain</span>
                        <span className="font-mono text-[9px] bg-yellow/10 text-yellow border border-yellow/20 px-1.5 py-0.5 rounded uppercase tracking-wider">Gold</span>
                      </div>
                      <div className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">yourdomain.com</div>
                      {domain === "custom" && (
                        <input
                          value={customDomain}
                          onChange={(e) => setCustomDomain(e.target.value)}
                          placeholder="yourdomain.com"
                          className="mt-2 w-full font-mono text-xs text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors"
                        />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col items-center text-center py-6 gap-5">
                <div className="w-16 h-16 rounded-full bg-yellow/10 border border-yellow/30 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fad502" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div>
                  <h1 className="font-sans font-black text-[var(--fg)] text-2xl mb-2">Ready to go!</h1>
                  <p className="font-sans text-sm text-[var(--fg-muted)]">
                    <span className="text-[var(--fg)] font-medium">{name}</span> is set up with the{" "}
                    {template} template. Open the editor to add photos and go live.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push("/dashboard/portfolio")}
                    className="px-4 py-2 rounded-xl border border-[var(--border)] font-sans text-sm font-medium text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
                  >
                    Go to portfolio
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/portfolio/1")}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 transition-colors"
                  >
                    Open editor →
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {step < 3 && (
          <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between">
            <button
              onClick={back}
              className="px-4 py-2 rounded-xl border border-[var(--border)] font-sans text-sm font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
            >
              {step === 0 ? "Cancel" : "← Back"}
            </button>
            <button
              disabled={!canNext}
              onClick={() => setStep(step + 1)}
              className="px-5 py-2 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 disabled:opacity-40 transition-colors"
            >
              {step === 2 ? "Create portfolio" : "Continue →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
