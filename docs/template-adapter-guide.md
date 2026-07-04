# Template Adapter Guide

How to take a FRAME portfolio template and make it editable in the website builder.

---

## Overview

The FRAME builder works by running a **forked copy** of a template inside a **device frame** rendered in the editor canvas. The fork (`EditableTemplate.tsx`) is identical to the source template **except** for the adaptations described in this guide. The source template (`page.tsx`) is never modified — it remains the live preview at `/templates/<name>`.

```
src/app/templates/<name>/page.tsx                    ← source template (read-only)
src/components/editor/canvas/EditableTemplate.tsx    ← adapted fork for editor
```

The editor architecture:

```
EditorShell
├── TopBar          (undo/redo, viewport toggle, save, preview)
├── Sidebar         (Pages tree · Design · Settings)
└── Canvas
    └── DeviceFrame (iPhone / iPad / Browser chrome)
        └── DeviceScreen (overflow-y:auto, fixed height = "screen")
            └── EditableTemplate (the forked template)
```

---

## Step-by-step adaptation

### 1. Copy the source template

Copy `src/app/templates/<name>/page.tsx` verbatim into `src/components/editor/canvas/EditableTemplate.tsx`.

Rename the default export to a named export that accepts a `viewport` prop:

```tsx
// Before
export default function MinimalBWTemplate() { ... }

// After
export function EditableTemplate({ viewport }: { viewport: Viewport }) { ... }
```

Import the type:
```tsx
import type { Viewport } from "~/lib/editor/types";
```

---

### 2. Replace `useBreakpoint()` with the `viewport` prop

The source template reads `window.innerWidth`. Inside the editor the template lives inside a device frame container — the real window width is irrelevant. The editor's viewport toggle drives the responsive layout instead.

```tsx
// REMOVE
const { isMobile, isTablet, isDesktop } = useBreakpoint();

// ADD
const isMobile  = viewport === "mobile";
const isTablet  = viewport === "tablet";
const isDesktop = viewport === "desktop";
```

---

### 3. Fix `position: fixed` on the nav

Fixed elements escape the scaled/framed canvas. Change the nav to `position: relative`:

```tsx
// Before
<nav style={{ position: "fixed", top: 0, left: 0, right: 0, ... }}>
<section style={{ paddingTop: "72px", ... }}>   {/* compensation for fixed nav */}

// After
<nav id="section-nav" style={{ position: "relative", ... }}>
<section id="section-hero" style={{ paddingTop: 0, ... }}>
```

> **Keep `position: fixed` for Lightbox / GalleryModal.** Modals use `position: fixed` intentionally — they overlay the whole editor to demonstrate the interaction. This is acceptable preview behaviour.

---

### 4. Add section ids to every top-level block

The Pages tree in the sidebar uses these ids to:
- Scroll the device screen to the right section
- Highlight the section on the canvas (amber outline)

Assign an `id` to every top-level section element, following this naming convention:

| HTML element | Recommended id | Notes |
|---|---|---|
| `<nav>` | `section-nav` | add to both mobile and desktop renders |
| Hero `<section>` | `section-hero` | |
| Work `<section>` | `work` | kept as-is — also used by nav drawer links |
| Quote `<section>` | `section-quote` | |
| About `<section>` | `about` | also used by nav drawer links |
| Press `<section>` | `press` | also used by nav drawer links |
| Contact `<section>` | `contact` | also used by nav drawer links |
| `<footer>` | `section-footer` | |

Example:
```tsx
<nav id="section-nav" style={{ position: "relative", ... }}>
<section id="section-hero" style={{ ... }}>
<section id="section-quote" style={{ ... }}>
<footer id="section-footer" style={{ ... }}>
```

---

### 5. Connect the editor store

```tsx
import { useEditorStore } from "~/lib/editor/store";

export function EditableTemplate({ viewport }: { viewport: Viewport }) {
  const { selectNode } = useEditorStore();

  return (
    <div onClick={() => selectNode(null)}>  {/* deselect on background click */}
      ...
    </div>
  );
}
```

---

### 6. Add editable node primitives

Copy these three small components into the file (they are the only editor-specific code in the fork):

```tsx
function EditableNode({ id, children, style, tag = "div" }) { ... }
function EditableText({ id, style }) { ... }
function EditableImage({ id, imgStyle }) { ... }
```

`EditableNode` renders a wrapper with `data-editor-node`, selection/editing data attributes, and click/double-click handlers.

`EditableText` renders stored HTML and switches to inline Tiptap on double-click.

`EditableImage` reads `src` / `alt` from the store node.

---

### 7. Wrap editable elements

**Text:**
```tsx
// Before
<h1 style={{ fontFamily: "var(--tpl-serif)", ... }}>
  James<br /><em>Hollis</em>
</h1>

// After
<EditableNode id="hero-heading" tag="h1" style={{ fontFamily: "var(--tpl-serif)", ... }}>
  <EditableText id="hero-heading" />
</EditableNode>
```

**Image:**
```tsx
// Before
<img src="https://..." alt="James Hollis" style={{ position: "absolute", inset: 0, ... }} />

// After
<EditableNode id="about-image" style={{ position: "relative" }}>
  <EditableImage id="about-image" imgStyle={{ position: "absolute", inset: 0, ... }} />
</EditableNode>
```

**Rule:** only wrap elements that a designer would want to change — headings, body text, key photos. Leave decorative elements, stats arrays, press lists, photo-grid cells, and form fields as static JSX.

---

### 8. Register nodes in the store

Add a default value for every `id` used above in `src/lib/editor/store.ts` inside `INITIAL_NODES`:

```ts
const INITIAL_NODES: Record<string, EditorNode> = {
  "hero-heading": { id: "hero-heading", type: "heading", content: "James<br/><em>Hollis</em>" },
  "about-image":  { id: "about-image",  type: "image",   src: "https://...", alt: "James Hollis" },
  // ...
};
```

---

### 9. Register sections in the Sidebar Pages tree

Add each section to the `SECTIONS` array in `src/components/editor/core/Sidebar.tsx`:

```ts
const SECTIONS: SectionDef[] = [
  {
    id: "section-nav",   // must match the HTML id added in step 4
    label: "Navigation",
    icon: <NavIcon />,
    locked: true,        // true → lock/delete disabled (header/footer)
    elements: [          // editable nodes within this section
      { nodeId: "nav-logo", label: "Logo text", type: "text" },
    ],
  },
  // ...
];
```

Clicking a section in the tree:
1. Sets `selectedSection` in the store (amber highlight on canvas)
2. Scrolls the device screen to that section
3. Expands the section to show its editable elements

Clicking an element node in the tree selects it in the store (blue ring on canvas), same as clicking directly on the canvas.

---

### 10. Load fonts in the editor layout

The template uses CSS variables `--tpl-serif`, `--tpl-sans`, `--tpl-mono`. Load the **same** fonts in the editor layout with the **same** variable names:

```tsx
// src/app/editor/<name>/layout.tsx
import { Cormorant_Garamond, DM_Sans, Space_Mono } from "next/font/google";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--tpl-serif", ... });
const dmSans    = DM_Sans({           subsets: ["latin"], variable: "--tpl-sans",   ... });
const spaceMono = Space_Mono({        subsets: ["latin"], variable: "--tpl-mono",   ... });

export default function EditorLayout({ children }) {
  return (
    <div className={`editor-root ${cormorant.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      {children}
    </div>
  );
}
```

`EditorShell` also injects a `<style>` tag that overrides `--tpl-*` in real time when the user changes the typography from the Design panel:

```jsx
<style>{`
  .canvas-frame {
    --tpl-serif: ${typography.serif};
    --tpl-sans:  ${typography.sans};
    --tpl-mono:  ${typography.mono};
  }
`}</style>
```

---

### 11. Add the editor route

```
src/app/editor/<name>/layout.tsx   ← loads fonts + editor.css
src/app/editor/<name>/page.tsx     ← dynamically imports EditorShell
```

`page.tsx` is always the same boilerplate:

```tsx
"use client";
import dynamic from "next/dynamic";
const EditorShell = dynamic(
  () => import("~/components/editor/core/EditorShell").then((m) => m.EditorShell),
  { ssr: false }
);
export default function EditorPage() { return <EditorShell />; }
```

---

### 12. Add the Edit button in the dashboard

In `src/app/dashboard/templates/page.tsx`, add `editorHref` to the template object:

```ts
{ id: "my-template", href: "/templates/my-template", editorHref: "/editor/my-template", ... }
```

---

## Checklist

- [ ] `EditableTemplate.tsx` created (forked from `page.tsx`)
- [ ] Export renamed to `EditableTemplate({ viewport })`
- [ ] `useBreakpoint()` removed; `viewport` prop used instead
- [ ] Nav changed from `position: fixed` → `position: relative`
- [ ] Hero `paddingTop` set to `0`
- [ ] All top-level sections have unique `id` attributes (step 4 convention)
- [ ] `<nav>` in both mobile and desktop branches has `id="section-nav"`
- [ ] All editable elements wrapped with `<EditableNode>` / `<EditableText>` / `<EditableImage>`
- [ ] Every node id registered in `INITIAL_NODES` in `store.ts`
- [ ] Every section registered in `SECTIONS` in `Sidebar.tsx`
- [ ] Editor layout loads template fonts with matching CSS variable names
- [ ] Editor route `page.tsx` created
- [ ] `editorHref` set in dashboard templates list

---

## Device frames & constrained scroll

The canvas renders one of three device frames based on the viewport toggle:

| Viewport | Frame | Content size | Device label |
|---|---|---|---|
| `desktop` | Browser chrome (traffic lights, URL bar) | full width × 660px | Desktop · 1280px |
| `tablet` | iPad Air style (dark bezels, camera dot, home bar) | 768px × 756px | iPad Air · 820×1180 |
| `mobile` | iPhone Dynamic Island style (rounded, pill notch) | 375px × 660px | iPhone 15 Pro · 393×852 |

The content area inside each frame has `overflow-y: auto` — the template scrolls **inside** the device, not the editor canvas. The canvas itself only scrolls if the device frame is taller than the available editor area (rare on normal monitors).

When adapting a new template, no changes to Canvas.tsx are needed — the device frame always renders `<EditableTemplate viewport={viewport} />`.

---

## Sidebar — Pages tree

The Pages tab displays a one-level-deep structure: one page (Home) containing sections. This matches the single-page nature of portfolio templates. For future multi-page support, each page would be a sibling of Home.

**Section row interactions:**
- **Click** → scroll-to + amber highlight on canvas + expand elements
- **Three-dot menu → Scroll to** → scroll-to without selecting
- **Three-dot menu → Rename / Duplicate / Delete** → disabled in template mode (template integrity constraint)

**Element row interactions:**
- **Click** → select element (blue ring on canvas) + scroll-to parent section

**Hover** in the sidebar → amber dashed outline on the corresponding canvas section (bidirectional awareness).

---

## CSS variable conventions

| Variable | Role |
|---|---|
| `--tpl-serif` | Template serif typeface (headings) |
| `--tpl-sans`  | Template sans-serif typeface (body) |
| `--tpl-mono`  | Template monospace typeface (labels, captions) |
| `--ed-bg`     | Palette background |
| `--ed-fg`     | Palette primary text |
| `--ed-accent` | Palette accent / button |
| `--ed-muted`  | Palette secondary text |

All injected on `.canvas-frame` by `EditorShell`'s `<style>` tag. Override hardcoded hex values in the fork by replacing them with `var(--ed-*)` or `var(--tpl-*)` references if you want them to be palette/typography-controlled.

---

## What NOT to wrap with EditableNode

| Element | Why |
|---|---|
| Photo grid cells | Have their own click (opens gallery) |
| Stats / numbers | Array-driven; edit in code |
| Press publications | Array-driven |
| Nav links | Functional; edit in code |
| Form fields | Functional |
| Decorative lines / dividers | Not user-content |

---

## Pitfalls & required behaviours — lessons from Halcyon

The first Halcyon pass shipped with real gaps. Treat the items below as **hard
requirements** for every future adaptation (and as the fix list for Halcyon
itself — see `docs/halcyon-followups.md`). Minimal BW is the reference: when in
doubt, do what it does.

### 1. The shared primitives MUST respect `readOnly` (infra gap)

`src/components/editor/canvas/primitives.tsx` (`EditableNode` / `EditableText`,
used by Atelier + Halcyon) currently **always** emit editor affordances:
`data-editor-node`, click-to-select, double-click-to-edit. On the public site
and the **preview tab** (`readOnly === true`) this makes the page behave like the
builder — clicking text opens the Tiptap editor on a live page.

Minimal BW's *inline* `EditableNode`/`EditableText` short-circuit to a plain
element when `readOnly`. The shared primitives must do the same:

```tsx
// EditableNode
const readOnly = useEditorStore((s) => s.readOnly);
if (readOnly) return <El className={className} style={{ ...style, ...overrides }}>{children}</El>;

// EditableText — never mount Tiptap when readOnly
if (editing && !readOnly) return <TiptapEditor … />;
```

⚠️ This fix also corrects Atelier's published/preview output, not just Halcyon.

### 2. Editable images must be real `<img>` (EditableImage), never CSS `background:url()`

Cover heroes and portraits authored as `background:url('…')` inside a `<style>`
block (Halcyon's `.hp-cover-img`, `.hp-about-portrait`) **cannot be edited** —
they're not nodes. Render them as `EditableImage` (an absolutely-positioned
`<img>` with `object-fit:cover`) so they appear in the Pages tree and the image
inspector and can be swapped/cropped. Register an `image` node for each.

### 3. Galleries must read the user's photos (`galleryPhotos`), not demo arrays

Halcyon renders every grid from its bundled demo data (`HL_PHOTOS` /
`HL_PORTFOLIO`), so the "all photos" modal shows placeholders even after the user
uploads. Source photo grids from the store like Minimal BW's `useWorks()`:

```tsx
const galleryPhotos = useEditorStore((s) => s.galleryPhotos);
const works = galleryPhotos.length ? galleryPhotos.map(…) : DEMO; // demo only as fallback
```

### 4. Wrap ALL user-facing buttons/links, using the `Activatable` pattern

Be exhaustive: nav links, CTAs, "view all", section labels, the contact button,
footer links — every label a designer would change. Use the **Activatable
pattern** (Minimal BW): render a real `<button>` only on the live site
(`readOnly`); in the editor render a plain styled element. Editable text inside a
real `<button>` is the cause of the Space-cancels-editing bug.

### 5. Contact section must consume `ContactSettings` from the store

`store.contact` is `{ mode: "inbox" | "whatsapp", whatsapp, waTemplate }`. The
contact section must honour the user's choice instead of hardcoding tabs/numbers:

- `mode === "inbox"`  → render the form that posts to the in-app inbox.
- `mode === "whatsapp"` → render the WhatsApp CTA built from `contact.whatsapp`
  and `contact.waTemplate` (placeholders `{name} {email} {message}`).

Wire the choice into Settings (`setContact`) the same way Minimal BW does.

### 6. Don't inject global/un-scoped `<style>` from the template

A template that ships a big class-based `<style>` block leaks rules into the
editor chrome and is a prime suspect for **"the sidebar/editor panels don't
open"**. Either scope every selector under the template root (`.hl-scope …`) —
not just the reset — or convert to inline styles like Minimal BW / Atelier.
Always reproduce the editor with the new template open and confirm the Pages /
Design / Settings panels still work.

### 7. Drive responsive layout from the `viewport` prop, not CSS media queries

CSS media queries respond to the real window, not the editor's device frame, so
the viewport toggle won't switch the layout. Derive `isMobile/isTablet/isDesktop`
from the `viewport` prop and branch with inline styles (see Minimal BW).

### 8. Verify preview/published parity before shipping

Open the **preview tab** and confirm: no selection outlines, default cursor,
clicking text does *not* open an editor, and links/CTAs perform their real
action. Open the **editor** and confirm the sidebar panels open and every node
appears in the Pages tree.

### Updated pre-ship checklist (in addition to the one above)

- [ ] Shared primitives gate on `readOnly` (no affordances on public/preview)
- [ ] Every hero/portrait image is an `EditableImage` node (no CSS `background:url`)
- [ ] Photo grids read `galleryPhotos`, demo data only as fallback
- [ ] Every user-facing button/link is editable via the `Activatable` pattern
- [ ] Contact section reads `store.contact` (inbox vs WhatsApp)
- [ ] Template injects no un-scoped global CSS; editor panels still open
- [ ] Responsive driven by the `viewport` prop, not media queries
- [ ] Preview tab shows zero editor affordances; actions work
- [ ] `build<Name>Nodes` in brandData.ts with Spanish demo copy + identity overrides (pitfall 12)
- [ ] Wired in BOTH OnboardingFlow ternaries (previewNodes + finish)
- [ ] Registered in `TEMPLATE_CATALOG` + `onb.template.*` strings in en **and** es

### 9. Don't let template element selectors hit Tiptap's `<p>`

Tiptap wraps inline content in a `<p>` while editing. A template selector like
`.section p { font-size: 16px }` (a body-copy rule) will match that `<p>` and
shrink a heading's text mid-edit — and the `<p>` also persists in saved content,
shrinking the static heading too. Two guards, both already in place for the
shared primitives:
- `EditableText` unwraps a single `<p>` before saving (no `<p>` in stored HTML).
- `editor.css` raises the inherit rule to `div.tiptap-inline p` (specificity
  0,1,2) so it outranks a `.scope p` (0,1,1) during editing.
Avoid authoring template text styles as broad element selectors when possible.

### 10. Editing must work by tap, not just double-click

`dblclick` is unreliable on touch. The shared `EditableNode` enters edit mode on
a **second click of an already-selected text node** (tap to select, tap to edit),
not only on double-click — keep that path when adapting.

### 11. Floating popovers (e.g. colour picker) must escape panel overflow

The Design panel scrolls/clips, so an absolutely-positioned popover inside it is
unreachable on the phone editor. Render popovers in a `createPortal` to
`document.body` with `position: fixed`, positioned from the trigger's rect and
clamped to the viewport (see `ColorSwatch`).

### 12. Every template MUST ship its Spanish version + onboarding adaptation

A template is not done when it renders — it must be creatable from onboarding
with localized demo copy. **Required for every new template, no exceptions:**

1. **Locale-aware node builder** in `src/components/onboarding/brandData.ts`:
   `build<Name>Nodes(locale, identity, contact?)` following the existing ones
   (`buildMinimalNodes` … `buildSerenataNodes`). It must provide:
   - **Spanish demo copy** (`locale === "es"`) for every user-facing default
     text node — nav links/CTAs, hero, section labels, service/moment items,
     contact headings and detail labels, footer. The template then *reads in
     Spanish* for Spanish-locale users before they type anything.
   - **Identity overrides**: name → brand/logo + footer © nodes; bio → the
     hero/about copy nodes; location and the contact email/phone → the contact
     detail values.
2. **Wire it in `OnboardingFlow.tsx`** in BOTH ternaries: `previewNodes` (live
   preview) and the `nodes` built inside `finish()` (what gets saved).
3. **Register the template in `src/lib/templates/catalog.ts`**
   (`TEMPLATE_CATALOG`) — the canonical list behind the onboarding template
   step and the portfolio wizard — plus the `onb.template.<key>Name/Desc`
   strings in `messages/en.json` **and** `messages/es.json`.
