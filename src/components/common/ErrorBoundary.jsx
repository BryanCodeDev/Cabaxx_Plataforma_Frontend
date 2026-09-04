import { Component } from 'react';
import { AlertTriangle, Home, RefreshCw, Bug, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    if (typeof console !== 'undefined') {
      console.error('[ErrorBoundary]', error, errorInfo);
    }

    if (typeof this.props.onError === 'function') {
      try {
        this.props.onError(error, errorInfo);
      } catch (cbErr) {
        console.error('[ErrorBoundary] onError handler threw:', cbErr);
      }
    }

    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('app:error', { detail: { error, errorInfo } }));
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
  };

  handleReload = () => {
    if (typeof window !== 'undefined') window.location.reload();
  };

  handleCopy = async () => {
    const { error, errorInfo } = this.state;
    const text = [
      `Cabaxx — Error report`,
      `Time: ${new Date().toISOString()}`,
      `URL: ${typeof window !== 'undefined' ? window.location.href : 'n/a'}`,
      `UserAgent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'n/a'}`,
      `Message: ${error?.message || 'unknown'}`,
      `Stack: ${error?.stack || 'n/a'}`,
      `Component stack: ${errorInfo?.componentStack || 'n/a'}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (e) {
      console.error('Clipboard write failed:', e);
    }
  };

  toggleDetails = () => {
    this.setState((s) => ({ showDetails: !s.showDetails }));
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const { error, errorInfo, showDetails, copied } = this.state;
    const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;

    return (
      <div
        role="alert"
        aria-live="assertive"
        className="flex min-h-screen flex-col bg-black text-text-primary"
      >
        <header className="border-b border-white/10 bg-[#0a0a0a] px-6 py-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link
              to={ROUTES.HOME}
              onClick={this.handleReset}
              className="font-display text-xl uppercase tracking-wide text-accent transition hover:text-accent/80"
            >
              Cabaxx
            </Link>
            <span className="rounded-full bg-red-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">
              Error
            </span>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-12">
          <div className="w-full max-w-xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-red-400">
              Algo salió mal
            </p>
            <h1 className="mt-3 font-display text-3xl uppercase text-text-primary sm:text-4xl">
              No pudimos cargar esta sección
            </h1>
            <p className="mt-3 text-sm text-text-muted">
              Hubo un error inesperado. Ya registramos el incidente. Podés intentar
              recargar la página o volver al inicio.
            </p>

            <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 font-mono text-xs text-red-300">
              {error?.message || 'Error desconocido'}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(229,9,20,0.3)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black"
              >
                <RefreshCw className="h-4 w-4" />
                Recargar página
              </button>

              <Link
                to={ROUTES.HOME}
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black"
              >
                <Home className="h-4 w-4" />
                Ir al inicio
              </Link>

              <button
                type="button"
                onClick={this.handleCopy}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black"
              >
                <Bug className="h-4 w-4" />
                {copied ? 'Copiado' : 'Copiar reporte'}
              </button>
            </div>

            {(isDev || showDetails) && (
              <div className="mt-8 text-left">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text-primary"
                >
                  {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  Detalles técnicos
                </button>
                {showDetails && (
                  <pre className="mt-3 max-h-80 overflow-auto rounded-lg border border-white/10 bg-[#0a0a0a] p-4 text-left font-mono text-[11px] leading-relaxed text-red-200">
{error?.stack}
{'\n\n--- Component stack ---\n'}
{errorInfo?.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </main>

        <footer className="border-t border-white/10 bg-[#0a0a0a] px-6 py-3 text-center text-xs text-text-muted">
          Hecho en Bogotá D.C., Colombia · Cabaxx
        </footer>
      </div>
    );
  }
}
