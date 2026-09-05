import { useLocation, Link } from 'react-router-dom';
import { Menu, ChevronRight, Search, Bell, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { ROUTES, FOCUS } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import ThemeToggle from '@/components/common/ThemeToggle';
import { classNames } from '@/utils/classNames';

const TITLES = {
  [ROUTES.ADMIN]:             { eyebrow: 'Resumen',     title: 'Panel de control' },
  [ROUTES.ADMIN_SONGS]:       { eyebrow: 'Catálogo',    title: 'Canciones' },
  [ROUTES.ADMIN_ALBUMS]:      { eyebrow: 'Catálogo',    title: 'Álbumes' },
  [ROUTES.ADMIN_VIDEOS]:      { eyebrow: 'Catálogo',    title: 'Videos' },
  [ROUTES.ADMIN_GALLERY]:     { eyebrow: 'Catálogo',    title: 'Galería' },
  [ROUTES.ADMIN_EVENTS]:      { eyebrow: 'Operaciones', title: 'Eventos' },
  [ROUTES.ADMIN_STORE]:       { eyebrow: 'Operaciones', title: 'Tienda' },
  [ROUTES.ADMIN_ORDERS]:      { eyebrow: 'Operaciones', title: 'Pedidos' },
  [ROUTES.ADMIN_NEWS]:        { eyebrow: 'Operaciones', title: 'Noticias' },
  [ROUTES.ADMIN_ANALYTICS]:   { eyebrow: 'Insights',    title: 'Analíticas' },
  [ROUTES.ADMIN_SETTINGS]:    { eyebrow: 'Insights',    title: 'Configuración' },
};

function resolveMeta(pathname) {
  if (TITLES[pathname]) return TITLES[pathname];
  // Fallback por prefijo
  const entry = Object.entries(TITLES).find(([path]) => pathname.startsWith(path + '/'));
  return entry?.[1] || { eyebrow: 'Admin', title: 'Panel' };
}

export default function AdminTopbar({ onMobileMenu }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const meta = resolveMeta(pathname);

  return (
    <header
      role="banner"
      className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.06] bg-app-deep/80 px-4 backdrop-blur-md sm:px-6"
    >
      {/* Burger — solo mobile */}
      <button
        type="button"
        onClick={onMobileMenu}
        aria-label="Abrir menú del panel"
        className={classNames(
          'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-white/70 transition hover:border-white/15 hover:text-white lg:hidden',
          FOCUS
        )}
      >
        <Menu className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Breadcrumb + título */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
          <span>{meta.eyebrow}</span>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <span className="text-accent">{meta.title}</span>
        </div>
        <h1 className="mt-0.5 truncate font-display text-base font-bold uppercase tracking-wide text-white sm:text-lg">
          {meta.title}
        </h1>
      </div>

      {/* Search */}
      <label className="relative hidden md:block">
        <span className="sr-only">Buscar en el panel</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" aria-hidden="true" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar…"
          className={classNames(
            'h-9 w-56 rounded-lg border border-white/[0.06] bg-white/[0.03] pl-8 pr-3 text-xs text-white placeholder:text-white/30 transition focus:border-accent/40 focus:bg-white/[0.06] focus:outline-none',
            FOCUS
          )}
        />
      </label>

      {/* Acciones */}
      <div className="flex items-center gap-1.5">
        <Link
          to={ROUTES.HOME}
          className={classNames(
            'hidden h-9 items-center gap-1.5 rounded-lg border border-white/[0.06] px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/55 transition hover:border-white/15 hover:text-white sm:inline-flex',
            FOCUS
          )}
          aria-label="Ver sitio público"
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          Ver sitio
        </Link>
        <button
          type="button"
          aria-label="Notificaciones"
          className={classNames(
            'relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-white/55 transition hover:border-white/15 hover:text-white',
            FOCUS
          )}
        >
          <Bell className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_rgba(255,59,92,0.8)]" aria-hidden="true" />
        </button>
        <ThemeToggle variant="icon" />
        <div className="ml-1 hidden h-8 w-px bg-white/[0.08] sm:block" />
        <p className="hidden truncate text-xs text-white/55 sm:block sm:max-w-[140px]">
          {user?.name || 'Admin'}
        </p>
      </div>
    </header>
  );
}
