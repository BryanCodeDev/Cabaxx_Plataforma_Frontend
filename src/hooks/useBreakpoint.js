import { useEffect, useState } from 'react';

const QUERIES = {
  xs: '(min-width: 480px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  '3xl': '(min-width: 1920px)',
  '4xl': '(min-width: 2560px)',
};

const initial = () => {
  if (typeof window === 'undefined') return {};
  return Object.fromEntries(
    Object.entries(QUERIES).map(([k, q]) => [k, window.matchMedia(q).matches])
  );
};

export function useBreakpoint() {
  const [bp, setBp] = useState(initial);

  useEffect(() => {
    const mqls = Object.entries(QUERIES).map(([k, q]) => {
      const mql = window.matchMedia(q);
      const handler = (e) => setBp((prev) => ({ ...prev, [k]: e.matches }));
      mql.addEventListener('change', handler);
      handler(mql);
      return [mql, handler];
    });
    return () => mqls.forEach(([mql, handler]) => mql.removeEventListener('change', handler));
  }, []);

  return bp;
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    handler(mql);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return matches;
}