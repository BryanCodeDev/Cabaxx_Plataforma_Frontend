import { useState, useEffect, useRef, useCallback } from 'react';
import api from '@/services/api';

// Hook genérico para GET con loading, error, data y refetch
export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchData = useCallback(
    async (override = {}) => {
      setLoading(true);
      setError(null);
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      try {
        const { data: res } = await api.get(url, {
          signal: abortRef.current.signal,
          params: { ...options.params, ...override.params },
        });
        setData(res.data);
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err.response?.data?.message || 'Error de red');
        }
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [url]
  );

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
