import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ROUTES } from '@/constants';

const AUTH_PREFIXES = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];

// Rutas donde NO queremos mostrar breadcrumb (ya tienen su propia navegación interna)
const HIDDEN_PATHS = ['/', '/admin', '/superadmin'];

const ROUTE_LABELS = [
  { pattern: /^\/canciones\/[^/]+$/,  parent: ROUTES.SONGS,   parentLabel: 'Música',       dynamic: true },
  { pattern: /^\/canciones$/,          to: ROUTES.SONGS,       label: 'Música' },
  { pattern: /^\/albumes\/[^/]+$/,    parent: ROUTES.ALBUMS,  parentLabel: 'Álbumes',      dynamic: true },
  { pattern: /^\/albumes$/,            to: ROUTES.ALBUMS,      label: 'Álbumes' },
  { pattern: /^\/videos\/[^/]+$/,     parent: ROUTES.VIDEOS,  parentLabel: 'Videos',       dynamic: true },
  { pattern: /^\/videos$/,             to: ROUTES.VIDEOS,      label: 'Videos' },
  { pattern: /^\/eventos\/[^/]+$/,    parent: ROUTES.EVENTS,  parentLabel: 'Eventos',      dynamic: true },
  { pattern: /^\/eventos$/,            to: ROUTES.EVENTS,      label: 'Eventos' },
  { pattern: /^\/noticias\/[^/]+$/,   parent: ROUTES.NEWS,    parentLabel: 'Noticias',     dynamic: true },
  { pattern: /^\/noticias$/,           to: ROUTES.NEWS,        label: 'Noticias' },
  { pattern: /^\/blog\/[^/]+$/,       parent: ROUTES.BLOG,    parentLabel: 'Blog',         dynamic: true },
  { pattern: /^\/blog$/,              to: ROUTES.BLOG,        label: 'Blog' },
  { pattern: /^\/tienda\/[^/]+$/,     parent: ROUTES.STORE,   parentLabel: 'Tienda',       dynamic: true },
  { pattern: /^\/tienda$/,             to: ROUTES.STORE,       label: 'Tienda' },
  { pattern: /^\/galeria$/,            to: ROUTES.GALLERY,     label: 'Galería' },
  { pattern: /^\/carrito$/,            to: ROUTES.CART,        label: 'Carrito' },
  { pattern: /^\/checkout$/,           to: ROUTES.CHECKOUT,    label: 'Checkout' },
  { pattern: /^\/contacto$/,           to: ROUTES.CONTACT,     label: 'Contacto' },
  { pattern: /^\/mi-cuenta$/,         to: ROUTES.ACCOUNT,     label: 'Mi cuenta' },
  { pattern: /^\/mis-pedidos$/,       to: ROUTES.MY_ORDERS,   label: 'Mis pedidos' },
  { pattern: /^\/superadmin\/onboarding$/, parent: ROUTES.SUPERADMIN, parentLabel: 'Panel de Artistas', dynamic: true },
  { pattern: /^\/superadmin$/,         to: ROUTES.SUPERADMIN,  label: 'Panel de Artistas' },
];

const prettify = (slug) =>
  slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function Breadcrumbs() {
  const { pathname } = useLocation();

  // Ocultar en rutas específicas y en rutas de auth
  if (
    HIDDEN_PATHS.includes(pathname) ||
    AUTH_PREFIXES.some((p) => pathname.startsWith(p))
  ) return null;

  const match  = ROUTE_LABELS.find((r) => r.pattern.test(pathname));
  const crumbs = [{ label: 'Inicio', to: ROUTES.HOME, icon: true }];

  if (match) {
    if (match.dynamic) {
      crumbs.push({ label: match.parentLabel, to: match.parent });
      crumbs.push({ label: prettify(pathname.split('/').pop()) });
    } else {
      crumbs.push({ label: match.label, to: match.to });
    }
  }

  // Solo mostrar si hay más de 1 crumb (no en páginas raíz sin padres)
  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Ruta de navegación" className="mx-auto max-w-6xl px-4 pt-5 pb-1">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-text-muted">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {c.to && !last ? (
                <Link
                  to={c.to}
                  className="flex items-center gap-1 rounded transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
                >
                  {c.icon && <Home className="h-3 w-3" />}
                  {c.label}
                </Link>
              ) : (
                <span className={last ? 'font-medium text-text-secondary' : ''}>
                  {c.label}
                </span>
              )}
              {!last && (
                <ChevronRight className="h-3 w-3 text-text-muted/50" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}