import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';
import SectionHeading from '@/components/common/SectionHeading';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'user', label: 'Cliente' },
  { key: 'total', label: 'Total', render: (r) => `$${r.total?.toLocaleString('es-CO')}` },
  { key: 'status', label: 'Estado' },
  { key: 'created_at', label: 'Fecha' },
];

export default function OrdersAdmin() {
  return (
    <DashboardLayout breadcrumb="Pedidos">
      <div className="space-y-6">
        <SectionHeading eyebrow="Panel" title="Pedidos" />
        <Card padding="lg">
          <div className="overflow-x-auto">
            <DataTable columns={columns} data={[]} searchable emptyMessage="Sin pedidos" />
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
