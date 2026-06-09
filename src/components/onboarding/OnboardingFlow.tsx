"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "~/components/providers/LangProvider";
import { LOCALES } from "~/lib/i18n";
import { api } from "~/trpc/react";
import { FONT_OPTIONS } from "~/lib/editor/fonts";
import type { ColorPalette, Typography } from "~/lib/editor/types";
import { LiveTemplatePreview } from "./LiveTemplatePreview";
import {
  PALETTES, PAIRINGS, pairingTypography, TEMPLATE_OPTIONS,
  buildMinimalNodes, fullName, type Identity,
} from "./brandData";

// Load the @fontsource fonts so the live preview + pickers render the real type.
import "~/lib/editor/fonts";

const TOTAL = 6; // welcome, identity, template, color, fonts, done

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "portfolio";
}

const inputCls =
  "w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2.5 outline-none focus:border-yellow/60 focus:ring-1 focus:ring-yellow/20 transition placeholder:text-[var(--fg-muted)]";

const sameColor = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

export function OnboardingFlow({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, locale } = useT();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [templateIdx, setTemplateIdx] = useState(0);
  const [palette, setPaletteState] = useState<ColorPalette>(() => {
    const p = PALETTES[0]!;
    return { bg: p.bg, fg: p.fg, accent: p.accent, muted: p.muted };
  });
  const [typo, setTypo] = useState<Typography>(() => pairingTypography(PAIRINGS[0]!));
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newId, setNewId] = useState<string | null>(null);

  const updateProfile = api.user.updateProfile.useMutation();
  const createPortfolio = api.portfolio.create.useMutation();
  const saveDesign = api.portfolio.saveDesign.useMutation();
  const utils = api.useUtils();

  if (!open) return null;

  const template = TEMPLATE_OPTIONS[templateIdx]!;
  const identity: Identity = { first, last, location, bio };
  const langLabel = LOCALES.find((l) => l.id === locale)?.native ?? "English";
  const previewNodes = template.id === "minimal-bw" ? buildMinimalNodes(locale, identity) : undefined;
  const slug = slugify(fullName(identity) || "portfolio");

  const setColor = (key: keyof ColorPalette, value: string) => setPaletteState((p) => ({ ...p, [key]: value }));

  // Preview shows from Identity (1) through Fonts (4).
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
      const editorState = { templateId: template.id, palette, typography: typo, nodes };

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[1320px] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: "min(94vh, 900px)" }}
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
          <div className={`${showPreview ? "lg:w-[40%] lg:max-w-[520px] lg:border-r border-[var(--border)]" : "w-full"} w-full flex flex-col min-h-0`}>
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
                    <div className="max-w-md mx-auto text-center py-10">
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

                  {/* 2 — Template (choose the portfolio first) */}
                  {step === 2 && (
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

                  {/* 3 — Color (variables first, then presets) */}
                  {step === 3 && (
                    <div className="flex flex-col gap-5">
                      <StepHead title={t("onb.color.title")} body={t("onb.color.body")} />

                      <div>
                        <SectionLabel>{t("onb.color.custom")}</SectionLabel>
                        <div className="grid grid-cols-2 gap-2.5">
                          <ColorVar label={t("onb.color.varBg")} value={palette.bg} onChange={(v) => setColor("bg", v)} />
                          <ColorVar label={t("onb.color.varFg")} value={palette.fg} onChange={(v) => setColor("fg", v)} />
                          <ColorVar label={t("onb.color.varAccent")} value={palette.accent} onChange={(v) => setColor("accent", v)} />
                          <ColorVar label={t("onb.color.varMuted")} value={palette.muted} onChange={(v) => setColor("muted", v)} />
                        </div>
                      </div>

                      <div>
                        <SectionLabel>{t("onb.color.presets")}</SectionLabel>
                        <div className="grid grid-cols-3 gap-2.5">
                          {PALETTES.map((p) => {
                            const active = sameColor(p.bg, palette.bg) && sameColor(p.fg, palette.fg) && sameColor(p.accent, palette.accent) && sameColor(p.muted, palette.muted);
                            return (
                              <button key={p.id} onClick={() => setPaletteState({ bg: p.bg, fg: p.fg, accent: p.accent, muted: p.muted })}
                                title={t(`onb.palettes.${p.id}`)}
                                className={`group rounded-xl border p-2 transition-all ${active ? "border-yellow ring-2 ring-yellow/30" : "border-[var(--border)] hover:border-[var(--fg-muted)]"}`}>
                                <div className="h-9 rounded-lg overflow-hidden flex" style={{ background: p.bg }}>
                                  <span className="flex-1" style={{ background: p.bg }} />
                                  <span className="flex-1" style={{ background: p.fg }} />
                                  <span className="flex-1" style={{ background: p.accent }} />
                                  <span className="flex-1" style={{ background: p.muted }} />
                                </div>
                                <div className="font-sans text-[11px] text-[var(--fg-muted)] mt-1.5 text-center truncate">{t(`onb.palettes.${p.id}`)}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4 — Typography (pairings + per-font selection) */}
                  {step === 4 && (
                    <div className="flex flex-col gap-5">
                      <StepHead title={t("onb.fonts.title")} body={t("onb.fonts.body")} />

                      <div>
                        <SectionLabel>{t("onb.fonts.presets")}</SectionLabel>
                        <div className="flex flex-wrap gap-2">
                          {PAIRINGS.map((p) => {
                            const active = p.serif === typo.serif && p.sans === typo.sans;
                            return (
                              <button key={p.id} onClick={() => setTypo((tp) => ({ ...tp, serif: p.serif, sans: p.sans }))}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${active ? "border-yellow ring-2 ring-yellow/30" : "border-[var(--border)] hover:border-[var(--fg-muted)]"}`}>
                                <span style={{ fontFamily: p.serif, fontSize: 20, lineHeight: 1, color: "var(--fg)" }}>Ag</span>
                                <span className="font-sans text-xs font-medium text-[var(--fg)]">{t(`onb.pairings.${p.id}`)}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <SectionLabel>{t("onb.fonts.custom")}</SectionLabel>
                        <div className="flex flex-col gap-3">
                          <FontSelect label={t("onb.fonts.lblHeading")} category="serif" value={typo.serif} onChange={(stack) => setTypo((tp) => ({ ...tp, serif: stack }))} />
                          <FontSelect label={t("onb.fonts.lblBody")} category="sans" value={typo.sans} onChange={(stack) => setTypo((tp) => ({ ...tp, sans: stack }))} />
                          <FontSelect label={t("onb.fonts.lblMono")} category="mono" value={typo.mono} onChange={(stack) => setTypo((tp) => ({ ...tp, mono: stack }))} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5 — Done */}
                  {step === 5 && (
                    <div className="max-w-md mx-auto text-center py-10">
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

          {/* Right — live real-template preview */}
          {showPreview && (
            <div className="hidden lg:flex flex-1 min-w-0 flex-col bg-[var(--bg-subtle)] p-5">
              <div className="flex items-center gap-2 mb-3 px-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" style={{ boxShadow: "0 0 8px rgba(34,197,94,0.6)" }} />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--fg-muted)]">{t("onb.livePreview")}</span>
              </div>
              <div className="flex-1 min-h-0 rounded-xl overflow-hidden border border-[var(--border)] shadow-lg">
                <LiveTemplatePreview templateId={template.id} palette={palette} typography={typo} nodes={previewNodes} slug={slug} />
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--fg-muted)] mb-2.5">{children}</div>;
}

/* A single editable colour variable: swatch (opens the native picker) + hex. */
function ColorVar({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const safe = /^#[0-9a-fA-F]{6}$/.test(value.trim()) ? value.trim() : "#000000";
  return (
    <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[var(--border)]">
      <div className="relative w-9 h-9 rounded-lg shrink-0 border border-black/10 overflow-hidden" style={{ background: value }}>
        <input type="color" value={safe} onChange={(e) => onChange(e.target.value)} className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] opacity-0 cursor-pointer" aria-label={label} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-sans text-[10px] font-semibold text-[var(--fg-muted)] uppercase tracking-wide">{label}</div>
        <input value={value} onChange={(e) => onChange(e.target.value)} spellCheck={false} className="w-full bg-transparent font-mono text-xs text-[var(--fg)] outline-none mt-0.5" />
      </div>
    </div>
  );
}

/* A compact dropdown to pick one font of a category, rendered in its own face. */
function FontSelect({ label, category, value, onChange }: { label: string; category: "serif" | "sans" | "mono"; value: string; onChange: (stack: string) => void }) {
  const [open, setOpen] = useState(false);
  const opts = FONT_OPTIONS.filter((f) => f.category === category);
  const current = opts.find((o) => o.stack === value);
  return (
    <div className="relative">
      <label className="block font-sans text-xs font-semibold text-[var(--fg-muted)] mb-1.5">{label}</label>
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-[var(--border)] hover:border-[var(--fg-muted)] transition-colors">
        <span style={{ fontFamily: value }} className="text-[15px] text-[var(--fg)] truncate">{current?.label ?? "Custom"}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`text-[var(--fg-muted)] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}><path d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg-card)] shadow-xl py-1">
            {opts.map((o) => {
              const active = o.stack === value;
              return (
                <button key={o.value} type="button" onClick={() => { onChange(o.stack); setOpen(false); }}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-left transition-colors ${active ? "bg-yellow/10" : "hover:bg-[var(--bg-subtle)]"}`}>
                  <span style={{ fontFamily: o.stack }} className={`text-[15px] truncate ${active ? "text-yellow" : "text-[var(--fg)]"}`}>{o.label}</span>
                  {active && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fad502" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
