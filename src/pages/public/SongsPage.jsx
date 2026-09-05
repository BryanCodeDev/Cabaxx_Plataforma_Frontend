import { songService } from '@/services/modules';
import ListingPage from '@/components/common/ListingPage';
import Card from '@/components/common/Card';
import { Link } from 'react-router-dom';
import { formatDuration } from '@/utils/format';
import SEOHead from '@/components/seo/SEOHead';
import { useArtist } from '@/hooks/useArtist';

export default function SongsPage() {
  const { artist } = useArtist();
  return (
    <section className="bg-primary">
      <SEOHead title="Canciones" description={`Canciones y discografía de ${artist?.stage_name || 'Cabaxx'}. Escucha todos sus temas.`} />
      <ListingPage
        eyebrow="Discografía"
        title="Canciones"
        subtitle="Sencillos, cortes de álbum y rarezas. La línea de tiempo del sonido."
        service={songService.getSongs}
        resource="songs"
        renderItem={(s) => (
          <Link key={s.id} to={`/canciones/${s.slug}`} className="group block">
            <Card hover padding="sm" className="overflow-hidden">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={s.cover_url}
                  alt={s.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-3 px-1 pb-1">
                <p className="truncate font-medium text-text-primary transition-colors group-hover:text-accent">
                  {s.title}
                </p>
                <p className="mt-0.5 font-mono text-xs text-text-muted tabular-nums">
                  {formatDuration(s.duration_seconds)}
                </p>
              </div>
            </Card>
          </Link>
        )}
      />
    </section>
  );
}
