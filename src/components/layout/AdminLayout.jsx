import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';
import AdminMobileNav from './AdminMobileNav';
import SkipLink from '@/components/common/SkipLink';
import ScrollUtilities from '@/components/common/ScrollUtilities';

const COLLAPSE_KEY = 'cabaxx:admin-sidebar';

export default function AdminLayout() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(COLLAPSE_KEY) === '1';
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0'); } catch (_) { /* noop */ }
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <SkipLink />
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
      />
      <AdminMobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onMobileMenu={() => setMobileOpen(true)} />
        <main
          id="main-content"
          key={pathname}
          className="admin-scroll flex-1 overflow-y-auto bg-[#0a0a0a]"
        >
          <div className="container-fluid animate-in fade-in slide-in-from-bottom-2 py-6 duration-300 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <ScrollUtilities />
    </div>
  );
}
