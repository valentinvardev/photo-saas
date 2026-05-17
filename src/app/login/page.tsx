"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "~/components/ui/Logo";

const quotes = [
  {
    text: "Photography is the story I fail to put into words.",
    author: "Destin Sparks",
  },
  {
    text: "The camera is an instrument that teaches people how to see without a camera.",
    author: "Dorothea Lange",
  },
  {
    text: "In photography there is a reality so subtle that it becomes more real than reality.",
    author: "Alfred Stieglitz",
  },
];

const quote = quotes[0]!;

/* ── Logo ── */
function FrameLogo() {
  return (
    <Link href="/" className="inline-flex items-center group" aria-label="Portapic home">
      <Logo height={28} priority />
    </Link>
  );
}

/* ── Left image panel ── */
function ImagePanel() {
  return (
    <div className="hidden lg:flex relative w-1/2 min-h-screen flex-col overflow-hidden">
      {/* Photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://picsum.photos/seed/auth/900/1200?grayscale"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

      {/* Grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
          mixBlendMode: "screen",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-10">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center" aria-label="Portapic home">
          <Logo height={28} priority />
        </Link>

        {/* Quote */}
        <div className="max-w-sm">
          <div className="text-yellow/50 mb-4">
            <svg width="28" height="22" viewBox="0 0 32 24" fill="none" aria-hidden>
              <path
                d="M0 24V14.4C0 10.4 1.06667 7.06667 3.2 4.4C5.33333 1.6 8.26667 0 12 0V3.6C10 3.6 8.4 4.4 7.2 6C6 7.46667 5.4 9.33333 5.4 11.6H10.8V24H0ZM18 24V14.4C18 10.4 19.0667 7.06667 21.2 4.4C23.3333 1.6 26.2667 0 30 0V3.6C28 3.6 26.4 4.4 25.2 6C24 7.46667 23.4 9.33333 23.4 11.6H28.8V24H18Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <p className="font-serif text-white/90 text-xl leading-relaxed mb-4">
            {quote.text}
          </p>
          <p className="font-mono text-xs text-white/40 tracking-widest uppercase">
            — {quote.author}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Auth form ── */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      {/* Left: image + quote */}
      <ImagePanel />

      {/* Right: form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        <div className="w-full max-w-sm mx-auto">
          {/* Logo — visible on mobile only */}
          <div className="lg:hidden mb-10">
            <FrameLogo />
          </div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h1 className="font-sans font-black text-[var(--fg)] text-3xl mb-1">
              Welcome back.
            </h1>
            <p className="font-serif text-[var(--fg-muted)] text-base mb-8">
              Sign in to your Portapic account.
            </p>
          </motion.div>

          {/* Form */}
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block font-mono text-[11px] text-[var(--fg-muted)] tracking-widest uppercase mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-3 font-sans text-sm text-[var(--fg)] bg-[var(--bg-card)] border border-[var(--border)] placeholder:text-[var(--fg-muted)] focus:outline-none focus:border-yellow transition-colors duration-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-mono text-[11px] text-[var(--fg-muted)] tracking-widest uppercase">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="font-mono text-[11px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 font-sans text-sm text-[var(--fg)] bg-[var(--bg-card)] border border-[var(--border)] placeholder:text-[var(--fg-muted)] focus:outline-none focus:border-yellow transition-colors duration-200"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full rounded-xl py-3.5 font-sans font-bold text-sm mt-2"
            >
              Sign in
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="font-mono text-[10px] text-[var(--fg-muted)] tracking-widest uppercase">
              or
            </span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* Google OAuth placeholder */}
          <button
            type="button"
            className="w-full rounded-xl py-3 px-4 font-sans font-medium text-sm text-[var(--fg)] bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--fg-muted)] transition-colors duration-200 flex items-center justify-center gap-3"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          {/* Sign up link */}
          <p className="mt-8 text-center font-sans text-sm text-[var(--fg-muted)]">
            No account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[var(--fg)] hover:text-yellow transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
