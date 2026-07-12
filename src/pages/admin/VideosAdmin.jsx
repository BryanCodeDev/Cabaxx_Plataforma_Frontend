import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ARTIST_SLUG } from '@/constants';
import { videoService } from '@/services/modules';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import SectionHeading from '@/components/common/SectionHeading';

const columns = [
  { key: 'thumbnail_url', label: 'Miniatura', render: (row) => <img src={row.thumbnail_url} alt="" className="h-10 w-10 rounded object-cover" /> },
  { key: 'title', label: 'Título' },
  { key: 'youtube_id', label: 'YouTube', render: (row) => <span className="font-mono text-sm">{row.youtube_id ? `YouTube: ${row.youtube_id}` : '—'}</span> },
  { key: 'views', label: 'Vistas', render: (row) => <span className="font-mono text-sm">{row.views?.toLocaleString('es-CO') ?? '0'}</span> },
  { key: 'status', label: 'Estado' },
];

export default function VideosAdmin() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    videoService.getVideos(ARTIST_SLUG, { params: { limit: 50 } })
      .then((res) => setData(res.data))
      .catch(() => toast.error('Error al cargar videos'))
      .finally(() => setLoading(false));
  }, []);

  const items = data?.videos?.rows || [];

  return (
    <DashboardLayout breadcrumb="Videos">
      <div className="space-y-6">
        <SectionHeading eyebrow="Panel" title="Videos" />
        <Card padding="lg" className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={items}
            loading={loading}
            searchable
            emptyMessage="Sin videos"
            onAdd={() => setOpen(true)}
            onEdit={() => toast.info('Editar video (demo)')}
            onDelete={() => toast.info('Eliminar video (demo)')}
          />
        </Card>
      </div>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Nuevo video" onSubmit={(e) => { e.preventDefault(); toast.success('Video guardado (demo)'); setOpen(false); }}>
        <Input label="Título" name="title" placeholder="Título del video" />
        <Input label="YouTube ID" name="youtube_id" placeholder="ID de YouTube" />
        <Input label="Descripción" name="description" placeholder="Descripción del video" />
        <Input label="URL" name="url" placeholder="https://youtube.com/watch?v=..." />
      </Modal>
    </DashboardLayout>
  );
}
