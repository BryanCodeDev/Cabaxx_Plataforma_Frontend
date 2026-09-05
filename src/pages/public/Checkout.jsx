import { SectionHeading, EmptyState } from '@/components/common'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { orderService, paymentService } from '@/services/modules';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import { ROUTES, FOCUS } from '@/constants';
import { Check } from 'lucide-react';
import { formatCurrency } from '@/utils/format';
import { toast } from 'react-hot-toast';
import SEOHead from '@/components/seo/SEOHead';
const STEPS = [
  { label: 'Envío', step: 1 },
  { label: 'Resumen', step: 2 },
  { label: 'Pago', step: 3 },
  { label: 'Confirmación', step: 4 },
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ street: '', city: '', zip: '', country: 'CO' });
  const [orderNumber, setOrderNumber] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [provider, setProvider] = useState('stripe');
  const [loading, setLoading] = useState(false);

  if (!items.length && step !== 4) {
    return (
      <div className="container-fluid py-20">
        <EmptyState
          title="No hay items en el carrito"
          description="Añade productos desde la tienda para continuar."
          action={
            <Button className={FOCUS} onClick={() => navigate(ROUTES.STORE)}>
              Ir a la tienda
            </Button>
          }
        />
      </div>
    );
  }

  const submitOrder = async () => {
    try {
      setLoading(true);
      const { data } = await orderService.checkout({
        items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity, variant_id: i.variant?.id })),
        shipping_address: address,
      });
      const newOrderId = data.data?.order?.id || data.data?.order?.order_id;
      setOrderId(newOrderId);
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudo procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const payWithMercadoPago = async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const { data } = await paymentService.createPayment({
        orderId,
        amount: total,
        currency: 'COP',
        provider: 'mercadopago',
      });
      const initPoint = data?.initPoint || data?.data?.initPoint;
      if (initPoint) {
        window.location.href = initPoint;
      } else {
        toast.error('No se pudo iniciar el pago con Mercado Pago');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al iniciar el pago');
    } finally {
      setLoading(false);
    }
  };

  const payWithStripe = async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const { data } = await paymentService.createPayment({
        orderId,
        amount: total,
        currency: 'COP',
        provider: 'stripe',
      });
       setOrderNumber(data?.payment?.order_number || 'CAB-' + orderId);
      clearCart();
      setStep(4);
      toast.success('Pago procesado exitosamente');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-10 sm:py-12">
      <SectionHeading eyebrow="Finalizar compra" title="Checkout" />
      <ol className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
        {STEPS.map((s) => (
          <li key={s.step} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${FOCUS} ${step >= s.step ? 'bg-accent text-white' : 'bg-surface-2 text-text-muted'}`}>
              {s.step}
            </div>
            <span className={`text-sm ${step >= s.step ? 'text-text-primary' : 'text-text-muted'}`}>{s.label}</span>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {step === 1 && (
            <Card padding="lg">
              <h3 className="font-display text-2xl text-text-primary">Dirección de envío</h3>
              <div className="mt-4 grid gap-4">
                <Input label="Calle" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
                <Input label="Ciudad" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                <Input label="Código postal" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} required />
                <Input label="País" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} required />
              </div>
              <Button className={`mt-6 ${FOCUS}`} onClick={() => setStep(2)}>
                Continuar
              </Button>
            </Card>
          )}
          {step === 2 && (
            <Card padding="lg">
              <h3 className="font-display text-2xl text-text-primary">Resumen del pedido</h3>
              <div className="mt-4 space-y-3">
                {items.map((i) => (
                  <div key={i.key} className="flex justify-between text-sm text-text-secondary">
                    <span>
                      {i.product.name} x{i.quantity}
                    </span>
                    <span className="font-mono">{formatCurrency(i.product.price * i.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-border pt-3">
                <div className="flex justify-between font-display text-xl text-text-primary">
                  <span>Total</span>
                  <span className="font-mono">{formatCurrency(total)}</span>
                </div>
                <p className="mt-1 text-xs text-text-muted">Enviar a: {user?.name} — {address.city}</p>
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="secondary" className={FOCUS} onClick={() => setStep(1)}>
                  Volver
                </Button>
                <Button className={FOCUS} onClick={submitOrder} loading={loading}>
                  Confirmar pedido
                </Button>
              </div>
            </Card>
          )}
          {step === 3 && (
            <Card padding="lg">
              <h3 className="font-display text-2xl text-text-primary">Método de pago</h3>
              <p className="mt-2 text-sm text-text-secondary">Elige cómo quieres pagar tu orden <span className="font-mono text-accent">#{orderId}</span></p>
              <div className="mt-6 grid gap-4">
                <button
                  type="button"
                  onClick={payWithMercadoPago}
                  disabled={loading}
                  className={`flex items-center justify-between rounded-xl border border-border p-4 transition hover:border-accent ${FOCUS}`}
                >
                  <div>
                    <p className="font-medium text-text-primary">Mercado Pago</p>
                    <p className="text-xs text-text-muted">Pago seguro con Mercado Pago</p>
                  </div>
                  <span className="text-accent font-mono text-sm">Pagar</span>
                </button>
                <button
                  type="button"
                  onClick={payWithStripe}
                  disabled={loading}
                  className={`flex items-center justify-between rounded-xl border border-border p-4 transition hover:border-accent ${FOCUS}`}
                >
                  <div>
                    <p className="font-medium text-text-primary">Stripe</p>
                    <p className="text-xs text-text-muted">Pago seguro con Stripe</p>
                  </div>
                  <span className="text-accent font-mono text-sm">Pagar</span>
                </button>
              </div>
              <div className="mt-6">
                <Button variant="secondary" className={FOCUS} onClick={() => setStep(2)}>
                  Volver
                </Button>
              </div>
            </Card>
          )}
          {step === 4 && (
            <Card padding="lg" className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
                <Check className="h-8 w-8 text-success" />
              </div>
              <h3 className="mt-4 font-display text-3xl text-text-primary">¡Pedido confirmado!</h3>
              <p className="mt-2 text-text-secondary">Tu número de orden es:</p>
              <p className="mt-1 font-mono text-2xl text-accent">{orderNumber}</p>
              <Button className={`mt-6 ${FOCUS}`} onClick={() => navigate(ROUTES.STORE)}>
                Volver a la tienda
              </Button>
            </Card>
          )}
        </div>
        <div>
          <Card padding="lg">
            <h3 className="font-display text-xl text-text-primary">Cliente</h3>
            <p className="mt-2 text-sm text-text-secondary">{user?.name}</p>
            <p className="text-sm text-text-muted">{user?.email}</p>
          </Card>
        </div>
      </div>
      <SEOHead title="Checkout" description="Finaliza tu compra en la tienda de Cabaxx." noIndex />
    </div>
  );
}
