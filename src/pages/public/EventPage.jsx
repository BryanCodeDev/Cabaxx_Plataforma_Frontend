import { useState, useEffect } from 'react';
import { ArrowLeft, Ticket, MapPin, Clock, Calendar } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { eventService } from '@/services/modules';
import { ROUTES } from '@/constants';
import PageSpinner from '@/components/common/PageSpinner';
import { EmptyState, Chip, SectionHeading } from '@/components/common';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import LikeButton from '@/components/common/LikeButton';
import CommentSection from '@/components/common/CommentSection';
import StickyBottomCTA from '@/components/common/StickyBottomCTA';
import { formatDate, formatCurrency } from '@/utils/format';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-md';

export default function EventPage() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventService
      .getEventBySlug(slug)
      .then((res) => setEvent(res.data.data.event))
      .catch(() => toast.error('Evento no encontrado'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <PageSpinner label="Cargando evento" />;
  if (!event) {
    return (
      <div className="container-fluid py-12">
        <EmptyState title="Evento no encontrado" description="El evento que buscas ya no está disponible." />
      </div>
    );
  }

  const buy = async (ticketId) => {
    if (!isAuthenticated) return toast.error('Inicia sesión para comprar');
    try {
      await eventService.purchaseTicket(ticketId, 1);
      toast.success('¡Boleto comprado!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'No se pudo comprar');
    }
  };

  return (
    <article className="container-fluid pb-24 pt-10 sm:pb-12 sm:pt-14">
      <Link
        to={ROUTES.EVENTS}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted transition hover:text-text-primary ${FOCUS}`}
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Volver a eventos
      </Link>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08] shadow-elev-2">
        <img
          src={event.banner_url}
          alt={event.title}
          className="aspect-[21/9] w-full object-cover"
        />
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <Chip variant="accent">{event.is_free ? 'Entrada libre' : 'Boletería'}</Chip>
        <h1 className="font-display text-display-sm tracking-tight text-text-primary">
          {event.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDate(event.start_datetime, { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {new Date(event.start_datetime).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {event.venue_name} · {event.city}
          </span>
        </div>
        {event.description && (
          <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">{event.description}</p>
        )}
        <div className="mt-2">
          <LikeButton referenceType="event" referenceId={event.id} initialCount={event.likes_count || 0} />
        </div>
      </div>

      <div className="section-rule my-14" aria-hidden="true" />

      <section aria-label="Boletos">
        <SectionHeading
          eyebrow="Boletos"
          title="Tipos de entrada"
          subtitle="Asegura tu lugar antes de que se agote la tanda."
        />
        <div className="mt-6 space-y-3">
          {event.tickets?.map((t) => (
            <Card key={t.id} padding="md" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-text-primary">{t.name}</p>
                <p className="mt-0.5 font-mono text-sm tabular-nums text-text-muted">
                  {t.price === 0 ? 'Entrada libre' : formatCurrency(t.price, t.currency)}
                </p>
              </div>
              <Button
                size="md"
                onClick={() => buy(t.id)}
                className="sm:shrink-0"
                icon={<Ticket className="h-4 w-4" aria-hidden="true" />}
              >
                Comprar
              </Button>
            </Card>
          ))}
        </div>
      </section>

      <CommentSection referenceType="event" referenceId={event.id} title="Comentarios del evento" />

      {event.tickets?.[0] && (
        <StickyBottomCTA
          price={
            event.tickets[0].price === 0
              ? 'Entrada libre'
              : `${formatCurrency(event.tickets[0].price, event.tickets[0].currency)}`
          }
          primary={{
            label: 'Conseguir entrada',
            onClick: () => buy(event.tickets[0].id),
            icon: <Ticket className="h-4 w-4" />,
          }}
        />
      )}
    </article>
  );
}
