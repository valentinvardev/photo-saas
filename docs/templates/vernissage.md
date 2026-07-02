# Vernissage — template design & integration notes

The platform's first **3D template**: a walkable **white-cube gallery**.
Photographs hang framed on the side walls of a virtual room — with museum
labels — and the visitor walks down the room (drag / wheel / arrow buttons)
to an end wall carrying a commission CTA. Built **builder-first** like
Meridian: one component serves the editor canvas, the `/templates/vernissage`
demo and the published site.

---

## Concept & design rationale

The "white cube" is the canonical professional gallery format: white walls,
concrete floor, framed works at eye level, small label plates, a red dot for
sold pieces. Vernissage (the opening night of an exhibition) translates that
into a portfolio: the site *is* an exhibition — poster (hero), room
(3D gallery), artist, private-view contact.

| Token | Value | Why |
|---|---|---|
| Background | `#F6F5F1` | White-cube wall |
| Text | `#131518` | Ink |
| Accent | `#A63A22` | The gallery "red dot" (labels, HUD, wayfinding) |
| Muted | `#90928F` | Concrete grey |

**Typography** (bundled): **Fraunces** (exhibition-title serif, italics),
**Space Grotesk** (signage sans), **Space Mono** (label plates / HUD).

## The 3D room — how it works (no WebGL, no new deps)

Pure CSS 3D: a viewport `div` with `perspective` contains a "world" `div`
with `transform-style: preserve-3d`. Walls, floor, ceiling and the end wall
are flat planes positioned with `translate3d` + `rotateX/rotateY`; artworks
are planes rotated ±90° hung along the Z axis, alternating walls, with a
frame, a mat and a museum label. Walking = animating the world's
`translateZ(cam)`; `cam` is React state clamped to `[0, maxCam]`.

Movement inputs:
- **Drag** horizontally (pointer events; `touchAction: pan-y` keeps vertical
  page scroll free on touch).
- **Wheel** — attached with `passive: false` **only when `readOnly`**, so the
  editor canvas scroll is never hijacked.
- **Arrow buttons** + progress bar + room counter in a HUD strip (work in the
  editor too, so the designer can walk the room while editing).
- Clicking an artwork opens the lightbox (live site only).

Room geometry scales with the `viewport` prop (height/width/spacing per
device), so the editor's device toggle works and no `vh` units are needed
inside the device frame.

**Editing inside 3D**: side-wall artworks are images (no text editing on
skewed planes). The end wall **faces the camera** (translation only, no
rotation), so its title/CTA are ordinary editable nodes; selecting either in
the Pages tree auto-walks the room to the end so the node is on screen.

## Layout system

`"corridor"` was added to `GridSettings.layout` (like Halcyon's `"index"`).
Vernissage declares `layouts: ["corridor", "uniform", "masonry"]` with
corridor as default — the Design > Grid panel lets the user fall back to flat
grids (driven by the same columns/gap/fit/load-more controls).

## File map

| File | Role |
|---|---|
| `src/components/editor/canvas/VernissageTemplate.tsx` | Template + 3D room |
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
  `vrn-endwall-title`, `vrn-endwall-cta` (on the frontal end wall)
- **Artist**: `vrn-about-label`, `vrn-about-image` (image),
  `vrn-about-heading/body`, `vrn-stat-{1..3}-value/label`
- **Contact**: `vrn-contact-label/heading/body`, `vrn-contact-d{1..3}-label/value`
- **Footer**: `vrn-footer-brand`, `vrn-footer-copy`

Artwork labels in the room are array-driven (photo title or "Untitled") —
not editable nodes, per the adapter guide.

## Compliance (pitfalls 1–11)

Zero injected CSS (all inline on `--ed-*`/`--tpl-*`); responsive from the
`viewport` prop; grids/room read `store.galleryPhotos` (demo seeds fallback);
portrait is an `EditableImage`; every button/label editable via the
`Clickable` pattern; contact follows `store.contact` (shared
`fillWaTemplate`); lightbox + wheel-capture gated on `readOnly`.

## How to verify (manual)

1. `/templates/vernissage` → walk the room with drag, wheel and the arrows;
   labels show; end wall CTA scrolls to contact; artwork click opens lightbox.
2. `/editor/vernissage` → arrows/drag walk the room; selecting "End wall"
   nodes in the Pages tree auto-walks there; texts edit by tap; device toggle
   reshapes the room; Grid panel switches 3D room ↔ flat grids.
3. Upload photos in a portfolio → the room hangs the user's photos.
4. Contact honours the inbox/WhatsApp setting.

## Known limits

- The room shows the first 12 photos (a real exhibition hang, not a dump);
  the flat layouts + lightbox cover the rest via Load more.
- CSS 3D is rasterised per-plane: very large wall planes can soften slightly
  on low-DPI screens; frames/labels stay crisp.
