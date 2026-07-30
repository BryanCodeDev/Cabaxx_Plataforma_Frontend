import { useEffect, useState } from 'react';
import {
  Music, Disc3, Calendar, ShoppingBag, Package, Users, Film, Image, FileText,
} from 'lucide-react';
import {
  songService, albumService, eventService, productService,
  orderAdminApi, galleryAdminApi, postService, newsletterSubscribersApi,   videoService,
} from '@/services/modules';
import Card from '@/components/common/Card';

function Kpi({ icon: Icon, label, value, accent }) {
  return (
    <Card padding="md" className="flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm text-text-secondary">{label}</p>
        <p className="mt-1 font-display text-2xl text-text-primary">{value}</p>
      </div>
    </Card>
  );
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

  const kpis = stats ? [
    { icon: Music, label: 'Canciones', value: stats.songs, accent: 'bg-accent/10 text-accent' },
    { icon: Disc3, label: 'Álbumes', value: stats.albums, accent: 'bg-gold/10 text-gold' },
    { icon: Film, label: 'Videos', value: stats.videos, accent: 'bg-accent/10 text-accent' },
    { icon: Calendar, label: 'Eventos', value: stats.events, accent: 'bg-gold/10 text-gold' },
    { icon: ShoppingBag, label: 'Productos', value: stats.products, accent: 'bg-accent/10 text-accent' },
    { icon: Image, label: 'Galería', value: stats.gallery, accent: 'bg-gold/10 text-gold' },
    { icon: FileText, label: 'Publicaciones', value: stats.posts, accent: 'bg-accent/10 text-accent' },
    { icon: Package, label: 'Pedidos pendientes', value: stats.pending, accent: 'bg-gold/10 text-gold' },
    { icon: Users, label: 'Suscriptores', value: stats.subs, accent: 'bg-accent/10 text-accent' },
  ] : [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl text-text-primary">Panel de control</h2>
        <p className="text-sm text-text-muted">Resumen general de la plataforma</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => (
          <Kpi key={k.label} {...k} />
        ))}
        {!stats && (
          <Card padding="md" className="sm:col-span-2 lg:col-span-3">Cargando métricas...</Card>
        )}
      </div>
    </div>
  );
}
