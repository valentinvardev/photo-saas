# Halcyon — web-builder follow-ups

Issues found after the first Halcyon → web-builder integration. Each maps a
reported problem to its root cause and the fix. General rules extracted from
these live in `docs/template-adapter-guide.md` ("Pitfalls & required behaviours").

Source files:
- `src/components/editor/canvas/HalcyonTemplate.tsx` (editable fork)
- `src/lib/editor/templates/halcyon.tsx` (nodes + sections)
- `src/components/editor/canvas/primitives.tsx` (shared `EditableNode`/`EditableText`)

---

## 1. Buttons aren't editable
**Reported:** "los botones no son editables".
**Cause:** Only a handful of text nodes were wrapped. Nav burger, "View all
works", the about "Contact ↓" link, social links and the contact form buttons
are static JSX.
**Fix:** Wrap every user-facing label as an editable node using the
`Activatable` pattern (real `<button>` only when `readOnly`, plain element in the
editor). Register a node + Pages-tree element for each.

## 2. Cover image isn't editable
**Reported:** "la imagen de cover no es editable".
**Cause:** The cover is a CSS background — `.hp-cover-img{background:url('${data.projects[3].cover}')}`
baked into the injected `<style>` block. CSS backgrounds aren't nodes.
**Fix:** Render the cover as an `EditableImage` (`<img>` absolutely positioned,
`object-fit:cover`) behind the title; add an `image` node (`hl-cover-image`).

## 3. "All photos" modal shows placeholders, not the user's uploads
**Reported:** "el modal de all photos tiene placeholders y no fotos subidas".
**Cause:** Halcyon renders every grid from bundled demo data (`HL_PHOTOS` /
`HL_PORTFOLIO`); it never reads `store.galleryPhotos`.
**Fix:** Source the index, archive/all-photos modal, detail and lightbox from
`useEditorStore(s => s.galleryPhotos)` (like Minimal BW's `useWorks()`), falling
back to the demo set only when empty.

## 4. About portrait can't be changed
**Reported:** "la foto del about me tampoco se puede cambiar".
**Cause:** Same as #2 — `.hp-about-portrait{background:url('${HL_PHOTOS.portraits[2].src}')}`.
**Fix:** Render it as an `EditableImage` node (`hl-about-image`).

## 5. Many other elements aren't editable
**Reported:** "muchos elementos que no se pueden cambiar".
**Fix:** Audit every text/image against the Pages tree; wrap anything a designer
would change. The index project titles/years/tags are array-driven (leave) but
their photos should still come from the user's gallery (#3).

## 6. Preview tab looks/behaves like the builder
**Reported:** "en el preview … aparece como si fuese editable como en el web builder".
**Cause:** The shared primitives (`primitives.tsx`) don't check `readOnly`, so
on the public/preview render they still emit `data-editor-node`, select-on-click
and **open Tiptap on double-click**.
**Fix (infra — also fixes Atelier):** Short-circuit `EditableNode`/`EditableText`
to a plain element when `readOnly`, mirroring Minimal BW's inline primitives.
Never mount `TiptapEditor` when `readOnly`.

## 7. Editor sidebar doesn't open
**Reported:** "el sidebar no se abre".
**Status:** Needs reproduction in-browser (check the console).
**Candidate causes:**
- The template injects a large un-scoped global `<style>` (`.hp-*` rules) that
  may interfere with the editor chrome / panel layout.
- A runtime error in `HalcyonTemplate` breaking the canvas render.
**Fix direction:** Scope all template CSS under the template root (only the reset
is scoped today), or convert to inline styles; then confirm Pages/Design/Settings
panels open with Halcyon selected.

## 8. Contact section should follow the user's WhatsApp/inbox choice
**Reported:** "adaptar nuestra seccion de contacto … whatsapp o inbox".
**Cause:** Halcyon hardcodes Letter/WhatsApp tabs and a demo number.
**Fix:** Read `store.contact` (`{ mode: "inbox" | "whatsapp", whatsapp, waTemplate }`):
- `inbox` → form posting to the in-app inbox.
- `whatsapp` → CTA from `contact.whatsapp` + `contact.waTemplate`
  (`{name} {email} {message}`).
Expose the choice in Settings via `setContact`, like Minimal BW.

---

### Priority note
#6 (preview looks editable) and #7 (sidebar) affect the live product; #6 also
regresses **Atelier**. Recommend fixing the shared-primitive `readOnly` gap
first since it's infra shared by all non-inline templates.
