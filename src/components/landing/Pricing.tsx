"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    tag: null,
    price: { monthly: 19, annual: 15 },
    description: "Everything you need to start building your photography business online.",
    storage: "100 GB",
    sites: "1 portfolio site",
    features: [
      "1 portfolio site",
      "100 GB cloud storage",
      "Photo sales (5% fee)",
      "Custom domain",
      "5 client galleries / mo",
      "Basic analytics",
      "Email support",
    ],
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Pro",
    tag: "Most popular",
    price: { monthly: 49, annual: 39 },
    description: "For professional photographers who are serious about growing their income.",
    storage: "1 TB",
    sites: "5 portfolio sites",
    features: [
      "5 portfolio sites",
      "1 TB cloud storage",
      "Photo sales (0% fee)",
      "Custom domains",
      "Unlimited client galleries",
      "Advanced analytics",
      "Print fulfillment",
      "Watermarking",
      "Priority support",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Studio",
    tag: null,
    price: { monthly: 99, annual: 79 },
    description: "For studios and agencies managing multiple photographers and clients.",
    storage: "5 TB",
    sites: "Unlimited sites",
    features: [
      "Unlimited portfolio sites",
      "5 TB cloud storage",
      "Photo sales (0% fee)",
      "Team access (5 seats)",
      "Unlimited client galleries",
      "White-label galleries",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-32 bg-[var(--bg)]">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-yellow" />
            <span className="font-mono text-xs text-[var(--fg-muted)] tracking-[0.2em] uppercase">
              Pricing
            </span>
            <div className="h-px w-8 bg-yellow" />
          </div>
          <h2
            className="font-sans font-black text-[var(--fg)] leading-tight mb-6"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
          >
            Simple, transparent
            <br />
            <span className="title-yellow font-serif">pricing.</span>
          </h2>
          <p className="font-serif text-[var(--fg-muted)] text-lg max-w-md mx-auto">
            14-day free trial on all plans. No credit card required.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 mt-8 p-1 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-lg text-sm font-sans font-medium transition-all ${
                !annual
                  ? "bg-[var(--bg)] text-[var(--fg)] shadow-sm"
                  : "text-[var(--fg-muted)]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-lg text-sm font-sans font-medium transition-all flex items-center gap-2 ${
                annual
                  ? "bg-[var(--bg)] text-[var(--fg)] shadow-sm"
                  : "text-[var(--fg-muted)]"
              }`}
            >
              Annual
              <span className="bg-yellow text-[#111] font-mono text-[10px] font-black px-1.5 py-0.5 rounded">
                -20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                delay: i * 0.1,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative rounded-2xl p-8 flex flex-col ${
                plan.highlight
                  ? "bg-[var(--fg)] text-[var(--bg)] shadow-2xl scale-[1.03] ring-2 ring-yellow"
                  : "bg-[var(--bg-card)] border border-[var(--border)]"
              }`}
            >
              {/* Popular badge */}
              {plan.tag && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="bg-yellow text-[#111] font-mono font-black text-[10px] tracking-wider uppercase px-3 py-1 rounded-full">
                    {plan.tag}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div
                  className={`font-mono text-xs tracking-[0.2em] uppercase mb-3 ${
                    plan.highlight ? "text-yellow" : "text-[var(--fg-muted)]"
                  }`}
                >
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span
                    className={`font-sans font-black text-5xl ${
                      plan.highlight ? "text-[var(--bg)]" : "text-[var(--fg)]"
                    }`}
                  >
                    ${annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  <span
                    className={`font-mono text-sm ${
                      plan.highlight ? "text-[var(--bg)]/60" : "text-[var(--fg-muted)]"
                    }`}
                  >
                    / mo
                  </span>
                </div>
                <p
                  className={`font-serif text-sm leading-relaxed ${
                    plan.highlight ? "text-[var(--bg)]/70" : "text-[var(--fg-muted)]"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <hr
                className={`mb-6 border-0 h-px ${
                  plan.highlight ? "bg-white/15" : "bg-[var(--border)]"
                }`}
              />

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 shrink-0 ${
                        plan.highlight ? "text-yellow" : "text-yellow"
                      }`}
                    >
                      <CheckIcon />
                    </div>
                    <span
                      className={`font-sans text-sm ${
                        plan.highlight
                          ? "text-[var(--bg)]/80"
                          : "text-[var(--fg-secondary)]"
                      }`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`w-full text-center rounded-xl py-3.5 font-sans font-bold text-sm transition-all duration-200 ${
                  plan.highlight
                    ? "bg-yellow text-[#111] hover:bg-yellow-dark"
                    : "border border-[var(--border)] text-[var(--fg)] hover:border-[var(--fg-muted)] bg-[var(--bg)]"
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center font-mono text-xs text-[var(--fg-muted)] mt-10"
        >
          All plans include SSL, CDN delivery, and 99.9% uptime SLA.
          <br />
          Annual billing saves up to 20%. Switch plans anytime.
        </motion.p>
      </div>
    </section>
  );
}
