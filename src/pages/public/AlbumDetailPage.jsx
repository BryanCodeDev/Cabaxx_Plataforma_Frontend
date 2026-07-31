import { EmptyState, Badge } from '@/components/common'
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { albumService } from '@/services/modules';
import { ROUTES } from '@/constants';
import { formatDate, formatDuration } from '@/utils/format';
import Spinner from '@/components/common/Spinner';
import Card from '@/components/common/Card';
import SEOHead from '@/components/seo/SEOHead';

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

  const sortedSongs = [...(album.songs || [])].sort((a, b) => a.track_number - b.track_number);

  return (
    <>
      <SEOHead title={album.title} description={album.description || `Álbum ${album.title} de Cabitaxx`} />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link to={ROUTES.ALBUMS} className="inline-flex items-center gap-1 text-sm text-text-secondary transition hover:text-text-primary">
          <ArrowLeft className="h-4 w-4" /> Volver a álbumes
        </Link>

        <div className="mt-6 flex flex-col gap-8 md:flex-row">
          <img src={album.cover_url} alt={album.title} className="h-64 w-64 rounded-2xl object-cover shadow-card md:h-80 md:w-80" />
          <div className="flex-1">
            <Badge variant="accent">{album.type}</Badge>
            <h1 className="mt-3 font-display text-4xl text-text-primary md:text-5xl">{album.title}</h1>
            <p className="mt-3 font-mono text-text-secondary">{formatDate(album.release_date, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="mt-4 text-text-secondary">{album.description}</p>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-display text-text-primary">Tracklist</h3>
          <div className="mt-4 space-y-2">
            {sortedSongs.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition hover:border-accent/30">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-text-muted w-6 text-right">{String(s.track_number).padStart(2, '0')}</span>
                  <p className="font-medium text-text-primary">{s.title}</p>
                </div>
                <span className="font-mono text-sm text-text-muted">{formatDuration(s.duration_seconds)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
