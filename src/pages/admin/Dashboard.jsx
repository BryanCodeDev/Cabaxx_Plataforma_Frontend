import { useEffect, useState } from 'react';
import {
  Music, Disc3, Calendar, ShoppingBag, Package, Users, Film, Image, FileText,
  LayoutDashboard, ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  songService, albumService, eventService, productService,
  orderAdminApi, galleryAdminApi, postService, newsletterSubscribersApi, videoService,
} from '@/services/modules';
import Card from '@/components/common/Card';
import Spinner from '@/components/common/Spinner';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { ROUTES } from '@/constants';

const KPIS = [
  { key: 'songs', icon: Music, label: 'Canciones', to: ROUTES.ADMIN_SONGS },
  { key: 'albums', icon: Disc3, label: 'Álbumes', to: ROUTES.ADMIN_ALBUMS },
  { key: 'videos', icon: Film, label: 'Videos', to: ROUTES.ADMIN_VIDEOS },
  { key: 'events', icon: Calendar, label: 'Eventos', to: ROUTES.ADMIN_EVENTS },
  { key: 'products', icon: ShoppingBag, label: 'Productos', to: ROUTES.ADMIN_STORE },
  { key: 'gallery', icon: Image, label: 'Galería', to: ROUTES.ADMIN_GALLERY },
  { key: 'posts', icon: FileText, label: 'Publicaciones', to: ROUTES.ADMIN_NEWS },
  { key: 'pending', icon: Package, label: 'Pedidos pendientes', to: ROUTES.ADMIN_ORDERS },
  { key: 'subs', icon: Users, label: 'Suscriptores', to: ROUTES.ADMIN_NEWSLETTER },
];

function Kpi({ icon: Icon, label, value, to }) {
  const inner = (
    <Card padding="md" className="group flex items-center gap-4 transition hover:border-accent/40 hover:bg-app-deep">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition group-hover:scale-105">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs uppercase tracking-[0.15em] text-text-secondary">{label}</p>
        <p className="mt-1 font-display text-2xl text-text-primary">{value}</p>
      </div>
      {to && <ArrowRight className="h-4 w-4 shrink-0 text-text-muted opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-accent" />}
    </Card>
  );
  return to ? <Link to={to} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-2xl">{inner}</Link> : inner;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.allSettled([
      songService.getSongs({ params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
      albumService.getAlbums({ params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
      eventService.getEvents({ params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
      productService.getProducts({ params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
      orderAdminApi.list({ params: { limit: 100 } }).then((rows) => (rows || []).filter((o) => o.status === 'pending').length).catch(() => 0),
      galleryAdminApi.list({ params: { limit: 1 } }).then((rows) => (rows || []).length).catch(() => 0),
      postService.getPosts({ params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
      newsletterSubscribersApi.list({ params: { limit: 1 } }).then((rows) => (rows || []).length).catch(() => 0),
      videoService.getVideos({ params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
    ]).then(([songs, albums, events, products, pending, gallery, posts, subs, videos]) => {
      setStats({
        songs: songs.value || 0,
        albums: albums.value || 0,
        events: events.value || 0,
        products: products.value || 0,
        pending: pending.value || 0,
        gallery: gallery.value || 0,
        posts: posts.value || 0,
        subs: subs.value || 0,
        videos: videos.value || 0,
      });
    });
  }, []);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        icon={LayoutDashboard}
        eyebrow="Panel"
        title="Resumen general"
        subtitle="Vista rápida del estado de la plataforma"
      />

      {!stats ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" color="accent" />
        </div>
      ) : (
        <div className="grid-stat">
          {KPIS.map((k) => (
            <Kpi key={k.key} {...k} value={stats[k.key]} />
          ))}
        </div>
      )}
    </div>
  );
}
