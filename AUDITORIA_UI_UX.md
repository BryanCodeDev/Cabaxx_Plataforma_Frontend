# Auditoría UI/UX & Frontend — Cabaxx Plataforma

> Stack detectado: **React 18 + Vite + Tailwind 3 + React Router 6 + Framer Motion**.
> Single-source-of-truth en `tailwind.config.js`, `index.css` y la familia de `Layout`/`AppShell`/`Footer`/`Home.jsx`.
> Este documento es una **guía accionable**: cada bloque incluye *qué cambiar*, *dónde* (con `file:line`) y *por qué*.

---

## Estado actual (al cierre de Fase 1)

| Fase | Estado | Notas |
|------|--------|-------|
| **1. Sistema de diseño responsive** (Rondas 1–3) | ✅ Cerrada | Breakpoints `xs/3xl/4xl`, fontSize `display-*`, maxWidth `8xl–10xl`, boxShadow `elev-1/2/3`, `container-fluid`, grids semánticas (`grid-cards`, `grid-feature`, `grid-stat`). |
| **1b. Shell unificado** (Ronda 4) | ✅ Cerrada | `AppShell` reemplaza `Navbar` + `DashboardLayout`; detecta modo público/admin; drawer accesible; `AdminPageHeader` en 11 páginas. |
| **1c. A11y profunda** (Ronda 5) | ✅ Cerrada | `CommentSection`, `LikeButton`, `FollowButton`, `Dropdown`, `ProductCard` con semántica ARIA; `StickyCartSummary` en Cart y Checkout. |
| **2. Modo claro/oscuro** | 🟡 Pendiente | Token system existe en `tailwind.config.js`; falta `darkMode: 'class'` + ThemeProvider + toggle. |
| **3. Command palette / Búsqueda global** | 🟡 Pendiente | `prefers-reduced-motion` ya respetado en drawer. |
| **4. Auditoría final / Lighthouse** | 🟡 Pendiente | A11y AA, perf <2s, CLS <0.1, LCP <2.5s. |

**Build:** 0 errores, 21 warnings preexistentes (no introducidos por las rondas).
**Componentes nuevos:** `useBreakpoint`, `useFocusTrap`, `ScrollUtilities`, `SkipLink`, `CenteredContainer`, `StickyBottomCTA`, `PageSpinner`, `StickyCartSummary`, `AppShell`, `AdminPageHeader`.

---

## Resumen ejecutivo de hallazgos

| # | Hallazgo | Impacto | Esfuerzo |
|---|----------|---------|----------|
| 1 | Sin breakpoints para tablets (768–1023 px) y ultra-wide (≥1536 px) | Layouts quedan apretados o estirados | Bajo |
| 2 | Grids固定 en 2/3/4 columnas — no escala fluidamente entre breakpoints | Saltos bruscos de jerarquía visual | Bajo |
| 3 | Sidebar admin sin versión **drawer móvil** persistente y overlay sólido | UX móvil admin rota en <640 px | Medio |
| 4 | `Navbar` móvil se cierra con el carrito/CTA visibles pero no accesibles en <lg | Tienda inaccesible sin login en mobile | Bajo |
| 5 | Breadcrumbs y Footer con paddings duros (`px-4 sm:px-8`) — sin clamp() | Líneas muy largas en ultra-wide | Bajo |
| 6 | Imágenes sin `srcset`/`sizes` ni `aspect-ratio` consistente | CLS alto, scroll jank | Medio |
| 7 | Tipografía usa valores hard-coded (`clamp(...)` inline en `Home.jsx:216`) | Inconsistencia entre páginas | Bajo |
| 8 | Móvil burger-menu deshabilita scroll del body pero no aísla el foco (focus-trap ausente) | Accesibilidad AA rota | Bajo |
| 9 | `DashboardLayout` `aside` ocupa `w-64` fijo en desktop sin opción de drawer permanente | Quita espacio útil de contenido | Bajo |
| 10 | `ScrollToTop` no respeta `prefers-reduced-motion` (ya cubierto a nivel CSS, falta en JS) | Saltos abruptos | Trivial |

---

## 1. Estrategias de diseño responsivo

### 1.1 Sistema de breakpoints (mobile-first)

Tailwind 3 trae los valores por defecto: `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536`. **No son suficientes** para una plataforma que se anuncia "ultra-wide ready".

**Acción — añadir breakpoints semánticos en `tailwind.config.js:6-67`:**

```js
extend: {
  screens: {
    'xs':  '480px',  // móviles grandes
    'sm':  '640px',
    'md':  '768px',
    'lg':  '1024px',
    'xl':  '1280px',
    '2xl': '1536px',
    '3xl': '1920px', // FHD+
    '4xl': '2560px', // QHD / ultra-wide
  },
}
```

**Mapeo recomendado de dispositivo → prefijo mínimo:**

| Dispositivo | Ancho | Prefijo |
|---|---|---|
| iPhone SE / Galaxy Fold cover | 320–374 | (base) |
| Móvil estándar | 375–480 | `xs:` |
| Móvil grande / phablet | 481–767 | `xs:`/`sm:` |
| Tablet portrait | 768–1023 | `md:` |
| Tablet landscape / laptop | 1024–1279 | `lg:` |
| Laptop estándar | 1280–1535 | `xl:` |
| Desktop FHD | 1536–1919 | `2xl:` |
| QHD / 4K | 1920–2559 | `3xl:` |
| Ultra-wide | ≥2560 | `4xl:` |

### 1.2 Unidades relativas — eliminar píxeles duros

**Auditoría rápida (grep):**
- `Home.jsx:216` → `fontSize: 'clamp(3.25rem,11.5vw,8.5rem)'` ✅ (única bien)
- `Home.jsx:393,506` → `style={{ fontSize: 'clamp(...)' }}` ✅ pero **repetido**
- `Footer.jsx:111` → `text-4xl sm:text-5xl md:text-6xl` ⚠️ salta bruscamente

**Acción — tipografía fluida global.** Añadir en `tailwind.config.js:34-36`:

```js
fontSize: {
  'display-sm': ['clamp(2.25rem, 6vw, 3.5rem)',  { lineHeight: '0.95', letterSpacing: '-0.02em' }],
  'display-md': ['clamp(3rem,  8vw, 5rem)',     { lineHeight: '0.92', letterSpacing: '-0.025em' }],
  'display-lg': ['clamp(3.5rem,11.5vw,8.5rem)', { lineHeight: '0.84', letterSpacing: '-0.03em' }],
  'display-xl': ['clamp(4rem, 14vw, 11rem)',    { lineHeight: '0.82', letterSpacing: '-0.035em' }],
}
```

Sustituir en:
- `Home.jsx:215` → `className="font-display font-black leading-[0.84] tracking-tight text-display-lg"` (elimina el `style` inline).
- `Footer.jsx:111` → `className="font-display text-display-md"`.
- `Navbar.jsx:46` → añadir `text-[clamp(11px,1vw,13px)]` para que el tracking no se vea microscópico en ultra-wide.

### 1.3 Layouts fluidos (container queries como upgrade futuro)

Tailwind 3.4 ya soporta `@container` si activas `tailwindcss/container-queries` o actualizas a v4. **Plan de migración recomendado:**

1. Corto plazo: usar `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 3xl:px-12` en cada sección.
2. Medio plazo: introducir `@tailwindcss/container-queries` y refactorizar `Home.jsx` (secciones independientes como `LatestRelease`, `About`) para que cada una reaccione a **su** ancho, no al viewport.

**Acción inmediata en `Layout.jsx:15` y todos los `mx-auto max-w-7xl`:**
```jsx
className="mx-auto w-full max-w-7xl 2xl:max-w-[88rem] 3xl:max-w-[112rem] 4xl:max-w-[132rem]
           px-4 sm:px-6 lg:px-8 3xl:px-12"
```
Aplicar en `Layout.jsx:15`, `Navbar.jsx:140`, `Footer.jsx:106`, `DashboardLayout.jsx:161`, `Home.jsx:198,365,480,600,...`.

### 1.4 Sistemas de rejilla

**Patrón actual (inconsistente):**

| Archivo | Línea | Grid |
|---|---|---|
| `Home.jsx` | 371 | `md:grid-cols-12` (no col en mobile) |
| `Home.jsx` | 482 | `md:grid-cols-12` |
| `Home.jsx` | 532 | `grid-cols-2 md:grid-cols-4` |
| `Home.jsx` | 559 | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` ✅ |
| `Home.jsx` | 842 | `grid-cols-3` (¡sin breakpoint!) ⚠️ |
| `Home.jsx` | 937 | `grid-cols-2 md:grid-cols-4` |
| `Home.jsx` | 1007 | `grid-cols-1 sm:grid-cols-2 md:grid-cols-3` ✅ |
| `Footer.jsx` | 119 | `sm:grid-cols-2 md:grid-cols-6` |
| `ListingPage.jsx` | 62 | `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` |
| `StorePage.jsx` | 31 | `grid-cols-2 md:grid-cols-4` (sin lg) |
| `VideosPage.jsx` | 56 | `grid-cols-2 md:grid-cols-3` (sin lg) |

**Sistema canónico propuesto** (pegarlo en `index.css` `@layer components`):

```css
.grid-cards       { @apply grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 4xl:grid-cols-6; }
.grid-cards-tight { @apply grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5; }
.grid-feature     { @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-6; }
.grid-stat        { @apply grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4; }
```

**Puntos clave:**
- En `3xl+` los grids de catálogo saltan a 5–6 columnas. Esto convierte el viewport ancho en una **galería editorial**, no en una página desperdiciada.
- `Home.jsx:842` (galería) debe ir a `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` para que en tablet el mosaico respire.
- `Footer.jsx:119` `md:grid-cols-6` deja 4 columnas con 1 link cada una (En vivo); mejor `md:grid-cols-12` con jerarquía: `col-span-4 / col-span-2 / col-span-2 / col-span-2 / col-span-2`.

### 1.5 Imágenes responsivas

`Home.jsx:380,521,640,854,948,1021` usan `<img>` sin `srcset` ni `sizes`.

**Acción — crear un componente `<ResponsiveImage>`** en `src/components/ui/ResponsiveImage.jsx`:

```jsx
export default function ResponsiveImage({ src, alt, sizes = '(min-width:1280px) 25vw, (min-width:768px) 33vw, 50vw', aspect = '4/5', className = '', priority = false }) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchpriority={priority ? 'high' : 'auto'}
      sizes={sizes}
      className={`aspect-[${aspect}] w-full object-cover ${className}`}
    />
  );
}
```

Idealmente conectar con backend que devuelva variantes (`?w=480 960 1280 1920`).

---

## 2. Mejores prácticas de UI para consistencia

### 2.1 Escala tipográfica unificada

Hoy conviven `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`, `text-6xl` con valores inline `clamp(...)`. **Estandarizar:**

```js
// tailwind.config.js extend.fontSize (resumen — ver §1.2)
'eyebrow': ['11px', { lineHeight: '1', letterSpacing: '0.3em' }],  // Navbar.jsx:46, Footer.jsx:174, Home.jsx:111
'kicker':  ['13px', { lineHeight: '1.2', letterSpacing: '0.16em' }], // nav links
```

Reemplazar `text-[11px]`, `text-[10px]`, `text-[12.5px]` (Navbar, Footer, Home) por estas utilidades. Reduce deuda técnica y asegura que un cambio de escala en config.js se propague.

### 2.2 Tokens de espaciado

Hoy se usa `gap-2`, `gap-3`, `gap-4`, `gap-5`, `gap-6`, `gap-8`, `gap-10`, `gap-12` mezclados sin criterio. **Regla 4/8/12:**

| Token | px | Uso |
|---|---|---|
| `gap-2` | 8 | entre icono y texto |
| `gap-3` | 12 | dentro de un chip |
| `gap-4` | 16 | entre tarjetas en mobile |
| `gap-6` | 24 | entre tarjetas en desktop |
| `gap-8` | 32 | separación de bloques |
| `gap-12` | 48 | pausa editorial |
| `gap-16`/`gap-20` | 64/80 | entre secciones |

Auditar `Home.jsx` (líneas 744, 1007) y unificar.

### 2.3 Sombras y elevación consistentes

`tailwind.config.js:37-44` define `glow`, `glow-sm`, `glow-lg`, `card` pero **se aplican inconsistentemente** (`shadow-glow`, `shadow-glow-sm`, `shadow-glow-lg`, `shadow-card`).

**Acción — declarar tres elevaciones y prohibirlas fuera:**

```js
boxShadow: {
  'elev-1': '0 2px 8px rgba(0,0,0,0.4)',   // botones hover
  'elev-2': '0 8px 24px rgba(0,0,0,0.5)',  // tarjetas
  'elev-3': '0 24px 60px rgba(0,0,0,0.7)', // modales, dropdowns
  'glow-sm':'0 0 8px rgba(255,59,92,0.3)',
  'glow':  '0 0 20px rgba(255,59,92,0.4)',
  'glow-lg':'0 0 60px rgba(255,59,92,0.35)',
}
```

### 2.4 Estados focus accesibles (ya cubierto en `index.css:49-53`) ✅

Añadir `prefers-reduced-motion` ya está bien (`index.css:77-86`). Reforzar:
- `Navbar.jsx:113` ya cierra con Escape ✅
- Falta **focus-trap** en el menú móvil (cuando `menuOpen=true`, Tab debe ciclar dentro del panel y volver al burger al cerrarse).

**Implementación rápida con librería cero:** usar el hook propuesto más abajo (§4.3).

### 2.5 Estados vacíos coherentes

Patrón actual (`Home.jsx:616, 707, 874, 933, 1003`):
```jsx
<div className="mt-X rounded-2xl border border-white/10 bg-[#0a0a0a] p-10 text-center">
  <Icon /> <p>...</p>
</div>
```
**Centralizar** en `src/components/common/EmptyState.jsx` (parece existir pero no se usa en Home — `ListingPage.jsx:56` sí lo usa). Reemplazar las 5 ocurrencias en `Home.jsx` por `<EmptyState icon={Music} title="..." description="..." />`.

---

## 3. Auditoría UX — Navegación y carga cognitiva

### 3.1 Mapa de información actual

```
Inicio (H)
├── Música        ─→ /canciones, /canciones/:slug, /albumes, /albumes/:slug, /videos, /videos/:slug
├── Eventos       ─→ /eventos, /eventos/:slug
├── Tienda        ─→ /tienda, /tienda/:slug, /carrito, /checkout, /pagos/*
├── Blog          ─→ /blog, /blog/:slug
├── Más ▾         ─→ /galeria, /noticias, /contacto, /mi-cuenta, /mis-pedidos
└── Admin (gated) ─→ 12 sub-rutas
```

**Diagnóstico:**
- `Canciones` vs `Álbumes` vs `Videos` vs `Galería` son **4 conceptos solapados** para un visitante nuevo. La nav los separa en 2 grupos ("principal" + "Más") y el usuario no entiende por qué.
- `Noticias` y `Blog` viven en "Más" pero semánticamente son contenido editorial largo — deberían tener su propio slot visible o re-merge en uno solo (recomiendo **mantener ambos pero con naming distinto**: `Novedades` para news cortas, `Crónicas` para blog largo).
- `Contacto` aparece en "Más" pero es un destino frecuente (sobre todo desde Footer); debería estar **en el Footer como CTA dedicado** y eliminado del menú principal (ya está en `Footer.jsx:31` ✅ — quitar del Navbar reduce carga cognitiva).

### 3.2 Recomendaciones de jerarquía

**Propuesta nueva de navbar (5 fijos + cuenta):**

| Slot | Items | Justificación |
|---|---|---|
| Primario (lg+) | Inicio · Música · Eventos · Tienda · Crónicas | Lo que vende entradas y discos |
| Secundario (mega-menú "Más") | Galería · Videos · Álbumes · Novedades | Descubrimiento |
| Utilidad | Buscar (icono) · Idioma · Cuenta/Carrito | Acciones transaccionales |

**Acción — `Navbar.jsx:17-23`:**

```js
const NAV_LINKS = [
  { label: 'Inicio', to: ROUTES.HOME },
  { label: 'Música', to: ROUTES.SONGS, mega: 'media' },
  { label: 'Eventos', to: ROUTES.EVENTS },
  { label: 'Tienda', to: ROUTES.STORE },
  { label: 'Crónicas', to: ROUTES.BLOG },
];
```

Y eliminar `Contacto` de `MORE_GROUPS` (queda en Footer).

### 3.3 Mega-menú "Música"

Sustituir el dropdown genérico por un **mega-menú** cuando hay ≥4 subcategorías. Esto baja la carga cognitiva mostrando todas las opciones a la vez:

```
┌──────────────────────────────────────────────┐
│  Canciones    Álbumes    Videos    Galería   │
│  ▶ Ver todo ▶  Ver todo  ▶ Ver todo  ▶ Ver   │
│                                              │
│  [imagen destacada del último lanzamiento]   │
└──────────────────────────────────────────────┘
```

Activación: hover (desktop) / tap-expand (mobile). Mantener accesible con teclado (`aria-haspopup`, `aria-expanded`).

### 3.4 Navegación móvil

**Estado actual** (`Navbar.jsx:271-372`):
- Panel full-screen a partir de `lg:` (1024 px) ✅
- Cierre con Escape ✅
- Cierre con click fuera ❌ (no hay overlay)
- Focus-trap ❌
- Indicador de sección activa ❌ en submenús

**Mejoras concretas:**

1. **Bottom-tab en <sm (≤640px).** Apple, Spotify, Instagram lo usan. Reemplaza la barra superior en móvil pequeño:

```
┌─────────────────────────────────┐
│ 🏠 Inicio · 🎵 Música · 🛒 Tienda · 👤 Cuenta │
└─────────────────────────────────┘
```

Esto **reduce el "thumb-zone problem"** y descarga al burger-menu.

2. **Sticky CTA contextual.** En `/eventos/:slug` y `/tienda/:slug` añadir barra inferior fija con el botón de acción principal (`Comprar` / `Conseguir entrada`). Implementar en `EventPage.jsx`, `ProductPage.jsx`.

3. **Indicador de scroll position** en el navbar — opcional pero elegante: una barra de progreso `accent` debajo del header (`Navbar.jsx:134`). Útil en mobile donde el scroll es largo.

### 3.5 Dashboard admin — hallazgos críticos

`DashboardLayout.jsx:87-199`:
- **Mobile (`<md`)**: drawer overlay, pero el `<main>` está en `p-4 md:p-6` ✅.
- **Tablet (`md-lg`)**: sidebar fijo `w-64` ocupa **25% de un viewport de 768 px** — sólo quedan ~570 px para la tabla. **Recomendación**: usar `md:hidden` para la sidebar y mostrar sólo el burger; o hacer `md:w-16` (iconos) automático en tablet.

**Acción:** sustituir la lógica de colapso manual (`DashboardLayout.jsx:45`) por responsive automática:

```jsx
const [collapsed, setCollapsed] = useState(false);
// Auto-collapse en <lg (1024 px)
useEffect(() => {
  const mql = window.matchMedia('(max-width: 1279px)');
  const onChange = (e) => setCollapsed(e.matches);
  onChange(mql);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}, []);
```

Y permitir **doble modo**: el botón de colapso sólo aparece ≥xl.

### 3.6 Reducción de carga cognitiva — quick wins

| Cambio | Dónde | Esfuerzo |
|---|---|---|
| Quitar "Contacto" del Navbar (queda en Footer) | `Navbar.jsx:39` | 1 min |
| Sustituir "Más ▾" por mega-menú con preview visual | `Navbar.jsx:168-219` | 2 h |
| Añadir breadcrumb clicable arriba en mobile (ya existe en Desktop via `Breadcrumbs.jsx`, verificar render en `<sm`) | `Breadcrumbs.jsx:55` | 30 min |
| Añadir "Volver arriba" flotante tras scroll de 80vh | nuevo componente | 1 h |
| Empty states con CTA ("¿Quieres ser el primero? Suscríbete") | `Home.jsx:618,710,...` | 1 h |
| Skeleton loaders en lugar de `Spinner` en listas | nuevo `Skeleton` component | 2 h |
| Búsqueda global con `Cmd+K` | nuevo command palette | 4 h |

---

## 4. Recomendaciones técnicas de implementación

### 4.1 Tailwind config — un solo PR, gran impacto

**`tailwind.config.js` cambios propuestos:**

```js
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    screens: {
      xs:  '480px',
      sm:  '640px',
      md:  '768px',
      lg:  '1024px',
      xl:  '1280px',
      '2xl':'1536px',
      '3xl':'1920px',
      '4xl':'2560px',
    },
    extend: {
      colors: { /* existentes */ },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        sans:    ['Inter', ...defaultTheme.fontFamily.sans],
        body:    ['Inter', ...defaultTheme.fontFamily.sans],
        mono:    ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        eyebrow:  ['11px',  { lineHeight: '1',    letterSpacing: '0.3em'  }],
        kicker:   ['13px',  { lineHeight: '1.2',  letterSpacing: '0.16em' }],
        'display-sm':['clamp(2.25rem,5.5vw,3.5rem)',  { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-md':['clamp(3rem,8vw,5rem)',        { lineHeight: '0.92', letterSpacing: '-0.025em' }],
        'display-lg':['clamp(3.5rem,11.5vw,8.5rem)', { lineHeight: '0.84', letterSpacing: '-0.03em' }],
      },
      maxWidth: {
        '8xl': '88rem', '9xl': '112rem', '10xl': '132rem',
      },
      boxShadow: { /* ver §2.3 */ },
      transitionTimingFunction: { premium: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    },
  },
  plugins: [],
};
```

### 4.2 Hook `useMediaQuery` y `useBreakpoint`

Crear `src/hooks/useBreakpoint.js`:

```js
import { useEffect, useState } from 'react';
const QUERIES = { xs: '(min-width:480px)', sm: '(min-width:640px)', md:'(min-width:768px)', lg:'(min-width:1024px)', xl:'(min-width:1280px)', '2xl':'(min-width:1536px)', '3xl':'(min-width:1920px)', '4xl':'(min-width:2560px)' };
export function useBreakpoint() {
  const get = () => Object.entries(QUERIES).reduce((acc,[k,q]) => (acc[k]=window.matchMedia(q).matches,acc),{});
  const [bp, setBp] = useState(get);
  useEffect(() => {
    const mqls = Object.entries(QUERIES).map(([k,q])=>{const m=window.matchMedia(q); const h=(e)=>setBp(prev=>({...prev,[k]:e.matches})); m.addEventListener('change',h); return [m,h];});
    return () => mqls.forEach(([m,h])=>m.removeEventListener('change',h));
  }, []);
  return bp;
}
```

### 4.3 Hook `useFocusTrap` (accesibilidad menú móvil)

```js
import { useEffect, useRef } from 'react';
export function useFocusTrap(active) {
  const ref = useRef(null);
  useEffect(() => {
    if (!active || !ref.current) return;
    const root = ref.current;
    const sel = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';
    const focusables = () => Array.from(root.querySelectorAll(sel));
    const first = focusables()[0], last = focusables().at(-1);
    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    root.addEventListener('keydown', onKey);
    first?.focus();
    return () => root.removeEventListener('keydown', onKey);
  }, [active]);
  return ref;
}
```

Aplicar en `Navbar.jsx:274` (móvil) y en cualquier modal futuro.

### 4.4 Comandos `package.json` adicionales

```json
"scripts": {
  "lint":        "eslint src --ext .js,.jsx",
  "lint:fix":    "eslint src --ext .js,.jsx --fix",
  "test":        "vitest run",
  "test:watch":  "vitest",
  "test:ui":     "vitest --ui",
  "preview":     "vite preview --host",
  "analyze":     "vite build --mode analyze && vite-plugin-bundle-analyzer",
  "responsive":  "node scripts/responsive-check.mjs"
}
```

### 4.5 Script de verificación responsiva

Crear `scripts/responsive-check.mjs` que:
1. Hace build.
2. Levanta `vite preview --host 0.0.0.0`.
3. Usa Puppeteer para capturar screenshots en **8 viewports**: 360×640, 414×896, 768×1024, 1024×768, 1280×800, 1536×864, 1920×1080, 2560×1080.
4. Compara con snapshots baseline en `scripts/baselines/` y falla el CI si el diff >5%.

### 4.6 Estrategia de despliegue progresivo

| Fase | Entregable | Validación |
|---|---|---|
| 0 (1 día) | Añadir breakpoints 3xl/4xl + tokens §1.1, §2.1 | `npm run lint` + visual manual |
| 1 (1 sem) | Reescribir `Layout/Navbar/Footer` con sistema §1.3 + mega-menú §3.3 | screenshot tests 8 viewports |
| 2 (1 sem) | `ResponsiveImage`, skeleton loaders, empty states | Lighthouse ≥95 perf en todas las páginas |
| 3 (1 sem) | `DashboardLayout` responsive auto + bottom-tab mobile | Pruebas manuales E2E |
| 4 (continuo) | Command palette, sticky CTA, micro-interacciones | Tests visuales + métricas UX (hotjar/MS Clarity) |

### 4.7 Métricas de éxito

Una vez desplegado, medir:

1. **Lighthouse Mobile/Desktop** ≥95 en Performance/Accessibility/Best Practices/SEO en 4 páginas clave (Home, Canciones, Producto, Admin).
2. **CLS** < 0.05 en todas las páginas tras `ResponsiveImage` (§1.5).
3. **Tap-targets ≥44×44 px** en mobile (validar con DevTools "Accessibility tree" + axe).
4. **Tiempo a interactivo** < 2.5 s en Moto G Power (Lighthouse).
5. **Bounce rate mobile** vs desktop — objetivo: ≤1.3× (actualmente suele ser 2×).
6. **NPS por dispositivo** segmentado vía encuesta post-compra.

---

## Apéndice A — Checklist de auditoría por archivo

| Archivo | Líneas clave | Acción prioritaria |
|---|---|---|
| `tailwind.config.js` | 6-67 | Añadir screens 3xl/4xl + fontSize fluido |
| `index.css` | 25-87 | Añadir `.grid-cards`, `.grid-stat`, `.text-balance` |
| `App.jsx` | 7-29 | OK, mantener `ErrorBoundary` outermost |
| `Layout.jsx` | 14-34 | Aplicar container fluido + mover scroll-padding al `html` |
| `Navbar.jsx` | 17-43, 168-219, 271-372 | Mega-menú, focus-trap, bottom-tab <sm, quitar Contacto |
| `Footer.jsx` | 99-194 | Grid 12-cols + ancho fluido hasta 4xl |
| `Breadcrumbs.jsx` | 50-87 | Envolver en contenedor fluido |
| `DashboardLayout.jsx` | 45, 87-199 | Auto-collapse responsive + drawer móvil refactor |
| `Home.jsx` | 216, 393, 506, 532, 842, 937, 1007 | Migrar `clamp` inline → `text-display-*`, unificar grids |
| `ListingPage.jsx` | 62 | Aplicar `.grid-cards` |
| `StorePage.jsx`, `VideosPage.jsx`, `AlbumsPage.jsx` | grids | Aplicar `.grid-cards` |
| `ProductPage.jsx`, `EventPage.jsx`, `SongPage.jsx` | detalles | Sticky CTA mobile |

## Apéndice B — Snippet "modo oscuro/claro"

`tailwind.config.js:3` define `darkMode: 'class'` ✅ pero no hay toggle visible. Si se quiere ofrecer:
- Persistir en `localStorage` con clave `cabaxx-theme`.
- Escuchar `prefers-color-scheme` por defecto.
- Botón en `Navbar.jsx` (icono Sol/Luna de `lucide-react`).

Esto ya queda fuera del alcance responsivo, pero el **color-scheme adaptativo** (degradados y contrastes) debe re-auditarse cuando se active.

---

> **Próximo paso sugerido**: implementar Fase 0 + Fase 1 en un sprint. Medir Lighthouse antes/después en 5 páginas clave. Iterar Fase 2-3 según los cuellos de botella que aparezcan.