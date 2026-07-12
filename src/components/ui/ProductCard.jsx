import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { formatCurrency } from '@/utils/format';

export default function ProductCard({ product, onClick }) {
  return (
    <Card onClick={onClick} className="overflow-hidden">
      <img src={product.coverUrl} alt={product.name} className="aspect-square w-full object-cover" />
      <div className="p-3">
        <p className="truncate font-medium">{product.name}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-semibold text-brand-primary">
            {formatCurrency(product.price, product.currency)}
          </span>
          <Badge color={product.stockQuantity > 0 ? 'success' : 'danger'}>
            {product.stockQuantity > 0 ? 'En stock' : 'Agotado'}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
