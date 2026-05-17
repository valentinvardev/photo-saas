# FRAME — Roadmap

Live punch list. Tick boxes as work merges. Each item links to the file(s) it touches.

---

## Stack (as built today)

- **Next.js 15** (App Router, Turbopack) · React 19 · TypeScript
- **Tailwind v4** · Framer Motion · Tiptap (editor)
- **DB:** Prisma 6 + PostgreSQL (Supabase) — schema at [prisma/schema.prisma](../prisma/schema.prisma)
- **Auth:** NextAuth v5 beta · Prisma adapter
- **API:** tRPC v11 + React Query — root at [src/server/api/root.ts](../src/server/api/root.ts)
- **State (today):** Zustand stores persisted to localStorage — [src/lib/editor/store.ts](../src/lib/editor/store.ts), [src/lib/portfolio/store.ts](../src/lib/portfolio/store.ts), [src/lib/delivery/store.ts](../src/lib/delivery/store.ts), [src/lib/links/store.ts](../src/lib/links/store.ts)
- **Storage (planned):** Supabase Storage with RLS

**Public routes already wired:**
- `/d/[id]` — public delivery gallery → [src/app/d/[id]/view.tsx](../src/app/d/%5Bid%5D/view.tsx)
- `/l/[id]` — public Linktree-style page → [src/app/l/[id]/view.tsx](../src/app/l/%5Bid%5D/view.tsx)

---

## Backend — 5 phases

> Each phase is sequenced. Don't jump phases unless the predecessor is green; the hydration bridge (Phase 3) depends on schema (1) and routers (2).

### Phase 1 — Schema alignment _(no UI changes)_

The current Prisma schema for `LinksPage` and `LinkItem` is way behind the frontend types. Same for `Delivery`. Goal: one migration that brings the DB in lockstep with the canonical TypeScript types.

- [ ] `LinksPage` model in [prisma/schema.prisma](../prisma/schema.prisma) gains: `template`, `displayName`, `avatarBg`, `avatarInitial`, `bgGradFrom`, `bgGradTo`, `bgGradAngle`, `bgImageUrl`, `bgOverlayColor`, `bgOverlayOpacity`, `btnShape`, `btnVariant`, `btnBorder`, `fontFamily`, `fontWeight`, `textColor`, `subColor`, `labels Json`
- [ ] `LinkItem` model gains: `type`, `icon`, `waCountry`, `waPhone`, `waMessage`, `igUsername`, `emailAddress`, `emailSubject` (rename `label` → `title`)
- [ ] `Delivery` model gains the fields in [src/lib/delivery/data.ts](../src/lib/delivery/data.ts) it doesn't have yet (`coverUrl`, `logoMode`, `logoText`, `logoUrl`, password-page copy, etc.)
- [ ] `npm run db:generate` (migration) + `prisma generate`

### Phase 2 — tRPC routers

Stub today is just `post` in [src/server/api/root.ts](../src/server/api/root.ts). Add four resource routers, mirror the existing stores.

- [ ] `src/server/api/routers/links.ts` — `getMine`, `upsert`, `publish`, `getBySlug` (public)
- [ ] `src/server/api/routers/delivery.ts` — `list`, `get`, `upsert`, `addPhotos`, `removePhotos`
- [ ] `src/server/api/routers/portfolio.ts` — `list`, `get`, `upsert`, `publish`
- [ ] `src/server/api/routers/photo.ts` — `list`, `presignUpload` (Supabase Storage), `confirm`, `delete`
- [ ] Register all in [src/server/api/root.ts](../src/server/api/root.ts)
- [ ] Rate-limit middleware on public slug lookups

### Phase 3 — Hydration bridge _(stores ↔ DB)_

Localstorage stays as an **offline write buffer**; server is canonical.

- [ ] Each Zustand store gets a `loadFromServer` action
- [ ] `<HydrateOnMount />` in the dashboard layout calls it once per store per session
- [ ] Replace bare `persist` middleware with a **debounced `syncToServer`** effect (~300ms)
- [ ] `/l/[id]` and `/d/[id]` swap their data source to the tRPC server caller

### Phase 4 — Storage + uploads

Replace the [https://picsum.photos](https://picsum.photos) placeholders with real photos.

- [ ] Supabase Storage bucket `photos` with RLS by `userId`
- [ ] Upload flow: client → tRPC `presignUpload` → direct PUT → tRPC `confirm` creates `Photo` row with `width`/`height` (computed client-side)
- [ ] Image proxy / variants for `Delivery.downloadRes` (`original | web | mobile`)
- [ ] Wire the photo library back into the editor and delivery builder

### Phase 5 — Auth + publish + custom domains

- [ ] Wire [src/app/login/page.tsx](../src/app/login/page.tsx) and [src/app/register/page.tsx](../src/app/register/page.tsx) to NextAuth credentials/google
- [ ] Slug validation + reservation (reserved-words list, uniqueness)
- [ ] Publish gate on links/delivery/portfolio — public routes 404 when `published=false`
- [ ] `Portfolio.customDomain` — Next middleware routing + DNS verification

---

## Templates

> **Canonical** = the template component takes a `page` prop and reads from the matching Zustand store, used by both the editor preview and the public route.

### Delivery

- [x] **Brooklyn** — [src/app/template/brooklyn/delivery](../src/app/template/brooklyn/delivery)
- [x] **Halcyon** — [src/app/template/halcyon/delivery](../src/app/template/halcyon/delivery)
- [x] **Minimal** — [src/app/template/minimal/delivery](../src/app/template/minimal/delivery)
- [ ] **Atelier** delivery — does not exist yet, build to match [src/app/template/atelier/page.tsx](../src/app/template/atelier/page.tsx) aesthetic

### Links

- [x] **Brooklyn** — canonical at [src/app/template/brooklyn/links/component.tsx](../src/app/template/brooklyn/links/component.tsx)
- [ ] **Halcyon links** — exists but **not canonical** at [src/app/template/halcyon/links/page.tsx](../src/app/template/halcyon/links/page.tsx). Lift into `halcyon/links/component.tsx` with a `page` prop, mirror Brooklyn
- [ ] **Minimal links** — does not exist, build
- [ ] **Atelier links** — does not exist, build

### Portfolio

- All portfolio templates currently live under [src/app/templates/*](../src/app/templates/) (different namespace from `/template/*`). They are **not canonical** — standalone preview pages.
- [ ] Decision needed: move them under `/template/<id>/portfolio` with the same canonical pattern, OR keep them static and add a separate "portfolio builder" later.
- The dashboard's preview points at `/templates/minimal-bw` — slowest-burning piece, safe to leave until link builder + delivery are persisted.

---

## Link builder — pending refinements

- [ ] `/template/<id>/links` needs a wrapper with a floating **"Variables" drawer** (font, colors, bg) that mutates the same links store. Layout/copy stays template-controlled. The Template-tab CTA in [src/app/dashboard/links/page.tsx](../src/app/dashboard/links/page.tsx) already links here.
- [ ] `TemplatePreviewTile` for Halcyon in the dashboard is hand-drawn — replace with a real mini-render once Halcyon links is canonical.
- [ ] Verify the mobile floating segmented control's `pb-24` spacer on the edit panel doesn't clip the last input across all three tabs (Links / Appearance / Template) once Halcyon links lands.

---

## Done log

- `aefd110` — Links builder: restored base preview, added Template tab, replaced stacked mobile buttons with floating segmented control
- `5910d9e` — Header: widened mobile search field so the placeholder fits
- `65269c4` — Toggle: theme-aware colors and perfectly centered knob, extracted to [src/components/ui/Toggle.tsx](../src/components/ui/Toggle.tsx)
