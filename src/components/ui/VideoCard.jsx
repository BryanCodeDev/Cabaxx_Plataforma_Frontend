import Card from '@/components/common/Card';
import { formatDate } from '@/utils/format';
import { Play } from 'lucide-react';

export default function VideoCard({ video, onClick }) {
  return (
    <Card onClick={onClick} className="overflow-hidden">
      <div className="relative aspect-video w-full bg-slate-900">
        <img src={video.thumbnailUrl} alt={video.title} className="h-full w-full object-cover opacity-80" />
        <Play className="absolute inset-0 m-auto h-10 w-10 text-white" />
      </div>
      <div className="p-3">
        <p className="truncate font-medium">{video.title}</p>
        <p className="text-sm text-slate-500">{formatDate(video.publishedAt)}</p>
      </div>
    </Card>
  );
}
