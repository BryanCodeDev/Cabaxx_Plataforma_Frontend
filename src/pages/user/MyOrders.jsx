import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import { SectionHeading, EmptyState } from '@/components/common';
import Spinner from '@/components/common/Spinner';
import { formatCurrency, formatDate } from '@/utils/format';
import SEOHead from '@/components/seo/SEOHead';
import { FOCUS, ROUTES } from '@/constants';
import { orderService } from '@/services/modules';
import { toast } from 'react-hot-toast';
import { Package, ShoppingBag, Eye } from 'lucide-react';

const STATUS_VARIANTS = {
  pending: 'warning',
  paid: 'success',
  shipped: 'accent',
  delivered: 'success',
  cancelled: 'error',
};

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    orderService
      .getMyOrders()
      .then((res) => {
        if (!isMounted) return;
        const d = res.data?.data?.orders || {};
        setOrders(d.rows || []);
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Error al cargar los pedidos'))
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  return (
    <>
      <SEOHead title="Mis pedidos" description="Historial de pedidos en la tienda de Cabaxx." noIndex />
      <div className="container-fluid max-w-5xl py-10 sm:py-12">
        <SectionHeading eyebrow="Historial" title="Mis pedidos" />

        {loading ? (
          <div className="mt-10 flex justify-center">
            <Spinner size="lg" color="accent" />
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={<Package />}
              title="No tienes pedidos"
              description="Aún no has realizado ningún pedido. Visita la tienda para descubrir productos."
              action={
                <Button className={FOCUS} onClick={() => navigate(ROUTES.STORE)} icon={<ShoppingBag className="h-4 w-4" />}>
                  Ir a la tienda
                </Button>
              }
            />
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {orders.map((o) => (
              <li key={o.id}>
                <Card padding="md" className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-mono text-sm font-semibold text-text-primary">#{o.id}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        STATUS_VARIANTS[o.status] === 'success' ? 'bg-success/15 text-success' :
                        STATUS_VARIANTS[o.status] === 'warning' ? 'bg-warning/15 text-warning' :
                        STATUS_VARIANTS[o.status] === 'accent' ? 'bg-accent/15 text-accent' :
                        STATUS_VARIANTS[o.status] === 'error' ? 'bg-error/15 text-error' :
                        'bg-surface-2 text-text-muted'
                      }`}>
                        {o.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-text-muted">{formatDate(o.created_at)}</p>
                    <p className="mt-1 line-clamp-1 text-sm text-text-secondary">
                      {(o.items || []).map((it) => it.name).join(', ') || 'Sin productos'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <p className="font-mono text-base font-bold text-accent">{formatCurrency(o.total)}</p>
                      <Button variant="secondary" size="sm" className={FOCUS} onClick={() => setDetail(o)} icon={<Eye className="h-4 w-4" />}>
                        Ver detalle
                      </Button>
                    </div>
                </Card>
              </li>
            ))}
          </ul>
        )}

        <Modal
          isOpen={!!detail}
          onClose={() => setDetail(null)}
          title={detail ? `Pedido #${detail.id}` : 'Pedido'}
          description="Detalle completo del pedido"
          size="lg"
        >
          {detail && (
            <div className="space-y-4">
              <dl className="grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-text-muted">Cliente</dt>
                  <dd className="font-medium text-text-primary">{user?.name}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Fecha</dt>
                  <dd className="font-medium text-text-primary">{formatDate(detail.created_at)}</dd>
                </div>
                <div>
                  <dt className="text-text-muted">Estado</dt>
                  <dd className="font-medium text-text-primary capitalize">{detail.status}</dd>
                </div>
              </dl>
              <div className="rounded-xl border border-border">
                <ul className="divide-y divide-border">
                  {detail.items?.map((it, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                      <span className="min-w-0 truncate text-text-secondary">
                        {it.name} <span className="text-text-muted">× {it.qty}</span>
                      </span>
                      <span className="shrink-0 font-mono text-text-primary">{formatCurrency(it.price)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between border-t border-border bg-surface-2/40 px-4 py-3">
                  <span className="font-display text-lg text-text-primary">Total</span>
                  <span className="font-mono text-lg font-bold text-accent">{formatCurrency(detail.total)}</span>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
