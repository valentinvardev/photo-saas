import en from "../../messages/en.json";
import es from "../../messages/es.json";
import pt from "../../messages/pt.json";

export type Locale = "en" | "es" | "pt";

export const LOCALES: { id: Locale; label: string; native: string }[] = [
  { id: "en", label: "English",    native: "English"   },
  { id: "es", label: "Spanish",    native: "Español"   },
  { id: "pt", label: "Portuguese", native: "Português" },
];

const MESSAGES: Record<Locale, Record<string, unknown>> = {
  en: en as Record<string, unknown>,
  es: es as Record<string, unknown>,
  pt: pt as Record<string, unknown>,
};

function resolve(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const part of parts) {
    if (cur == null || typeof cur !== "object") return path;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === "string" ? cur : path;
}

function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}

export function createT(locale: Locale) {
  const messages = MESSAGES[locale];
  return function t(key: string, vars?: Record<string, string | number>): string {
    const raw = resolve(messages, key);
    return interpolate(raw, vars);
  };
}
