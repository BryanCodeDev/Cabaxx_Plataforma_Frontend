import Spinner from './Spinner';

/**
 * Spinner de página completa — centra el indicador verticalmente.
 */
export default function PageSpinner({ size = 'lg', label, className = '' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label || 'Cargando'}
      className={`flex min-h-[50vh] flex-col items-center justify-center gap-3 py-12 ${className}`}
    >
      <Spinner size={size} color="accent" />
      {label && <p className="text-xs uppercase tracking-[0.2em] text-text-muted">{label}</p>}
    </div>
  );
}