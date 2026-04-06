# Template Adapter Guide

How to take a FRAME portfolio template and make it editable in the website builder.

---

## Overview

The FRAME builder works by running a **forked copy** of a template inside a scaled canvas.
The fork (`EditableTemplate.tsx`) is identical to the source template **except** for the
adaptations described in this guide. The source template (`page.tsx`) is never modified —
it remains the live preview the user sees at `/templates/<name>`.

```
src/app/templates/<name>/page.tsx          ← source template (read-only)
src/components/editor/canvas/EditableTemplate.tsx  ← adapted fork for editor
```

---

## Step-by-step adaptation

### 1. Copy the source template

Copy `src/app/templates/<name>/page.tsx` verbatim into
`src/components/editor/canvas/EditableTemplate.tsx`.

Rename the default export to a named export:

```tsx
// Before
export default function MinimalBWTemplate() { ... }

// After
export function EditableTemplate({ viewport }: { viewport: Viewport }) { ... }
```

---

### 2. Replace `useBreakpoint()` with the `viewport` prop

The source template reads `window.innerWidth` via `useBreakpoint()`. Inside the
builder the template lives in a scaled container, so the real window width is
irrelevant — the editor viewport toggle drives the responsive layout instead.

```tsx
// REMOVE
import { useBreakpoint } from "...";
const { isMobile, isTablet, isDesktop } = useBreakpoint();

// ADD — derive from the prop instead
const isMobile  = viewport === "mobile";
const isTablet  = viewport === "tablet";
const isDesktop = viewport === "desktop";
```

Import the `Viewport` type from the store:

```tsx
import type { Viewport } from "~/lib/editor/types";
```

---

### 3. Fix `position: fixed` on the nav

Fixed elements escape the scaled canvas and overlap the editor chrome.
Change the nav to `position: relative`.

Also remove the hero's `paddingTop` compensation (it was only there to push
content below the fixed nav):

```tsx
// Before
<nav style={{ position: "fixed", top: 0, left: 0, right: 0, ... }}>
<section style={{ paddingTop: "72px", ... }}>

// After
<nav style={{ position: "relative", ... }}>   {/* no fixed! */}
<section style={{ paddingTop: 0, ... }}>
```

> **Why keep position: fixed for Lightbox / GalleryModal?**
> Modals use `position: fixed` intentionally — they overlay the whole editor
> to demonstrate the interaction. This is acceptable preview behaviour.

---

### 4. Connect the editor store

Import the store at the top of the file:

```tsx
import { useEditorStore } from "~/lib/editor/store";
```

At the start of `EditableTemplate`, pull in `selectNode` to deselect nodes
when the user clicks the template background:

```tsx
const { selectNode } = useEditorStore();
// On the root <div>:
<div onClick={() => selectNode(null)}>
```

---

### 5. Add editable node primitives

Copy these three small components into the file (they are the only editor-specific
code in the fork):

```tsx
function EditableNode({ id, children, style, tag: Tag = "div" }) { ... }
function EditableText({ id, style }) { ... }
function EditableImage({ id, imgStyle }) { ... }
```

`EditableNode` renders a wrapper with `data-editor-node`, selection/editing
data attributes, and click/double-click handlers that update the store.

`EditableText` renders stored HTML via `dangerouslySetInnerHTML` and
switches to an inline Tiptap editor on double-click.

`EditableImage` reads `src` and `alt` from the store node.

See `src/components/editor/canvas/EditableTemplate.tsx` for the full implementations.

---

### 6. Wrap editable elements

Replace raw JSX elements with the primitives above.

**Text example:**
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

**Image example:**
```tsx
// Before
<img src="https://picsum.photos/seed/1084/600/750?grayscale" alt="James Hollis"
  style={{ position: "absolute", inset: 0, ... }} />

// After
<EditableNode id="about-image" style={{ position: "relative" }}>
  <EditableImage id="about-image" imgStyle={{ position: "absolute", inset: 0, ... }} />
</EditableNode>
```

> **Rule:** only wrap elements that a non-technical user would want to change
> (headings, body text, key images). Leave decorative elements, stats arrays,
> press lists, and photo-grid cells as static JSX.

---

### 7. Register nodes in the store

Add a default value for every `id` you used above in
`src/lib/editor/store.ts` inside `INITIAL_NODES`:

```ts
const INITIAL_NODES: Record<string, EditorNode> = {
  "hero-heading": {
    id: "hero-heading",
    type: "heading",
    content: "James<br/><em>Hollis</em>",
  },
  "about-image": {
    id: "about-image",
    type: "image",
    src: "https://picsum.photos/seed/1084/600/750?grayscale",
    alt: "James Hollis",
  },
  // ...
};
```

Also add each node to the `EmptyState` layer list in `Sidebar.tsx` so users
can click-to-select from the panel without needing to find the element visually.

---

### 8. Load fonts in the editor layout

The template uses CSS variables like `--tpl-serif`, `--tpl-sans`, `--tpl-mono`
which are injected by `src/app/templates/<name>/layout.tsx` via `next/font`.

Load the **same** fonts with the **same** variable names in the editor layout
(`src/app/editor/<name>/layout.tsx`) so the canvas inherits them:

```tsx
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

The `.canvas-frame` class in `editor.css` also defines these as fallbacks so
the font stacks resolve correctly even before the `next/font` stylesheet loads.

---

### 9. Add the editor route

```
src/app/editor/<name>/layout.tsx   ← loads fonts + editor.css
src/app/editor/<name>/page.tsx     ← dynamically imports EditorShell
```

The `page.tsx` is always the same boilerplate:

```tsx
"use client";
import dynamic from "next/dynamic";

const EditorShell = dynamic(
  () => import("~/components/editor/core/EditorShell").then((m) => m.EditorShell),
  { ssr: false }
);

export default function EditorPage() {
  return <EditorShell />;
}
```

---

### 10. Add the Edit button in the dashboard

In `src/app/dashboard/templates/page.tsx`, set `editorHref` on the template
object and it will appear automatically on the FeaturedCard:

```ts
{
  id: "my-template",
  href: "/templates/my-template",
  editorHref: "/editor/my-template",   // ← this line
  ...
}
```

---

## Checklist

- [ ] `EditableTemplate.tsx` created (forked from `page.tsx`)
- [ ] Default export → named `EditableTemplate({ viewport })`
- [ ] `useBreakpoint()` removed, `viewport` prop used instead
- [ ] Nav changed from `position: fixed` → `position: relative`
- [ ] Hero `paddingTop` set to `0`
- [ ] All editable elements wrapped with `<EditableNode>` / `<EditableText>` / `<EditableImage>`
- [ ] Each node id registered in `INITIAL_NODES` in `store.ts`
- [ ] Each node id listed in `EmptyState` layer list in `Sidebar.tsx`
- [ ] Editor layout created, loads template fonts with correct CSS variable names
- [ ] Editor route `page.tsx` created
- [ ] `editorHref` set in dashboard templates list

---

## What can be made editable

| Element type | Node type | How to edit |
|---|---|---|
| Headings (`h1`, `h2`) | `"heading"` | Click to select, double-click for Tiptap |
| Body paragraphs | `"paragraph"` | Click to select, double-click for Tiptap |
| Nav logo / taglines | `"nav-logo"` | Click to select, double-click for Tiptap |
| Portrait / hero photos | `"image"` | Click to select, paste URL in sidebar |
| Quotes | `"paragraph"` | Click to select, double-click for Tiptap |

**Do NOT wrap** with `EditableNode`:
- Photo grid cells (they have their own click behaviour — opening the gallery)
- Stats/numbers (array-driven, edit in code)
- Press publication names (array-driven)
- Nav links (functional — change them in code)
- Form fields (functional)

---

## CSS variable conventions

| Variable | Purpose |
|---|---|
| `--tpl-serif` | Template's serif typeface |
| `--tpl-sans` | Template's sans-serif typeface |
| `--tpl-mono` | Template's monospace typeface |
| `--ed-bg` | Palette: background colour |
| `--ed-fg` | Palette: primary text colour |
| `--ed-accent` | Palette: accent / button colour |
| `--ed-muted` | Palette: secondary text colour |

The `--ed-*` variables are injected by `CanvasFrame.tsx` via inline style on the
`.canvas-frame` element and can be overridden from the Colors panel in the sidebar.

If a template uses hardcoded hex values that you want the palette to control,
replace them with the corresponding `var(--ed-*)` reference.
