import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { songService } from '@/services/modules';
import { ROUTES } from '@/constants';
import PageSpinner from '@/components/common/PageSpinner';
import { EmptyState, Chip } from '@/components/common';
import Button from '@/components/common/Button';
import LikeButton from '@/components/common/LikeButton';
import CommentSection from '@/components/common/CommentSection';
import { formatDuration } from '@/utils/format';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Play, Music2 } from 'lucide-react';
import SEOHead from '@/components/seo/SEOHead';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-md';

export default function SongPage() {
  const { slug } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    songService
      .getSongBySlug(slug)
      .then((res) => setSong(res.data.data.song))
      .catch(() => toast.error('Canción no encontrada'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <PageSpinner label="Cargando canción" />;
  if (!song) {
    return (
      <div className="container-fluid py-12">
        <EmptyState title="Canción no encontrada" description="El tema que buscas ya no está disponible." />
      </div>
    );
  }

  const play = async () => {
    try {
      await songService.registerPlay(song.id, { source: 'web' });
      toast.success('Reproduciendo');
    } catch {
      /* ignore */
    }
  };

  const spotify = song.streaming_links?.find((l) => /spotify/i.test(l.platform || ''));
  const spotifyId = spotify?.url?.match(/track\/([a-zA-Z0-9]+)/)?.[1];

  return (
    <article className="container-fluid py-10 sm:py-14">
      <Link
        to={ROUTES.SONGS}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted transition hover:text-text-primary ${FOCUS}`}
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Volver a canciones
      </Link>

      <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-start">
        <div className="relative shrink-0 self-start">
          <div className="absolute -inset-3 -z-10 rounded-3xl bg-accent/[0.1] blur-2xl" aria-hidden="true" />
          <img
            src={song.cover_url}
            alt={song.title}
            className="aspect-square w-full max-w-xs rounded-2xl border border-white/[0.08] object-cover shadow-elev-2 md:h-80 md:w-80 md:max-w-none"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Chip variant="accent" icon={<Music2 className="h-3 w-3" aria-hidden="true" />}>
              Canción
            </Chip>
            {song.album_title && (
              <Chip variant="default">
                {song.album_title}
              </Chip>
            )}
          </div>
          <h1 className="mt-4 font-display text-display-sm tracking-tight text-text-primary">
            {song.title}
          </h1>
          <p className="mt-2 font-mono text-xs text-text-muted tabular-nums">
            {formatDuration(song.duration_seconds)} · {song.release_date || ''}
          </p>
          <SEOHead title={song.title} description={`${song.title} - ${song.album_title || 'Cabaxx'}. Escucha y letra oficial.`} />
          {song.description && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-secondary">{song.description}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button onClick={play} icon={<Play className="h-4 w-4" aria-hidden="true" />}>
              Reproducir
            </Button>
            <LikeButton referenceType="song" referenceId={song.id} initialCount={song.likes_count || 0} />
          </div>
        </div>
      </div>

      <div className="section-rule my-14" aria-hidden="true" />

      {spotifyId && (
        <section aria-label="Reproductor" className="mt-8">
          <h2 className="font-display text-2xl uppercase tracking-wide text-text-primary">Reproductor</h2>
          <iframe
            src={`https://open.spotify.com/embed/track/${spotifyId}`}
            title="Spotify"
            height="152"
            className="mt-4 w-full rounded-xl border border-white/[0.06]"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </section>
      )}

      {song.streaming_links?.length > 0 && (
        <section aria-label="Plataformas" className="mt-10">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-text-muted">Escúchalo en</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {song.streaming_links.map((l) => (
              <a
                key={l.platform}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary transition hover:border-white/20 hover:text-text-primary ${FOCUS}`}
              >
                {l.platform}
              </a>
            ))}
          </div>
        </section>
      )}

      {song.lyrics && (
        <section aria-label="Letra" className="mt-12 max-w-2xl">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.22em] text-text-muted">Letra</h2>
          <p className="mt-4 whitespace-pre-line font-display text-xl uppercase leading-snug tracking-tight text-text-primary sm:text-2xl">
            {song.lyrics}
          </p>
        </section>
      )}

      <CommentSection referenceType="song" referenceId={song.id} title="Comentarios de la canción" />
    </article>
  );
}
