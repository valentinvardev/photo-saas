"use client";

import { useState, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════════════════════ */

interface LinkItem {
  id: string;
  type: "link" | "divider";
  title: string;
  url: string;
  enabled: boolean;
}

type BgType = "solid" | "gradient" | "image";
type BtnShape = "square" | "rounded" | "pill";
type BtnVariant = "filled" | "outline" | "glass";

interface PageConfig {
  displayName: string;
  bio: string;
  avatarBg: string;
  avatarInitial: string;
  bgType: BgType;
  bgColor: string;
  bgGradFrom: string;
  bgGradTo: string;
  bgGradAngle: number;
  bgImageUrl: string;
  btnShape: BtnShape;
  btnVariant: BtnVariant;
  btnBg: string;
  btnText: string;
  btnBorder: string;
  fontFamily: string;
  textColor: string;
  subColor: string;
}

/* ══════════════════════════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════════════════════════ */

const FONTS = [
  { label: "Inter",            value: "Inter, sans-serif" },
  { label: "DM Sans",          value: "'DM Sans', sans-serif" },
  { label: "Poppins",          value: "Poppins, sans-serif" },
  { label: "Raleway",          value: "Raleway, sans-serif" },
  { label: "Playfair Display", value: "'Playfair Display', serif" },
  { label: "Lora",             value: "Lora, serif" },
  { label: "Space Mono",       value: "'Space Mono', monospace" },
  { label: "Bebas Neue",       value: "'Bebas Neue', cursive" },
];

type ThemePreset = {
  name: string;
  previewBg: string;
  config: Partial<PageConfig>;
};

const THEMES: ThemePreset[] = [
  {
    name: "Dark",
    previewBg: "#111111",
    config: {
      bgType: "solid", bgColor: "#111111",
      btnShape: "rounded", btnVariant: "outline",
      btnBg: "#111111", btnText: "#ffffff", btnBorder: "#ffffff",
      textColor: "#ffffff", subColor: "#999999", fontFamily: "Inter, sans-serif",
    },
  },
  {
    name: "Light",
    previewBg: "#f8f8f8",
    config: {
      bgType: "solid", bgColor: "#f8f8f8",
      btnShape: "pill", btnVariant: "filled",
      btnBg: "#111111", btnText: "#ffffff", btnBorder: "#111111",
      textColor: "#111111", subColor: "#666666", fontFamily: "Inter, sans-serif",
    },
  },
  {
    name: "Sunset",
    previewBg: "linear-gradient(135deg,#f5a623,#d0021b)",
    config: {
      bgType: "gradient", bgGradFrom: "#f5a623", bgGradTo: "#d0021b", bgGradAngle: 135,
      btnShape: "pill", btnVariant: "glass",
      btnBg: "#f5a623", btnText: "#ffffff", btnBorder: "rgba(255,255,255,0.4)",
      textColor: "#ffffff", subColor: "rgba(255,255,255,0.75)", fontFamily: "Raleway, sans-serif",
    },
  },
  {
    name: "Ocean",
    previewBg: "linear-gradient(160deg,#0f2027,#2980b9)",
    config: {
      bgType: "gradient", bgGradFrom: "#0f2027", bgGradTo: "#2980b9", bgGradAngle: 160,
      btnShape: "rounded", btnVariant: "glass",
      btnBg: "#2980b9", btnText: "#ffffff", btnBorder: "rgba(255,255,255,0.3)",
      textColor: "#ffffff", subColor: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif",
    },
  },
  {
    name: "Rose",
    previewBg: "linear-gradient(135deg,#fce4ec,#f48fb1)",
    config: {
      bgType: "gradient", bgGradFrom: "#fce4ec", bgGradTo: "#f48fb1", bgGradAngle: 135,
      btnShape: "pill", btnVariant: "filled",
      btnBg: "#e91e63", btnText: "#ffffff", btnBorder: "#e91e63",
      textColor: "#880e4f", subColor: "#ad1457", fontFamily: "Lora, serif",
    },
  },
  {
    name: "Forest",
    previewBg: "#1a2e1a",
    config: {
      bgType: "solid", bgColor: "#1a2e1a",
      btnShape: "square", btnVariant: "filled",
      btnBg: "#2d5a2d", btnText: "#e8f5e9", btnBorder: "#4caf50",
      textColor: "#e8f5e9", subColor: "#a5d6a7", fontFamily: "Lora, serif",
    },
  },
  {
    name: "Midnight",
    previewBg: "linear-gradient(180deg,#0a0a1a,#1a1a3e)",
    config: {
      bgType: "gradient", bgGradFrom: "#0a0a1a", bgGradTo: "#1a1a3e", bgGradAngle: 180,
      btnShape: "pill", btnVariant: "filled",
      btnBg: "#7c3aed", btnText: "#ffffff", btnBorder: "#7c3aed",
      textColor: "#ffffff", subColor: "#a78bfa", fontFamily: "Poppins, sans-serif",
    },
  },
  {
    name: "Sand",
    previewBg: "#fafaf9",
    config: {
      bgType: "solid", bgColor: "#fafaf9",
      btnShape: "rounded", btnVariant: "outline",
      btnBg: "#fafaf9", btnText: "#292524", btnBorder: "#d6d3d1",
      textColor: "#292524", subColor: "#78716c", fontFamily: "Poppins, sans-serif",
    },
  },
];

const DEFAULT_LINKS: LinkItem[] = [
  { id: "1", type: "link",    title: "Portfolio website",  url: "https://sofia.frame.so",              enabled: true  },
  { id: "2", type: "link",    title: "Instagram",          url: "https://instagram.com/sofiachenphoto", enabled: true  },
  { id: "3", type: "link",    title: "Book a session",     url: "https://sofia.frame.so/book",          enabled: true  },
  { id: "4", type: "link",    title: "Print shop",         url: "https://sofia.frame.so/prints",        enabled: false },
];

const DEFAULT_CONFIG: PageConfig = {
  displayName:  "Sofia Chen",
  bio:          "Fine art & portrait photographer · Buenos Aires",
  avatarBg:     "#fad502",
  avatarInitial: "S",
  bgType:       "solid",
  bgColor:      "#111111",
  bgGradFrom:   "#111111",
  bgGradTo:     "#333333",
  bgGradAngle:  135,
  bgImageUrl:   "",
  btnShape:     "rounded",
  btnVariant:   "outline",
  btnBg:        "#111111",
  btnText:      "#ffffff",
  btnBorder:    "#ffffff",
  fontFamily:   "Inter, sans-serif",
  textColor:    "#ffffff",
  subColor:     "#999999",
};

/* ══════════════════════════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════════════════════════ */

function DragDots() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="5" cy="4"  r="1.5"/><circle cx="11" cy="4"  r="1.5"/>
      <circle cx="5" cy="8"  r="1.5"/><circle cx="11" cy="8"  r="1.5"/>
      <circle cx="5" cy="12" r="1.5"/><circle cx="11" cy="12" r="1.5"/>
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  );
}
function ChevUp() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  );
}
function ChevDown() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
    </svg>
  );
}
function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}
function DividerIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SMALL HELPERS
══════════════════════════════════════════════════════════════════════════ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-[var(--fg-muted)] mb-2.5">
      {children}
    </p>
  );
}

function ColorRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-sans text-xs text-[var(--fg-muted)] flex-1 truncate">{label}</span>
      <label className="flex items-center gap-1.5 border border-[var(--border)] rounded-lg px-2 py-1 cursor-pointer hover:border-[var(--fg-muted)] transition-colors">
        <span
          className="w-4 h-4 rounded shrink-0 border border-black/10"
          style={{ background: value }}
        />
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="sr-only" />
        <span className="font-mono text-[11px] text-[var(--fg)] w-14 select-none">{value}</span>
      </label>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-8 h-[18px] rounded-full transition-colors shrink-0 ${
        checked ? "bg-yellow" : "bg-[var(--bg-subtle)]"
      }`}
    >
      <span
        className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-[18px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   LINKS TAB
══════════════════════════════════════════════════════════════════════════ */

function LinksTab({
  links,
  setLinks,
}: {
  links: LinkItem[];
  setLinks: React.Dispatch<React.SetStateAction<LinkItem[]>>;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addLink = () => {
    const id = `lnk-${Date.now()}`;
    setLinks((prev) => [...prev, { id, type: "link", title: "New link", url: "https://", enabled: true }]);
    setEditingId(id);
  };

  const addDivider = () => {
    setLinks((prev) => [
      ...prev,
      { id: `div-${Date.now()}`, type: "divider", title: "Section", url: "", enabled: true },
    ]);
  };

  const remove  = (id: string) => setLinks((prev) => prev.filter((l) => l.id !== id));
  const toggle  = (id: string) => setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)));
  const update  = (id: string, field: "title" | "url", val: string) =>
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: val } : l)));

  const moveUp = (idx: number) =>
    setLinks((prev) => {
      if (idx === 0) return prev;
      const a = [...prev];
      const tmp = a[idx - 1]!;
      a[idx - 1] = a[idx]!;
      a[idx] = tmp;
      return a;
    });

  const moveDown = (idx: number) =>
    setLinks((prev) => {
      if (idx >= prev.length - 1) return prev;
      const a = [...prev];
      const tmp = a[idx]!;
      a[idx] = a[idx + 1]!;
      a[idx + 1] = tmp;
      return a;
    });

  return (
    <div className="flex flex-col gap-3">
      {/* Add buttons */}
      <div className="flex gap-2">
        <button
          onClick={addLink}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-[var(--border)] font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
        >
          <PlusIcon /> Add link
        </button>
        <button
          onClick={addDivider}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-dashed border-[var(--border)] font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
        >
          <DividerIcon /> Divider
        </button>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2">
        {links.map((link, idx) => (
          <div
            key={link.id}
            className={`rounded-xl border border-[var(--border)] bg-[var(--bg)] transition-opacity ${
              !link.enabled ? "opacity-50" : ""
            }`}
          >
            {link.type === "divider" ? (
              /* ── Divider row ── */
              <div className="flex items-center gap-2 px-3 py-2.5">
                <span className="text-[var(--fg-muted)] cursor-grab shrink-0"><DragDots /></span>
                <input
                  value={link.title}
                  onChange={(e) => update(link.id, "title", e.target.value)}
                  className="flex-1 min-w-0 font-sans text-xs text-[var(--fg-muted)] italic bg-transparent outline-none"
                  placeholder="Section label"
                />
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => moveUp(idx)}   className="p-0.5 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"><ChevUp /></button>
                  <button onClick={() => moveDown(idx)} className="p-0.5 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"><ChevDown /></button>
                  <button onClick={() => remove(link.id)} className="p-0.5 text-[var(--fg-muted)] hover:text-red-400 transition-colors"><TrashIcon /></button>
                </div>
              </div>
            ) : (
              /* ── Link row ── */
              <div className="px-3 py-2.5">
                <div className="flex items-start gap-2">
                  <span className="text-[var(--fg-muted)] cursor-grab shrink-0 mt-1"><DragDots /></span>

                  <div className="flex-1 min-w-0">
                    {editingId === link.id ? (
                      <div className="flex flex-col gap-1.5">
                        <input
                          autoFocus
                          value={link.title}
                          onChange={(e) => update(link.id, "title", e.target.value)}
                          className="w-full font-sans text-sm font-medium text-[var(--fg)] bg-[var(--bg-subtle)] rounded-lg px-2.5 py-1.5 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
                          placeholder="Link title"
                        />
                        <input
                          value={link.url}
                          onChange={(e) => update(link.id, "url", e.target.value)}
                          className="w-full font-mono text-xs text-[var(--fg-muted)] bg-[var(--bg-subtle)] rounded-lg px-2.5 py-1.5 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
                          placeholder="https://"
                        />
                        <button
                          onClick={() => setEditingId(null)}
                          className="self-start font-sans text-xs text-yellow hover:opacity-80 transition-opacity"
                        >
                          Done
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingId(link.id)}
                        className="text-left w-full group"
                      >
                        <div className="font-sans text-sm font-medium text-[var(--fg)] group-hover:text-yellow transition-colors leading-tight truncate">
                          {link.title || "Untitled"}
                        </div>
                        <div className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5 truncate">
                          {link.url || "No URL set"}
                        </div>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    <Toggle checked={link.enabled} onChange={() => toggle(link.id)} />
                    <button onClick={() => moveUp(idx)}   className="p-0.5 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"><ChevUp /></button>
                    <button onClick={() => moveDown(idx)} className="p-0.5 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"><ChevDown /></button>
                    <button onClick={() => remove(link.id)} className="p-0.5 text-[var(--fg-muted)] hover:text-red-400 transition-colors"><TrashIcon /></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {links.length === 0 && (
        <p className="text-center py-10 font-sans text-xs text-[var(--fg-muted)]">
          No links yet. Add your first one above.
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   APPEARANCE TAB
══════════════════════════════════════════════════════════════════════════ */

function AppearanceTab({
  config,
  setConfig,
}: {
  config: PageConfig;
  setConfig: React.Dispatch<React.SetStateAction<PageConfig>>;
}) {
  const set = useCallback(
    <K extends keyof PageConfig>(key: K, value: PageConfig[K]) =>
      setConfig((prev) => ({ ...prev, [key]: value })),
    [setConfig],
  );

  return (
    <div className="flex flex-col gap-6">

      {/* ── Profile ── */}
      <div>
        <SectionLabel>Profile</SectionLabel>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {/* Avatar preview */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-sans font-black text-xl text-[#111] border-2 border-[var(--border)]"
              style={{ background: config.avatarBg }}
            >
              {config.avatarInitial}
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs text-[var(--fg-muted)] w-10 shrink-0">Initial</span>
                <input
                  value={config.avatarInitial}
                  onChange={(e) => set("avatarInitial", e.target.value.slice(0, 2).toUpperCase())}
                  className="w-10 font-sans text-sm text-center font-bold text-[var(--fg)] bg-[var(--bg-subtle)] rounded-lg px-2 py-1 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
                />
              </div>
              <ColorRow label="Color" value={config.avatarBg} onChange={(v) => set("avatarBg", v)} />
            </div>
          </div>
          <div>
            <span className="font-sans text-xs text-[var(--fg-muted)] block mb-1">Display name</span>
            <input
              value={config.displayName}
              onChange={(e) => set("displayName", e.target.value)}
              className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg-subtle)] rounded-lg px-3 py-2 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
            />
          </div>
          <div>
            <span className="font-sans text-xs text-[var(--fg-muted)] block mb-1">Bio</span>
            <textarea
              value={config.bio}
              onChange={(e) => set("bio", e.target.value)}
              rows={2}
              className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg-subtle)] rounded-lg px-3 py-2 outline-none border border-[var(--border)] focus:border-yellow transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* ── Background ── */}
      <div>
        <SectionLabel>Background</SectionLabel>
        {/* Type tabs */}
        <div className="flex gap-0.5 p-1 bg-[var(--bg-subtle)] rounded-xl mb-3">
          {(["solid", "gradient", "image"] as BgType[]).map((t) => (
            <button
              key={t}
              onClick={() => set("bgType", t)}
              className={`flex-1 font-sans text-xs py-1.5 rounded-lg capitalize transition-all ${
                config.bgType === t
                  ? "bg-[var(--bg-card)] text-[var(--fg)] shadow-sm font-medium"
                  : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {config.bgType === "solid" && (
          <ColorRow label="Color" value={config.bgColor} onChange={(v) => set("bgColor", v)} />
        )}

        {config.bgType === "gradient" && (
          <div className="flex flex-col gap-2">
            <ColorRow label="From" value={config.bgGradFrom} onChange={(v) => set("bgGradFrom", v)} />
            <ColorRow label="To"   value={config.bgGradTo}   onChange={(v) => set("bgGradTo",   v)} />
            <div className="flex items-center gap-2">
              <span className="font-sans text-xs text-[var(--fg-muted)] flex-1">Angle</span>
              <input
                type="range" min={0} max={360} value={config.bgGradAngle}
                onChange={(e) => set("bgGradAngle", Number(e.target.value))}
                className="w-24 accent-yellow"
              />
              <span className="font-mono text-xs text-[var(--fg)] w-8 text-right">{config.bgGradAngle}°</span>
            </div>
            <div
              className="h-7 rounded-lg mt-0.5"
              style={{ background: `linear-gradient(${config.bgGradAngle}deg, ${config.bgGradFrom}, ${config.bgGradTo})` }}
            />
          </div>
        )}

        {config.bgType === "image" && (
          <div>
            <span className="font-sans text-xs text-[var(--fg-muted)] block mb-1">Image URL</span>
            <input
              value={config.bgImageUrl}
              onChange={(e) => set("bgImageUrl", e.target.value)}
              className="w-full font-mono text-xs text-[var(--fg)] bg-[var(--bg-subtle)] rounded-lg px-3 py-2 outline-none border border-[var(--border)] focus:border-yellow transition-colors"
              placeholder="https://..."
            />
          </div>
        )}
      </div>

      {/* ── Button Style ── */}
      <div>
        <SectionLabel>Buttons</SectionLabel>
        <div className="flex flex-col gap-3">
          {/* Shape */}
          <div>
            <span className="font-sans text-xs text-[var(--fg-muted)] block mb-2">Shape</span>
            <div className="flex gap-2">
              {(
                [
                  { value: "square",  label: "Square",  br: "6px" },
                  { value: "rounded", label: "Rounded", br: "12px" },
                  { value: "pill",    label: "Pill",    br: "9999px" },
                ] as { value: BtnShape; label: string; br: string }[]
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set("btnShape", opt.value)}
                  className={`flex-1 py-2.5 border font-sans text-xs transition-all ${
                    config.btnShape === opt.value
                      ? "border-yellow bg-yellow/10 text-[var(--fg)] font-medium"
                      : "border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)]"
                  }`}
                  style={{ borderRadius: opt.br }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Variant */}
          <div>
            <span className="font-sans text-xs text-[var(--fg-muted)] block mb-2">Style</span>
            <div className="flex gap-2">
              {(["filled", "outline", "glass"] as BtnVariant[]).map((v) => (
                <button
                  key={v}
                  onClick={() => set("btnVariant", v)}
                  className={`flex-1 py-2 rounded-xl border capitalize font-sans text-xs transition-all ${
                    config.btnVariant === v
                      ? "border-yellow bg-yellow/10 text-[var(--fg)] font-medium"
                      : "border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)]"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Colors ── */}
      <div>
        <SectionLabel>Colors</SectionLabel>
        <div className="flex flex-col gap-2.5">
          <ColorRow label="Button fill"   value={config.btnBg}     onChange={(v) => set("btnBg",     v)} />
          <ColorRow label="Button text"   value={config.btnText}   onChange={(v) => set("btnText",   v)} />
          <ColorRow label="Button border" value={config.btnBorder} onChange={(v) => set("btnBorder", v)} />
          <div className="h-px bg-[var(--border)] my-0.5" />
          <ColorRow label="Page text"     value={config.textColor} onChange={(v) => set("textColor", v)} />
          <ColorRow label="Subtext"       value={config.subColor}  onChange={(v) => set("subColor",  v)} />
        </div>
      </div>

      {/* ── Typography ── */}
      <div>
        <SectionLabel>Typography</SectionLabel>
        <div>
          <span className="font-sans text-xs text-[var(--fg-muted)] block mb-1.5">Font family</span>
          <select
            value={config.fontFamily}
            onChange={(e) => set("fontFamily", e.target.value)}
            className="w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg-subtle)] rounded-lg px-3 py-2 outline-none border border-[var(--border)] focus:border-yellow transition-colors cursor-pointer"
          >
            {FONTS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Themes ── */}
      <div>
        <SectionLabel>Themes</SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.name}
              onClick={() => setConfig((prev) => ({ ...prev, ...t.config }))}
              className="flex flex-col items-center gap-1.5 group"
              title={t.name}
            >
              <div
                className="w-full aspect-square rounded-xl border-2 border-transparent group-hover:border-yellow transition-all shadow-sm"
                style={{ background: t.previewBg }}
              />
              <span className="font-sans text-[9px] text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors w-full text-center truncate">
                {t.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PREVIEW
══════════════════════════════════════════════════════════════════════════ */

function getBgStyle(c: PageConfig): React.CSSProperties {
  if (c.bgType === "gradient")
    return { background: `linear-gradient(${c.bgGradAngle}deg, ${c.bgGradFrom}, ${c.bgGradTo})` };
  if (c.bgType === "image" && c.bgImageUrl)
    return { backgroundImage: `url(${c.bgImageUrl})`, backgroundSize: "cover", backgroundPosition: "center" };
  return { background: c.bgColor };
}

function getBtnStyle(c: PageConfig): React.CSSProperties {
  const radius =
    c.btnShape === "pill"    ? "9999px" :
    c.btnShape === "rounded" ? "14px"   : "6px";

  if (c.btnVariant === "outline")
    return { borderRadius: radius, background: "transparent", color: c.btnText, border: `1.5px solid ${c.btnBorder}` };
  if (c.btnVariant === "glass")
    return { borderRadius: radius, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", color: c.btnText, border: "1px solid rgba(255,255,255,0.25)" };
  // filled
  return { borderRadius: radius, background: c.btnBg, color: c.btnText, border: "none" };
}

function LinkTreeView({ links, config }: { links: LinkItem[]; config: PageConfig }) {
  const enabledLinks = links.filter((l) => l.enabled);
  const btnStyle     = getBtnStyle(config);

  return (
    <div className="w-full h-full overflow-y-auto" style={{ ...getBgStyle(config), fontFamily: config.fontFamily }}>
      <div className="flex flex-col items-center px-5 pt-10 pb-12 gap-4">
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl shrink-0"
          style={{ background: config.avatarBg, color: "#111111" }}
        >
          {config.avatarInitial}
        </div>

        {/* Name + bio */}
        <div className="text-center">
          <div className="font-bold text-[15px] leading-tight" style={{ color: config.textColor }}>
            {config.displayName}
          </div>
          {config.bio && (
            <div className="text-[11px] mt-1 leading-relaxed" style={{ color: config.subColor }}>
              {config.bio}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="w-full flex flex-col gap-2.5 mt-1">
          {enabledLinks.map((link) =>
            link.type === "divider" ? (
              <div key={link.id} className="flex items-center gap-2 py-0.5">
                <div className="flex-1 h-px" style={{ background: `${config.subColor}40` }} />
                {link.title && (
                  <span
                    className="text-[9px] font-semibold uppercase tracking-widest px-1"
                    style={{ color: config.subColor }}
                  >
                    {link.title}
                  </span>
                )}
                <div className="flex-1 h-px" style={{ background: `${config.subColor}40` }} />
              </div>
            ) : (
              <div
                key={link.id}
                className="w-full py-3 px-4 text-center text-[12px] font-semibold"
                style={btnStyle}
              >
                {link.title}
              </div>
            )
          )}
        </div>

        {/* Watermark */}
        <div
          className="mt-4 font-sans font-black text-[9px] tracking-widest"
          style={{ color: `${config.subColor}60` }}
        >
          FRAME
        </div>
      </div>
    </div>
  );
}

function PhoneShell({ links, config }: { links: LinkItem[]; config: PageConfig }) {
  return (
    <div className="relative" style={{ width: 280, height: 568 }}>
      {/* Outer shell */}
      <div
        className="absolute inset-0 rounded-[40px] shadow-2xl"
        style={{ background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)" }}
      />
      {/* Inner screen bezel */}
      <div className="absolute inset-[5px] rounded-[36px] bg-black overflow-hidden">
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pt-3 pb-1 pointer-events-none">
          <span className="font-mono text-[9px] font-bold text-white/80">9:41</span>
          {/* Dynamic island */}
          <div className="w-20 h-5 bg-black rounded-full" />
          <div className="flex items-center gap-1">
            <svg width="11" height="8" viewBox="0 0 24 18" fill="white" opacity={0.8}>
              <path d="M1 1c6.1-1.3 15.9-1.3 22 0M5 6.5c3.9-.9 10.1-.9 14 0M9 12c2-.5 6-.5 8 0" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            </svg>
            <svg width="18" height="9" viewBox="0 0 26 12" fill="none">
              <rect x="1" y="1" width="20" height="10" rx="2.5" stroke="white" strokeWidth="1.5" opacity={0.8}/>
              <rect x="3" y="3" width="14" height="6" rx="1.5" fill="white" opacity={0.8}/>
              <path d="M23 4v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity={0.8}/>
            </svg>
          </div>
        </div>
        {/* Content fills from top */}
        <div className="absolute inset-0">
          <LinkTreeView links={links} config={config} />
        </div>
      </div>
      {/* Volume buttons */}
      <div className="absolute left-[-3.5px] top-[100px] w-[3.5px] h-8  rounded-l-sm" style={{ background: "#333" }} />
      <div className="absolute left-[-3.5px] top-[144px] w-[3.5px] h-10 rounded-l-sm" style={{ background: "#333" }} />
      <div className="absolute left-[-3.5px] top-[196px] w-[3.5px] h-10 rounded-l-sm" style={{ background: "#333" }} />
      {/* Power button */}
      <div className="absolute right-[-3.5px] top-[148px] w-[3.5px] h-14 rounded-r-sm" style={{ background: "#333" }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════ */

export default function LinksPage() {
  const [links,     setLinks]     = useState<LinkItem[]>(DEFAULT_LINKS);
  const [config,    setConfig]    = useState<PageConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<"links" | "appearance">("links");
  const [copied,    setCopied]    = useState(false);

  const publicUrl = "frame.so/@sofia";

  const copyUrl = () => {
    navigator.clipboard.writeText(`https://${publicUrl}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
        <div>
          <h1 className="font-sans font-bold text-lg text-[var(--fg)] leading-tight">Link Page</h1>
          <p className="font-mono text-xs text-[var(--fg-muted)] mt-0.5">{publicUrl}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-sans text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
          >
            <CopyIcon />
            {copied ? "Copied!" : "Copy link"}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-sans text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
            <ExternalIcon /> Open
          </button>
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-yellow text-[#111] text-xs font-sans font-semibold hover:opacity-90 transition-opacity">
            Save changes
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Left panel */}
        <div className="w-80 shrink-0 flex flex-col border-r border-[var(--border)] bg-[var(--bg-card)]">
          {/* Tab bar */}
          <div className="flex border-b border-[var(--border)] shrink-0">
            {(["links", "appearance"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 font-sans text-sm capitalize transition-all border-b-2 ${
                  activeTab === tab
                    ? "border-yellow text-[var(--fg)] font-semibold"
                    : "border-transparent text-[var(--fg-muted)] hover:text-[var(--fg)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "links" ? (
              <LinksTab links={links} setLinks={setLinks} />
            ) : (
              <AppearanceTab config={config} setConfig={setConfig} />
            )}
          </div>
        </div>

        {/* Preview pane */}
        <div className="flex-1 flex items-center justify-center overflow-auto bg-[var(--bg)] relative">
          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10 py-12">
            <PhoneShell links={links} config={config} />
            {/* URL label below phone */}
            <p className="text-center font-mono text-[11px] text-[var(--fg-muted)] mt-5">{publicUrl}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
