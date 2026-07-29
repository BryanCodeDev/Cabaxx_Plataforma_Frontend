import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { songService } from '@/services/modules';
import { ARTIST_SLUG, ROUTES } from '@/constants';
import Spinner from '@/components/common/Spinner';
import { EmptyState } from '@/components/common';
import Button from '@/components/common/Button';
import LikeButton from '@/components/common/LikeButton';
import CommentSection from '@/components/common/CommentSection';
import { formatDuration } from '@/utils/format';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Play } from 'lucide-react';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-md';

export default function SongPage() {
  const { slug } = useParams();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    songService
      .getSongBySlug(ARTIST_SLUG, slug)
      .then((res) => setSong(res.data.data.song))
      .catch(() => toast.error('Canción no encontrada'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!song) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
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
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Link to={ROUTES.SONGS} className={`inline-flex items-center gap-1 text-sm text-text-secondary transition hover:text-text-primary ${FOCUS}`}>
        <ArrowLeft className="h-4 w-4" /> Volver a canciones
      </Link>

      <div className="mt-6 flex flex-col gap-8 md:flex-row">
        <img
          src={song.cover_url}
          alt={song.title}
          className="h-64 w-64 rounded-2xl object-cover shadow-card md:h-80 md:w-80"
        />
        <div className="flex-1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold">Canción</p>
          <h1 className="font-display text-4xl text-text-primary md:text-5xl">{song.title}</h1>
          <p className="mt-3 font-mono text-text-secondary">{formatDuration(song.duration_seconds)}</p>
          <SEOHead title={song.title} description={`${song.title} - ${song.album_title || 'Cabaxx'}. Escucha y letra oficial.`} />
          <p className="mt-4 text-text-secondary">{song.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button onClick={play}><Play className="mr-2 h-4 w-4" /> Reproducir</Button>
            <LikeButton referenceType="song" referenceId={song.id} initialCount={song.likes_count || 0} />
          </div>
          {song.streaming_links?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-text-secondary">Escúchalo en</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                {song.streaming_links.map((l) => (
                  <a
                    key={l.platform}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`text-accent transition hover:text-accent-hover ${FOCUS}`}
                  >
                    {l.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {spotifyId && (
        <div className="mt-10">
          <h2 className="font-display text-2xl text-text-primary">Reproductor</h2>
          <iframe
            src={`https://open.spotify.com/embed/track/${spotifyId}`}
            title="Spotify"
            height="152"
            className="mt-3 w-full rounded-xl"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      )}

      {song.lyrics && (
        <div className="mt-10">
          <h2 className="font-display text-2xl text-text-primary">Letra</h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-text-secondary">{song.lyrics}</p>
        </div>
      )}

      <CommentSection referenceType="song" referenceId={song.id} title="Comentarios de la canción" />
    </div>
  );
}
