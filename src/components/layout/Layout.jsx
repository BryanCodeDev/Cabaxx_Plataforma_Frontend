import { Outlet, useLocation } from 'react-router-dom';
import SEOHead from '@/components/seo/SEOHead';
import AppShell from './AppShell';
import AdminLayout from './AdminLayout';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import ScrollUtilities from '@/components/common/ScrollUtilities';
import SkipLink from '@/components/common/SkipLink';

export default function Layout({ children, hideFooter = false }) {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <>
        <SEOHead />
        <AdminLayout />
      </>
    );
  }

  return (
    <>
      <SEOHead />
      <SkipLink />
      <div className="relative flex min-h-screen flex-col bg-black">
        {/* Textura de grano cinematográfico, muy sutil, sobre todo el sitio */}
        <div
          className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E\"<filter id='n'%3E\"<feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E\"</filter%3E\"<rect width='100%25' height='100%25' filter='url(%23n)'/%3E\"</svg%3E\")",
          }}
          aria-hidden="true"
        />
        <AppShell />
        <main
          id="main-content"
          key={pathname}
          className="animate-in fade-in relative z-[2] flex-1 duration-300"
        >
          <Breadcrumbs />
          {children || <Outlet />}
        </main>
        {!hideFooter && <Footer />}
      </div>
      <ScrollUtilities />
    </>
  );
}
