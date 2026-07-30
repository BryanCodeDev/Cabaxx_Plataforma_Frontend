import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { artistService } from '@/services/modules';

const ArtistContext = createContext(null);
export { ArtistContext };

export function ArtistProvider({ children }) {
  const [artist, setArtist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadArtist = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await artistService.getArtist();
      setArtist(data.data.artist);
    } catch (err) {
      setError(err.response?.data?.message || 'Artista no encontrado');
      setArtist(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArtist();
  }, [loadArtist]);

  return (
    <ArtistContext.Provider value={{ artist, isLoading, error, loadArtist }}>
      {children}
    </ArtistContext.Provider>
  );
}

export function useArtist() {
  const ctx = useContext(ArtistContext);
  if (!ctx) throw new Error('useArtist must be used within ArtistProvider');
  return ctx;
}
