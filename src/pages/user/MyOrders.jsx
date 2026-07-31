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

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    orderService
      .getMyOrders()
      .then((res) => setOrders(res.data.data || []))
      .catch((err) => toast.error(err.response?.data?.message || 'Error al cargar los pedidos'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEOHead title="Mis pedidos" description="Historial de pedidos en la tienda de Cabaxx." noIndex />
      <div className="mx-auto max-w-5xl px-4 py-12">
      <SectionHeading eyebrow="Historial" title="Mis pedidos" />
      {loading ? (
        <div className="mt-8 flex justify-center">
          <Spinner size="lg" color="accent" />
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No tienes pedidos"
            description="Aún no has realizado ningún pedido. Visita la tienda para descubrir productos."
            action={
              <Button className={FOCUS} onClick={() => navigate(ROUTES.STORE)}>
                Ir a la tienda
              </Button>
            }
          />
        </div>
      ) : (
      <div className="mt-8 space-y-4">
        {orders.map((o) => (
          <Card key={o.id} padding="md" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-text-primary">#{o.id}</p>
              <p className="text-sm text-text-muted">{formatDate(o.created_at)}</p>
            </div>
            <div className="text-sm text-text-secondary">{(o.items || []).map((it) => it.name).join(', ')}</div>
            <div className="font-mono text-accent">{formatCurrency(o.total)}</div>
            <span className="rounded-full bg-success/15 px-3 py-1 text-xs text-success">{o.status}</span>
            <Button variant="secondary" size="sm" className={FOCUS} onClick={() => setDetail(o)}>
              Ver detalle
            </Button>
          </Card>
        ))}
      </div>
      )}

      <Modal isOpen={!!detail} onClose={() => setDetail(null)} title={`Pedido #${detail?.id}`} size="lg">
        {detail && (
          <div className="space-y-4">
            <div className="grid gap-2 text-sm text-text-secondary">
              <p>Cliente: {user?.name}</p>
              <p>Fecha: {formatDate(detail.created_at)}</p>
              <p>Estado: {detail.status}</p>
            </div>
            <div className="space-y-2">
              {detail.items && detail.items.map((it, i) => (
                <div key={i} className="flex justify-between text-sm text-text-secondary">
                  <span>
                    {it.name} x{it.qty}
                  </span>
                  <span className="font-mono">{formatCurrency(it.price)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-2 text-right font-display text-xl text-text-primary">{formatCurrency(detail.total)}</div>
          </div>
        )}
      </Modal>
      </div>
    </>
  );
}
