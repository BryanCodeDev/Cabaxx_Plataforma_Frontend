import Card from '@/components/common/Card';

export default function AlbumCard({ album, onClick }) {
  return (
    <Card onClick={onClick} className="overflow-hidden">
      <img src={album.coverUrl} alt={album.title} className="aspect-square w-full object-cover" />
      <div className="p-3">
        <p className="truncate font-medium">{album.title}</p>
        <p className="text-sm capitalize text-slate-500">{album.type}</p>
      </div>
    </Card>
  );
}
