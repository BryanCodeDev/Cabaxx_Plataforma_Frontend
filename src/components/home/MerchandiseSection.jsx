import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ARTIST_SLUG } from '@/constants';
import { useFetch } from '@/hooks/useFetch';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import SectionHeading from '@/components/common/SectionHeading';

export default function MerchandiseSection() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/products`, { params: { limit: 4 } });
  const products = data?.products?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  return (
    <section ref={ref} className="border-y border-border bg-surface/50">
      <div className="mx-auto max-w-6xl px-4 py-24">
        <SectionHeading
          eyebrow="Merch oficial"
          title="Tienda"
          action={
            <Link to="/tienda">
              <Button variant="ghost" size="sm">Ver tienda <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </Link>
          }
        />

        {products.length === 0 ? (
          <p className="mt-10 text-text-muted">La tienda abre pronto. Vuelve en unos días.</p>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
            {products.map((p, i) => (
              <Link
                key={p.id}
                to={`/tienda/${p.slug}`}
                className={`transition-all duration-500 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <Card hover padding="sm" className="relative h-full">
                  {p.status === 'new' && (
                    <Badge variant="accent" size="sm" className="absolute left-2 top-2 z-10">NUEVO</Badge>
                  )}
                  {p.status === 'sold_out' && (
                    <Badge variant="error" size="sm" className="absolute left-2 top-2 z-10">AGOTADO</Badge>
                  )}
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={p.cover_url}
                      alt={p.name}
                      className="aspect-square w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 px-1">
                    <p className="truncate font-medium text-text-primary">{p.name}</p>
                    <p className="mt-1 font-mono text-sm text-gold">
                      ${p.price?.toLocaleString('es-CO')} COP
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}