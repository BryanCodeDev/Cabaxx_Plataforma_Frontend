import { EmptyState, SectionHeading, Badge, Spinner, Pagination } from '@/components/common';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { albumService } from '@/services/modules';
import { PAGINATION } from '@/constants';
import { artistPhotos } from '@/assets';
import { formatDate } from '@/utils/format';
import Card from '@/components/common/Card';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import SEOHead from '@/components/seo/SEOHead';
import { useArtist } from '@/hooks/useArtist';

export default function AlbumsPage() {
  const { artist } = useArtist();
  const [page, setPage] = useState(1);
  const [albums, setAlbums] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [ref, isVisible] = useScrollReveal();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    albumService
      .getAlbums({ page, limit: PAGINATION.DEFAULT_LIMIT })
      .then((res) => {
        if (!isMounted) return;
        const d = res.data?.data?.albums || {};
        setAlbums(d.rows || []);
        setTotal(d.total || 0);
        setTotalPages(res.data?.pagination?.totalPages || Math.ceil((d.total || 0) / PAGINATION.DEFAULT_LIMIT) || 1);
      })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [page]);

  return (
    <section className="container-fluid py-14 sm:py-20">
      <header className="max-w-3xl">
        <SectionHeading
          eyebrow="Discografía"
          title="Álbumes"
          subtitle="Sencillos, EPs y proyectos del catálogo. La línea de tiempo del sonido."
        />
      </header>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" color="accent" />
        </div>
      ) : albums.length === 0 ? (
        <EmptyState
          className="mt-12"
          title="Sin álbumes por ahora"
          description="Pronto habrá nueva música disponible."
        />
      ) : (
        <div ref={ref} className="grid-cards mt-10">
          {albums.map((a, i) => (
            <Link
              key={a.id}
              to={`/albumes/${a.slug}`}
              className={`group block transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Card hover padding="md" className="overflow-hidden">
                <img
                  src={a.cover_url || artistPhotos[i % artistPhotos.length]}
                  alt={a.title}
                  className="aspect-square w-full rounded-xl object-cover"
                  loading="lazy"
                />
                <div className="mt-3 px-1">
                  <p className="truncate font-medium text-text-primary transition-colors group-hover:text-accent">
                    {a.title}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {a.type && <Badge variant="accent" size="sm">{a.type}</Badge>}
                    <span className="font-mono text-xs text-text-muted">
                      {formatDate(a.release_date, { year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-12">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} total={total} limit={PAGINATION.DEFAULT_LIMIT} />
        </div>
      )}

      <SEOHead title="Álbumes" description={`Álbumes y sencillos de ${artist?.stage_name || 'Cabaxx'}.`} />
    </section>
  );
}
