import { Outlet } from 'react-router-dom';
import SEOHead from '@/components/seo/SEOHead';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import { useArtist } from '@/hooks/useArtist';
import { APP_NAME } from '@/constants';

export default function Layout({ children }) {
  const { artist } = useArtist();
  return (
    <>
      <SEOHead />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Breadcrumbs />
          {children || <Outlet />}
        </main>
        <Footer />
      </div>
    </>
  );
}
