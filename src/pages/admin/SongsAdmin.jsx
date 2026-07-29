import { SectionHeading, Badge } from '@/components/common'
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ARTIST_SLUG } from '@/constants';
import { songService } from '@/services/songService';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Borrador' },
  { value: 'published', label: 'Publicado' },
];

const STATUS_VARIANT = { published: 'success', draft: 'warning' };

function fmtDuration(s) {
  if (!s) return '—';
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function SongsAdmin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    songService
      .getSongs(ARTIST_SLUG, { params: { limit: 100 } })
      .then((res) => setData(res.data))
      .catch(() => toast.error('Error al cargar canciones'))
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
    { key: 'duration_seconds', label: 'Duración', render: (r) => fmtDuration(r.duration_seconds) },
    { key: 'play_count', label: 'Reproducciones', render: (r) => (r.play_count || 0).toLocaleString('es-CO') },
    { key: 'likes_count', label: 'Me gusta', render: (r) => (r.likes_count || 0).toLocaleString('es-CO') },
    { key: 'status', label: 'Estado', render: (r) => <Badge variant={STATUS_VARIANT[r.status] || 'default'} size="sm">{r.status}</Badge> },
  ];

  const fields = [
    { name: 'title', label: 'Título', type: 'text', required: true, fullWidth: true },
    { name: 'duration_seconds', label: 'Duración (segundos)', type: 'number', placeholder: '210' },
    { name: 'is_explicit', label: 'Contenido explícito', type: 'switch' },
    { name: 'status', label: 'Estado', type: 'select', options: STATUS_OPTIONS },
    { name: 'cover', label: 'Portada', type: 'file', accept: 'image/*' },
    { name: 'audio', label: 'Audio (MP3)', type: 'file', accept: 'audio/*' },
  ];

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Panel" title="Canciones" subtitle="Gestiona el catálogo musical del artista" />
        <Card padding="lg">
          <DataTable
            columns={columns}
            data={items}
            loading={loading}
            searchable
            emptyMessage="Sin canciones"
            fields={fields}
            toFormValues={(row, base) => ({ ...base, cover: row.cover_url || null, audio: null })}
            onAdd={async (v) => {
              await songService.create(v);
              toast.success('Canción creada');
            }}
            onEdit={async (row, v) => {
              await songService.update(row.id, v);
              toast.success('Canción actualizada');
            }}
            onDelete={async (row) => {
              await songService.remove(row.id);
              toast.success('Canción eliminada');
            }}
            onChanged={load}
          />
        </Card>
      </div>
  );
}
