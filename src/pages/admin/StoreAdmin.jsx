import { SectionHeading, Tabs, Badge } from '@/components/common'
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { productService, categoryService, couponService } from '@/services/modules';
import DataTable from '@/components/admin/DataTable';
import Card from '@/components/common/Card';

const STATUS_VARIANT = { active: 'success', inactive: 'default', expired: 'error', published: 'success', draft: 'warning' };

const fmtPrice = (r) => `$${(r.price ?? 0).toLocaleString('es-CO')} ${r.currency || ''}`.trim();

export default function StoreAdmin() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState({ data: [] });
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);

  useEffect(() => {
    categoryService.list().then((rows) => setCategories(rows)).catch(() => {});
    productService.getProducts({ params: { limit: 100 } })
      .then((res) => setProducts(res.data)).catch(() => toast.error('Error al cargar productos'))
      .finally(() => setLoadingProducts(false));
    couponService.list({ params: { limit: 100 } })
      .then((rows) => setCoupons(rows)).catch(() => toast.error('Error al cargar cupones'))
      .finally(() => setLoadingCoupons(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reloadProducts = () => productService.getProducts({ params: { limit: 100 } }).then((res) => setProducts(res.data));
  const reloadCoupons = () => couponService.list({ params: { limit: 100 } }).then((rows) => setCoupons(rows));
  const reloadCategories = () => categoryService.list().then((rows) => setCategories(rows));

  const categoryOptions = categories.map((c) => ({ value: String(c.id), label: c.name }));

  const productColumns = [
    { key: 'cover_url', label: 'Img', render: (r) => r.cover_url ? <img src={r.cover_url} alt="" className="h-10 w-10 rounded object-cover" /> : <div className="h-10 w-10 rounded bg-surface-2" /> },
    { key: 'name', label: 'Nombre' },
    { key: 'price', label: 'Precio', render: (r) => fmtPrice(r) },
    { key: 'stock_quantity', label: 'Stock', render: (r) => r.stock_quantity ?? 0 },
    { key: 'type', label: 'Tipo', render: (r) => <Badge variant="accent" size="sm">{r.type}</Badge> },
    { key: 'status', label: 'Estado', render: (r) => <Badge variant={STATUS_VARIANT[r.status] || 'default'} size="sm">{r.status}</Badge> },
  ];

  const productFields = [
    { name: 'name', label: 'Nombre', type: 'text', required: true, fullWidth: true },
    { name: 'price', label: 'Precio', type: 'number', required: true },
    { name: 'currency', label: 'Moneda', type: 'select', options: [{ value: 'USD', label: 'USD' }, { value: 'COP', label: 'COP' }] },
    { name: 'type', label: 'Tipo', type: 'select', options: [{ value: 'physical', label: 'Físico' }, { value: 'digital', label: 'Digital' }, { value: 'ticket', label: 'Ticket' }] },
    { name: 'stock_quantity', label: 'Stock', type: 'number' },
    { name: 'category_id', label: 'Categoría', type: 'select', options: categoryOptions, hidePlaceholder: false },
    { name: 'status', label: 'Estado', type: 'select', options: [{ value: 'active', label: 'Activo' }, { value: 'draft', label: 'Borrador' }, { value: 'archived', label: 'Archivado' }] },
    { name: 'description', label: 'Descripción', type: 'textarea', fullWidth: true },
    { name: 'cover', label: 'Imagen', type: 'file', accept: 'image/*' },
  ];

  const categoryColumns = [
    { key: 'name', label: 'Nombre' },
    { key: 'slug', label: 'Slug' },
    { key: 'description', label: 'Descripción', render: (r) => r.description || '—' },
  ];

  const categoryFields = [
    { name: 'name', label: 'Nombre', type: 'text', required: true },
    { name: 'slug', label: 'Slug (opcional)', type: 'text', placeholder: 'se-genera-automaticamente' },
    { name: 'description', label: 'Descripción', type: 'textarea', fullWidth: true },
  ];

  const couponColumns = [
    { key: 'code', label: 'Código' },
    { key: 'type', label: 'Tipo', render: (r) => <Badge variant="accent" size="sm">{r.type === 'percent' ? '%' : '$'}</Badge> },
    { key: 'value', label: 'Valor', render: (r) => (r.type === 'percent' ? `${r.value}%` : `$${r.value}`) },
    { key: 'min_purchase', label: 'Mín. compra', render: (r) => r.min_purchase ? `$${r.min_purchase}` : '—' },
    { key: 'uses_count', label: 'Usos', render: (r) => `${r.uses_count || 0}/${r.max_uses || '∞'}` },
    { key: 'expires_at', label: 'Expira', render: (r) => (r.expires_at ? new Date(r.expires_at).toLocaleDateString('es-CO') : '—') },
    { key: 'status', label: 'Estado', render: (r) => <Badge variant={STATUS_VARIANT[r.status] || 'default'} size="sm">{r.status}</Badge> },
  ];

  const couponFields = [
    { name: 'code', label: 'Código', type: 'text', required: true, fullWidth: true },
    { name: 'type', label: 'Tipo', type: 'select', options: [{ value: 'percent', label: 'Porcentaje' }, { value: 'fixed', label: 'Monto fijo' }] },
    { name: 'value', label: 'Valor', type: 'number', required: true },
    { name: 'min_purchase', label: 'Compra mínima', type: 'number' },
    { name: 'max_uses', label: 'Usos máximos', type: 'number' },
    { name: 'expires_at', label: 'Fecha de expiración', type: 'date' },
    { name: 'status', label: 'Estado', type: 'select', options: [{ value: 'active', label: 'Activo' }, { value: 'inactive', label: 'Inactivo' }, { value: 'expired', label: 'Expirado' }] },
  ];

  const TABS = [
    { key: 'products', label: 'Productos' },
    { key: 'categories', label: 'Categorías' },
    { key: 'coupons', label: 'Cupones' },
  ];

  return (
    <div className="space-y-6">
      <SectionHeading eyebrow="Panel" title="Tienda" subtitle="Catálogo, categorías y cupones" />
        <Tabs tabs={TABS.map((t) => ({ ...t, onClick: () => setTab(t.key) }))} active={tab} />

        {tab === 'products' && (
          <Card padding="lg">
            <DataTable
              columns={productColumns}
              data={products.data || []}
              loading={loadingProducts}
              searchable
              emptyMessage="Sin productos"
              fields={productFields}
              toFormValues={(row, base) => ({ ...base, category_id: row.category_id ? String(row.category_id) : '', cover: row.cover_url || null })}
              toPayload={(v) => ({ ...v, category_id: v.category_id ? Number(v.category_id) : null, price: Number(v.price), stock_quantity: v.stock_quantity === '' ? 0 : Number(v.stock_quantity) })}
              onAdd={async (v) => { await productService.create(v); toast.success('Producto creado'); }}
              onEdit={async (row, v) => { await productService.update(row.id, v); toast.success('Producto actualizado'); }}
              onDelete={async (row) => { await productService.remove(row.id); toast.success('Producto eliminado'); }}
              onChanged={reloadProducts}
            />
          </Card>
        )}

        {tab === 'categories' && (
          <Card padding="lg">
            <DataTable
              columns={categoryColumns}
              data={categories}
              searchable
              emptyMessage="Sin categorías"
              fields={categoryFields}
              onAdd={async (v) => { await categoryService.create(v); toast.success('Categoría creada'); await reloadCategories(); }}
              onEdit={async (row, v) => { await categoryService.update(row.id, v); toast.success('Categoría actualizada'); await reloadCategories(); }}
              onDelete={async (row) => { await categoryService.remove(row.id); toast.success('Categoría eliminada'); await reloadCategories(); }}
              onChanged={reloadCategories}
            />
          </Card>
        )}

        {tab === 'coupons' && (
          <Card padding="lg">
            <DataTable
              columns={couponColumns}
              data={coupons}
              loading={loadingCoupons}
              searchable
              emptyMessage="Sin cupones"
              fields={couponFields}
              toPayload={(v) => ({ ...v, value: Number(v.value), min_purchase: v.min_purchase === '' ? 0 : Number(v.min_purchase), max_uses: v.max_uses === '' ? null : Number(v.max_uses) })}
              onAdd={async (v) => { await couponService.create(v); toast.success('Cupón creado'); }}
              onEdit={async (row, v) => { await couponService.update(row.id, v); toast.success('Cupón actualizado'); }}
              onDelete={async (row) => { await couponService.remove(row.id); toast.success('Cupón eliminado'); }}
              onChanged={reloadCoupons}
            />
          </Card>
        )}
      </div>
  );
}
