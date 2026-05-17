"use client";

import { useState } from "react";

/* Controlled or uncontrolled. If `checked`/`onChange` are passed it's
   controlled; otherwise it tracks its own state from `defaultOn`. */
type ToggleProps = {
  checked?:    boolean;
  defaultOn?:  boolean;
  onChange?:   (next: boolean) => void;
  disabled?:   boolean;
  ariaLabel?:  string;
};

export function Toggle({ checked, defaultOn = false, onChange, disabled, ariaLabel }: ToggleProps) {
  const [internal, setInternal] = useState(defaultOn);
  const on = checked ?? internal;

  function handle() {
    if (disabled) return;
    const next = !on;
    if (checked === undefined) setInternal(next);
    onChange?.(next);
  }

  /* Theme palette:
     - dark mode ON  → yellow track, dark knob (default vars)
     - light mode ON → dark track, yellow knob (dark: overrides flip)
     - OFF (both)    → muted track from --border, knob matches bg-card so
                       it reads as a recessed pill rather than a chip.
     The knob is centered with top-1/2 + translate-y so any subpixel
     rounding can't push it below the track midline. */
  return (
    <button
      type="button"
      onClick={handle}
      disabled={disabled}
      role="switch"
      aria-checked={on}
      aria-label={ariaLabel}
      className={`relative inline-flex shrink-0 w-9 h-5 rounded-full transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-yellow/40 disabled:opacity-40 disabled:cursor-not-allowed ${
        on
          ? "bg-[#111111] dark:bg-yellow"
          : "bg-[var(--border)]"
      }`}
    >
      <span
        className={`absolute top-1/2 left-0.5 w-4 h-4 rounded-full shadow transition-transform duration-200 ${
          on
            ? "bg-yellow dark:bg-[#111111] -translate-y-1/2 translate-x-4"
            : "bg-[var(--bg-card)] -translate-y-1/2"
        }`}
      />
    </button>
  );
}
