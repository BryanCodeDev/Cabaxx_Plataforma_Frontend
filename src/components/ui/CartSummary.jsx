import { formatCurrency } from '@/utils/format';
import Button from '@/components/common/Button';

export default function CartSummary({ items, total, onCheckout }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="font-semibold">Resumen</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((i) => (
          <li key={i.product.id} className="flex justify-between">
            <span>
              {i.product.name} x{i.quantity}
            </span>
            <span>{formatCurrency(i.product.price * i.quantity, i.product.currency)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 font-semibold">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
      <Button className="mt-4 w-full" onClick={onCheckout}>
        Pagar
      </Button>
    </div>
  );
}
