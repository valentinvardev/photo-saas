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

function lookup(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const part of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === "string" ? cur : undefined;
}

/** Resolve a key in the locale, falling back to English, then the key itself. */
function resolve(obj: Record<string, unknown>, path: string): string {
  return lookup(obj, path) ?? lookup(en as Record<string, unknown>, path) ?? path;
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
