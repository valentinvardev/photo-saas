"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

/* ── Types ─────────────────────────────────────────────────────── */

export type EditorTheme = "dark" | "light";

interface ThemeCtx {
  theme:  EditorTheme;
  toggle: () => void;
}

/* ── CSS variable sets ─────────────────────────────────────────── */

export const THEME_VARS: Record<EditorTheme, React.CSSProperties> = {
  dark: {
    "--ec-bg":      "#0d0d0d",
    "--ec-surface": "#141414",
    "--ec-raised":  "#1a1a1a",
    "--ec-lift":    "#222222",
    "--ec-line":    "#1f1f1f",
    "--ec-border":  "#2a2a2a",
    "--ec-ghost":   "#333333",
    "--ec-dim":     "#444444",
    "--ec-sub":     "#555555",
    "--ec-muted":   "#888888",
    "--ec-label":   "#aaaaaa",
    "--ec-text":    "#cccccc",
    "--ec-bright":  "#eeeeee",
  } as React.CSSProperties,
  light: {
    "--ec-bg":      "#f2f2f2",
    "--ec-surface": "#eaeaea",
    "--ec-raised":  "#e2e2e2",
    "--ec-lift":    "#d8d8d8",
    "--ec-line":    "#e0e0e0",
    "--ec-border":  "#d0d0d0",
    "--ec-ghost":   "#bbbbbb",
    "--ec-dim":     "#999999",
    "--ec-sub":     "#777777",
    "--ec-muted":   "#555555",
    "--ec-label":   "#444444",
    "--ec-text":    "#1a1a1a",
    "--ec-bright":  "#111111",
  } as React.CSSProperties,
};

/* ── Context ───────────────────────────────────────────────────── */

const Ctx = createContext<ThemeCtx>({ theme: "dark", toggle: () => {} });

const LS_KEY = "frame-editor-theme";

export function EditorThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<EditorTheme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next: EditorTheme = t === "dark" ? "light" : "dark";
      localStorage.setItem(LS_KEY, next);
      return next;
    });
  }, []);

  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
}

export function useEditorTheme() {
  return useContext(Ctx);
}
