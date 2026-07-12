import { useEffect, useState } from 'react';
import { useArtist } from '@/hooks/useArtist';
import { useAuth } from '@/hooks/useAuth';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { communityService, artistService } from '@/services/modules';
import Button from '@/components/common/Button';
import FollowButton from '@/components/common/FollowButton';
import SectionHeading from '@/components/common/SectionHeading';
import { ARTIST_SLUG } from '@/constants';
import { artistPortrait } from '@/assets';

export default function AboutSection() {
  const { artist } = useArtist();
  const { isAuthenticated } = useAuth();
  const [ref, isVisible] = useScrollReveal({ threshold: 0.3 });
  const [stats, setStats] = useState([
    { label: 'Seguidores', value: 0, suffix: '' },
    { label: 'Reproducciones', value: 0, suffix: '' },
    { label: 'Años activo', value: 8, suffix: '' },
    { label: 'Shows realizados', value: 340, suffix: '+' },
  ]);

  useEffect(() => {
    if (!isVisible) return;
    let cancelled = false;
    (async () => {
      try {
        const [statsRes, followsRes] = await Promise.all([
          isAuthenticated ? artistService.getArtistStats(ARTIST_SLUG).catch(() => null) : Promise.resolve(null),
          communityService.countFollows(artist?.id).catch(() => null),
        ]);
        if (cancelled) return;
        const statsData = statsRes?.data?.data?.stats || statsRes?.data?.stats || {};
        const followers = followsRes?.data?.data?.total || followsRes?.data?.total || 0;
        setStats((prev) => prev.map((s, i) => {
          if (i === 0) return { ...s, value: followers };
          if (i === 1) return { ...s, value: statsData.total_plays || statsData.plays_count || 0 };
          return s;
        }));
      } catch {
        // keep defaults
      }
    })();
    return () => { cancelled = true; };
  }, [isVisible, artist?.id, isAuthenticated]);

  return (
    <section ref={ref} className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
      <div
        className={`flex flex-col items-center gap-8 transition-all duration-700 md:flex-row md:gap-14 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <div className="relative shrink-0">
          <div className="absolute -inset-2 -z-10 rounded-2xl bg-gradient-to-br from-accent/40 to-gold/30 blur-lg" />
          <img
            src={artist?.avatar_url || artistPortrait}
            alt={artist?.name}
            loading="lazy"
            className="h-48 w-48 rounded-2xl border border-border/60 object-cover shadow-card sm:h-60 sm:w-60 md:h-72 md:w-72"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <SectionHeading eyebrow="Biografía" title="Acerca del Artista" />
          <p className="mt-6 leading-relaxed text-text-secondary">
            {artist?.bio ||
              'Cabaxx es uno de los artistas urbanos más representativos de Colombia. Nacido en Medellín, ha revolucionado el género con su estilo único y auténtico, fusionando reggaetón, trap y ritmos tradicionales colombianos.'}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-surface p-3 text-center transition hover:-translate-y-1 hover:border-gold/50 hover:shadow-card sm:p-4"
              >
                <p className="font-mono text-xl text-gold sm:text-2xl">
                  {(s.value || 0).toLocaleString('es-CO')}
                  {s.suffix}
                </p>
                <p className="mt-1 text-xs text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center md:justify-start">
            <FollowButton artistId={artist?.id} />
          </div>
        </div>
      </div>
    </section>
  );
}