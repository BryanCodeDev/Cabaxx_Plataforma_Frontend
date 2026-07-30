import { useState } from 'react';
import { NavLink, useLocation, Outlet, Link } from 'react-router-dom';
import {
  Home, Music, Disc3, Calendar, ShoppingBag, Package, Film,
  FileText, Image, Mail, BarChart3, Settings,
  ChevronLeft, ChevronRight, X, Menu, ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useArtist } from '@/hooks/useArtist';
import { ROUTES, FOCUS_SURFACE } from '@/constants';
import { classNames } from '@/utils/classNames';
import Button from '@/components/common/Button';
import { Avatar } from '@/components/common';

const SIDEBAR_LINKS = [
  { to: ROUTES.ADMIN, label: 'Inicio', icon: Home, end: true },
  { to: ROUTES.ADMIN_SONGS, label: 'Canciones', icon: Music },
  { to: ROUTES.ADMIN_ALBUMS, label: 'Álbumes', icon: Disc3 },
  { to: ROUTES.ADMIN_EVENTS, label: 'Eventos', icon: Calendar },
  { to: ROUTES.ADMIN_STORE, label: 'Tienda', icon: ShoppingBag },
  { to: ROUTES.ADMIN_ORDERS, label: 'Pedidos', icon: Package },
  { to: ROUTES.ADMIN_VIDEOS, label: 'Videos', icon: Film },
  { to: ROUTES.ADMIN_NEWS, label: 'Noticias', icon: FileText },
  { to: ROUTES.ADMIN_GALLERY, label: 'Galería', icon: Image },
  { to: ROUTES.ADMIN_NEWSLETTER, label: 'Newsletter', icon: Mail },
  { to: ROUTES.ADMIN_ANALYTICS, label: 'Analíticas', icon: BarChart3 },
  { to: ROUTES.ADMIN_SETTINGS, label: 'Configuración', icon: Settings },
];

const linkStyle = (isActive, iconOnly, collapsed) =>
  classNames(
    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
    iconOnly ? 'justify-center' : '',
    isActive
      ? 'bg-accent/15 text-accent shadow-[inset_2px_0_0_0_theme(colors.accent)]'
      : 'text-white/50 hover:translate-x-0.5 hover:bg-white/[0.04] hover:text-white',
    FOCUS_SURFACE
  );

export default function DashboardLayout({ children, breadcrumb = '' }) {
  const { user, logout, isArtistAdmin, isSuperadmin } = useAuth();
  const { artist } = useArtist();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const allLinks = SIDEBAR_LINKS;

  const activeLabel = allLinks.find((l) =>
    l.end ? pathname === l.to : pathname.startsWith(l.to)
  )?.label;

  const renderLinks = (iconOnly) => (
    <>
      {SIDEBAR_LINKS.map((l) => {
        const Icon = l.icon;
        return (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => linkStyle(isActive, iconOnly, collapsed)}
          >
            <Icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
            {!iconOnly && !collapsed && <span>{l.label}</span>}
          </NavLink>
          );
      })}
      <div className={classNames('mt-auto pt-2', collapsed ? 'hidden' : '')}>
        <NavLink
          to={ROUTES.HOME}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) => linkStyle(isActive, iconOnly, collapsed)}
        >
          <ExternalLink className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
          {!iconOnly && !collapsed && <span>Ver sitio</span>}
        </NavLink>
      </div>
    </>
  );

  const siteName = artist?.stage_name || artist?.name || 'Cabaxx';

  return (
    <div className="flex min-h-screen bg-black">
      <aside
        className={classNames(
          'hidden shrink-0 flex-col border-r border-white/10 bg-[#0a0a0a] transition-all duration-300 md:flex h-full min-h-0',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-4">
          <Link
            to={ROUTES.HOME}
            className={classNames(
              'font-display text-xl uppercase tracking-wide text-accent transition hover:text-accent/80',
              collapsed ? 'text-center w-full' : ''
            )}
          >
            {!collapsed ? siteName : 'C'}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`rounded p-1 text-white/40 transition-all duration-200 hover:bg-white/5 hover:text-white ${FOCUS_SURFACE}`}
            aria-label="Colapsar menú"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto min-h-0 space-y-1 p-3">{renderLinks(false)}</nav>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="animate-in fade-in absolute inset-0 bg-black/70 duration-200"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="animate-in slide-in-from-left duration-300 absolute left-0 top-0 flex h-full w-64 flex-col border-r border-white/10 bg-[#0a0a0a] p-3 shadow-2xl overflow-hidden">
            <div className="mb-4 flex h-12 shrink-0 items-center justify-between px-1">
              <Link to={ROUTES.HOME} className="font-display text-xl uppercase tracking-wide text-accent transition-transform duration-300 hover:scale-105 inline-block">
                {siteName}
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className={`text-white/40 transition hover:rotate-90 hover:text-white ${FOCUS_SURFACE} rounded duration-200`}
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto min-h-0 space-y-1">{renderLinks(true)}</nav>
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col min-h-0">
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#0a0a0a] px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className={`rounded-md p-1 text-xl text-white transition-colors hover:bg-white/5 md:hidden ${FOCUS_SURFACE}`}
               aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
            </button>
            <NavLink to={ROUTES.HOME} className={classNames('hidden items-center gap-1 text-white/40 transition-all duration-200 hover:-translate-y-0.5 hover:text-accent sm:flex', FOCUS_SURFACE)}>
              <ExternalLink className="h-4 w-4" />
              <span className="text-xs">Volver al sitio</span>
            </NavLink>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
                {isSuperadmin() ? 'Panel de Control' : 'Panel'}
              </p>
              <h1 className="text-sm font-semibold text-white">
                {activeLabel || breadcrumb}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isSuperadmin() && (
              <span className="hidden rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent sm:inline">
                Superadmin
              </span>
            )}
            {isArtistAdmin() && !isSuperadmin() && (
              <span className="hidden rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-accent sm:inline">
                Artista
              </span>
            )}
            <Avatar src={user?.avatar_url} name={user?.name} size="sm" />
            <span className="hidden text-sm text-white sm:inline">{user?.name}</span>
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white" onClick={logout}>
              Salir
            </Button>
          </div>
        </header>
        <main key={pathname} className="animate-in fade-in flex-1 bg-black p-4 duration-300 md:p-6">{children}<Outlet /></main>
      </div>
    </div>
  );
}