# Serenata — template design & integration notes

The wedding photographer template. Signature 3D element: **the wedding
album** — a physical album rendered in pure CSS 3D that opens and turns its
pages with a real `rotateY` page-flip. Linen cover with the couple's names, a
dedication page inside the cover, photographs mounted on ivory paper with
vintage photo corners, a ribbon bookmark, folio numbers. Photos lie **flat
and frontal** on every spread (the Vernissage lesson: never show photographs
edge-on); the 3D lives in the page turn. Built **builder-first**: one
component serves the editor canvas, the `/templates/serenata` demo and the
published site.

---

## Concept & design rationale

Wedding photographers sell one object above all: the album. Serenata makes
the portfolio *be* that object — hero like a film still, then the album on a
table, then the day in three movements, kind words, the photographer, and
"check my date". Romantic but restrained: no scripts, no gold foil clichés —
ivory paper, rosewood linen, typewriter captions (love letters).

| Token | Value | Why |
|---|---|---|
| Background | `#FBF7F2` | Ivory paper |
| Text | `#40342F` | Warm espresso ink |
| Accent | `#B07C70` | Rosewood / dusty rose (cover linen, corners, numerals) |
| Muted | `#A5988E` | Faded sepia |

**Typography** (bundled): **Cormorant Garamond** (romantic serif, italics do
the heavy lifting), **Raleway** (airy sans), **Courier Prime** (typewriter —
dates, labels, HUD; the love-letter voice).

Signature moves: lowercase-roman section numerals (`i. ii. iii.`) in serif
italic; the **chapel-arch portrait** in the about section; champagne text on
the album cover; `~ hasta el último baile ~` in the footer.

## The 3D album — how it works (no WebGL, no new deps)

A book of **sheets** hinged on the spine. Each sheet is a `div` on the right
half of the book with `transform-origin: left center`; unflipped sheets sit
at `rotateY(0)`, flipped ones at `rotateY(-180deg)` (1.05 s ease). Each sheet
has a **front face** (recto page) and a **back face** (`rotateY(180deg)` +
`backface-visibility: hidden`), so once turned, its back reads normally on
the left side — net rotation 0, which is why the **dedication page is safely
editable** in place.

- Sheet 0 = the cover: linen gradient front (editable names + date), paper
  dedication back (editable).
- Sheet *k* ≥ 1: front = photo `2(k−1)`, back = photo `2(k−1)+1`; an odd
  count ends on a "fin." colophon face.
- `flipped ∈ [0..S]` drives everything. Z-order: `i < flipped ? i : S − i`,
  with the animating sheet z-boosted for ~1.1 s so mid-flip stacking is
  correct.
- The book recentres itself: cover centred when closed, spine centred when
  open, back cover centred at the end (`translateX(±PW/2)`).
- Inputs: tap a page (right → forward, left → back), swipe
  (`touchAction: pan-y` keeps page scroll free), arrows + progress + counter
  in the HUD, wheel **only when `readOnly`**. An expand button in the HUD
  opens the current spread in the lightbox (live site only).
- Geometry (page size, stage height) scales with the `viewport` prop — no
  `vh`, so the editor device toggle works.
- Editor auto-navigation: selecting the cover nodes closes the album;
  selecting the dedication opens it to page one.

## Layout system

Serenata reuses the shared `"corridor"` layout key as its 3D showcase slot
(labels were made generic: **"3D"** — "the template's signature 3D
showcase"), with `layouts: ["corridor", "uniform", "masonry"]` so the Design
> Grid panel can switch to flat grids. The album shows the first 16 photos
(8 spreads); flat layouts + Load more cover the rest.

## File map

| File | Role |
|---|---|
| `src/components/editor/canvas/SerenataTemplate.tsx` | Template + 3D album |
| `src/lib/editor/templates/serenata.tsx` | Node defaults + sections |
| `src/lib/editor/templates/registry.tsx` | Registration + design defaults |
| `src/app/editor/serenata/{layout,page}.tsx` | Editor route |
| `src/app/templates/serenata/page.tsx` | Live demo (PortfolioSiteRender) |
| Dashboard card, onboarding option, Sidebar `BRAND_NODES`, fonts | Wiring |

## Node map (prefix `ser-`)

- **Nav**: `ser-nav-brand`, `ser-nav-item-1..3`, `ser-nav-cta`
- **Hero**: `ser-hero-image` (image), `ser-hero-eyebrow/title/sub/cta-1/cta-2`
- **Album**: `ser-album-label`, `ser-album-note`, `ser-album-title` (cover),
  `ser-album-date` (cover), `ser-album-dedication` (inside cover)
- **The day**: `ser-mom-label`, `ser-mom-{1..3}-title/desc`
- **Kind words**: `ser-quote-label/text/author`
- **Photographer**: `ser-about-label`, `ser-about-image` (image),
  `ser-about-heading/body`, `ser-stat-{1..3}-value/label`
- **Your date**: `ser-contact-label/heading/body`, `ser-contact-d{1..3}-label/value`
- **Footer**: `ser-footer-brand`, `ser-footer-copy`

Folio numbers and the colophon are array-driven/decorative — not editable
nodes, per the adapter guide.

## Compliance (pitfalls 1–11)

Zero injected CSS (all inline on `--ed-*`/`--tpl-*`); responsive from the
`viewport` prop; album/grids read `store.galleryPhotos` (demo seeds
fallback); hero + portrait are `EditableImage` nodes; every button/label
editable via the `Clickable` pattern; contact follows `store.contact`
(shared `fillWaTemplate`), with a wedding-date field folded into the
message; lightbox + wheel-capture gated on `readOnly`.

## How to verify (manual)

1. `/templates/serenata` → tap the cover: it opens with a 3D turn; pages
   flip forward/back by tap, swipe, wheel and arrows; the dedication reads
   on the left after opening; photo corners + folio numbers show; the HUD
   expand opens the lightbox; an odd photo count ends on "fin.".
2. `/editor/serenata` → the album flips in the canvas; selecting cover /
   dedication nodes in the Pages tree turns the album to them; cover names
   and dedication edit in place; device toggle rescales the book; Grid panel
   switches album ↔ flat grids.
3. Upload photos in a portfolio → the album pages show the user's photos.
4. Contact honours the inbox/WhatsApp setting; the date field lands in the
   message.

## Known limits

- 16 photos in the album (8 spreads) — a curated edit, like a real album.
- The page-flip is a flat rotation (no paper-bend simulation); spine shadows
  sell the depth. Good trade for zero dependencies.
