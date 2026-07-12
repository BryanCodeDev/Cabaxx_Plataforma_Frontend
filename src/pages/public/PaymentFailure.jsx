import { useSearchParams } from 'react-router-dom';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { ROUTES } from '@/constants';
import { X } from 'lucide-react';

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <Card padding="lg" className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/15">
          <X className="h-8 w-8 text-error" />
        </div>
        <h1 className="mt-4 font-display text-4xl text-text-primary">Pago fallido</h1>
        <p className="mt-2 text-text-secondary">
          No se pudo procesar el pago{orderId ? ` para la orden #${orderId}` : ''}. Puedes intentarlo nuevamente.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => navigate(ROUTES.CHECKOUT)}>Reintentar pago</Button>
          <Button variant="secondary" onClick={() => navigate(ROUTES.STORE)}>Volver a la tienda</Button>
        </div>
      </Card>
    </div>
  );
}
