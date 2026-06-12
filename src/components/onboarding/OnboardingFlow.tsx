"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "~/components/providers/LangProvider";
import { LOCALES } from "~/lib/i18n";
import { api } from "~/trpc/react";
import { FONT_OPTIONS } from "~/lib/editor/fonts";
import { DEFAULT_TYPOGRAPHY, type ColorPalette, type Typography, type LogoSettings, type ImageCrop } from "~/lib/editor/types";
import { THEME_VARS } from "~/lib/editor/editorTheme";
import { FontPickerModal } from "~/components/editor/canvas/FontPickerModal";
import { ImageCropModal } from "~/components/editor/panels/ImageCropModal";
import { useUploadPhotos } from "~/lib/photo/upload";
import { LiveTemplatePreview } from "./LiveTemplatePreview";
import {
  PALETTES, PAIRINGS, pairingTypography, TEMPLATE_OPTIONS,
  buildMinimalNodes, buildOnboardingContent, fullName, initials,
  type Identity, type OnbFolder, type OnbPhoto,
} from "./brandData";

// Load the @fontsource fonts so the live preview + pickers render the real type.
import "~/lib/editor/fonts";

const TOTAL = 7; // welcome, identity, template, color, fonts, content, done

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "portfolio";
}

const inputCls =
  "w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2.5 outline-none focus:border-yellow/60 focus:ring-1 focus:ring-yellow/20 transition placeholder:text-[var(--fg-muted)]";

const sameColor = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
const fontLabel = (stack: string) => FONT_OPTIONS.find((f) => f.stack === stack)?.label ?? "Custom";

export function OnboardingFlow({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, locale } = useT();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Logo (optional)
  const [hasLogo, setHasLogo] = useState(false);
  const [logoMode, setLogoMode] = useState<LogoSettings["mode"]>("image");
  const [logoText, setLogoText] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [altLogoUrl, setAltLogoUrl] = useState("");
  const [logoWidth, setLogoWidth] = useState(40);
  const [logoCrop, setLogoCrop] = useState<ImageCrop | undefined>(undefined);
  const [cropOpen, setCropOpen] = useState(false);

  const [templateIdx, setTemplateIdx] = useState(0);
  const [palette, setPaletteState] = useState<ColorPalette>(() => {
    const p = PALETTES[0]!;
    return { bg: p.bg, fg: p.fg, accent: p.accent, muted: p.muted };
  });
  const [typo, setTypo] = useState<Typography>(() => pairingTypography(PAIRINGS[0]!));
  const [fontModal, setFontModal] = useState<keyof Typography | null>(null);

  // Content (photos + folders)
  const [folders, setFolders] = useState<OnbFolder[]>([]);
  const [contentPhotos, setContentPhotos] = useState<OnbPhoto[]>([]);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [folderDraft, setFolderDraft] = useState("");
  const [addingFolder, setAddingFolder] = useState(false);
  const contentUpload = useUploadPhotos();
  const fileRef = useRef<HTMLInputElement>(null);

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newId, setNewId] = useState<string | null>(null);
  const [newSlug, setNewSlug] = useState<string | null>(null);

  const { data: me } = api.user.me.useQuery();
  const updateProfile = api.user.updateProfile.useMutation();
  const createPortfolio = api.portfolio.create.useMutation();
  const saveDesign = api.portfolio.saveDesign.useMutation();
  const publishPortfolio = api.portfolio.update.useMutation();
  const utils = api.useUtils();

  // Prefill the contact email with the account email (until the user edits it).
  const emailTouched = useRef(false);
  useEffect(() => {
    if (!emailTouched.current && me?.email && !email) setEmail(me.email);
  }, [me?.email, email]);

  if (!open) return null;

  const template = TEMPLATE_OPTIONS[templateIdx]!;
  const identity: Identity = { first, last, location, bio };
  const langLabel = LOCALES.find((l) => l.id === locale)?.native ?? "English";
  const slug = slugify(fullName(identity) || "portfolio");

  // Wordmark shown in the nav when the logo uses text (text or image+text mode).
  const navLogoText = hasLogo && logoMode !== "image" ? (logoText.trim() || initials(identity)) : undefined;
  const contact = { email, phone };
  const previewNodes = template.id === "minimal-bw" ? buildMinimalNodes(locale, identity, navLogoText, contact) : undefined;

  const logoSettings: LogoSettings | undefined = hasLogo
    ? { mode: logoMode, text: logoText.trim() || initials(identity), imageUrl: logoUrl, altImageUrl: altLogoUrl, faviconUrl: iconUrl, width: logoWidth, imageCrop: logoCrop }
    : undefined;

  // Photos for the preview gallery: loose first, then each folder's photos.
  const previewGallery = [
    ...contentPhotos.filter((p) => !p.folderId),
    ...folders.flatMap((f) => contentPhotos.filter((p) => p.folderId === f.id)),
  ].map((p) => ({ src: p.url, title: p.filename }));

  const setColor = (key: keyof ColorPalette, value: string) => setPaletteState((p) => ({ ...p, [key]: value }));

  // Preview shows from Identity (1) through Content (5). Content is scrollable.
  const showPreview = step >= 1 && step <= 5;
  const visibleContent = contentPhotos.filter((p) => (activeFolder === null ? !p.folderId : p.folderId === activeFolder));

  async function onContentFiles(files: File[]) {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) return;
    try {
      const made = await contentUpload.upload(images, { folderId: null });
      setContentPhotos((prev) => [...prev, ...made.map((m) => ({ id: m.id, url: m.url, filename: m.filename, folderId: activeFolder }))]);
    } catch { /* hook surfaces error */ }
  }
  function addFolder() {
    const name = folderDraft.trim();
    if (!name) return;
    const id = "f-" + Math.random().toString(36).slice(2, 8);
    setFolders((prev) => [...prev, { id, name }]);
    setActiveFolder(id);
    setFolderDraft("");
    setAddingFolder(false);
  }

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
      const nodes = template.id === "minimal-bw" ? buildMinimalNodes(locale, identity, navLogoText, contact) : undefined;
      const content = contentPhotos.length > 0 ? buildOnboardingContent(locale, folders, contentPhotos) : undefined;
      const editorState = { templateId: template.id, palette, typography: typo, nodes, logo: logoSettings };

      let made;
      try {
        made = await createPortfolio.mutateAsync({ title: base, slug: slugify(base), template: "Minimal BW", content });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "";
        if (msg.toLowerCase().includes("slug")) {
          made = await createPortfolio.mutateAsync({ title: base, slug: `${slugify(base)}-${Math.random().toString(36).slice(2, 6)}`, template: "Minimal BW", content });
        } else throw e;
      }
      await saveDesign.mutateAsync({ id: made.id, editorState });
      // Publish so the portfolio (and its photos) are live immediately.
      try { await publishPortfolio.mutateAsync({ id: made.id, status: "published" }); } catch { /* stays draft if it fails */ }
      try { localStorage.setItem("portapic_onboarded", "1"); } catch { /* ignore */ }
      void utils.portfolio.list.invalidate();
      void utils.user.me.invalidate();
      setNewId(made.id);
      setNewSlug(made.slug);
      setStep(6);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("onb.done.error"));
    } finally {
      setCreating(false);
    }
  }

  const next = () => { if (step === 5) void finish(); else setStep((s) => Math.min(s + 1, 6)); };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md">
      {/* Editor-chrome theme vars so the reused FontPickerModal renders correctly. */}
      <style>{`:root{${(Object.entries(THEME_VARS.dark) as [string, string][]).map(([k, v]) => `${k}:${v};`).join("")}}`}</style>

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
                      <p className="font-sans text-[13px] text-[var(--fg-muted)] mt-3 leading-relaxed opacity-80">{t("onb.welcome.hint")}</p>
                      <div className="inline-flex items-center gap-2 mt-6 px-3 py-1.5 rounded-full bg-[var(--bg-subtle)] border border-[var(--border)]">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--fg-muted)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18 14 14 0 010-18"/></svg>
                        <span className="font-mono text-[10px] text-[var(--fg-muted)]">{t("onb.welcome.langDetected", { lang: langLabel })}</span>
                      </div>
                    </div>
                  )}

                  {/* 1 — Identity (+ optional logo) */}
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

                      {/* Contact */}
                      <div className="grid grid-cols-2 gap-3">
                        <Field label={t("onb.identity.email")}>
                          <input type="email" className={inputCls} value={email} onChange={(e) => { emailTouched.current = true; setEmail(e.target.value); }} placeholder={t("onb.identity.emailPh")} />
                        </Field>
                        <Field label={t("onb.identity.phone")}>
                          <input type="tel" className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("onb.identity.phonePh")} />
                        </Field>
                      </div>
                      <div className="flex items-center gap-1.5 -mt-1.5 text-[var(--fg-muted)]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6-2.7-1.2-4.4-3.9-4.6-4.1-.1-.2-1-1.4-1-2.6 0-1.2.6-1.8.9-2.1.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.7 1.8c.1.2.1.4 0 .5l-.3.5c-.1.2-.3.3-.1.6.1.3.6 1 1.3 1.6.9.8 1.6 1 1.9 1.2.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.6-.1l1.6.8c.3.1.5.2.5.4.1.1.1.6-.1 1z"/></svg>
                        <span className="font-sans text-[11px]">{t("onb.identity.phoneHint")}</span>
                      </div>

                      {/* Logo */}
                      <div className="pt-2 border-t border-[var(--border)]">
                        <div className="flex items-center justify-between gap-3 mt-3">
                          <span className="font-sans text-sm font-semibold text-[var(--fg)]">{t("onb.logo.question")}</span>
                          <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
                            <button onClick={() => setHasLogo(true)} className={`px-3.5 py-1.5 font-sans text-xs font-semibold transition-colors ${hasLogo ? "bg-yellow text-[#111]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"}`}>{t("onb.logo.yes")}</button>
                            <button onClick={() => setHasLogo(false)} className={`px-3.5 py-1.5 font-sans text-xs font-semibold transition-colors border-l border-[var(--border)] ${!hasLogo ? "bg-yellow text-[#111]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"}`}>{t("onb.logo.no")}</button>
                          </div>
                        </div>
                        <AnimatePresence>
                          {hasLogo && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                              <div className="flex flex-col gap-3 mt-4">
                                {/* Display mode */}
                                <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
                                  {(["text", "image", "image+text"] as const).map((m) => (
                                    <button key={m} onClick={() => setLogoMode(m)}
                                      className={`flex-1 px-2 py-1.5 font-sans text-[11px] font-semibold transition-colors ${logoMode === m ? "bg-yellow/15 text-[var(--fg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"} ${m !== "text" ? "border-l border-[var(--border)]" : ""}`}>
                                      {m === "text" ? t("onb.logo.modeText") : m === "image" ? t("onb.logo.modeImage") : t("onb.logo.modeBoth")}
                                    </button>
                                  ))}
                                </div>

                                {/* Logo text */}
                                {(logoMode === "text" || logoMode === "image+text") && (
                                  <Field label={t("onb.logo.text")}>
                                    <input className={inputCls} value={logoText} onChange={(e) => setLogoText(e.target.value)} placeholder={initials(identity)} maxLength={40} />
                                  </Field>
                                )}

                                {/* Logo image + crop + width + alt */}
                                {(logoMode === "image" || logoMode === "image+text") && (
                                  <>
                                    <AssetUpload label={t("onb.logo.logoLabel")} hint={t("onb.logo.logoHint")} value={logoUrl} onChange={(url) => { setLogoUrl(url); setLogoCrop(undefined); }} />
                                    {logoUrl && (
                                      <>
                                        <button onClick={() => setCropOpen(true)}
                                          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-sans font-medium text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
                                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v14a2 2 0 002 2h14"/><path d="M18 22V8a2 2 0 00-2-2H2"/></svg>
                                          <span className="flex-1 text-left">{logoCrop ? t("onb.logo.adjustCrop") : t("onb.logo.crop")}</span>
                                          {logoCrop && <span className="font-mono text-[9px] text-yellow border border-yellow/60 bg-yellow/10 px-1.5 py-0.5 rounded">ON</span>}
                                        </button>
                                        <LogoWidthSlider label={t("onb.logo.width")} width={logoWidth} onChange={setLogoWidth} />
                                      </>
                                    )}
                                    <AssetUpload label={t("onb.logo.altLabel")} hint={t("onb.logo.altHint")} value={altLogoUrl} onChange={setAltLogoUrl} />
                                  </>
                                )}

                                {/* Favicon — always available */}
                                <AssetUpload label={t("onb.logo.iconLabel")} hint={t("onb.logo.iconHint")} value={iconUrl} onChange={setIconUrl} />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
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
                                <div className="h-9 rounded-lg overflow-hidden flex">
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

                  {/* 4 — Typography (pairings + per-font modal) */}
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
                          <FontField label={t("onb.fonts.lblHeading")} value={typo.serif} onOpen={() => setFontModal("serif")} />
                          <FontField label={t("onb.fonts.lblBody")} value={typo.sans} onOpen={() => setFontModal("sans")} />
                          <FontField label={t("onb.fonts.lblMono")} value={typo.mono} onOpen={() => setFontModal("mono")} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5 — Content (upload photos + folders) */}
                  {step === 5 && (
                    <div className="flex flex-col gap-4">
                      <StepHead title={t("onb.content.title")} body={t("onb.content.body")} />
                      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { const f = Array.from(e.target.files ?? []); e.target.value = ""; void onContentFiles(f); }} />

                      {/* Folder chips */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => setActiveFolder(null)} className={`px-3 py-1.5 rounded-lg font-sans text-xs font-medium border transition-colors ${activeFolder === null ? "border-yellow text-[var(--fg)] bg-yellow/10" : "border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)]"}`}>{t("onb.content.all")}</button>
                        {folders.map((f) => {
                          const count = contentPhotos.filter((p) => p.folderId === f.id).length;
                          return (
                            <button key={f.id} onClick={() => setActiveFolder(f.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-medium border transition-colors ${activeFolder === f.id ? "border-yellow text-[var(--fg)] bg-yellow/10" : "border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)]"}`}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                              {f.name}<span className="opacity-60">{count}</span>
                            </button>
                          );
                        })}
                        {addingFolder ? (
                          <span className="flex items-center gap-1">
                            <input autoFocus value={folderDraft} onChange={(e) => setFolderDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addFolder(); if (e.key === "Escape") { setAddingFolder(false); setFolderDraft(""); } }} placeholder={t("onb.content.folderName")} maxLength={40}
                              className="w-32 font-sans text-xs text-[var(--fg)] bg-[var(--bg)] border border-yellow/60 rounded-lg px-2.5 py-1.5 outline-none" />
                            <button onClick={addFolder} className="px-2.5 py-1.5 rounded-lg bg-yellow text-[#111] font-sans text-xs font-bold">{t("onb.content.add")}</button>
                          </span>
                        ) : (
                          <button onClick={() => setAddingFolder(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-sans text-xs font-medium border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
                            {t("onb.content.newFolder")}
                          </button>
                        )}
                      </div>

                      {/* Upload button */}
                      <button onClick={() => fileRef.current?.click()} disabled={contentUpload.uploading}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:border-yellow hover:text-[var(--fg)] disabled:opacity-50 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <span className="font-sans text-sm font-semibold">{contentUpload.uploading ? t("onb.content.uploading", { done: contentUpload.progress.done, total: contentUpload.progress.total }) : t("onb.content.upload")}</span>
                      </button>
                      {contentUpload.error && <p className="font-mono text-[10px] text-red-400">{contentUpload.error}</p>}

                      {/* Thumbnails */}
                      {visibleContent.length > 0 ? (
                        <div className="grid grid-cols-4 gap-1.5">
                          {visibleContent.map((p) => (
                            <div key={p.id} className="relative aspect-square rounded-lg overflow-hidden group bg-[var(--bg-subtle)]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={p.url} alt={p.filename} className="w-full h-full object-cover" />
                              <button onClick={() => setContentPhotos((prev) => prev.filter((x) => x.id !== p.id))} aria-label={t("onb.content.remove")}
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="font-serif text-sm text-[var(--fg-muted)] text-center py-6">{t("onb.content.empty")}</p>
                      )}
                    </div>
                  )}

                  {/* 6 — Done */}
                  {step === 6 && (
                    <div className="max-w-md mx-auto text-center py-10">
                      <div className="w-16 h-16 mx-auto rounded-full bg-yellow/10 border border-yellow/30 flex items-center justify-center mb-6">
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fad502" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <h1 className="font-sans font-black text-[var(--fg)] text-2xl sm:text-3xl tracking-tight">{t("onb.done.title")}</h1>
                      <p className="font-sans text-sm text-[var(--fg-muted)] mt-3 leading-relaxed">{t("onb.done.body", { name: fullName(identity) || (locale === "es" ? "tu portafolio" : "your portfolio") })}</p>
                      {newSlug && (
                        <a href={`/p/${newSlug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-5 font-mono text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/></svg>
                          portapic.com/p/{newSlug}
                        </a>
                      )}
                      <div className="flex items-center justify-center gap-3 mt-8">
                        <a href={newSlug ? `/p/${newSlug}` : "#"} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-xl border border-[var(--border)] font-sans text-sm font-medium text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
                          {t("onb.done.viewSite")}
                        </a>
                        <button onClick={() => { onClose(); router.push(newId ? `/editor/${newId}` : "/dashboard/portfolio"); }} className="px-6 py-2.5 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 transition-colors">
                          {t("onb.done.openEditor")}
                        </button>
                      </div>
                      <button onClick={() => { onClose(); router.push("/dashboard/portfolio"); }} className="mt-4 font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
                        {t("onb.done.goDashboard")}
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer nav (hidden on done) */}
            {step < 6 && (
              <div className="shrink-0 px-5 sm:px-8 py-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
                <button onClick={step === 0 ? onClose : back} className="px-4 py-2 rounded-lg font-sans text-sm font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
                  {step === 0 ? t("onb.close") : t("onb.back")}
                </button>
                <div className="flex items-center gap-3">
                  {error && <span className="font-mono text-[10px] text-red-400 max-w-[160px] truncate" title={error}>{error}</span>}
                  <button onClick={next} disabled={creating} className="px-6 py-2.5 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:bg-yellow/90 disabled:opacity-50 transition-colors">
                    {step === 0 ? t("onb.welcome.start") : step === 5 ? (creating ? t("onb.done.creating") : t("onb.finish")) : t("onb.next")}
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
                <LiveTemplatePreview templateId={template.id} palette={palette} typography={typo} nodes={previewNodes} logo={logoSettings} galleryPhotos={previewGallery} slug={slug} scrollable={step === 5} />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Reused editor font picker */}
      {fontModal && (
        <FontPickerModal
          value={typo[fontModal]}
          initialTab={fontModal}
          fallbackSample={fullName(identity) || undefined}
          onSelect={(stack) => setTypo((tp) => ({ ...tp, [fontModal]: stack ?? DEFAULT_TYPOGRAPHY[fontModal] }))}
          onClose={() => setFontModal(null)}
        />
      )}

      {/* Reused editor logo cropper */}
      {cropOpen && logoUrl && (
        <ImageCropModal src={logoUrl} value={logoCrop} onChange={(c) => setLogoCrop(c ?? undefined)} onClose={() => setCropOpen(false)} />
      )}
    </div>
  );
}

/* Logo width slider, styled for the onboarding (light/dark) surface. */
function LogoWidthSlider({ label, width, onChange }: { label: string; width: number; onChange: (w: number) => void }) {
  const min = 16, max = 240;
  const pct = ((width - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="font-sans text-xs font-semibold text-[var(--fg-muted)]">{label}</label>
        <span className="font-mono text-[11px] text-[var(--fg-muted)]">{width}px</span>
      </div>
      <input type="range" min={min} max={max} value={width} onChange={(e) => onChange(Number(e.target.value))}
        className="onb-range w-full"
        style={{ background: `linear-gradient(to right, #fad502 0%, #fad502 ${pct}%, var(--border) ${pct}%, var(--border) 100%)` }} />
      <style>{`
        .onb-range { appearance: none; -webkit-appearance: none; height: 4px; border-radius: 2px; outline: none; cursor: grab; }
        .onb-range::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: var(--bg-card); border: 2px solid #fad502; cursor: grab; box-shadow: 0 1px 3px rgba(0,0,0,0.25); }
        .onb-range::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: var(--bg-card); border: 2px solid #fad502; cursor: grab; }
        .onb-range::-moz-range-track { background: transparent; }
      `}</style>
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

/* A field that opens the editor's font picker modal, showing the chosen face. */
function FontField({ label, value, onOpen }: { label: string; value: string; onOpen: () => void }) {
  return (
    <div>
      <label className="block font-sans text-xs font-semibold text-[var(--fg-muted)] mb-1.5">{label}</label>
      <button type="button" onClick={onOpen}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-[var(--border)] hover:border-[var(--fg-muted)] transition-colors">
        <span style={{ fontFamily: value }} className="text-[15px] text-[var(--fg)] truncate">{fontLabel(value)}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--fg-muted)] shrink-0"><path d="M4 7h16M4 12h10M4 17h7"/></svg>
      </button>
    </div>
  );
}

/* Upload one image (logo / icon / alt logo) via the photo pipeline. */
function AssetUpload({ label, hint, value, onChange }: { label: string; hint: string; value: string; onChange: (url: string) => void }) {
  const { t } = useT();
  const { upload, uploading } = useUploadPhotos();
  const ref = useRef<HTMLInputElement>(null);
  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files[0]) return;
    try { const made = await upload([files[0]]); if (made[0]) onChange(made[0].url); } catch { /* hook surfaces error */ }
  }
  return (
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] overflow-hidden flex items-center justify-center shrink-0 text-[var(--fg-muted)]">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-full h-full object-contain" />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-sans text-xs font-semibold text-[var(--fg)]">{label}</div>
        <div className="font-sans text-[11px] text-[var(--fg-muted)] truncate">{value ? t("onb.logo.set") : hint}</div>
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={onFile} />
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={() => ref.current?.click()} disabled={uploading}
          className="px-2.5 py-1.5 rounded-lg border border-[var(--border)] text-[11px] font-sans font-medium text-[var(--fg)] hover:border-[var(--fg-muted)] disabled:opacity-50 transition-colors">
          {uploading ? t("onb.logo.uploading") : value ? t("onb.logo.change") : t("onb.logo.upload")}
        </button>
        {value && (
          <button onClick={() => onChange("")} aria-label={t("onb.logo.remove")} className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--fg-muted)] hover:text-red-400 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}
