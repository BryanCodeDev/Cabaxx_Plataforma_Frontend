import { EmptyState, Chip, Spinner, SectionHeading, Card } from '@/components/common';
import { useState, useEffect } from 'react';
import { ArrowLeft, Disc3, Play } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useParams, Link } from 'react-router-dom';
import { albumService } from '@/services/modules';
import { ROUTES } from '@/constants';
import { formatDate, formatDuration } from '@/utils/format';
import Button from '@/components/common/Button';
import SEOHead from '@/components/seo/SEOHead';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-md';

export default function AlbumDetailPage() {
  const { slug } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    albumService
      .getAlbumBySlug(slug)
      .then((res) => { if (isMounted) setAlbum(res.data.data.album || res.data.album); })
      .catch(() => toast.error('Álbum no encontrado'))
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" color="accent" />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="container-fluid py-12">
        <EmptyState title="Álbum no encontrado" description="El álbum que buscas ya no está disponible." />
      </div>
    );
  }

  const sortedSongs = [...(album.songs || [])].sort((a, b) => a.track_number - b.track_number);
  const totalDuration = sortedSongs.reduce((acc, s) => acc + (s.duration_seconds || 0), 0);

  return (
    <article className="container-fluid py-10 sm:py-14">
      <SEOHead title={album.title} description={album.description || `Álbum ${album.title} de Cabaxx`} />

      <Link
        to={ROUTES.ALBUMS}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted transition hover:text-text-primary ${FOCUS}`}
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Volver a álbumes
      </Link>

      <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-start">
        <div className="relative shrink-0 self-start">
          <div className="absolute -inset-3 -z-10 rounded-3xl bg-accent/[0.1] blur-2xl" aria-hidden="true" />
          <img
            src={album.cover_url}
            alt={album.title}
            className="aspect-square w-full max-w-xs rounded-2xl border border-white/[0.08] object-cover shadow-elev-2 md:h-80 md:w-80 md:max-w-none"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Chip variant="accent" icon={<Disc3 className="h-3 w-3" aria-hidden="true" />}>
              {album.type || 'Álbum'}
            </Chip>
            <Chip variant="default">
              {sortedSongs.length} {sortedSongs.length === 1 ? 'canción' : 'canciones'}
            </Chip>
            {totalDuration > 0 && (
              <Chip variant="subtle">
                {formatDuration(totalDuration)}
              </Chip>
            )}
          </div>
          <h1 className="mt-4 font-display text-display-sm tracking-tight text-text-primary">
            {album.title}
          </h1>
          <p className="mt-2 font-mono text-xs text-text-muted tabular-nums">
            {formatDate(album.release_date, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          {album.description && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary">{album.description}</p>
          )}
          {sortedSongs.length > 0 && (
            <div className="mt-6">
              <Button icon={<Play className="h-4 w-4" aria-hidden="true" />}>
                Escuchar álbum
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="section-rule my-14" aria-hidden="true" />

      {sortedSongs.length > 0 ? (
        <section aria-label="Tracklist">
          <SectionHeading
            eyebrow="Tracklist"
            title="Canciones del álbum"
            subtitle={`${sortedSongs.length} ${sortedSongs.length === 1 ? 'tema' : 'temas'}`}
          />
          <Card padding="none" className="mt-6 overflow-hidden">
            <ol className="divide-y divide-white/[0.05]">
              {sortedSongs.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3.5 transition hover:bg-white/[0.02] sm:px-5">
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="w-7 shrink-0 text-right font-mono text-xs text-text-muted tabular-nums">
                      {String(s.track_number).padStart(2, '0')}
                    </span>
                    <p className="truncate text-sm font-medium text-text-primary">{s.title}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-text-muted tabular-nums">
                    {formatDuration(s.duration_seconds)}
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        </section>
      ) : (
        <EmptyState title="Sin canciones" description="Aún no hay canciones registradas en este álbum." />
      )}
    </article>
  );
}
