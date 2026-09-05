import { EmptyState, SectionHeading, Badge } from '@/components/common'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { albumService } from '@/services/modules';
import { PAGINATION, ROUTES } from '@/constants';
import { artistPhotos } from '@/assets';
import { formatDate } from '@/utils/format';
import Spinner from '@/components/common/Spinner';
import Card from '@/components/common/Card';
import Pagination from '@/components/common/Pagination';
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
    <div className="container-fluid py-12">
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
        <div ref={ref} className="grid-cards mt-8">
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
                      <Badge variant="accent" size="sm">{a.type}</Badge>
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
      <SEOHead title="Álbumes" description={`Álbumes y sencillos de ${artist?.stage_name || 'Cabaxx'}.`} />
    </div>
  );
}
