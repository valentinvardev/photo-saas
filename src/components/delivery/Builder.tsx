"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ALL_GALLERY_SEEDS, DELIVERY_FONTS, TEMPLATES, TEMPLATE_STYLES, STATUS_META,
  type DeliveryMode, type DeliveryPage, type LayoutStyle, type LogoMode, type TemplateName,
} from "~/lib/delivery/data";
import { useDeliveryStore } from "~/lib/delivery/store";
import { PreviewFrame } from "./GalleryView";

/* ══════════════════════════════════════════════════════════════════════════
   SHARED HELPERS
══════════════════════════════════════════════════════════════════════════ */

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked} onClick={onChange}
      style={{
        position: "relative", display: "inline-flex", flexShrink: 0,
        width: 36, height: 20, borderRadius: 9999, border: checked ? "none" : "1px solid var(--border)",
        padding: 0, cursor: "pointer", backgroundColor: checked ? "#fad502" : "var(--bg-subtle)",
        transition: "background-color 150ms",
      }}
    >
      <span style={{
        position: "absolute", top: 2, left: checked ? 18 : 2, width: 16, height: 16,
        borderRadius: "50%", backgroundColor: checked ? "#111" : "var(--fg-muted)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.25)", transition: "left 150ms, background-color 150ms",
        pointerEvents: "none",
      }}/>
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-muted)] mb-2">{children}</p>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="font-sans font-bold text-[var(--fg)] text-xs uppercase tracking-wider">{title}</h3>
      {children}
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex items-center gap-2">
      <span className="font-sans text-xs text-[var(--fg-muted)] flex-1 truncate">{label}</span>
      <div className="flex items-center gap-1.5 border border-[var(--border)] rounded-lg px-2 py-1 hover:border-[var(--fg-muted)] transition-colors cursor-pointer" onClick={() => inputRef.current?.click()}>
        <div className="relative w-4 h-4 shrink-0">
          <div className="w-4 h-4 rounded border border-black/10" style={{ background: value }} />
          <input
            ref={inputRef}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ position: "absolute", top: 0, left: 0, width: 1, height: 1, opacity: 0, border: "none", padding: 0, cursor: "pointer" }}
          />
        </div>
        <span className="font-mono text-[11px] text-[var(--fg)] w-14 select-none">{value}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   IMAGE PICKERS
══════════════════════════════════════════════════════════════════════════ */

function SinglePhotoPicker({ value, onSelect, onClose }: { value: string; onSelect: (url: string) => void; onClose: () => void }) {
  const [selected, setSelected] = useState(value);
  const [tab, setTab] = useState<"gallery" | "url">("gallery");
  const [urlDraft, setUrlDraft] = useState(value);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploaded((prev) => [url, ...prev]);
    setSelected(url);
    e.target.value = "";
  }

  const allPhotos = [
    ...uploaded,
    ...ALL_GALLERY_SEEDS.map((s) => `https://picsum.photos/seed/${s}/800/800`),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-[700px] h-[480px] bg-[var(--bg)] border border-[var(--border)] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] shrink-0">
          <span className="font-mono text-xs text-[var(--fg-muted)] uppercase tracking-widest">Select image</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--bg-subtle)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-[360px] border-r border-[var(--border)] flex flex-col">
            <div className="flex border-b border-[var(--border)] shrink-0">
              {(["gallery", "url"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 font-sans text-xs py-2.5 capitalize transition-colors border-b-2 -mb-px ${tab === t ? "border-yellow text-[var(--fg)]" : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)]"}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {tab === "gallery" ? (
                <>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full mb-3 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:border-yellow hover:text-yellow transition-colors font-sans text-xs"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                    Upload photo
                  </button>
                  <div className="grid grid-cols-4 gap-2">
                    {allPhotos.map((url, i) => {
                      const isActive = selected === url;
                      return (
                        <div
                          key={i}
                          onClick={() => setSelected(url)}
                          className={`aspect-square overflow-hidden rounded-lg cursor-pointer relative border-2 transition-all ${isActive ? "border-yellow" : "border-transparent hover:border-[var(--fg-muted)]"}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <input
                    value={urlDraft}
                    onChange={(e) => setUrlDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && urlDraft.trim()) setSelected(urlDraft.trim()); }}
                    placeholder="https://..."
                    className="w-full font-mono text-xs text-[var(--fg)] bg-[var(--bg-subtle)] rounded-lg px-3 py-2 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
                  />
                  <button
                    onClick={() => { if (urlDraft.trim()) setSelected(urlDraft.trim()); }}
                    className="w-full rounded-lg border border-[var(--border)] py-2 font-sans text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
                  >
                    Use URL
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col p-4 gap-3">
            <div className="flex-1 bg-[var(--bg-subtle)] rounded-xl flex items-center justify-center overflow-hidden">
              {selected ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected} alt="" className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="font-mono text-xs text-[var(--fg-muted)]">No image selected</span>
              )}
            </div>
            <button
              onClick={() => { if (selected) { onSelect(selected); onClose(); } }}
              disabled={!selected}
              className="w-full py-2 rounded-xl bg-yellow text-[#111] font-sans font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              Use this image
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ImageButton({ value, onChange, placeholder = "Select from gallery" }: { value: string; onChange: (url: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex items-center gap-2">
        {value && (
          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-[var(--border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <button
          onClick={() => setOpen(true)}
          className="flex-1 min-w-0 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:border-yellow hover:text-yellow transition-colors font-sans text-xs"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
          <span className="truncate">{value ? "Change image" : placeholder}</span>
        </button>
        {value && (
          <button onClick={() => onChange("")} className="font-mono text-[10px] text-[var(--fg-muted)] hover:text-red-400 transition-colors shrink-0">
            Clear
          </button>
        )}
      </div>
      <AnimatePresence>
        {open && <SinglePhotoPicker value={value} onSelect={onChange} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

/* Multi-photo gallery picker for the Deliverable Gallery */
function GalleryModal({ page, onSave, onClose }: { page: DeliveryPage; onSave: (seeds: number[]) => void; onClose: () => void }) {
  const [selected, setSelected] = useState<Set<number>>(new Set(page.photoSeeds));

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const toggle = (seed: number) => setSelected((p) => {
    const n = new Set(p);
    if (n.has(seed)) n.delete(seed); else n.add(seed);
    return n;
  });
  const remove = (seed: number) => setSelected((p) => { const n = new Set(p); n.delete(seed); return n; });
  const handleSave = () => { onSave(Array.from(selected)); onClose(); };
  const clientPhotos = ALL_GALLERY_SEEDS.filter((s) => selected.has(s));

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl h-[80vh] flex flex-col rounded-2xl bg-[var(--bg)] border border-[var(--border)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] shrink-0">
          <div>
            <h3 className="font-sans font-black text-[var(--fg)] text-sm">Deliverable Gallery</h3>
            <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">{page.client} · {page.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[var(--fg-muted)]">{selected.size} selected</span>
            <button onClick={handleSave} className="px-4 py-1.5 rounded-lg bg-yellow text-[#111] font-sans font-bold text-xs hover:opacity-90 transition-opacity">Save</button>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
        <div className="flex flex-1 min-h-0">
          <div className="flex-1 flex flex-col border-r border-[var(--border)] min-w-0">
            <div className="px-4 py-2.5 border-b border-[var(--border)] shrink-0">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-muted)]">
                Your Gallery · {ALL_GALLERY_SEEDS.length} photos
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-5 gap-1.5">
                {ALL_GALLERY_SEEDS.map((seed) => {
                  const inDelivery = selected.has(seed);
                  return (
                    <button key={seed} onClick={() => toggle(seed)}
                      className="relative aspect-square overflow-hidden bg-[var(--bg-subtle)] group/photo focus:outline-none"
                      style={{ outline: inDelivery ? "2px solid #fad502" : "none", outlineOffset: -2 }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://picsum.photos/seed/${seed}/160/160?grayscale`} alt="" className="w-full h-full object-cover" />
                      {inDelivery && (
                        <div className="absolute inset-0 bg-yellow/20 flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full bg-yellow flex items-center justify-center">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <div className="px-4 py-2.5 border-b border-[var(--border)] shrink-0">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-muted)]">
                Client Gallery · {selected.size} photos
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {clientPhotos.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-2 text-[var(--fg-muted)]">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p className="font-sans text-xs">Click photos on the left to add them</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-1.5">
                  {clientPhotos.map((seed) => (
                    <button key={seed} onClick={() => remove(seed)}
                      className="relative aspect-square overflow-hidden bg-[var(--bg-subtle)] group/photo focus:outline-none"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://picsum.photos/seed/${seed}/160/160?grayscale`} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover/photo:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover/photo:opacity-100">
                        <div className="w-5 h-5 rounded-full bg-red-500/80 flex items-center justify-center">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TemplateModal({ current, onSelect, onClose }: { current: TemplateName; onSelect: (t: TemplateName) => void; onClose: () => void }) {
  const [preview, setPreview] = useState<TemplateName>(current);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  const chosen = TEMPLATES.find((t) => t.id === preview)!;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-3xl flex flex-col rounded-2xl bg-[var(--bg)] border border-[var(--border)] shadow-2xl overflow-hidden"
        style={{ maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
          <div>
            <h3 className="font-sans font-black text-[var(--fg)] text-sm">Choose template</h3>
            <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">Visual style for your delivery page</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <div className="w-56 shrink-0 border-r border-[var(--border)] overflow-y-auto p-3 space-y-1">
            {TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => setPreview(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                  preview === t.id ? "bg-yellow/10 text-[var(--fg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]"
                }`}
              >
                <div className="w-8 h-8 rounded-lg shrink-0 border border-[var(--border)]" style={{ background: t.accent }} />
                <div className="min-w-0">
                  <div className={`font-sans text-xs font-semibold truncate ${preview === t.id ? "text-[var(--fg)]" : ""}`}>{t.label}</div>
                  {preview === t.id && <div className="font-mono text-[9px] text-yellow mt-0.5">Selected</div>}
                </div>
              </button>
            ))}
          </div>
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <div className="flex-1 overflow-hidden" style={{ background: chosen.accent }}>
              <div className="flex items-center justify-between px-8 py-4" style={{ borderBottom: `1px solid ${chosen.fg}18` }}>
                <span style={{ fontFamily: "serif", fontSize: 14, fontWeight: 900, color: chosen.fg, letterSpacing: "0.12em", textTransform: "uppercase" }}>STUDIO</span>
                <div className="flex items-center gap-4">
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: chosen.sub }}>Gallery</span>
                  <span style={{ fontFamily: "monospace", fontSize: 10, color: chosen.sub }}>Info</span>
                </div>
              </div>
              <div className="px-8 py-6">
                <div style={{ fontFamily: "serif", fontSize: 28, fontWeight: 900, color: chosen.fg, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 8 }}>Sarah &amp; James</div>
                <div style={{ fontFamily: "monospace", fontSize: 10, color: chosen.sub, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 24 }}>Wedding · April 2026 · 247 photos</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                  {[401,402,403,404,405,406,407,408].map((seed) => (
                    <div key={seed} style={{ aspectRatio: "1", overflow: "hidden", borderRadius: chosen.id === "minimal" || chosen.id === "editorial" ? 4 : 0 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://picsum.photos/seed/${seed}/200/200?grayscale`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between shrink-0">
              <div>
                <div className="font-sans font-bold text-[var(--fg)] text-sm">{chosen.label}</div>
                <div className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">{chosen.desc}</div>
              </div>
              <button onClick={() => { onSelect(preview); onClose(); }}
                className="px-5 py-2 rounded-xl bg-yellow text-[#111] font-sans font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Use this template
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TAB CONTENT
══════════════════════════════════════════════════════════════════════════ */

type TabId = "page" | "access" | "monetize";

type Setter = <K extends keyof DeliveryPage>(k: K, v: DeliveryPage[K]) => void;

function PageTab({ page, set, onOpenGallery }: { page: DeliveryPage; set: Setter; onOpenGallery: () => void }) {
  const [showTemplates, setShowTemplates] = useState(false);
  const current = TEMPLATES.find((t) => t.id === page.template)!;

  function toggleCustomColors() {
    if (!page.customColors) {
      const ts = TEMPLATE_STYLES[page.template];
      set("colorBg", ts.bg);
      set("colorFg", ts.fg);
      set("colorAccent", ts.accent);
      set("colorBtnBg", ts.btnBg);
      set("colorBtnFg", ts.btnFg);
    }
    set("customColors", !page.customColors);
  }

  return (
    <div className="space-y-6">
      <Section title="Page info">
        <div>
          <FieldLabel>Title</FieldLabel>
          <input value={page.title} onChange={(e) => set("title", e.target.value)}
            className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors" />
        </div>
        <div>
          <FieldLabel>Client</FieldLabel>
          <input value={page.client} onChange={(e) => set("client", e.target.value)}
            className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors" />
        </div>
        <div>
          <FieldLabel>Deliverable gallery</FieldLabel>
          <button onClick={onOpenGallery}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--fg-muted)] transition-colors rounded-lg"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--fg-muted)] shrink-0">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            <span className="font-sans text-sm text-[var(--fg)] flex-1 text-left">
              {page.photoSeeds.length > 0 ? `${page.photoSeeds.length} photos selected` : "Select photos"}
            </span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--fg-muted)] shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </Section>

      <Section title="Design">
        <div>
          <FieldLabel>Template</FieldLabel>
          <button onClick={() => setShowTemplates(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--fg-muted)] transition-colors rounded-lg"
          >
            <div className="w-8 h-8 rounded-lg shrink-0 border border-[var(--border)]" style={{ background: current.accent }} />
            <div className="flex-1 text-left min-w-0">
              <div className="font-sans text-sm font-semibold text-[var(--fg)]">{current.label}</div>
              <div className="font-sans text-[11px] text-[var(--fg-muted)] truncate">{current.desc}</div>
            </div>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-[var(--fg-muted)] shrink-0"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <AnimatePresence>
            {showTemplates && (
              <TemplateModal current={page.template} onSelect={(t) => set("template", t)} onClose={() => setShowTemplates(false)} />
            )}
          </AnimatePresence>
        </div>
        <div>
          <FieldLabel>Cover image</FieldLabel>
          <ImageButton value={page.coverUrl} onChange={(u) => set("coverUrl", u)} placeholder="Use template default" />
        </div>
        <div>
          <FieldLabel>Logo</FieldLabel>
          <div className="flex gap-1 mb-2">
            {([
              { id: "none", label: "None" },
              { id: "text", label: "Text" },
              { id: "image", label: "Image" },
              { id: "image+text", label: "Both" },
            ] as { id: LogoMode; label: string }[]).map((opt) => (
              <button key={opt.id} onClick={() => set("logoMode", opt.id)}
                className={`flex-1 py-1.5 rounded-lg font-sans text-[11px] transition-colors border ${
                  page.logoMode === opt.id
                    ? "border-yellow bg-yellow/10 text-[var(--fg)]"
                    : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {(page.logoMode === "text" || page.logoMode === "image+text") && (
              <input value={page.logoText} onChange={(e) => set("logoText", e.target.value)} placeholder="STUDIO"
                className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors" />
            )}
            {(page.logoMode === "image" || page.logoMode === "image+text") && (
              <ImageButton value={page.logoUrl} onChange={(u) => set("logoUrl", u)} placeholder="Upload logo" />
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <FieldLabel>Custom colors</FieldLabel>
            <Toggle checked={page.customColors} onChange={toggleCustomColors} />
          </div>
          {page.customColors && (
            <div className="flex flex-col gap-2 p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)]">
              <ColorRow label="Background"  value={page.colorBg}     onChange={(v) => set("colorBg", v)} />
              <ColorRow label="Text"        value={page.colorFg}     onChange={(v) => set("colorFg", v)} />
              <ColorRow label="Accent"      value={page.colorAccent} onChange={(v) => set("colorAccent", v)} />
              <ColorRow label="Button bg"   value={page.colorBtnBg}  onChange={(v) => set("colorBtnBg", v)} />
              <ColorRow label="Button text" value={page.colorBtnFg}  onChange={(v) => set("colorBtnFg", v)} />
            </div>
          )}
        </div>
        <div>
          <FieldLabel>Font family</FieldLabel>
          <select value={page.fontFamily} onChange={(e) => set("fontFamily", e.target.value)}
            className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors"
            style={{ fontFamily: page.fontFamily }}
          >
            {DELIVERY_FONTS.map((f) => (
              <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel>Photo layout</FieldLabel>
          <div className="flex gap-2">
            {([
              { id: "grid",    label: "Grid",    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg> },
              { id: "masonry", label: "Masonry", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="8" height="11" rx="1"/><rect x="13" y="3" width="8" height="7" rx="1"/><rect x="3" y="17" width="8" height="4" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg> },
            ] as { id: LayoutStyle; label: string; icon: React.ReactNode }[]).map((opt) => (
              <button key={opt.id} onClick={() => set("layout", opt.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border font-sans text-xs font-medium transition-all ${
                  page.layout === opt.id
                    ? "border-yellow bg-yellow/10 text-[var(--fg)]"
                    : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)]"
                }`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <FieldLabel>Welcome message</FieldLabel>
          <textarea value={page.welcomeMessage} onChange={(e) => set("welcomeMessage", e.target.value)} rows={3}
            className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2.5 outline-none focus:border-yellow transition-colors resize-none"
            placeholder="Write a personal message to your client…"
          />
          <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-1">Shown on the cover</p>
        </div>
      </Section>
    </div>
  );
}

function AccessTab({ page, set }: { page: DeliveryPage; set: Setter }) {
  const genPassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    set("password", Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join(""));
  };
  const [emailDraft, setEmailDraft] = useState("");

  return (
    <div className="space-y-6">
      <Section title="Password">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-sans text-sm font-medium text-[var(--fg)]">Password protection</span>
            <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">Require a password to view the gallery</p>
          </div>
          <Toggle checked={page.passwordEnabled} onChange={() => set("passwordEnabled", !page.passwordEnabled)} />
        </div>
        {page.passwordEnabled && (
          <div className="flex gap-2">
            <input value={page.password} onChange={(e) => set("password", e.target.value)}
              className="flex-1 font-mono text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors"
              placeholder="Enter password"
            />
            <button onClick={genPassword} className="shrink-0 px-3 py-2 rounded-lg border border-[var(--border)] font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
              Generate
            </button>
          </div>
        )}
      </Section>

      <Section title="Expiration">
        <FieldLabel>Expiration date</FieldLabel>
        <input type="date" value={page.expiresAt ?? ""} onChange={(e) => set("expiresAt", e.target.value || null)}
          className="w-full font-mono text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors" />
        <p className="font-sans text-[11px] text-[var(--fg-muted)]">Gallery becomes inaccessible after this date</p>
      </Section>

      <Section title="Whitelist">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-sans text-sm font-medium text-[var(--fg)]">Client whitelist</span>
            <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">Restrict access to specific emails</p>
          </div>
          <Toggle checked={page.whitelistEnabled} onChange={() => set("whitelistEnabled", !page.whitelistEnabled)} />
        </div>
        {page.whitelistEnabled && (
          <div className="space-y-1.5">
            {page.whitelist.map((email, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex-1 font-mono text-xs text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 truncate">{email}</span>
                <button onClick={() => set("whitelist", page.whitelist.filter((_, j) => j !== i))} className="p-1.5 text-[var(--fg-muted)] hover:text-red-400 transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input value={emailDraft} onChange={(e) => setEmailDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && emailDraft.includes("@")) { set("whitelist", [...page.whitelist, emailDraft.trim()]); setEmailDraft(""); } }}
                className="flex-1 font-mono text-xs text-[var(--fg)] bg-[var(--bg)] border border-dashed border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors"
                placeholder="client@email.com"
              />
              <button
                onClick={() => { if (emailDraft.includes("@")) { set("whitelist", [...page.whitelist, emailDraft.trim()]); setEmailDraft(""); } }}
                className="shrink-0 px-3 py-2 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}

function MonetizeTab({ page, set }: { page: DeliveryPage; set: Setter }) {
  const photoCount = page.photoSeeds.length || page.photoCount;
  const suggestedGalleryPrice = page.pricePerPhoto > 0 ? Math.round(page.pricePerPhoto * photoCount * 0.6) : 0;
  const savings = page.pricePerPhoto > 0 && photoCount > 0
    ? Math.round((1 - page.priceFullGallery / (page.pricePerPhoto * photoCount)) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <Section title="Delivery mode">
        <div className="flex flex-col gap-2">
          {([
            { id: "gift",      label: "Gift / Free",    desc: "Client downloads at no cost" },
            { id: "direct",    label: "Direct Sale",     desc: "Clients buy individually or as bundle" },
            { id: "selection", label: "Selection Mode",  desc: "Client picks favorites from a paid contract" },
          ] as { id: DeliveryMode; label: string; desc: string }[]).map((opt) => (
            <button key={opt.id} onClick={() => set("mode", opt.id)}
              className={`flex items-start gap-3 px-3 py-3 rounded-xl border text-left transition-all ${
                page.mode === opt.id
                  ? "border-yellow bg-yellow/5"
                  : "border-[var(--border)] hover:border-[var(--fg-muted)]"
              }`}
            >
              <span className={`mt-0.5 w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center ${page.mode === opt.id ? "border-yellow" : "border-[var(--fg-muted)]"}`}>
                {page.mode === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-yellow block" />}
              </span>
              <div>
                <div className="font-sans text-sm font-medium text-[var(--fg)]">{opt.label}</div>
                <div className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {page.mode === "direct" && (
        <Section title="Pricing">
          <div>
            <FieldLabel>Price per photo</FieldLabel>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[var(--fg-muted)]">$</span>
              <input type="number" min={0} value={page.pricePerPhoto}
                onChange={(e) => set("pricePerPhoto", Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2.5 font-mono text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg outline-none focus:border-yellow transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <FieldLabel>Full gallery price</FieldLabel>
              {photoCount > 0 && page.pricePerPhoto > 0 && (
                <button onClick={() => set("priceFullGallery", suggestedGalleryPrice)} className="font-mono text-[10px] text-yellow hover:underline">
                  Suggest ${suggestedGalleryPrice} (40% off)
                </button>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-[var(--fg-muted)]">$</span>
              <input type="number" min={0} value={page.priceFullGallery}
                onChange={(e) => set("priceFullGallery", Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2.5 font-mono text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg outline-none focus:border-yellow transition-colors" />
            </div>
            {savings > 0 && <p className="font-sans text-[11px] text-green-400 mt-1">Clients save {savings}% vs buying individually</p>}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-sans text-sm font-medium text-[var(--fg)]">Show upsell banner</span>
              <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">Highlight bundle deal at top</p>
            </div>
            <Toggle checked={page.showUpsellBanner} onChange={() => set("showUpsellBanner", !page.showUpsellBanner)} />
          </div>
        </Section>
      )}

      {page.mode === "selection" && (
        <Section title="Selection limit">
          <div className="flex items-center gap-3">
            <input type="range" min={1} max={200} value={page.selectionLimit}
              onChange={(e) => set("selectionLimit", Number(e.target.value))}
              className="flex-1 accent-yellow" />
            <span className="font-mono text-sm font-bold text-[var(--fg)] w-16 text-right">{page.selectionLimit}</span>
          </div>
          <p className="font-sans text-[11px] text-[var(--fg-muted)]">Client can heart up to {page.selectionLimit} photos</p>
        </Section>
      )}

      <Section title="Downloads & Privacy">
        <div>
          <FieldLabel>Download resolution</FieldLabel>
          <div className="flex gap-2">
            {([
              { id: "full",   label: "Full res" },
              { id: "web",    label: "Web only" },
              { id: "choice", label: "Client's choice" },
            ] as { id: "full" | "web" | "choice"; label: string }[]).map((opt) => (
              <button key={opt.id} onClick={() => set("downloadRes", opt.id)}
                className={`flex-1 py-2 rounded-xl border font-sans text-xs font-medium transition-all ${
                  page.downloadRes === opt.id
                    ? "border-yellow bg-yellow/10 text-[var(--fg)]"
                    : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-sans text-sm font-medium text-[var(--fg)]">Watermark previews</span>
            <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">Add watermark to preview images</p>
          </div>
          <Toggle checked={page.watermark} onChange={() => set("watermark", !page.watermark)} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-sans text-sm font-medium text-[var(--fg)]">Proofing mode</span>
            <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">Clients can leave comments per photo</p>
          </div>
          <Toggle checked={page.proofingEnabled} onChange={() => set("proofingEnabled", !page.proofingEnabled)} />
        </div>
      </Section>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BUILDER ROOT
══════════════════════════════════════════════════════════════════════════ */

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "page",     label: "Page",     icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { id: "access",   label: "Access",   icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> },
  { id: "monetize", label: "Monetize", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
];

export function DeliveryBuilder({ pageId }: { pageId: string }) {
  const router = useRouter();
  const storePage = useDeliveryStore((s) => s.pages.find((p) => p.id === pageId));
  const updateStore = useDeliveryStore((s) => s.update);
  const hydrated = useDeliveryStore((s) => s.hydrated);

  const [page, setPage] = useState<DeliveryPage | null>(storePage ?? null);
  const [tab, setTab] = useState<TabId>("page");
  const [showGallery, setShowGallery] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Sync from store when it loads
  useEffect(() => {
    if (storePage && !page) setPage(storePage);
  }, [storePage, page]);

  const set = useCallback(<K extends keyof DeliveryPage>(key: K, value: DeliveryPage[K]) => {
    setPage((prev) => prev ? { ...prev, [key]: value } : prev);
    setDirty(true);
  }, []);

  const handleSave = () => {
    if (!page) return;
    updateStore(page.id, page);
    setDirty(false);
  };

  const handleBack = () => {
    if (dirty && !confirm("Discard unsaved changes?")) return;
    router.push("/dashboard/delivery");
  };

  if (!hydrated || !page) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[var(--bg)]">
        <span className="font-mono text-xs text-[var(--fg-muted)]">Loading…</span>
      </div>
    );
  }

  const status = STATUS_META[page.status];

  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--bg)]">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 py-2.5 border-b border-[var(--border)] shrink-0 bg-[var(--bg-card)]">
        <button onClick={handleBack} className="flex items-center gap-1.5 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors font-sans text-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <span className="text-[var(--border)]">/</span>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <input value={page.title} onChange={(e) => set("title", e.target.value)}
            className="font-sans font-bold text-sm text-[var(--fg)] bg-transparent outline-none border-b border-transparent focus:border-[var(--fg-muted)] transition-colors max-w-xs"
          />
          <span className="font-mono text-[11px] text-[var(--fg-muted)] truncate">· {page.client}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1 font-mono text-[10px] ${status.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
          <button onClick={() => set("status", page.status === "active" ? "draft" : "active")}
            className={`px-3 py-1.5 rounded-lg border font-sans text-xs font-medium transition-colors ${
              page.status === "active"
                ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                : "border-green-500/30 text-green-400 hover:bg-green-500/10"
            }`}
          >
            {page.status === "active" ? "Unpublish" : "Publish"}
          </button>
          <a href={`/d/${page.id}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Preview
          </a>
          <button onClick={handleSave} disabled={!dirty}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-yellow text-[#111] text-xs font-sans font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </div>

      {/* Body: sidebar with tabs + canvas */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <div className="w-[360px] shrink-0 flex flex-col border-r border-[var(--border)] bg-[var(--bg-card)]">
          {/* Tab bar */}
          <div className="flex border-b border-[var(--border)] shrink-0">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 font-sans text-xs font-medium transition-all border-b-2 -mb-px ${
                  tab === t.id
                    ? "border-yellow text-[var(--fg)]"
                    : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)]"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-4">
            {tab === "page"     && <PageTab     page={page} set={set} onOpenGallery={() => setShowGallery(true)} />}
            {tab === "access"   && <AccessTab   page={page} set={set} />}
            {tab === "monetize" && <MonetizeTab page={page} set={set} />}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <PreviewFrame page={page} />
        </div>
      </div>

      <AnimatePresence>
        {showGallery && (
          <GalleryModal page={page} onSave={(seeds) => { set("photoSeeds", seeds); set("photoCount", seeds.length); }} onClose={() => setShowGallery(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
