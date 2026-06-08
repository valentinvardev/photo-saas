"use client";

import { motion } from "framer-motion";
import { useT } from "~/components/providers/LangProvider";

export function CtaBanner() {
  const { t } = useT();
  return (
    <section className="py-8 bg-[var(--bg)]">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden grain bg-[var(--bg-section)]"
        >
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-yellow/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-yellow/5 rounded-full blur-[60px]" />

          {/* Content */}
          <div className="relative z-10 py-24 px-8 text-center">
            {/* Tag */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-yellow animate-pulse" />
              <span className="font-mono text-[11px] text-[var(--fg-muted)] tracking-wider uppercase">
                {t("landing.ctaBanner.tag")}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-sans font-black text-[var(--fg)] leading-tight mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              {t("landing.ctaBanner.title1")}
              <br />
              <span className="title-yellow font-serif">{t("landing.ctaBanner.title2")}</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="font-serif text-[var(--fg-secondary)] text-xl max-w-lg mx-auto mb-12 leading-relaxed"
            >
              {t("landing.ctaBanner.subtext")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="#pricing"
                className="btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-4 font-sans font-bold text-base"
              >
                {t("landing.ctaBanner.primary")}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-8 py-4 font-sans font-medium text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors duration-200 text-base"
              >
                {t("landing.ctaBanner.secondary")}
              </a>
            </motion.div>

            {/* Social proof row */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-8"
            >
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="font-sans font-black text-[var(--fg)] text-xl">
                    {t(`landing.ctaBanner.stats.${i}.value`)}
                  </div>
                  <div className="font-mono text-[10px] text-[var(--fg-muted)] tracking-wide mt-0.5">
                    {t(`landing.ctaBanner.stats.${i}.label`)}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
