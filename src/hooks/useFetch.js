import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import api from '@/services/api';

// Hook genérico para GET con loading, error, data y refetch.
// El backend responde `{ success, message, data, pagination? }`. Exponemos
// `data` (el sobre) y `pagination` para los endpoints paginados.
export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const abortRef = useRef(null);
  const paramsKey = useMemo(() => JSON.stringify(options.params || {}), [options.params]);

  const fetchData = useCallback(
    async (override = {}) => {
      setLoading(true);
      setError(null);
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      try {
        const params = override.params
          ? { ...JSON.parse(paramsKey), ...override.params }
          : JSON.parse(paramsKey);
        const { data: res } = await api.get(url, {
          signal: abortRef.current.signal,
          params,
        });
        setData(res);
        setPagination(res?.pagination ?? null);
      } catch (err) {
        if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
          setError(err.response?.data?.message || 'Error de red');
        }
      } finally {
        setLoading(false);
      }
    },
    [url, paramsKey]
  );

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  return { data, loading, error, pagination, refetch: fetchData };
}
