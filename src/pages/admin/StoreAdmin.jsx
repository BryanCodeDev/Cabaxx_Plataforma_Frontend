import { useState } from 'react';
import Tabs from '@/components/common/Tabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/common/Card';
import SectionHeading from '@/components/common/SectionHeading';
import DataTable from '@/components/admin/DataTable';

const TABS = [
  { key: 'products', label: 'Productos' },
  { key: 'orders', label: 'Pedidos' },
  { key: 'coupons', label: 'Cupones' },
  { key: 'categories', label: 'Categorías' },
];

const PRODUCT_COLUMNS = [
  { key: 'cover_url', label: 'Img', render: (r) => <img src={r.cover_url} alt="" className="h-10 w-10 rounded object-cover" /> },
  { key: 'name', label: 'Nombre' },
  { key: 'price', label: 'Precio', render: (r) => `$${r.price?.toLocaleString('es-CO')}` },
  { key: 'stock', label: 'Stock' },
  { key: 'status', label: 'Estado' },
];

const ORDER_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'user', label: 'Cliente' },
  { key: 'total', label: 'Total', render: (r) => `$${r.total?.toLocaleString('es-CO')}` },
  { key: 'status', label: 'Estado' },
  { key: 'created_at', label: 'Fecha' },
];

export default function StoreAdmin() {
  const [tab, setTab] = useState('products');

  return (
    <DashboardLayout breadcrumb="Tienda">
      <div className="space-y-6">
        <SectionHeading eyebrow="Panel" title="Tienda" />
        <Tabs tabs={TABS.map((t) => ({ ...t, onClick: () => setTab(t.key) }))} active={tab} />
        <Card padding="lg">
          <div className="overflow-x-auto">
            {tab === 'products' && <DataTable columns={PRODUCT_COLUMNS} data={[]} emptyMessage="Sin productos" onAdd={() => {}} />}
            {tab === 'orders' && <DataTable columns={ORDER_COLUMNS} data={[]} emptyMessage="Sin pedidos" />}
            {tab === 'coupons' && <DataTable columns={[{ key: 'code', label: 'Código' }, { key: 'discount', label: 'Descuento' }, { key: 'status', label: 'Estado' }]} data={[]} emptyMessage="Sin cupones" onAdd={() => {}} />}
            {tab === 'categories' && <DataTable columns={[{ key: 'name', label: 'Nombre' }, { key: 'slug', label: 'Slug' }]} data={[]} emptyMessage="Sin categorías" onAdd={() => {}} />}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
