import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Resets the scroll position to the top on every pathname change.
 * - Skips when only the hash changes (so anchor links keep their position).
 * - Skips when navigating to the same pathname (avoids jumping on query updates).
 * - Respects `prefers-reduced-motion`: jumps instantly instead of smooth.
 */
export default function ScrollToTop({ excludePaths = [], behavior = 'auto' }) {
  const { pathname, hash, key } = useLocation();
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (excludePaths.includes(pathname)) return;
    if (pathname === previousPath.current) return;
    previousPath.current = pathname;

    // Wait a tick so the new page can paint at scroll=0 before we animate.
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scrollBehavior = reduceMotion ? 'auto' : behavior;

    if (hash) {
      // Defer to let the element render before scrolling to it.
      requestAnimationFrame(() => {
        const id = hash.slice(1);
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
          return;
        }
        window.scrollTo({ top: 0, left: 0, behavior: scrollBehavior });
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: scrollBehavior });
  }, [pathname, hash, key, behavior, excludePaths]);

  return null;
}
