import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { X, LogOut, ExternalLink, Sparkles } from 'lucide-react';
import { ROUTES, FOCUS } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useArtist } from '@/hooks/useArtist';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { Avatar } from '@/components/common';
import ThemeToggle from '@/components/common/ThemeToggle';
import { classNames } from '@/utils/classNames';
import { NAV_GROUPS, NavItem } from './AdminSidebar';

export default function AdminMobileNav({ open, onClose }) {
  const { user, logout } = useAuth();
  const { artist } = useArtist();
  const navigate = useNavigate();
  const ref = useFocusTrap(open, onClose);
  const [signingOut, setSigningOut] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { onClose(); }, [pathname, onClose]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.body.style.overflow = open && !reduce ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const artistName = artist?.stage_name || artist?.name || 'Cabaxx';

  const handleSignOut = async () => {
    setSigningOut(true);
    onClose();
    try { await logout(); } finally { navigate(ROUTES.LOGIN, { replace: true }); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          />
          <motion.aside
            key="drawer"
            ref={ref}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Menú del panel administrativo"
            className="fixed inset-y-0 left-0 z-50 flex w-[300px] max-w-[88vw] flex-col border-r border-white/[0.08] bg-[#080808] shadow-elev-3 lg:hidden"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-[#E0203F] text-sm font-black text-white">
                  C
                </div>
                <div>
                  <p className="font-display text-sm font-bold uppercase tracking-wider text-white">{artistName}</p>
                  <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    Panel Admin
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar menú"
                className={classNames(
                  'rounded-md p-1.5 text-white/45 transition hover:bg-white/[0.08] hover:text-white',
                  FOCUS
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="admin-scroll flex-1 space-y-5 overflow-y-auto px-3 py-5" aria-label="Secciones del panel">
              {NAV_GROUPS.map((group) => (
                <div key={group.title}>
                  <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
