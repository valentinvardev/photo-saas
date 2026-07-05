"use client";

/**
 * Homepage v2 — the simplified selling landing.
 * One promise (your portfolio online today), the template wall as proof,
 * four concrete benefits, three steps, and a single paid plan in ARS.
 * Fully localized (es/en/pt) via the lp.* keys; locale auto-detects by
 * country through LangProvider + middleware geo cookie.
 * The previous full landing is archived at /home-v1.
 */

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useT } from "~/components/providers/LangProvider";
import { LOCALES, type Locale } from "~/lib/i18n";
import { TEMPLATE_CATALOG } from "~/lib/templates/catalog";
import { Logo } from "~/components/ui/Logo";

// Template display faces, so the wall renders each name in its real voice.
import "~/lib/editor/fonts";

const YELLOW = "#fad502";

/* ── tiny shared bits ─────────────────────────────────────────── */

function Wordmark({ size = 18 }: { size?: number }) {
  return (
    <span className="font-sans font-black tracking-tight" style={{ fontSize: size }}>
      <span className="text-yellow">Porta</span>
      <span className="text-[var(--fg)]">Pic</span>
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="w-2 h-2 rounded-sm bg-yellow" />
      <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">{children}</span>
    </div>
  );
}

function CheckIcon({ dim = false }: { dim?: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={dim ? "currentColor" : YELLOW} strokeWidth="2.5" strokeLinecap="round" className="shrink-0 mt-0.5">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

/* ── template wall — six author templates in their own voices ── */
function TemplateWall() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {TEMPLATE_CATALOG.map((tpl, i) => (
        <motion.div
          key={tpl.id}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: i * 0.07 }}
          className="relative overflow-hidden rounded-xl border border-[var(--border)] aspect-[4/5] flex flex-col items-center justify-center gap-2"
          style={{ background: tpl.palette.bg }}
        >
          <span style={{ fontFamily: tpl.serif, fontSize: "clamp(20px, 3.2vw, 30px)", lineHeight: 1.1, color: tpl.palette.fg, letterSpacing: "-0.01em", textAlign: "center", padding: "0 8%" }}>
            {tpl.name}
            <span style={{ color: tpl.palette.accent }}>.</span>
          </span>
          <span className="font-mono text-[12px] uppercase tracking-[0.18em]" style={{ color: tpl.palette.muted }}>
            0{i + 1}
          </span>
          <div className="absolute left-0 right-0 bottom-0 flex h-1.5">
            <div className="flex-1" style={{ background: tpl.palette.accent }} />
            <div className="flex-1" style={{ background: tpl.palette.fg }} />
            <div className="flex-1" style={{ background: tpl.palette.muted }} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── pricing ──────────────────────────────────────────────────── */
function PricingSection() {
  const { t } = useT();
  const [cycle, setCycle] = useState<"monthly" | "yearly">("yearly");
  const yearly = cycle === "yearly";

  return (
    <section id="pricing" className="max-w-5xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
      <div className="text-center">
        <div className="flex justify-center"><SectionLabel>{t("lp.pricing.label")}</SectionLabel></div>
        <h2 className="font-sans font-black text-[var(--fg)] text-3xl sm:text-4xl tracking-tight">{t("lp.pricing.title")}</h2>
        <p className="font-sans text-sm text-[var(--fg-muted)] mt-3">{t("lp.pricing.sub")}</p>

        {/* Cycle toggle */}
        <div className="inline-flex items-center gap-1 mt-8 p-1 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
          {(["monthly", "yearly"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCycle(c)}
              className={`px-4 py-2 rounded-lg font-sans text-xs font-bold transition-colors ${
                cycle === c ? "bg-yellow text-[#111]" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
              }`}
            >
              {t(`lp.pricing.${c}`)}
              {c === "yearly" && (
                <span className={`ml-2 font-mono text-[12px] px-1.5 py-0.5 rounded ${cycle === c ? "bg-[#111]/10" : "bg-yellow/15 text-yellow"}`}>
                  {t("lp.pricing.save")}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mt-10 max-w-3xl mx-auto items-stretch">
        {/* Free */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-7 flex flex-col">
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">{t("lp.pricing.freeName")}</span>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-sans font-black text-4xl text-[var(--fg)]">{t("lp.pricing.freePrice")}</span>
          </div>
          <p className="font-sans text-sm text-[var(--fg-muted)] mt-2">{t("lp.pricing.freeTag")}</p>
          <ul className="mt-6 space-y-3 flex-1">
            {(["freeB1", "freeB2", "freeB3", "freeB4"] as const).map((k) => (
              <li key={k} className="flex items-start gap-2.5 font-sans text-sm text-[var(--fg)]">
                <CheckIcon dim /> {t(`lp.pricing.${k}`)}
              </li>
            ))}
          </ul>
          <Link
            href="/register"
            className="mt-8 w-full text-center px-5 py-3 rounded-xl border border-[var(--border)] font-sans text-sm font-bold text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
          >
            {t("lp.pricing.freeCta")}
          </Link>
        </div>

        {/* Pro */}
        <div className="relative rounded-2xl border-2 border-yellow bg-[var(--bg-card)] p-7 flex flex-col shadow-[0_20px_60px_-20px_rgba(250,213,2,0.25)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-yellow">{t("lp.pricing.proName")}</span>
            {yearly && (
              <span className="font-mono text-[12px] bg-yellow text-[#111] font-bold px-2 py-0.5 rounded">{t("lp.pricing.save")}</span>
            )}
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-sans font-black text-4xl text-[var(--fg)]">{yearly ? "$150.000" : "$15.000"}</span>
            <span className="font-mono text-[12px] text-[var(--fg-muted)]">{yearly ? t("lp.pricing.perYear") : t("lp.pricing.perMonth")}</span>
          </div>
          <p className="font-sans text-sm text-[var(--fg-muted)] mt-2">{t("lp.pricing.proTag")}</p>
          <ul className="mt-6 space-y-3 flex-1">
            {(["proB1", "proB2", "proB3", "proB4", "proB5"] as const).map((k) => (
              <li key={k} className="flex items-start gap-2.5 font-sans text-sm text-[var(--fg)]">
                <CheckIcon /> {t(`lp.pricing.${k}`)}
              </li>
            ))}
            <li className={`flex items-start gap-2.5 font-sans text-sm ${yearly ? "text-[var(--fg)] font-semibold" : "text-[var(--fg-muted)]"}`}>
              {yearly ? <CheckIcon /> : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5 opacity-60"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>
              )}
              {yearly ? t("lp.pricing.proDomainYearly") : t("lp.pricing.proDomainMonthly")}
            </li>
          </ul>
          <Link
            href="/register"
            className="mt-8 w-full text-center px-5 py-3 rounded-xl bg-yellow text-[#111] font-sans text-sm font-bold hover:bg-yellow/90 transition-colors"
          >
            {t("lp.pricing.proCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── page ─────────────────────────────────────────────────────── */
export function LandingV2() {
  const { t, locale, setLocale } = useT();

  const features = [
    { t: "lp.features.f1t", b: "lp.features.f1b", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
    { t: "lp.features.f2t", b: "lp.features.f2b", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg> },
    { t: "lp.features.f3t", b: "lp.features.f3b", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
    { t: "lp.features.f4t", b: "lp.features.f4b", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-9M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg> },
  ];

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Logo height={26} darkHeight={36} priority />
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="px-3 py-2 font-sans text-sm font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">
              {t("lp.nav.login")}
            </Link>
            <Link href="/register" className="px-4 py-2 rounded-xl bg-yellow text-[#111] font-sans text-sm font-bold hover:bg-yellow/90 transition-colors">
              {t("lp.nav.start")}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(55% 45% at 50% 0%, color-mix(in srgb, #fad502 9%, transparent), transparent 75%)",
        }} />
        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 pt-20 sm:pt-28 pb-14 sm:pb-20 text-center">
          <motion.span {...fadeUp} className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.22em] text-[var(--fg-muted)] border border-[var(--border)] rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow" />
            {t("lp.hero.eyebrow")}
          </motion.span>
          <motion.h1
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.08 }}
            className="font-sans font-black text-[var(--fg)] tracking-tight leading-[1.04] mt-6"
            style={{ fontSize: "clamp(38px, 7vw, 72px)" }}
            dangerouslySetInnerHTML={{ __html: t("lp.hero.title") }}
          />
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.16 }} className="font-sans text-base sm:text-lg text-[var(--fg-muted)] leading-relaxed max-w-2xl mx-auto mt-6">
            {t("lp.hero.sub")}
          </motion.p>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.24 }} className="flex items-center justify-center gap-3 mt-9 flex-wrap">
            <Link href="/register" className="px-7 py-3.5 rounded-xl bg-yellow text-[#111] font-sans text-sm font-bold hover:bg-yellow/90 transition-colors inline-flex items-center gap-2">
              {t("lp.hero.ctaPrimary")}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href="#templates" className="px-6 py-3.5 rounded-xl border border-[var(--border)] font-sans text-sm font-medium text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors">
              {t("lp.hero.ctaSecondary")}
            </a>
          </motion.div>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.32 }} className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--fg-muted)] mt-6">
            {t("lp.hero.trust")}
          </motion.p>
        </div>
      </section>

      {/* ── Template wall ── */}
      <section id="templates" className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
          <motion.div {...fadeUp}>
            <SectionLabel>{t("lp.templates.label")}</SectionLabel>
            <h2 className="font-sans font-black text-[var(--fg)] text-3xl sm:text-4xl tracking-tight leading-tight">{t("lp.templates.title")}</h2>
            <p className="font-sans text-sm sm:text-base text-[var(--fg-muted)] leading-relaxed mt-4">{t("lp.templates.sub")}</p>
          </motion.div>
          <TemplateWall />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-card)]">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <motion.div {...fadeUp} className="max-w-2xl">
            <SectionLabel>{t("lp.features.label")}</SectionLabel>
            <h2 className="font-sans font-black text-[var(--fg)] text-3xl sm:text-4xl tracking-tight leading-tight">{t("lp.features.title")}</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-x-10 gap-y-10 mt-12">
            {features.map((f, i) => (
              <motion.div key={f.t} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }}>
                <div className="w-9 h-9 rounded-lg bg-yellow/10 border border-yellow/25 text-yellow flex items-center justify-center mb-4">{f.icon}</div>
                <h3 className="font-sans font-bold text-[var(--fg)] text-base">{t(f.t)}</h3>
                <p className="font-sans text-sm text-[var(--fg-muted)] leading-relaxed mt-2">{t(f.b)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <motion.div {...fadeUp} className="max-w-2xl">
          <SectionLabel>{t("lp.how.label")}</SectionLabel>
          <h2 className="font-sans font-black text-[var(--fg)] text-3xl sm:text-4xl tracking-tight leading-tight">{t("lp.how.title")}</h2>
        </motion.div>
        <div className="grid sm:grid-cols-3 gap-6 mt-12">
          {(["s1", "s2", "s3"] as const).map((s, i) => (
            <motion.div key={s} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
              <span className="font-mono text-[13px] font-bold text-yellow">0{i + 1}</span>
              <h3 className="font-sans font-bold text-[var(--fg)] text-base mt-3">{t(`lp.how.${s}t`)}</h3>
              <p className="font-sans text-sm text-[var(--fg-muted)] leading-relaxed mt-2">{t(`lp.how.${s}b`)}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <PricingSection />

      {/* ── Final CTA ── */}
      <section className="border-t border-[var(--border)]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 sm:py-28 text-center">
          <motion.h2 {...fadeUp} className="font-sans font-black text-[var(--fg)] text-3xl sm:text-5xl tracking-tight leading-tight">
            {t("lp.cta.title")}
          </motion.h2>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }} className="font-sans text-base text-[var(--fg-muted)] mt-4">
            {t("lp.cta.sub")}
          </motion.p>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.16 }} className="mt-9">
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-yellow text-[#111] font-sans text-sm font-bold hover:bg-yellow/90 transition-colors">
              {t("lp.cta.button")}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <Wordmark />
            <p className="font-sans text-xs text-[var(--fg-muted)] mt-1.5">{t("lp.footer.tagline")}</p>
          </div>
          <div className="flex items-center gap-5 flex-wrap">
            <Link href="/login" className="font-sans text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">{t("lp.footer.login")}</Link>
            <Link href="/register" className="font-sans text-xs text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors">{t("lp.footer.register")}</Link>
            {/* Language switcher — manual override of the geo-detected locale */}
            <div className="flex items-center gap-1 border border-[var(--border)] rounded-lg p-1">
              {LOCALES.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLocale(l.id as Locale)}
                  className={`px-2 py-1 rounded font-mono text-[12px] uppercase tracking-wider transition-colors ${
                    locale === l.id ? "bg-yellow text-[#111] font-bold" : "text-[var(--fg-muted)] hover:text-[var(--fg)]"
                  }`}
                >
                  {l.id}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-[var(--border)]">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4">
            <span className="font-mono text-[12px] text-[var(--fg-muted)]">© {new Date().getFullYear()} PortaPic — {t("lp.footer.rights")}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
