import { useArtist } from '@/context/ArtistContext';

export function useArtistTheme() {
  const { artist } = useArtist();
  return artist?.theme || null;
}
