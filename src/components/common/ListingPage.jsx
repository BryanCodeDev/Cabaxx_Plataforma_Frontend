import { SectionHeading, EmptyState } from '@/components/common'
import { useState, useEffect } from 'react';
import { ARTIST_SLUG } from '@/constants';
import Spinner from '@/components/common/Spinner';
import Pagination from '@/components/common/Pagination';
import { PAGINATION } from '@/constants';

export default function ListingPage({
  title,
  eyebrow,
  service,
  resource,
  renderItem,
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
    return () => {
      active = false;
    };
  }, [service, page, resource]);

  if (loading && !items.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-primary">
        <Spinner size="lg" color="accent" />
      </div>
    );
  }

  return (
    <div className="container-fluid bg-primary py-14 sm:py-20">
      <SectionHeading eyebrow={eyebrow} title={title} />

      {items.length === 0 ? (
        <EmptyState
          className="mt-10"
          title="Aún no hay contenido"
          description={`No encontramos ${title.toLowerCase()} por ahora. Vuelve pronto.`}
        />
      ) : (
        <div className="grid-cards mt-10">
          {items.map((it) => renderItem(it))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12">
          <Pagination currentPage={page} totalPages={totalPages} total={total} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}