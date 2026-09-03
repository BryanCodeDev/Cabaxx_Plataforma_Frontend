import { SectionHeading, Badge } from '@/components/common'
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { videoService } from '@/services/modules';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';

const STATUS_VARIANT = { published: 'success', draft: 'warning' };

export default function VideosAdmin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    videoService
      .getVideos({ params: { limit: 100 } })
      .then((res) => setData(res.data))
      .catch(() => toast.error('Error al cargar videos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = data?.data?.videos?.rows || [];

  const columns = [
    { key: 'thumbnail_url', label: 'Miniatura', render: (r) => r.thumbnail_url ? <img src={r.thumbnail_url} alt="" className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 rounded bg-surface-2" /> },
    { key: 'title', label: 'Título' },
    { key: 'youtube_id', label: 'YouTube', render: (r) => r.youtube_id ? <span className="font-mono text-sm">{r.youtube_id}</span> : '—' },
    { key: 'views', label: 'Vistas', render: (r) => (r.views || 0).toLocaleString('es-CO') },
    { key: 'status', label: 'Estado', render: (r) => <Badge variant={STATUS_VARIANT[r.status] || 'default'} size="sm">{r.status}</Badge> },
  ];

  const fields = [
    { name: 'title', label: 'Título', type: 'text', required: true, fullWidth: true },
    { name: 'youtube_id', label: 'ID de YouTube', type: 'text', placeholder: 'dQw4w9WgXcQ' },
    { name: 'video_url', label: 'URL del video', type: 'url', placeholder: 'https://youtube.com/watch?v=...' },
    { name: 'status', label: 'Estado', type: 'select', options: [{ value: 'draft', label: 'Borrador' }, { value: 'published', label: 'Publicado' }] },
    { name: 'description', label: 'Descripción', type: 'textarea', fullWidth: true },
  ];

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Panel" title="Videos" subtitle="Clips y videoclips" />
      <Card padding="lg">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          searchable
          emptyMessage="Sin videos"
          fields={fields}
          onAdd={async (v) => { await videoService.create(v); toast.success('Video creado'); }}
          onEdit={async (row, v) => { await videoService.update(row.id, v); toast.success('Video actualizado'); }}
          onDelete={async (row) => { await videoService.remove(row.id); toast.success('Video eliminado'); }}
          onChanged={load}
        />
      </Card>
    </div>
  );
}
