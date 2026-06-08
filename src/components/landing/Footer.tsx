"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "~/components/ui/Logo";
import { useT } from "~/components/providers/LangProvider";

/* item counts per footer group (titles + items come from translations) */
const FOOTER_GROUPS = [6, 4, 3, 4];

export function Footer() {
  const { t } = useT();
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-6 gap-12"
        >
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <Logo />
            </div>
            <p className="font-serif text-sm text-[var(--fg-muted)] leading-relaxed mb-6 max-w-xs">
              {t("landing.footer.tagline")}
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { label: "Twitter", path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                { label: "Instagram", path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 2h11A4.5 4.5 0 0122 6.5v11a4.5 4.5 0 01-4.5 4.5h-11A4.5 4.5 0 012 17.5v-11A4.5 4.5 0 016.5 2z" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {FOOTER_GROUPS.map((count, gi) => (
            <div key={gi} className="col-span-1">
              <div className="font-mono text-xs text-[var(--fg-muted)] tracking-[0.15em] uppercase mb-4">
                {t(`landing.footer.groups.${gi}.title`)}
              </div>
              <ul className="space-y-2.5">
                {Array.from({ length: count }).map((_, j) => (
                  <li key={j}>
                    <Link
                      href="#"
                      className="font-sans text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-150"
                    >
                      {t(`landing.footer.groups.${gi}.items.${j}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[11px] text-[var(--fg-muted)] tracking-wide">
            © {new Date().getFullYear()} Portapic. {t("landing.footer.rights")}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-[11px] text-[var(--fg-muted)]">
              {t("landing.footer.operational")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
