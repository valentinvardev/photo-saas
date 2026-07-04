# Vernissage — template design & integration notes

The platform's first **3D template**: the **opening night** of an exhibition
rendered as a **3D coverflow showcase** in a night gallery. Ink-dark walls, a
cone of light on the frontal work, walnut frames with a brass fillet,
engraved brass plaques and the gallery's crimson "sold" dot. The active
photograph takes the spotlit wall **facing the visitor** while neighbouring
works recede into the dark to either side. Built **builder-first** like
Meridian: one component serves the editor canvas, the
`/templates/vernissage` demo and the published site.

> **History**: v1 was a walkable corridor with works hung at ±90° on the side
> walls. It was replaced — edge-on photos can't be appreciated. The coverflow
> keeps the 3D room feeling while every photo is viewed head-on. The layout
> key remains `"corridor"` for saved-design compatibility; only the labels
> changed ("3D slider" / "Slider 3D").
> **v3 (2026-07)**: restyled from a daylight white cube to the night gallery
> — the light palette read too close to Minimal BW in catalog thumbnails.
> The palette flipped dark (ink/brass), frames became walnut+brass physical
> constants, and the spotlight cone + floor light pool were added. Node ids,
> sections and layout keys are unchanged.

---

## Concept & design rationale

A vernissage is the **opening night** of an exhibition: the room is dim, the
works are lit, the plaques are brass and a crimson dot means sold. The site
*is* that evening — poster (hero, under a soft spot), showcase (3D, under
the cone of light), artist, private-view contact. The 3D interaction is the
familiar **coverflow**: click a side piece, swipe, wheel or use the arrows
and the next work swings to the front. The final "slide" is a closing card
with a commission CTA.

| Token | Value | Why |
|---|---|---|
| Background | `#14171D` | Gallery wall at night (cool ink — vs Halcyon's warm dark) |
| Text | `#EDEBE4` | Gallery paper |
| Accent | `#C2A15E` | Brass — plaques, frame fillet, wayfinding |
| Muted | `#8A8E96` | Concrete grey |

**Physical constants** (not palette-driven, in `VernissageTemplate.tsx`):
mat `#FAF8F2`, walnut frame `#2B261F`, crimson sold-dot `#C43D2B`. They keep
the hang reading as real objects whatever wall colour the user picks.

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
- The final "slide" is the View-all-work card; its CTA opens the gallery
  modal with every photo (not just the 12 hung in the showcase).

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

The slides carry no labels — the works hang clean (plaques were removed by
request). The closing card is a **View-all-work** teaser: a 3×2 mosaic +
title + CTA that opens a full-collection gallery modal (live site only);
clicking a piece there opens the lightbox over it.

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
