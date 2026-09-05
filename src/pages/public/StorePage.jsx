import { EmptyState, SectionHeading, Spinner } from '@/components/common';
import { ARTIST_SLUG } from '@/constants';
import { useFetch } from '@/hooks/useFetch';
import ProductCard from '@/components/ui/ProductCard';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import SEOHead from '@/components/seo/SEOHead';

export default function StorePage() {
  const { data, loading } = useFetch(`/artists/${ARTIST_SLUG}/products`, { params: { limit: 24 } });
  const products = data?.data?.products?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  return (
    <section className="container-fluid py-14 sm:py-20">
      <SEOHead title="Tienda" description="Tienda oficial de Cabaxx. Merch, música y más." />

      <header className="max-w-3xl">
        <SectionHeading
          eyebrow="Merch oficial"
          title="Tienda"
          subtitle="Ediciones limitadas, drops y piezas firmadas. Cuando se agotan, no vuelven."
        />
      </header>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" color="accent" />
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          className="mt-12"
          title="La tienda abre pronto"
          description="Aún no hay productos disponibles. Vuelve en unos días para ver el merch oficial."
        />
      ) : (
        <div ref={ref} className="grid-cards mt-10">
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
    </section>
  );
}
