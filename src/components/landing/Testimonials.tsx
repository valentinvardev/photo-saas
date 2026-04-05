"use client";

import { motion } from "framer-motion";

function QuoteIcon() {
  return (
    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" aria-hidden>
      <path
        d="M0 24V14.4C0 10.4 1.06667 7.06667 3.2 4.4C5.33333 1.6 8.26667 0 12 0V3.6C10 3.6 8.4 4.4 7.2 6C6 7.46667 5.4 9.33333 5.4 11.6H10.8V24H0ZM18 24V14.4C18 10.4 19.0667 7.06667 21.2 4.4C23.3333 1.6 26.2667 0 30 0V3.6C28 3.6 26.4 4.4 25.2 6C24 7.46667 23.4 9.33333 23.4 11.6H28.8V24H18Z"
        fill="currentColor"
      />
    </svg>
  );
}

const testimonials = [
  {
    quote:
      "Frame turned my portfolio into a business. In my first month selling prints I made $3,200. The platform just gets out of the way.",
    name: "Sofia Chen",
    role: "Portrait Photographer",
    location: "San Francisco, CA",
    stat: "$3,200",
    statLabel: "first month",
  },
  {
    quote:
      "The client delivery galleries are a game-changer. My couples can browse, select, and approve — no back-and-forth emails. It's professional on every level.",
    name: "Marco Rivera",
    role: "Wedding Photographer",
    location: "Barcelona, Spain",
    stat: "280+",
    statLabel: "galleries delivered",
  },
  {
    quote:
      "I've tried every platform out there. Frame is the only one that understands the RAW workflow. The storage management is seamless.",
    name: "Aisha Okafor",
    role: "Commercial Photographer",
    location: "Lagos, Nigeria",
    stat: "5 TB",
    statLabel: "archive migrated",
  },
  {
    quote:
      "Zero commission on sales is unreal. I was losing hundreds every month on other platforms. Frame changed my numbers completely.",
    name: "James Whitfield",
    role: "Fine Art Photographer",
    location: "New York, NY",
    stat: "0%",
    statLabel: "commission",
  },
  {
    quote:
      "My portfolio loads faster than anything I've had before. Clients constantly mention how beautiful and smooth it feels. It reflects directly on my work.",
    name: "Hana Nakamura",
    role: "Editorial Photographer",
    location: "Tokyo, Japan",
    stat: "99.9%",
    statLabel: "uptime",
  },
  {
    quote:
      "The analytics show me exactly which photos convert. I can see what my clients love and price accordingly. Data-driven creativity.",
    name: "Lars Eriksson",
    role: "Architectural Photographer",
    location: "Stockholm, Sweden",
    stat: "2.4×",
    statLabel: "conversion lift",
  },
];

export function Testimonials() {
  return (
    <section className="py-32 bg-[var(--bg-subtle)] overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-yellow" />
            <span className="font-mono text-xs text-[var(--fg-muted)] tracking-[0.2em] uppercase">
              From photographers
            </span>
            <div className="h-px w-8 bg-yellow" />
          </div>
          <h2
            className="font-sans font-black text-[var(--fg)] leading-tight"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            Trusted by
            <br />
            <span className="title-yellow font-serif">12,000+ photographers.</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: (i % 3) * 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 hover:border-yellow/30 transition-colors duration-300"
            >
              {/* Quote mark */}
              <div className="text-yellow mb-5 opacity-30">
                <QuoteIcon />
              </div>

              {/* Quote */}
              <p className="font-serif text-[var(--fg-secondary)] text-base leading-relaxed flex-1 mb-6">
                {t.quote}
              </p>

              {/* Stat highlight */}
              <div className="mb-5 flex items-center gap-3">
                <div className="text-2xl font-black title-yellow font-serif">
                  {t.stat}
                </div>
                <div className="font-mono text-[11px] text-[var(--fg-muted)] tracking-wide">
                  {t.statLabel}
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
                {/* Avatar placeholder */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-sans font-black text-sm text-white"
                  style={{
                    background: `linear-gradient(135deg, #${Math.abs(t.name.charCodeAt(0) * 99).toString(16).slice(0, 2)}2a2a, #111)`,
                  }}
                >
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-sans font-semibold text-sm text-[var(--fg)]">
                    {t.name}
                  </div>
                  <div className="font-mono text-[10px] text-[var(--fg-muted)] tracking-wide">
                    {t.role} · {t.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
