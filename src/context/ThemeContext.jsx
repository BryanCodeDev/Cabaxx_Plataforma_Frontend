import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'cabaxx:theme';
const ThemeContext = createContext({
  theme: 'dark',
  setTheme: () => {},
  toggle: () => {},
  systemPreference: 'dark',
});

const getSystemPref = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';

const apply = (theme) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.add('light');
    root.style.colorScheme = 'light';
  } else {
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
  }
};

export function ThemeProvider({ children, defaultTheme = 'dark' }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return defaultTheme;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return defaultTheme;
  });
  const [systemPreference, setSystemPreference] = useState(getSystemPref);

  useEffect(() => {
    apply(theme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e) => setSystemPreference(e.matches ? 'light' : 'dark');
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const setTheme = useCallback((next) => {
    setThemeState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (_) { /* noop */ }
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle, systemPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
