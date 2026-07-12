import { useEffect, useState } from 'react';
import { ARTIST_SLUG } from '@/constants';
import {
  songService, albumService, eventService, productService,
  orderAdminApi, galleryAdminApi, postService, videoService,
} from '@/services/modules';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/common/Card';
import SectionHeading from '@/components/common/SectionHeading';

function Bars({ data }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 text-sm text-text-secondary">{d.label}</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-gradient-to-r from-accent to-gold" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          <span className="w-10 text-right text-sm font-medium text-text-primary">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsAdmin() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.allSettled([
      songService.getSongs(ARTIST_SLUG, { params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
      albumService.getAlbums(ARTIST_SLUG, { params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
      eventService.getEvents(ARTIST_SLUG, { params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
      productService.getProducts(ARTIST_SLUG, { params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
      orderAdminApi.list({ params: { limit: 100 } }).then((rows) => rows || []).catch(() => []),
      galleryAdminApi.list({ params: { limit: 1 } }).then((rows) => (rows || []).length).catch(() => 0),
      postService.getPosts(ARTIST_SLUG, { params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
      videoService.getVideos(ARTIST_SLUG, { params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
    ]).then(([songs, albums, events, products, ordersRes, gallery, posts, videos]) => {
      const orders = ordersRes.value || [];
      const byStatus = {};
      orders.forEach((o) => { byStatus[o.status] = (byStatus[o.status] || 0) + 1; });
      setStats({
        content: [
          { label: 'Canciones', value: songs.value || 0 },
          { label: 'Álbumes', value: albums.value || 0 },
          { label: 'Videos', value: videos.value || 0 },
          { label: 'Eventos', value: events.value || 0 },
          { label: 'Productos', value: products.value || 0 },
          { label: 'Publicaciones', value: posts.value || 0 },
          { label: 'Galería', value: gallery.value || 0 },
        ],
        orders: Object.entries(byStatus).map(([label, value]) => ({ label, value })),
      });
    });
  }, []);

  return (
    <DashboardLayout breadcrumb="Analíticas">
      <div className="space-y-6">
        <SectionHeading eyebrow="Panel" title="Analíticas" subtitle="Distribución de contenido y pedidos" />

        {!stats ? (
          <Card padding="lg">Cargando métricas...</Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card padding="lg">
              <h3 className="mb-4 font-display text-xl text-text-primary">Catálogo de contenido</h3>
              <Bars data={stats.content} />
            </Card>
            <Card padding="lg">
              <h3 className="mb-4 font-display text-xl text-text-primary">Pedidos por estado</h3>
              {stats.orders.length ? <Bars data={stats.orders} /> : <p className="text-sm text-text-muted">Sin pedidos registrados.</p>}
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
