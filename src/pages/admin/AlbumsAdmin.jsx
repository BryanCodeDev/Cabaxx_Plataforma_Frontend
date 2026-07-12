import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ARTIST_SLUG } from '@/constants';
import { albumService } from '@/services/modules';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';
import SectionHeading from '@/components/common/SectionHeading';
import Badge from '@/components/common/Badge';

const TYPE_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'ep', label: 'EP' },
  { value: 'album', label: 'Álbum' },
];

const STATUS_VARIANT = { published: 'success', draft: 'warning' };

export default function AlbumsAdmin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    albumService
      .getAlbums(ARTIST_SLUG, { params: { limit: 100 } })
      .then((res) => setData(res.data))
      .catch(() => toast.error('Error al cargar álbumes'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = data?.data || [];

  const columns = [
    { key: 'cover_url', label: 'Portada', render: (r) => r.cover_url ? <img src={r.cover_url} alt="" className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 rounded bg-surface-2" /> },
    { key: 'title', label: 'Título' },
    { key: 'type', label: 'Tipo', render: (r) => <Badge variant="gold" size="sm">{r.type}</Badge> },
    { key: 'release_date', label: 'Lanzamiento', render: (r) => (r.release_date ? new Date(r.release_date).toLocaleDateString('es-CO') : '—') },
    { key: 'status', label: 'Estado', render: (r) => <Badge variant={STATUS_VARIANT[r.status] || 'default'} size="sm">{r.status}</Badge> },
  ];

  const fields = [
    { name: 'title', label: 'Título', type: 'text', required: true, fullWidth: true },
    { name: 'type', label: 'Tipo', type: 'select', options: TYPE_OPTIONS },
    { name: 'release_date', label: 'Fecha de lanzamiento', type: 'date' },
    { name: 'status', label: 'Estado', type: 'select', options: [{ value: 'draft', label: 'Borrador' }, { value: 'published', label: 'Publicado' }] },
    { name: 'description', label: 'Descripción', type: 'textarea', fullWidth: true },
    { name: 'cover', label: 'Portada', type: 'file', accept: 'image/*' },
  ];

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Panel" title="Álbumes" subtitle="Lanzamientos discográficos" />
      <Card padding="lg">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          searchable
          emptyMessage="Sin álbumes"
          fields={fields}
          toFormValues={(row, base) => ({ ...base, cover: row.cover_url || null })}
          onAdd={async (v) => { await albumService.create(v); toast.success('Álbum creado'); }}
          onEdit={async (row, v) => { await albumService.update(row.id, v); toast.success('Álbum actualizado'); }}
          onDelete={async (row) => { await albumService.remove(row.id); toast.success('Álbum eliminado'); }}
          onChanged={load}
        />
      </Card>
    </div>
  );
}
