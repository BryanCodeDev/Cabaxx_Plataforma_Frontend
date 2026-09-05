import { useEffect, useState, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollUtilities() {
  const [scroll, setScroll] = useState(0);
  const [showTop, setShowTop] = useState(false);

  const onScroll = useCallback(() => {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    setScroll(h > 0 ? Math.min(100, (y / h) * 100) : 0);
    setShowTop(y > window.innerHeight * 0.6);
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [onScroll]);

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${scroll / 100})` }}
      />
      {showTop && (
        <button
          type="button"
          onClick={toTop}
          aria-label="Volver arriba"
          className="fixed bottom-6 right-6 z-[55] flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/85 text-white shadow-elev-2 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent hover:shadow-glow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}