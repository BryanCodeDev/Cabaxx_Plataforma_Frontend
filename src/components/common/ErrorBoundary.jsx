import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-primary p-6">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Error</p>
            <h2 className="mt-3 font-display text-3xl uppercase text-text-primary">Algo salió mal</h2>
            <p className="mt-2 text-sm text-text-muted">{this.state.error?.message || 'Error desconocido'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(229,9,20,0.3)] transition hover:bg-accent-hover"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}