"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/* ── Types ── */
type Category = "All" | "Minimal" | "Editorial" | "Magazine" | "Story" | "Grid";

type Template = {
  id: string;
  name: string;
  description: string;
  category: Category;
  tags: string[];
  href: string | null;
  editorHref?: string;
  seed: number;
  new?: boolean;
  featured?: boolean;
  fonts: { serif: string; sans: string; mono: string };
};

const TEMPLATES: Template[] = [
  {
    id: "minimal-bw",
    name: "Minimal BW",
    description: "A refined, black-and-white portfolio focused on editorial photography. Clean typography and generous whitespace.",
    category: "Minimal",
    tags: ["Black & White", "Portrait", "Documentary"],
    href: "/templates/minimal-bw",
    editorHref: "/editor/minimal-bw",
    seed: 201,
    new: true,
    featured: true,
    fonts: { serif: "Cormorant Garamond", sans: "DM Sans", mono: "Space Mono" },
  },
  {
    id: "editorial-dark",
    name: "Editorial Dark",
    description: "High-contrast dark theme with bold serif headings. Ideal for fashion and commercial photographers.",
    category: "Editorial",
    tags: ["Dark", "Fashion", "Commercial"],
    href: null,
    seed: 37,
    fonts: { serif: "Freight Display", sans: "Neue Haas Grotesk", mono: "Input Mono" },
  },
  {
    id: "magazine",
    name: "Magazine",
    description: "A multi-column, editorial magazine layout. Dense and expressive, perfect for storytellers.",
    category: "Magazine",
    tags: ["Editorial", "Multi-column", "Story"],
    href: null,
    seed: 63,
    fonts: { serif: "Canela", sans: "Söhne", mono: "Pitch" },
  },
  {
    id: "grid-pure",
    name: "Grid Pure",
    description: "A full-bleed masonry grid with a single fixed navigation. Lets the work speak for itself.",
    category: "Grid",
    tags: ["Minimal", "Grid", "Full-bleed"],
    href: null,
    seed: 88,
    fonts: { serif: "Domaine", sans: "Inter", mono: "Berkeley Mono" },
  },
  {
    id: "story",
    name: "Story",
    description: "Vertical scroll narrative with immersive full-screen images and a flowing text column.",
    category: "Story",
    tags: ["Narrative", "Documentary", "Long-form"],
    href: null,
    seed: 110,
    fonts: { serif: "Tiempos", sans: "Aktiv Grotesk", mono: "Fira Code" },
  },
  {
    id: "editorial-sand",
    name: "Editorial Sand",
    description: "Warm neutral tones with a classic editorial grid. Great for fine-art and portrait work.",
    category: "Editorial",
    tags: ["Warm tones", "Fine Art", "Portrait"],
    href: null,
    seed: 154,
    fonts: { serif: "EB Garamond", sans: "GT Walsheim", mono: "Inconsolata" },
  },
];

const CATEGORIES: Category[] = ["All", "Minimal", "Editorial", "Magazine", "Story", "Grid"];

/* ── Icons ── */
function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

/* ── Featured card ── */
function FeaturedCard({ t }: { t: Template }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden grid grid-cols-[5fr_3fr]"
    >
      {/* Preview */}
      <div className="relative overflow-hidden group" style={{ minHeight: "340px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/${t.seed}/1200/800?grayscale`}
          alt={t.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ filter: "brightness(0.85)" }}
        />
        {/* Overlay with preview button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
          {t.href && (
            <Link
              href={t.href}
              target="_blank"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#111] font-sans text-xs font-semibold hover:bg-yellow transition-colors"
            >
              <ArrowIcon /> Live preview
            </Link>
          )}
        </div>
        {/* "New" ribbon */}
        {t.new && (
          <div className="absolute top-4 left-4 bg-yellow text-[#111] font-mono text-[9px] font-bold px-2 py-1 tracking-widest uppercase">
            New
          </div>
        )}
        {/* Simulated browser chrome */}
        <div className="absolute top-0 left-0 right-0 flex items-center gap-1.5 px-3 py-2 bg-black/50 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="w-2 h-2 rounded-full bg-white/20" />
          <div className="flex-1 mx-3 h-4 bg-white/10 rounded-sm flex items-center px-2">
            <span className="font-mono text-[8px] text-white/40">jameshollis.frame.co</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-7 flex flex-col justify-between border-l border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-widest">{t.category}</span>
          </div>

          <h2 className="font-sans font-black text-[var(--fg)] text-xl mb-2">{t.name}</h2>
          <p className="font-sans text-xs font-light text-[var(--fg-muted)] leading-relaxed mb-5">{t.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {t.tags.map((tag) => (
              <span key={tag} className="font-mono text-[9px] text-[var(--fg-muted)] bg-[var(--bg-subtle)] px-2 py-1">
                {tag}
              </span>
            ))}
          </div>

          {/* Typography */}
          <div className="border-t border-[var(--border)] pt-4 space-y-2">
            <p className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-wider mb-2.5">Typography</p>
            {[
              { role: "Serif",  name: t.fonts.serif },
              { role: "Sans",   name: t.fonts.sans },
              { role: "Mono",   name: t.fonts.mono },
            ].map((f) => (
              <div key={f.role} className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[9px] text-[var(--fg-muted)] w-8">{f.role}</span>
                <span className="font-sans text-[11px] text-[var(--fg)] flex-1">{f.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 mt-6">
          {t.href ? (
            <>
              <Link
                href={t.href}
                target="_blank"
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--fg)] font-sans text-xs font-medium hover:border-[var(--fg-muted)] transition-colors"
              >
                <ArrowIcon /> Preview
              </Link>
              {t.editorHref ? (
                <Link
                  href={t.editorHref}
                  className="btn-primary w-full py-2.5 font-sans text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <CheckIcon /> Edit this template
                </Link>
              ) : (
                <button className="btn-primary w-full py-2.5 font-sans text-xs font-semibold flex items-center justify-center gap-2">
                  <CheckIcon /> Use this template
                </button>
              )}
            </>
          ) : (
            <button disabled className="w-full py-2.5 border border-[var(--border)] text-[var(--fg-muted)] font-sans text-xs font-medium flex items-center justify-center gap-2 cursor-not-allowed opacity-50">
              <LockIcon /> Coming soon
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Regular template card ── */
function TemplateCard({ t, index }: { t: Template; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden flex flex-col"
    >
      {/* Preview image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://picsum.photos/seed/${t.seed}/800/500?grayscale`}
          alt={t.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ filter: "brightness(0.88)" }}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-250 bg-black/40">
          {t.href ? (
            <Link
              href={t.href}
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-[#111] font-sans text-[11px] font-semibold hover:bg-yellow transition-colors"
            >
              <ArrowIcon /> Preview
            </Link>
          ) : (
            <span className="flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-sm text-white font-mono text-[10px]">
              <LockIcon /> Soon
            </span>
          )}
        </div>
        {/* Browser chrome hint */}
        <div className="absolute top-0 left-0 right-0 h-5 bg-black/40 backdrop-blur-sm flex items-center px-2 gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>
        {t.new && (
          <div className="absolute top-5 left-2 bg-yellow text-[#111] font-mono text-[8px] font-bold px-1.5 py-0.5 tracking-widest uppercase">
            New
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-sans font-bold text-[var(--fg)] text-sm">{t.name}</h3>
            <span className="font-mono text-[9px] text-[var(--fg-muted)] uppercase tracking-wider">{t.category}</span>
          </div>
          {!t.href && (
            <span className="flex items-center gap-1 font-mono text-[9px] text-[var(--fg-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.5 shrink-0">
              <LockIcon /> Soon
            </span>
          )}
        </div>

        <p className="font-sans text-[11px] font-light text-[var(--fg-muted)] leading-relaxed flex-1">{t.description}</p>

        <div className="flex flex-wrap gap-1 pt-1">
          {t.tags.map((tag) => (
            <span key={tag} className="font-mono text-[8px] text-[var(--fg-muted)] bg-[var(--bg-subtle)] px-1.5 py-0.5">
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
          <div className="flex gap-2">
            <span className="font-sans text-[10px] text-[var(--fg-muted)]">{t.fonts.serif}</span>
            <span className="text-[var(--border)]">·</span>
            <span className="font-sans text-[10px] text-[var(--fg-muted)]">{t.fonts.sans}</span>
          </div>
          {t.href ? (
            <button className="font-mono text-[9px] text-yellow hover:text-[var(--fg)] transition-colors uppercase tracking-wider">
              Use →
            </button>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main page ── */
export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered = activeCategory === "All"
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeCategory);

  const featured = filtered.find((t) => t.featured);
  const rest     = filtered.filter((t) => !t.featured);

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--bg)] border-b border-[var(--border)] px-5 py-3">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-sans font-black text-[var(--fg)] text-lg leading-none">Templates</h1>
            <p className="font-mono text-[10px] text-[var(--fg-muted)] mt-0.5">
              {TEMPLATES.length} templates · {TEMPLATES.filter((t) => t.href).length} available
            </p>
          </div>
          <p className="font-sans text-xs text-[var(--fg-muted)] hidden sm:block">
            Choose a starting point for your portfolio site.
          </p>
        </div>

        {/* Category filter */}
        <div className="mt-3 flex gap-1 flex-wrap">
          {CATEGORIES.map((cat) => {
            const count = cat === "All" ? TEMPLATES.length : TEMPLATES.filter((t) => t.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium transition-colors rounded-lg ${
                  activeCategory === cat
                    ? "bg-[var(--fg)] text-[var(--bg)]"
                    : "text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-subtle)]"
                }`}
              >
                {cat}
                <span className={`font-mono text-[9px] ${activeCategory === cat ? "opacity-60" : "opacity-40"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-6">
        {/* Featured */}
        {featured && <FeaturedCard t={featured} />}

        {/* Grid */}
        {rest.length > 0 && (
          <div>
            {featured && (
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[10px] text-[var(--fg-muted)] uppercase tracking-wider">More templates</span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {rest.map((t, i) => (
                <TemplateCard key={t.id} t={t} index={i} />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <span className="font-sans text-sm text-[var(--fg-muted)]">No templates in this category yet.</span>
            <button
              onClick={() => setActiveCategory("All")}
              className="font-mono text-[10px] text-yellow hover:text-[var(--fg)] transition-colors uppercase tracking-wider"
            >
              See all →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
