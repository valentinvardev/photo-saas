"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createT, type Locale } from "~/lib/i18n";

type LangCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: ReturnType<typeof createT>;
};

const LangContext = createContext<LangCtx>({
  locale: "en",
  setLocale: () => {},
  t: createT("en"),
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // 0. URL param ?lang=es — used when template pages are loaded inside preview iframes.
    //    Highest priority so the preview always matches the parent page's locale.
    const urlLang = new URLSearchParams(window.location.search).get("lang") as Locale | null;
    if (urlLang && ["en", "es", "pt"].includes(urlLang)) { setLocaleState(urlLang); return; }

    // 1. User manually chose a language → persistent preference.
    const stored = (localStorage.getItem("lang-user") ?? localStorage.getItem("lang")) as Locale | null;
    if (stored && ["en", "es", "pt"].includes(stored)) { setLocaleState(stored); return; }

    // 2. Geo cookie set by the middleware (Vercel country or Accept-Language header).
    const geoCookie = document.cookie.split("; ").find(c => c.startsWith("lang-geo="))?.split("=")[1] as Locale | undefined;
    if (geoCookie && ["en", "es", "pt"].includes(geoCookie)) { setLocaleState(geoCookie); return; }

    // 3. Browser navigator.language as last resort.
    const nav = (navigator.language || "en").toLowerCase();
    const detected: Locale = nav.startsWith("es") ? "es" : nav.startsWith("pt") ? "pt" : "en";
    setLocaleState(detected);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("lang-user", l);
    // Also write a cookie so the middleware skips geo detection for this user.
    document.cookie = `lang-user=${l};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
  }, []);

  const t = useCallback(createT(locale), [locale]);

  return (
    <LangContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useT() {
  return useContext(LangContext);
}
