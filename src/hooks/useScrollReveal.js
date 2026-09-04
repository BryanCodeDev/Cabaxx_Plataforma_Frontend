import { useEffect, useRef, useState } from 'react';

export function useScrollReveal({ threshold = 0.05, once = true, rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

    // Safety net: si el observer no dispara en 1.5s (por ejemplo,
    // porque el usuario aterrizó en un hash que scrollea), mostrar
    // igual. Evita secciones "fantasma" sin contenido visible.
    const fallback = setTimeout(() => setIsVisible(true), 1500);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, [threshold, once, rootMargin]);

  return [ref, isVisible];
}
