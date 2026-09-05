import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { X, LogOut, ExternalLink, Sparkles } from 'lucide-react';
import { ROUTES, FOCUS } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useArtist } from '@/hooks/useArtist';
import { Avatar } from '@/components/common';
import ThemeToggle from '@/components/common/ThemeToggle';
import { classNames } from '@/utils/classNames';
import { NAV_GROUPS, NavItem } from './AdminSidebar';

/**
 * Drawer accesible del panel admin (mobile/tablet).
 * - Slides in desde la izquierda
 * - Scrim oscuro que cierra al click
 * - Bloquea scroll del body
 * - Cierra con Escape, click en link, o cambio de ruta
 * - Foco atrapado dentro del drawer
 * - z-index alto (60+) para estar por encima del topbar (z-20)
 */
export default function AdminMobileNav({ open, onClose }) {
  const { user, logout } = useAuth();
  const { artist } = useArtist();
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const [signingOut, setSigningOut] = useState(false);
  const { pathname } = useLocation();

  // Cierra al cambiar ruta
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock de scroll
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (!open) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prev = document.body.style.overflow;
    document.body.style.overflow = reduce ? '' : 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Escape + focus management
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = Array.from(
          drawerRef.current.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.offsetParent !== null);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    // Mover foco al botón cerrar al abrir
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  const artistName = artist?.stage_name || artist?.name || 'Cabaxx';

  const handleSignOut = async () => {
    setSigningOut(true);
    onClose();
    try { await logout(); } finally { navigate(ROUTES.LOGIN, { replace: true }); }
  };

  return (
    <div className="lg:hidden">
      {/* Scrim */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm"
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú del panel administrativo"
        className="fixed inset-y-0 left-0 z-[70] flex w-[300px] max-w-[88vw] flex-col border-r border-white/[0.08] bg-app-panel shadow-elev-3"
        style={{ animation: 'adminSlideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1) both' }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-hover text-sm font-black text-white">
              C
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold uppercase tracking-wider text-white">
                {artistName}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Panel Admin
              </p>
            </div>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className={classNames(
              'rounded-md p-2 text-white/55 transition hover:bg-white/[0.08] hover:text-white',
              FOCUS
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav
          className="admin-scroll flex-1 space-y-6 overflow-y-auto px-3 py-5"
          aria-label="Secciones del panel"
        >
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <NavItem key={item.to} item={item} collapsed={false} />
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="shrink-0 space-y-2 border-t border-white/[0.06] p-3">
          <ThemeToggle variant="pill" className="w-full" />
          <Link
            to={ROUTES.HOME}
            onClick={onClose}
            className={classNames(
              'flex items-center justify-center gap-2 rounded-lg border border-white/[0.06] px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/55 transition hover:border-white/15 hover:text-white',
              FOCUS
            )}
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            Ver sitio
          </Link>
          <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] p-2.5">
            <Avatar src={user?.avatar_url} name={user?.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-white">{user?.name || 'Admin'}</p>
              <p className="truncate text-[10px] text-white/40">{user?.email}</p>
            </div>
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
          </div>
        </div>
      </aside>

      <style>{`
        @keyframes adminSlideIn {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-label="Menú del panel administrativo"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
