import { Outlet } from 'react-router-dom';
import SEOHead from '@/components/seo/SEOHead';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

export default function Layout({ children }) {
  return (
    <>
      <SEOHead />
      <div className="flex min-h-screen flex-col bg-primary">
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