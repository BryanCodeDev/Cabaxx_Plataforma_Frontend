import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import './index.css';

if (typeof window !== 'undefined') {
  const isWebVitalsDevToolsNoise = (message, source) => {
    if (typeof message !== 'string') return false;
    if (source && source !== 'console' && source !== 'error') return false;
    return (
      message.includes("Cannot read properties of undefined (reading 'startTime')") ||
      message.includes('reportAllChanges') ||
      message.includes('requestIdleCallback')
    );
  };

  const originalError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (isWebVitalsDevToolsNoise(String(message), source)) {
      return true;
    }
    if (typeof originalError === 'function') {
      return originalError(message, source, lineno, colno, error);
    }
    return false;
  };

  window.addEventListener('error', (event) => {
    if (event && isWebVitalsDevToolsNoise(String(event.message), 'error')) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event && event.reason;
    const text =
      reason && typeof reason === 'object' && 'message' in reason
        ? String(reason.message)
        : String(reason || '');
    if (isWebVitalsDevToolsNoise(text, 'error')) {
      event.preventDefault();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
