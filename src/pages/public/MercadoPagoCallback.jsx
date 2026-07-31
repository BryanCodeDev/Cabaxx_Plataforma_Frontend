import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Spinner from '@/components/common/Spinner';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { ROUTES } from '@/constants';
import { Check, X } from 'lucide-react';

export default function MercadoPagoCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const prefId = searchParams.get('pref_id');
  const orderId = searchParams.get('order_id');
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Procesando pago simulado...');

  useEffect(() => {
    if (!prefId || !orderId) {
      setStatus('error');
      setMessage('Faltan parámetros de la preferencia de pago.');
      return;
    }

    const timer = setTimeout(() => {
      setStatus('success');
      setMessage('Pago aprobado');
    }, 1800);

    return () => clearTimeout(timer);
  }, [prefId, orderId]);

  const goToResult = () => {
    if (status === 'success') {
      navigate(`${ROUTES.PAYMENT_SUCCESS}?order_id=${orderId}`);
    } else if (status === 'failure') {
      navigate(`${ROUTES.PAYMENT_FAILURE}?order_id=${orderId}`);
    } else {
      navigate(`${ROUTES.PAYMENT_PENDING}?order_id=${orderId}`);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <Card padding="lg" className="text-center">
        {status === 'processing' && (
          <>
            <Spinner size="lg" color="accent" />
            <h1 className="mt-6 font-display text-3xl text-text-primary">Conectando con Mercado Pago</h1>
            <p className="mt-2 text-text-secondary">Espere mientras se procesa el pago simulado...</p>
            <p className="mt-2 font-mono text-xs text-text-muted">Preferencia: {prefId}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h1 className="mt-4 font-display text-3xl text-text-primary">Pago aprobado</h1>
            <p className="mt-2 text-text-secondary">{message}</p>
            <Button className="mt-6" onClick={goToResult}>Ver comprobante</Button>
          </>
        )}

        {status === 'failure' && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/15">
              <X className="h-8 w-8 text-error" />
            </div>
            <h1 className="mt-4 font-display text-3xl text-text-primary">Pago rechazado</h1>
            <p className="mt-2 text-text-secondary">{message}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={() => navigate(ROUTES.CHECKOUT)}>Reintentar</Button>
              <Button variant="secondary" onClick={() => navigate(ROUTES.STORE)}>Volver a la tienda</Button>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-error/15">
              <span className="text-3xl text-error">!</span>
            </div>
            <h1 className="mt-4 font-display text-3xl text-text-primary">Error</h1>
            <p className="mt-2 text-text-secondary">{message}</p>
            <Button className="mt-6" variant="secondary" onClick={() => navigate(ROUTES.CHECKOUT)}>Volver al checkout</Button>
          </>
        )}
      </Card>
    </div>
  );
}
