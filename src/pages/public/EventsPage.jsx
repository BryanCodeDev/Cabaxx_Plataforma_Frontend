import { eventService } from '@/services/modules';
import ListingPage from '@/components/common/ListingPage';
import Card from '@/components/common/Card';
import { Link } from 'react-router-dom';
import { formatDate } from '@/utils/format';
import Badge from '@/components/common/Badge';
import { ROUTES } from '@/constants';
import SEOHead from '@/components/seo/SEOHead';
import { useArtist } from '@/hooks/useArtist';

export default function EventsPage() {
  const { artist } = useArtist();
  return (
    <>
      <SEOHead title="Eventos" description={`Próximos eventos y conciertos de ${artist?.stage_name || 'Cabaxx'}.`} />
      <ListingPage
        title="Eventos"
        service={eventService.getEvents}
        renderItem={(e) => (
          <Link key={e.id} to={`/eventos/${e.slug}`}>
            <Card hover padding="md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{e.title}</p>
                  <p className="text-sm text-text-muted">{e.venue_name || e.city}</p>
                </div>
                <Badge variant={e.is_free ? 'success' : 'accent'}>{e.is_free ? 'Gratis' : 'Entrada'}</Badge>
              </div>
              <p className="mt-2 text-sm text-text-secondary">{formatDate(e.start_datetime)}</p>
            </Card>
          </Link>
        )}
      />
    </>
  );
}
