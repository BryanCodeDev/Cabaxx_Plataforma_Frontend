import { eventService } from '@/services/modules';
import ListingPage from '@/components/common/ListingPage';
import Card from '@/components/common/Card';
import { Link } from 'react-router-dom';
import { formatDate } from '@/utils/format';
import { Badge } from '@/components/common';
import SEOHead from '@/components/seo/SEOHead';
import { useArtist } from '@/hooks/useArtist';

export default function EventsPage() {
  const { artist } = useArtist();
  return (
    <>
      <SEOHead title="Eventos" description={`Próximos eventos y conciertos de ${artist?.stage_name || 'Cabaxx'}.`} />
      <ListingPage
        eyebrow="Agenda"
        title="Eventos"
        subtitle="Shows en vivo, festivales y fechas confirmadas. Consigue tu entrada antes de que se agote la tanda."
        service={eventService.getEvents}
        resource="events"
        renderItem={(e) => (
          <Link key={e.id} to={`/eventos/${e.slug}`}>
            <Card hover padding="md">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium">{e.title}</p>
                  <p className="mt-0.5 text-sm text-text-muted">{e.venue_name || e.city}</p>
                </div>
                <Badge variant={e.is_free ? 'success' : 'accent'} size="sm">
                  {e.is_free ? 'Gratis' : 'Entrada'}
                </Badge>
              </div>
              <p className="mt-3 font-mono text-xs text-text-muted tabular-nums">{formatDate(e.start_datetime)}</p>
            </Card>
          </Link>
        )}
      />
    </>
  );
}
