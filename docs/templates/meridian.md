# Meridian — template design & integration notes

A cool, gallery/museum portfolio for professional photographers. Built
**builder-first**: unlike Minimal BW / Atelier / Halcyon it has no legacy
standalone page — the editable component is the single source of truth for the
editor canvas, the live demo and the published site.

---

## Design rationale

The catalogue before Meridian: Minimal BW (light monochrome, left-aligned),
Atelier (warm cream, centred editorial), Halcyon (warm dark, burnt sienna).
The gap: a **cool, light, structured** aesthetic — the feeling of a museum
hang. Meridian fills it:

| Token | Value | Why |
|---|---|---|
| Background | `#F4F2ED` | Gallery plaster — warm-neutral white, not clinical |
| Text | `#16181B` | Ink, near-black with a cool cast |
| Accent | `#2E4E6B` | Deep steel blue — professional, restrained |
| Muted | `#8B8E93` | Cool grey for secondary copy |

**Typography** (all already bundled in `src/lib/editor/fonts.ts`):
- Serif (display): **Playfair Display** — high-contrast, curatorial
- Sans (body/UI): **Manrope** — quiet, geometric
- Mono (labels): **IBM Plex Mono** — wayfinding-style eyebrows

**Signature moves**: hairline rules between every section; numbered section
labels (`01 — Selected work`); a split hero (text column | full-bleed image
with plate caption); services numbered `I. II. III.` in serif italic; the
about portrait framed like a hung print (border + inner mat); a coordinates
line in the footer.

**Default grid**: `uniform`, 3 columns, 14 px gap — an even museum hang.
Layouts offered: `uniform`, `mosaic`, `masonry` (no `index`; that is Halcyon's
signature).

---

## File map

| File | Role |
|---|---|
| `src/components/editor/canvas/MeridianTemplate.tsx` | The template (editor canvas + public render) |
| `src/lib/editor/templates/meridian.tsx` | Node defaults + Pages-tree sections |
| `src/lib/editor/templates/registry.tsx` | Registration + design defaults (palette/typography/logo/grid/layouts) |
| `src/app/editor/meridian/{layout,page}.tsx` | Editor route (fonts under `--tpl-*` + EditorShell) |
| `src/app/templates/meridian/page.tsx` | Live demo — renders `PortfolioSiteRender` with `{ templateId: "meridian" }` |
| `src/app/dashboard/templates/page.tsx` | Dashboard card (`href` demo + `editorHref`) |
| `src/components/editor/core/Sidebar.tsx` | `BRAND_NODES.meridian` (Settings > Logo text sync) |
| `src/components/onboarding/brandData.ts` + `messages/{en,es}.json` | Onboarding option + labels |
| `src/lib/editor/wa.ts` | Shared WhatsApp-template helper (used by the contact form) |

## Node map (prefix `mrd-`)

- **Nav**: `mrd-nav-brand` (logo), `mrd-nav-item-1..3`, `mrd-nav-cta`
- **Hero**: `mrd-hero-eyebrow`, `mrd-hero-title`, `mrd-hero-sub`,
  `mrd-hero-meta`, `mrd-hero-cta-1/2`, `mrd-hero-image` (image),
  `mrd-hero-caption`
- **Work**: `mrd-work-label`, `mrd-work-intro` — the grid itself is driven by
  Design > Grid on `store.galleryPhotos`
- **Services**: `mrd-serv-label`, `mrd-serv-{1..3}-title/desc`
- **About**: `mrd-about-label`, `mrd-about-image` (image),
  `mrd-about-heading`, `mrd-about-body`, `mrd-stat-{1..3}-value/label`
- **Contact**: `mrd-contact-label/heading/body`, `mrd-contact-d{1..3}-label/value`
- **Footer**: `mrd-footer-brand` (logo), `mrd-footer-copy`

Section ids for the Pages tree / scroll-to: `section-nav`, `mrd-hero`,
`mrd-work`, `mrd-services`, `mrd-about`, `mrd-contact`, `section-footer`.

---

## Compliance with the adapter guide (pitfalls 1–11)

- **readOnly** — uses the shared primitives (already gated) and the
  `Clickable` pattern: real `<button>`/`<a>` only on the live site; plain
  elements in the editor so editable labels keep Space/Enter. The lightbox
  opens only when `readOnly`.
- **Editable images** — hero + portrait are `EditableImage` nodes (no CSS
  `background:url`), so they're swappable/croppable and appear in the tree.
- **User photos** — every grid reads `store.galleryPhotos`
  (demo picsum seeds only as fallback).
- **Contact** — follows `store.contact` (`inbox` posts to
  `api.contact.submit` with `siteSlug`; `whatsapp` opens `wa.me` via the
  shared `fillWaTemplate`).
- **No global CSS** — the template injects **no** `<style>` at all; every rule
  is inline and resolves editor variables (`--ed-*`, `--tpl-*`,
  `--ed-btn-*`), so palette/typography/buttons edits apply live and the
  editor chrome can't be affected.
- **Responsive** — driven entirely by the `viewport` prop
  (mobile/tablet/desktop), so the editor's device toggle works.
- **Tap-to-edit / Tiptap** — inherited from the shared primitives (second tap
  edits; `<p>` unwrap on save). No template `p`-element selectors exist that
  could shrink an edited heading.

## How to verify (manual)

1. `/dashboard/templates` → Meridian card shows with Edit button.
2. `/editor/meridian` → sidebar Pages tree lists all sections/nodes; palette,
   typography, buttons and grid panels all affect the canvas; device toggle
   switches layout.
3. `/templates/meridian` → demo renders with defaults, no editor affordances.
4. Onboarding → choosing Meridian applies its palette + typography and the
   preview updates.
5. Publish a portfolio with Meridian → grids show the uploaded photos; the
   contact form honours the inbox/WhatsApp setting.
