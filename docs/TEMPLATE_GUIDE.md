# Portapic — Template Integration Guide

How to wire a new (or existing) `/template/[id]` page into every surface of the platform.
This file is the source of truth for agents and developers adding or modifying templates.

---

## 1. Three template contexts

| Context | Route where used | Preview URL pattern |
|---|---|---|
| **Portfolio** | `/editor/[id]` + `/dashboard/portfolio/[id]` | `/template/[id]` |
| **Delivery** | `/delivery/edit/[id]` + template modal | `/template/[id]/delivery` |
| **Links** | `/dashboard/links` Template tab | `/template/[id]/links` |

Each context is independent. A template can exist in one, two, or all three.

---

## 2. File structure

```
src/
├── app/
│   ├── editor/
│   │   └── [template-id]/
│   │       ├── page.tsx          ← mounts EditorShell with templateId
│   │       └── layout.tsx        ← shared editor chrome (usually empty)
│   └── template/
│       └── [template-id]/
│           ├── layout.tsx        ← loads Google Fonts, sets CSS vars
│           ├── page.tsx          ← PUBLIC portfolio render
│           ├── delivery/
│           │   └── page.tsx      ← PUBLIC delivery page render
│           └── links/
│               └── page.tsx      ← PUBLIC links page render
├── components/
│   └── editor/
│       └── canvas/
│           └── [TemplateName]Template.tsx  ← editable canvas component
└── lib/
    └── editor/
        └── templates/
            ├── registry.tsx      ← register new template here
            ├── types.tsx         ← TemplateDef, SectionDef types
            └── [template-id].tsx ← node definitions + section map
```

---

## 3. Portfolio template

### 3a. Public render route — `/template/[id]/page.tsx`

This is what visitors see. It must render without the editor shell.

```tsx
// src/app/template/my-template/page.tsx
export default function MyTemplatePage() {
  // Load persisted editor state (future: from DB)
  // Render the static version of the template
}
```

The **layout.tsx** handles Google Fonts. Use Next.js `next/font/google` and expose them as CSS vars `--font-sans`, `--font-serif`, `--font-mono`. Example from `atelier/layout.tsx`.

### 3b. Editor integration — `EditorShell` + registry

1. **Define nodes and sections** in `src/lib/editor/templates/[id].tsx`:

```tsx
import type { EditorNode, SectionDef } from "./types";

export const MY_TEMPLATE_NODES: Record<string, EditorNode> = {
  "hero-heading": { type: "heading",   content: "Your name",    fontSize: 56 },
  "hero-image":   { type: "image",     src: "/placeholder.jpg", alt: "hero"  },
  // ...
};

export const MY_TEMPLATE_SECTIONS: SectionDef[] = [
  { id: "hero", label: "Hero", icon: "...", elements: ["hero-heading", "hero-image"] },
  // ...
];
```

2. **Create an editable canvas component** at `src/components/editor/canvas/MyTemplate.tsx`.
   Wrap every editable node with `<EditableNode id="node-id">` and text nodes with `<EditableText id="node-id">`.
   Never `import` this directly — it must be lazy-loaded (see registry).

3. **Register in `src/lib/editor/templates/registry.tsx`**:

```tsx
import type { TemplateDef } from "./types";
import { MY_TEMPLATE_NODES, MY_TEMPLATE_SECTIONS } from "./my-template";

export const TEMPLATES: Record<string, TemplateDef> = {
  // existing entries …
  "my-template": {
    id:           "my-template",
    name:         "My Template",
    initialNodes: MY_TEMPLATE_NODES,
    sections:     MY_TEMPLATE_SECTIONS,
    // Lazy-loaded so EditorShell never SSRs the canvas component
    Component: dynamic(() => import("~/components/editor/canvas/MyTemplate").then(m => m.MyTemplate)),
  },
};
```

4. **Create the editor entry page** at `src/app/editor/my-template/page.tsx`:

```tsx
"use client";
import dynamic from "next/dynamic";
const EditorShell = dynamic(() => import("~/components/editor/core/EditorShell").then(m => m.EditorShell), { ssr: false });
export default function EditorPage() {
  return <EditorShell templateId="my-template" />;
}
```

5. **Register the preview URL** so other surfaces can iframe/thumbnail this template.
   In `src/lib/portfolio/mock.ts`, add to `TEMPLATE_URL`:

```ts
export const TEMPLATE_URL: Partial<Record<string, string>> = {
  // existing …
  "My Template": "/template/my-template",
};
```

   This URL is used by:
   - `LivePreviewThumbnail` in the portfolio card grid
   - The Template tab in `/dashboard/portfolio/[id]`
   - The wizard template picker (`/dashboard/portfolio/new`)
   - The domain page page-cards
   - The templates gallery page

---

## 4. Delivery template

### 4a. Public render route — `/template/[id]/delivery/page.tsx`

Renders the client-facing delivery gallery. Receives the delivery page data (photos, title, pricing, etc.) — currently mocked, later hydrated from the store or DB.

### 4b. Delivery editor integration — `Builder.tsx`

1. **Add the template to `TEMPLATES`** in `src/lib/delivery/data.ts`:

```ts
export const TEMPLATES: DeliveryTemplate[] = [
  // existing …
  { id: "my-template", label: "My Template", desc: "Short description.", accent: "#hexcolor", fg: "#ffffff", sub: "#aaaaaa" },
];
```

   `accent` = background color, `fg` = main text color, `sub` = secondary text.
   `TemplateName` union type in the same file must also include the new id.

2. **Register the preview URL** in `Builder.tsx` (top of the file, `TEMPLATE_PREVIEW_URLS` object):

```ts
const TEMPLATE_PREVIEW_URLS: Partial<Record<TemplateName, string>> = {
  // existing …
  "my-template": "/template/my-template/delivery",
};
```

   This URL is loaded inside the real iframe in the `TemplateModal` (desktop + mobile frame).

3. **Wire the template style** in `TEMPLATE_STYLES` (in `data.ts`) if the delivery page reads color overrides from it.

### 4c. TemplatePanel in the sidebar

`TemplatePanel` (in `Builder.tsx`) shows the current template and a button to open `TemplateModal`.
No changes needed — it reads from `TEMPLATES` automatically.

---

## 5. Links template

### 5a. Public render route — `/template/[id]/links/page.tsx`

Renders the public Linktree-style page. Should respect the `LinksPage` data shape from `src/lib/links/data.ts`.

### 5b. Links editor integration — `TemplateTab`

1. **Add the template to `LINKS_TEMPLATES`** in `src/lib/links/data.ts`:

```ts
export const LINKS_TEMPLATES: LinksTemplateConfig[] = [
  // existing …
  { id: "my-template", label: "My Template", desc: "Description.", accent: "#hex", href: "/template/my-template/links" },
];
```

2. **`TemplatePreviewTile`** in `links/page.tsx` renders a small phone-shaped preview of each template using `href`.
   No changes needed — it reads `LINKS_TEMPLATES` automatically.

3. The **Active badge** in the template tab is always green regardless of template accent color (intentional — do not revert).

---

## 6. Domain page integration

The domain page (`/dashboard/domain`) shows live page cards with iframes for Portfolio, Links, and Delivery.
Register preview URLs in `PAGE_PREVIEW_URLS` at the top of `src/app/dashboard/domain/page.tsx`:

```ts
const PAGE_PREVIEW_URLS: Record<"portfolio" | "links" | "delivery", string> = {
  portfolio: "/template/my-template",         // or whichever is active
  links:     "/template/my-template/links",
  delivery:  "/template/my-template/delivery",
};
```

These are currently hardcoded; they will be dynamically driven by the user's active template once the backend is wired.

---

## 7. Templates gallery page

The public templates gallery (`/dashboard/templates`) has three tabs: Portfolio, Delivery, Links.

Each tab is populated from arrays defined at the top of `src/app/dashboard/templates/page.tsx`.

**Portfolio tab** — add to the portfolio templates array:
```ts
{ id: "my-template", name: "My Template", subtitle: "Tagline", tags: ["minimal", "clean"], href: "/template/my-template" }
```

**Delivery tab** — add to the delivery templates array:
```ts
{ id: "my-template", name: "My Template", subtitle: "Tagline", tags: ["dark", "editorial"] }
```

**Links tab** — add to the links templates array:
```ts
{ id: "my-template", name: "My Template", subtitle: "Tagline", tags: ["minimal"] }
```

`href` controls whether `LivePreviewThumbnail` is used (iframe) or a static cover image.

---

## 8. Wizard pickers

### Portfolio wizard (`/dashboard/portfolio/new`)

The template picker step reads from `TEMPLATES` in `src/lib/portfolio/mock.ts` and uses `TEMPLATE_URL` for thumbnails.
Add to both arrays — no other changes needed.

### Delivery wizard (`/dashboard/delivery/new`)

Currently has no template picker step. Templates are selected later in the delivery editor.

### Links wizard

No wizard exists yet (Sprint 4 backlog).

---

## 9. Editor state → public render (data flow)

```
User edits in /editor/[id]
  │
  ├─ EditorStore (Zustand + zundo)
  │    nodes, palette, typography, logo
  │
  ├─ saveState() ──→ localStorage (current)
  │                   ↓ future: tRPC → DB
  │
  └─ Public route /template/[id]/page.tsx
       loadState() ← localStorage / DB
       Render static component (no editor UI)
```

The public route and the editor canvas component can share the same **rendering logic** via a common component that accepts `nodes + palette + typography + logo` as props. The editable canvas wraps it with `<EditableNode>`; the public route renders it directly.

---

## 10. Checklist — adding a new template

### Portfolio
- [ ] `src/lib/editor/templates/[id].tsx` — nodes + sections
- [ ] `src/components/editor/canvas/[Name]Template.tsx` — editable canvas
- [ ] `src/lib/editor/templates/registry.tsx` — register with lazy Component
- [ ] `src/app/editor/[id]/page.tsx` — editor entry page
- [ ] `src/app/template/[id]/layout.tsx` — fonts + CSS vars
- [ ] `src/app/template/[id]/page.tsx` — public render
- [ ] `src/lib/portfolio/mock.ts` → `TEMPLATE_URL` — preview URL
- [ ] `src/lib/portfolio/mock.ts` → `TEMPLATES` — name in picker list
- [ ] `src/app/dashboard/templates/page.tsx` — portfolio tab entry

### Delivery
- [ ] `src/lib/delivery/data.ts` → `TEMPLATES` array + `TemplateName` union
- [ ] `src/lib/delivery/data.ts` → `TEMPLATE_STYLES` if color overrides needed
- [ ] `src/components/delivery/Builder.tsx` → `TEMPLATE_PREVIEW_URLS`
- [ ] `src/app/template/[id]/delivery/page.tsx` — public render
- [ ] `src/app/dashboard/templates/page.tsx` — delivery tab entry

### Links
- [ ] `src/lib/links/data.ts` → `LINKS_TEMPLATES` + `LinksTemplateName` union
- [ ] `src/app/template/[id]/links/page.tsx` — public render
- [ ] `src/app/dashboard/templates/page.tsx` — links tab entry

### Domain page
- [ ] `src/app/dashboard/domain/page.tsx` → `PAGE_PREVIEW_URLS` (hardcoded for now)

---

## 11. Key invariants

- **Never SSR the editable canvas component.** Always use `dynamic(..., { ssr: false })` in the registry.
- **The `initialNodes` object is the source of truth** for a template's default content. The editor store hydrates from it on first load.
- **Preview URLs must be real Next.js routes** — they are loaded in iframes. A broken URL shows a blank frame.
- **`TEMPLATE_URL` keys must exactly match the strings in the `TEMPLATES` array** in `mock.ts`. Mismatch = no thumbnail.
- **Delivery template `accent` color** is the page background, not a UI accent. Pick it to match the template's dominant bg.
- **The `Active` badge in the links Template tab is always green** — do not use template accent color there.
- **Font CSS variables** (`--font-sans`, `--font-serif`, `--font-mono`) must be set in the template's `layout.tsx` for the public route and in `EditorShell`'s CSS injection for the editor canvas.
