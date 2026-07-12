import { useState } from 'react';
import { ARTIST_SLUG } from '@/constants';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import SectionHeading from '@/components/common/SectionHeading';

const columns = [
  { key: 'title', label: 'Título' },
  { key: 'category', label: 'Categoría' },
  { key: 'type', label: 'Tipo' },
  { key: 'status', label: 'Estado' },
];

export default function GalleryAdmin() {
  const [open, setOpen] = useState(false);

  return (
    <DashboardLayout breadcrumb="Galería">
      <div className="space-y-6">
        <SectionHeading eyebrow="Panel" title="Galería" />
        <Card padding="lg">
          <div className="overflow-x-auto">
            <DataTable columns={columns} data={[]} emptyMessage="Sin elementos" onAdd={() => setOpen(true)} />
          </div>
        </Card>
      </div>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Subir media" onSubmit={(e) => { e.preventDefault(); setOpen(false); }}>
        <Input label="Título" name="title" placeholder="Título del elemento" />
        <Input label="Archivo" name="file" type="file" />
        <select name="type" className="input-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"><option value="image">Imagen</option><option value="video">Video</option></select>
      </Modal>
    </DashboardLayout>
  );
}
