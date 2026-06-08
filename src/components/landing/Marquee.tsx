"use client";

import { motion } from "framer-motion";
import { useT } from "~/components/providers/LangProvider";

export function Marquee() {
  const { t } = useT();
  const items = Array.from({ length: 10 }, (_, i) => t(`landing.marquee.${i}`));
  const doubled = [...items, ...items];
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative py-10 overflow-hidden border-y border-[var(--border)] bg-[var(--bg-subtle)]"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-3 mx-6 shrink-0"
          >
            <span className="text-yellow text-xs font-mono">✦</span>
            <span className="font-sans font-medium text-sm text-[var(--fg-muted)] tracking-wide uppercase">
              {item}
            </span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
