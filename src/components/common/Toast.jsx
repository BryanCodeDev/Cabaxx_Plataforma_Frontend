import { Toaster } from 'react-hot-toast';

/**
 * Wrapper de react-hot-toast con estilos del sistema de diseño MAP.
 */
export default function Toast() {
  return (
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
  );
}
