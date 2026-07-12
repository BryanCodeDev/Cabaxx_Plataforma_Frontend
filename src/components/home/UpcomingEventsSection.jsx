import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ARTIST_SLUG } from '@/constants';
import { useFetch } from '@/hooks/useFetch';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import SectionHeading from '@/components/common/SectionHeading';

export default function UpcomingEventsSection() {
  const { data } = useFetch(`/artists/${ARTIST_SLUG}/events`, { params: { limit: 3 } });
  const events = data?.events?.rows || [];
  const [ref, isVisible] = useScrollReveal();

  if (!events.length) {
    return (
      <section id="events" className="mx-auto max-w-6xl px-4 py-24">
        <SectionHeading eyebrow="Agenda" title="Próximos Eventos" />
        <p className="mt-6 text-text-muted">Pronto anunciaremos fechas. ¡Mantente atento!</p>
      </section>
    );
  }

  return (
    <section id="events" ref={ref} className="mx-auto max-w-6xl px-4 py-24">
      <SectionHeading
        eyebrow="Agenda"
        title="Próximos Eventos"
        action={
          <Link to="/eventos">
            <Button variant="ghost" size="sm">Ver todos <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        }
      />

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {events.map((ev, i) => (
          <Link
            key={ev.id}
            to={`/eventos/${ev.slug}`}
            className={`transition-all duration-500 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <Card hover padding="md" className="h-full">
              <div className="flex items-start justify-between">
                <div className="rounded-xl border border-border bg-surface-2 px-3 py-2 text-center">
                  <p className="text-xs uppercase text-text-muted">
                    {new Date(ev.start_datetime).toLocaleString('es-CO', { month: 'short' })}
                  </p>
                  <p className="font-display text-2xl text-gold">{new Date(ev.start_datetime).getDate()}</p>
                </div>
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
                  {ev.is_free ? 'Gratis' : 'Entrada'}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="font-display text-2xl text-text-primary">{ev.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{ev.venue_name}</p>
                <p className="text-sm text-text-muted">{ev.city}</p>
              </div>
              <Button variant="secondary" size="sm" className="mt-4 w-full">
                Conseguir Entradas
              </Button>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}