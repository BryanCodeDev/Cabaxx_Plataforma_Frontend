import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/constants';

const AUTH_PREFIXES = ['/login', '/register', '/forgot-password', '/reset-password'];

const ROUTE_LABELS = [
  { pattern: /^\/canciones\/[^/]+$/, parent: ROUTES.SONGS, parentLabel: 'Música', dynamic: true },
  { pattern: /^\/canciones$/, to: ROUTES.SONGS, label: 'Música' },
  { pattern: /^\/eventos\/[^/]+$/, parent: ROUTES.EVENTS, parentLabel: 'Eventos', dynamic: true },
  { pattern: /^\/eventos$/, to: ROUTES.EVENTS, label: 'Eventos' },
  { pattern: /^\/noticias\/[^/]+$/, parent: ROUTES.NEWS, parentLabel: 'Noticias', dynamic: true },
  { pattern: /^\/noticias$/, to: ROUTES.NEWS, label: 'Noticias' },
  { pattern: /^\/albumes\/[^/]+$/, parent: ROUTES.ALBUMS, parentLabel: 'Álbumes', dynamic: !0 },
  { pattern: /^\/albumes$/, to: ROUTES.ALBUMS, label: 'Álbumes' },
  { pattern: /^\/videos\/[^/]+$/, parent: ROUTES.VIDEOS, parentLabel: 'Videos', dynamic: !0 },
  { pattern: /^\/videos$/, to: ROUTES.VIDEOS, label: 'Videos' },
  { pattern: /^\/contacto$/, to: ROUTES.CONTACT, label: 'Contacto' },
  { pattern: /^\/blog\/[^/]+$/, parent: ROUTES.BLOG, parentLabel: 'Blog', dynamic: true },
  { pattern: /^\/blog$/, to: ROUTES.BLOG, label: 'Blog' },
  { pattern: /^\/tienda\/[^/]+$/, parent: ROUTES.STORE, parentLabel: 'Tienda', dynamic: true },
  { pattern: /^\/tienda$/, to: ROUTES.STORE, label: 'Tienda' },
  { pattern: /^\/galeria$/, to: ROUTES.GALLERY, label: 'Galería' },
  { pattern: /^\/carrito$/, to: ROUTES.CART, label: 'Carrito' },
  { pattern: /^\/mi-cuenta$/, to: ROUTES.ACCOUNT, label: 'Mi cuenta' },
  { pattern: /^\/mis-pedidos$/, to: ROUTES.MY_ORDERS, label: 'Mis pedidos' },
  { pattern: /^\/checkout$/, to: ROUTES.CHECKOUT, label: 'Checkout' },
];

const prettify = (slug) => slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  if (pathname === '/' || AUTH_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  const match = ROUTE_LABELS.find((r) => r.pattern.test(pathname));
  const crumbs = [{ label: 'Inicio', to: ROUTES.HOME }];

  if (match) {
    if (match.dynamic) {
      crumbs.push({ label: match.parentLabel, to: match.parent });
      crumbs.push({ label: prettify(pathname.split('/').pop()) });
    } else {
      crumbs.push({ label: match.label, to: match.to });
    }
  } else {
    crumbs.push({ label: 'Página' });
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto max-w-7xl animate-in fade-in slide-in-from-top-1 px-4 pt-6 duration-500 sm:px-8"
    >
      <ol className="flex flex-nowrap items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs uppercase tracking-wide text-white/35 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          const isFirst = i === 0;
          return (
            <li key={i} className="flex shrink-0 items-center gap-1.5">
              {c.to && !last ? (
                <Link
                  to={c.to}
                  className="group flex items-center gap-1 rounded transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  {isFirst && <Home className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5" />}
                  <span className="relative">
                    {c.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              ) : (
                <span className={`flex items-center gap-1 ${last ? 'font-semibold text-white/70' : ''}`}>
                  {isFirst && <Home className="h-3.5 w-3.5 shrink-0" />}
                  {c.label}
                </span>
              )}
              {!last && (
                <ChevronRight className="h-3 w-3 shrink-0 text-white/20" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}