import { useContext } from 'react';
import { ArtistContext } from '@/context/ArtistContext';

// Atajo para ArtistContext
export function useArtist() {
  const ctx = useContext(ArtistContext);
  if (!ctx) throw new Error('useArtist must be used within ArtistProvider');
  return ctx;
}
