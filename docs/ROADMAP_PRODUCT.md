# Portapic — Product Roadmap

Priorizado por impacto / esfuerzo. Cada sprint es una sesión de trabajo.
Marcar `[x]` al mergear. La fuente de ideas es [PRODUCT_BACKLOG.md](./PRODUCT_BACKLOG.md).

---

## Sprint 1 — Quick wins (pure frontend, sin backend)

Cambios quirúrgicos. Todo toca archivos existentes, nada nuevo de arquitectura.

- [x] Search modal: quitar el párrafo descriptivo bajo las tabs
- [x] Dashboard: quitar "Next best action" y la fecha
- [x] Templates: checkmarks verdes fijos (no dependen del color de la template)
- [x] Templates: reemplazar links de preview por un solo botón "Preview template" al lado de "Use"
- [x] Delivery tabs: íconos en Gift y Direct
- [x] Portfolio: quitar el gráfico de visitas (Sparkline)
- [x] Galería: modal de confirmación al borrar foto (blur + fade)
- [x] Lightbox: click fuera de la foto cierra el lightbox

---

## Sprint 2 — UX polish

- [ ] Header: autohide al scroll hacia abajo, reaparece al scroll hacia arriba (solo dashboard, no landing)
- [ ] Templates library: portadas de Delivery canónicas (galería real, no password page)
- [ ] Templates library: portadas de Links canónicas
- [ ] Templates library: quitar template "Petal"
- [ ] Galería: chevrons se desvanecen (fade-out) si el usuario usa scroll en lugar de clicks
- [ ] Lightbox: zoom + deshabilitar scroll cuando hay zoom activo
- [ ] Galería móvil: modal de compartir con estructura de carpetas + botón volver a carpeta anterior
- [ ] Galería: botón compartir fotos seleccionadas → link de 7 días → modal (Copiar link / Enviar por email)
- [ ] Domains: flujo y disposición móvil — texto en botones, modal restrictivo para editor en PC
- [ ] Delivery: vista móvil simplificada (o responsive satisfactorio)

---

## Sprint 3 — Nuevas features

- [ ] Dashboard: badge de plan con tiers Bronze / Silver / Gold (reemplaza "Pro plan")
- [ ] Descarga inteligente iOS: invocar "Guardar imagen" nativo (ref: Sinchifoto)
- [ ] Galería: "Enviar por email" como paid feature con badge de plan requerido
- [ ] Onboarding wizard — Portfolio (4 pasos: fotos → template → dominio → celebración)
- [ ] Onboarding wizard — Delivery (pasos: cliente+fotos+acceso → template → resumen → celebración)
- [ ] Onboarding wizard — Link Page (pasos: perfil → links → template → variables → publicar)

---

## Sprint 4 — Grandes rediseños

- [ ] Profile / public profile: rediseño social (foto de portada, bio, grid de trabajos, likes, mensajes)
  - Separar perfil público (vista de otro usuario) del panel de edición propio
- [ ] Dashboard: galería con estructura solo de carpetas (sin categorías)
  - Oportunidad: estructuras avanzadas de carpetas según tier de plan
- [ ] Domains: repensar el flujo completo desde cero para móvil
- [ ] Portfolio tab: repensar el área de métricas (quitar chart, algo más relevante)

---

## Backend (paralelo a los sprints de UI)

Ver [ROADMAP.md](./ROADMAP.md) para el detalle técnico. Orden:

1. **Phase 1** — Schema alignment (Prisma ↔ tipos del frontend)
2. **Phase 2** — tRPC routers (links, delivery, portfolio, photo)
3. **Phase 3** — Hydration bridge (Zustand ↔ DB, debounced sync)
4. **Phase 4** — Storage + uploads (Supabase, variantes de imagen)
5. **Phase 5** — Auth + publish + custom domains

---

## Notas de diseño

- **Portadas canónicas** = renderizar el componente real de la template (no screenshot). Ya funciona en Portfolio. Extender a Delivery y Links.
- **Responsividad** no es solo "que entre" — en móvil hay que elegir qué acciones tienen sentido y cuáles no.
- **Onboarding** es prioridad de negocio: un usuario nuevo sin guía es un usuario perdido.
- **Aspecto social** (likes, mensajes, perfil público) debe pensarse bien antes de tocar código — cambia el modelo de datos.
