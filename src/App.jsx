import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import AppRouter from '@/router';

export default function App() {
  return (
    <HelmetProvider>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1A1A1A',
            color: '#FFFFFF',
            border: '1px solid #2E2E2E',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22C55E', secondary: '#1A1A1A' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#1A1A1A' } },
        }}
      />
      <AppRouter />
    </HelmetProvider>
  );
}
