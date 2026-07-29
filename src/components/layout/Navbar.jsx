import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useArtist } from '@/hooks/useArtist';
import { ROUTES } from '@/constants';
import Button from '@/components/common/Button';
import { Avatar } from '@/components/common';
import Dropdown from '@/components/common/Dropdown';
import {
  ShoppingCart, Menu, X, ChevronDown, Disc3, Film, Image,
  Newspaper, Mail, LayoutDashboard, User, Package, LogOut,
} from 'lucide-react';

// Enlaces principales, siempre visibles en desktop.
const NAV_LINKS = [
  { label: 'Inicio', to: ROUTES.HOME },
  { label: 'Música', to: ROUTES.SONGS },
  { label: 'Eventos', to: ROUTES.EVENTS },
  { label: 'Tienda', to: ROUTES.STORE },
  { label: 'Blog', to: ROUTES.BLOG },
];

// Enlaces secundarios, agrupados por tema dentro del menú "Más".
const MORE_GROUPS = [
  {
    title: 'Multimedia',
    links: [
      { label: 'Álbumes', to: ROUTES.ALBUMS, icon: Disc3 },
      { label: 'Videos', to: ROUTES.VIDEOS, icon: Film },
      { label: 'Galería', to: ROUTES.GALLERY, icon: Image },
    ],
  },
  {
    title: 'Comunidad',
    links: [
      { label: 'Noticias', to: ROUTES.NEWS, icon: Newspaper },
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
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  // Cierra menús con Escape y bloquea el scroll del body con el drawer móvil abierto.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      setMoreOpen(false);
      setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const moreActive = MORE_LINKS.some((l) => pathname.startsWith(l.to));
  const artistName = artist?.name || 'Cabaxx';

  const dropdownItems = [
    ...(isSuperadmin()
      ? [{ label: 'Panel de Control', icon: LayoutDashboard, onClick: () => navigate(ROUTES.SUPERADMIN) }]
      : isArtistAdmin()
      ? [{ label: 'Mi Panel', icon: LayoutDashboard, onClick: () => navigate(ROUTES.ADMIN) }]
      : []),
    { label: 'Mi cuenta', icon: User, onClick: () => navigate(ROUTES.ACCOUNT) },
    { label: 'Mis pedidos', icon: Package, onClick: () => navigate(ROUTES.MY_ORDERS) },
    { label: 'Cerrar sesión', icon: LogOut, onClick: logout, danger: true },
  ];

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled
          ? 'border-border bg-primary/90 shadow-sm backdrop-blur-md'
          : 'border-transparent bg-primary/40 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link to={ROUTES.HOME} className={`shrink-0 rounded-md ${FOCUS}`} aria-label="Inicio">
          <span className="font-display text-xl tracking-wide text-accent transition-transform hover:scale-105 sm:text-2xl">
            {artistName}
          </span>
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Navegación principal">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} aria-current={pathname === l.to ? 'page' : undefined}>
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 w-full origin-left bg-accent transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}

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
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
            {moreOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-xl border border-border bg-surface p-2 shadow-card animate-in fade-in slide-in-from-top-1 duration-150">
                  {MORE_GROUPS.map((group, i) => (
                    <div key={group.title} className={i > 0 ? 'mt-1 border-t border-border pt-1' : ''}>
                      <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">
                        {group.title}
                      </p>
                      {group.links.map((l) => {
                        const Icon = l.icon;
                        return (
                          <NavLink
                            key={l.to}
                            to={l.to}
                            className={({ isActive }) =>
                              `flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${FOCUS} ${
                                isActive ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
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

        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            to={ROUTES.CART}
            className={`hidden rounded-md p-1.5 text-text-secondary transition hover:text-text-primary sm:block ${FOCUS}`}
            aria-label="Carrito"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {isAuthenticated ? (
            <Dropdown
              trigger={
                <button className={`flex items-center gap-2 rounded-full ${FOCUS}`} aria-label="Menú de cuenta">
                  <Avatar src={user?.avatar_url} name={user?.name} size="sm" />
                  <span className="hidden text-sm font-medium text-text-primary lg:inline">{user?.name}</span>
                </button>
              }
              items={dropdownItems}
            />
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hidden lg:inline-flex" onClick={() => navigate(ROUTES.LOGIN)}>
                Login
              </Button>
              <Button size="sm" onClick={() => navigate(ROUTES.REGISTER)}>
                Unirse
              </Button>
            </>
          )}

          <button
            className={`rounded-md p-1.5 text-text-primary lg:hidden ${FOCUS}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil: panel en flujo, igual mecanismo que la versión original */}
      {menuOpen && (
        <div className="border-t border-border bg-primary lg:hidden">
          <nav className="flex flex-col gap-1 p-4" aria-label="Navegación móvil">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium transition ${FOCUS} ${
                    isActive ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}

            <p className="mt-3 px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">
              Más
            </p>
            {MORE_LINKS.map((l) => {
              const Icon = l.icon;
              return (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${FOCUS} ${
                      isActive ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {l.label}
                </NavLink>
              );
            })}

            <Link
              to={ROUTES.CART}
              className={`mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-surface-2 hover:text-text-primary ${FOCUS}`}
            >
              <ShoppingCart className="h-4 w-4 shrink-0" />
              Carrito
            </Link>

            {isAuthenticated && (isSuperadmin() || isArtistAdmin()) && (
              <NavLink
                to={isSuperadmin() ? ROUTES.SUPERADMIN : ROUTES.ADMIN}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${FOCUS} ${
                    isActive ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                  }`
                }
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                {isSuperadmin() ? 'Panel de Control' : 'Mi Panel'}
              </NavLink>
            )}

            {isAuthenticated ? (
              <div className="mt-2 flex items-center gap-3 border-t border-border px-3 pt-3">
                <Avatar src={user?.avatar_url} name={user?.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">{user?.name}</p>
                </div>
                <button
                  onClick={logout}
                  className={`rounded-md p-2 text-text-muted transition hover:text-text-primary ${FOCUS}`}
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="mt-2 flex gap-2 border-t border-border pt-3">
                <Button variant="ghost" fullWidth onClick={() => navigate(ROUTES.LOGIN)}>
                  Login
                </Button>
                <Button fullWidth onClick={() => navigate(ROUTES.REGISTER)}>
                  Unirse
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}