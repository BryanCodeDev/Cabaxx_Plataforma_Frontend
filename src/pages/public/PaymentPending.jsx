import { useSearchParams, useNavigate } from 'react-router-dom';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import CenteredContainer from '@/components/common/CenteredContainer';
import { ROUTES } from '@/constants';
import { Clock, Package, ShoppingBag } from 'lucide-react';

export default function PaymentPending() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');

  return (
    <CenteredContainer maxWidth="lg">
      <Card padding="lg" className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning/15 [&_svg]:h-8 [&_svg]:w-8 text-warning">
          <Clock />
        </div>
        <h1 className="mt-4 font-display text-display-sm text-text-primary">Pago pendiente</h1>
        <p className="mt-2 text-text-secondary">
          Tu pago está pendiente de confirmación{orderId ? ` para la orden #${orderId}` : ''}.
          Te avisaremos cuando se acredite.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => navigate(ROUTES.MY_ORDERS)} icon={<Package className="h-4 w-4" />} fullWidth>
            Ver mis pedidos
          </Button>
          <Button variant="secondary" onClick={() => navigate(ROUTES.STORE)} icon={<ShoppingBag className="h-4 w-4" />} fullWidth>
            Volver a la tienda
          </Button>
        </div>
      </Card>
    </CenteredContainer>
  );
}
