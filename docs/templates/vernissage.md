# Vernissage — template design & integration notes

The platform's first **3D template**: a white-cube exhibition rendered as a
**3D coverflow showcase**. The active photograph takes the wall **facing the
visitor** — framed, matted, with a museum label — while neighbouring works
recede at an angle to either side. Built **builder-first** like Meridian: one
component serves the editor canvas, the `/templates/vernissage` demo and the
published site.

> **History**: v1 was a walkable corridor with works hung at ±90° on the side
> walls. It was replaced — edge-on photos can't be appreciated. The coverflow
> keeps the 3D room feeling while every photo is viewed head-on. The layout
> key remains `"corridor"` for saved-design compatibility; only the labels
> changed ("3D slider" / "Slider 3D").

---

## Concept & design rationale

The "white cube" is the canonical professional gallery format: white walls,
framed works at eye level, small label plates, a red dot for sold pieces.
Vernissage (the opening night of an exhibition) translates that into a
portfolio: the site *is* an exhibition — poster (hero), showcase (3D),
artist, private-view contact. The 3D interaction is the familiar
**coverflow**: click a side piece, swipe, wheel or use the arrows and the
next work swings to the front. The final "slide" is a closing card with a
commission CTA.

| Token | Value | Why |
|---|---|---|
| Background | `#F6F5F1` | White-cube wall |
| Text | `#131518` | Ink |
| Accent | `#A63A22` | The gallery "red dot" (labels, HUD, wayfinding) |
| Muted | `#90928F` | Concrete grey |

**Typography** (bundled): **Fraunces** (exhibition-title serif, italics),
**Space Grotesk** (signage sans), **Space Mono** (label plates / HUD).

## The 3D showcase — how it works (no WebGL, no new deps)

Pure CSS 3D: a stage `div` with `perspective` contains slides positioned
absolutely at the center. Each slide's transform derives from its offset
`d = i - active`:

- `d === 0` → frontal: `translateX(0) translateZ(0) rotateY(0)`, strongest
  shadow, museum label fades in.
- `|d| ≥ 1` → recedes: `translateX(d · spread) translateZ(-170 − |d|·80)
  rotateY(∓42°)`, opacity falls off; hidden beyond `|d| > 3`.

Changing `active` animates every slide (0.6 s spring-ish cubic-bezier).

Inputs:
- **Arrows** + progress bar + `04/12` counter in a HUD strip (work in the
  editor too).
- **Swipe/drag** horizontally (pointer events; `touchAction: pan-y` keeps
  vertical page scroll free; the stage nudges with the finger, then snaps).
- **Wheel** — attached `passive: false` **only when `readOnly`**, so the
  editor canvas scroll is never hijacked.
- **Click** a side piece → brings it to the front; click the frontal piece →
  lightbox (live site only).

Stage geometry (height, plate size, spread) scales with the `viewport` prop —
no `vh` units, so the editor's device toggle works inside the device frame.

**Editing inside 3D**: side slides are images only. The closing card is
frontal when active, so its title/CTA edit normally; selecting either node in
the Pages tree auto-navigates the showcase to it.

## Layout system

`"corridor"` in `GridSettings.layout` (labels: "3D slider" / "Slider 3D") is
Vernissage's default; `layouts: ["corridor", "uniform", "masonry"]` lets the
Design > Grid panel switch to flat grids (columns/gap/fit/load-more).

## File map

| File | Role |
|---|---|
| `src/components/editor/canvas/VernissageTemplate.tsx` | Template + 3D showcase |
| `src/lib/editor/templates/vernissage.tsx` | Node defaults + sections |
| `src/lib/editor/templates/registry.tsx` | Registration + design defaults |
| `src/app/editor/vernissage/{layout,page}.tsx` | Editor route |
| `src/app/templates/vernissage/page.tsx` | Live demo (PortfolioSiteRender) |
| `src/lib/editor/types.ts` + `GridPanel.tsx` + i18n | `"corridor"` layout |
| Dashboard card, onboarding option, Sidebar `BRAND_NODES`, fonts | Wiring |

## Node map (prefix `vrn-`)

- **Nav**: `vrn-nav-brand`, `vrn-nav-item-1..3`, `vrn-nav-cta`
- **Poster**: `vrn-hero-eyebrow/title/dates/sub/cta`
- **3D Gallery**: `vrn-gallery-label`, `vrn-gallery-note` (wall text, flat),
  `vrn-endwall-title`, `vrn-endwall-cta` (the closing card)
- **Artist**: `vrn-about-label`, `vrn-about-image` (image),
  `vrn-about-heading/body`, `vrn-stat-{1..3}-value/label`
- **Contact**: `vrn-contact-label/heading/body`, `vrn-contact-d{1..3}-label/value`
- **Footer**: `vrn-footer-brand`, `vrn-footer-copy`

Museum labels on the slides are array-driven (photo title or "Untitled") —
not editable nodes, per the adapter guide.

## Compliance (pitfalls 1–11)

Zero injected CSS (all inline on `--ed-*`/`--tpl-*`); responsive from the
`viewport` prop; showcase/grids read `store.galleryPhotos` (demo seeds
fallback); portrait is an `EditableImage`; every button/label editable via
the `Clickable` pattern; contact follows `store.contact` (shared
`fillWaTemplate`); lightbox + wheel-capture gated on `readOnly`.

## How to verify (manual)

1. `/templates/vernissage` → the frontal photo is fully face-on and large;
   arrows/swipe/wheel rotate the next piece to the front; clicking a side
   piece brings it forward; clicking the frontal one opens the lightbox; the
   last slide is the closing card and its CTA scrolls to contact.
2. `/editor/vernissage` → arrows/swipe work; selecting "Closing" nodes in the
   Pages tree navigates to the card; texts edit by tap; the device toggle
   reshapes the stage; Grid panel switches 3D slider ↔ flat grids.
3. Upload photos in a portfolio → the showcase hangs the user's photos.
4. Contact honours the inbox/WhatsApp setting.

## Known limits

- The showcase shows the first 12 photos (a curated hang); flat layouts +
  Load more cover the rest.
- Side pieces are intentionally dimmed/tilted context — every photo is fully
  appreciable when frontal.
