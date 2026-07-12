import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { ARTIST_SLUG } from '@/constants';
import { orderAdminApi } from '@/services/modules';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';
import SectionHeading from '@/components/common/SectionHeading';
import Badge from '@/components/common/Badge';

const STATUS_VARIANT = {
  pending: 'warning', paid: 'success', processing: 'warning',
  shipped: 'accent', delivered: 'success', cancelled: 'error', refunded: 'error',
};

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'paid', label: 'Pagado' },
  { value: 'processing', label: 'En proceso' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
  { value: 'refunded', label: 'Reembolsado' },
];

function customerName(row) {
  try {
    const addr = typeof row.shipping_address_json === 'string' ? JSON.parse(row.shipping_address_json) : row.shipping_address_json;
    if (addr?.name) return addr.name;
    if (addr?.email) return addr.email;
  } catch {
    /* ignore */
  }
  return row.user_id ? `Cliente #${row.user_id}` : '—';
}

export default function OrdersAdmin() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    orderAdminApi
      .list({ params: { limit: 100 } })
      .then((rows) => setData(rows))
      .catch(() => toast.error('Error al cargar pedidos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    { key: 'id', label: 'ID', render: (r) => `#${r.id}` },
    { key: 'customer', label: 'Cliente', render: (r) => customerName(r) },
    { key: 'total', label: 'Total', render: (r) => `$${(r.total ?? 0).toLocaleString('es-CO')} ${r.currency || ''}`.trim() },
    { key: 'status', label: 'Estado', render: (r) => <Badge variant={STATUS_VARIANT[r.status] || 'default'} size="sm">{r.status}</Badge> },
    { key: 'created_at', label: 'Fecha', render: (r) => (r.created_at ? new Date(r.created_at).toLocaleDateString('es-CO') : '—') },
  ];

  const fields = [
    { name: 'status', label: 'Estado', type: 'select', options: STATUS_OPTIONS },
  ];

  return (
    <DashboardLayout breadcrumb="Pedidos">
      <div className="space-y-6">
        <SectionHeading eyebrow="Panel" title="Pedidos" subtitle="Gestiona los pedidos de la tienda" />
        <Card padding="lg">
          <DataTable
            columns={columns}
            data={data}
            loading={loading}
            searchable
            emptyMessage="Sin pedidos"
            fields={fields}
            addLabel=""
            onEdit={async (row, v) => { await orderAdminApi.updateStatus(row.id, v.status); toast.success('Estado actualizado'); }}
            onDelete={async (row) => { await orderAdminApi.remove(row.id); toast.success('Pedido eliminado'); }}
            onChanged={load}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}
