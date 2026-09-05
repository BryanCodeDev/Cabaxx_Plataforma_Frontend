import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useArtist } from '@/hooks/useArtist';
import { ROUTES, FOCUS } from '@/constants';
import Button from '@/components/common/Button';
import { Avatar } from '@/components/common';
import Dropdown from '@/components/common/Dropdown';
import { logoMark } from '@/assets';
import { useFocusTrap } from '@/hooks/useFocusTrap';
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
  `group relative py-2 text-[12.5px] font-bold uppercase tracking-[0.16em] transition-colors ${FOCUS} rounded-sm ${
    isActive ? 'text-text-primary' : 'text-text-secondary/80 hover:text-text-primary'
  }`;

/** Marca de tres barras que pulsan — la firma de Cabaxx, presente en navbar y footer. */
function PulseMark({ className = '' }) {
  return (
    <span className={`inline-flex items-end gap-[3px] ${className}`} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-accent shadow-[0_0_6px_rgba(229,9,20,0.8)]"
          style={{
            height: '13px',
            animation: `pulseBar 1.1s ease-in-out ${i * 0.15}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulseBar {
          0%, 100% { transform: scaleY(0.3); opacity: .5; }
          50% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </span>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, logout, isArtistAdmin } = useAuth();
  const { artist } = useArtist();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
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
    if (typeof window === 'undefined') return undefined;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    document.body.style.overflow = menuOpen && !prefersReduced.matches ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const mobileNavRef = useFocusTrap(menuOpen, closeMenu);

  const moreActive = MORE_LINKS.some((l) => pathname.startsWith(l.to));
  const artistName = artist?.name || 'Cabaxx';

  const dropdownItems = [
    ...(isArtistAdmin()
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
          ? 'border-white/10 bg-black/80 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl'
          : 'border-transparent bg-gradient-to-b from-black/60 to-transparent'
      }`}
    >
      <div className="container-fluid flex h-[76px] items-center justify-between">
        <Link to={ROUTES.HOME} className={`group flex shrink-0 items-center rounded-md ${FOCUS}`} aria-label="Inicio">
          <img
            src={logoMark}
            alt="Cabaxx"
            width="48"
            height="48"
            className="h-11 w-11 rounded-md object-contain transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12"
          />
        </Link>

        {/* Navegación desktop */}
        <nav className="hidden items-center gap-7 xl:gap-9 2xl:gap-11 lg:flex" aria-label="Navegación principal">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass} aria-current={pathname === l.to ? 'page' : undefined}>
              {({ isActive }) => (
                <>
                  {l.label}
                  <span
                    className={`absolute -bottom-[2px] left-0 h-[2px] w-full origin-left bg-accent shadow-[0_0_8px_rgba(229,9,20,0.7)] transition-transform duration-300 ${
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
              className={`flex items-center gap-1 rounded-md py-2 text-[12.5px] font-bold uppercase tracking-[0.16em] transition-colors ${FOCUS} ${
                moreActive ? 'text-text-primary' : 'text-text-secondary/80 hover:text-text-primary'
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
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-full z-50 mt-5 w-64 overflow-hidden rounded-2xl border border-white/10 bg-black/95 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl"
                  >
                    {MORE_GROUPS.map((group, i) => (
                      <div key={group.title} className={i > 0 ? 'mt-1 border-t border-white/10 pt-1' : ''}>
                        <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white/35">
                          {group.title}
                        </p>
                        {group.links.map((l) => {
                          const Icon = l.icon;
                          return (
                            <NavLink
                              key={l.to}
                              to={l.to}
                              className={({ isActive }) =>
                                `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${FOCUS} ${
                                  isActive ? 'bg-accent/15 text-accent' : 'text-text-secondary hover:bg-white/[0.05] hover:text-text-primary'
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
            className={`hidden rounded-md p-2 text-text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:text-accent sm:block ${FOCUS}`}
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
              <Button
                variant="ghost"
                size="sm"
                className="hidden text-text-secondary lg:inline-flex"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Entrar
              </Button>
              <Button
                size="sm"
                onClick={() => navigate(ROUTES.REGISTER)}
              >
                Unirme
              </Button>
            </>
          )}

          <button
            className="rounded-md p-1.5 text-text-primary transition-transform duration-200 lg:hidden"
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
            className="fixed inset-x-0 top-[76px] bottom-0 z-40 overflow-y-auto bg-black lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menú principal"
          >
            <nav ref={mobileNavRef} className="flex flex-col gap-1 p-6 pb-24" aria-label="Navegación móvil">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NavLink
                    to={l.to}
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-3.5 font-display text-3xl font-black uppercase tracking-tight transition-colors ${FOCUS} ${
                        isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}

              <p className="mt-5 px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.25em] text-white/35">
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
                        isActive ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-white/[0.05] hover:text-text-primary'
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
                className={`mt-1 flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-text-secondary transition hover:bg-white/[0.05] hover:text-text-primary ${FOCUS}`}
              >
                <ShoppingCart className="h-4 w-4 shrink-0" />
                Carrito
              </Link>

              {isAuthenticated && isArtistAdmin() && (
                <NavLink
                  to={ROUTES.ADMIN}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${FOCUS} ${
                      isActive ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-white/[0.05] hover:text-text-primary'
                    }`
                  }
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" />
                  Mi Panel
                </NavLink>
              )}

              {isAuthenticated ? (
                <div className="mt-4 flex items-center gap-3 border-t border-white/10 px-3 pt-4">
                  <Avatar src={user?.avatar_url} name={user?.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary">{user?.name}</p>
                  </div>
                  <button
                    onClick={logout}
                    className={`rounded-md p-2 text-white/40 transition hover:text-text-primary ${FOCUS}`}
                    aria-label="Cerrar sesión"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
                  <Button variant="secondary" fullWidth onClick={() => navigate(ROUTES.LOGIN)}>
                    Entrar
                  </Button>
                  <Button fullWidth onClick={() => navigate(ROUTES.REGISTER)}>
                    Unirme
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