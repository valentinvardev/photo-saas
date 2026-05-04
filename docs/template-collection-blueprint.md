# Template Collection Blueprint

A **collection** is a coherent set of three pages that share one visual
identity:

1. **Portfolio** — the photographer's main public site
2. **Links** — a centered single-page hub of CTAs (Linktree-style)
3. **Delivery** — a password-gated client gallery

Brooklyn is the reference implementation. This document captures the
contract every collection must honour so new ones (Petal, Atelier, etc.)
can be built mechanically.

---

## 1. Design tokens

Every collection defines exactly these tokens at the top of its files.
Brooklyn's values are shown for reference.

### 1.1 Colors

| Token   | Brooklyn  | Purpose                                              |
| ------- | --------- | ---------------------------------------------------- |
| `RED`   | `#E8382C` | Primary accent — CTAs, marquees, status indicators   |
| `BLACK` | `#0D0D0D` | Page background                                      |
| `DARK`  | `#161616` | Raised surface — cards, modals, input backgrounds    |
| `STONE` | `#F0EFE9` | Foreground text / iconography                        |
| `GRAY`  | `#7A7A7A` | Secondary text — meta, captions                      |
| `DIM`   | `#2A2A2A` | Borders, dividers, disabled states                   |

A new collection may rename these but must cover the same six **roles**:
*accent · bg · raised · fg · muted · line*. Templates render correctly
because they reference roles, never literal hex.

### 1.2 Typography

Three font families, declared once and aliased through CSS variables
loaded in the layout file.

| Variable          | Brooklyn               | Use                                                    |
| ----------------- | ---------------------- | ------------------------------------------------------ |
| `--bk-serif`      | DM Serif Display       | Display headings (italic for editorial weight)         |
| `--bk-sans`       | Space Grotesk          | Body, UI chrome, navigation                            |
| `--bk-mono`       | Space Mono             | Labels, eyebrows, meta — uppercase + tracked           |

Convention: prefix variables with the collection slug (`--bk-*`,
`--pt-*`, `--at-*`) so multiple collections can coexist in the same
build.

Within page files these are aliased to local consts:

```ts
const SERIF = "var(--bk-serif), 'DM Serif Display', Georgia, serif";
const SANS  = "var(--bk-sans), 'Space Grotesk', system-ui, sans-serif";
const MONO  = "var(--bk-mono), 'Space Mono', monospace";
```

### 1.3 Motion

Shared easings make transitions feel like one product:

```ts
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;  // dramatic slide
const REVEAL_EASE  = [0.22, 1, 0.36, 1] as const;  // photo / card stagger
```

---

## 2. Portfolio page anatomy

File: `src/app/template/{slug}/page.tsx`

Structure (top to bottom):

1. **Hamburger button** — fixed top-left, opens slide-in nav
2. **Cover slide** — full-screen feature photo, brand wordmark, scroll
   hint
3. **Work slide** — auto-glide horizontal carousel of projects, edge
   hover speeds it up, click opens project detail
4. **Project detail** — full-screen takeover with image, title, year,
   tags, related images
5. **Gallery overlay** — VSCO-style masonry of all photos across all
   projects, opens from the "View all" CTA
6. **About slide** — split with portrait + bio + stats
7. **Contact slide** — minimal form + social links
8. **Lightbox** — overlay viewer with prev/next + zoom

**Required variables** (passed in or read from a content prop):

```ts
{
  brand:   { name: string; mark?: string; tagline?: string }
  about:   { portrait: string; bio: string; stats: { label, value }[] }
  projects: Array<{ id, title, year, tags[], cover, photos[] }>
  social:  { instagram?, x?, behance?, email? }
}
```

When a portfolio uses our content tree (see §5), `projects` is derived
from the **Category** level (each category → one project page) and
photos come from the cat's folders + directPhotoIds.

---

## 3. Delivery page anatomy

File: `src/app/template/{slug}/delivery/page.tsx`

Structure:

1. **Red top bar** — 3px accent stripe across the top
2. **Password gate** — centered card with the photographer's mark, event
   title in serif italic, date · count line in mono, password input,
   primary CTA. Shake animation on wrong password.
3. **Curtain transition** — a panel of the accent color wipes left → right
   over 1.1s. At ~midpoint the gate is swapped for the gallery; the
   curtain finishes leaving while photos cascade in. Variables:

   ```ts
   const CURTAIN_DURATION = 1.1;          // seconds
   const CURTAIN_EASE     = [0.76, 0, 0.24, 1];
   ```

4. **Hero** — 16:9 cover photo (max 70dvh), photographer mark top-left,
   title block bottom-left (event name in serif italic, date · location
   · count in mono).
5. **CTA strip** — welcome copy + primary "Download all" button.
6. **Sticky toolbar** — filter pills (All · Favorites with count),
   Select-all, desktop-only inline Download. Hides shadow until scrolled
   past the hero.
7. **Sectioned chapters** — photos grouped into named chapters
   (Ceremony / Portraits / Reception). Each chapter has:

   - Chapter number eyebrow (`Ch 01` in mono red)
   - Title in serif italic
   - Photo count in mono
   - Italic note (1-line description)
   - Responsive grid (2 cols mobile, ~180px tablet, ~220px desktop)

8. **Footer** — photographer wordmark + delivery date + nav links
9. **Mobile selection floater** — fixed-bottom card showing
   `N selected · Clear · Download`. Uses `safe-area-inset-bottom`.
10. **Lightbox** — same chrome as portfolio's, plus:
    - Touch swipe (when zoom = 1) to navigate
    - `F` keyboard shortcut to favorite
    - Mobile bottom navigator (Prev/Next + swipe hint)
    - Section name shown in the counter (`042 / 124 · ceremony`)

**Required variables** (`DeliveryPage` shape from
`src/lib/delivery/data.ts`):

```ts
{
  client, title, eventDate, eventLocation, photographer
  password, expiryDays
  photoSeeds[], coverSeed
  sections: Array<{ id, label, note, photos[] }>
  template: TemplateName              // applies a TEMPLATE_STYLES preset
  layout: "grid" | "masonry"
  branding: { logoMode, logoText, logoUrl, customColors, ... }
}
```

A delivery page can either use a template's stock palette
(`TEMPLATE_STYLES[template]`) or override individual colors via the
branding fields.

---

## 4. Links page anatomy

File: `src/app/template/{slug}/links/page.tsx`

Simpler than the others — single-screen, no scroll.

1. Red 3px top bar
2. Marquee strip (animated CSS keyframe) with the studio name
3. Centered avatar (border 2px in DIM)
4. Brand name in serif italic
5. Eyebrow in mono red ("Photographer")
6. One-line bio in sans gray
7. Stack of buttons:
   - One **accent** button (the primary CTA — "Book a session")
   - The rest **dark** with subtle border + hover slide
   - Each shows label + sub-label + arrow
   - On hover: translateX(4px), border lights up
8. Stats row (Years / Sessions / Based)
9. "Built with FRAME" footer (RED accent on the wordmark)

**Required variables**:

```ts
{
  brand:   { name, tagline, avatarSrc }
  links:   Array<{ label, sub, href, accent? }>
  stats:   Array<{ value, label }>
  social:  { ... }
}
```

---

## 5. Portfolio content data model

The same content tree feeds the **portfolio** page (and is editable from
the dashboard). It lives in `src/lib/portfolio/data.ts` + `store.ts`.

### 5.1 Hierarchy

Three levels, all optional except a portfolio must have at least one
photo somewhere:

```
PortfolioContent
├── categoryIds: ordered string[]
└── categories: Record<id, Category>
     ├── name, slug, description?
     ├── coverPhotoId? — chosen by the user, never inferred
     ├── folderIds:      ordered string[]
     ├── directPhotoIds: ordered string[]   // photos not inside a folder
     └── visibility: "public" | "draft" | "hidden"

Folder
├── id, title, description?
├── coverPhotoId?
├── photoIds: ordered string[]
└── visibility

Photo
├── id, src
├── title?, caption?, date?
├── tags?: string[]                          // orthogonal to the tree
└── visibility
```

All collections normalized into `Record<id, T>` so reorder/edit/delete
are O(1) and components can subscribe to a single node without
re-rendering the tree.

### 5.2 Visibility

Three states (`"public" | "draft" | "hidden"`) but the portfolio
management UI exposes a binary on/off toggle: ON → `public`, OFF →
`hidden`. `draft` is reserved for future approval/scheduling workflows.

### 5.3 Templates adapt to content shape

A template should declare what it renders, then degrade gracefully:

| Content shape                          | Sensible render                         |
| -------------------------------------- | --------------------------------------- |
| 1 category, no folders                 | Flat masonry, no nav                    |
| 1 category, several folders            | Index of projects on home, page each    |
| 2-5 categories                         | Pill / tab nav, mosaic per category     |
| 6+ categories                          | Dropdown or sidebar                     |
| Just photos (no categories at all)     | Single masonry grid                     |

Brooklyn's auto-glide carousel maps each *category* to a slide; folders
inside become sub-projects you can drill into. Petal renders categories
as pastel section bands. The same data drives both — only the renderer
differs.

### 5.4 Cover-photo precedence

When picking the hero / nav image for a node:

1. The user-set `coverPhotoId`
2. The first **public** photo in the node (folder.photoIds or
   category.directPhotoIds, then descend into folders)
3. The first photo regardless of visibility (last resort)

---

## 6. Building a new collection — checklist

Use Brooklyn as the source for paste-and-replace. Do all the following:

### 6.1 Tokens
- [ ] Pick six color values (accent / bg / raised / fg / muted / line)
- [ ] Pick three font families (display serif / sans / mono); add
      Google Fonts imports to the collection's `layout.tsx` and expose
      them as CSS variables
- [ ] Decide motion easings (or keep the standard ones)

### 6.2 Routes
- [ ] `src/app/template/{slug}/page.tsx`        — portfolio
- [ ] `src/app/template/{slug}/links/page.tsx`  — links
- [ ] `src/app/template/{slug}/delivery/page.tsx` — delivery
- [ ] `src/app/template/{slug}/layout.tsx`      — font CSS variables
      (no `overflow:hidden` on the layout — only on the portfolio page
      itself, otherwise links/delivery can't scroll)

### 6.3 Editor adaptation (optional but recommended)
- [ ] `src/components/editor/canvas/{Slug}Template.tsx` — wrap nodes
      with `EditableNode` / `EditableText` / `EditableImage` primitives
      so the in-app editor can edit the page

### 6.4 Templates page integration
- [ ] Add an entry to `PORTFOLIO_TEMPLATES` in
      `src/app/dashboard/templates/page.tsx`
- [ ] Add a row to `LINKS_TEMPLATES` and `DELIVERY_TEMPLATES`
- [ ] Add a `TemplateCollection` to `COLLECTIONS` listing all three
      pages
- [ ] Add the template name + style entry in
      `src/lib/delivery/data.ts` `TEMPLATES` and `TEMPLATE_STYLES`

### 6.5 Quality bar
- [ ] All three pages render at 320px / 768px / 1280px (mobile, tablet,
      desktop) without layout breakage
- [ ] No hardcoded colors — only tokens
- [ ] Keyboard navigation works (Esc closes modals, Arrow keys in
      lightbox, F to favorite in delivery)
- [ ] Touch swipe in delivery lightbox
- [ ] `prefers-reduced-motion` respected for the curtain transition
      (skip the 1.1s wipe, fade instead)

---

## 7. Reference: file map

```
src/app/template/{slug}/
├── layout.tsx          fonts + base bg
├── page.tsx            portfolio
├── links/
│   ├── layout.tsx
│   └── page.tsx
└── delivery/
    ├── layout.tsx
    └── page.tsx

src/lib/
├── portfolio/
│   ├── data.ts         types + seed content
│   ├── store.ts        Zustand store with CRUD + reorder
│   └── mock.ts         mock portfolios for the dashboard
└── delivery/
    ├── data.ts         TemplateName, TEMPLATES, TEMPLATE_STYLES
    └── store.ts        persisted gallery list

src/components/portfolio/
├── ContentTree.tsx     category → folder → photo manager
└── PhotoPickerModal.tsx
```

---

## 8. What we punt on for now

- Drag-to-reorder **categories** and **folders** (the photo grid does;
  the higher levels still rely on the order you create them in)
- Tags (the field exists in the data model, no UI yet)
- `prefers-reduced-motion` for the curtain (skip animations entirely)
- Real "smart template adaptation" — for now each template makes its
  own assumptions about content shape; degrading gracefully when the
  shape doesn't match is on the renderer
