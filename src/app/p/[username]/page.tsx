"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "~/components/ui/Logo";

/* ── Mock data ───────────────────────────────────────────────── */
const USER = {
  name:      "Sofia Chen",
  handle:    "sofiachenphoto",
  specialty: ["Portrait", "Documentary"],
  location:  "New York, NY",
  bio:       "Documentary and portrait photographer based in New York. Available for editorial and commercial work. Clients include NYT, TIME, and National Geographic.",
  coverSeed: "sofiacover",
  stats:     { portfolios: 3, photos: 284, views: 12400 },
  socials: {
    instagram: "sofiachenphoto",
    twitter:   "sofiachenphoto",
    website:   "sofiachenphoto.com",
    behance:   "sofiachenphoto",
  },
};

const WORKS = [
  { id: "1", title: "Weddings 2024",  photos: 142, seed: "wed2024",   views: 6800 },
  { id: "2", title: "Portraits",      photos:  87, seed: "portraits1", views: 3400 },
  { id: "3", title: "Landscapes",     photos:  55, seed: "lands1",     views: 2200 },
];

const ABOUT_PHOTOS = [
  "about1","about2","about3","about4","about5","about6",
  "about7","about8","about9","about10","about11","about12",
];

/* ── Social icon map ─────────────────────────────────────────── */
function IGIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/>
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L2.058 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  );
}
function BehanceIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.513-1.987-5.513-5.862C13.112 10.025 15.39 8 18.56 8c3.174 0 5.032 1.967 5.032 5.176 0 .348-.031.719-.065.934h-7.797c.123 2.241 2.148 2.499 3.003 2.499.873 0 1.731-.242 2.37-.799L23.726 17zM16.14 13h4.418c0-.965-.65-2.073-2.18-2.073C16.93 10.927 16.14 12.027 16.14 13zM5 7h6c1.658 0 3 .744 3 2.373 0 1.326-.688 2.001-1.5 2.346C13.618 12.078 14 13 14 14c0 1.656-1.342 3-3 3H5V7zm2 2v2h3.5c.5 0 .858-.437.858-1 0-.564-.358-1-.858-1H7zm0 4v2h4c.5 0 .858-.437.858-1 0-.564-.358-1-.858-1H7z"/>
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: <IGIcon />,
  twitter:   <XIcon />,
  website:   <GlobeIcon />,
  behance:   <BehanceIcon />,
};

/* ── Stat formatter ──────────────────────────────────────────── */
function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return n.toString();
}

/* ── Main page ───────────────────────────────────────────────── */
export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username: _username } = use(params);
  const [tab, setTab]     = useState<"works" | "about">("works");
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(247);

  function toggleLike() {
    setLiked((l) => !l);
    setLikes((n) => liked ? n - 1 : n + 1);
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">

      {/* ── Top bar ── */}
      <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <Link href="/dashboard">
          <Logo height={40} />
        </Link>
        <Link
          href="/dashboard"
          className="font-sans text-xs font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] border border-[var(--border)] px-3 py-1.5 rounded-lg transition-colors"
        >
          Open dashboard
        </Link>
      </div>

      {/* ── Cover ── */}
      <div className="relative pt-[52px]">
        <div className="relative h-52 sm:h-64 overflow-hidden bg-[var(--bg-subtle)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://picsum.photos/seed/${USER.coverSeed}/1400/400?grayscale`}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/10 to-transparent" />
        </div>

        {/* Avatar — overlapping cover */}
        <div className="absolute bottom-0 translate-y-1/2 left-6 sm:left-10">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-yellow ring-4 ring-[var(--bg)] flex items-center justify-center shadow-xl">
            <span className="font-sans font-black text-[#111] text-3xl sm:text-4xl">
              {USER.name[0]}
            </span>
          </div>
        </div>

        {/* Action buttons — top-right of cover area */}
        <div className="absolute bottom-0 translate-y-1/2 right-6 sm:right-10 flex items-center gap-2">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border font-sans text-xs font-semibold transition-all ${
              liked
                ? "border-red-400/50 bg-red-400/10 text-red-400"
                : "border-[var(--border)] text-[var(--fg-muted)] hover:border-red-400/40 hover:text-red-400 bg-[var(--bg)]"
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            {fmt(likes)}
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow text-[#111] font-sans text-xs font-bold hover:bg-yellow/90 transition-colors shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Message
          </button>
        </div>
      </div>

      {/* ── Profile info ── */}
      <div className="px-6 sm:px-10 mt-14">
        {/* Name + handle */}
        <div className="mb-2">
          <h1 className="font-sans font-black text-[var(--fg)] text-2xl sm:text-3xl">{USER.name}</h1>
          <p className="font-mono text-xs text-[var(--fg-muted)] mt-0.5">@{USER.handle}</p>
        </div>

        {/* Specialty tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {USER.specialty.map((s) => (
            <span key={s} className="font-mono text-[9px] uppercase tracking-widest px-2 py-1 rounded-full border border-[var(--border)] text-[var(--fg-muted)]">
              {s}
            </span>
          ))}
          <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-1 rounded-full border border-[var(--border)] text-[var(--fg-muted)] flex items-center gap-1">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {USER.location}
          </span>
        </div>

        {/* Bio */}
        <p className="font-sans text-sm text-[var(--fg-muted)] max-w-lg leading-relaxed mb-4">
          {USER.bio}
        </p>

        {/* Social icons + stats */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            {Object.entries(USER.socials).map(([k]) => (
              <button
                key={k}
                className="text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                title={k}
              >
                {SOCIAL_ICONS[k]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 font-mono text-[10px] text-[var(--fg-muted)]">
            <span><strong className="text-[var(--fg)] text-xs">{USER.stats.portfolios}</strong> portfolios</span>
            <span><strong className="text-[var(--fg)] text-xs">{USER.stats.photos}</strong> photos</span>
            <span><strong className="text-[var(--fg)] text-xs">{fmt(USER.stats.views)}</strong> views</span>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="px-6 sm:px-10 mt-5">
        <div className="flex gap-1 border-b border-[var(--border)] mb-6">
          {(["works", "about"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-2.5 font-sans text-sm font-semibold capitalize transition-colors ${
                tab === t ? "text-[var(--fg)]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              {t}
              {tab === t && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 inset-x-4 h-0.5 bg-yellow rounded-full" />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "works" ? (
            <motion.div
              key="works"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-16">
                {WORKS.map((w, i) => (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.22 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[var(--bg-subtle)] mb-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://picsum.photos/seed/${w.seed}/600/400?grayscale`}
                        alt={w.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button className="font-sans text-xs font-bold text-white bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors">
                          View portfolio
                        </button>
                      </div>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-sans font-semibold text-[var(--fg)] text-sm group-hover:text-yellow transition-colors">
                          {w.title}
                        </h3>
                        <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">
                          {w.photos} photos · {fmt(w.views)} views
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="pb-16"
            >
              <div className="max-w-2xl space-y-8">
                {/* Bio block */}
                <div>
                  <h2 className="font-sans font-bold text-[var(--fg)] text-sm mb-3 uppercase tracking-widest text-[var(--fg-muted)]">About</h2>
                  <p className="font-sans text-sm text-[var(--fg)] leading-relaxed">
                    {USER.bio}
                  </p>
                  <p className="font-sans text-sm text-[var(--fg-muted)] leading-relaxed mt-3">
                    With over 12 years of experience, Sofia has photographed weddings, corporate events, and editorial assignments across 30+ countries. Her work explores the intersection of light, emotion, and human connection.
                  </p>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Based in",    value: USER.location },
                    { label: "Specialty",   value: USER.specialty.join(", ") },
                    { label: "Experience",  value: "12+ years" },
                    { label: "Availability", value: "Open to projects" },
                  ].map((d) => (
                    <div key={d.label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-3">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] mb-1">{d.label}</p>
                      <p className="font-sans text-sm font-medium text-[var(--fg)]">{d.value}</p>
                    </div>
                  ))}
                </div>

                {/* Social links */}
                <div>
                  <h2 className="font-sans font-bold text-[var(--fg)] text-sm mb-3 uppercase tracking-widest text-[var(--fg-muted)]">Links</h2>
                  <div className="flex flex-col gap-2">
                    {Object.entries(USER.socials).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-3 py-2 border-b border-[var(--border)]">
                        <span className="text-[var(--fg-muted)] w-5 flex items-center justify-center">{SOCIAL_ICONS[k]}</span>
                        <span className="font-sans text-sm text-[var(--fg)]">{v}</span>
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--fg-muted)] ml-auto capitalize">{k}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini photo grid */}
                <div>
                  <h2 className="font-sans font-bold text-[var(--fg)] text-sm mb-3 uppercase tracking-widest text-[var(--fg-muted)]">Recent work</h2>
                  <div className="grid grid-cols-4 gap-1.5">
                    {ABOUT_PHOTOS.map((seed) => (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        key={seed}
                        src={`https://picsum.photos/seed/${seed}/200/200?grayscale`}
                        alt=""
                        className="aspect-square object-cover rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
