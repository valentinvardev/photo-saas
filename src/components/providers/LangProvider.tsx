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
    // A previously chosen language always wins.
    const stored = localStorage.getItem("lang") as Locale | null;
    if (stored && ["en", "es", "pt"].includes(stored)) { setLocaleState(stored); return; }
    // Otherwise auto-detect from the browser's language (the most reliable
    // signal for which language a person reads — more so than IP geolocation).
    const nav = (navigator.language || "en").toLowerCase();
    const detected: Locale = nav.startsWith("es") ? "es" : nav.startsWith("pt") ? "pt" : "en";
    setLocaleState(detected);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("lang", l);
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
