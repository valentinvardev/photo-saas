"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { LINKS_TEMPLATES } from "~/lib/links/data";

/* ── Types ───────────────────────────────────────────────────── */
type LinkType = "website" | "instagram" | "whatsapp" | "email";

interface WizardLink {
  id: string;
  type: LinkType;
  label: string;
  value: string;
}

/* ── Step config ─────────────────────────────────────────────── */
const STEPS = ["Profile", "Links", "Template", "Done"] as const;
type Step = (typeof STEPS)[number];
const STEP_IDX: Record<Step, number> = { Profile: 0, Links: 1, Template: 2, Done: 3 };

/* ── Avatar colors ───────────────────────────────────────────── */
const AVATAR_COLORS = [
  { bg: "#fad502", text: "#111" },
  { bg: "#E8382C", text: "#fff" },
  { bg: "#C2410C", text: "#fff" },
  { bg: "#2235FF", text: "#fff" },
  { bg: "#A8462E", text: "#fff" },
  { bg: "#0ea5e9", text: "#fff" },
  { bg: "#8b5cf6", text: "#fff" },
  { bg: "#10b981", text: "#fff" },
];

const inputCls =
  "font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2.5 outline-none focus:border-yellow/60 focus:ring-1 focus:ring-yellow/20 transition placeholder:text-[var(--fg-muted)] w-full";

/* ── Link type icons + labels ────────────────────────────────── */
const LINK_TYPES: { type: LinkType; label: string; placeholder: string; icon: React.ReactNode }[] = [
  {
    type: "website",
    label: "Website",
    placeholder: "https://yoursite.com",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
  },
  {
    type: "instagram",
    label: "Instagram",
    placeholder: "@yourusername",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    type: "whatsapp",
    label: "WhatsApp",
    placeholder: "+54 9 11 1234 5678",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
      </svg>
    ),
  },
  {
    type: "email",
    label: "Email",
    placeholder: "you@example.com",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
      </svg>
    ),
  },
];

function uid() { return Math.random().toString(36).slice(2, 8); }

/* ── Phone mockup preview ────────────────────────────────────── */
function PhoneMockup({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-56 h-[460px] rounded-[2.5rem] border-[6px] border-[var(--fg)]/20 bg-[#0D0D0D] shadow-2xl overflow-hidden flex flex-col">
      {/* notch */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-5 rounded-full bg-[var(--fg)]/10 z-10" />
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

/* ── Template card ───────────────────────────────────────────── */
const TEMPLATE_PREVIEW_URLS: Partial<Record<string, string>> = {
  brooklyn: "/template/brooklyn/links",
  halcyon:  "/template/halcyon/links",
};

const TEMPLATE_BG: Record<string, string> = {
  brooklyn: "#0D0D0D",
  halcyon:  "#0E0D0B",
};

/* ── Main component ──────────────────────────────────────────── */
export default function LinksWizardPage() {
  const router = useRouter();
  const [step, setStep]           = useState<Step>("Profile");
  const [direction, setDirection] = useState(1);

  // Profile
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio]                 = useState("");
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]!);
  const [customInitial, setCustomInitial] = useState("");

  // Links
  const [links, setLinks] = useState<WizardLink[]>([
    { id: uid(), type: "website", label: "Website", value: "" },
  ]);

  // Template
  const [templateId, setTemplateId] = useState("brooklyn");

  const initial   = (customInitial || displayName.trim().charAt(0) || "?").toUpperCase();
  const stepIndex = STEP_IDX[step];

  function go(next: Step) {
    setDirection(STEP_IDX[next] > stepIndex ? 1 : -1);
    setStep(next);
  }

  function addLink() {
    if (links.length >= 5) return;
    setLinks((prev) => [...prev, { id: uid(), type: "website", label: "Website", value: "" }]);
  }

  function removeLink(id: string) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }

  function updateLink(id: string, patch: Partial<WizardLink>) {
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, ...patch } : l));
  }

  /* ── Right panel content per step ─────────────────────────── */
  function rightPanel() {
    if (step === "Profile") {
      return (
        <PhoneMockup>
          <div className="h-full flex flex-col items-center justify-center gap-4 px-6 bg-[#0D0D0D]">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black shrink-0"
              style={{ background: avatarColor.bg, color: avatarColor.text }}>
              {initial}
            </div>
            <div className="text-center">
              <p className="font-sans font-bold text-white text-base leading-tight">
                {displayName.trim() || "Your Name"}
              </p>
              <p className="font-sans text-white/50 text-xs mt-1 leading-snug">
                {bio.trim() || "Your bio will appear here"}
              </p>
            </div>
            <div className="w-full flex flex-col gap-2 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 rounded-lg bg-white/10 w-full" />
              ))}
            </div>
          </div>
        </PhoneMockup>
      );
    }

    if (step === "Links") {
      return (
        <PhoneMockup>
          <div className="h-full flex flex-col items-center gap-4 px-5 pt-14 bg-[#0D0D0D]">
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-lg shrink-0"
              style={{ background: avatarColor.bg, color: avatarColor.text }}>
              {initial}
            </div>
            <p className="font-sans font-bold text-white text-sm">{displayName.trim() || "Your Name"}</p>
            <div className="w-full flex flex-col gap-2 mt-1">
              {links.filter((l) => l.value.trim()).length > 0
                ? links.filter((l) => l.value.trim()).map((l) => (
                    <div key={l.id} className="h-11 rounded-lg bg-white/10 flex items-center px-3 gap-2">
                      <span className="text-white/60">{LINK_TYPES.find((t) => t.type === l.type)?.icon}</span>
                      <span className="font-sans text-white/70 text-xs truncate">{l.label}</span>
                    </div>
                  ))
                : [1, 2].map((i) => <div key={i} className="h-11 rounded-lg bg-white/10 w-full" />)
              }
            </div>
          </div>
        </PhoneMockup>
      );
    }

    if (step === "Template") {
      const url = TEMPLATE_PREVIEW_URLS[templateId] ?? "/template/brooklyn/links";
      return (
        <div className="flex flex-col gap-3 w-full items-center">
          <PhoneMockup>
            <iframe src={url} className="w-full h-full border-0 pointer-events-none"
              style={{ background: TEMPLATE_BG[templateId] ?? "#0D0D0D" }} />
          </PhoneMockup>
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">Live preview</p>
        </div>
      );
    }

    // Done
    return null;
  }

  /* ── Step content ──────────────────────────────────────────── */
  function stepContent() {
    if (step === "Profile") return (
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="font-sans font-black text-[var(--fg)] text-xl">Set up your profile</h2>
          <p className="font-sans text-sm text-[var(--fg-muted)] mt-1">This is how you appear on your links page.</p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] mb-1.5">Display name</label>
            <input className={inputCls} placeholder="Sofia Chen" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] mb-1.5">Bio <span className="normal-case">— optional</span></label>
            <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Documentary photographer based in Lisbon."
              value={bio} onChange={(e) => setBio(e.target.value.slice(0, 120))} />
            <p className="font-mono text-[9px] text-[var(--fg-muted)] mt-1 text-right">{bio.length}/120</p>
          </div>
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] mb-2">Avatar color</label>
            <div className="flex gap-2 flex-wrap">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c.bg}
                  onClick={() => setAvatarColor(c)}
                  className="w-8 h-8 rounded-full transition-transform hover:scale-110"
                  style={{ background: c.bg, outline: avatarColor.bg === c.bg ? `2px solid var(--fg)` : "none", outlineOffset: 2 }}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] mb-1.5">Avatar initial <span className="normal-case">— optional</span></label>
            <input className={`${inputCls}`} style={{ maxWidth: 80 }} maxLength={1}
              placeholder={displayName.charAt(0).toUpperCase() || "S"}
              value={customInitial} onChange={(e) => setCustomInitial(e.target.value.toUpperCase())} />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => go("Links")}
            disabled={!displayName.trim()}
            className="font-sans text-sm font-semibold px-6 py-2.5 rounded-lg bg-yellow text-[#111] hover:bg-yellow/90 disabled:opacity-40 transition-colors"
          >
            Continue →
          </button>
        </div>
      </div>
    );

    if (step === "Links") return (
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="font-sans font-black text-[var(--fg)] text-xl">Add your links</h2>
          <p className="font-sans text-sm text-[var(--fg-muted)] mt-1">Start with a few — you can add more later in the editor.</p>
        </div>

        <div className="flex flex-col gap-3">
          {links.map((link) => {
            const typeInfo = LINK_TYPES.find((t) => t.type === link.type)!;
            return (
              <div key={link.id} className="flex flex-col gap-2 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
                {/* Type selector */}
                <div className="flex gap-1.5 flex-wrap">
                  {LINK_TYPES.map((t) => (
                    <button
                      key={t.type}
                      onClick={() => updateLink(link.id, { type: t.type, label: t.label, value: "" })}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[9px] uppercase tracking-widest border transition-colors ${
                        link.type === t.type
                          ? "bg-yellow/10 border-yellow/30 text-yellow"
                          : "border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)]"
                      }`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
                {/* Label + value */}
                <div className="flex gap-2">
                  <input
                    className={`${inputCls} w-28 shrink-0`}
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => updateLink(link.id, { label: e.target.value })}
                  />
                  <input
                    className={inputCls}
                    placeholder={typeInfo.placeholder}
                    value={link.value}
                    onChange={(e) => updateLink(link.id, { value: e.target.value })}
                  />
                  <button onClick={() => removeLink(link.id)} className="shrink-0 text-[var(--fg-muted)] hover:text-red-400 transition-colors p-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
            );
          })}

          {links.length < 5 && (
            <button onClick={addLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors font-sans text-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add another link
            </button>
          )}
        </div>

        <div className="flex justify-between pt-2">
          <button onClick={() => go("Profile")} className="font-sans text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
            ← Back
          </button>
          <button onClick={() => go("Template")}
            className="font-sans text-sm font-semibold px-6 py-2.5 rounded-lg bg-yellow text-[#111] hover:bg-yellow/90 transition-colors">
            Continue →
          </button>
        </div>
      </div>
    );

    if (step === "Template") return (
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="font-sans font-black text-[var(--fg)] text-xl">Pick a template</h2>
          <p className="font-sans text-sm text-[var(--fg-muted)] mt-1">Choose a style for your links page.</p>
        </div>

        <div className="flex flex-col gap-3">
          {LINKS_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setTemplateId(tpl.id)}
              className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                templateId === tpl.id
                  ? "border-yellow bg-yellow/5"
                  : "border-[var(--border)] hover:border-[var(--fg-muted)]"
              }`}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: tpl.accent + "22", border: `1.5px solid ${tpl.accent}40` }}>
                <span className="font-sans font-black text-lg" style={{ color: tpl.accent }}>
                  {tpl.label.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-semibold text-[var(--fg)]">{tpl.label}</p>
                <p className="font-sans text-xs text-[var(--fg-muted)] mt-0.5 truncate">{tpl.desc}</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 shrink-0 transition-colors ${
                templateId === tpl.id ? "border-yellow bg-yellow" : "border-[var(--border)]"
              }`} />
            </button>
          ))}
        </div>

        <div className="flex justify-between pt-2">
          <button onClick={() => go("Links")} className="font-sans text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
            ← Back
          </button>
          <button onClick={() => go("Done")}
            className="font-sans text-sm font-semibold px-6 py-2.5 rounded-lg bg-yellow text-[#111] hover:bg-yellow/90 transition-colors">
            Create page →
          </button>
        </div>
      </div>
    );

    // Done
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-8 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
          className="relative w-20 h-20"
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: "2px solid #fad502" }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0] }}
            transition={{ delay: 0.35, duration: 0.9, ease: "easeOut" }}
          />
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: avatarColor.bg }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <motion.path d="M20 6L9 17l-5-5" stroke={avatarColor.text}
                strokeWidth="2.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.45, ease: "easeOut" }}
              />
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.35 }}
        >
          <h2 className="font-sans font-black text-[var(--fg)] text-2xl">Your page is ready!</h2>
          <p className="font-sans text-sm text-[var(--fg-muted)] mt-2">
            <span className="font-semibold text-[var(--fg)]">{displayName || "Your links page"}</span> is set up with the{" "}
            <span className="font-semibold text-[var(--fg)]">{LINKS_TEMPLATES.find((t) => t.id === templateId)?.label}</span> template.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-xs"
        >
          <Link
            href="/dashboard/links"
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-sans text-sm font-bold bg-yellow text-[#111] hover:bg-yellow/90 transition-colors"
          >
            Open editor →
          </Link>
          <Link
            href="/dashboard/links"
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-sans text-sm font-medium border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
          >
            Go to links
          </Link>
        </motion.div>
      </div>
    );
  }

  /* ── Layout ────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      {/* Top bar */}
      <div className="h-14 border-b border-[var(--border)] bg-[var(--bg-card)] flex items-center px-4 gap-3 shrink-0">
        <Link href="/dashboard/links" className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors p-1.5 rounded-lg hover:bg-[var(--bg-subtle)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </Link>
        <span className="font-sans text-sm font-semibold text-[var(--fg)]">Create links page</span>

        {/* Step pills */}
        <div className="hidden sm:flex items-center gap-1.5 ml-auto">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              {i > 0 && <div className="w-4 h-px bg-[var(--border)]" />}
              <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded ${
                s === step ? "bg-yellow/10 text-yellow" :
                STEP_IDX[s] < stepIndex ? "text-[var(--fg-muted)]" : "text-[var(--border)]"
              }`}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 lg:gap-12 items-start">

          {/* Left — form */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -24 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {stepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right — contextual preview */}
          {step !== "Done" && (
            <div className="hidden lg:flex flex-col items-center justify-start pt-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="w-full flex flex-col items-center"
                >
                  {rightPanel()}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
