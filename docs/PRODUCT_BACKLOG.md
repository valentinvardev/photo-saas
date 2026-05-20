# Portapic — Product Backlog

Producto criticado como usuario real. Cada sección es una pantalla o flujo.
Anotar aquí antes de implementar; marcar con `[x]` al mergear.

---

## Dashboard

- [ ] Quitar el "Next best action" y la fecha del header/overview
- [ ] Mantener el indicador de plan pero mejorar el badge: tiers **Bronze / Silver / Gold** en lugar del texto plano "Pro plan"
- [ ] **Header autohide:** cuando el usuario hace scroll hacia abajo, el header se oculta; al hacer scroll hacia arriba, reaparece (estilo drop-down suave). Solo aplicar fuera de la landing.
- [ ] Quitar las categorías de la galería; dejar solo la estructura de **carpetas + fotos**
- [ ] Oportunidad de diferenciación: diferentes estructuras/layouts de carpetas según el plan (Bronze básico, Gold avanzado)

---

## Templates Library

### Modal de teléfono (preview)
- [ ] Los checkmarks de selección deben ser **verde fijo**, independiente del color de la template — hoy heredan el color del tema de la plantilla
- [ ] Reemplazar los dos links de preview por un **botón único "Preview template"** al lado del botón "Use template" — más invitador y claro

### Portadas de templates
- [ ] Las portadas de las tarjetas de **Delivery** en la biblioteca no deben mostrar la página de password, sino **la galería en sí** (la primera foto real de la template)
- [ ] Las portadas de **Links** deben ser **canónicas** (renderizar el componente real, igual que ya funciona para Portfolios)
- [ ] Las portadas de **Portfolio** ya están bien — canónicas. No tocar.

### Limpieza
- [ ] **Quitar el template "Petal"** de la biblioteca
- [ ] Integrar el resto de templates que ya estaban bien pero quedaron fuera del rediseño actual

---

## Search Modal

- [ ] Quitar el párrafo descriptivo debajo de las tabs de categorización — ocupa espacio innecesario y corta el respirado visual del modal

---

## Delivery Tab

- [ ] Las portadas de las tarjetas de delivery deben ser **canónicas** (igual que portfolio — renderizar un mini-preview real, no un screenshot estático)
- [ ] Los tabs de monetización **Direct** y **Gift** deben tener íconos:
  - Gift → ícono de regalo
  - Direct → ícono de $ (dólar)
- [ ] La página de delivery editor necesita ser **responsiva en móvil**
- [ ] Alternativa si el responsivo no queda bien: crear una **vista móvil simplificada** para delivery (tipo la de portfolio), enfocada en las acciones más importantes, con el editor completo reservado para desktop
- [ ] En móvil, los botones de **Preview** y **Editar página** en Domains tienen que conservar texto — actualmente la IA los quitó por responsividad

---

## Portfolio Tab

- [ ] **Quitar el gráfico de visitas** del área de portfolio — repensar ese espacio (quizás métricas más relevantes o vacío intencional)

---

## Galería General

### Confirmaciones
- [ ] Modal de confirmación al apretar el ícono de basura — con **fondo blur** detrás del modal y **animación fade-in breve**
- [ ] Lo mismo para la acción de **Compartir**: abrir un modal

### Lightbox
- [ ] Click **fuera de la foto** (en el fondo del lightbox) cierra el lightbox — proteger las zonas de íconos y botones importantes
- [ ] Soporte de **zoom** — y si se detecta un gesto de zoom activo, **deshabilitar el scroll** para no interferir
- [ ] Si el usuario hace scroll en lugar de usar los chevrons, **triggerear una animación de fade-out** de los chevrons (se entiende que no los necesita)

### Compartir en móvil
- [ ] Al seleccionar fotos en móvil y presionar **Share**, abrir un modal que imite la estructura de carpetas:
  - Vista de carpeta madre: muestra todas las carpetas
  - Vista dentro de carpeta: mostrar un botón/componente claro para **volver a la carpeta anterior** (no el punto Unix — algo más friendly como "← Volver a Mis carpetas" o un breadcrumb)
- [ ] Botón de **Compartir link** para fotos seleccionadas:
  - Genera un link visualizador que **vence en 7 días**
  - Al presionar abre un modal con dos opciones:
    - **Compartir link** (copiar al portapapeles) — gratuito
    - **Enviar por email automáticamente** — feature de pago (mostrar badge de plan requerido si el usuario no lo tiene)

---

## Descarga inteligente (iOS)

- [ ] La descarga en iOS es un desastre — hay que invocar la **funcionalidad nativa de "Guardar imagen"** de iOS en lugar de forzar una descarga de archivo
- [ ] Referencia de implementación: proyecto **Sinchifoto**
- [ ] Esto además genera una experiencia de usuario mejor y más nativa en el ecosistema Apple

---

## Onboarding — Flujos paso a paso

Crear wizards interactivos para cada una de las tres superficies principales. Es la mejor manera de guiar al usuario nuevo.

### Portfolio

```
Paso 1: Nombre del portfolio + selección de fotos (formación de galería)
         ↓
Paso 2: Selección de template + preview + edición básica
        (edición avanzada queda como opcional / acceso libre después)
         ↓
Paso 3: Flow de dominio (subdominio gratis vs. dominio .com)
         ↓
Paso 4: Pantalla de celebración + opciones de compartir
```

### Delivery Page

```
Paso 1: Nombre del cliente + formación de galería
        + opciones básicas: público vs. protegido con contraseña
        + modo: regalo (gift) o monetización (direct)
         ↓
Paso 2: Selección de template + preview
         ↓
Paso 3: Resumen + link de entrega + opciones de notificación al cliente
         ↓
Paso 4: Pantalla de celebración + copiar link / enviar por email
```

### Link Page

```
Paso 1: Nombre + foto de perfil + bio breve
         ↓
Paso 2: Agregar primeros links (mínimo 1, máximo libre)
         ↓
Paso 3: Selección de template + preview
         ↓
Paso 4: Personalización básica: colores, tipografía (variables de la template)
         ↓
Paso 5: Publicar + compartir link
```

---

## Profile / Public Profile

- [ ] **Rediseñar el perfil** pensando en el aspecto social de la plataforma
- [ ] Funcionalidades objetivo:
  - Publicar contenido y compartirlo
  - Enviar mensajes directos
  - Dar likes / reacciones
- [ ] El nuevo layout debe ser **intuitivo, limpio y social** — no un formulario de ajustes
- [ ] Pensar en un layout tipo "perfil de creador": foto de portada, bio, grid de trabajos publicados, botón de contacto/mensaje
- [ ] Separar el **perfil público** (lo que ve otro usuario) del **panel de edición de perfil** (lo que ve el propio usuario)

---

## Domains

- [ ] Repensar el **flujo y la disposición** para móvil
- [ ] En móvil, los botones de **Preview** y **Editar página** deben conservar texto visible — no solo íconos
- [ ] En móvil, el botón de "Editar página" no debe redirigir al editor completo (está pensado para PC) — en su lugar:
  - Opción A: **Quitar el botón en móvil** directamente
  - Opción B: Abrir un **modal restrictivo** que aclare que la edición avanzada es una funcionalidad de escritorio, y ofrezca la opción de continuar en PC (link copiable / QR)

---

## Notas generales

- Las **portadas canónicas** (renderizar el componente real de la template) ya funcionan en Portfolio. El patrón debe extenderse a Delivery y Links.
- El principio de **responsividad** no es solo "que entre en la pantalla" — en móvil hay que pensar qué acciones tienen sentido y cuáles no, y adaptar el diseño a eso.
- El **onboarding paso a paso** es prioritario: un usuario nuevo que llega y no sabe qué hacer es un usuario perdido.
- La **experiencia social** (profile, likes, mensajes) es un diferenciador grande — hay que pensarla bien antes de implementarla para no quedar como un clon de Instagram.
