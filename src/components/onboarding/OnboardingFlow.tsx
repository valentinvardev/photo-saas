"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "~/components/providers/LangProvider";
import { LOCALES } from "~/lib/i18n";
import { api } from "~/trpc/react";
import { BrandPreview } from "./BrandPreview";
import {
  PALETTES, PAIRINGS, pairingTypography, TEMPLATE_OPTIONS,
  buildMinimalNodes, fullName, type Identity,
} from "./brandData";

// Load the @fontsource fonts so the live preview renders the chosen pairings.
import "~/lib/editor/fonts";

const TOTAL = 6; // welcome, identity, color, fonts, template, done

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "portfolio";
}

const inputCls =
  "w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2.5 outline-none focus:border-yellow/60 focus:ring-1 focus:ring-yellow/20 transition placeholder:text-[var(--fg-muted)]";

export function OnboardingFlow({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, locale } = useT();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [paletteIdx, setPaletteIdx] = useState(0);
  const [pairingIdx, setPairingIdx] = useState(0);
  const [templateIdx, setTemplateIdx] = useState(0);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newId, setNewId] = useState<string | null>(null);

  const updateProfile = api.user.updateProfile.useMutation();
  const createPortfolio = api.portfolio.create.useMutation();
  const saveDesign = api.portfolio.saveDesign.useMutation();
  const utils = api.useUtils();

  if (!open) return null;

  const palette  = PALETTES[paletteIdx]!;
  const pairing  = PAIRINGS[pairingIdx]!;
  const typography = pairingTypography(pairing);
  const template = TEMPLATE_OPTIONS[templateIdx]!;
  const identity: Identity = { first, last, location, bio };
  const langLabel = LOCALES.find((l) => l.id === locale)?.native ?? "English";

  const showPreview = step >= 1 && step <= 4;

  async function finish() {
    if (creating) return;
    setCreating(true);
    setError(null);
    try {
      const name = fullName(identity);
      await updateProfile.mutateAsync({
        name: name || undefined,
        location: location.trim() || undefined,
        bio: bio.trim() || undefined,
      });
      const base = name || "Portfolio";
      const nodes = template.id === "minimal-bw" ? buildMinimalNodes(locale, identity) : undefined;
      const editorState = { templateId: template.id, palette: { bg: palette.bg, fg: palette.fg, accent: palette.accent, muted: palette.muted }, typography, nodes };

      let made;
      try {
        made = await createPortfolio.mutateAsync({ title: base, slug: slugify(base), template: "Minimal BW" });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "";
        if (msg.toLowerCase().includes("slug")) {
          made = await createPortfolio.mutateAsync({ title: base, slug: `${slugify(base)}-${Math.random().toString(36).slice(2, 6)}`, template: "Minimal BW" });
        } else throw e;
      }
      await saveDesign.mutateAsync({ id: made.id, editorState });
      try { localStorage.setItem("portapic_onboarded", "1"); } catch { /* ignore */ }
      void utils.portfolio.list.invalidate();
      void utils.user.me.invalidate();
      setNewId(made.id);
      setStep(5);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("onb.done.error"));
    } finally {
      setCreating(false);
    }
  }

  const next = () => { if (step === 4) void finish(); else setStep((s) => Math.min(s + 1, 5)); };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-5xl bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: "min(88vh, 720px)" }}
      >
        {/* Header: progress + close */}
        <div className="flex items-center gap-4 px-5 sm:px-7 py-4 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-yellow" : i < step ? "w-2.5 bg-yellow/50" : "w-2.5 bg-[var(--border)]"}`} />
            ))}
          </div>
          <div className="flex-1" />
          <button onClick={onClose} aria-label={t("onb.close")} className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 flex">
          {/* Left — controls */}
          <div className={`${showPreview ? "lg:w-[44%] lg:border-r border-[var(--border)]" : "w-full"} w-full flex flex-col min-h-0`}>
            <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* 0 — Welcome */}
                  {step === 0 && (
                    <div className="max-w-md mx-auto text-center py-8">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-yellow/10 border border-yellow/30 flex items-center justify-center text-yellow mb-6">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z"/></svg>
                      </div>
                      <h1 className="font-sans font-black text-[var(--fg)] text-2xl sm:text-3xl tracking-tight">{t("onb.welcome.title")}</h1>
                      <p className="font-sans text-sm text-[var(--fg-muted)] mt-3 leading-relaxed">{t("onb.welcome.body")}</p>
                      <div className="inline-flex items-center gap-2 mt-6 px-3 py-1.5 rounded-full bg-[var(--bg-subtle)] border border-[var(--border)]">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--fg-muted)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18 14 14 0 010-18"/></svg>
                        <span className="font-mono text-[10px] text-[var(--fg-muted)]">{t("onb.welcome.langDetected", { lang: langLabel })}</span>
                      </div>
                    </div>
                  )}

                  {/* 1 — Identity */}
                  {step === 1 && (
                    <div className="flex flex-col gap-4">
                      <StepHead title={t("onb.identity.title")} body={t("onb.identity.body")} />
                      <div className="grid grid-cols-2 gap-3">
                        <Field label={t("onb.identity.first")}>
                          <input autoFocus className={inputCls} value={first} onChange={(e) => setFirst(e.target.value)} placeholder={t("onb.identity.firstPh")} />
                        </Field>
                        <Field label={t("onb.identity.last")}>
                          <input className={inputCls} value={last} onChange={(e) => setLast(e.target.value)} placeholder={t("onb.identity.lastPh")} />
                        </Field>
                      </div>
                      <Field label={t("onb.identity.location")}>
                        <input className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t("onb.identity.locationPh")} />
                      </Field>
                      <Field label={t("onb.identity.bio")}>
                        <textarea className={`${inputCls} resize-none`} rows={3} maxLength={160} value={bio} onChange={(e) => setBio(e.target.value)} placeholder={t("onb.identity.bioPh")} />
                      </Field>
                    </div>
                  )}

                  {/* 2 — Color */}
                  {step === 2 && (
                    <div className="flex flex-col gap-4">
                      <StepHead title={t("onb.color.title")} body={t("onb.color.body")} />
                      <div className="grid grid-cols-2 gap-3">
                        {PALETTES.map((p, i) => {
                          const active = i === paletteIdx;
                          return (
                            <button key={p.id} onClick={() => setPaletteIdx(i)}
                              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${active ? "border-yellow ring-2 ring-yellow/30" : "border-[var(--border)] hover:border-[var(--fg-muted)]"}`}>
                              <span className="w-9 h-9 rounded-lg shrink-0 border border-black/10" style={{ background: p.accent }} />
                              <div className="min-w-0">
                                <div className="font-sans text-sm font-semibold text-[var(--fg)] truncate">{t(`onb.palettes.${p.id}`)}</div>
                                <div className="flex gap-1 mt-1">
                                  <span className="w-3 h-3 rounded-full border border-black/10" style={{ background: p.bg }} />
                                  <span className="w-3 h-3 rounded-full border border-black/10" style={{ background: p.fg }} />
                                  <span className="w-3 h-3 rounded-full border border-black/10" style={{ background: p.muted }} />
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3 — Typography */}
                  {step === 3 && (
                    <div className="flex flex-col gap-4">
                      <StepHead title={t("onb.fonts.title")} body={t("onb.fonts.body")} />
                      <div className="flex flex-col gap-2.5">
                        {PAIRINGS.map((p, i) => {
                          const active = i === pairingIdx;
                          return (
                            <button key={p.id} onClick={() => setPairingIdx(i)}
                              className={`flex items-center gap-4 p-3.5 rounded-xl border text-left transition-all ${active ? "border-yellow ring-2 ring-yellow/30" : "border-[var(--border)] hover:border-[var(--fg-muted)]"}`}>
                              <span style={{ fontFamily: p.serif, fontSize: 30, lineHeight: 1, color: "var(--fg)" }}>Ag</span>
                              <div className="min-w-0">
                                <div className="font-sans text-sm font-semibold text-[var(--fg)]">{t(`onb.pairings.${p.id}`)}</div>
                                <div style={{ fontFamily: p.sans, fontSize: 12, color: "var(--fg-muted)", marginTop: 2 }}>Aa Bb Cc · 0123</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 4 — Template */}
                  {step === 4 && (
                    <div className="flex flex-col gap-4">
                      <StepHead title={t("onb.template.title")} body={t("onb.template.body")} />
                      <div className="flex flex-col gap-3">
                        {TEMPLATE_OPTIONS.map((opt, i) => {
                          const active = i === templateIdx;
                          return (
                            <button key={opt.id} onClick={() => setTemplateIdx(i)}
                              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${active ? "border-yellow ring-2 ring-yellow/30" : "border-[var(--border)] hover:border-[var(--fg-muted)]"}`}>
                              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${active ? "border-yellow" : "border-[var(--fg-muted)]"}`}>
                                {active && <div className="w-2 h-2 rounded-full bg-yellow" />}
                              </div>
                              <div>
                                <div className="font-sans text-sm font-semibold text-[var(--fg)]">{t(`onb.template.${opt.id === "minimal-bw" ? "minimalName" : "atelierName"}`)}</div>
                                <div className="font-sans text-xs text-[var(--fg-muted)] mt-0.5">{t(`onb.template.${opt.id === "minimal-bw" ? "minimalDesc" : "atelierDesc"}`)}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 5 — Done */}
                  {step === 5 && (
                    <div className="max-w-md mx-auto text-center py-8">
                      <div className="w-16 h-16 mx-auto rounded-full bg-yellow/10 border border-yellow/30 flex items-center justify-center mb-6">
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fad502" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <h1 className="font-sans font-black text-[var(--fg)] text-2xl sm:text-3xl tracking-tight">{t("onb.done.title")}</h1>
                      <p className="font-sans text-sm text-[var(--fg-muted)] mt-3 leading-relaxed">{t("onb.done.body", { name: fullName(identity) || (locale === "es" ? "tu portafolio" : "your portfolio") })}</p>
                      <div className="flex items-center justify-center gap-3 mt-8">
                        <button onClick={() => { onClose(); router.push("/dashboard/portfolio"); }} className="px-5 py-2.5 rounded-xl border border-[var(--border)] font-sans text-sm font-medium text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
                          {t("onb.done.goDashboard")}
                        </button>
                        <button onClick={() => { onClose(); router.push(newId ? `/editor/${newId}` : "/dashboard/portfolio"); }} className="px-6 py-2.5 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 transition-colors">
                          {t("onb.done.openEditor")}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer nav (hidden on done) */}
            {step < 5 && (
              <div className="shrink-0 px-5 sm:px-8 py-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
                <button onClick={step === 0 ? onClose : back} className="px-4 py-2 rounded-lg font-sans text-sm font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
                  {step === 0 ? t("onb.close") : t("onb.back")}
                </button>
                <div className="flex items-center gap-3">
                  {error && <span className="font-mono text-[10px] text-red-400 max-w-[160px] truncate" title={error}>{error}</span>}
                  <button onClick={next} disabled={creating} className="px-6 py-2.5 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 disabled:opacity-50 transition-colors">
                    {step === 0 ? t("onb.welcome.start") : step === 4 ? (creating ? t("onb.done.creating") : t("onb.finish")) : t("onb.next")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right — live preview */}
          {showPreview && (
            <div className="hidden lg:flex flex-1 min-w-0 items-center justify-center p-7 bg-[var(--bg-subtle)]">
              <div className="w-full max-w-md">
                <BrandPreview palette={palette} fonts={typography} identity={identity} variant={template.variant} locale={locale} />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function StepHead({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h1 className="font-sans font-black text-[var(--fg)] text-xl sm:text-2xl tracking-tight">{title}</h1>
      <p className="font-sans text-sm text-[var(--fg-muted)] mt-1.5 leading-relaxed">{body}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-sans text-xs font-semibold text-[var(--fg-muted)] mb-1.5">{label}</label>
      {children}
    </div>
  );
}
