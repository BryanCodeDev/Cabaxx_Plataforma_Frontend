import { Outlet, useLocation } from 'react-router-dom';
import SEOHead from '@/components/seo/SEOHead';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import { useArtist } from '@/hooks/useArtist';
import { APP_NAME } from '@/constants';

export default function Layout({ children }) {
  const { artist } = useArtist();
  const { pathname } = useLocation();
  return (
    <>
      <SEOHead />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main key={pathname} className="animate-in fade-in flex-1 duration-300">
          <Breadcrumbs />
          {children || <Outlet />}
        </main>
        <Footer />
      </div>
    </>
  );
}