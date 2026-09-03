import { EmptyState, SectionHeading } from '@/components/common'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { videoService } from '@/services/modules';
import { PAGINATION, ROUTES } from '@/constants';
import { artistPhotos } from '@/assets';
import { formatDate, formatNumber } from '@/utils/format';
import Spinner from '@/components/common/Spinner';
import Card from '@/components/common/Card';
import Pagination from '@/components/common/Pagination';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Play } from 'lucide-react';
import SEOHead from '@/components/seo/SEOHead';
import { useArtist } from '@/hooks/useArtist';

export default function VideosPage() {
  const { artist } = useArtist();
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [ref, isVisible] = useScrollReveal();

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    videoService
      .getVideos({ page, limit: PAGINATION.DEFAULT_LIMIT })
      .then((res) => {
        if (!isMounted) return;
        const d = res.data?.data?.videos || {};
        setVideos(d.rows || []);
        setTotal(d.total || 0);
        setTotalPages(res.data?.pagination?.totalPages || Math.ceil((d.total || 0) / PAGINATION.DEFAULT_LIMIT) || 1);
      })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [page]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading eyebrow="Audiovisual" title="Videos" />

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" color="accent" />
        </div>
      ) : videos.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="Sin videos por ahora"
          description="Pronto publicaremos nuevo contenido audiovisual."
        />
      ) : (
        <div ref={ref} className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {videos.map((v, i) => (
            <Link key={v.id} to={`/videos/${v.slug}`}>
              <div
                className={`transition-all duration-500 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <Card hover padding="md" className="overflow-hidden">
                  <div className="relative aspect-video overflow-hidden rounded-xl">
                    <img
                      src={v.thumbnail_url || v.cover_url || artistPhotos[i % artistPhotos.length]}
                      alt={v.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition duration-200 group-hover:opacity-100">
                      <Play className="h-10 w-10 text-white drop-shadow" />
                    </div>
                  </div>
                  <div className="mt-3 px-1">
                    <p className="truncate font-medium text-text-primary">{v.title}</p>
                    <p className="mt-1 font-mono text-xs text-text-muted">{formatNumber(v.views_count)} vistas · {formatDate(v.published_at, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
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
      <SEOHead title="Videos" description={`Videos musicales y detrás de cámaras de ${artist?.stage_name || 'Cabaxx'}.`} />
      </div>
  );
}
