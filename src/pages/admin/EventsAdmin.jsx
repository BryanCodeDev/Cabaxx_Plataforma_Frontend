import { SectionHeading, Badge } from '@/components/common'
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ARTIST_SLUG } from '@/constants';
import { eventService } from '@/services/modules';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';

const STATUS_VARIANT = { published: 'success', draft: 'warning', cancelled: 'error', sold_out: 'default' };

function toLocalInput(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EventsAdmin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    eventService
      .getEvents(ARTIST_SLUG, { params: { limit: 100 } })
      .then((res) => setData(res.data))
      .catch(() => toast.error('Error al cargar eventos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items = data?.data || [];

  const columns = [
    { key: 'banner_url', label: 'Banner', render: (r) => r.banner_url ? <img src={r.banner_url} alt="" className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 rounded bg-surface-2" /> },
    { key: 'title', label: 'Evento' },
    { key: 'start_datetime', label: 'Fecha', render: (r) => (r.start_datetime ? new Date(r.start_datetime).toLocaleString('es-CO') : '—') },
    { key: 'city', label: 'Ciudad' },
    { key: 'capacity', label: 'Capacidad', render: (r) => r.capacity ?? '—' },
    { key: 'tickets_sold', label: 'Vendidas', render: (r) => r.tickets_sold ?? 0 },
    { key: 'status', label: 'Estado', render: (r) => <Badge variant={STATUS_VARIANT[r.status] || 'default'} size="sm">{r.status}</Badge> },
  ];

  const fields = [
    { name: 'title', label: 'Título', type: 'text', required: true, fullWidth: true },
    { name: 'start_datetime', label: 'Inicio', type: 'datetime-local', required: true },
    { name: 'end_datetime', label: 'Fin', type: 'datetime-local' },
    { name: 'city', label: 'Ciudad', type: 'text' },
    { name: 'venue_name', label: 'Lugar', type: 'text' },
    { name: 'country', label: 'País', type: 'text' },
    { name: 'capacity', label: 'Capacidad', type: 'number' },
    { name: 'is_free', label: 'Evento gratuito', type: 'switch' },
    { name: 'status', label: 'Estado', type: 'select', options: [{ value: 'draft', label: 'Borrador' }, { value: 'published', label: 'Publicado' }, { value: 'cancelled', label: 'Cancelado' }] },
    { name: 'description', label: 'Descripción', type: 'textarea', fullWidth: true },
    { name: 'banner', label: 'Banner', type: 'file', accept: 'image/*' },
  ];

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Panel" title="Eventos" subtitle="Conciertos y presentaciones" />
        <Card padding="lg">
          <DataTable
            columns={columns}
            data={items}
            loading={loading}
            searchable
            emptyMessage="Sin eventos"
            fields={fields}
            toFormValues={(row, base) => ({ ...base, start_datetime: toLocalInput(row.start_datetime), end_datetime: toLocalInput(row.end_datetime), banner: row.banner_url || null })}
            toPayload={(v) => ({
              ...v,
              start_datetime: v.start_datetime ? `${v.start_datetime}:00`.replace(/:00:00$/, ':00') : v.start_datetime,
              end_datetime: v.end_datetime ? `${v.end_datetime}:00`.replace(/:00:00$/, ':00') : v.end_datetime,
            })}
            onAdd={async (v) => { await eventService.create(v); toast.success('Evento creado'); }}
            onEdit={async (row, v) => { await eventService.update(row.id, v); toast.success('Evento actualizado'); }}
            onDelete={async (row) => { await eventService.remove(row.id); toast.success('Evento eliminado'); }}
            onChanged={load}
          />
        </Card>
      </div>
  );
}
