import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentService } from '@/services/modules';
import Spinner from '@/components/common/Spinner';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { ROUTES } from '@/constants';
import { toast } from 'react-hot-toast';
import { Check } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (orderId) {
      paymentService.getPaymentByOrder(orderId).catch(() => {});
    }
  }, [orderId]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <Card padding="lg" className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
          <Check className="h-8 w-8 text-success" />
        </div>
        <h1 className="mt-4 font-display text-4xl text-text-primary">Pago exitoso</h1>
        <p className="mt-2 text-text-secondary">
          Tu pago fue procesado correctamente{orderId ? ` para la orden #${orderId}` : ''}.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => navigate(ROUTES.STORE)}>Volver a la tienda</Button>
          <Button variant="secondary" onClick={() => navigate(ROUTES.MY_ORDERS)}>Ver mis pedidos</Button>
        </div>
      </Card>
    </div>
  );
}
