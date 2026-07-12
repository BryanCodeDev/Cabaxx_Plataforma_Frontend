import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { albumService } from '@/services/modules';
import { ARTIST_SLUG, PAGINATION, ROUTES } from '@/constants';
import { artistPhotos } from '@/assets';
import { formatDate } from '@/utils/format';
import Spinner from '@/components/common/Spinner';
import EmptyState from '@/components/common/EmptyState';
import SectionHeading from '@/components/common/SectionHeading';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Pagination from '@/components/common/Pagination';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import SEOHead from '@/components/seo/SEOHead';

export default function AlbumsPage() {
  const [page, setPage] = useState(1);
  const [albums, setAlbums] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    albumService
      .getAlbums(ARTIST_SLUG, { page, limit: PAGINATION.DEFAULT_LIMIT })
      .then((res) => {
        if (!isMounted) return;
        const d = res.data?.data?.albums || res.data?.albums || {};
        setAlbums(d.rows || []);
        setTotal(d.total || 0);
        setTotalPages(d.totalPages || Math.ceil((d.total || 0) / PAGINATION.DEFAULT_LIMIT) || 1);
      })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [page]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading eyebrow="Discografía" title="Álbumes" />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" color="accent" />
        </div>
      ) : albums.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="Sin álbumes por ahora"
          description="Pronto habrá nueva música disponible."
        />
      ) : (
        <div ref={ref} className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {albums.map((a, i) => (
            <Link key={a.id} to={`/albumes/${a.slug}`}>
              <div
                className={`transition-all duration-500 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <Card hover padding="md" className="overflow-hidden">
                  <img
                    src={a.cover_url || artistPhotos[i % artistPhotos.length]}
                    alt={a.title}
                    className="aspect-square w-full rounded-xl object-cover"
                  />
                  <div className="mt-3 px-1">
                    <p className="truncate font-medium text-text-primary">{a.title}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="gold" size="sm">{a.type}</Badge>
                      <span className="font-mono text-xs text-text-muted">{formatDate(a.release_date, { year: 'numeric' })}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-10">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} total={total} limit={PAGINATION.DEFAULT_LIMIT} />
        </div>
      )}
      <SEOHead title="Álbumes" description="Álbumes y sencillos de Cabitaxx." />
      </div>
  );
}
