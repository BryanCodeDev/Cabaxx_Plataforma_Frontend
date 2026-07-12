import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useArtist } from '@/hooks/useArtist';
import { ROUTES } from '@/constants';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar';
import Dropdown from '@/components/common/Dropdown';
import { ShoppingCart, Menu } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Inicio', to: ROUTES.HOME },
  { label: 'Música', to: ROUTES.SONGS },
  { label: 'Eventos', to: ROUTES.EVENTS },
  { label: 'Tienda', to: ROUTES.STORE },
  { label: 'Blog', to: ROUTES.BLOG },
];

const MORE_LINKS = [
  { label: 'Álbumes', to: ROUTES.ALBUMS },
  { label: 'Videos', to: ROUTES.VIDEOS },
  { label: 'Galería', to: ROUTES.GALLERY },
  { label: 'Noticias', to: ROUTES.NEWS },
  { label: 'Contacto', to: ROUTES.CONTACT },
];

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary';

const linkClass = ({ isActive }) =>
  `relative text-sm font-medium transition-colors ${FOCUS} ${
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  const moreActive = MORE_LINKS.some((l) => pathname.startsWith(l.to));

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all duration-300 ${
        scrolled ? 'border-border bg-primary/90 backdrop-blur' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to={ROUTES.HOME} className={`rounded-md ${FOCUS}`} aria-label="Inicio">
          <span className="font-display text-2xl tracking-wide text-accent transition-transform hover:scale-105">
            {artist?.name || 'Cabaxx'}
          </span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex lg:gap-7">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
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

          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${FOCUS} ${
                moreActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
              aria-expanded={moreOpen}
              aria-haspopup="true"
            >
              Más
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {moreOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
                <div className="absolute left-0 top-full z-50 mt-3 w-44 overflow-hidden rounded-xl border border-border bg-surface py-2 shadow-card">
                  {MORE_LINKS.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm transition-colors ${FOCUS} ${
                          isActive ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                        }`
                      }
                    >
                      {l.label}
                    </NavLink>
                  ))}
                </div>
              </>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Link to={ROUTES.CART} className={`hidden text-text-secondary transition hover:text-text-primary sm:block ${FOCUS} rounded`} aria-label="Carrito">
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {isAuthenticated ? (
            <Dropdown
              trigger={
                <button className={`rounded-full ${FOCUS}`} aria-label="Menú de cuenta">
                  <Avatar src={user?.avatar_url} name={user?.name} size="sm" />
                </button>
              }
              items={[
                ...(isSuperadmin()
                  ? [{ label: 'Panel MasterCode', onClick: () => navigate(ROUTES.SUPERADMIN) }]
                  : isArtistAdmin()
                  ? [{ label: 'Mi Panel', onClick: () => navigate(ROUTES.ADMIN) }]
                  : []),
                { label: 'Mi cuenta', onClick: () => navigate(ROUTES.ACCOUNT) },
                { label: 'Mis pedidos', onClick: () => navigate(ROUTES.MY_ORDERS) },
                { label: 'Cerrar sesión', onClick: logout },
              ]}
            />
          ) : (
            <>
              <Button variant="ghost" size="sm" className="hidden md:inline-flex" onClick={() => navigate(ROUTES.LOGIN)}>
                Login
              </Button>
              <Button size="sm" onClick={() => navigate(ROUTES.REGISTER)}>
                Unirse
              </Button>
            </>
          )}

          <button
            className={`text-2xl text-text-primary md:hidden ${FOCUS} rounded-md`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-primary md:hidden">
          <div className="flex flex-col gap-1 p-4">
            {[...NAV_LINKS, ...MORE_LINKS].map((l) => (
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
            <Link
              to={ROUTES.CART}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-surface-2 hover:text-text-primary ${FOCUS}`}
            >
              Carrito
            </Link>
            {isAuthenticated && (
              <>
                {isSuperadmin() && (
                  <NavLink to={ROUTES.SUPERADMIN} className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-medium transition ${FOCUS} ${
                      isActive ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                    }`
                  }>
                    Panel MasterCode
                  </NavLink>
                )}
                {isArtistAdmin() && !isSuperadmin() && (
                  <NavLink to={ROUTES.ADMIN} className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-medium transition ${FOCUS} ${
                      isActive ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                    }`
                  }>
                    Mi Panel
                  </NavLink>
                )}
                <div className="mt-2 flex gap-2">
                  <Button variant="ghost" fullWidth onClick={logout}>
                    Cerrar sesión
                  </Button>
                </div>
              </>
            )}
            {!isAuthenticated && (
              <div className="mt-2 flex gap-2">
                <Button variant="ghost" fullWidth onClick={() => navigate(ROUTES.LOGIN)}>
                  Login
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