"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "~/components/ui/Logo";

/* ── Icons ── */
function EyeIcon({ off = false }: { off?: boolean }) {
  return off ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/* ── Validation helpers ── */
function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function validateUsername(v: string) {
  return /^[a-z0-9._-]{3,20}$/.test(v);
}
function passwordStrength(v: string): 0 | 1 | 2 | 3 {
  if (v.length === 0) return 0;
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v) && /[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  return score as 0 | 1 | 2 | 3;
}
const strengthLabel = ["", "Weak", "Fair", "Strong"] as const;
const strengthColor = ["", "#ef4444", "#facc15", "#22c55e"] as const;

/* ── Border helper ──
   Green as soon as valid (rewards good input).
   Red only after blur AND the user actually typed something (no rush). */
function inputBorder(valid: boolean, touched: boolean, hasContent: boolean) {
  if (valid) return "border-green-500";
  if (touched && hasContent) return "border-red-500";
  return "border-[var(--border)]";
}

/* ── Inline error message ── */
function FieldError({ message }: { message: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18 }}
      className="text-red-400 font-mono text-[10px] mt-1.5"
    >
      {message}
    </motion.p>
  );
}

/* ── Field wrapper ── */
function Field({
  label,
  children,
  error,
  showError,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  showError?: boolean;
}) {
  return (
    <div>
      <label className="block font-mono text-[11px] text-[var(--fg-muted)] tracking-widest uppercase mb-1.5">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {showError && error && <FieldError message={error} />}
      </AnimatePresence>
    </div>
  );
}

/* ── Left image panel ── */
function ImagePanel() {
  return (
    <div className="hidden lg:flex relative w-1/2 min-h-screen flex-col overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://picsum.photos/seed/register/900/1200?grayscale"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
          mixBlendMode: "screen",
        }}
      />
      <div className="relative z-10 flex flex-col justify-between h-full p-10">
        <Link href="/" className="inline-flex items-center" aria-label="Portapic home">
          <Logo height={28} priority />
        </Link>
        <div className="max-w-sm">
          <div className="text-yellow/50 mb-4">
            <svg width="28" height="22" viewBox="0 0 32 24" fill="none" aria-hidden>
              <path d="M0 24V14.4C0 10.4 1.06667 7.06667 3.2 4.4C5.33333 1.6 8.26667 0 12 0V3.6C10 3.6 8.4 4.4 7.2 6C6 7.46667 5.4 9.33333 5.4 11.6H10.8V24H0ZM18 24V14.4C18 10.4 19.0667 7.06667 21.2 4.4C23.3333 1.6 26.2667 0 30 0V3.6C28 3.6 26.4 4.4 25.2 6C24 7.46667 23.4 9.33333 23.4 11.6H28.8V24H18Z" fill="currentColor" />
            </svg>
          </div>
          <p className="font-serif text-white/90 text-xl leading-relaxed mb-4">
            Your work deserves a home that grows with you.
          </p>
          <p className="font-mono text-xs text-white/40 tracking-widest uppercase">— Portapic</p>
        </div>
      </div>
    </div>
  );
}

/* ── Base input classes (without border — applied dynamically) ── */
const inputBase =
  "w-full rounded-xl px-4 py-3 font-sans text-sm text-[var(--fg)] bg-[var(--bg-card)] border placeholder:text-[var(--fg-muted)] focus:outline-none focus:border-yellow transition-colors duration-200";

/* ── Page ── */
export default function RegisterPage() {
  const [firstName, setFirstName]       = useState("");
  const [lastName, setLastName]         = useState("");
  const [username, setUsername]         = useState("");
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [confirm, setConfirm]           = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const touch = useCallback((field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
  }, []);

  /* derived validation */
  const firstValid   = firstName.trim().length >= 2;
  const lastValid    = lastName.trim().length >= 2;
  const userValid    = validateUsername(username);
  const emailValid   = validateEmail(email);
  const strength     = passwordStrength(password);
  const passValid    = strength >= 1 && password.length >= 8;
  const confirmValid = confirm === password && confirm.length > 0;
  const formValid    = firstValid && lastValid && userValid && emailValid && passValid && confirmValid;

  const usernameError =
    username.length > 0 && username.length < 3
      ? "At least 3 characters"
      : username.length > 20
        ? "Max 20 characters"
        : !/^[a-z0-9._-]*$/.test(username) && username.length > 0
          ? "Only lowercase letters, numbers, . _ -"
          : "3–20 characters, no spaces";

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      <ImagePanel />

      {/* Form panel */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">

          {/* Logo — mobile only */}
          <div className="lg:hidden mb-10">
            <Link href="/" className="inline-flex items-center" aria-label="Portapic home">
              <Logo height={28} priority />
            </Link>
          </div>

          <h1 className="font-sans font-black text-[var(--fg)] text-3xl mb-1">
            Create your account.
          </h1>
          <p className="font-serif text-[var(--fg-muted)] text-base mb-8">
            Join 12,000+ photographers on Portapic.
          </p>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <Field
                label="First name"
                error="At least 2 characters"
                showError={touched.firstName && !firstValid && firstName.length > 0}
              >
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => touch("firstName")}
                  placeholder="Sofia"
                  className={`${inputBase} ${inputBorder(firstValid, !!touched.firstName, firstName.length > 0)}`}
                />
              </Field>

              <Field
                label="Last name"
                error="At least 2 characters"
                showError={touched.lastName && !lastValid && lastName.length > 0}
              >
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => touch("lastName")}
                  placeholder="Chen"
                  className={`${inputBase} ${inputBorder(lastValid, !!touched.lastName, lastName.length > 0)}`}
                />
              </Field>
            </div>

            {/* Username */}
            <Field
              label="Username"
              error={usernameError}
              showError={touched.username && !userValid && username.length > 0}
            >
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-[var(--fg-muted)] pointer-events-none select-none">
                  @
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase())}
                  onBlur={() => touch("username")}
                  placeholder="sofia.chen"
                  className={`${inputBase} pl-8 font-mono ${inputBorder(userValid, !!touched.username, username.length > 0)}`}
                />
              </div>
            </Field>

            {/* Email */}
            <Field
              label="Email"
              error="Enter a valid email address"
              showError={touched.email && !emailValid && email.length > 0}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => touch("email")}
                placeholder="sofia@example.com"
                className={`${inputBase} ${inputBorder(emailValid, !!touched.email, email.length > 0)}`}
              />
            </Field>

            {/* Password */}
            <Field
              label="Password"
              error="Minimum 8 characters"
              showError={touched.password && !passValid && password.length > 0}
            >
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => touch("password")}
                  placeholder="••••••••"
                  className={`${inputBase} pr-10 ${inputBorder(passValid, !!touched.password, password.length > 0)}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>

              {/* Strength bar */}
              <AnimatePresence>
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 overflow-hidden"
                  >
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3].map((s) => (
                        <motion.div
                          key={s}
                          className="h-1 flex-1 rounded-full"
                          animate={{
                            backgroundColor:
                              strength >= s ? strengthColor[strength] : "var(--border)",
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      ))}
                    </div>
                    <p
                      className="font-mono text-[10px] transition-colors duration-300"
                      style={{ color: strengthColor[strength] }}
                    >
                      {strengthLabel[strength]} password
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </Field>

            {/* Confirm password — slides in once password has content */}
            <AnimatePresence>
              {password.length > 0 && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <Field
                    label="Confirm password"
                    error="Passwords don't match"
                    showError={touched.confirm && !confirmValid && confirm.length > 0}
                  >
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        onBlur={() => touch("confirm")}
                        placeholder="••••••••"
                        className={`${inputBase} pr-10 ${inputBorder(confirmValid, !!touched.confirm, confirm.length > 0)}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                        tabIndex={-1}
                      >
                        <EyeIcon off={showConfirm} />
                      </button>
                    </div>
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={!formValid}
              whileTap={formValid ? { scale: 0.98 } : {}}
              className="btn-primary w-full rounded-xl py-3.5 font-sans font-bold text-sm mt-2 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity duration-200"
            >
              Create account
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[var(--border)]" />
            <span className="font-mono text-[10px] text-[var(--fg-muted)] tracking-widest uppercase">or</span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* Google */}
          <button
            type="button"
            className="w-full rounded-xl py-3 px-4 font-sans font-medium text-sm text-[var(--fg)] bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--fg-muted)] transition-colors duration-200 flex items-center justify-center gap-3"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Sign in link */}
          <p className="mt-8 text-center font-sans text-sm text-[var(--fg-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[var(--fg)] hover:text-yellow transition-colors">
              Sign in
            </Link>
          </p>

          <p className="mt-4 text-center font-mono text-[10px] text-[var(--fg-muted)] leading-relaxed">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="underline hover:text-[var(--fg)] transition-colors">Terms</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-[var(--fg)] transition-colors">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
