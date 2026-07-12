import { formatDuration } from '@/utils/format';
import Card from '@/components/common/Card';

export default function SongCard({ song, onClick }) {
  return (
    <Card onClick={onClick} className="overflow-hidden">
      <img src={song.coverUrl} alt={song.title} className="aspect-square w-full object-cover" />
      <div className="p-3">
        <p className="truncate font-medium">{song.title}</p>
        <p className="text-sm text-slate-500">{formatDuration(song.durationSeconds)}</p>
      </div>
    </Card>
  );
}
