import { useSearchParams } from 'react-router-dom';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { ROUTES } from '@/constants';

export default function PaymentPending() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <Card padding="lg" className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning/15">
          <span className="text-3xl text-warning">!</span>
        </div>
        <h1 className="mt-4 font-display text-4xl text-text-primary">Pago pendiente</h1>
        <p className="mt-2 text-text-secondary">
          Tu pago está pendiente de confirmación{orderId ? ` para la orden #${orderId}` : ''}.
          Te avisaremos cuando se acredite.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => navigate(ROUTES.MY_ORDERS)}>Ver mis pedidos</Button>
          <Button variant="secondary" onClick={() => navigate(ROUTES.STORE)}>Volver a la tienda</Button>
        </div>
      </Card>
    </div>
  );
}
