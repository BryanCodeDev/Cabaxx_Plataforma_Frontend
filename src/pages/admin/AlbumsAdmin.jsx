import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ARTIST_SLUG } from '@/constants';
import { albumService } from '@/services/modules';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import SectionHeading from '@/components/common/SectionHeading';

const columns = [
  { key: 'cover_url', label: 'Cover', render: (row) => <img src={row.cover_url} alt="" className="h-10 w-10 rounded object-cover" /> },
  { key: 'title', label: 'Título' },
  { key: 'type', label: 'Tipo', render: (row) => <Badge variant="gold">{row.type}</Badge> },
  { key: 'release_date', label: 'Fecha', render: (row) => row.release_date ? new Date(row.release_date).toLocaleDateString('es-CO') : '—' },
  { key: 'status', label: 'Estado' },
];

export default function AlbumsAdmin() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    albumService.getAlbums(ARTIST_SLUG, { params: { limit: 50 } })
      .then((res) => setData(res.data))
      .catch(() => toast.error('Error al cargar álbumes'))
      .finally(() => setLoading(false));
  }, []);

  const items = data?.albums?.rows || [];

  return (
    <DashboardLayout breadcrumb="Álbumes">
      <div className="space-y-6">
        <SectionHeading eyebrow="Panel" title="Álbumes" />
        <Card padding="lg" className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={items}
            loading={loading}
            searchable
            emptyMessage="Sin álbumes"
            onAdd={() => setOpen(true)}
            onEdit={() => toast.info('Editar álbum (demo)')}
            onDelete={() => toast.info('Eliminar álbum (demo)')}
          />
        </Card>
      </div>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Nuevo álbum" onSubmit={(e) => { e.preventDefault(); toast.success('Álbum guardado (demo)'); setOpen(false); }}>
        <Input label="Título" name="title" placeholder="Título del álbum" />
        <select name="type" className="input-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface">
          <option value="single">Single</option>
          <option value="ep">EP</option>
          <option value="album">Álbum</option>
        </select>
        <Input label="Fecha de lanzamiento" name="release_date" type="date" />
        <Input label="Descripción" name="description" placeholder="Descripción del álbum" />
        <Input label="Portada" name="cover" type="file" />
      </Modal>
    </DashboardLayout>
  );
}
