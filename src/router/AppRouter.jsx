import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import Spinner from '@/components/common/Spinner';
import ScrollToTop from '@/components/common/ScrollToTop';
import { AuthProvider } from '@/context/AuthContext';
import { ArtistProvider } from '@/context/ArtistContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import NotFoundPage from '@/pages/public/NotFound';

const Providers = ({ children }) => (
  <AuthProvider>
    <ArtistProvider>
      <ThemeProvider>
        <CartProvider>
          <ScrollToTop />
          {children}
        </CartProvider>
      </ThemeProvider>
    </ArtistProvider>
  </AuthProvider>
);

const withProviders = (element) => <Providers>{element}</Providers>;

const withSuspense = (Component) => (
  <Suspense fallback={<div className="flex h-screen items-center justify-center"><Spinner size="lg" color="accent" /></div>}>
    <Component />
  </Suspense>
);

// Páginas públicas
const HomePage = lazy(() => import('@/pages/home/Home'));
const SongsPage = lazy(() => import('@/pages/public/SongsPage'));
const SongPage = lazy(() => import('@/pages/public/SongPage'));
const EventsPage = lazy(() => import('@/pages/public/EventsPage'));
const EventPage = lazy(() => import('@/pages/public/EventPage'));
const NewsPage = lazy(() => import('@/pages/public/NewsPage'));
const NewsPostPage = lazy(() => import('@/pages/public/NewsPostPage'));
const BlogPage = lazy(() => import('@/pages/public/BlogPage'));
const BlogPostPage = lazy(() => import('@/pages/public/BlogPostPage'));
const StorePage = lazy(() => import('@/pages/public/StorePage'));
const ProductPage = lazy(() => import('@/pages/public/ProductPage'));
const GalleryPage = lazy(() => import('@/pages/public/GalleryPage'));
  const CartPage = lazy(() => import('@/pages/public/Cart'));
  const CheckoutPage = lazy(() => import('@/pages/public/Checkout'));
  const AlbumsPage = lazy(() => import('@/pages/public/AlbumsPage'));
  const AlbumDetailPage = lazy(() => import('@/pages/public/AlbumDetailPage'));
  const VideosPage = lazy(() => import('@/pages/public/VideosPage'));
  const VideoDetailPage = lazy(() => import('@/pages/public/VideoDetailPage'));
  const ContactPage = lazy(() => import('@/pages/public/ContactPage'));

// Auth
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));

// Payment result pages
const PaymentSuccessPage = lazy(() => import('@/pages/public/PaymentSuccess'));
const PaymentFailurePage = lazy(() => import('@/pages/public/PaymentFailure'));
const PaymentPendingPage = lazy(() => import('@/pages/public/PaymentPending'));
const MercadoPagoCallback = lazy(() => import('@/pages/public/MercadoPagoCallback'));

// Usuario
const UserAccountPage = lazy(() => import('@/pages/user/MyAccount'));
const UserOrdersPage = lazy(() => import('@/pages/user/MyOrders'));

// Admin
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminSongs = lazy(() => import('@/pages/admin/SongsAdmin'));
const AdminEvents = lazy(() => import('@/pages/admin/EventsAdmin'));
const AdminStore = lazy(() => import('@/pages/admin/StoreAdmin'));
const AdminOrders = lazy(() => import('@/pages/admin/OrdersAdmin'));
const AdminPosts = lazy(() => import('@/pages/admin/PostsAdmin'));
const AdminGallery = lazy(() => import('@/pages/admin/GalleryAdmin'));
const AdminNewsletter = lazy(() => import('@/pages/admin/NewsletterAdmin'));
  const AdminAnalytics = lazy(() => import('@/pages/admin/AnalyticsAdmin'));
  const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
  const AdminAlbums = lazy(() => import('@/pages/admin/AlbumsAdmin'));
  const AdminVideos = lazy(() => import('@/pages/admin/VideosAdmin'));

function Page({ children }) {
  return (
    <Layout>
      <Suspense fallback={<div className="flex h-screen items-center justify-center"><Spinner size="lg" color="accent" /></div>}>
        {children}
      </Suspense>
    </Layout>
  );
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: withProviders(<Page><Outlet /></Page>),
      children: [
      { index: true, element: withSuspense(HomePage) },
      { path: 'canciones', element: withSuspense(SongsPage) },
      { path: 'canciones/:slug', element: withSuspense(SongPage) },
      { path: 'eventos', element: withSuspense(EventsPage) },
      { path: 'eventos/:slug', element: withSuspense(EventPage) },
      { path: 'noticias', element: withSuspense(NewsPage) },
      { path: 'noticias/:slug', element: withSuspense(NewsPostPage) },
      { path: 'blog', element: withSuspense(BlogPage) },
      { path: 'blog/:slug', element: withSuspense(BlogPostPage) },
      { path: 'tienda', element: withSuspense(StorePage) },
      { path: 'tienda/:slug', element: withSuspense(ProductPage) },
      { path: 'galeria', element: withSuspense(GalleryPage) },
      { path: 'albumes', element: withSuspense(AlbumsPage) },
      { path: 'albumes/:slug', element: withSuspense(AlbumDetailPage) },
      { path: 'videos', element: withSuspense(VideosPage) },
      { path: 'videos/:slug', element: withSuspense(VideoDetailPage) },
      { path: 'contacto', element: withSuspense(ContactPage) },
      { path: 'carrito', element: withSuspense(CartPage) },
    ],
  },
  { path: '/login', element: withProviders(<Page><LoginPage /></Page>) },
  { path: '/register', element: withProviders(<Page><RegisterPage /></Page>) },
  { path: '/forgot-password', element: withProviders(<Page><ForgotPasswordPage /></Page>) },
  { path: '/reset-password/:token', element: withProviders(<Page><ResetPasswordPage /></Page>) },

  {
    path: '/mi-cuenta',
    element: withProviders(<ProtectedRoute><Page><UserAccountPage /></Page></ProtectedRoute>),
  },
  {
    path: '/mis-pedidos',
    element: withProviders(<ProtectedRoute><Page><UserOrdersPage /></Page></ProtectedRoute>),
  },
  {
    path: '/checkout',
    element: withProviders(<ProtectedRoute><Page><CheckoutPage /></Page></ProtectedRoute>),
  },
  { path: '/pagos/success', element: withProviders(<Page><PaymentSuccessPage /></Page>) },
  { path: '/pagos/failure', element: withProviders(<Page><PaymentFailurePage /></Page>) },
  { path: '/pagos/pending', element: withProviders(<Page><PaymentPendingPage /></Page>) },
  { path: '/pagos/mercado-pago', element: withProviders(<Page><MercadoPagoCallback /></Page>) },

  {
    path: '/admin',
    element: withProviders(<AdminRoute><Layout hideFooter><Outlet /></Layout></AdminRoute>),
    children: [
      { index: true, element: withProviders(withSuspense(AdminDashboard)) },
      { path: 'canciones', element: withProviders(withSuspense(AdminSongs)) },
      { path: 'eventos', element: withProviders(withSuspense(AdminEvents)) },
      { path: 'tienda', element: withProviders(withSuspense(AdminStore)) },
      { path: 'pedidos', element: withProviders(withSuspense(AdminOrders)) },
      { path: 'noticias', element: withProviders(withSuspense(AdminPosts)) },
      { path: 'galeria', element: withProviders(withSuspense(AdminGallery)) },
      { path: 'newsletter', element: withProviders(withSuspense(AdminNewsletter)) },
      { path: 'analiticas', element: withProviders(withSuspense(AdminAnalytics)) },
      { path: 'configuracion', element: withProviders(withSuspense(AdminSettings)) },
      { path: 'albumes', element: withProviders(withSuspense(AdminAlbums)) },
      { path: 'videos', element: withProviders(withSuspense(AdminVideos)) },
    ],
  },
  { path: '*', element: withProviders(<Page><NotFoundPage /></Page>) },
], {
  future: {
    v7_startTransition: true,
  },
});

export default router;
