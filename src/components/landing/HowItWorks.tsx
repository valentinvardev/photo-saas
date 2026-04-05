"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Upload your work",
    body: "Drag and drop your photos. RAW, TIFF, JPEG, DNG — every format supported. Your files are encrypted and backed up automatically.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Build your portfolio",
    body: "Choose a layout, add your logo, set your custom domain. Your portfolio goes live in minutes. No code, no designer needed.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Grow your business",
    body: "Sell prints and licenses, deliver client galleries, track analytics. Your portfolio is your storefront — open 24/7.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="how-it-works"
      className="relative py-32 grain overflow-hidden bg-[var(--bg-section)]"
    >
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-yellow/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-yellow" />
            <span className="font-mono text-xs text-[var(--fg-muted)] tracking-[0.2em] uppercase">
              Simple by design
            </span>
            <div className="h-px w-8 bg-yellow" />
          </div>
          <h2
            className="font-sans font-black text-[var(--fg)] leading-tight"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            Up and running
            <br />
            <span className="title-yellow font-serif">in three steps.</span>
          </h2>
        </motion.div>

        {/* Steps */}
        <div ref={ref} className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-px">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-px bg-gradient-to-r from-transparent via-yellow/40 to-transparent origin-left"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: i * 0.18 + 0.2,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative flex flex-col items-center lg:items-start text-center lg:text-left"
              >
                {/* Icon box */}
                <div className="relative mb-8">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center relative shadow-lg"
                    style={{ background: "#FAD502" }}
                  >
                    {/* Icon — charcoal for max contrast on yellow */}
                    <div style={{ color: "#1a1a1a" }}>
                      {/* Upscale the icon slightly */}
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {/* Re-render the path from each step's icon */}
                        {i === 0 && (
                          <>
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </>
                        )}
                        {i === 1 && (
                          <>
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M3 9h18M9 21V9" />
                          </>
                        )}
                        {i === 2 && (
                          <>
                            <line x1="12" y1="1" x2="12" y2="23" />
                            <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                          </>
                        )}
                      </svg>
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[var(--bg-section)] border border-[var(--border)] flex items-center justify-center shadow-sm">
                      <span className="font-mono font-black text-[var(--fg)] text-[10px]">
                        {i + 1}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="font-mono text-xs tracking-[0.2em] mb-2">
                  <span className="yellow-label">{step.number}</span>
                </div>

                <h3 className="font-sans font-black text-[var(--fg)] text-2xl mb-3">
                  {step.title}
                </h3>

                <p className="font-serif text-[var(--fg-secondary)] text-base leading-relaxed">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
          <a
            href="#pricing"
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl font-sans font-bold"
          >
            Get started today
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
