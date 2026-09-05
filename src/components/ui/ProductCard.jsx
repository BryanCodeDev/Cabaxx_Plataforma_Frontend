import Card from '@/components/common/Card';
import { Badge } from '@/components/common';
import { formatCurrency } from '@/utils/format';

export default function ProductCard({ product, onClick }) {
  const cover = product?.cover_url || product?.coverUrl || product?.image_url || '';
  const stock = product?.stock_quantity ?? product?.stockQuantity ?? 0;
  const soldOut = stock <= 0 || product?.status === 'sold_out';

  return (
    <Card padding="none" onClick={onClick} className="group block overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-surface">
        <img
          src={cover}
          alt={product?.name || 'Producto'}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-premium group-hover:scale-105"
        />
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Badge variant="default">Agotado</Badge>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="p-3 sm:p-4">
        <p className="line-clamp-2 text-sm font-medium text-text-primary transition-colors group-hover:text-accent">
          {product?.name}
        </p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="font-mono text-sm font-bold tabular-nums">
            {formatCurrency(product?.price, product?.currency)}
          </span>
          {!soldOut && (
            <span className="text-[10px] uppercase tracking-[0.15em] text-success">En stock</span>
          )}
        </div>
      </div>
    </Card>
  );
}