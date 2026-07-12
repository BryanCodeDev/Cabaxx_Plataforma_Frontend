import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import SectionHeading from '@/components/common/SectionHeading';
import EmptyState from '@/components/common/EmptyState';
import { ROUTES } from '@/constants';
import { formatCurrency } from '@/utils/format';
import { toast } from 'react-hot-toast';
import SEOHead from '@/components/seo/SEOHead';

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary';

export default function CartPage() {
  const { items, total, itemCount, removeItem, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [applying, setApplying] = useState(false);

  const applyCoupon = async () => {
    if (!coupon) return;
    setApplying(true);
    try {
      await fetch('/api/v1/store/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon }),
      });
      setDiscount(0.1);
      toast.success('Cupón aplicado');
    } catch {
      toast.error('Cupón inválido');
    } finally {
      setApplying(false);
    }
  };

  const subtotal = total;
  const discountAmt = subtotal * discount;
  const shipping = subtotal > 200000 ? 0 : 15000;
  const finalTotal = subtotal - discountAmt + shipping;

  if (!items.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20">
        <EmptyState
          title="Tu carrito está vacío"
          description="Explora la tienda y añade productos."
          action={
            <Link to={ROUTES.STORE} className={FOCUS}>
              <Button>Ir a la tienda</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading eyebrow="Tu selección" title="Carrito de Compras" />
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <Card key={item.key} padding="md" className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <img src={item.product.cover_url} alt={item.product.name} className="h-20 w-20 rounded-lg object-cover" />
              <div className="flex-1">
                <Link to={`/tienda/${item.product.slug}`} className={`font-medium text-text-primary transition hover:text-accent ${FOCUS}`}>
                  {item.product.name}
                </Link>
                <p className="text-sm text-text-muted">{item.variant?.name || 'Única'}</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm" className={FOCUS} onClick={() => updateQuantity(item.product.id, item.variant?.id, item.quantity - 1)}>
                  -
                </Button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <Button variant="secondary" size="sm" className={FOCUS} onClick={() => updateQuantity(item.product.id, item.variant?.id, item.quantity + 1)}>
                  +
                </Button>
              </div>
              <p className="font-mono text-sm text-text-primary">{formatCurrency(item.product.price * item.quantity)}</p>
              <Button variant="ghost" size="sm" className={FOCUS} onClick={() => removeItem(item.product.id, item.variant?.id)}>
                Eliminar
              </Button>
            </Card>
          ))}
        </div>
        <div>
          <Card padding="lg">
            <h3 className="font-display text-2xl text-text-primary">Resumen</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Descuento</span>
                <span className="font-mono">-{formatCurrency(discountAmt)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Envío</span>
                <span className="font-mono">{shipping === 0 ? 'Gratis' : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-display text-xl text-text-primary">
                <span>Total</span>
                <span className="font-mono">{formatCurrency(finalTotal)}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <div className="flex-1">
                <Input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Cupón" aria-label="Cupón" />
              </div>
              <Button variant="secondary" className={FOCUS} onClick={applyCoupon} disabled={applying}>
                Aplicar
              </Button>
            </div>
            <Link to={isAuthenticated ? ROUTES.CHECKOUT : ROUTES.LOGIN} state={{ from: { pathname: ROUTES.CHECKOUT } }} className={FOCUS}>
              <Button fullWidth className="mt-4">
                Finalizar Compra
              </Button>
            </Link>
          </Card>
        </div>
      </div>
      <SEOHead title="Carrito" description="Tu carrito de compras en la tienda de Cabaxx." noIndex />
    </div>
  );
}
