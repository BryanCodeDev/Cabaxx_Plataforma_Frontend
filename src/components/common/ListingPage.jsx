import { SectionHeading, EmptyState } from '@/components/common';
import Spinner from '@/components/common/Spinner';
import Pagination from '@/components/common/Pagination';
import { useState, useEffect } from 'react';
import { ARTIST_SLUG, PAGINATION } from '@/constants';

/**
 * ListingPage — layout estándar para páginas de listado (Canciones, Álbumes, etc).
 *  - Hero editorial (eyebrow + título + subtítulo opcional + contador)
 *  - Grid `grid-cards` responsivo
 *  - Paginación unificada
 *  - EmptyState consistente
 *
 * @param {string} title
 * @param {string} eyebrow
 * @param {string} subtitle
 * @param {Function} service - (artistSlug, params) => Promise<Axios>
 * @param {string} resource - 'songs' | 'albums' | 'events' | 'products' | 'posts' | 'videos'
 * @param {Function} renderItem - (item) => ReactNode
 * @param {string} gridClass - override grid (default 'grid-cards')
 */
export default function ListingPage({
  title,
  eyebrow,
  subtitle,
  service,
  resource,
  renderItem,
  gridClass = 'grid-cards',
}) {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    service(ARTIST_SLUG, { page, limit: PAGINATION.DEFAULT_LIMIT })
      .then((res) => {
        if (!active) return;
        const payload = res.data?.data?.[resource] || res.data?.data || {};
        const rows = payload.rows || [];
        const totalCount = payload.total || 0;
        setItems(rows);
        setTotal(totalCount);
        setTotalPages(Math.ceil(totalCount / PAGINATION.DEFAULT_LIMIT) || 1);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [service, page, resource]);

  if (loading && !items.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-primary">
        <Spinner size="lg" color="accent" />
      </div>
    );
  }

  return (
    <section className="container-fluid bg-primary py-14 sm:py-20">
      <header className="max-w-3xl">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          action={
            total > 0 ? (
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted tabular-nums">
                {total.toLocaleString('es-CO')} {total === 1 ? 'resultado' : 'resultados'}
              </span>
            ) : null
          }
        />
      </header>

      {items.length === 0 ? (
        <EmptyState
          className="mt-12"
          title="Aún no hay contenido"
          description={`No encontramos ${title.toLowerCase()} por ahora. Vuelve pronto.`}
        />
      ) : (
        <div className={`${gridClass} mt-10`}>
          {items.map((it) => renderItem(it))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination currentPage={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        </div>
      )}
    </section>
  );
}
