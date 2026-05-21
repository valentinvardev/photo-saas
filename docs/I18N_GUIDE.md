# Portapic — Internationalisation Guide

How the translation system is structured, how to wire it up, and how to maintain it.

---

## 1. Translation files

All strings live in `messages/`:

```
messages/
├── en.json   ← English (source of truth)
├── es.json   ← Spanish
└── pt.json   ← Brazilian Portuguese
```

**The English file is the canonical source.** When you add a new key, add it to `en.json` first, then copy + translate into `es.json` and `pt.json`. Never add a key to a translation file that doesn't exist in `en.json`.

---

## 2. String format conventions

### Plain strings
```json
"save": "Save"
```

### Interpolation (runtime values)
Use `{variable}` — compatible with both `react-intl` and `next-intl`.
```json
"greeting": "Good {timeOfDay}, {name}"
```

### Plurals (ICU message format)
```json
"photos": "{n, plural, one {1 photo} other {{n} photos}}"
"deleteConfirmTitle": "Delete {count, plural, one {1 file} other {{count} files}}?"
```

Note the double `{{` / `}}` when the variable appears inside the plural branch — the outer braces are ICU syntax, the inner are the interpolation.

### Mixed plural + interpolation
```json
"selected": "{folders, plural, =0 {} one {1 folder} other {{folders} folders}}{sep}{photos, plural, =0 {} one {1 photo} other {{photos} photos}} selected"
```

`=0 {}` renders nothing for zero — so "2 folders · 0 photos" displays as just "2 folders".

---

## 3. Recommended library: `next-intl`

`next-intl` is the recommended library for this stack (Next.js 15 App Router).

```bash
npm install next-intl
```

### Why `next-intl` over alternatives

| Library | App Router support | ICU plurals | Bundle size |
|---|---|---|---|
| `next-intl` | Native | Yes | ~10 kB |
| `react-intl` | Client only | Yes | ~45 kB |
| `i18next` | Via plugin | Via plugin | ~30 kB |

`next-intl` supports server components natively, so translated strings can be rendered on the server with no hydration cost.

---

## 4. Wiring up (when ready to implement)

### 4a. Create `i18n.ts` at the project root

```ts
// i18n.ts
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
}));
```

### 4b. Create `middleware.ts`

```ts
import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "es", "pt"],
  defaultLocale: "en",
  // Strategy: no URL prefix for default locale (/about = English, /es/about = Spanish)
  localePrefix: "as-needed",
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

### 4c. Add locale to `next.config.ts`

```ts
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();
export default withNextIntl({ /* existing config */ });
```

### 4d. Usage in server components

```tsx
import { useTranslations } from "next-intl";

export default function GalleryPage() {
  const t = useTranslations("gallery");
  return <h1>{t("title")}</h1>;
}
```

### 4e. Usage in client components

```tsx
"use client";
import { useTranslations } from "next-intl";

export function DeleteButton({ count }: { count: number }) {
  const t = useTranslations("gallery");
  return <button>{t("deleteConfirmTitle", { count })}</button>;
}
```

### 4f. Plurals and interpolation

```tsx
// Interpolation
t("greeting", { timeOfDay: "morning", name: "Sofia" })
// → "Good morning, Sofia"

// Plurals
t("photos", { n: 3 })
// → "3 photos"

// Mixed (sep = " · " or "" depending on whether both are non-zero)
t("selected", { folders: 2, photos: 0, sep: folders > 0 && photos > 0 ? " · " : "" })
// → "2 folders"
```

---

## 5. Language detection and switcher

### Detection order (recommended)

1. User profile preference (stored in DB / user record)
2. Browser `Accept-Language` header (server-side)
3. `localStorage` fallback for client-only detection
4. Default: `"en"`

### Where to add the switcher

The language switcher belongs in **Profile settings** (`/dashboard/profile`), under a new "Language" field in the account section. Do NOT add it to the main nav — it's a rare setting.

```tsx
// In profile settings form
<select value={locale} onChange={(e) => setLocale(e.target.value)}>
  <option value="en">English</option>
  <option value="es">Español</option>
  <option value="pt">Português (Brasil)</option>
</select>
```

On save, write the preference to the user's DB record and redirect to the same page with the new locale cookie set.

---

## 6. Things NOT to translate

- Template names (`Atelier`, `Brooklyn`, `Vogue`) — these are brand names
- Plan tier names in English (`Bronze`, `Silver`, `Gold`) when used as product labels in billing contexts — though dashboard display names in `es`/`pt` files translate them to local equivalents
- File format names (`RAW`, `TIFF`, `JPEG`) — technical identifiers
- URL slugs and routes
- Code, CSS variable names, or anything that appears in `<code>` tags

---

## 7. Date and number formatting

Do NOT hardcode date formats in components. Use the Intl API or `next-intl`'s formatting utilities:

```tsx
// In a server component with next-intl
const formatter = await getFormatter({ locale });
formatter.dateTime(date, { dateStyle: "medium" });
// en → "May 20, 2026"
// es → "20 may 2026"
// pt → "20 de mai. de 2026"
```

For currency (delivery pricing):
```tsx
formatter.number(price, { style: "currency", currency: "USD" });
// Always USD for now — Portapic bills in USD
```

---

## 8. Adding a new language

1. Copy `messages/en.json` to `messages/[locale].json`
2. Translate all values (keys stay in English)
3. Add the locale to the `locales` array in `middleware.ts`
4. Add an `<option>` in the profile language switcher
5. Verify plural rules — some languages (Russian, Polish, Arabic) have more than two plural forms; ICU handles them but you must write all branches

---

## 9. Key invariants

- **Keys are always English dot-paths** — never translate keys, only values
- **`en.json` is the source of truth** — all other files must have exactly the same key set
- **ICU format for all plurals** — do not use JS-level ternaries for pluralization; put the logic in the message string
- **`{sep}` for conditional separators** — pass `" · "` when both sides are non-zero, `""` otherwise
- **Template names are never translated** — they are brand identifiers
- **Dates via Intl, not hardcoded formats** — locale-aware formatting is free with `next-intl`
