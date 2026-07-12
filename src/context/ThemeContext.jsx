import { createContext, useContext, useEffect } from 'react';
import { useArtist } from '@/context/ArtistContext';

const ThemeContext = createContext(null);
export { ThemeContext };

export function ThemeProvider({ children }) {
  const { artist, isLoading } = useArtist();
  const theme = artist?.theme || null;

  function applyArtistTheme(themeData) {
    if (!themeData) return;
    const root = document.documentElement;
    if (themeData.primary_color) root.style.setProperty('--color-primary', themeData.primary_color);
    if (themeData.secondary_color) root.style.setProperty('--color-secondary', themeData.secondary_color);
    if (themeData.accent_color) root.style.setProperty('--color-accent', themeData.accent_color);
    if (themeData.font_heading) root.style.setProperty('--font-heading', themeData.font_heading);
    if (themeData.font_body) root.style.setProperty('--font-body', themeData.font_body);
    if (themeData.dark_mode_default) root.classList.add('dark');
    else root.classList.remove('dark');
  }

  useEffect(() => {
    if (theme) applyArtistTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, applyArtistTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
