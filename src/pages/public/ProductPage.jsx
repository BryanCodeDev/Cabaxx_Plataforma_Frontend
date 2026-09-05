import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import { useCart } from '@/context/CartContext';
import { ARTIST_SLUG, ROUTES } from '@/constants';
import { toast } from 'react-hot-toast';
import Button from '@/components/common/Button';
import PageSpinner from '@/components/common/PageSpinner';
import { EmptyState, Chip, Card } from '@/components/common';
import StickyBottomCTA from '@/components/common/StickyBottomCTA';
import { formatCurrency } from '@/utils/format';
import SEOHead from '@/components/seo/SEOHead';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-md';

export default function ProductPage() {
  const { slug } = useParams();
  const { data, loading } = useFetch(`/artists/${ARTIST_SLUG}/products/${slug}`);
  const { addItem } = useCart();
  const product = data?.data?.product;
  const soldOut = product?.status === 'sold_out';

  const addToCart = () => {
    if (!product) return;
    addItem(product, product.variants?.[0] || null);
    toast.success('Agregado al carrito');
  };

  if (loading) return <PageSpinner label="Cargando producto" />;
  if (!product) {
    return (
      <div className="container-fluid py-12">
        <EmptyState title="Producto no encontrado" description="Este producto ya no está disponible." />
      </div>
    );
  }

  return (
    <article className="container-fluid pb-24 pt-10 sm:pb-12 sm:pt-14">
      <Link
        to={ROUTES.STORE}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted transition hover:text-text-primary ${FOCUS}`}
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Volver a la tienda
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <Card padding="none" className="overflow-hidden border-white/[0.08]">
          <img
            src={product.cover_url || product.image_url}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </Card>
        <div className="min-w-0">
          <Chip variant="accent" icon={<Package className="h-3 w-3" aria-hidden="true" />}>
            Merch oficial
          </Chip>
          <h1 className="mt-4 font-display text-display-sm tracking-tight text-text-primary">
            {product.name}
          </h1>
          {product.description && (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-secondary">{product.description}</p>
          )}
          <p className="mt-6 font-mono text-3xl font-semibold tabular-nums text-text-primary">
            {formatCurrency(product.price)} <span className="text-sm text-text-muted">COP</span>
          </p>

          {product.variants?.length > 0 && (
            <div className="mt-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-text-muted">Variantes</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <span
                    key={v.id}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs font-semibold text-text-secondary"
                  >
                    {v.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Button
            className="mt-8 hidden sm:inline-flex"
            disabled={soldOut}
            onClick={addToCart}
            icon={<ShoppingCart className="h-4 w-4" aria-hidden="true" />}
          >
            {soldOut ? 'Agotado' : 'Añadir al carrito'}
          </Button>
        </div>
      </div>
      <SEOHead title={product?.name || 'Producto'} description={product?.description || 'Producto de Cabaxx'} />

      <StickyBottomCTA
        price={`${formatCurrency(product.price)} COP`}
        primary={{
          label: soldOut ? 'Agotado' : 'Añadir al carrito',
          onClick: addToCart,
          disabled: soldOut,
          icon: <ShoppingCart className="h-4 w-4" />,
        }}
      />
    </article>
  );
}
