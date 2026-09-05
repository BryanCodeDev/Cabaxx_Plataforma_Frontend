import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentService } from '@/services/modules';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import CenteredContainer from '@/components/common/CenteredContainer';
import { ROUTES } from '@/constants';
import { toast } from 'react-hot-toast';
import { Check, ShoppingBag, Package } from 'lucide-react';

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
    <CenteredContainer maxWidth="lg">
      <Card padding="lg" className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 [&_svg]:h-8 [&_svg]:w-8 text-success">
          <Check />
        </div>
        <h1 className="mt-4 font-display text-display-sm text-text-primary">Pago exitoso</h1>
        <p className="mt-2 text-text-secondary">
          Tu pago fue procesado correctamente{orderId ? ` para la orden #${orderId}` : ''}.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => navigate(ROUTES.STORE)} icon={<ShoppingBag className="h-4 w-4" />} fullWidth>
            Volver a la tienda
          </Button>
          <Button variant="secondary" onClick={() => navigate(ROUTES.MY_ORDERS)} icon={<Package className="h-4 w-4" />} fullWidth>
            Ver mis pedidos
          </Button>
        </div>
      </Card>
    </CenteredContainer>
  );
}
