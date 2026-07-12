import { useEffect, useState } from 'react';
import { useFetch } from '@/hooks/useFetch';
import { ARTIST_SLUG } from '@/constants';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import SectionHeading from '@/components/common/SectionHeading';

const PLATFORMS = ['Spotify', 'Apple Music', 'YouTube Music', 'Deezer'];

export default function LatestReleaseSection() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/songs`, { params: { limit: 1 } });
  const latest = data?.songs?.rows?.[0];
  const [ref, isVisible] = useScrollReveal();
  const [count, setCount] = useState(0);
  const target = latest?.play_count || 0;

  useEffect(() => {
    if (!target || !isVisible) return;
    const duration = 1800;
    const startTime = performance.now();
    let frame;
    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, isVisible]);

  if (!latest) return null;

  return (
    <section id="latest" ref={ref} className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
      <SectionHeading eyebrow="Recién salido del horno" title="Último Lanzamiento" />

      <div
        className={`mt-8 rounded-2xl bg-gradient-to-br from-accent/50 via-border to-gold/40 p-px transition-all duration-700 sm:mt-10 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <div className="flex flex-col items-center gap-6 rounded-2xl bg-surface p-5 sm:p-8 md:flex-row md:gap-8">
          <img
            src={latest.cover_url}
            alt={latest.title}
            className="h-40 w-40 shrink-0 rounded-xl object-cover shadow-card sm:h-48 sm:w-48 md:h-56 md:w-56"
          />
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Sencillo · {latest.album_title || 'Nuevo Sencillo'}
            </p>
            <h3 className="mt-3 font-display text-3xl text-text-primary sm:text-4xl md:text-5xl">{latest.title}</h3>
            <p className="mt-2 text-text-secondary">{latest.release_date || '2025'}</p>

            <div className="mt-5 flex flex-wrap justify-center gap-2 sm:gap-3 md:justify-start">
              {PLATFORMS.map((platform) => (
                <button
                  key={platform}
                  className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs text-text-secondary transition hover:border-accent/50 hover:text-text-primary sm:px-4 sm:py-2 sm:text-sm"
                >
                  {platform}
                </button>
              ))}
            </div>

            <p className="mt-6 text-sm text-text-muted">
              <span className="font-mono text-xl text-gold">{count.toLocaleString('es-CO')}</span>{' '}
              reproducciones
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}