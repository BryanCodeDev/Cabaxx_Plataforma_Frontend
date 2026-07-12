import { useFetch } from '@/hooks/useFetch';
import { ARTIST_SLUG } from '@/constants';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';
import SectionHeading from '@/components/common/SectionHeading';

const columns = [
  { key: 'title', label: 'Evento', render: (r) => <img src={r.banner_url} alt="" className="h-10 w-10 rounded object-cover" /> },
  { key: 'start_datetime', label: 'Fecha', render: (r) => new Date(r.start_datetime).toLocaleString('es-CO') },
  { key: 'city', label: 'Ciudad' },
  { key: 'capacity', label: 'Capacidad' },
  { key: 'tickets_sold', label: 'Vendidas' },
  { key: 'status', label: 'Estado' },
];

export default function EventsAdmin() {
  const { data, loading } = useFetch(`/artists/${ARTIST_SLUG}/events`, { params: { limit: 50 } });
  const items = data?.events?.rows || [];

  return (
    <DashboardLayout breadcrumb="Eventos">
      <div className="space-y-6">
        <SectionHeading eyebrow="Panel" title="Eventos" />
        <Card padding="lg">
          <div className="overflow-x-auto">
            <DataTable columns={columns} data={items} loading={loading} searchable />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
