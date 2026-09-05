import { Outlet, useLocation } from 'react-router-dom';
import SEOHead from '@/components/seo/SEOHead';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import ScrollUtilities from '@/components/common/ScrollUtilities';
import { useArtist } from '@/hooks/useArtist';
import { APP_NAME } from '@/constants';

export default function Layout({ children }) {
  const { artist } = useArtist();
  const { pathname } = useLocation();
  return (
    <>
      <SEOHead />
      <div className="relative flex min-h-screen flex-col bg-black">
        {/* Textura de grano cinematográfico, muy sutil, sobre todo el sitio */}
        <div
          className="pointer-events-none fixed inset-0 z-[1] opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
          aria-hidden="true"
        />
        <Navbar />
        <main key={pathname} className="animate-in fade-in relative z-[2] flex-1 duration-300">
          <Breadcrumbs />
          {children || <Outlet />}
        </main>
        <Footer />
      </div>
      <ScrollUtilities />
    </>
  );
}