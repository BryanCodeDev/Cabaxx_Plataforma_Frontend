import { useState, useCallback } from 'react';
import { ROUTES } from '@/constants';

export function usePagination(initialLimit = 12) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const next = () => setPage((p) => p + 1);
  const prev = () => setPage((p) => Math.max(1, p - 1));
  const goTo = (p) => setPage(p);
  return { page, limit, setLimit, next, prev, goTo, params: { page, limit } };
}
