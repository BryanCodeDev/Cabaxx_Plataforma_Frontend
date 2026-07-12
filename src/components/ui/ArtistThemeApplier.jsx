import { useArtist } from '@/context/ArtistContext';
import { useTheme } from '@/context/ThemeContext';
import { useEffect } from 'react';

export default function ArtistThemeApplier() {
  const { artist } = useArtist();
  const { applyArtistTheme } = useTheme();

  useEffect(() => {
    if (artist?.theme) applyArtistTheme(artist.theme);
  }, [artist, applyArtistTheme]);

  return null;
}
