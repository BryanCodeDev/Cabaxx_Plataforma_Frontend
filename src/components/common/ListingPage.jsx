import { useState, useEffect } from 'react';
import { ARTIST_SLUG } from '@/constants';
import Spinner from '@/components/common/Spinner';
import Pagination from '@/components/common/Pagination';
import SectionHeading from '@/components/common/SectionHeading';
import EmptyState from '@/components/common/EmptyState';
import { PAGINATION } from '@/constants';

export default function ListingPage({
  title,
  eyebrow,
  service,
  renderItem,
  dataKey = 'rows',
  totalKey = 'total',
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
        const payload = res.data.data;
        setItems(payload[dataKey] || payload.rows || []);
        setTotal(payload[totalKey] || payload.total || 0);
        setTotalPages(Math.ceil((payload[totalKey] || payload.total || 0) / PAGINATION.DEFAULT_LIMIT) || 1);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [service, page]);

  if (loading && !items.length) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" color="accent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <SectionHeading eyebrow={eyebrow} title={title} />

      {items.length === 0 ? (
        <EmptyState
          className="mt-8"
          title="Aún no hay contenido"
          description={`No encontramos ${title.toLowerCase()} por ahora. Vuelve pronto.`}
        />
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((it) => renderItem(it))}
        </div>
      )}

      <div className="mt-8">
        <Pagination currentPage={page} totalPages={totalPages} total={total} onPageChange={setPage} />
      </div>
    </div>
  );
}
