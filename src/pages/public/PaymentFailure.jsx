import { useSearchParams, useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import CenteredContainer from '@/components/common/CenteredContainer';
import { ROUTES } from '@/constants';
import { X, RefreshCw, ShoppingBag } from 'lucide-react';

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');

  return (
    <CenteredContainer maxWidth="lg">
      <Card padding="lg" className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/15 [&_svg]:h-8 [&_svg]:w-8 text-error">
          <X />
        </div>
        <h1 className="mt-4 font-display text-display-sm text-text-primary">Pago fallido</h1>
        <p className="mt-2 text-text-secondary">
          No se pudo procesar el pago{orderId ? ` para la orden #${orderId}` : ''}. Puedes intentarlo nuevamente.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => navigate(ROUTES.CHECKOUT)} icon={<RefreshCw className="h-4 w-4" />} fullWidth>
            Reintentar pago
          </Button>
          <Button variant="secondary" onClick={() => navigate(ROUTES.STORE)} icon={<ShoppingBag className="h-4 w-4" />} fullWidth>
            Volver a la tienda
          </Button>
        </div>
      </Card>
    </CenteredContainer>
  );
}
