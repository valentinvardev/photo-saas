"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { api, type RouterOutputs } from "~/trpc/react";
import { PhotoPickerModal } from "~/components/portfolio/PhotoPickerModal";
import { useT } from "~/components/providers/LangProvider";

type Me = RouterOutputs["user"]["me"];

/* The editable subset of the profile, as controlled form state. */
type Form = {
  name: string; bio: string; location: string; specialty: string;
  avatarUrl: string; coverUrl: string;
  instagram: string; twitter: string; website: string; behance: string;
};

function toForm(me: Me): Form {
  return {
    name:      me.name      ?? "",
    bio:       me.bio       ?? "",
    location:  me.location  ?? "",
    specialty: me.specialty ?? "",
    avatarUrl: me.avatarUrl ?? "",
    coverUrl:  me.coverUrl  ?? "",
    instagram: me.instagram ?? "",
    twitter:   me.twitter   ?? "",
    website:   me.website   ?? "",
    behance:   me.behance   ?? "",
  };
}

/* Send empty strings as null so cleared fields are actually cleared in the DB. */
function toPatch(f: Form) {
  const n = (v: string) => (v.trim() === "" ? null : v.trim());
  return {
    name: n(f.name), bio: n(f.bio), location: n(f.location), specialty: n(f.specialty),
    avatarUrl: n(f.avatarUrl), coverUrl: n(f.coverUrl),
    instagram: n(f.instagram), twitter: n(f.twitter), website: n(f.website), behance: n(f.behance),
  };
}

/* ── Section wrapper ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--border)]">
        <h2 className="font-sans text-sm font-semibold text-[var(--fg)]">{title}</h2>
      </div>
      <div className="px-6 py-5 flex flex-col gap-5">{children}</div>
    </div>
  );
}

/* ── Field ── */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-sans text-xs font-semibold text-[var(--fg-muted)] mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1.5 font-sans text-[11px] text-[var(--fg-muted)]">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full font-sans text-sm text-[var(--fg)] bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-yellow/60 focus:ring-1 focus:ring-yellow/20 transition placeholder:text-[var(--fg-muted)]";

const SOCIALS = [
  { key: "instagram", label: "Instagram", placeholder: "@username" },
  { key: "twitter",   label: "X / Twitter", placeholder: "@username" },
  { key: "website",   label: "Website", placeholder: "https://yoursite.com" },
  { key: "behance",   label: "Behance", placeholder: "behance.net/username" },
] as const;

export default function ProfilePage() {
  const { t } = useT();
  const utils = api.useUtils();
  const { data: me, isLoading } = api.user.me.useQuery();
  const { data: portfolios }    = api.portfolio.list.useQuery();
  const updateMut = api.user.updateProfile.useMutation({
    onSuccess: () => { void utils.user.me.invalidate(); },
  });

  const [form, setForm]   = useState<Form | null>(null);
  const [saved, setSaved] = useState(false);
  const [picking, setPicking] = useState<"avatar" | "cover" | null>(null);

  /* Seed the form once the user loads (and after a successful save refetch). */
  useEffect(() => { if (me) setForm(toForm(me)); }, [me]);

  const published = portfolios?.find((p) => p.status === "published");
  const dirty = !!me && !!form && JSON.stringify(toForm(me)) !== JSON.stringify(form);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  async function handleSave() {
    if (!form || !dirty) return;
    await updateMut.mutateAsync(toPatch(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (isLoading || !form || !me) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        <div className="h-8 w-40 rounded bg-[var(--bg-subtle)] animate-pulse" />
        <div className="h-44 rounded-xl bg-[var(--bg-subtle)] animate-pulse" />
        <div className="h-64 rounded-xl bg-[var(--bg-subtle)] animate-pulse" />
        <div className="h-40 rounded-xl bg-[var(--bg-subtle)] animate-pulse" />
      </div>
    );
  }

  const initial = (form.name.trim()[0] ?? me.email[0] ?? "?").toUpperCase();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-sans font-black text-[var(--fg)] text-xl">{t("profilePage.title")}</h1>
          <p className="font-mono text-xs text-[var(--fg-muted)] mt-0.5">{t("profilePage.subtitle")}</p>
        </div>
        {published && (
          <Link
            href={`/p/${published.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 font-sans text-xs font-medium text-[var(--fg-muted)] border border-[var(--border)] px-3 py-2 rounded-lg hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors shrink-0"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            {t("profilePage.viewLive")}
          </Link>
        )}
      </div>

      {/* ── Cover + avatar ── */}
      <div className="relative pb-8">
        <button
          onClick={() => setPicking("cover")}
          className="relative group block w-full h-36 sm:h-44 overflow-hidden bg-[var(--bg-subtle)] rounded-xl border border-[var(--border)] cursor-pointer"
        >
          {form.coverUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={form.coverUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">{t("profilePage.noCover")}</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="flex items-center gap-2 font-sans text-xs font-semibold text-white bg-black/50 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
              {form.coverUrl ? t("profilePage.changeCover") : t("profilePage.addCover")}
            </span>
          </span>
        </button>

        {/* Avatar */}
        <div className="absolute bottom-0 left-6">
          <button
            onClick={() => setPicking("avatar")}
            className="relative group/avatar w-16 h-16 rounded-full bg-yellow ring-4 ring-[var(--bg-card)] flex items-center justify-center shadow-lg cursor-pointer overflow-hidden"
          >
            {form.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={form.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="font-sans font-black text-[#111] text-2xl">{initial}</span>
            )}
            <span className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </span>
          </button>
        </div>
      </div>

      {/* ── Identity ── */}
      <Section title={t("profilePage.publicProfile")}>
        <Field label={t("profilePage.displayName")} hint={t("profilePage.displayNameHint")}>
          <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder={t("profilePage.namePlaceholder")} />
        </Field>

        <Field label={t("profilePage.bio")} hint={t("profilePage.bioHint")}>
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            maxLength={300}
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
            placeholder={t("profilePage.bioPlaceholder")}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label={t("profilePage.location")}>
            <input className={inputCls} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder={t("profilePage.locationPlaceholder")} />
          </Field>
          <Field label={t("profilePage.specialty")}>
            <input className={inputCls} value={form.specialty} onChange={(e) => set("specialty", e.target.value)} placeholder={t("profilePage.specialtyPlaceholder")} />
          </Field>
        </div>
      </Section>

      {/* ── Social links ── */}
      <Section title={t("profilePage.socialLinks")}>
        {SOCIALS.map((s) => (
          <Field key={s.key} label={s.key === "website" ? t("profilePage.website") : s.label}>
            <input
              className={inputCls}
              value={form[s.key]}
              onChange={(e) => set(s.key, e.target.value)}
              placeholder={s.placeholder}
            />
          </Field>
        ))}
      </Section>

      {/* ── Account ── */}
      <Section title={t("profilePage.account")}>
        <Field label={t("profilePage.email")} hint={t("profilePage.emailHint")}>
          <input className={`${inputCls} opacity-60 cursor-not-allowed`} value={me.email} disabled />
        </Field>
        <div className="font-sans text-xs text-[var(--fg-muted)]">
          {t("profilePage.memberSince", { date: new Date(me.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long" }) })}
        </div>
      </Section>

      {/* ── Save ── */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => me && setForm(toForm(me))}
          disabled={!dirty || updateMut.isPending}
          className="font-sans text-sm text-[var(--fg-muted)] border border-[var(--border)] px-4 py-2 rounded-lg hover:text-[var(--fg)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {t("profilePage.discard")}
        </button>
        <AnimatePresence mode="wait">
          <motion.button
            key={saved ? "saved" : "idle"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={handleSave}
            disabled={(!dirty && !saved) || updateMut.isPending}
            className={`font-sans text-sm font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
              saved ? "bg-green-500 text-white" : "bg-yellow text-[#111] hover:bg-yellow/90"
            }`}
          >
            {saved ? t("profilePage.saved") : updateMut.isPending ? t("profilePage.saving") : t("profilePage.saveChanges")}
          </motion.button>
        </AnimatePresence>
      </div>

      {/* ── Avatar / cover picker ── */}
      <AnimatePresence>
        {picking && (
          <PhotoPickerModal
            multi={false}
            onPick={(urls) => { if (urls[0]) set(picking === "avatar" ? "avatarUrl" : "coverUrl", urls[0]); }}
            onClose={() => setPicking(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
