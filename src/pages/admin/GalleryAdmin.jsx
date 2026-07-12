import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { galleryAdminApi } from '@/services/modules';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';
import SectionHeading from '@/components/common/SectionHeading';
import Badge from '@/components/common/Badge';

const CATEGORY_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'photo', label: 'Foto' },
  { value: 'video', label: 'Video' },
  { value: 'backstage', label: 'Backstage' },
  { value: 'cover', label: 'Portada' },
];

const STATUS_VARIANT = { active: 'success', inactive: 'default' };

export default function GalleryAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    galleryAdminApi
      .list({ params: { limit: 100 } })
      .then((rows) => setData(rows))
      .catch(() => toast.error('Error al cargar galería'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    { key: 'file_url', label: 'Vista', render: (r) => r.file_type === 'video'
      ? <span className="rounded bg-surface-2 px-2 py-1 text-xs">Video</span>
      : (r.file_url ? <img src={r.file_url} alt="" className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 rounded bg-surface-2" />),
    },
    { key: 'title', label: 'Título' },
    { key: 'category', label: 'Categoría', render: (r) => <Badge variant="gold" size="sm">{r.category}</Badge> },
    { key: 'file_type', label: 'Tipo', render: (r) => r.file_type },
    { key: 'status', label: 'Estado', render: (r) => <Badge variant={STATUS_VARIANT[r.status] || 'default'} size="sm">{r.status}</Badge> },
  ];

  const fields = [
    { name: 'title', label: 'Título', type: 'text', fullWidth: true },
    { name: 'category', label: 'Categoría', type: 'select', options: CATEGORY_OPTIONS },
    { name: 'description', label: 'Descripción', type: 'textarea', fullWidth: true },
    { name: 'file', label: 'Archivo (imagen o video)', type: 'file', accept: 'image/*,video/*', required: true },
  ];

  return (
    <DashboardLayout breadcrumb="Galería">
      <div className="space-y-6">
        <SectionHeading eyebrow="Panel" title="Galería" subtitle="Imágenes y videos promocionales" />
        <Card padding="lg">
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            searchable
            emptyMessage="Sin elementos en la galería"
            fields={fields}
            addLabel="Subir media"
            onAdd={async (v) => { await galleryAdminApi.create(v); toast.success('Elemento subido'); }}
            onDelete={async (row) => { await galleryAdminApi.remove(row.id); toast.success('Elemento eliminado'); }}
            onChanged={load}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
