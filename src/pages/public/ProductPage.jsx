import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { useCart } from '@/context/CartContext';
import { ARTIST_SLUG, ROUTES } from '@/constants';
import { toast } from 'react-hot-toast';
import Button from '@/components/common/Button';
import Spinner from '@/components/common/Spinner';
import { EmptyState } from '@/components/common';
import Card from '@/components/common/Card';
import { formatCurrency } from '@/utils/format';
import SEOHead from '@/components/seo/SEOHead';

export default function ProductPage() {
  const { slug } = useParams();
  const { data, loading } = useFetch(`/artists/${ARTIST_SLUG}/products/${slug}`);
  const { addItem } = useCart();
  const product = data?.data?.product;

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!product) {
    return (
      <div className="container-fluid py-12">
        <EmptyState title="Producto no encontrado" description="Este producto ya no está disponible." />
      </div>
    );
  }

  return (
    <div className="container-fluid py-10 sm:py-12">
      <Link
        to={ROUTES.STORE}
        className="inline-flex items-center gap-1 text-sm text-text-secondary transition hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-md"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a la tienda
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <Card padding="none" className="overflow-hidden">
          <img
            src={product.cover_url || product.image_url}
            alt={product.name}
            className="aspect-square w-full rounded-2xl object-cover"
          />
        </Card>
        <div className="min-w-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Merch oficial</p>
          <h1 className="font-display text-display-sm text-text-primary">{product.name}</h1>
          <p className="mt-3 text-text-secondary">{product.description}</p>
          <p className="mt-5 font-mono text-3xl text-accent">{formatCurrency(product.price)} COP</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {(product.variants || []).map((v) => (
              <span
                key={v.id}
                className="rounded-lg border border-border px-3 py-1 text-sm text-text-secondary"
              >
                {v.name}
              </span>
            ))}
          </div>

          <Button
            className="mt-8"
            disabled={product.status === 'sold_out'}
            onClick={() => {
              addItem(product, product.variants?.[0] || null);
              toast.success('Agregado al carrito');
            }}
          >
            {product.status === 'sold_out' ? 'Agotado' : 'Añadir al carrito'}
          </Button>
        </div>
      </div>
      <SEOHead title={product?.name || 'Producto'} description={product?.description || 'Producto de Cabaxx'} />
    </div>
  );
}
