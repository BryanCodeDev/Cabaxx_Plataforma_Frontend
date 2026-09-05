import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { eventService } from '@/services/modules';
import { ROUTES } from '@/constants';
import Spinner from '@/components/common/Spinner';
import { EmptyState } from '@/components/common';
import Button from '@/components/common/Button';
import LikeButton from '@/components/common/LikeButton';
import CommentSection from '@/components/common/CommentSection';
import { formatDate, formatCurrency } from '@/utils/format';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

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

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
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
    <div className="container-fluid py-10 sm:py-12">
      <Link
        to={ROUTES.EVENTS}
        className="inline-flex items-center gap-1 text-sm text-text-secondary transition hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-md"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a eventos
      </Link>

      <img src={event.banner_url} alt={event.title} className="mt-6 aspect-[21/9] w-full rounded-2xl object-cover shadow-card" />

      <div className="mt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Evento</p>
        <h1 className="font-display text-display-sm text-text-primary">{event.title}</h1>
        <p className="mt-3 font-mono text-text-secondary">{formatDate(event.start_datetime)} · {event.venue_name}</p>
        <p className="mt-4 text-text-secondary">{event.description}</p>
        <div className="mt-4">
          <LikeButton referenceType="event" referenceId={event.id} initialCount={event.likes_count || 0} />
        </div>
      </div>

      <h3 className="mt-10 text-xl font-display text-text-primary">Boletos disponibles</h3>
      <div className="mt-4 space-y-3">
        {event.tickets?.map((t) => (
          <div key={t.id} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium text-text-primary">{t.name}</p>
              <p className="font-mono text-sm text-text-muted">{formatCurrency(t.price, t.currency)}</p>
            </div>
            <Button size="sm" onClick={() => buy(t.id)} className="sm:shrink-0">
              Comprar
            </Button>
          </div>
        ))}
      </div>

      <CommentSection referenceType="event" referenceId={event.id} title="Comentarios del evento" />
    </div>
  );
}
