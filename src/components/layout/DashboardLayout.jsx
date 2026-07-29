import { useState } from 'react';
import { NavLink, useLocation, Outlet, Link } from 'react-router-dom';
import {
  Home, Music, Disc3, Calendar, ShoppingBag, Package, Film,
  FileText, Image, Mail, BarChart3, Settings, Shield,
  ChevronLeft, ChevronRight, X, Menu, ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useArtist } from '@/hooks/useArtist';
import { ROUTES } from '@/constants';
import { classNames } from '@/utils/classNames';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';

const SIDEBAR_LINKS = [
  { to: ROUTES.ADMIN,         label: 'Inicio',      icon: Home,        end: true },
  { to: ROUTES.ADMIN_SONGS,   label: 'Canciones',   icon: Music },
  { to: ROUTES.ADMIN_ALBUMS,  label: 'Álbumes',     icon: Disc3 },
  { to: ROUTES.ADMIN_EVENTS,  label: 'Eventos',     icon: Calendar },
  { to: ROUTES.ADMIN_STORE,   label: 'Tienda',      icon: ShoppingBag },
  { to: ROUTES.ADMIN_ORDERS,  label: 'Pedidos',     icon: Package },
  { to: ROUTES.ADMIN_VIDEOS,  label: 'Videos',      icon: Film },
  { to: ROUTES.ADMIN_NEWS,    label: 'Noticias',    icon: FileText },
  { to: ROUTES.ADMIN_GALLERY, label: 'Galería',     icon: Image },
];

const SUPERADMIN_LINKS = [
  { to: ROUTES.ADMIN_NEWSLETTER, label: 'Newsletter',    icon: Mail },
  { to: ROUTES.ADMIN_ANALYTICS,  label: 'Analíticas',   icon: BarChart3 },
  { to: ROUTES.ADMIN_SETTINGS,   label: 'Configuración', icon: Settings },
];

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface';

function SidebarLink({ to, label, icon: Icon, end, collapsed, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        classNames(
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
          collapsed ? 'justify-center' : '',
          isActive
            ? 'bg-accent/12 text-accent shadow-[inset_0_0_0_1px_rgba(230,57,70,0.2)]'
            : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary',
          FOCUS
        )
      }
    >
      <Icon className="h-4.5 w-4.5 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}

export default function DashboardLayout({ children, breadcrumb = '' }) {
  const { user, logout, isSuperadmin, isArtistAdmin } = useAuth();
  const { artist } = useArtist();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const allLinks = [...SIDEBAR_LINKS, ...(isSuperadmin() ? SUPERADMIN_LINKS : [])];

  const activeLabel = allLinks.find((l) =>
    l.end ? pathname === l.to : pathname.startsWith(l.to)
  )?.label;

  const siteName = artist?.stage_name || artist?.name || 'Cabaxx';

  const SidebarContent = ({ onClose }) => (
    <>
      {/* Links principales */}
      <div className="space-y-0.5">
        {SIDEBAR_LINKS.map((l) => (
          <SidebarLink
            key={l.to}
            {...l}
            collapsed={collapsed}
            onClick={onClose}
          />
        ))}
      </div>

      {/* Links superadmin */}
      {isSuperadmin() && (
        <>
          <div className="my-3 border-t border-border/60" />
          <p className={classNames(
            'mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted',
            collapsed ? 'hidden' : ''
          )}>
            Superadmin
          </p>
          <div className="space-y-0.5">
            {SUPERADMIN_LINKS.map((l) => (
              <SidebarLink key={l.to} {...l} collapsed={collapsed} onClick={onClose} />
            ))}
            <SidebarLink
              to={ROUTES.SUPERADMIN}
              label="Panel de Control"
              icon={Shield}
              collapsed={collapsed}
              onClick={onClose}
            />
          </div>
        </>
      )}

      {/* Ver sitio — siempre al fondo */}
      <div className={classNames('mt-auto pt-3 border-t border-border/40', collapsed ? 'hidden' : '')}>
        <NavLink
          to={ROUTES.HOME}
          onClick={onClose}
          className={({ isActive }) =>
            classNames(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
              isActive
                ? 'bg-accent/10 text-accent'
                : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary',
              FOCUS
            )
          }
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          <span>Ver sitio</span>
        </NavLink>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-primary">

      {/* ── Sidebar desktop ── */}
      <aside
        className={classNames(
          'hidden shrink-0 flex-col border-r border-border/60 bg-surface transition-all duration-300 md:flex h-screen sticky top-0',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Header sidebar */}
        <div className="flex h-16 shrink-0 items-center justify-between px-4">
          <Link
            to={ROUTES.HOME}
            className={classNames(
              'font-display tracking-widest text-accent transition hover:text-accent/80',
              collapsed ? 'text-center w-full text-base' : 'text-lg'
            )}
          >
            {collapsed ? siteName.charAt(0).toUpperCase() : siteName.toUpperCase()}
          </Link>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className={`rounded-lg p-1.5 text-text-muted transition hover:bg-surface-2 hover:text-text-primary ${FOCUS}`}
              aria-label="Colapsar menú"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Toggle cuando está colapsado */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className={`mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface-2 hover:text-text-primary ${FOCUS}`}
            aria-label="Expandir menú"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {/* Links */}
        <nav className="flex flex-1 flex-col overflow-y-auto min-h-0 p-3">
          <SidebarContent onClose={undefined} />
        </nav>
      </aside>

      {/* ── Sidebar móvil (drawer) ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-border/60 bg-surface">
            <div className="flex h-16 shrink-0 items-center justify-between px-4">
              <Link
                to={ROUTES.HOME}
                className="font-display text-lg tracking-widest text-accent transition hover:text-accent/80"
              >
                {siteName.toUpperCase()}
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg p-1.5 text-text-muted transition hover:bg-surface-2 hover:text-text-primary ${FOCUS}`}
                aria-label="Cerrar menú"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col overflow-y-auto min-h-0 p-3">
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </nav>
          </aside>
        </div>
      )}

      {/* ── Main ── */}
      <div className="flex flex-1 flex-col min-h-0 min-w-0">

        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-surface px-4 md:px-6">
          <div className="flex items-center gap-3">
            {/* Hamburger móvil */}
            <button
              onClick={() => setMobileOpen(true)}
              className={`rounded-lg p-1.5 text-text-primary transition hover:bg-surface-2 md:hidden ${FOCUS}`}
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Volver al sitio (desktop) */}
            <Link
              to={ROUTES.HOME}
              className={classNames(
                'hidden items-center gap-1.5 rounded-lg px-2 py-1 text-text-muted transition hover:bg-surface-2 hover:text-accent sm:flex',
                FOCUS
              )}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Ver sitio</span>
            </Link>

            {/* Breadcrumb */}
            <div className="border-l border-border/60 pl-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                {isSuperadmin() ? 'Panel de Control' : 'Panel Admin'}
              </p>
              <h1 className="text-sm font-semibold text-text-primary">
                {activeLabel || breadcrumb || 'Dashboard'}
              </h1>
            </div>
          </div>

          {/* Perfil */}
          <div className="flex items-center gap-3">
            {isSuperadmin() && (
              <span className="hidden rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-bold text-accent sm:inline">
                Superadmin
              </span>
            )}
            {isArtistAdmin() && !isSuperadmin() && (
              <span className="hidden rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-bold text-gold sm:inline">
                Artista
              </span>
            )}
            <Avatar src={user?.avatar_url} name={user?.name} size="sm" />
            <span className="hidden max-w-[120px] truncate text-sm font-medium text-text-primary sm:inline">
              {user?.name}
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              Salir
            </Button>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
          <Outlet />
        </main>
      </div>
    </div>
  );
}