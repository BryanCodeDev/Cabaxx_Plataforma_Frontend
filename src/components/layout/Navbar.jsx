import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useArtist } from '@/hooks/useArtist';
import { useCart } from '@/hooks/useCart';
import { ROUTES } from '@/constants';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import Dropdown from '@/components/common/Dropdown';
import {
  ShoppingCart, Menu, X, ChevronDown, Disc3, Film, Image,
  Newspaper, Mail, LayoutDashboard, User, Package, LogOut,
} from 'lucide-react';

const NAV_LINKS = [
  { label: 'Inicio',   to: ROUTES.HOME },
  { label: 'Música',   to: ROUTES.SONGS },
  { label: 'Eventos',  to: ROUTES.EVENTS },
  { label: 'Tienda',   to: ROUTES.STORE },
  { label: 'Blog',     to: ROUTES.BLOG },
];

const MORE_GROUPS = [
  {
    title: 'Multimedia',
    links: [
      { label: 'Álbumes', to: ROUTES.ALBUMS, icon: Disc3 },
      { label: 'Videos',  to: ROUTES.VIDEOS,  icon: Film },
      { label: 'Galería', to: ROUTES.GALLERY, icon: Image },
    ],
  },
  {
    title: 'Comunidad',
    links: [
      { label: 'Noticias', to: ROUTES.NEWS,    icon: Newspaper },
      { label: 'Contacto', to: ROUTES.CONTACT, icon: Mail },
    ],
  },
];
const MORE_LINKS = MORE_GROUPS.flatMap((g) => g.links);

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary';

const linkClass = ({ isActive }) =>
  `relative text-sm font-medium transition-colors ${FOCUS} rounded-sm ${
    isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
  }`;

export default function Navbar() {
  const { user, isAuthenticated, logout, isSuperadmin, isArtistAdmin } = useAuth();
  const { artist } = useArtist();
  const { itemCount } = useCart?.() ?? { itemCount: 0 };
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [moreOpen, setMoreOpen]   = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setMoreOpen(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      setMoreOpen(false);
      setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const moreActive   = MORE_LINKS.some((l) => pathname.startsWith(l.to));
  const artistName   = artist?.stage_name || artist?.name || 'Cabaxx';

  const dropdownItems = [
    ...(isSuperadmin()
      ? [{ label: 'Panel de Control', icon: LayoutDashboard, onClick: () => navigate(ROUTES.SUPERADMIN) }]
      : isArtistAdmin()
      ? [{ label: 'Mi Panel',         icon: LayoutDashboard, onClick: () => navigate(ROUTES.ADMIN) }]
      : []),
    { label: 'Mi cuenta',     icon: User,    onClick: () => navigate(ROUTES.ACCOUNT) },
    { label: 'Mis pedidos',   icon: Package, onClick: () => navigate(ROUTES.MY_ORDERS) },
    { label: 'Cerrar sesión', icon: LogOut,  onClick: logout, danger: true },
  ];

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? 'border-border/60 bg-primary/90 shadow-[0_4px_24px_rgba(0,0,0,0.25)] backdrop-blur-xl'
          : 'border-transparent bg-primary/30 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">

        {/* ── Logo ── */}
        <Link
          to={ROUTES.HOME}
          className={`shrink-0 rounded-md ${FOCUS}`}
          aria-label="Inicio"
        >
          <span className="font-display text-xl tracking-widest text-accent transition-all hover:text-accent/80 sm:text-2xl">
            {artistName.toUpperCase()}
          </span>
        </Link>

        {/* ── Navegación desktop ── */}
        <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Navegación principal">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={linkClass}
              aria-current={pathname === l.to ? 'page' : undefined}
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-px w-full origin-left rounded-full bg-accent transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}

          {/* Menú "Más" */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium transition-colors ${FOCUS} ${
                moreActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
              aria-expanded={moreOpen}
              aria-haspopup="true"
            >
              Más
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {moreOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-card animate-in fade-in slide-in-from-top-1 duration-150">
                  {MORE_GROUPS.map((group, i) => (
                    <div key={group.title} className={i > 0 ? 'mt-1 border-t border-border/60 pt-1' : ''}>
                      <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                        {group.title}
                      </p>
                      {group.links.map((l) => {
                        const Icon = l.icon;
                        return (
                          <NavLink
                            key={l.to}
                            to={l.to}
                            className={({ isActive }) =>
                              `flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${FOCUS} ${
                                isActive
                                  ? 'bg-accent/10 text-accent'
                                  : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                              }`
                            }
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            {l.label}
                          </NavLink>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </nav>

        {/* ── Acciones ── */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Carrito */}
          <Link
            to={ROUTES.CART}
            className={`relative hidden rounded-lg p-2 text-text-secondary transition hover:bg-surface-2 hover:text-text-primary sm:block ${FOCUS}`}
            aria-label="Carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <Dropdown
              trigger={
                <button
                  className={`flex items-center gap-2 rounded-full p-0.5 transition hover:ring-2 hover:ring-accent/40 ${FOCUS}`}
                  aria-label="Menú de cuenta"
                >
                  <Avatar src={user?.avatar_url} name={user?.name} size="sm" />
                  <span className="hidden text-sm font-medium text-text-primary lg:inline">
                    {user?.name}
                  </span>
                </button>
              }
              items={dropdownItems}
            />
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden lg:inline-flex"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Entrar
              </Button>
              <Button size="sm" onClick={() => navigate(ROUTES.REGISTER)}>
                Unirse
              </Button>
            </>
          )}

          {/* Hamburger */}
          <button
            className={`rounded-lg p-2 text-text-primary transition hover:bg-surface-2 lg:hidden ${FOCUS}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Menú móvil ── */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 z-30 flex flex-col bg-primary/98 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-0.5 overflow-y-auto px-4 py-4" aria-label="Navegación móvil">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${FOCUS} ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}

            <p className="mt-4 px-4 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
              Más
            </p>
            {MORE_LINKS.map((l) => {
              const Icon = l.icon;
              return (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${FOCUS} ${
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {l.label}
                </NavLink>
              );
            })}

            {/* Carrito móvil */}
            <Link
              to={ROUTES.CART}
              className={`mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition hover:bg-surface-2 hover:text-text-primary ${FOCUS}`}
            >
              <ShoppingCart className="h-4 w-4 shrink-0" />
              Carrito
              {itemCount > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Panel admin */}
            {isAuthenticated && (isSuperadmin() || isArtistAdmin()) && (
              <NavLink
                to={isSuperadmin() ? ROUTES.SUPERADMIN : ROUTES.ADMIN}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${FOCUS} ${
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                  }`
                }
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                {isSuperadmin() ? 'Panel de Control' : 'Mi Panel'}
              </NavLink>
            )}
          </nav>

          {/* Footer del menú móvil */}
          <div className="border-t border-border/40 px-4 py-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Avatar src={user?.avatar_url} name={user?.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-text-primary">{user?.name}</p>
                  <p className="truncate text-xs text-text-muted">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className={`rounded-lg p-2 text-text-muted transition hover:text-accent ${FOCUS}`}
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" fullWidth onClick={() => navigate(ROUTES.LOGIN)}>
                  Entrar
                </Button>
                <Button fullWidth onClick={() => navigate(ROUTES.REGISTER)}>
                  Unirse
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}