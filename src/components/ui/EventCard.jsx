import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { formatDate, formatCurrency } from '@/utils/format';

export default function EventCard({ event, onClick }) {
  return (
    <Card onClick={onClick} className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-medium">{event.title}</p>
          <p className="text-sm text-slate-500">
            {event.venueName} · {event.city}
          </p>
        </div>
        <Badge color={event.isFree ? 'success' : 'primary'}>
          {event.isFree ? 'Gratis' : formatCurrency(event.minPrice)}
        </Badge>
      </div>
      <p className="mt-2 text-sm text-slate-600">{formatDate(event.startDatetime)}</p>
    </Card>
  );
}
