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
import { EditModeProvider, type FontSlot } from "./editable";

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

/* Accordion section — collapsible, with field highlighting */
function Accordion({
  id, title, count, isOpen, onToggle, isActive, children,
}: {
  id: string; title: string; count?: string; isOpen: boolean; onToggle: () => void; isActive?: boolean; children: React.ReactNode;
}) {
  return (
    <div data-section={id}
      className={`border-b border-[var(--border)] transition-colors ${isActive ? "bg-yellow/5" : ""}`}
    >
      <button onClick={onToggle}
        className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${isActive ? "text-[var(--fg)]" : "hover:bg-[var(--bg-subtle)]"}`}
      >
        <div className="flex items-center gap-2">
          <span className={`font-sans font-bold text-xs uppercase tracking-wider ${isActive ? "text-[var(--fg)]" : "text-[var(--fg)]"}`}>{title}</span>
          {count && <span className="font-mono text-[10px] text-[var(--fg-muted)]">{count}</span>}
        </div>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          className={`text-[var(--fg-muted)] transition-transform ${isOpen ? "rotate-90" : ""}`}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4 pt-1 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Map editable fields → which accordion section they live in */
const FIELD_TO_SECTION: Record<string, string> = {
  title:               "content",
  client:              "content",
  welcomeMessage:      "content",
  logoText:            "branding",
  logoUrl:             "branding",
  coverUrl:            "branding",
  passwordTitle:       "password",
  passwordSubtitle:    "password",
  passwordHint:        "password",
  passwordButtonLabel: "password",
};

/* ══════════════════════════════════════════════════════════════════════════
   IMAGE PICKERS — kept as-is
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
                    <div key={seed} style={{ aspectRatio: "1", overflow: "hidden", borderRadius: chosen.id === "minimal" ? 4 : 0 }}>
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
   SECTION PANELS
══════════════════════════════════════════════════════════════════════════ */

type Setter = <K extends keyof DeliveryPage>(k: K, v: DeliveryPage[K]) => void;

function TemplatePanel({ page, set }: { page: DeliveryPage; set: Setter }) {
  const [showTemplates, setShowTemplates] = useState(false);
  const current = TEMPLATES.find((t) => t.id === page.template)!;
  return (
    <>
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
    </>
  );
}

function ContentPanel({ page, set, focusedField, fieldRefs }: {
  page: DeliveryPage; set: Setter; focusedField: string | null;
  fieldRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
}) {
  return (
    <>
      <div ref={(el) => { fieldRefs.current.title = el; }}>
        <FieldLabel>Title</FieldLabel>
        <input value={page.title} onChange={(e) => set("title", e.target.value)}
          className={`w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border rounded-lg px-3 py-2 outline-none transition-colors ${focusedField === "title" ? "border-yellow" : "border-[var(--border)] focus:border-yellow"}`} />
      </div>
      <div ref={(el) => { fieldRefs.current.client = el; }}>
        <FieldLabel>Client</FieldLabel>
        <input value={page.client} onChange={(e) => set("client", e.target.value)}
          className={`w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border rounded-lg px-3 py-2 outline-none transition-colors ${focusedField === "client" ? "border-yellow" : "border-[var(--border)] focus:border-yellow"}`} />
      </div>
      <div ref={(el) => { fieldRefs.current.welcomeMessage = el; }}>
        <FieldLabel>Welcome message</FieldLabel>
        <textarea value={page.welcomeMessage} onChange={(e) => set("welcomeMessage", e.target.value)} rows={3}
          className={`w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border rounded-lg px-3 py-2.5 outline-none transition-colors resize-none ${focusedField === "welcomeMessage" ? "border-yellow" : "border-[var(--border)] focus:border-yellow"}`}
          placeholder="Write a personal message to your client…"
        />
        <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-1">Shown on the cover</p>
      </div>
    </>
  );
}

function BrandingPanel({ page, set, focusedField, fieldRefs, onOpenCoverAdjust }: {
  page: DeliveryPage; set: Setter; focusedField: string | null;
  fieldRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
  onOpenCoverAdjust: () => void;
}) {
  return (
    <>
      <div ref={(el) => { fieldRefs.current.logoText = el; }}>
        <FieldLabel>Logo mode</FieldLabel>
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
              className={`w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border rounded-lg px-3 py-2 outline-none transition-colors ${focusedField === "logoText" ? "border-yellow" : "border-[var(--border)] focus:border-yellow"}`} />
          )}
          {(page.logoMode === "image" || page.logoMode === "image+text") && (
            <>
              <ImageButton value={page.logoUrl} onChange={(u) => set("logoUrl", u)} placeholder="Upload logo" />
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <FieldLabel>Image width</FieldLabel>
                  <span className="font-mono text-[10px] text-[var(--fg-muted)]">
                    {page.logoWidth > 0 ? `${page.logoWidth}px` : "Auto"}
                  </span>
                </div>
                <input
                  type="range" min={0} max={240} step={4}
                  value={page.logoWidth}
                  onChange={(e) => set("logoWidth", Number(e.target.value))}
                  className="w-full accent-yellow"
                />
                <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-1">
                  Slide to 0 to use the template&apos;s default sizing.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      <div ref={(el) => { fieldRefs.current.coverUrl = el; }}>
        <FieldLabel>Cover image</FieldLabel>
        <ImageButton value={page.coverUrl} onChange={(u) => set("coverUrl", u)} placeholder="Use template default" />
        {/* Adjust trigger — only useful when fit is "cover" (cropping happens) */}
        <button
          onClick={onOpenCoverAdjust}
          disabled={page.coverFit === "contain"}
          className="mt-2 w-full flex items-center justify-between px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--fg-muted)] font-sans text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            Adjust crop
          </span>
          <span className="font-mono text-[10px]">{page.coverPositionY}%</span>
        </button>
      </div>
      <div>
        <FieldLabel>Cover fit</FieldLabel>
        <div className="flex gap-2">
          {([
            { id: "cover",   label: "Fill",  desc: "Crop to fill" },
            { id: "contain", label: "Fit",   desc: "Show whole image" },
          ] as { id: "cover" | "contain"; label: string; desc: string }[]).map((opt) => (
            <button key={opt.id} onClick={() => set("coverFit", opt.id)}
              className={`flex-1 py-2 rounded-xl border font-sans text-xs font-medium transition-all ${
                page.coverFit === opt.id
                  ? "border-yellow bg-yellow/10 text-[var(--fg)]"
                  : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
              title={opt.desc}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function ColorsPanel({ page, set }: { page: DeliveryPage; set: Setter }) {
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
    <>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-sans text-sm font-medium text-[var(--fg)]">Custom colors</span>
          <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">Override the template defaults</p>
        </div>
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
    </>
  );
}

/* One row of the Typography panel — one font slot. Hovering or focusing
   this control sets `highlightFontSlot` so every text in the canvas bound
   to the matching slot rings up in yellow. */
function FontSlotRow({
  slot, label, description, value, fontKey, set, onHighlight,
}: {
  slot: FontSlot; label: string; description: string;
  value: string; fontKey: "fontFamily1" | "fontFamily2" | "fontFamily3"; set: Setter;
  onHighlight: (s: FontSlot | null) => void;
}) {
  return (
    <div
      onMouseEnter={() => onHighlight(slot)}
      onMouseLeave={() => onHighlight(null)}
    >
      <div className="flex items-center justify-between mb-1.5">
        <FieldLabel>{label}</FieldLabel>
        <span className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-widest">Slot {slot}</span>
      </div>
      <select
        value={value}
        onChange={(e) => set(fontKey, e.target.value)}
        onFocus={() => onHighlight(slot)}
        onBlur={() => onHighlight(null)}
        className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors"
        style={{ fontFamily: value || undefined }}
      >
        <option value="" style={{ fontFamily: "inherit" }}>Template default</option>
        {DELIVERY_FONTS.map((f) => (
          <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>
        ))}
      </select>
      <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-1">{description}</p>
    </div>
  );
}

function TypographyPanel({
  page, set, onHighlightSlot,
}: {
  page: DeliveryPage; set: Setter; onHighlightSlot: (s: FontSlot | null) => void;
}) {
  return (
    <>
      <FontSlotRow slot={1} label="Display font" description="Headings, hero text, large titles" fontKey="fontFamily1" value={page.fontFamily1} set={set} onHighlight={onHighlightSlot} />
      <FontSlotRow slot={2} label="Body font"    description="Welcome message, body copy"        fontKey="fontFamily2" value={page.fontFamily2} set={set} onHighlight={onHighlightSlot} />
      <FontSlotRow slot={3} label="Mono / labels" description="Tags, counters, dates"             fontKey="fontFamily3" value={page.fontFamily3} set={set} onHighlight={onHighlightSlot} />
    </>
  );
}

function PhotosPanel({ page, set, onOpenGallery }: { page: DeliveryPage; set: Setter; onOpenGallery: () => void }) {
  return (
    <>
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
    </>
  );
}

function AccessPanel({ page, set }: { page: DeliveryPage; set: Setter }) {
  const genPassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    set("password", Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join(""));
  };
  const [emailDraft, setEmailDraft] = useState("");
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-sans text-sm font-medium text-[var(--fg)]">Password protection</span>
          <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">Require a password to view</p>
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

      <div className="pt-2 border-t border-[var(--border)]">
        <FieldLabel>Expiration date</FieldLabel>
        <input type="date" value={page.expiresAt ?? ""} onChange={(e) => set("expiresAt", e.target.value || null)}
          className="w-full font-mono text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow transition-colors" />
      </div>

      <div className="pt-2 border-t border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-sans text-sm font-medium text-[var(--fg)]">Client whitelist</span>
            <p className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">Restrict to specific emails</p>
          </div>
          <Toggle checked={page.whitelistEnabled} onChange={() => set("whitelistEnabled", !page.whitelistEnabled)} />
        </div>
        {page.whitelistEnabled && (
          <div className="space-y-1.5 mt-3">
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
      </div>
    </>
  );
}

/* Modal — drag-to-adjust the vertical crop position of the cover image.
   Mirrors how the template will actually render it: same aspect ratio,
   same objectFit + objectPosition. The slider commits on release so users
   can fine-tune without thrashing the store. */
function CoverAdjustModal({ page, set, onClose }: { page: DeliveryPage; set: Setter; onClose: () => void }) {
  const [y, setY] = useState(page.coverPositionY);
  const previewSrc = page.coverUrl || `https://picsum.photos/seed/${page.coverSeed}/1600/900`;

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const commit = () => { set("coverPositionY", y); onClose(); };
  const reset  = () => setY(50);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="w-full max-w-2xl bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
          <div>
            <h3 className="font-sans font-black text-[var(--fg)] text-sm">Adjust cover crop</h3>
            <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">Slide to choose what stays visible when the image is cropped</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)] transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="p-5 flex gap-4">
          {/* Preview — same aspect the template uses for the cover */}
          <div className="flex-1 relative overflow-hidden bg-black rounded-lg" style={{ aspectRatio: "16 / 9" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc} alt="" draggable={false}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover",
                objectPosition: `${page.coverPositionX ?? 50}% ${y}%`,
                userSelect: "none",
              }}
            />
            {/* Guide lines for rule of thirds */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.18) 1px, transparent 1px)",
              backgroundSize: "calc(100% / 3) calc(100% / 3)", backgroundPosition: "0 0",
            }} />
            <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/55 backdrop-blur-sm font-mono text-[9px] text-white/80 tracking-widest uppercase">Preview</div>
          </div>

          {/* Vertical slider */}
          <div className="flex flex-col items-center gap-3 py-2">
            <span className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-widest">Top</span>
            <div
              className="relative h-[280px] flex items-center justify-center"
              style={{ width: 28 }}
            >
              <input
                type="range" min={0} max={100} step={1}
                value={y}
                onChange={(e) => setY(Number(e.target.value))}
                aria-label="Vertical crop position"
                style={{
                  /* Rotate a horizontal range -90deg to make it vertical.
                     Width / height swap visually via the rotation. */
                  WebkitAppearance: "none", appearance: "none",
                  width: 280, height: 4, transform: "rotate(-90deg)",
                  background: `linear-gradient(to right, #fad502 0%, #fad502 ${y}%, var(--bg-subtle) ${y}%, var(--bg-subtle) 100%)`,
                  borderRadius: 4, outline: "none", cursor: "grab",
                  accentColor: "#fad502",
                }}
              />
            </div>
            <span className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-widest">Btm</span>
            <span className="font-mono text-xs text-[var(--fg)] mt-1 font-bold">{y}%</span>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-[var(--border)] flex items-center justify-between gap-2">
          <button onClick={reset}
            className="font-mono text-[11px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
          >
            Reset to center
          </button>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[var(--border)] font-sans text-xs font-medium text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
            >
              Cancel
            </button>
            <button onClick={commit}
              className="px-5 py-2 rounded-xl bg-yellow text-[#111] font-sans font-bold text-xs hover:opacity-90 transition-opacity"
            >
              Save crop
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function PasswordCopyPanel({
  page, set, focusedField, fieldRefs, onPreviewPasswordGate,
}: {
  page: DeliveryPage; set: Setter; focusedField: string | null;
  fieldRefs: React.MutableRefObject<Record<string, HTMLElement | null>>;
  onPreviewPasswordGate: () => void;
}) {
  const inputCls = (field: string) =>
    `w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border rounded-lg px-3 py-2 outline-none transition-colors ${focusedField === field ? "border-yellow" : "border-[var(--border)] focus:border-yellow"}`;
  return (
    <>
      {/* Protection status — inline toggle so the user never has to leave the panel */}
      <div className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${page.passwordEnabled ? "border-yellow/40 bg-yellow/5" : "border-[var(--border)] bg-[var(--bg-subtle)]"}`}>
        <div className="flex items-center gap-2 min-w-0">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={page.passwordEnabled ? "text-yellow" : "text-[var(--fg-muted)]"}>
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <div className="min-w-0">
            <div className="font-sans text-xs font-semibold text-[var(--fg)]">Protection {page.passwordEnabled ? "on" : "off"}</div>
            <div className="font-sans text-[11px] text-[var(--fg-muted)] truncate">{page.passwordEnabled ? "Clients see this page first" : "Anyone with the link gets straight in"}</div>
          </div>
        </div>
        <Toggle checked={page.passwordEnabled} onChange={() => set("passwordEnabled", !page.passwordEnabled)} />
      </div>

      <button
        onClick={onPreviewPasswordGate}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:border-yellow hover:text-yellow transition-colors font-sans text-xs"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        Show password page in preview
      </button>
      <div ref={(el) => { fieldRefs.current.passwordTitle = el; }}>
        <FieldLabel>Title</FieldLabel>
        <input value={page.passwordTitle} onChange={(e) => set("passwordTitle", e.target.value)} className={inputCls("passwordTitle")} />
      </div>
      <div ref={(el) => { fieldRefs.current.passwordSubtitle = el; }}>
        <FieldLabel>Subtitle</FieldLabel>
        <input value={page.passwordSubtitle} onChange={(e) => set("passwordSubtitle", e.target.value)} className={inputCls("passwordSubtitle")} />
      </div>
      <div ref={(el) => { fieldRefs.current.passwordButtonLabel = el; }}>
        <FieldLabel>Unlock button</FieldLabel>
        <input value={page.passwordButtonLabel} onChange={(e) => set("passwordButtonLabel", e.target.value)} className={inputCls("passwordButtonLabel")} />
      </div>
      <div ref={(el) => { fieldRefs.current.passwordHint = el; }}>
        <FieldLabel>Hint line</FieldLabel>
        <input value={page.passwordHint} onChange={(e) => set("passwordHint", e.target.value)} className={inputCls("passwordHint")} placeholder="Optional" />
      </div>
    </>
  );
}

function MonetizePanel({ page, set }: { page: DeliveryPage; set: Setter }) {
  const photoCount = page.photoSeeds.length || page.photoCount;
  const suggestedGalleryPrice = page.pricePerPhoto > 0 ? Math.round(page.pricePerPhoto * photoCount * 0.6) : 0;
  const savings = page.pricePerPhoto > 0 && photoCount > 0
    ? Math.round((1 - page.priceFullGallery / (page.pricePerPhoto * photoCount)) * 100)
    : 0;
  return (
    <>
      <div>
        <FieldLabel>Mode</FieldLabel>
        <div className="flex flex-col gap-2">
          {([
            { id: "gift",   label: "Gift / Free",  desc: "Client downloads at no cost",
              icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5" rx="1"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg> },
            { id: "direct", label: "Direct Sale",  desc: "Buy individually or as bundle. Watermark is added automatically.",
              icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
          ] as { id: DeliveryMode; label: string; desc: string; icon: React.ReactNode }[]).map((opt) => (
            <button key={opt.id} onClick={() => set("mode", opt.id)}
              className={`flex items-start gap-3 px-3 py-3 rounded-xl border text-left transition-all ${
                page.mode === opt.id ? "border-yellow bg-yellow/5" : "border-[var(--border)] hover:border-[var(--fg-muted)]"
              }`}
            >
              <span className={`mt-0.5 shrink-0 ${page.mode === opt.id ? "text-yellow" : "text-[var(--fg-muted)]"}`}>
                {opt.icon}
              </span>
              <div>
                <div className="font-sans text-sm font-medium text-[var(--fg)]">{opt.label}</div>
                <div className="font-sans text-[11px] text-[var(--fg-muted)] mt-0.5">{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {page.mode === "direct" && (
        <>
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
        </>
      )}

      <div className="pt-3 border-t border-[var(--border)]">
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
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BUILDER ROOT
══════════════════════════════════════════════════════════════════════════ */

type SectionId = "template" | "content" | "branding" | "colors" | "typography" | "photos" | "access" | "password" | "monetize";
type DeliveryView = "gallery" | "password";

export function DeliveryBuilder({ pageId }: { pageId: string }) {
  const router = useRouter();
  const storePage = useDeliveryStore((s) => s.pages.find((p) => p.id === pageId));
  const updateStore = useDeliveryStore((s) => s.update);
  const hydrated = useDeliveryStore((s) => s.hydrated);

  const [page, setPage] = useState<DeliveryPage | null>(storePage ?? null);
  const [openSections, setOpenSections] = useState<Set<SectionId>>(new Set(["content", "branding"]));
  const [activeField, setActiveField] = useState<string | null>(null);
  const [highlightFontSlot, setHighlightFontSlot] = useState<FontSlot | null>(null);
  const [view, setView] = useState<DeliveryView>("gallery");
  const [showGallery, setShowGallery] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [showCoverAdjust, setShowCoverAdjust] = useState(false);
  const [dirty, setDirty] = useState(false);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (storePage && !page) setPage(storePage);
  }, [storePage, page]);

  const set = useCallback(<K extends keyof DeliveryPage>(key: K, value: DeliveryPage[K]) => {
    setPage((prev) => prev ? { ...prev, [key]: value } : prev);
    setDirty(true);
  }, []);

  /* When a field is focused (clicked in the canvas or via accordion section),
     open the matching sidebar section, scroll the input into view, and switch
     the preview view so the user sees the element they care about. */
  const focusField = useCallback((fieldPath: string) => {
    setActiveField(fieldPath);
    const sectionId = FIELD_TO_SECTION[fieldPath] as SectionId | undefined;
    if (sectionId === "password") setView("password");
    if (sectionId) {
      setOpenSections((prev) => {
        if (prev.has(sectionId)) return prev;
        const next = new Set(prev); next.add(sectionId); return next;
      });
      requestAnimationFrame(() => {
        const el = fieldRefs.current[fieldPath];
        if (el?.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  }, []);

  const toggleSection = (id: SectionId) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

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
  const activeSection = activeField ? FIELD_TO_SECTION[activeField] : null;

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

      {/* Body: accordion sidebar + live canvas */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="w-[360px] shrink-0 flex flex-col border-r border-[var(--border)] bg-[var(--bg-card)] overflow-y-auto">
          <Accordion id="template" title="Template" count={TEMPLATES.find((t) => t.id === page.template)?.label}
            isOpen={openSections.has("template")} onToggle={() => toggleSection("template")}
          >
            <TemplatePanel page={page} set={set} />
          </Accordion>
          <Accordion id="content" title="Content"
            isOpen={openSections.has("content")} onToggle={() => toggleSection("content")} isActive={activeSection === "content"}
          >
            <ContentPanel page={page} set={set} focusedField={activeField} fieldRefs={fieldRefs} />
          </Accordion>
          <Accordion id="branding" title="Branding"
            isOpen={openSections.has("branding")} onToggle={() => toggleSection("branding")} isActive={activeSection === "branding"}
          >
            <BrandingPanel page={page} set={set} focusedField={activeField} fieldRefs={fieldRefs} onOpenCoverAdjust={() => setShowCoverAdjust(true)} />
          </Accordion>
          <Accordion id="colors" title="Colors" count={page.customColors ? "custom" : "default"}
            isOpen={openSections.has("colors")} onToggle={() => toggleSection("colors")}
          >
            <ColorsPanel page={page} set={set} />
          </Accordion>
          <Accordion id="typography" title="Typography"
            isOpen={openSections.has("typography")} onToggle={() => toggleSection("typography")}
          >
            <TypographyPanel page={page} set={set} onHighlightSlot={setHighlightFontSlot} />
          </Accordion>
          <Accordion id="photos" title="Photos" count={`${page.photoSeeds.length || page.photoCount}`}
            isOpen={openSections.has("photos")} onToggle={() => toggleSection("photos")}
          >
            <PhotosPanel page={page} set={set} onOpenGallery={() => setShowGallery(true)} />
          </Accordion>
          <Accordion id="access" title="Access" count={page.passwordEnabled ? "protected" : "public"}
            isOpen={openSections.has("access")} onToggle={() => toggleSection("access")}
          >
            <AccessPanel page={page} set={set} />
          </Accordion>
          <Accordion id="password" title="Password page" count={page.passwordEnabled ? "on" : "off"}
            isOpen={openSections.has("password")} onToggle={() => toggleSection("password")} isActive={activeSection === "password"}
          >
            <PasswordCopyPanel page={page} set={set} focusedField={activeField} fieldRefs={fieldRefs}
              onPreviewPasswordGate={() => setView("password")}
            />
          </Accordion>
          <Accordion id="monetize" title="Monetize" count={page.mode}
            isOpen={openSections.has("monetize")} onToggle={() => toggleSection("monetize")}
          >
            <MonetizePanel page={page} set={set} />
          </Accordion>
        </div>

        {/* Live canvas */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <EditModeProvider editMode activeField={activeField} focusField={focusField} highlightFontSlot={highlightFontSlot}>
            <PreviewFrame page={page} view={view} onViewChange={setView} set={set} onRequestCoverChange={() => setShowCoverPicker(true)} />
          </EditModeProvider>
        </div>
      </div>

      <AnimatePresence>
        {showGallery && (
          <GalleryModal page={page} onSave={(seeds) => { set("photoSeeds", seeds); set("photoCount", seeds.length); }} onClose={() => setShowGallery(false)} />
        )}
        {showCoverPicker && (
          <SinglePhotoPicker value={page.coverUrl} onSelect={(u) => set("coverUrl", u)} onClose={() => setShowCoverPicker(false)} />
        )}
        {showCoverAdjust && (
          <CoverAdjustModal page={page} set={set} onClose={() => setShowCoverAdjust(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
