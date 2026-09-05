import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import AppRouter from '@/router/AppRouter';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { ThemeProvider } from '@/context/ThemeContext';

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#22C55E', secondary: 'var(--color-surface)' } },
              error: { iconTheme: { primary: '#EF4444', secondary: 'var(--color-surface)' } },
            }}
          />
          <RouterProvider router={AppRouter} />
        </ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  );
}
