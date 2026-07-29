import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import { SectionHeading } from '@/components/common';
import { formatCurrency, formatDate } from '@/utils/format';
import SEOHead from '@/components/seo/SEOHead';

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary';

const MOCK_ORDERS = [
  { id: 'CAB-1001', date: '2026-06-20', total: 85000, status: 'Entregado', items: [{ name: 'Camiseta Oficial', qty: 1, price: 85000 }] },
  { id: 'CAB-1023', date: '2026-07-01', total: 150000, status: 'Enviado', items: [{ name: 'Vinilo Firmado', qty: 1, price: 150000 }] },
];

export default function MyOrders() {
  const { user } = useAuth();
  const [detail, setDetail] = useState(null);

  return (
    <>
      <SEOHead title="Mis pedidos" description="Historial de pedidos en la tienda de Cabaxx." noIndex />
      <div className="mx-auto max-w-5xl px-4 py-12">
      <SectionHeading eyebrow="Historial" title="Mis pedidos" />
      <div className="mt-8 space-y-4">
        {MOCK_ORDERS.map((o) => (
          <Card key={o.id} padding="md" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-text-primary">{o.id}</p>
              <p className="text-sm text-text-muted">{formatDate(o.date)}</p>
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

      <Modal isOpen={!!detail} onClose={() => setDetail(null)} title={`Pedido ${detail?.id}`} size="lg">
        {detail && (
          <div className="space-y-4">
            <div className="grid gap-2 text-sm text-text-secondary">
              <p>Cliente: {user?.name}</p>
              <p>Fecha: {formatDate(detail.date)}</p>
              <p>Estado: {detail.status}</p>
            </div>
            <div className="space-y-2">
              {detail.items.map((it, i) => (
                <div key={i} className="flex justify-between text-sm text-text-secondary">
                  <span>
                    {it.name} x1
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
