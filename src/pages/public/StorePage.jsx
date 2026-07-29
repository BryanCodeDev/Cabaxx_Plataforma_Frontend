import { EmptyState, SectionHeading } from '@/components/common'
import { ARTIST_SLUG } from '@/constants';
import { useFetch } from '@/hooks/useFetch';
import ProductCard from '@/components/ui/ProductCard';
import Spinner from '@/components/common/Spinner';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import SEOHead from '@/components/seo/SEOHead';

export default function StorePage() {
  const { data, loading } = useFetch(`/artists/${ARTIST_SLUG}/products`, { params: { limit: 24 } });
  const products = data?.products?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  return (
    <>
      <SEOHead title="Tienda" description={`Tienda oficial de Cabaxx. Merch, música y más.`} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <SectionHeading eyebrow="Merch oficial" title="Tienda" />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" color="accent" />
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="La tienda abre pronto"
          description="Aún no hay productos disponibles. Vuelve en unos días para ver el merch oficial."
        />
      ) : (
        <div ref={ref} className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((p, i) => (
            <div
              key={p.id}
              className={`transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
}
