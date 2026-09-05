import { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import {
  songService, albumService, eventService, productService,
  orderAdminApi, galleryAdminApi, postService,   videoService,
} from '@/services/modules';
import Card from '@/components/common/Card';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

function Bars({ data }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-20 shrink-0 text-xs text-text-secondary sm:w-28 sm:text-sm">{d.label}</span>
          <div className="h-3 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-gradient-to-r from-accent to-accent" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          <span className="w-8 shrink-0 text-right text-xs font-medium text-text-primary sm:w-10 sm:text-sm">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AnalyticsAdmin() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.allSettled([
      songService.getSongs({ params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
      albumService.getAlbums({ params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
      eventService.getEvents({ params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
      productService.getProducts({ params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
      orderAdminApi.list({ params: { limit: 100 } }).then((rows) => rows || []).catch(() => []),
      galleryAdminApi.list({ params: { limit: 1 } }).then((rows) => (rows || []).length).catch(() => 0),
      postService.getPosts({ params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
      videoService.getVideos({ params: { limit: 1 } }).then((r) => r.data?.pagination?.total ?? 0).catch(() => 0),
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
    <div className="space-y-6">
      <AdminPageHeader
        icon={BarChart3}
        eyebrow="Panel"
        title="Analíticas"
        subtitle="Distribución de contenido y pedidos"
      />

      {!stats ? (
        <Card padding="lg">Cargando métricas...</Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 3xl:grid-cols-2">
          <Card padding="md" className="sm:p-6 lg:p-8">
            <h3 className="mb-4 font-display text-lg text-text-primary sm:text-xl">Catálogo de contenido</h3>
            <Bars data={stats.content} />
          </Card>
          <Card padding="md" className="sm:p-6 lg:p-8">
            <h3 className="mb-4 font-display text-lg text-text-primary sm:text-xl">Pedidos por estado</h3>
            {stats.orders.length ? <Bars data={stats.orders} /> : <p className="text-sm text-text-muted">Sin pedidos registrados.</p>}
          </Card>
        </div>
      )}
    </div>
  );
}
