import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  LayoutDashboard, Music, Disc3, Calendar, ShoppingBag, Package,
  Film, FileText, Image, BarChart3, Settings as SettingsIcon,
  ExternalLink, ChevronRight, Sparkles, LogOut,
} from 'lucide-react';
import { ROUTES, FOCUS } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useArtist } from '@/hooks/useArtist';
import { Avatar } from '@/components/common';
import { classNames } from '@/utils/classNames';

export const NAV_GROUPS = [
  {
    title: 'Resumen',
    items: [
      { label: 'Panel', to: ROUTES.ADMIN, icon: LayoutDashboard, end: true },
    ],
  },
  {
    title: 'Catálogo',
    items: [
      { label: 'Canciones', to: ROUTES.ADMIN_SONGS, icon: Music },
      { label: 'Álbumes', to: ROUTES.ADMIN_ALBUMS, icon: Disc3 },
      { label: 'Videos', to: ROUTES.ADMIN_VIDEOS, icon: Film },
      { label: 'Galería', to: ROUTES.ADMIN_GALLERY, icon: Image },
    ],
  },
  {
    title: 'Operaciones',
    items: [
      { label: 'Eventos', to: ROUTES.ADMIN_EVENTS, icon: Calendar },
      { label: 'Tienda', to: ROUTES.ADMIN_STORE, icon: ShoppingBag },
      { label: 'Pedidos', to: ROUTES.ADMIN_ORDERS, icon: Package },
      { label: 'Noticias', to: ROUTES.ADMIN_NEWS, icon: FileText },
    ],
  },
  {
    title: 'Insights',
    items: [
      { label: 'Analíticas', to: ROUTES.ADMIN_ANALYTICS, icon: BarChart3 },
      { label: 'Configuración', to: ROUTES.ADMIN_SETTINGS, icon: SettingsIcon },
    ],
  },
];

/* Item con tooltip cuando el sidebar está colapsado */
export function NavItem({ item, collapsed }) {
  const Icon = item.icon;
  return (
    <li>
      <NavLink
        to={item.to}
        end={item.end}
        title={collapsed ? item.label : undefined}
        aria-label={item.label}
        className={({ isActive }) =>
          classNames(
            'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
            FOCUS,
            isActive
              ? 'bg-gradient-to-r from-accent/20 via-accent/10 to-transparent text-white shadow-[inset_0_0_0_1px_rgba(255,59,92,0.35)]'
              : 'text-white/65 hover:bg-white/[0.05] hover:text-white',
            collapsed && 'justify-center px-2'
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.span
                layoutId="admin-nav-indicator"
                className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-accent shadow-[0_0_12px_rgba(255,59,92,0.7)]"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Icon
              className={classNames(
                'h-[18px] w-[18px] shrink-0 transition-colors',
                isActive ? 'text-accent' : 'text-white/55 group-hover:text-white'
              )}
              aria-hidden="true"
            />
            {!collapsed && (
              <span className="flex-1 truncate">{item.label}</span>
            )}
            {!collapsed && isActive && (
              <ChevronRight className="h-3.5 w-3.5 text-accent/80" aria-hidden="true" />
            )}
          </>
        )}
      </NavLink>
    </li>
  );
}

export default function AdminSidebar({ collapsed, onToggleCollapse }) {
  const { user, logout } = useAuth();
  const { artist } = useArtist();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [signingOut, setSigningOut] = useState(false);

  const artistName = artist?.stage_name || artist?.name || 'Cabaxx';

  const handleSignOut = async () => {
    setSigningOut(true);
    try { await logout(); } finally { navigate(ROUTES.LOGIN, { replace: true }); }
  };

  return (
    <aside
      aria-label="Navegación del panel administrativo"
      className={classNames(
        'sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-white/[0.06] bg-[#080808]/95 backdrop-blur-md transition-[width] duration-300 ease-premium lg:flex',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* ── Brand header ── */}
      <div className={classNames(
        'flex shrink-0 items-center gap-3 border-b border-white/[0.06] px-4 py-4',
        collapsed && 'justify-center px-2'
      )}>
        <Link
          to={ROUTES.HOME}
          aria-label="Ir al sitio público"
          className={classNames(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-[#E0203F] text-sm font-black text-white shadow-[0_4px_18px_rgba(255,59,92,0.35)] transition-transform hover:scale-105',
            FOCUS
          )}
        >
          C
        </Link>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-bold uppercase leading-none tracking-wider text-white">
              {artistName}
            </p>
            <p className="mt-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              Panel Admin
            </p>
          </div>
        )}
      </div>

      {/* ── Scroll area (independiente) ── */}
      <nav
        aria-label="Secciones del panel"
        className="admin-scroll flex-1 space-y-5 overflow-y-auto px-3 py-5"
      >
        {NAV_GROUPS.map((group) => {
          const groupActive = group.items.some((i) => pathname === i.to || (i.end ? false : pathname.startsWith(i.to + '/')));
          return (
            <div key={group.title}>
              {!collapsed && (
                <p className={classNames(
                  'mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors',
                  groupActive ? 'text-white/55' : 'text-white/30'
                )}>
                  {group.title}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem key={item.to} item={item} collapsed={collapsed} />
                ))}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* ── Footer del sidebar (cuenta + colapso) ── */}
      <div className="shrink-0 border-t border-white/[0.06] p-3">
        <div className={classNames(
          'flex items-center gap-3 rounded-xl bg-white/[0.03] p-2.5',
          collapsed && 'justify-center'
        )}>
          <Avatar src={user?.avatar_url} name={user?.name} size="sm" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{user?.name || 'Admin'}</p>
              <p className="truncate text-[10px] text-white/40">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              aria-label="Cerrar sesión"
              className={classNames(
                'rounded-md p-1.5 text-white/45 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50',
                FOCUS
              )}
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="mt-2 flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
            aria-pressed={collapsed}
            className={classNames(
              'flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.06] px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40 transition hover:border-white/15 hover:text-white/80',
              FOCUS
            )}
          >
            <ChevronRight className={classNames('h-3 w-3 transition-transform', !collapsed && 'rotate-180')} aria-hidden="true" />
            {!collapsed && 'Colapsar'}
          </button>
          {!collapsed && (
            <Link
              to={ROUTES.HOME}
              className={classNames(
                'flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] text-white/40 transition hover:border-white/15 hover:text-white/80',
                FOCUS
              )}
              aria-label="Ver sitio"
              title="Ver sitio"
            >
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
