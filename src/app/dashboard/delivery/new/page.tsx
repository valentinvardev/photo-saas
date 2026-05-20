"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDeliveryStore } from "~/lib/delivery/store";

const STEPS = ["Client", "Access", "Done"] as const;

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

export default function NewDeliveryPage() {
  const router = useRouter();
  const add = useDeliveryStore((s) => s.add);

  const [step, setStep]     = useState(0);
  const [title, setTitle]   = useState("");
  const [client, setClient] = useState("");
  const [mode, setMode]     = useState<"gift" | "direct">("gift");
  const [access, setAccess] = useState<"public" | "password">("public");

  const canNext = step === 0 ? !!(title.trim() && client.trim()) : true;

  function back() {
    if (step === 0) router.push("/dashboard/delivery");
    else setStep(step - 1);
  }

  function finish() {
    const newPage = add(title.trim(), client.trim());
    router.push(`/delivery/edit/${newPage.id}`);
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
          {step === 0 ? "Delivery" : "Back"}
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
              <div className="space-y-4">
                <div>
                  <h1 className="font-sans font-black text-[var(--fg)] text-2xl mb-1">New delivery</h1>
                  <p className="font-sans text-sm text-[var(--fg-muted)]">Who are you delivering to?</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] block mb-1.5">Gallery title</label>
                    <input
                      autoFocus
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Wedding Gallery"
                      className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:border-yellow transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] block mb-1.5">Client name</label>
                    <input
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && canNext) setStep(1); }}
                      placeholder="Sarah & James"
                      className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-3 outline-none focus:border-yellow transition-colors"
                    />
                  </div>
                </div>
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
                    {
                      id: "gift" as const,
                      label: "Gift / Free",
                      desc: "Client downloads at no cost",
                      icon: (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                          <polyline points="20 12 20 22 4 22 4 12"/>
                          <rect x="2" y="7" width="20" height="5" rx="1"/>
                          <path d="M12 22V7"/>
                          <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
                          <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
                        </svg>
                      ),
                    },
                    {
                      id: "direct" as const,
                      label: "Direct Sale",
                      desc: "Buy individually or as a bundle",
                      icon: (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                          <line x1="12" y1="1" x2="12" y2="23"/>
                          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                        </svg>
                      ),
                    },
                  ]).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setMode(opt.id)}
                      className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                        mode === opt.id ? "border-yellow bg-yellow/5" : "border-[var(--border)] hover:border-[var(--fg-muted)]"
                      }`}
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
                    { id: "public" as const, label: "Public" },
                    { id: "password" as const, label: "Password protected" },
                  ]).map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setAccess(opt.id)}
                      className={`flex-1 py-2 rounded-xl border font-sans text-xs font-medium transition-all ${
                        access === opt.id
                          ? "border-yellow text-[var(--fg)] bg-yellow/5"
                          : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col items-center text-center py-6 gap-5">
                <div className="w-16 h-16 rounded-full bg-yellow/10 border border-yellow/30 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fad502" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div>
                  <h1 className="font-sans font-black text-[var(--fg)] text-2xl mb-2">Delivery ready!</h1>
                  <p className="font-sans text-sm text-[var(--fg-muted)]">
                    <span className="text-[var(--fg)] font-medium">{title}</span> for{" "}
                    <span className="text-[var(--fg)] font-medium">{client}</span> is set up.
                    Add your photos and send the link.
                  </p>
                </div>
                <button
                  onClick={finish}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 transition-colors"
                >
                  Add photos & configure →
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {step < 2 && (
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
              {step === 1 ? "Create delivery" : "Continue →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
