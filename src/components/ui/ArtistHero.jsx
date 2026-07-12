import { useArtist } from '@/context/ArtistContext';

export default function ArtistHero() {
  const { artist } = useArtist();
  if (!artist) return null;
  return (
    <div className="relative">
      <img src={artist.bannerUrl} alt="" className="h-48 w-full object-cover md:h-64" />
      <div className="mx-auto -mt-12 max-w-6xl px-4">
        <div className="flex items-end gap-4">
          <img
            src={artist.avatarUrl}
            alt={artist.stageName}
            className="h-24 w-24 rounded-full border-4 border-white object-cover shadow"
          />
          <div className="pb-2">
            <h1 className="font-heading text-2xl font-bold">{artist.stageName}</h1>
            <p className="text-sm text-slate-500">{artist.genre}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
