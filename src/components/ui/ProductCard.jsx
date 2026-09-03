import Card from '@/components/common/Card';
import { Badge } from '@/components/common';
import { formatCurrency } from '@/utils/format';

export default function ProductCard({ product, onClick }) {
  const cover = product?.cover_url || product?.coverUrl || product?.image_url || '';
  const stock = product?.stock_quantity ?? product?.stockQuantity ?? 0;
  return (
    <Card onClick={onClick} className="overflow-hidden">
      <img src={cover} alt={product?.name || 'Producto'} className="aspect-square w-full object-cover" loading="lazy" />
      <div className="p-3">
        <p className="truncate font-medium">{product?.name}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-semibold text-accent">
            {formatCurrency(product?.price, product?.currency)}
          </span>
          <Badge variant={stock > 0 ? 'success' : 'error'}>
            {stock > 0 ? 'En stock' : 'Agotado'}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
