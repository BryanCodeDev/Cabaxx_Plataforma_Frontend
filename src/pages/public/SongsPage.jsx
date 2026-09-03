import { songService } from '@/services/modules';
import ListingPage from '@/components/common/ListingPage';
import Card from '@/components/common/Card';
import { Link } from 'react-router-dom';
import { formatDuration } from '@/utils/format';
import { ROUTES } from '@/constants';
import SEOHead from '@/components/seo/SEOHead';
import { useArtist } from '@/hooks/useArtist';

export default function SongsPage() {
  const { artist } = useArtist();
  return (
    <>
      <SEOHead title="Canciones" description={`Canciones y discografía de ${artist?.stage_name || 'Cabaxx'}. Escucha todos sus temas.`} />
      <ListingPage
        title="Canciones"
        service={songService.getSongs}
        resource="songs"
        renderItem={(s) => (
          <Link key={s.id} to={`/canciones/${s.slug}`}>
            <Card hover padding="sm">
              <img src={s.cover_url} alt={s.title} className="aspect-square w-full rounded-lg object-cover" />
              <div className="mt-2 px-1 pb-1">
                <p className="truncate font-medium">{s.title}</p>
                <p className="text-xs text-text-muted">{formatDuration(s.duration_seconds)}</p>
              </div>
            </Card>
          </Link>
        )}
      />
    </>
  );
}
