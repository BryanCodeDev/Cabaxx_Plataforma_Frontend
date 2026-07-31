import { SectionHeading, Badge } from '@/components/common'
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { postService } from '@/services/modules';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';

const TYPE_OPTIONS = [
  { value: 'news', label: 'Noticia' },
  { value: 'blog', label: 'Blog' },
  { value: 'update', label: 'Novedad' },
];

const STATUS_VARIANT = { published: 'success', draft: 'warning' };

export default function PostsAdmin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    postService
      .getPosts({ params: { limit: 100 } })
      .then((res) => setData(res.data))
      .catch(() => toast.error('Error al cargar publicaciones'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = data?.data || [];

  const columns = [
    { key: 'cover_url', label: 'Imagen', render: (r) => r.cover_url ? <img src={r.cover_url} alt="" className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 rounded bg-surface-2" /> },
    { key: 'title', label: 'Título' },
    { key: 'type', label: 'Tipo', render: (r) => <Badge variant="accent" size="sm">{r.type}</Badge> },
    { key: 'status', label: 'Estado', render: (r) => <Badge variant={STATUS_VARIANT[r.status] || 'default'} size="sm">{r.status}</Badge> },
    { key: 'published_at', label: 'Publicado', render: (r) => (r.published_at ? new Date(r.published_at).toLocaleDateString('es-CO') : '—') },
  ];

  const fields = [
    { name: 'title', label: 'Título', type: 'text', required: true, fullWidth: true },
    { name: 'type', label: 'Tipo', type: 'select', options: TYPE_OPTIONS },
    { name: 'status', label: 'Estado', type: 'select', options: [{ value: 'draft', label: 'Borrador' }, { value: 'published', label: 'Publicado' }] },
    { name: 'excerpt', label: 'Extracto', type: 'textarea' },
    { name: 'content', label: 'Contenido', type: 'textarea', fullWidth: true, rows: 6 },
    { name: 'cover', label: 'Imagen destacada', type: 'file', accept: 'image/*' },
  ];

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Panel" title="Noticias / Blog" subtitle="Publicaciones y novedades" />
      <Card padding="lg">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          searchable
          emptyMessage="Sin publicaciones"
          fields={fields}
          toFormValues={(row, base) => ({ ...base, cover: row.cover_url || null })}
          onAdd={async (v) => { await postService.create(v); toast.success('Publicación creada'); }}
          onEdit={async (row, v) => { await postService.update(row.id, v); toast.success('Publicación actualizada'); }}
          onDelete={async (row) => { await postService.remove(row.id); toast.success('Publicación eliminada'); }}
          onChanged={load}
        />
      </Card>
    </div>
  );
}
