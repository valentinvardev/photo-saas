"use client";

import { motion } from "framer-motion";

const items = [
  { label: "Portfolio Builder" },
  { label: "Photo Sales" },
  { label: "Cloud Storage" },
  { label: "Client Delivery" },
  { label: "RAW Support" },
  { label: "Custom Domains" },
  { label: "Analytics" },
  { label: "Print Fulfillment" },
  { label: "Watermarking" },
  { label: "Team Access" },
];

const doubled = [...items, ...items];

export function Marquee() {
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
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
