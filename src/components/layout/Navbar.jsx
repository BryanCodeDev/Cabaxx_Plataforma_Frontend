import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useArtist } from '@/hooks/useArtist';
import { ROUTES, FOCUS } from '@/constants';
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

const linkClass = ({ isActive }) =>
  `relative py-2 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors ${FOCUS} rounded-sm ${
    isActive ? 'text-white' : 'text-white/55 hover:text-white'
  }`;

/** Marca de tres barras que pulsan — el elemento de firma de Cabaxx, presente en navbar y footer. */
function PulseMark({ className = '' }) {
  return (
    <span className={`inline-flex items-end gap-[3px] ${className}`} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-accent"
          style={{
            height: '12px',
            animation: `pulseBar 1.1s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulseBar {
          0%, 100% { transform: scaleY(0.35); opacity: .55; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </span>
  );
}

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

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      setMoreOpen(false);
      setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

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
      className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? 'border-white/10 bg-black/75 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to={ROUTES.HOME} className={`group flex shrink-0 items-center gap-2.5 rounded-md ${FOCUS}`} aria-label="Inicio">
          <PulseMark className="opacity-80 transition-opacity group-hover:opacity-100" />
          <span
            className="font-display text-2xl uppercase leading-none tracking-[0.02em] text-white transition-colors"
            style={{ fontFamily: 'var(--font-display, inherit)' }}
          >
            {artistName}
          </span>
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden items-center gap-8 lg:flex xl:gap-10" aria-label="Navegación principal">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} aria-current={pathname === l.to ? 'page' : undefined}>
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={`absolute -bottom-[1px] left-0 h-[2px] w-full origin-left bg-accent transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}

          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className={`flex items-center gap-1 rounded-md py-2 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors ${FOCUS} ${
                moreActive ? 'text-white' : 'text-white/55 hover:text-white'
              }`}
              aria-expanded={moreOpen}
              aria-haspopup="true"
            >
              Más
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-50 mt-4 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c]/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                  >
                    {MORE_GROUPS.map((group, i) => (
                      <div key={group.title} className={i > 0 ? 'mt-1 border-t border-white/10 pt-1' : ''}>
                        <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                          {group.title}
                        </p>
                        {group.links.map((l) => {
                          const Icon = l.icon;
                          return (
                            <NavLink
                              key={l.to}
                              to={l.to}
                              className={({ isActive }) =>
                                `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${FOCUS} ${
                                  isActive ? 'bg-accent/15 text-accent' : 'text-white/70 hover:bg-white/5 hover:text-white'
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
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to={ROUTES.CART}
            className={`hidden rounded-md p-2 text-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:text-white sm:block ${FOCUS}`}
            aria-label="Carrito"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {isAuthenticated ? (
            <Dropdown
              trigger={
                <button className={`flex items-center gap-2 rounded-full ${FOCUS}`} aria-label="Menú de cuenta">
                  <Avatar src={user?.avatar_url} name={user?.name} size="sm" />
                  <span className="hidden text-sm font-medium text-white lg:inline">{user?.name}</span>
                </button>
              }
              items={dropdownItems}
            />
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden text-white/70 transition-transform hover:text-white active:scale-95 lg:inline-flex"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Login
              </Button>
              <Button
                size="sm"
                className="bg-accent font-bold uppercase tracking-wide text-white shadow-[0_4px_20px_rgba(229,9,20,0.35)] transition-transform hover:bg-accent/90 active:scale-95"
                onClick={() => navigate(ROUTES.REGISTER)}
              >
                Unirse
              </Button>
            </>
          )}

          <button
            className={`rounded-md p-1.5 text-white transition-transform duration-200 lg:hidden ${FOCUS}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil: pantalla completa, inmersivo */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto bg-black lg:hidden"
          >
            <nav className="flex flex-col gap-1 p-6" aria-label="Navegación móvil">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <NavLink
                    to={l.to}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-3.5 font-display text-2xl uppercase tracking-wide transition-colors ${FOCUS} ${
                        isActive ? 'text-accent' : 'text-white/85 hover:text-white'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}

              <p className="mt-5 px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
                Más
              </p>
              {MORE_LINKS.map((l) => {
                const Icon = l.icon;
                return (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${FOCUS} ${
                        isActive ? 'bg-accent/10 text-accent' : 'text-white/70 hover:bg-white/5 hover:text-white'
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
                className={`mt-1 flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white ${FOCUS}`}
              >
                <ShoppingCart className="h-4 w-4 shrink-0" />
                Carrito
              </Link>

              {isAuthenticated && (isSuperadmin() || isArtistAdmin()) && (
                <NavLink
                  to={isSuperadmin() ? ROUTES.SUPERADMIN : ROUTES.ADMIN}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${FOCUS} ${
                      isActive ? 'bg-accent/10 text-accent' : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" />
                  {isSuperadmin() ? 'Panel de Control' : 'Mi Panel'}
                </NavLink>
              )}

              {isAuthenticated ? (
                <div className="mt-4 flex items-center gap-3 border-t border-white/10 px-3 pt-4">
                  <Avatar src={user?.avatar_url} name={user?.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{user?.name}</p>
                  </div>
                  <button
                    onClick={logout}
                    className={`rounded-md p-2 text-white/50 transition hover:text-white ${FOCUS}`}
                    aria-label="Cerrar sesión"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
                  <Button variant="ghost" fullWidth className="text-white" onClick={() => navigate(ROUTES.LOGIN)}>
                    Login
                  </Button>
                  <Button fullWidth className="bg-accent font-bold text-white" onClick={() => navigate(ROUTES.REGISTER)}>
                    Unirse
                  </Button>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}